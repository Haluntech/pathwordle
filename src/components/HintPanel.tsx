import React, { useState, memo, useCallback, useMemo } from 'react';
import { Hint, HintPreferences } from '../types/hints';
import { useHints } from '../hooks/useHints';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Lightbulb,
  X,
  ThumbsUp,
  ThumbsDown,
  Info,
  Star,
  Clock,
  TrendingUp,
  Settings,
  HelpCircle
} from 'lucide-react';

interface HintPanelProps {
  grid: any[][];
  currentPath: { row: number; col: number }[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  targetWord: string;
  isVisible: boolean;
  onClose: () => void;
  compact?: boolean;
}

interface HintCardProps {
  hint: Hint;
  onUse: (hintId: string) => boolean;
  isAvailable: boolean;
  userPoints: number;
}

const HintCard: React.FC<HintCardProps> = memo(({ hint, onUse, isAvailable, userPoints }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleUse = useCallback(async () => {
    if (isAvailable) {
      setIsLoading(true);
      const success = onUse(hint.id);
      setIsLoading(false);

      if (success) {
        // Add success animation or sound effect
        console.log(`Used hint: ${hint.title}`);
      }
    }
  }, [hint.id, isAvailable, onUse]);

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'border-gray-300 bg-gray-50',
      rare: 'border-blue-300 bg-blue-50',
      epic: 'border-purple-300 bg-purple-50',
      legendary: 'border-yellow-400 bg-yellow-50'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getRarityLabel = (rarity: string) => {
    const labels = {
      common: 'Common',
      rare: 'Rare',
      epic: 'Epic',
      legendary: 'Legendary'
    };
    return labels[rarity as keyof typeof labels] || 'Common';
  };

  return (
    <div className={`
      border-2 rounded-lg p-4 transition-all duration-200
      ${getRarityColor(hint.rarity)}
      ${isAvailable ? 'hover:shadow-md hover:scale-105 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
    `}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{hint.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-800">{hint.title}</h4>
              <span className={`
                text-xs px-2 py-1 rounded-full font-medium
                ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
              `}>
                {getRarityLabel(hint.rarity)}
              </span>
            </div>
            <p className="text-sm text-gray-600">{hint.description}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-700">{hint.cost} {t('common.points', 'points')}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-gray-700">{hint.value} {t('common.value', 'value')}</span>
          </div>
        </div>

        <button
          onClick={handleUse}
          disabled={!isAvailable || isLoading}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all duration-200
            ${isAvailable && !isLoading
              ? 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }
            flex items-center gap-2
          `}
          aria-label={`Use ${hint.title} hint`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>{t('common.loading', 'Loading')}...</span>
            </>
          ) : (
            <>
              <Lightbulb className="w-4 h-4" />
              <span>{t('common.use', 'Use')}</span>
            </>
          )}
        </button>
      </div>

      {!isAvailable && (
        <div className="mt-2 text-xs text-red-600">
          Requires {Math.ceil(hint.cost / 10)} wins to use this hint
        </div>
      )}
    </div>
  );
});

HintCard.displayName = 'HintCard';

const HintPanel: React.FC<HintPanelProps> = ({
  grid,
  currentPath,
  difficulty,
  targetWord,
  isVisible,
  onClose,
  compact = false
}) => {
  const { t } = useLanguage();
  const {
    availableHints,
    currentHint,
    showHint,
    preferences,
    useHint,
    usedHints,
    provideHintFeedback,
    closeHint,
    updatePreferences,
    getHintStatistics
  } = useHints({ grid, currentPath, difficulty, targetWord });

  const [showSettings, setShowSettings] = useState(false);

  // Use useMemo to cache statistics data, avoiding frequent recalculation
  const stats = useMemo(() => {
    return getHintStatistics();
  }, [usedHints.length]); // Only recalculate when the number of used hints changes

  // Calculate user points
  const userPoints = useMemo(() => {
    return getHintStatistics().remainingHints;
  }, [stats]);

  if (!isVisible) return null;

  const handleUseHint = useCallback((hintId: string) => {
    return useHint(hintId);
  }, [useHint]);

  const handleFeedback = useCallback((helpful: boolean) => {
    provideHintFeedback(helpful);
    closeHint();
  }, [provideHintFeedback, closeHint]);

  const handlePreferenceChange = useCallback((key: keyof HintPreferences, value: any) => {
    updatePreferences({ [key]: value });
  }, [updatePreferences]);

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Smart Hints</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label="Close hints"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {availableHints.slice(0, 3).map(hint => (
            <HintCard
              key={hint.id}
              hint={hint}
              onUse={handleUseHint}
              isAvailable={true}
              userPoints={userPoints}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Hint Panel */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Lightbulb className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Smart Hint System</h2>
                  <p className="text-gray-600">
                    Personalized suggestions based on current game state
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Hint settings"
                >
                  <Settings className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close hints"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Hint Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={preferences.autoShow}
                      onChange={(e) => handlePreferenceChange('autoShow', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Auto-show smart hints</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={preferences.enableSmartHints}
                      onChange={(e) => handlePreferenceChange('enableSmartHints', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Enable smart hints</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={preferences.soundEffects}
                      onChange={(e) => handlePreferenceChange('soundEffects', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Hint sound effects</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Hint level:</span>
                    <select
                      value={preferences.hintLevel}
                      onChange={(e) => handlePreferenceChange('hintLevel', e.target.value)}
                      className="text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="conservative">Conservative</option>
                      <option value="normal">Standard</option>
                      <option value="liberal">Liberal</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-700">{t('hints.pointBalance', 'Point Balance')}: {userPoints}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-700">{t('hints.hintsUsed', 'Hints Used')}: {stats.totalHintsUsed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700">{t('hints.helpfulness', 'Helpfulness')}: {Math.round(stats.averageHelpfulness)}%</span>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {showSettings ? 'Collapse Settings' : 'More Settings'}
              </button>
            </div>
          </div>

          {/* Hint List */}
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  Available Hints ({availableHints.length})
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {availableHints.map(hint => (
                    <HintCard
                      key={hint.id}
                      hint={hint}
                      onUse={handleUseHint}
                      isAvailable={userPoints >= hint.cost}
                      userPoints={userPoints}
                    />
                  ))}
                </div>
              </div>

              {stats.totalHintsUsed > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-500" />
                    Hint Usage History
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Total Usage</div>
                        <div className="font-semibold text-gray-800">{stats.totalHintsUsed}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Current Game</div>
                        <div className="font-semibold text-gray-800">{stats.hintsThisGame}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Most Useful Type</div>
                        <div className="font-semibold text-gray-800">
                          {stats.favoriteHintTypes[0] || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">{t('hints.remainingPoints', 'Remaining Points')}</div>
                        <div className="font-semibold text-gray-800">{stats.remainingHints}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hint Content Popup */}
      {showHint && currentHint && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="text-3xl">{currentHint.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{currentHint.title}</h3>
                <p className="text-gray-600 text-sm">{currentHint.description}</p>
              </div>
              <button
                onClick={closeHint}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close hint content"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <p className="text-gray-800 leading-relaxed">{currentHint.content}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Was this hint helpful?</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFeedback(true)}
                  className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  aria-label="Hint was helpful"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">Helpful</span>
                </button>
                <button
                  onClick={() => handleFeedback(false)}
                  className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  aria-label="Hint was not helpful"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span className="text-sm">Not Helpful</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(HintPanel);