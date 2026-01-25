/**
 * Utility Function Type Definitions
 *
 * Type definitions for utility functions and helpers used throughout the application.
 */

import { GridCell, GuessResult } from './game';

// ============================================================================
// GAME LOGIC UTILITIES
// ============================================================================

/**
 * Feedback type for individual letters
 */
export type LetterFeedback = 'correct' | 'present' | 'absent';

/**
 * Word validation result
 */
export interface WordValidationResult {
  /**
   * Whether the word is valid
   */
  isValid: boolean;

  /**
   * Validation error message (if invalid)
   */
  error?: string;

  /**
   * Word length
   */
  length: number;

  /**
   * Whether word is in dictionary
   */
  isInDictionary: boolean;
}

/**
 * Path validation result
 */
export interface PathValidationResult {
  /**
   * Whether the path is valid
   */
  isValid: boolean;

  /**
   * Validation errors
   */
  errors: string[];

  /**
   * Path length
   */
  length: number;

  /**
   * Whether path forms a valid word
   */
  formsValidWord: boolean;

  /**
   * Formed word
   */
  word: string;
}

/**
 * Feedback calculation options
 */
export interface FeedbackCalculationOptions {
  /**
   * Case sensitive comparison
   * @default false
   */
  caseSensitive?: boolean;

  /**
   * Include position information
   * @default false
   */
  includePosition?: boolean;
}

/**
 * Feedback calculation result
 */
export interface FeedbackCalculationResult {
  /**
   * Feedback for each letter
   */
  feedback: LetterFeedback[];

  /**
   * Number of correct letters
   */
  correctCount: number;

  /**
   * Number of present letters
   */
  presentCount: number;

  /**
   * Number of absent letters
   */
  absentCount: number;

  /**
   * Percentage match
   */
  matchPercentage: number;
}

// ============================================================================
// GRID UTILITIES
// ============================================================================

/**
 * Grid creation options
 */
export interface GridCreationOptions {
  /**
   * Target word
   */
  targetWord: string;

  /**
   * Seed for random generation
   */
  seed?: string;

  /**
   * Grid size
   * @default 6
   */
  size?: number;

  /**
   * Ensure target word is creatable
   * @default true
   */
  ensureTargetCreatable?: boolean;
}

/**
 * Cell position
 */
export interface CellPosition {
  row: number;
  col: number;
}

/**
 * Adjacent cells result
 */
export interface AdjacentCellsResult {
  /**
   * Adjacent cell positions
   */
  positions: CellPosition[];

  /**
   * Number of adjacent cells
   */
  count: number;

  /**
   * Positions that are in bounds
   */
  inBounds: CellPosition[];

  /**
   * Positions that are out of bounds
   */
  outOfBounds: CellPosition[];
}

// ============================================================================
// WORD UTILITIES
// ============================================================================

/**
 * Word information
 */
export interface WordInfo {
  /**
   * The word
   */
  word: string;

  /**
   * Word length
   */
  length: number;

  /**
   * Whether word is valid
   */
  isValid: boolean;

  /**
   * Word definition (if available)
   */
  definition?: string;

  /**
   * Word frequency score
   */
  frequency?: number;

  /**
   * Difficulty level
   */
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
}

/**
 * Dictionary lookup result
 */
export interface DictionaryLookupResult {
  /**
   * Whether word was found
   */
  found: boolean;

  /**
   * Word information
   */
  wordInfo?: WordInfo;

  /**
   * Suggestions for similar words
   */
  suggestions?: string[];
}

/**
 * Word filter options
 */
export interface WordFilterOptions {
  /**
   * Minimum word length
   * @default 1
   */
  minLength?: number;

  /**
   * Maximum word length
   * @default Infinity
   */
  maxLength?: number;

  /**
   * Filter by starting letter
   */
  startsWith?: string;

  /**
   * Filter by ending letter
   */
  endsWith?: string;

  /**
   * Filter by containing letters
   */
  contains?: string;

  /**
   * Filter by pattern (regex)
   */
  pattern?: RegExp;

  /**
   * Exclude words
   */
  exclude?: string[];

  /**
   * Minimum frequency score
   */
  minFrequency?: number;
}

// ============================================================================
// STORAGE UTILITIES
// ============================================================================

/**
 * Storage key types
 */
export type StorageKey =
  | 'pathwordle-game'
  | 'pathwordle-statistics'
  | 'pathwordle-settings'
  | 'pathwordle-theme'
  | 'pathwordle-language'
  | 'pathwordle-achievements';

/**
 * Storage item metadata
 */
export interface StorageItemMetadata {
  /**
   * Storage key
   */
  key: StorageKey;

  /**
   * Item size in bytes
   */
  size: number;

  /**
   * Last modified timestamp
   */
  lastModified: string;

  /**
   * Item expiration time (optional)
   */
  expiresAt?: string;

