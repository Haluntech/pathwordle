import { useState, useEffect, useCallback } from 'react';
import { GameStatistics, GameHistory, Achievement, UserProfile } from '../types/statistics';

const STORAGE_KEYS = {
  STATISTICS: 'pathwordle_statistics',
  ACHIEVEMENTS: 'pathwordle_achievements',
  USER_PROFILE: 'pathwordle_user_profile',
  GAME_HISTORY: 'pathwordle_game_history'
} as const;

// 初始统计数据
const getInitialStatistics = (): GameStatistics => ({
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  winRate: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  averageTime: 0,
  fastestWin: Infinity,
  totalPlayTime: 0,
  letterStats: {},
  difficultyStats: {
    easy: { played: 0, won: 0, averageTime: 0 },
    medium: { played: 0, won: 0, averageTime: 0 },
    hard: { played: 0, won: 0, averageTime: 0 },
    expert: { played: 0, won: 0, averageTime: 0 }
  },
  dailyStats: {
    daysPlayed: 0,
    daysWon: 0,
    bestRank: Infinity,
    averageRank: 0,
    currentDayStreak: 0
  },
  achievementsUnlocked: 0,
  totalAchievements: 0,
  completionRate: 0,
  friendsChallenged: 0,
  challengesWon: 0,
  challengesLost: 0,
  sharedResults: 0,
  uniqueWordsGuessed: 0,
  vocabularySize: 0,
  averageHintUsage: 0,
  firstGameDate: null,
  lastGameDate: null,
  recentGames: []
});

// 预定义成就列表
const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // 胜利成就
  {
    id: 'first_win',
    name: '初次胜利',
    description: '赢得你的第一局游戏',
    icon: '🏆',
    rarity: 'common',
    category: 'victory',
    requirements: { type: 'games_won', value: 1, operator: '>=' },
    reward: { points: 10 },
    unlocked: false,
    progress: 0
  },
  {
    id: 'ten_wins',
    name: '新手玩家',
    description: '赢得10局游戏',
    icon: '⭐',
    rarity: 'common',
    category: 'victory',
    requirements: { type: 'games_won', value: 10, operator: '>=' },
    reward: { points: 50, title: '新手' },
    unlocked: false,
    progress: 0
  },
  {
    id: 'hundred_wins',
    name: '熟练玩家',
    description: '赢得100局游戏',
    icon: '💫',
    rarity: 'rare',
    category: 'victory',
    requirements: { type: 'games_won', value: 100, operator: '>=' },
    reward: { points: 200, title: '熟练玩家' },
    unlocked: false,
    progress: 0
  },
  {
    id: 'thousand_wins',
    name: '字谜大师',
    description: '赢得1000局游戏',
    icon: '👑',
    rarity: 'legendary',
    category: 'victory',
    requirements: { type: 'games_won', value: 1000, operator: '>=' },
    reward: { points: 1000, title: '字谜大师' },
    unlocked: false,
    progress: 0
  },

  // 连胜成就
  {
    id: 'streak_5',
    name: '连胜5局',
    description: '连续赢得5局游戏',
    icon: '🔥',
    rarity: 'common',
    category: 'consistency',
    requirements: { type: 'current_streak', value: 5, operator: '>=' },
    reward: { points: 30 },
    unlocked: false,
    progress: 0
  },
  {
    id: 'streak_20',
    name: '连胜大师',
    description: '连续赢得20局游戏',
    icon: '🔥🔥',
    rarity: 'epic',
    category: 'consistency',
    requirements: { type: 'current_streak', value: 20, operator: '>=' },
    reward: { points: 150, title: '连胜大师' },
    unlocked: false,
    progress: 0
  },

  // 速度成就
  {
    id: 'speed_demon',
    name: '极速玩家',
    description: '在30秒内赢得一局游戏',
    icon: '⚡',
    rarity: 'rare',
    category: 'speed',
    requirements: { type: 'average_time', value: 30, operator: '<=' },
    reward: { points: 75 },
    unlocked: false,
    progress: 0
  },
  {
    id: 'perfect_game',
    name: '完美胜利',
    description: '一次猜测就找到答案',
    icon: '🎯',
    rarity: 'epic',
    category: 'victory',
    requirements: { type: 'perfect_games', value: 1, operator: '>=' },
    reward: { points: 100 },
    unlocked: false,
    progress: 0
  },

  // 探索成就
  {
    id: 'word_collector',
    name: '词汇收集者',
    description: '猜出100个不同的单词',
    icon: '📚',
    rarity: 'rare',
    category: 'exploration',
    requirements: { type: 'unique_words', value: 100, operator: '>=' },
    reward: { points: 120, title: '学者' },
    unlocked: false,
    progress: 0
  },
  {
    id: 'marathon_player',
    name: '马拉松玩家',
    description: '总游戏时间超过24小时',
    icon: '⏰',
    rarity: 'epic',
    category: 'mastery',
    requirements: { type: 'total_time', value: 86400, operator: '>=' },
    reward: { points: 180 },
    unlocked: false,
    progress: 0
  }
];

