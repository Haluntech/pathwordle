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
    if (seconds < 60) return `${seconds}秒`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}分钟`;
    return `${Math.round(seconds / 3600)}小时`;
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
      common: '普通',
      rare: '稀有',
      epic: '史诗',
      legendary: '传说'
    };
    return labels[rarity as keyof typeof labels] || '普通';
  };

  if (!showDetailed) {
    // 简化版本统计
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
        <StatCard
          icon={<Trophy className="w-5 h-5" />}
          title="游戏场次"
          value={statistics.gamesPlayed}
          subtitle={`胜率 ${formatPercentage(Math.round(statistics.winRate))}`}
          color="blue"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="当前连胜"
          value={statistics.currentStreak}
          subtitle={`最高 ${statistics.maxStreak}`}
          color="green"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          title="平均用时"
          value={formatTime(summary.averageTime)}
          subtitle={summary.fastestWin > 0 ? `最快 ${formatTime(summary.fastestWin)}` : ''}
          color="purple"
        />
        <StatCard
          icon={<Award className="w-5 h-5" />}
          title="成就进度"
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
        <h2 className="text-2xl font-bold text-gray-800">游戏统计</h2>
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
              {tab === 'overview' && '概览'}
              {tab === 'achievements' && '成就'}
              {tab === 'history' && '历史'}
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
              title="总游戏场数"
              value={statistics.gamesPlayed}
              subtitle={`${statistics.gamesWon}胜 ${statistics.gamesLost}负`}
              color="blue"
            />
            <StatCard
              icon={<Target className="w-6 h-6" />}
              title="胜率"
              value={formatPercentage(Math.round(statistics.winRate))}
              subtitle={`${getMostUsedGuesses()}次最常用`}
              color={getWinRateColor(Math.round(statistics.winRate))}
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="连胜记录"
              value={statistics.currentStreak}
              subtitle={`最高记录: ${statistics.maxStreak}`}
              color="green"
            />
            <StatCard
              icon={<Clock className="w-6 h-6" />}
              title="游戏时间"
              value={formatTime(summary.averageTime)}
              subtitle={`总计 ${formatTime(statistics.totalPlayTime)}`}
              color="purple"
            />
          </div>

          {/* 猜测分布 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              猜测次数分布
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
                easy: '简单',
                medium: '中等',
                hard: '困难',
                expert: '专家'
              };

              return (
                <div key={difficulty} className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-medium text-gray-800">{labels[difficulty as keyof typeof labels]}</h4>
                  <div className="text-2xl font-bold text-gray-900">{stats.played}</div>
                  <div className="text-sm text-gray-600">
                    {stats.won}胜 · {winRate}%胜率
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
              已解锁 {statistics.achievementsUnlocked} / {achievements.length} 个成就
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
                          <span>进度</span>
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
                        ✓ {new Date(achievement.unlockedDate).toLocaleDateString()} 解锁
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
            <h3 className="font-semibold text-gray-800">最近游戏记录</h3>
            <span className="text-sm text-gray-600">
              显示最近 {Math.min(statistics.recentGames.length, 20)} 局
            </span>
          </div>

          {statistics.recentGames.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>还没有游戏记录</p>
              <p className="text-sm">开始你的第一局游戏吧！</p>
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
                            完美!
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
                      {game.attemptsUsed}/6 次猜测
                    </div>
                    {game.shared && (
                      <div className="text-xs text-blue-600 flex items-center gap-1">
                        <Share2 className="w-3 h-3" />
                        已分享
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