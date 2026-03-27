import React, { memo } from 'react';
import { GridCell } from '../../../types/game';
import HintPanel from '../../HintPanel';
import Statistics from '../../Statistics';
import Friends from '../../Friends';
import ThemeSelector from '../../ThemeSelector';

interface GamePanelsProps {
  showHints: boolean;
  showStatistics: boolean;
  showLeaderboard: boolean;
  showFriends: boolean;
  showMultiplayer: boolean;
  showThemeSelector: boolean;
  grid?: GridCell[][];
  currentPath: GridCell[];
  targetWord: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  onCloseHints: () => void;
}

/**
 * GamePanels Component
 *
 * Manages all the collapsible panels (hints, stats, leaderboard, etc.)
 */
export const GamePanels = memo(({
  showHints,
  showStatistics,
  showLeaderboard,
  showFriends,
  showThemeSelector,
  grid,
  currentPath,
  targetWord,
  difficulty,
  onCloseHints
}: GamePanelsProps) => {
  return (
    <>
      {/* Hints Panel */}
      {showHints && grid && (
        <div className="mb-8">
          <HintPanel
            grid={grid}
            currentPath={currentPath}
            difficulty={difficulty}
            targetWord={targetWord}
            isVisible={showHints}
            onClose={onCloseHints}
            compact={true}
          />
        </div>
      )}

      {/* Statistics Panel */}
      {showStatistics && (
        <div className="mb-8">
          <Statistics showDetailed={false} />
        </div>
      )}

      {/* Leaderboard Panel */}
      {showLeaderboard && (
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Leaderboard temporarily unavailable</h3>
            <p className="text-gray-600">We are currently maintaining the leaderboard system. Please try again later.</p>
          </div>
        </div>
      )}

      {/* Friends Panel */}
      {showFriends && (
        <div className="mb-8">
          <Friends compact={false} showActions={true} />
        </div>
      )}

      {/* Theme Selector Panel */}
      {showThemeSelector && (
        <div className="mb-8">
          <ThemeSelector />
        </div>
      )}
    </>
  );
});

GamePanels.displayName = 'GamePanels';

export default GamePanels;
