import { useState, useEffect, useCallback, useRef } from 'react';
import {
  MultiplayerRoom,
  MultiplayerPlayer,
  MultiplayerGame,
  GameSettings,
  MatchmakingRequest,
  Tournament,
  MultiplayerStats,
  RoomListFilters,
  MultiplayerNotification,
  MultiplayerSession,
  ChatMessage,
  PowerUp
} from '../types/multiplayer';

// Mock data generators
const generateMockRooms = (): MultiplayerRoom[] => [
  {
    id: 'room_1',
    name: 'Quick Battle',
    hostId: 'user_123',
    hostName: 'ProPlayer',
    hostAvatar: '🏆',
    gameMode: 'versus',
    status: 'waiting',
    maxPlayers: 2,
    currentPlayers: 1,
    players: [{
      userId: 'user_123',
      username: 'proplayer',
      displayName: 'ProPlayer',
      avatar: '🏆',
      level: 45,
      status: 'joined',
      score: 0,
      roundScores: [],
      attempts: 0,
      timeTaken: 0,
      rank: 1,
      isHost: true,
      isReady: true,
      stats: {
        winRate: 0.78,
        averageTime: 145,
        maxStreak: 12
      }
    }],
    settings: {
      difficulty: 'medium',
      timeLimit: 120,
      maxAttempts: 6,
      powerUps: false,
      hints: false,
      spectators: true,
      private: false
    },
    createdAt: new Date().toISOString(),
    roundTime: 120,
    currentRound: 0,
    totalRounds: 5
  },
  {
    id: 'room_2',
    name: 'Tournament Arena',
    hostId: 'user_456',
    hostName: 'GameMaster',
    hostAvatar: '👑',
    gameMode: 'tournament',
    status: 'in_progress',
    maxPlayers: 8,
    currentPlayers: 6,
    players: Array.from({ length: 6 }, (_, i) => ({
      userId: `user_${i}`,
      username: `player${i}`,
      displayName: `Player ${i + 1}`,
      avatar: ['🎮', '🎯', '🎪', '🎨', '🎭', '🎪'][i],
      level: 30 + i * 5,
      status: i < 3 ? 'playing' : 'finished',
      score: Math.floor(Math.random() * 1000),
      roundScores: Array.from({ length: 3 }, () => Math.floor(Math.random() * 200)),
      attempts: Math.floor(Math.random() * 6) + 1,
      timeTaken: Math.floor(Math.random() * 180) + 60,
      rank: i < 3 ? i + 1 : undefined,
      isHost: i === 0,
      isReady: true,
      stats: {
        winRate: 0.6 + Math.random() * 0.3,
        averageTime: 100 + Math.random() * 100,
        maxStreak: Math.floor(Math.random() * 10) + 1
      }
    })),
    settings: {
      difficulty: 'hard',
      timeLimit: 90,
      maxAttempts: 6,
      powerUps: true,
      hints: false,
      spectators: true,
      private: false
    },
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    startedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    roundTime: 90,
    currentRound: 3,
    totalRounds: 5
  }
];

const generateMockTournaments = (): Tournament[] => [
  {
    id: 'tournament_1',
    name: 'Weekend Championship',
    description: 'Compete for the ultimate prize in this 64-player tournament!',
    type: 'elimination',
    status: 'registration',
    maxParticipants: 64,
    currentParticipants: 23,
    entryFee: 100,
    prizePool: 5000,
    rewards: [
      { rank: 1, type: 'gems', amount: 2000, description: '2000 Gems' },
      { rank: 2, type: 'gems', amount: 1000, description: '1000 Gems' },
      { rank: 3, type: 'gems', amount: 500, description: '500 Gems' },
      { rank: 4, type: 'premium', amount: 7, description: '7 Days Premium' }
    ],
    settings: {
      difficulty: 'expert',
      timeLimit: 60,
      maxAttempts: 6,
      powerUps: true,
      hints: false,
      spectators: true,
      private: false
    },
    schedule: [],
    leaderboard: [],
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system',
    createdAt: new Date().toISOString()
  }
];

const generateMockPowerUps = (): PowerUp[] => [
  {
    id: 'reveal_letter',
    name: 'Reveal Letter',
    description: 'Reveals one correct letter in the word',
    icon: '🔍',
    rarity: 'common',
    type: 'reveal_letter',
    cost: 50,
    uses: 1,
    maxUses: 3
  },
  {
    id: 'extra_time',
    name: 'Extra Time',
    description: 'Adds 30 seconds to the timer',
    icon: '⏰',
    rarity: 'rare',
    type: 'extra_time',
    cost: 75,
    duration: 30,
    uses: 1,
    maxUses: 2
  },
  {
    id: 'double_points',
    name: 'Double Points',
    description: 'Doubles points for the next round',
    icon: '×2',
    rarity: 'epic',
    type: 'double_points',
    cost: 150,
    uses: 1,
    maxUses: 1
  }
];

