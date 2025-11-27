import React from 'react';
import { ComponentErrorBoundary } from './ComponentErrorBoundary';
import TimeChallengeMode from './TimeChallengeMode';

interface TimeChallengeModeWrapperProps {
  playerId: string;
  onBack?: () => void;
  compact?: boolean;
}

const TimeChallengeModeWrapper: React.FC<TimeChallengeModeWrapperProps> = (props) => {
  const handleError = (error: Error, errorInfo: any) => {
    console.error('TimeChallengeMode Error:', error, errorInfo);
    // You could send this to an error reporting service
  };

  const fallbackUI = (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto mt-20">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Time Challenge Unavailable
          </h2>
          <p className="text-gray-600 mb-6">
            We're having trouble loading the time challenge mode. Please try refreshing the page.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
            {props.onBack && (
              <button
                onClick={props.onBack}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go Back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ComponentErrorBoundary fallback={fallbackUI} onError={handleError}>
      <TimeChallengeMode {...props} />
    </ComponentErrorBoundary>
  );
};

export default TimeChallengeModeWrapper;