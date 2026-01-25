import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Theme, UserThemePreferences } from '../types/themes';

interface ThemeContextType {
  currentTheme: Theme;
  preferences: UserThemePreferences;
  isDarkTheme: boolean;
  isColorblindTheme: boolean;
  setTheme: (themeId: string) => boolean;
  updatePreferences: (preferences: Partial<UserThemePreferences>) => void;
  getThemeColor: (colorName: string) => string;
  getThemeShadow: (shadowName: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = useTheme();

  const contextValue: ThemeContextType = {
    currentTheme: theme.currentTheme,
    preferences: theme.preferences,
    isDarkTheme: theme.isDarkTheme,
    isColorblindTheme: theme.isColorblindTheme,
    setTheme: theme.setTheme,
    updatePreferences: theme.updatePreferences,
    getThemeColor: theme.getThemeColor,
    getThemeShadow: theme.getThemeShadow,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className={`theme-${theme.currentTheme.type}`} data-theme={theme.currentTheme.type}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;