export const useStatistics = () => {
  const [statistics, setStatistics] = useState<GameStatistics>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.STATISTICS);
      return stored ? JSON.parse(stored) : getInitialStatistics();
    }
    return getInitialStatistics();
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return stored ? JSON.parse(stored) : INITIAL_ACHIEVEMENTS;
    }
    return INITIAL_ACHIEVEMENTS;
  });

  const [newUnlockedAchievements, setNewUnlockedAchievements] = useState<Achievement[]>([]);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  // 检查成就解锁
  const checkAchievements = useCallback((newStats: GameStatistics) => {
    const updatedAchievements = achievements.map(achievement => {
      if (achievement.unlocked) return achievement;

      let progress = 0;
      let unlocked = false;

      switch (achievement.requirements.type) {
        case 'games_won':
          progress = (newStats.gamesWon / achievement.requirements.value) * 100;
          unlocked = newStats.gamesWon >= achievement.requirements.value;
          break;
        case 'current_streak':
          progress = (newStats.currentStreak / achievement.requirements.value) * 100;
          unlocked = newStats.currentStreak >= achievement.requirements.value;
          break;
        case 'max_streak':
          progress = (newStats.maxStreak / achievement.requirements.value) * 100;
          unlocked = newStats.maxStreak >= achievement.requirements.value;
          break;
        case 'average_time':
          progress = Math.max(0, 100 - ((newStats.averageTime / achievement.requirements.value) * 100));
          unlocked = newStats.averageTime <= achievement.requirements.value;
          break;
        case 'perfect_games':
          const perfectGames = newStats.guessDistribution[1] || 0;
          progress = (perfectGames / achievement.requirements.value) * 100;
          unlocked = perfectGames >= achievement.requirements.value;
          break;
        case 'unique_words':
          progress = (newStats.uniqueWordsGuessed / achievement.requirements.value) * 100;
          unlocked = newStats.uniqueWordsGuessed >= achievement.requirements.value;
          break;
        case 'total_time':
          progress = (newStats.totalPlayTime / achievement.requirements.value) * 100;
          unlocked = newStats.totalPlayTime >= achievement.requirements.value;
          break;
      }

      if (unlocked && !achievement.unlocked) {
        return {
          ...achievement,
          unlocked: true,
          unlockedDate: new Date().toISOString(),
          progress: 100
        };
      }

      return {
        ...achievement,
        progress: Math.min(100, Math.max(0, progress))
      };
    });

    setAchievements(updatedAchievements);

    // 更新统计数据中的成就数量
    const unlockedCount = updatedAchievements.filter(a => a.unlocked).length;
    setStatistics(prev => ({
      ...prev,
      achievementsUnlocked: unlockedCount,
      completionRate: (unlockedCount / updatedAchievements.length) * 100
    }));

    // 返回新解锁的成就
    return updatedAchievements.filter(a =>
      a.unlocked && !achievements.find(prev => prev.id === a.id)?.unlocked
    );
  }, [achievements]);

  // 记录游戏结果
  const recordGame = useCallback((gameData: {
    won: boolean;
    attemptsUsed: number;
    timeTaken: number;
    targetWord: string;
    mode: 'daily' | 'practice' | 'timed' | 'multiplayer';
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    hintsUsed: number;
    score: number;
  }) => {
    const gameHistory: GameHistory = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...gameData,
      perfectGame: gameData.attemptsUsed === 1 && gameData.won,
      shared: false
    };

    setStatistics(prev => {
      const newStats = { ...prev };
      const now = new Date().toISOString();

      // 基础统计更新
      newStats.gamesPlayed++;
      if (gameData.won) {
        newStats.gamesWon++;
        newStats.currentStreak++;
        newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak);
      } else {
        newStats.gamesLost++;
        newStats.currentStreak = 0;
      }

      newStats.winRate = (newStats.gamesWon / newStats.gamesPlayed) * 100;

      // 猜测分布
      if (gameData.won && gameData.attemptsUsed >= 1 && gameData.attemptsUsed <= 6) {
        newStats.guessDistribution[gameData.attemptsUsed]++;
      }

      // 时间统计
      newStats.totalPlayTime += gameData.timeTaken;
      newStats.averageTime = newStats.totalPlayTime / newStats.gamesPlayed;
      if (gameData.won && gameData.timeTaken < newStats.fastestWin) {
        newStats.fastestWin = gameData.timeTaken;
      }

      // 难度统计
      const diffStats = newStats.difficultyStats[gameData.difficulty];
      diffStats.played++;
      if (gameData.won) {
        diffStats.won++;
      }
      diffStats.averageTime = ((diffStats.averageTime * (diffStats.played - 1)) + gameData.timeTaken) / diffStats.played;

      // 字母统计
      // 这里可以根据游戏中的字母使用情况进行统计

      // 唯一单词统计
      if (!newStats.recentGames.some(g => g.targetWord === gameData.targetWord)) {
        newStats.uniqueWordsGuessed++;
      }

      // 时间戳
      if (!newStats.firstGameDate) {
        newStats.firstGameDate = now;
      }
      newStats.lastGameDate = now;

      // 历史记录（保留最近100局）
      newStats.recentGames = [gameHistory, ...newStats.recentGames.slice(0, 99)];

      // 检查成就 - 在设置统计之前进行检查
      const newlyUnlocked = checkAchievements(newStats);

      // 如果有新成就解锁，设置到状态中供通知组件使用
      if (newlyUnlocked.length > 0) {
        setNewUnlockedAchievements(prev => [...prev, ...newlyUnlocked]);
        console.log('新成就解锁:', newlyUnlocked);
      }

      return newStats;
    });

    return gameHistory;
  }, [statistics, checkAchievements]);

  // 分享游戏结果
  const shareResult = useCallback((gameId: string) => {
    setStatistics(prev => {
      const newStats = { ...prev };
      newStats.sharedResults++;

      // 更新历史记录中的分享状态
      const gameIndex = newStats.recentGames.findIndex(g => g.id === gameId);
      if (gameIndex !== -1) {
        newStats.recentGames[gameIndex].shared = true;
      }

      return newStats;
    });
  }, []);

  // 重置统计数据
  const resetStatistics = useCallback(() => {
    setStatistics(getInitialStatistics());
    setAchievements(INITIAL_ACHIEVEMENTS);

    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.STATISTICS);
      localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    }
  }, []);

  // 获取统计摘要
  const getStatisticsSummary = useCallback(() => {
    return {
      gamesPlayed: statistics.gamesPlayed,
      winRate: Math.round(statistics.winRate),
      currentStreak: statistics.currentStreak,
      maxStreak: statistics.maxStreak,
      averageTime: Math.round(statistics.averageTime),
      fastestWin: statistics.fastestWin === Infinity ? 0 : Math.round(statistics.fastestWin),
      achievementsUnlocked: statistics.achievementsUnlocked,
      completionRate: Math.round(statistics.completionRate)
    };
  }, [statistics]);

  // 持久化到localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(statistics));
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
      if (userProfile) {
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
      }
    }
  }, [statistics, achievements, userProfile]);

  // 清除已显示的新成就
  const clearNewAchievements = useCallback(() => {
    setNewUnlockedAchievements([]);
  }, []);

  // 获取下一个要显示的新成就
  const getNextAchievement = useCallback((): Achievement | null => {
    return newUnlockedAchievements.length > 0 ? newUnlockedAchievements[0] : null;
  }, [newUnlockedAchievements]);

  return {
    statistics,
    achievements,
    userProfile,
    newUnlockedAchievements,
    recordGame,
    shareResult,
    resetStatistics,
    getStatisticsSummary,
    setStatistics,
    setUserProfile,
    clearNewAchievements,
    getNextAchievement
  };
};