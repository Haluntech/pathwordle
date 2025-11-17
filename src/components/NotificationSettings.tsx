import React, { useState, useEffect, useCallback } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { useNotificationDemo } from '../hooks/useNotificationDemo';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Bell,
  BellOff,
  Settings,
  Smartphone,
  Volume2,
  Vibrate,
  Shield,
  Clock,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  AlertTriangle,
  Info,
  Moon,
  Sun,
  Calendar,
  Target,
  Trophy,
  Users,
  Star,
  MessageSquare,
  Zap,
  TrendingUp,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface NotificationSettingsProps {
  isVisible: boolean;
  onClose: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  isVisible,
  onClose
}) => {
  const { t } = useLanguage();
  const {
    isSupported,
    permission,
    preferences,
    isSubscribed,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    updatePreferences,
    stats
  } = useNotifications();

  const {
    isDemoRunning,
    demoProgress,
    currentDemoStep,
    totalDemoSteps,
    startDemo,
    sendSingleNotification,
    resetDemo,
    availableNotifications,
    canRunDemo
  } = useNotificationDemo();

  // Local state
  const [activeSection, setActiveSection] = useState<string>('general');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Settings sections
  const sections = [
    {
      id: 'general',
      icon: Bell,
      label: t('notifications.sections.general', 'General'),
      description: t('notifications.sections.generalDesc', 'Basic notification settings')
    },
    {
      id: 'categories',
      icon: Target,
      label: t('notifications.sections.categories', 'Categories'),
      description: t('notifications.sections.categoriesDesc', 'Choose which notifications to receive')
    },
    {
      id: 'quiet',
      icon: Moon,
      label: t('notifications.sections.quietHours', 'Quiet Hours'),
      description: t('notifications.sections.quietHoursDesc', 'Set times when notifications are muted')
    },
    {
      id: 'device',
      icon: Smartphone,
      label: t('notifications.sections.device', 'Device Settings'),
      description: t('notifications.sections.deviceDesc', 'Configure how notifications appear on your device')
    },
    {
      id: 'frequency',
      icon: Clock,
      label: t('notifications.sections.frequency', 'Frequency'),
      description: t('notifications.sections.frequencyDesc', 'Control how often you receive notifications')
    },
    {
      id: 'demo',
      icon: Play,
      label: t('notifications.sections.demo', 'Demo'),
      description: t('notifications.sections.demoDesc', 'Test notification features with interactive demo')
    },
    {
      id: 'stats',
      icon: BarChart3,
      label: t('notifications.sections.statistics', 'Statistics'),
      description: t('notifications.sections.statisticsDesc', 'View your notification activity')
    }
  ];

  // Notification categories
  const notificationCategories = [
    {
      key: 'dailyChallenge',
      icon: Calendar,
      label: t('notifications.categories.dailyChallenge', 'Daily Challenges'),
      description: t('notifications.categories.dailyChallengeDesc', 'Reminders for daily puzzles and challenges'),
      color: 'blue'
    },
    {
      key: 'achievements',
      icon: Trophy,
      label: t('notifications.categories.achievements', 'Achievements'),
      description: t('notifications.categories.achievementsDesc', 'When you unlock new achievements'),
      color: 'yellow'
    },
    {
      key: 'friendActivity',
      icon: Users,
      label: t('notifications.categories.friendActivity', 'Friend Activity'),
      description: t('notifications.categories.friendActivityDesc', 'Friend challenges, invites, and updates'),
      color: 'green'
    },
    {
      key: 'leaderboards',
      icon: Star,
      label: t('notifications.categories.leaderboards', 'Leaderboards'),
      description: t('notifications.categories.leaderboardsDesc', 'Leaderboard updates and rank changes'),
      color: 'purple'
    },
    {
      key: 'puzzleRecommendations',
      icon: Target,
      label: t('notifications.categories.puzzleRecommendations', 'Puzzle Recommendations'),
      description: t('notifications.categories.puzzleRecommendationsDesc', 'Personalized puzzle suggestions'),
      color: 'orange'
    },
    {
      key: 'socialFeatures',
      icon: MessageSquare,
      label: t('notifications.categories.socialFeatures', 'Social Features'),
      description: t('notifications.categories.socialFeaturesDesc', 'Comments, likes, and social interactions'),
      color: 'pink'
    },
    {
      key: 'updates',
      icon: Zap,
      label: t('notifications.categories.updates', 'Updates'),
      description: t('notifications.categories.updatesDesc', 'App updates and feature announcements'),
      color: 'indigo'
    },
    {
      key: 'reminders',
      icon: Clock,
      label: t('notifications.categories.reminders', 'Reminders'),
      description: t('notifications.categories.remindersDesc', 'Game reminders and notifications'),
      color: 'gray'
    },
    {
      key: 'promotions',
      icon: TrendingUp,
      label: t('notifications.categories.promotions', 'Promotions'),
      description: t('notifications.categories.promotionsDesc', 'Special offers and promotions'),
      color: 'red'
    }
  ];

  // Handle permission request
  const handleRequestPermission = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await requestPermission();
      if (result === 'granted') {
        // Subscribe to push notifications after permission is granted
        await subscribeToPush();
      }
    } catch (error) {
      console.error('Failed to request permission:', error);
    } finally {
      setIsLoading(false);
    }
  }, [requestPermission, subscribeToPush]);

  // Handle toggle subscription
  const handleToggleSubscription = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isSubscribed) {
        await unsubscribeFromPush();
      } else {
        await subscribeToPush();
      }
    } catch (error) {
      console.error('Failed to toggle subscription:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isSubscribed, subscribeToPush, unsubscribeFromPush]);

  // Handle category toggle
  const handleCategoryToggle = useCallback((category: string) => {
    updatePreferences({
      categories: {
        ...preferences.categories,
        [category]: !preferences.categories[category as keyof typeof preferences.categories]
      }
    });
  }, [preferences.categories, updatePreferences]);

  // Handle quiet hours toggle
  const handleQuietHoursToggle = useCallback(() => {
    updatePreferences({
      quietHours: {
        ...preferences.quietHours,
        enabled: !preferences.quietHours.enabled
      }
    });
  }, [preferences.quietHours, updatePreferences]);

  // Handle time change
  const handleTimeChange = useCallback((field: 'startTime' | 'endTime', value: string) => {
    updatePreferences({
      quietHours: {
        ...preferences.quietHours,
        [field]: value
      }
    });
  }, [preferences.quietHours, updatePreferences]);

  // Handle device setting toggle
  const handleDeviceSettingToggle = useCallback((setting: string) => {
    updatePreferences({
      deviceSettings: {
        ...preferences.deviceSettings,
        [setting]: !preferences.deviceSettings[setting as keyof typeof preferences.deviceSettings]
      }
    });
  }, [preferences.deviceSettings, updatePreferences]);

  // Handle frequency change
  const handleFrequencyChange = useCallback((field: string, value: number) => {
    updatePreferences({
      frequency: {
        ...preferences.frequency,
        [field]: value
      }
    });
  }, [preferences.frequency, updatePreferences]);

  // Get permission status color
  const getPermissionColor = () => {
    switch (permission) {
      case 'granted':
        return 'text-green-600 bg-green-100';
      case 'denied':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  // Get permission status text
  const getPermissionText = () => {
    switch (permission) {
      case 'granted':
        return t('notifications.permission.granted', 'Enabled');
      case 'denied':
        return t('notifications.permission.denied', 'Blocked');
      default:
        return t('notifications.permission.prompt', 'Not Set');
    }
  };

  // Render permission card
  const renderPermissionCard = () => {
    if (!isSupported) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-800">
                {t('notifications.notSupported', 'Notifications Not Supported')}
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {t('notifications.notSupportedDesc', 'Your browser does not support push notifications')}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getPermissionColor()}`}>
              {permission === 'granted' ? (
                <Bell className="w-5 h-5" />
              ) : (
                <BellOff className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {t('notifications.permissions', 'Notification Permissions')}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {getPermissionText()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {permission === 'default' && (
              <button
                onClick={handleRequestPermission}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? t('common.loading', 'Loading...') : t('notifications.enable', 'Enable')}
              </button>
            )}

            {permission === 'granted' && (
              <button
                onClick={handleToggleSubscription}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isSubscribed
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } disabled:bg-gray-400 disabled:cursor-not-allowed`}
              >
                {isLoading ? t('common.loading', 'Loading...') :
                 isSubscribed ? t('notifications.subscribed', 'Subscribed') : t('notifications.subscribe', 'Subscribe')}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render general settings
  const renderGeneralSettings = () => (
    <div className="space-y-6">
      {renderPermissionCard()}

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-4">
          {t('notifications.generalSettings', 'General Settings')}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">
                {t('notifications.enableAll', 'Enable All Notifications')}
              </label>
              <p className="text-sm text-gray-600 mt-1">
                {t('notifications.enableAllDesc', 'Turn all notifications on or off')}
              </p>
            </div>
            <button
              onClick={() => updatePreferences({ enabled: !preferences.enabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.enabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render categories settings
  const renderCategoriesSettings = () => (
    <div className="space-y-4">
      {notificationCategories.map((category) => {
        const Icon = category.icon;
        const isEnabled = preferences.categories[category.key as keyof typeof preferences.categories];

        return (
          <div key={category.key} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                  <Icon className={`w-5 h-5 text-${category.color}-600`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{category.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                </div>
              </div>

              <button
                onClick={() => handleCategoryToggle(category.key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isEnabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  // Render quiet hours settings
  const renderQuietHoursSettings = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-gray-900">
              {t('notifications.quietHours.title', 'Quiet Hours')}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('notifications.quietHours.description', 'Temporarily silence notifications during specific times')}
            </p>
          </div>

          <button
            onClick={handleQuietHoursToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.quietHours.enabled ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {preferences.quietHours.enabled && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('notifications.quietHours.startTime', 'Start Time')}
                </label>
                <input
                  type="time"
                  value={preferences.quietHours.startTime}
                  onChange={(e) => handleTimeChange('startTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('notifications.quietHours.endTime', 'End Time')}
                </label>
                <input
                  type="time"
                  value={preferences.quietHours.endTime}
                  onChange={(e) => handleTimeChange('endTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {t('notifications.quietHours.allowUrgent', 'Allow urgent notifications')}
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  {t('notifications.quietHours.allowUrgentDesc', 'Still show important notifications')}
                </p>
              </div>
              <button
                onClick={() => updatePreferences({
                  quietHours: {
                    ...preferences.quietHours,
                    allowUrgent: !preferences.quietHours.allowUrgent
                  }
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.quietHours.allowUrgent ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.quietHours.allowUrgent ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render device settings
  const renderDeviceSettings = () => {
    const deviceSettings = [
      {
        key: 'sound',
        icon: Volume2,
        label: t('notifications.device.sound', 'Sound'),
        description: t('notifications.device.soundDesc', 'Play sound for notifications')
      },
      {
        key: 'vibration',
        icon: Vibrate,
        label: t('notifications.device.vibration', 'Vibration'),
        description: t('notifications.device.vibrationDesc', 'Vibrate for notifications')
      },
      {
        key: 'badge',
        icon: Shield,
        label: t('notifications.device.badge', 'Badge'),
        description: t('notifications.device.badgeDesc', 'Show badge on app icon')
      },
      {
        key: 'alert',
        icon: Bell,
        label: t('notifications.device.alert', 'Alert'),
        description: t('notifications.device.alertDesc', 'Show alert dialogs')
      },
      {
        key: 'banner',
        icon: MessageSquare,
        label: t('notifications.device.banner', 'Banner'),
        description: t('notifications.device.bannerDesc', 'Show banner notifications')
      },
      {
        key: 'lockScreen',
        icon: Shield,
        label: t('notifications.device.lockScreen', 'Lock Screen'),
        description: t('notifications.device.lockScreenDesc', 'Show on lock screen')
      }
    ];

    return (
      <div className="space-y-4">
        {deviceSettings.map((setting) => {
          const Icon = setting.icon;
          const isEnabled = preferences.deviceSettings[setting.key as keyof typeof preferences.deviceSettings];

          return (
            <div key={setting.key} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{setting.label}</h3>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeviceSettingToggle(setting.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render frequency settings
  const renderFrequencySettings = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-4">
          {t('notifications.frequency.limits', 'Frequency Limits')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('notifications.frequency.maxPerDay', 'Maximum per day')}
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={preferences.frequency.maxPerDay}
              onChange={(e) => handleFrequencyChange('maxPerDay', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('notifications.frequency.maxPerHour', 'Maximum per hour')}
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={preferences.frequency.maxPerHour}
              onChange={(e) => handleFrequencyChange('maxPerHour', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                {t('notifications.frequency.smartScheduling', 'Smart Scheduling')}
              </label>
              <p className="text-xs text-gray-600 mt-1">
                {t('notifications.frequency.smartSchedulingDesc', 'Optimize notification timing based on your activity')}
              </p>
            </div>
            <button
              onClick={() => updatePreferences({
                frequency: {
                  ...preferences.frequency,
                  smartScheduling: !preferences.frequency.smartScheduling
                }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.frequency.smartScheduling ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.frequency.smartScheduling ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render statistics
  const renderStatistics = () => {
    if (!stats) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {t('notifications.noStats', 'No notification statistics available yet')}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-4">
            {t('notifications.stats.overview', 'Overview')}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
              <div className="text-sm text-gray-600">{t('notifications.stats.sent', 'Sent')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.clicked}</div>
              <div className="text-sm text-gray-600">{t('notifications.stats.clicked', 'Clicked')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.dismissed}</div>
              <div className="text-sm text-gray-600">{t('notifications.stats.dismissed', 'Dismissed')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(stats.conversionRate * 100)}%
              </div>
              <div className="text-sm text-gray-600">{t('notifications.stats.conversion', 'Conversion')}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render demo settings
  const renderDemoSettings = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-4">
          {t('notifications.demo.title', 'Notification Demo')}
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          {t('notifications.demo.description', 'Test all notification types with an interactive demo')}
        </p>

        {/* Permission Status */}
        {!canRunDemo && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  {t('notifications.demo.permissionRequired', 'Permission Required')}
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  {t('notifications.demo.permissionDesc', 'Enable notifications to run the demo')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Demo Progress */}
        {isDemoRunning && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">
                {t('notifications.demo.running', 'Demo Running')}
              </span>
              <span className="text-sm text-blue-700">
                {currentDemoStep}/{totalDemoSteps}
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${demoProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Demo Controls */}
        <div className="space-y-4">
          <div className="flex space-x-4">
            <button
              onClick={startDemo}
              disabled={!canRunDemo || isDemoRunning}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isDemoRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>{t('notifications.demo.running', 'Running...')}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>{t('notifications.demo.start', 'Start Demo')}</span>
                </>
              )}
            </button>

            {isDemoRunning && (
              <button
                onClick={resetDemo}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('notifications.demo.reset', 'Reset')}</span>
              </button>
            )}
          </div>

          <div className="text-sm text-gray-600">
            <p>{t('notifications.demo.info', 'The demo will send 7 different notification types with 3-second intervals.')}</p>
          </div>
        </div>
      </div>

      {/* Individual Notification Tests */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4">
          {t('notifications.demo.individualTests', 'Individual Tests')}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableNotifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => sendSingleNotification(notification.id)}
              disabled={!canRunDemo}
              className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <div className="font-medium text-gray-900">{notification.title}</div>
              <div className="text-sm text-gray-600">{notification.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Demo Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">
          {t('notifications.demo.instructions', 'How it works')}
        </h4>
        <ol className="space-y-2 text-sm text-gray-700">
          <li>1. {t('notifications.demo.step1', 'Click "Start Demo" to begin the notification sequence')}</li>
          <li>2. {t('notifications.demo.step2', 'Each notification will appear with a 3-second delay')}</li>
          <li>3. {t('notifications.demo.step3', 'You can click on notifications to interact with them')}</li>
          <li>4. {t('notifications.demo.step4', 'Test individual notifications using the buttons below')}</li>
          <li>5. {t('notifications.demo.step5', 'Check the Statistics section to see engagement metrics')}</li>
        </ol>
      </div>
    </div>
  );

  // Render section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'categories':
        return renderCategoriesSettings();
      case 'quiet':
        return renderQuietHoursSettings();
      case 'device':
        return renderDeviceSettings();
      case 'frequency':
        return renderFrequencySettings();
      case 'demo':
        return renderDemoSettings();
      case 'stats':
        return renderStatistics();
      default:
        return renderGeneralSettings();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('notifications.title', 'Notification Settings')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-[calc(90vh-80px)]">
          {/* Sidebar */}
          <div className="w-full md:w-64 border-b border-gray-200 md:border-b-0 md:border-r border-gray-200">
            <nav className="p-4 space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {sections.find(s => s.id === activeSection)?.label}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {sections.find(s => s.id === activeSection)?.description}
              </p>
            </div>

            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;