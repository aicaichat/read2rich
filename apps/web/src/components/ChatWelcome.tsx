import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Target, 
  Users, 
  Code, 
  Clock,
  Lightbulb,
  ArrowDown,
  Sparkles,
  Bot,
  CheckCircle,
  Send
} from 'lucide-react';
import Button from './ui/Button';

interface ChatWelcomeProps {
  session: any;
  onStartConversation?: () => void;
}

const ChatWelcome: React.FC<ChatWelcomeProps> = ({ session, onStartConversation }) => {
  const [showStartButton, setShowStartButton] = useState(false);

  useEffect(() => {
    // 3秒后显示开始对话按钮
    const timer = setTimeout(() => {
      setShowStartButton(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const suggestedQuestions = [
    "这个项目的目标用户是谁？",
    "您希望使用什么技术栈来开发？",
    "项目的核心功能有哪些？",
    "预计的开发周期是多久？",
    "有什么特殊的技术要求吗？",
    "项目的预算范围大概是多少？"
  ];

  const conversationTips = [
    {
      icon: Target,
      title: "详细描述目标",
      desc: "告诉我您想解决什么问题，服务什么用户群体"
    },
    {
      icon: Code,
      title: "技术偏好",
      desc: "分享您的技术栈偏好，我会给出专业建议"
    },
    {
      icon: Users,
      title: "用户场景",
      desc: "描述用户如何使用您的产品，有什么痛点"
    },
    {
      icon: Clock,
      title: "时间和预算",
      desc: "告诉我项目的时间计划和预算考虑"
    }
  ];

  const handleStartConversation = () => {
    if (onStartConversation) {
      onStartConversation();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* 欢迎标题 */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.div
            className="w-12 h-12 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full flex items-center justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Bot className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI 助手已就绪</h2>
            <p className="text-gray-400 text-sm mt-1">开始深度需求澄清对话</p>
          </div>
        </div>
      </motion.div>

      {/* 项目信息预览 */}
      {session?.initial_idea && (
        <motion.div
          className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">您的项目想法</h3>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {session.initial_idea}
                </p>
              </div>
              <p className="text-emerald-400 text-sm mt-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                很棒的想法！让我们通过对话来完善更多细节
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 对话指南 */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {conversationTips.map((tip, index) => (
          <motion.div
            key={`tip-${tip.title}-${index}`}
            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-all duration-300"
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <tip.icon className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h4 className="text-white font-medium text-sm">{tip.title}</h4>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 建议问题 */}
      <motion.div
        className="bg-white/5 border border-white/10 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          <h3 className="text-white font-semibold">AI 可能会问您的问题</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestedQuestions.map((question, index) => (
            <motion.div
              key={`question-${index}-${question.substring(0, 10)}`}
              className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 rounded-lg p-3 border border-white/10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
            >
              <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span>{question}</span>
            </motion.div>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-4 text-center">
          💡 提示：您可以主动分享这些信息，让对话更高效
        </p>
      </motion.div>

      {/* 开始对话按钮 */}
      {showStartButton && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={handleStartConversation}
            variant="gradient"
            size="lg"
            className="flex items-center gap-2 px-8 py-4 text-lg font-semibold mx-auto"
          >
            <Bot className="w-5 h-5" />
            让 AI 助手开始提问
            <Send className="w-4 h-4" />
          </Button>
          <p className="text-gray-500 text-sm mt-3">
            点击按钮，AI 将根据您的项目想法主动开始提问
          </p>
        </motion.div>
      )}

      {/* 开始提示 */}
      {!showStartButton && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4" />
            在下方输入框开始对话，或等待 AI 主动提问
            <ArrowDown className="w-4 h-4" />
          </motion.div>
          <p className="text-gray-500 text-xs mt-2">
            AI 助手将根据您的输入提出针对性问题，帮助完善项目需求
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ChatWelcome; 