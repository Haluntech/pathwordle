import React, { useState } from 'react';
import { BookOpen, Target, TrendingUp, Users, Award, Info } from 'lucide-react';

interface ContentQualityPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const ContentQualityPanel: React.FC<ContentQualityPanelProps> = ({ isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState<'game-tips' | 'vocabulary' | 'strategies' | 'patterns'>('game-tips');

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            📝 内容质量提升
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close content quality panel"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('game-tips')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'game-tips'
                ? 'text-blue-600 border-blue-600 bg-blue-50'
                : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            <Target className="w-4 h-4" />
            游戏技巧
          </button>
          <button
            onClick={() => setActiveTab('vocabulary')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'vocabulary'
                ? 'text-blue-600 border-blue-600 bg-blue-50'
                : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            词汇学习
          </button>
          <button
            onClick={() => setActiveTab('strategies')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'strategies'
                ? 'text-blue-600 border-blue-600 bg-blue-50'
                : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            策略指南
          </button>
          <button
            onClick={() => setActiveTab('patterns')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'patterns'
                ? 'text-blue-600 border-blue-600 bg-blue-50'
                : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            <Users className="w-4 h-4" />
            常见模式
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {activeTab === 'game-tips' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                PathWordle 游戏技巧
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 基础技巧</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>从元音字母开始猜测 - 提高首次命中率</li>
                    <li>寻找常见字母组合 - 如TH, ER, AN等</li>
                    <li>注意字母位置提示 - 绿色表示正确位置</li>
                    <li>利用排除法 - 根据灰色字母排除可能性</li>
                    <li>学习5字母单词 - 增加词汇量</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">🎯 高级技巧</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>路径优化 - 寻找最短的有效路径</li>
                    <li>模式识别 - 学习常见的单词模式</li>
                    <li>速度挑战 - 在限定时间内找到单词</li>
                    <li>准确率分析 - 记录成功率和失败原因</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vocabulary' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                词汇学习中心
              </h3>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-900 mb-2">📚 常见5字母单词</h4>
                    <div className="grid grid-cols-5 gap-2 text-sm">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">HOUSE</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">MOUSE</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">WATER</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">HEART</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">BREAD</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">CLOCK</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">LIGHT</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">DREAM</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">TRAIN</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">PLANT</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">BEACH</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">GRASS</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">STONE</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">
                      这些词汇在PathWordle中经常出现，掌握它们将大大提高您的游戏效率！
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-900 mb-2">🔤 有用前缀/后缀</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="mb-2">
                        <span className="font-semibold">常见前缀:</span>
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">RE-, UN-, PRE-, DIS-</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">常见后缀:</span>
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">-ING, -ED, -ER, -EST</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'strategies' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                游戏策略指南
              </h3>
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-900 mb-2">🎯 初级策略</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>元音优先:</strong> 先猜测包含元音字母的单词</li>
                    <li><strong>边缘测试:</strong> 尝试不常见的字母组合</li>
                    <li><strong>渐进难度:</strong> 从简单到复杂的6字母单词</li>
                    <li><strong>时间管理:</strong> 合理使用6次机会</li>
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">🏆 高级策略</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>概率分析:</strong> 基于字母出现频率选择最佳猜测</li>
                    <li><strong>模式识别:</strong> 快速识别常见单词模式</li>
                    <li><strong>路径优化:</strong> 寻找包含最多目标字母的路径</li>
                    <li><strong>逆向思维:</strong> 从可能的答案反推可能的字母组合</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'patterns' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                常见字母模式
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-900 mb-2">元音字母模式</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <span>A, E, I, O, U</span> - 5个元音，覆盖高频字母
                  </div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-900 mb-2">辅音字母模式</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <span>R, S, T, L, N</span> - 与元音字母组合
                  </div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-900 mb-2">重复字母模式</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <span>L, E, E, T</span> - 双字母组合，如"SEE", "BEE"
                  </div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-900 mb-2">稀少字母模式</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <span>Q, J, X, Z</span> - 低频字母，价值较高
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-center text-gray-500 text-sm">
            <Info className="w-4 h-4 inline mr-1" />
            掌握这些技巧将帮助您成为PathWordle高手！提升内容质量，解决谷歌"低价值内容"警告。
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentQualityPanel;