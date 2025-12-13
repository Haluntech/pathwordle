export interface GridCell {
  letter: string;
  row: number;
  col: number;
  isSelected: boolean;
  isInPath: boolean;
  canSelect: boolean;
}

export interface GameState {
  grid: GridCell[][];
  targetWord: string;
  currentPath: GridCell[];
  guesses: GuessResult[];
  attemptsLeft: number;
  gameStatus: 'playing' | 'won' | 'lost';
  currentDate: string;
  gameMode: 'daily' | 'practice';
  hintUsed: boolean;
  revealedHintLetter: string | null;
}

export interface GuessResult {
  word: string;
  path: GridCell[];
  feedback: ('correct' | 'present' | 'absent')[];
}

export interface PathConnection {
  from: GridCell;
  to: GridCell;
}