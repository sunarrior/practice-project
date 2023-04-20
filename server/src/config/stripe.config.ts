import Stripe from "stripe";

import EnvConfig from "./env.config";

const stripe: Stripe = new Stripe(EnvConfig.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export default stripe;
