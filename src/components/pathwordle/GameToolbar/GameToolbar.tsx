import React, { memo } from 'react';
import { BarChart3, Trophy, Lightbulb, Globe, Users, Swords, Palette, BookOpen } from 'lucide-react';
import { Button } from '../../base';

interface GameToolbarProps {
  gameMode: 'daily' | 'practice';
  showHints: boolean;
  showStatistics: boolean;
  showLeaderboard: boolean;
  showFriends: boolean;
  showThemeSelector: boolean;
  onToggleHints: () => void;
  onToggleStatistics: () => void;
  onToggleLeaderboard: () => void;
  onToggleFriends: () => void;
  onToggleThemeSelector: () => void;
  onToggleContentQuality: () => void;
  showContentQuality: boolean;
}

/**
 * GameToolbar Component
 *
 * Top toolbar with buttons for game features (hints, stats, leaderboard, etc.)
 */
export const GameToolbar = memo(({
  gameMode,
  showHints,
  showStatistics,
  showLeaderboard,
  showFriends,
  showThemeSelector,
  onToggleHints,
  onToggleStatistics,
  onToggleLeaderboard,
  onToggleFriends,
  onToggleThemeSelector,
  onToggleContentQuality,
  showContentQuality
}: GameToolbarProps) => {
  return (
    <>
      {/* Fixed Content Quality Button */}
      <Button
        variant="primary"
        size="md"
        onClick={onToggleContentQuality}
        className="fixed bottom-4 left-4 z-40 !rounded-full"
        aria-label="Content quality and learning tips"
        title="Improve your gameplay with advanced strategies and vocabulary"
      >
        <BookOpen className="w-4 h-4" />
      </Button>

      {/* Top Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="secondary"
          size="sm"
          onClick={onToggleHints}
          aria-label={showHints ? 'Hide hints and word tips' : 'Show hints and word tips'}
          aria-expanded={showHints}
          icon={<Lightbulb className="w-5 h-5 text-yellow-500" />}
        >
          <span className="hidden sm:inline">Word Tips</span>
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onToggleStatistics}
          aria-label={showStatistics ? 'Hide your game statistics and achievements' : 'Show your game statistics and achievements'}
          aria-expanded={showStatistics}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="hidden sm:inline ml-2">Statistics</span>
          <Trophy className="w-4 h-4 text-yellow-500 ml-1" />
        </Button>

        {gameMode === 'daily' && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleLeaderboard}
            aria-label={showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
            aria-expanded={showLeaderboard}
            icon={<Globe className="w-5 h-5" />}
          >
            <span className="hidden sm:inline">Leaderboard</span>
          </Button>
        )}

        <Button
          variant="secondary"
          size="sm"
          onClick={onToggleFriends}
          aria-label={showFriends ? 'Hide Friends' : 'Show Friends'}
          aria-expanded={showFriends}
          icon={<Users className="w-5 h-5" />}
        >
          <span className="hidden sm:inline">Friends</span>
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onToggleThemeSelector}
          aria-label={showThemeSelector ? 'Hide Themes' : 'Show Themes'}
          aria-expanded={showThemeSelector}
          icon={<Palette className="w-5 h-5" />}
        >
          <span className="hidden sm:inline">Themes</span>
        </Button>
      </div>
    </>
  );
});

GameToolbar.displayName = 'GameToolbar';

export default GameToolbar;
