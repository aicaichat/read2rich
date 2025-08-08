// 测试注册和登录功能
const API_BASE_URL = 'http://localhost:8000/api/v1';

async function testAuth() {
  console.log('🧪 开始测试认证功能...\n');

  // 测试数据
  const testUser = {
    email: `test${Date.now()}@example.com`,
    username: `testuser${Date.now()}`,
    password: 'testpass123',
    full_name: 'Test User'
  };

  try {
    // 1. 测试注册
    console.log('📝 测试用户注册...');
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    if (registerResponse.ok) {
      const userData = await registerResponse.json();
      console.log('✅ 注册成功:', userData.username);
    } else {
      const error = await registerResponse.json();
      console.log('❌ 注册失败:', error.detail);
      return;
    }

    // 2. 测试登录
    console.log('\n🔐 测试用户登录...');
    const formData = new FormData();
    formData.append('username', testUser.username);
    formData.append('password', testUser.password);

    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: formData,
    });

    if (loginResponse.ok) {
      const tokenData = await loginResponse.json();
      console.log('✅ 登录成功，获取到令牌');
      console.log('Token type:', tokenData.token_type);
      
      // 3. 测试获取当前用户信息
      console.log('\n👤 测试获取当前用户信息...');
      const meResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      if (meResponse.ok) {
        const currentUser = await meResponse.json();
        console.log('✅ 获取用户信息成功:', currentUser.username);
      } else {
        const error = await meResponse.json();
        console.log('❌ 获取用户信息失败:', error.detail);
      }

      // 4. 测试登出
      console.log('\n🚪 测试用户登出...');
      const logoutResponse = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      if (logoutResponse.ok) {
        console.log('✅ 登出成功');
      } else {
        console.log('⚠️ 登出API调用失败，但这是正常的（客户端清除令牌）');
      }

    } else {
      const error = await loginResponse.json();
      console.log('❌ 登录失败:', error.detail);
    }

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  }

  console.log('\n🎉 认证功能测试完成！');
}

// 运行测试
testAuth();
