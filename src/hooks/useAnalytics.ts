import { useState, useCallback, useEffect } from 'react';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

interface UserProperties {
  userId: string;
  userType?: 'new' | 'returning' | 'premium';
  deviceType?: 'mobile' | 'desktop' | 'tablet';
  experienceLevel?: 'beginner' | 'intermediate' | 'expert';
  joinDate?: string;
  location?: string;
  language?: string;
  preferences?: Record<string, any>;
}

interface UseAnalyticsProps {
  userId?: string;
  autoInitialize?: boolean;
  debug?: boolean;
}

export const useAnalytics = ({
  userId = 'anonymous_user',
  autoInitialize = true,
  debug = process.env.NODE_ENV === 'development'
}: UseAnalyticsProps = {}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [userProperties, setUserProperties] = useState<UserProperties>({
    userId,
    userType: 'new',
    deviceType: getDeviceType(),
    experienceLevel: 'beginner',
    joinDate: new Date().toISOString(),
    language: navigator.language || 'en'
  });

  // Initialize analytics
  useEffect(() => {
    if (autoInitialize && !isInitialized) {
      initializeAnalytics();
    }
  }, [autoInitialize, isInitialized]);

  const initializeAnalytics = useCallback(() => {
    // Generate session ID
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);

    // Load saved user properties
    loadUserProperties();

    // Track session start
    trackEvent('session_start', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      referrer: document.referrer
    });

    setIsInitialized(true);

    if (debug) {
      console.log('Analytics initialized for user:', userId);
    }
  }, [userId, debug]);

  // Load user properties from localStorage
  const loadUserProperties = useCallback(() => {
    try {
      const saved = localStorage.getItem(`user_properties_${userId}`);
      if (saved) {
        const properties = JSON.parse(saved);
        setUserProperties(prev => ({ ...prev, ...properties }));
      }
    } catch (error) {
      console.warn('Failed to load user properties:', error);
    }
  }, [userId]);

  // Save user properties to localStorage
  const saveUserProperties = useCallback((properties: Partial<UserProperties>) => {
    try {
      const updated = { ...userProperties, ...properties };
      setUserProperties(updated);
      localStorage.setItem(`user_properties_${userId}`, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save user properties:', error);
    }
  }, [userProperties, userId]);

  // Track event
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: new Date(),
      userId,
      sessionId
    };

    // Store events locally (in production, send to analytics service)
    storeEvent(event);

    if (debug) {
      console.log('Analytics event tracked:', event);
    }
  }, [userId, sessionId, debug]);

  // Store event locally
  const storeEvent = useCallback((event: AnalyticsEvent) => {
    try {
      const events = getStoredEvents();
      events.push(event);

      // Keep only last 1000 events to prevent storage overflow
      if (events.length > 1000) {
        events.splice(0, events.length - 1000);
      }

      localStorage.setItem('analytics_events', JSON.stringify(events));
    } catch (error) {
      console.warn('Failed to store analytics event:', error);
    }
  }, []);

  // Get stored events
  const getStoredEvents = useCallback((): AnalyticsEvent[] => {
    try {
      const stored = localStorage.getItem('analytics_events');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load stored events:', error);
      return [];
    }
  }, []);

  // Get user properties
  const getUserProperties = useCallback(async (): Promise<UserProperties> => {
    // Simulate async operation for user properties
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(userProperties);
      }, 10);
    });
  }, [userProperties]);

  // Update user properties
  const updateUserProperties = useCallback((properties: Partial<UserProperties>) => {
    saveUserProperties(properties);

    // Track property change
    trackEvent('user_properties_updated', properties);
  }, [saveUserProperties, trackEvent]);

  // Track page view
  const trackPageView = useCallback((page: string, properties?: Record<string, any>) => {
    trackEvent('page_view', {
      page,
      url: window.location.href,
      title: document.title,
      ...properties
    });
  }, [trackEvent]);

  // Track user interaction
  const trackInteraction = useCallback((action: string, element: string, properties?: Record<string, any>) => {
    trackEvent('user_interaction', {
      action,
      element,
      page: window.location.pathname,
      ...properties
    });
  }, [trackEvent]);

  // Track performance metrics
  const trackPerformance = useCallback((name: string, value: number, properties?: Record<string, any>) => {
    trackEvent('performance_metric', {
      metric: name,
      value,
      unit: 'ms',
      ...properties
    });
  }, [trackEvent]);

  // Track error
  const trackError = useCallback((error: Error, properties?: Record<string, any>) => {
    trackEvent('error', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      page: window.location.pathname,
      ...properties
    });
  }, [trackEvent]);

  // Get event history
  const getEventHistory = useCallback((eventName?: string, limit = 100): AnalyticsEvent[] => {
    const events = getStoredEvents();
    const filtered = eventName ? events.filter(e => e.name === eventName) : events;
    return filtered.slice(-limit);
  }, [getStoredEvents]);

  // Get funnel analysis
  const getFunnelAnalysis = useCallback((steps: string[]): { [key: string]: number } => {
    const events = getStoredEvents();
    const analysis: { [key: string]: number } = {};

    steps.forEach(step => {
      const stepEvents = events.filter(e => e.name === step);
      const uniqueUsers = new Set(stepEvents.map(e => e.userId));
      analysis[step] = uniqueUsers.size;
    });

    return analysis;
  }, [getStoredEvents]);

  // Get retention data
  const getRetentionData = useCallback((days: number = 7): { [key: string]: number } => {
    const events = getStoredEvents();
    const retentionData: { [key: string]: number } = {};

    for (let i = 1; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayEvents = events.filter(e =>
        e.timestamp.toISOString().split('T')[0] === dateStr
      );
      const uniqueUsers = new Set(dayEvents.map(e => e.userId));
      retentionData[dateStr] = uniqueUsers.size;
    }

    return retentionData;
  }, [getStoredEvents]);

  // Clear all data
  const clearData = useCallback(() => {
    localStorage.removeItem('analytics_events');
    localStorage.removeItem(`user_properties_${userId}`);
    setUserProperties({
      userId,
      userType: 'new',
      deviceType: getDeviceType(),
      experienceLevel: 'beginner',
      joinDate: new Date().toISOString(),
      language: navigator.language || 'en'
    });
  }, [userId]);

  // Export data
  const exportData = useCallback(() => {
    const events = getStoredEvents();
    const data = {
      userProperties,
      events,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [userProperties, getStoredEvents]);

  return {
    // State
    isInitialized,
    sessionId,
    userProperties,

    // Core tracking
    trackEvent,
    getUserProperties,
    updateUserProperties,

    // Specialized tracking
    trackPageView,
    trackInteraction,
    trackPerformance,
    trackError,

    // Analytics data
    getEventHistory,
    getFunnelAnalysis,
    getRetentionData,

    // Utilities
    clearData,
    exportData
  };
};

// Utility functions
const generateSessionId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const getDeviceType = (): 'mobile' | 'desktop' | 'tablet' => {
  const width = window.innerWidth;
  if (width <= 768) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
};

export default useAnalytics;