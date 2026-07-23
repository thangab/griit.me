import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import Stripe from 'stripe';
import { getPublicProfileCacheTag } from '@/lib/cache/profile-cache';
import { createServiceSupabaseClient } from '@/lib/config/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');

function toIsoDate(timestamp?: number | null) {
  return timestamp ? new Date(timestamp * 1000).toISOString() : null;
}

function getCustomerId(customer: Stripe.Subscription['customer']) {
  return typeof customer === 'string' ? customer : customer.id;
}

function getPaymentMethodId(
  paymentMethod: Stripe.Subscription['default_payment_method'],
) {
  if (!paymentMethod) {
    return null;
  }

  return typeof paymentMethod === 'string' ? paymentMethod : paymentMethod.id;
}

function mapSubscriptionStatus(status: Stripe.Subscription.Status) {
  if (status === 'active' || status === 'trialing') {
    return 'pro';
  }

  if (status === 'past_due' || status === 'unpaid') {
    return 'past_due';
  }

  return 'cancelled';
}

async function upsertSubscription(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.user_id;
  const item = subscription.items.data[0];

  if (!userId || !item) {
    return;
  }

  const supabase = createServiceSupabaseClient();
  const now = new Date().toISOString();
  const status = mapSubscriptionStatus(subscription.status);

  await supabase.from('stripe_customers').upsert(
    {
      user_id: userId,
      stripe_customer_id: getCustomerId(subscription.customer),
      default_payment_method: getPaymentMethodId(
        subscription.default_payment_method,
      ),
      updated_at: now,
    },
    { onConflict: 'user_id' },
  );

  const { error } = await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscription.id,
      price_id: item.price.id,
      status,
      plan: 'pro',
      current_period_start: toIsoDate(item.current_period_start),
      current_period_end: toIsoDate(item.current_period_end),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: now,
    },
    { onConflict: 'stripe_subscription_id' },
  );

  if (error) {
    console.error('Failed to upsert Stripe subscription:', error.message);
    return;
  }

  const { data: profiles, error: brandingError } = await supabase
    .from('public_profiles')
    .update({ show_branding: status !== 'pro' })
    .eq('user_id', userId)
    .select('username');

  if (brandingError) {
    console.error('Failed to sync profile branding:', brandingError.message);
    return;
  }

  for (const profile of profiles ?? []) {
    revalidateTag(getPublicProfileCacheTag(profile.username), { expire: 0 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (!session.subscription || typeof session.subscription !== 'string') {
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription,
    {
      expand: ['default_payment_method'],
    },
  );

  if (!subscription.metadata.user_id && session.metadata?.user_id) {
    await stripe.subscriptions.update(subscription.id, {
      metadata: { user_id: session.metadata.user_id },
    });

    subscription.metadata.user_id = session.metadata.user_id;
  }

  await upsertSubscription(subscription);
}

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? '',
    );
  } catch {
    return NextResponse.json(
      { error: 'Webhook signature verification failed.' },
      { status: 400 },
    );
  }

  if (event.type === 'checkout.session.completed') {
    await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
  }

  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    await upsertSubscription(event.data.object as Stripe.Subscription);
  }

  return NextResponse.json({ received: true });
}
