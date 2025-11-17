export interface LearningAnalytics {
  playerId: string;
  sessionData: GameSession[];
  skillLevels: SkillLevel[];
  learningProgress: LearningProgress;
  performanceMetrics: PerformanceMetrics;
  wordAnalysis: WordAnalysis[];
  difficultyProgression: DifficultyProgression;
  recommendations: LearningRecommendation[];
  streakAnalysis: StreakAnalysis;
  timeAnalysis: TimeAnalysis;
  errorAnalysis: ErrorAnalysis;
  achievementProgress: AchievementProgress;
  lastUpdated: string;
}

export interface GameSession {
  id: string;
  gameId: string;
  startTime: string;
  endTime?: string;
  duration: number; // in seconds
  gameMode: 'daily' | 'practice' | 'timed' | 'tutorial';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  targetWord: string;
  attempts: number;
  maxAttempts: number;
  won: boolean;
  score: number;
  hintsUsed: number;
  timePerAttempt: number[]; // time taken for each attempt
  accuracy: number; // percentage of correct letters
  efficiency: number; // score per second
  isPerfectGame: boolean;
  learningEvents: LearningEvent[];
  contextData: {
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    deviceType: 'mobile' | 'tablet' | 'desktop';
    interruptions: number;
    environment: 'home' | 'work' | 'commute' | 'other';
    consecutiveGames: number;
  };
}

export interface LearningEvent {
  id: string;
  type: 'correct_word' | 'incorrect_word' | 'hint_used' | 'pattern_recognized' | 'skill_improvement' | 'skill_regression' | 'milestone_reached';
  timestamp: string;
  data: {
    word?: string;
    pattern?: string;
    skillArea?: SkillArea;
    confidence?: number;
    previousSkill?: number;
    newSkill?: number;
    details?: string;
  };
  severity: 'low' | 'medium' | 'high';
}

export interface SkillLevel {
  skillArea: SkillArea;
  currentLevel: number;
  maxLevel: number;
  experience: number;
  experienceToNext: number;
  levelHistory: SkillLevelHistory[];
  masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
  trend: 'improving' | 'stable' | 'declining';
  estimatedLearningRate: number;
  weaknesses: SkillWeakness[];
  strengths: SkillStrength[];
}

export enum SkillArea {
  VOCABULARY = 'vocabulary',
  SPELLING = 'spelling',
  PATTERN_RECOGNITION = 'pattern_recognition',
  LOGICAL_REASONING = 'logical_reasoning',
  WORD_STRUCTURE = 'word_structure',
  SPEED = 'speed',
  ACCURACY = 'accuracy',
  MEMORY = 'memory',
  ADAPTABILITY = 'adaptability',
  PROBLEM_SOLVING = 'problem_solving'
}

export interface SkillLevelHistory {
  date: string;
  level: number;
  experience: number;
  performanceScore: number;
  sessionContext: string;
}

export interface SkillWeakness {
  area: string;
  description: string;
  frequency: number;
  impactScore: number;
  recent: boolean;
  improvementPlan: string;
}

export interface SkillStrength {
  area: string;
  description: string;
  consistencyScore: number;
  recentPerformance: number;
  areasApplication: string[];
}

export interface LearningProgress {
  overallProgress: number;
  progressBySkill: Record<SkillArea, number>;
  milestones: LearningMilestone[];
  goalProgress: GoalProgress[];
  learningVelocity: number;
  retentionRate: number;
  adaptivePath: AdaptiveLearningPath[];
  completedChallenges: string[];
  recommendedNextSteps: string[];
}

