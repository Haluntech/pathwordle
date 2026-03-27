/**
 * Google Analytics 4 Event Tracking Utility
 * Measurement ID: G-FHENCTMKTY
 */

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: Record<string, any>) => void;
  }
}

type GameMode = 'daily' | 'practice';
type SharePlatform = 'twitter' | 'facebook' | 'whatsapp' | 'copy_link';
type HintType = 'first_letter' | 'common_letters' | 'progress_good' | 'vowel_strategy' | 'next_letter_reveal';

/**
 * Safely call gtag function
 */
const gtagSafe = (...args: any[]) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
};

/**
 * Track game start
 */
export const trackGameStart = (gameMode: GameMode) => {
  gtagSafe('event', 'game_start', {
    game_mode: gameMode,
    device_type: getDeviceType(),
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track game completion
 */
export const trackGameComplete = (
  result: 'won' | 'lost',
  attemptsUsed: number,
  maxAttempts: number,
  timeTaken: number,
  gameMode: GameMode,
  word?: string
) => {
  gtagSafe('event', 'game_complete', {
    result,
    attempts_used: attemptsUsed,
    max_attempts: maxAttempts,
    time_seconds: timeTaken,
    game_mode: gameMode,
    word_length: word?.length || 5,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track hint usage
 */
export const trackHintUsed = (hintType: HintType, attemptsRemaining: number, gameMode: GameMode) => {
  gtagSafe('event', 'hint_used', {
    hint_type: hintType,
    attempts_remaining: attemptsRemaining,
    game_mode: gameMode,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track social sharing
 */
export const trackShare = (platform: SharePlatform, gameResult: 'won' | 'lost', attemptsUsed: number) => {
  gtagSafe('event', 'share', {
    platform,
    game_result: gameResult,
    attempts_used: attemptsUsed,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track modal/page views
 */
export const trackPageView = (pageTitle: string, pageLocation?: string) => {
  gtagSafe('event', 'page_view', {
    page_title: pageTitle,
    page_location: pageLocation || window.location.href + '#' + pageTitle.toLowerCase().replace(/\s+/g, '-'),
    timestamp: new Date().toISOString()
  });
};

/**
 * Track button clicks and interactions
 */
export const trackEngagement = (action: string, target: string, metadata?: Record<string, any>) => {
  gtagSafe('event', 'engagement', {
    action,
    target,
    ...metadata,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track errors
 */
export const trackError = (errorType: string, message: string, context?: Record<string, any>) => {
  gtagSafe('event', 'error', {
    error_type: errorType,
    message,
    ...context,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track user sign-up (if you add accounts later)
 */
export const trackSignUp = (method: 'email' | 'google' | 'facebook') => {
  gtagSafe('event', 'sign_up', {
    method,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track tutorial completion
 */
export const trackTutorialComplete = (steps: number, timeSpent: number) => {
  gtagSafe('event', 'tutorial_complete', {
    steps_completed: steps,
    time_seconds: timeSpent,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track achievement unlock
 */
export const trackAchievement = (achievementId: string, achievementName: string) => {
  gtagSafe('event', 'achievement_unlocked', {
    achievement_id: achievementId,
    achievement_name: achievementName,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track theme change
 */
export const trackThemeChange = (newTheme: 'dark' | 'light') => {
  gtagSafe('event', 'theme_change', {
    new_theme: newTheme,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track game mode switch
 */
export const trackModeSwitch = (fromMode: GameMode, toMode: GameMode) => {
  gtagSafe('event', 'mode_switch', {
    from_mode: fromMode,
    to_mode: toMode,
    timestamp: new Date().toISOString()
  });
};

/**
 * Helper: Get device type
 */
const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.screen.width;
  const userAgent = navigator.userAgent;

  if (/Mobile|Android|iPhone/i.test(userAgent)) {
    return 'mobile';
  } else if (width >= 768 && width < 1024) {
    return 'tablet';
  } else {
    return 'desktop';
  }
};

/**
 * Set user properties
 */
export const setUserProperties = (properties: Record<string, any>) => {
  gtagSafe('set', 'user_properties', properties);
};

/**
 * Track session start (called on app load)
 */
export const trackSessionStart = () => {
  gtagSafe('event', 'session_start', {
    timestamp: new Date().toISOString(),
    referrer: document.referrer || 'direct',
    landing_page: window.location.pathname
  });
};

/**
 * Track first visit
 */
export const trackFirstVisit = () => {
  const hasVisited = localStorage.getItem('pathwordle_has_visited');
  if (!hasVisited) {
    gtagSafe('event', 'first_visit', {
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('pathwordle_has_visited', 'true');
  }
};

/**
 * Track daily active user
 */
export const trackDailyActive = () => {
  const today = new Date().toDateString();
  const lastActive = localStorage.getItem('pathwordle_last_active');
  
  if (lastActive !== today) {
    gtagSafe('event', 'daily_active', {
      date: today,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('pathwordle_last_active', today);
  }
};

/**
 * Initialize analytics
 */
export const initAnalytics = () => {
  // Track session start
  trackSessionStart();
  
  // Track first visit
  trackFirstVisit();
  
  // Track daily active
  trackDailyActive();
};

export default {
  trackGameStart,
  trackGameComplete,
  trackHintUsed,
  trackShare,
  trackPageView,
  trackEngagement,
  trackError,
  trackSignUp,
  trackTutorialComplete,
  trackAchievement,
  trackThemeChange,
  trackModeSwitch,
  setUserProperties,
  initAnalytics
};
