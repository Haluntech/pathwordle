import React, { useEffect, useRef } from 'react';

/**
 * Animation type definitions
 */
export type AnimationType =
  | 'fade-in'
  | 'fade-out'
  | 'slide-in-up'
  | 'slide-in-down'
  | 'slide-in-left'
  | 'slide-in-right'
  | 'scale-in'
  | 'scale-out'
  | 'bounce'
  | 'shake'
  | 'flip'
  | 'pulse'
  | 'spin'
  | 'glow';

export type AnimationDuration = 'fast' | 'normal' | 'slow';
export type AnimationTiming = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

export interface AnimationProps {
  type?: AnimationType;
  duration?: AnimationDuration;
  timing?: AnimationTiming;
  delay?: number;
  infinite?: boolean;
  onAnimationEnd?: () => void;
}

/**
 * Get animation class name
 */
export function getAnimationClass(type: AnimationType): string {
  const classMap: Record<AnimationType, string> = {
    'fade-in': 'animate-fade-in',
    'fade-out': 'animate-fade-out',
    'slide-in-up': 'animate-slide-in-up',
    'slide-in-down': 'animate-slide-in-down',
    'slide-in-left': 'animate-slide-in-left',
    'slide-in-right': 'animate-slide-in-right',
    'scale-in': 'animate-scale-in',
    'scale-out': 'animate-scale-out',
    'bounce': 'animate-bounce',
    'shake': 'animate-shake',
    'flip': 'animate-flip',
    'pulse': 'animate-pulse',
    'spin': 'animate-spin',
    'glow': 'animate-glow'
  };

  return classMap[type] || '';
}

/**
 * Get animation duration value
 */
export function getAnimationDuration(duration: AnimationDuration): string {
  const durationMap: Record<AnimationDuration, string> = {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  };

  return durationMap[duration] || '300ms';
}

/**
 * Get animation timing function
 */
export function getAnimationTiming(timing: AnimationTiming): string {
  const timingMap: Record<AnimationTiming, string> = {
    ease: 'ease',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out'
  };

  return timingMap[timing] || 'ease-out';
}

/**
 * Build animation style
 */
export function buildAnimationStyle(
  type: AnimationType,
  duration?: AnimationDuration,
  timing?: AnimationTiming,
  delay?: number,
  infinite?: boolean
): React.CSSProperties {
  const durationValue = duration ? getAnimationDuration(duration) : '300ms';
  const timingValue = timing ? getAnimationTiming(timing) : 'ease-out';
  const delayValue = delay ? `${delay}ms` : '0ms';
  const infiniteValue = infinite ? 'infinite' : '1';

  return {
    animation: `${type} ${durationValue} ${timingValue} ${delayValue} ${infiniteValue}`
  };
}

/**
 * useAnimation hook
 *
 * Provides animation utilities and state management
 */
export function useAnimation(
  type: AnimationType,
  options: {
    duration?: AnimationDuration;
    timing?: AnimationTiming;
    delay?: number;
    infinite?: boolean;
    autoStart?: boolean;
  } = {}
) {
  const {
    duration = 'normal',
    timing = 'ease-out',
    delay = 0,
    infinite = false,
    autoStart = true
  } = options;

  const [isAnimating, setIsAnimating] = React.useState(autoStart);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const start = React.useCallback(() => {
    setIsAnimating(true);
    setHasAnimated(false);
  }, []);

  const stop = React.useCallback(() => {
    setIsAnimating(false);
  }, []);

  useEffect(() => {
    if (isAnimating && !infinite) {
      const durationMs = parseInt(getAnimationDuration(duration));
      const delayMs = delay;
      const totalDuration = durationMs + delayMs;

      timeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
        setHasAnimated(true);
      }, totalDuration);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [isAnimating, infinite, duration, delay]);

  const animationClass = isAnimating ? getAnimationClass(type) : '';
  const animationStyle = buildAnimationStyle(type, duration, timing, delay, infinite);

  return {
    isAnimating,
    hasAnimated,
    start,
    stop,
    animationClass,
    animationStyle
  };
}

/**
 * AnimatedWrapper Component
 *
 * Wraps children with animation
 */
export interface AnimatedWrapperProps extends AnimationProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  type = 'fade-in',
  duration = 'normal',
  timing = 'ease-out',
  delay = 0,
  infinite = false,
  onAnimationEnd,
  className = '',
  style = {}
}) => {
  const animationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animationRef.current) {
      const element = animationRef.current;
      const durationMs = parseInt(getAnimationDuration(duration));
      const totalDuration = durationMs + delay;

      const handleAnimationEnd = () => {
        if (onAnimationEnd) {
          onAnimationEnd();
        }
      };

      element.addEventListener('animationend', handleAnimationEnd);

      return () => {
        element.removeEventListener('animationend', handleAnimationEnd);
      };
    }
  }, [duration, delay, onAnimationEnd]);

  const animationClass = getAnimationClass(type);
  const animationStyle = buildAnimationStyle(type, duration, timing, delay, infinite);

  return (
    <div
      ref={animationRef}
      className={`${animationClass} ${className}`.trim()}
      style={{ ...style, ...animationStyle }}
    >
      {children}
    </div>
  );
};

/**
 * StaggeredChildren Component
 *
 * Animates children with staggered delays
 */
export interface StaggeredChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggeredChildren: React.FC<StaggeredChildrenProps> = ({
  children,
  className = '',
  staggerDelay = 50
}) => {
  const childArray = React.Children.toArray(children);

  return (
    <div className={`stagger-children ${className}`.trim()}>
      {childArray.map((child, index) => (
        <div
          key={index}
          style={{
            animationDelay: `${index * staggerDelay}ms`
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

/**
 * Confetti Component
 *
 * Displays confetti animation for win state
 */
export interface ConfettiProps {
  count?: number;
  duration?: number;
}

export const Confetti: React.FC<ConfettiProps> = ({ count = 50, duration = 3000 }) => {
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (confettiRef.current) {
        confettiRef.current.style.opacity = '0';
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const confettiPieces = Array.from({ length: count }, (_, i) => {
    const style: React.CSSProperties = {
      position: 'fixed',
      top: '-10px',
      left: `${Math.random() * 100}vw`,
      width: '10px',
      height: '10px',
      backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
      animation: `confetti ${2 + Math.random() * 2}s linear forwards`,
      animationDelay: `${Math.random() * 2}s`,
      zIndex: 9999
    };

    return <div key={i} style={style} />;
  });

  return (
    <div
      ref={confettiRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        transition: 'opacity 0.5s ease-out',
        zIndex: 9999
      }}
    >
      {confettiPieces}
    </div>
  );
};

export default {
  useAnimation,
  AnimatedWrapper,
  StaggeredChildren,
  Confetti,
  getAnimationClass,
  getAnimationDuration,
  getAnimationTiming,
  buildAnimationStyle
};
