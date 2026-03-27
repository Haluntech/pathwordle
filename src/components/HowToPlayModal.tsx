import React, { memo, useState, useEffect } from 'react';
import { Modal } from './base/Modal';
import { PlayCircle } from 'lucide-react';
import TutorialMiniGrid from './TutorialMiniGrid';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = memo(({ isOpen, onClose }) => {

  const [currentStep, setCurrentStep] = useState(0);

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const steps = [
    {
      title: "Welcome to PathWordle",
      visual: <PlayCircle className="w-16 h-16 text-blue-500 mb-6 mx-auto animate-bounce" />,
      content: "A unique fusion of Wordle and path-finding. Connect adjacent letters to form words and solve the daily puzzle!",
      animation: "animate-fade-in"
    },
    {
      title: "Find Your Path",
      visual: <TutorialMiniGrid type="path" />,
      content: "Select exactly 5 adjacent letters (horizontally, vertically, or diagonally) to form a word. Letters can't be reused in the same path.",
      animation: "animate-fade-in"
    },
    {
      title: "Master the Colors",
      visual: <TutorialMiniGrid type="feedback" />,
      content: "Just like Wordle, colors tell you how close you are. Use the grid feedback to narrow down the hidden word.",
      animation: "animate-fade-in"
    },
    {
      title: "Keep it Close",
      visual: <TutorialMiniGrid type="adjacency" />,
      content: "Remember: you can only connect letters that are touching! Horizontal, vertical, and diagonal are all okay.",
      animation: "animate-fade-in"
    }
  ];



  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      className="!p-0 overflow-hidden bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl"
      overlayClassName="bg-black/40 backdrop-blur-sm"
      showCloseButton={false}
    >
      <div className="relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 -z-10 rounded-t-2xl"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>

        <div className="p-10 text-center">
          <div className="mb-10 min-h-[320px] flex flex-col justify-center items-center">
            {/* Animated content transition */}
            <div key={currentStep} className={`${steps[currentStep].animation} transition-all duration-500`}>
              <div className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
                {steps[currentStep].visual}
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-5 tracking-tight">{steps[currentStep].title}</h3>
              <div className="text-slate-600 leading-relaxed text-lg max-w-sm mx-auto font-medium">
                {steps[currentStep].content}
              </div>
            </div>
          </div>



          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep ? 'w-8 bg-blue-500' : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-3 justify-center">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-6 py-2.5 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Back
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-8 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-8 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
              >
                <PlayCircle className="w-5 h-5" />
                Let's Play!
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
});

HowToPlayModal.displayName = 'HowToPlayModal';
