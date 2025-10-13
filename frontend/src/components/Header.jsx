import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuthContext } from "../contexts/AuthContext.jsx";
import LoginModal from "./auth/LoginModal.jsx";
import RegisterModal from "./auth/RegisterModal.jsx";
import "./Header.css";

export default function Header() {
  const { t, i18n } = useTranslation();
  const { cartItems } = useCart();
  const { user, isAuthenticated, logout } = useAuthContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "de" : "en";
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo-link">
          <div className="logo">
            <h1>{t("header.title")}</h1>
          </div>
        </Link>

        <nav className="nav">
          <button onClick={toggleLanguage} className="lang-button">
            {i18n.language === "en" ? "🇩🇪 DE" : "🇺🇸 EN"}
          </button>

          <div className="auth-section">
            {isAuthenticated ? (
              <div className="user-menu">
                <span className="welcome-text">
                  {t("header.welcome")}, {user?.fullName || user?.email}
                </span>
                <button onClick={handleLogout} className="logout-button">
                  {t("header.logout")}
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="login-button"
                >
                  {t("header.login")}
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="register-button"
                >
                  {t("header.register")}
                </button>
              </div>
            )}
          </div>
          <Link to="/cart" className="cart-link">
            <button className="cart-icon">
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
              🛒
            </button>
          </Link>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </nav>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </header>
  );
}
