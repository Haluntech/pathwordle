import React, { useEffect, useState } from 'react';
import { Trophy, X, RotateCcw, Share2 } from 'lucide-react';
import ShareResultCard from './ShareResultCard';

interface GameResultProps {
  gameStatus: 'won' | 'lost';
  targetWord: string;
  attemptsUsed: number;
  onReset: () => void;
  gameMode?: 'daily' | 'practice';
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  timeTaken?: number;
  score?: number;
  hintsUsed?: number;
  maxStreak?: number;
}

interface Confetti {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  delay: number;
}

const GameResult: React.FC<GameResultProps> = ({
  gameStatus,
  targetWord,
  attemptsUsed,
  onReset,
  gameMode = 'daily',
  difficulty = 'medium',
  timeTaken = 0,
  score = 0,
  hintsUsed = 0,
  maxStreak = 0
}) => {
  const isWon = gameStatus === 'won';
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  useEffect(() => {
    if (isWon) {
      setShowAnimation(true);
      // Generate confetti pieces
      const pieces: Confetti[] = [];
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
      
      for (let i = 0; i < 50; i++) {
        pieces.push({
          id: i,
          x: Math.random() * 100,
          y: -10,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 3
        });
      }
      
      setConfetti(pieces);
      
      // Stop animation after 4 seconds
      const timer = setTimeout(() => {
        setShowAnimation(false);
        setConfetti([]);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [isWon]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Confetti Animation */}
      {showAnimation && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
          {confetti.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-3 h-3 opacity-90"
              style={{
                left: `${piece.x}%`,
                backgroundColor: piece.color,
                transform: `rotate(${piece.rotation}deg)`,
                animation: `confetti-fall 3s linear ${piece.delay}s forwards`
              }}
            />
          ))}
        </div>
      )}
      
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center relative z-50">
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
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowShareCard(true)}
            className="
              flex items-center gap-2 mx-auto px-6 py-3 rounded-lg
              bg-purple-500 hover:bg-purple-600 text-white font-medium
              transition-colors duration-200
            "
          >
            <Share2 size={16} />
            Share Result
          </button>

          <button
            onClick={onReset}
            className="
              flex items-center gap-2 mx-auto px-6 py-3 rounded-lg
              bg-blue-500 hover:bg-blue-600 text-white font-medium
              transition-colors duration-200
            "
          >
            <RotateCcw size={16} />
            {gameMode === 'practice' ? 'Play Again' : 'Play Again Tomorrow'}
          </button>
        </div>
      </div>

      {/* Share Result Modal */}
      {showShareCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <ShareResultCard
            gameData={{
              mode: gameMode,
              difficulty,
              targetWord,
              won: isWon,
              attemptsUsed,
              timeTaken,
              score,
              perfectGame: isWon && attemptsUsed === 1,
              maxStreak,
              hintsUsed,
              date: new Date().toISOString()
            }}
            onClose={() => setShowShareCard(false)}
          />
        </div>
      )}
    </div>
  );
};

export default GameResult;