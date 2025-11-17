export interface PushNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  icon: string;
  badge?: string;
  image?: string;
  data?: NotificationData;
  actions?: NotificationAction[];
  timestamp: number;
  priority: 'low' | 'normal' | 'high';
  requireInteraction: boolean;
  silent: boolean;
  tag?: string;
  renotify: boolean;
  ttl?: number; // Time to live in seconds
}

export interface NotificationData {
  [key: string]: any;
  url?: string;
  gameId?: string;
  playerId?: string;
  challengeId?: string;
  friendId?: string;
  achievementId?: string;
  puzzleId?: string;
  leaderboardId?: string;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface NotificationSchedule {
  id: string;
  notification: Omit<PushNotification, 'timestamp'>;
  trigger: NotificationTrigger;
  isActive: boolean;
  createdAt: number;
  lastTriggered?: number;
  nextTrigger?: number;
  triggerCount: number;
  maxTriggers?: number;
}

export interface NotificationTrigger {
  type: 'immediate' | 'scheduled' | 'recurring' | 'conditional';

  // For scheduled notifications
  scheduledTime?: number; // Unix timestamp

  // For recurring notifications
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string; // HH:mm format
    daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
    dayOfMonth?: number; // 1-31
  };

  // For conditional notifications
  condition?: {
    event: string;
    property: string;
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
    value: any;
  };

  // For time-based delays
  delay?: number; // milliseconds
}

export interface NotificationPreferences {
  enabled: boolean;
  categories: NotificationCategoryPreferences;
  quietHours: QuietHours;
  deviceSettings: DeviceNotificationSettings;
  frequency: FrequencySettings;
}

export interface NotificationCategoryPreferences {
  dailyChallenge: boolean;
  achievements: boolean;
  friendActivity: boolean;
  leaderboards: boolean;
  puzzleRecommendations: boolean;
  socialFeatures: boolean;
  updates: boolean;
  reminders: boolean;
  promotions: boolean;
}

export interface QuietHours {
  enabled: boolean;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  timezone: string;  // IANA timezone
  allowUrgent: boolean;
}

export interface DeviceNotificationSettings {
  sound: boolean;
  vibration: boolean;
  badge: boolean;
  alert: boolean;
  banner: boolean;
  lockScreen: boolean;
}

export interface FrequencySettings {
  maxPerDay: number;
  maxPerHour: number;
  minInterval: number; // milliseconds between notifications
  smartScheduling: boolean;
}

export interface NotificationStats {
  sent: number;
  delivered: number;
  clicked: number;
  dismissed: number;
  conversionRate: number;
  categoryStats: Record<string, CategoryNotificationStats>;
  timeStats: {
    bestSendingTimes: number[];
    averageEngagementTime: number;
    peakActivityHours: number[];
  };
  userPreferences: NotificationPreferences;
}

export interface CategoryNotificationStats {
  sent: number;
  clicked: number;
  ctr: number; // Click-through rate
  avgEngagementTime: number;
  lastSent: number;
}

export type NotificationType =
  | 'daily_challenge'
  | 'achievement_unlocked'
  | 'friend_challenge'
  | 'friend_completed'
  | 'leaderboard_update'
  | 'puzzle_recommended'
  | 'streak_milestone'
  | 'weekly_summary'
  | 'feature_update'
  | 'special_event'
  | 'reminder'
  | 'invitation'
  | 'social_update'
  | 'learning_progress'
  | 'speed_challenge'
  | 'puzzle_approved'
  | 'puzzle_featured';

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  defaultTitle: string;
  defaultBody: string;
  defaultIcon: string;
  defaultActions: NotificationAction[];
  variables: TemplateVariable[];
  localizedContent: Record<string, LocalizedNotificationContent>;
  priority: 'low' | 'normal' | 'high';
  requireInteraction: boolean;
  ttl: number;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  required: boolean;
  defaultValue?: any;
}

export interface LocalizedNotificationContent {
  title: string;
  body: string;
  actions?: NotificationAction[];
}

export interface NotificationCampaign {
  id: string;
  name: string;
  description: string;
  type: 'marketing' | 'engagement' | 'retention' | 'feature_promotion';
  targetAudience: CampaignTargetAudience;
  notifications: NotificationTemplate[];
  schedule: NotificationSchedule[];
  goals: CampaignGoals;
  isActive: boolean;
  createdAt: number;
  startDate: number;
  endDate?: number;
  metrics: CampaignMetrics;
}

export interface CampaignTargetAudience {
  segmentIds: string[];
  userCount: number;
  criteria: AudienceCriteria[];
}

export interface AudienceCriteria {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'not_in';
  value: any;
}

export interface CampaignGoals {
  primaryGoal: string;
  targetMetrics: Record<string, number>;
  successThreshold: number;
}

