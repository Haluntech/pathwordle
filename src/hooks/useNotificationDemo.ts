import { useCallback, useState } from 'react';
import { useNotifications } from './useNotifications';

export const useNotificationDemo = () => {
  const {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
    sendAchievementNotification,
    sendDailyChallengeReminder,
    sendFriendChallengeNotification,
    sendStreakMilestoneNotification,
    sendWeeklySummaryNotification
  } = useNotifications();

  const [demoState, setDemoState] = useState({
    isRunning: false,
    currentIndex: 0,
    totalSteps: 7
  });

  // Demo notification sequence
  const demoNotifications = [
    {
      id: 'daily_challenge',
      action: async () => {
        await sendDailyChallengeReminder(3);
        return 'Daily challenge reminder sent!';
      },
      title: 'Daily Challenge',
      description: 'Reminds player about daily puzzle'
    },
    {
      id: 'achievement',
      action: async () => {
        await sendAchievementNotification(
          'Speed Demon',
          'Complete a puzzle in under 60 seconds',
          100
        );
        return 'Achievement notification sent!';
      },
      title: 'Achievement Unlocked',
      description: 'Celebrates player achievement'
    },
    {
      id: 'friend_challenge',
      action: async () => {
        await sendFriendChallengeNotification(
          'Alex',
          '/avatars/alex.png',
          'Speed Battle'
        );
        return 'Friend challenge sent!';
      },
      title: 'Friend Challenge',
      description: 'Notification about friend challenge'
    },
    {
      id: 'streak_milestone',
      action: async () => {
        await sendStreakMilestoneNotification(7, 10);
        return 'Streak milestone notification sent!';
      },
      title: 'Streak Milestone',
      description: 'Celebrates player streak achievement'
    },
    {
      id: 'weekly_summary',
      action: async () => {
        await sendWeeklySummaryNotification(
          25,
          78,
          45,
          3
        );
        return 'Weekly summary sent!';
      },
      title: 'Weekly Summary',
      description: 'Weekly activity summary'
    },
    {
      id: 'puzzle_recommendation',
      action: async () => {
        await sendNotification('puzzle_recommended', {
          puzzleTitle: 'Cosmic Journey',
          difficulty: 'Medium',
          creator: 'SpaceExplorer',
          rating: 4.8
        });
        return 'Puzzle recommendation sent!';
      },
      title: 'Puzzle Recommendation',
      description: 'Personalized puzzle suggestion'
    },
    {
      id: 'special_event',
      action: async () => {
        await sendNotification('special_event', {
          eventName: 'Summer Tournament',
          startTime: '2:00 PM',
          prize: '500 coins'
        }, {
          priority: 'high',
          requireInteraction: true
        });
        return 'Special event notification sent!';
      },
      title: 'Special Event',
      description: 'Announcement of special event'
    }
  ];

  // Start demo
  const startDemo = useCallback(async () => {
    if (!isSupported) {
      alert('Notifications are not supported in your browser');
      return;
    }

    if (permission === 'default') {
      const granted = await requestPermission();
      if (granted !== 'granted') {
        alert('Notification permission is required for the demo');
        return;
      }
    }

    if (permission !== 'granted') {
      alert('Please enable notifications in your browser settings');
      return;
    }

    setDemoState(prev => ({ ...prev, isRunning: true, currentIndex: 0 }));

    // Run through all notifications with delays
    for (let i = 0; i < demoNotifications.length; i++) {
      const notification = demoNotifications[i];

      setDemoState(prev => ({ ...prev, currentIndex: i + 1 }));

      try {
        const result = await notification.action();
        console.log(`Demo step ${i + 1}:`, result);
      } catch (error) {
        console.error(`Demo step ${i + 1} failed:`, error);
      }

      // Wait between notifications
      if (i < demoNotifications.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    setDemoState(prev => ({ ...prev, isRunning: false, currentIndex: 0 }));
  }, [isSupported, permission, requestPermission, ...demoNotifications.map(n => n.action)]);

  // Send single notification
  const sendSingleNotification = useCallback(async (type: string) => {
    const notification = demoNotifications.find(n => n.id === type);
    if (!notification) {
      alert('Notification type not found');
      return;
    }

    if (!isSupported) {
      alert('Notifications are not supported in your browser');
      return;
    }

    if (permission !== 'granted') {
      alert('Please enable notifications first');
      return;
    }

    try {
      const result = await notification.action();
      console.log('Notification sent:', result);
      return result;
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }, [isSupported, permission, ...demoNotifications.map(n => n.action)]);

  // Get demo progress
  const getProgress = useCallback(() => {
    return Math.round((demoState.currentIndex / demoState.totalSteps) * 100);
  }, [demoState.currentIndex, demoState.totalSteps]);

  // Reset demo
  const resetDemo = useCallback(() => {
    setDemoState({
      isRunning: false,
      currentIndex: 0,
      totalSteps: demoNotifications.length
    });
  }, [demoNotifications.length]);

  return {
    // Demo state
    demoState,
    isDemoRunning: demoState.isRunning,
    demoProgress: getProgress(),
    currentDemoStep: demoState.currentIndex,
    totalDemoSteps: demoState.totalSteps,

    // Demo actions
    startDemo,
    sendSingleNotification,
    resetDemo,

    // Available notifications for manual testing
    availableNotifications: demoNotifications.map(n => ({
      id: n.id,
      title: n.title,
      description: n.description
    })),

    // Notification system state
    isSupported,
    permission,

    // Utility
    canRunDemo: isSupported && (permission === 'granted' || permission === 'default')
  };
};