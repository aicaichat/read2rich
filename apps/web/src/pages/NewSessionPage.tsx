import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lightbulb, MessageSquare } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

import { useAuth } from '../contexts/AuthContext';
import { unifiedSessionAPI } from '../lib/session-api';
import Button from '../components/ui/Button';
import { generateSessionTitle } from '../lib/utils';

const NewSessionPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [idea, setIdea] = useState('');
  const [title, setTitle] = useState('');
  
  // 从location state中获取初始想法
  useEffect(() => {
    console.log('NewSessionPage useEffect，location.state:', location.state);
    if (location.state?.initialIdea) {
      console.log('设置初始想法:', location.state.initialIdea);
      setIdea(location.state.initialIdea);
    }
  }, [location.state]);

  const createSessionMutation = useMutation({
    mutationFn: unifiedSessionAPI.createSession,
    onSuccess: (session) => {
      navigate(`/chat/${session.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    const sessionTitle = title.trim() || generateSessionTitle(idea);
    const sessionData = {
      title: sessionTitle,
      initial_idea: idea.trim(),
    };
    
    console.log('创建会话，数据:', sessionData);
    createSessionMutation.mutate(sessionData);
  };

  const exampleIdeas = [
    '我想做一个在线教育平台',
    '开发一个智能客服系统',
    '创建一个社交电商应用',
    '构建一个项目管理工具',
    '制作一个内容管理系统',
  ];

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen pt-20 pb-6">
      <div className="max-w-4xl mx-auto px-6">
        {/* 页面标题 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            开始新的需求分析
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            描述您的想法，我们的 AI 助手将通过多轮对话帮助您澄清和完善需求
          </p>
        </motion.div>

        {/* 来自首页的提示 */}
        {location.state?.initialIdea && (
          <motion.div
            className="max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm font-medium">已为您预填充项目想法</span>
              </div>
              <p className="text-gray-300 text-sm">
                您可以继续完善下面的描述，或者直接开始需求澄清对话
              </p>
            </div>
          </motion.div>
        )}

        {/* 主要表单 */}
        <motion.div
          className="card max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 项目标题 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                项目标题 (可选)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="为您的项目起个名字..."
              />
            </div>

            {/* 初始想法 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                您的想法 *
              </label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
                placeholder="请详细描述您的项目想法，包括目标、功能、用户群体等..."
                required
              />
              <p className="mt-2 text-sm text-gray-400">
                越详细的描述，AI 助手就能更好地帮助您澄清需求
              </p>
            </div>

            {/* 提交按钮 */}
            <Button
              type="submit"
              loading={createSessionMutation.isPending}
              disabled={!idea.trim()}
              variant="gradient"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              开始需求澄清
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </motion.div>

        {/* 示例想法 */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center justify-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              需要灵感？试试这些想法
            </h3>
            <p className="text-gray-400">
              点击下面的示例快速开始
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exampleIdeas.map((example, index) => (
              <motion.button
                key={index}
                onClick={() => setIdea(example)}
                className="p-4 bg-white/5 border border-white/10 rounded-lg text-left hover:bg-white/10 hover:border-primary-500/50 transition-all duration-200 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="text-white group-hover:text-primary-400 transition-colors">
                  {example}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 流程说明 */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/10 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            接下来会发生什么？
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: '多轮对话澄清',
                description: 'AI 助手会根据您的想法提出针对性问题，帮助您完善需求细节',
              },
              {
                step: '2',
                title: '生成专业提示词',
                description: '系统将对话内容转化为专业的代码生成提示词和项目管理提示词',
              },
              {
                step: '3',
                title: '输出完整方案',
                description: '使用 Claude 等 AI 模型生成完整的项目代码和开发计划',
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="text-lg font-medium text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-300 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewSessionPage; 