import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ko';

export interface TranslationKeys {
  // Navigation and UI
  nav: {
    home: string;
    game: string;
    statistics: string;
    achievements: string;
    settings: string;
    help: string;
    about: string;
  };

  // Game
  game: {
    title: string;
    subtitle: string;
    newGame: string;
    reset: string;
    hint: string;
    submit: string;
    clear: string;
    skip: string;
    pause: string;
    resume: string;
    gameOver: string;
    youWin: string;
    timeChallenge: string;
    themedPuzzles: string;
    puzzleEditor: string;
    multiplayer: string;
  };

  // Game Elements
  grid: {
    selectCell: string;
    clearCell: string;
    pathComplete: string;
    wordFound: string;
    invalidPath: string;
  };

  // Statistics
  stats: {
    title: string;
    gamesPlayed: string;
    gamesWon: string;
    winRate: string;
    currentStreak: string;
    bestStreak: string;
    averageTime: string;
    bestTime: string;
    wordsFound: string;
    hintsUsed: string;
  };

  // Achievements
  achievements: {
    title: string;
    unlocked: string;
    locked: string;
    newAchievement: string;
    progress: string;
    rarity: {
      common: string;
      rare: string;
      epic: string;
      legendary: string;
    };
  };

  // Time Challenge
  timeChallenge: {
    title: string;
    description: string;
    startTime: string;
    challenge: string;
    pause: string;
    resume: string;
    endChallenge: string;
    timeRemaining: string;
    score: string;
    wordsFound: string;
    hintsUsed: string;
    accuracy: string;
    completed: string;
    failed: string;
    leaderboard: string;
    bestTime: string;
    currentStreak: string;
    totalPoints: string;
  };

  // Themed Puzzles
  themedPuzzles: {
    title: string;
    description: string;
    categories: string;
    difficulty: string;
    newPuzzles: string;
    popular: string;
    completed: string;
    progress: string;
    unlock: string;
  };

  // Multiplayer
  multiplayer: {
    title: string;
    inviteFriend: string;
    joinGame: string;
    createGame: string;
    waitingForOpponent: string;
    yourTurn: string;
    opponentTurn: string;
    youWon: string;
    opponentWon: string;
    draw: string;
    rematch: string;
    chat: string;
  };

  // Notifications
  notifications: {
    title: string;
    enable: string;
    disable: string;
    permission: {
      granted: string;
      denied: string;
      prompt: string;
      request: string;
    };
    categories: {
      dailyChallenge: string;
      achievements: string;
      friendActivity: string;
      leaderboards: string;
      puzzleRecommendations: string;
      socialFeatures: string;
      updates: string;
      reminders: string;
      promotions: string;
    };
    quietHours: {
      title: string;
      enabled: string;
      disabled: string;
      startTime: string;
      endTime: string;
      allowUrgent: string;
    };
    device: {
      sound: string;
      vibration: string;
      badge: string;
      alert: string;
      banner: string;
      lockScreen: string;
    };
    frequency: {
      maxPerDay: string;
      maxPerHour: string;
      smartScheduling: string;
    };
    demo: {
      title: string;
      description: string;
      start: string;
      running: string;
      reset: string;
      permissionRequired: string;
      individualTests: string;
      instructions: string;
    };
  };

  // Settings
  settings: {
    title: string;
    language: string;
    theme: string;
    sound: string;
    music: string;
    animations: string;
    difficulty: string;
    accessibility: string;
    privacy: string;
    about: string;
  };

  // Theme
  theme: {
    light: string;
    dark: string;
    auto: string;
    blue: string;
    green: string;
    purple: string;
    sunset: string;
    ocean: string;
    forest: string;
  };

  // Accessibility
  accessibility: {
    title: string;
    highContrast: string;
    largeText: string;
    reduceMotion: string;
    screenReader: string;
    keyboardNavigation: string;
  };

  // Learning Dashboard
  learning: {
    title: string;
    overview: string;
    progress: string;
    skills: string;
    recommendations: string;
    insights: string;
    vocabulary: string;
    patternRecognition: string;
    speed: string;
    accuracy: string;
    strategy: string;
  };

  // Common
  common: {
    loading: string;
    error: string;
    retry: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    yes: string;
    no: string;
    ok: string;
    search: string;
    filter: string;
    sort: string;
    share: string;
    copy: string;
    report: string;
    help: string;
    learnMore: string;
    comingSoon: string;
    beta: string;
    new: string;
    updated: string;
    featured: string;
    popular: string;
    recommended: string;
    today: string;
    yesterday: string;
    thisWeek: string;
    thisMonth: string;
  };

