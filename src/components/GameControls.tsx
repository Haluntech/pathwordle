import React from 'react';
import { Trash2, Send, Lightbulb } from 'lucide-react';

interface GameControlsProps {
  canSubmit: boolean;
  currentPathLength: number;
  onSubmit: () => void;
  onClear: () => void;
  onHint: () => void;
  attemptsLeft: number;
  hintUsed: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  canSubmit,
  currentPathLength,
  onSubmit,
  onClear,
  onHint,
  attemptsLeft,
  hintUsed
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
      
      <div className="flex gap-3">
        <button
          onClick={onClear}
          disabled={currentPathLength === 0}
          className="
            flex items-center gap-2 px-4 py-2 rounded-lg
            bg-red-500 hover:bg-red-600 disabled:bg-gray-300
            text-white font-medium transition-colors duration-200
            disabled:cursor-not-allowed
          "
        >
          <Trash2 size={16} />
          Clear
        </button>
        
        <button
          onClick={onHint}
          disabled={hintUsed}
          className="
            flex items-center gap-2 px-4 py-2 rounded-lg
            bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300
            text-white font-medium transition-colors duration-200
            disabled:cursor-not-allowed
          "
        >
          <Lightbulb size={16} />
          Hint
        </button>

        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="
            flex items-center gap-2 px-6 py-2 rounded-lg
            bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300
            text-white font-medium transition-colors duration-200
            disabled:cursor-not-allowed
          "
        >
          <Send size={16} />
          Submit
        </button>
      </div>
    </div>
  );
};

export default GameControls;