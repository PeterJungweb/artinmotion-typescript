import type { Request, Response } from "express";
import { createPaymentIntent } from "../services/stripe.js";

export const createPaymentIntentController = async (req: Request, res: Response) => {
    try {
        const {amount} = req.body;

        // Todo: Validation!!

        const paymentIntent = await createPaymentIntent(amount);

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error){
        console.error('Payment intent creation failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create payment intent'
        });
    }
}