import React from 'react';
import { Zap, Target, Clock, Palette, BookOpen } from 'lucide-react';

interface ComingSoonBadgeProps {
  feature: string;
  icon: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const ComingSoonBadge: React.FC<ComingSoonBadgeProps> = ({ feature, icon, size = 'md' }) => {
  return (
    <div className="relative inline-flex items-center">
      <div className="relative">
        {icon}
      </div>

      {/* Badge */}
      <div className={`
        absolute -top-1 -right-1 bg-yellow-500 text-white text-xs font-bold rounded-full px-2 py-1
        flex items-center gap-1 shadow-lg
        ${size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-[12px]' : 'text-[11px]'}
      `}>
        <Zap className="w-3 h-3" />
        <span className="hidden sm:inline">Soon</span>
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-8 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="bg-gray-900 text-white text-sm rounded-lg p-3 shadow-xl max-w-xs">
          <div className="font-semibold text-yellow-400 mb-1">Coming Soon!</div>
          <p className="text-xs text-gray-300 mb-2">
            <strong>{feature}</strong> is under development and will be available in a future update.
          </p>
          <p className="text-xs text-gray-300">
            We're working hard to bring you the best word puzzle experience with enhanced features and content quality.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Target className="w-4 h-4 text-yellow-400" />
            <span className="text-xs">Premium Feature</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-gray-300 bg-white transform rotate-45 origin-bottom"></div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonBadge;