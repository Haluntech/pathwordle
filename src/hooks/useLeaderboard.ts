import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  LeaderboardEntry,
  LeaderboardCategory,
  LeaderboardFilters,
  LeaderboardStats,
  PlayerRanking,
  LeaderboardUpdate,
  LEADERBOARD_CATEGORIES,
  COUNTRY_CODES,
  getRankingColor,
  getRankingChangeIcon,
  RankingChange
} from '../types/leaderboard';

interface MockUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  country: string;
  countryCode: string;
  level: number;
  achievementsCount: number;
  isPremium: boolean;
  badges: string[];
}

// 模拟数据生成器
class MockDataGenerator {
  private static readonly FIRST_NAMES = [
    'Alex', 'Emma', 'Oliver', 'Sophia', 'Lucas', 'Mia', 'Noah', 'Isabella',
    'William', 'Ava', 'James', 'Charlotte', 'Benjamin', 'Emily', 'Henry', 'Amelia',
    'Alexander', 'Harper', 'Michael', 'Evelyn', 'Ethan', 'Abigail', 'Daniel', 'Madison',
    'Matthew', 'Chloe', 'Joseph', 'Grace', 'David', 'Zoey', 'Samuel', 'Lily',
    'Christopher', 'Addison', 'Jackson', 'Layla', 'Sebastian', 'Natalie', 'Owen', 'Aria'
  ];

