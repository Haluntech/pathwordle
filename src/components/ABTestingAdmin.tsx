import React, { useState, useMemo, useCallback } from 'react';
import { useABTesting } from '../hooks/useABTesting';
import {
  ABTest,
  ABTestStats,
  TestEvent,
  UserAssignment
} from '../types/abTesting';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Beaker,
  BarChart3,
  Users,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Square,
  Settings,
  Download,
  Upload,
  Eye,
  EyeOff,
  Calculator,
  Activity,
  Filter,
  RefreshCw,
  Trash2,
  Plus,
  Edit,
  Copy,
  Zap,
  Shield,
  Award,
  FileText,
  Calendar,
  PieChart,
  LineChart,
  Table
} from 'lucide-react';

interface ABTestingAdminProps {
  isVisible: boolean;
  onClose: () => void;
}

interface TestCardProps {
  test: ABTest;
  stats?: ABTestStats | null;
  assignments: UserAssignment[];
  onViewDetails: (testId: string) => void;
  onToggleStatus: (testId: string) => void;
  onClone: (testId: string) => void;
  onDelete: (testId: string) => void;
}

const TestCard: React.FC<TestCardProps> = ({
  test,
  stats,
  assignments,
  onViewDetails,
  onToggleStatus,
  onClone,
  onDelete
}) => {
  const { t } = useLanguage();

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-700 border-green-200',
      paused: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      completed: 'bg-blue-100 text-blue-700 border-blue-200',
      draft: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ui': return <Eye className="w-4 h-4" />;
      case 'algorithm': return <Calculator className="w-4 h-4" />;
      case 'content': return <FileText className="w-4 h-4" />;
      default: return <Beaker className="w-4 h-4" />;
    }
  };

  const testAssignments = assignments.filter(a => a.testId === test.id);
  const totalParticipants = testAssignments.length;
  const controlParticipants = testAssignments.filter(a => {
    const variation = test.variations.find(v => v.id === a.variationId);
    return variation?.isControl;
  }).length;

  const completionRate = stats ?
    Object.values(stats.variationStats).reduce((sum: any, v: any) =>
      sum + v.metrics.completion_rate?.value || 0, 0) / Object.keys(stats.variationStats).length : 0;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              {getTypeIcon(test.type)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{test.name}</h3>
              <p className="text-sm text-gray-600">{test.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(test.status)}`}>
              {getStatusIcon(test.status)}
              {test.status.toUpperCase()}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              {test.type.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onViewDetails(test.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title={t('common.view', 'View')}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleStatus(test.id)}
            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
            title={t('common.toggle', 'Toggle')}
          >
            {test.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onClone(test.id)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title={t('common.clone', 'Clone')}
          >
            <Copy className="w-4 h-4" />
          </button>
          {test.status === 'draft' && (
            <button
              onClick={() => onDelete(test.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title={t('common.delete', 'Delete')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <div className="text-lg font-semibold text-gray-800">{totalParticipants}</div>
          <div className="text-xs text-gray-600">Participants</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Target className="w-5 h-5 text-green-500 mx-auto mb-1" />
          <div className="text-lg font-semibold text-gray-800">{test.variations.length}</div>
          <div className="text-xs text-gray-600">Variations</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <TrendingUp className="w-5 h-5 text-purple-500 mx-auto mb-1" />
          <div className="text-lg font-semibold text-gray-800">{Math.round(completionRate * 100)}%</div>
          <div className="text-xs text-gray-600">Completion</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Shield className="w-5 h-5 text-orange-500 mx-auto mb-1" />
          <div className="text-lg font-semibold text-gray-800">{stats?.isSignificant ? 'Yes' : 'No'}</div>
          <div className="text-xs text-gray-600">Significant</div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-600">Progress to Target</span>
          <span className="text-sm font-medium text-gray-800">
            {totalParticipants} / {test.minSampleSize}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((totalParticipants / test.minSampleSize) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Started: {test.startDate.toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Ends: {test.endDate.toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

const ABTestingAdmin: React.FC<ABTestingAdminProps> = ({ isVisible, onClose }) => {
  const { t } = useLanguage();
  const {
    isInitialized,
    isLoading,
    error,
    activeTests,
    userAssignments,
    getTestStatistics,
    resetTestData,
    totalActiveTests
  } = useABTesting();

  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'results' | 'analytics'>('overview');
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const [showCreateTest, setShowCreateTest] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'completed'>('all');

  // Calculate test statistics
  const testStats = useMemo(() => {
    return activeTests.reduce((acc, test) => {
      acc[test.id] = getTestStatistics(test.id);
      return acc;
    }, {} as { [key: string]: ABTestStats | null });
  }, [activeTests, getTestStatistics]);

  // Filter tests based on selected filter
  const filteredTests = useMemo(() => {
    if (filter === 'all') return activeTests;
    return activeTests.filter(test => test.status === filter);
  }, [activeTests, filter]);

  // Test overview statistics
  const overviewStats = useMemo(() => {
    const totalParticipants = userAssignments.length;
    const totalEvents = Object.values(testStats).reduce((sum, stats) => {
      if (!stats) return sum;
      return sum + Object.values(stats.variationStats).reduce((varSum: any, varStats: any) =>
        varSum + Object.values(varStats.metrics).reduce((metricSum: any, metric: any) =>
          metricSum + metric.count, 0), 0);
    }, 0);

    const significantTests = Object.values(testStats).filter(stats => stats?.isSignificant).length;
    const avgCompletionRate = Object.values(testStats).reduce((sum, stats) => {
      if (!stats) return sum;
      const completionRates = Object.values(stats.variationStats).map((v: any) =>
        v.metrics.completion_rate?.value || 0);
      return sum + (completionRates.reduce((a: number, b: number) => a + b, 0) / completionRates.length);
    }, 0) / (Object.values(testStats).filter(Boolean).length || 1);

    return {
      totalParticipants,
      totalEvents,
      significantTests,
      avgCompletionRate: Math.round(avgCompletionRate * 100)
    };
  }, [userAssignments, testStats]);

  const handleViewTestDetails = useCallback((testId: string) => {
    const test = activeTests.find(t => t.id === testId);
    if (test) {
      setSelectedTest(test);
      setActiveTab('results');
    }
  }, [activeTests]);

  const handleToggleTestStatus = useCallback((testId: string) => {
    // In production, this would call your API
    console.log('Toggle test status:', testId);
  }, []);

  const handleCloneTest = useCallback((testId: string) => {
    // In production, this would clone the test
    console.log('Clone test:', testId);
  }, []);

  const handleDeleteTest = useCallback((testId: string) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      console.log('Delete test:', testId);
    }
  }, []);

  const handleExportData = useCallback(() => {
    const data = {
      tests: activeTests,
      assignments: userAssignments,
      statistics: testStats,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ab_test_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [activeTests, userAssignments, testStats]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <Beaker className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">A/B Testing Framework</h2>
                <p className="text-blue-100">
                  Optimize game features through controlled experiments
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportData}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Export Data"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => resetTestData()}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Reset Test Data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <EyeOff className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
          <div className="flex items-center gap-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'tests', label: 'Tests', icon: Beaker },
              { id: 'results', label: 'Results', icon: TrendingUp },
              { id: 'analytics', label: 'Analytics', icon: PieChart }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                  ${activeTab === id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {isLoading && !isInitialized ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-lg font-medium text-gray-700">Loading A/B Tests...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Tests</h3>
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Key Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
                      <Beaker className="w-8 h-8 mb-3 opacity-80" />
                      <div className="text-3xl font-bold">{totalActiveTests}</div>
                      <div className="text-blue-100">Active Tests</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
                      <Users className="w-8 h-8 mb-3 opacity-80" />
                      <div className="text-3xl font-bold">{overviewStats.totalParticipants}</div>
                      <div className="text-green-100">Total Participants</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
                      <Award className="w-8 h-8 mb-3 opacity-80" />
                      <div className="text-3xl font-bold">{overviewStats.significantTests}</div>
                      <div className="text-purple-100">Significant Results</div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6">
                      <Activity className="w-8 h-8 mb-3 opacity-80" />
                      <div className="text-3xl font-bold">{overviewStats.avgCompletionRate}%</div>
                      <div className="text-orange-100">Avg Completion Rate</div>
                    </div>
                  </div>

                  {/* Recent Tests */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">Recent Tests</h3>
                      <button
                        onClick={() => setActiveTab('tests')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View All →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {filteredTests.slice(0, 4).map(test => (
                        <TestCard
                          key={test.id}
                          test={test}
                          stats={testStats[test.id]}
                          assignments={userAssignments}
                          onViewDetails={handleViewTestDetails}
                          onToggleStatus={handleToggleTestStatus}
                          onClone={handleCloneTest}
                          onDelete={handleDeleteTest}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tests Tab */}
              {activeTab === 'tests' && (
                <div className="space-y-6">
                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <select
                          value={filter}
                          onChange={(e) => setFilter(e.target.value as any)}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="all">All Tests</option>
                          <option value="active">Active</option>
                          <option value="paused">Paused</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      <span className="text-sm text-gray-600">
                        Showing {filteredTests.length} of {activeTests.length} tests
                      </span>
                    </div>

                    <button
                      onClick={() => setShowCreateTest(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Create Test
                    </button>
                  </div>

                  {/* Test Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredTests.map(test => (
                      <TestCard
                        key={test.id}
                        test={test}
                        stats={testStats[test.id]}
                        assignments={userAssignments}
                        onViewDetails={handleViewTestDetails}
                        onToggleStatus={handleToggleTestStatus}
                        onClone={handleCloneTest}
                        onDelete={handleDeleteTest}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Results Tab */}
              {activeTab === 'results' && (
                <div className="space-y-6">
                  {selectedTest ? (
                    <TestResultsDetails
                      test={selectedTest}
                      stats={testStats[selectedTest.id]}
                      assignments={userAssignments.filter(a => a.testId === selectedTest.id)}
                      onBack={() => setSelectedTest(null)}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Test to View Results</h3>
                      <p className="text-gray-500 mb-6">
                        Choose a test from the Tests tab to see detailed results and statistical analysis
                      </p>
                      <button
                        onClick={() => setActiveTab('tests')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Browse Tests
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <TestAnalyticsOverview
                  tests={activeTests}
                  testStats={testStats}
                  userAssignments={userAssignments}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Test Results Details Component
interface TestResultsDetailsProps {
  test: ABTest;
  stats: ABTestStats | null;
  assignments: UserAssignment[];
  onBack: () => void;
}

const TestResultsDetails: React.FC<TestResultsDetailsProps> = ({
  test,
  stats,
  assignments,
  onBack
}) => {
  const { t } = useLanguage();

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Available</h3>
        <p className="text-gray-500">This test doesn't have enough data to show results yet.</p>
        <button
          onClick={onBack}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Tests
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ← Back
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{test.name}</h2>
          <p className="text-gray-600">{test.description}</p>
        </div>
      </div>

      {/* Test Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-6">
          <Users className="w-8 h-8 text-blue-600 mb-3" />
          <div className="text-2xl font-bold text-gray-800">{stats.totalParticipants}</div>
          <div className="text-gray-600">Total Participants</div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <Target className="w-8 h-8 text-green-600 mb-3" />
          <div className="text-2xl font-bold text-gray-800">
            {test.variations.length}
          </div>
          <div className="text-gray-600">Variations Tested</div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <Award className="w-8 h-8 text-purple-600 mb-3" />
          <div className="text-2xl font-bold text-gray-800">
            {stats.isSignificant ? 'Significant' : 'Not Significant'}
          </div>
          <div className="text-gray-600">Statistical Significance</div>
        </div>
      </div>

      {/* Variation Performance */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Variation Performance</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {test.variations.map(variation => {
            const variationStats = stats.variationStats[variation.id];
            if (!variationStats) return null;

            return (
              <div key={variation.id} className="border-2 border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{variation.name}</h4>
                    <p className="text-gray-600">{variation.description}</p>
                    {variation.isControl && (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium mt-1">
                        CONTROL
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">{variationStats.sampleSize}</div>
                    <div className="text-sm text-gray-600">Users</div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-3">
                  {test.metrics.map(metric => {
                    const metricStats = variationStats.metrics[metric.id];
                    if (!metricStats) return null;

                    return (
                      <div key={metric.id} className="flex items-center justify-between py-2 border-t border-gray-100">
                        <div>
                          <div className="font-medium text-gray-700">{metric.name}</div>
                          <div className="text-sm text-gray-500">{metric.type}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-800">
                            {typeof metricStats.value === 'number'
                              ? metric.type === 'conversion'
                                ? Math.round(metricStats.value * 100) + '%'
                                : metricStats.value.toFixed(1)
                              : 'N/A'
                            }
                          </div>
                          <div className="text-xs text-gray-500">
                            {metricStats.count} events
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Test Analytics Overview Component
interface TestAnalyticsOverviewProps {
  tests: ABTest[];
  testStats: { [key: string]: ABTestStats | null };
  userAssignments: UserAssignment[];
}

const TestAnalyticsOverview: React.FC<TestAnalyticsOverviewProps> = ({
  tests,
  testStats,
  userAssignments
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Analytics Overview</h3>

      <div className="text-center py-12">
        <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Analytics Coming Soon</h3>
        <p className="text-gray-500">
          Advanced analytics and visualization tools are under development
        </p>
      </div>
    </div>
  );
};

export default ABTestingAdmin;