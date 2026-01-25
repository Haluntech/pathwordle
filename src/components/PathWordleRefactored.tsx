import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import pathwordleLogo from '../assets/pathwordle_logo.png';
import { usePathWordleImproved } from '../hooks/usePathWordleImproved';
import { useStatistics } from '../hooks/useStatistics';
import GuessHistory from './GuessHistory';
import GameResult from './GameResult';
import AchievementNotification, { useAchievementNotifications } from './AchievementNotification';
import ContentQualityPanel from './ContentQualityPanel';
import { pathToWord } from '../utils/gameLogic';

// Refactored components
import { GameToolbar, GamePanels, GameBoard } from './pathwordle';

interface PathWordleProps {
  gameMode?: 'daily' | 'practice';
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
}

// ============================================================================
// MEMOIZED SUB-COMPONENTS
// ============================================================================

// Error Boundary Component
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

// Game Header Component
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

// How to Play Component
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

// ============================================================================
// MAIN PATHWORDLE COMPONENT
// ============================================================================

const PathWordleRefactored: React.FC<PathWordleProps> = ({ gameMode = 'daily', difficulty = 'medium' }) => {
  // Core hooks - Using improved version
  const {
    gameState,
    selectCell,
    submitGuess,
    clearPath,
    resetGame,
    canSubmit,
    isGameOver,
    isWon,
    currentWord,
    progress
  } = usePathWordleImproved(gameMode);

  const { recordGame, shareResult, getNextAchievement, clearNewAchievements, statistics } = useStatistics();
  const { AchievementNotificationComponent } = useAchievementNotifications();

  // State
  const [error, setError] = useState<string | null>(null);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showMultiplayer, setShowMultiplayer] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showContentQuality, setShowContentQuality] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now());
  const [currentAchievement, setCurrentAchievement] = useState(null);

  // Callbacks
  const handleCellClick = useCallback((row: number, col: number) => {
    selectCell(row, col);
  }, [selectCell]);

  const handleSubmit = useCallback(() => {
    submitGuess();
  }, [submitGuess]);

  const handleClear = useCallback(() => {
    clearPath();
  }, [clearPath]);

  const handleReset = useCallback(() => {
    resetGame();
    setError(null);
    setGameStartTime(Date.now());
  }, [resetGame]);

  // Handle game completion
  useEffect(() => {
    if (gameState && isGameOver) {
      const timeTaken = Math.round((Date.now() - gameStartTime) / 1000);

      // Calculate score
      let score = 0;
      if (isWon) {
        const attemptsUsed = 6 - gameState.attemptsLeft;
        score = Math.max(1000 - (attemptsUsed * 200) - timeTaken, 100);
      }

      // Record game result
      recordGame({
        won: isWon,
        attemptsUsed: 6 - gameState.attemptsLeft,
        timeTaken,
        targetWord: gameState.targetWord,
        mode: gameMode,
        difficulty: difficulty,
        hintsUsed: 0,
        score
      });
    }
  }, [isGameOver, isWon, gameState?.targetWord, gameState?.attemptsLeft, gameMode, difficulty, gameStartTime, recordGame]);

  // Listen for new achievement unlocks
  useEffect(() => {
    const nextAchievement = getNextAchievement();
    if (nextAchievement && nextAchievement !== currentAchievement) {
      setCurrentAchievement(nextAchievement);
      setTimeout(() => {
        clearNewAchievements();
        setCurrentAchievement(null);
      }, 5000);
    }
  }, [statistics, getNextAchievement, clearNewAchievements, currentAchievement]);

  // Validate game state
  useEffect(() => {
    if (!gameState) {
      setError('Failed to initialize game state');
    } else if (!gameState.grid || gameState.grid.length === 0) {
      setError('Game grid not initialized');
    }
  }, [gameState]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

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
          event.preventDefault();
          const firstAvailableCell = document.querySelector('[aria-disabled="false"]') as HTMLButtonElement;
          firstAvailableCell?.focus();
          break;
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [canSubmit, currentWord, handleSubmit, handleClear, handleReset]);

  // Error state
  if (error) {
    return <ErrorBoundary error={error} onReset={handleReset} />;
  }

  // Loading state
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

  // Main content
  return (
    <>
      {/* Main Game Area */}
      <div id="main-content" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8" tabIndex={-1}>
        <div className="max-w-6xl mx-auto px-4">
          {/* Header with Toolbar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
            <GameHeader gameMode={gameMode} />
            <GameToolbar
              gameMode={gameMode}
              showHints={showHints}
              showStatistics={showStatistics}
              showLeaderboard={showLeaderboard}
              showFriends={showFriends}
              showMultiplayer={showMultiplayer}
              showThemeSelector={showThemeSelector}
              showContentQuality={showContentQuality}
              onToggleHints={() => setShowHints(!showHints)}
              onToggleStatistics={() => setShowStatistics(!showStatistics)}
              onToggleLeaderboard={() => setShowLeaderboard(!showLeaderboard)}
              onToggleFriends={() => setShowFriends(!showFriends)}
              onToggleMultiplayer={() => setShowMultiplayer(!showMultiplayer)}
              onToggleThemeSelector={() => setShowThemeSelector(!showThemeSelector)}
              onToggleContentQuality={() => setShowContentQuality(!showContentQuality)}
            />
          </div>

          {/* Panels */}
          <GamePanels
            showHints={showHints}
            showStatistics={showStatistics}
            showLeaderboard={showLeaderboard}
            showFriends={showFriends}
            showMultiplayer={showMultiplayer}
            showThemeSelector={showThemeSelector}
            grid={gameState.grid}
            currentPath={gameState.currentPath}
            targetWord={gameState.targetWord}
            difficulty={difficulty}
            onCloseHints={() => setShowHints(false)}
          />

          {/* Game Board and Guess History */}
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
            <GameBoard
              grid={gameState.grid}
              currentPath={gameState.currentPath}
              attemptsLeft={gameState.attemptsLeft}
              currentWord={currentWord}
              canSubmit={canSubmit}
              onCellClick={handleCellClick}
              onClear={handleClear}
              onSubmit={handleSubmit}
            />

            <div className="flex justify-center w-full lg:w-auto" role="complementary" aria-label="Guess history">
              <GuessHistory guesses={gameState.guesses} />
            </div>
          </div>

          <HowToPlay />
        </div>
      </div>

      {/* Game Result Modal */}
      {isGameOver && (
        <GameResult
          gameStatus={isWon ? 'won' : 'lost'}
          targetWord={gameState.targetWord}
          attemptsUsed={6 - gameState.attemptsLeft}
          onReset={handleReset}
          gameMode={gameState.gameMode}
          difficulty={difficulty}
          timeTaken={Math.round((Date.now() - gameStartTime) / 1000)}
          score={isWon ? Math.max(1000 - ((6 - gameState.attemptsLeft - 1) * 200) - Math.round((Date.now() - gameStartTime) / 1000), 100) : 0}
          hintsUsed={0}
          maxStreak={statistics.maxStreak}
        />
      )}

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

      {/* Content Quality Panel */}
      {showContentQuality && (
        <ContentQualityPanel
          isOpen={showContentQuality}
          onClose={() => setShowContentQuality(false)}
        />
      )}
    </>
  );
};

export default PathWordleRefactored;
