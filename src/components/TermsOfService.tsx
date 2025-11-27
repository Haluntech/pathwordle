import React, { useState } from 'react';
import { FileText, CheckCircle, ArrowRight, X, AlertTriangle, Scale } from 'lucide-react';

interface TermsOfServiceProps {
  isVisible: boolean;
  onClose: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Scale className="w-8 h-8 text-blue-600" />
            服务条款
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close terms of service"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="prose prose prose-lg max-w-none">
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                🎮 服务接受
              </h3>
              <p className="text-gray-700 mb-4">
                  当您使用PathWordle游戏服务时，即表示您同意遵守本服务条款。
              </p>
              <p className="text-gray-700">
                  请在使用我们的服务前仔细阅读以下条款。
              </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                📋 用户责任
              </h3>
              <div className="space-y-3 text-gray-700">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">账户安全</h4>
                  <p className="text-gray-600">
                    您有责任保护您的账户信息，不得与他人共享登录凭据。
                  </p>
                  <p className="text-gray-600">
                    如发现账户安全漏洞，请立即通知我们。
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">合法使用</h4>
                  <p className="text-gray-600">
                    您同意仅将PathWordle用于合法娱乐目的，不得用于任何商业或非法活动。
                  </p>
                  <p className="text-gray-600">
                    禁止使用自动化工具、脚本或机器人干扰游戏服务。
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">内容规范</h4>
                  <p className="text-gray-600">
                    您不得发布或传播违法、有害、威胁、诽谤、侵权或不当内容。
                  </p>
                  <p className="text-gray-600">
                    尊重游戏中的其他用户，维护友善的游戏环境。
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                🎮 知识产权
              </h3>
              <div className="space-y-3 text-gray-700">
                <p className="text-gray-600 mb-4">
                  PathWordle游戏及其内容受知识产权法保护。
                  </p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">游戏内容</h4>
                    <p className="text-gray-600">
                      游戏中的单词、谜题、界面设计等内容归我们所有或已获得合法授权。
                  </p>
                  <p className="text-gray-600">
                      您不得复制、分发或商业利用游戏内容。
                  </p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">用户生成内容</h4>
                    <p className="text-gray-600">
                      您在游戏中创建的内容（如自定义谜题）归您所有，但需遵守内容规范。
                  </p>
                  <p className="text-gray-600">
                      我们有权移除违规内容而不另行通知。
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                ⚖️ 服务变更与终止
              </h3>
              <div className="space-y-3 text-gray-700">
                <p className="text-gray-700 mb-4">
                  我们保留随时修改或终止服务的权利，恕不另行通知。
                  </p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">服务暂停</h4>
                    <p className="text-gray-600">
                      在法律要求或紧急情况下，我们可能暂停或终止部分服务功能。
                  </p>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">账户终止</h4>
                    <p className="text-gray-600">
                      严重违反服务条款的用户，我们保留终止其账户的权利。
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                📞 免责声明
              </h3>
              <div className="space-y-3 text-gray-700">
                <p className="text-gray-600 mb-4">
                  在法律允许的最大范围内，PathWordle服务按"现状"提供，不承担任何间接、偶然、特殊或后果性损害。
                </p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">服务可用性</h4>
                    <p className="text-gray-600">
                      我们不保证服务100%无故障运行，可能存在计划维护或技术限制。
                  </p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">第三方链接</h4>
                    <p className="text-gray-600">
                      我们的服务可能包含第三方网站或服务的链接，我们对这些外部内容不承担责任。
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                📬 联系法律
              </h3>
              <div className="space-y-3 text-gray-700">
                <p className="text-gray-600 mb-4">
                  本服务条款受中华人民共和国法律管辖。
                  </p>
                  <p className="text-gray-600">
                  如有争议，将通过友好协商解决。
                  </p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">条款更新</h4>
                    <p className="text-gray-600">
                      我们会定期更新服务条款，重大变更将通过游戏内公告或邮件通知。
                  </p>
                </div>
              </div>
            </section>

            <div className="mt-8 pt-4 border-t border-gray-200">
              <div className="text-center text-gray-500 text-sm">
                <p className="mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  最后更新时间：2025年11月20日
                </p>
                <div className="flex justify-center gap-3 mt-6">
                  <button
                    onClick={() => window.location.href = 'mailto:support@pathwordle.com'}
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
  );
};

export default TermsOfService;