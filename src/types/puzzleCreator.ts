export interface CustomPuzzle {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  isPublic: boolean;
  isApproved: boolean;
  tags: string[];
  category: PuzzleCategory;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';

  // Puzzle content
  targetWord: string;
  pathDefinition: PathDefinition;
  hints: CustomHint[];
  theme?: string;
  educationalContent?: EducationalSnippet;

  // Community features
  likes: number;
  dislikes: number;
  plays: number;
  completions: number;
  averageRating: number;
  totalRatings: number;

  // Moderation
  reports: PuzzleReport[];
  moderationStatus: 'pending' | 'approved' | 'rejected' | 'under_review';
  moderatorNotes?: string;

  // Metadata
  language: string;
  estimatedTime: number; // in minutes
  requirements?: PuzzleRequirement[];
}

export interface PathDefinition {
  type: 'linear' | 'branching' | 'circular' | 'custom';
  grid: PathGrid;
  path: Coordinate[];
  constraints?: PathConstraint[];
}

export interface PathGrid {
  width: number;
  height: number;
  obstacles?: Coordinate[]; // cells that cannot be used
  requiredCells?: Coordinate[]; // cells that must be used
  startPoint?: Coordinate;
  endPoint?: Coordinate;
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface PathConstraint {
  type: 'max_length' | 'min_length' | 'direction' | 'cell_requirement';
  value: any;
  description: string;
}

export interface CustomHint {
  id: string;
  type: 'definition' | 'etymology' | 'usage_example' | 'synonym' | 'antonym' | 'fun_fact';
  content: string;
  cost: number; // points to unlock
  isFree: boolean;
}

export interface EducationalSnippet {
  definition: string;
  etymology?: string;
  example?: string;
  funFact?: string;
  relatedWords?: string[];
  pronunciation?: string;
}

export interface PuzzleReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reason: ReportReason;
  description: string;
  timestamp: string; // ISO timestamp
  status: 'pending' | 'reviewed' | 'resolved';
  resolution?: string;
}

export interface PuzzleRequirement {
  type: 'level' | 'achievement' | 'completion_count' | 'premium';
  value: string | number;
  description: string;
}

export interface PuzzleCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isPublic: boolean;
  subcategories?: string[];
}

export interface PuzzleCreationSession {
  id: string;
  creatorId: string;
  title: string;
  currentStep: CreationStep;
  progress: number; // 0-100
  data: Partial<CustomPuzzle>;
  lastSaved: string; // ISO timestamp
  isAutoSave: boolean;
}

export type CreationStep =
  | 'basic_info'
  | 'word_selection'
  | 'path_design'
  | 'hint_creation'
  | 'theme_customization'
  | 'testing'
  | 'publishing';

export interface PuzzleTemplate {
  id: string;
  name: string;
  description: string;
  category: PuzzleCategory;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  gridTemplate: PathGrid;
  pathTemplate?: Coordinate[];
  hintTemplates?: CustomHint[];
  tags: string[];
  isPremium: boolean;
}

export interface CreationTools {
  gridEditor: GridEditorTool;
  pathValidator: PathValidatorTool;
  wordChecker: WordCheckerTool;
  hintGenerator: HintGeneratorTool;
  difficultyAnalyzer: DifficultyAnalyzerTool;
}

export interface GridEditorTool {
  selectedTool: 'draw' | 'erase' | 'obstacle' | 'start' | 'end';
  grid: PathGrid;
  path: Coordinate[];
  history: PathGrid[];
  canUndo: boolean;
  canRedo: boolean;
}

export interface PathValidatorTool {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: PathSuggestion[];
}

export interface ValidationError {
  type: 'invalid_path' | 'word_too_short' | 'word_too_long' | 'invalid_word' | 'path_conflict';
  message: string;
  severity: 'error' | 'warning' | 'info';
  position?: Coordinate;
}

export interface ValidationWarning {
  type: 'difficulty_mismatch' | 'too_similar' | 'missing_hints';
  message: string;
  suggestion?: string;
}

export interface PathSuggestion {
  type: 'efficiency' | 'clarity' | 'difficulty';
  description: string;
  action?: string;
}

export interface WordCheckerTool {
  isValid: boolean;
  isCommon: boolean;
  difficulty: number; // 1-10
  definition?: string;
  synonyms?: string[];
  antonyms?: string[];
  frequency?: number; // usage frequency
}

export interface HintGeneratorTool {
  generatedHints: GeneratedHint[];
  selectedHints: CustomHint[];
}

export interface GeneratedHint {
  type: 'definition' | 'etymology' | 'usage_example' | 'synonym' | 'antonym' | 'fun_fact';
  content: string;
  quality: number; // 0-100
  source: 'auto' | 'api' | 'community';
}

export interface DifficultyAnalyzerTool {
  overallDifficulty: number; // 1-10
  factors: DifficultyFactor[];
  suggestedDifficulty: 'easy' | 'medium' | 'hard' | 'expert';
  adjustments: DifficultyAdjustment[];
}

export interface DifficultyFactor {
  factor: 'word_length' | 'word_rarity' | 'path_complexity' | 'hint_quality';
  score: number; // 1-10
  weight: number; // importance weight
  impact: string;
}

export interface DifficultyAdjustment {
  type: 'modify_hints' | 'adjust_path' | 'change_word' | 'add_constraints';
  description: string;
  effect: string;
}

export interface PuzzleTestingResult {
  puzzleId: string;
  testResults: TestResult[];
  overallScore: number; // 0-100
  averageCompletionTime: number; // in seconds
  successRate: number; // 0-1
  feedback: TestFeedback[];
  recommendations: TestRecommendation[];
}

