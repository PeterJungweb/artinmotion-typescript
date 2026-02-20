import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover"
});

export const createPaymentIntent = async (
    amount: number,
    currency: string = "eur"
) => {
    return await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency,
        automatic_payment_methods: {enabled: true},
    });
};