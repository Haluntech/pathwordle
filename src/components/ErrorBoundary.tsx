import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Report to error tracking service (in production)
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error tracking service
      // errorReporting.captureException(error, { extra: errorInfo });
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or default error screen
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <div
          className="min-h-screen bg-red-50 flex items-center justify-center p-4"
          role="alert"
          aria-labelledby="error-title"
          aria-describedby="error-description"
        >
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <h1
              id="error-title"
              className="text-2xl font-bold text-red-600 mb-4 flex items-center gap-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              Oops! Something went wrong
            </h1>

            <div id="error-description" className="space-y-4">
              <p className="text-gray-700">
                We're sorry, but the game encountered an unexpected error.
                Don't worry, your progress is safe!
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="bg-gray-100 p-3 rounded text-sm">
                  <summary className="font-semibold cursor-pointer">Error Details (Development)</summary>
                  <pre className="mt-2 text-xs overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={this.handleReset}
                  className="btn-primary flex-1"
                  aria-label="Try again and reload the game"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn-secondary flex-1"
                  aria-label="Go to homepage"
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional component wrapper for easier usage
export const ErrorBoundaryWrapper: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}> = ({ children, fallback, onError }) => {
  return (
    <ErrorBoundary fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;