/**
 * Game Logic Utilities (Improved)
 *
 * Core game logic functions with improved type safety and documentation.
 */

import type { GridCell, GameGrid, LetterFeedback } from '../types/game';
import { getDailyWord, getPracticeWord, isValidWord } from './wordList';

// ============================================================================
// CONSTANTS
// ============================================================================

export const GRID_SIZE = 6;
export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;

// ============================================================================
// DATE UTILITIES
// ============================================================================

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodaysDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Get yesterday's date in YYYY-MM-DD format
 */
export const getYesterdaysDate = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

/**
 * Get word for a specific date
 */
export const getWordForDate = (date: string): string => {
  return getDailyWord(date);
};

// ============================================================================
// WORD SELECTION
// ============================================================================

/**
 * Get today's word for daily challenge
 */
export const getTodaysWord = (): string => {
  return getDailyWord(getTodaysDate());
};

/**
 * Get a random word for practice mode
 */
export const getPracticeGameWord = (): string => {
  return getPracticeWord();
};

// ============================================================================
// GRID CREATION
// ============================================================================

/**
 * Create a new game grid
 */
export const createGrid = (targetWord: string, seed?: string): GameGrid => {
  // Initialize random function with seed
  let random = Math.random;
  if (seed) {
    random = createSeededRandom(seed);
  }

  // Initialize empty grid
  const grid: GameGrid = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[row][col] = {
        letter: '',
        row,
        col,
        isSelected: false,
        isInPath: false,
        canSelect: false,
      };
    }
  }

  // Place target word in a valid path
  const path = generateValidPath(random);
  for (let i = 0; i < targetWord.length; i++) {
    const cell = path[i];
    grid[cell.row][cell.col].letter = targetWord[i];
  }

  // Fill remaining cells with random letters
  fillRandomLetters(grid, random);

  return grid;
};

/**
 * Fill grid with random letters (40% vowels, 60% consonants)
 */
const fillRandomLetters = (grid: GameGrid, random: () => number): void => {
  const vowels = 'AEIOU';
  const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!grid[row][col].letter) {
        const useVowel = random() < 0.4;
        const letters = useVowel ? vowels : consonants;
        const randomIndex = Math.floor(random() * letters.length);
        grid[row][col].letter = letters[randomIndex];
      }
    }
  }
};

/**
 * Create a seeded random number generator
 */
const createSeededRandom = (seed: string): (() => number) => {
  let seedValue = 0;
  for (let i = 0; i < seed.length; i++) {
    seedValue += seed.charCodeAt(i);
  }

  return () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };
};

// ============================================================================
// PATH GENERATION
// ============================================================================

/**
 * Generate a valid path for placing the target word
 */
const generateValidPath = (random = Math.random): { row: number; col: number }[] => {
  const path: { row: number; col: number }[] = [];
  let row = Math.floor(random() * GRID_SIZE);
  let col = Math.floor(random() * GRID_SIZE);

  path.push({ row, col });

  for (let i = 1; i < WORD_LENGTH; i++) {
    const neighbors = getAvailableNeighbors(row, col, path);
    if (neighbors.length === 0) {
      // Restart if we can't continue
      return generateValidPath(random);
    }

    const nextCell = neighbors[Math.floor(random() * neighbors.length)];
    row = nextCell.row;
    col = nextCell.col;
    path.push({ row, col });
  }

  return path;
};

/**
 * Get available neighboring cells
 */
const getAvailableNeighbors = (
  row: number,
  col: number,
  usedCells: { row: number; col: number }[]
): { row: number; col: number }[] => {
  const neighbors: { row: number; col: number }[] = [];

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;

      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow >= 0 &&
        newRow < GRID_SIZE &&
        newCol >= 0 &&
        newCol < GRID_SIZE
      ) {
        const isUsed = usedCells.some(
          (cell) => cell.row === newRow && cell.col === newCol
        );
        if (!isUsed) {
          neighbors.push({ row: newRow, col: newCol });
        }
      }
    }
  }

  return neighbors;
};

// ============================================================================
// PATH OPERATIONS
// ============================================================================

/**
 * Convert a path of cells to a word
 */
export const pathToWord = (path: GridCell[]): string => {
  return path.map((cell) => cell.letter).join('');
};

/**
 * Check if two cells are adjacent
 */
