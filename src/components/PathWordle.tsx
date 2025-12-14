import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import pathwordleLogo from '../assets/pathwordle_logo.png';
import { usePathWordle } from '../hooks/usePathWordle';
import { useStatistics } from '../hooks/useStatistics';
// import { useLearningAnalytics } from '../hooks/useLearningAnalytics';
import Grid from './Grid';
import GuessHistory from './GuessHistory';
import GameControls from './GameControls';
import GameResult from './GameResult';
import Statistics from './Statistics';
// import LearningDashboard from './LearningDashboard';
import TimeChallengeModeSimple from './TimeChallengeModeSimple';
import ThemedPuzzleModeSimple from './ThemedPuzzleModeSimple';
import ComingSoonBadge from './ComingSoonBadge';
import AchievementNotification, { useAchievementNotifications } from './AchievementNotification';
import HintPanel from './HintPanel';
// import Leaderboard from './Leaderboard';
import Friends from './Friends';
import Multiplayer from './Multiplayer';
import ThemeSelector from './ThemeSelector';
import PuzzleCreator from './PuzzleCreator';
import NotificationSettings from './NotificationSettings';
import ABTestingAdmin from './ABTestingAdmin';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import ContactPage from './ContactPage';
import { pathToWord } from '../utils/gameLogic';
import ContentQualityPanel from './ContentQualityPanel';
import { BarChart3, Trophy, Lightbulb, Globe, Users, Swords, Palette, Brain, Clock, BookOpen, Plus, Bell, FlaskConical } from 'lucide-react';

interface PathWordleProps {
  gameMode?: 'daily' | 'practice';
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
}

// Memoized error boundary component
const ErrorBoundary = memo(({ error, onReset }: { error: string | null; onReset: () => void }) => {
  if (!error) return null;

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4" role="alert">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Game</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Try Again
        </button>
      </div>
    </div>
  );
});

ErrorBoundary.displayName = 'ErrorBoundary';

// Memoized GameHeader component
const GameHeader = memo(({ gameMode }: { gameMode: 'daily' | 'practice' }) => (
  <header className="text-center mb-8 flex flex-col items-center">
    <div className="flex items-center mb-2">
      <img
        src={pathwordleLogo}
        alt="PathWordle Logo"
        className="w-16 h-16 mr-4"
        loading="lazy"
      />
      <h1 className="text-4xl font-bold text-gray-800">
        PathWordle {gameMode === 'practice' && <span className="text-lg text-blue-600">(Practice)</span>}
      </h1>
    </div>
    <p className="text-gray-600 max-w-2xl mx-auto">
      Connect adjacent letters to form paths and guess the hidden 5-letter word.
      Use the Wordle-style feedback to guide your next guess!
    </p>
  </header>
));

GameHeader.displayName = 'GameHeader';

// Memoized HowToPlay component
const HowToPlay = memo(() => (
  <div className="mt-12 max-w-4xl mx-auto bg-white rounded-xl p-6 shadow-lg">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">How to Play</h2>
    <div className="grid md:grid-cols-2 gap-6 text-gray-600">
      <div>
        <h3 className="font-medium text-gray-800 mb-2">Creating Paths</h3>
        <ul className="space-y-1 text-sm">
          <li>• Click letters to create a path of exactly 5 letters</li>
          <li>• Letters must be adjacent (horizontal, vertical, or diagonal)</li>
          <li>• Each letter can only be used once per path</li>
          <li>• Click the last letter in your path to remove it</li>
        </ul>
      </div>
      <div>
        <h3 className="font-medium text-gray-800 mb-2">Feedback Colors</h3>
        <ul className="space-y-1 text-sm">
          <li>• <span className="inline-block w-3 h-3 bg-green-500 rounded mr-2" aria-hidden="true"></span>Green: Correct letter in correct position</li>
          <li>• <span className="inline-block w-3 h-3 bg-yellow-500 rounded mr-2" aria-hidden="true"></span>Yellow: Correct letter in wrong position</li>
          <li>• <span className="inline-block w-3 h-3 bg-gray-400 rounded mr-2" aria-hidden="true"></span>Gray: Letter not in target word</li>
        </ul>
      </div>
    </div>
  </div>
));

