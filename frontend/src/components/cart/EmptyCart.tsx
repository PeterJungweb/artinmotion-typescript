
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import "./EmptyCart.css";

export function EmptyCart() {
  const { t } = useTranslation();

  return (
    <div className="empty-cart">
      <span className="material-icons cart-icon">shopping_cart</span>
      <p>{t("cart.emptyMessage")}</p>
      <Link to="/marketplace" className="continue-shopping-button">
        {t("cart.continueShopping")}
      </Link>
    </div>
  );
}
