import React from 'react';

interface ThemedPuzzleModeSimpleProps {
  playerId?: string;
  onBack?: () => void;
}

const ThemedPuzzleModeSimple: React.FC<ThemedPuzzleModeSimpleProps> = ({
  playerId,
  onBack
}) => {
  const themes = [
    { name: 'Animals', icon: '🦁', description: 'Wild and domestic animals' },
    { name: 'Food', icon: '🍕', description: 'Delicious food items' },
    { name: 'Sports', icon: '⚽', description: 'Athletic activities' },
    { name: 'Nature', icon: '🌳', description: 'Natural wonders' },
    { name: 'Technology', icon: '💻', description: 'Tech and science' },
    { name: 'Music', icon: '🎵', description: 'Musical instruments' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            ← Back to Game
          </button>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            🎯 Themed Puzzle Mode
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Choose a theme and solve puzzles with related words!
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer border-2 border-purple-200 hover:border-purple-300"
              >
                <div className="text-4xl mb-3 text-center">{theme.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  {theme.name}
                </h3>
                <p className="text-gray-600 text-sm text-center mb-4">
                  {theme.description}
                </p>
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                  Play Theme
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Coming Soon:</strong> Themed puzzles will challenge you with words from specific categories. Track your progress and become a theme master!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemedPuzzleModeSimple;