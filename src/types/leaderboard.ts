export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  country: string;
  countryCode: string;
  score: number;
  gamesPlayed: number;
  winRate: number;
  averageTime: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayed: string;
  level: number;
  achievementsCount: number;
  isFriend: boolean;
  isCurrentUser: boolean;
  isPremium: boolean;
  badges: string[];
}

export interface LeaderboardCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  period: 'daily' | 'weekly' | 'monthly' | 'allTime';
  rankingCriteria: 'score' | 'winRate' | 'streak' | 'speed';
  isActive: boolean;
}

export interface LeaderboardFilters {
  period: 'daily' | 'weekly' | 'monthly' | 'allTime';
  category: 'global' | 'country' | 'friends';
  criteria: 'score' | 'winRate' | 'streak' | 'speed';
  country?: string;
  timeframe?: {
    start: string;
    end: string;
  };
}

export interface LeaderboardStats {
  totalPlayers: number;
  activePlayers: number;
  averageScore: number;
  topScore: number;
  topWinRate: number;
  countries: { [key: string]: number };
  recentActivity: number;
}

export interface PlayerRanking {
  global: {
    daily: number;
    weekly: number;
    monthly: number;
    allTime: number;
  };
  country: {
    daily: number;
    weekly: number;
    monthly: number;
    allTime: number;
  };
  friends: {
    daily: number;
    weekly: number;
    monthly: number;
    allTime: number;
  };
}

export interface LeaderboardUpdate {
  userId: string;
  category: string;
  previousRank: number;
  newRank: number;
  score: number;
  change: 'up' | 'down' | 'same' | 'new';
  timestamp: string;
}

// 预定义排行榜分类
export const LEADERBOARD_CATEGORIES: LeaderboardCategory[] = [
  {
    id: 'daily-score',
    name: '每日积分',
    description: '基于每日游戏积分的排名',
    icon: '🏆',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    period: 'daily',
    rankingCriteria: 'score',
    isActive: true
  },
  {
    id: 'daily-speed',
    name: '每日速度',
    description: '基于每日游戏速度的排名',
    icon: '⚡',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    period: 'daily',
    rankingCriteria: 'speed',
    isActive: true
  },
  {
    id: 'weekly-streak',
    name: '连胜周赛',
    description: '基于最高连胜记录的周排名',
    icon: '🔥',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    period: 'weekly',
    rankingCriteria: 'streak',
    isActive: true
  },
  {
    id: 'weekly-winstreak',
    name: '胜率周赛',
    description: '基于胜率的周排名',
    icon: '📈',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    period: 'weekly',
    rankingCriteria: 'winRate',
    isActive: true
  },
  {
    id: 'monthly-master',
    name: '月度大师',
    description: '综合表现的月度排名',
    icon: '👑',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    period: 'monthly',
    rankingCriteria: 'score',
    isActive: true
  },
  {
    id: 'alltime-legend',
    name: '传奇榜',
    description: '历史最佳排名',
    icon: '⭐',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    period: 'allTime',
    rankingCriteria: 'score',
    isActive: true
  }
];

// 排名变化
export enum RankingChange {
  UP = 'up',
  DOWN = 'down',
  SAME = 'same',
  NEW = 'new'
}

// 国家代码映射
export const COUNTRY_CODES: { [key: string]: string } = {
  'US': 'United States',
  'CN': 'China',
  'JP': 'Japan',
  'GB': 'United Kingdom',
  'DE': 'Germany',
  'FR': 'France',
  'CA': 'Canada',
  'AU': 'Australia',
  'IN': 'India',
  'BR': 'Brazil',
  'RU': 'Russia',
  'KR': 'South Korea',
  'IT': 'Italy',
  'ES': 'Spain',
  'NL': 'Netherlands',
  'SE': 'Sweden',
  'NO': 'Norway',
  'DK': 'Denmark',
  'FI': 'Finland',
  'MX': 'Mexico',
  'AR': 'Argentina',
  'CL': 'Chile',
  'CO': 'Colombia',
  'PE': 'Peru',
  'VE': 'Venezuela',
  'ZA': 'South Africa',
  'EG': 'Egypt',
  'NG': 'Nigeria',
  'KE': 'Kenya',
  'TH': 'Thailand',
  'VN': 'Vietnam',
  'PH': 'Philippines',
  'MY': 'Malaysia',
  'SG': 'Singapore',
  'ID': 'Indonesia',
  'PK': 'Pakistan',
  'BD': 'Bangladesh',
  'TR': 'Turkey',
  'SA': 'Saudi Arabia',
  'IR': 'Iran',
  'IL': 'Israel',
  'AE': 'United Arab Emirates',
  'QA': 'Qatar',
  'KW': 'Kuwait',
  'LB': 'Lebanon',
  'JO': 'Jordan',
  'PL': 'Poland',
  'CZ': 'Czech Republic',
  'AT': 'Austria',
  'CH': 'Switzerland',
  'BE': 'Belgium',
  'IE': 'Ireland',
  'GR': 'Greece',
  'PT': 'Portugal',
  'HU': 'Hungary',
  'RO': 'Romania',
  'UA': 'Ukraine',
  'BY': 'Belarus'
};

// 排行徽章
export const RANKING_BADGES = {
  1: { name: '冠军', icon: '🥇', color: 'text-yellow-500' },
  2: { name: '亚军', icon: '🥈', color: 'text-gray-400' },
  3: { name: '季军', icon: '🥉', color: 'text-orange-600' },
  10: { name: '前十', icon: '⭐', color: 'text-blue-500' },
  25: { name: '前25', icon: '💎', color: 'text-purple-500' },
  50: { name: '前50', icon: '🔥', color: 'text-orange-500' },
  100: { name: '百强', icon: '🏅', color: 'text-green-500' },
  500: { name: '精英', icon: '👑', color: 'text-purple-600' },
  1000: { name: '传奇', icon: '⭐', color: 'text-yellow-600' }
};

// 排名区间颜色
export const getRankingColor = (rank: number): string => {
  if (rank === 1) return 'text-yellow-500 bg-yellow-50 border-yellow-300';
  if (rank === 2) return 'text-gray-400 bg-gray-50 border-gray-300';
  if (rank === 3) return 'text-orange-600 bg-orange-50 border-orange-300';
  if (rank <= 10) return 'text-blue-500 bg-blue-50 border-blue-300';
  if (rank <= 25) return 'text-purple-500 bg-purple-50 border-purple-300';
  if (rank <= 50) return 'text-green-500 bg-green-50 border-green-300';
  if (rank <= 100) return 'text-indigo-500 bg-indigo-50 border-indigo-300';
  return 'text-gray-500 bg-gray-50 border-gray-300';
};

// 排名变化动画
export const getRankingChangeIcon = (change: RankingChange) => {
  switch (change) {
    case RankingChange.UP:
      return { icon: '↑', color: 'text-green-500', label: '上升' };
    case RankingChange.DOWN:
      return { icon: '↓', color: 'text-red-500', label: '下降' };
    case RankingChange.SAME:
      return { icon: '→', color: 'text-gray-500', label: '持平' };
    case RankingChange.NEW:
      return { icon: 'NEW', color: 'text-blue-500', label: '新上榜' };
    default:
      return { icon: '→', color: 'text-gray-500', label: '持平' };
  }
};