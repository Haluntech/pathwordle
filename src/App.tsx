import React, { useState, lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import ThemeProvider from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { DifficultyConfig } from './config/difficulties';

// Lazy load the main game component for better performance
const PathWordle = lazy(() => import('./components/PathWordle'));
const DifficultyDialog = lazy(() => import('./components/DifficultyDialog'));

// Loading component for Suspense fallback
const GameLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-on-surface-variant">Loading PathWordle...</p>
    </div>
  </div>
);

// Error handler for logging and reporting
const handleError = (error: Error, errorInfo: any) => {
  console.error('App-level error:', error, errorInfo);

  // In production, you would send this to an error reporting service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to your error tracking service
    // trackError(error, errorInfo);
  }
};

function App() {
  const [gameMode, setGameMode] = useState<'daily' | 'practice'>('daily');
  const [difficulty, setDifficulty] = useState<DifficultyConfig['id']>('medium');
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(false);

  const handleModeChange = React.useCallback((mode: 'daily' | 'practice') => {
    setGameMode(mode);
  }, []);

  const handleDifficultyChange = React.useCallback((newDifficulty: DifficultyConfig['id']) => {
    setDifficulty(newDifficulty);
  }, []);

  return (
    <ErrorBoundary onError={handleError}>
      <LanguageProvider>
          <ThemeProvider>
          <div className="relative min-h-screen" role="application" aria-label="PathWordle Game">
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <ErrorBoundary>
          <Suspense fallback={<GameLoader />}>
            <PathWordle gameMode={gameMode} difficulty={difficulty} onModeChange={handleModeChange} />
          </Suspense>
        </ErrorBoundary>

        {/* Difficulty Dialog */}
        <ErrorBoundary>
          <Suspense fallback={<div />}>
            <DifficultyDialog
              isOpen={showDifficultyDialog}
              onClose={() => setShowDifficultyDialog(false)}
              selectedDifficulty={difficulty}
              onDifficultySelect={handleDifficultyChange}
              gameMode={gameMode}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
      </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;