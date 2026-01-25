/**
 * Game Type Definitions
 *
 * Core type definitions for the PathWordle game logic and state management.
 */

// ============================================================================
// GRID AND CELL TYPES
// ============================================================================

/**
 * Individual grid cell state
 */
export interface GridCell {
  /**
   * Letter displayed in the cell
   */
  letter: string;

  /**
   * Row index (0-based)
   */
  row: number;

  /**
   * Column index (0-based)
   */
  col: number;

  /**
   * Whether the cell is currently selected
   */
  isSelected: boolean;

  /**
   * Whether the cell is part of the current path
   */
  isInPath: boolean;

  /**
   * Whether the cell can be selected next
   */
  canSelect: boolean;

  /**
   * Cell background color (computed from feedback)
   */
  backgroundColor?: 'green' | 'yellow' | 'gray' | 'blue' | 'lightblue' | 'lightgreen' | 'default';

  /**
   * Cell border color
   */
  borderColor?: string;

  /**
   * Unique cell identifier
   */
  id?: string;
}

/**
 * 2D grid of cells
 */
export type GameGrid = GridCell[][];

// ============================================================================
// GAME STATE TYPES
// ============================================================================

/**
 * Game status
 */
export type GameStatus = 'playing' | 'won' | 'lost' | 'abandoned';

/**
 * Game mode
 */
export type GameMode = 'daily' | 'practice';

/**
 * Difficulty level
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

/**
 * Letter feedback for Wordle-style guessing
 */
export type LetterFeedback = 'correct' | 'present' | 'absent';

/**
 * Current game state
 */
export interface GameState {
  /**
   * Game grid
   */
  grid: GameGrid;

  /**
   * Target word to guess
   */
  targetWord: string;

  /**
   * Current selected path of cells
   */
  currentPath: GridCell[];

  /**
   * Previous guesses and their results
   */
  guesses: GuessResult[];

  /**
   * Number of attempts remaining
   */
  attemptsLeft: number;

  /**
   * Current game status
   */
  gameStatus: GameStatus;

  /**
   * Current date (YYYY-MM-DD format)
   */
  currentDate: string;

  /**
   * Game mode
   */
  gameMode: GameMode;

  /**
   * Game difficulty
   */
  difficulty?: DifficultyLevel;

  /**
   * Game start timestamp
   */
  startTime?: number;

  /**
   * Game end timestamp
   */
  endTime?: number;

  /**
   * Unique game ID
   */
  gameId?: string;
}

// ============================================================================
// GUESS AND FEEDBACK TYPES
// ============================================================================

/**
 * Individual letter feedback with position
 */
export interface LetterFeedbackWithPosition {
  /**
   * Letter
   */
  letter: string;

  /**
   * Position in word (0-based)
   */
  position: number;

  /**
   * Feedback status
   */
  status: LetterFeedback;
}

/**
 * Guess result with complete information
 */
export interface GuessResult {
  /**
   * Guessed word
   */
  word: string;

  /**
   * Path of cells used to form the word
   */
  path: GridCell[];

  /**
   * Feedback for each letter position
   */
  feedback: LetterFeedback[];

  /**
   * Detailed feedback with positions
   */
  detailedFeedback?: LetterFeedbackWithPosition[];

  /**
   * Timestamp of guess
   */
  timestamp?: number;

  /**
   * Time taken to make this guess (seconds)
   */
  timeTaken?: number;

  /**
   * Whether this was a winning guess
   */
  isWin?: boolean;

  /**
   * Guess score
   */
  score?: number;
}

/**
 * Guess validation result
 */
export interface GuessValidationResult {
  /**
   * Whether the guess is valid
   */
  isValid: boolean;

  /**
   * Validation error message (if invalid)
   */
  error?: string;

  /**
   * Validation error code
   */
  errorCode?:
    | 'INVALID_LENGTH'
    | 'NOT_A_WORD'
    | 'ALREADY_GUESSED'
    | 'INVALID_PATH'
    | 'PATH_TOO_SHORT'
    | 'PATH_TOO_LONG'
    | 'DUPLICATE_LETTERS'
    | 'DISCONNECTED_PATH';
}

// ============================================================================
// PATH VALIDATION TYPES
// ============================================================================

/**
 * Path validation result
 */
