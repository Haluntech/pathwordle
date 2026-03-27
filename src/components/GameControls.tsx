import React from 'react';
import { Trash2, Send } from 'lucide-react';

interface GameControlsProps {
  canSubmit: boolean;
  currentPathLength: number;
  onSubmit: () => void;
  onClear: () => void;
  attemptsLeft: number;
}

const GameControls: React.FC<GameControlsProps> = ({
  canSubmit,
  currentPathLength,
  onSubmit,
  onClear,
  attemptsLeft
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <div className="text-sm font-medium text-gray-600">
          Path Length: {currentPathLength}/5
        </div>
        <div className="text-sm font-medium text-gray-600">
          Attempts Left: {attemptsLeft}
        </div>
      </div>
      
      <div className="flex gap-4 w-full max-w-xs">
        <button
          onClick={onClear}
          disabled={currentPathLength === 0}
          className="
            flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
            bg-red-50 hover:bg-red-100 text-red-600 disabled:bg-gray-100 disabled:text-gray-400
            font-bold transition-colors duration-200
            disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500
          "
        >
          <Trash2 size={18} />
          Clear
        </button>
        
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="
            flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl
            bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
            disabled:from-gray-300 disabled:to-gray-300 disabled:shadow-none
            text-white font-bold shadow-md shadow-blue-500/30 transition-all duration-200
            disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        >
          <Send size={18} />
          Submit
        </button>
      </div>
    </div>
  );
};

export default GameControls;