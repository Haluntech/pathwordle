import React, { useMemo, memo, useCallback } from 'react';
import { Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Award,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

interface LearningProgressChartProps {
  data: any;
  type: 'line' | 'bar' | 'pie' | 'combined';
  title: string;
  subtitle?: string;
  height?: number;
  showLegend?: boolean;
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange' | 'multi';
  className?: string;
}

// Color schemes
const COLOR_SCHEMES = {
  blue: ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#eff6ff'],
  green: ['#10b981', '#34d399', '#6ee7b7', '#d1fae5', '#ecfdf5'],
  purple: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ede9fe', '#f3e8ff'],
  orange: ['#f59e0b', '#fbbf24', '#fcd34d', '#fef3c7', '#fffbeb'],
  multi: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
};

const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4',
  gray: '#6b7280'
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-gray-600" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  }
  return null;
};

// Learning Line Chart Component
const LearningLineChart: React.FC<{
  data: any[];
  height?: number;
  title?: string;
  colorScheme?: string[];
}> = ({ data, height = 300, title = 'Learning Progress', colorScheme = COLOR_SCHEMES.blue }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString(),
      formattedDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));
  }, [data]);

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <Line
          data={processedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          dataKey="performance"
          stroke={colorScheme[0]}
          strokeWidth={2}
          dot={{ fill: colorScheme[0], r: 4 }}
          activeDot={{ r: 6 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="formattedDate"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
        </Line>
      </ResponsiveContainer>
    </div>
  );
};

// Performance Bar Chart Component
const PerformanceBarChart: React.FC<{
  data: any[];
  height?: number;
  title?: string;
  colorScheme?: string[];
}> = ({ data, height = 300, title = 'Performance Metrics', colorScheme = COLOR_SCHEMES.multi }) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <Bar
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill={colorScheme[0]} />
        </Bar>
      </ResponsiveContainer>
    </div>
  );
};

// Skill Distribution Pie Chart
const SkillDistributionChart: React.FC<{
  data: any[];
  height?: number;
  title?: string;
  colorScheme?: string[];
}> = ({ data, height = 300, title = 'Skill Distribution', colorScheme = COLOR_SCHEMES.multi }) => {
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent > 5) {
      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
          className="text-xs font-medium"
        >
          {`${percent}%`}
        </text>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colorScheme[index % colorScheme.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Combined Performance Chart
const CombinedPerformanceChart: React.FC<{
  data: any[];
  height?: number;
  title?: string;
}> = ({ data, height = 400, title = 'Combined Performance Analysis' }) => {
  const skillDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    data.forEach(session => {
      if (session.skillDistribution) {
        Object.entries(session.skillDistribution).forEach(([skill, value]) => {
          distribution[skill] = (distribution[skill] || 0) + value;
        });
      }
    });
    return Object.entries(distribution).map(([skill, value]) => ({
      name: skill,
      value,
      percentage: Math.round((value / Object.values(distribution).reduce((a, b) => a + b, 0)) * 100)
    }));
  }, [data]);

  const performanceTrend = useMemo(() => {
    return data.map((session, index) => ({
      day: index + 1,
      score: session.score || 0,
      accuracy: session.accuracy || 0,
      efficiency: session.efficiency || 0
    }));
  }, [data]);

  const averageMetrics = useMemo(() => {
    if (performanceTrend.length === 0) return [];
    return [{
      name: 'Average Score',
      value: Math.round(performanceTrend.reduce((sum, p) => sum + p.score, 0) / performanceTrend.length),
      color: COLORS.primary
    }, {
      name: 'Average Accuracy',
      value: Math.round(performanceTrend.reduce((sum, p) => sum + p.accuracy, 0) / performanceTrend.length),
      color: COLORS.success
    }, {
      name: 'Average Efficiency',
      value: Math.round(performanceTrend.reduce((sum, p) => sum + p.efficiency, 0) / performanceTrend.length),
      color: COLORS.warning
    }];
  }, [performanceTrend]);

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Line Chart - Performance Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
            <LineChartIcon className="w-4 h-4" />
            Performance Trend
          </h4>
          <ResponsiveContainer width="100%" height={height}>
            <Line
              data={performanceTrend}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="score" stroke={COLOR_SCHEMES.blue[0]} strokeWidth={2} dot={{ fill: COLORS.primary }} />
              <Line type="monotone" dataKey="accuracy" stroke={COLOR_SCHEMES.green[0]} strokeWidth={2} dot={{ fill: COLORS.success }} />
            </Line>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Skill Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
            <PieChartIcon className="w-4 h-4" />
            Skill Distribution
          </h4>
          <SkillDistributionChart
            data={skillDistribution}
            height={height}
            colorScheme={COLOR_SCHEMES.multi}
          />
        </div>
      </div>

      {/* Bar Chart - Average Metrics */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Average Metrics
        </h4>
        <PerformanceBarChart
          data={averageMetrics}
          height={200}
          colorScheme={averageMetrics.map(m => m.color)}
        />
      </div>
    </div>
  );
};

