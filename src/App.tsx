import React, { useState } from 'react';
import PathWordle from './components/PathWordle';

function App() {
  const [gameMode, setGameMode] = useState<'daily' | 'practice'>('daily');

  return (
    <div>
      {/* Game Mode Selector */}
      <div className="fixed top-4 right-4 z-30">
        <div className="bg-white rounded-lg shadow-lg p-2 flex gap-2">
          <button
            onClick={() => setGameMode('daily')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              gameMode === 'daily'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setGameMode('practice')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              gameMode === 'practice'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Practice
          </button>
        </div>
      </div>
      
      <PathWordle gameMode={gameMode} />
    </div>
  );
}

export default App;