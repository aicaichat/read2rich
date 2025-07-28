#!/usr/bin/env node

// 测试前端和后端API连接的脚本

const API_BASE_URL = 'http://localhost:8001/api';

console.log('🧪 测试前端和后端API连接...');
console.log(`📡 后端地址: ${API_BASE_URL}`);

// 测试健康检查
async function testHealthCheck() {
  try {
    console.log('\n1. 测试健康检查...');
    const response = await fetch('http://localhost:8001/health');
    const data = await response.json();
    console.log('✅ 健康检查成功:', data);
    return true;
  } catch (error) {
    console.log('❌ 健康检查失败:', error.message);
    return false;
  }
}

// 测试创建会话
async function testCreateSession() {
  try {
    console.log('\n2. 测试创建会话...');
    const response = await fetch(`${API_BASE_URL}/chat/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        initial_idea: '前端后端连接测试'
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ 创建会话成功:', data);
    return data;
  } catch (error) {
    console.log('❌ 创建会话失败:', error.message);
    return null;
  }
}

// 测试发送消息
async function testSendMessage(sessionId) {
  try {
    console.log('\n3. 测试发送消息...');
    const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: '这是一个测试消息'
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ 发送消息成功:', data);
    return data;
  } catch (error) {
    console.log('❌ 发送消息失败:', error.message);
    return null;
  }
}

// 主测试函数
async function runTests() {
  console.log('🚀 开始测试...');
  
  // 测试健康检查
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log('\n❌ 后端服务未运行，请先启动Docker后端服务');
    console.log('💡 运行命令: ./docker-demo.sh');
    return;
  }
  
  // 测试创建会话
  const session = await testCreateSession();
  if (!session) {
    console.log('\n❌ 会话创建失败，API路径可能不正确');
    return;
  }
  
  // 测试发送消息
  const message = await testSendMessage(session.id);
  if (!message) {
    console.log('\n❌ 消息发送失败');
    return;
  }
  
  console.log('\n🎉 所有测试通过！前端和后端连接正常');
  console.log('✅ 可以正常使用聊天功能');
  
  console.log('\n📋 API总结:');
  console.log(`  - 健康检查: GET http://localhost:8001/health`);
  console.log(`  - 创建会话: POST ${API_BASE_URL}/chat/sessions`);
  console.log(`  - 发送消息: POST ${API_BASE_URL}/chat/sessions/{sessionId}/messages`);
}

// 运行测试
runTests().catch(error => {
  console.error('💥 测试运行失败:', error);
}); 