export interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  level: number;
  isOnline: boolean;
  lastActive: string;
  currentGame?: {
    mode: 'daily' | 'practice' | 'timed';
    startedAt: string;
    attempts: number;
  };
  stats: {
    gamesPlayed: number;
    winRate: number;
    currentStreak: number;
    maxStreak: number;
    averageTime: number;
  };
  friendship: {
    status: 'pending' | 'accepted' | 'blocked';
    requestedAt: string;
    acceptedAt?: string;
    isRequester: boolean; // true if current user sent the request
  };
  achievements: {
    count: number;
    recent: string[]; // achievement IDs
  };
  preferences: {
    allowChallenges: boolean;
    shareProgress: boolean;
    showOnlineStatus: boolean;
  };
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: {
    username: string;
    displayName: string;
    avatar: string;
    level: number;
  };
  message?: string;
  sentAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

export interface FriendChallenge {
  id: string;
  challengerId: string;
  challengerName: string;
  challengerAvatar: string;
  challengedId: string;
  challengedName: string;
  type: 'beat_my_score' | 'beat_my_time' | 'perfect_game' | 'streak_challenge';
  targetValue: number;
  timeframe: number; // hours until challenge expires
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'failed' | 'expired';
  result?: {
    challengerScore?: number;
    challengedScore?: number;
    winner: 'challenger' | 'challenged' | 'tie';
    completedAt: string;
  };
  stake?: {
    type: 'coins' | 'gems' | 'achievement' | 'bragging_rights';
    amount?: number;
    description: string;
  };
}

export interface FriendActivity {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  type: 'game_completed' | 'achievement_unlocked' | 'streak_milestone' | 'level_up' | 'challenge_completed';
  data: {
    gameMode?: string;
    result?: 'won' | 'lost';
    score?: number;
    time?: number;
    achievement?: string;
    streak?: number;
    level?: number;
    challengeId?: string;
    opponent?: string;
  };
  timestamp: string;
  isPublic: boolean;
}

export interface SocialStats {
  totalFriends: number;
  onlineFriends: number;
  pendingRequests: number;
  sentRequests: number;
  challengesWon: number;
  challengesLost: number;
  currentChallenges: number;
  completedChallenges: number;
  friendsActivityToday: number;
  weeklyChallengeWins: number;
  monthlyChallengeWins: number;
}

export interface FriendsListState {
  friends: Friend[];
  pendingRequests: FriendRequest[];
  sentRequests: FriendRequest[];
  blockedUsers: string[];
  challenges: FriendChallenge[];
  activities: FriendActivity[];
  socialStats: SocialStats;
  isLoading: boolean;
  lastUpdate: string;
}

export interface SocialSettings {
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    onlineStatus: boolean;
    gameActivity: boolean;
    achievements: boolean;
    statistics: boolean;
  };
  notifications: {
    friendRequests: boolean;
    challengeRequests: boolean;
    friendActivity: boolean;
    weeklyReports: boolean;
  };
  challenges: {
    autoAccept: boolean;
    allowFromAnyone: boolean;
    maxPerDay: number;
    preferredStake: 'none' | 'coins' | 'gems';
  };
}

export interface InviteResponse {
  success: boolean;
  inviteCode?: string;
  inviteUrl?: string;
  reward?: {
    type: 'coins' | 'gems' | 'premium_days';
    amount: number;
    when: 'on_invite' | 'on_acceptance';
  };
}

export interface FriendSearchResult {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  level: number;
  isFriend: boolean;
  isBlocked: boolean;
  canInvite: boolean;
  mutualFriends: number;
  lastActive: string;
  stats: {
    gamesPlayed: number;
    winRate: number;
  };
}