import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePathWordle } from '../hooks/usePathWordle';
import { useStatistics } from '../hooks/useStatistics';
import { useThemeContext } from '../contexts/ThemeContext';
import Grid from './Grid';
import GameResult from './GameResult';
import Statistics from './Statistics';
import AchievementNotification from './AchievementNotification';
import ShareSystem from './ShareSystem';
import UserEngagementHooks from './UserEngagementHooks';
import OptimizedHintPanel from './OptimizedHintPanel';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import About from './About';
import Contact from './Contact';
import Footer from './Footer';
import { pathToWord } from '../utils/gameLogic';
import { HowToPlayModal } from './HowToPlayModal';
import { Modal } from './base/Modal/Modal';
import { BarChart3, HelpCircle, Sun, Moon, Calendar, Target, Lightbulb } from 'lucide-react';


interface PathWordleProps {
  gameMode?: 'daily' | 'practice';
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  onModeChange?: (mode: 'daily' | 'practice') => void;
}

// Memoized error boundary component
const ErrorBoundary = memo(({ error, onReset }: { error: string | null; onReset: () => void }) => {
  if (!error) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" role="alert">
      <div className="bg-surface-container rounded-xl p-6 shadow-lg max-w-md">
        <h2 className="text-2xl font-bold text-error mb-4 font-headline">Error Loading Game</h2>
        <p className="text-on-surface mb-6">{error}</p>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary-dim transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Try Again
        </button>
      </div>
    </div>
  );
});

ErrorBoundary.displayName = 'ErrorBoundary';

