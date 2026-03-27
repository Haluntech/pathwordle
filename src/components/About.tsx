import React from 'react';
import { X, Heart, Users, Target, Zap } from 'lucide-react';

interface AboutProps {
  isOpen: boolean;
  onClose: () => void;
}

const About: React.FC<AboutProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm">
      <div className="bg-surface-container rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-surface-container-highest px-6 py-4 border-b border-surface-container-high flex items-center justify-between">
          <h2 className="text-2xl font-bold text-on-surface font-headline">About PathWordle</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <section className="text-center">
            <h1 className="text-4xl font-black text-primary font-headline mb-2">PathWordle</h1>
            <p className="text-on-surface-variant">The Strategic Word Puzzle Revolution</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              What is PathWordle?
            </h3>
            <p className="text-on-surface-variant leading-relaxed">
              PathWordle is a free strategic word puzzle game that combines the addictive gameplay of Wordle with path-building mechanics. 
              Instead of typing letters directly, you connect adjacent letters on a 6×6 grid to form paths and guess hidden 5-letter words.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary" />
              Unique Features
            </h3>
            <div className="grid gap-3">
              <div className="bg-surface-container p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-1">Path-Based Gameplay</h4>
                <p className="text-sm text-on-surface-variant">Connect letters horizontally, vertically, or diagonally</p>
              </div>
              <div className="bg-surface-container p-4 rounded-lg">
                <h4 className="font-semibold text-secondary mb-1">Daily Challenges</h4>
                <p className="text-sm text-on-surface-variant">New puzzle every day for everyone to solve</p>
              </div>
              <div className="bg-surface-container p-4 rounded-lg">
                <h4 className="font-semibold text-tertiary mb-1">Practice Mode</h4>
                <p className="text-sm text-on-surface-variant">Unlimited puzzles to improve your skills</p>
              </div>
              <div className="bg-surface-container p-4 rounded-lg">
                <h4 className="font-semibold text-outline mb-1">Smart Hints</h4>
                <p className="text-sm text-on-surface-variant">AI-powered suggestions when you're stuck</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-tertiary" />
              The Team
            </h3>
            <p className="text-on-surface-variant leading-relaxed">
              PathWordle is developed by Luminous Logic, a small team passionate about creating engaging puzzle games 
              that challenge your mind and brighten your day. We believe in free, accessible gaming for everyone.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-error" />
              Made with Love
            </h3>
            <p className="text-on-surface-variant leading-relaxed">
              PathWordle is completely free to play. No ads, no subscriptions, no in-app purchases. 
              Just pure word puzzle enjoyment. If you enjoy the game, please share it with your friends!
            </p>
          </section>

          <section className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
            <p className="text-sm text-center text-on-surface">
              <strong>Version:</strong> 1.0.0 | {' '}
              <strong>Launched:</strong> March 2026 | {' '}
              <strong>License:</strong> MIT Open Source
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
