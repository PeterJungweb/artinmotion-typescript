import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Main Footer Content */}
        <div className="footer-main">
          <div className="footer-section">
            <h3 className="footer-title">{t("header.title")}</h3>
            <p className="footer-description">{t("footer.description")}</p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">{t("footer.navigation.title")}</h4>
            <div className="footer-links">
              <Link to="/" className="footer-link">
                {t("footer.navigation.home")}
              </Link>
              <Link to="/gallery" className="footer-link">
                {t("footer.navigation.gallery")}
              </Link>
              <Link to="/about" className="footer-link">
                {t("footer.navigation.about")}
              </Link>
              <Link to="/contact" className="footer-link">
                {t("footer.navigation.contact")}
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">{t("footer.account.title")}</h4>
            <div className="footer-links">
              <Link to="/cart" className="footer-link">
                {t("footer.account.cart")}
              </Link>
              <Link to="/orders" className="footer-link">
                {t("footer.account.orders")}
              </Link>
              <Link to="/profile" className="footer-link">
                {t("footer.account.profile")}
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">{t("footer.contact.title")}</h4>
            <div className="footer-contact">
              <p className="footer-contact-item">
                📧 {t("footer.contact.email")}
              </p>
              <p className="footer-contact-item">
                📞 {t("footer.contact.phone")}
              </p>
              <p className="footer-contact-item">
                📍 {t("footer.contact.address")}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>{t("footer.copyright")}</p>
          </div>
          <div className="footer-legal">
            <Link to="/privacy" className="footer-legal-link">
              {t("footer.legal.privacy")}
            </Link>
            <Link to="/terms" className="footer-legal-link">
              {t("footer.legal.terms")}
            </Link>
            <Link to="/imprint" className="footer-legal-link">
              {t("footer.legal.imprint")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
