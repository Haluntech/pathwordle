export interface TimeChallenge {
  id: string;
  name: string;
  description: string;
  timeLimit: number; // in seconds
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: 'daily' | 'weekly' | 'special' | 'practice';
  wordPool: string[];
  rewards: ChallengeReward[];
  requirements?: ChallengeRequirement[];
  startTime?: string; // ISO timestamp
  endTime?: string; // ISO timestamp
  isActive: boolean;
  maxAttempts?: number;
  bestTime?: number; // in seconds
  participantCount: number;
  leaderboard: TimeChallengeLeaderboardEntry[];
}

export interface ChallengeReward {
  type: 'points' | 'badge' | 'theme' | 'title' | 'avatar';
  value: string | number;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface ChallengeRequirement {
  type: 'level' | 'previous_wins' | 'streak' | 'achievement';
  value: number | string;
  description: string;
}

export interface TimeChallengeSession {
  id: string;
  challengeId: string;
  playerId: string;
  startTime: string; // ISO timestamp
  endTime?: string; // ISO timestamp
  timeSpent: number; // in seconds
  wordsFound: string[];
  hintsUsed: number;
  score: number;
  completed: boolean;
  rank?: number;
  rewards: ChallengeReward[];
}

export interface TimeChallengeLeaderboardEntry {
  playerId: string;
  playerName: string;
  avatar: string;
  country?: string;
  time: number; // in seconds
  score: number;
  wordsFound: number;
  hintsUsed: number;
  completionTime: string; // ISO timestamp
  rank: number;
  previousRank?: number;
}

export interface SpeedCompetition {
  id: string;
  name: string;
  description: string;
  maxParticipants: number;
  currentParticipants: number;
  entryFee?: number; // premium currency
  prizePool: number;
  startTime: string; // ISO timestamp
  duration: number; // in minutes
  status: 'waiting' | 'starting' | 'in_progress' | 'completed' | 'cancelled';
  gameMode: 'sprint' | 'marathon' | 'relay';
  rules: CompetitionRule[];
  rewards: CompetitionReward[];
}

export interface CompetitionRule {
  type: 'word_limit' | 'time_limit' | 'hint_limit' | 'difficulty';
  value: number | string;
  description: string;
}

export interface CompetitionReward {
  position: number;
  type: 'currency' | 'badge' | 'theme' | 'title' | 'physical';
  value: string | number;
  description: string;
}

export interface TimeChallengeSettings {
  soundEnabled: boolean;
  countdownStyle: 'digital' | 'analog' | 'minimal';
  warningTime: number; // seconds before end to show warning
  autoSubmit: boolean;
  showLeaderboard: boolean;
  difficultyPreference: 'adaptive' | 'fixed';
  theme: 'speed' | 'precision' | 'endurance';
}

export interface TimeChallengeStats {
  totalChallenges: number;
  completedChallenges: number;
  averageTime: number;
  bestTime: number;
  totalWordsFound: number;
  averageHintsUsed: number;
  favoriteCategory: string;
  currentStreak: number;
  bestStreak: number;
  totalPoints: number;
  rankHistory: TimeChallengeRankHistory[];
  achievements: TimeChallengeAchievement[];
}

export interface TimeChallengeRankHistory {
  date: string; // ISO timestamp
  rank: number;
  participants: number;
  challengeId: string;
  challengeName: string;
}

export interface TimeChallengeAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string; // ISO timestamp
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'speed' | 'consistency' | 'mastery' | 'special';
  progress: number;
  maxProgress: number;
  points: number;
}

export interface DailyTimeChallenge {
  date: string; // YYYY-MM-DD format
  challengeId: string;
  theme: string;
  difficulty: 'easy' | 'medium' | 'hard';
  specialRule?: string;
  bonusMultiplier: number;
  completionBonus: number;
}

// Time Challenge Categories
export const TIME_CHALLENGE_CATEGORIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  SPECIAL: 'special',
  PRACTICE: 'practice',
  TOURNAMENT: 'tournament'
} as const;

// Game Modes for Speed Competition
export const SPEED_GAME_MODES = {
  SPRINT: 'sprint', // Complete as many words as possible in short time
  MARATHON: 'marathon', // Complete fixed number of words as fast as possible
  RELAY: 'relay', // Team-based sequential solving
  ELIMINATION: 'elimination' // Knockout tournament
} as const;

// Predefined Time Challenges
export const PREDEFINED_CHALLENGES = {
  DAILY_SPRINT: {
    id: 'daily_sprint',
    name: 'Daily Sprint',
    description: 'Solve 5 words in 3 minutes!',
    timeLimit: 180, // 3 minutes
    difficulty: 'medium' as const,
    category: 'daily' as const,
    maxAttempts: 3
  },
  WEEKLY_MARATHON: {
    id: 'weekly_marathon',
    name: 'Weekly Marathon',
    description: 'Solve 10 words as fast as possible!',
    timeLimit: 600, // 10 minutes max
    difficulty: 'hard' as const,
    category: 'weekly' as const,
    maxAttempts: 5
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Speed Demon Challenge',
    description: 'Lightning round: 1 minute per word!',
    timeLimit: 300, // 5 minutes for 5 words
    difficulty: 'expert' as const,
    category: 'special' as const,
    maxAttempts: 1
  },
  PRECISION_MASTER: {
    id: 'precision_master',
    name: 'Precision Master',
    description: 'No hints allowed! Complete 5 words in 5 minutes',
    timeLimit: 300,
    difficulty: 'hard' as const,
    category: 'special' as const,
    maxAttempts: 3
  }
} as const;

// Achievement Templates
export const TIME_CHALLENGE_ACHIEVEMENTS = {
  SPEED_RUNNER: {
    id: 'speed_runner',
    name: 'Speed Runner',
    description: 'Complete a challenge in under 2 minutes',
    icon: '⚡',
    rarity: 'rare' as const,
    category: 'speed' as const,
    points: 100
  },
  CONSISTENT_PERFORMER: {
    id: 'consistent_performer',
    name: 'Consistent Performer',
    description: 'Complete 7 daily challenges in a row',
    icon: '📅',
    rarity: 'epic' as const,
    category: 'consistency' as const,
    points: 200
  },
  TIME_MASTER: {
    id: 'time_master',
    name: 'Time Master',
    description: 'Achieve top 10 in any weekly challenge',
    icon: '👑',
    rarity: 'legendary' as const,
    category: 'mastery' as const,
    points: 500
  },
  SPEED_DEMON: {
    id: 'speed_demon_ach',
    name: 'Speed Demon',
    description: 'Complete a word in under 10 seconds',
    icon: '🔥',
    rarity: 'epic' as const,
    category: 'speed' as const,
    points: 300
  }
} as const;

// Countdown Timer States
export const TIMER_STATES = {
  READY: 'ready',
  RUNNING: 'running',
  PAUSED: 'paused',
  WARNING: 'warning', // Final 30 seconds
  FINISHED: 'finished',
  EXPIRED: 'expired'
} as const;

// Challenge Progress Types
export const PROGRESS_TYPES = {
  WORDS_FOUND: 'words_found',
  TIME_SPENT: 'time_spent',
  HINTS_USED: 'hints_used',
  ACCURACY: 'accuracy',
  SPEED: 'speed'
} as const;