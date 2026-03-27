import React from 'react';
import { GuessResult } from '../types/game';

interface GuessHistoryProps {
  guesses: GuessResult[];
}

const GuessHistory: React.FC<GuessHistoryProps> = ({ guesses }) => {
  const getFeedbackColor = (feedback: 'correct' | 'present' | 'absent') => {
    switch (feedback) {
      case 'correct':
        return 'bg-green-500 text-white border-green-600 border-b-4';
      case 'present':
        return 'bg-yellow-500 text-white border-yellow-600 border-b-4';
      case 'absent':
        return 'bg-gray-400 text-white border-gray-500 border-b-4';
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center lg:text-left">Guess History</h3>
      <div className="space-y-2 flex flex-col items-center lg:items-start">
        {guesses.map((guess, index) => (
          <div key={index} className="flex gap-1">
            {guess.word.split('').map((letter, letterIndex) => (
              <div
                key={letterIndex}
                className={`
                  w-10 h-10 rounded flex items-center justify-center
                  font-bold text-sm transition-colors duration-300
                  ${getFeedbackColor(guess.feedback[letterIndex])}
                `}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}
        {/* Empty slots for remaining attempts */}
        {Array.from({ length: 6 - guesses.length }).map((_, index) => (
          <div key={`empty-${index}`} className="flex gap-1">
            {Array.from({ length: 5 }).map((_, letterIndex) => (
              <div
                key={letterIndex}
                className="w-10 h-10 rounded border-2 border-gray-200 bg-gray-50"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuessHistory;