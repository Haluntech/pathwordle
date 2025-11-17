import { useState, useEffect, useCallback, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallPrompt {
  supported: boolean;
  canInstall: boolean;
  isInstalled: boolean;
  platform: string;
  showInstallPrompt: () => Promise<boolean>;
  dismissInstallPrompt: () => void;
}

interface PWAOfflineStatus {
  online: boolean;
  offline: boolean;
  connectionType?: string;
  lastOnlineTime?: Date;
}

interface PWANotification {
  supported: boolean;
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  showNotification: (title: string, options?: NotificationOptions) => void;
}

interface PWAUpdate {
  available: boolean;
  checking: boolean;
  error?: string;
  updateApp: () => Promise<void>;
  skipUpdate: () => void;
}

interface PWAShare {
  supported: boolean;
  canShare: boolean;
  share: (data: ShareData) => Promise<void>;
}

export const usePWA = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installStatus, setInstallStatus] = useState<Omit<PWAInstallPrompt, 'showInstallPrompt' | 'dismissInstallPrompt'>>({
    supported: false,
    canInstall: false,
    isInstalled: false,
    platform: ''
  });
  const [offlineStatus, setOfflineStatus] = useState<PWAOfflineStatus>({
    online: navigator.onLine,
    offline: !navigator.onLine,
    connectionType: undefined,
    lastOnlineTime: navigator.onLine ? new Date() : undefined
  });
  const [notificationStatus, setNotificationStatus] = useState<PWANotification>({
    supported: false,
    permission: 'default',
    requestPermission: async () => 'default',
    showNotification: () => {}
  });
  const [updateStatus, setUpdateStatus] = useState<PWAUpdate>({
    available: false,
    checking: false,
    updateApp: async () => {},
    skipUpdate: () => {}
  });
  const [shareStatus, setShareStatus] = useState<PWAShare>({
    supported: false,
    canShare: false,
    share: async () => {}
  });

  const swRegistration = useRef<ServiceWorkerRegistration | null>(null);

  // Check if app is running in standalone mode (PWA installed)
  useEffect(() => {
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone ||
                         document.referrer.includes('android-app://');

      setInstallStatus(prev => ({
        ...prev,
        isInstalled: isStandalone
      }));
    };

    checkInstalled();
    window.addEventListener('appinstalled', checkInstalled);

    return () => {
      window.removeEventListener('appinstalled', checkInstalled);
    };
  }, []);

  // Before Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setInstallStatus(prev => ({
        ...prev,
        supported: true,
        canInstall: true,
        platform: (e as BeforeInstallPromptEvent).platforms[0] || 'web'
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Service Worker Registration and Update Checking
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          setUpdateStatus(prev => ({ ...prev, checking: true }));

          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          });

          swRegistration.current = registration;

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;

            newWorker?.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateStatus({
                  available: true,
                  checking: false,
                  updateApp: async () => {
                    if (newWorker.state === 'installed') {
                      newWorker.postMessage({ type: 'SKIP_WAITING' });
                      window.location.reload();
                    }
                  },
                  skipUpdate: () => {
                    setUpdateStatus(prev => ({ ...prev, available: false }));
                  }
                });
              }
            });
          });

        } catch (error) {
          console.error('Service Worker registration failed:', error);
          setUpdateStatus(prev => ({
            ...prev,
            checking: false,
            error: 'Service Worker registration failed'
          }));
        }
      }
    };

    registerServiceWorker();
  }, []);

  // Network Status Monitoring
  useEffect(() => {
    const updateNetworkStatus = () => {
      const online = navigator.onLine;
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

      setOfflineStatus(prev => ({
        online,
        offline: !online,
        connectionType: connection?.effectiveType || 'unknown',
        lastOnlineTime: online ? new Date() : prev.lastOnlineTime
      }));

      // Show notification when coming back online
      if (online && prev.offline) {
        showNetworkNotification('You\'re back online!', 'success');
      }
    };

    const handleOnline = () => updateNetworkStatus();
    const handleOffline = () => updateNetworkStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Monitor connection changes
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  // Notification API
  useEffect(() => {
    const checkNotificationSupport = async () => {
      if ('Notification' in window) {
        setNotificationStatus({
          supported: true,
          permission: Notification.permission,
          requestPermission: async () => {
            if (Notification.permission === 'default') {
              const permission = await Notification.requestPermission();
              setNotificationStatus(prev => ({ ...prev, permission }));
              return permission;
            }
            return Notification.permission;
          },
          showNotification: (title, options = {}) => {
            if (Notification.permission === 'granted') {
              new Notification(title, {
                icon: '/favicon-192x192.png',
                badge: '/favicon-192x192.png',
                ...options
              });
            }
          }
        });
      }
    };

    checkNotificationSupport();
  }, []);

  // Web Share API
  useEffect(() => {
    const checkShareSupport = () => {
      if ('share' in navigator) {
        setShareStatus({
          supported: true,
          canShare: true,
          share: async (data) => {
            try {
              await navigator.share(data);
            } catch (error) {
              if ((error as Error).name !== 'AbortError') {
                console.error('Share failed:', error);
                throw error;
              }
            }
          }
        });
      }
    };

    checkShareSupport();
  }, []);

  // Install prompt methods
  const showInstallPrompt = useCallback(async (): Promise<boolean> => {
    if (!installPrompt) return false;

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;

      setInstallPrompt(null);
      setInstallStatus(prev => ({
        ...prev,
        canInstall: false
      }));

      return outcome === 'accepted';
    } catch (error) {
      console.error('Install prompt failed:', error);
      return false;
    }
  }, [installPrompt]);

  const dismissInstallPrompt = useCallback(() => {
    setInstallPrompt(null);
    setInstallStatus(prev => ({
      ...prev,
      canInstall: false
    }));
  }, []);

  // Show network status notification
  const showNetworkNotification = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'info') => {
    if (notificationStatus.supported && notificationStatus.permission === 'granted') {
      notificationStatus.showNotification(message, {
        body: `PathWordle - ${message}`,
        tag: 'network-status',
        requireInteraction: type === 'error'
      });
    }
  }, [notificationStatus]);

  // Cache management for offline play
  const cacheGameData = useCallback(async (gameData: any) => {
    if ('caches' in window) {
      try {
        const cache = await caches.open('pathwordle-game-data');
        await cache.put('/current-game', new Response(JSON.stringify(gameData)));
      } catch (error) {
        console.error('Failed to cache game data:', error);
      }
    }
  }, []);

  const getCachedGameData = useCallback(async () => {
    if ('caches' in window) {
      try {
        const cache = await caches.open('pathwordle-game-data');
        const response = await cache.match('/current-game');
        if (response) {
          return await response.json();
        }
      } catch (error) {
        console.error('Failed to get cached game data:', error);
      }
    }
    return null;
  }, []);

  // Background sync for multiplayer data
  const registerBackgroundSync = useCallback(async (tag: string) => {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register(tag);
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    }
  }, []);

  // Periodic background sync for leaderboards
  const registerPeriodicSync = useCallback(async () => {
    if ('serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.periodicSync.register('leaderboard-update', {
          minInterval: 24 * 60 * 60 * 1000 // 24 hours
        });
      } catch (error) {
        console.error('Periodic sync registration failed:', error);
      }
    }
  }, []);

  return {
    // Install functionality
    install: {
      ...installStatus,
      showInstallPrompt,
      dismissInstallPrompt
    } as PWAInstallPrompt,

    // Network status
    network: offlineStatus,

    // Notifications
    notifications: notificationStatus,

    // App updates
    updates: updateStatus,

    // Share functionality
    share: shareStatus,

    // Offline functionality
    cache: {
      saveGameData: cacheGameData,
      loadGameData: getCachedGameData
    },

    // Background sync
    backgroundSync: {
      register: registerBackgroundSync,
      registerPeriodic: registerPeriodicSync
    },

    // Connection info
    getConnectionInfo: () => {
      const connection = (navigator as any).connection;
      return connection ? {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      } : null;
    },

    // PWA features availability
    features: {
      serviceWorker: 'serviceWorker' in navigator,
      notifications: 'Notification' in window,
      share: 'share' in navigator,
      install: 'beforeinstallprompt' in window,
      backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
      periodicSync: 'serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype,
      payment: 'PaymentRequest' in window,
      credentials: 'credentials' in navigator
    }
  };
};