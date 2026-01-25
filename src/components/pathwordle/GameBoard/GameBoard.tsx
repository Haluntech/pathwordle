import React, { memo } from 'react';
import { GameGrid, GridCell } from '../../../types/game';
import Grid from '../../Grid';
import GameControls from '../../GameControls';
import { CurrentPathDisplay } from '../CurrentPathDisplay';

interface GameBoardProps {
  grid: GameGrid;
  currentPath: GridCell[];
  attemptsLeft: number;
  currentWord: string;
  canSubmit: boolean;
  onCellClick: (row: number, col: number) => void;
  onClear: () => void;
  onSubmit: () => void;
}

/**
 * GameBoard Component
 *
 * Main game board containing the grid and controls
 */
export const GameBoard = memo(({
  grid,
  currentPath,
  attemptsLeft,
  currentWord,
  canSubmit,
  onCellClick,
  onClear,
  onSubmit
}: GameBoardProps) => {
  return (
    <div className="flex flex-col items-center gap-6" role="main" aria-label="Game board">
      {/* Game Grid */}
      <Grid grid={grid} onCellClick={onCellClick} />

      {/* Current Path Display */}
      <CurrentPathDisplay
        currentWord={currentWord}
        onClear={onClear}
        onSubmit={onSubmit}
        canSubmit={canSubmit}
        pathLength={currentPath.length}
      />

      {/* Desktop Game Controls (hidden on mobile) */}
      <div className="hidden lg:block">
        <GameControls
          canSubmit={canSubmit}
          currentPathLength={currentPath.length}
          onSubmit={onSubmit}
          onClear={onClear}
          attemptsLeft={attemptsLeft}
        />
      </div>
    </div>
  );
});

GameBoard.displayName = 'GameBoard';

export default GameBoard;
