/**
 * usePathWordle Hook (Improved)
 *
 * Core game logic hook with improved type safety, performance, and maintainability.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  GameState,
  GameGrid,
  GridCell,
  GameMode,
  GameStatus,
} from '../types/game';
import {
  createGrid,
  calculateFeedback,
  pathToWord,
  isValidPath,
  getTodaysDate,
  getTodaysWord,
  getPracticeGameWord,
} from '../utils/gameLogic';

// Constants
const STORAGE_KEY = 'pathwordle-game';
const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;
const GRID_SIZE = 6;

/**
 * Storage operations for game state
 */
const gameStorage = {
  save: (state: GameState): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  },

  load: (): GameState | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to load game state:', error);
      return null;
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear game state:', error);
    }
  },
};

/**
 * Initialize new game state
 */
const initializeGameState = (
  gameMode: GameMode,
  currentDate: string
): GameState => {
  const targetWord = gameMode === 'daily' ? getTodaysWord() : getPracticeGameWord();
  const gridSeed = gameMode === 'daily' ? currentDate : undefined;
  const grid = createGrid(targetWord, gridSeed);

  return {
    grid,
    targetWord,
    currentPath: [],
    guesses: [],
    attemptsLeft: MAX_ATTEMPTS,
    gameStatus: 'playing',
    currentDate,
    gameMode,
    startTime: Date.now(),
  };
};

/**
 * Check if game is playable
 */
const canPlayGame = (gameState: GameState): boolean => {
  return gameState.gameStatus === 'playing';
};

/**
 * Check if guess can be submitted
 */
const canSubmitGuess = (gameState: GameState): boolean => {
  return (
    gameState.currentPath.length === WORD_LENGTH &&
    gameState.gameStatus === 'playing'
  );
};

/**
 * usePathWordle Hook
 *
 * Manages the core game state and logic for PathWordle.
 */
