import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useTimeChallenge } from '../hooks/useTimeChallenge';
import { useSpeedLeaderboard } from '../hooks/useSpeedLeaderboard';
import {
  Clock,
  Play,
  Pause,
  Square,
  Trophy,
  Zap,
  Target,
  Timer,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  Award,
  Users,
  TrendingUp,
  Flag,
  RefreshCw,
  Settings,
  BarChart3,
  Lightbulb,
  Calendar,
  Activity
} from 'lucide-react';
import { TimeChallenge, TimeChallengeSession, TIMER_STATES } from '../types/timeChallenge';

interface TimeChallengeModeProps {
  playerId: string;
  onBack?: () => void;
  compact?: boolean;
}

interface ChallengeCardProps {
  challenge: TimeChallenge;
  onStart: (challenge: TimeChallenge) => void;
  isLocked?: boolean;
  playerStats?: any;
}

const ChallengeCard: React.FC<ChallengeCardProps> = memo(({ challenge, onStart, isLocked, playerStats }) => {
  const timeUntilEnd = useMemo(() => {
    if (!challenge.endTime) return null;
    const end = new Date(challenge.endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h left`;
    }

    return `${hours}h ${minutes}m left`;
  }, [challenge.endTime]);

  const difficultyColor = useMemo(() => {
    switch (challenge.difficulty) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'hard': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'expert': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }, [challenge.difficulty]);

  const categoryIcon = useMemo(() => {
    switch (challenge.category) {
      case 'daily': return <Flag className="w-4 h-4" />;
      case 'weekly': return <Calendar className="w-4 h-4" />;
      case 'special': return <Star className="w-4 h-4" />;
      case 'practice': return <Target className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  }, [challenge.category]);

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all duration-300 hover:shadow-xl ${
      isLocked ? 'border-gray-200 opacity-75' : difficultyColor
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isLocked ? 'bg-gray-100' : difficultyColor.split(' ')[1]}`}>
            {categoryIcon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{challenge.name}</h3>
            <p className="text-sm text-gray-600">{challenge.description}</p>
          </div>
        </div>

        <div className="text-right">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${difficultyColor}`}>
            {challenge.difficulty.toUpperCase()}
          </span>
          {challenge.category === 'daily' && timeUntilEnd && (
            <p className="text-xs text-gray-500 mt-1">{timeUntilEnd}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Time Limit</p>
          <p className="font-semibold">{Math.floor(challenge.timeLimit / 60)}:{(challenge.timeLimit % 60).toString().padStart(2, '0')}</p>
        </div>
        <div className="text-center">
          <Users className="w-5 h-5 text-purple-500 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Players</p>
          <p className="font-semibold">{challenge.participantCount.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <Award className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Rewards</p>
          <p className="font-semibold">{challenge.rewards.length}</p>
        </div>
      </div>

      {challenge.requirements && challenge.requirements.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-medium text-gray-700 mb-2">Requirements:</p>
          <ul className="space-y-1">
            {challenge.requirements.map((req, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                {req.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {challenge.rewards.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Rewards:</p>
          <div className="flex flex-wrap gap-2">
            {challenge.rewards.slice(0, 3).map((reward, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  reward.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                  reward.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                  reward.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}
              >
                {reward.type === 'points' && `${reward.value} pts`}
                {reward.type === 'badge' && '🏆'}
                {reward.type === 'theme' && '🎨'}
                {reward.type === 'title' && '👑'}
              </span>
            ))}
            {challenge.rewards.length > 3 && (
              <span className="text-xs text-gray-500">+{challenge.rewards.length - 3} more</span>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => !isLocked && onStart(challenge)}
        disabled={isLocked || !challenge.isActive}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
          isLocked || !challenge.isActive
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500'
        }`}
      >
        {isLocked ? (
          <>
            <XCircle className="w-4 h-4" />
            Locked
          </>
        ) : !challenge.isActive ? (
          <>
            <Clock className="w-4 h-4" />
            Not Available
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Start Challenge
          </>
        )}
      </button>
    </div>
  );
});

ChallengeCard.displayName = 'ChallengeCard';

const TimerDisplay: React.FC<{
  timeRemaining: number;
  totalTime: number;
  timerState: string;
  style?: 'digital' | 'analog' | 'minimal';
  className?: string;
}> = memo(({ timeRemaining, totalTime, timerState, style = 'digital', className = '' }) => {
  const percentage = (timeRemaining / totalTime) * 100;
  const isWarning = timerState === TIMER_STATES.WARNING;
  const isExpired = timerState === TIMER_STATES.EXPIRED;

  const timeColor = useMemo(() => {
    if (isExpired) return 'text-red-600';
    if (isWarning) return 'text-orange-600';
    if (percentage <= 25) return 'text-yellow-600';
    return 'text-green-600';
  }, [isWarning, isExpired, percentage]);

  const bgColor = useMemo(() => {
    if (isExpired) return 'bg-red-100';
    if (isWarning) return 'bg-orange-100';
    if (percentage <= 25) return 'bg-yellow-100';
    return 'bg-green-100';
  }, [isWarning, isExpired, percentage]);

  if (style === 'minimal') {
    return (
      <div className={`text-center ${className}`}>
        <div className={`text-3xl font-bold ${timeColor} tabular-nums`}>
          {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Timer className={`w-5 h-5 ${timeColor}`} />
          <h3 className="font-semibold text-gray-900">Time Remaining</h3>
        </div>
        {isWarning && (
          <div className="flex items-center gap-1 text-orange-600">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">Hurry up!</span>
          </div>
        )}
      </div>

      {/* Progress Ring */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
            className={`${timeColor} transition-all duration-1000 ease-linear`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${timeColor} tabular-nums`}>
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>

      {/* Warning indicator */}
      {isWarning && (
        <div className={`${bgColor} rounded-lg p-3 text-center animate-pulse`}>
          <p className="text-sm font-medium text-orange-800">
            Less than 30 seconds remaining!
          </p>
        </div>
      )}
    </div>
  );
});

TimerDisplay.displayName = 'TimerDisplay';

const TimeChallengeMode: React.FC<TimeChallengeModeProps> = ({ playerId, onBack, compact = false }) => {
  const [selectedView, setSelectedView] = useState<'list' | 'session' | 'results' | 'leaderboard'>('list');
  const [selectedChallenge, setSelectedChallenge] = useState<TimeChallenge | null>(null);

  const timeChallenge = useTimeChallenge({
    playerId,
    challengeId: selectedChallenge?.id,
    settings: {
      soundEnabled: true,
      countdownStyle: 'digital',
      warningTime: 30
    }
  });

  const speedLeaderboard = useSpeedLeaderboard({
    playerId,
    playerName: 'Player',
    country: 'US',
    challengeType: selectedChallenge?.category,
    autoRefresh: true
  });

  const handleStartChallenge = useCallback((challenge: TimeChallenge) => {
    setSelectedChallenge(challenge);
    timeChallenge.startChallenge(challenge);
    setSelectedView('session');
  }, [timeChallenge]);

  const handleBackToChallengeList = useCallback(() => {
    setSelectedView('list');
    setSelectedChallenge(null);
  }, []);

  const handlePauseResume = useCallback(() => {
    if (timeChallenge.isPaused) {
      timeChallenge.resumeTimer();
    } else {
      timeChallenge.pauseTimer();
    }
  }, [timeChallenge.isPaused, timeChallenge]);

  const handleEndChallenge = useCallback(() => {
    timeChallenge.endChallenge(false);
    setSelectedView('results');
  }, [timeChallenge]);

  const renderChallengeList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Time Challenges</h2>
          <p className="text-gray-600">Test your speed and accuracy against the clock!</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedView('leaderboard')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-md"
          >
            <Activity className="w-5 h-5" />
            Speed Leaderboard
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Back
          </button>
        </div>
      </div>

      {timeChallenge.challengeStats && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{timeChallenge.challengeStats.completedChallenges}</p>
              <p className="text-xs text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <Zap className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{timeChallenge.challengeStats.bestTime}s</p>
              <p className="text-xs text-gray-600">Best Time</p>
            </div>
            <div className="text-center">
              <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{timeChallenge.challengeStats.currentStreak}</p>
              <p className="text-xs text-gray-600">Current Streak</p>
            </div>
            <div className="text-center">
              <Star className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{timeChallenge.challengeStats.totalPoints}</p>
              <p className="text-xs text-gray-600">Total Points</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {timeChallenge.availableChallenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onStart={handleStartChallenge}
            playerStats={timeChallenge.challengeStats}
          />
        ))}
      </div>
    </div>
  );

  const renderActiveSession = () => {
    if (!timeChallenge.currentChallenge || !timeChallenge.session) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{timeChallenge.currentChallenge.name}</h2>
            <p className="text-gray-600">{timeChallenge.currentChallenge.description}</p>
          </div>
          <button
            onClick={handleBackToChallengeList}
            className="px-4 py-2 text-red-600 hover:text-red-800 transition-colors"
          >
            Exit Challenge
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timer Display */}
          <div className="lg:col-span-1">
            <TimerDisplay
              timeRemaining={timeChallenge.timeRemaining}
              totalTime={timeChallenge.currentChallenge.timeLimit}
              timerState={timeChallenge.timerState}
              style="digital"
            />
          </div>

          {/* Game Stats */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Challenge Progress</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <Target className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {timeChallenge.session?.wordsFound.length || 0}
                  </p>
                  <p className="text-xs text-gray-600">Words Found</p>
                </div>
                <div className="text-center">
                  <Lightbulb className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {timeChallenge.session?.hintsUsed || 0}
                  </p>
                  <p className="text-xs text-gray-600">Hints Used</p>
                </div>
                <div className="text-center">
                  <Star className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {timeChallenge.session?.score || 0}
                  </p>
                  <p className="text-xs text-gray-600">Current Score</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(timeChallenge.progressPercentage)}%
                  </p>
                  <p className="text-xs text-gray-600">Progress</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Challenge Progress</span>
                  <span className="text-sm text-gray-500">
                    {timeChallenge.session?.wordsFound.length || 0} / {timeChallenge.currentChallenge.wordPool.length} words
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${timeChallenge.progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Control Buttons */}
              {timeChallenge.timerState === TIMER_STATES.READY && (
                <button
                  onClick={timeChallenge.beginChallenge}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Start Challenge
                </button>
              )}

              {timeChallenge.canPause && (
                <div className="flex gap-3">
                  <button
                    onClick={handlePauseResume}
                    className="flex-1 bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Pause className="w-5 h-5" />
                    Pause
                  </button>
                  <button
                    onClick={handleEndChallenge}
                    className="flex-1 bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Square className="w-5 h-5" />
                    End Challenge
                  </button>
                </div>
              )}

              {timeChallenge.canResume && (
                <button
                  onClick={handlePauseResume}
                  className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Resume Challenge
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Game Board would be integrated here */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-center text-gray-600">
            🎮 Game board integration goes here - connect with existing PathWordle grid component
          </p>
        </div>
      </div>
    );
  };

  const renderResults = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {timeChallenge.session?.completed ? '🎉 Challenge Completed!' : '⏰ Time\'s Up!'}
        </h2>
        <p className="text-gray-600">
          {timeChallenge.session?.completed
            ? 'Congratulations! You completed the challenge!'
            : 'Better luck next time! Keep practicing to improve your speed.'}
        </p>
      </div>

      {timeChallenge.session && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Your Results</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900">{timeChallenge.session.score}</p>
              <p className="text-sm text-gray-600">Final Score</p>
            </div>
            <div className="text-center">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900">{timeChallenge.session.timeSpent}s</p>
              <p className="text-sm text-gray-600">Time Taken</p>
            </div>
            <div className="text-center">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900">{timeChallenge.session.wordsFound.length}</p>
              <p className="text-sm text-gray-600">Words Found</p>
            </div>
            <div className="text-center">
              <Lightbulb className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900">{timeChallenge.session.hintsUsed}</p>
              <p className="text-sm text-gray-600">Hints Used</p>
            </div>
          </div>

          {timeChallenge.session.rewards.length > 0 && (
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">Rewards Earned</h4>
              <div className="flex flex-wrap justify-center gap-3">
                {timeChallenge.session.rewards.map((reward, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                      reward.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                      reward.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                      reward.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {reward.type === 'points' && `+${reward.value} Points`}
                    {reward.type === 'badge' && '🏆 New Badge'}
                    {reward.type === 'theme' && '🎨 New Theme'}
                    {reward.type === 'title' && '👑 New Title'}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleBackToChallengeList}
              className="flex-1 bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Challenges
            </button>
            <button
              onClick={() => {
                // Restart challenge logic
                if (selectedChallenge) {
                  handleStartChallenge(selectedChallenge);
                }
              }}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderLeaderboardView = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Speed Leaderboard</h1>
            <p className="text-gray-600">Compete with players worldwide in time-based challenges!</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedView('list')}
              className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all flex items-center gap-2"
            >
              <Clock className="w-5 h-5" />
              Back to Challenges
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Back
              </button>
            )}
          </div>
        </div>

        {/* Player Stats Card */}
        {speedLeaderboard.playerStats && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Your Performance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold">#{speedLeaderboard.playerGlobalRank || '--'}</div>
                <div className="text-sm opacity-90">Global Rank</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{speedLeaderboard.playerStats.bestTime}s</div>
                <div className="text-sm opacity-90">Best Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{speedLeaderboard.playerStats.totalScore.toLocaleString()}</div>
                <div className="text-sm opacity-90">Total Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{speedLeaderboard.playerStats.currentStreak}</div>
                <div className="text-sm opacity-90">Current Streak</div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Global Speed Rankings
              </h3>
              <div className="text-sm text-gray-500">
                {speedLeaderboard.totalPlayers?.toLocaleString() || 0} participants
              </div>
            </div>

            {speedLeaderboard.selectedLeaderboard ? (
              <div className="space-y-2">
                {speedLeaderboard.selectedLeaderboard.entries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-200 hover:shadow-md ${
                      entry.playerId === playerId ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50'
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-200">
                      <span className="text-lg font-bold">{index + 1}</span>
                    </div>

                    {/* Player Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{entry.avatar}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            {entry.playerName}
                            {entry.playerId === playerId && (
                              <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">YOU</span>
                            )}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Flag className="w-3 h-3" />
                              {entry.country}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="font-mono font-semibold">{entry.time}s</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Target className="w-4 h-4" />
                          <span>{entry.accuracy}%</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Star className="w-4 h-4" />
                          <span>{entry.score.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading leaderboard...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (compact) {
    return (
      <div className="p-4">
        <TimerDisplay
          timeRemaining={timeChallenge.timeRemaining}
          totalTime={timeChallenge.currentChallenge?.timeLimit || 180}
          timerState={timeChallenge.timerState}
          style="minimal"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      {selectedView === 'list' && renderChallengeList()}
      {selectedView === 'session' && renderActiveSession()}
      {selectedView === 'results' && renderResults()}
      {selectedView === 'leaderboard' && renderLeaderboardView()}
    </div>
  );
};

export default memo(TimeChallengeMode);