export interface Theme {
  id: string;
  name: string;
  displayName: string;
  description: string;
  type: 'light' | 'dark' | 'colorblind' | 'seasonal' | 'custom';
  isPremium?: boolean;
  isLocked?: boolean;
  unlockCondition?: string;
  colors: ThemeColors;
  shadows: ThemeShadows;
  animations: ThemeAnimations;
  sounds?: ThemeSounds;
  preview: ThemePreview;
}

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryHover: string;

  // Secondary colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  secondaryHover: string;

  // Background colors
  background: string;
  backgroundAlt: string;
  backgroundSurface: string;
  backgroundModal: string;

  // Text colors
  text: string;
  textSecondary: string;
 textMuted: string;
  textInverse: string;

  // Border colors
  border: string;
  borderLight: string;
  borderDark: string;
  borderFocus: string;

  // Status colors
  success: string;
  successLight: string;
  successBg: string;
  warning: string;
  warningLight: string;
  warningBg: string;
  error: string;
  errorLight: string;
  errorBg: string;
  info: string;
  infoLight: string;
  infoBg: string;

  // Game-specific colors
  gridBackground: string;
  gridBorder: string;
  gridCellBackground: string;
  gridCellHover: string;
  gridCellCorrect: string;
  gridCellPresent: string;
  gridCellAbsent: string;

  // Keyboard colors
  keyBackground: string;
  keyBackgroundUsed: string;
  keyBackgroundCorrect: string;
  keyBackgroundPresent: string;
  keyBackgroundAbsent: string;
  keyText: string;
  keyTextUsed: string;

  // UI element colors
  buttonPrimary: string;
  buttonPrimaryHover: string;
  buttonSecondary: string;
  buttonSecondaryHover: string;
  buttonDisabled: string;

  // Score and achievement colors
  gold: string;
  silver: string;
  bronze: string;
  platinum: string;
}

export interface ThemeShadows {
  small: string;
  medium: string;
  large: string;
  modal: string;
  button: string;
  card: string;
  input: string;
}

export interface ThemeAnimations {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
  transitions: {
    colors: string;
    transform: string;
    opacity: string;
  };
  keyframes: {
    bounce: string;
    shake: string;
    flip: string;
    slide: string;
    pulse: string;
    spin: string;
  };
}

export interface ThemeSounds {
  enabled: boolean;
  volume: number;
  sounds: {
    keyPress: string;
    correctWord: string;
    wrongWord: string;
    victory: string;
    defeat: string;
    achievement: string;
    notification: string;
    buttonClick: string;
    backgroundMusic?: string;
  };
}

export interface ThemePreview {
  thumbnail: string;
  screenshot: string;
  colors: string[]; // Array of main colors for quick preview
}

export interface UserThemePreferences {
  currentTheme: string;
  autoSwitch: {
    enabled: boolean;
    lightTheme: string;
    darkTheme: string;
    switchTime: {
      from: string; // "20:00"
      to: string;   // "06:00"
    };
  };
  accessibility: {
    highContrast: boolean;
    reduceMotion: boolean;
    largerText: boolean;
    focusVisible: boolean;
  };
  customizations: {
    primaryColor?: string;
    accentColor?: string;
    borderRadius: 'sharp' | 'rounded' | 'veryRounded';
    fontSize: 'small' | 'medium' | 'large' | 'extraLarge';
  };
}

export interface SeasonalTheme {
  id: string;
  name: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'holiday';
  startDate: string;
  endDate: string;
  isActive: boolean;
  theme: Theme;
  specialFeatures: {
    particles?: boolean;
    animations?: boolean;
    specialEffects?: boolean;
    exclusiveRewards?: boolean;
  };
}

export interface ThemeCustomizationOptions {
  primaryHue: number; // 0-360
  saturation: number; // 0-100
  lightness: number;  // 0-100
  contrast: 'normal' | 'high' | 'veryHigh';
  colorBlindType: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
  customColors: {
    [key: string]: string;
  };
}

export interface ThemeAnalytics {
  themeId: string;
  usageCount: number;
  averageUsageTime: number;
  userSatisfaction: number;
  conversionRate: number; // For premium themes
  popularDevices: string[];
  popularTimes: number[]; // Hours of day
  feedbackScore: number;
  lastUpdated: string;
}

export interface ThemePack {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'coins' | 'gems' | 'real';
  themes: Theme[];
  isLimitedEdition: boolean;
  limitedUntil?: string;
  bonusContent?: {
    avatars: string[];
    badges: string[];
    effects: string[];
  };
  discount: {
    percentage: number;
    validUntil: string;
    minimumPurchase?: number;
  };
}