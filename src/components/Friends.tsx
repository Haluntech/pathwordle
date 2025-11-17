import React, { useState, memo, useCallback } from 'react';
import { useFriends } from '../hooks/useFriends';
import {
  Friend,
  FriendRequest,
  FriendChallenge,
  FriendSearchResult,
  SocialSettings
} from '../types/friends';
import {
  Users,
  UserPlus,
  Search,
  Trophy,
  Gamepad2,
  Send,
  Clock,
  Check,
  X,
  MoreVertical,
  Settings,
  Bell,
  Shield,
  Gift,
  Target,
  Zap,
  Star,
  TrendingUp,
  Award,
  MessageCircle,
  UserX,
  UserCheck,
  Filter,
  RefreshCw
} from 'lucide-react';

interface FriendsProps {
  className?: string;
  compact?: boolean;
  showActions?: boolean;
}

// Memoized FriendCard component
const FriendCard: React.FC<{
  friend: Friend;
  onRemove: (id: string) => void;
  onChallenge: (id: string) => void;
  onMessage: (id: string) => void;
}> = memo(({ friend, onRemove, onChallenge, onMessage }) => {
  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? 'bg-green-500' : 'bg-gray-400';
  };

  const getActivityStatus = (friend: Friend) => {
    if (friend.currentGame) {
      return {
        text: `In ${friend.currentGame.mode} game`,
        color: 'text-blue-600',
        icon: <Gamepad2 className="w-4 h-4" />
      };
    }
    if (friend.isOnline) {
      return {
        text: 'Online',
        color: 'text-green-600',
        icon: <div className="w-2 h-2 bg-green-500 rounded-full" />
      };
    }
    const lastSeen = new Date(friend.lastActive);
    const now = new Date();
    const diffMins = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60));

    if (diffMins < 60) {
      return {
        text: `${diffMins}m ago`,
        color: 'text-gray-600',
        icon: <Clock className="w-4 h-4" />
      };
    }

    return {
      text: 'Offline',
      color: 'text-gray-500',
      icon: <div className="w-2 h-2 bg-gray-400 rounded-full" />
    };
  };

  const activity = getActivityStatus(friend);

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="text-2xl">{friend.avatar}</div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(friend.isOnline)}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-800 truncate">{friend.displayName}</span>
              <span className="text-sm text-gray-500">@{friend.username}</span>
              {friend.level >= 50 && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                  L{friend.level}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
              {activity.icon}
              <span className={activity.color}>{activity.text}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Trophy className="w-3 h-3 text-yellow-500" />
                <span>{friend.stats.gamesPlayed}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3 text-green-500" />
                <span>{Math.round(friend.stats.winRate * 100)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-orange-500" />
                <span>{friend.stats.currentStreak}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-purple-500" />
                <span>{friend.achievements.count}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onMessage(friend.id)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={`Send message to ${friend.displayName}`}
          >
            <MessageCircle className="w-4 h-4 text-gray-600" />
          </button>

          {friend.preferences.allowChallenges && friend.isOnline && (
            <button
              onClick={() => onChallenge(friend.id)}
              className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
              aria-label={`Challenge ${friend.displayName}`}
            >
              <Target className="w-4 h-4 text-blue-600" />
            </button>
          )}

          <button
            onClick={() => onRemove(friend.id)}
            className="p-2 rounded-lg hover:bg-red-100 transition-colors"
            aria-label={`Remove ${friend.displayName}`}
          >
            <UserX className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
});

FriendCard.displayName = 'FriendCard';

