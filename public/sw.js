// PathWordle Advanced Service Worker
// Version 2.0 - Enhanced with offline capabilities and background sync

const CACHE_VERSION = '2.0.0';
const CACHE_PREFIX = 'pathwordle';

// Cache names
const CACHES = {
  STATIC: `${CACHE_PREFIX}-static-v${CACHE_VERSION}`,
  DYNAMIC: `${CACHE_PREFIX}-dynamic-v${CACHE_VERSION}`,
  API: `${CACHE_PREFIX}-api-v${CACHE_VERSION}`,
  IMAGES: `${CACHE_PREFIX}-images-v${CACHE_VERSION}`,
  GAME_DATA: `${CACHE_PREFIX}-game-data-v${CACHE_VERSION}`,
  OFFLINE: `${CACHE_PREFIX}-offline-v${CACHE_VERSION}`
};

// Static files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add your CSS and JS files here
];

// Game resources that should be cached
const GAME_RESOURCES = [
  '/api/dictionary',
  '/api/puzzles/daily',
  '/api/puzzles/themed',
  '/data/words.json',
  '/data/themes.json'
];

// Network timeout settings
const NETWORK_TIMEOUT = 10000; // 10 seconds
const BACKGROUND_SYNC_TIMEOUT = 30000; // 30 seconds

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker version', CACHE_VERSION);

  event.waitUntil(
    caches.open(CACHES.STATIC)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker version', CACHE_VERSION);

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName.startsWith(CACHE_PREFIX) &&
                     !Object.values(CACHES).includes(cacheName);
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Old caches cleaned up');
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('[SW] Failed to clean up old caches:', error);
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and Chrome extensions
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Route requests to appropriate handlers
  if (url.origin === self.location.origin) {
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(handleApiRequest(request));
    } else if (url.pathname.startsWith('/data/') ||
               url.pathname.includes('/puzzles/') ||
               url.pathname.includes('/dictionary')) {
      event.respondWith(handleGameResourceRequest(request));
    } else if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)) {
      event.respondWith(handleImageRequest(request));
    } else {
      event.respondWith(handleStaticRequest(request));
    }
  } else {
    event.respondWith(handleExternalRequest(request));
  }
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    // Try network first with timeout
    const networkResponse = await fetchWithTimeout(request);

    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(CACHES.API);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    throw new Error('Network response not ok');
  } catch (error) {
    console.log('[SW] Network request failed, trying cache:', request.url);

    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline response for API requests
    return createOfflineApiResponse(request);
  }
}

// Handle game resource requests with cache-first strategy
async function handleGameResourceRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback to network
    const networkResponse = await fetchWithTimeout(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHES.GAME_DATA);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    throw new Error('Network request failed');
  } catch (error) {
    console.log('[SW] Game resource request failed:', request.url);

    // Return offline game data
    return createOfflineGameResponse(request);
  }
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback to network
    const networkResponse = await fetchWithTimeout(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHES.STATIC);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    throw new Error('Network request failed');
  } catch (error) {
    console.log('[SW] Static request failed:', request.url);

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/') || createOfflinePage();
    }

    return new Response('Offline', { status: 503 });
  }
}

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback to network
    const networkResponse = await fetchWithTimeout(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHES.IMAGES);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    throw new Error('Network request failed');
  } catch (error) {
    console.log('[SW] Image request failed:', request.url);

    // Return placeholder image
    return createPlaceholderImage();
  }
}

// Handle external requests with network-only strategy
async function handleExternalRequest(request) {
  try {
    return await fetchWithTimeout(request);
  } catch (error) {
    console.log('[SW] External request failed:', request.url);

    // For some external resources, try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response('Offline', { status: 503 });
  }
}

// Fetch with timeout utility
function fetchWithTimeout(request, timeout = NETWORK_TIMEOUT) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Network timeout')), timeout);
    })
  ]);
}

// Create offline API response
function createOfflineApiResponse(request) {
  const url = new URL(request.url);

  // Return appropriate offline responses based on the API endpoint
  if (url.pathname.includes('/dictionary')) {
    return Response.json({
      error: 'offline',
      message: 'Dictionary unavailable offline',
      data: getBasicOfflineDictionary()
    });
  }

  if (url.pathname.includes('/puzzles')) {
    return Response.json({
      error: 'offline',
      message: 'Puzzles unavailable offline',
      data: getOfflinePuzzles()
    });
  }

  return Response.json({
    error: 'offline',
    message: 'API unavailable offline'
  }, { status: 503 });
}

