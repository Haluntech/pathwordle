import { useState, useCallback, useMemo, useEffect } from 'react';
import { useStatistics } from './useStatistics';
import { HintEngine } from '../utils/hintEngine';
import { Hint, HintUsage, HintStatistics } from '../types/hints';
import { DIFFICULTY_CONFIGS } from '../config/difficulties';
import { GridCell } from '../types/game';

const STORAGE_KEYS = {
  HINT_USAGE: 'pathwordle_hint_usage',
  HINT_PREFERENCES: 'pathwordle_hint_preferences'
} as const;

interface UseHintsProps {
  grid: GridCell[][];
  currentPath: { row: number; col: number }[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  targetWord: string;
}

interface HintPreferences {
  autoShow: boolean;
  enableSmartHints: boolean;
  hintLevel: 'conservative' | 'normal' | 'liberal';
  soundEffects: boolean;
}

const getInitialPreferences = (): HintPreferences => ({
  autoShow: true,
  enableSmartHints: true,
  hintLevel: 'normal',
  soundEffects: true
});

export const useHints = ({
  grid,
  currentPath,
  difficulty,
  targetWord
}: UseHintsProps) => {
  const { statistics, recordGame } = useStatistics();
  const [hintEngine, setHintEngine] = useState<HintEngine | null>(null);
  const [availableHints, setAvailableHints] = useState<Hint[]>([]);
  const [usedHints, setUsedHints] = useState<HintUsage[]>([]);
  const [preferences, setPreferences] = useState<HintPreferences>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.HINT_PREFERENCES);
      return stored ? JSON.parse(stored) : getInitialPreferences();
    }
    return getInitialPreferences();
  });
  const [currentHint, setCurrentHint] = useState<any>(null);
  const [showHint, setShowHint] = useState(false);

  // Initialize hint engine
  useEffect(() => {
    // This should load from your word list
    // Temporarily use a sample word list
    const sampleWordList = [
      'HELLO', 'WORLD', 'GAME', 'PLAY', 'WORD', 'PATH', 'GRID', 'CELL',
      'LEARN', 'THINK', 'SMART', 'QUICK', 'BRAIN', 'PUZZLE', 'SOLVE',
      'FIND', 'SEARCH', 'LOOK', 'MOVE', 'STEP', 'TIME', 'WIN', 'LOSE'
    ];

    setHintEngine(new HintEngine(sampleWordList));
  }, []);

  // Create available hints based on difficulty configuration
  useEffect(() => {
    if (!hintEngine) return;

    const difficultyConfig = DIFFICULTY_CONFIGS[difficulty];
    const hints: Hint[] = [
      {
        id: 'reveal-letter',
        type: 'letter',
        title: 'Reveal Letter',
        description: 'Reveals a letter position in the target word',
        category: 'basic',
        cost: 20,
        rarity: 'common',
        icon: '🔤',
        applicableTo: ['easy', 'medium', 'hard', 'expert'],
        isAvailable: (gameState, diff) => gameState.attemptsLeft > 0,
        generateHint: (gameState, diff) => {
          const position = Math.floor(Math.random() * gameState.targetWord.length);
          return `The ${position + 1}th letter of the target word is "${gameState.targetWord[position].toUpperCase()}"`;
        },
        value: 15
      },
      {
        id: 'optimal-path',
        type: 'path',
        title: 'Optimal Path',
        description: 'Shows a possible correct path',
        category: 'intermediate',
        cost: 50,
        rarity: 'rare',
        icon: '🛤️',
        applicableTo: ['easy', 'medium', 'hard', 'expert'],
        isAvailable: (gameState, diff) => gameState.attemptsLeft > 2,
        generateHint: (gameState, diff) => {
          const hint = hintEngine.generatePathHint(grid, currentPath);
          return hint ? hint.reason : 'No path suggestion available';
        },
        value: 30
      },
      {
        id: 'letter-position',
        type: 'position',
        title: 'Letter Position',
        description: 'Tells you if a certain letter is in the target word',
        category: 'basic',
        cost: 30,
        rarity: 'common',
        icon: '📍',
        applicableTo: ['easy', 'medium', 'hard', 'expert'],
        isAvailable: (gameState, diff) => gameState.attemptsLeft > 0,
        generateHint: (gameState, diff) => {
          const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
          const randomLetter = letters[Math.floor(Math.random() * letters.length)];
          const inWord = gameState.targetWord.toUpperCase().includes(randomLetter);
          return `The letter "${randomLetter}" is ${inWord ? 'in' : 'not in'} the target word`;
        },
        value: 20
      },
      {
        id: 'word-pattern',
        type: 'pattern',
        title: 'Word Pattern',
        description: 'Analyzes possible word structure patterns',
        category: 'intermediate',
        cost: 40,
        rarity: 'rare',
        icon: '🔍',
        applicableTo: ['medium', 'hard', 'expert'],
        isAvailable: (gameState, diff) => gameState.attemptsLeft > 1,
        generateHint: (gameState, diff) => {
          const pattern = hintEngine.generatePatternHint(grid, currentPath);
          if (pattern) {
            return `Possible word pattern: ${pattern.pattern}. Next most likely letter: ${pattern.nextBestLetters[0]?.letter || 'N/A'}`;
          }
          return 'No pattern analysis available';
        },
        value: 25
      },
      {
        id: 'vocabulary-hint',
        type: 'vocabulary',
        title: 'Vocabulary Hint',
        description: 'Provides clues based on common English words',
        category: 'advanced',
        cost: 60,
        rarity: 'epic',
        icon: '📚',
        applicableTo: ['hard', 'expert'],
        isAvailable: (gameState, diff) => gameState.attemptsLeft > 2,
        generateHint: (gameState, diff) => {
          const vocabHint = hintEngine.generateVocabularyHint(grid, currentPath);
          if (vocabHint) {
            return `${vocabHint.tip}. 示例: ${vocabHint.examples.join(', ')}. ${vocabHint.explanation}`;
          }
          return 'No vocabulary hint available';
        },
        value: 40
      },
      {
        id: 'strategy-advice',
        type: 'strategy',
        title: 'Strategy Advice',
        description: 'Offers expert game strategy advice',
        category: 'advanced',
        cost: 80,
        rarity: 'legendary',
        icon: '💡',
        applicableTo: ['expert'],
        isAvailable: (gameState, diff) => gameState.attemptsLeft > 1,
        generateHint: (gameState, diff) => {
          const strategyHint = hintEngine.generateStrategyHint(grid, currentPath, diff);
          if (strategyHint) {
            return `${strategyHint.strategy} (${strategyHint.priority}). 建议: ${strategyHint.actions.join(', ')}. 原因: ${strategyHint.reasoning}`;
          }
          return 'No strategy advice available';
        },
        value: 50
      }
    ];

    // 根据难度过滤和排序提示
    const filteredHints = hints.filter(hint =>
      hint.applicableTo.includes(difficulty) &&
      hint.cost <= (statistics.gamesWon * 10 + 50) // 基于胜利次数的预算
    );

    setAvailableHints(filteredHints);
  }, [grid, currentPath, difficulty, hintEngine, statistics.gamesWon]);

  // Use hint
  const useHint = useCallback((hintId: string) => {
    const hint = availableHints.find(h => h.id === hintId);
    if (!hint) return false;

    // Check if points are sufficient
    if (statistics.gamesWon < Math.floor(hint.cost / 10)) {
      alert(`Requires ${Math.floor(hint.cost / 10)} wins to use this hint!`);
      return false;
    }

    // 生成提示内容
    let hintContent = '';
    try {
      const mockGameState = {
        targetWord,
        attemptsLeft: 3, // Assumed state
        grid,
        currentPath
      };

      hintContent = hint.generateHint(mockGameState, difficulty);
      if (!hintContent) {
        alert('This hint is temporarily unavailable, please try again later.');
        return false;
      }
    } catch (error) {
      console.error('Failed to generate hint:', error);
      alert('Error generating hint, please try again.');
      return false;
    }

    // Record hint usage
    const usage: HintUsage = {
      hintId,
      usedAt: new Date().toISOString(),
      gameState: {
        targetWord,
        attemptsLeft: 3,
        grid: grid.map(row => row.map(cell => cell.letter)).join(''),
        currentPath: currentPath.map(pos => `${pos.row},${pos.col}`).join(',')
      },
      wasHelpful: false // Awaiting user feedback
    };

    setUsedHints(prev => [...prev, usage]);
    setCurrentHint({
      ...hint,
      content: hintContent,
      usage
    });
    setShowHint(true);

    // Play sound effect
    if (preferences.soundEffects) {
      // Sound effect playback logic can be added here
      console.log('Playing hint sound effect');
    }

    return true;
  }, [availableHints, statistics, targetWord, difficulty, grid, currentPath, preferences]);

  // Provide feedback
  const provideHintFeedback = useCallback((helpful: boolean) => {
    if (currentHint) {
      const updatedUsage = {
        ...currentHint.usage,
        wasHelpful: helpful
      };

      setUsedHints(prev =>
        prev.map(usage =>
          usage.hintId === currentHint.usage.hintId ? updatedUsage : usage
        )
      );
    }
  }, [currentHint]);

  // Close hint
  const closeHint = useCallback(() => {
    setShowHint(false);
    setCurrentHint(null);
  }, []);

  // Auto-show hints
  useEffect(() => {
    if (preferences.autoShow && preferences.enableSmartHints && hintEngine) {
      // Smart hint logic
      if (currentPath.length > 0 && currentPath.length < 4) {
        const pathHint = hintEngine.generatePathHint(grid, currentPath);
        if (pathHint && pathHint.confidence > 70) {
          const autoHint = availableHints.find(h => h.type === 'path');
          if (autoHint && statistics.gamesWon >= 1) {
            // Can consider automatically displaying high-confidence hints
            console.log('Smart hint available:', pathHint.reason);
          }
        }
      }
    }
  }, [currentPath, grid, preferences, hintEngine, availableHints, statistics.gamesWon]);

  // Update preferences
  const updatePreferences = useCallback((newPrefs: Partial<HintPreferences>) => {
    setPrefs(prev => {
      const updated = { ...prev, ...newPrefs };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.HINT_PREFERENCES, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Get hint statistics
  const getHintStatistics = useCallback((): HintStatistics => {
    const hintsByType = usedHints.reduce((acc, usage) => {
      const hint = availableHints.find(h => h.id === usage.hintId);
      if (hint) {
        acc[hint.type] = (acc[hint.type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const averageHelpfulness = usedHints.length > 0
      ? usedHints.filter(usage => usage.wasHelpful).length / usedHints.length * 100
      : 0;

    const favoriteHintTypes = Object.entries(hintsByType)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);

    const hintsThisGame = usedHints.filter(usage => {
      const gameDate = new Date().toDateString();
      return new Date(usage.usedAt).toDateString() === gameDate;
    }).length;

    return {
      totalHintsUsed: usedHints.length,
      hintsByType,
      averageHelpfulness,
      favoriteHintTypes,
      hintsThisGame,
      remainingHints: Math.max(0, (statistics.gamesWon * 10 + 50) - usedHints.reduce((sum, usage) => {
        const hint = availableHints.find(h => h.id === usage.hintId);
        return sum + (hint?.cost || 0);
      }, 0))
    };
  }, [usedHints, availableHints, statistics.gamesWon]);

  // Persist hint usage records
  useEffect(() => {
    if (typeof window !== 'undefined' && usedHints.length > 0) {
      localStorage.setItem(STORAGE_KEYS.HINT_USAGE, JSON.stringify(usedHints));
    }
  }, [usedHints]);

  return {
    availableHints,
    usedHints,
    currentHint,
    showHint,
    preferences,
    useHint,
    provideHintFeedback,
    closeHint,
    updatePreferences,
    getHintStatistics
  };
};