import React, { useState, useEffect, memo, useCallback } from 'react';
import { usePWA } from '../hooks/usePWA';
import {
  Wifi,
  WifiOff,
  Download,
  Smartphone,
  RefreshCw,
  Bell,
  BellOff,
  Check,
  X,
  AlertCircle,
  Info
} from 'lucide-react';

interface PWAStatusBarProps {
  className?: string;
  showInstallPrompt?: boolean;
  showNetworkStatus?: boolean;
  autoHide?: boolean;
}

const PWAStatusBar: React.FC<PWAStatusBarProps> = ({
  className = '',
  showInstallPrompt: boolean = true,
  showNetworkStatus: boolean = true,
  autoHide: boolean = true
}) => {
  const pwa = usePWA();
  const [dismissedItems, setDismissedItems] = useState<Set<string>>(new Set());
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

  // Load dismissed items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pwa-dismissed-items');
    if (saved) {
      try {
        setDismissedItems(new Set(JSON.parse(saved)));
      } catch (error) {
        console.error('Failed to load dismissed items:', error);
      }
    }
  }, []);

  // Save dismissed items to localStorage
  useEffect(() => {
    localStorage.setItem('pwa-dismissed-items', JSON.stringify(Array.from(dismissedItems)));
  }, [dismissedItems]);

  // Show update banner when update is available
  useEffect(() => {
    if (pwa.updates.available && !dismissedItems.has('update-available')) {
      setShowUpdateBanner(true);
    }
  }, [pwa.updates.available, dismissedItems]);

  const dismissItem = useCallback((item: string) => {
    setDismissedItems(prev => new Set(prev).add(item));
  }, []);

  const handleInstallClick = useCallback(async () => {
    const success = await pwa.install.showInstallPrompt();
    if (success) {
      dismissItem('install-prompt');
    }
  }, [pwa.install, dismissItem]);

  const handleUpdateClick = useCallback(async () => {
    await pwa.updates.updateApp();
  }, [pwa.updates]);

  const handleSkipUpdate = useCallback(() => {
    pwa.updates.skipUpdate();
    dismissItem('update-available');
    setShowUpdateBanner(false);
  }, [pwa.updates, dismissItem]);

  const getConnectionColor = useCallback(() => {
    if (!pwa.network.online) return 'text-red-600 bg-red-50 border-red-200';

    switch (pwa.network.connectionType) {
      case 'slow-2g':
      case '2g':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case '3g':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case '4g':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  }, [pwa.network]);

  const getConnectionText = useCallback(() => {
    if (!pwa.network.online) return 'Offline';

    switch (pwa.network.connectionType) {
      case 'slow-2g': return 'Very Slow';
      case '2g': return '2G';
      case '3g': return '3G';
      case '4g': return '4G';
      default: return 'Online';
    }
  }, [pwa.network]);

  // Don't render if no PWA features are available
  if (!pwa.features.serviceWorker && !pwa.features.install) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 pointer-events-none ${className}`}>
      {/* Update Banner */}
      {showUpdateBanner && (
        <div className="pointer-events-auto relative p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 animate-pulse">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    App Update Available
                  </p>
                  <p className="text-xs text-blue-600">
                    A new version with improvements is ready to install
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleUpdateClick}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Update Now
                </button>
                <button
                  onClick={handleSkipUpdate}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                  aria-label="Skip update"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Install Prompt */}
      {showInstallPrompt &&
       pwa.install.canInstall &&
       !pwa.install.isInstalled &&
       !dismissedItems.has('install-prompt') && (
        <div className="pointer-events-auto relative p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Install PathWordle
                  </p>
                  <p className="text-xs text-green-600">
                    Add to home screen for the best experience
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleInstallClick}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Install
                </button>
                <button
                  onClick={() => dismissItem('install-prompt')}
                  className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                  aria-label="Dismiss install prompt"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Network Status */}
      {showNetworkStatus && autoHide && (
        <div className="pointer-events-auto fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80">
          {!pwa.network.online && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg shadow-lg">
              <WifiOff className="w-4 h-4 text-red-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">You're offline</p>
                <p className="text-xs text-red-600">
                  Game progress will be saved locally
                </p>
              </div>
            </div>
          )}

          {pwa.network.online && pwa.network.lastOnlineTime && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg shadow-lg">
              <Wifi className="w-4 h-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Back online</p>
                <p className="text-xs text-green-600">
                  Syncing your progress...
                </p>
              </div>
            </div>
          )}

          {pwa.network.online && pwa.network.connectionType && (
            <div className={`flex items-center gap-2 p-2 ${getConnectionColor()} border rounded-lg`}>
              <Wifi className="w-4 h-4" />
              <span className="text-xs font-medium">
                {getConnectionText()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Notification Permission Request */}
      {pwa.notifications.supported &&
       pwa.notifications.permission === 'default' &&
       !dismissedItems.has('notification-permission') && (
        <div className="pointer-events-auto relative p-3 bg-purple-50 border-b border-purple-200">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-800">
                    Enable Notifications
                  </p>
                  <p className="text-xs text-purple-600">
                    Get notified about daily challenges and friend requests
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    const permission = await pwa.notifications.requestPermission();
                    if (permission === 'granted') {
                      dismissItem('notification-permission');
                    }
                  }}
                  className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                >
                  Enable
                </button>
                <button
                  onClick={() => dismissItem('notification-permission')}
                  className="p-1 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                  aria-label="Dismiss notification request"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PWA Feature Indicators (for development/debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="pointer-events-auto fixed top-20 right-4 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-xs">
          <h4 className="font-bold mb-2">PWA Status</h4>
          <div className="space-y-1">
            <div>Service Worker: {pwa.features.serviceWorker ? '✅' : '❌'}</div>
            <div>Installable: {pwa.install.canInstall ? '✅' : '❌'}</div>
            <div>Installed: {pwa.install.isInstalled ? '✅' : '❌'}</div>
            <div>Online: {pwa.network.online ? '✅' : '❌'}</div>
            <div>Notifications: {pwa.notifications.permission}</div>
            <div>Background Sync: {pwa.features.backgroundSync ? '✅' : '❌'}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(PWAStatusBar);