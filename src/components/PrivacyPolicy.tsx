import React, { useState } from 'react';
import { Shield, FileText, CheckCircle, ArrowRight, X, AlertTriangle } from 'lucide-react';

interface PrivacyPolicyProps {
  isVisible: boolean;
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            隐私政策
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close privacy policy"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="prose prose prose-lg max-w-none">
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                🔒 我们收集的信息
              </h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">游戏数据</h4>
                    <p className="text-gray-600">
                      我们收集的信息仅用于改善游戏体验和提供服务，包括：
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-6">
                      <li>游戏进度和统计数据</li>
                      <li>成就解锁记录</li>
                      <li>学习分析数据</li>
                      <li>错误日志和性能指标</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">不收集的信息</h4>
                    <p className="text-gray-600">
                      我们<strong>不会</strong>收集以下类型的个人信息：
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-6">
                      <li>姓名、地址、联系方式</li>
                      <li>生物识别数据</li>
                      <li>精确地理位置</li>
                      <li>财务或支付信息</li>
                      <li>社交媒体账户信息</li>
                      <li>政治观点或宗教信仰</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                📋 信息使用
              </h3>
              <div className="space-y-3 text-gray-700">
                <p className="mb-4">
                  我们使用收集的信息来：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-6">
                  <li>提供和改进游戏功能</li>
                  <li>个性化用户体验</li>
                  <li>生成游戏统计和分析</li>
                  <li>防止作弊和滥用</li>
                  <li>客户服务和技术支持</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                🔒 数据分享
              </h3>
              <div className="space-y-3 text-gray-700">
                <p className="mb-4">
                  我们可能会分享以下类型的数据：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-6">
                      <li><strong>匿名统计数据：</strong>整体游戏趋势和成就率</li>
                      <li><strong>聚合数据：</strong>不包含个人身份信息的人口统计数据</li>
                      <li><strong>研究数据：</strong>经过去身份化处理的游戏行为研究</li>
                    </ul>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                📞 数据存储与安全
              </h3>
              <div className="space-y-3 text-gray-700">
                <p className="mb-4">
                  我们采取以下措施保护您的数据：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-6">
                      <li><strong>数据加密：</strong>所有敏感数据传输使用SSL/TLS加密</li>
                      <li><strong>访问控制：</strong>严格限制对用户数据的访问权限</li>
                      <li><strong>定期备份：</strong>自动备份重要数据，防止意外丢失</li>
                      <li><strong>数据最小化：</strong>只收集必要的游戏功能数据</li>
                      <li><strong>安全审计：</strong>定期进行安全审计和漏洞扫描</li>
                    </ul>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                🕒 您的权利
              </h3>
              <div className="space-y-3 text-gray-700">
                <p className="mb-4">
                  作为PathWordle用户，您享有以下权利：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-6">
                      <li><strong>访问权：</strong>随时访问、更正或删除您的个人数据</li>
                      <li><strong>知情权：</strong>了解我们收集、使用和分享您的数据的方式</li>
                      <li><strong>限制权：</strong>限制我们处理和使用您数据的方式和范围</li>
                      <li><strong>投诉权：</strong>向相关监管机构投诉我们的数据处理行为</li>
                      <li><strong>数据可携权：</strong>以结构化格式导出您的个人数据</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200">
              <div className="text-center text-gray-500 text-sm">
                <p className="mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  本隐私政策自2025年11月20日起生效
                </p>
                <p>
                  如对本政策有任何疑问，请联系我们的客服团队。
                </p>
                <div className="flex justify-center gap-3 mt-6">
                  <button
                    onClick={() => window.location.href = 'mailto:privacy@pathwordle.com'}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    联系客服
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
    </div>
  );
};

export default PrivacyPolicy;