import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Theme,
  UserThemePreferences,
  SeasonalTheme,
  ThemeCustomizationOptions,
  ThemeAnalytics
} from '../types/themes';

// Predefined theme definitions
const defaultThemes: Theme[] = [
  {
    id: 'light-default',
    name: 'light-default',
    displayName: 'Classic Light',
    description: 'Clean and bright default theme',
    type: 'light',
    colors: {
      primary: '#3b82f6',
      primaryLight: '#60a5fa',
      primaryDark: '#2563eb',
      primaryHover: '#2563eb',
      secondary: '#6b7280',
      secondaryLight: '#9ca3af',
      secondaryDark: '#4b5563',
      secondaryHover: '#4b5563',
      background: '#ffffff',
      backgroundAlt: '#f3f4f6',
      backgroundSurface: '#ffffff',
      backgroundModal: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280',
      textMuted: '#9ca3af',
      textInverse: '#ffffff',
      border: '#e5e7eb',
      borderLight: '#f3f4f6',
      borderDark: '#d1d5db',
      borderFocus: '#3b82f6',
      success: '#10b981',
      successLight: '#34d399',
      successBg: '#d1fae5',
      warning: '#f59e0b',
      warningLight: '#fbbf24',
      warningBg: '#fef3c7',
      error: '#ef4444',
      errorLight: '#f87171',
      errorBg: '#fee2e2',
      info: '#3b82f6',
      infoLight: '#60a5fa',
      infoBg: '#dbeafe',
      gridBackground: '#f9fafb',
      gridBorder: '#e5e7eb',
      gridCellBackground: '#ffffff',
      gridCellHover: '#f3f4f6',
      gridCellCorrect: '#10b981',
      gridCellPresent: '#f59e0b',
      gridCellAbsent: '#6b7280',
      keyBackground: '#ffffff',
      keyBackgroundUsed: '#d1d5db',
      keyBackgroundCorrect: '#10b981',
      keyBackgroundPresent: '#f59e0b',
      keyBackgroundAbsent: '#6b7280',
      keyText: '#1f2937',
      keyTextUsed: '#9ca3af',
      buttonPrimary: '#3b82f6',
      buttonPrimaryHover: '#2563eb',
      buttonSecondary: '#6b7280',
      buttonSecondaryHover: '#4b5563',
      buttonDisabled: '#d1d5db',
      gold: '#fbbf24',
      silver: '#9ca3af',
      bronze: '#f59e0b',
      platinum: '#e5e7eb'
    },
    shadows: {
      small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      button: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      input: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    },
    animations: {
      duration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms'
      },
      easing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out'
      },
      transitions: {
        colors: 'color 300ms ease-in-out',
        transform: 'transform 300ms ease-in-out',
        opacity: 'opacity 300ms ease-in-out'
      },
      keyframes: {
        bounce: 'bounce 1s infinite',
        shake: 'shake 0.5s',
        flip: 'flip 0.6s',
        slide: 'slide 0.3s',
        pulse: 'pulse 2s infinite',
        spin: 'spin 1s linear infinite'
      }
    },
    preview: {
      thumbnail: '/themes/light-default-thumb.png',
      screenshot: '/themes/light-default.png',
      colors: ['#3b82f6', '#ffffff', '#f3f4f6', '#1f2937']
    }
  },
  {
    id: 'dark-default',
    name: 'dark-default',
    displayName: 'Dark Mode',
    description: 'Easy on the eyes dark theme',
    type: 'dark',
    colors: {
      primary: '#60a5fa',
      primaryLight: '#93c5fd',
      primaryDark: '#3b82f6',
      primaryHover: '#93c5fd',
      secondary: '#9ca3af',
      secondaryLight: '#d1d5db',
      secondaryDark: '#6b7280',
      secondaryHover: '#d1d5db',
      background: '#111827',
      backgroundAlt: '#1f2937',
      backgroundSurface: '#1f2937',
      backgroundModal: '#1f2937',
      text: '#f9fafb',
      textSecondary: '#d1d5db',
      textMuted: '#9ca3af',
      textInverse: '#111827',
      border: '#374151',
      borderLight: '#4b5563',
      borderDark: '#1f2937',
      borderFocus: '#60a5fa',
      success: '#34d399',
      successLight: '#6ee7b7',
      successBg: '#065f46',
      warning: '#fbbf24',
      warningLight: '#fcd34d',
      warningBg: '#92400e',
      error: '#f87171',
      errorLight: '#fca5a5',
      errorBg: '#991b1b',
      info: '#60a5fa',
      infoLight: '#93c5fd',
      infoBg: '#1e3a8a',
      gridBackground: '#1f2937',
      gridBorder: '#374151',
      gridCellBackground: '#374151',
      gridCellHover: '#4b5563',
      gridCellCorrect: '#34d399',
      gridCellPresent: '#fbbf24',
      gridCellAbsent: '#6b7280',
      keyBackground: '#374151',
      keyBackgroundUsed: '#4b5563',
      keyBackgroundCorrect: '#34d399',
      keyBackgroundPresent: '#fbbf24',
      keyBackgroundAbsent: '#6b7280',
      keyText: '#f9fafb',
      keyTextUsed: '#9ca3af',
      buttonPrimary: '#60a5fa',
      buttonPrimaryHover: '#93c5fd',
      buttonSecondary: '#9ca3af',
      buttonSecondaryHover: '#d1d5db',
      buttonDisabled: '#4b5563',
      gold: '#fbbf24',
      silver: '#9ca3af',
      bronze: '#f59e0b',
      platinum: '#6b7280'
    },
    shadows: {
      small: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      medium: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      large: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
      modal: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
      button: '0 2px 4px 0 rgba(0, 0, 0, 0.3)',
      card: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      input: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)'
    },
    animations: {
      duration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms'
      },
      easing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out'
      },
      transitions: {
        colors: 'color 300ms ease-in-out',
        transform: 'transform 300ms ease-in-out',
        opacity: 'opacity 300ms ease-in-out'
      },
      keyframes: {
        bounce: 'bounce 1s infinite',
        shake: 'shake 0.5s',
        flip: 'flip 0.6s',
        slide: 'slide 0.3s',
        pulse: 'pulse 2s infinite',
        spin: 'spin 1s linear infinite'
      }
    },
    preview: {
      thumbnail: '/themes/dark-default-thumb.png',
      screenshot: '/themes/dark-default.png',
      colors: ['#60a5fa', '#111827', '#1f2937', '#f9fafb']
    }
  },
  {
    id: 'colorblind-protanopia',
    name: 'colorblind-protanopia',
    displayName: 'Colorblind Friendly',
    description: 'Optimized for red-green colorblind users',
    type: 'colorblind',
    colors: {
      primary: '#2563eb', // Blue instead of red
      primaryLight: '#3b82f6',
      primaryDark: '#1d4ed8',
      primaryHover: '#3b82f6',
      secondary: '#6b7280',
      secondaryLight: '#9ca3af',
      secondaryDark: '#4b5563',
      secondaryHover: '#4b5563',
      background: '#ffffff',
      backgroundAlt: '#f3f4f6',
      backgroundSurface: '#ffffff',
      backgroundModal: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280',
      textMuted: '#9ca3af',
      textInverse: '#ffffff',
      border: '#e5e7eb',
      borderLight: '#f3f4f6',
      borderDark: '#d1d5db',
      borderFocus: '#2563eb',
      success: '#059669', // Green shifted to blue-green
      successLight: '#10b981',
      successBg: '#d1fae5',
      warning: '#2563eb', // Blue instead of orange
      warningLight: '#3b82f6',
      warningBg: '#dbeafe',
      error: '#0891b2', // Cyan instead of red
      errorLight: '#06b6d4',
      errorBg: '#ecfeff',
      info: '#4f46e5', // Indigo
      infoLight: '#6366f1',
      infoBg: '#eef2ff',
      gridBackground: '#f9fafb',
      gridBorder: '#e5e7eb',
      gridCellBackground: '#ffffff',
      gridCellHover: '#f3f4f6',
      gridCellCorrect: '#059669', // Blue-green for correct
      gridCellPresent: '#2563eb', // Blue for present
      gridCellAbsent: '#6b7280',
      keyBackground: '#ffffff',
      keyBackgroundUsed: '#d1d5db',
      keyBackgroundCorrect: '#059669',
      keyBackgroundPresent: '#2563eb',
      keyBackgroundAbsent: '#6b7280',
      keyText: '#1f2937',
      keyTextUsed: '#9ca3af',
      buttonPrimary: '#2563eb',
      buttonPrimaryHover: '#3b82f6',
      buttonSecondary: '#6b7280',
      buttonSecondaryHover: '#4b5563',
      buttonDisabled: '#d1d5db',
      gold: '#f59e0b', // Orange for gold (stable)
      silver: '#9ca3af',
      bronze: '#6b7280', // Gray for bronze
      platinum: '#e5e7eb'
    },
    shadows: {
      small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      button: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      input: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    },
    animations: {
      duration: {
        fast: '200ms', // Slightly slower for better visibility
        normal: '350ms',
        slow: '600ms'
      },
      easing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out'
      },
      transitions: {
        colors: 'color 400ms ease-in-out', // Slower color transitions
        transform: 'transform 300ms ease-in-out',
        opacity: 'opacity 350ms ease-in-out'
      },
      keyframes: {
        bounce: 'bounce 1.2s infinite',
        shake: 'shake 0.6s',
        flip: 'flip 0.8s',
        slide: 'slide 0.4s',
        pulse: 'pulse 2.5s infinite',
        spin: 'spin 1.2s linear infinite'
      }
    },
    preview: {
      thumbnail: '/themes/colorblind-thumb.png',
      screenshot: '/themes/colorblind.png',
      colors: ['#2563eb', '#059669', '#0891b2', '#ffffff']
    }
  },
  {
    id: 'seasonal-winter',
    name: 'seasonal-winter',
    displayName: 'Winter Wonderland',
    description: 'Festive winter theme with cool colors',
    type: 'seasonal',
    isPremium: true,
    isLocked: true,
    unlockCondition: 'Complete 50 daily challenges',
    colors: {
      primary: '#0ea5e9', // Ice blue
      primaryLight: '#38bdf8',
      primaryDark: '#0284c7',
      primaryHover: '#38bdf8',
      secondary: '#e0f2fe', // Light blue
      secondaryLight: '#f0f9ff',
      secondaryDark: '#bae6fd',
      secondaryHover: '#f0f9ff',
      background: '#f0f9ff', // Very light blue background
      backgroundAlt: '#e0f2fe',
      backgroundSurface: '#ffffff',
      backgroundModal: '#ffffff',
      text: '#0c4a6e', // Deep blue text
      textSecondary: '#075985',
      textMuted: '#0ea5e9',
      textInverse: '#ffffff',
      border: '#bae6fd',
      borderLight: '#e0f2fe',
      borderDark: '#7dd3fc',
      borderFocus: '#0ea5e9',
      success: '#10b981', // Green for contrast
      successLight: '#34d399',
      successBg: '#d1fae5',
      warning: '#f59e0b',
      warningLight: '#fbbf24',
      warningBg: '#fef3c7',
      error: '#ef4444',
      errorLight: '#f87171',
      errorBg: '#fee2e2',
      info: '#0ea5e9',
      infoLight: '#38bdf8',
      infoBg: '#e0f2fe',
      gridBackground: '#f0f9ff',
      gridBorder: '#bae6fd',
      gridCellBackground: '#ffffff',
      gridCellHover: '#e0f2fe',
      gridCellCorrect: '#10b981',
      gridCellPresent: '#f59e0b',
      gridCellAbsent: '#64748b',
      keyBackground: '#ffffff',
      keyBackgroundUsed: '#e0f2fe',
      keyBackgroundCorrect: '#10b981',
      keyBackgroundPresent: '#f59e0b',
      keyBackgroundAbsent: '#64748b',
      keyText: '#0c4a6e',
      keyTextUsed: '#7dd3fc',
      buttonPrimary: '#0ea5e9',
      buttonPrimaryHover: '#38bdf8',
      buttonSecondary: '#64748b',
      buttonSecondaryHover: '#475569',
      buttonDisabled: '#e2e8f0',
      gold: '#fbbf24',
      silver: '#94a3b8',
      bronze: '#a78bfa', // Purple for winter
      platinum: '#e0e7ff'
    },
    shadows: {
      small: '0 1px 2px 0 rgba(14, 165, 233, 0.1)',
      medium: '0 4px 6px -1px rgba(14, 165, 233, 0.15), 0 2px 4px -1px rgba(14, 165, 233, 0.1)',
      large: '0 10px 15px -3px rgba(14, 165, 233, 0.15), 0 4px 6px -2px rgba(14, 165, 233, 0.1)',
      modal: '0 20px 25px -5px rgba(14, 165, 233, 0.2), 0 10px 10px -5px rgba(14, 165, 233, 0.15)',
      button: '0 2px 4px 0 rgba(14, 165, 233, 0.15)',
      card: '0 4px 6px -1px rgba(14, 165, 233, 0.15), 0 2px 4px -1px rgba(14, 165, 233, 0.1)',
      input: '0 1px 3px 0 rgba(14, 165, 233, 0.15), 0 1px 2px 0 rgba(14, 165, 233, 0.1)'
    },
    animations: {
      duration: {
        fast: '200ms',
        normal: '400ms',
        slow: '700ms'
      },
      easing: {
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      transitions: {
        colors: 'color 500ms cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: 'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)'
      },
      keyframes: {
        bounce: 'winter-bounce 1.5s infinite',
        shake: 'winter-shake 0.7s',
        flip: 'winter-flip 0.8s',
        slide: 'winter-slide 0.4s',
        pulse: 'winter-pulse 3s infinite',
        spin: 'winter-spin 2s ease-in-out infinite'
      }
    },
    sounds: {
      enabled: true,
      volume: 0.7,
      sounds: {
        keyPress: '/sounds/winter-key.mp3',
        correctWord: '/sounds/winter-success.mp3',
        wrongWord: '/sounds/winter-fail.mp3',
        victory: '/sounds/winter-victory.mp3',
        defeat: '/sounds/winter-defeat.mp3',
        achievement: '/sounds/winter-achievement.mp3',
        notification: '/sounds/winter-notification.mp3',
        buttonClick: '/sounds/winter-click.mp3'
      }
    },
    preview: {
      thumbnail: '/themes/winter-thumb.png',
      screenshot: '/themes/winter.png',
      colors: ['#0ea5e9', '#f0f9ff', '#ffffff', '#0c4a6e']
    }
  }
];

