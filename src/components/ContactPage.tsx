import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, X, Users, AlertTriangle } from 'lucide-react';

interface ContactPageProps {
  isVisible: boolean;
  onClose: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'technical'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 这里只是演示，实际应该发送到后端
    console.log('Contact form submitted:', formData);

    // 显示成功消息
    alert('感谢您的留言！我们会尽快回复您。');

    // 重置表单
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'technical'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            联系我们
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close contact page"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="prose prose prose-lg max-w-none">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-6">
              <Mail className="w-10 h-10 text-white" />
              <span className="text-3xl font-bold text-white">PW</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">PathWordle</h1>
            <p className="text-lg text-gray-600 mb-6">
              我们重视您的反馈和建议，这是不断改进游戏的重要动力。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <Phone className="w-6 h-6 text-green-600" />
                联系方式
              </h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 rounded-lg p-4 text-center">
                    <Mail className="w-8 h-8 text-white mb-2" />
                    <div className="text-lg font-semibold text-green-900">客服邮箱</div>
                    <div className="text-gray-600">support@pathwordle.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 rounded-lg p-4 text-center">
                    <Users className="w-8 h-8 text-white mb-2" />
                    <div className="text-lg font-semibold text-blue-900">用户社区</div>
                    <div className="text-gray-600 text-sm">论坛和讨论区</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 rounded-lg p-4 text-center">
                    <MapPin className="w-8 h-8 text-white mb-2" />
                    <div className="text-lg font-semibold text-purple-900">技术支持</div>
                    <div className="text-gray-600 text-sm">常见问题解答</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <Send className="w-6 h-6 text-orange-600" />
                响应时间
              </h3>
              <div className="space-y-4 text-gray-700">
                <p className="mb-4">
                  我们致力于为用户提供快速、专业的客服支持。
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-6">
                  <li><strong>邮件响应：</strong>24小时内回复您的问题</li>
                  <li><strong>在线客服：</strong>工作日提供即时帮助</li>
                  <li><strong>社区支持：</strong>玩家互助解决问题</li>
                  <li><strong>定期更新：</strong>持续改进游戏功能和修复问题</li>
                </ul>
              </div>
            </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                常见问题
              </h3>
              <div className="space-y-4 text-gray-700">
                <p className="mb-4">
                  在联系我们的客服之前，建议您先查看以下常见问题解答：
                </p>
                <ul className="space-y-2 text-gray-600 ml-6">
                  <li><strong>游戏无法开始：</strong>请检查网络连接和浏览器兼容性</li>
                  <li><strong>按钮不响应：</strong>请尝试刷新页面或清理浏览器缓存</li>
                  <li><strong>无法找到目标单词：</strong>请检查游戏模式是否为每日模式</li>
                  <li><strong>统计数据丢失：</strong>数据可能因浏览器清理而重置</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                提交反馈
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">姓名</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="请输入您的姓名"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">邮箱</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">主题</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">请选择主题</option>
                    <option value="技术问题">技术问题</option>
                    <option value="功能建议">功能建议</option>
                    <option value="内容反馈">内容反馈</option>
                    <option value="合作咨询">合作咨询</option>
                    <option value="其他">其他</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">消息内容</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={6}
                    placeholder="请详细描述您的问题或建议..."
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">问题类别</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="technical">技术问题</option>
                    <option value="gameplay">游戏玩法</option>
                    <option value="feature">功能请求</option>
                    <option value="bug">错误报告</option>
                    <option value="other">其他</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    提交反馈
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({
                      name: '',
                      email: '',
                      subject: '',
                      message: '',
                      category: 'technical'
                    })}
                    className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    重置
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200">
              <div className="text-center text-gray-500 text-sm">
                <p className="mb-2">
                  我们通常在1-2个工作日内回复您的消息。
                </p>
                <div className="flex justify-center gap-3 mt-6">
                  <button
                    onClick={() => window.location.href = 'mailto:support@pathwordle.com'}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    直接发送邮件
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

export default ContactPage;