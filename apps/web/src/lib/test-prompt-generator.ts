// 测试提示词生成功能
import { generateProfessionalPrompts } from './prompt-generator';
import type { Message, Session } from '@/types';

// 模拟测试数据
const mockSession: Session = {
  id: 'test-session-1',
  title: '测试项目',
  initial_idea: '我想开发一个在线学习平台，支持视频课程、作业提交和进度跟踪',
  status: 'active',
  current_requirements: {},
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

const mockMessages: Message[] = [
  {
    id: 1,
    session_id: 'test-session-1',
    role: 'user',
    content: '我想开发一个在线学习平台',
    metadata: {},
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    session_id: 'test-session-1',
    role: 'assistant',
    content: '很好的想法！请告诉我更多关于这个学习平台的细节。你希望支持哪些功能？比如视频课程、作业提交、进度跟踪等？',
    metadata: {},
    created_at: '2024-01-01T00:01:00Z'
  },
  {
    id: 3,
    session_id: 'test-session-1',
    role: 'user',
    content: '需要支持视频课程播放、作业提交、学生进度跟踪、教师管理课程等功能',
    metadata: {},
    created_at: '2024-01-01T00:02:00Z'
  },
  {
    id: 4,
    session_id: 'test-session-1',
    role: 'assistant',
    content: '明白了！这是一个功能丰富的在线学习平台。关于技术栈，你倾向于使用什么技术？比如前端用 React/Vue，后端用 Node.js/Python？',
    metadata: {},
    created_at: '2024-01-01T00:03:00Z'
  },
  {
    id: 5,
    session_id: 'test-session-1',
    role: 'user',
    content: '前端用 React，后端用 Node.js，数据库用 MySQL',
    metadata: {},
    created_at: '2024-01-01T00:04:00Z'
  }
];

// 测试函数
export const testPromptGenerator = async () => {
  console.log('🧪 开始测试提示词生成功能...');
  
  try {
    const result = await generateProfessionalPrompts(mockMessages, mockSession);
    
    console.log('✅ 提示词生成成功！');
    console.log('📋 生成结果:');
    console.log('系统提示词:', result.system_prompt);
    console.log('用户提示词:', result.user_prompt);
    console.log('技术需求:', result.technical_requirements);
    console.log('项目总结:', result.project_summary);
    console.log('下一步建议:', result.next_steps);
    
    return result;
  } catch (error) {
    console.error('❌ 提示词生成失败:', error);
    throw error;
  }
};

// 在浏览器控制台中运行测试
if (typeof window !== 'undefined') {
  (window as any).testPromptGenerator = testPromptGenerator;
  console.log('🔧 测试函数已加载，可在控制台运行: testPromptGenerator()');
} 