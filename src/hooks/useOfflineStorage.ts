import { useState, useEffect, useCallback } from 'react';

interface OfflineGame {
  id: string;
  gameMode: 'daily' | 'practice';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  gameState: any;
  timestamp: number;
  isComplete: boolean;
}

interface OfflineStorage {
  saveGame: (gameData: OfflineGame) => Promise<void>;
  loadGame: (gameId: string) => Promise<OfflineGame | null>;
  getAllGames: () => Promise<OfflineGame[]>;
  deleteGame: (gameId: string) => Promise<void>;
  clearAllGames: () => Promise<void>;
  getStorageQuota: () => Promise<{ used: number; available: number }>;
}

// Simple localStorage-based offline storage
export const useOfflineStorage = (): OfflineStorage => {
  const DB_NAME = 'PathWordleOffline';
  const DB_VERSION = 1;
  const STORE_NAME = 'games';

  // Initialize IndexedDB
  const initDB = useCallback(async (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }, []);

  const saveGame = useCallback(async (gameData: OfflineGame): Promise<void> => {
    try {
      // Also save to localStorage as backup
      const localStorageKey = `offline-game-${gameData.id}`;
      localStorage.setItem(localStorageKey, JSON.stringify(gameData));

      // Save to IndexedDB for larger storage
      const db = await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(gameData);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error('Failed to save offline game:', error);
      throw error;
    }
  }, [initDB]);

  const loadGame = useCallback(async (gameId: string): Promise<OfflineGame | null> => {
    try {
      // Try localStorage first
      const localStorageKey = `offline-game-${gameId}`;
      const localStorageData = localStorage.getItem(localStorageKey);
      if (localStorageData) {
        const parsedData = JSON.parse(localStorageData);
        return parsedData;
      }

      // Try IndexedDB
      const db = await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(gameId);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result || null);
      });
    } catch (error) {
      console.error('Failed to load offline game:', error);
      return null;
    }
  }, [initDB]);

  const getAllGames = useCallback(async (): Promise<OfflineGame[]> => {
    try {
      const games: OfflineGame[] = [];

      // Get from localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('offline-game-')) {
          try {
            const data = localStorage.getItem(key);
            if (data) {
              games.push(JSON.parse(data));
            }
          } catch (error) {
            console.error('Failed to parse localStorage game:', key, error);
          }
        }
      }

      // Get from IndexedDB (for more robust storage)
      try {
        const db = await initDB();
        const dbGames = await new Promise<OfflineGame[]>((resolve, reject) => {
          const transaction = db.transaction(STORE_NAME, 'readonly');
          const store = transaction.objectStore(STORE_NAME);
          const request = store.getAll();

          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve(request.result || []);
        });

        // Merge and deduplicate
        const allGames = new Map<string, OfflineGame>();
        games.forEach(game => allGames.set(game.id, game));
        dbGames.forEach(game => allGames.set(game.id, game));

        return Array.from(allGames.values());
      } catch (error) {
        console.warn('IndexedDB failed, using localStorage only:', error);
        return games;
      }
    } catch (error) {
      console.error('Failed to get all offline games:', error);
      return [];
    }
  }, [initDB]);

  const deleteGame = useCallback(async (gameId: string): Promise<void> => {
    try {
      // Remove from localStorage
      const localStorageKey = `offline-game-${gameId}`;
      localStorage.removeItem(localStorageKey);

      // Remove from IndexedDB
      const db = await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(gameId);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error('Failed to delete offline game:', error);
      throw error;
    }
  }, [initDB]);

  const clearAllGames = useCallback(async (): Promise<void> => {
    try {
      // Clear localStorage
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key?.startsWith('offline-game-')) {
          localStorage.removeItem(key);
        }
      }

      // Clear IndexedDB
      const db = await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error('Failed to clear all offline games:', error);
      throw error;
    }
  }, [initDB]);

  const getStorageQuota = useCallback(async (): Promise<{ used: number; available: number }> => {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          available: (estimate.quota || 0) - (estimate.usage || 0)
        };
      }

      // Fallback: calculate localStorage size
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += key.length + value.length;
          }
        }
      }

      return {
        used: totalSize * 2, // Rough estimate (UTF-16)
        available: 5 * 1024 * 1024 - totalSize * 2 // Assume 5MB limit
      };
    } catch (error) {
      console.error('Failed to get storage quota:', error);
      return { used: 0, available: 0 };
    }
  }, []);

  return {
    saveGame,
    loadGame,
    getAllGames,
    deleteGame,
    clearAllGames,
    getStorageQuota
  };
};

