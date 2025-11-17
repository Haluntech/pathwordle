export interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  type: ABTestType;
  targeting: TestTargeting;
  variations: TestVariation[];
  metrics: TestMetrics;
  schedule: TestSchedule;
  configuration: TestConfiguration;
  results?: TestResults;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  createdBy: string;
}

export type ABTestType =
  | 'ui_element'
  | 'game_mechanic'
  | 'difficulty_level'
  | 'reward_system'
  | 'tutorial_flow'
  | 'onboarding'
  | 'color_scheme'
  | 'feature_flag'
  | 'pricing_display'
  | 'social_sharing'
  | 'notification_timing'
  | 'hint_system'
  | 'daily_challenge'
  | 'leaderboard_display'
  | 'achievement_system';

export interface TestTargeting {
  percentage: number; // 0-100, percentage of users
  criteria: TargetCriteria[];
  segments?: UserSegment[];
  excludeSegments?: string[];
  deviceTypes?: DeviceType[];
  geolocation?: GeolocationCriteria;
  customAttributes?: CustomAttribute[];
}

export interface TargetCriteria {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'regex';
  value: any;
}

export interface UserSegment {
  id: string;
  name: string;
  description: string;
  size: number;
  criteria: TargetCriteria[];
  isActive: boolean;
  createdAt: number;
}

export interface DeviceType {
  type: 'desktop' | 'mobile' | 'tablet';
  os?: string;
  browser?: string;
  version?: string;
}

export interface GeolocationCriteria {
  countries?: string[];
  regions?: string[];
  languages?: string[];
  timezones?: string[];
}

export interface CustomAttribute {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  operator: TargetCriteria['operator'];
  value: any;
}

export interface TestVariation {
  id: string;
  name: string;
  description: string;
  weight: number; // Traffic distribution weight
  isActive: boolean;
  changes: VariationChanges;
  configuration?: Record<string, any>;
}

export interface VariationChanges {
  elements?: ElementChange[];
  styles?: StyleChange[];
  text?: TextChange[];
  logic?: LogicChange[];
  features?: FeatureChange[];
  components?: ComponentChange[];
}

export interface ElementChange {
  selector: string;
  type: 'replace' | 'modify' | 'add' | 'remove' | 'reorder';
  content?: string;
  attributes?: Record<string, any>;
  position?: number;
}

export interface StyleChange {
  selector: string;
  property: string;
  value: string | number;
  important?: boolean;
  media?: string;
}

export interface TextChange {
  key: string;
  type: 'replace' | 'modify' | 'add' | 'remove';
  value: string;
  context?: string;
}

export interface LogicChange {
  component: string;
  type: 'condition' | 'loop' | 'calculation' | 'api_call';
  condition?: string;
  action?: string;
  parameters?: Record<string, any>;
}

export interface FeatureChange {
  feature: string;
  enabled: boolean;
  configuration?: Record<string, any>;
}

export interface ComponentChange {
  component: string;
  type: 'props' | 'state' | 'method' | 'event_handler';
  change: string;
  value?: any;
}

export interface TestMetrics {
  primary: TestMetric;
  secondary?: TestMetric[];
  tracking: TrackingConfiguration;
  statistical: StatisticalConfiguration;
}

export interface TestMetric {
  id: string;
  name: string;
  type: 'conversion' | 'engagement' | 'retention' | 'performance' | 'revenue' | 'custom';
  description: string;
  calculation: MetricCalculation;
  goal?: number; // Target value for optimization
  successCriteria?: SuccessCriteria;
}

export interface MetricCalculation {
  event: string;
  aggregation: 'count' | 'sum' | 'average' | 'rate' | 'custom';
  timeframe?: number; // milliseconds
  conditions?: string[]; // Additional conditions
  formula?: string; // Custom formula
}

export interface SuccessCriteria {
  type: 'absolute' | 'relative' | 'statistical';
  threshold: number;
  confidenceLevel?: number; // 0-1
  minimumSampleSize?: number;
}

export interface TrackingConfiguration {
  events: string[];
  customProperties?: Record<string, any>;
  samplingRate?: number; // 0-1
  userProperties?: string[];
}

export interface StatisticalConfiguration {
  confidenceLevel: number; // 0-1
  minimumSampleSize: number;
  testDuration?: number; // milliseconds
  powerAnalysis: boolean;
  sequential: boolean;
  earlyStopping: boolean;
  stoppingCriteria?: StoppingCriteria;
}

export interface StoppingCriteria {
  type: 'confidence' | 'sample_size' | 'duration' | 'lift' | 'risk';
  threshold: number;
  minVariant?: string;
}

