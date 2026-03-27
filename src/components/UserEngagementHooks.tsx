import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Flame, Star, Zap, Heart, Share2 } from 'lucide-react';

// Engagement hook types
type EngagementTrigger =
  | 'first_win'
  | 'streak_3'
  | 'streak_7'
  | 'perfect_game'
  | 'fast_win'
  | 'achievement_unlock'
  | 'daily_complete'
  | 'social_challenge';

interface EngagementHook {
  id: string;
  trigger: EngagementTrigger;
  title: string;
  message: string;
  icon: any;
  action?: {
    label: string;
    callback: () => void;
  };
  dismissible: boolean;
  priority: 'low' | 'medium' | 'high';
}

// Engagement hooks configuration
const ENGAGEMENT_HOOKS: Record<string, Omit<EngagementHook, 'id'>> = {
  first_win: {
    trigger: 'first_win',
    title: '🎉 Your First Victory!',
    message: 'Congratulations! You\'ve won your first game. Want to challenge your friends?',
    icon: Trophy,
    action: {
      label: 'Share Results',
      callback: () => {}
    },
    dismissible: true,
    priority: 'high'
  },
  streak_3: {
    trigger: 'streak_3',
    title: '🔥 You\'re on Fire!',
    message: '3 wins in a row! Keep the streak going!',
    icon: Flame,
    action: {
      label: 'Play Again',
      callback: () => {}
    },
    dismissible: true,
    priority: 'medium'
  },
  streak_7: {
    trigger: 'streak_7',
    title: '⭐ Week Warrior!',
    message: '7-day streak! You\'re a true PathWordle master!',
    icon: Star,
    action: {
      label: 'Share Achievement',
      callback: () => {}
    },
    dismissible: false,
    priority: 'high'
  },
  perfect_game: {
    trigger: 'perfect_game',
    title: '💯 Perfect Game!',
    message: 'You guessed it on the first try! Absolutely incredible!',
    icon: Zap,
    action: {
      label: 'Show Off',
      callback: () => {}
    },
    dismissible: false,
    priority: 'high'
  },
  fast_win: {
    trigger: 'fast_win',
    title: '⚡ Speed Demon!',
    message: 'Lightning fast win! Under 30 seconds - impressive!',
    icon: Zap,
    action: {
      label: 'Share Speed',
      callback: () => {}
    },
    dismissible: true,
    priority: 'medium'
  },
  daily_complete: {
    trigger: 'daily_complete',
    title: '✅ Daily Complete!',
    message: 'Come back tomorrow for a new challenge!',
    icon: Trophy,
    action: {
      label: 'Set Reminder',
      callback: () => {}
    },
    dismissible: true,
    priority: 'low'
  }
};

interface UserEngagementHooksProps {
  gameStats?: {
    gamesPlayed: number;
    streak: number;
    maxStreak: number;
    lastPlayed: string;
  };
  lastGame?: {
    won: boolean;
    attemptsUsed: number;
    timeTaken: number;
  };
  onAction?: (hookId: string, action: string) => void;
}

const UserEngagementHooks: React.FC<UserEngagementHooksProps> = ({
  gameStats,
  lastGame,
  onAction
}) => {
  const [activeHooks, setActiveHooks] = useState<EngagementHook[]>([]);
  const [dismissedHooks, setDismissedHooks] = useState<Set<string>>(new Set());
  const [shownHooks, setShownHooks] = useState<Set<string>>(new Set()); // Track which hooks have been shown

  // Determine which hooks to trigger
  useEffect(() => {
    if (!gameStats || !lastGame) return;

    const newHooks: EngagementHook[] = [];

    // First win
    if (lastGame.won && gameStats.gamesPlayed === 1 && !shownHooks.has('first_win')) {
      newHooks.push({
        id: 'first_win',
        ...ENGAGEMENT_HOOKS.first_win
      });
      setShownHooks(prev => new Set(prev).add('first_win'));
    }

    // Streak achievements - only trigger when reaching exactly that number
    if (gameStats.streak === 3 && !shownHooks.has('streak_3')) {
      newHooks.push({
        id: 'streak_3',
        ...ENGAGEMENT_HOOKS.streak_3
      });
      setShownHooks(prev => new Set(prev).add('streak_3'));
    } else if (gameStats.streak === 7 && !shownHooks.has('streak_7')) {
      newHooks.push({
        id: 'streak_7',
        ...ENGAGEMENT_HOOKS.streak_7
      });
      setShownHooks(prev => new Set(prev).add('streak_7'));
    }

    // Perfect game (first try win)
    if (lastGame.won && lastGame.attemptsUsed === 1 && !shownHooks.has('perfect_game')) {
      newHooks.push({
        id: 'perfect_game',
        ...ENGAGEMENT_HOOKS.perfect_game
      });
      setShownHooks(prev => new Set(prev).add('perfect_game'));
    }

    // Fast win (under 30 seconds) - only show once per session
    if (lastGame.won && lastGame.timeTaken < 30 && !shownHooks.has('fast_win')) {
      newHooks.push({
        id: 'fast_win',
        ...ENGAGEMENT_HOOKS.fast_win
      });
      setShownHooks(prev => new Set(prev).add('fast_win'));
    }

    // Daily complete - only show once per day, not randomly
    const today = new Date().toDateString();
    if (lastGame.won && !shownHooks.has(`daily_complete_${today}`)) {
      // Only show 30% of the time
      if (Math.random() > 0.7) {
        newHooks.push({
          id: 'daily_complete',
          ...ENGAGEMENT_HOOKS.daily_complete
        });
        setShownHooks(prev => new Set(prev).add(`daily_complete_${today}`));
      }
    }

    // Filter out dismissed hooks
    const filteredHooks = newHooks.filter(hook => !dismissedHooks.has(hook.id));

    setActiveHooks(filteredHooks);
  }, [gameStats, lastGame, dismissedHooks]);

  const handleDismiss = useCallback((hookId: string) => {
    setDismissedHooks(prev => new Set(prev).add(hookId));
    setActiveHooks(prev => prev.filter(h => h.id !== hookId));
  }, []);

  const handleAction = useCallback((hook: EngagementHook) => {
    if (hook.action) {
      hook.action.callback();
      if (onAction) {
        onAction(hook.id, hook.action.label);
      }
    }
    handleDismiss(hook.id);
  }, [onAction, handleDismiss]);

  if (activeHooks.length === 0) return null;

  // Sort by priority
  const sortedHooks = [...activeHooks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Show only the highest priority hook
  const hook = sortedHooks[0];
  const Icon = hook.icon;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
      <div className="bg-surface-container-high rounded-xl p-4 shadow-2xl border border-primary/30">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-on-surface mb-1">{hook.title}</h4>
            <p className="text-xs text-on-surface-variant mb-3">{hook.message}</p>

            {hook.action && (
              <button
                onClick={() => handleAction(hook)}
                className="w-full px-3 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-dim transition-colors"
              >
                {hook.action.label}
              </button>
            )}
          </div>

          {hook.dismissible && (
            <button
              onClick={() => handleDismiss(hook.id)}
              className="flex-shrink-0 text-on-surface-variant hover:text-on-surface"
              aria-label="Dismiss"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserEngagementHooks;
