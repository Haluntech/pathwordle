import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  SpeedLeaderboard,
  SpeedLeaderboardEntry,
  PlayerSpeedStats,
  TimeBasedAchievement,
  CountryRanking,
  SPEED_ACHIEVEMENTS,
  ACHIEVEMENT_RARITY_COLORS
} from '../types/speedLeaderboard';

interface UseSpeedLeaderboardProps {
  playerId: string;
  playerName: string;
  country?: string;
  challengeType?: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // in seconds
}

export const useSpeedLeaderboard = ({
  playerId,
  playerName,
  country = 'US',
  challengeType,
  autoRefresh = true,
  refreshInterval = 300 // 5 minutes
}: UseSpeedLeaderboardProps) => {
  // State
  const [leaderboards, setLeaderboards] = useState<SpeedLeaderboard[]>([]);
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<SpeedLeaderboard | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerSpeedStats | null>(null);
  const [playerAchievements, setPlayerAchievements] = useState<TimeBasedAchievement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock data generator for demonstration
  const generateMockLeaderboard = useCallback((type: string): SpeedLeaderboard => {
    const entries: SpeedLeaderboardEntry[] = Array.from({ length: 50 }, (_, index) => {
      const time = Math.random() * 300 + 60; // 60-360 seconds
      const isPlayer = index === Math.floor(Math.random() * 10); // Player in top 10 sometimes

      return {
        id: `entry_${Date.now()}_${index}`,
        playerId: isPlayer ? playerId : `player_${index}`,
        playerName: isPlayer ? playerName : `Player${index + 1}`,
        avatar: `🎮${(index % 20) + 1}`,
        country: ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'BR', 'IN', 'KR'][index % 10],
        time: Math.round(time),
        accuracy: Math.round((Math.random() * 0.3 + 0.7) * 100), // 70-100%
        wordsCompleted: Math.floor(Math.random() * 5 + 5), // 5-10 words
        challengeType: type as any,
        difficulty: ['easy', 'medium', 'hard', 'expert'][Math.floor(Math.random() * 4)] as any,
        score: Math.round(1000 - time * 2 + Math.random() * 200),
        completionDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        rank: index + 1,
        previousRank: index + 1 + Math.floor(Math.random() * 5) - 2,
        isNewEntry: Math.random() > 0.7,
        streak: Math.floor(Math.random() * 30),
        badges: Array.from({ length: Math.floor(Math.random() * 3) }, (_, i) => `badge_${i}`)
      };
    }).sort((a, b) => a.time - b.time).map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    // Calculate top countries
    const countryGroups = entries.reduce((acc, entry) => {
      if (entry.country) {
        if (!acc[entry.country]) {
          acc[entry.country] = {
            country: entry.country,
            countryCode: entry.country,
            totalParticipants: 0,
            averageTime: 0,
            bestTime: entry.time,
            totalScore: 0,
            rank: 0,
            flag: entry.country
          };
        }
        acc[entry.country].totalParticipants++;
        acc[entry.country].averageTime += entry.time;
        acc[entry.country].totalScore += entry.score;
        acc[entry.country].bestTime = Math.min(acc[entry.country].bestTime, entry.time);
      }
      return acc;
    }, {} as Record<string, any>);

    const countryRankings: CountryRanking[] = Object.values(countryGroups)
      .map((country: any) => ({
        ...country,
        averageTime: Math.round(country.averageTime / country.totalParticipants)
      }))
      .sort((a, b) => a.bestTime - b.bestTime)
      .map((country, index) => ({
        ...country,
        rank: index + 1
      }));

    return {
      id: `leaderboard_${type}_${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Leaderboard`,
      description: `Fastest completion times for ${type} challenges`,
      type: type === 'daily' ? 'daily' : 'all_time',
      maxEntries: 100,
      refreshInterval: 5,
      lastUpdated: new Date().toISOString(),
      entries: entries.slice(0, 20), // Top 20
      totalParticipants: entries.length,
      averageTime: Math.round(entries.reduce((sum, entry) => sum + entry.time, 0) / entries.length),
      averageScore: Math.round(entries.reduce((sum, entry) => sum + entry.score, 0) / entries.length),
      topCountries: countryRankings.slice(0, 10),
      categories: [
        {
          id: 'overall',
          name: 'Overall',
          description: 'All participants',
          icon: '🏆',
          color: '#3B82F6',
          isActive: true,
          entries: entries.slice(0, 20),
          stats: {
            totalEntries: entries.length,
            averageTime: Math.round(entries.reduce((sum, entry) => sum + entry.time, 0) / entries.length),
            bestTime: Math.min(...entries.map(e => e.time)),
            participantCount: entries.length,
            completionRate: 0.95
          }
        }
      ]
    };
  }, [playerId, playerName]);

  // Generate mock player stats
  const generatePlayerStats = useCallback((): PlayerSpeedStats => {
    const totalGamesPlayed = Math.floor(Math.random() * 100 + 20);
    const totalTimeSpent = totalGamesPlayed * (Math.random() * 120 + 60);
    const averageTime = totalTimeSpent / totalGamesPlayed;
    const bestTime = Math.random() * 45 + 30; // 30-75 seconds

    return {
      playerId,
      playerName,
      totalTimeSpent: Math.round(totalTimeSpent),
      totalGamesPlayed,
      averageTime: Math.round(averageTime),
      bestTime: Math.round(bestTime),
      currentStreak: Math.floor(Math.random() * 10),
      bestStreak: Math.floor(Math.random() * 30 + 10),
      totalScore: Math.floor(Math.random() * 50000 + 10000),
      averageScore: Math.floor(Math.random() * 500 + 400),
      accuracy: Math.round((Math.random() * 0.3 + 0.7) * 100),
      completionRate: Math.round((Math.random() * 0.2 + 0.8) * 100),
      favoriteChallengeType: ['daily_sprint', 'weekly_marathon', 'speed_demon'][Math.floor(Math.random() * 3)],
      rankHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
        rank: Math.floor(Math.random() * 100 + 1),
        totalParticipants: Math.floor(Math.random() * 1000 + 500),
        percentile: Math.random() * 100,
        challengeType: ['daily_sprint', 'weekly_marathon'][Math.floor(Math.random() * 2)]
      })),
      achievements: [],
      globalRank: Math.floor(Math.random() * 500 + 1),
      countryRank: Math.floor(Math.random() * 100 + 1),
      regionRank: Math.floor(Math.random() * 50 + 1),
      badges: ['speed_demon', 'daily_champion'],
      titles: ['Speedster']
    };
  }, [playerId, playerName]);

  // Initialize data
  useEffect(() => {
    setIsLoading(true);

    const initializeData = async () => {
      try {
        // Load leaderboards
        const leaderboardTypes = ['daily_sprint', 'weekly_marathon', 'speed_demon'];
        const mockLeaderboards = leaderboardTypes.map(type => generateMockLeaderboard(type));
        setLeaderboards(mockLeaderboards);

        // Set default selected leaderboard
        if (mockLeaderboards.length > 0) {
          setSelectedLeaderboard(mockLeaderboards[0]);
        }

        // Load player stats
        const stats = generatePlayerStats();
        setPlayerStats(stats);

        // Load player achievements (check which SPEED_ACHIEVEMENTS are unlocked)
        const unlockedAchievements = Object.values(SPEED_ACHIEVEMENTS)
          .filter(achievement => Math.random() > 0.7) // 30% chance of being unlocked
          .map(achievement => ({
            ...achievement,
            progress: {
              current: Math.floor(Math.random() * achievement.criteria.value),
              required: achievement.criteria.value,
              percentage: Math.floor(Math.random() * 100),
              lastUpdated: new Date().toISOString()
            },
            unlockedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
          }));
        setPlayerAchievements(unlockedAchievements);

      } catch (error) {
        console.error('Failed to initialize speed leaderboard data:', error);
      } finally {
        setIsLoading(false);
        setLastUpdated(new Date());
      }
    };

    initializeData();
  }, [generateMockLeaderboard, generatePlayerStats]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshData();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Data refresh function
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be API calls
      const refreshedLeaderboards = leaderboards.map(board =>
        generateMockLeaderboard(board.name.toLowerCase().replace(' ', '_'))
      );
      setLeaderboards(refreshedLeaderboards);

      if (selectedLeaderboard) {
        const updated = refreshedLeaderboards.find(lb => lb.type === selectedLeaderboard.type);
        if (updated) setSelectedLeaderboard(updated);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [leaderboards, selectedLeaderboard, generateMockLeaderboard]);

  // Get player's rank in a specific leaderboard
  const getPlayerRank = useCallback((leaderboardId: string): number | null => {
    const leaderboard = leaderboards.find(lb => lb.id === leaderboardId);
    if (!leaderboard) return null;

    const playerEntry = leaderboard.entries.find(entry => entry.playerId === playerId);
    return playerEntry ? playerEntry.rank : null;
  }, [leaderboards, playerId]);

  // Check if player has unlocked a specific achievement
  const hasAchievement = useCallback((achievementId: string): boolean => {
    return playerAchievements.some(achievement => achievement.id === achievementId);
  }, [playerAchievements]);

  // Get achievement progress
  const getAchievementProgress = useCallback((achievementId: string) => {
    const achievement = playerAchievements.find(a => a.id === achievementId);
    return achievement?.progress || null;
  }, [playerAchievements]);

  // Get leaderboards by type
  const getLeaderboardsByType = useCallback((type: string): SpeedLeaderboard[] => {
    return leaderboards.filter(lb => lb.type === type || lb.name.toLowerCase().includes(type.toLowerCase()));
  }, [leaderboards]);

  // Get top performers
  const getTopPerformers = useCallback((limit: number = 10): SpeedLeaderboardEntry[] => {
    const allEntries = leaderboards.flatMap(lb => lb.entries);
    const uniquePlayers = new Map<string, SpeedLeaderboardEntry>();

    allEntries.forEach(entry => {
      const existing = uniquePlayers.get(entry.playerId);
      if (!existing || entry.score > existing.score) {
        uniquePlayers.set(entry.playerId, entry);
      }
    });

    return Array.from(uniquePlayers.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }, [leaderboards]);

  // Get country rankings
  const getCountryRankings = useCallback((): CountryRanking[] => {
    const allRankings = leaderboards.flatMap(lb => lb.topCountries);
    const countryMap = new Map<string, CountryRanking>();

    allRankings.forEach(country => {
      const existing = countryMap.get(country.country);
      if (!existing) {
        countryMap.set(country.country, { ...country });
      } else {
        // Aggregate data across leaderboards
        existing.totalParticipants += country.totalParticipants;
        existing.totalScore += country.totalScore;
        existing.bestTime = Math.min(existing.bestTime, country.bestTime);
      }
    });

    return Array.from(countryMap.values())
      .sort((a, b) => a.bestTime - b.bestTime)
      .map((country, index) => ({
        ...country,
        rank: index + 1,
        averageTime: Math.round(country.totalTimeSpent / country.totalGamesPlayed || 0)
      }));
  }, [leaderboards]);

  // Submit score to leaderboard
  const submitScore = useCallback(async (scoreData: {
    time: number;
    accuracy: number;
    wordsCompleted: number;
    challengeType: string;
    difficulty: string;
  }) => {
    try {
      const newEntry: SpeedLeaderboardEntry = {
        id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        playerId,
        playerName,
        avatar: '🎮1',
        country,
        time: scoreData.time,
        accuracy: scoreData.accuracy,
        wordsCompleted: scoreData.wordsCompleted,
        challengeType: scoreData.challengeType as any,
        difficulty: scoreData.difficulty as any,
        score: Math.round(1000 - scoreData.time * 2 + scoreData.accuracy * 5),
        completionDate: new Date().toISOString(),
        rank: 0, // Will be calculated when sorted
        isNewEntry: true,
        streak: 0,
        badges: []
      };

      // Update player stats
      if (playerStats) {
        const updatedStats: PlayerSpeedStats = {
          ...playerStats,
          totalGamesPlayed: playerStats.totalGamesPlayed + 1,
          totalTimeSpent: playerStats.totalTimeSpent + scoreData.time,
          averageTime: Math.round((playerStats.totalTimeSpent + scoreData.time) / (playerStats.totalGamesPlayed + 1)),
          bestTime: Math.min(playerStats.bestTime, scoreData.time),
          totalScore: playerStats.totalScore + newEntry.score,
          accuracy: Math.round((playerStats.accuracy + scoreData.accuracy) / 2)
        };
        setPlayerStats(updatedStats);
      }

      // Check for new achievements
      const newAchievements = checkAchievements(newEntry, playerStats);
      if (newAchievements.length > 0) {
        setPlayerAchievements(prev => [...prev, ...newAchievements]);
      }

      // Refresh leaderboards to include new score
      await refreshData();

      return newEntry;
    } catch (error) {
      console.error('Failed to submit score:', error);
      throw error;
    }
  }, [playerId, playerName, country, playerStats, refreshData]);

  // Check for new achievements based on score
  const checkAchievements = useCallback((entry: SpeedLeaderboardEntry, stats: PlayerSpeedStats | null): TimeBasedAchievement[] => {
    const newAchievements: TimeBasedAchievement[] = [];

    // Check lightning fast achievement
    if (entry.time < 60 && !hasAchievement('lightning_fast')) {
      newAchievements.push({
        ...SPEED_ACHIEVEMENTS.LIGHTNING_FAST,
        progress: {
          current: 1,
          required: 1,
          percentage: 100,
          lastUpdated: new Date().toISOString()
        },
        unlockedAt: new Date().toISOString()
      });
    }

    // Check perfect run achievement
    if (entry.accuracy === 100 && !hasAchievement('perfect_run')) {
      newAchievements.push({
        ...SPEED_ACHIEVEMENTS.PERFECT_RUN,
        progress: {
          current: 1,
          required: 1,
          percentage: 100,
          lastUpdated: new Date().toISOString()
        },
        unlockedAt: new Date().toISOString()
      });
    }

    return newAchievements;
  }, [hasAchievement]);

  return {
    // State
    leaderboards,
    selectedLeaderboard,
    playerStats,
    playerAchievements,
    isLoading,
    lastUpdated,

    // Computed values
    playerGlobalRank: selectedLeaderboard ? getPlayerRank(selectedLeaderboard.id) : null,
    totalPlayers: selectedLeaderboard?.totalParticipants || 0,
    averageTime: selectedLeaderboard?.averageTime || 0,
    topPerformers: getTopPerformers(),
    countryRankings: getCountryRankings(),

    // Methods
    setSelectedLeaderboard,
    refreshData,
    getPlayerRank,
    hasAchievement,
    getAchievementProgress,
    getLeaderboardsByType,
    getTopPerformers,
    getCountryRankings,
    submitScore
  };
};