export interface SpeedLeaderboardEntry {
  id: string;
  playerId: string;
  playerName: string;
  avatar: string;
  country?: string;
  time: number; // in seconds
  accuracy: number; // percentage
  wordsCompleted: number;
  challengeType: 'daily_sprint' | 'weekly_marathon' | 'speed_demon' | 'custom';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  score: number;
  completionDate: string; // ISO timestamp
  rank: number;
  previousRank?: number;
  isNewEntry?: boolean;
  streak?: number; // consecutive days
  badges: string[];
}

export interface SpeedLeaderboard {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'all_time' | 'challenge_specific';
  challengeId?: string;
  maxEntries: number;
  refreshInterval: number; // in minutes
  lastUpdated: string; // ISO timestamp
  entries: SpeedLeaderboardEntry[];
  totalParticipants: number;
  averageTime: number;
  averageScore: number;
  topCountries: CountryRanking[];
  categories: LeaderboardCategory[];
}

export interface CountryRanking {
  country: string;
  countryCode: string;
  totalParticipants: number;
  averageTime: number;
  bestTime: number;
  totalScore: number;
  rank: number;
  flag: string;
}

export interface LeaderboardCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  entries: SpeedLeaderboardEntry[];
  stats: CategoryStats;
}

export interface CategoryStats {
  totalEntries: number;
  averageTime: number;
  bestTime: number;
  participantCount: number;
  completionRate: number;
}

export interface TimeBasedAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  type: AchievementType;
  criteria: AchievementCriteria;
  rewards: AchievementReward[];
  rarity: AchievementRarity;
  progress?: AchievementProgress;
  unlockedAt?: string; // ISO timestamp
  isHidden?: boolean;
  prerequisites?: string[]; // other achievement IDs
  tags: string[];
}

export interface AchievementCriteria {
  type: 'time_limit' | 'streak' | 'accuracy' | 'completion_count' | 'speed_record' | 'daily_challenge' | 'perfect_run' | 'consistency';
  value: number;
  condition?: string; // additional conditions
  timeFrame?: 'single_game' | 'daily' | 'weekly' | 'monthly' | 'all_time';
  challengeType?: string[]; // specific challenge types
}

export interface AchievementProgress {
  current: number;
  required: number;
  percentage: number;
  lastUpdated: string; // ISO timestamp
  milestones?: Milestone[];
}

export interface Milestone {
  value: number;
  description: string;
  unlockedAt?: string; // ISO timestamp
}

export interface AchievementReward {
  type: 'points' | 'badge' | 'title' | 'avatar' | 'theme' | 'feature' | 'recognition';
  value: string | number;
  description: string;
  metadata?: Record<string, any>;
}

export type AchievementCategory =
  | 'speed_demon'
  | 'time_master'
  | 'consistency_warrior'
  | 'perfectionist'
  | 'daily_champion'
  | 'marathon_runner'
  | 'accuracy_expert'
  | 'rising_star'
  | 'legendary'
  | 'special';

export type AchievementType =
  | 'threshold'
  | 'cumulative'
  | 'streak'
  | 'record_breaker'
  | 'challenge_specific'
  | 'seasonal'
  | 'community';

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface PlayerSpeedStats {
  playerId: string;
  playerName: string;
  totalTimeSpent: number; // in seconds
  totalGamesPlayed: number;
  averageTime: number;
  bestTime: number;
  currentStreak: number;
  bestStreak: number;
  totalScore: number;
  averageScore: number;
  accuracy: number;
  completionRate: number;
  favoriteChallengeType: string;
  rankHistory: RankSnapshot[];
  achievements: TimeBasedAchievement[];
  globalRank?: number;
  countryRank?: number;
  regionRank?: number;
  badges: string[];
  titles: string[];
}

export interface RankSnapshot {
  date: string; // ISO timestamp
  rank: number;
  totalParticipants: number;
  percentile: number;
  challengeType: string;
}

