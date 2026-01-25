/**
 * Card Component
 *
 * A flexible card container component for grouping related content.
 */

import React from 'react';
import { BaseCardProps } from '@/types/ui';
import './Card.css';

/**
 * Card component
 */
export const Card: React.FC<BaseCardProps> = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  hoverable = false,
  variant = 'default',
  onClick,
  ariaLabel,
}) => {
  const cardClasses = [
    'card',
    `card-${variant}`,
    hoverable && 'card-hoverable',
    onClick && 'card-clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick && hoverable) {
      onClick();
    }
  };

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}

      <div className="card-body">{children}</div>

      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

/**
 * Card Header component
 */
export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return <div className={`card-header ${className}`}>{children}</div>;
};

/**
 * Card Body component
 */
export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return <div className={`card-body ${className}`}>{children}</div>;
};

/**
 * Card Footer component
 */
export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return <div className={`card-footer ${className}`}>{children}</div>;
};

/**
 * Card Title component
 */
export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = '',
  as = 'h3',
}) => {
  const Tag = as;
  return <Tag className={`card-title ${className}`}>{children}</Tag>;
};

/**
 * Card Subtitle component
 */
export interface CardSubtitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardSubtitle: React.FC<CardSubtitleProps> = ({ children, className = '' }) => {
  return <p className={`card-subtitle ${className}`}>{children}</p>;
};

/**
 * Card Image component
 */
export interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  top?: boolean;
  bottom?: boolean;
}

export const CardImage: React.FC<CardImageProps> = ({
  src,
  alt,
  className = '',
  top = false,
  bottom = false,
}) => {
  const imageClasses = [
    'card-img',
    top && 'card-img-top',
    bottom && 'card-img-bottom',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <img src={src} alt={alt} className={imageClasses} />;
};

/**
 * Card Grid for organizing multiple cards
 */
export interface CardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({
  children,
  columns = 3,
  gap = 'md',
  className = '',
}) => {
  const gridClasses = [
    'card-grid',
    `card-grid-${columns}`,
    `card-grid-gap-${gap}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={gridClasses}>{children}</div>;
};

export default Card;
