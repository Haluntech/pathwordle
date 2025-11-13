import React, { useState, lazy, Suspense, memo } from 'react';
import { Menu, X, Calendar, Target } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load the main game component for better performance
const PathWordle = lazy(() => import('./components/PathWordle'));

// Loading component for Suspense fallback
const GameLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading PathWordle...</p>
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

// Memoized sidebar component to prevent unnecessary re-renders
const GameModeSelector = memo(({
  gameMode,
  onModeChange,
  isSidebarOpen,
  onSidebarToggle
}: {
  gameMode: 'daily' | 'practice';
  onModeChange: (mode: 'daily' | 'practice') => void;
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
}) => (
  <>
    {/* Mobile Sidebar Toggle */}
    <div className="lg:hidden fixed top-4 left-4 z-40">
      <button
        onClick={onSidebarToggle}
        className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isSidebarOpen}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>

    {/* Sidebar Overlay for Mobile */}
    {isSidebarOpen && (
      <div
        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        onClick={onSidebarToggle}
        aria-label="Close sidebar"
      />
    )}

    {/* Game Mode Selector Sidebar */}
    <div className={`
      fixed top-0 left-0 h-full z-40 transform transition-transform duration-300 ease-in-out
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:relative lg:top-4 lg:right-4 lg:left-auto lg:transform-none lg:h-auto
    `}>
      <div className="bg-white rounded-r-lg shadow-lg p-4 lg:rounded-lg lg:p-2">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-2">
          <button
            onClick={() => onModeChange('daily')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500
              ${gameMode === 'daily'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
            aria-pressed={gameMode === 'daily'}
          >
            <Calendar size={16} aria-hidden="true" />
            <span className="lg:hidden">Daily</span>
            <span className="hidden lg:inline">Daily Challenge</span>
          </button>
          <button
            onClick={() => onModeChange('practice')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-green-500
              ${gameMode === 'practice'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
            aria-pressed={gameMode === 'practice'}
          >
            <Target size={16} aria-hidden="true" />
            <span className="lg:hidden">Practice</span>
            <span className="hidden lg:inline">Practice Mode</span>
          </button>
        </div>
      </div>
    </div>
  </>
));

GameModeSelector.displayName = 'GameModeSelector';

function App() {
  const [gameMode, setGameMode] = useState<'daily' | 'practice'>('daily');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleModeChange = React.useCallback((mode: 'daily' | 'practice') => {
    setGameMode(mode);
    setIsSidebarOpen(false);
  }, []);

  const handleSidebarToggle = React.useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  return (
    <ErrorBoundary onError={handleError}>
      <div className="relative min-h-screen" role="application" aria-label="PathWordle Game">
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <GameModeSelector
          gameMode={gameMode}
          onModeChange={handleModeChange}
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={handleSidebarToggle}
        />

        <ErrorBoundary>
          <Suspense fallback={<GameLoader />}>
            <PathWordle gameMode={gameMode} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}

export default App;