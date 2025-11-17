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
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="difficulty-dialog-title" className="text-2xl font-bold text-gray-800">
                选择难度
              </h2>
              <p className="text-gray-600 mt-1">
                {gameMode === 'daily'
                  ? '选择今日挑战的难度'
                  : gameMode === 'timed'
                  ? '选择限时挑战的难度'
                  : '选择练习模式的难度'
                }
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="关闭难度选择"
            >
              <X className="w-6 h-6 text-gray-500" />
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
        <div className="border-t border-gray-200 p-6 rounded-b-xl bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>💡 完成游戏可以解锁更高级别的难度</p>
              <p>🏆 更高难度 = 更高分数和成就奖励</p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DifficultyDialog;