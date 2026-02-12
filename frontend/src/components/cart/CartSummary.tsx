import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import "./CartSummary.css";

export function CartSummary() {
  const { t } = useTranslation();
  const { cartTotals } = useCart();
  const { subtotal, tax, shipping, total } = cartTotals;

  return (
    <div className="cart-summary">
      <div className="summary-row">
        <span>{t("cart.subtotal")}</span>
        <span>€{subtotal.toFixed(2)}</span>
      </div>
      <div className="summary-row">
        <span>{t("cart.tax")}</span>
        <span>€{tax.toFixed(2)}</span>
      </div>
      <div className="summary-row">
        <span>{t("cart.shipping")}</span>
        <span>€{shipping.toFixed(2)}</span>
      </div>
      <div className="summary-row total">
        <span>{t("cart.total")}</span>
        <span>€{total.toFixed(2)}</span>
      </div>
      <button className="checkout-button">{t("cart.checkout")}</button>
      <Link to="/marketplace" className="continue-shopping">
        {t("cart.continueShopping")}
      </Link>
    </div>
  );
}
