/**
 * Configuration Type Definitions
 *
 * Type definitions for application configuration, settings, and constants.
 */

// ============================================================================
// GAME CONFIGURATION
// ============================================================================

/**
 * Game difficulty configuration
 */
export interface DifficultyConfig {
  /**
   * Difficulty identifier
   */
  id: 'easy' | 'medium' | 'hard' | 'expert';

  /**
   * Display name
   */
  name: string;

  /**
   * Description
   */
  description: string;

  /**
   * Number of attempts allowed
   */
  maxAttempts: number;

  /**
   * Time limit in seconds (0 = no limit)
   */
  timeLimit?: number;

  /**
   * Whether hints are available
   */
  hintsAvailable: boolean;

  /**
   * Number of free hints
   */
  freeHints: number;

  /**
   * Word difficulty level
   */
  wordDifficulty: 1 | 2 | 3 | 4 | 5;

  /**
   * Grid complexity factor
   */
  gridComplexity: number;

  /**
   * Score multiplier
   */
  scoreMultiplier: number;
}

/**
 * Game mode configuration
 */
export interface GameModeConfig {
  /**
   * Mode identifier
   */
  id: 'daily' | 'practice';

  /**
   * Display name
   */
  name: string;

  /**
   * Description
   */
  description: string;

  /**
   * Whether mode saves progress
   */
  savesProgress: boolean;

  /**
   * Whether mode has leaderboard
   */
  hasLeaderboard: boolean;

  /**
   * Available difficulties
   */
  availableDifficulties: DifficultyConfig['id'][];

  /**
   * Default difficulty
   */
  defaultDifficulty: DifficultyConfig['id'];
}

/**
 * Game constants
 */
export interface GameConstants {
  /**
   * Grid size
   */
  GRID_SIZE: number;

  /**
   * Target word length
   */
  WORD_LENGTH: number;

  /**
   * Maximum attempts
   */
  MAX_ATTEMPTS: number;

  /**
   * Minimum word length
   */
  MIN_WORD_LENGTH: number;

  /**
   * Maximum word length
   */
  MAX_WORD_LENGTH: number;
}

// ============================================================================
// APPLICATION CONFIGURATION
// ============================================================================

/**
 * Application configuration
 */
export interface AppConfig {
  /**
   * Application name
   */
  name: string;

  /**
   * Application version
   */
  version: string;

  /**
   * Application description
   */
  description: string;

  /**
   * Environment
   */
  environment: 'development' | 'staging' | 'production';

  /**
   * Debug mode
   */
  debug: boolean;

  /**
   * API base URL
   */
  apiBaseUrl: string;

  /**
   * CDN base URL
   */
  cdnBaseUrl: string;

  /**
   * Analytics ID
   */
  analyticsId?: string;

  /**
   * Features configuration
   */
  features: FeatureConfig;
}

/**
 * Feature flags configuration
 */
export interface FeatureConfig {
  /**
   * Enable daily challenges
   */
  dailyChallenges: boolean;

  /**
   * Enable practice mode
   */
  practiceMode: boolean;

  /**
   * Enable statistics
   */
  statistics: boolean;

  /**
   * Enable achievements
   */
  achievements: boolean;

  /**
   * Enable hints
   */
  hints: boolean;

  /**
   * Enable leaderboards
   */
  leaderboards: boolean;

  /**
   * Enable social features
   */
  socialFeatures: boolean;

  /**
   * Enable themes
   */
  themes: boolean;

  /**
   * Enable multiplayer
   */
  multiplayer: boolean;

  /**
   * Enable animations
   */
  animations: boolean;

  /**
   * Enable sound effects
   */
  soundEffects: boolean;

  /**
   * Enable vibration
   */
  vibration: boolean;

  /**
   * Enable offline mode
   */
  offlineMode: boolean;

  /**
   * Enable PWA
   */
  pwa: boolean;
}

// ============================================================================
// THEME CONFIGURATION
// ============================================================================

/**
 * Theme configuration
 */
export interface ThemeConfig {
  /**
   * Theme ID
   */
  id: string;

  /**
   * Theme name
   */
  name: string;

  /**
   * Theme description
   */
  description: string;

  /**
   * Theme mode
   */
  mode: 'light' | 'dark' | 'auto';

  /**
   * Primary color
   */
  primaryColor: string;

  /**
   * Secondary color
   */
  secondaryColor: string;

  /**
   * Background color
   */
  backgroundColor: string;

  /**
   * Text color
   */
  textColor: string;

  /**
   * Border color
   */
  borderColor: string;

  /**
   * Success color
   */
  successColor: string;

  /**
   * Warning color
   */
  warningColor: string;

  /**
   * Error color
   */
  errorColor: string;

  /**
   * Info color
   */
  infoColor: string;

  /**
   * Border radius
   */
  borderRadius: string;

  /**
   * Font family
   */
  fontFamily: string;

  /**
   * Font size
   */
  fontSize: string;

  /**
   * Custom CSS variables
   */
  customVars?: Record<string, string>;
}

/**
 * Colorblind mode configuration
 */
export interface ColorblindModeConfig {
  /**
   * Mode ID
   */
  id: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