// Material Design Top App Bar with Game Mode Toggle
const TopAppBar = memo(({
  onShowHowToPlay,
  onShowStatistics,
  onShowSettings,
  gameMode,
  onModeChange,
  isDarkTheme,
  onToggleTheme,
  onShowHints
}: {
  onShowHowToPlay: () => void;
  onShowStatistics: () => void;
  onShowSettings: () => void;
  gameMode: 'daily' | 'practice';
  onModeChange: (mode: 'daily' | 'practice') => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  onShowHints: () => void;
}) => {
  const navigate = useNavigate();

  return (
  <header className="bg-background sticky top-0 z-50">
    <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="text-2xl font-black text-primary tracking-tighter italic font-headline uppercase hover:opacity-80 transition-opacity cursor-pointer"
      >
        PathWordle
      </button>
      <div className="flex items-center gap-6">
        {/* Game Mode Toggle */}
        <div className="relative group">
          <button
            onClick={() => onModeChange(gameMode === 'daily' ? 'practice' : 'daily')}
            className="text-on-surface-variant hover:text-primary hover:bg-primary/10 p-2 rounded-lg transition-all duration-300 cursor-pointer scale-95 active:scale-90 transition-transform"
            aria-label={`Current mode: ${gameMode}. Click to switch.`}
          >
            {gameMode === 'daily' ? <Calendar className="w-6 h-6" /> : <Target className="w-6 h-6" />}
          </button>
          {/* Tooltip */}
          <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-surface-container-highest rounded-lg text-xs font-medium text-on-surface whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            {gameMode === 'daily' ? 'Daily Challenge' : 'Practice Mode'}
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="relative group">
          <button
            onClick={onToggleTheme}
            className="text-on-surface-variant hover:text-secondary hover:bg-secondary/10 p-2 rounded-lg transition-all duration-300 cursor-pointer scale-95 active:scale-90 transition-transform"
            aria-label={`Switch to ${isDarkTheme ? 'light' : 'dark'} mode`}
          >
            {isDarkTheme ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
          {/* Tooltip */}
          <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-surface-container-highest rounded-lg text-xs font-medium text-on-surface whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            {isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </div>
        </div>

        {/* Hints */}
        <div className="relative group">
          <button
            onClick={onShowHints}
            className="text-on-surface-variant hover:text-primary hover:bg-primary/10 p-2 rounded-lg transition-all duration-300 cursor-pointer scale-95 active:scale-90 transition-transform"
            aria-label="Get hints"
          >
            <Lightbulb className="w-6 h-6" />
          </button>
          {/* Tooltip */}
          <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-surface-container-highest rounded-lg text-xs font-medium text-on-surface whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Smart Hints
          </div>
        </div>

        {/* How to Play */}
        <div className="relative group">
          <button
            onClick={onShowHowToPlay}
            className="text-on-surface-variant hover:text-tertiary hover:bg-tertiary/10 p-2 rounded-lg transition-all duration-300 cursor-pointer scale-95 active:scale-90 transition-transform"
            aria-label="Help"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
          {/* Tooltip */}
          <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-surface-container-highest rounded-lg text-xs font-medium text-on-surface whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            How to Play
          </div>
        </div>

        {/* Statistics */}
        <div className="relative group">
          <button
            onClick={onShowStatistics}
            className="text-on-surface-variant hover:text-tertiary hover:bg-tertiary/10 p-2 rounded-lg transition-all duration-300 cursor-pointer scale-95 active:scale-90 transition-transform"
            aria-label="Statistics"
          >
            <BarChart3 className="w-6 h-6" />
          </button>
          {/* Tooltip */}
          <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-surface-container-highest rounded-lg text-xs font-medium text-on-surface whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Statistics
          </div>
        </div>
      </div>
    </div>
    <div className="bg-surface-container-low h-[1px] w-full"></div>
  </header>
);
});

TopAppBar.displayName = 'TopAppBar';

// Challenge Progress Indicator
interface ChallengeProgressProps {
  attemptsUsed: number;
  maxAttempts: number;
}

const ChallengeProgress = memo(({ attemptsUsed, maxAttempts }: ChallengeProgressProps) => (
  <div className="mb-12 text-center w-full">
    <div className="inline-flex flex-col items-center">
      <span className="font-headline font-bold text-xs uppercase tracking-[0.3em] text-on-surface-variant mb-2">
        Daily Challenge
      </span>
      <div className="flex items-center gap-4">
        <span className="font-headline font-black text-4xl text-primary">{attemptsUsed + 1}/{maxAttempts}</span>
        <span className="font-headline font-light text-2xl text-outline-variant">guess</span>
      </div>
      <div className="text-xs text-on-surface-variant mt-2">
        6 chances to guess today's word
      </div>
    </div>
  </div>
));


ChallengeProgress.displayName = 'ChallengeProgress';

// Word Input Slots
const WordInputSlots = memo(({ currentWord, maxLength }: { currentWord: string; maxLength: number }) => {
  const slots = Array.from({ length: maxLength }, (_, i) => currentWord[i] || '');

  return (
    <div className="flex gap-3 justify-center">
      {slots.map((letter, i) => (
        <div
          key={i}
          className={`md-grid-cell word-slot ${
            letter ? 'word-slot-active' : 'word-slot-inactive'
          }`}
        >
          {letter}
        </div>
      ))}
    </div>
  );
});

WordInputSlots.displayName = 'WordInputSlots';

// Game Action Buttons
const GameActionButtons = memo(({
  onClear,
  onSubmit,
  canSubmit,
  hasSelection
}: {
  onClear: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  hasSelection: boolean;
}) => (
  <div className="flex gap-4 w-full">
    <button
      onClick={onClear}
      disabled={!hasSelection}
      className={`md-button md-button-secondary flex-1 py-5 px-6 ${
        !hasSelection ? 'md-button-disabled' : ''
      }`}
    >
      CLEAR
    </button>
    <button
      onClick={onSubmit}
      disabled={!canSubmit}
      className={`md-button md-button-primary flex-[2] py-5 px-8 ${
        !canSubmit ? 'md-button-disabled' : ''
      }`}
    >
      SUBMIT PATH
    </button>
  </div>
));

GameActionButtons.displayName = 'GameActionButtons';

const PathWordle: React.FC<PathWordleProps> = ({ gameMode: initialGameMode = 'daily', difficulty = 'medium', onModeChange }) => {

  // State for game mode
  const [gameMode, setGameMode] = useState<'daily' | 'practice'>(initialGameMode);

  // Core hooks
  const { gameState, selectCell, submitGuess, clearPath, resetGame, canSubmit } = usePathWordle(gameMode);
  const { recordGame, getNextAchievement, clearNewAchievements, statistics } = useStatistics();
  const { isDarkTheme, setTheme, currentTheme } = useThemeContext();

  // State hooks
  const [error, setError] = useState<string | null>(null);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now());
  const [currentAchievement, setCurrentAchievement] = useState<any>(null);

  // Theme toggle handler - use ThemeProvider's theme system
  const handleToggleTheme = useCallback(() => {
    const newTheme = isDarkTheme ? 'light-default' : 'dark-default';
    setTheme(newTheme);
  }, [isDarkTheme, setTheme]);

  // Mode change handler
  const handleModeChange = useCallback((newMode: 'daily' | 'practice') => {
    setGameMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    }
    // Reset game when mode changes
    resetGame();
    setGameStartTime(Date.now());
  }, [onModeChange, resetGame]);

  // Memoize current word calculation
  const currentWord = useMemo(() => {
    return gameState?.currentPath ? pathToWord(gameState.currentPath) : '';
  }, [gameState?.currentPath]);

  // Callbacks
  const handleCellClick = useCallback((row: number, col: number) => {
    if (!gameState || gameState.gameStatus !== 'playing') return;
    selectCell(row, col);
  }, [gameState, selectCell]);

  const handleSubmit = useCallback(() => {
    if (canSubmit) {
      submitGuess();
    }
  }, [canSubmit, submitGuess]);

  const handleClear = useCallback(() => {
    if (gameState?.currentPath && gameState.currentPath.length > 0) {
      clearPath();
    }
  }, [clearPath, gameState?.currentPath]);

  const handleReset = useCallback(() => {
    resetGame();
    setError(null);
    setGameStartTime(Date.now());
  }, [resetGame]);

  // Handle game completion
  useEffect(() => {
    if (gameState && (gameState.gameStatus === 'won' || gameState.gameStatus === 'lost')) {
      const timeTaken = Math.round((Date.now() - gameStartTime) / 1000);

      // Calculate score
      let score = 0;
      if (gameState.gameStatus === 'won') {
        score = Math.max(1000 - (gameState.attemptsLeft * 200) - timeTaken, 100);
      }

      // Record game result
      recordGame({
        won: gameState.gameStatus === 'won',
        attemptsUsed: 6 - gameState.attemptsLeft,
        timeTaken,
        targetWord: gameState.targetWord,
        mode: gameMode,
        difficulty: difficulty,
        hintsUsed: 0,
        score
      });
    }
  }, [gameState?.gameStatus, gameState?.targetWord, gameState?.attemptsLeft, gameMode, difficulty, gameStartTime, recordGame]);

  // Listen for new achievement unlocks
  useEffect(() => {
    const nextAchievement = getNextAchievement();
    if (nextAchievement && nextAchievement !== currentAchievement) {
      setCurrentAchievement(nextAchievement);
      setTimeout(() => {
        clearNewAchievements();
        setCurrentAchievement(null);
      }, 5000);
    }
  }, [statistics, getNextAchievement, clearNewAchievements, currentAchievement]);

  // Inject Giscus script dynamically with theme support
  useEffect(() => {
    // Giscus configuration
    const repoId = "R_kgDOPE1Trw";
    const categoryId = "DIC_kwDOPE1Tr84C5aQ4";

    // Check if Giscus is properly configured
    if (!repoId || repoId.includes("xxxxx") || !categoryId || categoryId.includes("xxxxx")) {
      console.log('Giscus not configured. Add your repository details to enable comments.');
      return;
    }

    const script = document.createElement('script');
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "Haluntech/pathwordle");
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", isDarkTheme ? "dark" : "light");
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    const commentsContainer = document.getElementById('giscus-container');
    if (commentsContainer) {
      commentsContainer.appendChild(script);
    }

    return () => {
      if (commentsContainer && commentsContainer.contains(script)) {
        commentsContainer.removeChild(script);
      }
    };
  }, [isDarkTheme]);

  // Validate game state
  useEffect(() => {
    if (!gameState) {
      setError('Failed to initialize game state');
    } else if (!gameState.grid || gameState.grid.length === 0) {
      setError('Game grid not initialized');
    }
  }, [gameState]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

      switch (event.key.toLowerCase()) {
        case 'enter':
          if (canSubmit && currentWord) {
            event.preventDefault();
            handleSubmit();
          }
          break;
        case 'escape':
        case 'c':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleClear();
          }
          break;
        case 'r':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleReset();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [canSubmit, currentWord, handleSubmit, handleClear, handleReset]);

  // Render logic
  if (error) return <ErrorBoundary error={error} onReset={handleReset} />;

  if (!gameState || !gameState.grid || gameState.grid.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-12 h-12 bg-primary rounded-full mx-auto mb-4"></div>
          <p className="text-on-surface-variant font-medium">Loading PathWordle...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="main-content" className="min-h-screen bg-background text-on-surface font-body flex flex-col">
      <TopAppBar
        onShowHowToPlay={() => setShowHowToPlay(true)}
        onShowStatistics={() => setShowStatistics(true)}
        onShowSettings={() => {}}
        gameMode={gameMode}
        onModeChange={handleModeChange}
        isDarkTheme={isDarkTheme}
        onToggleTheme={handleToggleTheme}
        onShowHints={() => setShowHints(true)}
      />

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 max-w-5xl mx-auto w-full">
        <ChallengeProgress
          attemptsUsed={6 - gameState.attemptsLeft}
          maxAttempts={6}
        />

        {/* Main Game Board Container */}
        <div className="relative w-full max-w-lg aspect-square mb-12">
          <Grid grid={gameState.grid} onCellClick={handleCellClick} />
        </div>

        {/* Word Input Area */}
        <div className="w-full max-w-md flex flex-col items-center gap-8">
          <WordInputSlots currentWord={currentWord} maxLength={5} />
          <GameActionButtons
            onClear={handleClear}
            onSubmit={handleSubmit}
            canSubmit={canSubmit}
            hasSelection={gameState.currentPath.length > 0}
          />
        </div>
      </main>

      {/* Modals for Panels */}
      <Modal isOpen={showStatistics} onClose={() => setShowStatistics(false)} title="Statistics" size="lg">
        <Statistics showDetailed={true} />
      </Modal>

      {(gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-surface-container rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <GameResult
              gameStatus={gameState.gameStatus}
              targetWord={gameState.targetWord}
              attemptsUsed={6 - gameState.attemptsLeft}
              onReset={handleReset}
              gameMode={gameState.gameMode}
              difficulty={difficulty}
              timeTaken={Math.round((Date.now() - gameStartTime) / 1000)}
              score={gameState.gameStatus === 'won' ? Math.max(1000 - ((6 - gameState.attemptsLeft - 1) * 200) - Math.round((Date.now() - gameStartTime) / 1000), 100) : 0}
              hintsUsed={0}
              maxStreak={statistics.maxStreak}
            />

            {/* Share System */}
            <div className="mt-6">
              <ShareSystem
                gameResult={{
                  won: gameState.gameStatus === 'won',
                  attemptsUsed: 6 - gameState.attemptsLeft,
                  word: gameState.targetWord,
                  timeTaken: Math.round((Date.now() - gameStartTime) / 1000)
                }}
                onShare={(platform) => console.log(`Shared to ${platform}`)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div id="comments-container" className="max-w-5xl mx-auto w-full px-8 py-8 mt-auto border-t border-surface-container-high">
        <h2 className="text-2xl font-bold text-on-surface mb-8 text-center uppercase tracking-wider font-headline">
          Community Discussion
        </h2>
        <div className="bg-surface-container rounded-xl p-6 sm:p-10 shadow-sm">
          <div id="giscus-container" className="giscus mx-auto" />
        </div>
      </div>

      {/* User Engagement Hooks */}
      <UserEngagementHooks
        gameStats={{
          gamesPlayed: statistics?.gamesPlayed || 0,
          streak: statistics?.currentStreak || 0,
          maxStreak: statistics?.maxStreak || 0,
          lastPlayed: new Date().toISOString()
        }}
        lastGame={
          gameState.gameStatus === 'won' || gameState.gameStatus === 'lost'
            ? {
                won: gameState.gameStatus === 'won',
                attemptsUsed: 6 - gameState.attemptsLeft,
                timeTaken: Math.round((Date.now() - gameStartTime) / 1000)
              }
            : undefined
        }
        onAction={(hookId, action) => console.log(`Hook ${hookId} action: ${action}`)}
      />

      {/* Footer */}
      <Footer
        onShowPrivacy={() => setShowPrivacy(true)}
        onShowTerms={() => setShowTerms(true)}
        onShowAbout={() => setShowAbout(true)}
        onShowContact={() => setShowContact(true)}
      />

      <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />

      <AchievementNotification
        achievement={currentAchievement}
        onClose={() => {
          setCurrentAchievement(null);
          clearNewAchievements();
        }}
      />

      {/* Optimized Hint Panel */}
      <OptimizedHintPanel
        isVisible={showHints}
        onClose={() => setShowHints(false)}
        onUseHint={(hintId) => {
          console.log(`Using hint: ${hintId}`);
          return true;
        }}
        targetWord={gameState.targetWord}
        currentPath={currentWord}
        attemptsLeft={gameState.attemptsLeft}
      />

      {/* AdSense Required Pages */}
      <PrivacyPolicy isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <TermsOfService isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <About isOpen={showAbout} onClose={() => setShowAbout(false)} />
      <Contact isOpen={showContact} onClose={() => setShowContact(false)} />
    </div>
  );
};

export default PathWordle;
