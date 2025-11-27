import fs from 'fs';

// Extract words from wordList.ts
function getWordsFromWordList() {
  const content = fs.readFileSync('src/utils/wordList.ts', 'utf8');
  const match = content.match(/const VALID_WORDS: string\[\] = \[([\s\S]*?)\];/);
  if (!match) return [];

  const wordString = match[1];
  const words = [];
  const wordMatches = wordString.match(/'([^']+)'/g);

  if (wordMatches) {
    for (const match of wordMatches) {
      words.push(match.slice(1, -1)); // Remove quotes
    }
  }

  return words;
}

// Copy the hash function from wordList.ts
function getDailyWord(date) {
  const VALID_WORDS = getWordsFromWordList();

  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    const char = date.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  const index = Math.abs(hash) % VALID_WORDS.length;
  return VALID_WORDS[index];
}

// Copy grid generation logic
function createGrid(targetWord, seed) {
  const GRID_SIZE = 6;
  const grid = [];

  // Use seed for more randomization if provided
  let random = Math.random;
  if (seed) {
    let seedValue = 0;
    for (let i = 0; i < seed.length; i++) {
      seedValue += seed.charCodeAt(i);
    }
    seedValue = (seedValue * 9301 + 49297) % 233280;
    random = () => {
      seedValue = (seedValue * 9301 + 49297) % 233280;
      return seedValue / 233280;
    };
  }

  // Initialize empty grid
  for (let row = 0; row < GRID_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[row][col] = {
        letter: '',
        row,
        col,
        isSelected: false,
        isInPath: false,
        canSelect: false
      };
    }
  }

  // Place target word in a valid path
  const path = generateValidPath(random);
  for (let i = 0; i < targetWord.length; i++) {
    const cell = path[i];
    grid[cell.row][cell.col].letter = targetWord[i];
  }

  // Fill remaining cells with random letters
  const vowels = 'AEIOU';
  const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!grid[row][col].letter) {
        const useVowel = random() < 0.4;
        const letters = useVowel ? vowels : consonants;
        const randomIndex = Math.floor(random() * letters.length);
        grid[row][col].letter = letters[randomIndex];
      }
    }
  }

  return { grid, path };
}

function generateValidPath(random = Math.random) {
  const GRID_SIZE = 6;
  const WORD_LENGTH = 5;
  const path = [];
  let row = Math.floor(random() * GRID_SIZE);
  let col = Math.floor(random() * GRID_SIZE);

  path.push({ row, col });

  for (let i = 1; i < WORD_LENGTH; i++) {
    const neighbors = getNeighbors(row, col, path);
    if (neighbors.length === 0) {
      return generateValidPath(random);
    }

    const nextCell = neighbors[Math.floor(random() * neighbors.length)];
    row = nextCell.row;
    col = nextCell.col;
    path.push({ row, col });
  }

  return path;
}

function getNeighbors(row, col, usedCells) {
  const GRID_SIZE = 6;
  const neighbors = [];

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;

      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
        const isUsed = usedCells.some(cell => cell.row === newRow && cell.col === newCol);
        if (!isUsed) {
          neighbors.push({ row: newRow, col: newCol });
        }
      }
    }
  }

  return neighbors;
}

// Main investigation
const today = new Date().toISOString().split('T')[0];
console.log('=== PathWordle Debug Tool ===');
console.log('Today\'s date:', today);

const todayWord = getDailyWord(today);
console.log('Today\'s word:', todayWord);

console.log('\nGenerating grid for word:', todayWord);
const { grid, path } = createGrid(todayWord, today);

console.log('\nTarget word path:');
for (let i = 0; i < path.length; i++) {
  const cell = path[i];
  console.log(`Position ${i}: [${cell.row}, ${cell.col}] = ${todayWord[i]}`);
}

console.log('\nFull grid (showing target word letters in uppercase, others in lowercase):');
for (let row = 0; row < 6; row++) {
  let rowStr = '';
  for (let col = 0; col < 6; col++) {
    const cell = grid[row][col];
    const isInTargetPath = path.some(p => p.row === row && p.col === col);
    if (isInTargetPath) {
      rowStr += cell.letter + ' ';
    } else {
      rowStr += cell.letter.toLowerCase() + ' ';
    }
  }
  console.log(rowStr);
}

console.log('\nLooking for letter G in grid:');
let gFound = false;
for (let row = 0; row < 6; row++) {
  for (let col = 0; col < 6; col++) {
    if (grid[row][col].letter === 'G') {
      console.log(`Found G at [${row}, ${col}]`);
      gFound = true;
    }
  }
}

if (!gFound) {
  console.log('No G found in the grid!');
  console.log('This is the problem - G should exist since it\'s the first letter of GRAPE');
}

// Check if we can form GRAPE from the grid
if (todayWord === 'GRAPE') {
  console.log('\n✅ Today\'s word is indeed GRAPE');
  if (gFound) {
    console.log('✅ G exists in grid - check browser for visibility issue');
  } else {
    console.log('❌ CRITICAL BUG: G does not exist in generated grid for GRAPE');
  }
} else {
  console.log(`\n❌ Today's word is ${todayWord}, not GRAPE`);
  console.log('User may be looking at wrong day or confused about target word');
}