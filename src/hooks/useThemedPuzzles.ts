import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  PuzzleTheme,
  ThemeProgress,
  ThemeStats,
  ThemeCategoryType,
  PREDEFINED_THEMES,
  THEME_WORD_POOLS,
  THEME_ACHIEVEMENTS,
  THEME_LEARNING_OBJECTIVES
} from '../types/themedPuzzles';

interface UseThemedPuzzlesProps {
  playerId: string;
  category?: ThemeCategoryType;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
}

export const useThemedPuzzles = ({
  playerId,
  category,
  difficulty
}: UseThemedPuzzlesProps) => {
  // State
  const [availableThemes, setAvailableThemes] = useState<PuzzleTheme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<PuzzleTheme | null>(null);
  const [themeProgress, setThemeProgress] = useState<Map<string, ThemeProgress>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ThemeCategoryType | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard' | 'expert'>('all');

  // Initialize themes with word pools
  useEffect(() => {
    const initializeThemes = async () => {
      setIsLoading(true);

      try {
        const themes: PuzzleTheme[] = [];

        // Process predefined themes
        for (const [key, themeTemplate] of Object.entries(PREDEFINED_THEMES)) {
          let wordPool = [];

          // Add word pool based on theme
          switch (themeTemplate.id) {
            case 'programming_basics':
              wordPool = THEME_WORD_POOLS.PROGRAMMING;
              break;
            case 'biology_fundamentals':
              wordPool = THEME_WORD_POOLS.BIOLOGY;
              break;
            case 'ocean_life':
              wordPool = THEME_WORD_POOLS.OCEAN_LIFE;
              break;
            default:
              wordPool = THEME_WORD_POOLS.PROGRAMMING; // fallback
          }

          const theme: PuzzleTheme = {
            ...themeTemplate,
            wordPool,
            requirements: themeTemplate.isPremium ? [
              {
                type: 'subscription',
                value: 'premium',
                description: 'Requires premium subscription'
              }
            ] : [],
            educationalInfo: {
              overview: `Learn about ${themeTemplate.name.toLowerCase()} through engaging word puzzles!`,
              keyConcepts: ['Vocabulary building', 'Pattern recognition', 'Context understanding'],
              learningObjectives: THEME_LEARNING_OBJECTIVES[themeTemplate.category as keyof typeof THEME_LEARNING_OBJECTIVES] || [],
              resources: [
                {
                  type: 'article',
                  title: `Introduction to ${themeTemplate.name}`,
                  description: `Comprehensive guide to ${themeTemplate.name.toLowerCase()} terminology`,
                  difficulty: 'beginner',
                  estimatedTime: 10
                }
              ]
            },
            achievements: [
              THEME_ACHIEVEMENTS.PROGRAMMING_MASTER,
              THEME_ACHIEVEMENTS.BIOLOGY_EXPERT,
              THEME_ACHIEVEMENTS.OCEAN_EXPLORER
            ].filter(achievement =>
              achievement.id.includes(themeTemplate.category) ||
              themeTemplate.id.includes('programming') ||
              themeTemplate.id.includes('biology') ||
              themeTemplate.id.includes('ocean')
            ),
            stats: {
              totalPlayers: Math.floor(Math.random() * 10000) + 1000,
              averageCompletionTime: Math.floor(Math.random() * 600) + 300,
              completionRate: Math.random() * 0.5 + 0.3,
              averageScore: Math.floor(Math.random() * 500) + 500,
              popularDifficulty: 'medium',
              topScorers: []
            }
          };

          themes.push(theme);
        }

        setAvailableThemes(themes);

        // Load player progress
        loadPlayerProgress();

      } catch (error) {
        console.error('Failed to initialize themes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeThemes();
  }, []);

  // Load player progress from localStorage
  const loadPlayerProgress = useCallback(() => {
    try {
      const savedProgress = localStorage.getItem(`themeProgress_${playerId}`);
      if (savedProgress) {
        const progressArray = JSON.parse(savedProgress);
        const progressMap = new Map(progressArray.map((p: ThemeProgress) => [p.themeId, p]));
        setThemeProgress(progressMap);
      }
    } catch (error) {
      console.error('Failed to load theme progress:', error);
    }
  }, [playerId]);

  // Save player progress to localStorage
  const savePlayerProgress = useCallback((progress: Map<string, ThemeProgress>) => {
    try {
      const progressArray = Array.from(progress.values());
      localStorage.setItem(`themeProgress_${playerId}`, JSON.stringify(progressArray));
    } catch (error) {
      console.error('Failed to save theme progress:', error);
    }
  }, [playerId]);

  // Get filtered themes based on search and filters
  const filteredThemes = useMemo(() => {
    return availableThemes.filter(theme => {
      // Search filter
      if (searchTerm && !theme.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !theme.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && theme.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'all' && theme.difficulty !== selectedDifficulty) {
        return false;
      }

      return true;
    });
  }, [availableThemes, searchTerm, selectedCategory, selectedDifficulty]);

  // Theme management
  const selectTheme = useCallback((theme: PuzzleTheme) => {
    setSelectedTheme(theme);
  }, []);

  const startTheme = useCallback((theme: PuzzleTheme) => {
    // Check requirements
    if (theme.requirements) {
      for (const requirement of theme.requirements) {
        if (!checkRequirement(requirement)) {
          throw new Error(`Requirement not met: ${requirement.description}`);
        }
      }
    }

    // Initialize or update progress
    const progress: ThemeProgress = {
      themeId: theme.id,
      playerId,
      startedAt: new Date().toISOString(),
      lastPlayed: new Date().toISOString(),
      wordsCompleted: [],
      totalWords: theme.wordPool.length,
      bestScore: 0,
      bestTime: 0,
      attempts: 0,
      currentStreak: 0,
      masteryLevel: 0,
      achievements: [],
      notes: [],
      hints: []
    };

    const updatedProgress = new Map(themeProgress);
    updatedProgress.set(theme.id, progress);
    setThemeProgress(updatedProgress);
    savePlayerProgress(updatedProgress);

    setSelectedTheme(theme);
    return progress;
  }, [playerId, themeProgress, savePlayerProgress]);

  const updateThemeProgress = useCallback((themeId: string, updates: Partial<ThemeProgress>) => {
    const currentProgress = themeProgress.get(themeId);
    if (!currentProgress) return;

    const updatedProgress: ThemeProgress = {
      ...currentProgress,
      ...updates,
      lastPlayed: new Date().toISOString()
    };

    // Calculate mastery level
    updatedProgress.masteryLevel = calculateMasteryLevel(updatedProgress);

    const progressMap = new Map(themeProgress);
    progressMap.set(themeId, updatedProgress);
    setThemeProgress(progressMap);
    savePlayerProgress(progressMap);
  }, [themeProgress, savePlayerProgress]);

  const completeWord = useCallback((themeId: string, word: string, score: number, timeSpent: number) => {
    const progress = themeProgress.get(themeId);
    if (!progress) return;

    const updates: Partial<ThemeProgress> = {
      wordsCompleted: [...progress.wordsCompleted, word],
      bestScore: Math.max(progress.bestScore, score),
      bestTime: progress.bestTime === 0 ? timeSpent : Math.min(progress.bestTime, timeSpent),
      attempts: progress.attempts + 1,
      currentStreak: progress.currentStreak + 1
    };

    updateThemeProgress(themeId, updates);
  }, [themeProgress, updateThemeProgress]);

  const getThemeProgress = useCallback((themeId: string): ThemeProgress | undefined => {
    return themeProgress.get(themeId);
  }, [themeProgress]);

  const getCompletedThemes = useCallback((): PuzzleTheme[] => {
    return availableThemes.filter(theme => {
      const progress = themeProgress.get(theme.id);
      return progress && progress.wordsCompleted.length === theme.wordPool.length;
    });
  }, [availableThemes, themeProgress]);

  const getThemeStats = useCallback((): {
    totalThemes: number;
    completedThemes: number;
    inProgressThemes: number;
    totalWords: number;
    completedWords: number;
    masteryLevel: number;
    favoriteCategory: string;
  } => {
    const completed = getCompletedThemes();
    const inProgress = availableThemes.filter(theme => {
      const progress = themeProgress.get(theme.id);
      return progress && progress.wordsCompleted.length > 0 &&
             progress.wordsCompleted.length < theme.wordPool.length;
    });

    const totalWords = availableThemes.reduce((sum, theme) => sum + theme.wordPool.length, 0);
    const completedWords = Array.from(themeProgress.values())
      .reduce((sum, progress) => sum + progress.wordsCompleted.length, 0);

    const masteryLevel = themeProgress.size > 0
      ? Array.from(themeProgress.values())
        .reduce((sum, progress) => sum + progress.masteryLevel, 0) / themeProgress.size
      : 0;

    const categoryCount = new Map<string, number>();
    completed.forEach(theme => {
      categoryCount.set(theme.category, (categoryCount.get(theme.category) || 0) + 1);
    });

    const favoriteCategory = Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';

    return {
      totalThemes: availableThemes.length,
      completedThemes: completed.length,
      inProgressThemes: inProgress.length,
      totalWords,
      completedWords,
      masteryLevel: Math.round(masteryLevel),
      favoriteCategory
    };
  }, [availableThemes, themeProgress, getCompletedThemes]);

  // Helper functions
  const checkRequirement = useCallback((requirement: any): boolean => {
    switch (requirement.type) {
      case 'subscription':
        return false; // Mock: user doesn't have premium
      case 'level':
        return true; // Mock: user meets level requirement
      case 'achievement':
        return true; // Mock: user has required achievement
      default:
        return true;
    }
  }, []);

  const calculateMasteryLevel = useCallback((progress: ThemeProgress): number => {
    const completionRate = progress.wordsCompleted.length / progress.totalWords;
    const scoreComponent = progress.bestScore / 1000; // Assuming max score of 1000
    const streakComponent = Math.min(progress.currentStreak / 10, 1); // Cap at 10 streak

    return Math.round((completionRate * 50 + scoreComponent * 30 + streakComponent * 20));
  }, []);

  // Get themes by category
  const getThemesByCategory = useCallback((category: ThemeCategoryType): PuzzleTheme[] => {
    return availableThemes.filter(theme => theme.category === category);
  }, [availableThemes]);

  // Get recommended themes
  const getRecommendedThemes = useCallback((limit: number = 3): PuzzleTheme[] => {
    // Simple recommendation logic based on player progress and preferences
    return availableThemes
      .filter(theme => {
        const progress = themeProgress.get(theme.id);
        return !progress || progress.wordsCompleted.length < theme.wordPool.length;
      })
      .sort((a, b) => {
        const aProgress = themeProgress.get(a.id);
        const bProgress = themeProgress.get(b.id);

        // Prioritize themes that match player's difficulty preference
        if (selectedDifficulty !== 'all' && selectedDifficulty !== undefined) {
          if (a.difficulty === selectedDifficulty) return -1;
          if (b.difficulty === selectedDifficulty) return 1;
        }

        // Prioritize themes in player's favorite category
        const stats = getThemeStats();
        if (a.category === stats.favoriteCategory) return -1;
        if (b.category === stats.favoriteCategory) return 1;

        return 0;
      })
      .slice(0, limit);
  }, [availableThemes, themeProgress, selectedDifficulty, getThemeStats]);

  // Search themes
  const searchThemes = useCallback((query: string) => {
    setSearchTerm(query);
  }, []);

  // Filter by category
  const filterByCategory = useCallback((category: ThemeCategoryType | 'all') => {
    setSelectedCategory(category);
  }, []);

  // Filter by difficulty
  const filterByDifficulty = useCallback((difficulty: 'all' | 'easy' | 'medium' | 'hard' | 'expert') => {
    setSelectedDifficulty(difficulty);
  }, []);

  return {
    // State
    availableThemes,
    selectedTheme,
    filteredThemes,
    themeProgress,
    isLoading,
    searchTerm,
    selectedCategory,
    selectedDifficulty,

    // Computed
    stats: getThemeStats(),
    completedThemes: getCompletedThemes(),
    recommendedThemes: getRecommendedThemes(),

    // Methods
    selectTheme,
    startTheme,
    updateThemeProgress,
    completeWord,
    getThemeProgress,
    getThemesByCategory,
    searchThemes,
    filterByCategory,
    filterByDifficulty
  };
};