import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useThemedPuzzles } from '../hooks/useThemedPuzzles';
import {
  PuzzleTheme,
  ThemeProgress,
  ThemeCategory,
  PREDEFINED_THEMES
} from '../types/themedPuzzles';
import {
  BookOpen,
  Code,
  Microscope,
  Trees,
  Globe,
  Music,
  Palette,
  Trophy,
  Star,
  Clock,
  Target,
  Users,
  Filter,
  Search,
  ChevronRight,
  Lock,
  CheckCircle,
  TrendingUp,
  Award,
  Heart,
  Zap,
  BarChart3,
  Settings,
  Play,
  BookMarked,
  Sparkles
} from 'lucide-react';

interface ThemedPuzzleModeProps {
  playerId: string;
  onBack?: () => void;
  compact?: boolean;
}

interface ThemeCardProps {
  theme: PuzzleTheme;
  progress?: ThemeProgress;
  onSelect: (theme: PuzzleTheme) => void;
  onStart: (theme: PuzzleTheme) => void;
}

const ThemeCard: React.FC<ThemeCardProps> = memo(({ theme, progress, onSelect, onStart }) => {
  const completionPercentage = progress ? Math.round((progress.wordsCompleted.length / theme.totalWords) * 100) : 0;
  const isCompleted = progress && progress.wordsCompleted.length === theme.totalWords;
  const isStarted = progress && progress.wordsCompleted.length > 0;

  const difficultyColor = useMemo(() => {
    switch (theme.difficulty) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'hard': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'expert': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }, [theme.difficulty]);

  const categoryIcon = useMemo(() => {
    switch (theme.category) {
      case 'technology': return <Code className="w-5 h-5" />;
      case 'science': return <Microscope className="w-5 h-5" />;
      case 'nature': return <Trees className="w-5 h-5" />;
      case 'culture': return <Globe className="w-5 h-5" />;
      case 'arts': return <Palette className="w-5 h-5" />;
      case 'music': return <Music className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  }, [theme.category]);

  return (
    <div
      className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer border-2 ${
        theme.isPremium ? 'border-purple-200' : difficultyColor
      }`}
      onClick={() => onSelect(theme)}
    >
      {/* Theme Header */}
      <div
        className="h-32 p-6 flex items-center justify-between relative"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-3xl">{theme.icon}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{theme.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{theme.category}</p>
          </div>
        </div>

        {theme.isPremium && (
          <div className="absolute top-4 right-4">
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Premium
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="absolute top-4 right-4">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Completed
            </div>
          </div>
        )}
      </div>

      {/* Theme Content */}
      <div className="p-6">
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">{theme.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <Target className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Words</p>
            <p className="font-semibold text-sm">{theme.totalWords}</p>
          </div>
          <div className="text-center">
            <Users className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Players</p>
            <p className="font-semibold text-sm">{theme.stats?.totalPlayers?.toLocaleString() || '0'}</p>
          </div>
          <div className="text-center">
            <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Success</p>
            <p className="font-semibold text-sm">
              {theme.stats ? Math.round(theme.stats.completionRate * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {isStarted && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">Progress</span>
              <span className="text-xs text-gray-500">
                {progress?.wordsCompleted.length || 0} / {theme.totalWords}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isCompleted ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Difficulty Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${difficultyColor}`}>
            {theme.difficulty.toUpperCase()}
          </span>
          {progress && (
            <span className="text-xs text-gray-500">
              Mastery: {progress.masteryLevel}%
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            isStarted ? onStart(theme) : onStart(theme);
          }}
          disabled={theme.isPremium}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            theme.isPremium
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : isCompleted
              ? 'bg-green-500 text-white hover:bg-green-600'
              : isStarted
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
          }`}
        >
          {theme.isPremium ? (
            <>
              <Lock className="w-4 h-4" />
              Unlock with Premium
            </>
          ) : isCompleted ? (
            <>
              <Trophy className="w-4 h-4" />
              Review Theme
            </>
          ) : isStarted ? (
            <>
              <Play className="w-4 h-4" />
              Continue
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Start Theme
            </>
          )}
        </button>
      </div>
    </div>
  );
});

ThemeCard.displayName = 'ThemeCard';

const CategoryFilter: React.FC<{
  selectedCategory: ThemeCategory | 'all';
  onCategoryChange: (category: ThemeCategory | 'all') => void;
}> = memo(({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { value: 'all', label: 'All Themes', icon: <BookOpen className="w-4 h-4" /> },
    { value: 'technology', label: 'Technology', icon: <Code className="w-4 h-4" /> },
    { value: 'science', label: 'Science', icon: <Microscope className="w-4 h-4" /> },
    { value: 'nature', label: 'Nature', icon: <Trees className="w-4 h-4" /> },
    { value: 'culture', label: 'Culture', icon: <Globe className="w-4 h-4" /> },
    { value: 'arts', label: 'Arts', icon: <Palette className="w-4 h-4" /> },
    { value: 'music', label: 'Music', icon: <Music className="w-4 h-4" /> }
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value as ThemeCategory | 'all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === category.value
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          {category.icon}
          <span className="hidden sm:inline">{category.label}</span>
        </button>
      ))}
    </div>
  );
});

CategoryFilter.displayName = 'CategoryFilter';

const DifficultyFilter: React.FC<{
  selectedDifficulty: 'all' | 'easy' | 'medium' | 'hard' | 'expert';
  onDifficultyChange: (difficulty: 'all' | 'easy' | 'medium' | 'hard' | 'expert') => void;
}> = memo(({ selectedDifficulty, onDifficultyChange }) => {
  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'expert', label: 'Expert' }
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {difficulties.map((difficulty) => (
        <button
          key={difficulty.value}
          onClick={() => onDifficultyChange(difficulty.value as any)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedDifficulty === difficulty.value
              ? 'bg-purple-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          {difficulty.label}
        </button>
      ))}
    </div>
  );
});

DifficultyFilter.displayName = 'DifficultyFilter';

const StatsOverview: React.FC<{ stats: any }> = memo(({ stats }) => (
  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <BarChart3 className="w-5 h-5 text-purple-600" />
      Your Learning Progress
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center">
        <BookOpen className="w-6 h-6 text-blue-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-900">{stats.totalThemes}</p>
        <p className="text-xs text-gray-600">Total Themes</p>
      </div>
      <div className="text-center">
        <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-900">{stats.completedThemes}</p>
        <p className="text-xs text-gray-600">Completed</p>
      </div>
      <div className="text-center">
        <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-900">{stats.completedWords}</p>
        <p className="text-xs text-gray-600">Words Learned</p>
      </div>
      <div className="text-center">
        <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-900">{stats.masteryLevel}%</p>
        <p className="text-xs text-gray-600">Mastery Level</p>
      </div>
    </div>
  </div>
));

StatsOverview.displayName = 'StatsOverview';

const ThemedPuzzleMode: React.FC<ThemedPuzzleModeProps> = ({ playerId, onBack, compact = false }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showRecommendedOnly, setShowRecommendedOnly] = useState<boolean>(false);

  const themedPuzzles = useThemedPuzzles({ playerId });

  const handleThemeSelect = useCallback((theme: PuzzleTheme) => {
    themedPuzzles.selectTheme(theme);
  }, [themedPuzzles]);

  const handleThemeStart = useCallback((theme: PuzzleTheme) => {
    try {
      themedPuzzles.startTheme(theme);
      // In a real app, this would navigate to the game screen
      console.log('Starting theme:', theme.name);
    } catch (error) {
      console.error('Failed to start theme:', error);
      alert(error instanceof Error ? error.message : 'Failed to start theme');
    }
  }, [themedPuzzles]);

  const handleSearch = useCallback((query: string) => {
    themedPuzzles.searchThemes(query);
  }, [themedPuzzles]);

  const handleCategoryFilter = useCallback((category: ThemeCategory | 'all') => {
    themedPuzzles.filterByCategory(category);
  }, [themedPuzzles]);

  const handleDifficultyFilter = useCallback((difficulty: 'all' | 'easy' | 'medium' | 'hard' | 'expert') => {
    themedPuzzles.filterByDifficulty(difficulty);
  }, [themedPuzzles]);

  const themesToDisplay = showRecommendedOnly ? themedPuzzles.recommendedThemes : themedPuzzles.filteredThemes;

  if (compact) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Theme Access</h3>
        <div className="grid grid-cols-1 gap-2">
          {themedPuzzles.recommendedThemes.slice(0, 3).map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeStart(theme)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <span className="text-xl">{theme.icon}</span>
              <div className="flex-1">
                <p className="font-medium text-sm">{theme.name}</p>
                <p className="text-xs text-gray-500">{theme.difficulty}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Themed Puzzles</h1>
            <p className="text-gray-600">
              Learn vocabulary through themed word puzzles! Explore technology, science, nature, and more.
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Back
          </button>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={themedPuzzles.stats} />

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search themes..."
                value={themedPuzzles.searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Categories
              </h3>
              <CategoryFilter
                selectedCategory={themedPuzzles.selectedCategory}
                onCategoryChange={handleCategoryFilter}
              />
            </div>

            {/* Difficulty Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Difficulty Level</h3>
              <DifficultyFilter
                selectedDifficulty={themedPuzzles.selectedDifficulty}
                onDifficultyChange={handleDifficultyFilter}
              />
            </div>

            {/* Additional Options */}
            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showRecommendedOnly}
                  onChange={(e) => setShowRecommendedOnly(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show recommended only</span>
              </label>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  title="Grid view"
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current"></div>
                    <div className="bg-current"></div>
                    <div className="bg-current"></div>
                    <div className="bg-current"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  title="List view"
                >
                  <div className="w-4 h-4 space-y-0.5">
                    <div className="h-0.5 bg-current"></div>
                    <div className="h-0.5 bg-current"></div>
                    <div className="h-0.5 bg-current"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Section */}
        {!showRecommendedOnly && themedPuzzles.recommendedThemes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Recommended for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themedPuzzles.recommendedThemes.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  progress={themedPuzzles.getThemeProgress(theme.id)}
                  onSelect={handleThemeSelect}
                  onStart={handleThemeStart}
                />
              ))}
            </div>
          </div>
        )}

        {/* Themes Grid/List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {showRecommendedOnly ? 'Recommended Themes' : 'All Themes'}
            </h2>
            <span className="text-sm text-gray-500">
              {themesToDisplay.length} {themesToDisplay.length === 1 ? 'theme' : 'themes'} found
            </span>
          </div>

          {themedPuzzles.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="ml-3 text-gray-600">Loading themes...</p>
            </div>
          ) : themesToDisplay.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No themes found</h3>
              <p className="text-gray-600">
                Try adjusting your filters or search terms to find more themes.
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ?
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" :
              "space-y-4"
            }>
              {themesToDisplay.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  progress={themedPuzzles.getThemeProgress(theme.id)}
                  onSelect={handleThemeSelect}
                  onStart={handleThemeStart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ThemedPuzzleMode);