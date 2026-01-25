/**
 * Button Component
 *
 * A reusable button component with support for multiple variants, sizes, and states.
 */

import React, { ButtonHTMLAttributes } from 'react';
import { BaseButtonProps, ButtonVariant, ButtonSize } from '@/types/ui';
import './Button.css';

/**
 * Button component with variant and size support
 */
export const Button: React.FC<BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  ariaLabel,
  type = 'button',
  icon,
  iconPosition = 'left',
  ...rest
}) => {
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full-width',
    disabled && 'btn-disabled',
    loading && 'btn-loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...rest}
    >
      {loading && (
        <span className="btn-spinner" aria-hidden="true">
          <svg
            className="btn-spinner-svg"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="btn-spinner-circle"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="btn-spinner-path"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}

      {icon && iconPosition === 'left' && (
        <span className="btn-icon btn-icon-left" aria-hidden="true">
          {icon}
        </span>
      )}

      <span className="btn-content">{children}</span>

      {icon && iconPosition === 'right' && (
        <span className="btn-icon btn-icon-right" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
};

/**
 * Button group for organizing related buttons
 */
export interface ButtonGroupProps {
  /**
   * Buttons to render
   */
  children: React.ReactNode;

  /**
   * Group orientation
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Gap between buttons
   * @default 'sm'
   */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  className = '',
  gap = 'sm',
}) => {
  const groupClasses = [
    'btn-group',
    `btn-group-${orientation}`,
    `btn-group-gap-${gap}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={groupClasses}>{children}</div>;
};

/**
 * Button toolbar for organizing button groups
 */
export interface ButtonToolbarProps {
  /**
   * Button groups to render
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

export const ButtonToolbar: React.FC<ButtonToolbarProps> = ({
  children,
  className = '',
}) => {
  return <div className={`btn-toolbar ${className}`}>{children}</div>;
};

export default Button;