export interface TestResult {
  testerId: string;
  completionTime: number;
  hintsUsed: number;
  rating: number; // 1-5
  feedback: string;
  completed: boolean;
}

export interface TestFeedback {
  category: 'fun_factor' | 'difficulty' | 'clarity' | 'originality';
  score: number; // 1-5
  comment: string;
}

export interface TestRecommendation {
  type: 'improvement' | 'bug_fix' | 'feature_request';
  priority: 'high' | 'medium' | 'low';
  description: string;
  action: string;
}

export interface CommunityStats {
  totalPuzzles: number;
  publicPuzzles: number;
  approvedPuzzles: number;
  pendingApproval: number;
  averageRating: number;
  topCreators: CreatorStats[];
  popularCategories: CategoryStats[];
  recentActivity: ActivityItem[];
}

export interface CreatorStats {
  creatorId: string;
  creatorName: string;
  avatar: string;
  totalPuzzles: number;
  totalPlays: number;
  averageRating: number;
  followerCount: number;
  badges: CreatorBadge[];
}

export interface CreatorBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface CategoryStats {
  categoryId: string;
  name: string;
  puzzleCount: number;
  totalPlays: number;
  averageRating: number;
}

export interface ActivityItem {
  id: string;
  type: 'puzzle_created' | 'puzzle_approved' | 'milestone_reached' | 'trending_puzzle';
  description: string;
  timestamp: string;
  userId: string;
  puzzleId?: string;
}

export interface ModerationQueue {
  pendingPuzzles: CustomPuzzle[];
  reportedPuzzles: CustomPuzzle[];
  moderators: Moderator[];
  guidelines: ModerationGuideline[];
}

export interface Moderator {
  id: string;
  name: string;
  role: 'moderator' | 'senior_moderator' | 'admin';
  permissions: string[];
  totalReviews: number;
  averageReviewTime: number; // in minutes
}

export interface ModerationGuideline {
  id: string;
  title: string;
  description: string;
  examples: ModerationExample[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ModerationExample {
  type: 'approve' | 'reject' | 'modify';
  description: string;
  reasoning: string;
}

export interface PuzzleEditorSettings {
  autoSave: boolean;
  autoSaveInterval: number; // in minutes
  showGrid: boolean;
  snapToGrid: boolean;
  enableAnimations: boolean;
  soundEnabled: boolean;
  language: string;
  theme: 'light' | 'dark' | 'auto';
}

export interface EditorKeyboardShortcuts {
  undo: string[];
  redo: string[];
  save: string[];
  test: string[];
  publish: string[];
  toggleGrid: string[];
  clearPath: string[];
}

// Report reasons
export const ReportReason = {
  INAPPROPRIATE_CONTENT: 'inappropriate_content',
  COPYRIGHT_VIOLATION: 'copyright_violation',
  INCORRECT_WORD: 'incorrect_word',
  IMPOSSIBLE_PUZZLE: 'impossible_puzzle',
  POOR_QUALITY: 'poor_quality',
  SPAM: 'spam',
  HARASSMENT: 'harassment',
  MISLEADING_INFO: 'misleading_info'
} as const;

export type ReportReasonType = typeof ReportReason[keyof typeof ReportReason];

// Predefined puzzle templates
export const PUZZLE_TEMPLATES: PuzzleTemplate[] = [
  {
    id: 'linear_easy',
    name: 'Linear Path (Easy)',
    description: 'Simple straight path for beginners',
    category: { id: 'beginner', name: 'Beginner', description: 'Easy puzzles for new players', icon: '🌟', color: '#22C55E', isPublic: true },
    difficulty: 'easy',
    gridTemplate: { width: 5, height: 5, startPoint: { x: 0, y: 2 }, endPoint: { x: 4, y: 2 } },
    tags: ['linear', 'simple', 'beginner'],
    isPremium: false
  },
  {
    id: 'branching_medium',
    name: 'Branching Path (Medium)',
    description: 'Path with choices and multiple routes',
    category: { id: 'intermediate', name: 'Intermediate', description: 'Challenging puzzles with multiple solutions', icon: '🎯', color: '#F59E0B', isPublic: true },
    difficulty: 'medium',
    gridTemplate: { width: 6, height: 6 },
    tags: ['branching', 'choices', 'intermediate'],
    isPremium: false
  },
  {
    id: 'circular_hard',
    name: 'Circular Path (Hard)',
    description: 'Challenging circular path pattern',
    category: { id: 'expert', name: 'Expert', description: 'Complex puzzles for experienced players', icon: '🔥', color: '#EF4444', isPublic: true },
    difficulty: 'hard',
    gridTemplate: { width: 7, height: 7 },
    tags: ['circular', 'complex', 'expert'],
    isPremium: true
  }
] as const;

// Default editor settings
export const DEFAULT_EDITOR_SETTINGS: PuzzleEditorSettings = {
  autoSave: true,
  autoSaveInterval: 2,
  showGrid: true,
  snapToGrid: true,
  enableAnimations: true,
  soundEnabled: true,
  language: 'en',
  theme: 'light'
} as const;

// Default keyboard shortcuts
export const DEFAULT_KEYBOARD_SHORTCUTS: EditorKeyboardShortcuts = {
  undo: ['Ctrl+Z', 'Cmd+Z'],
  redo: ['Ctrl+Y', 'Cmd+Shift+Z'],
  save: ['Ctrl+S', 'Cmd+S'],
  test: ['Ctrl+T', 'Cmd+T'],
  publish: ['Ctrl+P', 'Cmd+P'],
  toggleGrid: ['Ctrl+G', 'Cmd+G'],
  clearPath: ['Ctrl+L', 'Cmd+L']
} as const;