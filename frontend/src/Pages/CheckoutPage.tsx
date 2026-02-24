import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { CartSummary } from "../components/cart/CartSummary";
import stripePromise from "../config/stripe";
import "./CheckoutPage.css";
import { PaymentForm } from "../components/checkout/PaymentForm";
import { useCart } from "../hooks/useCart";
import { paymentsApi } from "../services/api";

import "./CheckoutPage.css";

export function CheckoutPage() {
  const { cartTotals } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { clientSecret } = await paymentsApi.createPaymentIntent(
          cartTotals.total,
        );
        setClientSecret(clientSecret);
      } catch (error) {
        console.error("Failed to create Payment intent:", error);
      } finally {
        setLoading(false);
      }
    };

    if (cartTotals.total > 0) {
      createPaymentIntent();
    } else {
      setLoading(false);
    }
  }, [cartTotals.total]);

  if (loading) {
    return <div>Übersetzung füs lade...</div>;
  }

  if (!clientSecret) {
    return <div>Übersetzung error loading payment form</div>;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-left">
          <h1>Checkout</h1>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm clientSecret={clientSecret} />
          </Elements>
        </div>
        <div className="checkout-right">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
