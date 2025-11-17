import React, { useState, useMemo, memo, useCallback } from 'react';
import { useSpeedLeaderboard } from '../hooks/useSpeedLeaderboard';
import {
  SpeedLeaderboardEntry,
  TimeBasedAchievement,
  ACHIEVEMENT_RARITY_COLORS,
  ACHIEVEMENT_CATEGORY_ICONS
} from '../types/speedLeaderboard';
import {
  Trophy,
  Clock,
  Target,
  TrendingUp,
  TrendingDown,
  Users,
  Globe,
  Star,
  Award,
  Crown,
  Zap,
  Medal,
  RefreshCw,
  Filter,
  ChevronRight,
  Flag,
  BarChart3,
  Calendar,
  Activity
} from 'lucide-react';

interface SpeedLeaderboardProps {
  playerId: string;
  playerName: string;
  country?: string;
  challengeType?: string;
  compact?: boolean;
  onBack?: () => void;
}

interface LeaderboardEntryProps {
  entry: SpeedLeaderboardEntry;
  isPlayer?: boolean;
  rank: number;
}

const LeaderboardEntry: React.FC<LeaderboardEntryProps> = memo(({ entry, isPlayer, rank }) => {
  const rankColor = useMemo(() => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-600';
  }, [rank]);

  const rankIcon = useMemo(() => {
    if (rank === 1) return <Crown className="w-5 h-5" />;
    if (rank === 2) return <Medal className="w-5 h-5" />;
    if (rank === 3) return <Medal className="w-5 h-5" />;
    return <span className="text-lg font-medium">{rank}</span>;
  }, [rank]);

  const getRankChange = () => {
    if (entry.previousRank && entry.previousRank !== rank) {
      const change = entry.previousRank - rank;
      if (change > 0) {
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      } else if (change < 0) {
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      }
    }
    return null;
  };

  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-200 hover:shadow-md ${
      isPlayer ? 'bg-blue-50 border-2 border-blue-300' : 'bg-white border border-gray-200'
    }`}>
      {/* Rank */}
      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${rankColor} bg-gray-50`}>
        {rankIcon}
      </div>

      {/* Player Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{entry.avatar}</span>
          <div>
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              {entry.playerName}
              {isPlayer && <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">YOU</span>}
              {entry.isNewEntry && <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">NEW</span>}
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Flag className="w-3 h-3" />
                {entry.country}
              </span>
              {entry.streak > 0 && (
                <span className="flex items-center gap-1 text-orange-600">
                  <Zap className="w-3 h-3" />
                  {entry.streak} streak
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="font-mono font-semibold">{entry.time}s</span>
          </div>
          {getRankChange()}
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1 text-gray-600">
            <Target className="w-4 h-4" />
            <span>{entry.accuracy}%</span>
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1 text-gray-600">
            <Star className="w-4 h-4" />
            <span>{entry.score.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

LeaderboardEntry.displayName = 'LeaderboardEntry';

interface AchievementCardProps {
  achievement: TimeBasedAchievement;
  progress?: any;
}

const AchievementCard: React.FC<AchievementCardProps> = memo(({ achievement, progress }) => {
  const rarityColor = ACHIEVEMENT_RARITY_COLORS[achievement.rarity];
  const categoryIcon = ACHIEVEMENT_CATEGORY_ICONS[achievement.category] || '🏆';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 hover:shadow-lg transition-shadow duration-200"
         style={{ borderLeftColor: rarityColor }}>
      <div className="flex items-start gap-3">
        <div className="text-3xl">{categoryIcon}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            {achievement.name}
            <span className="text-xs px-2 py-1 rounded-full text-white font-medium"
                  style={{ backgroundColor: rarityColor }}>
              {achievement.rarity.toUpperCase()}
            </span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>

          {progress && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{progress.current}/{progress.required}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${progress.percentage}%`,
                    backgroundColor: rarityColor
                  }}
                />
              </div>
            </div>
          )}

          {achievement.unlockedAt && (
            <div className="mt-2 text-xs text-green-600 font-medium">
              ✅ Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Rewards */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 mb-2">Rewards:</p>
        <div className="flex flex-wrap gap-2">
          {achievement.rewards.map((reward, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {reward.type === 'points' && `${reward.value} points`}
              {reward.type === 'badge' && '🏆 Badge'}
              {reward.type === 'title' && `🎖️ ${reward.value}`}
              {reward.type === 'avatar' && '👤 Avatar'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

AchievementCard.displayName = 'AchievementCard';

const SpeedLeaderboard: React.FC<SpeedLeaderboardProps> = ({
  playerId,
  playerName,
  country = 'US',
  challengeType,
  compact = false,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'achievements' | 'stats'>('leaderboard');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'daily' | 'weekly' | 'country'>('all');

  const {
    leaderboards,
    selectedLeaderboard,
    playerStats,
    playerAchievements,
    isLoading,
    lastUpdated,
    playerGlobalRank,
    totalPlayers,
    averageTime,
    topPerformers,
    countryRankings,
    setSelectedLeaderboard,
    refreshData,
    hasAchievement,
    getAchievementProgress
  } = useSpeedLeaderboard({
    playerId,
    playerName,
    country,
    challengeType,
    autoRefresh: true,
    refreshInterval: 300 // 5 minutes
  });

  const filteredLeaderboards = useMemo(() => {
    switch (selectedFilter) {
      case 'daily':
        return leaderboards.filter(lb => lb.type === 'daily');
      case 'weekly':
        return leaderboards.filter(lb => lb.type === 'weekly');
      case 'country':
        return leaderboards; // In a real app, this would filter by country
      default:
        return leaderboards;
    }
  }, [leaderboards, selectedFilter]);

  const handleRefresh = useCallback(() => {
    refreshData();
  }, [refreshData]);

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Speed Leaderboard</h3>
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {selectedLeaderboard && (
          <div className="space-y-2">
            {selectedLeaderboard.entries.slice(0, 5).map((entry, index) => (
              <div key={entry.id} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-600">#{index + 1}</span>
                  <span>{entry.avatar}</span>
                  <span className="font-medium">{entry.playerName}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{entry.time}s</span>
                  <span>{entry.score.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Speed Leaderboard</h1>
            <p className="text-gray-600">Compete with players worldwide in time-based challenges!</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow disabled:opacity-50"
              disabled={isLoading}
              title="Refresh data"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Back
              </button>
            )}
          </div>
        </div>

        {/* Player Stats Card */}
        {playerStats && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Your Performance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold">#{playerGlobalRank || '--'}</div>
                <div className="text-sm opacity-90">Global Rank</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{playerStats.bestTime}s</div>
                <div className="text-sm opacity-90">Best Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{playerStats.totalScore.toLocaleString()}</div>
                <div className="text-sm opacity-90">Total Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{playerStats.currentStreak}</div>
                <div className="text-sm opacity-90">Current Streak</div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'leaderboard'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline-block mr-2" />
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'achievements'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Award className="w-4 h-4 inline-block mr-2" />
              Achievements
              <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {playerAchievements.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Activity className="w-4 h-4 inline-block mr-2" />
              Stats
            </button>
          </div>

          <div className="p-6">
            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <div>
                {/* Filters */}
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <div className="flex gap-2">
                    {[
                      { value: 'all', label: 'All' },
                      { value: 'daily', label: 'Daily' },
                      { value: 'weekly', label: 'Weekly' },
                      { value: 'country', label: 'Country' }
                    ].map(filter => (
                      <button
                        key={filter.value}
                        onClick={() => setSelectedFilter(filter.value as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedFilter === filter.value
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Leaderboard Selection */}
                {filteredLeaderboards.length > 1 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Leaderboard:</label>
                    <select
                      value={selectedLeaderboard?.id || ''}
                      onChange={(e) => {
                        const leaderboard = filteredLeaderboards.find(lb => lb.id === e.target.value);
                        if (leaderboard) setSelectedLeaderboard(leaderboard);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {filteredLeaderboards.map(leaderboard => (
                        <option key={leaderboard.id} value={leaderboard.id}>
                          {leaderboard.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Leaderboard Entries */}
                {selectedLeaderboard ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedLeaderboard.name}
                      </h3>
                      <div className="text-sm text-gray-500">
                        {selectedLeaderboard.totalParticipants.toLocaleString()} participants •
                        Updated {new Date(selectedLeaderboard.lastUpdated).toLocaleTimeString()}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {selectedLeaderboard.entries.map((entry, index) => (
                        <LeaderboardEntry
                          key={entry.id}
                          entry={entry}
                          isPlayer={entry.playerId === playerId}
                          rank={index + 1}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading leaderboard...</p>
                  </div>
                )}
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {playerAchievements.length > 0 ? (
                    playerAchievements.map(achievement => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        progress={achievement.progress}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Achievements Yet</h3>
                      <p className="text-gray-600">Complete time challenges to unlock achievements!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && playerStats && (
              <div>
                {/* Performance Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{Math.round(playerStats.averageTime)}s</div>
                    <div className="text-sm text-gray-600">Average Time</div>
                  </div>
                  <div className="text-center">
                    <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{playerStats.accuracy}%</div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{playerStats.totalGamesPlayed}</div>
                    <div className="text-sm text-gray-600">Games Played</div>
                  </div>
                  <div className="text-center">
                    <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{playerStats.bestStreak}</div>
                    <div className="text-sm text-gray-600">Best Streak</div>
                  </div>
                </div>

                {/* Top Performers */}
                {topPerformers.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {topPerformers.slice(0, 6).map((performer, index) => (
                        <div key={performer.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="text-xl font-bold text-gray-600">#{index + 1}</div>
                          <span className="text-2xl">{performer.avatar}</span>
                          <div className="flex-1">
                            <div className="font-medium">{performer.playerName}</div>
                            <div className="text-sm text-gray-500">{performer.time}s • {performer.score.toLocaleString()} pts</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SpeedLeaderboard);