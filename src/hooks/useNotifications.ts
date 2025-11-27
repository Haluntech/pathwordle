import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  PushNotification,
  NotificationPreferences,
  NotificationSchedule,
  NotificationType,
  NotificationStats,
  NotificationTemplate,
  NotificationEngagement,
  DEFAULT_NOTIFICATION_PREFERENCES,
  NOTIFICATION_TEMPLATES,
  URGENT_NOTIFICATION_TYPES
} from '../types/notifications';

interface UseNotificationsProps {
  userId?: string;
  autoInitialize?: boolean;
}

interface NotificationPermissionState {
  status: NotificationPermission;
  supported: boolean;
  canRequest: boolean;
}

interface NotificationQueue {
  pending: PushNotification[];
  sent: PushNotification[];
  failed: PushNotification[];
}

const STORAGE_KEYS = {
  PREFERENCES: 'pathwordle_notification_preferences',
  PERMISSION: 'pathwordle_notification_permission',
  QUEUE: 'pathwordle_notification_queue',
  STATS: 'pathwordle_notification_stats',
  ENGAGEMENT: 'pathwordle_notification_engagement'
} as const;

export const useNotifications = ({
  userId = 'default_user',
  autoInitialize = true
}: UseNotificationsProps = {}) => {
  // Core state
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFERENCES);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [queue, setQueue] = useState<NotificationQueue>({ pending: [], sent: [], failed: [] });
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for cleanup and persistence
  const serviceWorkerRef = useRef<ServiceWorkerRegistration | null>(null);
  const notificationTimeoutsRef = useRef<Map<string, number>>(new Map());

  // Initialize notification system
  useEffect(() => {
    if (autoInitialize) {
      initializeNotifications();
    }

    return () => {
      // Cleanup scheduled notifications
      notificationTimeoutsRef.current.forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
      notificationTimeoutsRef.current.clear();
    };
  }, []);

  // Initialize notification system
  const initializeNotifications = useCallback(async () => {
    try {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        setIsSupported(false);
        return;
      }

      // Additional compatibility checks
      if (!('serviceWorker' in navigator)) {
        console.warn('Service Worker not supported - push notifications unavailable');
      }

      setIsSupported(true);
      setPermission(Notification.permission);

      // Load saved preferences
      loadPreferences();

      // Load statistics
      loadStats();

      // Register service worker for push notifications (non-blocking)
      registerServiceWorker().catch(err => {
        console.warn('Service worker registration failed, continuing with basic notifications:', err);
      });

      // Load existing subscription
      await loadSubscription();

      // Load notification queue
      loadQueue();

    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      setIsSupported(false);
    }
  }, []);

  // Register service worker for push notifications
  const registerServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        // Only register service worker in production or HTTPS
        if (process.env.NODE_ENV === 'production' || location.protocol === 'https:' || location.hostname === 'localhost') {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          });
          serviceWorkerRef.current = registration;
          console.log('Service Worker registered for notifications');
        } else {
          console.warn('Service Worker registration skipped: requires HTTPS in production');
        }
      } catch (error) {
        console.warn('Service Worker registration failed:', error);
        // Continue without service worker - notifications will still work with basic browser API
      }
    }
  }, []);

  // Load preferences from localStorage
  const loadPreferences = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (stored) {
        const savedPreferences = JSON.parse(stored);
        setPreferences({ ...DEFAULT_NOTIFICATION_PREFERENCES, ...savedPreferences });
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
    }
  }, []);

  // Load statistics from localStorage
  const loadStats = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STATS);
      if (stored) {
        setStats(JSON.parse(stored));
      } else {
        // Initialize with default stats
        const defaultStats: NotificationStats = {
          sent: 0,
          delivered: 0,
          clicked: 0,
          dismissed: 0,
          conversionRate: 0,
          categoryStats: {},
          timeStats: {
            bestSendingTimes: [],
            averageEngagementTime: 0,
            peakActivityHours: []
          },
          userPreferences: preferences
        };
        setStats(defaultStats);
      }
    } catch (error) {
      console.error('Failed to load notification stats:', error);
    }
  }, [preferences]);

  // Load existing subscription
  const loadSubscription = useCallback(async () => {
    try {
      if (!serviceWorkerRef.current) return;

      const existingSubscription = await serviceWorkerRef.current.pushManager.getSubscription();

      if (existingSubscription) {
        setSubscription(existingSubscription);
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Failed to load push subscription:', error);
    }
  }, []);

  // Load notification queue
  const loadQueue = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QUEUE);
      if (stored) {
        const savedQueue = JSON.parse(stored);
        setQueue(savedQueue);
      }
    } catch (error) {
      console.error('Failed to load notification queue:', error);
    }
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      return 'denied';
    }

    setIsLoading(true);

    try {
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      // Save permission status
      localStorage.setItem(STORAGE_KEYS.PERMISSION, permissionResult);

      // If granted, subscribe to push notifications
      if (permissionResult === 'granted') {
        await subscribeToPush();
      }

      setIsLoading(false);
      return permissionResult;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      setIsLoading(false);
      return 'denied';
    }
  }, [isSupported]);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async () => {
    if (!serviceWorkerRef.current || !isSupported) {
      console.warn('Cannot subscribe: Service worker not available or notifications not supported');
      return null;
    }

    try {
      // For demo purposes, we'll skip actual push subscription
      // In a real implementation, you would get VAPID public key from server
      console.log('Push notification subscription skipped for demo');

      // Mock successful subscription
      setSubscription({} as PushSubscription);
      setIsSubscribed(true);

      return {} as PushSubscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }, [isSupported]);

  // Convert VAPID key (utility function)
  const urlB64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Send subscription to server
  const sendSubscriptionToServer = useCallback(async (subscription: PushSubscription) => {
    try {
      // In a real implementation, this would be an API call
      console.log('Sending subscription to server:', subscription);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Subscription saved successfully');
    } catch (error) {
      console.error('Failed to save subscription to server:', error);
    }
  }, []);

  // Unsubscribe from push notifications
  const unsubscribeFromPush = useCallback(async () => {
    if (!subscription) return true;

    try {
      const success = await subscription.unsubscribe();

      if (success) {
        setSubscription(null);
        setIsSubscribed(false);

        // Remove from server
        await removeSubscriptionFromServer(subscription);
      }

      return success;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }, [subscription]);

  // Remove subscription from server
  const removeSubscriptionFromServer = useCallback(async (subscription: PushSubscription) => {
    try {
      // In a real implementation, this would be an API call
      console.log('Removing subscription from server:', subscription);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Subscription removed successfully');
    } catch (error) {
      console.error('Failed to remove subscription from server:', error);
    }
  }, []);

  // Send notification
  const sendNotification = useCallback(async (
    templateId: string,
    variables: Record<string, any> = {},
    options: Partial<PushNotification> = {}
  ): Promise<boolean> => {
    try {
      // Get template
      const template = NOTIFICATION_TEMPLATES.find(t => t.id === templateId);
      if (!template) {
        console.error(`Notification template not found: ${templateId}`);
        return false;
      }

      // Check if notifications are enabled and category is allowed
      if (!preferences.enabled || !isCategoryEnabled(template.type)) {
        console.log('Notifications disabled or category not allowed');
        return false;
      }

      // Check quiet hours
      if (isQuietHours() && !URGENT_NOTIFICATION_TYPES.includes(template.type)) {
        console.log('Quiet hours - notification deferred');
        return false;
      }

      // Check frequency limits
      if (!checkFrequencyLimits(template.type)) {
        console.log('Frequency limit reached');
        return false;
      }

      // Build notification
      const notification = buildNotificationFromTemplate(template, variables, options);

      // Check permission
      if (permission !== 'granted') {
        console.log('Notification permission not granted');
        return false;
      }

      // Send notification
      await showNotification(notification);

      // Update stats
      updateStats(notification, 'sent');

      // Track engagement
      trackEngagement(notification, 'delivered');

      return true;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }, [preferences, permission]);

  // Check if category is enabled
  const isCategoryEnabled = useCallback((type: NotificationType): boolean => {
    const categoryMap: Record<NotificationType, keyof NotificationPreferences['categories']> = {
      dailyChallenge: 'dailyChallenge',
      achievement_unlocked: 'achievements',
      friend_challenge: 'friendActivity',
      friend_completed: 'friendActivity',
      leaderboard_update: 'leaderboards',
      puzzle_recommended: 'puzzleRecommendations',
      social_update: 'socialFeatures',
      feature_update: 'updates',
      special_event: 'updates',
      reminder: 'reminders',
      invitation: 'socialFeatures',
      streak_milestone: 'achievements',
      weekly_summary: 'updates',
      learning_progress: 'achievements',
      speed_challenge: 'dailyChallenge',
      puzzle_approved: 'socialFeatures',
      puzzle_featured: 'socialFeatures'
    };

    const category = categoryMap[type];
    return category ? preferences.categories[category] : false;
  }, [preferences.categories]);

  // Check if currently in quiet hours
  const isQuietHours = useCallback((): boolean => {
    if (!preferences.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMin] = preferences.quietHours.startTime.split(':').map(Number);
    const [endHour, endMin] = preferences.quietHours.endTime.split(':').map(Number);

    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime < endTime;
    } else {
      // Overnight quiet hours (e.g., 22:00 to 08:00)
      return currentTime >= startTime || currentTime < endTime;
    }
  }, [preferences.quietHours]);

  // Check frequency limits
  const checkFrequencyLimits = useCallback((type: NotificationType): boolean => {
    if (!stats) return true;

    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    const recentStats = {
      hour: 0,
      day: 0
    };

    // Count recent notifications (mock implementation)
    // In a real implementation, this would query actual engagement data
    recentStats.hour = stats.sent;
    recentStats.day = stats.sent;

    return (
      recentStats.hour < preferences.frequency.maxPerHour &&
      recentStats.day < preferences.frequency.maxPerDay
    );
  }, [stats, preferences.frequency]);

  // Build notification from template
  const buildNotificationFromTemplate = useCallback((
    template: NotificationTemplate,
    variables: Record<string, any>,
    options: Partial<PushNotification>
  ): PushNotification => {
    // Interpolate variables in title and body
    const interpolate = (text: string): string => {
      return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return variables[key]?.toString() || match;
      });
    };

    const notification: PushNotification = {
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: template.type,
      title: interpolate(template.defaultTitle),
      body: interpolate(template.defaultBody),
      icon: template.defaultIcon,
      data: {
        templateId: template.id,
        userId,
        ...variables
      },
      actions: template.defaultActions,
      timestamp: Date.now(),
      priority: template.priority,
      requireInteraction: template.requireInteraction,
      silent: template.priority === 'low',
      tag: `${template.type}_${userId}`,
      renotify: template.type === 'daily_challenge',
      ttl: template.ttl,
      ...options
    };

    return notification;
  }, [userId]);

  // Show notification
  const showNotification = useCallback(async (notification: PushNotification) => {
    try {
      const notificationOptions: NotificationOptions = {
        body: notification.body,
        icon: notification.icon,
        badge: notification.badge,
        image: notification.image,
        data: notification.data,
        actions: notification.actions,
        tag: notification.tag,
        renotify: notification.renotify,
        requireInteraction: notification.requireInteraction,
        silent: notification.silent,
        timestamp: notification.timestamp
      };

      const notificationInstance = new Notification(notification.title, notificationOptions);

      // Add click handler
      notificationInstance.onclick = (event) => {
        event.preventDefault();
        handleNotificationClick(notification);
      };

      // Add close handler
      notificationInstance.onclose = () => {
        trackEngagement(notification, 'closed');
      };

      // Add show handler
      notificationInstance.onshow = () => {
        trackEngagement(notification, 'shown');
      };

      updateQueue(notification, 'sent');
    } catch (error) {
      console.error('Failed to show notification:', error);
      updateQueue(notification, 'failed');
    }
  }, []);

  // Handle notification click
  const handleNotificationClick = useCallback((notification: PushNotification) => {
    trackEngagement(notification, 'clicked');
    updateStats(notification, 'clicked');

    // Navigate based on notification type and action
    if (notification.data?.url) {
      window.open(notification.data.url, '_blank');
    } else {
      // Default navigation based on notification type
      navigateToRelevantPage(notification);
    }
  }, []);

  // Navigate to relevant page based on notification type
  const navigateToRelevantPage = useCallback((notification: PushNotification) => {
    const routes: Record<NotificationType, string> = {
      dailyChallenge: '/time-challenge',
      achievement_unlocked: '/statistics',
      friend_challenge: '/multiplayer',
      friend_completed: '/multiplayer',
      leaderboard_update: '/leaderboard',
      puzzle_recommended: '/game',
      social_update: '/friends',
      feature_update: '/',
      special_event: '/game',
      reminder: '/game',
      invitation: '/multiplayer',
      streak_milestone: '/statistics',
      weekly_summary: '/statistics',
      learning_progress: '/learning-dashboard',
      speed_challenge: '/time-challenge',
      puzzle_approved: '/puzzle-creator',
      puzzle_featured: '/themed-puzzles'
    };

    const route = routes[notification.type];
    if (route && window.location.pathname !== route) {
      window.location.href = route;
    }
  }, []);

  // Track engagement
  const trackEngagement = useCallback((notification: PushNotification, action: string) => {
    const engagement: NotificationEngagement = {
      notificationId: notification.id,
      userId,
      action: action as any,
      timestamp: Date.now(),
      deviceInfo: {
        platform: navigator.platform,
        version: navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language
      },
      context: {
        appState: document.visibilityState === 'visible' ? 'foreground' : 'background',
        lastActivity: Date.now(),
        connectionType: (navigator as any).connection?.effectiveType || 'unknown'
      }
    };

    // Save engagement (in a real implementation, this would be sent to server)
    saveEngagement(engagement);
  }, [userId]);

  // Save engagement
  const saveEngagement = useCallback((engagement: NotificationEngagement) => {
    try {
      const existing = localStorage.getItem(STORAGE_KEYS.ENGAGEMENT);
      const engagements: NotificationEngagement[] = existing ? JSON.parse(existing) : [];
      engagements.push(engagement);

      // Keep only last 1000 engagements
      if (engagements.length > 1000) {
        engagements.splice(0, engagements.length - 1000);
      }

      localStorage.setItem(STORAGE_KEYS.ENGAGEMENT, JSON.stringify(engagements));
    } catch (error) {
      console.error('Failed to save engagement:', error);
    }
  }, []);

  // Update stats
  const updateStats = useCallback((notification: PushNotification, action: 'sent' | 'clicked' | 'dismissed') => {
    setStats(prev => {
      if (!prev) return prev;

      const updated = { ...prev };

      if (action === 'sent') {
        updated.sent++;
        updated.categoryStats[notification.type] = {
          ...updated.categoryStats[notification.type],
          sent: (updated.categoryStats[notification.type]?.sent || 0) + 1,
          lastSent: Date.now()
        };
      } else if (action === 'clicked') {
        updated.clicked++;
        if (updated.categoryStats[notification.type]) {
          updated.categoryStats[notification.type].clicked++;
          updated.categoryStats[notification.type].ctr =
            updated.categoryStats[notification.type].clicked /
            updated.categoryStats[notification.type].sent;
        }
      } else if (action === 'dismissed') {
        updated.dismissed++;
      }

      updated.conversionRate = updated.sent > 0 ? updated.clicked / updated.sent : 0;

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));

      return updated;
    });
  }, []);

  // Update queue
  const updateQueue = useCallback((notification: PushNotification, status: 'sent' | 'failed' | 'pending') => {
    setQueue(prev => {
      const updated = { ...prev };

      // Remove from pending if exists
      updated.pending = updated.pending.filter(n => n.id !== notification.id);

      // Add to appropriate array
      if (status === 'sent') {
        updated.sent.push(notification);
      } else if (status === 'failed') {
        updated.failed.push(notification);
      } else {
        updated.pending.push(notification);
      }

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(updated));

      return updated;
    });
  }, []);

  // Update preferences
  const updatePreferences = useCallback((newPreferences: Partial<NotificationPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  }, [preferences]);

  // Schedule notification
  const scheduleNotification = useCallback(async (
    templateId: string,
    triggerTime: number,
    variables: Record<string, any> = {},
    options: Partial<PushNotification> = {}
  ): Promise<string> => {
    const scheduleId = `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const now = Date.now();
    const delay = Math.max(0, triggerTime - now);

    if (delay === 0) {
      // Send immediately
      await sendNotification(templateId, variables, options);
    } else {
      // Schedule for later
      const timeoutId = window.setTimeout(async () => {
        await sendNotification(templateId, variables, options);
        notificationTimeoutsRef.current.delete(scheduleId);
      }, delay);

      notificationTimeoutsRef.current.set(scheduleId, timeoutId);
    }

    return scheduleId;
  }, [sendNotification]);

  // Cancel scheduled notification
  const cancelScheduledNotification = useCallback((scheduleId: string) => {
    const timeoutId = notificationTimeoutsRef.current.get(scheduleId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      notificationTimeoutsRef.current.delete(scheduleId);
      return true;
    }
    return false;
  }, []);

  // Send daily challenge reminder
  const sendDailyChallengeReminder = useCallback(async (streak?: number) => {
    return await sendNotification('daily_challenge_reminder', {
      streak: streak || 0
    }, {
      priority: 'high',
      requireInteraction: true
    });
  }, [sendNotification]);

  // Send achievement notification
  const sendAchievementNotification = useCallback(async (
    achievementName: string,
    achievementDescription?: string,
    points?: number
  ) => {
    return await sendNotification('achievement_unlocked', {
      achievementName,
      achievementDescription,
      points: points || 0
    }, {
      priority: 'normal'
    });
  }, [sendNotification]);

  // Send friend challenge notification
  const sendFriendChallengeNotification = useCallback(async (
    friendName: string,
    friendAvatar?: string,
    challengeType?: string
  ) => {
    return await sendNotification('friend_challenge', {
      friendName,
      friendAvatar,
      challengeType
    }, {
      priority: 'high',
      requireInteraction: true
    });
  }, [sendNotification]);

  // Send streak milestone notification
  const sendStreakMilestoneNotification = useCallback(async (streak: number, bestStreak?: number) => {
    return await sendNotification('streak_milestone', {
      streak,
      bestStreak
    }, {
      priority: 'high',
      requireInteraction: true
    });
  }, [sendNotification]);

  // Send weekly summary notification
  const sendWeeklySummaryNotification = useCallback(async (
    gamesPlayed: number,
    accuracy: number,
    bestTime?: number,
    achievements?: number
  ) => {
    return await sendNotification('weekly_summary', {
      gamesPlayed,
      accuracy,
      bestTime,
      achievements
    }, {
      priority: 'low'
    });
  }, [sendNotification]);

  // Return the hook's API
  return {
    // State
    isSupported,
    permission,
    preferences,
    isSubscribed,
    subscription,
    queue,
    stats,
    isLoading,

    // Core functionality
    initializeNotifications,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    sendNotification,
    scheduleNotification,
    cancelScheduledNotification,

    // Preferences
    updatePreferences,

    // Convenience methods
    sendDailyChallengeReminder,
    sendAchievementNotification,
    sendFriendChallengeNotification,
    sendStreakMilestoneNotification,
    sendWeeklySummaryNotification,

    // Utilities
    isQuietHours,
    isCategoryEnabled,
    checkFrequencyLimits
  };
};