  private static readonly LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White',
    'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
    'Hall', 'Allen', 'Torres', 'King', 'Scott', 'Wright', 'Lopez', 'Hill', 'Scott',
    'Green', 'Adams', 'Baker', 'Nelson', 'Carter', 'Mitchell', 'Roberts', 'Turner'
  ];

  private static readonly COUNTRY_WEIGHTS = {
    'US': 0.35,
    'CN': 0.20,
    'JP': 0.08,
    'GB': 0.06,
    'DE': 0.05,
    'FR': 0.04,
    'CA': 0.03,
    'AU': 0.02,
    'IN': 0.06,
    'BR': 0.02,
    'RU': 0.02,
    'KR': 0.03,
    'IT': 0.02,
    'ES': 0.02,
    'NL': 0.01,
    'SE': 0.01,
    'NO': 0.01,
    'DK': 0.01,
    'FI': 0.01,
    'MX': 0.02,
    'AR': 0.01,
    'CL': 0.01,
    'CO': 0.01,
    'PE': 0.01,
    'VE': 0.01,
    'ZA': 0.01,
    'EG': 0.01,
    'NG': 0.01,
    'TH': 0.01,
    'VN': 0.01,
    'PH': 0.01,
    'MY': 0.01,
    'SG': 0.01,
    'ID': 0.01,
    'PK': 0.01,
    'BD': 0.01,
    'TR': 0.01,
    'SA': 0.01,
    'IR': 0.01,
    'AE': 0.01,
    'PL': 0.01,
    'CZ': 0.01,
    'AT': 0.01,
    'CH': 0.01,
    'BE': 0.01,
    'IE': 0.01,
    'GR': 0.01,
    'PT': 0.01,
    'HU': 0.01,
    'RO': 0.01,
    'UA': 0.01,
    'BY': 0.01
  };

  private static readonly BADGE_OPTIONS = [
    '🏆 优胜者', '⭐ 明星玩家', '🔥 连胜达人', '⚡ 速度之王',
    '🎯 精准射手', '🧠 智慧大师', '📚 学者', '💪 勤士',
    '🏅 冠军', '🎮 游戏达人', '🌟 新秀', '💎 精英',
    '👑 传奇', '🎖️ 大师', '🥇 冠军', '🥈 亚军',
    '🥉 季军', '💯 完美', '⏰ 时间管理', '🔄 坚持不懈'
  ];

  private static readonly AVATARS = [
    '🦊', '🦝', '🦘', '🦒', '🦫', '🦭', '🦮', '🦯', '🦰',
    '🐱', '🐻', '🐨', '🐼', '🐽', '🐾', '🐿', '🦀', '🦈',
    '🦁', '🐯', '🐷', '🐽', '🐸', '🐺', '🦃', '🐻', '🦝',
    '🐮', '🦄', '🦋', '🦌', '🦏', '🐒', '🦚', '🦙', '🐔',
    '🦉', '🦊', '🦝', '🦘', '🦫', '🦭', '🦮', '🦯', '🦰'
  ];

  static generateMockUsers(count: number): MockUser[] {
    const users: MockUser[] = [];

    for (let i = 0; i < count; i++) {
      const firstName = this.FIRST_NAMES[Math.floor(Math.random() * this.FIRST_NAMES.length)];
      const lastName = this.LAST_NAMES[Math.floor(Math.random() * this.LAST_NAMES.length)];
      const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${i}`;
      const displayName = `${firstName} ${lastName}`;

      // 根据权重选择国家
      const random = Math.random();
      let cumulative = 0;
      let selectedCountry = 'US';
      let selectedCountryCode = 'US';

      for (const [code, weight] of Object.entries(this.COUNTRY_WEIGHTS)) {
        cumulative += weight;
        if (random <= cumulative) {
          selectedCountry = code;
          selectedCountryCode = code;
          break;
        }
      }

      users.push({
        id: `user_${i + 1}`,
        username,
        displayName,
        avatar: this.AVATARS[Math.floor(Math.random() * this.AVATARS.length)],
        country: COUNTRY_CODES[selectedCountry] || selectedCountry,
        countryCode: selectedCountryCode,
        level: Math.floor(Math.random() * 50) + 1,
        achievementsCount: Math.floor(Math.random() * 20) + 5,
        isPremium: Math.random() < 0.1, // 10% premium
        badges: this.generateRandomBadges()
      });
    }

    return users;
  }

  private static generateRandomBadges(): string[] {
    const badgeCount = Math.floor(Math.random() * 4);
    const badges: string[] = [];

    for (let i = 0; i < badgeCount; i++) {
      const badge = this.BADGE_OPTIONS[Math.floor(Math.random() * this.BADGE_OPTIONS.length)];
      if (!badges.includes(badge)) {
        badges.push(badge);
      }
    }

    return badges;
  }

  static generateLeaderboardEntries(
    users: MockUser[],
    category: LeaderboardCategory
  ): LeaderboardEntry[] {
    const entries: LeaderboardEntry[] = users.map((user, index) => {
      const baseScore = 1000 + Math.floor(Math.random() * 5000);
      let score = baseScore;
      let winRate = 0.3 + Math.random() * 0.6; // 30% - 90%
      let averageTime = 60 + Math.random() * 180; // 1-4 minutes
      let currentStreak = Math.floor(Math.random() * 10);
      let maxStreak = currentStreak + Math.floor(Math.random() * 10);

      // 根据标准调整分数
      switch (category.rankingCriteria) {
        case 'score':
          score = baseScore + Math.floor(Math.random() * 2000);
          break;
        case 'winRate':
          winRate = 0.5 + Math.random() * 0.5;
          score = Math.floor(winRate * 10000);
          break;
        case 'streak':
          currentStreak = Math.floor(Math.random() * 20);
          maxStreak = currentStreak + Math.floor(Math.random() * 10);
          score = currentStreak * 500 + Math.floor(Math.random() * 2000);
          break;
        case 'speed':
          averageTime = 30 + Math.random() * 90; // 30-120 seconds
          score = Math.max(1000 - averageTime * 5, 100) + Math.floor(Math.random() * 1000);
          break;
      }

      // 添加随机变化
      score += Math.floor((Math.random() - 0.5) * 200);

      return {
        rank: index + 1,
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        country: user.country,
        countryCode: user.countryCode,
        score: Math.max(score, 100),
        gamesPlayed: Math.floor(Math.random() * 200) + 10,
        winRate: Math.min(winRate, 1),
        averageTime,
        currentStreak,
        maxStreak,
        lastPlayed: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(), // Last 7 days
        level: user.level,
        achievementsCount: user.achievementsCount,
        isFriend: Math.random() < 0.1, // 10% chance of being friend
        isCurrentUser: false,
        isPremium: user.isPremium,
        badges: user.badges
      };
    });

    // 根据分数排序
    return entries.sort((a, b) => {
      switch (category.rankingCriteria) {
        case 'score':
          return b.score - a.score;
        case 'winRate':
          return b.winRate - a.winRate;
        case 'streak':
          return b.maxStreak - a.maxStreak;
        case 'speed':
          return a.averageTime - b.averageTime; // Lower time is better
        default:
          return b.score - a.score;
      }
    }).map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  }

  static generateStats(entries: LeaderboardEntry[]): LeaderboardStats {
    const activeUsers = entries.filter(user => {
      const lastPlayed = new Date(user.lastPlayed);
      const daysSinceLastPlayed = (Date.now() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceLastPlayed <= 7; // Active in last 7 days
    });

    const countryCounts: { [key: string]: number } = {};
    entries.forEach(entry => {
      countryCounts[entry.countryCode] = (countryCounts[entry.countryCode] || 0) + 1;
    });

    return {
      totalPlayers: entries.length,
      activePlayers: activeUsers.length,
      averageScore: Math.floor(
        entries.reduce((sum, entry) => sum + entry.score, 0) / entries.length
      ),
      topScore: Math.max(...entries.map(entry => entry.score)),
      topWinRate: Math.max(...entries.map(entry => entry.winRate)),
      countries: countryCounts,
      recentActivity: activeUsers.filter(user => {
        const lastPlayed = new Date(user.lastPlayed);
        return (Date.now() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24) <= 1; // Active today
      }).length
    };
  }
}

export const useLeaderboard = () => {
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [currentRanking, setCurrentRanking] = useState<PlayerRanking>({
    global: { daily: 0, weekly: 0, monthly: 0, allTime: 0 },
    country: { daily: 0, weekly: 0, monthly: 0, allTime: 0 },
    friends: { daily: 0, weekly: 0, monthly: 0, allTime: 0 }
  });
  const [stats, setStats] = useState<LeaderboardStats>({
    totalPlayers: 0,
    activePlayers: 0,
    averageScore: 0,
    topScore: 0,
    topWinRate: 0,
    countries: {},
    recentActivity: 0
  });
  const [filters, setFilters] = useState<LeaderboardFilters>({
    period: 'daily',
    category: 'global',
    criteria: 'score'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toISOString());

  // 模拟当前用户ID
  const currentUserId = useMemo(() => 'user_1', []);

  // 初始化数据
  useEffect(() => {
    const mockUsers = MockDataGenerator.generateMockUsers(1000);
    const category = LEADERBOARD_CATEGORIES.find(
      cat => cat.id === 'daily-score'
    ) || LEADERBOARD_CATEGORIES[0];

    const entries = MockDataGenerator.generateLeaderboardEntries(mockUsers, category);
    const leaderboardStats = MockDataGenerator.generateStats(entries);

    setLeaderboardEntries(entries);
    setStats(leaderboardStats);

    // 设置当前用户排名
    const userEntry = entries.find(entry => entry.userId === currentUserId);
    if (userEntry) {
      setCurrentRanking(prev => ({
        ...prev,
        global: {
          ...prev.global,
          daily: userEntry.rank,
          weekly: userEntry.rank,
          monthly: userEntry.rank,
          allTime: userEntry.rank
        }
      }));
    }
  }, [currentUserId]);

  // 切换排行榜分类
  const switchCategory = useCallback((category: LeaderboardCategory) => {
    setIsLoading(true);

    // 模拟API调用延迟
    setTimeout(() => {
      const mockUsers = MockDataGenerator.generateMockUsers(1000);
      const entries = MockDataGenerator.generateLeaderboardEntries(mockUsers, category);

      // 应用过滤器
      let filteredEntries = entries;

      if (filters.category === 'country' && filters.country) {
        filteredEntries = entries.filter(entry => entry.countryCode === filters.country);
      }

      setLeaderboardEntries(filteredEntries);

      const newStats = MockDataGenerator.generateStats(filteredEntries);
      setStats(newStats);
      setLastUpdate(new Date().toISOString());
      setIsLoading(false);
    }, 300);
  }, [filters]);

  // 更新过滤器
  const updateFilters = useCallback((newFilters: Partial<LeaderboardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // 获取特定类别的排行榜
  const getLeaderboardByCategory = useCallback((categoryId: string) => {
    const category = LEADERBOARD_CATEGORIES.find(cat => cat.id === categoryId);
    if (!category) return [];

    setIsLoading(true);
    switchCategory(category);
    return leaderboardEntries;
  }, [leaderboardEntries, switchCategory]);

  // 获取用户排名变化
  const getRankingChanges = useCallback((): LeaderboardUpdate[] => {
    // 模拟排名变化
    const changes: LeaderboardUpdate[] = [];
    const currentCategory = LEADERBOARD_CATEGORIES.find(
      cat => cat.id === `${filters.period}-${filters.criteria}`
    );

    if (currentCategory && currentRanking.global[filters.period] > 0) {
      const previousRank = currentRanking.global[filters.period];
      const newRank = currentRanking.global[filters.period];

      if (previousRank !== newRank) {
        changes.push({
          userId: currentUserId,
          category: currentCategory.id,
          previousRank,
          newRank,
          score: 0,
          change: previousRank > newRank ? RankingChange.UP :
                   previousRank < newRank ? RankingChange.DOWN :
                   RankingChange.SAME,
          timestamp: new Date().toISOString()
        });
      }
    }

    return changes;
  }, [currentRanking, filters, currentUserId]);

  // 刷新排行榜
  const refreshLeaderboard = useCallback(() => {
    const currentCategory = LEADERBOARD_CATEGORIES.find(
      cat => cat.id === `${filters.period}-${filters.criteria}`
    ) || LEADERBOARD_CATEGORIES[0];

    switchCategory(currentCategory);
  }, [filters]);

  // 自动刷新 (每分钟)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshLeaderboard();
    }, 60000); // 1分钟

    return () => clearInterval(interval);
  }, [refreshLeaderboard]);

  return {
    leaderboardEntries,
    currentRanking,
    stats,
    filters,
    isLoading,
    lastUpdate,
    getLeaderboardByCategory,
    updateFilters,
    refreshLeaderboard,
    getRankingChanges,
    LEADERBOARD_CATEGORIES
  };
};