const seasonalThemes: SeasonalTheme[] = [
  {
    id: 'winter-2024',
    name: 'Winter Wonderland 2024',
    season: 'winter',
    startDate: '2024-12-01',
    endDate: '2025-02-28',
    isActive: true,
    theme: defaultThemes.find(t => t.id === 'seasonal-winter')!,
    specialFeatures: {
      particles: true,
      animations: true,
      specialEffects: true,
      exclusiveRewards: true
    }
  }
];

const defaultPreferences: UserThemePreferences = {
  currentTheme: 'light-default',
  autoSwitch: {
    enabled: false,
    lightTheme: 'light-default',
    darkTheme: 'dark-default',
    switchTime: {
      from: '20:00',
      to: '06:00'
    }
  },
  accessibility: {
    highContrast: false,
    reduceMotion: false,
    largerText: false,
    focusVisible: true
  },
  customizations: {
    borderRadius: 'rounded',
    fontSize: 'medium'
  }
};

export const useTheme = () => {
  const [preferences, setPreferences] = useState<UserThemePreferences>(defaultPreferences);
  const [availableThemes] = useState<Theme[]>(defaultThemes);
  const [currentSeasonalThemes, setCurrentSeasonalThemes] = useState<SeasonalTheme[]>([]);
  const [customizationOptions, setCustomizationOptions] = useState<ThemeCustomizationOptions>({
    primaryHue: 217,
    saturation: 71,
    lightness: 60,
    contrast: 'normal',
    colorBlindType: 'none',
    customColors: {}
  });

  // Load preferences from localStorage and initialize seasonal themes
  useEffect(() => {
    // Initialize seasonal themes
    setCurrentSeasonalThemes(seasonalThemes);

    const savedPreferences = localStorage.getItem('themePreferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading theme preferences:', error);
      }
    }

    const savedCustomization = localStorage.getItem('themeCustomization');
    if (savedCustomization) {
      try {
        const parsed = JSON.parse(savedCustomization);
        setCustomizationOptions(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading customization options:', error);
      }
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('themePreferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('themeCustomization', JSON.stringify(customizationOptions));
  }, [customizationOptions]);

  // Auto theme switching based on time
  useEffect(() => {
    if (!preferences.autoSwitch.enabled) return;

    const checkTimeAndSwitch = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const { from, to } = preferences.autoSwitch.switchTime;

      let shouldUseDarkTheme: boolean;
      if (from > to) {
        // Overnight period (e.g., 20:00 to 06:00)
        shouldUseDarkTheme = currentTime >= from || currentTime <= to;
      } else {
        // Same day period (e.g., 06:00 to 20:00)
        shouldUseDarkTheme = currentTime >= from && currentTime <= to;
      }

      const targetTheme = shouldUseDarkTheme ? preferences.autoSwitch.darkTheme : preferences.autoSwitch.lightTheme;
      if (targetTheme !== preferences.currentTheme) {
        setPreferences(prev => ({ ...prev, currentTheme: targetTheme }));
      }
    };

    checkTimeAndSwitch();
    const interval = setInterval(checkTimeAndSwitch, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [preferences.autoSwitch]);

  // Check for seasonal theme availability
  useEffect(() => {
    const checkSeasonalThemes = () => {
      const now = new Date();
      const activeSeasonalThemes = currentSeasonalThemes.filter(theme => {
        const start = new Date(theme.startDate);
        const end = new Date(theme.endDate);
        return now >= start && now <= end;
      });

      setCurrentSeasonalThemes(prev =>
        prev.map(theme => ({
          ...theme,
          isActive: activeSeasonalThemes.some(active => active.id === theme.id)
        }))
      );
    };

    checkSeasonalThemes();
    const interval = setInterval(checkSeasonalThemes, 3600000); // Check every hour

    return () => clearInterval(interval);
  }, []);

  // Get current theme
  const currentTheme = useMemo(() => {
    const theme = availableThemes.find(t => t.id === preferences.currentTheme);
    return theme || availableThemes[0]; // Fallback to first theme
  }, [preferences.currentTheme, availableThemes]);

  // Apply theme to document
  useEffect(() => {
    if (!currentTheme) return;

    const root = document.documentElement;

    // Apply CSS custom properties
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply shadows
    Object.entries(currentTheme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // Apply animations
    Object.entries(currentTheme.animations.duration).forEach(([key, value]) => {
      root.style.setProperty(`--duration-${key}`, value);
    });

    Object.entries(currentTheme.animations.easing).forEach(([key, value]) => {
      root.style.setProperty(`--easing-${key}`, value);
    });

    // Apply accessibility settings
    root.style.setProperty('--font-size-multiplier',
      preferences.customizations.fontSize === 'small' ? '0.875' :
      preferences.customizations.fontSize === 'large' ? '1.125' :
      preferences.customizations.fontSize === 'extraLarge' ? '1.25' : '1'
    );

    if (preferences.accessibility.reduceMotion) {
      root.style.setProperty('--animation-duration-multiplier', '0');
    }

    // Apply border radius
    const borderRadiusValue =
      preferences.customizations.borderRadius === 'sharp' ? '0px' :
      preferences.customizations.borderRadius === 'rounded' ? '8px' : '16px';
    root.style.setProperty('--border-radius', borderRadiusValue);

    // Set data attributes for CSS targeting
    root.setAttribute('data-theme', currentTheme.type);
    root.setAttribute('data-colorblind', customizationOptions.colorBlindType);

    if (preferences.accessibility.highContrast) {
      root.setAttribute('data-high-contrast', 'true');
    } else {
      root.removeAttribute('data-high-contrast');
    }

  }, [currentTheme, preferences, customizationOptions]);

  // Theme management functions
  const setTheme = useCallback((themeId: string) => {
    const theme = availableThemes.find(t => t.id === themeId);
    if (theme && (!theme.isLocked || theme.isLocked === false)) {
      setPreferences(prev => ({ ...prev, currentTheme: themeId }));
      return true;
    }
    return false;
  }, [availableThemes]);

  const unlockTheme = useCallback((themeId: string) => {
    // This would typically involve a server call or achievement check
    const theme = availableThemes.find(t => t.id === themeId);
    if (theme?.isLocked) {
      // Simulate unlocking logic
      const userStats = JSON.parse(localStorage.getItem('statistics') || '{}');
      const hasCompletedChallenges = userStats.gamesPlayed >= 50;

      if (hasCompletedChallenges) {
        // In a real app, this would update the theme's locked status on the server
        return true;
      }
    }
    return false;
  }, [availableThemes]);

  const updatePreferences = useCallback((newPreferences: Partial<UserThemePreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  }, []);

  const updateCustomization = useCallback((newCustomization: Partial<ThemeCustomizationOptions>) => {
    setCustomizationOptions(prev => ({ ...prev, ...newCustomization }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setPreferences(defaultPreferences);
    setCustomizationOptions({
      primaryHue: 217,
      saturation: 71,
      lightness: 60,
      contrast: 'normal',
      colorBlindType: 'none',
      customColors: {}
    });
  }, []);

  // Generate theme preview colors
  const generateThemePreview = useCallback((baseTheme: Theme, customizations: ThemeCustomizationOptions): string[] => {
    const colors = [...baseTheme.preview.colors];

    if (customizations.primaryHue !== 217 || customizations.saturation !== 71) {
      // Adjust primary color based on customizations
      const adjustedPrimary = `hsl(${customizations.primaryHue}, ${customizations.saturation}%, ${customizations.lightness}%)`;
      colors[0] = adjustedPrimary;
    }

    return colors;
  }, []);

  // Get available themes based on user access
  const getAvailableThemes = useCallback(() => {
    const userStats = JSON.parse(localStorage.getItem('statistics') || '{}');
    const hasCompletedChallenges = userStats.gamesPlayed >= 50;

    return availableThemes.map(theme => ({
      ...theme,
      isLocked: theme.isLocked && !hasCompletedChallenges
    }));
  }, [availableThemes]);

  // Computed values
  const isDarkTheme = currentTheme.type === 'dark';
  const isColorblindTheme = currentTheme.type === 'colorblind';
  const isSeasonalTheme = currentTheme.type === 'seasonal';
  const activeSeasonalThemes = currentSeasonalThemes.filter(theme => theme.isActive);

  return {
    // Current state
    currentTheme,
    preferences,
    customizationOptions,
    availableThemes: getAvailableThemes(),
    currentSeasonalThemes,
    activeSeasonalThemes,

    // Computed values
    isDarkTheme,
    isColorblindTheme,
    isSeasonalTheme,

    // Actions
    setTheme,
    unlockTheme,
    updatePreferences,
    updateCustomization,
    resetToDefaults,
    generateThemePreview,

    // Theme utilities
    getThemeColor: (colorName: string) => currentTheme.colors[colorName as keyof ThemeColors] || '',
    getThemeShadow: (shadowName: string) => currentTheme.shadows[shadowName as keyof ThemeShadows] || '',
    getThemeAnimation: (animationName: string) => currentTheme.animations.duration[animationName as keyof ThemeAnimations['duration']] || ''
  };
};