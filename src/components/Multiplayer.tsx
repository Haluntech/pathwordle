import React, { useState, useCallback, memo, useMemo, useRef, useEffect } from 'react';
import { useMultiplayer } from '../hooks/useMultiplayer';
import {
  GameSettings,
  MultiplayerRoom,
  MultiplayerGame,
  Tournament,
  PowerUp,
  ChatMessage
} from '../types/multiplayer';
import {
  Users,
  Plus,
  Search,
  Trophy,
  Gamepad2,
  Clock,
  Settings,
  Play,
  X,
  Send,
  MessageCircle,
  Zap,
  Shield,
  Crown,
  Star,
  Target,
  Timer,
  Eye,
  Lock,
  RefreshCw,
  UserCheck,
  UserX,
  Award,
  TrendingUp,
  Swords,
  ShieldCheck,
  Heart,
  Coins,
  Gem
} from 'lucide-react';

interface MultiplayerProps {
  className?: string;
  onQuickMatch?: () => void;
  onCreateRoom?: () => void;
}

// Memoized RoomCard component
const RoomCard: React.FC<{
  room: MultiplayerRoom;
  onJoin: (roomId: string) => void;
  isJoining?: boolean;
}> = memo(({ room, onJoin, isJoining = false }) => {
  const getStatusColor = (status: MultiplayerRoom['status']) => {
    switch (status) {
      case 'waiting': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'finished': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: GameSettings['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'hard': return 'text-orange-600 bg-orange-100';
      case 'expert': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m`;
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-800">{room.name}</h3>
            {room.settings.private && <Lock className="w-4 h-4 text-gray-500" />}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
              {room.status}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{room.currentPlayers}/{room.maxPlayers}</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{formatTime(room.settings.timeLimit)}</span>
            </div>

            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(room.settings.difficulty)}`}>
              {room.settings.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-lg">{room.hostAvatar}</div>
            <span className="text-sm text-gray-600">Host: {room.hostName}</span>
            <Crown className="w-4 h-4 text-yellow-500" />
          </div>

          {room.gameMode === 'versus' && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <Swords className="w-4 h-4" />
              <span>Versus Mode</span>
            </div>
          )}
        </div>

        <button
          onClick={() => onJoin(room.id)}
          disabled={isJoining || room.currentPlayers >= room.maxPlayers || room.status !== 'waiting'}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
        >
          {isJoining ? 'Joining...' : 'Join'}
        </button>
      </div>

      {/* Players preview */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        {room.players.slice(0, 4).map((player, index) => (
          <div
            key={player.userId}
            className="flex items-center gap-1 text-xs bg-gray-50 px-2 py-1 rounded"
            title={player.displayName}
          >
            <span>{player.avatar}</span>
            <span className="text-gray-700">{player.displayName}</span>
            {player.isReady && <UserCheck className="w-3 h-3 text-green-500" />}
          </div>
        ))}
        {room.players.length > 4 && (
          <span className="text-xs text-gray-500">+{room.players.length - 4} more</span>
        )}
      </div>

      {/* Room features */}
      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
        {room.settings.spectators && (
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>Spectators</span>
          </div>
        )}
        {room.settings.powerUps && (
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span>Power-ups</span>
          </div>
        )}
        {room.settings.hints && (
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            <span>Hints</span>
          </div>
        )}
      </div>
    </div>
  );
});

RoomCard.displayName = 'RoomCard';

// Memoized TournamentCard component
const TournamentCard: React.FC<{
  tournament: Tournament;
  onJoin?: () => void;
}> = memo(({ tournament, onJoin }) => {
  const getTimeRemaining = (startDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const diffMs = start.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffMs <= 0) return 'Started';
    if (diffDays > 0) return `${diffDays} days`;
    if (diffHours > 0) return `${diffHours} hours`;
    return 'Starting soon';
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-800">{tournament.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              tournament.status === 'registration' ? 'text-green-600 bg-green-100' :
              tournament.status === 'in_progress' ? 'text-blue-600 bg-blue-100' :
              'text-gray-600 bg-gray-100'
            }`}>
              {tournament.status}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-3">{tournament.description}</p>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-700">
                {tournament.currentParticipants}/{tournament.maxParticipants}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-700">{getTimeRemaining(tournament.startDate)}</span>
            </div>

            {tournament.entryFee > 0 && (
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-gray-700">{tournament.entryFee} entry</span>
              </div>
            )}

            {tournament.prizePool > 0 && (
              <div className="flex items-center gap-2">
                <Gem className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">{tournament.prizePool} prize</span>
              </div>
            )}
          </div>

          {/* Prize preview */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-gray-700">Prizes:</span>
            {tournament.rewards.slice(0, 3).map((reward, index) => (
              <div
                key={index}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  reward.type === 'gems' ? 'text-blue-600 bg-blue-100' :
                  reward.type === 'premium' ? 'text-purple-600 bg-purple-100' :
                  'text-gray-600 bg-gray-100'
                }`}
              >
                {index + 1}st: {reward.description}
              </div>
            ))}
          </div>
        </div>

        {tournament.status === 'registration' && onJoin && (
          <button
            onClick={onJoin}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
          >
            Join
          </button>
        )}
      </div>
    </div>
  );
});

