export interface Hint {
  id: string;
  type: 'letter' | 'position' | 'path' | 'pattern' | 'vocabulary' | 'strategy';
  title: string;
  description: string;
  category: 'basic' | 'intermediate' | 'advanced';
  cost: number; // Points cost
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  applicableTo: ('easy' | 'medium' | 'hard' | 'expert')[];
  isAvailable: (gameState: any, difficulty: string) => boolean;
  generateHint: (gameState: any, difficulty: string) => string;
  value: number; // Hint value score
}

export interface HintUsage {
  hintId: string;
  usedAt: string;
  gameState: any;
  wasHelpful: boolean; // User feedback
}

export interface HintStatistics {
  totalHintsUsed: number;
  hintsByType: Record<string, number>;
  averageHelpfulness: number;
  favoriteHintTypes: string[];
  hintsThisGame: number;
  remainingHints: number;
}

export interface StrategicHint {
  position: { row: number; col: number };
  reason: string;
  confidence: number; // 0-100
  alternativeOptions?: { row: number; col: number }[];
}

export interface LetterFrequency {
  letter: string;
  frequency: number; // 0-100
  probability: number; // Probability of appearing in a word
}

export interface WordPattern {
  pattern: string; // e.g., "A___E"
  matches: string[]; // 匹配的单词
  commonLetters: string[]; // 常见字母
  nextBestLetters: { letter: string; score: number }[];
}

// Predefined hint types
export const HINT_TYPES = {
  LETTER: {
    id: 'reveal-letter',
    title: 'Reveal Letter',
    description: 'Reveal the position of a letter in the target word',
    category: 'basic' as const,
    cost: 50,
    rarity: 'common' as const,
    icon: '🔤'
  },

  POSITION: {
    id: 'letter-position',
    title: 'Letter Position',
    description: 'Indicates whether a given letter is in the target word',
    category: 'basic' as const,
    cost: 30,
    rarity: 'common' as const,
    icon: '📍'
  },

  PATH: {
    id: 'optimal-path',
    title: 'Optimal Path',
    description: 'Shows a possible correct path',
    category: 'intermediate' as const,
    cost: 100,
    rarity: 'rare' as const,
    icon: '🛤️'
  },

  PATTERN: {
    id: 'word-pattern',
    title: 'Word Pattern',
    description: 'Analyzes possible word structure patterns',
    category: 'intermediate' as const,
    cost: 80,
    rarity: 'rare' as const,
    icon: '🔍'
  },

  VOCABULARY: {
    id: 'vocabulary-hint',
    title: 'Vocabulary Hint',
    description: 'Provides clues based on common English words',
    category: 'advanced' as const,
    cost: 120,
    rarity: 'epic' as const,
    icon: '📚'
  },

  STRATEGY: {
    id: 'strategy-advice',
    title: 'Strategy Advice',
    description: 'Provides expert gameplay strategy advice',
    category: 'advanced' as const,
    cost: 150,
    rarity: 'legendary' as const,
    icon: '💡'
  }
} as const;

// Common English letter frequency
export const ENGLISH_LETTER_FREQUENCY = {
  E: 12.7, T: 9.1, A: 8.2, O: 7.5, I: 7.0,
  N: 6.7, S: 6.3, H: 6.1, R: 6.0, D: 4.3,
  L: 4.0, C: 2.8, U: 2.8, M: 2.4, W: 2.4,
  F: 2.2, G: 2.0, Y: 2.0, P: 1.9, B: 1.5,
  V: 1.0, K: 0.8, J: 0.2, X: 0.2, Q: 0.1, Z: 0.1
} as const;

// Common beginning and ending letter combinations
export const COMMON_BEGINNINGS = [
  'TH', 'HE', 'IN', 'ER', 'AN', 'RE', 'ED', 'ND',
  'ON', 'EN', 'TO', 'OF', 'IT', 'IS', 'HI', 'ES'
];

export const COMMON_ENDINGS = [
  'ING', 'ED', 'ER', 'ES', 'TION', 'MENT', 'NESS',
  'LY', 'AL', 'ION', 'ITY', 'IVE', 'OUS', 'ANT'
];

// Word length frequency
export const WORD_LENGTH_FREQUENCY = {
  3: 0.15, 4: 0.25, 5: 0.30, 6: 0.20, 7: 0.08, 8: 0.02
} as const;