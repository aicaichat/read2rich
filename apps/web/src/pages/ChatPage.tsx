import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, FileText, ArrowRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '../contexts/AuthContext';
import { unifiedSessionAPI } from '../lib/session-api';
import { generateProfessionalPrompts, type GeneratedPrompts } from '../lib/prompt-generator';
import Button from '../components/ui/Button';
import ProgressIndicator from '../components/ProgressIndicator';
import GenerationProgress from '../components/GenerationProgress';
import SmartGenerateButton from '../components/SmartGenerateButton';
import ChatWelcome from '../components/ChatWelcome';
import type { Message } from '../types';

const ChatPage: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [input, setInput] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [showGenerationProgress, setShowGenerationProgress] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 获取会话信息
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      console.log('获取会话信息，sessionId:', sessionId);
      try {
        const result = await unifiedSessionAPI.getSession(sessionId!);
        console.log('获取到的会话:', result);
        console.log('会话的initial_idea:', result?.initial_idea);
        return result;
      } catch (error) {
        console.error('获取会话失败:', error);
        // 如果会话不存在，重定向到新建会话页面
        navigate('/chat');
        return null;
      }
    },
    enabled: !!sessionId,
  });

  // 获取会话消息
  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['session-messages', sessionId],
    queryFn: async () => {
      console.log('获取消息，sessionId:', sessionId);
      try {
        const result = await unifiedSessionAPI.getMessages(sessionId!);
        console.log('获取到的消息:', result);
        return result;
      } catch (error) {
        console.error('获取消息失败:', error);
        throw error;
      }
    },
    enabled: !!sessionId && !!session,
    refetchInterval: 2000, // 减少频率，避免与异步更新冲突
    staleTime: 0, // 立即过期
    gcTime: 0, // 不缓存
  });

  // 监听AI消息更新事件
  useEffect(() => {
    const handleAIMessageUpdate = (event: CustomEvent) => {
      const { sessionId: updateSessionId, messageId, content, timestamp } = event.detail;
      
      if (updateSessionId === sessionId) {
        console.log('🔄 收到AI消息更新事件:', { messageId, timestamp });
        
        // 强制重新获取消息
        queryClient.invalidateQueries({ queryKey: ['session-messages', sessionId] });
        
        // 同时更新本地消息状态
        setLocalMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, content, metadata: { ...msg.metadata, enhanced: true } }
              : msg
          )
        );
      }
    };

    window.addEventListener('ai-message-updated', handleAIMessageUpdate as EventListener);
    
    return () => {
      window.removeEventListener('ai-message-updated', handleAIMessageUpdate as EventListener);
    };
  }, [sessionId, queryClient]);

  // 发送消息 mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      console.log('发送消息:', content);
      
      // 立即添加用户消息到本地状态
      const userMessage: Message = {
        id: String(Date.now()), // 临时ID
        session_id: sessionId!,
        role: 'user',
        content,
        metadata: {},
        created_at: new Date().toISOString()
      };
      
      setLocalMessages(prev => [...prev, userMessage]);
      
      // 调用API
      const result = await unifiedSessionAPI.addMessage(sessionId!, content);
      
      // 添加AI回复到本地状态
      setLocalMessages(prev => [...prev, result]);
      
      return result;
    },
    onSuccess: (newMessage) => {
      console.log('消息发送成功:', newMessage);
      queryClient.invalidateQueries({ queryKey: ['session-messages', sessionId] });
      setInput('');
    },
    onError: (error) => {
      console.error('发送消息失败:', error);
      // 移除失败的消息
      setLocalMessages(prev => prev.slice(0, -1));
    }
  });

  // 生成 Prompt mutation
  const generatePromptMutation = useMutation({
    mutationFn: async () => {
      if (!allMessages || !session) {
        throw new Error('没有对话数据或会话信息');
      }
      
      // 显示生成进度
      setShowGenerationProgress(true);
      
      return await generateProfessionalPrompts(allMessages, session);
    },
    onSuccess: (data: GeneratedPrompts) => {
      setShowGenerationProgress(false);
      
      // 保存到localStorage以防页面刷新
      try {
        localStorage.setItem(`generated-prompts-${sessionId}`, JSON.stringify(data));
        console.log('✅ 提示词数据已保存到localStorage');
      } catch (error) {
        console.warn('⚠️ 无法保存提示词数据到localStorage:', error);
      }
      
      // 导航到预览页面
      navigate(`/preview/${sessionId}`, { state: data });
    },
    onError: (error) => {
      console.error('生成提示词失败:', error);
      setShowGenerationProgress(false);
      alert('生成提示词失败，请稍后重试');
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 合并服务器消息和本地消息
  const allMessages = React.useMemo(() => {
    const serverMessages = messages || [];
    
    // 智能合并逻辑：优先使用服务器的最新版本
    let combinedMessages = [...serverMessages];
    
    // 只添加服务器中不存在的本地消息
    const localOnlyMessages = localMessages.filter(localMsg => {
      // 检查服务器是否已有相同或更新版本的消息
      const serverVersion = serverMessages.find(serverMsg => {
        // 匹配条件：相同ID或相似内容+角色+时间窗口
        return serverMsg.id === localMsg.id || (
          serverMsg.role === localMsg.role &&
          serverMsg.content &&
          localMsg.content &&
          serverMsg.content.includes(localMsg.content.substring(0, 50)) &&
          serverMsg.created_at &&
          localMsg.created_at &&
          Math.abs(new Date(serverMsg.created_at).getTime() - new Date(localMsg.created_at).getTime()) < 10000
        );
      });
      
      return !serverVersion; // 只保留服务器没有的本地消息
    });
    
    combinedMessages.push(...localOnlyMessages);
    
    // 按时间排序
    const sortedMessages = combinedMessages.sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return timeA - timeB;
    });
    
    // 去重：如果有相同内容和角色的消息，保留最新的（通常是增强版本）
    const uniqueMessages = sortedMessages.reduce((acc, msg) => {
      const duplicateIndex = acc.findIndex(existingMsg => 
        existingMsg.role === msg.role &&
        existingMsg.content &&
        msg.content &&
        existingMsg.content.substring(0, 100) === msg.content.substring(0, 100)
      );
      
      if (duplicateIndex >= 0) {
        // 如果新消息有增强标记或更新时间，替换旧消息
        const existingMsg = acc[duplicateIndex];
        const msgTime = msg.created_at ? new Date(msg.created_at).getTime() : 0;
        const existingTime = existingMsg.created_at ? new Date(existingMsg.created_at).getTime() : 0;
        const isNewer = msgTime > existingTime;
        const isEnhanced = msg.metadata?.enhanced || msg.metadata?.enhancedAt;
        
        if (isEnhanced || isNewer) {
          acc[duplicateIndex] = msg;
        }
      } else {
        acc.push(msg);
      }
      
      return acc;
    }, [] as Message[]);
    
    // 确保所有消息都有唯一的ID和必要字段
    const messagesWithUniqueIds = uniqueMessages
      .filter(msg => msg && msg.role && msg.content) // 过滤掉无效消息
      .map((msg, index) => ({
        ...msg,
        id: msg.id || `temp-${Date.now()}-${index}`,
        content: msg.content || '',
        created_at: msg.created_at || new Date().toISOString()
      }));
    
    return messagesWithUniqueIds;
  }, [messages, localMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  // 当服务器消息更新时，清理本地消息
  useEffect(() => {
    if (messages && messages.length > 0) {
      setLocalMessages(prev => {
        // 只保留最近的本地消息，如果服务器已经有了就删除
        return prev.filter(localMsg => {
          const hasServerVersion = messages.some(serverMsg => 
            serverMsg.content === localMsg.content && 
            serverMsg.role === localMsg.role
          );
          return !hasServerVersion;
        });
      });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    sendMessageMutation.mutate(input);
  };

  const handleGeneratePrompt = () => {
    setIsGeneratingPrompt(true);
    generatePromptMutation.mutate();
  };

  // 生成进度完成回调
  const handleGenerationComplete = () => {
    setShowGenerationProgress(false);
    setIsGeneratingPrompt(false);
  };

  // 生成进度错误回调
  const handleGenerationError = (error: string) => {
    setShowGenerationProgress(false);
    setIsGeneratingPrompt(false);
    console.error('生成过程出错:', error);
  };

  // 自动开始对话
  const handleStartConversation = () => {
    console.log('ChatPage handleStartConversation called');
    console.log('Current session:', session);
    console.log('Session initial_idea:', session?.initial_idea);
    
    const welcomeMessage = session?.initial_idea 
      ? `我看到您想要：${session.initial_idea}\n\n让我来帮您完善这个想法！首先，我想了解一下这个项目的目标用户是谁？他们会在什么场景下使用您的产品？`
      : "您好！我是 DeepNeed 的 AI 助手，很高兴为您服务！请告诉我您的项目想法，我会通过提问帮助您完善需求细节。";
    
    // 模拟AI发送欢迎消息
    const aiMessage = {
      id: String(Date.now()),
      session_id: sessionId!,
      role: 'assistant' as const,
      content: welcomeMessage,
      metadata: {},
      created_at: new Date().toISOString()
    };
    
    setLocalMessages(prev => [...prev, aiMessage]);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (sessionLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!sessionLoading && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">会话不存在</h2>
          <p className="text-gray-400 mb-4">
            会话可能已过期或不存在，请创建新的会话。
          </p>
          <Button onClick={() => navigate('/chat')}>
            创建新会话
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">加载失败</h2>
          <p className="text-gray-400 mb-4">
            {error instanceof Error ? error.message : '未知错误'}
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            返回项目面板
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-6">
      <div className="max-w-4xl mx-auto px-6">
        {/* 聊天标题 */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            需求澄清对话
          </h1>
          <p className="text-gray-400">
            通过多轮对话，我将帮助你把想法转化为清晰的技术需求
          </p>
        </motion.div>

        {/* 智能进度指示器 */}
        {allMessages && allMessages.length > 0 && (
          <ProgressIndicator messages={allMessages} session={session} />
        )}

        {/* 聊天容器 */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          {/* 消息列表 */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {allMessages && allMessages.length > 0 ? (
                allMessages.map((message: Message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-4 ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* 头像 */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-emerald-500' 
                      : 'bg-purple-500'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* 消息内容 */}
                  <div className={`flex-1 max-w-md ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`inline-block p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/10 text-gray-100 border border-white/20'
                    }`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
                ))
              ) : (
                <ChatWelcome session={session} onStartConversation={handleStartConversation} />
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="border-t border-white/10 p-6">
            <form onSubmit={handleSendMessage} className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="继续描述你的需求..."
                className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                disabled={sendMessageMutation.isPending}
              />
              <Button
                type="submit"
                loading={sendMessageMutation.isPending}
                disabled={!input.trim()}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                发送
              </Button>
            </form>

            {/* 生成 Prompt 按钮 */}
            {allMessages && allMessages.length > 2 && (
              <SmartGenerateButton
                messages={allMessages}
                session={session}
                onGenerate={handleGeneratePrompt}
                isGenerating={isGeneratingPrompt}
              />
            )}
          </div>
        </div>
      </div>

      {/* 生成进度弹窗 */}
      <GenerationProgress
        isVisible={showGenerationProgress}
        onComplete={handleGenerationComplete}
        onError={handleGenerationError}
      />
    </div>
  );
};

export default ChatPage;