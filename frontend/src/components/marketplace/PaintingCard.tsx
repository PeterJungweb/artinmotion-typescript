import React, { useState } from "react";
import { useCart } from "../../hooks/useCart.js";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils/money.js";
import type { PaintingFromBackend } from "../../types/apiTypes.js";
import "./PaintingCard.css";

interface PaintingCardProps {
  painting: PaintingFromBackend;
}

export function PaintingCard({ painting }: PaintingCardProps) {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [showDetails, setShowDetails] = useState(false);

  const handleAddToCart = () => {
    addToCart(painting);
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
                {t("marketplace.painting.category")}: {painting.category}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
