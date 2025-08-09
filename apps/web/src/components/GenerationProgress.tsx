import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, Zap, Brain, FileText, Rocket } from 'lucide-react';

interface GenerationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  icon: React.ComponentType<any>;
  duration: number; // 预计持续时间（毫秒）
}

interface GenerationProgressProps {
  isVisible: boolean;
  onComplete: () => void;
  onError: (error: string) => void;
}

const GENERATION_STEPS: GenerationStep[] = [
  {
    id: 'analyze',
    name: '分析项目需求',
    description: '深度分析您的需求和对话内容',
    status: 'pending',
    icon: Brain,
    duration: 2000
  },
  {
    id: 'match',
    name: '匹配最佳模板',
    description: '从专业模板库中找到最适合的模板',
    status: 'pending',
    icon: Zap,
    duration: 1500
  },
  {
    id: 'generate',
    name: '生成技术方案',
    description: '基于AI生成详细的技术实现方案',
    status: 'pending',
    icon: FileText,
    duration: 3000
  },
  {
    id: 'optimize',
    name: '优化商业建议',
    description: '完善商业模式和市场策略建议',
    status: 'pending',
    icon: Rocket,
    duration: 2500
  },
  {
    id: 'finalize',
    name: '生成实施计划',
    description: '制定详细的项目实施计划和时间安排',
    status: 'pending',
    icon: CheckCircle,
    duration: 2000
  }
];

const GenerationProgress: React.FC<GenerationProgressProps> = ({ 
  isVisible, 
  onComplete, 
  onError 
}) => {
  const [steps, setSteps] = useState<GenerationStep[]>(GENERATION_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [totalDuration, setTotalDuration] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // 计算总持续时间
  useEffect(() => {
    const total = GENERATION_STEPS.reduce((sum, step) => sum + step.duration, 0);
    setTotalDuration(total);
  }, []);

  // 模拟步骤执行（避免依赖 steps 导致的无限循环）
  useEffect(() => {
    if (!isVisible) return;

    let cancelled = false;

    const executeStep = async (index: number) => {
      if (cancelled) return;

      if (index >= GENERATION_STEPS.length) {
        onComplete();
        return;
      }

      // 更新当前步骤为处理中
      setSteps(prev => prev.map((step, i) => ({
        ...step,
        status: i === index ? 'processing' : (i < index ? 'completed' : 'pending')
      })));

      const duration = GENERATION_STEPS[index].duration;

      // 模拟处理时间
      await new Promise(resolve => {
        const timer = setTimeout(resolve, duration);
        
        // 更新已用时间
        const interval = setInterval(() => {
          setElapsedTime(prev => prev + 100);
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
        }, duration);
      });

      if (cancelled) return;

      // 标记步骤为完成
      setSteps(prev => prev.map((step, i) => ({
        ...step,
        status: i === index ? 'completed' : step.status
      })));

      // 继续下一步
      setCurrentStepIndex(index + 1);
    };

    if (currentStepIndex === -1) {
      setCurrentStepIndex(0);
    } else if (currentStepIndex < GENERATION_STEPS.length) {
      executeStep(currentStepIndex);
    }

    return () => {
      cancelled = true;
    };
  }, [isVisible, currentStepIndex, onComplete]);

  // 计算整体进度
  const overallProgress = Math.min(100, (elapsedTime / totalDuration) * 100);
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const estimatedRemaining = Math.max(0, Math.round((totalDuration - elapsedTime) / 1000));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-2xl p-8 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            {/* 标题和整体进度 */}
            <div className="text-center mb-8">
              <motion.h2 
                className="text-2xl font-bold text-white mb-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                🎯 正在生成专业提示词
              </motion.h2>
              
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                  <span>整体进度</span>
                  <span>{Math.round(overallProgress)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 to-blue-400"
                    initial={{ width: '0%' }}
                    animate={{ width: `${overallProgress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
              </div>

              <motion.p 
                className="text-gray-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                已完成 {completedSteps}/{steps.length} 个步骤
                {estimatedRemaining > 0 && (
                  <span className="block mt-1">
                    预计还需要 {estimatedRemaining} 秒...
                  </span>
                )}
              </motion.p>
            </div>

            {/* 步骤列表 */}
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className="flex items-start gap-4 p-3 rounded-xl transition-all duration-300"
                  style={{
                    backgroundColor: step.status === 'processing' 
                      ? 'rgba(16, 185, 129, 0.1)' 
                      : step.status === 'completed'
                      ? 'rgba(16, 185, 129, 0.05)'
                      : 'rgba(255, 255, 255, 0.02)'
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  {/* 图标 */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step.status === 'completed' 
                      ? 'bg-emerald-500 text-white' 
                      : step.status === 'processing'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : step.status === 'processing' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <step.icon className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium transition-colors duration-300 ${
                      step.status === 'completed' || step.status === 'processing'
                        ? 'text-white'
                        : 'text-gray-400'
                    }`}>
                      {step.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {step.description}
                    </p>
                  </div>

                  {/* 状态指示 */}
                  <div className="flex-shrink-0">
                    {step.status === 'completed' && (
                      <motion.div
                        className="text-emerald-400 text-xs font-medium"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.4 }}
                      >
                        ✓ 完成
                      </motion.div>
                    )}
                    {step.status === 'processing' && (
                      <motion.div
                        className="text-emerald-400 text-xs font-medium"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        处理中...
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 温馨提示 */}
            <motion.div
              className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-100 text-sm">
                    AI正在基于您的需求生成专业的提示词模板，请稍候...
                  </p>
                  <p className="text-blue-300 text-xs mt-1">
                    生成质量越高，等待时间可能稍长，请耐心等待
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GenerationProgress; 