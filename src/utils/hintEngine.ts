import {
  Hint,
  StrategicHint,
  LetterFrequency,
  WordPattern,
  ENGLISH_LETTER_FREQUENCY,
  COMMON_BEGINNINGS,
  COMMON_ENDINGS,
  WORD_LENGTH_FREQUENCY
} from '../types/hints';
import { GridCell } from '../types/game';

export class HintEngine {
  private wordList: string[];
  private usedWords: Set<string>;

  constructor(wordList: string[]) {
    this.wordList = wordList.map(word => word.toUpperCase());
    this.usedWords = new Set();
  }

  // 分析当前游戏状态
  analyzeGameState(grid: GridCell[][], currentPath: { row: number; col: number }[]): {
    availableLetters: { letter: string; positions: { row: number; col: number }[] }[];
    pathComplexity: number;
    potentialPaths: number;
    wordLikelihoods: Map<string, number>;
  } {
    const letterMap = new Map<string, { row: number; col: number }[]>();
    let pathComplexity = 0;
    let potentialPaths = 0;

    // 统计可用字母
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const cell = grid[row][col];
        if (cell.canSelect || cell.isInPath) {
          const letter = cell.letter.toUpperCase();
          if (!letterMap.has(letter)) {
            letterMap.set(letter, []);
          }
          letterMap.get(letter)!.push({ row, col });
          pathComplexity += cell.canSelect ? 1 : 2;
        }
      }
    }

    // 计算潜在路径数量
    const availableLetters = Array.from(letterMap.entries());
    for (const startLetter of availableLetters) {
      for (const startPos of startLetter[1]) {
        potentialPaths += this.countPathsFromPosition(
          grid,
          startPos,
          new Set([`${startPos.row}-${startPos.col}`]),
          []
        );
      }
    }

    // 计算单词可能性
    const currentWord = currentPath.map(pos =>
      grid[pos.row][pos.col].letter.toUpperCase()
    ).join('');

    const wordLikelihoods = new Map<string, number>();
    const matchingWords = this.wordList.filter(word =>
      word.startsWith(currentWord) && !this.usedWords.has(word)
    );

    matchingWords.forEach(word => {
      const score = this.calculateWordLikelihood(word, grid);
      wordLikelihoods.set(word, score);
    });

    return {
      availableLetters: Array.from(letterMap.entries()).map(([letter, positions]) => ({
        letter,
        positions
      })),
      pathComplexity,
      potentialPaths,
      wordLikelihoods
    };
  }

  // 计算从特定位置的路径数量
  private countPathsFromPosition(
    grid: GridCell[][],
    current: { row: number; col: number },
    visited: Set<string>,
    path: { row: number; col: number }[]
  ): number {
    if (path.length >= 5) return 1; // 找到一个有效路径

    let totalPaths = 0;
    const neighbors = this.getAdjacentCells(grid, current);

    for (const neighbor of neighbors) {
      const key = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(key) && grid[neighbor.row][neighbor.col].canSelect) {
        visited.add(key);
        totalPaths += this.countPathsFromPosition(
          grid,
          neighbor,
          visited,
          [...path, neighbor]
        );
        visited.delete(key);
      }
    }

    return totalPaths;
  }

  // 获取相邻单元格
  private getAdjacentCells(grid: GridCell[][], pos: { row: number; col: number }): { row: number; col: number }[] {
    const adjacent = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dr, dc] of directions) {
      const newRow = pos.row + dr;
      const newCol = pos.col + dc;

      if (
        newRow >= 0 && newRow < grid.length &&
        newCol >= 0 && newCol < grid[newRow].length
      ) {
        adjacent.push({ row: newRow, col: newCol });
      }
    }

    return adjacent;
  }

  // 计算单词可能性
  private calculateWordLikelihood(word: string, grid: GridCell[][]): number {
    let score = 100;
    const letterCount = new Map<string, number>();

    // 统计单词中字母频率
    for (const letter of word) {
      letterCount.set(letter, (letterCount.get(letter) || 0) + 1);
    }

    // 检查字母在网格中的可用性
    for (const [letter, count] of letterCount) {
      const availableInGrid = grid.flat().filter(cell =>
        cell.letter.toUpperCase() === letter && cell.canSelect
      ).length;

      if (availableInGrid < count) {
        score = 0; // 无法形成此单词
        break;
      } else if (availableInGrid === count) {
        score -= 10; // 所有字母都必须使用
      }
    }

    // 考虑字母频率
    const avgLetterFreq = Array.from(letterCount.keys()).reduce((sum, letter) => {
      return sum + (ENGLISH_LETTER_FREQUENCY[letter as keyof typeof ENGLISH_LETTER_FREQUENCY] || 0);
    }, 0) / letterCount.size;

    score += avgLetterFreq; // 常用字母加分

    // 考虑单词长度
    const lengthBonus = WORD_LENGTH_FREQUENCY[word.length as keyof typeof WORD_LENGTH_FREQUENCY] || 0;
    score *= (1 + lengthBonus);

    return Math.max(0, Math.min(100, score));
  }

  // 生成字母位置提示
  generateLetterPositionHint(grid: GridCell[][], currentPath: { row: number; col: number }[]): {
    letter: string;
    position: { row: number; col: number };
    reason: string;
    confidence: number;
  } | null {
    const analysis = this.analyzeGameState(grid, currentPath);
    const currentWord = currentPath.map(pos =>
      grid[pos.row][pos.col].letter.toUpperCase()
    ).join('');

    // 找到可能的最优下一个字母
    const optimalNext = this.findOptimalNextLetter(grid, currentPath);
    if (!optimalNext) return null;

    return {
      letter: optimalNext.letter,
      position: optimalNext.position,
      reason: `根据当前路径 "${currentWord}"，"${optimalNext.letter}" 是最可能的后续字母，在 ${optimalNext.score.toFixed(1)}% 的英语单词中使用。`,
      confidence: optimalNext.score
    };
  }

  // 寻找最优的下一个字母
  private findOptimalNextLetter(
    grid: GridCell[][],
    currentPath: { row: number; col: number }[]
  ): { letter: string; position: { row: number; col: number }; score: number } | null {
    if (currentPath.length === 0) return null;

    const currentWord = currentPath.map(pos =>
      grid[pos.row][pos.col].letter.toUpperCase()
    ).join('');

    const lastPos = currentPath[currentPath.length - 1];
    const adjacent = this.getAdjacentCells(grid, lastPos);

    let bestOption: { letter: string; position: { row: number; col: number }; score: number } | null = null;

    for (const adj of adjacent) {
      const cell = grid[adj.row][adj.col];
      if (!cell.canSelect || currentPath.some(p => p.row === adj.row && p.col === adj.col)) {
        continue;
      }

      const newWord = currentWord + cell.letter.toUpperCase();
      const matchingWords = this.wordList.filter(word =>
        word.startsWith(newWord) && !this.usedWords.has(word)
      );

      if (matchingWords.length > 0) {
        const frequency = ENGLISH_LETTER_FREQUENCY[
          cell.letter.toUpperCase() as keyof typeof ENGLISH_LETTER_FREQUENCY
        ] || 0;

        const score = (matchingWords.length / this.wordList.length) * 100 + frequency;

        if (!bestOption || score > bestOption.score) {
          bestOption = {
            letter: cell.letter.toUpperCase(),
            position: adj,
            score
          };
        }
      }
    }

    return bestOption;
  }

  // 生成路径提示
  generatePathHint(grid: GridCell[][], currentPath: { row: number; col: number }[]): StrategicHint | null {
    const analysis = this.analyzeGameState(grid, currentPath);

    if (currentPath.length === 0) {
      // 从头开始，找最佳起始字母
      const bestStart = this.findBestStartingLetter(grid);
      if (!bestStart) return null;

      return {
        position: bestStart.position,
        reason: `从 "${bestStart.letter}" 开始，这是字母频率表中最常见的字母之一 (${bestStart.score.toFixed(1)}%)。`,
        confidence: bestStart.score,
        alternativeOptions: bestStart.alternatives
      };
    }

    // 提供路径优化建议
    const optimalNext = this.findOptimalNextLetter(grid, currentPath);
    if (!optimalNext) return null;

    return {
      position: optimalNext.position,
      reason: `继续路径到 "${optimalNext.letter}" 可以最大化形成有效单词的概率。`,
      confidence: optimalNext.score,
      alternativeOptions: []
    };
  }

  // 寻找最佳起始字母
  private findBestStartingLetter(
    grid: GridCell[][]
  ): { position: { row: number; col: number }; letter: string; score: number; alternatives?: { row: number; col: number }[] } | null {
    const available = grid.flat()
      .filter(cell => cell.canSelect)
      .map(cell => ({
        position: { row: cell.row, col: cell.col },
        letter: cell.letter.toUpperCase(),
        score: ENGLISH_LETTER_FREQUENCY[cell.letter.toUpperCase() as keyof typeof ENGLISH_LETTER_FREQUENCY] || 0
      }))
      .filter(item => item.score > 5) // 只考虑频率较高的字母
      .sort((a, b) => b.score - a.score);

    if (available.length === 0) return null;

    const best = available[0];
    const alternatives = available.slice(1, 4).map(item => ({
      row: item.position.row,
      col: item.position.col
    }));

    return {
      position: best.position,
      letter: best.letter,
      score: best.score,
      alternatives: alternatives.length > 0 ? alternatives : undefined
    };
  }

  // 生成单词模式分析
  generatePatternHint(grid: GridCell[][], currentPath: { row: number; col: number }[]): WordPattern | null {
    const currentWord = currentPath.map(pos =>
      grid[pos.row][pos.col].letter.toUpperCase()
    ).join('');

    if (currentWord.length === 0) return null;

    const matchingWords = this.wordList.filter(word =>
      word.startsWith(currentWord) && !this.usedWords.has(word)
    );

    if (matchingWords.length === 0) return null;

    // 分析下一个最可能的字母
    const nextLetterStats = new Map<string, number>();
    const wordLengths = new Map<number, number>();

    for (const word of matchingWords) {
      if (word.length > currentWord.length) {
        const nextLetter = word[currentWord.length];
        nextLetterStats.set(nextLetter, (nextLetterStats.get(nextLetter) || 0) + 1);
      }

      wordLengths.set(word.length, (wordLengths.get(word.length) || 0) + 1);
    }

    // 排序并计算概率
    const nextBestLetters = Array.from(nextLetterStats.entries())
      .map(([letter, count]) => ({
        letter,
        score: (count / matchingWords.length) * 100
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // 找出常见的字母组合
    const commonLetters: string[] = [];
    for (const [letter, freq] of Object.entries(ENGLISH_LETTER_FREQUENCY)) {
      if (freq > 5 && !currentWord.includes(letter)) {
        commonLetters.push(letter);
      }
    }

    return {
      pattern: currentWord + '___'.slice(0, 5 - currentWord.length),
      matches: matchingWords.slice(0, 10), // 返回前10个匹配
      commonLetters,
      nextBestLetters
    };
  }

  // 生成词汇提示
  generateVocabularyHint(grid: GridCell[][], currentPath: { row: number; col: number }[]): {
    tip: string;
    examples: string[];
    explanation: string;
  } | null {
    const analysis = this.analyzeGameState(grid, currentPath);
    const currentWord = currentPath.map(pos =>
      grid[pos.row][pos.col].letter.toUpperCase()
    ).join('');

    if (currentWord.length === 0) {
      return {
        tip: "从最常见的字母开始",
        examples: ["E", "T", "A", "O", "I"],
        explanation: "英语中最常用的前5个字母是E、T、A、O、I，约占所有字母使用的一半。从这些字母开始可以最大化形成单词的可能性。"
      };
    }

    // 检查常见的字母组合
    const lastTwoLetters = currentWord.slice(-2).toUpperCase();
    const commonCombinations = COMMON_BEGINNINGS.filter(combo =>
      combo.endsWith(lastTwoLetters) && currentWord.length > 2
    );

    if (commonCombinations.length > 0) {
      return {
        tip: "寻找常见字母组合",
        examples: commonCombinations.slice(0, 3),
        explanation: `"${lastTwoLetters}" 是英语中常见的字母组合的一部分。看看周围是否有可以形成完整组合的字母。`
      };
    }

    // 检查可能的单词长度
    const matchingLengths = this.wordList
      .filter(word => word.startsWith(currentWord) && !this.usedWords.has(word))
      .reduce((lengths, word) => {
        lengths.add(word.length);
        return lengths;
      }, new Set<number>());

    if (matchingLengths.size > 0) {
      return {
        tip: `考虑 ${Math.max(...matchingLengths)} 个字母的单词`,
        examples: this.wordList
          .filter(word => word.startsWith(currentWord) && !this.usedWords.has(word))
          .slice(0, 3),
        explanation: `根据当前路径，可能的单词长度为 ${Array.from(matchingLengths).sort((a, b) => a - b).join(', ')} 个字母。`
      };
    }

    return {
      tip: "寻找不常用的字母",
      examples: ["J", "Q", "X", "Z", "K", "V", "W", "Y", "B", "F", "G"],
      explanation: "当前路径比较特殊，可能需要一些不常用的字母来完成单词。这些字母虽然不常用，但在特定单词中是必需的。"
    };
  }

  // 生成策略建议
  generateStrategyHint(grid: GridCell[][], currentPath: { row: number; col: number }[], difficulty: string): {
    strategy: string;
    priority: 'high' | 'medium' | 'low';
    actions: string[];
    reasoning: string;
  } | null {
    const analysis = this.analyzeGameState(grid, currentPath);
    const currentWord = currentPath.map(pos =>
      grid[pos.row][pos.col].letter.toUpperCase()
    ).join('');

    const strategies = [];

    // 基于当前长度的策略
    if (currentWord.length === 0) {
      strategies.push({
        strategy: "从高频字母开始",
        priority: "high" as const,
        actions: ["寻找E、T、A、O、I等常用字母", "考虑网格边缘或中心的字母", "选择有多个相邻可用字母的位置"],
        reasoning: "开始阶段最重要的是最大化后续选择的可能性，高频字母和位置优势很关键。"
      });
    } else if (currentWord.length === 1) {
      strategies.push({
        strategy: "寻找常见字母组合",
        priority: "high" as const,
        actions: ["寻找可以形成TH、HE、IN、ER等组合的字母", "考虑单词的常见开头模式", "避免死路（没有相邻可用字母）"],
        reasoning: "第二字母很大程度上决定了可能的单词范围，选择正确的组合至关重要。"
      });
    } else if (currentWord.length >= 3) {
      // 检查路径是否还有发展空间
      const lastPos = currentPath[currentPath.length - 1];
      const adjacent = this.getAdjacentCells(grid, lastPos).filter(adj =>
        grid[adj.row][adj.col].canSelect && !currentPath.some(p => p.row === adj.row && p.col === adj.col)
      );

      if (adjacent.length <= 2) {
        strategies.push({
          strategy: "避免死路",
          priority: "high" as const,
          actions: ["考虑回退几个字母寻找更好的路径", "寻找有更多相邻可用字母的位置", "重新评估当前路径的可行性"],
          reasoning: `当前位置只有 ${adjacent.length} 个相邻选项，这可能导致无法完成5字母单词。`
        });
      } else {
        strategies.push({
          strategy: "优化路径选择",
          priority: "medium" as const,
          actions: ["优先选择能形成常见单词中间字母的位置", "考虑字母的频率和组合", "避免选择限制性太强的字母"],
          reasoning: "在中后期，需要平衡字母选择和路径扩展性。"
        });
      }
    }

    // 基于难度的策略调整
    if (difficulty === 'expert') {
      strategies.unshift({
        strategy: "专家模式策略",
        priority: "high" as const,
        actions: ["考虑稀有字母的价值", "注意时间限制", "优先选择高分路径", "避免使用过多提示"],
        reasoning: "专家模式下需要最大化分数同时保持效率。"
      });
    }

    return strategies.length > 0 ? strategies[0] : null;
  }

  // 设置已使用的单词（防止重复）
  setUsedWord(word: string) {
    this.usedWords.add(word.toUpperCase());
  }

  // 重置已使用单词
  resetUsedWords() {
    this.usedWords.clear();
  }
}