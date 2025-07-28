import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import type { LoginForm, RegisterForm } from '../types';

const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [isRegisterMode, setIsRegisterMode] = useState(searchParams.get('mode') === 'register');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginForm & RegisterForm>();

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');
    
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    setError('');
    
    try {
      await register(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || '注册失败');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data: LoginForm & RegisterForm) => {
    if (isRegisterMode) {
      handleRegister(data);
    } else {
      handleLogin(data);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {isRegisterMode ? '注册账户' : '欢迎回来'}
            </h1>
            <p className="text-gray-400">
              {isRegisterMode 
                ? '创建您的 DeepNeed 账户，开始 AI 驱动的开发之旅' 
                : '登录您的账户，继续您的项目'
              }
            </p>
          </div>

          {/* 错误信息 */}
          {error && (
            <motion.div
              className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              {error}
            </motion.div>
          )}

          {/* 表单 */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 邮箱 (仅注册时显示) */}
            {isRegisterMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  邮箱地址
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    {...registerForm('email', {
                      required: isRegisterMode ? '请输入邮箱地址' : false,
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: '请输入有效的邮箱地址',
                      },
                    })}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </motion.div>
            )}

            {/* 用户名 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  {...registerForm('username', {
                    required: '请输入用户名',
                    minLength: {
                      value: 3,
                      message: '用户名至少需要 3 个字符',
                    },
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="请输入用户名"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
              )}
            </div>

            {/* 全名 (仅注册时显示) */}
            {isRegisterMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  姓名 (可选)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    {...registerForm('full_name')}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    placeholder="请输入您的姓名"
                  />
                </div>
              </motion.div>
            )}

            {/* 密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...registerForm('password', {
                    required: '请输入密码',
                    minLength: {
                      value: 6,
                      message: '密码至少需要 6 个字符',
                    },
                  })}
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="请输入密码"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* 提交按钮 */}
            <Button
              type="submit"
              loading={isLoading}
              variant="gradient"
              size="lg"
              className="w-full"
            >
              {isRegisterMode ? '创建账户' : '登录'}
            </Button>
          </form>

          {/* 切换模式 */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isRegisterMode ? '已有账户？' : '还没有账户？'}
              <button
                onClick={toggleMode}
                className="ml-1 text-primary-500 hover:text-primary-400 transition-colors font-medium"
              >
                {isRegisterMode ? '立即登录' : '免费注册'}
              </button>
            </p>
          </div>

          {/* 分隔线 */}
          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-gray-400 text-sm">或</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* 社交登录 */}
          <div className="mt-6 space-y-3">
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => {/* TODO: 实现 GitHub 登录 */}}
            >
              使用 GitHub 登录
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => {/* TODO: 实现 Google 登录 */}}
            >
              使用 Google 登录
            </Button>
          </div>

          {/* 使用条款 */}
          <p className="mt-6 text-xs text-gray-500 text-center">
            注册即表示您同意我们的{' '}
            <Link to="/terms" className="text-primary-500 hover:text-primary-400">
              服务条款
            </Link>{' '}
            和{' '}
            <Link to="/privacy" className="text-primary-500 hover:text-primary-400">
              隐私政策
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage; 