export const useMultiplayer = () => {
  const [session, setSession] = useState<MultiplayerSession | null>(null);
  const [currentRoom, setCurrentRoom] = useState<MultiplayerRoom | null>(null);
  const [currentGame, setCurrentGame] = useState<MultiplayerGame | null>(null);
  const [rooms, setRooms] = useState<MultiplayerRoom[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [matchmakingRequest, setMatchmakingRequest] = useState<MatchmakingRequest | null>(null);
  const [notifications, setNotifications] = useState<MultiplayerNotification[]>([]);
  const [stats, setStats] = useState<MultiplayerStats>({
    totalGames: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winRate: 0,
    averageScore: 0,
    bestScore: 0,
    averagePlacement: 0,
    tournamentsWon: 0,
    tournamentsPlayed: 0,
    currentStreak: 0,
    maxStreak: 0,
    favoriteMode: 'versus',
    achievements: [],
    powerUpsUsed: 0,
    totalPlayTime: 0
  });
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');

  const wsRef = useRef<WebSocket | null>(null);

  // Initialize data and WebSocket connection
  useEffect(() => {
    const savedRooms = localStorage.getItem('multiplayerRooms');
    const savedStats = localStorage.getItem('multiplayerStats');
    const savedPowerUps = localStorage.getItem('powerUps');

    if (savedRooms) {
      try {
        setRooms(JSON.parse(savedRooms));
      } catch (error) {
        console.error('Error loading rooms:', error);
        setRooms(generateMockRooms());
      }
    } else {
      setRooms(generateMockRooms());
    }

    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }

    if (savedPowerUps) {
      try {
        setPowerUps(JSON.parse(savedPowerUps));
      } catch (error) {
        console.error('Error loading power-ups:', error);
        setPowerUps(generateMockPowerUps());
      }
    } else {
      setPowerUps(generateMockPowerUps());
    }

    setTournaments(generateMockTournaments());

    // Initialize WebSocket connection (mock for now)
    initializeWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('multiplayerRooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('multiplayerStats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('powerUps', JSON.stringify(powerUps));
  }, [powerUps]);

  // WebSocket connection (mock implementation)
  const initializeWebSocket = useCallback(() => {
    // Mock WebSocket connection
    setIsConnected(true);
    setConnectionQuality('excellent');

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (currentRoom && currentRoom.status === 'in_progress') {
        // Update game state
        setCurrentRoom(prev => {
          if (!prev) return null;
          return {
            ...prev,
            players: prev.players.map(player => ({
              ...player,
              status: Math.random() > 0.8 ? 'playing' : player.status
            }))
          };
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentRoom]);

  // Room management functions
  const createRoom = useCallback(async (name: string, settings: GameSettings): Promise<MultiplayerRoom> => {
    const newRoom: MultiplayerRoom = {
      id: `room_${Date.now()}`,
      name,
      hostId: 'current_user',
      hostName: 'Current User',
      hostAvatar: '👤',
      gameMode: settings.maxPlayers > 2 ? 'tournament' : 'versus',
      status: 'waiting',
      maxPlayers: settings.maxPlayers,
      currentPlayers: 1,
      players: [{
        userId: 'current_user',
        username: 'currentuser',
        displayName: 'Current User',
        avatar: '👤',
        level: 25,
        status: 'joined',
        score: 0,
        roundScores: [],
        attempts: 0,
        timeTaken: 0,
        isHost: true,
        isReady: false,
        stats: {
          winRate: 0.65,
          averageTime: 160,
          maxStreak: 8
        }
      }],
      settings,
      createdAt: new Date().toISOString(),
      roundTime: settings.timeLimit || 120
    };

    setRooms(prev => [newRoom, ...prev]);
    setCurrentRoom(newRoom);

    setSession({
      roomId: newRoom.id,
      playerId: 'current_user',
      isHost: true,
      isSpectator: false,
      permissions: {
        canStart: true,
        canKick: true,
        canChangeSettings: true,
        canInvite: true,
        canChat: true
      },
      connection: {
        status: 'connected',
        latency: 25,
        lastHeartbeat: new Date().toISOString()
      }
    });

    return newRoom;
  }, []);

  const joinRoom = useCallback(async (roomId: string): Promise<boolean> => {
    const room = rooms.find(r => r.id === roomId);
    if (!room || room.currentPlayers >= room.maxPlayers) {
      return false;
    }

    const updatedRoom = {
      ...room,
      currentPlayers: room.currentPlayers + 1,
      players: [...room.players, {
        userId: 'current_user',
        username: 'currentuser',
        displayName: 'Current User',
        avatar: '👤',
        level: 25,
        status: 'joined',
        score: 0,
        roundScores: [],
        attempts: 0,
        timeTaken: 0,
        isHost: false,
        isReady: false,
        stats: {
          winRate: 0.65,
          averageTime: 160,
          maxStreak: 8
        }
      }]
    };

    setRooms(prev => prev.map(r => r.id === roomId ? updatedRoom : r));
    setCurrentRoom(updatedRoom);

    setSession({
      roomId: updatedRoom.id,
      playerId: 'current_user',
      isHost: false,
      isSpectator: false,
      permissions: {
        canStart: false,
        canKick: false,
        canChangeSettings: false,
        canInvite: true,
        canChat: true
      },
      connection: {
        status: 'connected',
        latency: 30,
        lastHeartbeat: new Date().toISOString()
      }
    });

    return true;
  }, [rooms]);

  const leaveRoom = useCallback(async () => {
    if (!currentRoom) return;

    const updatedRoom = {
      ...currentRoom,
      currentPlayers: Math.max(0, currentRoom.currentPlayers - 1),
      players: currentRoom.players.filter(p => p.userId !== 'current_user')
    };

    if (updatedRoom.currentPlayers === 0) {
      setRooms(prev => prev.filter(r => r.id !== currentRoom.id));
    } else {
      setRooms(prev => prev.map(r => r.id === currentRoom.id ? updatedRoom : r));
    }

    setCurrentRoom(null);
    setCurrentGame(null);
    setSession(null);
  }, [currentRoom]);

  const startGame = useCallback(async (): Promise<boolean> => {
    if (!currentRoom || !session?.isHost) return false;

    const updatedRoom = {
      ...currentRoom,
      status: 'in_progress' as const,
      startedAt: new Date().toISOString(),
      currentRound: 1
    };

    setRooms(prev => prev.map(r => r.id === currentRoom.id ? updatedRoom : r));
    setCurrentRoom(updatedRoom);

    // Create game instance
    const newGame: MultiplayerGame = {
      id: `game_${Date.now()}`,
      roomId: currentRoom.id,
      roomName: currentRoom.name,
      players: updatedRoom.players.map(p => ({ ...p, status: 'playing' as const })),
      currentRound: 1,
      totalRounds: 5,
      targetWord: 'WORDS', // Mock target word
      gameState: 'playing',
      timeRemaining: currentRoom.settings.timeLimit || 120,
      roundStartTime: new Date().toISOString(),
      spectators: [],
      chatMessages: [],
      powerUps: [],
      events: [{
        id: 'event_1',
        type: 'game_started',
        timestamp: new Date().toISOString(),
        data: {}
      }]
    };

    setCurrentGame(newGame);
    return true;
  }, [currentRoom, session]);

  const submitAnswer = useCallback(async (word: string): Promise<boolean> => {
    if (!currentGame || !session) return false;

    // Update player's answer
    const updatedPlayers = currentGame.players.map(player =>
      player.userId === session.playerId
        ? {
            ...player,
            currentWord: word,
            attempts: player.attempts + 1,
            status: 'finished' as const,
            completedAt: new Date().toISOString(),
            score: word === currentGame.targetWord ? 1000 - (player.attempts * 100) : 0
          }
        : player
    );

    setCurrentGame(prev => prev ? { ...prev, players: updatedPlayers } : null);

    // Check if all players are finished
    if (updatedPlayers.every(p => p.status === 'finished')) {
      // End the round
      setCurrentGame(prev => prev ? {
        ...prev,
        gameState: 'finished',
        events: [...prev.events, {
          id: `event_${Date.now()}`,
          type: 'round_ended',
          timestamp: new Date().toISOString(),
          data: { round: currentGame.currentRound }
        }]
      } : null);
    }

    return true;
  }, [currentGame, session]);

  // Matchmaking
  const startMatchmaking = useCallback(async (preferences: Partial<GameSettings>): Promise<boolean> => {
    const request: MatchmakingRequest = {
      id: `match_${Date.now()}`,
      userId: 'current_user',
      gameMode: 'versus',
      difficulty: preferences.difficulty || 'medium',
      timeLimit: preferences.timeLimit || 120,
      maxPlayers: 2,
      private: false,
      skillLevel: 25,
      preferences: {
        allowSpectators: preferences.spectators || true,
        enablePowerUps: preferences.powerUps || false,
        enableHints: preferences.hints || false
      },
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      status: 'searching'
    };

    setMatchmakingRequest(request);

    // Simulate matchmaking (find a room after 3 seconds)
    setTimeout(() => {
      const availableRoom = rooms.find(r =>
        r.status === 'waiting' &&
        r.currentPlayers < r.maxPlayers &&
        r.settings.difficulty === request.difficulty
      );

      if (availableRoom) {
        setMatchmakingRequest(prev => prev ? { ...prev, status: 'found' } : null);
        // Auto-join the found room
        joinRoom(availableRoom.id);
      } else {
        setMatchmakingRequest(prev => prev ? { ...prev, status: 'expired' } : null);
      }
    }, 3000);

    return true;
  }, [rooms, joinRoom]);

  const cancelMatchmaking = useCallback(async () => {
    setMatchmakingRequest(null);
    return true;
  }, []);

  // Power-up management
  const usePowerUp = useCallback(async (powerUpId: string, targetUserId?: string): Promise<boolean> => {
    const powerUp = powerUps.find(p => p.id === powerUpId);
    if (!powerUp || powerUp.uses <= 0) return false;

    const updatedPowerUps = powerUps.map(p =>
      p.id === powerUpId ? { ...p, uses: p.uses - 1 } : p
    );
    setPowerUps(updatedPowerUps);

    // Add usage to game events if in game
    if (currentGame) {
      setCurrentGame(prev => prev ? {
        ...prev,
        events: [...prev.events, {
          id: `event_${Date.now()}`,
          type: 'power_up_used',
          timestamp: new Date().toISOString(),
          data: { powerUp: powerUp.name }
        }]
      } : null);
    }

    // Update stats
    setStats(prev => ({
      ...prev,
      powerUpsUsed: prev.powerUpsUsed + 1
    }));

    return true;
  }, [powerUps, currentGame]);

  // Chat functionality
  const sendMessage = useCallback(async (message: string): Promise<boolean> => {
    if (!currentRoom || !session) return false;

    const chatMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: session.playerId,
      username: 'currentuser',
      displayName: 'Current User',
      avatar: '👤',
      message,
      timestamp: new Date().toISOString(),
      type: 'normal'
    };

    if (currentGame) {
      setCurrentGame(prev => prev ? {
        ...prev,
        chatMessages: [...prev.chatMessages, chatMessage]
      } : null);
    }

    return true;
  }, [currentRoom, session, currentGame]);

  // Utility functions
  const refreshRooms = useCallback(async () => {
    // Simulate refresh with updated timestamps
    setRooms(prev => prev.map(room => ({
      ...room,
      players: room.players.map(player => ({
        ...player,
        status: Math.random() > 0.7 ? 'playing' : player.status
      }))
    })));
  }, []);

  const getPlayerRanking = useCallback((playerId: string): number => {
    if (!currentGame) return 0;
    const sortedPlayers = [...currentGame.players].sort((a, b) => b.score - a.score);
    return sortedPlayers.findIndex(p => p.userId === playerId) + 1;
  }, [currentGame]);

  // Computed values
  const availableRooms = useMemo(() =>
    rooms.filter(room => room.status === 'waiting' && room.currentPlayers < room.maxPlayers),
    [rooms]
  );

  const myStats = useMemo(() => stats, [stats]);

  const hasActiveGame = useMemo(() =>
    currentRoom?.status === 'in_progress' || currentGame?.gameState === 'playing',
    [currentRoom, currentGame]
  );

  const unreadNotifications = useMemo(() =>
    notifications.filter(n => !n.read),
    [notifications]
  );

  return {
    // Session state
    session,
    currentRoom,
    currentGame,
    isConnected,
    connectionQuality,

    // Room management
    rooms,
    availableRooms,
    tournaments,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    submitAnswer,

    // Matchmaking
    matchmakingRequest,
    startMatchmaking,
    cancelMatchmaking,

    // Power-ups
    powerUps,
    usePowerUp,

    // Chat
    sendMessage,

    // Stats and utilities
    stats: myStats,
    notifications,
    unreadNotifications,
    refreshRooms,
    getPlayerRanking,
    hasActiveGame
  };
};