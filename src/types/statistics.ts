export interface GameStatistics {
  // 基础统计
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  winRate: number;

  // 连胜统计
  currentStreak: number;
  maxStreak: number;

  // 猜测分布
  guessDistribution: {
    [key: number]: number; // 1-6: 猜测次数 -> 游戏数量
  };

  // 时间统计
  averageTime: number; // 平均每局时间（秒）
  fastestWin: number; // 最快胜利时间
  totalPlayTime: number; // 总游戏时间（秒）

  // 字母统计
  letterStats: {
    [key: string]: {
      correct: number;
      wrong: number;
      totalGuesses: number;
    };
  };

  // 难度统计
  difficultyStats: {
    easy: { played: number; won: number; averageTime: number };
    medium: { played: number; won: number; averageTime: number };
    hard: { played: number; won: number; averageTime: number };
    expert: { played: number; won: number; averageTime: number };
  };

  // 每日挑战统计
  dailyStats: {
    daysPlayed: number;
    daysWon: number;
    bestRank: number;
    averageRank: number;
    currentDayStreak: number;
  };

  // 成就相关
  achievementsUnlocked: number;
  totalAchievements: number;
  completionRate: number;

  // 社交统计
  friendsChallenged: number;
  challengesWon: number;
  challengesLost: number;
  sharedResults: number;

  // 学习进度
  uniqueWordsGuessed: number;
  vocabularySize: number;
  averageHintUsage: number;

  // 时间戳
  firstGameDate: string | null;
  lastGameDate: string | null;

  // 历史记录（最近100局）
  recentGames: GameHistory[];
}

export interface GameHistory {
  id: string;
  date: string;
  mode: 'daily' | 'practice' | 'timed' | 'multiplayer';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  targetWord: string;
  won: boolean;
  attemptsUsed: number;
  timeTaken: number; // 秒
  hintsUsed: number;
  perfectGame: boolean; // 1次猜中
  score: number; // 0-1000
  shared: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'victory' | 'speed' | 'consistency' | 'social' | 'exploration' | 'mastery';
  requirements: {
    type: 'games_won' | 'current_streak' | 'max_streak' | 'average_time' | 'perfect_games' | 'daily_streak' | 'friends_challenged' | 'unique_words' | 'total_time' | 'score_average';
    value: number;
    operator: '>' | '>=' | '=' | '<=';
  };
  reward: {
    points: number;
    title?: string;
    badge?: string;
  };
  unlocked: boolean;
  unlockedDate?: string;
  progress: number; // 0-100
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  level: number;
  experience: number;
  experienceToNext: number;
  title: string;
  joinedDate: string;
  lastActive: string;
  statistics: GameStatistics;
  achievements: Achievement[];
  preferences: UserPreferences;
  isPremium: boolean;
  premiumExpiry?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  colorblindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  animationsEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  language: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  hintsEnabled: boolean;
  autoShareEnabled: boolean;
  notificationsEnabled: boolean;
  friendRequests: 'everyone' | 'friends' | 'none';
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  score: number;
  gamesPlayed: number;
  winRate: number;
  country?: string;
  isFriend: boolean;
  isCurrentUser: boolean;
}

export interface Leaderboard {
  daily: LeaderboardEntry[];
  weekly: LeaderboardEntry[];
  allTime: LeaderboardEntry[];
  friends: LeaderboardEntry[];
  country: LeaderboardEntry[];
  userRank: {
    daily: number;
    weekly: number;
    allTime: number;
    country: number;
  };
}