export interface PathValidationResult {
  /**
   * Whether the path is valid
   */
  isValid: boolean;

  /**
   * Validation errors
   */
  errors: PathValidationError[];

  /**
   * Path length
   */
  length: number;

  /**
   * Whether path forms a valid word
   */
  formsValidWord: boolean;

  /**
   * Word formed by path
   */
  word: string;

  /**
   * Whether path has duplicate letters
   */
  hasDuplicates: boolean;

  /**
   * Whether all cells are connected
   */
  isConnected: boolean;
}

/**
 * Path validation error
 */
export interface PathValidationError {
  /**
   * Error code
   */
  code:
    | 'PATH_TOO_SHORT'
    | 'PATH_TOO_LONG'
    | 'DISCONNECTED_PATH'
    | 'DUPLICATE_LETTERS'
    | 'INVALID_CELL'
    | 'OUT_OF_BOUNDS';

  /**
   * Error message
   */
  message: string;

  /**
   * Cell position that caused the error
   */
  position?: {
    row: number;
    col: number;
  };
}

/**
 * Path connection between two cells
 */
export interface PathConnection {
  /**
   * Starting cell
   */
  from: GridCell;

  /**
   * Ending cell
   */
  to: GridCell;

  /**
   * Direction of connection
   */
  direction:
    | 'horizontal'
    | 'vertical'
    | 'diagonal-down'
    | 'diagonal-up';

  /**
   * Distance between cells (should be 1 for valid paths)
   */
  distance: number;
}

// ============================================================================
// GAME SESSION TYPES
// ============================================================================

/**
 * Game session information
 */
export interface GameSession {
  /**
   * Unique session ID
   */
  sessionId: string;

  /**
   * User ID (if authenticated)
   */
  userId?: string;

  /**
   * Game state
   */
  gameState: GameState;

  /**
   * Session start timestamp
   */
  startTime: number;

  /**
   * Session end timestamp (if ended)
   */
  endTime?: number;

  /**
   * Session duration in seconds
   */
  duration?: number;

  /**
   * Number of hints used
   */
  hintsUsed: number;

  /**
   * Session score
   */
  score?: number;

  /**
   * Whether session was completed
   */
  completed: boolean;
}

// ============================================================================
// GAME EVENT TYPES
// ============================================================================

/**
 * Game event types
 */
export type GameEventType =
  | 'GAME_STARTED'
  | 'GAME_ENDED'
  | 'CELL_SELECTED'
  | 'CELL_DESELECTED'
  | 'PATH_CLEARED'
  | 'GUESS_SUBMITTED'
  | 'GUESS_VALIDATED'
  | 'HINT_USED'
  | 'UNDO_ACTION'
  | 'RESTART_GAME';

/**
 * Game event
 */
export interface GameEvent {
  /**
   * Event type
   */
  type: GameEventType;

  /**
   * Event timestamp
   */
  timestamp: number;

  /**
   * Game state at time of event
   */
  gameState: GameState;

  /**
   * Event data
   */
  data?: GameEventData;

  /**
   * User ID (if available)
   */
  userId?: string;

  /**
   * Session ID
   */
  sessionId: string;
}

/**
 * Event data based on event type
 */
export type GameEventData =
  | CellSelectedData
  | GuessSubmittedData
  | HintUsedData
  | GameEndedData
  | Record<string, unknown>;

/**
 * Data for cell selection event
 */
export interface CellSelectedData {
  /**
   * Selected cell
   */
  cell: GridCell;

  /**
   * Current path after selection
   */
  currentPath: GridCell[];
}

/**
 * Data for guess submission event
 */
export interface GuessSubmittedData {
  /**
   * Guess result
   */
  guessResult: GuessResult;

  /**
   * Time taken to make guess
   */
  timeTaken: number;
}

/**
 * Data for hint usage event
 */
export interface HintUsedData {
  /**
   * Hint type
   */
  hintType: 'definition' | 'synonym' | 'letter' | 'pattern';

  /**
   * Hint content
   */
  content: string;

  /**
   * Cost (if any)
   */
  cost?: number;
}

/**
 * Data for game end event
 */
export interface GameEndedData {
  /**
   * Final game status
   */
  status: GameStatus;

  /**
   * Final score
   */
  score: number;

