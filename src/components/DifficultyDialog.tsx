import React from 'react';
import DifficultySelector from './DifficultySelector';
import { DifficultyConfig } from '../config/difficulties';
import { X } from 'lucide-react';

interface DifficultyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDifficulty: DifficultyConfig['id'];
  onDifficultySelect: (difficulty: DifficultyConfig['id']) => void;
  gameMode?: 'daily' | 'practice' | 'timed';
}

const DifficultyDialog: React.FC<DifficultyDialogProps> = ({
  isOpen,
  onClose,
  selectedDifficulty,
  onDifficultySelect,
  gameMode = 'practice'
}) => {
  if (!isOpen) return null;

  const handleDifficultySelect = (difficulty: DifficultyConfig['id']) => {
    onDifficultySelect(difficulty);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="difficulty-dialog-title"
        onClick={handleBackdropClick}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="difficulty-dialog-title" className="text-2xl font-bold text-gray-800">
                Difficulty Settings
              </h2>
              <p className="text-gray-500 mt-1">
                {gameMode === 'daily'
                  ? 'Choose your difficulty for the daily challenge'
                  : gameMode === 'timed'
                  ? 'Choose your difficulty for the time challenge'
                  : 'Adjust the game difficulty settings'
                }
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <DifficultySelector
            selectedDifficulty={selectedDifficulty}
            onDifficultySelect={handleDifficultySelect}
            showLocked={true}
            compact={false}
          />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 rounded-b-xl bg-gray-50/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Complete games to unlock higher difficulty levels</p>
              <p>🏆 Higher difficulty grants more points and achievements</p>
            </div>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all shadow-md active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DifficultyDialog;