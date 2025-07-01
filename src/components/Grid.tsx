import React from 'react';
import { GridCell } from '../types/game';

interface GridProps {
  grid: GridCell[][];
  onCellClick: (row: number, col: number) => void;
}

const Grid: React.FC<GridProps> = ({ grid, onCellClick }) => {
  return (
    <div className="grid grid-cols-6 gap-2 p-4 bg-white rounded-xl shadow-lg">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <button
            key={`${rowIndex}-${colIndex}`}
            onClick={() => onCellClick(rowIndex, colIndex)}
            className={`
              w-12 h-12 rounded-lg border-2 font-bold text-lg
              transition-all duration-200 ease-in-out
              hover:scale-105 active:scale-95
              ${cell.isSelected
                ? 'bg-blue-500 text-white border-blue-600 shadow-lg scale-105'
                : cell.isInPath
                ? 'bg-blue-100 text-blue-800 border-blue-300'
                : cell.canSelect
                ? 'bg-green-50 text-green-800 border-green-300 hover:bg-green-100'
                : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
              }
            `}
          >
            {cell.letter}
          </button>
        ))
      )}
    </div>
  );
};

export default Grid;