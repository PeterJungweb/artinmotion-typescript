import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../contexts/AuthContext.js";
import Modal from "../ui/Modal.js";
import "./AuthModal.css";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}: RegisterModalProps) => {
  const { t } = useTranslation();
  const { register, loading, error, clearError } = useAuthContext();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [showPassword, setShowPassword] = useState(false); // ✅ Password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // ✅ Confirm password visibility

  // ✅ Password validation function
  const validatePassword = (password: string) => {
    const errors = [];
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    if (!checks.length) errors.push(t("auth.register.errors.passwordLength"));
    if (!checks.uppercase)
      errors.push(t("auth.register.errors.passwordUppercase"));
    if (!checks.lowercase)
      errors.push(t("auth.register.errors.passwordLowercase"));
    if (!checks.number) errors.push(t("auth.register.errors.passwordNumber"));
    if (!checks.special) errors.push(t("auth.register.errors.passwordSpecial"));

    return { isValid: errors.length === 0, errors, checks };
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = t("auth.register.errors.nameRequired");
    }

    if (!formData.email.trim()) {
      errors.email = t("auth.register.errors.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t("auth.register.errors.emailInvalid");
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0]; // Show first error
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t("auth.register.errors.passwordMismatch");
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation errors for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear global error when user starts typing
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await register({
      fullName: formData.fullName.trim(),
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
    });

    if (result.success) {
      // Reset form and close modal
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setValidationErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
    setValidationErrors({});
    clearError();
    onClose();
  };

  const passwordValidation = validatePassword(formData.password);
  const isFormValid =
    formData.fullName &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    Object.keys(validationErrors).length === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("auth.register.title")}
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
          <label htmlFor="fullName">{t("auth.register.fullName")}</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder={t("auth.register.fullNamePlaceholder")}
            required
            disabled={loading}
          />
          {validationErrors.fullName && (
            <span className="field-error">{validationErrors.fullName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">{t("auth.register.email")}</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={t("auth.register.emailPlaceholder")}
            required
            disabled={loading}
          />
          {validationErrors.email && (
            <span className="field-error">{validationErrors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">{t("auth.register.password")}</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={t("auth.register.passwordPlaceholder")}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>

          {/* ✅ Password strength indicator */}
          {formData.password && (
            <div className="password-requirements">
              <div className="requirement-item">
                <span
                  className={
                    passwordValidation.checks.length ? "valid" : "invalid"
                  }
                >
                  {passwordValidation.checks.length ? "✅" : "❌"}
                </span>
                <span>{t("auth.register.requirements.length")}</span>
              </div>
              <div className="requirement-item">
                <span
                  className={
                    passwordValidation.checks.uppercase ? "valid" : "invalid"
                  }
                >
                  {passwordValidation.checks.uppercase ? "✅" : "❌"}
                </span>
                <span>{t("auth.register.requirements.uppercase")}</span>
              </div>
              <div className="requirement-item">
                <span
                  className={
                    passwordValidation.checks.lowercase ? "valid" : "invalid"
                  }
                >
                  {passwordValidation.checks.lowercase ? "✅" : "❌"}
                </span>
                <span>{t("auth.register.requirements.lowercase")}</span>
              </div>
              <div className="requirement-item">
                <span
                  className={
                    passwordValidation.checks.number ? "valid" : "invalid"
                  }
                >
                  {passwordValidation.checks.number ? "✅" : "❌"}
                </span>
                <span>{t("auth.register.requirements.number")}</span>
              </div>
              <div className="requirement-item">
                <span
                  className={
                    passwordValidation.checks.special ? "valid" : "invalid"
                  }
                >
                  {passwordValidation.checks.special ? "✅" : "❌"}
                </span>
                <span>{t("auth.register.requirements.special")}</span>
              </div>
            </div>
          )}

          {validationErrors.password && (
            <span className="field-error">{validationErrors.password}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">
            {t("auth.register.confirmPassword")}
          </label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder={t("auth.register.confirmPasswordPlaceholder")}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              {showConfirmPassword ? "👁️" : "🙈"}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <span className="field-error">
              {validationErrors.confirmPassword}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={loading || !isFormValid}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              {t("auth.register.registering")}
            </>
          ) : (
            t("auth.register.submit")
          )}
        </button>

        <div className="auth-switch">
          <p>
            {t("auth.register.hasAccount")}{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="auth-switch-btn"
              disabled={loading}
            >
              {t("auth.register.signIn")}
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default RegisterModal;
