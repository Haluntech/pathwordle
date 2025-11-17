import React, { useState } from 'react';
import { useStatistics } from '../hooks/useStatistics';
import { DIFFICULTY_CONFIGS, isDifficultyUnlocked, getDifficultyProgress } from '../config/difficulties';
import { DifficultyConfig } from '../config/difficulties';
import { Lock, Play, Trophy, Clock, Star, ChevronRight } from 'lucide-react';

interface DifficultySelectorProps {
  selectedDifficulty: DifficultyConfig['id'];
  onDifficultySelect: (difficulty: DifficultyConfig['id']) => void;
  showLocked?: boolean;
  compact?: boolean;
}

const DifficultyCard: React.FC<{
  config: DifficultyConfig;
  isSelected: boolean;
  isUnlocked: boolean;
  progress: number;
  onSelect: () => void;
  compact?: boolean;
}> = ({ config, isSelected, isUnlocked, progress, onSelect, compact = false }) => {
  const getUnlockMessage = () => {
    if (isUnlocked) return null;
    if (!config.unlockRequirement) return null;

    const messages = {
      games_won: `Win ${config.unlockRequirement.value} games to unlock`,
      streak: `Achieve a ${config.unlockRequirement.value} streak to unlock`,
      average_time: `Average time less than ${config.unlockRequirement.value} seconds to unlock`,
      completion_rate: `Achieve a ${config.unlockRequirement.value}% win rate to unlock`
    };

    return messages[config.unlockRequirement.type];
  };

  if (compact) {
    return (
      <button
        onClick={isUnlocked ? onSelect : undefined}
        disabled={!isUnlocked}
        className={`
          relative p-4 rounded-lg border-2 transition-all duration-200
          ${isSelected
            ? `${config.bgColor} ${config.borderColor} border-4 scale-105 shadow-lg`
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
          }
          ${!isUnlocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isUnlocked && !isSelected ? 'hover:scale-105' : ''}
        `}
        aria-label={`Select ${config.name} difficulty${!isUnlocked ? ' (Locked)' : ''}`}
        aria-pressed={isSelected}
        aria-disabled={!isUnlocked}
      >
        {/* Lock status indicator */}
        {!isUnlocked && (
          <div className="absolute top-2 right-2">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${config.bgColor} ${config.color}
          `}>
            <Play className="w-6 h-6" />
          </div>
          <div className="text-left flex-1">
            <h3 className={`font-bold ${config.color}`}>{config.name}</h3>
            <p className="text-sm text-gray-600">{config.description}</p>
          </div>
          {isUnlocked && (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>

        {/* Unlock progress bar */}
        {!isUnlocked && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>{getUnlockMessage()}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={isUnlocked ? onSelect : undefined}
      disabled={!isUnlocked}
      className={`
        relative p-6 rounded-xl border-2 transition-all duration-200
        ${isSelected
          ? `${config.bgColor} ${config.borderColor} border-4 scale-105 shadow-xl`
          : 'border-gray-200 hover:border-gray-300 hover:shadow-lg hover:scale-105'
        }
        ${!isUnlocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${isUnlocked && !isSelected ? config.bgColor : ''}
      `}
      aria-label={`Select ${config.name} difficulty${!isUnlocked ? ' (Locked)' : ''}`}
      aria-pressed={isSelected}
      aria-disabled={!isUnlocked}
    >
      {/* 锁定状态指示器 */}
      {!isUnlocked && (
        <div className="absolute top-4 right-4">
          <div className="bg-gray-100 rounded-full p-2">
            <Lock className="w-6 h-6 text-gray-500" />
          </div>
        </div>
      )}

      {/* Difficulty icon and name */}
      <div className="flex items-center gap-4 mb-4">
        <div className={`
          w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold
          ${config.bgColor} ${config.color}
          ${isUnlocked ? 'shadow-lg' : 'opacity-50'}
        `}>
          {config.name.charAt(0)}
        </div>
        <div className="text-left">
          <h3 className={`text-2xl font-bold ${config.color}`}>{config.name}</h3>
          <p className="text-gray-600 mt-1">{config.description}</p>
        </div>
      </div>

      {/* Difficulty specifications */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-gray-700">
            {config.scoring.basePoints} Base Score
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="text-gray-700">
            {config.gridConfig.pathLength} Letter Path
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Star className="w-4 h-4 text-purple-500" />
          <span className="text-gray-700">
            {config.gridConfig.size}×{config.gridConfig.size} Grid
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Play className="w-4 h-4 text-green-500" />
          <span className="text-gray-700">
            {config.wordConfig.minLength}-{config.wordConfig.maxLength} Letter Word
          </span>
        </div>
      </div>

      {/* Special features */}
      <div className="flex flex-wrap gap-2">
        {config.feedback.showTimer && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            ⏱️ Timed
          </span>
        )}
        {config.feedback.showHints && (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            💡 {config.feedback.hintsCount} Hints
          </span>
        )}
        {config.scoring.timeBonus && (
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
            ⚡ Time Bonus
          </span>
        )}
        {config.scoring.perfectBonus && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
            🎯 Perfect Bonus
          </span>
        )}
        {config.gridConfig.timeLimit && (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
            ⏰ {Math.floor(config.gridConfig.timeLimit / 60)}Minute Time Limit
          </span>
        )}
      </div>

      {/* Unlock progress */}
      {!isUnlocked && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>🔒 {getUnlockMessage()}</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Selected indicator */}
      {isSelected && isUnlocked && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-green-500 text-white rounded-full p-1">
            <Play className="w-4 h-4" />
          </div>
        </div>
      )}
    </button>
  );
};

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty,
  onDifficultySelect,
  showLocked = true,
  compact = false
}) => {
  const { statistics } = useStatistics();
  const [hoveredDifficulty, setHoveredDifficulty] = useState<DifficultyConfig['id'] | null>(null);

  const difficulties = Object.values(DIFFICULTY_CONFIGS);

  const handleDifficultySelect = (difficulty: DifficultyConfig['id']) => {
    const isUnlocked = isDifficultyUnlocked(difficulty, statistics);
    if (isUnlocked) {
      onDifficultySelect(difficulty);
    }
  };

  if (compact) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {difficulties.map(config => {
          const isUnlocked = isDifficultyUnlocked(config.id, statistics);
          const progress = getDifficultyProgress(config.id, statistics);

          return (
            <DifficultyCard
              key={config.id}
              config={config}
              isSelected={selectedDifficulty === config.id}
              isUnlocked={isUnlocked}
              progress={progress}
              onSelect={() => handleDifficultySelect(config.id)}
              compact
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Difficulty</h2>
        <p className="text-gray-600">
          Choose a difficulty level that matches your skill to unlock higher challenges!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {difficulties.map(config => {
          const isUnlocked = isDifficultyUnlocked(config.id, statistics);
          const progress = getDifficultyProgress(config.id, statistics);

          // If locked difficulties are not to be shown, and the current one is locked, skip it
          if (!showLocked && !isUnlocked) {
            return null;
          }

          return (
            <DifficultyCard
              key={config.id}
              config={config}
              isSelected={selectedDifficulty === config.id}
              isUnlocked={isUnlocked}
              progress={progress}
              onSelect={() => handleDifficultySelect(config.id)}
            />
          );
        })}
      </div>

      {/* Hint information */}
      <div className="text-center text-sm text-gray-500 mt-4">
        <p>
          💡 Tip: Complete more games to unlock higher difficulty levels
        </p>
        <p>
          🎯 Each difficulty offers unique challenges and reward mechanisms
        </p>
      </div>
    </div>
  );
};

export default DifficultySelector;