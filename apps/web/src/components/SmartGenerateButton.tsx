import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Button from './ui/Button';
import type { Message } from '@/types';

interface SmartGenerateButtonProps {
  messages: Message[];
  session: any;
  onGenerate: () => void;
  isGenerating: boolean;
}

// 计算需求完整度
const calculateRequirementCompleteness = (messages: Message[]): number => {
  if (messages.length < 2) return 0;
  
  const allContent = messages.map(m => m.content).join(' ').toLowerCase();
  
  const factors = [
    { keywords: ['目标', '想做', '希望', '实现', '解决'], weight: 0.2 },
    { keywords: ['用户', '客户', '人群', '年龄', '职业'], weight: 0.15 },
    { keywords: ['技术', 'react', 'vue', 'java', 'python', '框架'], weight: 0.15 },
    { keywords: ['功能', '特性', '模块', '页面', '界面'], weight: 0.2 },
    { keywords: ['预算', '成本', '价格', '费用', '投资'], weight: 0.1 },
    { keywords: ['时间', '周期', '计划', '阶段', '上线'], weight: 0.1 },
    { keywords: ['数据', '存储', '安全', '性能'], weight: 0.1 }
  ];
  
  let totalScore = 0;
  factors.forEach(factor => {
    const matches = factor.keywords.filter(keyword => allContent.includes(keyword)).length;
    const score = Math.min(1, matches / factor.keywords.length);
    totalScore += score * factor.weight;
  });
  
  // 加上消息长度奖励
  const lengthBonus = Math.min(0.3, messages.length * 0.05);
  
  return Math.min(100, (totalScore + lengthBonus) * 100);
};

// 生成建议文本
const getGenerationSuggestion = (completeness: number, messageCount: number) => {
  if (completeness < 30) {
    return {
      type: 'warning',
      text: '建议再聊几个问题，让需求更加完善',
      detail: '当前信息还不够详细，生成的提示词可能不够准确'
    };
  } else if (completeness < 60) {
    return {
      type: 'caution',
      text: '可以生成初步方案，但建议继续完善',
      detail: '已有基础信息，可生成初步方案，后续可优化'
    };
  } else if (completeness < 80) {
    return {
      type: 'good',
      text: '信息较为完整，可以生成专业提示词',
      detail: '需求信息比较详细，能生成高质量的专业方案'
    };
  } else {
    return {
      type: 'excellent',
      text: '需求信息非常完整！生成最佳方案',
      detail: '信息非常详细，将生成最专业的技术方案'
    };
  }
};

const SmartGenerateButton: React.FC<SmartGenerateButtonProps> = ({
  messages,
  session,
  onGenerate,
  isGenerating
}) => {
  const completeness = useMemo(() => calculateRequirementCompleteness(messages), [messages]);
  const suggestion = useMemo(() => getGenerationSuggestion(completeness, messages.length), [completeness, messages.length]);

  // 至少需要2条消息才显示按钮
  if (messages.length < 2) {
    return null;
  }

  const getButtonVariant = () => {
    if (suggestion.type === 'excellent') return 'gradient';
    if (suggestion.type === 'good') return 'primary';
    return 'secondary';
  };

  const getStatusIcon = () => {
    switch (suggestion.type) {
      case 'excellent':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'good':
        return <Sparkles className="w-4 h-4 text-blue-400" />;
      case 'caution':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-orange-400" />;
    }
  };

  const getProgressColor = () => {
    if (completeness >= 80) return 'bg-emerald-400';
    if (completeness >= 60) return 'bg-blue-400';
    if (completeness >= 30) return 'bg-yellow-400';
    return 'bg-orange-400';
  };

  return (
    <motion.div 
      className="mt-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* 完整度指示器 */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-white font-medium text-sm">需求完整度</span>
          </div>
          <span className="text-white font-bold">{Math.round(completeness)}%</span>
        </div>
        
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
          <motion.div
            className={`h-full ${getProgressColor()} rounded-full`}
            initial={{ width: '0%' }}
            animate={{ width: `${completeness}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        
        <div className="text-center">
          <p className="text-gray-300 text-sm font-medium">{suggestion.text}</p>
          <p className="text-gray-500 text-xs mt-1">{suggestion.detail}</p>
        </div>
      </div>

      {/* 生成按钮 */}
      <div className="flex justify-center">
        <Button
          onClick={onGenerate}
          loading={isGenerating}
          variant={getButtonVariant()}
          size="lg"
          className="flex items-center gap-2 px-8 py-4 text-lg font-semibold"
          disabled={completeness < 20}
        >
          <Sparkles className="w-5 h-5" />
          {completeness >= 80 ? '生成专业提示词' : 
           completeness >= 60 ? '生成初步方案' : 
           completeness >= 30 ? '生成基础方案' : '继续完善需求'}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* 提示信息 */}
      {completeness < 60 && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-gray-400 text-xs">
            💡 继续与AI对话，完善更多细节，可获得更专业的方案
          </p>
        </motion.div>
      )}

      {completeness >= 80 && (
        <motion.div
          className="text-center bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-emerald-400 text-sm font-medium">
            🎉 太棒了！您的需求已经非常详细，可以生成高质量的专业方案了！
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SmartGenerateButton; 