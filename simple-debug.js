import fs from 'fs';

// Simple test to check if GRAPE exists as today's word
const today = new Date().toISOString().split('T')[0];
console.log('=== PathWordle Simple Debug ===');
console.log('Today\'s date:', today);

// Simple hash function
function getDailyWord(date) {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    const char = date.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  // Just check if this would give us a word index that could be GRAPE
  console.log('Hash for date:', date, 'is', hash);
  console.log('Absolute hash:', Math.abs(hash));

  // Get some known words to check
  const knownWords = ['GRAPE', 'APPLE', 'BEACH', 'CHAIR', 'DANCE'];

  // Simple check - let's see if hash modulo various numbers gives us GRAPE
  console.log('\nChecking various mod values:');
  for (let mod = 100; mod <= 10000; mod += 100) {
    const index = Math.abs(hash) % mod;
    if (index < 10) {
      console.log(`Mod ${mod}: index ${index}`);
    }
  }
}

getDailyWord(today);

// Also let's check the wordList file structure
console.log('\nChecking wordList.ts structure...');
try {
  const content = fs.readFileSync('src/utils/wordList.ts', 'utf8');

  // Look for GRAPE specifically
  const grapeIndex = content.indexOf('GRAPE');
  console.log('GRAPE found in wordList.ts at position:', grapeIndex);

  // Look for VALID_WORDS array
  const validWordsStart = content.indexOf('const VALID_WORDS');
  console.log('VALID_WORDS array starts at position:', validWordsStart);

  // Extract just a small section around GRAPE
  if (grapeIndex > 0) {
    const context = content.substring(Math.max(0, grapeIndex - 50), grapeIndex + 50);
    console.log('Context around GRAPE:', context);
  }

} catch (error) {
  console.log('Error reading wordList.ts:', error.message);
}