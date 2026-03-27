import React from 'react';
import { X, Scale, AlertCircle, UserCheck, Gavel } from 'lucide-react';

interface TermsOfServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm">
      <div className="bg-surface-container rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-surface-container-highest px-6 py-4 border-b border-surface-container-high flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-on-surface font-headline">Terms of Service</h2>
            <p className="text-sm text-on-surface-variant">Last updated: March 27, 2026</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <section>
            <h3 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              Acceptance of Terms
            </h3>
            <p className="text-on-surface-variant">
              By accessing or playing PathWordle, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-secondary" />
              Eligibility
            </h3>
            <p className="text-on-surface-variant">
              You must be at least 13 years old to use PathWordle. By using our service, you represent that you meet this age requirement.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
              <Gavel className="w-5 h-5 text-tertiary" />
              Fair Play Policy
            </h3>
            <div className="bg-surface-container-high p-4 rounded-lg space-y-2">
              <p className="text-sm text-on-surface-variant mb-2">Players agree to:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-on-surface-variant">
                <li>Play fairly without attempting to manipulate game results</li>
                <li>Not use automated scripts or bots to solve puzzles</li>
                <li>Not attempt to reverse-engineer the game or daily word generation</li>
                <li>Respect other players in any community features</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-error" />
              Disclaimer of Warranties
            </h3>
            <p className="text-on-surface-variant">
              PathWordle is provided "as is" without warranties of any kind. We do not guarantee uninterrupted access or error-free operation.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-on-surface mb-3">Limitation of Liability</h3>
            <p className="text-on-surface-variant">
              PathWordle and its creators shall not be liable for any indirect, incidental, or consequential damages arising from use of the service.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-on-surface mb-3">Changes to Terms</h3>
            <p className="text-on-surface-variant">
              We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-on-surface mb-3">Contact</h3>
            <p className="text-on-surface-variant">
              Questions about these terms? Contact us at{' '}
              <a href="mailto:support@pathwordle.com" className="text-primary hover:underline">
                support@pathwordle.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
