export interface PuzzleTheme {
  id: string;
  name: string;
  description: string;
  category: ThemeCategory;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  wordPool: ThemeWord[];
  icon: string;
  color: string;
  backgroundColor: string;
  isPremium: boolean;
  requirements?: ThemeRequirement[];
  educationalInfo?: EducationalContent;
  achievements?: ThemeAchievement[];
  stats?: ThemeStats;
}

export interface ThemeWord {
  word: string;
  difficulty: number; // 1-5 scale
  definition: string;
  example?: string;
  funFact?: string;
  relatedWords?: string[];
  pronunciation?: string;
  syllables?: number;
  etymology?: string;
  category?: string;
}

export interface EducationalContent {
  overview: string;
  keyConcepts: string[];
  learningObjectives: string[];
  resources: LearningResource[];
  quizzes?: ThemeQuiz[];
  exercises?: ThemeExercise[];
}

export interface LearningResource {
  type: 'article' | 'video' | 'interactive' | 'book' | 'website';
  title: string;
  url?: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
}

export interface ThemeQuiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  rewards: QuizReward[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  hint?: string;
}

export interface ThemeExercise {
  id: string;
  title: string;
  description: string;
  instructions: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // in minutes
  type: 'word_building' | 'pattern_recognition' | 'vocabulary' | 'spelling';
  content: ExerciseContent;
}

export interface ExerciseContent {
  words?: string[];
  patterns?: string[];
  questions?: string[];
  materials?: string[];
}

export interface ThemeRequirement {
  type: 'level' | 'achievement' | 'previous_themes' | 'subscription';
  value: string | number;
  description: string;
}

export interface ThemeAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: AchievementCriteria;
  reward: AchievementReward;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string; // ISO timestamp
}

export interface AchievementCriteria {
  type: 'complete_theme' | 'perfect_score' | 'speed_run' | 'no_hints' | 'consecutive_days';
  value: number;
  condition?: string;
}

export interface AchievementReward {
  type: 'badge' | 'points' | 'theme' | 'title' | 'avatar';
  value: string | number;
  description: string;
}

export interface ThemeStats {
  totalPlayers: number;
  averageCompletionTime: number;
  completionRate: number;
  averageScore: number;
  popularDifficulty: string;
  topScorers: ThemePlayer[];
}

export interface ThemePlayer {
  playerId: string;
  playerName: string;
  avatar: string;
  score: number;
  completionTime: number;
  date: string; // ISO timestamp
  rank?: number;
}

export interface ThemeProgress {
  themeId: string;
  playerId: string;
  startedAt: string; // ISO timestamp
  lastPlayed: string; // ISO timestamp
  wordsCompleted: string[];
  totalWords: number;
  bestScore: number;
  bestTime: number;
  attempts: number;
  currentStreak: number;
  masteryLevel: number; // 0-100
  achievements: string[]; // achievement IDs
  notes?: string[];
  hints?: ThemeHint[];
}

export interface ThemeHint {
  wordId: string;
  hint: string;
  type: 'definition' | 'etymology' | 'usage' | 'pronunciation' | 'related';
  unlockedAt: string; // ISO timestamp
}

export interface ThemePlaylist {
  id: string;
  name: string;
  description: string;
  themeIds: string[];
  creator: string;
  isPublic: boolean;
  tags: string[];
  rating: number;
  totalRatings: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  estimatedTime: number; // in minutes
}

export interface ThemeEvent {
  id: string;
  name: string;
  description: string;
  type: 'tournament' | 'challenge' | 'learning' | 'community';
  themeId?: string;
  startTime: string; // ISO timestamp
  endTime: string; // ISO timestamp
  rewards: EventReward[];
  requirements?: EventRequirement[];
  participants: string[]; // player IDs
  isActive: boolean;
  maxParticipants?: number;
}

export interface EventReward {
  type: 'points' | 'badge' | 'theme' | 'title' | 'avatar' | 'exclusive';
  value: string | number;
  description: string;
  tier: 'participation' | 'completion' | 'top_10' | 'winner';
}

export interface EventRequirement {
  type: 'level' | 'theme_completion' | 'previous_event';
  value: string | number;
  description: string;
}

// Theme Categories
export const ThemeCategory = {
  TECHNOLOGY: 'technology',
  SCIENCE: 'science',
  NATURE: 'nature',
  CULTURE: 'culture',
  HISTORY: 'history',
  GEOGRAPHY: 'geography',
  LITERATURE: 'literature',
  ARTS: 'arts',
  SPORTS: 'sports',
  FOOD: 'food',
  MUSIC: 'music',
  BUSINESS: 'business',
  MEDICAL: 'medical',
  SPACE: 'space',
  LANGUAGES: 'languages'
} as const;