// Create offline game response
function createOfflineGameResponse(request) {
  const url = new URL(request.url);

  if (url.pathname.includes('/words.json')) {
    return Response.json(getBasicOfflineDictionary());
  }

  if (url.pathname.includes('/themes.json')) {
    return Response.json(getOfflineThemes());
  }

  return new Response('Offline', { status: 503 });
}

// Create offline page
function createOfflinePage() {
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PathWordle - Offline</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 20px;
        }
        .offline-container {
          max-width: 400px;
          background: rgba(255, 255, 255, 0.1);
          padding: 40px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }
        .icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        h1 {
          margin: 0 0 20px 0;
          font-size: 28px;
        }
        p {
          margin: 0 0 30px 0;
          opacity: 0.9;
          line-height: 1.6;
        }
        .btn {
          display: inline-block;
          padding: 12px 24px;
          background: white;
          color: #667eea;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          transition: transform 0.2s;
        }
        .btn:hover {
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="icon">🎯</div>
        <h1>You're Offline</h1>
        <p>Don't worry! PathWordle works offline. You can continue playing and sync your progress when you're back online.</p>
        <a href="/" class="btn">Continue Playing</a>
      </div>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}

// Create placeholder image
function createPlaceholderImage() {
  // SVG placeholder
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e0e0e0"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#666" font-family="sans-serif" font-size="14">
        Image Offline
      </text>
    </svg>
  `;

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' }
  });
}

// Basic offline dictionary
function getBasicOfflineDictionary() {
  return {
    words: [
      'cat', 'dog', 'run', 'jump', 'play', 'game', 'word', 'puzzle',
      'fun', 'win', 'score', 'time', 'fast', 'quick', 'smart', 'think'
    ],
    definitions: {},
    total: 16
  };
}

// Offline puzzles
function getOfflinePuzzles() {
  return {
    daily: {
      id: 'offline-daily',
      theme: 'Classic',
      difficulty: 'medium',
      grid: generateBasicGrid()
    },
    themed: [
      {
        id: 'offline-themed-1',
        theme: 'Animals',
        difficulty: 'easy',
        grid: generateBasicGrid()
      }
    ]
  };
}

// Offline themes
function getOfflineThemes() {
  return [
    { id: 'classic', name: 'Classic', description: 'Traditional word puzzle' },
    { id: 'animals', name: 'Animals', description: 'Animal-themed words' },
    { id: 'food', name: 'Food', description: 'Food and cooking words' }
  ];
}

// Generate basic game grid
function generateBasicGrid() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const grid = [];
  for (let i = 0; i < 4; i++) {
    const row = [];
    for (let j = 0; j < 4; j++) {
      row.push(letters[Math.floor(Math.random() * letters.length)]);
    }
    grid.push(row);
  }
  return grid;
}

// Background sync for notifications
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);

  if (event.tag === 'background-sync-notifications') {
    event.waitUntil(syncNotifications());
  } else if (event.tag === 'background-sync-game-data') {
    event.waitUntil(syncGameData());
  }
});

// Sync notifications
async function syncNotifications() {
  try {
    console.log('[SW] Syncing notifications in background');

    // Register for push notifications if not already registered
    const registration = await self.registration.pushManager.getSubscription();
    if (!registration) {
      console.log('[SW] No push subscription found');
      return;
    }

    // Fetch pending notifications from server
    const response = await fetch('/api/notifications/pending', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription: registration,
        lastSync: localStorage.getItem('lastNotificationSync')
      })
    });

    if (response.ok) {
      const notifications = await response.json();

      // Show notifications
      for (const notification of notifications) {
        await self.registration.showNotification(notification.title, {
          body: notification.body,
          icon: notification.icon || '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
          tag: notification.tag,
          data: notification.data,
          actions: notification.actions || [],
          requireInteraction: notification.requireInteraction || false
        });
      }

      // Update last sync time
      localStorage.setItem('lastNotificationSync', Date.now().toString());
    }
  } catch (error) {
    console.error('[SW] Failed to sync notifications:', error);
  }
}

// Sync game data
async function syncGameData() {
  try {
    console.log('[SW] Syncing game data in background');

    // Get offline game data from IndexedDB
    const offlineData = await getOfflineGameData();

    if (offlineData && offlineData.length > 0) {
      // Sync with server
      const response = await fetch('/api/sync/game-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: offlineData })
      });

      if (response.ok) {
        // Clear synced data
        await clearOfflineGameData();
        console.log('[SW] Game data synced successfully');
      }
    }
  } catch (error) {
    console.error('[SW] Failed to sync game data:', error);
  }
}

// Get offline game data from IndexedDB
async function getOfflineGameData() {
  return new Promise((resolve, reject) => {
    // Implementation would use IndexedDB to get offline game data
    // For now, return empty array
    resolve([]);
  });
}

// Clear offline game data from IndexedDB
async function clearOfflineGameData() {
  return new Promise((resolve) => {
    // Implementation would clear IndexedDB
    resolve();
  });
}

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  if (event.data) {
    try {
      const data = event.data.json();

      event.waitUntil(
        self.registration.showNotification(data.title, {
          body: data.body,
          icon: data.icon || '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
          tag: data.tag,
          data: data.data,
          actions: data.actions || [],
          requireInteraction: data.requireInteraction || false,
          silent: data.silent || false
        })
      );
    } catch (error) {
      console.error('[SW] Failed to parse push data:', error);
    }
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);

  event.notification.close();

  // Handle notification clicks
  const urlToOpen = getNotificationUrl(event.notification);

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }

        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Get URL to open based on notification
function getNotificationUrl(notification) {
  const data = notification.data || {};

  switch (notification.tag) {
    case 'daily-challenge':
      return '/?action=daily-challenge';
    case 'friend-challenge':
      return `/multiplayer?challenge=${data.challengeId}`;
    case 'achievement':
      return '/achievements';
    case 'reminder':
      return '/';
    default:
      return '/';
  }
}

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync event:', event.tag);

  if (event.tag === 'daily-content') {
    event.waitUntil(updateDailyContent());
  } else if (event.tag === 'cleanup-cache') {
    event.waitUntil(cleanupCache());
  }
});

// Update daily content
async function updateDailyContent() {
  try {
    console.log('[SW] Updating daily content');

    // Fetch new daily puzzles
    const response = await fetch('/api/puzzles/daily');

    if (response.ok) {
      const puzzles = await response.json();

      // Cache new content
      const cache = await caches.open(CACHES.GAME_DATA);
      cache.put('/api/puzzles/daily', new Response(JSON.stringify(puzzles)));

      console.log('[SW] Daily content updated');
    }
  } catch (error) {
    console.error('[SW] Failed to update daily content:', error);
  }
}

// Clean up cache
async function cleanupCache() {
  try {
    console.log('[SW] Cleaning up cache');

    const cacheNames = await caches.keys();
    const now = Date.now();

    for (const cacheName of cacheNames) {
      if (!cacheName.startsWith(CACHE_PREFIX)) continue;

      const cache = await caches.open(cacheName);
      const requests = await cache.keys();

      for (const request of requests) {
        const response = await cache.match(request);
        const dateHeader = response?.headers.get('date');

        if (dateHeader) {
          const responseDate = new Date(dateHeader).getTime();
          const daysOld = (now - responseDate) / (1000 * 60 * 60 * 24);

          // Remove old cached responses (older than 30 days)
          if (daysOld > 30) {
            await cache.delete(request);
            console.log('[SW] Removed old cache entry:', request.url);
          }
        }
      }
    }
  } catch (error) {
    console.error('[SW] Failed to cleanup cache:', error);
  }
}

// Message event handler
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      case 'CACHE_UPDATE':
        updateCache(event.data.payload);
        break;
      case 'CLEAR_CACHE':
        clearCache(event.data.payload);
        break;
    }
  }
});

// Update specific cache
async function updateCache(payload) {
  try {
    const { urls, cacheName = CACHES.DYNAMIC } = payload;
    const cache = await caches.open(cacheName);

    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
          console.log('[SW] Updated cache:', url);
        }
      } catch (error) {
        console.error('[SW] Failed to update cache:', url, error);
      }
    }
  } catch (error) {
    console.error('[SW] Failed to update cache:', error);
  }
}

// Clear specific cache
async function clearCache(payload) {
  try {
    const { urls, cacheName } = payload;

    if (cacheName) {
      await caches.delete(cacheName);
      console.log('[SW] Cleared cache:', cacheName);
    } else if (urls) {
      const cache = await caches.open(CACHES.DYNAMIC);
      for (const url of urls) {
        await cache.delete(url);
        console.log('[SW] Cleared cache entry:', url);
      }
    }
  } catch (error) {
    console.error('[SW] Failed to clear cache:', error);
  }
}

console.log('[SW] Service worker loaded successfully');