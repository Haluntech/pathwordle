import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ABTest,
  ABTestConfig,
  ABTestVariation,
  ABTestMetrics,
  ABTestUserSegment,
  ABTestResult,
  ABTestStats,
  UserAssignment,
  TargetingCriteria,
  TestEvent
} from '../types/abTesting';
import { useAnalytics } from '../hooks/useAnalytics';

interface UseABTestingProps {
  userId?: string;
  autoInitialize?: boolean;
  config?: ABTestConfig;
}

export const useABTesting = ({
  userId = 'anonymous_user',
  autoInitialize = true,
  config = {}
}: UseABTestingProps = {}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTests, setActiveTests] = useState<ABTest[]>([]);
  const [userAssignments, setUserAssignments] = useState<UserAssignment[]>([]);
  const [testResults, setTestResults] = useState<ABTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { trackEvent, getUserProperties } = useAnalytics();
  const storageKey = `ab_tests_${userId}`;
  const hasLoggedRef = useRef<Set<string>>(new Set());

  // Initialize A/B testing system
  useEffect(() => {
    if (autoInitialize && !isInitialized) {
      initializeABTesting();
    }
  }, [autoInitialize, isInitialized]);

  const initializeABTesting = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load user assignments from localStorage
      const savedAssignments = localStorage.getItem(storageKey);
      if (savedAssignments) {
        const assignments = JSON.parse(savedAssignments);
        setUserAssignments(assignments);
      }

      // Load active tests
      const tests = await loadActiveTests();
      setActiveTests(tests);

      // Re-evaluate assignments for active tests
      await evaluateTestAssignments(tests);

      setIsInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize A/B testing');
    } finally {
      setIsLoading(false);
    }
  }, [storageKey]);

  // Load active tests from API or local storage
  const loadActiveTests = useCallback(async (): Promise<ABTest[]> => {
    try {
      // In production, this would fetch from your API
      // For demo purposes, return sample tests
      return getSampleTests();
    } catch (error) {
      console.error('Failed to load active tests:', error);
      return [];
    }
  }, []);

  // Sample tests for demonstration
  const getSampleTests = useCallback((): ABTest[] => [
    {
      id: 'onboarding_flow_v2',
      name: 'Onboarding Flow Redesign',
      description: 'Test new onboarding flow with video tutorial vs traditional text tutorial',
      status: 'active',
      type: 'ui',
      targeting: {
        criteria: [
          { field: 'userType', operator: 'equals', value: 'new' },
          { field: 'joinDate', operator: 'greaterThan', value: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() }
        ],
        segments: [
          {
            id: 'new_users_mobile',
            name: 'New Mobile Users',
            criteria: [
              { field: 'deviceType', operator: 'equals', value: 'mobile' },
              { field: 'userType', operator: 'equals', value: 'new' }
            ],
            allocation: 0.5,
            targetSampleSize: 1000
          }
        ]
      },
      variations: [
        {
          id: 'control',
          name: 'Control',
          description: 'Current text-based onboarding',
          allocation: 0.5,
          changes: [],
          isControl: true
        },
        {
          id: 'video_tutorial',
          name: 'Video Tutorial',
          description: 'New video-based onboarding flow',
          allocation: 0.5,
          changes: [
            { type: 'component', target: 'OnboardingFlow', property: 'tutorialType', value: 'video' },
            { type: 'text', target: 'OnboardingFlow', property: 'welcomeMessage', value: 'Watch our quick tutorial!' }
          ]
        }
      ],
      metrics: [
        { id: 'completion_rate', name: 'Onboarding Completion Rate', type: 'conversion', goal: 0.85, weighting: 0.4 },
        { id: 'time_to_complete', name: 'Time to Complete', type: 'engagement', goal: 300, weighting: 0.3 },
        { id: 'retention_day1', name: 'Day 1 Retention', type: 'retention', goal: 0.7, weighting: 0.3 }
      ],
      trafficAllocation: 0.8,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-01'),
      confidenceLevel: 0.95,
      minSampleSize: 500
    },
    {
      id: 'difficulty_hint_placement',
      name: 'Difficulty Hint Placement',
      description: 'Test optimal placement for difficulty hints in the game UI',
      status: 'active',
      type: 'ui',
      targeting: {
        criteria: [
          { field: 'experienceLevel', operator: 'in', value: ['beginner', 'intermediate'] }
        ],
        segments: [
          {
            id: 'beginners',
            name: 'Beginner Players',
            criteria: [{ field: 'experienceLevel', operator: 'equals', value: 'beginner' }],
            allocation: 0.6,
            targetSampleSize: 800
          }
        ]
      },
      variations: [
        {
          id: 'top_right',
          name: 'Top Right',
          description: 'Hints in top right corner',
          allocation: 0.33,
          changes: [
            { type: 'style', target: 'hintButton', property: 'position', value: 'top-right' }
          ]
        },
        {
          id: 'bottom_left',
          name: 'Bottom Left',
          description: 'Hints in bottom left corner',
          allocation: 0.33,
          changes: [
            { type: 'style', target: 'hintButton', property: 'position', value: 'bottom-left' }
          ]
        },
        {
          id: 'floating',
          name: 'Floating Button',
          description: 'Floating hint button',
          allocation: 0.34,
          changes: [
            { type: 'style', target: 'hintButton', property: 'position', value: 'floating' }
          ]
        }
      ],
      metrics: [
        { id: 'hint_click_rate', name: 'Hint Click Rate', type: 'engagement', goal: 0.4, weighting: 0.5 },
        { id: 'puzzle_completion_time', name: 'Puzzle Completion Time', type: 'engagement', goal: 180, weighting: 0.3 },
        { id: 'user_satisfaction', name: 'User Satisfaction', type: 'conversion', goal: 4.2, weighting: 0.2 }
      ],
      trafficAllocation: 0.6,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-15'),
      confidenceLevel: 0.95,
      minSampleSize: 300
    }
  ], []);

  // Evaluate user eligibility for tests and assign variations
  const evaluateTestAssignments = useCallback(async (tests: ABTest[]) => {
    const userProperties = await getUserProperties();
    const newAssignments: UserAssignment[] = [];

    for (const test of tests) {
      if (test.status !== 'active') continue;

      // Check if user already has an assignment for this test
      const existingAssignment = userAssignments.find(a => a.testId === test.id);
      if (existingAssignment) {
        newAssignments.push(existingAssignment);
        continue;
      }

      // Check if user is eligible for this test
      const isEligible = await evaluateEligibility(test, userProperties);
      if (!isEligible) continue;

      // Check if test should be shown to this user based on traffic allocation
      if (Math.random() > test.trafficAllocation) continue;

      // Assign to variation
      const variation = selectVariation(test, userProperties);
      if (variation) {
        const assignment: UserAssignment = {
          testId: test.id,
          userId,
          variationId: variation.id,
          assignedAt: new Date(),
          segment: determineUserSegment(test, userProperties)
        };

        newAssignments.push(assignment);

        // Track assignment event
        trackEvent('ab_test_assigned', {
          testId: test.id,
          testName: test.name,
          variationId: variation.id,
          variationName: variation.name,
          segment: assignment.segment?.id
        });
      }
    }

    setUserAssignments(newAssignments);
    localStorage.setItem(storageKey, JSON.stringify(newAssignments));
  }, [userAssignments, userId, storageKey, getUserProperties, trackEvent]);

  // Evaluate if user meets test eligibility criteria
  const evaluateEligibility = useCallback(async (test: ABTest, userProperties: any): Promise<boolean> => {
    for (const criterion of test.targeting.criteria) {
      const userValue = userProperties[criterion.field];
      if (!meetsCriterion(userValue, criterion)) {
        return false;
      }
    }
    return true;
  }, []);

  // Check if user value meets criterion
  const meetsCriterion = useCallback((userValue: any, criterion: TargetingCriteria): boolean => {
    switch (criterion.operator) {
      case 'equals':
        return userValue === criterion.value;
      case 'notEquals':
        return userValue !== criterion.value;
      case 'greaterThan':
        return new Date(userValue) > new Date(criterion.value);
      case 'lessThan':
        return new Date(userValue) < new Date(criterion.value);
      case 'contains':
        return Array.isArray(userValue) ? userValue.includes(criterion.value) : String(userValue).includes(String(criterion.value));
      case 'in':
        return Array.isArray(criterion.value) && criterion.value.includes(userValue);
      default:
        return true;
    }
  }, []);

  // Select variation for user based on allocation and segmentation
  const selectVariation = useCallback((test: ABTest, userProperties: any): ABTestVariation | null => {
    const segment = determineUserSegment(test, userProperties);

    // Use consistent hashing to ensure same user gets same variation
    const hash = hashString(`${test.id}_${userId}`);
    const random = hash / 0xFFFFFFFF;

    let cumulativeAllocation = 0;
    const variations = segment ?
      test.variations.filter(v => true) : // All variations for this segment
      test.variations; // All variations if no specific segment

    for (const variation of variations) {
      cumulativeAllocation += variation.allocation;
      if (random <= cumulativeAllocation) {
        return variation;
      }
    }

    return test.variations[0]; // Fallback to first variation
  }, [userId]);

  // Determine which segment user belongs to
  const determineUserSegment = useCallback((test: ABTest, userProperties: any): ABTestUserSegment | null => {
    for (const segment of test.targeting.segments) {
      let matches = true;
      for (const criterion of segment.criteria) {
        const userValue = userProperties[criterion.field];
        if (!meetsCriterion(userValue, criterion)) {
          matches = false;
          break;
        }
      }
      if (matches) {
        return segment;
      }
    }
    return null;
  }, [meetsCriterion]);

  // Get variation for a specific test
  const getVariation = useCallback((testId: string): ABTestVariation | null => {
    const test = activeTests.find(t => t.id === testId);
    const assignment = userAssignments.find(a => a.testId === testId);

    if (!test || !assignment) return null;

    return test.variations.find(v => v.id === assignment.variationId) || null;
  }, [activeTests, userAssignments]);

  // Track test events
  const trackTestEvent = useCallback((testId: string, eventName: string, value?: number, properties?: any) => {
    const assignment = userAssignments.find(a => a.testId === testId);
    if (!assignment) return;

    // Log once per unique event per session
    const eventKey = `${testId}_${eventName}_${assignment.variationId}`;
    if (hasLoggedRef.current.has(eventKey)) return;
    hasLoggedRef.current.add(eventKey);

    const event: TestEvent = {
      testId,
      variationId: assignment.variationId,
      userId,
      eventName,
      timestamp: new Date(),
      value,
      properties,
      sessionId: generateSessionId()
    };

    // Store event locally (in production, send to analytics)
    const savedEvents = localStorage.getItem(`ab_events_${testId}`);
    const events = savedEvents ? JSON.parse(savedEvents) : [];
    events.push(event);
    localStorage.setItem(`ab_events_${testId}`, JSON.stringify(events));

    // Track in analytics
    trackEvent(eventName, {
      ...properties,
      abTestId: testId,
      abVariationId: assignment.variationId,
      abEventValue: value
    });
  }, [userAssignments, userId, trackEvent]);

  // Get current test assignments
  const getCurrentAssignments = useCallback(() => {
    return userAssignments.map(assignment => {
      const test = activeTests.find(t => t.id === assignment.testId);
      const variation = test?.variations.find(v => v.id === assignment.variationId);

      return {
        testId: assignment.testId,
        testName: test?.name || '',
        variationId: assignment.variationId,
        variationName: variation?.name || '',
        isControl: variation?.isControl || false,
        segment: assignment.segment
      };
    });
  }, [userAssignments, activeTests]);

  // Calculate test statistics
  const getTestStatistics = useCallback((testId: string): ABTestStats | null => {
    const test = activeTests.find(t => t.id === testId);
    if (!test) return null;

    const events = getTestEvents(testId);
    const stats = calculateStatistics(test, events);

    return stats;
  }, [activeTests]);

  // Get events for a specific test
  const getTestEvents = useCallback((testId: string): TestEvent[] => {
    const savedEvents = localStorage.getItem(`ab_events_${testId}`);
    return savedEvents ? JSON.parse(savedEvents) : [];
  }, []);

  // Calculate statistical analysis for test
  const calculateStatistics = useCallback((test: ABTest, events: TestEvent[]): ABTestStats => {
    const variationStats: { [key: string]: any } = {};

    // Group events by variation
    const eventsByVariation = events.reduce((acc, event) => {
      if (!acc[event.variationId]) {
        acc[event.variationId] = [];
      }
      acc[event.variationId].push(event);
      return acc;
    }, {} as { [key: string]: TestEvent[] });

    // Calculate metrics for each variation
    for (const variation of test.variations) {
      const variationEvents = eventsByVariation[variation.id] || [];
      const variationAssignments = userAssignments.filter(a => a.variationId === variation.id);
      const sampleSize = variationAssignments.length;

      const metrics: { [key: string]: any } = {};

      for (const metric of test.metrics) {
        const metricEvents = variationEvents.filter(e => e.eventName === metric.id);
        const metricStats = calculateMetricStats(metric, metricEvents, sampleSize);
        metrics[metric.id] = metricStats;
      }

      variationStats[variation.id] = {
        sampleSize,
        metrics
      };
    }

    // Calculate statistical significance
    const confidenceIntervals = calculateConfidenceIntervals(test, variationStats);

    return {
      testId: test.id,
      testName: test.name,
      totalParticipants: userAssignments.filter(a => a.testId === test.id).length,
      variationStats,
      confidenceIntervals,
      isSignificant: checkStatisticalSignificance(confidenceIntervals, test.confidenceLevel),
      updatedAt: new Date()
    };
  }, [userAssignments]);

  // Calculate statistics for a specific metric
  const calculateMetricStats = useCallback((metric: ABTestMetrics, events: TestEvent[], sampleSize: number) => {
    if (sampleSize === 0) {
      return {
        value: 0,
        count: 0,
        rate: 0,
        mean: 0,
        median: 0,
        standardDeviation: 0
      };
    }

    const values = events.filter(e => e.value !== undefined).map(e => e.value as number);
    const count = events.length;

    switch (metric.type) {
      case 'conversion':
        const rate = count / sampleSize;
        return {
          value: rate,
          count,
          rate,
          mean: rate,
          median: rate,
          standardDeviation: Math.sqrt(rate * (1 - rate) / sampleSize)
        };

      case 'engagement':
        const meanValue = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
        const medianValue = values.length > 0 ? values.sort((a, b) => a - b)[Math.floor(values.length / 2)] : 0;
        const variance = values.length > 0 ? values.reduce((sum, val) => sum + Math.pow(val - meanValue, 2), 0) / values.length : 0;
        const standardDeviation = Math.sqrt(variance);

        return {
          value: meanValue,
          count,
          rate: meanValue / metric.goal,
          mean: meanValue,
          median: medianValue,
          standardDeviation
        };

      default:
        return {
          value: 0,
          count,
          rate: 0,
          mean: 0,
          median: 0,
          standardDeviation: 0
        };
    }
  }, []);

  // Calculate confidence intervals for each metric
  const calculateConfidenceIntervals = useCallback((test: ABTest, variationStats: any) => {
    const intervals: any = {};

    for (const metric of test.metrics) {
      intervals[metric.id] = {};

      for (const variation of test.variations) {
        const stats = variationStats[variation.id]?.metrics[metric.id];
        if (!stats) continue;

        const zScore = getZScore(test.confidenceLevel);
        const marginOfError = zScore * (stats.standardDeviation / Math.sqrt(stats.sampleSize));

        intervals[metric.id][variation.id] = {
          lower: stats.mean - marginOfError,
          upper: stats.mean + marginOfError,
          marginOfError
        };
      }
    }

    return intervals;
  }, []);

  // Check if results are statistically significant
  const checkStatisticalSignificance = useCallback((confidenceIntervals: any, confidenceLevel: number): boolean => {
    // This is a simplified check - in production, use proper statistical tests
    for (const metricId in confidenceIntervals) {
      const intervals = confidenceIntervals[metricId];
      const variationIds = Object.keys(intervals);

      if (variationIds.length < 2) continue;

      // Check if intervals overlap
      const [var1, var2] = variationIds.slice(0, 2);
      const interval1 = intervals[var1];
      const interval2 = intervals[var2];

      if (interval1.upper < interval2.lower || interval2.upper < interval1.lower) {
        return true; // No overlap = significant
      }
    }

    return false;
  }, []);

  // Utility functions
  const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  const generateSessionId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const getZScore = (confidenceLevel: number): number => {
    const zScores: { [key: number]: number } = {
      0.90: 1.645,
      0.95: 1.96,
      0.99: 2.576
    };
    return zScores[confidenceLevel] || 1.96;
  };

  // Reset all test data (for development)
  const resetTestData = useCallback(() => {
    localStorage.removeItem(storageKey);
    userAssignments.forEach(assignment => {
      localStorage.removeItem(`ab_events_${assignment.testId}`);
    });
    setUserAssignments([]);
    setTestResults([]);
    hasLoggedRef.current.clear();
  }, [storageKey, userAssignments]);

  return {
    // State
    isInitialized,
    isLoading,
    error,
    activeTests,
    userAssignments: getCurrentAssignments(),
    testResults,

    // Core functionality
    getVariation,
    trackTestEvent,
    getTestStatistics,
    resetTestData,

    // Analytics
    totalActiveTests: activeTests.filter(t => t.status === 'active').length,
    totalUserAssignments: userAssignments.length
  };
};

export default useABTesting;