export interface TestSchedule {
  startMode: 'immediate' | 'scheduled' | 'manual';
  startTime?: number;
  endTime?: number;
  duration?: number; // milliseconds
  autoStop?: boolean;
  trafficAllocation?: 'fixed' | 'adaptive';
}

export interface TestConfiguration {
  resetOnVariationChange: boolean;
  cookieDomain?: string;
  localStorageKey?: string;
  serverSide: boolean;
  edgeSide: boolean;
  anonymousMode: boolean;
  privacyCompliance: boolean;
  dataRetention: number; // days
}

export interface TestResults {
  variantResults: VariantResult[];
  summary: TestSummary;
  statisticalSignificance: StatisticalTest;
  insights: TestInsight[];
  recommendations: TestRecommendation[];
  rawData?: RawTestData[];
}

export interface VariantResult {
  variationId: string;
  variationName: string;
  metrics: MetricResult[];
  participants: number;
  conversions: number;
  revenue?: number;
  sampleSize: number;
  confidence: number;
  pValue?: number;
  winner: boolean;
}

export interface MetricResult {
  metricId: string;
  metricName: string;
  value: number;
  rate?: number;
  improvement?: number;
  confidence: number;
  sampleSize: number;
  lift?: number;
  significance?: string;
}

export interface TestSummary {
  totalParticipants: number;
  totalConversions: number;
  totalRevenue?: number;
  bestVariation?: {
    variationId: string;
    variationName: string;
    improvement: number;
    confidence: number;
  };
  testDuration: number;
  status: 'inconclusive' | 'significant' | 'conclusive';
  successRate: number;
}

export interface StatisticalTest {
  testType: 'z_test' | 'chi_square' | 't_test' | 'mann_whitney' | 'anova';
  pValue: number;
  confidenceInterval: {
    lower: number;
    upper: number;
    level: number;
  };
  effectSize: number;
  power: number;
  testScore: number;
  criticalValue: number;
  isSignificant: boolean;
}

export interface TestInsight {
  type: 'performance' | 'user_behavior' | 'technical' | 'business';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  data?: any;
}

export interface TestRecommendation {
  type: 'implement' | 'iterate' | 'pause' | 'expand' | 'abandon';
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  reasoning: string;
  nextSteps?: string[];
}

export interface RawTestData {
  userId: string;
  testId: string;
  variationId: string;
  timestamp: number;
  events: TestEvent[];
  properties: Record<string, any>;
  conversions: ConversionEvent[];
  sessionData: SessionData;
}

export interface TestEvent {
  eventName: string;
  timestamp: number;
  properties?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  testId?: string;
  variationId?: string;
}

export interface ConversionEvent {
  eventName: string;
  timestamp: number;
  value?: number;
  properties?: Record<string, any>;
}

export interface SessionData {
  sessionId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  pageViews: number;
  bounceRate?: number;
  device: DeviceInfo;
  location?: LocationInfo;
}

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  language: string;
  screenSize: { width: number; height: number };
  deviceType: string;
  browser?: string;
  version?: string;
}

export interface LocationInfo {
  country: string;
  region: string;
  city?: string;
  timezone: string;
}

export interface ABTestFramework {
  createTest: (test: Omit<ABTest, 'id' | 'createdAt' | 'createdBy'>) => Promise<ABTest>;
  updateTest: (testId: string, updates: Partial<ABTest>) => Promise<ABTest>;
  deleteTest: (testId: string) => Promise<boolean>;
  getTest: (testId: string) => Promise<ABTest | null>;
  getActiveTests: () => Promise<ABTest[]>;
  getUserVariation: (testId: string, userId?: string) => Promise<TestVariation | null>;
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
  trackConversion: (eventName: string, value?: number, properties?: Record<string, any>) => void;
  getTestResults: (testId: string) => Promise<TestResults>;
  analyzeTest: (testId: string) => Promise<TestAnalysis>;
  scheduleTest: (testId: string, schedule: TestSchedule) => Promise<boolean>;
  pauseTest: (testId: string) => Promise<boolean>;
  resumeTest: (testId: string) => Promise<boolean>;
  stopTest: (testId: string, reason?: string) => Promise<TestResults>;
}

export interface TestAnalysis {
  testId: string;
  test: ABTest;
  results: TestResults;
  insights: string[];
  recommendations: string[];
  statisticalPower: number;
  confidence: string;
  conclusion: 'continue' | 'implement' | 'pause' | 'stop';
}

