import React, { useState, memo } from 'react';
import { useStatistics } from '../hooks/useStatistics';
import { TrendingUp, Clock, Trophy, Target, Zap, Calendar, Award, Share2 } from 'lucide-react';

interface StatisticsProps {
  className?: string;
  showDetailed?: boolean;
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const StatCard: React.FC<StatCardProps> = memo(({ icon, title, value, subtitle, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200'
  };

  return (
    <div className={`bg-white rounded-lg p-4 border-2 ${colorClasses[color]} transition-all hover:scale-105`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${colorClasses[color]} bg-opacity-20`}>
          {icon}
        </div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {subtitle && (
        <div className="text-sm text-gray-600 mt-1">{subtitle}</div>
      )}
    </div>
  );
});

StatCard.displayName = 'StatCard';

const Statistics: React.FC<StatisticsProps> = ({ className = '', showDetailed = false }) => {
  const { statistics, getStatisticsSummary, achievements } = useStatistics();
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'history'>('overview');
  const summary = getStatisticsSummary();

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds} second${seconds === 1 ? '' : 's'}`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minute${Math.round(seconds / 60) === 1 ? '' : 's'}`;
    return `${Math.round(seconds / 3600)} hour${Math.round(seconds / 3600) === 1 ? '' : 's'}`;  
  };

  const formatPercentage = (value: number): string => {
    return `${value}%`;
  };

  const getWinRateColor = (rate: number): 'red' | 'orange' | 'yellow' | 'green' => {
    if (rate < 30) return 'red';
    if (rate < 50) return 'orange';
    if (rate < 70) return 'yellow';
    return 'green';
  };

  // 计算最常用的猜测次数
  const getMostUsedGuesses = (): number => {
    const distribution = statistics.guessDistribution;
    let maxCount = 0;
    let mostUsed = 0;

    for (let i = 1; i <= 6; i++) {
      if (distribution[i] > maxCount) {
        maxCount = distribution[i];
        mostUsed = i;
      }
    }

    return mostUsed;
  };

  // 获取成就稀有度颜色
  const getAchievementColor = (rarity: string): string => {
    const colors = {
      common: 'border-gray-300 bg-gray-50',
      rare: 'border-blue-300 bg-blue-50',
      epic: 'border-purple-300 bg-purple-50',
      legendary: 'border-yellow-400 bg-yellow-50'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getRarityLabel = (rarity: string): string => {
    const labels = {
      common: 'Common',
      rare: 'Rare',
      epic: 'Epic',
      legendary: 'Legendary'
    };
    return labels[rarity as keyof typeof labels] || 'Common';
  };

  if (!showDetailed) {
    // 简化版本统计
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
        <StatCard
          icon={<Trophy className="w-5 h-5" />}
          title="Games Played"
          value={statistics.gamesPlayed}
          subtitle={`Win Rate ${formatPercentage(Math.round(statistics.winRate))}`}
          color="blue"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Current Streak"
          value={statistics.currentStreak}
          subtitle={`Max ${statistics.maxStreak}`}  
          color="green"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          title="Average Time"
          value={formatTime(summary.averageTime)}
          subtitle={summary.fastestWin > 0 ? `Fastest Win ${formatTime(summary.fastestWin)}` : ''}
          color="purple"
        />
        <StatCard
          icon={<Award className="w-5 h-5" />}
          title="Achievements Unlocked"
          value={`${statistics.achievementsUnlocked}/${achievements.length}`}
          subtitle={formatPercentage(Math.round(statistics.completionRate))}
          color="orange"
        />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Game Statistics</h2>
        <div className="flex gap-2">
          {(['overview', 'achievements', 'history'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-pressed={activeTab === tab}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'achievements' && 'Achievements'}
              {tab === 'history' && 'History'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 主要统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Trophy className="w-6 h-6" />}
              title="Total Games Played"
              value={statistics.gamesPlayed}
              subtitle={`${statistics.gamesWon} Win ${statistics.gamesLost} Loss`}
              color="blue"
            />
            <StatCard
              icon={<Target className="w-6 h-6" />}
              title="Win Rate"
              value={formatPercentage(Math.round(statistics.winRate))}
              subtitle={`${getMostUsedGuesses()} times most common`}
              color={getWinRateColor(Math.round(statistics.winRate))}
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Win Streak"
              value={statistics.currentStreak}
              subtitle={`Max ${statistics.maxStreak}`}
              color="green"
            />
            <StatCard
              icon={<Clock className="w-6 h-6" />}
              title="Game Time"
              value={formatTime(summary.averageTime)}
              subtitle={`Total ${formatTime(statistics.totalPlayTime)}`}
              color="purple"
            />
          </div>

          {/* 猜测分布 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Guess Distribution
            </h3>
            <div className="flex items-end gap-2 h-32">
              {Object.entries(statistics.guessDistribution).map(([guess, count]) => {
                const maxCount = Math.max(...Object.values(statistics.guessDistribution));
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                return (
                  <div key={guess} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-xs font-medium text-gray-600">{guess}</div>
                    <div className="w-full bg-gray-200 rounded-t flex-1 relative">
                      <div
                        className="absolute bottom-0 w-full bg-blue-500 rounded-t transition-all duration-300"
                        style={{ height: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-600">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 难度统计 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(statistics.difficultyStats).map(([difficulty, stats]) => {
              const winRate = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
              const labels = {
                easy: 'Easy',
                medium: 'Medium',
                hard: 'Hard',
                expert: 'Expert'
              };

              return (
                <div key={difficulty} className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-medium text-gray-800">{labels[difficulty as keyof typeof labels]}</h4>
                  <div className="text-2xl font-bold text-gray-900">{stats.played}</div>
                  <div className="text-sm text-gray-600">
                    {stats.won} Win · {winRate}% Win Rate
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              Unlocked {statistics.achievementsUnlocked} / {achievements.length} Achievements
            </p>
            <span className="text-lg font-semibold text-blue-600">
              {formatPercentage(Math.round(statistics.completionRate))}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`border-2 rounded-lg p-4 transition-all ${
                  achievement.unlocked
                    ? `${getAchievementColor(achievement.rarity)} scale-105`
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        achievement.unlocked ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {getRarityLabel(achievement.rarity)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>

                    {!achievement.unlocked && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Progress</span>
                          <span>{Math.round(achievement.progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${achievement.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {achievement.unlocked && achievement.unlockedDate && (
                      <div className="text-xs text-green-600 mt-2">
                        ✓ {new Date(achievement.unlockedDate).toLocaleDateString()} Unlocked
                      </div>
                    )}

                    {achievement.reward.title && achievement.unlocked && (
                      <div className="text-xs text-purple-600 mt-1">
                        🏅 {achievement.reward.title}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Recent Games</h3>
            <span className="text-sm text-gray-600">
              Show Recent {Math.min(statistics.recentGames.length, 20)} Games
            </span>
          </div>

          {statistics.recentGames.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No Recent Games</p>
              <p className="text-sm">Start Your First Game!</p> 
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {statistics.recentGames.slice(0, 20).map((game, index) => (
                <div
                  key={game.id}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                    game.won ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-gray-500">#{index + 1}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">
                          {game.targetWord.toUpperCase()}
                        </span>
                        {game.perfectGame && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                            Perfect Game!
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(game.date).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      {formatTime(game.timeTaken)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {game.attemptsUsed}/6 Guesses
                    </div>
                    {game.shared && (
                      <div className="text-xs text-blue-600 flex items-center gap-1">
                        <Share2 className="w-3 h-3" />
                        Shared
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(Statistics);