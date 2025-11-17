import React, { useState, useCallback, memo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Settings, Share2, Trophy } from 'lucide-react';

interface MobileGameControlsProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onReset?: () => void;
  onShare?: () => void;
  onStats?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  className?: string;
}

// Haptic feedback API
const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    switch (type) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(25);
        break;
      case 'heavy':
        navigator.vibrate(50);
        break;
    }
  }
};

// Memoized Touch Button component
const TouchButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  haptic?: 'light' | 'medium' | 'heavy';
  showLabel?: boolean;
}> = memo(({ icon, label, onPress, disabled = false, variant = 'secondary', haptic = 'light', showLabel = true }) => {
  const handlePress = useCallback(() => {
    if (disabled) return;

    triggerHaptic(haptic);
    onPress();
  }, [disabled, haptic, onPress]);

  const baseClasses = 'btn touch-feedback flex flex-col items-center justify-center min-h-[2.75rem] w-full';
  const variantClasses = variant === 'primary' ? 'btn-primary' : variant === 'ghost' ? 'btn-ghost' : 'btn-secondary';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      onClick={handlePress}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabledClasses}`}
      aria-label={label}
    >
      <span className="text-xl mb-1">{icon}</span>
      {showLabel && <span className="text-xs">{label}</span>}
    </button>
  );
});

TouchButton.displayName = 'TouchButton';

const MobileGameControls: React.FC<MobileGameControlsProps> = ({
  onUndo,
  onRedo,
  onReset,
  onShare,
  onStats,
  canUndo = false,
  canRedo = false,
  className = ''
}) => {
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  // Detect orientation
  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  // Handle swipe gestures for mobile
  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    triggerHaptic('medium');

    if (direction === 'left' && canRedo) {
      onRedo?.();
    } else if (direction === 'right' && canUndo) {
      onUndo?.();
    }
  }, [canUndo, canRedo, onUndo, onRedo]);

  // Touch event handlers for swipe gestures
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const diffX = endX - startX;

      if (Math.abs(diffX) > 50) { // Minimum swipe distance
        handleSwipe(diffX > 0 ? 'right' : 'left');
      }
    };

    window.addEventListener('touchend', handleTouchEnd, { once: true });
  }, [handleSwipe]);

  return (
    <div className={`bg-white border-t border-gray-200 safe-area-bottom ${className}`}>
      {/* Main Controls */}
      <div className="grid grid-cols-3 gap-2 p-4">
        {/* Undo Button */}
        <TouchButton
          icon={<ChevronLeft />}
          label="撤销"
          onPress={onUndo || (() => {})}
          disabled={!canUndo}
          haptic="light"
        />

        {/* Reset/Game Info Button */}
        <TouchButton
          icon={<RotateCcw />}
          label="重置"
          onPress={onReset || (() => {})}
          haptic="medium"
          variant="primary"
        />

        {/* Redo Button */}
        <TouchButton
          icon={<ChevronRight />}
          label="重做"
          onPress={onRedo || (() => {})}
          disabled={!canRedo}
          haptic="light"
        />
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-4 gap-2 px-4 pb-4">
        <TouchButton
          icon={<Settings />}
          label="设置"
          onPress={() => setShowMoreActions(!showMoreActions)}
          haptic="light"
          variant="ghost"
        />

        <TouchButton
          icon={<Share2 />}
          label="分享"
          onPress={onShare || (() => {})}
          haptic="light"
          variant="ghost"
        />

        <TouchButton
          icon={<Trophy />}
          label="统计"
          onPress={onStats || (() => {})}
          haptic="light"
          variant="ghost"
        />

        {/* More Actions */}
        <TouchButton
          icon={showMoreActions ? '−' : '+'}
          label={showMoreActions ? '收起' : '更多'}
          onPress={() => setShowMoreActions(!showMoreActions)}
          haptic="light"
          variant="ghost"
        />
      </div>

      {/* Extended Actions Panel */}
      {showMoreActions && (
        <div className="border-t border-gray-200 p-4 animate-pulse">
          <div className="grid grid-cols-3 gap-2">
            <TouchButton
              icon="💡"
              label="提示"
              onPress={() => {}} // Will be connected to hint system
              haptic="light"
              variant="ghost"
            />

            <TouchButton
              icon="🏆"
              label="成就"
              onPress={() => {}} // Will be connected to achievement system
              haptic="light"
              variant="ghost"
            />

            <TouchButton
              icon="👥"
              label="好友"
              onPress={() => {}} // Will be connected to friends system
              haptic="light"
              variant="ghost"
            />
          </div>
        </div>
      )}

      {/* Swipe Indicator (for landscape mode) */}
      {isLandscape && (
        <div className="absolute bottom-full left-0 right-0 p-2 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-full text-xs">
            <ChevronLeft className="w-4 h-4" />
            <span>滑动撤销/重做</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Touch overlay for swipe detection */}
      <div
        className="absolute inset-0 pointer-events-none"
        onTouchStart={handleTouchStart}
      />
    </div>
  );
};

export default memo(MobileGameControls);