// Hook for managing offline game state
export const useOfflineGames = () => {
  const [offlineGames, setOfflineGames] = useState<OfflineGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageQuota, setStorageQuota] = useState<{ used: number; available: number }>({ used: 0, available: 0 });
  const offlineStorage = useOfflineStorage();

  // Load offline games on mount
  useEffect(() => {
    const loadOfflineGames = async () => {
      try {
        setIsLoading(true);
        const games = await offlineStorage.getAllGames();
        setOfflineGames(games);

        // Sort by timestamp (newest first)
        games.sort((a, b) => b.timestamp - a.timestamp);

        // Get storage quota
        const quota = await offlineStorage.getStorageQuota();
        setStorageQuota(quota);
      } catch (error) {
        console.error('Failed to load offline games:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOfflineGames();
  }, [offlineStorage]);

  const saveCurrentGame = useCallback(async (gameData: any, gameMode: 'daily' | 'practice', difficulty: 'easy' | 'medium' | 'hard' | 'expert') => {
    try {
      const gameId = `game-${gameMode}-${difficulty}-${Date.now()}`;
      const offlineGame: OfflineGame = {
        id: gameId,
        gameMode,
        difficulty,
        gameState: gameData,
        timestamp: Date.now(),
        isComplete: gameData.gameStatus === 'won' || gameData.gameStatus === 'lost'
      };

      await offlineStorage.saveGame(offlineGame);

      // Update local state
      setOfflineGames(prev => {
        const updated = [offlineGame, ...prev.filter(g => g.id !== gameId)];
        return updated.sort((a, b) => b.timestamp - a.timestamp);
      });

      // Update storage quota
      const quota = await offlineStorage.getStorageQuota();
      setStorageQuota(quota);

      return gameId;
    } catch (error) {
      console.error('Failed to save current game:', error);
      throw error;
    }
  }, [offlineStorage]);

  const deleteOfflineGame = useCallback(async (gameId: string) => {
    try {
      await offlineStorage.deleteGame(gameId);
      setOfflineGames(prev => prev.filter(g => g.id !== gameId));

      // Update storage quota
      const quota = await offlineStorage.getStorageQuota();
      setStorageQuota(quota);
    } catch (error) {
      console.error('Failed to delete offline game:', error);
      throw error;
    }
  }, [offlineStorage]);

  const clearAllOfflineGames = useCallback(async () => {
    try {
      await offlineStorage.clearAllGames();
      setOfflineGames([]);

      // Update storage quota
      const quota = await offlineStorage.getStorageQuota();
      setStorageQuota(quota);
    } catch (error) {
      console.error('Failed to clear all offline games:', error);
      throw error;
    }
  }, [offlineStorage]);

  const getIncompleteGame = useCallback((): OfflineGame | null => {
    return offlineGames.find(game => !game.isComplete) || null;
  }, [offlineGames]);

  const getStorageUsagePercentage = useCallback((): number => {
    const total = storageQuota.used + storageQuota.available;
    return total > 0 ? (storageQuota.used / total) * 100 : 0;
  }, [storageQuota]);

  return {
    offlineGames,
    isLoading,
    storageQuota,
    storageUsagePercentage: getStorageUsagePercentage(),
    saveCurrentGame,
    deleteOfflineGame,
    clearAllOfflineGames,
    getIncompleteGame,
    refreshGames: async () => {
      const games = await offlineStorage.getAllGames();
      setOfflineGames(games);
    }
  };
};