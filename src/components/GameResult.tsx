import React from 'react';
import { Trophy, X, RotateCcw } from 'lucide-react';

interface GameResultProps {
  gameStatus: 'won' | 'lost';
  targetWord: string;
  attemptsUsed: number;
  onReset: () => void;
}

const GameResult: React.FC<GameResultProps> = ({
  gameStatus,
  targetWord,
  attemptsUsed,
  onReset
}) => {
  const isWon = gameStatus === 'won';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
          isWon ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {isWon ? (
            <Trophy className="w-8 h-8 text-green-600" />
          ) : (
            <X className="w-8 h-8 text-red-600" />
          )}
        </div>
        
        <h2 className={`text-2xl font-bold mb-2 ${
          isWon ? 'text-green-600' : 'text-red-600'
        }`}>
          {isWon ? 'Congratulations!' : 'Game Over'}
        </h2>
        
        <p className="text-gray-600 mb-4">
          {isWon 
            ? `You found the word in ${attemptsUsed} attempt${attemptsUsed !== 1 ? 's' : ''}!`
            : 'Better luck next time!'
          }
        </p>
        
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">The word was:</div>
          <div className="text-2xl font-bold text-gray-800 tracking-wide">
            {targetWord}
          </div>
        </div>
        
        <button
          onClick={onReset}
          className="
            flex items-center gap-2 mx-auto px-6 py-3 rounded-lg
            bg-blue-500 hover:bg-blue-600 text-white font-medium
            transition-colors duration-200
          "
        >
          <RotateCcw size={16} />
          Play Again Tomorrow
        </button>
      </div>
    </div>
  );
};

export default GameResult;