export const areAdjacent = (cell1: GridCell, cell2: GridCell): boolean => {
  const rowDiff = Math.abs(cell1.row - cell2.row);
  const colDiff = Math.abs(cell1.col - cell2.col);
  return (rowDiff <= 1 && colDiff <= 1) && (rowDiff + colDiff > 0);
};

/**
 * Validate if a path is valid
 * - Path must be exactly WORD_LENGTH cells
 * - Each cell must be adjacent to the previous
 * - Formed word must be in dictionary
 */
export const isValidPath = (path: GridCell[]): boolean => {
  // Check length
  if (path.length !== WORD_LENGTH) {
    return false;
  }

  // Check adjacency
  for (let i = 1; i < path.length; i++) {
    if (!areAdjacent(path[i - 1], path[i])) {
      return false;
    }
  }

  // Check if word is valid
  const word = pathToWord(path);
  return isValidWord(word);
};

/**
 * Get all cells adjacent to a given cell
 */
export const getAdjacentCells = (
  grid: GameGrid,
  cell: GridCell
): GridCell[] => {
  const adjacent: GridCell[] = [];

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;

      const newRow = cell.row + dr;
      const newCol = cell.col + dc;

      if (
        newRow >= 0 &&
        newRow < GRID_SIZE &&
        newCol >= 0 &&
        newCol < GRID_SIZE
      ) {
        adjacent.push(grid[newRow][newCol]);
      }
    }
  }

  return adjacent;
};

// ============================================================================
// FEEDBACK CALCULATION
// ============================================================================

/**
 * Calculate feedback for a guess
 * Returns an array of 'correct', 'present', or 'absent' for each letter
 */
export const calculateFeedback = (
  guess: string,
  target: string
): LetterFeedback[] => {
  const feedback: LetterFeedback[] = new Array(guess.length).fill('absent');
  const targetLetters = target.split('');
  const guessLetters = guess.split('');

  // First pass: mark correct positions
  for (let i = 0; i < guess.length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      feedback[i] = 'correct';
      targetLetters[i] = ''; // Mark as used
      guessLetters[i] = ''; // Mark as used
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < guess.length; i++) {
    if (guessLetters[i] !== '') {
      const targetIndex = targetLetters.findIndex(
        (letter) => letter === guessLetters[i]
      );
      if (targetIndex !== -1) {
        feedback[i] = 'present';
        targetLetters[targetIndex] = ''; // Mark as used
      }
    }
  }

  return feedback;
};

/**
 * Calculate guess accuracy percentage
 */
export const calculateAccuracy = (feedback: LetterFeedback[]): number => {
  const correctCount = feedback.filter((f) => f === 'correct').length;
  const presentCount = feedback.filter((f) => f === 'present').length;
  return ((correctCount * 2 + presentCount) / (feedback.length * 2)) * 100;
};

// ============================================================================
// GRID STATE MANAGEMENT
// ============================================================================

/**
 * Clear all interactive states from grid
 */
export const clearGridStates = (grid: GameGrid): void => {
  grid.forEach((row) => {
    row.forEach((cell) => {
      cell.isSelected = false;
      cell.isInPath = false;
      cell.canSelect = false;
    });
  });
};

/**
 * Update canSelect status for cells adjacent to the path
 */
export const updateAdjacentCells = (grid: GameGrid, currentPath: GridCell[]): void => {
  // Clear all canSelect states
  grid.forEach((row) => {
    row.forEach((cell) => {
      cell.canSelect = false;
    });
  });

  if (currentPath.length === 0 || currentPath.length >= WORD_LENGTH) return;

  const lastCell = currentPath[currentPath.length - 1];
  const pathCellKeys = new Set(currentPath.map((c) => `${c.row}-${c.col}`));

  // Mark adjacent cells as selectable
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;

      const newRow = lastCell.row + dr;
      const newCol = lastCell.col + dc;

      if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
        const cellKey = `${newRow}-${newCol}`;
        if (!pathCellKeys.has(cellKey)) {
          grid[newRow][newCol].canSelect = true;
        }
      }
    }
  }
};

/**
 * Create a deep copy of the grid
 */
export const cloneGrid = (grid: GameGrid): GameGrid => {
  return grid.map((row) =>
    row.map((cell) => ({ ...cell }))
  );
};
