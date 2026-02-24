import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCart } from "../../hooks/useCart";
import { useTranslation } from "react-i18next";

import "./PaymentForm.css";

interface CustomerInfo {
  email: string;
  name: string;
}

interface PaymentFormProps {
  clientSecret: string;
}
export function PaymentForm({ clientSecret }: PaymentFormProps) {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const { cartTotals, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    email: "",
    name: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Step 01: submit form to validate and prepare payment
      const { error: submitError } = await elements.submit();
      if (submitError) {
        return submitError;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/order-success`,
        },
      });

      if (!error) {
        clearCart();
      }
    } catch (error) {
      console.error("Payment failed: ", error);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="customer-info">
        <input
          type="email"
          placeholder={t("cart.payment.emailPlaceholder")}
          value={customerInfo.email}
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, email: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder={t("cart.payment.fullNamePlaceholder")}
          value={customerInfo.name}
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, name: e.target.value })
          }
          required
        />
      </div>
      <PaymentElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading
          ? t("cart.payment.processing")
          : t("cart.payment.payButton", {
              amount: cartTotals.total.toFixed(2),
            })}
      </button>
    </form>
  );
}
