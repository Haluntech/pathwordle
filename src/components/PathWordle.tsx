import React from 'react';
import { usePathWordle } from '../hooks/usePathWordle';
import Grid from './Grid';
import GuessHistory from './GuessHistory';
import GameControls from './GameControls';
import GameResult from './GameResult';
import { pathToWord } from '../utils/gameLogic';

interface PathWordleProps {
  gameMode?: 'daily' | 'practice';
}

const PathWordle: React.FC<PathWordleProps> = ({ gameMode = 'daily' }) => {
  const { gameState, selectCell, submitGuess, clearPath, resetGame, canSubmit } = usePathWordle(gameMode);
  
  const currentWord = gameState.currentPath.length > 0 ? pathToWord(gameState.currentPath) : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            PathWordle {gameMode === 'practice' && <span className="text-lg text-blue-600">(Practice)</span>}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect adjacent letters to form paths and guess the hidden 5-letter word. 
            Use the Wordle-style feedback to guide your next guess!
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Game Grid */}
          <div className="flex flex-col items-center gap-6">
            <Grid grid={gameState.grid} onCellClick={selectCell} />
            
            {/* Current Path Display */}
            {currentWord && (
              <div className="bg-white rounded-lg px-4 py-2 shadow-md">
                <div className="text-sm text-gray-500 mb-1">Current Path:</div>
                <div className="text-xl font-bold text-gray-800 tracking-widest">
                  {currentWord}
                </div>
              </div>
            )}
            
            <GameControls
              canSubmit={canSubmit}
              currentPathLength={gameState.currentPath.length}
              onSubmit={submitGuess}
              onClear={clearPath}
              attemptsLeft={gameState.attemptsLeft}
            />
          </div>

          {/* Guess History */}
          <div className="flex justify-center lg:justify-start">
            <GuessHistory guesses={gameState.guesses} />
          </div>
        </div>

        {/* How to Play */}
        <div className="mt-12 max-w-4xl mx-auto bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">How to Play</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-600">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Creating Paths</h3>
              <ul className="space-y-1 text-sm">
                <li>• Click letters to create a path of exactly 5 letters</li>
                <li>• Letters must be adjacent (horizontal, vertical, or diagonal)</li>
                <li>• Each letter can only be used once per path</li>
                <li>• Click the last letter in your path to remove it</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Feedback Colors</h3>
              <ul className="space-y-1 text-sm">
                <li>• <span className="inline-block w-3 h-3 bg-green-500 rounded mr-2"></span>Green: Correct letter in correct position</li>
                <li>• <span className="inline-block w-3 h-3 bg-yellow-500 rounded mr-2"></span>Yellow: Correct letter in wrong position</li>
                <li>• <span className="inline-block w-3 h-3 bg-gray-400 rounded mr-2"></span>Gray: Letter not in target word</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Game Result Modal */}
        {(gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') && (
          <GameResult
            gameStatus={gameState.gameStatus}
            targetWord={gameState.targetWord}
            attemptsUsed={6 - gameState.attemptsLeft}
            onReset={resetGame}
            gameMode={gameState.gameMode}
          />
        )}
      </div>
    </div>
  );
};

export default PathWordle;