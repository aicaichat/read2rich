import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, TestTube, Zap, Brain, CheckCircle, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import AISettingsModal from '@/components/AISettingsModal';

const TestAIPage: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TestTube className="w-8 h-8 text-emerald-400" />
              <h1 className="text-4xl font-bold text-white">AI 功能测试</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              测试 DeepNeed 的 AI 服务配置和功能
            </p>
          </div>

          {/* 功能卡片 */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* AI 设置卡片 */}
            <motion.div
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">AI 服务配置</h3>
              </div>
              <p className="text-gray-300 mb-4">
                配置 Claude、DeepSeek 等 AI 服务的 API 密钥和优先级设置
              </p>
              <Button
                onClick={() => setIsSettingsOpen(true)}
                className="w-full"
              >
                <Settings className="w-4 h-4 mr-2" />
                打开 AI 设置
              </Button>
            </motion.div>

            {/* API 状态卡片 */}
            <motion.div
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-semibold text-white">API 状态检查</h3>
              </div>
              <p className="text-gray-300 mb-4">
                检查各个 AI 服务的连接状态和可用性
              </p>
              <Button
                onClick={() => window.open('/api-status', '_blank')}
                variant="secondary"
                className="w-full"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                检查 API 状态
              </Button>
            </motion.div>
          </div>

          {/* 使用说明 */}
          <motion.div
            className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              配置说明
            </h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Claude API 密钥:</strong> 从 Anthropic 官网获取，格式为 sk-ant-api03-...
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>DeepSeek API 密钥:</strong> 从 DeepSeek 官网获取，格式为 sk-...
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>优先级设置:</strong> 数字越小优先级越高，系统会按优先级顺序尝试调用
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>故障转移:</strong> 当高优先级服务不可用时，自动切换到备用服务
                </div>
              </div>
            </div>
          </motion.div>

          {/* 安全提醒 */}
          <motion.div
            className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">安全提醒</span>
            </div>
            <p className="text-yellow-300 text-sm mt-1">
              API 密钥将安全存储在您的浏览器本地存储中，不会发送到服务器。请妥善保管您的 API 密钥。
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* AI 设置模态框 */}
      <AISettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default TestAIPage; 