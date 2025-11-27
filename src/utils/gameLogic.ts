import { GridCell } from '../types/game';
import { getDailyWord, getPracticeWord, isValidWord } from './wordList';

// Add date utility functions
export const getTodaysDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};
export const getYesterdaysDate = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

export const getWordForDate = (date: string): string => {
  // Implementation should match getTodaysWord logic
  return getDailyWord(date);
};

const GRID_SIZE = 6;
const WORD_LENGTH = 5;

export const createGrid = (targetWord: string, seed?: string): GridCell[][] => {
  const grid: GridCell[][] = [];
  
  // Use seed for more randomization if provided
  let random = Math.random;
  if (seed) {
    let seedValue = 0;
    for (let i = 0; i < seed.length; i++) {
      seedValue += seed.charCodeAt(i);
    }
    seedValue = (seedValue * 9301 + 49297) % 233280;
    random = () => {
      seedValue = (seedValue * 9301 + 49297) % 233280;
      return seedValue / 233280;
    };
  }
  
  // Initialize empty grid
  for (let row = 0; row < GRID_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[row][col] = {
        letter: '',
        row,
        col,
        isSelected: false,
        isInPath: false,
        canSelect: false
      };
    }
  }

  // Place target word in a valid path
  const path = generateValidPath(random);
  for (let i = 0; i < targetWord.length; i++) {
    const cell = path[i];
    grid[cell.row][cell.col].letter = targetWord[i];
  }

  // Fill remaining cells with random letters - improved distribution
  const vowels = 'AEIOU';
  const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
  
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!grid[row][col].letter) {
        // Better letter distribution: 40% vowels, 60% consonants
        const useVowel = random() < 0.4;
        const letters = useVowel ? vowels : consonants;
        const randomIndex = Math.floor(random() * letters.length);
        grid[row][col].letter = letters[randomIndex];
      }
    }
  }

  return grid;
};

const generateValidPath = (random = Math.random): { row: number; col: number }[] => {
  const path = [];
  let row = Math.floor(random() * GRID_SIZE);
  let col = Math.floor(random() * GRID_SIZE);
  
  path.push({ row, col });
  
  for (let i = 1; i < WORD_LENGTH; i++) {
    const neighbors = getNeighbors(row, col, path);
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

const getNeighbors = (row: number, col: number, usedCells: { row: number; col: number }[]) => {
  const neighbors = [];
  
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
        const isUsed = usedCells.some(cell => cell.row === newRow && cell.col === newCol);
        if (!isUsed) {
          neighbors.push({ row: newRow, col: newCol });
        }
      }
    }
  }
  
  return neighbors;
};

export const areAdjacent = (cell1: GridCell, cell2: GridCell): boolean => {
  const rowDiff = Math.abs(cell1.row - cell2.row);
  const colDiff = Math.abs(cell1.col - cell2.col);
  return (rowDiff <= 1 && colDiff <= 1) && (rowDiff + colDiff > 0);
};

export const calculateFeedback = (guess: string, target: string): ('correct' | 'present' | 'absent')[] => {
  const feedback: ('correct' | 'present' | 'absent')[] = new Array(guess.length).fill(null);
  const targetLetters = target.split('');
  const guessLetters = guess.split('');

  // First pass: mark correct positions
  for (let i = 0; i < guess.length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      feedback[i] = 'correct';
      targetLetters[i] = null; // Mark as used
      guessLetters[i] = null; // Mark as used
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < guess.length; i++) {
    if (guessLetters[i] !== null) {
      const targetIndex = targetLetters.findIndex(letter => letter === guessLetters[i]);
      if (targetIndex !== -1) {
        feedback[i] = 'present';
        targetLetters[targetIndex] = null; // Mark as used
      } else {
        feedback[i] = 'absent';
      }
    }
  }

  return feedback;
};

export const pathToWord = (path: GridCell[]): string => {
  return path.map(cell => cell.letter).join('');
};

export const isValidPath = (path: GridCell[]): boolean => {
  if (path.length !== WORD_LENGTH) return false;
  
  for (let i = 1; i < path.length; i++) {
    if (!areAdjacent(path[i - 1], path[i])) {
      return false;
    }
  }
  
  const word = pathToWord(path);
  return isValidWord(word);
};



export const getTodaysWord = (): string => {
  return getDailyWord(getTodaysDate());
};

export const getPracticeGameWord = (): string => {
  return getPracticeWord();
};