// Progress Overview Component
const ProgressOverview: React.FC<{
  data: any;
  className?: string;
}> = memo(({ data, className = '' }) => {
  const overallProgress = data.overallProgress || 0;
  const progressPercentage = Math.min(overallProgress, 100);

  const progressBySkill = useMemo(() => {
    const skills = Object.entries(data.progressBySkill || {});
    return skills.map(([skill, progress]) => ({
      skill,
      progress: Math.min(progress, 100),
      color: COLOR_SCHEMES.blue[Math.floor(Math.random() * 5)]
    }));
  }, [data]);

  const getStatusColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressIcon = (progress: number) => {
    if (progress >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (progress >= 40) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-blue-600" />
        Progress Overview
      </h3>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className={`text-lg font-bold ${getStatusColor(progressPercentage)}`}>
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getStatusColor(progressPercentage)}`}
            style={{
              width: `${progressPercentage}%`,
              background: progressPercentage >= 80 ? 'linear-gradient(to right, #10b981, #34d399)' :
                         progressPercentage >= 60 ? 'linear-gradient(to right, #3b82f6, #60a5fa)' :
                         progressPercentage >= 40 ? 'linear-gradient(to right, #f59e0b, #fbbf24)' :
                         'linear-gradient(to right, #ef4444, #f87171)'
            }}
          />
        </div>

        <div className="flex items-center justify-center mt-2">
          {getProgressIcon(progressPercentage)}
          <span className="ml-2 text-sm text-gray-600">
            {progressPercentage >= 80 ? 'Excellent!' :
             progressPercentage >= 60 ? 'Good Progress!' :
             progressPercentage >= 40 ? 'Keep Going!' :
             'Start Strong!'}
          </span>
        </div>
      </div>

      {/* Skills Progress */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Skills</h4>
        {progressBySkill.map((skill, index) => (
          <div key={skill.skill} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{skill.skill}</span>
              <span className="font-medium">{Math.round(skill.progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${skill.progress}%`,
                  backgroundColor: skill.color
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Milestones */}
      {data.milestones && data.milestones.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Milestones</h4>
          <div className="space-y-2">
            {data.milestones.slice(0, 3).map((milestone: any, index) => (
              <div
                key={milestone.id}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  milestone.isAchieved ? 'bg-green-50' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {milestone.isAchieved ? (
                    <Award className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm font-medium">{milestone.name}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  milestone.isAchieved ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
                }`}>
                  {milestone.progress}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

ProgressOverview.displayName = 'ProgressOverview';

// Main LearningProgressChart Component
const LearningProgressChart: React.FC<LearningProgressChartProps> = memo(({
  data,
  type = 'combined',
  title,
  subtitle,
  height = 400,
  showLegend = true,
  colorScheme = 'multi',
  className = ''
}) => {
  const chartData = useMemo(() => {
    if (!data || !data.sessionData) return [];

    // Process data for charts
    switch (type) {
      case 'line':
        return data.sessionData.slice(-30).map(session => ({
          date: session.startTime,
          performance: session.score || 0
        }));

      case 'bar':
        return data.performanceMetrics?.recentPerformance?.slice(-7).map(p => ({
          name: p.date ? new Date(p.date).toLocaleDateString() : 'Recent',
          value: p.overallScore
        })) || [];

      case 'pie':
        return Object.entries(data.learningProgress?.progressBySkill || {}).map(([skill, value]) => ({
          name: skill,
          value: Math.max(0, value),
          percentage: Math.min(100, value)
        }));

      case 'combined':
        // Return all data for combined view
        return data.sessionData.slice(-30);

      default:
        return [];
    }
  }, [data, type]);

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h2 className="text-xl font-bold text-gray-800">{title}</h2>}
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}

      {/* Progress Overview */}
      {type === 'combined' && <ProgressOverview data={data} />}

      {/* Charts */}
      {type === 'combined' && chartData.length > 0 && (
        <CombinedPerformanceChart data={chartData} height={height} />
      )}

      {type === 'line' && chartData.length > 0 && (
        <LearningLineChart
          data={chartData}
          height={height}
          title="Learning Progress Over Time"
          colorScheme={colorScheme === 'multi' ? COLOR_SCHEMES.blue : [COLOR_SCHEMES[colorScheme as keyof typeof COLOR_SCHEMES] || [COLOR_SCHEMES.blue]]}
        />
      )}

      {type === 'bar' && chartData.length > 0 && (
        <PerformanceBarChart
          data={chartData}
          height={height}
          title="Recent Performance"
          colorScheme={colorScheme === 'multi' ? COLOR_SCHEMES.multi : [COLOR_SCHEMES[colorScheme as keyof typeof COLOR_SCHEMES] || [COLOR_SCHEMES.blue]]}
        />
      )}

      {type === 'pie' && chartData.length > 0 && (
        <SkillDistributionChart
          data={chartData}
          height={height}
          title="Skill Distribution"
          colorScheme={colorScheme === 'multi' ? COLOR_SCHEMES.multi : COLOR_SCHEMES[colorScheme as keyof typeof COLOR_SCHEMES] || [COLOR_SCHEMES.blue]}
        />
      )}

      {chartData.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4" />
          <p>No data available for visualization</p>
          <p className="text-sm">Play more games to see your progress</p>
        </div>
      )}
    </div>
  );
});

LearningProgressChart.displayName = 'LearningProgressChart';

export default LearningProgressChart;