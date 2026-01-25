/**
 * Modal Component
 *
 * A flexible modal/dialog component with overlay, header, body, and footer.
 */

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BaseModalProps } from '@/types/ui';
import './Modal.css';

/**
 * Modal component
 */
export const Modal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className = '',
  overlayClassName = '',
  footer,
  headerActions,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    // Store previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus modal
    const modal = modalRef.current;
    if (modal) {
      // Focus first focusable element
      const focusableElements = modal.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      // Restore body scroll
      document.body.style.overflow = '';

      // Restore focus to previous element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className={`modal-overlay ${overlayClassName}`}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        className={`modal modal-${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton || headerActions) && (
          <div className="modal-header">
            {title && (
              <h2 id="modal-title" className="modal-title">
                {title}
              </h2>
            )}
            <div className="modal-actions">
              {headerActions && <div className="modal-header-actions">{headerActions}</div>}
              {showCloseButton && (
                <button
                  type="button"
                  className="modal-close"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="modal-body">{children}</div>

        {/* Footer */}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

/**
 * Modal Header component
 */
export interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ children, className = '' }) => {
  return <div className={`modal-header ${className}`}>{children}</div>;
};

/**
 * Modal Body component
 */
export interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalBody: React.FC<ModalBodyProps> = ({ children, className = '' }) => {
  return <div className={`modal-body ${className}`}>{children}</div>;
};

/**
 * Modal Footer component
 */
export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ children, className = '' }) => {
  return <div className={`modal-footer ${className}`}>{children}</div>;
};

/**
 * Confirmation Dialog helper
 */
export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <ModalBody>
        <p className="confirm-message">{message}</p>
      </ModalBody>
      <ModalFooter>
        <div className="confirm-actions">
          <button
            type="button"
            className={`btn btn-${variant === 'danger' ? 'secondary' : variant}`}
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn btn-${variant === 'info' ? 'primary' : variant}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default Modal;
