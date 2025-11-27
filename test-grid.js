// Test script to manually verify grid generation for GRAPE
console.log('=== Testing Grid Generation for GRAPE ===');

// Copy the exact logic from gameLogic.ts
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

// Test with today's date as seed
const today = '2025-11-18';
const targetWord = 'GRAPE';

console.log('Testing with:');
console.log('Target word:', targetWord);
console.log('Seed:', today);

const { grid, path } = createGrid(targetWord, today);

console.log('\nGRAPE path positions:');
for (let i = 0; i < path.length; i++) {
  console.log(`${targetWord[i]} at [${path[i].row}, ${path[i].col}]`);
}

console.log('\nFull grid (target letters in uppercase, others in lowercase):');
// Fill with random letters for display
const vowels = 'AEIOU';
const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';

// Use same seeded random to fill the grid
let seedValue = 0;
for (let i = 0; i < today.length; i++) {
  seedValue += today.charCodeAt(i);
}
seedValue = (seedValue * 9301 + 49297) % 233280;
let random = () => {
  seedValue = (seedValue * 9301 + 49297) % 233280;
  return seedValue / 233280;
};

for (let row = 0; row < 6; row++) {
  for (let col = 0; col < 6; col++) {
    if (!grid[row][col].letter) {
      const useVowel = random() < 0.4;
      const letters = useVowel ? vowels : consonants;
      const randomIndex = Math.floor(random() * letters.length);
      grid[row][col].letter = letters[randomIndex];
    }
  }
}

// Display grid
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

console.log('\nChecking for G in grid:');
let gFound = false;
for (let row = 0; row < 6; row++) {
  for (let col = 0; col < 6; col++) {
    if (grid[row][col].letter === 'G') {
      console.log(`✅ Found G at [${row}, ${col}]`);
      gFound = true;
    }
  }
}

if (!gFound) {
  console.log('❌ NO G FOUND IN GRID!');
  console.log('This is a serious bug - the target word letters are missing from the grid');
}

console.log('\nAll GRAPE letters:');
for (const letter of 'GRAPE') {
  let found = false;
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      if (grid[row][col].letter === letter) {
        console.log(`${letter}: [${row}, ${col}]`);
        found = true;
        break;
      }
    }
  }
  if (!found) {
    console.log(`❌ ${letter}: NOT FOUND`);
  }
}