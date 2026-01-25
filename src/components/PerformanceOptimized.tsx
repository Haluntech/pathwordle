import React, { Suspense, lazy, memo } from 'react';
import { usePathWordleImproved } from '../hooks/usePathWordleImproved';
import { pathToWord } from '../utils/gameLogic';

// Core components - Always loaded
import { GameToolbar, GameBoard } from './pathwordle';

// Lazy loaded components - Code splitting
const LazyGamePanels = lazy(() =>
  import('./pathwordle').then(module => ({
    default: module.GamePanels
  }))
);

const LazyGuessHistory = lazy(() =>
  import('./GuessHistory').then(module => ({
    default: module.default
  }))
);

const LazyGameResult = lazy(() =>
  import('./GameResult').then(module => ({
    default: module.default
  }))
);

const LazyHowToPlay = lazy(() =>
  import('./HowToPlay').then(module => ({
    default: module.default
  }))
);

// ============================================================================
// LOADING COMPONENTS
// ============================================================================

const LoadingFallback = memo(() => (
  <div className="animate-pulse flex space-x-4">
    <div className="flex-1 space-y-4 py-1">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

const InlineSpinner = memo(() => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
));

InlineSpinner.displayName = 'InlineSpinner';

// ============================================================================
// MEMOIZED SUB-COMPONENTS
// ============================================================================

const GameHeader = memo(({ gameMode }: { gameMode: 'daily' | 'practice' }) => {
  // Dynamic import for logo
  const [logoSrc, setLogoSrc] = React.useState<string>('');

  React.useEffect(() => {
    // Lazy load the logo
    import('../assets/pathwordle_logo.png')
      .then(module => {
        setLogoSrc(module.default);
      })
      .catch(() => {
        setLogoSrc('');
      });
  }, []);

  return (
    <header className="text-center mb-8 flex flex-col items-center">
      <div className="flex items-center mb-2">
        {logoSrc ? (
          <img
            src={logoSrc}
            alt="PathWordle Logo"
            className="w-16 h-16 mr-4"
            loading="lazy"
            width="64"
            height="64"
          />
        ) : (
          <div className="w-16 h-16 mr-4 bg-gray-200 rounded-lg animate-pulse" />
        )}
        <h1 className="text-4xl font-bold text-gray-800">
          PathWordle {gameMode === 'practice' && <span className="text-lg text-blue-600">(Practice)</span>}
        </h1>
      </div>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Connect adjacent letters to form paths and guess the hidden 5-letter word.
        Use the Wordle-style feedback to guide your next guess!
      </p>
    </header>
  );
});

GameHeader.displayName = 'GameHeader';

// ============================================================================
// PERFORMANCE OPTIMIZED PATHWORDLE COMPONENT
// ============================================================================

interface PerformanceOptimizedProps {
  gameMode?: 'daily' | 'practice';
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
}

const PerformanceOptimized: React.FC<PerformanceOptimizedProps> = ({
  gameMode = 'daily',
  difficulty = 'medium'
}) => {
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

  // UI state
  const [showStatistics, setShowStatistics] = React.useState(false);
  const [showHints, setShowHints] = React.useState(false);
  const [showLeaderboard, setShowLeaderboard] = React.useState(false);
  const [showFriends, setShowFriends] = React.useState(false);
  const [showMultiplayer, setShowMultiplayer] = React.useState(false);
  const [showThemeSelector, setShowThemeSelector] = React.useState(false);
  const [showContentQuality, setShowContentQuality] = React.useState(false);
  const [gameStartTime] = React.useState<number>(Date.now());

  // Memoized callbacks to prevent unnecessary re-renders
  const handleCellClick = React.useCallback((row: number, col: number) => {
    selectCell(row, col);
  }, [selectCell]);

  const handleSubmit = React.useCallback(() => {
    submitGuess();
  }, [submitGuess]);

  const handleClear = React.useCallback(() => {
    clearPath();
  }, [clearPath]);

  const handleReset = React.useCallback(() => {
    resetGame();
    setShowHints(false);
    setShowStatistics(false);
    setShowLeaderboard(false);
    setShowFriends(false);
    setShowMultiplayer(false);
    setShowThemeSelector(false);
    setShowContentQuality(false);
  }, [resetGame]);

  // Early return for loading state
  if (!gameState || !gameState.grid || gameState.grid.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <InlineSpinner />
          <p className="text-gray-600 mt-4">Loading game...</p>
        </div>
      </div>
    );
  }

  // Main content with code splitting
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

          {/* Lazy Loaded Panels */}
          <Suspense fallback={<LoadingFallback />}>
            <LazyGamePanels
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
          </Suspense>

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

            <Suspense fallback={<InlineSpinner />}>
              <div className="flex justify-center w-full lg:w-auto" role="complementary" aria-label="Guess history">
                <LazyGuessHistory guesses={gameState.guesses} />
              </div>
            </Suspense>
          </div>

          {/* Lazy Loaded How To Play */}
          <Suspense fallback={null}>
            <LazyHowToPlay />
          </Suspense>
        </div>
      </div>

      {/* Lazy Loaded Game Result Modal */}
      <Suspense fallback={null}>
        {isGameOver && (
          <LazyGameResult
            gameStatus={isWon ? 'won' : 'lost'}
            targetWord={gameState.targetWord}
            attemptsUsed={6 - gameState.attemptsLeft}
            onReset={handleReset}
            gameMode={gameState.gameMode}
            difficulty={difficulty}
            timeTaken={Math.round((Date.now() - gameStartTime) / 1000)}
            score={isWon ? Math.max(1000 - ((6 - gameState.attemptsLeft - 1) * 200) - Math.round((Date.now() - gameStartTime) / 1000), 100) : 0}
            hintsUsed={0}
            maxStreak={0}
          />
        )}
      </Suspense>
    </>
  );
};

export default PerformanceOptimized;
