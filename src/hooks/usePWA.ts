import { useState, useEffect, useCallback } from 'react';

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

interface PWAInfo {
  isInstalled: boolean;
  isInstallable: boolean;
  isOffline: boolean;
  isSupported: boolean;
  isStandalone: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
  platform: string;
}

interface PWAStats {
  installPromptCount: number;
  lastPromptDate: Date | null;
  installDate: Date | null;
  usageCount: number;
  lastUsedDate: Date | null;
}

const STORAGE_KEYS = {
  INSTALL_PROMPT_COUNT: 'pathwordle_install_prompt_count',
  LAST_PROMPT_DATE: 'pathwordle_last_prompt_date',
  INSTALL_DATE: 'pathwordle_install_date',
  USAGE_COUNT: 'pathwordle_usage_count',
  LAST_USED_DATE: 'pathwordle_last_used_date',
  PROMPT_DISMISSED: 'pathwordle_prompt_dismissed'
} as const;

export const usePWA = () => {
  const [pwaInfo, setPwaInfo] = useState<PWAInfo>({
    isInstalled: false,
    isInstallable: false,
    isOffline: !navigator.onLine,
    isSupported: false,
    isStandalone: false,
    installPrompt: null,
    platform: ''
  });

  const [stats, setStats] = useState<PWAStats>({
    installPromptCount: 0,
    lastPromptDate: null,
    installDate: null,
    usageCount: 0,
    lastUsedDate: null
  });

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // Check if PWA is supported
  const checkPWASupport = useCallback(() => {
    const isSupported = 'serviceWorker' in navigator &&
                       'PushManager' in window &&
                       'Notification' in window;

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');

    const platform = detectPlatform();

    setPwaInfo(prev => ({
      ...prev,
      isSupported,
      isStandalone,
      platform,
      isInstalled: isStandalone || !!localStorage.getItem(STORAGE_KEYS.INSTALL_DATE)
    }));
  }, []);

  // Detect platform
  const detectPlatform = (): string => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (/android/.test(userAgent)) return 'Android';
    if (/iphone|ipad|ipod/.test(userAgent)) return 'iOS';
    if (/windows/.test(userAgent)) return 'Windows';
    if (/mac/.test(userAgent)) return 'macOS';
    if (/linux/.test(userAgent)) return 'Linux';

    return 'Unknown';
  };

  // Load stats from localStorage
  const loadStats = useCallback(() => {
    try {
      const installPromptCount = parseInt(localStorage.getItem(STORAGE_KEYS.INSTALL_PROMPT_COUNT) || '0');
      const lastPromptDate = localStorage.getItem(STORAGE_KEYS.LAST_PROMPT_DATE);
      const installDate = localStorage.getItem(STORAGE_KEYS.INSTALL_DATE);
      const usageCount = parseInt(localStorage.getItem(STORAGE_KEYS.USAGE_COUNT) || '0');
      const lastUsedDate = localStorage.getItem(STORAGE_KEYS.LAST_USED_DATE);

      setStats({
        installPromptCount,
        lastPromptDate: lastPromptDate ? new Date(lastPromptDate) : null,
        installDate: installDate ? new Date(installDate) : null,
        usageCount,
        lastUsedDate: lastUsedDate ? new Date(lastUsedDate) : null
      });
    } catch (error) {
      console.error('Failed to load PWA stats:', error);
    }
  }, []);

  // Update usage stats
  const updateUsageStats = useCallback(() => {
    try {
      const usageCount = stats.usageCount + 1;
      const lastUsedDate = new Date();

      localStorage.setItem(STORAGE_KEYS.USAGE_COUNT, usageCount.toString());
      localStorage.setItem(STORAGE_KEYS.LAST_USED_DATE, lastUsedDate.toISOString());

      setStats(prev => ({
        ...prev,
        usageCount,
        lastUsedDate
      }));
    } catch (error) {
      console.error('Failed to update usage stats:', error);
    }
  }, [stats.usageCount]);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;

      setInstallPrompt(promptEvent);
      setPwaInfo(prev => ({
        ...prev,
        isInstallable: true,
        installPrompt: promptEvent
      }));

      console.log('[PWA] Install prompt event captured');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Listen for app installed event
  useEffect(() => {
    const handleAppInstalled = () => {
      console.log('[PWA] App installed successfully');

      const installDate = new Date();
      localStorage.setItem(STORAGE_KEYS.INSTALL_DATE, installDate.toISOString());

      setPwaInfo(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        installPrompt: null
      }));

      setStats(prev => ({
        ...prev,
        installDate
      }));

      // Show success notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('PathWordle Installed!', {
          body: 'Thank you for installing PathWordle. Enjoy playing offline!',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png'
        });
      }
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setPwaInfo(prev => ({ ...prev, isOffline: false }));
      console.log('[PWA] App is online');
    };

    const handleOffline = () => {
      setPwaInfo(prev => ({ ...prev, isOffline: true }));
      console.log('[PWA] App is offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize PWA support check
  useEffect(() => {
    checkPWASupport();
    loadStats();
    updateUsageStats();
  }, [checkPWASupport, loadStats, updateUsageStats]);

  // Show install prompt
  const showInstallPrompt = useCallback(async (): Promise<boolean> => {
    if (!installPrompt) {
      console.log('[PWA] No install prompt available');
      return false;
    }

    // Check if user has recently dismissed the prompt
    const promptDismissed = localStorage.getItem(STORAGE_KEYS.PROMPT_DISMISSED);
    const lastPromptDate = stats.lastPromptDate;
    const now = new Date();

    if (promptDismissed && lastPromptDate) {
      const daysSinceLastPrompt = Math.floor((now.getTime() - lastPromptDate.getTime()) / (1000 * 60 * 60 * 24));

      // Don't show prompt if dismissed less than 7 days ago
      if (daysSinceLastPrompt < 7) {
        console.log('[PWA] Install prompt dismissed recently, skipping');
        return false;
      }
    }

    // Check if user has seen the prompt too many times
    if (stats.installPromptCount >= 3) {
      console.log('[PWA] Install prompt shown too many times, skipping');
      return false;
    }

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;

      // Update stats
      const installPromptCount = stats.installPromptCount + 1;
      const lastPromptDate = new Date();

      localStorage.setItem(STORAGE_KEYS.INSTALL_PROMPT_COUNT, installPromptCount.toString());
      localStorage.setItem(STORAGE_KEYS.LAST_PROMPT_DATE, lastPromptDate.toISOString());

      setStats(prev => ({
        ...prev,
        installPromptCount,
        lastPromptDate
      }));

      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted install prompt');
        localStorage.removeItem(STORAGE_KEYS.PROMPT_DISMISSED);
        return true;
      } else {
        console.log('[PWA] User dismissed install prompt');
        localStorage.setItem(STORAGE_KEYS.PROMPT_DISMISSED, 'true');
        return false;
      }
    } catch (error) {
      console.error('[PWA] Error showing install prompt:', error);
      return false;
    } finally {
      setInstallPrompt(null);
      setPwaInfo(prev => ({
        ...prev,
        isInstallable: false,
        installPrompt: null
      }));
    }
  }, [installPrompt, stats]);

  // Dismiss install prompt
  const dismissInstallPrompt = useCallback((): void => {
    localStorage.setItem(STORAGE_KEYS.PROMPT_DISMISSED, 'true');
    localStorage.setItem(STORAGE_KEYS.LAST_PROMPT_DATE, new Date().toISOString());

    setStats(prev => ({
      ...prev,
      lastPromptDate: new Date()
    }));

    setInstallPrompt(null);
    setPwaInfo(prev => ({
      ...prev,
      isInstallable: false,
      installPrompt: null
    }));
  }, []);

  // Check if should show install prompt
  const shouldShowInstallPrompt = useCallback((): boolean => {
    if (!pwaInfo.isInstallable || pwaInfo.isInstalled) {
      return false;
    }

    // Don't show on iOS (doesn't support install prompts)
    if (pwaInfo.platform === 'iOS') {
      return false;
    }

    // Don't show if user has dismissed recently
    const promptDismissed = localStorage.getItem(STORAGE_KEYS.PROMPT_DISMISSED);
    const lastPromptDate = stats.lastPromptDate;

    if (promptDismissed && lastPromptDate) {
      const daysSinceLastPrompt = Math.floor((Date.now() - lastPromptDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLastPrompt < 7) {
        return false;
      }
    }

    // Don't show if prompted too many times
    if (stats.installPromptCount >= 3) {
      return false;
    }

    // Show after some user engagement (e.g., after 3 visits or 10 minutes)
    const sessionTime = Date.now() - (stats.lastUsedDate?.getTime() || Date.now());
    const shouldShowByTime = sessionTime > 10 * 60 * 1000; // 10 minutes
    const shouldShowByUsage = stats.usageCount >= 3;

    return shouldShowByTime || shouldShowByUsage;
  }, [pwaInfo, stats]);

  // Reset install stats
  const resetInstallStats = useCallback((): void => {
    const keysToReset = [
      STORAGE_KEYS.INSTALL_PROMPT_COUNT,
      STORAGE_KEYS.LAST_PROMPT_DATE,
      STORAGE_KEYS.PROMPT_DISMISSED
    ];

    keysToReset.forEach(key => {
      localStorage.removeItem(key);
    });

    setStats(prev => ({
      ...prev,
      installPromptCount: 0,
      lastPromptDate: null
    }));
  }, []);

  // Get install instructions for different platforms
  const getInstallInstructions = useCallback((): { title: string; steps: string[] } => {
    switch (pwaInfo.platform) {
      case 'iOS':
        return {
          title: 'Install on iPhone/iPad',
          steps: [
            'Tap the Share button in Safari',
            'Scroll down and tap "Add to Home Screen"',
            'Tap "Add" to confirm installation'
          ]
        };

      case 'Android':
        return {
          title: 'Install on Android',
          steps: [
            'Tap the menu button (three dots) in Chrome',
            'Tap "Add to Home screen"',
            'Tap "Add" to confirm installation'
          ]
        };

      case 'Desktop':
        return {
          title: 'Install on Desktop',
          steps: [
            'Click the install icon in the address bar',
            'Click "Install" to add to your computer',
            'Launch from your desktop or start menu'
          ]
        };

      default:
        return {
          title: 'Install PathWordle',
          steps: [
            'Look for the install icon in your browser',
            'Click to add PathWordle to your device',
            'Enjoy offline play and a native app experience'
          ]
        };
    }
  }, [pwaInfo.platform]);

  return {
    // PWA Information
    pwaInfo,
    stats,

    // Install Prompt
    showInstallPrompt,
    dismissInstallPrompt,
    shouldShowInstallPrompt,

    // Instructions
    getInstallInstructions,

    // Utilities
    resetInstallStats,
    updateUsageStats,

    // Derived states
    canInstall: pwaInfo.isInstallable && !pwaInfo.isInstalled,
    isNativeApp: pwaInfo.isInstalled || pwaInfo.isStandalone,
    supportsInstall: ['Android', 'Desktop'].includes(pwaInfo.platform)
  };
};

export default usePWA;