TournamentCard.displayName = 'TournamentCard';

// Memoized PowerUpCard component
const PowerUpCard: React.FC<{
  powerUp: PowerUp;
  onUse: (powerUpId: string) => void;
  disabled?: boolean;
}> = memo(({ powerUp, onUse, disabled = false }) => {
  const getRarityColor = (rarity: PowerUp['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityTextColor = (rarity: PowerUp['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-700';
      case 'rare': return 'text-blue-700';
      case 'epic': return 'text-purple-700';
      case 'legendary': return 'text-yellow-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className={`border-2 rounded-lg p-3 ${getRarityColor(powerUp.rarity)} ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md transition-all cursor-pointer'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{powerUp.icon}</span>
          <h4 className={`font-semibold ${getRarityTextColor(powerUp.rarity)}`}>
            {powerUp.name}
          </h4>
        </div>

        <div className="flex items-center gap-1">
          <Coins className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-gray-700">{powerUp.cost}</span>
        </div>
      </div>

      <p className="text-xs text-gray-600 mb-3">{powerUp.description}</p>

      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${getRarityTextColor(powerUp.rarity)} uppercase`}>
          {powerUp.rarity}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">
            {powerUp.uses}/{powerUp.maxUses}
          </span>

          <button
            onClick={() => onUse(powerUp.id)}
            disabled={disabled || powerUp.uses <= 0}
            className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Use
          </button>
        </div>
      </div>
    </div>
  );
});

PowerUpCard.displayName = 'PowerUpCard';

// Memoized GameChat component
const GameChat: React.FC<{
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}> = memo(({ messages, onSendMessage, disabled = false }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = useCallback(() => {
    if (newMessage.trim() && !disabled) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  }, [newMessage, onSendMessage, disabled]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Game Chat
        </h4>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-4">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex gap-2 items-start">
              <span className="text-lg">{message.avatar}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-gray-800">{message.displayName}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 break-words">{message.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {!disabled && (
        <div className="p-3 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              maxLength={200}
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

GameChat.displayName = 'GameChat';

const Multiplayer: React.FC<MultiplayerProps> = ({ className = '', onQuickMatch, onCreateRoom }) => {
  const {
    session,
    currentRoom,
    currentGame,
    rooms,
    availableRooms,
    tournaments,
    matchmakingRequest,
    powerUps,
    isConnected,
    connectionQuality,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    submitAnswer,
    startMatchmaking,
    cancelMatchmaking,
    usePowerUp,
    sendMessage,
    refreshRooms,
    hasActiveGame
  } = useMultiplayer();

  const [activeTab, setActiveTab] = useState<'browse' | 'tournaments' | 'create' | 'game'>('browse');
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [newRoomSettings, setNewRoomSettings] = useState<GameSettings>({
    difficulty: 'medium',
    timeLimit: 120,
    maxAttempts: 6,
    powerUps: false,
    hints: false,
    spectators: true,
    private: false
  });
  const [newRoomName, setNewRoomName] = useState('');

  // Auto-switch to game tab when in a game
  useEffect(() => {
    if (currentRoom || currentGame) {
      setActiveTab('game');
    }
  }, [currentRoom, currentGame]);

  // Create room handler
  const handleCreateRoom = useCallback(async () => {
    if (!newRoomName.trim()) return;

    const room = await createRoom(newRoomName, newRoomSettings);
    if (room) {
      setShowCreateRoomModal(false);
      setNewRoomName('');
      setActiveTab('game');
    }
  }, [newRoomName, newRoomSettings, createRoom]);

  // Quick match handler
  const handleQuickMatch = useCallback(async () => {
    await startMatchmaking({
      difficulty: 'medium',
      timeLimit: 120,
      maxPlayers: 2,
      spectators: true,
      powerUps: false,
      hints: false
    });
  }, [startMatchmaking]);

  // Format connection quality
  const getConnectionQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800">Multiplayer Battles</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Connection Status */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getConnectionQualityColor(connectionQuality)}`}>
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>

            <button
              onClick={refreshRooms}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Refresh rooms"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleQuickMatch}
            disabled={matchmakingRequest?.status === 'searching'}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="w-5 h-5" />
            {matchmakingRequest?.status === 'searching' ? 'Finding Match...' : 'Quick Match'}
          </button>

          <button
            onClick={() => setShowCreateRoomModal(true)}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Room
          </button>

          <button
            onClick={onQuickMatch}
            className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Trophy className="w-5 h-5" />
            Tournaments
          </button>
        </div>

        {/* Matchmaking Status */}
        {matchmakingRequest && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600 animate-spin" />
                <span className="text-sm font-medium text-blue-800">
                  {matchmakingRequest.status === 'searching' && 'Searching for opponents...'}
                  {matchmakingRequest.status === 'found' && 'Match found! Joining...'}
                  {matchmakingRequest.status === 'expired' && 'Search expired. Try again.'}
                </span>
              </div>

              {matchmakingRequest.status === 'searching' && (
                <button
                  onClick={cancelMatchmaking}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('browse')}
          className={`flex-1 px-4 py-3 font-medium transition-colors ${
            activeTab === 'browse'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            <span>Browse Rooms</span>
            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
              {availableRooms.length}
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('tournaments')}
          className={`flex-1 px-4 py-3 font-medium transition-colors ${
            activeTab === 'tournaments'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>Tournaments</span>
          </div>
        </button>

        {hasActiveGame && (
          <button
            onClick={() => setActiveTab('game')}
            className={`flex-1 px-4 py-3 font-medium transition-colors ${
              activeTab === 'game'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              <span>Current Game</span>
            </div>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6 max-h-96 overflow-y-auto">
        {/* Browse Rooms Tab */}
        {activeTab === 'browse' && (
          <div className="space-y-3">
            {availableRooms.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No available rooms</p>
                <button
                  onClick={handleQuickMatch}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Start Quick Match
                </button>
              </div>
            ) : (
              availableRooms.map(room => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onJoin={joinRoom}
                />
              ))
            )}
          </div>
        )}

        {/* Tournaments Tab */}
        {activeTab === 'tournaments' && (
          <div className="space-y-3">
            {tournaments.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No active tournaments</p>
              </div>
            ) : (
              tournaments.map(tournament => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                />
              ))
            )}
          </div>
        )}

        {/* Game Tab */}
        {activeTab === 'game' && currentRoom && (
          <div className="space-y-4">
            {/* Room Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{currentRoom.name}</h3>
                  <p className="text-sm text-gray-600">
                    {currentRoom.gameMode === 'versus' ? 'Versus' : 'Cooperative'} • {currentRoom.settings.difficulty}
                  </p>
                </div>

                <button
                  onClick={leaveRoom}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  Leave
                </button>
              </div>

              {/* Players */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Players ({currentRoom.currentPlayers}/{currentRoom.maxPlayers})</h4>
                {currentRoom.players.map(player => (
                  <div key={player.userId} className="flex items-center justify-between bg-white rounded p-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{player.avatar}</span>
                      <span className="font-medium">{player.displayName}</span>
                      {player.isHost && <Crown className="w-4 h-4 text-yellow-500" />}
                      {player.isReady && <UserCheck className="w-4 h-4 text-green-500" />}
                    </div>

                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      player.status === 'playing' ? 'text-blue-600 bg-blue-100' :
                      player.status === 'finished' ? 'text-green-600 bg-green-100' :
                      'text-gray-600 bg-gray-100'
                    }`}>
                      {player.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Start Game Button (Host only) */}
              {session?.isHost && currentRoom.status === 'waiting' && (
                <button
                  onClick={startGame}
                  disabled={currentRoom.players.some(p => !p.isReady && p.userId !== session.playerId)}
                  className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Start Game
                </button>
              )}
            </div>

            {/* Power-ups */}
            {currentRoom.settings.powerUps && (
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Power-ups</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {powerUps.slice(0, 3).map(powerUp => (
                    <PowerUpCard
                      key={powerUp.id}
                      powerUp={powerUp}
                      onUse={usePowerUp}
                      disabled={currentRoom.status !== 'in_progress'}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Game Area */}
            {currentGame && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-blue-800">Round {currentGame.currentRound}/{currentGame.totalRounds}</h4>
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-blue-600" />
                    <span className="font-mono text-blue-800">
                      {Math.ceil(currentGame.timeRemaining / 60)}:{(currentGame.timeRemaining % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Game implementation would go here */}
                <div className="text-center py-8 bg-white rounded">
                  <p className="text-gray-600">Game in progress...</p>
                  {/* This would integrate with the main game component */}
                </div>
              </div>
            )}

            {/* Chat */}
            <div className="h-64">
              <GameChat
                messages={currentGame?.chatMessages || []}
                onSendMessage={sendMessage}
                disabled={currentRoom.status === 'waiting'}
              />
            </div>
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Create Room</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Enter room name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={30}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Game Mode</label>
                <select
                  value={newRoomSettings.maxPlayers}
                  onChange={(e) => setNewRoomSettings(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={2}>Versus (1v1)</option>
                  <option value={4}>Versus (2v2)</option>
                  <option value={8}>Tournament</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  value={newRoomSettings.difficulty}
                  onChange={(e) => setNewRoomSettings(prev => ({ ...prev, difficulty: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit</label>
                <select
                  value={newRoomSettings.timeLimit}
                  onChange={(e) => setNewRoomSettings(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={60}>1 minute</option>
                  <option value={120}>2 minutes</option>
                  <option value={180}>3 minutes</option>
                  <option value={0}>No limit</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRoomSettings.powerUps}
                    onChange={(e) => setNewRoomSettings(prev => ({ ...prev, powerUps: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Power-ups</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRoomSettings.hints}
                    onChange={(e) => setNewRoomSettings(prev => ({ ...prev, hints: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Hints</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRoomSettings.spectators}
                    onChange={(e) => setNewRoomSettings(prev => ({ ...prev, spectators: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Spectators</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRoomSettings.private}
                    onChange={(e) => setNewRoomSettings(prev => ({ ...prev, private: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Private</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateRoomModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateRoom}
                disabled={!newRoomName.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Multiplayer);