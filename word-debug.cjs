const fs = require('fs');

// Extract words from wordList.ts using a simple approach
function getTodayWord() {
  const content = fs.readFileSync('src/utils/wordList.ts', 'utf8');

  // Find the VALID_WORDS array start and end
  const arrayStart = content.indexOf('const VALID_WORDS: string[] = [');
  const arrayEnd = content.indexOf('];', arrayStart);

  if (arrayStart === -1 || arrayEnd === -1) {
    console.log('Could not find VALID_WORDS array bounds');
    return null;
  }

  // Extract just the array content
  const arrayContent = content.substring(arrayStart, arrayEnd + 2);

  // Count words in the array using a simple regex
  const wordMatches = arrayContent.match(/'([^']+)'/g);
  const totalWords = wordMatches ? wordMatches.length : 0;
  console.log('Total words in VALID_WORDS:', totalWords);

  // Get today's date and hash
  const today = new Date().toISOString().split('T')[0];
  console.log('Today\'s date:', today);

  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    const char = today.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  const index = Math.abs(hash) % totalWords;
  console.log('Hash:', hash);
  console.log('Index in array:', index);

  // Find the word at this index
  if (wordMatches && wordMatches[index]) {
    const todayWord = wordMatches[index].slice(1, -1); // Remove quotes
    console.log('Today\'s word:', todayWord);
    return todayWord;
  }

  return null;
}

function generateGridForWord(targetWord) {
  console.log('\nGenerating grid for:', targetWord);

  const GRID_SIZE = 6;
  const grid = [];

  // Use today's date as seed
  const seed = new Date().toISOString().split('T')[0];

  // Seed random number generator
  let seedValue = 0;
  for (let i = 0; i < seed.length; i++) {
    seedValue += seed.charCodeAt(i);
  }
  seedValue = (seedValue * 9301 + 49297) % 233280;
  let random = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };

  // Generate path for target word
  function generateValidPath() {
    const WORD_LENGTH = 5;
    const path = [];
    let row = Math.floor(random() * GRID_SIZE);
    let col = Math.floor(random() * GRID_SIZE);

    path.push({ row, col });

    for (let i = 1; i < WORD_LENGTH; i++) {
      const neighbors = [];
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;

          const newRow = row + dr;
          const newCol = col + dc;

          if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
            const isUsed = path.some(cell => cell.row === newRow && cell.col === newCol);
            if (!isUsed) {
              neighbors.push({ row: newRow, col: newCol });
            }
          }
        }
      }

      if (neighbors.length === 0) {
        return generateValidPath(); // Restart
      }

      const nextCell = neighbors[Math.floor(random() * neighbors.length)];
      row = nextCell.row;
      col = nextCell.col;
      path.push({ row, col });
    }

    return path;
  }

  const path = generateValidPath();

  console.log('Target word path:');
  for (let i = 0; i < path.length; i++) {
    console.log(`  ${targetWord[i]} at [${path[i].row}, ${path[i].col}]`);
  }

  // Initialize grid
  for (let row = 0; row < GRID_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[row][col] = { letter: '' };
    }
  }

  // Place target word
  for (let i = 0; i < targetWord.length; i++) {
    const cell = path[i];
    grid[cell.row][cell.col].letter = targetWord[i];
  }

  // Fill with random letters
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

  return grid;
}

function checkGridForLetter(grid, letter) {
  console.log(`\nLooking for letter ${letter} in grid:`);
  let found = false;
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      if (grid[row][col].letter === letter) {
        console.log(`  Found ${letter} at [${row}, ${col}]`);
        found = true;
      }
    }
  }
  if (!found) {
    console.log(`  ${letter} NOT FOUND in grid!`);
  }
  return found;
}

// Main execution
console.log('=== PathWordle Investigation ===');
const todayWord = getTodayWord();

if (todayWord) {
  const grid = generateGridForWord(todayWord);

  console.log('\nGenerated grid:');
  for (let row = 0; row < 6; row++) {
    let rowStr = '';
    for (let col = 0; col < 6; col++) {
      rowStr += grid[row][col].letter + ' ';
    }
    console.log(rowStr);
  }

  // Check for each letter in today's word
  for (const letter of todayWord) {
    checkGridForLetter(grid, letter);
  }

  console.log('\n=== SUMMARY ===');
  if (todayWord === 'GRAPE') {
    console.log('✅ Today\'s word IS GRAPE');
    const gFound = checkGridForLetter(grid, 'G');
    if (!gFound) {
      console.log('🚨 CRITICAL BUG: G is missing from the grid for GRAPE!');
      console.log('This explains why the user cannot see letter G');
    }
  } else {
    console.log(`ℹ️  Today's word is ${todayWord}, not GRAPE`);
    console.log('User may be confused about the target word');
  }
} else {
  console.log('Could not determine today\'s word');
}