export interface SpeedEvent {
  id: string;
  name: string;
  description: string;
  type: 'tournament' | 'marathon' | 'sprint' | 'relay' | 'community';
  startTime: string; // ISO timestamp
  endTime: string; // ISO timestamp
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  entryRequirements?: EventRequirement[];
  rewards: EventReward[];
  maxParticipants?: number;
  currentParticipants: number;
  rules: EventRule[];
  leaderboards: string[]; // leaderboard IDs
  achievements: string[]; // achievement IDs
}

export interface EventRequirement {
  type: 'level' | 'previous_event' | 'achievement' | 'region' | 'time_based';
  value: string | number;
  description: string;
}

export interface EventReward {
  position: 'participation' | 'top_10' | 'top_3' | 'winner' | 'special';
  type: 'points' | 'badge' | 'title' | 'avatar' | 'physical' | 'monetary';
  value: string | number;
  description: string;
  rarity: AchievementRarity;
}

export interface EventRule {
  type: 'time_limit' | 'accuracy_requirement' | 'challenge_count' | 'penalty_system';
  value: number | string;
  description: string;
}

// Predefined Achievement Templates
export const SPEED_ACHIEVEMENTS = {
  // Speed Demon Category
  LIGHTNING_FAST: {
    id: 'lightning_fast',
    name: 'Lightning Fast',
    description: 'Complete any challenge in under 60 seconds',
    icon: '⚡',
    category: 'speed_demon' as AchievementCategory,
    type: 'threshold' as AchievementType,
    criteria: {
      type: 'time_limit' as const,
      value: 60,
      timeFrame: 'single_game' as const
    },
    rewards: [
      { type: 'points' as const, value: 100, description: '100 bonus points' },
      { type: 'badge' as const, value: 'lightning_badge', description: 'Lightning Badge' }
    ],
    rarity: 'rare' as AchievementRarity,
    tags: ['speed', 'beginner', 'quick']
  },

  SONIC_SPEED: {
    id: 'sonic_speed',
    name: 'Sonic Speed',
    description: 'Complete any challenge in under 30 seconds',
    icon: '🐃',
    category: 'speed_demon' as AchievementCategory,
    type: 'threshold' as AchievementType,
    criteria: {
      type: 'time_limit' as const,
      value: 30,
      timeFrame: 'single_game' as const
    },
    rewards: [
      { type: 'points' as const, value: 250, description: '250 bonus points' },
      { type: 'title' as const, value: 'Speedster', description: 'Speedster Title' }
    ],
    rarity: 'epic' as AchievementRarity,
    tags: ['speed', 'advanced', 'expert']
  },

  // Time Master Category
  DAILY_CHAMPION: {
    id: 'daily_champion',
    name: 'Daily Champion',
    description: 'Complete the daily challenge for 7 consecutive days',
    icon: '👑',
    category: 'daily_champion' as AchievementCategory,
    type: 'streak' as AchievementType,
    criteria: {
      type: 'streak' as const,
      value: 7,
      timeFrame: 'daily' as const,
      challengeType: ['daily_sprint']
    },
    rewards: [
      { type: 'badge' as const, value: 'daily_champion', description: 'Daily Champion Badge' },
      { type: 'avatar' as const, value: 'crown_avatar', description: 'Crown Avatar' }
    ],
    rarity: 'epic' as AchievementRarity,
    tags: ['daily', 'consistency', 'dedication']
  },

  TIME_MASTER: {
    id: 'time_master',
    name: 'Time Master',
    description: 'Achieve top 10 in any time-based leaderboard',
    icon: '⏰',
    category: 'time_master' as AchievementCategory,
    type: 'record_breaker' as AchievementType,
    criteria: {
      type: 'speed_record' as const,
      value: 10,
      condition: 'leaderboard_rank'
    },
    rewards: [
      { type: 'title' as const, value: 'Time Master', description: 'Time Master Title' },
      { type: 'theme' as const, value: 'chrono_theme', description: 'Chrono Theme' }
    ],
    rarity: 'legendary' as AchievementRarity,
    tags: ['leaderboard', 'competition', 'elite']
  },

  // Consistency Warrior Category
  CONSISTENCY_WARRIOR: {
    id: 'consistency_warrior',
    name: 'Consistency Warrior',
    description: 'Complete a challenge with over 95% accuracy for 30 days in a row',
    icon: '🛡️',
    category: 'consistency_warrior' as AchievementCategory,
    type: 'streak' as AchievementType,
    criteria: {
      type: 'streak' as const,
      value: 30,
      condition: 'accuracy_95_percent',
      timeFrame: 'daily' as const
    },
    rewards: [
      { type: 'badge' as const, value: 'consistency_warrior', description: 'Consistency Badge' },
      { type: 'avatar' as const, value: 'warrior_helmet', description: 'Warrior Helmet Avatar' }
    ],
    rarity: 'legendary' as AchievementRarity,
    tags: ['consistency', 'accuracy', 'dedication']
  },

  // Perfectionist Category
  PERFECT_RUN: {
    id: 'perfect_run',
    name: 'Perfect Run',
    description: 'Complete any challenge without using hints and with 100% accuracy',
    icon: '💎',
    category: 'perfectionist' as AchievementCategory,
    type: 'perfect_run' as AchievementType,
    criteria: {
      type: 'perfect_run' as const,
      value: 1,
      condition: 'no_hints_100_accuracy'
    },
    rewards: [
      { type: 'points' as const, value: 500, description: '500 bonus points' },
      { type: 'badge' as const, value: 'perfectionist', description: 'Perfectionist Badge' }
    ],
    rarity: 'epic' as AchievementRarity,
    tags: ['perfection', 'skill', 'no_hints']
  },

  // Marathon Runner Category
  MARATHON_MASTER: {
    id: 'marathon_master',
    name: 'Marathon Master',
    description: 'Complete 50 marathon challenges',
    icon: '🏃‍♂️',
    category: 'marathon_runner' as AchievementCategory,
    type: 'cumulative' as AchievementType,
    criteria: {
      type: 'completion_count' as const,
      value: 50,
      challengeType: ['weekly_marathon']
    },
    rewards: [
      { type: 'title' as const, value: 'Marathoner', description: 'Marathoner Title' },
      { type: 'badge' as const, value: 'marathon_master', description: 'Marathon Master Badge' }
    ],
    rarity: 'legendary' as AchievementRarity,
    tags: ['marathon', 'endurance', 'cumulative']
  },

  // Special Category
  SPEED_RECORD_BREAKER: {
    id: 'speed_record_breaker',
    name: 'Speed Record Breaker',
    description: 'Break a server speed record',
    icon: '🏆',
    category: 'special' as AchievementCategory,
    type: 'record_breaker' as AchievementType,
    criteria: {
      type: 'speed_record' as const,
      value: 1,
      condition: 'break_server_record'
    },
    rewards: [
      { type: 'points' as const, value: 1000, description: '1000 bonus points' },
      { type: 'recognition' as const, value: 'record_breaker', description: 'Server-wide recognition' }
    ],
    rarity: 'mythic' as AchievementRarity,
    isHidden: true,
    tags: ['record', 'special', 'server_wide']
  }
} as const;

// Leaderboard Categories
export const LEADERBOARD_CATEGORIES = {
  OVERALL: 'overall',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CHALLENGE_SPECIFIC: 'challenge_specific',
  COUNTRY: 'country',
  REGION: 'region',
  FRIENDS: 'friends'
} as const;

// Achievement Rarity Colors
export const ACHIEVEMENT_RARITY_COLORS = {
  common: '#808080', // gray
  rare: '#0080FF',   // blue
  epic: '#9933FF',   // purple
  legendary: '#FFD700', // gold
  mythic: '#FF4500'  // red-orange
} as const;

// Achievement Category Icons
export const ACHIEVEMENT_CATEGORY_ICONS = {
  speed_demon: '⚡',
  time_master: '⏰',
  consistency_warrior: '🛡️',
  perfectionist: '💎',
  daily_champion: '👑',
  marathon_runner: '🏃‍♂️',
  accuracy_expert: '🎯',
  rising_star: '⭐',
  legendary: '🏆',
  special: '🌟'
} as const;