  /**
   * Mode name
   */
  name: string;

  /**
   * Mode description
   */
  description: string;

  /**
   * Color mappings
   */
  colorMappings: {
    correct: string;
    present: string;
    absent: string;
  };
}

// ============================================================================
// ANIMATION CONFIGURATION
// ============================================================================

/**
 * Animation preset
 */
export interface AnimationPreset {
  /**
   * Animation name
   */
  name: string;

  /**
   * Duration in milliseconds
   */
  duration: number;

  /**
   * Easing function
   */
  easing: string;

  /**
   * Delay in milliseconds
   */
  delay: number;

  /**
   * CSS keyframes or transition properties
   */
  properties: Record<string, string | number>;
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  /**
   * Enable animations
   */
  enabled: boolean;

  /**
   * Reduced motion (respect user preference)
   */
  reducedMotion: boolean;

  /**
   * Animation speed multiplier
   */
  speedMultiplier: number;

  /**
   * Custom presets
   */
  presets: Record<string, AnimationPreset>;

  /**
   * Default animation duration
   */
  defaultDuration: number;

  /**
   * Default easing function
   */
  defaultEasing: string;
}

// ============================================================================
// LOCAL STORAGE CONFIGURATION
// ============================================================================

/**
 * Storage configuration
 */
export interface StorageConfig {
  /**
   * Storage prefix
   */
  prefix: string;

  /**
   * Default expiration time in milliseconds
   */
  defaultExpiration: number;

  /**
   * Maximum storage size in bytes
   */
  maxSize: number;

  /**
   * Enable compression
   */
  compression: boolean;

  /**
   * Enable encryption
   */
  encryption: boolean;

  /**
   * Storage keys
   */
  keys: Record<string, string>;
}

// ============================================================================
// ROUTE CONFIGURATION
// ============================================================================

/**
 * Route configuration
 */
export interface RouteConfig {
  /**
   * Route path
   */
  path: string;

  /**
   * Route name
   */
  name: string;

  /**
   * Component name
   */
  component: string;

  /**
   * Route meta information
   */
  meta?: {
    title?: string;
    description?: string;
    requiresAuth?: boolean;
    layout?: string;
    hideFromNavigation?: boolean;
  };
}

/**
 * Router configuration
 */
export interface RouterConfig {
  /**
   * Base path
   */
  basePath: string;

  /**
   * Routes
   */
  routes: RouteConfig[];

  /**
   * 404 route
   */
  notFoundRoute: RouteConfig;

  /**
   * Enable hash routing
   */
  hashMode: boolean;
}

// ============================================================================
// PERFORMANCE CONFIGURATION
// ============================================================================

/**
 * Performance configuration
 */
export interface PerformanceConfig {
  /**
   * Enable performance monitoring
   */
  monitoring: boolean;

  /**
   * Sample rate (0-1)
   */
  sampleRate: number;

  /**
   * Maximum samples to keep
   */
  maxSamples: number;

  /**
   * Report interval in milliseconds
   */
  reportInterval: number;

  /**
   * Enable metrics collection
   */
  collectMetrics: boolean;

  /**
   * Metrics to collect
   */
  metrics: ('fps' | 'memory' | 'renderTime' | 'network')[];
}

// ============================================================================
// ANALYTICS CONFIGURATION
// ============================================================================

/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
  /**
   * Enable analytics
   */
  enabled: boolean;

  /**
   * Analytics provider
   */
  provider: 'google' | 'plausible' | 'custom';

  /**
   * Tracking ID
   */
  trackingId?: string;

  /**
   * Custom endpoint
   */
  customEndpoint?: string;

  /**
   * Auto track page views
   */
  autoTrackPageview: boolean;

  /**
   * Auto track events
   */
  autoTrackEvents: boolean;

  /**
   * Debug mode
   */
  debug: boolean;

  /**
   * Consent required
   */
  consentRequired: boolean;

  /**
   * Anonymize IP
   */
  anonymizeIP: boolean;

  /**
   * Session timeout in minutes
   */
  sessionTimeout: number;
}

// ============================================================================
// API CONFIGURATION
// ============================================================================

/**
 * API endpoint configuration
 */
export interface ApiEndpointConfig {
  /**
   * Endpoint path
   */
  path: string;

  /**
   * HTTP method
   */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

  /**
   * Authentication required
   */
  requiresAuth: boolean;

  /**
   * Rate limit (requests per minute)
   */
  rateLimit?: number;

  /**
   * Cache duration in milliseconds
   */
  cacheDuration?: number;

  /**
   * Timeout in milliseconds
   */
  timeout: number;
}

/**
 * API configuration
 */
export interface ApiConfig {
  /**
   * Base URL
   */
  baseUrl: string;

  /**
   * API version
   */
  version: string;

  /**
   * Timeout in milliseconds
   */
  timeout: number;

  /**
   * Retry attempts
   */
  retryAttempts: number;

  /**
   * Retry delay in milliseconds
   */
  retryDelay: number;

  /**
   * Enable request logging
   */
  logging: boolean;

  /**
   * Endpoints
   */
  endpoints: Record<string, ApiEndpointConfig>;
}