HowToPlay.displayName = 'HowToPlay';

// Memoized CurrentPathDisplay component
const CurrentPathDisplay = memo(({
  currentWord,
  onClear,
  onSubmit,
  canSubmit,
  pathLength
}: {
  currentWord: string;
  onClear: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  pathLength: number;
}) => {
  if (currentWord) {
    return (
      <div className="bg-white rounded-lg px-4 py-2 shadow-md">
        <div className="text-sm text-gray-500 mb-1 text-center">Current Path:</div>
        <div
          className="text-xl font-bold text-gray-800 tracking-widest text-center mb-3"
          role="status"
          aria-live="polite"
          aria-label={`Current path: ${currentWord.split('').join(' ')}`}
        >
          {currentWord}
        </div>

        {/* Mobile-optimized buttons positioned around current path */}
        <div className="lg:hidden flex items-center justify-between gap-2 mt-2">
          <button
            onClick={onClear}
            disabled={pathLength === 0}
            className="
              flex items-center gap-1 px-3 py-1.5 rounded-md text-sm
              bg-red-500 hover:bg-red-600 disabled:bg-gray-300
              text-white font-medium transition-colors duration-200
              disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500
            "
            aria-label="Clear current path"
          >
            Clear
          </button>

          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className="
              flex items-center gap-1 px-3 py-1.5 rounded-md text-sm
              bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300
              text-white font-medium transition-colors duration-200
              disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500
            "
            aria-label="Submit guess"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:hidden bg-white rounded-lg px-4 py-2 shadow-md">
      <div className="text-sm text-gray-500 mb-1 text-center">Select letters to create a path</div>
      <div className="flex items-center justify-between gap-2 mt-2">
        <button
          onClick={onClear}
          disabled={pathLength === 0}
          className="
            flex items-center gap-1 px-3 py-1.5 rounded-md text-sm
            bg-red-500 hover:bg-red-600 disabled:bg-gray-300
            text-white font-medium transition-colors duration-200
            disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500
          "
          aria-label="Clear current path"
        >
          Clear
        </button>

        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="
            flex items-center gap-1 px-3 py-1.5 rounded-md text-sm
            bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300
            text-white font-medium transition-colors duration-200
            disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500
          "
          aria-label="Submit guess"
        >
          Submit
        </button>
      </div>
    </div>
  );
});

CurrentPathDisplay.displayName = 'CurrentPathDisplay';

const PathWordle: React.FC<PathWordleProps> = ({ gameMode = 'daily', difficulty = 'medium' }) => {
  // ALL HOOKS MUST BE DECLARED BEFORE ANY CONDITIONAL RETURNS
  const { gameState, selectCell, submitGuess, clearPath, resetGame, canSubmit, useNextLetterHint } = usePathWordle(gameMode);
  const { recordGame, shareResult, getNextAchievement, clearNewAchievements, statistics } = useStatistics();
  // Temporarily disabled learning analytics to fix crashes
  // const {
  //   startSession,
  //   endSession,
  //   recordGuess,
  //   recordLearningEvent,
  //   getAnalytics,
  //   getRecommendations,
  //   getSessionHistory
  // } = useLearningAnalytics({
  //   trackingEnabled: true,
  //   dataRetentionDays: 90
  // });

  // Mock functions to avoid crashes
  const startSession = (config: any) => 'mock_session';
  const endSession = (sessionId: string, result: any) => {};
  const recordGuess = (sessionId: string, guess: any) => {};
  const recordLearningEvent = (sessionId: string, event: any) => {};
  const getAnalytics = () => ({ sessions: [], performance: {} });
  const getRecommendations = () => [];
  const getSessionHistory = () => [];
  const { AchievementNotificationComponent } = useAchievementNotifications();
  const [showContentQuality, setShowContentQuality] = useState(false);

  // State hooks - all at the top
  const [error, setError] = useState<string | null>(null);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showMultiplayer, setShowMultiplayer] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showLearningDashboard, setShowLearningDashboard] = useState(false);
  const [showTimeChallenge, setShowTimeChallenge] = useState(false);
  const [showThemedPuzzles, setShowThemedPuzzles] = useState(false);
  const [showPuzzleCreator, setShowPuzzleCreator] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showABTesting, setShowABTesting] = useState(false);
  const [currentView, setCurrentView] = useState<'game' | 'timeChallenge' | 'themedPuzzles'>('game');

  // Optimized UI state - reduce unnecessary re-renders
  const [uiState, setUIState] = useState({
    showStatistics: false,
    showHints: false,
    showLeaderboard: false,
    showFriends: false,
    showMultiplayer: false,
    showThemeSelector: false,
    showLearningDashboard: false,
    showTimeChallenge: false,
    showThemedPuzzles: false,
    showPuzzleCreator: false,
    showNotificationSettings: false,
    showABTesting: false,
    currentView: 'game'
  });
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now());
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [guessCount, setGuessCount] = useState(0);
  const [currentAchievement, setCurrentAchievement] = useState(null);

  // Memoize current word calculation
  const currentWord = useMemo(() => {
    return gameState?.currentPath ? pathToWord(gameState.currentPath) : '';
  }, [gameState?.currentPath]);

  // Memoize callbacks to prevent unnecessary re-renders and add debouncing
  const handleCellClick = useCallback((row: number, col: number) => {
    // Prevent rapid clicking and add haptic feedback
    selectCell(row, col);

    // Add visual feedback
    if (gameState?.grid[row][col]?.isSelected) {
      // Optional: Add a small animation or haptic feedback
    }
  }, [selectCell, gameState]);

  const handleSubmit = useCallback(() => {
    submitGuess();
  }, [submitGuess]);

  const handleClear = useCallback(() => {
    clearPath();
  }, [clearPath, gameState?.currentPath.length > 0]);

  const handleReset = useCallback(() => {
    resetGame();
    setError(null);
    setGameStartTime(Date.now());
  }, [resetGame]);

  // Record learning events
  const recordLearningEvents = useCallback(() => {
    if (!currentSessionId || !gameState) return;

    // Record pattern recognition events
    if (guessCount > 0 && guessCount % 3 === 0) {
      recordLearningEvent(currentSessionId, {
        type: 'pattern_recognized',
        data: {
          pattern: 'letter_positioning',
          skillArea: 'PATTERN_RECOGNITION',
          confidence: Math.min(0.5 + (guessCount * 0.1), 1.0),
          details: 'Player showing improvement in letter positioning'
        }
      });
    }

    // Record skill improvements on good performance
    if (gameState.gameStatus === 'won' && gameState.attemptsLeft >= 3) {
      recordLearningEvent(currentSessionId, {
        type: 'skill_improvement',
        data: {
          skillArea: 'PROBLEM_SOLVING',
          previousSkill: 0.6,
          newSkill: 0.7,
          details: 'Excellent performance with efficient word solving'
        }
      });
    }
  }, [currentSessionId, gameState, guessCount, recordLearningEvent]);

  // Handle game completion
  useEffect(() => {
    if (gameState && (gameState.gameStatus === 'won' || gameState.gameStatus === 'lost')) {
      const timeTaken = Math.round((Date.now() - gameStartTime) / 1000); // Convert to seconds

      // Calculate score
      let score = 0;
      if (gameState.gameStatus === 'won') {
        score = Math.max(1000 - (gameState.attemptsLeft * 200) - timeTaken, 100);
      }

      // Record game result
      recordGame({
        won: gameState.gameStatus === 'won',
        attemptsUsed: 6 - gameState.attemptsLeft,
        timeTaken,
        targetWord: gameState.targetWord,
        mode: gameMode,
        difficulty: difficulty,
        hintsUsed: gameState.hintUsed ? 1 : 0,
        score
      });

      // Record learning events for game completion
      recordLearningEvents();

      // End the learning analytics session
      if (currentSessionId && (gameState.gameStatus === 'won' || gameState.gameStatus === 'lost')) {
        endSession(currentSessionId, {
          gameOutcome: gameState.gameStatus,
          finalScore: score,
          timeSpent: timeTaken,
          efficiency: score > 0 ? score / timeTaken : 0,
          skillGains: {
            vocabulary: gameState.gameStatus === 'won' ? 0.1 : 0.05,
            pattern_recognition: 0.08,
            logical_reasoning: gameState.gameStatus === 'won' ? 0.12 : 0.06
          }
        });
      }
    }
  }, [gameState?.gameStatus, gameState?.targetWord, gameState?.attemptsLeft, gameMode, difficulty, gameStartTime, recordGame, recordLearningEvents, currentSessionId, endSession]);

  // Initialize learning analytics session
  useEffect(() => {
    const sessionId = startSession({
      gameMode,
      difficulty
    });
    setCurrentSessionId(sessionId);
    setGameStartTime(Date.now());
    setGuessCount(0);

    return () => {
      if (sessionId) {
        // Provide a default result for cleanup - this is called when component unmounts
        endSession(sessionId, {
          gameOutcome: 'lost', // Default to lost when component unmounts
          finalScore: 0,
          timeSpent: Math.round((Date.now() - gameStartTime) / 1000),
          efficiency: 0
        });
      }
    };
  }, [gameMode, difficulty, startSession, endSession]);

  // Track guess submissions for learning analytics
  useEffect(() => {
    if (gameState && gameState.guesses.length > guessCount && currentSessionId) {
      const newGuesses = gameState.guesses.slice(guessCount);
      newGuesses.forEach(guess => {
        recordGuess(currentSessionId, {
          word: guess.word,
          feedback: guess.feedback,
          timeTaken: 0, // Could be tracked with timestamps
          hintsUsed: 0,
          accuracy: guess.feedback.filter(f => f.status === 'correct').length / 5
        });
      });
      setGuessCount(gameState.guesses.length);
    }
  }, [gameState?.guesses.length, guessCount, currentSessionId, recordGuess]);

  // Listen for new achievement unlocks
  useEffect(() => {
    const nextAchievement = getNextAchievement();
    if (nextAchievement && nextAchievement !== currentAchievement) {
      setCurrentAchievement(nextAchievement);
      // Show achievement notification
      setTimeout(() => {
        clearNewAchievements();
        setCurrentAchievement(null);
      }, 5000);
    }
  }, [statistics, getNextAchievement, clearNewAchievements, currentAchievement]);

  useEffect(() => {
    if (__DEV__) {
      console.log('PathWordle component mounted with gameState:', gameState);
    }
    if (!gameState) {
      setError('Failed to initialize game state');
    } else if (!gameState.grid || gameState.grid.length === 0) {
      setError('Game grid not initialized');
    }
  }, [gameState]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not focused on input elements
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Prevent default for our shortcuts
      switch (event.key.toLowerCase()) {
        case 'enter':
          if (canSubmit && currentWord) {
            event.preventDefault();
            handleSubmit();
          }
          break;
        case 'escape':
        case 'c':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleClear();
          }
          break;
        case 'r':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleReset();
          }
          break;
        case 'h':
          // Help - focus on first available cell
          event.preventDefault();
          const firstAvailableCell = document.querySelector('[aria-disabled="false"]') as HTMLButtonElement;
          firstAvailableCell?.focus();
          break;
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [canSubmit, currentWord, handleSubmit, handleClear, handleReset]);

  // Show error state if there's an error
  if (error) {
    return <ErrorBoundary error={error} onReset={handleReset} />;
  }

  // Show different views based on currentView
  if (currentView === 'timeChallenge') {
    return (
      <TimeChallengeModeSimple
        playerId="player_123" // In real app, this would come from auth context
        onBack={() => {
          setCurrentView('game');
          setShowTimeChallenge(false);
        }}
      />
    );
  }

  if (currentView === 'themedPuzzles') {
    return (
      <ThemedPuzzleModeSimple
        playerId="player_123" // In real app, this would come from auth context
        onBack={() => {
          setCurrentView('game');
          setShowThemedPuzzles(false);
        }}
      />
    );
  }

  // Show puzzle creator
  if (showPuzzleCreator) {
    return (
      <PuzzleCreator
        creatorId="creator_123" // In real app, this would come from auth context
        creatorName="Player" // In real app, this would come from user profile
        onClose={() => setShowPuzzleCreator(false)}
      />
    );
  }

  // Show loading state if game state is not ready
  if (!gameState || !gameState.grid || gameState.grid.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  // Memoize main game content to prevent unnecessary re-renders
  const mainContent = useMemo(() => {
    // Add content quality improvement
    const contentQualityButton = (
      <button
        onClick={() => setShowContentQuality(!showContentQuality)}
        className="fixed bottom-4 left-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Content quality and learning tips"
        title="Improve your gameplay with advanced strategies and vocabulary"
      >
        <BookOpen className="w-4 h-4" />
      </button>
    );

    return (
      <div id="main-content" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8" tabIndex={-1}>
        <div className="max-w-6xl mx-auto px-4">
          {/* Header with Stats and Hints Buttons */}
          <div className="flex items-center justify-between mb-8">
            <GameHeader gameMode={gameMode} />
            <div className="flex items-center gap-2 flex-wrap">
              {/* Enhanced Hints button with SEO and quality improvement */}
              <button
                onClick={() => setShowHints(!showHints)}
                className="bg-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label={showHints ? 'Hide hints and word tips' : 'Show hints and word tips'}
                aria-expanded={showHints}
                title={showHints ? 'Hide word solving assistance' : 'Get help with word patterns, definitions, and learning tips'}
                role="button"
                itemProp="description"
                data-feature="word-assistance"
              >
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <span className="hidden sm:inline font-medium">Word Tips</span>
              </button>
            <button
              onClick={() => setShowStatistics(!showStatistics)}
              className="bg-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={showStatistics ? 'Hide your game statistics and achievements' : 'Show your game statistics and achievements'}
              aria-expanded={showStatistics}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Statistics</span>
              <Trophy className="w-4 h-4 text-yellow-500" />
            </button>
            {gameMode === 'daily' && (
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="bg-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label={showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
                aria-expanded={showLeaderboard}
              >
                <Globe className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Leaderboard</span>
              </button>
            )}

            <button
              onClick={() => setShowFriends(!showFriends)}
              className="bg-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label={showFriends ? 'Hide Friends' : 'Show Friends'}
              aria-expanded={showFriends}
            >
              <Users className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Friends</span>
            </button>

            <button
              onClick={() => setShowMultiplayer(!showMultiplayer)}
              className="bg-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={showMultiplayer ? 'Hide Multiplayer' : 'Show Multiplayer'}
              aria-expanded={showMultiplayer}
            >
              <Swords className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Battle</span>
            </button>

            <button
              onClick={() => setShowThemeSelector(!showThemeSelector)}
              className="bg-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label={showThemeSelector ? 'Hide Themes' : 'Show Themes'}
              aria-expanded={showThemeSelector}
            >
              <Palette className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Themes</span>
            </button>

            <button
              onClick={() => setShowLearningDashboard(!showLearningDashboard)}
              className="bg-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={showLearningDashboard ? 'Hide Learning Analytics' : 'Show Learning Analytics'}
              aria-expanded={showLearningDashboard}
            >
              <Brain className="w-5 h-5 text-indigo-600" />
              <span className="hidden sm:inline font-medium">Learning</span>
            </button>

            <button
              onClick={() => {
                setShowTimeChallenge(!showTimeChallenge);
                setCurrentView(showTimeChallenge ? 'game' : 'timeChallenge');
              }}
              className="bg-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label={showTimeChallenge ? 'Hide Time Challenge (Premium)' : 'Show Time Challenge (Premium)'}
              title="Time Challenge Mode - Premium Feature Coming Soon"
              aria-expanded={showTimeChallenge}
            >
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="hidden sm:inline font-medium">Time Challenge</span>
              <ComingSoonBadge
                feature="Time Challenge"
                icon={<Clock className="w-5 h-5 text-orange-600" />}
                size="sm"
              />
            </button>

            <button
              onClick={() => {
                setShowThemedPuzzles(!showThemedPuzzles);
                setCurrentView(showThemedPuzzles ? 'game' : 'themedPuzzles');
              }}
              className="bg-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label={showThemedPuzzles ? 'Hide Themed Puzzles' : 'Show Themed Puzzles'}
              aria-expanded={showThemedPuzzles}
            >
              <div className="relative">
                <BookOpen className="w-5 h-5 text-green-600" />
                <span className="hidden sm:inline font-medium">Themed Puzzles</span>
                <ComingSoonBadge
                  feature="Themed Puzzles"
                  icon={<BookOpen className="w-4 h-4 text-green-600" />}
                  size="sm"
                />
              </div>
            </button>
            <button
              onClick={() => setShowPuzzleCreator(!showPuzzleCreator)}
              className="bg-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label={showPuzzleCreator ? 'Hide Puzzle Editor' : 'Show Puzzle Editor (Premium)'}
              title="Puzzle Editor - Premium Feature Coming Soon"
              data-feature="puzzle-creator"
              aria-expanded={showPuzzleCreator}
            >
              <Plus className="w-5 h-5 text-purple-600" />
              <span className="hidden sm:inline font-medium">Create Puzzle</span>
            </button>
            <button
              onClick={() => setShowNotificationSettings(!showNotificationSettings)}
              className="bg-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label={showNotificationSettings ? 'Hide Notification Settings' : 'Show Notification Settings'}
              aria-expanded={showNotificationSettings}
              title="Notification Settings"
              data-feature="notification-settings"
            >
              <Bell className="w-5 h-5 text-orange-600" />
              <span className="hidden sm:inline font-medium">Notifications</span>
            </button>
            <button
              onClick={() => setShowABTesting(!showABTesting)}
              className="bg-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              aria-label={showABTesting ? 'Hide A/B Testing (Premium)' : 'Show A/B Testing (Premium)'}
              title="A/B Testing - Premium Feature Coming Soon"
              aria-expanded={showABTesting}
            >
              <FlaskConical className="w-5 h-5 text-pink-600" />
              <span className="hidden sm:inline font-medium">A/B Testing</span>
            </button>
          </div>
        </div>

        {/* Hints Panel */}
        {showHints && gameState && (
          <div className="mb-8">
            <HintPanel
              grid={gameState.grid}
              currentPath={gameState.currentPath}
              difficulty={difficulty}
              targetWord={gameState.targetWord}
              isVisible={showHints}
              onClose={() => setShowHints(false)}
              compact={true}
            />
          </div>
        )}

        {/* Statistics Panel */}
        {showStatistics && (
          <div className="mb-8">
            <Statistics showDetailed={false} />
          </div>
        )}

        {/* Leaderboard Panel */}
        {showLeaderboard && (
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Leaderboard temporarily unavailable</h3>
              <p className="text-gray-600">We are currently maintaining the leaderboard system. Please try again later.</p>
            </div>
          </div>
        )}

        {/* Friends Panel */}
        {showFriends && (
          <div className="mb-8">
            <Friends compact={false} showActions={true} />
          </div>
        )}

        {/* Multiplayer Panel */}
        {showMultiplayer && (
          <div className="mb-8">
            <Multiplayer />
          </div>
        )}

        {/* Theme Selector Panel */}
        {showThemeSelector && (
          <div className="mb-8">
            <ThemeSelector />
          </div>
        )}

        {/* Learning Dashboard Panel - Temporarily disabled */}
        {showLearningDashboard && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Learning Analytics</h3>
              <p className="text-gray-600 mb-4">Learning analytics are temporarily disabled while we improve the system.</p>
              <button
                onClick={() => setShowLearningDashboard(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Themed Puzzles Panel */}
        {showThemedPuzzles && (
          <div className="mb-8">
            <ThemedPuzzleModeSimple />
          </div>
        )}

        {/* Puzzle Creator Panel */}
        {showPuzzleCreator && (
          <div className="mb-8">
            <PuzzleCreator />
          </div>
        )}


        {/* A/B Testing Panel */}
        {showABTesting && (
          <div className="mb-8">
            <ABTestingAdmin />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
          {/* Game Grid */}
          <div className="flex flex-col items-center gap-6" role="main" aria-label="Game board">
            <Grid grid={gameState.grid} onCellClick={handleCellClick} />

            <CurrentPathDisplay
              currentWord={currentWord}
              onClear={handleClear}
              onSubmit={handleSubmit}
              canSubmit={canSubmit}
              pathLength={gameState.currentPath.length}
            />

            {/* Desktop Game Controls (hidden on mobile) */}
            <div className="hidden lg:block">
              <GameControls
                canSubmit={canSubmit}
                currentPathLength={gameState.currentPath.length}
                onSubmit={handleSubmit}
                onClear={handleClear}
                onHint={useNextLetterHint}
                attemptsLeft={gameState.attemptsLeft}
                hintUsed={gameState.hintUsed}
              />
            </div>

            {gameState.revealedHintLetter && (
              <div className="mt-4 text-center">
                <p className="text-lg font-semibold text-gray-700">
                  Hint: The next letter is <span className="text-2xl font-bold text-green-500">{gameState.revealedHintLetter}</span>
                </p>
              </div>
            )}
          </div>

          {/* Guess History */}
          <div className="flex justify-center w-full lg:w-auto" role="complementary" aria-label="Guess history">
            <GuessHistory guesses={gameState.guesses} />
          </div>
        </div>

        <HowToPlay />

        {/* Notification Settings Modal */}
        {showNotificationSettings && (
          <NotificationSettings
            isVisible={showNotificationSettings}
            onClose={() => setShowNotificationSettings(false)}
          />
        )}

        {/* Game Result Modal */}
        {(gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') && (
          <GameResult
            gameStatus={gameState.gameStatus}
            targetWord={gameState.targetWord}
            attemptsUsed={6 - gameState.attemptsLeft}
            onReset={handleReset}
            gameMode={gameState.gameMode}
            difficulty={difficulty}
            timeTaken={Math.round((Date.now() - gameStartTime) / 1000)}
            score={gameState.gameStatus === 'won' ? Math.max(1000 - ((6 - gameState.attemptsLeft - 1) * 200) - Math.round((Date.now() - gameStartTime) / 1000), 100) : 0}
            hintsUsed={0} // Can be tracked in the future
            maxStreak={statistics.maxStreak} // Can be retrieved from statistics
          />
        )}
      </div>
    </div>
  );
}, [
  gameMode,
  gameState?.grid,
  handleCellClick,
  currentWord,
  handleClear,
  handleSubmit,
  canSubmit,
  gameState?.currentPath.length,
  gameState?.attemptsLeft,
  gameState?.guesses,
  gameState?.gameStatus,
  gameState?.targetWord,
  handleReset,
  showStatistics,
  showLearningDashboard,
  getAnalytics,
  getRecommendations,
  getSessionHistory
]);

  return (
    <>
      {mainContent}
      {/* Achievement Notification */}
      <AchievementNotification
        achievement={currentAchievement}
        onClose={() => {
          setCurrentAchievement(null);
          clearNewAchievements();
        }}
      />

      {/* Fullscreen Hint Panel */}
      {showHints && gameState && (
        <HintPanel
          grid={gameState.grid}
          currentPath={gameState.currentPath}
          difficulty={difficulty}
          targetWord={gameState.targetWord}
          isVisible={showHints}
          onClose={() => setShowHints(false)}
          compact={false}
        />
      )}
    </>
  );
};

export default PathWordle;
