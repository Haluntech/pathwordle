import { getDailyWord } from './src/utils/wordList.ts';
import { getTodaysDate } from './src/utils/gameLogic.ts';
console.log(getDailyWord(getTodaysDate()));