export interface CampaignMetrics {
  sent: number;
  delivered: number;
  clicked: number;
  converted: number;
  ctr: number;
  conversionRate: number;
  revenue: number;
  cost: number;
  roi: number;
}

export interface NotificationEngagement {
  notificationId: string;
  userId: string;
  action: 'delivered' | 'shown' | 'clicked' | 'dismissed' | 'closed';
  timestamp: number;
  actionData?: any;
  deviceInfo: DeviceInfo;
  context: EngagementContext;
}

export interface DeviceInfo {
  platform: string;
  version: string;
  manufacturer?: string;
  model?: string;
  screenWidth: number;
  screenHeight: number;
  timezone: string;
  language: string;
}

export interface EngagementContext {
  appState: 'foreground' | 'background' | 'closed';
  sessionDuration?: number;
  lastActivity: number;
  location?: string;
  connectionType: 'wifi' | 'cellular' | 'offline';
  batteryLevel?: number;
}

// Predefined notification templates
export const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'daily_challenge_reminder',
    type: 'daily_challenge',
    defaultTitle: 'Daily Challenge Ready!',
    defaultBody: 'Your daily PathWordle challenge is waiting. Can you beat your best time?',
    defaultIcon: '/icons/daily-challenge.png',
    defaultActions: [
      { action: 'play', title: 'Play Now' },
      { action: 'later', title: 'Later' }
    ],
    variables: [
      { name: 'streak', type: 'number', required: false },
      { name: 'bestTime', type: 'number', required: false }
    ],
    localizedContent: {
      en: {
        title: 'Daily Challenge Ready!',
        body: 'Your daily PathWordle challenge is waiting. Can you beat your best time?',
        actions: [
          { action: 'play', title: 'Play Now' },
          { action: 'later', title: 'Later' }
        ]
      },
      zh: {
        title: '每日挑战准备就绪！',
        body: '您的每日路径单词挑战正在等待。您能击败最佳时间吗？',
        actions: [
          { action: 'play', title: '立即游戏' },
          { action: 'later', title: '稍后' }
        ]
      }
    },
    priority: 'high',
    requireInteraction: true,
    ttl: 86400 // 24 hours
  },
  {
    id: 'achievement_unlocked',
    type: 'achievement_unlocked',
    defaultTitle: 'Achievement Unlocked!',
    defaultBody: 'Congratulations! You\'ve earned a new achievement in PathWordle.',
    defaultIcon: '/icons/achievement.png',
    defaultActions: [
      { action: 'view', title: 'View Achievement' },
      { action: 'share', title: 'Share' }
    ],
    variables: [
      { name: 'achievementName', type: 'string', required: true },
      { name: 'achievementDescription', type: 'string', required: false },
      { name: 'points', type: 'number', required: false }
    ],
    localizedContent: {
      en: {
        title: 'Achievement Unlocked!',
        body: 'Congratulations! You\'ve earned the "{{achievementName}}" achievement.',
        actions: [
          { action: 'view', title: 'View Achievement' },
          { action: 'share', title: 'Share' }
        ]
      }
    },
    priority: 'normal',
    requireInteraction: false,
    ttl: 604800 // 7 days
  },
  {
    id: 'friend_challenge',
    type: 'friend_challenge',
    defaultTitle: 'Challenge from {{friendName}}!',
    defaultBody: '{{friendName}} has challenged you to a PathWordle battle. Are you ready?',
    defaultIcon: '/icons/friend-battle.png',
    defaultActions: [
      { action: 'accept', title: 'Accept Challenge' },
      { action: 'decline', title: 'Maybe Later' }
    ],
    variables: [
      { name: 'friendName', type: 'string', required: true },
      { name: 'friendAvatar', type: 'string', required: false },
      { name: 'challengeType', type: 'string', required: false }
    ],
    localizedContent: {
      en: {
        title: 'Challenge from {{friendName}}!',
        body: '{{friendName}} has challenged you to a PathWordle battle. Accept and show them who\'s boss!',
        actions: [
          { action: 'accept', title: 'Accept Challenge' },
          { action: 'decline', title: 'Maybe Later' }
        ]
      }
    },
    priority: 'high',
    requireInteraction: true,
    ttl: 3600 // 1 hour
  },
  {
    id: 'streak_milestone',
    type: 'streak_milestone',
    defaultTitle: '{{streak}} Day Streak!',
    defaultBody: 'Amazing! You\'ve completed challenges for {{streak}} consecutive days. Keep it up!',
    defaultIcon: '/icons/streak-milestone.png',
    defaultActions: [
      { action: 'play', title: 'Continue Streak' },
      { action: 'share', title: 'Share Milestone' }
    ],
    variables: [
      { name: 'streak', type: 'number', required: true },
      { name: 'bestStreak', type: 'number', required: false }
    ],
    localizedContent: {
      en: {
        title: '{{streak}} Day Streak!',
        body: 'Incredible! You\'ve maintained a {{streak}}-day playing streak. You\'re on fire! 🔥',
        actions: [
          { action: 'play', title: 'Play Now' },
          { action: 'share', title: 'Share Achievement' }
        ]
      }
    },
    priority: 'high',
    requireInteraction: true,
    ttl: 86400 // 24 hours
  },
  {
    id: 'weekly_summary',
    type: 'weekly_summary',
    defaultTitle: 'Your PathWordle Weekly Summary',
    defaultBody: 'You solved {{gamesPlayed}} puzzles this week! Your accuracy: {{accuracy}}%. Ready for more?',
    defaultIcon: '/icons/weekly-summary.png',
    defaultActions: [
      { action: 'view_stats', title: 'View Stats' },
      { action: 'play', title: 'Play Now' }
    ],
    variables: [
      { name: 'gamesPlayed', type: 'number', required: true },
      { name: 'accuracy', type: 'number', required: true },
      { name: 'bestTime', type: 'number', required: false },
      { name: 'achievements', type: 'number', required: false }
    ],
    localizedContent: {
      en: {
        title: 'Your PathWordle Weekly Summary',
        body: 'This week you solved {{gamesPlayed}} puzzles with {{accuracy}}% accuracy. {{bestStreak ? `Your best streak was ${bestStreak} days!` : ""}}',
        actions: [
          { action: 'view_stats', title: 'View Detailed Stats' },
          { action: 'play', title: 'Play Next Challenge' }
        ]
      }
    },
    priority: 'low',
    requireInteraction: false,
    ttl: 604800 // 7 days
  },
  {
    id: 'puzzle_recommended',
    type: 'puzzle_recommended',
    defaultTitle: 'New Puzzle for You!',
    defaultBody: 'Based on your preferences, we found a {{difficulty}} puzzle you might enjoy.',
    defaultIcon: '/icons/puzzle-recommendation.png',
    defaultActions: [
      { action: 'play', title: 'Play Puzzle' },
      { action: 'dismiss', title: 'Not Interested' }
    ],
    variables: [
      { name: 'puzzleTitle', type: 'string', required: true },
      { name: 'difficulty', type: 'string', required: true },
      { name: 'creator', type: 'string', required: false },
      { name: 'rating', type: 'number', required: false }
    ],
    localizedContent: {
      en: {
        title: 'New Puzzle Recommendation',
        body: 'We found "{{puzzleTitle}}" - a {{difficulty}} puzzle created by {{creator}} that matches your play style!',
        actions: [
          { action: 'play', title: 'Try This Puzzle' },
          { action: 'dismiss', title: 'Not Now' }
        ]
      }
    },
    priority: 'normal',
    requireInteraction: false,
    ttl: 86400 // 24 hours
  }
] as const;

