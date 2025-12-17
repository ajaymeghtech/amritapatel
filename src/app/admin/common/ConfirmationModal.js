'use client';

import React, { useState, useEffect } from 'react';
import styles from './ConfirmationModal.module.css';

const ConfirmationModal = ({
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  type = "danger" 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
          iconColor: "#ef4444",
          buttonColor: "#ef4444",
          iconBg: "#fef2f2",
          borderColor: "#fecaca"
        };
      case "warning":
        return {
          icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
          iconColor: "#f59e0b",
          buttonColor: "#f59e0b",
          iconBg: "#fffbeb",
          borderColor: "#fed7aa"
        };
      default:
        return {
          icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
          iconColor: "#3b82f6",
          buttonColor: "#3b82f6",
          iconBg: "#eff6ff",
          borderColor: "#bfdbfe"
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className={styles.confirmationModalOverlay} onClick={onClose}>
      <div className={styles.confirmationModalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.confirmationModalContent}>
          <div className={styles.confirmationModalIcon} style={{ backgroundColor: typeStyles.iconBg, borderColor: typeStyles.borderColor }}>
            <svg className={styles.confirmationModalIconSvg} style={{ color: typeStyles.iconColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={typeStyles.icon} />
            </svg>
          </div>

          <div className={styles.confirmationModalText}>
            <h3 className={styles.confirmationModalTitle}>{title}</h3>
            <p className={styles.confirmationModalMessage}>{message}</p>
          </div>
        </div>

        <div className={styles.confirmationModalActions}>
          <button
            onClick={onClose}
            className={styles.confirmationModalCancelBtn}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={styles.confirmationModalConfirmBtn}
            style={{ backgroundColor: typeStyles.buttonColor }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

