export interface DifficultyConfig {
  id: 'easy' | 'medium' | 'hard' | 'expert';
  name: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  gridConfig: {
    size: number; // 6x6, 7x7, 8x8
    pathLength: number; // 4, 5, 6
    timeLimit?: number; // 秒数，可选
  };
  wordConfig: {
    minLength: number;
    maxLength: number;
    complexity: 'simple' | 'moderate' | 'complex' | 'expert';
    letterFrequency: 'common' | 'mixed' | 'rare';
  };
  feedback: {
    showHints: boolean;
    hintsCount: number;
    showTimer: boolean;
    showScore: boolean;
  };
  scoring: {
    basePoints: number;
    timeBonus: boolean;
    perfectBonus: boolean;
    streakMultiplier: number;
  };
  unlockRequirement?: {
    type: 'games_won' | 'streak' | 'average_time' | 'completion_rate';
    value: number;
  };
}

export const DIFFICULTY_CONFIGS: Record<DifficultyConfig['id'], DifficultyConfig> = {
  easy: {
    id: 'easy',
    name: '简单',
    description: '适合初学者，字母都是常用字母',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    gridConfig: {
      size: 6,
      pathLength: 4
    },
    wordConfig: {
      minLength: 4,
      maxLength: 5,
      complexity: 'simple',
      letterFrequency: 'common'
    },
    feedback: {
      showHints: true,
      hintsCount: 3,
      showTimer: false,
      showScore: false
    },
    scoring: {
      basePoints: 100,
      timeBonus: false,
      perfectBonus: true,
      streakMultiplier: 1
    }
  },

  medium: {
    id: 'medium',
    name: '中等',
    description: '平衡的游戏体验，标准PathWordle规则',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    gridConfig: {
      size: 6,
      pathLength: 5
    },
    wordConfig: {
      minLength: 5,
      maxLength: 6,
      complexity: 'moderate',
      letterFrequency: 'mixed'
    },
    feedback: {
      showHints: true,
      hintsCount: 2,
      showTimer: true,
      showScore: true
    },
    scoring: {
      basePoints: 200,
      timeBonus: true,
      perfectBonus: true,
      streakMultiplier: 1.5
    }
  },

  hard: {
    id: 'hard',
    name: '困难',
    description: '挑战性游戏，包含不常用字母和更长的单词',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    gridConfig: {
      size: 7,
      pathLength: 5
    },
    wordConfig: {
      minLength: 6,
      maxLength: 8,
      complexity: 'complex',
      letterFrequency: 'rare'
    },
    feedback: {
      showHints: false,
      hintsCount: 1,
      showTimer: true,
      showScore: true
    },
    scoring: {
      basePoints: 400,
      timeBonus: true,
      perfectBonus: true,
      streakMultiplier: 2
    },
    unlockRequirement: {
      type: 'games_won',
      value: 10
    }
  },

  expert: {
    id: 'expert',
    name: '专家',
    description: '终极挑战，限时模式，复杂词汇',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    gridConfig: {
      size: 8,
      pathLength: 6,
      timeLimit: 300 // 5分钟
    },
    wordConfig: {
      minLength: 7,
      maxLength: 10,
      complexity: 'expert',
      letterFrequency: 'rare'
    },
    feedback: {
      showHints: false,
      hintsCount: 0,
      showTimer: true,
      showScore: true
    },
    scoring: {
      basePoints: 1000,
      timeBonus: true,
      perfectBonus: true,
      streakMultiplier: 3
    },
    unlockRequirement: {
      type: 'games_won',
      value: 25
    }
  }
};

// 根据难度获取单词列表
export const getWordsByDifficulty = (difficulty: DifficultyConfig['id'], allWords: string[]): string[] => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const { minLength, maxLength, complexity, letterFrequency } = config.wordConfig;

  // 根据复杂度和字母频率过滤单词
  const commonLetters = new Set(['E', 'A', 'R', 'I', 'O', 'T', 'N', 'S', 'L', 'C', 'U', 'D', 'P', 'M', 'H']);
  const rareLetters = new Set(['J', 'Q', 'X', 'Z', 'K', 'V', 'W', 'Y', 'B', 'F', 'G']);

  return allWords.filter(word => {
    const upperWord = word.toUpperCase();

    // 长度检查
    if (upperWord.length < minLength || upperWord.length > maxLength) {
      return false;
    }

    // 字母频率检查
    const wordLetters = new Set(upperWord);
    let commonLetterCount = 0;
    let rareLetterCount = 0;

    wordLetters.forEach(letter => {
      if (commonLetters.has(letter)) commonLetterCount++;
      else if (rareLetters.has(letter)) rareLetterCount++;
    });

    switch (letterFrequency) {
      case 'common':
        return commonLetterCount >= wordLetters.size * 0.8;
      case 'mixed':
        return commonLetterCount >= wordLetters.size * 0.5;
      case 'rare':
        return rareLetterCount >= wordLetters.size * 0.3;
      default:
        return true;
    }
  });
};

// 检查难度是否已解锁
export const isDifficultyUnlocked = (
  difficulty: DifficultyConfig['id'],
  statistics: any
): boolean => {
  const config = DIFFICULTY_CONFIGS[difficulty];

  if (!config.unlockRequirement) {
    return true; // 简单和中等默认解锁
  }

  const { type, value } = config.unlockRequirement;

  switch (type) {
    case 'games_won':
      return statistics.gamesWon >= value;
    case 'streak':
      return statistics.maxStreak >= value;
    case 'average_time':
      return statistics.averageTime > 0 && statistics.averageTime <= value;
    case 'completion_rate':
      return statistics.winRate >= value;
    default:
      return false;
  }
};

// 计算游戏得分
export const calculateScore = (
  difficulty: DifficultyConfig['id'],
  attemptsUsed: number,
  timeTaken: number,
  hintsUsed: number,
  won: boolean,
  isPerfect: boolean
): number => {
  if (!won) return 0;

  const config = DIFFICULTY_CONFIGS[difficulty];
  let score = config.scoring.basePoints;

  // 完美游戏奖励
  if (isPerfect && config.scoring.perfectBonus) {
    score *= 2;
  }

  // 时间奖励
  if (config.scoring.timeBonus && timeTaken > 0) {
    const timeBonus = Math.max(0, 300 - timeTaken) * 2; // 每秒2分，最多300分
    score += timeBonus;
  }

  // 提示惩罚
  if (hintsUsed > 0) {
    score = Math.max(score / (1 + hintsUsed * 0.2), config.scoring.basePoints * 0.5);
  }

  // 尝试次数惩罚
  const attemptPenalty = Math.pow(0.8, attemptsUsed - 1);
  score *= attemptPenalty;

  return Math.round(Math.max(score, 10)); // 最低10分
};

// 获取难度解锁进度
export const getDifficultyProgress = (
  difficulty: DifficultyConfig['id'],
  statistics: any
): number => {
  const config = DIFFICULTY_CONFIGS[difficulty];

  if (!config.unlockRequirement || isDifficultyUnlocked(difficulty, statistics)) {
    return 100;
  }

  const { type, value } = config.unlockRequirement;

  let current = 0;
  switch (type) {
    case 'games_won':
      current = statistics.gamesWon;
      break;
    case 'streak':
      current = statistics.maxStreak;
      break;
    case 'average_time':
      current = statistics.averageTime > 0 ? statistics.averageTime : 0;
      break;
    case 'completion_rate':
      current = statistics.winRate;
      break;
  }

  return Math.min((current / value) * 100, 100);
};