import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./OrderSuccessPage.css";

export function OrderSuccessPage() {
  const { t } = useTranslation();

  return (
    <div className="order-success">
      <h1>🎉 Payment Successful!</h1>
      <p>Thank you for your purchase!</p>
      <p>Your order has been confirmed.</p>
      <Link to="/marketplace">Continue Shopping</Link>
    </div>
  );
}
