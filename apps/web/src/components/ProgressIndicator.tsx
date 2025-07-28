import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Target, Users, Code, Clock, DollarSign } from 'lucide-react';
import type { Message } from '@/types';

interface RequirementProgress {
  projectGoal: number;     // 项目目标完整度 0-100
  targetUsers: number;     // 目标用户完整度 0-100
  techStack: number;       // 技术栈完整度 0-100
  budget: number;          // 预算信息完整度 0-100
  timeline: number;        // 时间计划完整度 0-100
  features: number;        // 功能需求完整度 0-100
}

interface ProgressIndicatorProps {
  messages: Message[];
  session: any;
}

// 分析消息内容，计算各维度的完整度
const analyzeRequirements = (messages: Message[]): RequirementProgress => {
  const allContent = messages.map(m => m.content).join(' ').toLowerCase();
  
  const projectGoalKeywords = ['目标', '想做', '希望', '实现', '解决', '帮助', '提供'];
  const targetUsersKeywords = ['用户', '客户', '人群', '年龄', '职业', '需求'];
  const techStackKeywords = ['技术', 'react', 'vue', 'java', 'python', '框架', '数据库', '架构'];
  const budgetKeywords = ['预算', '成本', '价格', '费用', '投资', '资金', '万元'];
  const timelineKeywords = ['时间', '周期', '计划', '阶段', '上线', '发布', '月'];
  const featuresKeywords = ['功能', '特性', '模块', '页面', '界面', '操作', '流程'];

  const calculateScore = (keywords: string[]): number => {
    const matches = keywords.filter(keyword => allContent.includes(keyword)).length;
    return Math.min(100, (matches / keywords.length) * 100 + Math.random() * 20);
  };

  return {
    projectGoal: calculateScore(projectGoalKeywords),
    targetUsers: calculateScore(targetUsersKeywords),
    techStack: calculateScore(techStackKeywords),
    budget: calculateScore(budgetKeywords),
    timeline: calculateScore(timelineKeywords),
    features: calculateScore(featuresKeywords)
  };
};

// 计算整体进度
const calculateOverallProgress = (progress: RequirementProgress): number => {
  const values = Object.values(progress);
  return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
};

// 生成下一步建议
const getNextSuggestion = (progress: RequirementProgress, messages: Message[]): string => {
  const suggestions = [
    { key: 'projectGoal', text: '请详细描述您的项目目标和要解决的问题', score: progress.projectGoal },
    { key: 'targetUsers', text: '请描述您的目标用户群体特征', score: progress.targetUsers },
    { key: 'techStack', text: '请说明您偏好的技术栈或技术要求', score: progress.techStack },
    { key: 'budget', text: '请告诉我您的项目预算范围', score: progress.budget },
    { key: 'timeline', text: '请分享您的项目时间计划', score: progress.timeline },
    { key: 'features', text: '请详细说明您需要的核心功能', score: progress.features }
  ];

  // 找到得分最低的维度
  const lowestScore = suggestions.sort((a, b) => a.score - b.score)[0];
  
  if (lowestScore.score < 30) {
    return lowestScore.text;
  }
  
  const overall = calculateOverallProgress(progress);
  if (overall < 60) {
    return '继续完善需求细节，我们已经完成了' + overall + '%';
  } else if (overall < 80) {
    return '需求信息很丰富！再聊1-2个问题就可以生成专业提示词了';
  } else {
    return '🎉 需求信息已经很完整了！可以生成专业提示词了';
  }
};

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ messages, session }) => {
  const progress = useMemo(() => analyzeRequirements(messages), [messages]);
  const overall = useMemo(() => calculateOverallProgress(progress), [progress]);
  const suggestion = useMemo(() => getNextSuggestion(progress, messages), [progress, messages]);

  const requirements = [
    { key: 'projectGoal', label: '项目目标', icon: Target, score: progress.projectGoal },
    { key: 'targetUsers', label: '目标用户', icon: Users, score: progress.targetUsers },
    { key: 'techStack', label: '技术栈', icon: Code, score: progress.techStack },
    { key: 'budget', label: '预算范围', icon: DollarSign, score: progress.budget },
    { key: 'timeline', label: '时间计划', icon: Clock, score: progress.timeline },
    { key: 'features', label: '功能需求', icon: Target, score: progress.features }
  ];

  return (
    <motion.div 
      className="progress-indicator bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* 整体进度条 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium">需求澄清进度</span>
          <span className="text-emerald-400 font-bold text-lg">{overall}%</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${overall}%` }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>

      {/* 详细维度 */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {requirements.map((req) => (
          <div key={req.key} className="flex items-center gap-2 text-sm">
            <req.icon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 flex-1 truncate">{req.label}</span>
            <div className={`w-2 h-2 rounded-full ${
              req.score > 70 ? 'bg-emerald-400' : 
              req.score > 40 ? 'bg-yellow-400' : 'bg-gray-500'
            }`} />
          </div>
        ))}
      </div>

      {/* 智能建议 */}
      <motion.div 
        className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-gray-300 text-sm leading-relaxed">{suggestion}</p>
          {overall >= 75 && (
            <motion.div
              className="mt-2 text-emerald-400 text-xs font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              ✨ 可以生成专业提示词了！
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProgressIndicator; 