import React from 'react';

interface NotificationSettingsSimpleProps {
  isVisible: boolean;
  onClose: () => void;
}

const NotificationSettingsSimple: React.FC<NotificationSettingsSimpleProps> = ({
  isVisible,
  onClose
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Notification Settings
        </h2>
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">
              <strong>Daily Reminders</strong><br />
              Get notified when the daily word is ready
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">
              <strong>Challenge Alerts</strong><br />
              Notifications for time challenge events
            </p>
          </div>
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Browser Limitation:</strong><br />
              Some notification features may be limited in your browser or require HTTPS.
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsSimple;