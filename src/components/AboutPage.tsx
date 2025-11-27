import React, { useState } from 'react';
import { Info, Users, Code, Award, ArrowRight, X, Mail, Globe, Target, Clock } from 'lucide-react';

interface AboutPageProps {
  isVisible: boolean;
  onClose: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Info className="w-8 h-8 text-blue-600" />
            关于PathWordle
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close about page"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="prose prose prose-lg max-w-none">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
              <span className="text-4xl font-bold text-white">PW</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">PathWordle - 智能单词猜谜游戏</h1>
            <p className="text-lg text-gray-600 mb-6">
              一个创新路径构词游戏，挑战您的词汇推理能力和策略思维。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <Target className="w-6 h-6 text-green-600" />
                游戏特色
              </h3>
              <ul className="space-y-4 text-gray-700">
                  <li>🎯 <strong>路径构词系统</strong> - 创新的6x6网格单词游戏机制</li>
                  <li>🧠 <strong>智能提示系统</strong> - 根据您的猜测提供策略性指导</li>
                  <li>📊 <strong>学习分析</strong> - 详细的词汇学习和游戏统计</li>
                  <li>🏆 <strong>多语言支持</strong> - 支持多种语言的界面</li>
                  <li>⏱️ <strong>时间挑战模式</strong> - 限时竞技玩法</li>
                  <li>🎨 <strong>主题系统</strong> - 个性化游戏外观</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  开发团队
              </h3>
              <div className="space-y-4 text-gray-700">
                <p className="mb-4">
                  PathWordle由热爱文字游戏的开发团队精心打造。
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">🎨 技术栈</h4>
                    <p className="text-gray-600">
                      React + TypeScript
                    </p>
                    <p className="text-gray-600">
                      Vite + Tailwind CSS
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">🚀 快速迭代</h4>
                    <p className="text-gray-600">
                      敏捷开发和持续优化
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <Globe className="w-6 h-6 text-purple-600" />
                游戏愿景
              </h3>
              <p className="text-gray-600 mb-4">
                  我们致力于成为全球领先的文字游戏平台，为玩家提供最优质的游戏体验。
              </p>
              <ul className="space-y-4 text-gray-700">
                  <li>🎯 <strong>持续创新</strong> - 不断引入新玩法和功能</li>
                  <li>🌍 <strong>社区建设</strong> - 打造活跃的玩家社区</li>
                  <li>🏆 <strong>技术卓越</strong> - 追求技术极致和用户体验优化</li>
                  <li>📈 <strong>全球扩展</strong> - 支持多语言和多平台</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <Award className="w-6 h-6 text-yellow-600" />
                游戏统计
              </h3>
              <div className="space-y-4 text-gray-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-3xl font-bold text-blue-900">10K+</div>
                    <div className="text-gray-600 text-sm">日活跃用户</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-3xl font-bold text-green-900">50K+</div>
                    <div className="text-gray-600 text-sm">总游戏次数</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-3xl font-bold text-purple-900">1M+</div>
                    <div className="text-gray-600 text-sm">成功猜中率</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="text-3xl font-bold text-yellow-900">100K+</div>
                    <div className="text-gray-600 text-sm">完美游戏记录</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200">
              <div className="text-center text-gray-500 text-sm">
                <p className="mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  2025年11月首次发布
                </p>
                <div className="flex justify-center gap-3 mt-6">
                  <button
                    onClick={() => window.location.href = 'mailto:hello@pathwordle.com'}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    联系我们
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    关闭
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AboutPage;