export type ThemeCategoryType = typeof ThemeCategory[keyof typeof ThemeCategory];

// Predefined Themes
export const PREDEFINED_THEMES = {
  // Technology Themes
  PROGRAMMING: {
    id: 'programming_basics',
    name: 'Programming Basics',
    description: 'Essential programming and coding terminology',
    category: ThemeCategory.TECHNOLOGY,
    difficulty: 'medium' as const,
    icon: '💻',
    color: '#3B82F6',
    backgroundColor: '#EBF8FF',
    isPremium: false
  },

  // Science Themes
  BIOLOGY: {
    id: 'biology_fundamentals',
    name: 'Biology Fundamentals',
    description: 'Core biological concepts and terminology',
    category: ThemeCategory.SCIENCE,
    difficulty: 'medium' as const,
    icon: '🧬',
    color: '#10B981',
    backgroundColor: '#F0FDF4',
    isPremium: false
  },

  // Nature Themes
  OCEAN_LIFE: {
    id: 'ocean_life',
    name: 'Ocean Life',
    description: 'Marine biology and ocean ecosystem vocabulary',
    category: ThemeCategory.NATURE,
    difficulty: 'easy' as const,
    icon: '🌊',
    color: '#06B6D4',
    backgroundColor: '#ECFEFF',
    isPremium: false
  },

  // Culture Themes
  WORLD_CUISINE: {
    id: 'world_cuisine',
    name: 'World Cuisine',
    description: 'International cooking and food vocabulary',
    category: ThemeCategory.FOOD,
    difficulty: 'easy' as const,
    icon: '🍽️',
    color: '#F59E0B',
    backgroundColor: '#FFFBEB',
    isPremium: false
  },

  // Space Themes
  SPACE_EXPLORATION: {
    id: 'space_exploration',
    name: 'Space Exploration',
    description: 'Astronomy and space travel terminology',
    category: ThemeCategory.SPACE,
    difficulty: 'hard' as const,
    icon: '🚀',
    color: '#8B5CF6',
    backgroundColor: '#F3E8FF',
    isPremium: true
  },

  // History Themes
  ANCIENT_CIVILIZATIONS: {
    id: 'ancient_civilizations',
    name: 'Ancient Civilizations',
    description: 'Historical terms from ancient cultures',
    category: ThemeCategory.HISTORY,
    difficulty: 'hard' as const,
    icon: '🏛️',
    color: '#DC2626',
    backgroundColor: '#FEF2F2',
    isPremium: true
  }
} as const;