export const usePathWordle = (gameMode: GameMode = 'daily') => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const today = getTodaysDate();

    // Try to load saved daily game
    if (gameMode === 'daily') {
      const savedGame = gameStorage.load();
      if (savedGame && savedGame.currentDate === today && savedGame.gameMode === 'daily') {
        return savedGame;
      }
    }

    // Initialize new game
    return initializeGameState(gameMode, today);
  });

  // Save game to localStorage
  useEffect(() => {
    if (gameState.gameMode === 'daily' && canPlayGame(gameState)) {
      gameStorage.save(gameState);
    }
  }, [gameState]);

  /**
   * Select/deselect a cell in the grid
   */
  const selectCell = useCallback((row: number, col: number) => {
    if (!canPlayGame(gameState)) return;

    setGameState((prev) => {
      const newGrid = prev.grid.map((r) => r.map((c) => ({ ...c })));
      const clickedCell = newGrid[row][col];

      // Case 1: Start new path
      if (prev.currentPath.length === 0) {
        clickedCell.isSelected = true;
        clickedCell.isInPath = true;
        updateAdjacentCells(newGrid, [clickedCell]);

        return {
          ...prev,
          grid: newGrid,
          currentPath: [clickedCell],
        };
      }

      const lastCell = prev.currentPath[prev.currentPath.length - 1];

      // Case 2: Clicking last cell - remove from path
      if (lastCell.row === row && lastCell.col === col && prev.currentPath.length > 1) {
        clickedCell.isSelected = false;
        clickedCell.isInPath = false;
        const newPath = prev.currentPath.slice(0, -1);
        updateAdjacentCells(newGrid, newPath);

        return {
          ...prev,
          grid: newGrid,
          currentPath: newPath,
        };
      }

      // Case 3: Clicking first cell with single-cell path - clear path
      if (prev.currentPath.length === 1 && lastCell.row === row && lastCell.col === col) {
        clearCellStates(newGrid);
        return {
          ...prev,
          grid: newGrid,
          currentPath: [],
        };
      }

      // Case 4: Add cell to path if selectable
      if (clickedCell.canSelect && prev.currentPath.length < WORD_LENGTH) {
        clickedCell.isSelected = true;
        clickedCell.isInPath = true;
        const newPath = [...prev.currentPath, clickedCell];
        updateAdjacentCells(newGrid, newPath);

        return {
          ...prev,
          grid: newGrid,
          currentPath: newPath,
        };
      }

      return prev;
    });
  }, [gameState]);

  /**
   * Submit current guess
   */
  const submitGuess = useCallback(() => {
    if (!canSubmitGuess(gameState)) return;

    const word = pathToWord(gameState.currentPath);

    // Validate path
    if (!isValidPath(gameState.currentPath)) {
      // TODO: Show error message to user
      return;
    }

    // Calculate feedback
    const feedback = calculateFeedback(word, gameState.targetWord);

    // Create guess result
    const guessResult = {
      word,
      path: [...gameState.currentPath],
      feedback,
      timestamp: Date.now(),
      isWin: feedback.every((f) => f === 'correct'),
    };

    // Update game state
    const isWin = guessResult.isWin;
    const newAttemptsLeft = gameState.attemptsLeft - 1;
    const newGameStatus: GameStatus = isWin
      ? 'won'
      : newAttemptsLeft === 0
      ? 'lost'
      : 'playing';

    setGameState((prev) => {
      const newGrid = resetGridStates(prev.grid);

      return {
        ...prev,
        grid: newGrid,
        currentPath: [],
        guesses: [...prev.guesses, guessResult],
        attemptsLeft: newAttemptsLeft,
        gameStatus: newGameStatus,
        endTime: isWin || newAttemptsLeft === 0 ? Date.now() : undefined,
      };
    });
  }, [gameState]);

  /**
   * Clear current path
   */
  const clearPath = useCallback(() => {
    if (!canPlayGame(gameState)) return;

    setGameState((prev) => {
      const newGrid = resetGridStates(prev.grid);

      return {
        ...prev,
        grid: newGrid,
        currentPath: [],
      };
    });
  }, [gameState]);

  /**
   * Reset game
   */
  const resetGame = useCallback(() => {
    const today = getTodaysDate();
    const newState = initializeGameState(gameMode, today);
    setGameState(newState);

    if (gameMode === 'daily') {
      gameStorage.clear();
    }
  }, [gameMode]);

  /**
   * Computed values
   */
  const computed = useMemo(
    () => ({
      canSubmit: canSubmitGuess(gameState),
      isGameOver: gameState.gameStatus === 'won' || gameState.gameStatus === 'lost',
      isWon: gameState.gameStatus === 'won',
      isLost: gameState.gameStatus === 'lost',
      currentWord: pathToWord(gameState.currentPath),
      progress: {
        played: MAX_ATTEMPTS - gameState.attemptsLeft,
        total: MAX_ATTEMPTS,
        percentage: ((MAX_ATTEMPTS - gameState.attemptsLeft) / MAX_ATTEMPTS) * 100,
      },
    }),
    [gameState]
  );

  return {
    // State
    gameState,

    // Actions
    selectCell,
    submitGuess,
    clearPath,
    resetGame,

    // Computed values
    ...computed,
  };
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Update canSelect status for adjacent cells
 */
const updateAdjacentCells = (grid: GameGrid, currentPath: GridCell[]): void => {
  // Clear all canSelect states
  clearCellStates(grid);

  if (currentPath.length === 0 || currentPath.length >= WORD_LENGTH) return;

  const lastCell = currentPath[currentPath.length - 1];
  const pathCellKeys = new Set(currentPath.map((c) => `${c.row}-${c.col}`));

  // Mark adjacent cells as selectable
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;

      const newRow = lastCell.row + dr;
      const newCol = lastCell.col + dc;

      if (
        newRow >= 0 &&
        newRow < GRID_SIZE &&
        newCol >= 0 &&
        newCol < GRID_SIZE
      ) {
        const cellKey = `${newRow}-${newCol}`;
        if (!pathCellKeys.has(cellKey)) {
          grid[newRow][newCol].canSelect = true;
        }
      }
    }
  }
};

/**
 * Clear all interactive cell states
 */
const clearCellStates = (grid: GameGrid): void => {
  grid.forEach((row) => {
    row.forEach((cell) => {
      cell.isSelected = false;
      cell.isInPath = false;
      cell.canSelect = false;
    });
  });
};

/**
 * Reset grid to initial state
 */
const resetGridStates = (grid: GameGrid): GameGrid => {
  return grid.map((row) =>
    row.map((cell) => ({
      ...cell,
      isSelected: false,
      isInPath: false,
      canSelect: false,
    }))
  );
};

export default usePathWordle;