export interface LearningMilestone {
  id: string;
  name: string;
  description: string;
  achievedAt?: string;
  requiredSkills: SkillArea[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rewards: MilestoneReward[];
  isUnlocked: boolean;
  progress: number;
}

export interface MilestoneReward {
  type: 'achievement' | 'title' | 'badge' | 'theme' | 'powerup';
  itemId: string;
  name: string;
  description: string;
}

export interface GoalProgress {
  goalId: string;
  name: string;
  description: string;
  target: number;
  current: number;
  unit: 'games' | 'wins' | 'words' | 'minutes' | 'points';
  deadline?: string;
  isCompleted: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'daily' | 'weekly' | 'monthly' | 'custom';
}

export interface AdaptiveLearningPath {
  id: string;
  name: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  estimatedTime: number;
  prerequisites: string[];
  steps: LearningStep[];
  progress: number;
  isActive: boolean;
}

export interface LearningStep {
  id: string;
  name: string;
  description: string;
  type: 'tutorial' | 'practice' | 'challenge' | 'assessment';
  targetSkill: SkillArea;
  difficulty: number;
  duration: number;
  completedAt?: string;
  score?: number;
}

export interface PerformanceMetrics {
  recentPerformance: PerformanceSnapshot[];
  averageMetrics: AverageMetrics;
  bestPerformances: BestPerformance[];
  improvementTrends: ImprovementTrend[];
  peerComparison: PeerComparison;
  consistencyAnalysis: ConsistencyAnalysis;
}

export interface PerformanceSnapshot {
  date: string;
  overallScore: number;
  winRate: number;
  averageTime: number;
  accuracy: number;
  speed: number;
  efficiency: number;
  skillDistribution: Record<SkillArea, number>;
}

export interface AverageMetrics {
  last7Days: PerformanceSnapshot;
  last30Days: PerformanceSnapshot;
  last90Days: PerformanceSnapshot;
  allTime: PerformanceSnapshot;
}

export interface BestPerformance {
  category: 'score' | 'speed' | 'accuracy' | 'efficiency' | 'streak';
  value: number;
  date: string;
  gameMode: string;
  difficulty: string;
  word?: string;
}

export interface ImprovementTrend {
  skillArea: SkillArea;
  trend: 'improving' | 'stable' | 'declining';
  rateOfChange: number; // percentage change per week
  confidence: number;
  prediction: number; // predicted value in 30 days
}

export interface PeerComparison {
  percentile: number;
  rank: number;
  totalPlayers: number;
  strengths: string[];
  areasForImprovement: string[];
  competitorProfile: CompetitorProfile;
}

export interface CompetitorProfile {
  similarPlayers: Player[];
  topPerformers: Player[];
  learningMethods: LearningMethod[];
}

export interface Player {
  id: string;
  username: string;
  level: number;
  skills: Record<SkillArea, number>;
  playtime: number;
  achievements: string[];
}

export interface LearningMethod {
  id: string;
  name: string;
  description: string;
  effectiveness: number;
  popularity: number;
  skillFocus: SkillArea[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeCommitment: number;
}

export interface ConsistencyAnalysis {
  playFrequency: PlayFrequencyAnalysis;
  performanceVariance: PerformanceVariance;
  stabilityScore: number;
  optimalPlayTime: PlayTimeRecommendation[];
}

export interface PlayFrequencyAnalysis {
  dailyAverage: number;
  weeklyAverage: number;
  mostActiveDay: string;
  leastActiveDay: string;
  peakHours: string[];
  consistencyScore: number;
}

export interface PerformanceVariance {
  scoreVariance: number;
  timeVariance: number;
  accuracyVariance: number;
  overallStability: number;
  improvementRate: number;
}

export interface PlayTimeRecommendation {
  timeOfDay: string;
  duration: number;
  expectedPerformance: number;
  reasoning: string;
}

export interface WordAnalysis {
  word: string;
  difficulty: number;
  length: number;
  letterFrequency: number;
  commonLetters: number;
  rareLetters: number;
  patterns: string[];
  category: string;
  successRate: number;
  averageAttempts: number;
  timeToSolve: number;
  commonMistakes: WordMistake[];
  learningValue: number;
}

export interface WordMistake {
  letter: string;
  position: number;
  frequency: number;
  mistakeType: 'spelling' | 'letter_confusion' | 'pattern_error' | 'time_pressure';
  learningCorrection: string;
}

export interface DifficultyProgression {
  currentDifficulty: 'easy' | 'medium' | 'hard' | 'expert';
  progressionHistory: DifficultyHistory[];
  readinessScore: number;
  recommendedNextDifficulty: 'easy' | 'medium' | 'hard' | 'expert';
  adaptiveDifficultyEnabled: boolean;
}

export interface DifficultyHistory {
  date: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  performanceScore: number;
  completionTime: number;
  attempts: number;
  winRate: number;
}

export interface LearningRecommendation {
  id: string;
  type: 'practice' | 'tutorial' | 'challenge' | 'break' | 'adjustment';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  reason: string;
  targetSkills: SkillArea[];
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isCompleted: boolean;
  dismissCount: number;
  createdAt: string;
  expiresAt?: string;
}

export interface StreakAnalysis {
  currentStreak: number;
  longestStreak: number;
  streakHistory: StreakRecord[];
  streakBreakdown: StreakBreakdown;
  patterns: StreakPattern[];
  riskAssessment: StreakRisk;
}

export interface StreakRecord {
  type: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate?: string;
  length: number;
  brokenReason?: string;
}

export interface StreakBreakdown {
  byGameMode: Record<string, number>;
  byDifficulty: Record<string, number>;
  byTimeOfDay: Record<string, number>;
  byDayOfWeek: Record<string, number>;
}

export interface StreakPattern {
  pattern: string;
  frequency: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  recommendation: string;
}

export interface StreakRisk {
  riskLevel: 'low' | 'medium' | 'high';
  factors: RiskFactor[];
  prevention: string[];
  recoveryPlan: string[];
}

export interface RiskFactor {
  factor: string;
  impact: number;
  likelihood: number;
  mitigable: boolean;
}

export interface TimeAnalysis {
  totalTimeSpent: number;
  averageSessionTime: number;
  timeDistribution: TimeDistribution;
  efficiencyMetrics: TimeEfficiencyMetrics;
  peakPerformance: PeakTimeAnalysis;
  learningCurves: LearningCurve[];
}

export interface TimeDistribution {
  bySessionType: Record<string, number>;
  byTimeOfDay: Record<string, number>;
  byDayOfWeek: Record<string, number>;
  improvementOverTime: TimeImprovement[];
}

export interface TimeEfficiencyMetrics {
  pointsPerMinute: number;
  wordsPerMinute: number;
  learningRatePerHour: number;
  efficiencyTrend: 'improving' | 'stable' | 'declining';
}

export interface PeakTimeAnalysis {
  bestPerformanceTimes: string[];
  worstPerformanceTimes: string[];
  optimalPlayDuration: number;
  focusLimit: number;
  breakRecommendations: BreakRecommendation[];
}

export interface BreakRecommendation {
  afterMinutes: number;
  breakDuration: number;
  reason: string;
  expectedBenefit: string;
}

export interface TimeImprovement {
  date: string;
  averageTime: number;
  efficiency: number;
  trend: 'faster' | 'slower' | 'stable';
}

export interface LearningCurve {
  skillArea: SkillArea;
  curve: LearningCurvePoint[];
  prediction: CurvePrediction;
  learningVelocity: number;
  plateauPoints: PlateauPoint[];
}

export interface LearningCurvePoint {
  date: string;
  experience: number;
  performance: number;
  sessionCount: number;
}

export interface CurvePrediction {
  nextLevel: number;
  estimatedDate: string;
  confidence: number;
  requiredExperience: number;
  timeEstimate: number;
}

export interface PlateauPoint {
  date: string;
  skillArea: SkillArea;
  duration: number;
  breakthrough: string;
}

export interface ErrorAnalysis {
  errorPatterns: ErrorPattern[];
  mistakeFrequency: MistakeFrequency;
  learningFromErrors: ErrorLearning;
  commonErrorsByDifficulty: Record<string, CommonError[]>;
  improvementSuggestions: ErrorImprovement[];
}

export interface ErrorPattern {
  pattern: string;
  frequency: number;
  severity: 'minor' | 'moderate' | 'major';
  context: string[];
  resolution: string;
  prevention: string;
}

export interface MistakeFrequency {
  totalMistakes: number;
  mistakesPerGame: number;
  mistakeReductionRate: number;
  mostCommonMistakes: string[];
  improvementOverTime: number;
}

export interface ErrorLearning {
  mistakesLearned: string[];
  mistakesStillMaking: string[];
  learningEfficiency: number;
  retentionRate: number;
  adaptiveLearning: boolean;
}

export interface CommonError {
  error: string;
  frequency: number;
  examples: string[];
  correction: string;
  relatedSkills: SkillArea[];
}

export interface ErrorImprovement {
  targetError: string;
  improvementMethod: string;
  exercises: LearningExercise[];
  estimatedTime: number;
  expectedReduction: number;
}

export interface LearningExercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  targetSkill: SkillArea;
  instructions: string[];
}

export interface AchievementProgress {
  totalAchievements: number;
  unlockedAchievements: string[];
  inProgressAchievements: AchievementProgressItem[];
  achievementStreak: number;
  rarityDistribution: Record<string, number>;
  nextMilestone: string;
  achievementVelocity: number;
}

export interface AchievementProgressItem {
  achievementId: string;
  name: string;
  progress: number;
  total: number;
  estimatedCompletion: string;
  blockers: string[];
}

// Analytics Event Types
export enum AnalyticsEvent {
  GAME_STARTED = 'game_started',
  GAME_COMPLETED = 'game_completed',
  GAME_WON = 'game_won',
  GAME_LOST = 'game_lost',
  PERFECT_GAME = 'perfect_game',
  HINT_USED = 'hint_used',
  WORD_DISCOVERED = 'word_discovered',
  PATTERN_RECOGNIZED = 'pattern_recognized',
  SKILL_IMPROVED = 'skill_improved',
  DIFFICULTY_CHANGED = 'difficulty_changed',
  SESSION_STARTED = 'session_started',
  SESSION_ENDED = 'session_ended',
  MILESTONE_REACHED = 'milestone_reached',
  STREAK_STARTED = 'streak_started',
  STREAK_BROKEN = 'streak_broken'
}

// Analytics Configuration
export interface AnalyticsConfig {
  trackingEnabled: boolean;
  dataRetentionDays: number;
  anonymizeData: boolean;
  shareDataWithResearch: boolean;
  customMetrics: string[];
  eventsToTrack: AnalyticsEvent[];
}

// Learning Insights
export interface LearningInsights {
  keyInsights: string[];
  actionableRecommendations: string[];
  motivationalMessages: string[];
  upcomingChallenges: string[];
  skillGrowthAreas: SkillArea[];
  performanceHighlights: string[];
  learningQuotes: string[];
}

// Learning Goals
export interface LearningGoals {
  shortTerm: LearningGoal[];
  longTerm: LearningGoal[];
  activeGoals: LearningGoal[];
  completedGoals: LearningGoal[];
  goalCategories: GoalCategory[];
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  type: 'skill' | 'performance' | 'streak' | 'time' | 'social';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  isCompleted: boolean;
  progress: number;
  milestones: GoalMilestone[];
  rewards: GoalReward[];
}

export interface GoalCategory {
  id: string;
  name: string;
  description: string;
  goals: LearningGoal[];
  completionRate: number;
  timeSpent: number;
}

export interface GoalMilestone {
  value: number;
  description: string;
  isAchieved: boolean;
  achievedAt?: string;
}

export interface GoalReward {
  type: 'points' | 'badge' | 'theme' | 'powerup';
  value: number;
  description: string;
}