  // Time
  time: {
    seconds: string;
    minutes: string;
    hours: string;
    days: string;
    weeks: string;
    months: string;
    years: string;
    ago: string;
    remaining: string;
    left: string;
  };

  // Numbers
  numbers: {
    zero: string;
    one: string;
    two: string;
    three: string;
    four: string;
    five: string;
    ten: string;
    hundred: string;
    thousand: string;
    million: string;
    billion: string;
  };
}

export const translations: Record<Language, TranslationKeys> = {
  en,
  es,
  fr,
  de,
  ja,
  ko,
};

export const defaultLanguage: Language = 'en';

export const supportedLanguages: Language[] = ['en', 'es', 'fr', 'de', 'ja', 'ko'];

export const languageNames: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
  ko: '한국어',
};

export const languageFlags: Record<Language, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  ja: '🇯🇵',
  ko: '🇰🇷',
};

export const getLanguageFromBrowser = (): Language => {
  const browserLang = navigator.language || (navigator as any).userLanguage;

  // Extract the language code (e.g., 'en' from 'en-US')
  const langCode = browserLang.split('-')[0] as Language;

  // Return the supported language or default to English
  return supportedLanguages.includes(langCode) ? langCode : defaultLanguage;
};

export const detectLanguage = (): Language => {
  // Try to get language from localStorage first
  const storedLanguage = localStorage.getItem('pathwordle_language') as Language;
  if (storedLanguage && supportedLanguages.includes(storedLanguage)) {
    return storedLanguage;
  }

  // Fall back to browser language detection
  return getLanguageFromBrowser();
};

export const setLanguage = (language: Language): void => {
  localStorage.setItem('pathwordle_language', language);
  document.documentElement.lang = language;

  // Update document direction for RTL languages (if any)
  const rtlLanguages: Language[] = []; // Add RTL languages here
  document.documentElement.dir = rtlLanguages.includes(language) ? 'rtl' : 'ltr';
};

// Translation helper function
export const translate = (
  language: Language,
  key: string,
  fallback?: string
): string => {
  const keys = key.split('.');
  let value: any = translations[language];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if key not found in current language
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return fallback || key; // Return fallback or key if not found
        }
      }
    }
  }

  return typeof value === 'string' ? value : fallback || key;
};

// Pluralization helper
export const pluralize = (
  language: Language,
  key: string,
  count: number,
  fallback?: string
): string => {
  const translation = translate(language, key, fallback);

  // Basic pluralization rules (can be enhanced for different languages)
  if (count === 1) {
    return translation.replace('{count}', count.toString());
  }

  // For languages with different pluralization rules, add specific logic here
  const pluralForm = translation.includes('{plural}')
    ? translation.replace('{plural}', 's').replace('{count}', count.toString())
    : translation.replace('{count}', count.toString());

  return pluralForm;
};

// Date formatting helper
export const formatDate = (
  language: Language,
  date: Date,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  try {
    return new Intl.DateTimeFormat(language, defaultOptions).format(date);
  } catch {
    // Fallback to English formatting
    return new Intl.DateTimeFormat('en', defaultOptions).format(date);
  }
};

// Number formatting helper
export const formatNumber = (
  language: Language,
  number: number,
  options: Intl.NumberFormatOptions = {}
): string => {
  try {
    return new Intl.NumberFormat(language, options).format(number);
  } catch {
    // Fallback to English formatting
    return new Intl.NumberFormat('en', options).format(number);
  }
};

// Time formatting helper
export const formatTime = (
  language: Language,
  seconds: number,
  showHours = false
): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (showHours && hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Relative time helper
export const formatRelativeTime = (
  language: Language,
  date: Date,
  now = new Date()
): string => {
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return translate(language, 'time.seconds');
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return pluralize(language, 'numbers.one', diffInMinutes) + ' ' + translate(language, 'time.minutes');
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return pluralize(language, 'numbers.one', diffInHours) + ' ' + translate(language, 'time.hours');
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return pluralize(language, 'numbers.one', diffInDays) + ' ' + translate(language, 'time.days');
  }

  // For longer periods, use date formatting
  return formatDate(language, date, {
    month: 'short',
    day: 'numeric',
    year: diffInDays > 365 ? 'numeric' : undefined
  });
};
