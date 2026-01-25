/**
 * UI Component Type Definitions
 *
 * Type definitions for all UI components in the application.
 * These types ensure type safety across the component layer.
 */

import { ReactNode, CSSProperties } from 'react';

// ============================================================================
// BASE COMPONENT TYPES
// ============================================================================

/**
 * Common button variants
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'ghost'
  | 'link';

/**
 * Common button sizes
 */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Base button props interface
 */
export interface BaseButtonProps {
  /**
   * Button content
   */
  children: ReactNode;

  /**
   * Button variant/style
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Disable the button
   * @default false
   */
  disabled?: boolean;

  /**
   * Show loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Make button full width of container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Button click handler
   */
  onClick?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Accessibility label
   */
  ariaLabel?: string;

  /**
   * Button type attribute
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Icon element to display
   */
  icon?: ReactNode;

  /**
   * Icon position
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
}

/**
 * Modal props interface
 */
export interface BaseModalProps {
  /**
   * Modal visibility
   */
  isOpen: boolean;

  /**
   * Close modal handler
   */
  onClose: () => void;

  /**
   * Modal title
   */
  title?: string;

  /**
   * Modal content
   */
  children: ReactNode;

  /**
   * Modal size
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * Show close button
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Close on overlay click
   * @default true
   */
  closeOnOverlayClick?: boolean;

  /**
   * Close on ESC key
   * @default true
   */
  closeOnEsc?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Overlay CSS classes
   */
  overlayClassName?: string;

  /**
   * Footer content
   */
  footer?: ReactNode;

  /**
   * Header actions (right side of header)
   */
  headerActions?: ReactNode;
}

/**
 * Card component props
 */
export interface BaseCardProps {
  /**
   * Card content
   */
  children: ReactNode;

  /**
   * Card title
   */
  title?: ReactNode;

  /**
   * Card subtitle
   */
  subtitle?: ReactNode;

  /**
   * Card footer
   */
  footer?: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Hover effect
   * @default false
   */
  hoverable?: boolean;

  /**
   * Card variant
   * @default 'default'
   */
  variant?: 'default' | 'bordered' | 'shadow' | 'flat';

  /**
   * On click handler (makes card clickable)
   */
  onClick?: () => void;

  /**
   * Accessibility label
   */
  ariaLabel?: string;
}

// ============================================================================
// GAME COMPONENT TYPES
// ============================================================================

/**
 * PathWordle component props
 */
export interface PathWordleProps {
  /**
   * Game mode
   * @default 'daily'
   */
  gameMode?: 'daily' | 'practice';

  /**
   * Game difficulty
   * @default 'medium'
   */
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
}

/**
 * Grid component props
 */
export interface GridProps {
  /**
   * Game grid
   */
  grid: import('./game').GridCell[][];

  /**
   * Cell click handler
   */
  onCellClick: (row: number, col: number) => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Grid size (for responsive layouts)
   * @default 6
   */
  size?: number;
}

/**
 * Guess history component props
 */
export interface GuessHistoryProps {
  /**
   * List of guesses
   */
  guesses: import('./game').GuessResult[];

  /**
   * Maximum number of guesses to display
   * @default 6
   */
  maxGuesses?: number;

  /**
   * Compact mode (for mobile)
   * @default false
   */
  compact?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Game controls component props
 */
export interface GameControlsProps {
  /**
   * Whether submit is enabled
   */
  canSubmit: boolean;

  /**
   * Current path length
   */
  currentPathLength: number;

  /**
   * Required path length
   * @default 5
   */
  requiredPathLength?: number;

  /**
   * Submit handler
   */
  onSubmit: () => void;

  /**
   * Clear handler
   */
  onClear: () => void;

  /**
   * Reset handler
   */
  onReset?: () => void;

  /**
   * Attempts left
   */
  attemptsLeft: number;

  /**
   * Maximum attempts
   * @default 6
   */
  maxAttempts?: number;

  /**
   * Additional CSS classes
   */
  className?: boolean;

  /**
   * Compact mode (for mobile)
   * @default false
   */
  compact?: boolean;
}

/**
 * Game result component props
 */
export interface GameResultProps {
  /**
   * Game outcome
   */
  gameStatus: 'won' | 'lost';

  /**
   * Target word
   */
  targetWord: string;

  /**
   * Number of attempts used
   */
  attemptsUsed: number;

  /**
   * Reset handler
   */
  onReset: () => void;

  /**
   * Game mode
   */
  gameMode: 'daily' | 'practice';

  /**
   * Game difficulty
   */
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';

  /**
   * Time taken in seconds
   */
  timeTaken: number;

  /**
   * Game score
   */
  score: number;

  /**
   * Number of hints used
   */
  hintsUsed: number;

  /**
   * Maximum streak
   */
  maxStreak: number;

  /**
   * Share result handler
   */
  onShare?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}

// ============================================================================
// UTILITY COMPONENT TYPES
// ============================================================================

/**
 * Statistics panel props
 */
export interface StatisticsProps {
  /**
   * Show detailed statistics
   * @default false
   */
  showDetailed?: boolean;

  /**
   * Compact mode
   * @default false
   */
  compact?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Hint panel props
 */
export interface HintPanelProps {
  /**
   * Game grid
   */
  grid: import('./game').GridCell[][];

  /**
   * Current path
   */
  currentPath: import('./game').GridCell[];

  /**
   * Game difficulty
   */
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';

  /**
   * Target word
   */
  targetWord: string;

  /**
   * Panel visibility
   */
  isVisible: boolean;

  /**
   * Close handler
   */
  onClose: () => void;

  /**
   * Compact mode
   * @default false
   */
  compact?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Theme selector props
 */
export interface ThemeSelectorProps {
  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Compact mode
   * @default false
   */
  compact?: boolean;
}

/**
 * Achievement notification props
 */
export interface AchievementNotificationProps {
  /**
   * Achievement data
   */
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: string;
  } | null;

  /**
   * Close handler
   */
  onClose: () => void;

  /**
   * Auto-hide delay in ms
   * @default 5000
   */
  autoHideDelay?: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}

// ============================================================================
// LAYOUT TYPES
// ============================================================================

/**
 * Screen size breakpoints
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Responsive value
 */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

/**
 * Container props
 */
export interface ContainerProps {
  /**
   * Container content
   */
  children: ReactNode;

  /**
   * Maximum width
   * @default 'lg'
   */
  maxWidth?: Breakpoint;

  /**
   * Center content
   * @default true
   */
  centered?: boolean;

  /**
   * Padding
   * @default true
   */
  padding?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

// ============================================================================
// FORM TYPES
// ============================================================================

/**
 * Input field types
 */
export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time';

/**
 * Base input props
 */
export interface BaseInputProps {
  /**
   * Input type
   * @default 'text'
   */
  type?: InputType;

  /**
   * Input name
   */
  name?: string;

  /**
   * Input value
   */
  value?: string | number;

  /**
   * Default value
   */
  defaultValue?: string | number;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Required field
   * @default false
   */
  required?: boolean;

  /**
   * Read-only field
   * @default false
   */
  readOnly?: boolean;

  /**
   * Error message
   */
  error?: string;

  /**
   * Helper text
   */
  helperText?: string;

  /**
   * Label
   */
  label?: string;

  /**
   * Change handler
   */
  onChange?: (value: string) => void;

  /**
   * Focus handler
   */
  onFocus?: () => void;

  /**
   * Blur handler
   */
  onBlur?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Accessibility label
   */
  ariaLabel?: string;
}
