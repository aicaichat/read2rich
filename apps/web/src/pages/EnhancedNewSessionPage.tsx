import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Lightbulb, 
  MessageSquare, 
  Target, 
  Users, 
  Code, 
  DollarSign, 
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

import { useAuth } from '../contexts/AuthContext';
import { unifiedSessionAPI } from '../lib/session-api';
import Button from '../components/ui/Button';
import { generateSessionTitle } from '../lib/utils';

interface RequirementField {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  placeholder: string;
  optional?: boolean;
  keywords: string[];
}

const REQUIREMENT_FIELDS: RequirementField[] = [
  {
    id: 'goal',
    label: '项目目标',
    icon: Target,
    placeholder: '您想要解决什么问题？实现什么目标？',
    keywords: ['目标', '解决', '实现', '问题', '需求']
  },
  {
    id: 'users',
    label: '目标用户',
    icon: Users,
    placeholder: '谁会使用这个产品？用户画像是什么？',
    optional: true,
    keywords: ['用户', '客户', '人群', '年龄', '职业']
  },
  {
    id: 'tech',
    label: '技术偏好',
    icon: Code,
    placeholder: '您希望使用什么技术栈？有什么技术要求？',
    optional: true,
    keywords: ['技术', 'react', 'vue', 'java', 'python', '框架']
  },
  {
    id: 'budget',
    label: '预算范围',
    icon: DollarSign,
    placeholder: '项目的预算大概是多少？',
    optional: true,
    keywords: ['预算', '成本', '价格', '费用', '投资']
  },
  {
    id: 'timeline',
    label: '时间计划',
    icon: Clock,
    placeholder: '希望什么时候完成？项目周期是多久？',
    optional: true,
    keywords: ['时间', '周期', '计划', '上线', '发布']
  }
];

const EnhancedNewSessionPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState<Record<string, string>>({
    goal: '',
    users: '',
    tech: '',
    budget: '',
    timeline: ''
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // 从location state中获取初始想法
  useEffect(() => {
    if (location.state?.initialIdea) {
      setFields(prev => ({ ...prev, goal: location.state.initialIdea }));
      setIsExpanded(true);
    }
  }, [location.state]);

  // 计算完整度
  const completeness = useMemo(() => {
    const allText = Object.values(fields).join(' ').toLowerCase();
    let score = 0;
    
    REQUIREMENT_FIELDS.forEach(field => {
      const fieldValue = fields[field.id];
      if (fieldValue.trim()) {
        // 基础分数
        score += field.optional ? 10 : 20;
        
        // 关键词匹配奖励
        const matches = field.keywords.filter(keyword => 
          allText.includes(keyword.toLowerCase())
        ).length;
        score += matches * 2;
        
        // 长度奖励
        if (fieldValue.length > 20) score += 5;
        if (fieldValue.length > 50) score += 5;
      }
    });
    
    return Math.min(100, score);
  }, [fields]);

  // 生成建议
  const getSuggestion = () => {
    if (completeness < 30) {
      return {
        type: 'info',
        text: '简单描述您的想法就可以开始了',
        detail: '我们会在对话中逐步完善细节'
      };
    } else if (completeness < 60) {
      return {
        type: 'good',
        text: '信息不错！可以开始深度对话了',
        detail: '已有足够信息开始专业的需求澄清'
      };
    } else {
      return {
        type: 'excellent',
        text: '信息非常详细！将获得最佳体验',
        detail: 'AI能更精准地理解需求并提供专业建议'
      };
    }
  };

  const suggestion = getSuggestion();

  const createSessionMutation = useMutation({
    mutationFn: unifiedSessionAPI.createSession,
    onSuccess: (session) => {
      navigate(`/chat/${session.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 组合所有信息
    const allInfo = Object.entries(fields)
      .filter(([_, value]) => value.trim())
      .map(([key, value]) => {
        const field = REQUIREMENT_FIELDS.find(f => f.id === key);
        return `${field?.label}: ${value}`;
      })
      .join('\n\n');

    if (!allInfo.trim()) return;

    const sessionTitle = title.trim() || generateSessionTitle(fields.goal || '新项目');
    const sessionData = {
      title: sessionTitle,
      initial_idea: allInfo,
    };
    
    createSessionMutation.mutate(sessionData);
  };

  const exampleProjects = [
    {
      title: '在线教育平台',
      goal: '创建一个面向职场人士的在线技能学习平台',
      users: '25-40岁的职场人士，希望提升技能',
      tech: 'React + Node.js，支持视频播放和在线考试',
      icon: '📚'
    },
    {
      title: '智能客服系统',
      goal: '开发基于AI的智能客服，提升用户体验',
      users: '电商平台的客户，需要快速解决问题',
      tech: 'Python + 自然语言处理，集成现有CRM',
      icon: '🤖'
    },
    {
      title: '项目管理工具',
      goal: '构建适合小团队的轻量级项目管理平台',
      users: '10-50人的创业团队和中小企业',
      tech: 'Vue.js + Express，注重简洁易用',
      icon: '📊'
    }
  ];

  // 未登录时跳转登录（使用副作用，避免渲染期导航导致空白）
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-300">正在加载...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pt-20 pb-6">
      <div className="max-w-5xl mx-auto px-6">
        {/* 智能标题区 */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold text-white">
              AI 需求分析
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            通过智能对话，30分钟内将您的想法转化为专业的技术方案
          </p>
        </motion.div>

        {/* 来自首页的提示 */}
        <AnimatePresence>
          {location.state?.initialIdea && (
            <motion.div
              className="max-w-3xl mx-auto mb-6"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">已为您预填充项目想法</span>
                </div>
                <p className="text-gray-300 text-sm">
                  您可以继续完善下面的信息，或者直接开始需求澄清对话
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主表单 */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder="为您的项目起个响亮的名字..."
                  />
                </div>

                {/* 动态字段 */}
                <div className="space-y-4">
                  {REQUIREMENT_FIELDS.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                          <field.icon className="w-4 h-4" />
                          {field.label}
                          {field.optional && (
                            <span className="text-xs text-gray-500">(可选)</span>
                          )}
                        </div>
                      </label>
                      <textarea
                        value={fields[field.id]}
                        onChange={(e) => setFields(prev => ({
                          ...prev,
                          [field.id]: e.target.value
                        }))}
                        rows={field.id === 'goal' ? 4 : 2}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none transition-all"
                        placeholder={field.placeholder}
                        required={!field.optional}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* 智能提交按钮 */}
                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    loading={createSessionMutation.isPending}
                    disabled={!fields.goal.trim()}
                    variant={completeness > 60 ? 'gradient' : 'primary'}
                    size="lg"
                    className="w-full flex items-center justify-center gap-2 py-4"
                  >
                    <MessageSquare className="w-5 h-5" />
                    {completeness > 60 ? '开始专业需求分析' : '开始需求澄清对话'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* 侧边栏：进度和建议 */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* 完整度指示器 */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                信息完整度
              </h3>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">当前进度</span>
                  <span className="text-white font-bold">{completeness}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      completeness > 60 ? 'bg-gradient-to-r from-emerald-400 to-blue-400' :
                      completeness > 30 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                      'bg-gradient-to-r from-gray-400 to-gray-500'
                    }`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${completeness}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>

              <div className={`p-3 rounded-xl border ${
                suggestion.type === 'excellent' ? 'bg-emerald-500/10 border-emerald-500/20' :
                suggestion.type === 'good' ? 'bg-blue-500/10 border-blue-500/20' :
                'bg-gray-500/10 border-gray-500/20'
              }`}>
                <div className="flex items-start gap-2">
                  {suggestion.type === 'excellent' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                  ) : suggestion.type === 'good' ? (
                    <Zap className="w-4 h-4 text-blue-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                  )}
                  <div>
                    <p className="text-white text-sm font-medium">{suggestion.text}</p>
                    <p className="text-gray-400 text-xs mt-1">{suggestion.detail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 预期收益 */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                您将获得
              </h3>
              <ul className="space-y-3">
                {[
                  '专业的技术架构方案',
                  '详细的功能需求文档',
                  '项目开发时间计划',
                  '技术选型建议',
                  '可直接使用的AI提示词'
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center gap-2 text-gray-300"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* 示例项目 */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-white mb-2 flex items-center justify-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              需要灵感？参考这些成功案例
            </h3>
            <p className="text-gray-400">
              点击快速填充项目信息
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {exampleProjects.map((project, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setFields({
                    goal: project.goal,
                    users: project.users,
                    tech: project.tech,
                    budget: '',
                    timeline: ''
                  });
                  setTitle(project.title);
                }}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-300 group"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <div className="text-3xl mb-3">{project.icon}</div>
                <h4 className="text-white font-semibold mb-2 group-hover:text-emerald-400 transition-colors">
                  {project.title}
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {project.goal}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedNewSessionPage; 