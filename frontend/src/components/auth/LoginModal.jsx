import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../contexts/AuthContext.jsx";
import Modal from "../ui/Modal.jsx";
import "./AuthModal.css"; // Should this no be called "LoginModal.css"?

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { t } = useTranslation();
  const { login, loading, error, clearError } = useAuthContext();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      setFormData({ email: "", password: "" });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({ email: "", password: "" });
    clearError();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("auth.login.title")}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="auth-form">
        {error && (
          <div className="auth-error">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">{t("auth.login.email")}</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={t("auth.login.emailPlaceholder")}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">{t("auth.login.password")}</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={t("auth.login.passwordPlaceholder")}
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={loading || !formData.email || !formData.password}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              {t("auth.login.loggingIn")}
            </>
          ) : (
            t("auth.login.submit")
          )}
        </button>

        <div className="auth-switch">
          <p>
            {t("auth.login.noAccount")}{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="auth-switch-btn"
              disabled={loading}
            >
              {t("auth.login.signUp")}
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;
