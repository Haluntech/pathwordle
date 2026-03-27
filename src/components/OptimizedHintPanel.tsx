import React, { useState, memo, useCallback, useMemo } from 'react';
import { Lightbulb, X, Sparkles, Wand2, Eye, Target, ArrowRight } from 'lucide-react';

interface OptimizedHintPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onUseHint: (hintId: string) => void;
  targetWord?: string;
  currentPath: string;
  attemptsLeft: number;
}

interface QuickHint {
  id: string;
  title: string;
  icon: any;
  description: string;
  type: 'letter' | 'position' | 'pattern' | 'strategy';
}

const OptimizedHintPanel: React.FC<OptimizedHintPanelProps> = ({
  isVisible,
  onClose,
  onUseHint,
  targetWord,
  currentPath,
  attemptsLeft
}) => {
  const [selectedHint, setSelectedHint] = useState<string | null>(null);

  // Generate intelligent hints based on game state
  const generateHints = useCallback((): QuickHint[] => {
    if (!targetWord) return [];

    const hints: QuickHint[] = [];
    const targetLetters = targetWord.toUpperCase().split('');
    const currentLetters = currentPath.toUpperCase().split('');

    // Analyze what's already on the grid vs target
    const correctPositions = currentLetters.filter((letter, i) =>
      letter === targetLetters[i]
    ).length;

    const wrongLetters = currentLetters.filter((letter, i) =>
      i < targetLetters.length && letter !== targetLetters[i]
    );

    // Priority 1: If just starting, give directional hint
    if (!currentPath || currentPath.length === 0) {
      hints.push({
        id: 'first-letter',
        title: 'Get started',
        icon: Target,
        description: `The word begins with "${targetLetters[0]}" and ends with "${targetLetters[targetLetters.length - 1]}"`,
        type: 'letter'
      });

      // Add common letter hint
      const commonLetters = targetLetters.filter((letter, i, arr) =>
        arr.indexOf(letter) === i && ['E', 'A', 'R', 'I', 'O', 'T', 'N', 'S'].includes(letter)
      );
      if (commonLetters.length > 0) {
        hints.push({
          id: 'common-letters',
          title: 'Common letters',
          icon: Sparkles,
          description: `Contains ${commonLetters.length} common letters: ${[...new Set(commonLetters)].join(', ')}`,
          type: 'pattern'
        });
      }
    }

    // Priority 2: Show current progress
    if (currentPath.length > 0) {
      if (correctPositions > 0) {
        hints.push({
          id: 'progress-good',
          title: 'Good progress!',
          icon: Sparkles,
          description: `${correctPositions} of ${currentLetters.length} letters are correct. Keep going!`,
          type: 'pattern'
        });
      } else {
        hints.push({
          id: 'progress-reset',
          title: 'Try a different path',
          icon: Wand2,
          description: `Current path isn't matching. Try clear and start over.`,
          type: 'strategy'
        });
      }
    }

    // Priority 3: Strategic hints based on attempts left
    if (attemptsLeft <= 3 && currentPath.length === 0) {
      const vowels = targetLetters.filter(l => 'AEIOU'.includes(l));
      const consonants = targetLetters.filter(l => !'AEIOU'.includes(l));

      if (vowels.length >= consonants.length) {
        hints.push({
          id: 'vowel-strategy',
          title: 'Vowel-heavy word',
          icon: Wand2,
          description: `This word has ${vowels.length} vowels. Try vowel paths first.`,
          type: 'strategy'
        });
      } else {
        hints.push({
          id: 'consonant-strategy',
          title: 'Consonant-heavy word',
          icon: Wand2,
          description: `This word has ${consonants.length} consonants. Focus on consonant clusters.`,
          type: 'strategy'
        });
      }
    }

    // Priority 4: Reveal next letter (only if struggling)
    if (attemptsLeft <= 2 && currentPath.length > 0 && currentPath.length < targetLetters.length) {
      const nextPos = currentPath.length;
      const nextLetter = targetLetters[nextPos];

      hints.push({
        id: 'next-letter-reveal',
        title: 'Stuck? Here\'s a hint',
        icon: Eye,
        description: `The ${nextPos + 1}${getOrdinalSuffix(nextPos + 1)} letter is "${nextLetter}"`,
        type: 'position'
      });
    }

    return hints;
  }, [targetWord, currentPath, attemptsLeft]);

  // Helper function for ordinal suffixes
  function getOrdinalSuffix(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    if (v >= 11 && v <= 13) return "th";
    return s[(v - 1) % 10] || "th";
  }

  const hints = useMemo(() => generateHints(), [generateHints]);

  if (!isVisible) return null;

  const handleHintClick = (hintId: string) => {
    setSelectedHint(hintId);
    onUseHint(hintId);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setSelectedHint(null);
    }, 3000);
  };

  const getHintColor = (type: string) => {
    const colors = {
      letter: 'bg-primary/20 text-primary border-primary/30',
      position: 'bg-secondary/20 text-secondary border-secondary/30',
      pattern: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      strategy: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    return colors[type as keyof typeof colors] || colors.letter;
  };

  return (
    <div className="fixed bottom-24 right-4 z-40">
      <div className="bg-surface-container-high rounded-2xl shadow-2xl border border-surface-container-highest overflow-hidden max-w-sm">
        {/* Header */}
        <div className="bg-surface-container-highest px-4 py-3 border-b border-surface-container-high">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">Smart Hints</h3>
                <p className="text-xs text-on-surface-variant">AI-powered suggestions</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-surface-container-low transition-colors"
              aria-label="Close hints"
            >
              <X className="w-4 h-4 text-on-surface-variant" />
            </button>
          </div>
        </div>

        {/* Hints List */}
        <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
          {hints.length === 0 ? (
            <div className="text-center py-6 text-on-surface-variant text-sm">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No hints available yet</p>
              <p className="text-xs mt-1">Start playing to unlock hints</p>
            </div>
          ) : (
            hints.map((hint) => {
              const Icon = hint.icon;
              return (
                <button
                  key={hint.id}
                  onClick={() => handleHintClick(hint.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-200 hover:scale-102 active:scale-98 ${getHintColor(hint.type)}`}
                  aria-label={hint.title}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 p-2 bg-background/50 rounded-lg">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-on-surface mb-0.5 truncate">
                        {hint.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant line-clamp-2">
                        {hint.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer with hint count */}
        {hints.length > 0 && (
          <div className="px-4 py-2 bg-surface-container-low border-t border-surface-container-high">
            <div className="flex items-center justify-between text-xs text-on-surface-variant">
              <span>{hints.length} hint{hints.length !== 1 ? 's' : ''} available</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Free to use
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Floating notification when hint is used */}
      {selectedHint && (
        <div className="absolute -top-16 right-0 bg-primary text-on-primary px-4 py-2 rounded-xl shadow-lg animate-pulse">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Hint revealed!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(OptimizedHintPanel);
