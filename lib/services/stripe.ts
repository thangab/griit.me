import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');

function formatStripePrice(price: Stripe.Price) {
  const amount =
    price.unit_amount ??
    (price.unit_amount_decimal ? Number(price.unit_amount_decimal) : null);
  if (amount === null) {
    return 'Custom price';
  }

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount / 100);

  if (price.recurring?.interval) {
    return `${formatted} / ${price.recurring.interval}`;
  }

  return formatted;
}

export async function getStripePriceLabel(priceId: string) {
  if (!priceId) {
    return null;
  }

  const price = await stripe.prices.retrieve(priceId);
  return formatStripePrice(price);
}

export async function cancelStripeSubscription(subscriptionId: string) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe is not configured. The subscription was not cancelled.');
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  if (subscription.status !== 'canceled') {
    await stripe.subscriptions.cancel(subscriptionId);
  }
}

export async function deleteStripeCustomer(customerId: string) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe is not configured. The customer was not deleted.');
  }

  const customer = await stripe.customers.retrieve(customerId);
  if (!customer.deleted) await stripe.customers.del(customerId);
}
