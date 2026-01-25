import React, { memo } from 'react';
import { Button } from '../../base';

interface CurrentPathDisplayProps {
  currentWord: string;
  onClear: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  pathLength: number;
}

/**
 * CurrentPathDisplay Component
 *
 * Displays the current selected path and action buttons
 */
export const CurrentPathDisplay = memo(({
  currentWord,
  onClear,
  onSubmit,
  canSubmit,
  pathLength
}: CurrentPathDisplayProps) => {
  const hasWord = currentWord.length > 0;

  return (
    <div className="bg-white rounded-lg px-4 py-2 shadow-md">
      {hasWord ? (
        <>
          <div className="text-sm text-gray-500 mb-1 text-center">Current Path:</div>
          <div
            className="text-xl font-bold text-gray-800 tracking-widest text-center mb-3"
            role="status"
            aria-live="polite"
            aria-label={`Current path: ${currentWord.split('').join(' ')}`}
          >
            {currentWord}
          </div>
        </>
      ) : (
        <div className="text-sm text-gray-500 mb-3 text-center">Select letters to create a path</div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="danger"
          size="sm"
          onClick={onClear}
          disabled={pathLength === 0}
          aria-label="Clear current path"
        >
          Clear
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onSubmit}
          disabled={!canSubmit}
          aria-label="Submit guess"
        >
          Submit
        </Button>
      </div>
    </div>
  );
});

CurrentPathDisplay.displayName = 'CurrentPathDisplay';

export default CurrentPathDisplay;
