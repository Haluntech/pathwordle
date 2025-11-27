import React, { useState } from 'react';

interface TimeChallengeModeSimpleProps {
  playerId: string;
  onBack?: () => void;
}

const TimeChallengeModeSimple: React.FC<TimeChallengeModeSimpleProps> = ({
  playerId,
  onBack
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const handleStart = () => {
    setIsPlaying(true);
    setTimeLeft(60);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            ← Back to Game
          </button>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ⏱️ Time Challenge Mode
          </h1>

          <div className="mb-8">
            <div className="text-6xl font-bold text-orange-600 mb-2">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <p className="text-gray-600">
              {isPlaying ? 'Solve as many words as possible!' : 'Test your speed and skills'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">Quick Thinking</h3>
              <p className="text-orange-700 text-sm">Race against the clock to solve word puzzles</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">Beat Your Record</h3>
              <p className="text-red-700 text-sm">Challenge yourself and improve your speed</p>
            </div>
          </div>

          <div className="space-y-4">
            {!isPlaying ? (
              <button
                onClick={handleStart}
                className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-lg font-semibold"
              >
                🚀 Start Challenge
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold"
              >
                ⏹️ End Challenge
              </button>
            )}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Pro Tip:</strong> Start with easier words to build momentum, then tackle harder puzzles as you get faster!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeChallengeModeSimple;