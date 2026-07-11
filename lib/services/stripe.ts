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
