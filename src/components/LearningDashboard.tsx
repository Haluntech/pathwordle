import React, { useState, useMemo, useCallback, memo } from 'react';
import { useLearningAnalytics } from '../hooks/useLearningAnalytics';
import {
  Brain,
  TrendingUp,
  Target,
  Clock,
  Award,
  BarChart3,
  Calendar,
  Zap,
  BookOpen,
  Activity,
  Lightbulb,
  Trophy,
  Star,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  RefreshCw,
  Settings,
  Share2,
  Download,
  Eye,
  Users,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface LearningDashboardProps {
  className?: string;
  compact?: boolean;
  showInsights?: boolean;
  showCharts?: boolean;
}

// Memoized Skill Progress Card
const SkillProgressCard: React.FC<{
  skill: any;
  isExpanded: boolean;
  onToggle: () => void;
}> = memo(({ skill, isExpanded, onToggle }) => {
  const progressPercentage = (skill.experience / skill.experienceToNext) * 100;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-gray-100 text-gray-700';
      case 'intermediate': return 'bg-blue-100 text-blue-700';
      case 'advanced': return 'bg-purple-100 text-purple-700';
      case 'expert': return 'bg-yellow-100 text-yellow-700';
      case 'master': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
            {skill.skillArea.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{skill.skillArea}</h3>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMasteryColor(skill.masteryLevel)}`}>
                {skill.masteryLevel}
              </span>
              {getTrendIcon(skill.trend)}
            </div>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Level {skill.currentLevel} / {skill.maxLevel}</span>
            <span>{skill.experience} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Learning Rate:</span>
              <span className="font-medium">{skill.estimatedLearningRate.toFixed(2)}x</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total XP:</span>
              <span className="font-medium">{skill.experience}</span>
            </div>
            {skill.strengths.length > 0 && (
              <div>
                <span className="text-sm text-gray-600">Strengths: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {skill.strengths.slice(0, 3).map((strength, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      {strength.area}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {skill.weaknesses.length > 0 && (
              <div>
                <span className="text-sm text-gray-600">Areas to improve: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {skill.weaknesses.slice(0, 2).map((weakness, index) => (
                    <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                      {weakness.area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

SkillProgressCard.displayName = 'SkillProgressCard';

// Memoized Performance Overview Card
const PerformanceOverviewCard: React.FC<{ metrics: any; className?: string }> = memo(({ metrics, className = '' }) => {
  const recentPerformance = metrics.recentPerformance.slice(-7);
  const avgScore = recentPerformance.length > 0
    ? Math.round(recentPerformance.reduce((sum, p) => sum + p.overallScore, 0) / recentPerformance.length)
    : 0;

  const winRate = metrics.averageMetrics.allTime.winRate;
  const avgTime = metrics.averageMetrics.allTime.averageTime;
  const accuracy = metrics.averageMetrics.allTime.accuracy;

  const statCards = [
    {
      icon: <Target className="w-5 h-5" />,
      label: 'Avg Score',
      value: avgScore,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      label: 'Win Rate',
      value: `${Math.round(winRate)}%`,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Avg Time',
      value: `${Math.round(avgTime)}s`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: 'Accuracy',
      value: `${Math.round(accuracy)}%`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        Performance Overview
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {statCards.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-lg p-3 text-center`}>
            <div className="flex justify-center mb-2 text-gray-600">
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {metrics.bestPerformances.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Personal Records</h4>
          <div className="space-y-1">
            {metrics.bestPerformances.slice(0, 3).map((record, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{record.category}</span>
                <span className="font-medium text-gray-800">{record.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

PerformanceOverviewCard.displayName = 'PerformanceOverviewCard';

// Memoized Learning Insights Card
const LearningInsightsCard: React.FC<{ insights: any; className?: string }> = memo(({ insights, className = '' }) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'recommendations' | 'motivation'>('insights');

  const tabButtons = [
    { id: 'insights', label: 'Insights', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'recommendations', label: 'Recommendations', icon: <Target className="w-4 h-4" /> },
    { id: 'motivation', label: 'Motivation', icon: <Star className="w-4 h-4" /> }
  ];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-600" />
        Learning Insights
      </h3>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4 border-b border-gray-200">
        {tabButtons.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === 'insights' && (
          <div className="space-y-3">
            {insights.keyInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
            {insights.keyInsights.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Brain className="w-12 h-12 mx-auto mb-2" />
                <p>No insights available yet. Keep playing to unlock insights!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-3">
            {insights.actionableRecommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
                <Target className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                <p className="text-sm text-gray-700">{rec}</p>
              </div>
            ))}
            {insights.actionableRecommendations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-2" />
                <p>No recommendations at the moment. You're doing great!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'motivation' && (
          <div className="space-y-3">
            {insights.motivationalMessages.map((message, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                <Star className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-sm text-gray-700 italic">{message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

LearningInsightsCard.displayName = 'LearningInsightsCard';

// Memoized Streak Analysis Card
const StreakAnalysisCard: React.FC<{ streakData: any; className?: string }> = memo(({ streakData, className = '' }) => {
  const getStreakEmoji = (length: number): string => {
    if (length >= 30) return '🔥🔥🔥';
    if (length >= 21) return '🔥🔥';
    if (length >= 11) return '🔥';
    if (length >= 7) return '💫';
    if (length >= 3) return '⭐';
    return '✨';
  };

  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-red-600" />
        Streak Analysis
      </h3>

      <div className="space-y-4">
        {/* Current Streak */}
        <div className="text-center">
          <div className="text-6xl mb-2">
            {getStreakEmoji(streakData.currentStreak)}
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {streakData.currentStreak} Day{streakData.currentStreak !== 1 ? 's' : ''}
          </div>
          <div className="text-sm text-gray-600">Current Streak</div>
        </div>

        {/* Streak Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-800">
              {streakData.longestStreak}
            </div>
            <div className="text-sm text-gray-600">Longest</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-800">
              {streakData.streakHistory.length}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>

        {/* Risk Assessment */}
        {streakData.riskAssessment.riskLevel !== 'low' && (
          <div className={`p-3 rounded-lg ${getRiskColor(streakData.riskAssessment.riskLevel)}`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Streak Risk: {streakData.riskAssessment.riskLevel}</span>
            </div>
            {streakData.riskAssessment.prevention.length > 0 && (
              <div className="space-y-1">
                <div className="text-sm font-medium">Prevention Tips:</div>
                {streakData.riskAssessment.prevention.slice(0, 3).map((tip, index) => (
                  <div key={index} className="text-xs">• {tip}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Patterns */}
        {streakData.patterns.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Playing Patterns</h4>
            <div className="space-y-2">
              {streakData.patterns.slice(0, 2).map((pattern, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium text-gray-700">{pattern.description}</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    pattern.impact === 'positive' ? 'bg-green-100 text-green-700' :
                    pattern.impact === 'negative' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {pattern.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

StreakAnalysisCard.displayName = 'StreakAnalysisCard';

const LearningDashboard: React.FC<LearningDashboardProps> = ({
  className = '',
  compact = false,
  showInsights = true,
  showCharts = true
}) => {
  const {
    analyticsData,
    getRecommendations,
    getLearningInsights,
    getPerformanceMetrics,
    getStreakData,
    isDataReady
  } = useLearningAnalytics();

  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set());
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const insights = useMemo(() => getLearningInsights(), [getLearningInsights, analyticsData]);
  const performanceMetrics = useMemo(() => getPerformanceMetrics(), [getPerformanceMetrics, analyticsData]);
  const streakData = useMemo(() => getStreakData(), [getStreakData, analyticsData]);

  const toggleSkillExpansion = useCallback((skillId: string) => {
    setExpandedSkills(prev => {
      const newSet = new Set(prev);
      if (newSet.has(skillId)) {
        newSet.delete(skillId);
      } else {
        newSet.add(skillId);
      }
      return newSet;
    });
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  }, []);

  if (!isDataReady) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-8 text-center ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your learning analytics...</p>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 min-h-screen ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Learning Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Track your progress and improve your skills
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                aria-label="Refresh data"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>

              {!compact && (
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Share insights"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              )}

              {!compact && (
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Download data"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl p-4 space-y-6">
        {/* Performance Overview */}
        <PerformanceOverviewCard metrics={performanceMetrics} />

        {/* Two Column Layout for Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Skills Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Skill Progress
              </h2>
              <span className="text-sm text-gray-600">
                {analyticsData?.skillLevels.length || 0} Skills
              </span>
            </div>

            <div className="space-y-3">
              {analyticsData?.skillLevels.map((skill) => (
                <SkillProgressCard
                  key={skill.skillArea}
                  skill={skill}
                  isExpanded={expandedSkills.has(skill.skillArea)}
                  onToggle={() => toggleSkillExpansion(skill.skillArea)}
                />
              ))}
            </div>
          </div>

          {/* Learning Insights */}
          {showInsights && (
            <LearningInsightsCard insights={insights} />
          )}
        </div>

        {/* Bottom Row */}
        <div className="lg:col-span-2">
          {/* Streak Analysis */}
          <StreakAnalysisCard streakData={streakData} />
        </div>
      </div>

      {/* Compact Mode - Show fewer details */}
      {compact && (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2">
          <button
            className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            aria-label="View detailed analytics"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(LearningDashboard);