  /**
   * Whether item is expired
   */
  isExpired: boolean;
}

/**
 * Storage options
 */
export interface StorageOptions {
  /**
   * Expiration time in milliseconds
   */
  expiresIn?: number;

  /**
   * Serialize function
   * @default JSON.stringify
   */
  serialize?: (value: unknown) => string;

  /**
   * Deserialize function
   * @default JSON.parse
   */
  deserialize?: (value: string) => unknown;
}

// ============================================================================
// DATE/TIME UTILITIES
// ============================================================================

/**
 * Date format options
 */
export type DateFormat =
  | 'ISO'
  | 'locale'
  | 'short'
  | 'medium'
  | 'long'
  | 'full';

/**
 * Time format options
 */
export type TimeFormat = '12h' | '24h';

/**
 * Date range
 */
export interface DateRange {
  /**
   * Start date
   */
  start: Date;

  /**
   * End date
   */
  end: Date;
}

/**
 * Time duration
 */
export interface Duration {
  /**
   * Duration in milliseconds
   */
  milliseconds: number;

  /**
   * Duration in seconds
   */
  seconds: number;

  /**
   * Duration in minutes
   */
  minutes: number;

  /**
   * Duration in hours
   */
  hours: number;

  /**
   * Duration in days
   */
  days: number;

  /**
   * Formatted duration string
   */
  formatted: string;
}

// ============================================================================
// ANIMATION UTILITIES
// ============================================================================

/**
 * Animation timing options
 */
export interface AnimationTiming {
  /**
   * Duration in milliseconds
   */
  duration: number;

  /**
   * Delay in milliseconds
   * @default 0
   */
  delay?: number;

  /**
   * Easing function
   * @default 'ease'
   */
  easing?: string;

  /**
   * Number of iterations
   * @default 1
   */
  iterations?: number;

  /**
   * Animation direction
   * @default 'normal'
   */
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}

/**
 * Animation result
 */
export interface AnimationResult {
  /**
   * Animation ID
   */
  id: string;

  /**
   * Whether animation is playing
   */
  isPlaying: boolean;

  /**
   * Cancel animation
   */
  cancel: () => void;

  /**
   * Pause animation
   */
  pause: () => void;

  /**
   * Resume animation
   */
  resume: () => void;

  /**
   * Finish animation
   */
  finish: () => void;
}

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  /**
   * Frame rate
   */
  fps: number;

  /**
   * Frame time in milliseconds
   */
  frameTime: number;

  /**
   * Memory usage in bytes
   */
  memoryUsage: number;

  /**
   * Total render time
   */
  renderTime: number;

  /**
   * Timestamp
   */
  timestamp: number;
}

/**
 * Performance options
 */
export interface PerformanceOptions {
  /**
   * Sample rate (0-1)
   * @default 1.0
   */
  sampleRate?: number;

  /**
   * Maximum samples to keep
   * @default 100
   */
  maxSamples?: number;

  /**
   * Include memory stats
   * @default false
   */
  includeMemory?: boolean;
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validation rule
 */
export interface ValidationRule<T = unknown> {
  /**
   * Rule name
   */
  name: string;

  /**
   * Validation function
   */
  validate: (value: T) => boolean;

  /**
   * Error message
   */
  message: string;

  /**
   * Rule priority (higher = checked first)
   * @default 0
   */
  priority?: number;
}

/**
 * Validation result
 */
export interface ValidationResult<T = unknown> {
  /**
   * Whether validation passed
   */
  isValid: boolean;

  /**
   * Validation errors
   */
  errors: ValidationError<T>[];

  /**
   * First error (convenience property)
   */
  firstError?: ValidationError<T>;
}

/**
 * Validation error
 */
export interface ValidationError<T = unknown> {
  /**
   * Error message
   */
  message: string;

  /**
   * Field name
   */
  field?: keyof T;

  /**
   * Rule that failed
   */
  rule?: string;

  /**
   * Invalid value
   */
  value?: T;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard for GridCell
 */
export function isGridCell(value: unknown): value is GridCell {
  return (
    typeof value === 'object' &&
    value !== null &&
    'letter' in value &&
    'row' in value &&
    'col' in value &&
    'isSelected' in value &&
    'isInPath' in value &&
    'canSelect' in value
  );
}

/**
 * Type guard for GuessResult
 */
export function isGuessResult(value: unknown): value is GuessResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    'word' in value &&
    'path' in value &&
    'feedback' in value
  );
}

/**
 * Type guard for array
 */
export function isArray<T>(value: unknown, guard?: (item: unknown) => item is T): value is T[] {
  if (!Array.isArray(value)) return false;
  if (guard) {
    return value.every(item => guard(item));
  }
  return true;
}

/**
 * Type guard for object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard for string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard for number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Type guard for boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Type guard for function
 */
export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}
