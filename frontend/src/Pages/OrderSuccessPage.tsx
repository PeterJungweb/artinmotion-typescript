import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./OrderSuccessPage.css";

export function OrderSuccessPage() {
  const { t } = useTranslation();

  return (
    <div className="order-success">
      <div className="success-container">
        <div className="success-icon">🎉</div>
        <h1 className="success-title">{t("cart.success.title")}</h1>
        <p className="success-message">{t("cart.success.message")}</p>
        <p className="success-subdescription">
          {t("cart.success.description")}
        </p>

        <div className="order-details">
          <h4>{t("cart.success.whatsNext")}</h4>
          <p>• {t("cart.success.emailConfirmation")}</p>
          <p>• {t("cart.success.preparation")}</p>
          <p>• {t("cart.success.notification")}</p>
        </div>

        <div className="success-actions">
          <Link to="/marketplace" className="success-button primary">
            {t("cart.success.continueShopping")}
          </Link>
          <Link to="/" className="success-button secondary">
            {t("cart.success.backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
