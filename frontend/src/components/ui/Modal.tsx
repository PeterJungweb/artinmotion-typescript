import React, { useEffect } from "react";
import "./Modal.css";
import { Interface } from "readline";

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = "medium",
  closable = true,
}) => {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && closable) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, closable]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closable ? onClose : undefined}>
      <div
        className={`modal-content ${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="modal-header">
            <h2>{title}</h2>
            {closable && (
              <button
                className="modal-close"
                onClick={onClose}
                aria-label="Close modal"
              >
                ×
              </button>
            )}
          </div>
        )}

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
