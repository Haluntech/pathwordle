export interface MultiplayerRoom {
  id: string;
  name: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  gameMode: 'versus' | 'cooperative' | 'tournament';
  status: 'waiting' | 'starting' | 'in_progress' | 'finished';
  maxPlayers: number;
  currentPlayers: number;
  players: MultiplayerPlayer[];
  settings: GameSettings;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  roundTime: number; // seconds per round
  currentRound?: number;
  totalRounds?: number;
}

export interface MultiplayerPlayer {
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  level: number;
  status: 'joined' | 'ready' | 'playing' | 'finished' | 'disconnected';
  score: number;
  roundScores: number[];
  currentWord?: string;
  attempts: number;
  timeTaken: number;
  completedAt?: string;
  rank?: number;
  isHost: boolean;
  isReady: boolean;
  stats: {
    winRate: number;
    averageTime: number;
    maxStreak: number;
  };
}

export interface GameSettings {
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  timeLimit: number; // seconds per word, 0 = no limit
  maxAttempts: number;
  powerUps: boolean;
  hints: boolean;
  spectators: boolean;
  private: boolean;
  password?: string;
  customWords?: string[];
}

export interface MultiplayerGame {
  id: string;
  roomId: string;
  roomName: string;
  players: MultiplayerPlayer[];
  currentRound: number;
  totalRounds: number;
  targetWord: string;
  gameState: 'waiting' | 'playing' | 'finished';
  timeRemaining: number;
  roundStartTime: string;
  spectators: Spectator[];
  chatMessages: ChatMessage[];
  powerUps: PowerUp[];
  events: GameEvent[];
}

export interface Spectator {
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  joinedAt: string;
  canChat: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  message: string;
  timestamp: string;
  type: 'normal' | 'system' | 'achievement' | 'round_end';
  isHost?: boolean;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  type: 'reveal_letter' | 'extra_time' | 'skip_attempt' | 'hint' | 'freeze_time' | 'double_points';
  cost: number;
  duration?: number;
  uses: number;
  maxUses: number;
}

export interface GameEvent {
  id: string;
  type: 'player_joined' | 'player_left' | 'game_started' | 'round_started' | 'player_finished' | 'round_ended' | 'game_finished' | 'power_up_used' | 'achievement_unlocked';
  timestamp: string;
  data: {
    playerId?: string;
    playerName?: string;
    round?: number;
    word?: string;
    score?: number;
    time?: number;
    powerUp?: string;
    achievement?: string;
  };
}

export interface MatchmakingRequest {
  id: string;
  userId: string;
  gameMode: 'versus' | 'cooperative' | 'tournament';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  timeLimit: number;
  maxPlayers: number;
  private: boolean;
  skillLevel: number;
  preferences: {
    allowSpectators: boolean;
    enablePowerUps: boolean;
    enableHints: boolean;
  };
  createdAt: string;
  expiresAt: string;
  status: 'searching' | 'found' | 'accepted' | 'declined' | 'expired';
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  type: 'elimination' | 'round_robin' | 'swiss' | 'leaderboard';
  status: 'registration' | 'in_progress' | 'finished';
  maxParticipants: number;
  currentParticipants: number;
  entryFee: number;
  prizePool: number;
  rewards: TournamentReward[];
  settings: GameSettings;
  schedule: TournamentRound[];
  leaderboard: TournamentLeaderboard[];
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
}

export interface TournamentRound {
  roundNumber: number;
  name: string;
  status: 'upcoming' | 'in_progress' | 'finished';
  startTime: string;
  endTime: string;
  matches: TournamentMatch[];
  advancedPlayers: string[];
  eliminatedPlayers: string[];
}

export interface TournamentMatch {
  id: string;
  round: number;
  player1: string;
  player2: string;
  winner?: string;
  score?: {
    player1: number;
    player2: number;
  };
  status: 'upcoming' | 'in_progress' | 'finished';
  startTime?: string;
  endTime?: string;
}

export interface TournamentReward {
  rank: number;
  type: 'coins' | 'gems' | 'premium' | 'title' | 'badge' | 'avatar';
  amount: number;
  description: string;
  icon?: string;
}

export interface TournamentLeaderboard {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  score: number;
  wins: number;
  losses: number;
  eliminated: boolean;
  eliminatedRound?: number;
}

export interface MultiplayerStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  averageScore: number;
  bestScore: number;
  averagePlacement: number;
  tournamentsWon: number;
  tournamentsPlayed: number;
  currentStreak: number;
  maxStreak: number;
  favoriteMode: 'versus' | 'cooperative' | 'tournament';
  achievements: string[];
  powerUpsUsed: number;
  totalPlayTime: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  score: number;
  gamesPlayed: number;
  winRate: number;
  streak: number;
  country?: string;
  status: 'online' | 'offline' | 'playing';
  lastActive: string;
}

export interface RoomListFilters {
  gameMode?: 'versus' | 'cooperative' | 'tournament' | 'all';
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert' | 'all';
  status?: 'waiting' | 'in_progress' | 'all';
  maxPlayers?: number;
  hasPassword?: boolean;
  friendsOnly?: boolean;
}

export interface MultiplayerNotification {
  id: string;
  type: 'game_invite' | 'game_starting' | 'tournament_announcement' | 'achievement_unlocked' | 'friend_request' | 'rank_change';
  title: string;
  message: string;
  fromUser?: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  data?: any;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: string;
  style: 'primary' | 'secondary' | 'danger';
}

export interface MultiplayerSession {
  roomId: string;
  playerId: string;
  isHost: boolean;
  isSpectator: boolean;
  permissions: {
    canStart: boolean;
    canKick: boolean;
    canChangeSettings: boolean;
    canInvite: boolean;
    canChat: boolean;
  };
  connection: {
    status: 'connected' | 'connecting' | 'disconnected' | 'reconnecting';
    latency: number;
    lastHeartbeat: string;
  };
}