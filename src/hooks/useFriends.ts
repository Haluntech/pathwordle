import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Friend,
  FriendRequest,
  FriendChallenge,
  FriendActivity,
  SocialStats,
  FriendsListState,
  SocialSettings,
  InviteResponse,
  FriendSearchResult
} from '../types/friends';

// Mock data generator functions
const generateMockFriends = (): Friend[] => [
  {
    id: 'friend_1',
    username: 'wordmaster',
    displayName: 'Word Master',
    avatar: '🎯',
    level: 45,
    isOnline: true,
    lastActive: new Date().toISOString(),
    currentGame: {
      mode: 'daily',
      startedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      attempts: 2
    },
    stats: {
      gamesPlayed: 342,
      winRate: 0.78,
      currentStreak: 12,
      maxStreak: 28,
      averageTime: 145
    },
    friendship: {
      status: 'accepted',
      requestedAt: '2024-01-15T10:00:00Z',
      acceptedAt: '2024-01-15T10:30:00Z',
      isRequester: true
    },
    achievements: {
      count: 23,
      recent: ['speed_demon', 'perfectionist', 'streak_master']
    },
    preferences: {
      allowChallenges: true,
      shareProgress: true,
      showOnlineStatus: true
    }
  },
  {
    id: 'friend_2',
    username: 'puzzlegenius',
    displayName: 'Puzzle Genius',
    avatar: '🧩',
    level: 38,
    isOnline: false,
    lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    stats: {
      gamesPlayed: 256,
      winRate: 0.71,
      currentStreak: 5,
      maxStreak: 15,
      averageTime: 178
    },
    friendship: {
      status: 'accepted',
      requestedAt: '2024-01-20T14:00:00Z',
      acceptedAt: '2024-01-20T14:15:00Z',
      isRequester: false
    },
    achievements: {
      count: 18,
      recent: ['word_collector', 'daily_warrior']
    },
    preferences: {
      allowChallenges: true,
      shareProgress: true,
      showOnlineStatus: true
    }
  },
  {
    id: 'friend_3',
    username: 'nailswords',
    displayName: 'Nails Words',
    avatar: '💅',
    level: 52,
    isOnline: true,
    lastActive: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    currentGame: {
      mode: 'practice',
      startedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      attempts: 3
    },
    stats: {
      gamesPlayed: 489,
      winRate: 0.85,
      currentStreak: 23,
      maxStreak: 42,
      averageTime: 98
    },
    friendship: {
      status: 'accepted',
      requestedAt: '2024-01-10T09:00:00Z',
      acceptedAt: '2024-01-10T09:45:00Z',
      isRequester: false
    },
    achievements: {
      count: 31,
      recent: ['unstoppable', 'veteran', 'elite_player']
    },
    preferences: {
      allowChallenges: false,
      shareProgress: true,
      showOnlineStatus: false
    }
  }
];

const generateMockRequests = (): FriendRequest[] => [
  {
    id: 'req_1',
    fromUserId: 'user_456',
    toUserId: 'user_1',
    fromUser: {
      username: 'newbieplayer',
      displayName: 'Newbie Player',
      avatar: '🌟',
      level: 12
    },
    message: 'Hi! I love this game and want to learn from the best!',
    sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  }
];

const generateMockChallenges = (): FriendChallenge[] => [
  {
    id: 'challenge_1',
    challengerId: 'friend_1',
    challengerName: 'Word Master',
    challengerAvatar: '🎯',
    challengedId: 'user_1',
    challengedName: 'You',
    type: 'beat_my_score',
    targetValue: 850,
    timeframe: 24,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    stake: {
      type: 'bragging_rights',
      description: 'Winner gets bragging rights for a week!'
    }
  }
];

