import { useState, useEffect, useCallback } from 'react';
import { GameState, GridCell, GuessResult } from '../types/game';
import { 
  createGrid, 
  calculateFeedback, 
  pathToWord, 
  isValidPath, 
  getTodaysDate, 
  getTodaysWord,
  getPracticeGameWord,
  areAdjacent 
} from '../utils/gameLogic';

const STORAGE_KEY = 'pathwordle-game';
const MAX_ATTEMPTS = 6;

export const usePathWordle = (gameMode: 'daily' | 'practice' = 'daily') => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const today = getTodaysDate();
    
    if (gameMode === 'daily') {
      const savedGame = localStorage.getItem(STORAGE_KEY);
      
      if (savedGame) {
        const parsed = JSON.parse(savedGame);
        if (parsed.currentDate === today && parsed.gameMode === 'daily') {
          return parsed;
        }
      }
    }
    
    // Create new game
    const targetWord = gameMode === 'daily' ? getTodaysWord() : getPracticeGameWord();
    const gridSeed = gameMode === 'daily' ? today : undefined;
    const grid = createGrid(targetWord, gridSeed);
    
    return {
      grid,
      targetWord,
      currentPath: [],
      guesses: [],
      attemptsLeft: MAX_ATTEMPTS,
      gameStatus: 'playing' as const,
      currentDate: today,
      gameMode
    };
  });

  const saveGame = useCallback((state: GameState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, []);

  useEffect(() => {
    // Only save daily games
    if (gameState.gameMode === 'daily') {
      saveGame(gameState);
    }
  }, [gameState, saveGame]);

  const updateGrid = useCallback((updater: (grid: GridCell[][]) => GridCell[][]) => {
    setGameState(prev => ({
      ...prev,
      grid: updater(prev.grid)
    }));
  }, []);

  const selectCell = useCallback((row: number, col: number) => {
    if (gameState.gameStatus !== 'playing') return;

    setGameState(prev => {
      const newGrid = prev.grid.map(r => r.map(c => ({ ...c })));
      const clickedCell = newGrid[row][col];
      
      // If no path exists, start new path
      if (prev.currentPath.length === 0) {
        clickedCell.isSelected = true;
        clickedCell.isInPath = true;
        
        // Update canSelect for adjacent cells
        updateCanSelectStatus(newGrid, [clickedCell]);
        
        return {
          ...prev,
          grid: newGrid,
          currentPath: [clickedCell]
        };
      }
      
      // If clicking on last cell in path, remove it
      const lastCell = prev.currentPath[prev.currentPath.length - 1];
      if (lastCell.row === row && lastCell.col === col && prev.currentPath.length > 1) {
        clickedCell.isSelected = false;
        clickedCell.isInPath = false;
        
        const newPath = prev.currentPath.slice(0, -1);
        updateCanSelectStatus(newGrid, newPath);
        
        return {
          ...prev,
          grid: newGrid,
          currentPath: newPath
        };
      }
      
      // If clicking on first cell and path length is 1, clear path
      if (prev.currentPath.length === 1 && lastCell.row === row && lastCell.col === col) {
        clickedCell.isSelected = false;
        clickedCell.isInPath = false;
        
        // Clear all canSelect states
        newGrid.forEach(r => r.forEach(c => {
          c.canSelect = false;
        }));
        
        return {
          ...prev,
          grid: newGrid,
          currentPath: []
        };
      }
      
      // If cell is selectable and path not full, add to path
      if (clickedCell.canSelect && prev.currentPath.length < 5) {
        clickedCell.isSelected = true;
        clickedCell.isInPath = true;
        
        const newPath = [...prev.currentPath, clickedCell];
        updateCanSelectStatus(newGrid, newPath);
        
        return {
          ...prev,
          grid: newGrid,
          currentPath: newPath
        };
      }
      
      return prev;
    });
  }, [gameState.gameStatus]);

  const updateCanSelectStatus = (grid: GridCell[][], currentPath: GridCell[]) => {
    // Clear all canSelect states
    grid.forEach(r => r.forEach(c => {
      c.canSelect = false;
    }));
    
    if (currentPath.length === 0) return;
    
    const lastCell = currentPath[currentPath.length - 1];
    const pathCells = new Set(currentPath.map(c => `${c.row}-${c.col}`));
    
    // Mark adjacent cells as selectable
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        
        const newRow = lastCell.row + dr;
        const newCol = lastCell.col + dc;
        
        if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 6) {
          const cellKey = `${newRow}-${newCol}`;
          if (!pathCells.has(cellKey) && currentPath.length < 5) {
            grid[newRow][newCol].canSelect = true;
          }
        }
      }
    }
  };

  const submitGuess = useCallback(() => {
    if (gameState.currentPath.length !== 5 || gameState.gameStatus !== 'playing') return;
    
    const word = pathToWord(gameState.currentPath);
    
    if (!isValidPath(gameState.currentPath)) {
      // Show invalid word message (could be handled by UI)
      return;
    }
    
    const feedback = calculateFeedback(word, gameState.targetWord);
    const guessResult: GuessResult = {
      word,
      path: [...gameState.currentPath],
      feedback
    };
    
    const isWin = feedback.every(f => f === 'correct');
    const newAttemptsLeft = gameState.attemptsLeft - 1;
    const isGameOver = isWin || newAttemptsLeft === 0;
    
    setGameState(prev => {
      const newGrid = prev.grid.map(r => r.map(c => ({
        ...c,
        isSelected: false,
        isInPath: false,
        canSelect: false
      })));
      
      return {
        ...prev,
        grid: newGrid,
        currentPath: [],
        guesses: [...prev.guesses, guessResult],
        attemptsLeft: newAttemptsLeft,
        gameStatus: isWin ? 'won' : (newAttemptsLeft === 0 ? 'lost' : 'playing')
      };
    });
  }, [gameState.currentPath, gameState.gameStatus, gameState.attemptsLeft, gameState.targetWord]);

  const clearPath = useCallback(() => {
    if (gameState.gameStatus !== 'playing') return;
    
    setGameState(prev => {
      const newGrid = prev.grid.map(r => r.map(c => ({
        ...c,
        isSelected: false,
        isInPath: false,
        canSelect: false
      })));
      
      return {
        ...prev,
        grid: newGrid,
        currentPath: []
      };
    });
  }, [gameState.gameStatus]);

  const resetGame = useCallback(() => {
    const today = getTodaysDate();
    const targetWord = gameMode === 'daily' ? getTodaysWord() : getPracticeGameWord();
    const gridSeed = gameMode === 'daily' ? today : undefined;
    const grid = createGrid(targetWord, gridSeed);
    
    const newState: GameState = {
      grid,
      targetWord,
      currentPath: [],
      guesses: [],
      attemptsLeft: MAX_ATTEMPTS,
      gameStatus: 'playing',
      currentDate: today,
      gameMode
    };
    
    setGameState(newState);
    if (gameMode === 'daily') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [gameMode]);

  return {
    gameState,
    selectCell,
    submitGuess,
    clearPath,
    resetGame,
    canSubmit: gameState.currentPath.length === 5 && gameState.gameStatus === 'playing'
  };
};