  /**
   * Total time played
   */
  totalTime: number;

  /**
   * Number of hints used
   */
  hintsUsed: number;
}

// ============================================================================
// GAME METRICS TYPES
// ============================================================================

/**
 * Game performance metrics
 */
export interface GameMetrics {
  /**
   * Total games played
   */
  gamesPlayed: number;

  /**
   * Games won
   */
  gamesWon: number;

  /**
   * Games lost
   */
  gamesLost: number;

  /**
   * Win rate (0-1)
   */
  winRate: number;

  /**
   * Current streak
   */
  currentStreak: number;

  /**
   * Maximum streak
   */
  maxStreak: number;

  /**
   * Average guesses per game
   */
  averageGuesses: number;

  /**
   * Average time per game (seconds)
   */
  averageTime: number;

  /**
   * Fastest win (seconds)
   */
  fastestWin?: number;

  /**
   * Total play time (seconds)
   */
  totalPlayTime: number;

  /**
   * Guess distribution (1-6 attempts)
   */
  guessDistribution: Record<number, number>;
}

// ============================================================================
// DIFFICULTY TYPES
// ============================================================================

/**
 * Difficulty configuration
 */
export interface DifficultyConfig {
  /**
   * Difficulty ID
   */
  id: DifficultyLevel;

  /**
   * Display name
   */
  name: string;

  /**
   * Description
   */
  description: string;

  /**
   * Maximum attempts
   */
  maxAttempts: number;

  /**
   * Time limit (0 = unlimited)
   */
  timeLimit?: number;

  /**
   * Hints available
   */
  hintsAvailable: boolean;

  /**
   * Number of free hints
   */
  freeHints: number;

  /**
   * Word difficulty (1-5)
   */
  wordDifficulty: number;

  /**
   * Score multiplier
   */
  scoreMultiplier: number;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check if value is a valid game status
 */
export function isGameStatus(value: unknown): value is GameStatus {
  return (
    typeof value === 'string' &&
    (value === 'playing' || value === 'won' || value === 'lost' || value === 'abandoned')
  );
}

/**
 * Check if value is a valid game mode
 */
export function isGameMode(value: unknown): value is GameMode {
  return (
    typeof value === 'string' &&
    (value === 'daily' || value === 'practice')
  );
}

/**
 * Check if value is a valid difficulty level
 */
export function isDifficultyLevel(value: unknown): value is DifficultyLevel {
  return (
    typeof value === 'string' &&
    (value === 'easy' || value === 'medium' || value === 'hard' || value === 'expert')
  );
}

/**
 * Check if value is a grid cell
 */
export function isGridCell(value: unknown): value is GridCell {
  if (typeof value !== 'object' || value === null) return false;

  const cell = value as Record<string, unknown>;
  return (
    typeof cell.letter === 'string' &&
    typeof cell.row === 'number' &&
    typeof cell.col === 'number' &&
    typeof cell.isSelected === 'boolean' &&
    typeof cell.isInPath === 'boolean' &&
    typeof cell.canSelect === 'boolean'
  );
}

/**
 * Check if value is a game grid
 */
export function isGameGrid(value: unknown): value is GameGrid {
  if (!Array.isArray(value)) return false;

  return value.every(row => Array.isArray(row) && row.every(isGridCell));
}

/**
 * Check if value is a guess result
 */
export function isGuessResult(value: unknown): value is GuessResult {
  if (typeof value !== 'object' || value === null) return false;

  const guess = value as Record<string, unknown>;
  return (
    typeof guess.word === 'string' &&
    Array.isArray(guess.path) &&
    guess.path.every(isGridCell) &&
    Array.isArray(guess.feedback)
  );
}

/**
 * Check if game is over
 */
export function isGameOver(gameState: GameState): boolean {
  return gameState.gameStatus === 'won' || gameState.gameStatus === 'lost';
}

/**
 * Check if game is won
 */
export function isGameWon(gameState: GameState): boolean {
  return gameState.gameStatus === 'won';
}

/**
 * Check if game is lost
 */
export function isGameLost(gameState: GameState): boolean {
  return gameState.gameStatus === 'lost';
}

/**
 * Check if game is playing
 */
export function isGamePlaying(gameState: GameState): boolean {
  return gameState.gameStatus === 'playing';
}
