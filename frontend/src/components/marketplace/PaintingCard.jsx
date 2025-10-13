import React, { useState } from "react";
import { useCart } from "../../hooks/useCart";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils/money.js";
import "./PaintingCard.css";

export default function PaintingCard({ painting }) {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [showDetails, setShowDetails] = useState(false);

  const handleAddToCart = () => {
    const cartItem = {
      id: painting.id,
      title: painting.title,
      price: painting.price,
      quantity: 1,
      image: painting.image_url || "/images/placeholder-image.jpg",
      available: painting.is_available,
    };
    addToCart(cartItem);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div
      className={`painting-card ${!painting.is_available ? "sold" : ""}`}
      data-category={painting.category}
    >
      <div className="painting-image">
        <img
          src={painting.image_url || "/images/placeholder-image.jpg"}
          alt={painting.title}
        />
        {!painting.is_available && (
          <div className="sold-overlay">
            <span>{t("marketplace.painting.sold")}</span>
          </div>
        )}
      </div>
      <div className="painting-info">
        <h3>{painting.title}</h3>
        <p>
          {t("marketplace.painting.price")}: {formatPrice(painting.price)}
        </p>

        {/* ✅ Fixed: Display Cart-Count with proper translation */}
        {painting.cart_count > 0 && (
          <p className="cart-interest">
            {painting.cart_count === 1
              ? t("marketplace.painting.interestedSingle")
              : t("marketplace.painting.interested", {
                  count: painting.cart_count,
                })}
          </p>
        )}

        <div className="painting-buttons">
          <button
            className="buy-button"
            disabled={!painting.is_available}
            onClick={handleAddToCart}
          >
            {t("marketplace.painting.addToCart")}
          </button>
          <button
            className={`view-details ${showDetails ? "active" : ""}`}
            onClick={toggleDetails}
          >
            {showDetails
              ? t("marketplace.painting.hideDetails")
              : t("marketplace.painting.viewDetails")}
          </button>
        </div>

        {showDetails && (
          <div className="painting-details show">
            <p>
              {painting.description ||
                t("marketplace.painting.defaultDescription")}
            </p>
            <ul>
              <li>
                {t("marketplace.painting.size")}: {painting.dimensions_width}" x{" "}
                {painting.dimensions_height}"
              </li>
              <li>
                {t("marketplace.painting.medium")}:{" "}
                {painting.medium || t("marketplace.painting.unknownMedium")}
              </li>
              <li>
                {t("marketplace.painting.year")}:{" "}
                {new Date(painting.completion_date).getFullYear() || "2024"}
              </li>
              <li>
                {t("marketplace.painting.category")}: {painting.category}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
