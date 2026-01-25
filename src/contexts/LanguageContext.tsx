import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Language = 'en';

export interface Translation {
  [key: string]: string | Translation;
}

export const translations: Record<Language, Translation> = {
  en: {
    // Game Interface
    game: {
      title: 'PathWordle',
      subtitle: 'Find the path to the word',
      guess: 'Guess',
      clear: 'Clear',
      submit: 'Submit',
      reset: 'Reset',
      playAgain: 'Play Again',
      share: 'Share',
      score: 'Score',
      time: 'Time',
      attempts: 'Attempts',
      difficulty: 'Difficulty',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      expert: 'Expert',
      daily: 'Daily',
      practice: 'Practice',
    },

    // Navigation
    nav: {
      statistics: 'Statistics',
      hints: 'Hints',
      leaderboard: 'Leaderboard',
      friends: 'Friends',
      multiplayer: 'Multiplayer',
      themes: 'Themes',
    },

    // Game Results
    result: {
      congratulations: 'Congratulations!',
      youWon: 'You Won!',
      betterLuck: 'Better luck next time!',
      wordRevealed: 'The word was',
      attemptsUsed: 'Attempts used',
      timeSpent: 'Time spent',
      score: 'Score',
      accuracy: 'Accuracy',
      bestStreak: 'Best streak',
      achievements: 'Achievements',
      shareResult: 'Share Result',
      playAgain: 'Play Again',
      viewStats: 'View Statistics',
      newGame: 'New Game',
    },

    // Statistics
    stats: {
      title: 'Game Statistics',
      played: 'Played',
      won: 'Won',
      winRate: 'Win Rate',
      currentStreak: 'Current Streak',
      maxStreak: 'Max Streak',
      averageGuesses: 'Average Guesses',
      totalTime: 'Total Time',
      averageTime: 'Average Time',
      bestTime: 'Best Time',
      difficulty: 'Difficulty',
      today: 'Today',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      allTime: 'All Time',
      distribution: 'Guess Distribution',
      achievements: 'Achievements',
      unlocked: 'Unlocked',
      progress: 'Progress',
    },

    // Hints
    hints: {
      title: 'Game Hints',
      noHints: 'No hints available',
      unlockHint: 'Unlock Hint',
      cost: 'Points',
      notEnoughPoints: 'Not enough points',
      hintTypes: {
        definition: 'Definition',
        synonym: 'Synonym',
        antonym: 'Antonym',
        etymology: 'Etymology',
        usage: 'Usage Example',
        funFact: 'Fun Fact'
      },
      pointBalance: 'Point Balance',
      earnPoints: 'Earn points by solving puzzles or completing challenges',
    },

    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      tryAgain: 'Try Again',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      finish: 'Finish',
      start: 'Start',
      stop: 'Stop',
      play: 'Play',
      pause: 'Pause',
      resume: 'Resume',
      quit: 'Quit',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      done: 'Done',
      settings: 'Settings',
      help: 'Help',
    },
  },
};

// Default to English
const DEFAULT_LANGUAGE: Language = 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, fallback?: string) => string;
  translations: typeof translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({
  children,
  defaultLanguage = DEFAULT_LANGUAGE
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  // Translation function
  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }

    return typeof value === 'string' ? value : fallback || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    translations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Helper function for direct translation usage
export const translate = (key: string, language: Language = DEFAULT_LANGUAGE): string => {
  const keys = key.split('.');
  let value: any = translations[language];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }

  return typeof value === 'string' ? value : key;
};
