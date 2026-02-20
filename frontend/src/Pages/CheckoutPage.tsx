import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { CartSummary } from "../components/cart/CartSummary";
import stripePromise from "../config/stripe";
import "./CheckoutPage.css";

export function CheckoutPage() {
    return (
    <div className="checkout-page">
        <div className="checkout-container">
            <div className="checkout-left">
                <h1>Checkout</h1>
                <Elements stripe={stripePromise}>
                    {/* Payment will go here */}
                    <div>Payment form coming next!</div>
                </Elements>
            </div>
            <div className="checkout-right">
                <CartSummary />
            </div>
        </div>
    </div>
    );
}