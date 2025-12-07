import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import EmptyCart from "../components/cart/EmptyCart";
import { useCart } from "../hooks/useCart";
import "./CartPage.css";

export default function CartPage() {
  const { t } = useTranslation();
  const { cartItems } = useCart();

  return (
    <>
      <Header />
      <div className="cart-page">
        <div className="cart-container">
          <h1>{t("cart.title")}</h1>

          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              <div className="summary-container">
                <CartSummary />
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
