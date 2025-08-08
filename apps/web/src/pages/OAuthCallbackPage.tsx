import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const OAuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('正在处理登录...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get('token');
        const provider = searchParams.get('provider');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('OAuth 登录失败，请重试');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (!token) {
          setStatus('error');
          setMessage('未收到认证令牌');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // 保存令牌到本地存储
        localStorage.setItem('access_token', token);
        
        // 获取用户信息
        try {
          const response = await fetch('/api/v1/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setStatus('success');
            setMessage(`${provider === 'github' ? 'GitHub' : 'Google'} 登录成功！`);
            
            // 延迟跳转到仪表板
            setTimeout(() => {
              navigate('/dashboard');
            }, 1500);
          } else {
            throw new Error('Failed to get user info');
          }
        } catch (error) {
          setStatus('error');
          setMessage('获取用户信息失败');
          setTimeout(() => navigate('/login'), 3000);
        }

      } catch (error) {
        setStatus('error');
        setMessage('登录处理失败');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-500';
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card p-8">
          <div className="flex justify-center mb-6">
            {getStatusIcon()}
          </div>
          
          <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
            {status === 'loading' && '处理中...'}
            {status === 'success' && '登录成功'}
            {status === 'error' && '登录失败'}
          </h1>
          
          <p className="text-gray-400 mb-6">
            {message}
          </p>
          
          {status === 'error' && (
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              返回登录页面
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OAuthCallbackPage;
