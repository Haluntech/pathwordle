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
    return 'Blue background, white text';
  }
  if (cell.isInPath) {
    return 'Light blue background, dark blue text';
  }
  if (cell.canSelect) {
    return 'Light green background, dark green text';
  }
  return 'Light gray background, dark gray text';
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
      className="grid grid-cols-6 gap-2 sm:gap-3 p-4 sm:p-6 grid-container backdrop-blur-sm"
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
                grid-cell
                ${cell.isSelected
                  ? 'selected'
                  : cell.isInPath
                  ? 'in-path'
                  : cell.canSelect
                  ? 'available'
                  : 'unavailable'
                }
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
