import React, { useState } from 'react';
import { X, Eye, Shield, Cookie, Database, Trash2 } from 'lucide-react';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: Eye },
    { id: 'data-collection', title: 'Data Collection', icon: Database },
    { id: 'data-usage', title: 'Data Usage', icon: Shield },
    { id: 'cookies', title: 'Cookies & Ads', icon: Cookie },
    { id: 'user-rights', title: 'Your Rights', icon: Trash2 },
  ];

  const content = {
    overview: {
      title: 'Privacy Policy Overview',
      lastUpdated: 'March 27, 2026',
      content: (
        <div className="space-y-4">
          <p className="text-on-surface">
            At PathWordle, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
          </p>
          <div className="bg-surface-container-high p-4 rounded-lg border-l-4 border-primary">
            <p className="text-sm font-medium text-primary">
              <strong>Our Commitment:</strong> We collect minimal data necessary to provide the best gaming experience.
            </p>
          </div>
          <h3 className="text-lg font-bold text-on-surface mt-6">Key Points</h3>
          <ul className="list-disc list-inside space-y-2 text-on-surface-variant">
            <li>We use local storage to save your game progress (no account required)</li>
            <li>We use Google AdSense to display relevant advertisements</li>
            <li>We use Google Analytics to understand user behavior</li>
            <li>You can clear your data at any time from your browser settings</li>
          </ul>
        </div>
      )
    },
    'data-collection': {
      title: 'Data We Collect',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-on-surface">Information Collected Automatically</h3>
          <div className="space-y-3">
            <div className="bg-surface-container p-4 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Game Statistics</h4>
              <p className="text-sm text-on-surface-variant">Games played, win rate, current streak, max streak stored locally.</p>
            </div>
            <div className="bg-surface-container p-4 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Usage Data</h4>
              <p className="text-sm text-on-surface-variant">IP address, browser type, device type via Google Analytics.</p>
            </div>
          </div>
        </div>
      )
    },
    'data-usage': {
      title: 'How We Use Your Data',
      content: (
        <div className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-start gap-3 bg-surface-container p-3 rounded-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-on-surface">Game Functionality</h4>
                <p className="text-sm text-on-surface-variant">Save progress and track statistics</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-surface-container p-3 rounded-lg">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Shield className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h4 className="font-semibold text-on-surface">Analytics</h4>
                <p className="text-sm text-on-surface-variant">Understand user behavior to improve the game</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-surface-container p-3 rounded-lg">
              <div className="p-2 bg-tertiary/10 rounded-lg">
                <Shield className="w-5 h-5 text-tertiary" />
              </div>
              <div>
                <h4 className="font-semibold text-on-surface">Advertising</h4>
                <p className="text-sm text-on-surface-variant">Display relevant advertisements</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    cookies: {
      title: 'Cookies & Advertising',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-on-surface">Google AdSense & Cookies</h3>
          <p className="text-on-surface-variant">
            PathWordle uses Google AdSense to display advertisements. Google and its partners may use cookies to serve ads.
          </p>
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg mt-4">
            <p className="text-sm text-on-surface">
              <strong>Opt out of personalized ads:</strong>{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                Google Ad Settings
              </a>
            </p>
          </div>
        </div>
      )
    },
    'user-rights': {
      title: 'Your Privacy Rights',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-on-surface">Your Rights</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-surface-container p-3 rounded-lg">
              <div className="text-primary font-bold">1.</div>
              <div>
                <h4 className="font-semibold text-on-surface">Access and Deletion</h4>
                <p className="text-sm text-on-surface-variant">Clear browser cache to delete all game data.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-surface-container p-3 rounded-lg">
              <div className="text-primary font-bold">2.</div>
              <div>
                <h4 className="font-semibold text-on-surface">Opt-Out of Ads</h4>
                <p className="text-sm text-on-surface-variant">Use browser extensions or Google's opt-out tools.</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm">
      <div className="bg-surface-container rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-surface-container-highest px-6 py-4 border-b border-surface-container-high flex items-center justify-between">
          <h2 className="text-2xl font-bold text-on-surface font-headline">Privacy Policy</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 bg-surface-container-low border-r border-surface-container-high overflow-y-auto">
            <nav className="p-4 space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                      activeSection === section.id
                        ? 'bg-primary text-on-primary'
                        : 'hover:bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{section.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {content[activeSection as keyof typeof content]?.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
