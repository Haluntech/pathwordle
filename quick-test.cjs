// Quick test to check today's word without external dependencies
const fs = require('fs');

function getDailyWord(date) {
  // Read the wordList file and find words
  try {
    const content = fs.readFileSync('src/utils/wordList.ts', 'utf8');

    // Extract all words using a simple regex
    const wordMatches = content.match(/'([A-Z]{5})'/g);
    if (!wordMatches) {
      console.log('Could not find any 5-letter words');
      return null;
    }

    // Extract just the words (remove quotes)
    const words = wordMatches.map(match => match.slice(1, -1));

    // Simple hash function (same as in the original code)
    let hash = 0;
    for (let i = 0; i < date.length; i++) {
      const char = date.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    const index = Math.abs(hash) % words.length;
    const todayWord = words[index];

    console.log('Today:', date);
    console.log('Total words:', words.length);
    console.log('Hash:', hash);
    console.log('Index:', index);
    console.log('Today\'s word:', todayWord);

    return todayWord;

  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

// Test with today's date
const today = new Date().toISOString().split('T')[0];
const word = getDailyWord(today);

if (word === 'GRAPE') {
  console.log('\n✅ CONFIRMED: Today\'s word is GRAPE');
  console.log('User should be able to find G in the grid');
} else {
  console.log(`\n❌ Today's word is ${word}, not GRAPE`);
  console.log('This explains why there is no G in the grid');
}