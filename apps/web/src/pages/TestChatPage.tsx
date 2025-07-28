import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { unifiedSessionAPI } from '../lib/session-api';
import Button from '../components/ui/Button';

const TestChatPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  // 获取会话信息
  const { data: session, isLoading: sessionLoading, error: sessionError } = useQuery({
    queryKey: ['test-session', sessionId],
    queryFn: async () => {
      addDebugInfo(`开始获取会话: ${sessionId}`);
      try {
        const result = await unifiedSessionAPI.getSession(sessionId!);
        addDebugInfo(`获取会话成功: ${JSON.stringify(result)}`);
        return result;
      } catch (error) {
        addDebugInfo(`获取会话失败: ${error}`);
        throw error;
      }
    },
    enabled: !!sessionId,
  });

  // 获取消息
  const { data: messages, isLoading: messagesLoading, error: messagesError } = useQuery({
    queryKey: ['test-messages', sessionId],
    queryFn: async () => {
      addDebugInfo(`开始获取消息: ${sessionId}`);
      try {
        const result = await unifiedSessionAPI.getMessages(sessionId!);
        addDebugInfo(`获取消息成功: ${result.length} 条消息`);
        return result;
      } catch (error) {
        addDebugInfo(`获取消息失败: ${error}`);
        throw error;
      }
    },
    enabled: !!sessionId && !!session,
  });

  const createTestSession = async () => {
    try {
      addDebugInfo('开始创建测试会话');
      const result = await unifiedSessionAPI.createSession({
        title: '测试会话',
        initial_idea: '这是一个测试会话'
      });
      addDebugInfo(`测试会话创建成功: ${JSON.stringify(result)}`);
    } catch (error) {
      addDebugInfo(`创建测试会话失败: ${error}`);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          聊天页面调试
        </h1>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">基本信息</h2>
          <div className="text-gray-300 space-y-2">
            <p>Session ID: {sessionId || '未找到'}</p>
            <p>会话加载状态: {sessionLoading ? '加载中' : '完成'}</p>
            <p>消息加载状态: {messagesLoading ? '加载中' : '完成'}</p>
            <p>会话错误: {sessionError ? String(sessionError) : '无'}</p>
            <p>消息错误: {messagesError ? String(messagesError) : '无'}</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">会话数据</h2>
          <div className="text-gray-300">
            {session ? (
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(session, null, 2)}
              </pre>
            ) : (
              <p>无会话数据</p>
            )}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">消息数据</h2>
          <div className="text-gray-300">
            {messages ? (
              <div>
                <p>消息数量: {messages.length}</p>
                <pre className="whitespace-pre-wrap mt-2">
                  {JSON.stringify(messages, null, 2)}
                </pre>
              </div>
            ) : (
              <p>无消息数据</p>
            )}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">调试日志</h2>
          <div className="text-gray-300 space-y-1 max-h-64 overflow-y-auto">
            {debugInfo.map((info, index) => (
              <p key={index} className="text-sm font-mono">
                {info}
              </p>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={createTestSession}>
            创建测试会话
          </Button>
          <Button onClick={() => window.location.reload()}>
            刷新页面
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestChatPage; 