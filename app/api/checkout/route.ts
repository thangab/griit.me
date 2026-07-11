import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from '@/lib/config/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');

export async function POST(request: Request) {
  const body = await request.json();
  const { priceId } = body;

  if (!priceId) {
    return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return NextResponse.json(
      { error: 'Authentication required.' },
      { status: 401 },
    );
  }

  const user = userData.user;

  if (!user.email) {
    return NextResponse.json(
      { error: 'User email is required.' },
      { status: 400 },
    );
  }

  const customerEmail = user.email;
  const customerId = user.id;
  const serviceSupabase = createServiceSupabaseClient();

  const { data: existingCustomer } = await serviceSupabase
    .from('stripe_customers')
    .select('stripe_customer_id')
    .eq('user_id', customerId)
    .limit(1)
    .single();

  let stripeCustomerId = existingCustomer?.stripe_customer_id;

  try {
    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: customerEmail,
        metadata: { user_id: customerId },
      });

      stripeCustomerId = stripeCustomer.id;

      await serviceSupabase.from('stripe_customers').upsert(
        {
          user_id: customerId,
          stripe_customer_id: stripeCustomerId,
          default_payment_method: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: ['stripe_customer_id'] },
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer: stripeCustomerId,
      metadata: {
        user_id: customerId,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/dashboard`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('Stripe checkout error', error);
    return NextResponse.json(
      { error: 'Unable to create Stripe checkout session.' },
      { status: 500 },
    );
  }
}