const generateMockActivities = (): FriendActivity[] => [
  {
    id: 'act_1',
    userId: 'friend_1',
    username: 'wordmaster',
    displayName: 'Word Master',
    avatar: '🎯',
    type: 'achievement_unlocked',
    data: {
      achievement: 'speed_demon',
      score: 950
    },
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    isPublic: true
  },
  {
    id: 'act_2',
    userId: 'friend_3',
    username: 'nailswords',
    displayName: 'Nails Words',
    avatar: '💅',
    type: 'game_completed',
    data: {
      gameMode: 'daily',
      result: 'won',
      score: 920,
      time: 87
    },
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isPublic: true
  }
];

export const useFriends = () => {
  const [state, setState] = useState<FriendsListState>({
    friends: [],
    pendingRequests: [],
    sentRequests: [],
    blockedUsers: [],
    challenges: [],
    activities: [],
    socialStats: {
      totalFriends: 0,
      onlineFriends: 0,
      pendingRequests: 0,
      sentRequests: 0,
      challengesWon: 0,
      challengesLost: 0,
      currentChallenges: 0,
      completedChallenges: 0,
      friendsActivityToday: 0,
      weeklyChallengeWins: 0,
      monthlyChallengeWins: 0
    },
    isLoading: false,
    lastUpdate: new Date().toISOString()
  });

  const [socialSettings, setSocialSettings] = useState<SocialSettings>({
    privacy: {
      profileVisibility: 'friends',
      onlineStatus: true,
      gameActivity: true,
      achievements: true,
      statistics: true
    },
    notifications: {
      friendRequests: true,
      challengeRequests: true,
      friendActivity: true,
      weeklyReports: false
    },
    challenges: {
      autoAccept: false,
      allowFromAnyone: false,
      maxPerDay: 5,
      preferredStake: 'none'
    }
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('friendsData');
    const savedSettings = localStorage.getItem('socialSettings');

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setState(prev => ({
          ...prev,
          ...parsedData,
          isLoading: false
        }));
      } catch (error) {
        console.error('Error loading friends data:', error);
        loadMockData();
      }
    } else {
      loadMockData();
    }

    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSocialSettings(parsedSettings);
      } catch (error) {
        console.error('Error loading social settings:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('friendsData', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem('socialSettings', JSON.stringify(socialSettings));
  }, [socialSettings]);

  const loadMockData = useCallback(() => {
    const friends = generateMockFriends();
    const pendingRequests = generateMockRequests();
    const challenges = generateMockChallenges();
    const activities = generateMockActivities();

    setState(prev => ({
      ...prev,
      friends,
      pendingRequests,
      challenges,
      activities,
      socialStats: calculateSocialStats(friends, pendingRequests, challenges, activities),
      isLoading: false,
      lastUpdate: new Date().toISOString()
    }));
  }, []);

  const calculateSocialStats = useCallback((
    friends: Friend[],
    pendingRequests: FriendRequest[],
    challenges: FriendChallenge[],
    activities: FriendActivity[]
  ): SocialStats => {
    const onlineFriends = friends.filter(f => f.isOnline).length;
    const activeToday = activities.filter(a =>
      new Date(a.timestamp).toDateString() === new Date().toDateString()
    ).length;

    return {
      totalFriends: friends.length,
      onlineFriends,
      pendingRequests: pendingRequests.length,
      sentRequests: 0,
      challengesWon: 12,
      challengesLost: 8,
      currentChallenges: challenges.filter(c => c.status === 'pending').length,
      completedChallenges: challenges.filter(c => ['completed', 'failed'].includes(c.status)).length,
      friendsActivityToday: activeToday,
      weeklyChallengeWins: 3,
      monthlyChallengeWins: 11
    };
  }, []);

  // Friend management functions
  const sendFriendRequest = useCallback(async (username: string, message?: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newRequest: FriendRequest = {
      id: `req_${Date.now()}`,
      fromUserId: 'user_1',
      toUserId: `user_${Date.now()}`,
      fromUser: {
        username: 'currentuser',
        displayName: 'Current User',
        avatar: '👤',
        level: 25
      },
      message,
      sentAt: new Date().toISOString(),
      status: 'pending'
    };

    setState(prev => ({
      ...prev,
      sentRequests: [...prev.sentRequests, newRequest],
      socialStats: {
        ...prev.socialStats,
        sentRequests: prev.sentRequests.length + 1
      },
      isLoading: false
    }));

    return true;
  }, []);

  const acceptFriendRequest = useCallback(async (requestId: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const request = state.pendingRequests.find(r => r.id === requestId);
    if (!request) return false;

    const newFriend: Friend = {
      id: request.fromUserId,
      username: request.fromUser.username,
      displayName: request.fromUser.displayName,
      avatar: request.fromUser.avatar,
      level: request.fromUser.level,
      isOnline: Math.random() > 0.5,
      lastActive: new Date().toISOString(),
      stats: {
        gamesPlayed: Math.floor(Math.random() * 200),
        winRate: Math.random() * 0.4 + 0.6,
        currentStreak: Math.floor(Math.random() * 10),
        maxStreak: Math.floor(Math.random() * 25),
        averageTime: Math.floor(Math.random() * 120) + 60
      },
      friendship: {
        status: 'accepted',
        requestedAt: request.sentAt,
        acceptedAt: new Date().toISOString(),
        isRequester: false
      },
      achievements: {
        count: Math.floor(Math.random() * 20),
        recent: []
      },
      preferences: {
        allowChallenges: true,
        shareProgress: true,
        showOnlineStatus: true
      }
    };

    setState(prev => ({
      ...prev,
      friends: [...prev.friends, newFriend],
      pendingRequests: prev.pendingRequests.filter(r => r.id !== requestId),
      socialStats: calculateSocialStats([...prev.friends, newFriend], prev.pendingRequests.filter(r => r.id !== requestId), prev.challenges, prev.activities),
      isLoading: false
    }));

    return true;
  }, [state.pendingRequests, calculateSocialStats]);

  const declineFriendRequest = useCallback(async (requestId: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    await new Promise(resolve => setTimeout(resolve, 500));

    setState(prev => ({
      ...prev,
      pendingRequests: prev.pendingRequests.filter(r => r.id !== requestId),
      socialStats: {
        ...prev.socialStats,
        pendingRequests: prev.pendingRequests.length - 1
      },
      isLoading: false
    }));

    return true;
  }, []);

  const removeFriend = useCallback(async (friendId: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    await new Promise(resolve => setTimeout(resolve, 600));

    setState(prev => {
      const newFriends = prev.friends.filter(f => f.id !== friendId);
      return {
        ...prev,
        friends: newFriends,
        socialStats: calculateSocialStats(newFriends, prev.pendingRequests, prev.challenges, prev.activities),
        isLoading: false
      };
    });

    return true;
  }, [calculateSocialStats]);

  const blockUser = useCallback(async (userId: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    await new Promise(resolve => setTimeout(resolve, 400));

    setState(prev => ({
      ...prev,
      friends: prev.friends.filter(f => f.id !== userId),
      blockedUsers: [...prev.blockedUsers, userId],
      isLoading: false
    }));

    return true;
  }, []);

  // Challenge functions
  const sendChallenge = useCallback(async (friendId: string, type: FriendChallenge['type'], targetValue: number, stake?: FriendChallenge['stake']) => {
    setState(prev => ({ ...prev, isLoading: true }));

    await new Promise(resolve => setTimeout(resolve, 1000));

    const friend = state.friends.find(f => f.id === friendId);
    if (!friend) return false;

    const newChallenge: FriendChallenge = {
      id: `challenge_${Date.now()}`,
      challengerId: 'user_1',
      challengerName: 'Current User',
      challengerAvatar: '👤',
      challengedId: friendId,
      challengedName: friend.displayName,
      type,
      targetValue,
      timeframe: 24,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      stake
    };

    setState(prev => ({
      ...prev,
      challenges: [...prev.challenges, newChallenge],
      socialStats: {
        ...prev.socialStats,
        currentChallenges: prev.challenges.filter(c => c.status === 'pending').length + 1
      },
      isLoading: false
    }));

    return true;
  }, [state.friends]);

  const acceptChallenge = useCallback(async (challengeId: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    await new Promise(resolve => setTimeout(resolve, 800));

    setState(prev => ({
      ...prev,
      challenges: prev.challenges.map(c =>
        c.id === challengeId ? { ...c, status: 'accepted' as const } : c
      ),
      isLoading: false
    }));

    return true;
  }, []);

  const declineChallenge = useCallback(async (challengeId: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    await new Promise(resolve => setTimeout(resolve, 500));

    setState(prev => {
      const newChallenges = prev.challenges.map(c =>
        c.id === challengeId ? { ...c, status: 'declined' as const } : c
      );
      return {
        ...prev,
        challenges: newChallenges,
        socialStats: {
          ...prev.socialStats,
          currentChallenges: newChallenges.filter(c => c.status === 'pending').length
        },
        isLoading: false
      };
    });

    return true;
  }, []);

  // Search functions
  const searchUsers = useCallback(async (query: string): Promise<FriendSearchResult[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock search results
    const mockResults: FriendSearchResult[] = [
      {
        id: 'search_1',
        username: 'wordwizard',
        displayName: 'Word Wizard',
        avatar: '🧙‍♂️',
        level: 67,
        isFriend: false,
        isBlocked: false,
        canInvite: true,
        mutualFriends: 3,
        lastActive: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        stats: {
          gamesPlayed: 892,
          winRate: 0.91
        }
      },
      {
        id: 'search_2',
        username: 'paddlexpert',
        displayName: 'Paddle Expert',
        avatar: '🏓',
        level: 41,
        isFriend: false,
        isBlocked: false,
        canInvite: true,
        mutualFriends: 1,
        lastActive: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        stats: {
          gamesPlayed: 412,
          winRate: 0.74
        }
      }
    ];

    return mockResults.filter(result =>
      result.username.toLowerCase().includes(query.toLowerCase()) ||
      result.displayName.toLowerCase().includes(query.toLowerCase())
    );
  }, []);

  // Invite functions
  const generateInviteCode = useCallback(async (): Promise<InviteResponse> => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    const url = `https://pathwordle.com/invite/${code}`;

    return {
      success: true,
      inviteCode: code,
      inviteUrl: url,
      reward: {
        type: 'gems',
        amount: 50,
        when: 'on_acceptance'
      }
    };
  }, []);

  // Update social settings
  const updateSocialSettings = useCallback((newSettings: Partial<SocialSettings>) => {
    setSocialSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Refresh data
  const refreshFriends = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate data refresh
    setState(prev => ({
      ...prev,
      friends: prev.friends.map(friend => ({
        ...friend,
        isOnline: Math.random() > 0.3,
        lastActive: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString()
      })),
      lastUpdate: new Date().toISOString(),
      isLoading: false
    }));
  }, []);

  // Computed values
  const onlineFriends = useMemo(() =>
    state.friends.filter(f => f.isOnline), [state.friends]
  );

  const friendsInGame = useMemo(() =>
    state.friends.filter(f => f.currentGame), [state.friends]
  );

  const pendingChallenges = useMemo(() =>
    state.challenges.filter(c => c.status === 'pending' && c.challengedId === 'user_1'), [state.challenges]
  );

  const recentActivities = useMemo(() =>
    state.activities.slice(0, 10), [state.activities]
  );

  return {
    ...state,
    socialSettings,
    onlineFriends,
    friendsInGame,
    pendingChallenges,
    recentActivities,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    blockUser,
    sendChallenge,
    acceptChallenge,
    declineChallenge,
    searchUsers,
    generateInviteCode,
    updateSocialSettings,
    refreshFriends
  };
};