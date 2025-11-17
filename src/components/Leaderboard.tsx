import React, { useState, memo, useCallback } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import {
  LeaderboardEntry,
  LeaderboardCategory,
  getRankingColor,
  getRankingChangeIcon,
  RankingChange
} from '../types/leaderboard';
import {
  Trophy,
  Globe,
  Users,
  TrendingUp,
  Clock,
  Star,
  Crown,
  Medal,
  ChevronRight,
  Filter,
  RefreshCw,
  User,
  Flag,
  Zap,
  Flame
} from 'lucide-react';

interface LeaderboardProps {
  className?: string;
  compact?: boolean;
  showUserRanking?: boolean;
  maxEntries?: number;
}

interface LeaderboardEntryProps {
  entry: LeaderboardEntry;
  index: number;
  isCurrentUser: boolean;
  showCountry?: boolean;
  showRankingChange?: boolean;
  previousRank?: number;
  compact?: boolean;
}

const LeaderboardEntryComponent: React.FC<LeaderboardEntryProps> = ({
  entry,
  index,
  isCurrentUser,
  showCountry = true,
  showRankingChange = true,
  previousRank,
  compact = false
}) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5" />;
    if (rank === 2) return <Medal className="w-5 h-5" />;
    if (rank === 3) return <Medal className="w-5 h-5" />;
    if (rank <= 10) return <Star className="w-4 h-4" />;
    return null;
  };

  const rankingColor = getRankingColor(entry.rank);
  const getBadgeColor = (badge: string) => {
    if (badge.includes('🏆')) return 'bg-yellow-100 text-yellow-700';
    if (badge.includes('⭐')) return 'bg-blue-100 text-blue-700';
    if (badge.includes('🔥')) return 'bg-orange-100 text-orange-700';
    if (badge.includes('⚡')) return 'bg-purple-100 text-purple-700';
    if (badge.includes('💎')) return 'bg-indigo-100 text-indigo-700';
    return 'bg-gray-100 text-gray-700';
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  };

  if (compact) {
    return (
      <div
        className={`
          flex items-center gap-3 p-3 rounded-lg border-2 transition-all
          ${isCurrentUser ? `${rankingColor} border-4 scale-105` : 'border-gray-200 hover:border-gray-300'}
        `}
      >
        <div className="flex items-center gap-2">
          {getRankIcon(entry.rank)}
          <span className={`font-bold text-lg ${rankingColor.split(' ')[0]}`}>
            #{entry.rank}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xl font-medium truncate" title={entry.displayName}>
              {entry.displayName}
            </span>
            {entry.isPremium && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                VIP
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="font-semibold text-gray-800">{entry.score}</span>
            {showCountry && (
              <span className="flex items-center gap-1">
                <Flag className="w-4 h-4" />
                {entry.countryCode}
              </span>
            )}
          </div>
        </div>

        <div className="text-right text-sm">
          <div className="text-gray-600">{entry.gamesPlayed}局</div>
          <div className="text-gray-600">{Math.round(entry.winRate * 100)}%</div>
        </div>
      </div>
    );
  }

  const rankingChange = showRankingChange && previousRank ? getRankingChangeIcon(
    previousRank > entry.rank ? RankingChange.UP :
    previousRank < entry.rank ? RankingChange.DOWN :
    RankingChange.SAME
  ) : null;

  return (
    <div
      className={`
        flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200
        ${isCurrentUser ? `${rankingColor} border-4 scale-105 shadow-lg` : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}
      ${isCurrentUser ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
      `}
    >
      {/* 排名 */}
      <div className="flex items-center gap-3">
        {getRankIcon(entry.rank)}
        <div>
          <div className={`font-bold text-xl ${rankingColor.split(' ')[0]}`}>
            #{entry.rank}
          </div>
          {rankingChange && (
            <div className={`flex items-center gap-1 text-xs ${rankingChange.color}`}>
              <span>{rankingChange.icon}</span>
              {rankingChange.label}
            </div>
          )}
        </div>
      </div>

      {/* 玩家信息 */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* 头像 */}
        <div className="text-2xl">{entry.avatar}</div>

        <div className="flex-1 min-w-0">
          {/* 名称和徽章 */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-800 truncate" title={entry.displayName}>
              {entry.displayName}
            </span>
            {entry.isPremium && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                VIP
              </span>
            )}
            {entry.level >= 50 && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                L{entry.level}
              </span>
            )}
          </div>

          {/* 国家 */}
          {showCountry && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Flag className="w-4 h-4" />
              <span>{entry.country}</span>
            </div>
          )}

          {/* 徽章 */}
          {entry.badges.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {entry.badges.slice(0, 2).map((badge, index) => (
                <span
                  key={index}
                  className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(badge)}`}
                >
                  {badge}
                </span>
              ))}
              {entry.badges.length > 2 && (
                <span className="text-xs text-gray-500">+{entry.badges.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 统计数据 */}
      <div className="text-right">
        <div className="text-2xl font-bold text-gray-800">{entry.score.toLocaleString()}</div>
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex items-center justify-end gap-1">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>{entry.gamesPlayed}</span>
          </div>
          <div className="flex items-center justify-end gap-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{entry.maxStreak}</span>
          </div>
          {entry.averageTime < 120 && (
            <div className="flex items-center justify-end gap-1">
              <Zap className="w-4 h-4 text-purple-500" />
              <span>{formatTime(entry.averageTime)}</span>
            </div>
          )}
          <div className="flex items-center justify-end gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>{Math.round(entry.winRate * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

LeaderboardEntryComponent.displayName = 'LeaderboardEntryComponent';

const Leaderboard: React.FC<LeaderboardProps> = ({
  className = '',
  compact = false,
  showUserRanking = true,
  maxEntries = 50
}) => {
  const {
    leaderboardEntries,
    currentRanking,
    stats,
    filters,
    isLoading,
    lastUpdate,
    updateFilters,
    refreshLeaderboard,
    getLeaderboardByCategory,
    LEADERBOARD_CATEGORIES
  } = useLeaderboard();

  const [selectedCategory, setSelectedCategory] = useState<string>('daily-score');
  const [showFilters, setShowFilters] = useState(false);

  const displayedEntries = leaderboardEntries.slice(0, maxEntries);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    const [period, criteria] = categoryId.split('-');
    updateFilters({
      period: period as any,
      criteria: criteria as any
    });
    getLeaderboardByCategory(categoryId);
  }, [updateFilters, getLeaderboardByCategory]);

  const formatLastUpdate = useCallback((timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return '刚刚更新';
    if (diffMins < 60) return `${diffMins}分钟前`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}小时前`;
    return date.toLocaleDateString();
  }, []);

  const currentUserId = 'user_1'; // 模拟当前用户ID

  return (
    <div className={`bg-white rounded-xl shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-800">全球排行榜</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshLeaderboard}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              aria-label="刷新排行榜"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="筛选选项"
            >
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* 分类选择器 */}
        <div className="flex flex-wrap gap-2">
          {LEADERBOARD_CATEGORIES
            .filter(cat => cat.isActive)
            .map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${selectedCategory === category.id
                    ? `${category.bgColor} ${category.color} border-2 ${category.borderColor}`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                  }
                >
                  <span className="mr-2">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
            ))}
        </div>

        {/* 筛选器 */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">筛选选项</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">时间范围</label>
                <select
                  value={filters.period}
                  onChange={(e) => updateFilters({ period: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="daily">今日</option>
                  <option value="weekly">本周</option>
                  <option value="monthly">本月</option>
                  <option value="allTime">总榜</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排名标准</label>
                <select
                  value={filters.criteria}
                  onChange={(e) => updateFilters({ criteria: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="score">积分</option>
                  <option value="winRate">胜率</option>
                  <option value="streak">连胜</option>
                  <option value="speed">速度</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">地区</label>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilters({ category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="global">全球</option>
                  <option value="country">国家</option>
                  <option value="friends">好友</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 统计信息 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600">总玩家:</span>
            <span className="font-semibold text-gray-800">{stats.totalPlayers.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">活跃玩家:</span>
            <span className="font-semibold text-gray-800">{stats.activePlayers.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-600">最高分:</span>
            <span className="font-semibold text-gray-800">{stats.topScore.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-500" />
            <span className="text-gray-600">更新时间:</span>
            <span className="font-semibold text-gray-800">{formatLastUpdate(lastUpdate)}</span>
          </div>
        </div>
      </div>

      {/* 用户排名 */}
      {showUserRanking && (
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700 font-medium">您的排名</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-gray-600">今日:</span>
                <span className="font-bold text-gray-800 ml-1">#{currentRanking.global.daily}</span>
              </div>
              <div>
                <span className="text-gray-600">本周:</span>
                <span className="font-bold text-gray-800 ml-1">#{currentRanking.global.weekly}</span>
              </div>
              <div>
                <span className="text-gray-600">总榜:</span>
                <span className="font-bold text-gray-800 ml-1">#{currentRanking.global.allTime}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 排行榜列表 */}
      <div className="p-6 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
              <p className="text-gray-600">加载排行榜中...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedEntries.map((entry, index) => (
              <LeaderboardEntryComponent
                key={entry.userId}
                entry={entry}
                index={index}
                isCurrentUser={entry.userId === currentUserId}
                showCountry={filters.category === 'global' || filters.category === 'country'}
                showRankingChange={true}
                compact={compact}
                previousRank={0} // 可以实现真实的排名变化追踪
              />
            ))}
          </div>
        )}

        {/* 查看更多 */}
        {displayedEntries.length < leaderboardEntries.length && (
          <div className="text-center py-4">
            <button
              className="text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            >
              查看更多 ({leaderboardEntries.length - displayedEntries.length} 个玩家)
              <ChevronRight className="w-4 h-4 inline-block ml-1" />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>排行榜每分钟自动更新</span>
          <span>数据更新时间: {formatLastUpdate(lastUpdate)}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(Leaderboard);