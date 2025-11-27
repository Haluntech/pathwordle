import React from 'react';
import { ComponentErrorBoundary } from './ComponentErrorBoundary';
import NotificationSettings from './NotificationSettings';

interface NotificationSettingsWrapperProps {
  isVisible: boolean;
  onClose: () => void;
}

const NotificationSettingsWrapper: React.FC<NotificationSettingsWrapperProps> = (props) => {
  const handleError = (error: Error, errorInfo: any) => {
    console.error('NotificationSettings Error:', error, errorInfo);
    // You could send this to an error reporting service
  };

  const fallbackUI = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Notification Settings Unavailable
        </h2>
        <p className="text-gray-600 mb-4">
          We're having trouble loading the notification settings. This might be due to browser limitations.
        </p>
        <button
          onClick={props.onClose}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <ComponentErrorBoundary fallback={fallbackUI} onError={handleError}>
      <NotificationSettings {...props} />
    </ComponentErrorBoundary>
  );
};

export default NotificationSettingsWrapper;