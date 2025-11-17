import React, { useState, useEffect, useCallback, memo } from 'react';
import { Achievement } from '../types/statistics';
import { Trophy, X, Sparkles } from 'lucide-react';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
  autoHide?: boolean;
  duration?: number;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose,
  autoHide = true,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (achievement) {
      // 触发动画
      setIsVisible(true);
      setIsClosing(false);

      // 自动隐藏
      if (autoHide) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [achievement, autoHide, duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!achievement || !isVisible) return null;

  const getRarityColors = (rarity: string) => {
    const colors = {
      common: {
        bg: 'from-gray-50 to-gray-100',
        border: 'border-gray-300',
        icon: 'text-gray-600',
        title: 'text-gray-800',
        sparkle: 'text-gray-400'
      },
      rare: {
        bg: 'from-blue-50 to-blue-100',
        border: 'border-blue-300',
        icon: 'text-blue-600',
        title: 'text-blue-800',
        sparkle: 'text-blue-400'
      },
      epic: {
        bg: 'from-purple-50 to-purple-100',
        border: 'border-purple-300',
        icon: 'text-purple-600',
        title: 'text-purple-800',
        sparkle: 'text-purple-400'
      },
      legendary: {
        bg: 'from-yellow-50 to-orange-100',
        border: 'border-yellow-400',
        icon: 'text-orange-600',
        title: 'text-orange-800',
        sparkle: 'text-yellow-500'
      }
    };

    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getRarityLabel = (rarity: string) => {
    const labels = {
      common: '普通成就',
      rare: '稀有成就',
      epic: '史诗成就',
      legendary: '传说成就'
    };

    return labels[rarity as keyof typeof labels] || '成就';
  };

  const colors = getRarityColors(achievement.rarity);

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div
        className={`
          transform transition-all duration-300 ease-out
          ${isClosing ? 'translate-x-full opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'}
        `}
      >
        <div
          className={`
            bg-gradient-to-r ${colors.bg} border-2 ${colors.border}
            rounded-xl shadow-2xl p-4 backdrop-blur-sm
            relative overflow-hidden
          `}
          role="alert"
          aria-labelledby={`achievement-${achievement.id}-title`}
          aria-describedby={`achievement-${achievement.id}-description`}
        >
          {/* 装饰性闪光效果 */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-20">
            <Sparkles className={`w-full h-full ${colors.sparkle}`} />
          </div>

          {/* 关闭按钮 */}
          <button
            onClick={handleClose}
            className={`
              absolute top-2 right-2 p-1 rounded-full
              hover:bg-black hover:bg-opacity-10 transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
            aria-label="关闭成就通知"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>

          <div className="flex items-start gap-3">
            {/* 成就图标 */}
            <div
              className={`
                w-12 h-12 rounded-full flex items-center justify-center
                ${colors.bg} border-2 ${colors.border}
                flex-shrink-0
              `}
            >
              <Trophy className={`w-6 h-6 ${colors.icon}`} />
            </div>

            {/* 成就内容 */}
            <div className="flex-1 min-w-0">
              {/* 成就标题 */}
              <div className="flex items-center gap-2 mb-1">
                <h3
                  id={`achievement-${achievement.id}-title`}
                  className={`font-bold ${colors.title} text-sm`}
                >
                  {achievement.name}
                </h3>
                <span className={`
                  text-xs px-2 py-0.5 rounded-full font-medium
                  ${colors.bg} ${colors.icon}
                `}>
                  {getRarityLabel(achievement.rarity)}
                </span>
              </div>

              {/* 成就描述 */}
              <p
                id={`achievement-${achievement.id}-description`}
                className="text-sm text-gray-600 mb-2"
              >
                {achievement.description}
              </p>

              {/* 奖励信息 */}
              {achievement.reward && (
                <div className="flex items-center gap-2 text-xs">
                  {achievement.reward.points > 0 && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      +{achievement.reward.points} 积分
                    </span>
                  )}
                  {achievement.reward.title && (
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                      🏅 {achievement.reward.title}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 进度条（对于部分完成的成就） */}
          {achievement.progress < 100 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>进度</span>
                <span>{Math.round(achievement.progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${achievement.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 成就管理器 Hook
export const useAchievementNotifications = () => {
  const [notification, setNotification] = useState<Achievement | null>(null);

  const showAchievement = useCallback((achievement: Achievement) => {
    setNotification(achievement);
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const AchievementNotificationComponent = () => (
    <AchievementNotification
      achievement={notification}
      onClose={closeNotification}
    />
  );

  return {
    showAchievement,
    closeNotification,
    AchievementNotificationComponent
  };
};

export default memo(AchievementNotification);