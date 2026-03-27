import React, { memo, useCallback } from 'react';
import { GridCell } from '../types/game';

interface GridProps {
  grid: GridCell[][];
  onCellClick: (row: number, col: number) => void;
}

// Get cell status description for screen readers
const getCellStatusDescription = (cell: GridCell): string => {
  if (cell.isSelected) {
    return 'Selected letter';
  }
  if (cell.isInPath) {
    return 'Letter in current path';
  }
  if (cell.canSelect) {
    return 'Available letter, can select';
  }
  return 'Letter not available';
};

// Get color description for accessibility
const getCellColorDescription = (cell: GridCell): string => {
  if (cell.isSelected) {
    return 'Yellow background, dark text';
  }
  if (cell.isInPath) {
    return 'Green background, dark text';
  }
  if (cell.canSelect) {
    return 'Yellow border, dark text with glow';
  }
  return 'Dark gray background, gray text';
};

const Grid: React.FC<GridProps> = ({ grid, onCellClick }) => {
  const handleKeyDown = useCallback((event: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        onCellClick(rowIndex, colIndex);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (rowIndex > 0) {
          const prevButton = document.querySelector(`[data-cell-id="${rowIndex - 1}-${colIndex}"]`) as HTMLButtonElement;
          prevButton?.focus();
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (rowIndex < grid.length - 1) {
          const nextButton = document.querySelector(`[data-cell-id="${rowIndex + 1}-${colIndex}"]`) as HTMLButtonElement;
          nextButton?.focus();
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (colIndex > 0) {
          const prevButton = document.querySelector(`[data-cell-id="${rowIndex}-${colIndex - 1}"]`) as HTMLButtonElement;
          prevButton?.focus();
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (colIndex < grid[0].length - 1) {
          const nextButton = document.querySelector(`[data-cell-id="${rowIndex}-${colIndex + 1}"]`) as HTMLButtonElement;
          nextButton?.focus();
        }
        break;
    }
  }, [grid, onCellClick]);

  return (
    <div
      className="grid grid-cols-6 grid-rows-6 gap-2 h-full w-full bg-surface-container-low p-2 rounded-xl"
      role="grid"
      aria-label="Game board letters"
      aria-describedby="grid-description"
    >
      <div id="grid-description" className="sr-only">
        Interactive letter grid. Use arrow keys to navigate, space or enter to select letters. Letters can be selected to form paths.
      </div>

      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const cellDescription = getCellStatusDescription(cell);
          const colorDescription = getCellColorDescription(cell);
          const ariaLabel = `Row ${rowIndex + 1}, Column ${colIndex + 1}: ${cell.letter || 'empty'}. ${cellDescription}. ${colorDescription}.`;

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              data-cell-id={`${rowIndex}-${colIndex}`}
              onClick={() => onCellClick(rowIndex, colIndex)}
              onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
              className={`
                md-grid-cell
                ${cell.isSelected
                  ? 'selected active-path-glow'
                  : cell.isInPath
                  ? 'in-path'
                  : cell.canSelect
                  ? 'available-neighbor'
                  : ''
                }
                transition-all duration-200
              `}
              role="gridcell"
              aria-label={ariaLabel}
              aria-selected={cell.isSelected}
              aria-disabled={!cell.canSelect && !cell.isInPath && !cell.isSelected}
              tabIndex={cell.canSelect || cell.isInPath || cell.isSelected ? 0 : -1}
            >
              <span className="sr-only">{cellDescription}</span>
              {cell.letter}
            </button>
          );
        })
      )}
    </div>
  );
};

export default memo(Grid);