import React, { useState } from 'react';
import { callAIAPI } from '../lib/mock-api';
import { generateProfessionalPrompts } from '../lib/prompt-generator';
import Button from '../components/ui/Button';

const TestAIPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [promptResult, setPromptResult] = useState<any>(null);

  const testAI = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      console.log('🧪 开始测试AI调用...');
      
      const response = await callAIAPI([
        {
          role: 'system',
          content: '你是一个专业的软件架构师，请简洁地回答用户问题。'
        },
        {
          role: 'user',
          content: '请为一个电商系统设计一个简单的技术架构，用1-2段话描述核心组件。'
        }
      ]);
      
      console.log('✅ AI调用成功，回复长度:', response.length);
      console.log('📄 AI回复内容:', response);
      
      setResult(response);
    } catch (err) {
      console.error('❌ AI调用失败:', err);
      setError(err instanceof Error ? err.message : 'AI调用失败');
    } finally {
      setLoading(false);
    }
  };

  const testPromptGeneration = async () => {
    setLoading(true);
    setPromptResult(null);
    setError(null);
    
    try {
      console.log('🔄 开始测试提示词生成...');
      
      const mockMessages = [
        { id: 1, session_id: 'test-session', role: 'user' as const, content: '我想开发一个在线教育平台', created_at: new Date().toISOString() },
        { id: 2, session_id: 'test-session', role: 'assistant' as const, content: '这是一个很好的想法！我想了解更多细节...', created_at: new Date().toISOString() },
        { id: 3, session_id: 'test-session', role: 'user' as const, content: '主要面向K12学生，包含视频课程、作业提交、在线测试等功能', created_at: new Date().toISOString() }
      ];
      
      const mockSession = {
        id: 'test-session',
        title: '在线教育平台开发',
        initial_idea: '我想开发一个在线教育平台，主要面向K12学生',
        current_requirements: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'active' as const
      };
      
      const prompts = await generateProfessionalPrompts(mockMessages, mockSession);
      
      console.log('✅ 提示词生成成功:', prompts);
      setPromptResult(prompts);
    } catch (err) {
      console.error('❌ 提示词生成失败:', err);
      setError(err instanceof Error ? err.message : '提示词生成失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <h1 className="text-2xl font-bold text-white mb-6">🧪 AI调用测试</h1>
          
          <div className="mb-6">
            <div className="flex gap-4">
              <Button 
                onClick={testAI} 
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {loading ? '🔄 测试中...' : '🚀 测试AI调用'}
              </Button>
              
              <Button 
                onClick={testPromptGeneration} 
                disabled={loading}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                {loading ? '🔄 生成中...' : '🎯 测试提示词生成'}
              </Button>
            </div>
          </div>

          {loading && (
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-200">正在调用AI，请查看浏览器控制台...</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <h3 className="text-red-200 font-semibold mb-2">❌ 错误</h3>
              <p className="text-red-100 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h3 className="text-green-200 font-semibold mb-2">✅ AI回复结果</h3>
              <div className="text-green-100 text-sm whitespace-pre-wrap">
                {result}
              </div>
            </div>
          )}

          {promptResult && (
            <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <h3 className="text-purple-200 font-semibold mb-2">🎯 提示词生成结果</h3>
              <div className="text-purple-100 text-sm space-y-2">
                <div>
                  <strong>System Prompt长度:</strong> {promptResult.system_prompt?.length || 0} 字符
                </div>
                <div>
                  <strong>User Prompt长度:</strong> {promptResult.user_prompt?.length || 0} 字符
                </div>
                {promptResult.professional_prompts && (
                  <div className="mt-4">
                    <strong>专业提示词:</strong>
                    <ul className="ml-4 space-y-1">
                      <li>PRD: {promptResult.professional_prompts.prd.prompt?.length || 0} 字符</li>
                      <li>技术: {promptResult.professional_prompts.technical_implementation.prompt?.length || 0} 字符</li>
                      <li>设计: {promptResult.professional_prompts.visual_design.prompt?.length || 0} 字符</li>
                      <li>管理: {promptResult.professional_prompts.project_management.prompt?.length || 0} 字符</li>
                    </ul>
                  </div>
                )}
                <details className="mt-4">
                  <summary className="cursor-pointer text-purple-300">查看完整数据</summary>
                  <pre className="text-xs bg-black/20 p-3 rounded mt-2 overflow-auto max-h-60">
                    {JSON.stringify(promptResult, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <h3 className="text-yellow-200 font-semibold mb-2">📋 使用说明</h3>
            <ul className="text-yellow-100 text-sm space-y-1">
              <li>• 点击"测试AI调用"按钮</li>
              <li>• 打开浏览器开发者工具(F12)，查看Console控制台</li>
              <li>• 观察AI调用的详细日志</li>
              <li>• 如果成功，会显示AI的回复内容</li>
              <li>• 如果失败，会显示错误信息</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAIPage; 