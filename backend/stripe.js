import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;

//stripe listen --forward-to localhost:4000/api/user/webhook