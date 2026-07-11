import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceSupabaseClient } from '@/lib/config/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  const rawBody = await request.text();

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? '',
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook signature verification failed.' },
      { status: 400 },
    );
  }

  const supabase = createServiceSupabaseClient();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const subscriptionId = session.subscription as string | undefined;
    const stripeCustomerId =
      typeof session.customer === 'string'
        ? session.customer
        : session.customer?.id;

    console.log('webhook checkout.session.completed', {
      userId,
      subscriptionId,
      stripeCustomerId,
      session,
    });

    const parseStripeTimestamp = (
      value: number | string | Date | null | undefined,
    ) => {
      if (typeof value === 'number') {
        return new Date(value * 1000).toISOString();
      }

      if (typeof value === 'string' && /^\d+$/.test(value)) {
        return new Date(Number(value) * 1000).toISOString();
      }

      if (value instanceof Date) {
        return value.toISOString();
      }

      if (typeof value === 'string') {
        const parsedDate = new Date(value);
        return Number.isNaN(parsedDate.getTime())
          ? null
          : parsedDate.toISOString();
      }

      return null;
    };

    if (userId && stripeCustomerId) {
      const customer = await stripe.customers.retrieve(stripeCustomerId, {
        expand: ['invoice_settings.default_payment_method'],
      });

      let defaultPaymentMethod: string | null = null;
      const invoiceSettings = customer.invoice_settings?.default_payment_method;

      if (invoiceSettings) {
        defaultPaymentMethod =
          typeof invoiceSettings === 'string'
            ? invoiceSettings
            : invoiceSettings.id;
      }

      if (!defaultPaymentMethod && session.invoice) {
        const invoice = await stripe.invoices.retrieve(
          session.invoice as string,
          { expand: ['payment_intent.payment_method'] },
        );

        const paymentIntent = invoice.payment_intent;

        if (
          paymentIntent &&
          typeof paymentIntent !== 'string' &&
          paymentIntent.payment_method
        ) {
          defaultPaymentMethod =
            typeof paymentIntent.payment_method === 'string'
              ? paymentIntent.payment_method
              : paymentIntent.payment_method.id;
        }
      }

      const { error: customerError } = await supabase
        .from('stripe_customers')
        .upsert(
          {
            user_id: userId,
            stripe_customer_id: stripeCustomerId,
            default_payment_method: defaultPaymentMethod,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: ['user_id'] },
        );

      if (customerError) {
        console.error('Supabase stripe_customers upsert error', customerError);
      }
    }

    if (userId && subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: [
          'items.data.price',
          'latest_invoice.payment_intent.payment_method',
        ],
      });

      let priceId =
        subscription.items.data[0]?.price?.id ??
        session.display_items?.[0]?.price?.id ??
        'unknown';

      let currentPeriodStart = parseStripeTimestamp(
        subscription.current_period_start,
      );
      let currentPeriodEnd = parseStripeTimestamp(
        subscription.current_period_end,
      );
      let cancelAtPeriodEnd = subscription.cancel_at_period_end;

      if (!currentPeriodStart || !currentPeriodEnd) {
        const invoiceId = session.invoice as string | undefined;
        if (invoiceId) {
          const invoice = await stripe.invoices.retrieve(invoiceId, {
            expand: ['payment_intent.payment_method'],
          });
          priceId =
            priceId !== 'unknown'
              ? priceId
              : (invoice.lines.data[0]?.price?.id ?? 'unknown');
          currentPeriodStart =
            parseStripeTimestamp(
              invoice.lines.data[0]?.period?.start ?? invoice.period_start,
            ) ?? currentPeriodStart;
          currentPeriodEnd =
            parseStripeTimestamp(
              invoice.lines.data[0]?.period?.end ?? invoice.period_end,
            ) ?? currentPeriodEnd;
          cancelAtPeriodEnd = invoice.subscription
            ? cancelAtPeriodEnd
            : cancelAtPeriodEnd;
        }
      }

      const status =
        subscription.status === 'active'
          ? 'pro'
          : subscription.status === 'past_due'
            ? 'past_due'
            : 'cancelled';

      const { data, error } = await supabase.from('subscriptions').upsert(
        {
          user_id: userId,
          stripe_subscription_id: subscription.id,
          price_id: priceId,
          status,
          plan: 'pro',
          current_period_start: currentPeriodStart,
          current_period_end: currentPeriodEnd,
          cancel_at_period_end: cancelAtPeriodEnd,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'stripe_subscription_id' },
      );

      if (error) {
        console.error('Supabase subscriptions upsert error', error);
      } else {
        console.log('Supabase subscriptions upsert result', data);
      }
    }
  }

  return NextResponse.json({ received: true });
}
