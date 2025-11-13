import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import pathwordleLogo from '../assets/pathwordle_logo.png';
import { usePathWordle } from '../hooks/usePathWordle';
import Grid from './Grid';
import GuessHistory from './GuessHistory';
import GameControls from './GameControls';
import GameResult from './GameResult';
import { pathToWord } from '../utils/gameLogic';

interface PathWordleProps {
  gameMode?: 'daily' | 'practice';
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

const PathWordle: React.FC<PathWordleProps> = ({ gameMode = 'daily' }) => {
  const { gameState, selectCell, submitGuess, clearPath, resetGame, canSubmit } = usePathWordle(gameMode);
  const [error, setError] = useState<string | null>(null);

  // Memoize current word calculation
  const currentWord = useMemo(() => {
    return gameState?.currentPath ? pathToWord(gameState.currentPath) : '';
  }, [gameState?.currentPath]);

  // Memoize callbacks to prevent unnecessary re-renders
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
  }, [resetGame]);

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
  const mainContent = useMemo(() => (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8" tabIndex={-1}>
      <div className="max-w-6xl mx-auto px-4">
        <GameHeader gameMode={gameMode} />

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
                attemptsLeft={gameState.attemptsLeft}
              />
            </div>
          </div>

          {/* Guess History */}
          <div className="flex justify-center w-full lg:w-auto" role="complementary" aria-label="Guess history">
            <GuessHistory guesses={gameState.guesses} />
          </div>
        </div>

        <HowToPlay />

        {/* Game Result Modal */}
        {(gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') && (
          <GameResult
            gameStatus={gameState.gameStatus}
            targetWord={gameState.targetWord}
            attemptsUsed={6 - gameState.attemptsLeft}
            onReset={handleReset}
            gameMode={gameState.gameMode}
          />
        )}
      </div>
    </div>
  ), [
    gameMode,
    gameState.grid,
    handleCellClick,
    currentWord,
    handleClear,
    handleSubmit,
    canSubmit,
    gameState.currentPath.length,
    gameState.attemptsLeft,
    gameState.guesses,
    gameState.gameStatus,
    gameState.targetWord,
    handleReset
  ]);

  return mainContent;
};

export default PathWordle;