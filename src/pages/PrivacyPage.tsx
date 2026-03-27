import React from 'react';
import { Link } from 'react-router-dom';
import PrivacyPolicy from '../components/PrivacyPolicy';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Back Navigation */}
      <nav className="bg-surface-container-low border-b border-surface-container-high">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </nav>

      {/* Privacy Policy Modal */}
      <PrivacyPolicy 
        isOpen={true} 
        onClose={() => window.location.href = '/'} 
      />
    </div>
  );
};

export default PrivacyPage;