// Memoized FriendRequestCard component
const FriendRequestCard: React.FC<{
  request: FriendRequest;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}> = memo(({ request, onAccept, onDecline }) => {
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMins = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="text-2xl">{request.fromUser.avatar}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-800">{request.fromUser.displayName}</span>
              <span className="text-sm text-gray-500">@{request.fromUser.username}</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Level {request.fromUser.level}
              </span>
            </div>

            {request.message && (
              <p className="text-sm text-gray-600 mb-2 italic">"{request.message}"</p>
            )}

            <p className="text-xs text-gray-500">{formatTimeAgo(request.sentAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAccept(request.id)}
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            aria-label="Accept friend request"
          >
            <Check className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDecline(request.id)}
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            aria-label="Decline friend request"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

FriendRequestCard.displayName = 'FriendRequestCard';

// Memoized ChallengeCard component
const ChallengeCard: React.FC<{
  challenge: FriendChallenge;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}> = memo(({ challenge, onAccept, onDecline }) => {
  const getChallengeDescription = (type: FriendChallenge['type'], targetValue: number) => {
    switch (type) {
      case 'beat_my_score':
        return `Beat my score of ${targetValue} points`;
      case 'beat_my_time':
        return `Complete in under ${targetValue} seconds`;
      case 'perfect_game':
        return 'Get a perfect game (1 guess)';
      case 'streak_challenge':
        return `Beat my streak of ${targetValue} wins`;
      default:
        return `Challenge: ${targetValue}`;
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffMs <= 0) return 'Expired';
    if (diffHours > 0) return `${diffHours}h ${diffMins}m remaining`;
    return `${diffMins}m remaining`;
  };

  return (
    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-xl">{challenge.challengerAvatar}</div>
          <div>
            <span className="font-semibold text-gray-800">{challenge.challengerName}</span>
            <span className="text-sm text-gray-600 ml-2">challenges you!</span>
          </div>
        </div>

        <div className="text-sm text-yellow-700 font-medium">
          {getTimeRemaining(challenge.expiresAt)}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm font-medium text-gray-800 mb-1">
          {getChallengeDescription(challenge.type, challenge.targetValue)}
        </p>

        {challenge.stake && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>{challenge.stake.description}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onAccept(challenge.id)}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Accept Challenge
        </button>

        <button
          onClick={() => onDecline(challenge.id)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Decline
        </button>
      </div>
    </div>
  );
});

ChallengeCard.displayName = 'ChallengeCard';

const Friends: React.FC<FriendsProps> = ({ className = '', compact = false, showActions = true }) => {
  const {
    friends,
    pendingRequests,
    challenges,
    socialStats,
    isLoading,
    onlineFriends,
    friendsInGame,
    pendingChallenges,
    socialSettings,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    sendChallenge,
    acceptChallenge,
    declineChallenge,
    searchUsers,
    generateInviteCode,
    updateSocialSettings,
    refreshFriends
  } = useFriends();

  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'challenges' | 'search'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FriendSearchResult[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    const results = await searchUsers(searchQuery);
    setSearchResults(results);
  }, [searchQuery, searchUsers]);

  const handleGenerateInvite = useCallback(async () => {
    const response = await generateInviteCode();
    if (response.success && response.inviteCode) {
      setInviteCode(response.inviteCode);
    }
  }, [generateInviteCode]);

  const handleChallengeFriend = useCallback((friendId: string) => {
    // Default challenge: beat my score of 800
    sendChallenge(friendId, 'beat_my_score', 800, {
      type: 'bragging_rights',
      description: 'Winner gets bragging rights!'
    });
  }, [sendChallenge]);

  const handleMessage = useCallback((friendId: string) => {
    // Placeholder for messaging functionality
    console.log('Message friend:', friendId);
  }, []);

  const pendingRequestCount = pendingRequests.length;
  const pendingChallengeCount = pendingChallenges.length;

  return (
    <div className={`bg-white rounded-xl shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800">Friends & Social</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshFriends}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              aria-label="Refresh friends"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setShowInviteModal(true)}
              className="p-2 rounded-lg hover:bg-purple-100 transition-colors"
              aria-label="Invite friends"
            >
              <Gift className="w-5 h-5 text-purple-600" />
            </button>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Social settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600">Friends:</span>
            <span className="font-semibold text-gray-800">{socialStats.totalFriends}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-gray-600">Online:</span>
            <span className="font-semibold text-gray-800">{socialStats.onlineFriends}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-600">Challenges:</span>
            <span className="font-semibold text-gray-800">{socialStats.currentChallenges}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-purple-500" />
            <span className="text-gray-600">Wins:</span>
            <span className="font-semibold text-gray-800">{socialStats.challengesWon}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 px-4 py-3 font-medium transition-colors ${
            activeTab === 'friends'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Users className="w-4 h-4" />
            <span>Friends</span>
            {socialStats.totalFriends > 0 && (
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                {socialStats.totalFriends}
              </span>
            )}
          </div>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 px-4 py-3 font-medium transition-colors ${
            activeTab === 'requests'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" />
            <span>Requests</span>
            {pendingRequestCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {pendingRequestCount}
              </span>
            )}
          </div>
        </button>

        <button
          onClick={() => setActiveTab('challenges')}
          className={`flex-1 px-4 py-3 font-medium transition-colors ${
            activeTab === 'challenges'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>Challenges</span>
            {pendingChallengeCount > 0 && (
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                {pendingChallengeCount}
              </span>
            )}
          </div>
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 px-4 py-3 font-medium transition-colors ${
            activeTab === 'search'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            <span>Find Players</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
              <p className="text-gray-600">Loading friends...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Friends Tab */}
            {activeTab === 'friends' && (
              <div className="space-y-3">
                {friends.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No friends yet</p>
                    <button
                      onClick={() => setActiveTab('search')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Find Friends
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Online Friends */}
                    {onlineFriends.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Online Now</h3>
                        <div className="space-y-3">
                          {onlineFriends.map(friend => (
                            <FriendCard
                              key={friend.id}
                              friend={friend}
                              onRemove={removeFriend}
                              onChallenge={handleChallengeFriend}
                              onMessage={handleMessage}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Offline Friends */}
                    {friends.filter(f => !f.isOnline).length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Offline</h3>
                        <div className="space-y-3">
                          {friends.filter(f => !f.isOnline).map(friend => (
                            <FriendCard
                              key={friend.id}
                              friend={friend}
                              onRemove={removeFriend}
                              onChallenge={handleChallengeFriend}
                              onMessage={handleMessage}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
              <div className="space-y-3">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No pending friend requests</p>
                  </div>
                ) : (
                  pendingRequests.map(request => (
                    <FriendRequestCard
                      key={request.id}
                      request={request}
                      onAccept={acceptFriendRequest}
                      onDecline={declineFriendRequest}
                    />
                  ))
                )}
              </div>
            )}

            {/* Challenges Tab */}
            {activeTab === 'challenges' && (
              <div className="space-y-3">
                {pendingChallenges.length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No pending challenges</p>
                  </div>
                ) : (
                  pendingChallenges.map(challenge => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onAccept={acceptChallenge}
                      onDecline={declineChallenge}
                    />
                  ))
                )}
              </div>
            )}

            {/* Search Tab */}
            {activeTab === 'search' && (
              <div>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Search for players by username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={!searchQuery.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-3">
                    {searchResults.map(result => (
                      <div key={result.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{result.avatar}</div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-800">{result.displayName}</span>
                                <span className="text-sm text-gray-500">@{result.username}</span>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                  Level {result.level}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {result.mutualFriends} mutual friends • {result.stats.gamesPlayed} games • {Math.round(result.stats.winRate * 100)}% win rate
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => sendFriendRequest(result.username)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                          >
                            <UserPlus className="w-4 h-4 inline-block mr-2" />
                            Add Friend
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Invite Friends</h3>

            {inviteCode ? (
              <div className="text-center">
                <Gift className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Share this invite code with your friends!</p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                  <code className="text-lg font-bold text-purple-700">{inviteCode}</code>
                </div>
                <p className="text-sm text-gray-500 mb-4">You'll get 50 gems when they join!</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(inviteCode);
                      // TODO: Show success message
                    }}
                    className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Copy Code
                  </button>
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={handleGenerateInvite}
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                >
                  Generate Invite Code
                </button>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="ml-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Friends);