import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ThemeProvider from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { DifficultyConfig } from './config/difficulties';
import LandingPage from './components/LandingPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import About from './components/About';
import Contact from './components/Contact';

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
          <Router>
            <div className="relative min-h-screen" role="application" aria-label="PathWordle Game">
              {/* Skip to main content link for accessibility */}
              <a href="#main-content" className="skip-link">
                Skip to main content
              </a>

              <Suspense fallback={<GameLoader />}>
                <Routes>
                  {/* Landing Page */}
                  <Route path="/" element={<LandingPage />} />

                  {/* Game Page */}
                  <Route
                    path="/game"
                    element={
                      <PathWordle
                        gameMode={gameMode}
                        difficulty={difficulty}
                        onModeChange={handleModeChange}
                      />
                    }
                  />

                  {/* Static Pages */}
                  <Route path="/privacy" element={<PrivacyPolicy isOpen={true} onClose={() => window.location.href = '/'} />} />
                  <Route path="/terms" element={<TermsOfService isOpen={true} onClose={() => window.location.href = '/'} />} />
                  <Route path="/about" element={<About isOpen={true} onClose={() => window.location.href = '/'} />} />
                  <Route path="/contact" element={<Contact isOpen={true} onClose={() => window.location.href = '/'} />} />

                  {/* Redirect old paths */}
                  <Route path="/play" element={<Navigate to="/game" replace />} />

                  {/* Fallback - redirect to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>

              {/* Difficulty Dialog - Global */}
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
          </Router>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;