export interface ABTestConfiguration {
  framework: ABTestFramework;
  serverEndpoint?: string;
  apiKey?: string;
  defaultTestDuration: number; // days
  confidenceLevel: number; // 0-1
  minimumSampleSize: number;
  autoSave: boolean;
  privacy: {
    anonymizeData: boolean;
    dataRetention: number; // days
    cookiePolicy: string;
    gdprCompliant: boolean;
  };
  ui: {
    adminPanel: boolean;
    publicDashboard: boolean;
    variantIndicator: boolean;
    overrideNotice: boolean;
  };
  analytics: {
    integration: string; // 'google-analytics' | 'mixpanel' | 'amplitude' | 'custom'
    customTrackers?: string[];
  };
}

// Predefined test templates
export const TEST_TEMPLATES: Partial<ABTest>[] = [
  {
    name: 'Welcome Message A/B Test',
    description: 'Test different welcome message copies for better user engagement',
    type: 'ui_element',
    variations: [
      {
        id: 'control',
        name: 'Current Message',
        weight: 50,
        isActive: true,
        changes: {
          text: [
            {
              key: 'welcome_title',
              type: 'replace',
              value: 'Welcome to PathWordle!'
            }
          ]
        }
      },
      {
        id: 'variant_a',
        name: 'Emotional Message',
        weight: 50,
        isActive: true,
        changes: {
          text: [
            {
              key: 'welcome_title',
              type: 'replace',
              value: 'Ready for your daily word puzzle challenge? 🎯'
            }
          ]
        }
      }
    ],
    metrics: {
      primary: {
        id: 'onboarding_completion',
        name: 'Onboarding Completion',
        type: 'conversion',
        description: 'Users who complete the onboarding flow',
        calculation: {
          event: 'onboarding_completed',
          aggregation: 'count',
          timeframe: 86400000 // 24 hours
        },
        goal: 0.75,
        successCriteria: {
          type: 'relative',
          threshold: 0.15,
          confidenceLevel: 0.95,
          minimumSampleSize: 1000
        }
      },
      secondary: [
        {
          id: 'time_to_first_game',
          name: 'Time to First Game',
          type: 'engagement',
          description: 'Average time from page load to first game start',
          calculation: {
            event: 'first_game_started',
            aggregation: 'average',
            timeframe: 3600000 // 1 hour
          }
        },
        {
          id: 'welcome_button_click',
          name: 'Welcome Button Click Rate',
          type: 'engagement',
          description: 'Click rate on welcome button',
          calculation: {
            event: 'welcome_button_click',
            aggregation: 'rate',
            event: 'welcome_button_shown'
          }
        }
      ]
    },
    targeting: {
      percentage: 100,
      criteria: [
        {
          field: 'has_completed_onboarding',
          operator: 'equals',
          value: false
        }
      ]
    },
    schedule: {
      startMode: 'immediate',
      duration: 1209600000 // 14 days
    },
    configuration: {
      resetOnVariationChange: false,
      localStorageKey: 'ab_test_welcome',
      privacyCompliance: true
    }
  },
  {
    name: 'Difficulty Badge A/B Test',
    description: 'Test different difficulty badge designs for better user understanding',
    type: 'ui_element',
    variations: [
      {
        id: 'control',
        name: 'Text Badge',
        weight: 50,
        isActive: true,
        changes: {
          styles: [
            {
              selector: '.difficulty-badge',
              property: 'background-color',
              value: '#3B82F6'
            },
            {
              selector: '.difficulty-badge',
              property: 'color',
              value: '#FFFFFF'
            }
          ]
        }
      },
      {
        id: 'variant_a',
        name: 'Icon Badge',
        weight: 50,
        isActive: true,
        changes: {
          elements: [
            {
              selector: '.difficulty-badge',
              type: 'replace',
              content: '⭐'
            }
          ]
        }
      }
    ],
    metrics: {
      primary: {
        id: 'game_success_rate',
        name: 'Game Success Rate',
        type: 'engagement',
        description: 'Percentage of games won',
        calculation: {
          event: 'game_completed',
          aggregation: 'rate',
          event: 'game_started'
        },
        goal: 0.05,
        successCriteria: {
          type: 'absolute',
          threshold: 0.6,
          confidenceLevel: 0.95,
          minimumSampleSize: 500
        }
      }
    }
  },
  {
    name: 'Hint System Impact Test',
    description: 'Test whether hints help or hurt user engagement',
    type: 'feature_flag',
    variations: [
      {
        id: 'control',
        name: 'Hints Available',
        weight: 50,
        isActive: true,
        features: [
          {
            feature: 'hints_enabled',
            enabled: true
          }
        ]
      },
      {
        id: 'variant_a',
        name: 'Hints Disabled',
        weight: 50,
        isActive: true,
        features: [
          {
            feature: 'hints_enabled',
            enabled: false
          }
        ]
      }
    ],
    metrics: {
      primary: {
        id: 'retention_rate',
        name: 'User Retention Rate',
        type: 'retention',
        description: 'Users who return within 7 days',
        calculation: {
          event: 'user_returned',
          aggregation: 'rate',
          timeframe: 604800000 // 7 days
        },
        goal: -0.1,
        successCriteria: {
          type: 'relative',
          threshold: -0.05,
          confidenceLevel: 0.95,
          minimumSampleSize: 1000
        }
      },
      secondary: [
        {
          id: 'hint_usage_rate',
          name: 'Hint Usage Rate',
          type: 'engagement',
          description: 'Percentage of games that use hints',
          calculation: {
            event: 'hint_used',
            aggregation: 'rate',
            event: 'game_started'
          }
        },
        {
          id: 'game_completion_time',
          name: 'Game Completion Time',
          type: 'performance',
          description: 'Average time to complete games',
          calculation: {
            event: 'game_completed',
            aggregation: 'average',
            event: 'game_started'
          }
        }
      ]
    }
  },
  {
    name: 'Reward System A/B Test',
    description: 'Test different reward structures for user motivation',
    type: 'reward_system',
    variations: [
      {
        id: 'control',
        name: 'Points System',
        weight: 50,
        isActive: true,
        features: [
          {
            feature: 'points_enabled',
            enabled: true
          },
          {
            feature: 'points_multiplier',
            value: 1.0
          }
        ]
      },
      {
        id: 'variant_a',
        name: 'Badge System',
        weight: 50,
        isActive: true,
        features: [
          {
            feature: 'points_enabled',
            enabled: false
          },
          {
            feature: 'badge_system',
            enabled: true
          }
        ]
      }
    ],
    metrics: {
      primary: {
        id: 'daily_active_users',
        name: 'Daily Active Users',
        type: 'retention',
        description: 'Users who play at least once per day',
        calculation: {
          event: 'daily_login',
          aggregation: 'count',
          timeframe: 86400000 // 24 hours
        },
        goal: 0.1,
        successCriteria: {
          type: 'relative',
          threshold: 0.1,
          confidenceLevel: 0.9,
          minimumSampleSize: 1000
        }
      },
      secondary: [
        {
          id: 'total_sessions',
          name: 'Total Game Sessions',
          type: 'engagement',
          description: 'Total number of game sessions',
          calculation: {
            event: 'game_started',
            aggregation: 'count'
          }
        },
        {
          id: 'session_duration',
          name: 'Average Session Duration',
          type: 'engagement',
          description: 'Average time spent per session',
          calculation: {
            event: 'session_ended',
            aggregation: 'average',
            event: 'session_started'
          }
        }
      ]
    }
  },
  {
    name: 'Color Theme A/B Test',
    description: 'Test different color themes for user preference',
    type: 'color_scheme',
    variations: [
      {
        id: 'control',
        name: 'Light Theme',
        weight: 50,
        isActive: true,
        changes: {
          features: [
            {
              feature: 'theme',
              configuration: {
                mode: 'light'
              }
            }
          ]
        }
      },
      {
        id: 'variant_a',
        name: 'Dark Theme',
        weight: 50,
        isActive: true,
        changes: {
          features: [
            {
              feature: 'theme',
              configuration: {
                mode: 'dark'
              }
            }
          ]
        }
      }
    ],
    metrics: {
      primary: {
        id: 'session_duration',
        name: 'Average Session Duration',
        type: 'engagement',
        description: 'Average time users spend in the app',
        calculation: {
          event: 'session_ended',
          aggregation: 'average',
          event: 'session_started'
        },
        goal: 120000, // 2 minutes
        successCriteria: {
          type: 'absolute',
          threshold: 150000,
          confidenceLevel: 0.8,
          minimumSampleSize: 500
        }
      },
      secondary: [
        {
          id: 'bounce_rate',
          name: 'Bounce Rate',
          type: 'engagement',
          description: 'Percentage of sessions that end quickly',
          calculation: {
            event: 'session_ended_early',
            aggregation: 'rate',
            event: 'session_started'
          }
        }
      ]
    }
  }
] as const;

// Default configuration
export const DEFAULT_AB_TEST_CONFIG: ABTestConfiguration = {
  framework: 'custom',
  defaultTestDuration: 14,
  confidenceLevel: 0.95,
  minimumSampleSize: 1000,
  autoSave: true,
  privacy: {
    anonymizeData: true,
    dataRetention: 90,
    cookiePolicy: 'strict',
    gdprCompliant: true
  },
  ui: {
    adminPanel: true,
    publicDashboard: false,
    variantIndicator: false,
    overrideNotice: true
  },
  analytics: {
    integration: 'custom',
    customTrackers: []
  }
} as const;