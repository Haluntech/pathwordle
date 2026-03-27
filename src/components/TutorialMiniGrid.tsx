import React, { useState, useEffect, memo } from 'react';

interface TutorialMiniGridProps {
  type: 'path' | 'feedback' | 'adjacency';
}

const TutorialMiniGrid: React.FC<TutorialMiniGridProps> = memo(({ type }) => {
  const [activeStep, setActiveStep] = useState(0);

  // Animation logic based on type
  useEffect(() => {
    let interval: any;
    
    if (type === 'path') {
      // Animate path building: A -> P -> P -> L -> E
      const steps = 6; // 0 to 5
      interval = setInterval(() => {
        setActiveStep(prev => (prev + 1) % steps);
      }, 800);
    } else if (type === 'feedback') {
      // Animate color feedback flip
      const steps = 2; // 0: initial, 1: flipped
      interval = setInterval(() => {
        setActiveStep(prev => (prev + 1) % steps);
      }, 2000);
    } else if (type === 'adjacency') {
      // Animate failed vs successful adjacency
      const steps = 4;
      interval = setInterval(() => {
        setActiveStep(prev => (prev + 1) % steps);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [type]);

  if (type === 'path') {
    const letters = ['A', 'P', 'P', 'L', 'E'];
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-100/50 rounded-2xl border border-slate-200 shadow-inner">
          {[
            ['S', 'P', 'X'],
            ['L', 'A', 'P'],
            ['E', 'Y', 'Z']
          ].map((row, rIdx) => 
            row.map((char, cIdx) => {
              // Manual mapping for APPLE path
              const pathIdx = (rIdx === 1 && cIdx === 1) ? 0 : // A
                             (rIdx === 0 && cIdx === 1) ? 1 : // P
                             (rIdx === 1 && cIdx === 2) ? 2 : // P
                             (rIdx === 1 && cIdx === 0) ? 3 : // L
                             (rIdx === 2 && cIdx === 0) ? 4 : // E
                             -1;
              
              const isHighlighted = pathIdx !== -1 && pathIdx <= activeStep - 1;

              return (
                <div 
                  key={`${rIdx}-${cIdx}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg transition-all duration-300 ${
                    isHighlighted 
                      ? 'bg-indigo-600 text-white shadow-md scale-105' 
                      : 'bg-white text-slate-400'
                  }`}
                >
                  {char}
                </div>
              );
            })
          )}
        </div>
        <div className="h-8 flex items-center justify-center gap-1 font-black text-2xl tracking-[0.2em] text-indigo-600">
          {letters.map((l, i) => (
            <span key={i} className={`transition-all duration-300 ${i <= activeStep - 1 ? 'opacity-100 scale-100' : 'opacity-20 scale-75'}`}>
              {l}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'feedback') {
    const items = [
      { char: 'P', status: 'correct', color: 'bg-emerald-500', label: 'Correct' },
      { char: 'A', status: 'partial', color: 'bg-amber-500', label: 'Wrong Pos' },
      { char: 'T', status: 'incorrect', color: 'bg-slate-400', label: 'Not in word' },
      { char: 'H', status: 'incorrect', color: 'bg-slate-400', label: 'Not in word' },
      { char: 'Y', status: 'incorrect', color: 'bg-slate-400', label: 'Not in word' }
    ];

    return (
      <div className="flex flex-col items-center gap-8 py-4">
        <div className="flex gap-2">
          {items.map((item, i) => (
            <div 
              key={i}
              className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-xl text-white transition-all duration-500 transform ${
                activeStep === 1 ? `rotate-y-180 ${item.color} shadow-lg` : 'bg-white text-slate-600 border-2 border-slate-200'
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <span className={activeStep === 1 ? 'animate-fade-in' : ''}>{item.char}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 w-full text-xs font-bold uppercase tracking-tight text-slate-500">
          <div className="flex flex-col items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-500"></div>
            <span>Correct</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500"></div>
            <span>Wrong Position</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-400"></div>
            <span>Incorrect</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'adjacency') {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-100/50 rounded-2xl border border-slate-200">
          {[
            ['A', 'B', 'C'],
            ['D', 'E', 'F'],
            ['G', 'H', 'I']
          ].map((row, rIdx) => 
            row.map((char, cIdx) => {
              const isE = rIdx === 1 && cIdx === 1;
              const isA = rIdx === 0 && cIdx === 0;
              const isB = rIdx === 0 && cIdx === 1;
              
              let status = 'idle';
              if (activeStep === 1) {
                if (isE) status = 'selected';
                if (isA) status = 'error';
              } else if (activeStep === 2) {
                if (isE) status = 'selected';
              } else if (activeStep === 3) {
                if (isE || isB) status = 'selected';
              }

              return (
                <div 
                  key={`${rIdx}-${cIdx}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg transition-all duration-300 ${
                    status === 'selected' ? 'bg-indigo-600 text-white' :
                    status === 'error' ? 'bg-red-500 text-white animate-shake' :
                    'bg-white text-slate-400'
                  }`}
                >
                  {char}
                </div>
              );
            })
          )}
        </div>
        <div className="text-sm font-bold text-slate-500 h-6">
          {activeStep === 1 && <span className="text-red-500">Not adjacent!</span>}
          {activeStep === 3 && <span className="text-emerald-500">Adjacent!</span>}
        </div>
      </div>
    );
  }

  return null;
});


TutorialMiniGrid.displayName = 'TutorialMiniGrid';

export default TutorialMiniGrid;