// Default notification preferences
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  enabled: true,
  categories: {
    dailyChallenge: true,
    achievements: true,
    friendActivity: true,
    leaderboards: false,
    puzzleRecommendations: true,
    socialFeatures: true,
    updates: false,
    reminders: true,
    promotions: false
  },
  quietHours: {
    enabled: false,
    startTime: '22:00',
    endTime: '08:00',
    timezone: 'UTC',
    allowUrgent: true
  },
  deviceSettings: {
    sound: true,
    vibration: true,
    badge: true,
    alert: true,
    banner: true,
    lockScreen: true
  },
  frequency: {
    maxPerDay: 10,
    maxPerHour: 3,
    minInterval: 300000, // 5 minutes
    smartScheduling: true
  }
} as const;

// Notification types that are considered urgent
export const URGENT_NOTIFICATION_TYPES: NotificationType[] = [
  'friend_challenge',
  'achievement_unlocked',
  'special_event'
] as const;

// Notification frequency limits
export const NOTIFICATION_LIMITS = {
  dailyChallenge: { maxPerDay: 1, maxPerHour: 1 },
  achievements: { maxPerDay: 10, maxPerHour: 5 },
  friendActivity: { maxPerDay: 20, maxPerHour: 10 },
  leaderboards: { maxPerDay: 3, maxPerHour: 1 },
  puzzleRecommendations: { maxPerDay: 5, maxPerHour: 2 },
  socialFeatures: { maxPerDay: 15, maxPerHour: 8 },
  updates: { maxPerDay: 2, maxPerHour: 1 },
  reminders: { maxPerDay: 5, maxPerHour: 2 },
  promotions: { maxPerDay: 3, maxPerHour: 1 }
} as const;