// Theme-specific word pools
export const THEME_WORD_POOLS = {
  PROGRAMMING: [
    { word: 'ARRAY', definition: 'A collection of items stored at contiguous memory locations', funFact: 'Arrays are one of the oldest data structures in computer science' },
    { word: 'FUNCTION', definition: 'A block of reusable code that performs a specific task', example: 'function calculateSum(a, b) { return a + b; }' },
    { word: 'VARIABLE', definition: 'A named storage location in computer memory', pronunciation: 'VAIR-ee-uh-bull' },
    { word: 'LOOP', definition: 'A programming structure that repeats a block of code', relatedWords: ['iteration', 'while', 'for'] },
    { word: 'CLASS', definition: 'A blueprint for creating objects in object-oriented programming', difficulty: 4 },
    { word: 'METHOD', definition: 'A function that belongs to a class', relatedWords: ['function', 'class', 'object'] },
    { word: 'DEBUG', definition: 'The process of finding and fixing errors in code', funFact: 'The term originated from actual insects causing computer malfunctions' },
    { word: 'SYNTAX', definition: 'The set of rules that define the structure of a programming language', pronunciation: 'SIN-tax' },
    { word: 'ALGORITHM', definition: 'A step-by-step procedure for solving a problem or accomplishing a task', etymology: 'From the name of Persian mathematician Al-Khwarizmi' },
    { word: 'DATABASE', definition: 'An organized collection of structured information stored electronically', difficulty: 3 }
  ],

  BIOLOGY: [
    { word: 'CELL', definition: 'The basic structural and functional unit of all living organisms', funFact: 'The human body contains about 37 trillion cells' },
    { word: 'GENE', definition: 'A unit of heredity that is transferred from a parent to offspring', pronunciation: 'jeen' },
    { word: 'PROTEIN', definition: 'Large biomolecules consisting of amino acid residues', example: 'Enzymes are proteins that speed up chemical reactions' },
    { word: 'MITOSIS', definition: 'The process by which a cell divides to create two identical daughter cells', difficulty: 4 },
    { word: 'ECOSYSTEM', definition: 'A community of living organisms and their physical environment', relatedWords: ['habitat', 'biodiversity', 'environment'] },
    { word: 'PHOTOSYNTHESIS', definition: 'The process by which plants convert light energy into chemical energy', etymology: 'Greek: photo (light) + synthesis (putting together)' },
    { word: 'EVOLUTION', definition: 'The change in heritable characteristics of biological populations over generations', funFact: 'Charles Darwin published On the Origin of Species in 1859' },
    { word: 'CHROMOSOME', definition: 'A threadlike structure of nucleic acids and protein found in the nucleus', pronunciation: 'KROH-muh-sohm' },
    { word: 'METABOLISM', definition: 'The chemical processes that occur within a living organism to maintain life', difficulty: 3 },
    { word: 'ORGANISM', definition: 'An individual living thing that can react to stimuli, reproduce, and grow' }
  ],

  OCEAN_LIFE: [
    { word: 'CORAL', definition: 'Marine invertebrates that typically form compact colonies of many identical polyps', funFact: 'Coral reefs support 25% of all marine life despite covering less than 1% of the ocean floor' },
    { word: 'WHALE', definition: 'Large marine mammals of the order Cetacea', example: 'The blue whale is the largest animal on Earth' },
    { word: 'PLANKTON', definition: 'Small organisms that drift in water bodies, both freshwater and marine', pronunciation: 'PLANK-ton' },
    { word: 'TIDE', definition: 'The rise and fall of sea levels caused by gravitational forces', relatedWords: ['moon', 'gravity', 'ocean'] },
    { word: 'REEF', definition: 'A ridge or shoal of rock, coral, or sand near the surface of water', difficulty: 2 },
    { word: 'OCEAN', definition: 'A vast body of salt water that covers approximately 71% of Earth\'s surface', funFact: 'The Pacific Ocean is larger than all land masses combined' },
    { word: 'DOLPHIN', definition: 'Intelligent marine mammals belonging to the family Delphinidae', example: 'Dolphins use echolocation to navigate and hunt' },
    { word: 'SEAWED', definition: 'Marine algae and plants that grow in the sea', pronunciation: 'SEE-weed' },
    { word: 'CURRENT', definition: 'A body of water moving in a definite direction', relatedWords: ['stream', 'flow', 'circulation'] },
    { word: 'ANEMONE', definition: 'Marine predatory animals of the order Actiniaria', etymology: 'Greek: anemone (windflower)', difficulty: 4 }
  ]
} as const;

// Theme-specific achievements
export const THEME_ACHIEVEMENTS = {
  PROGRAMMING_MASTER: {
    id: 'programming_master',
    name: 'Code Master',
    description: 'Complete the Programming Basics theme with 100% accuracy',
    icon: '👨‍💻',
    criteria: { type: 'perfect_score' as const, value: 100 },
    reward: { type: 'badge' as const, value: 'code_master', description: 'Elite Programming Badge' },
    rarity: 'epic' as const
  },

  BIOLOGY_EXPERT: {
    id: 'biology_expert',
    name: 'Biology Expert',
    description: 'Complete 50 biology-themed words without hints',
    icon: '🧬',
    criteria: { type: 'no_hints' as const, value: 50 },
    reward: { type: 'title' as const, value: 'Biologist', description: 'Biology Expert Title' },
    rarity: 'rare' as const
  },

  OCEAN_EXPLORER: {
    id: 'ocean_explorer',
    name: 'Ocean Explorer',
    description: 'Complete the Ocean Life theme in under 5 minutes',
    icon: '🤿',
    criteria: { type: 'speed_run' as const, value: 300 },
    reward: { type: 'avatar' as const, value: 'diving_mask', description: 'Diving Mask Avatar' },
    rarity: 'legendary' as const
  }
} as const;

// Learning objectives by category
export const THEME_LEARNING_OBJECTIVES = {
  [ThemeCategory.TECHNOLOGY]: [
    'Understand fundamental programming concepts',
    'Learn technical terminology and vocabulary',
    'Develop problem-solving skills through coding exercises',
    'Explore emerging technologies and trends'
  ],

  [ThemeCategory.SCIENCE]: [
    'Master scientific terminology and concepts',
    'Understand the scientific method',
    'Explore real-world applications of scientific principles',
    'Develop critical thinking and analytical skills'
  ],

  [ThemeCategory.NATURE]: [
    'Learn about ecosystems and biodiversity',
    'Understand environmental conservation concepts',
    'Explore flora and fauna terminology',
    'Develop awareness of environmental issues'
  ],

  [ThemeCategory.CULTURE]: [
    'Explore diverse cultural perspectives',
    'Learn about historical and contemporary cultural practices',
    'Understand cultural terminology and expressions',
    'Develop cross-cultural communication skills'
  ]
} as const;