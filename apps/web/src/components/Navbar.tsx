import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User, MessageSquare, BarChart3, Github, Settings, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AISettingsModal from './AISettingsModal';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAISettings, setShowAISettings] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-20 bg-dark-300/80 border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
            >
              <motion.div
                className="text-2xl font-bold text-gradient"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                DeepNeed
              </motion.div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/chat"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/chat') 
                        ? 'bg-primary-500/20 text-primary-500' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>需求澄清</span>
                  </Link>
                  <Link
                    to="/prompt-library"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/prompt-library') 
                        ? 'bg-primary-500/20 text-primary-500' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Github className="w-4 h-4" />
                    <span>提示词库</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/dashboard') 
                        ? 'bg-primary-500/20 text-primary-500' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>项目面板</span>
                  </Link>
                  <Link
                    to="/courses"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/courses') 
                        ? 'bg-primary-500/20 text-primary-500' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>AI课程</span>
                  </Link>
                  <Link
                    to="/ai-ranking"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/ai-ranking') 
                        ? 'bg-primary-500/20 text-primary-500' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>AI排行榜</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      isActive('/') 
                        ? 'text-primary-500' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    首页
                  </Link>
                  <Link
                    to="/courses"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/courses') 
                        ? 'bg-primary-500/20 text-primary-500' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>AI课程</span>
                  </Link>
                  <Link
                    to="/ai-ranking"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/ai-ranking') 
                        ? 'bg-primary-500/20 text-primary-500' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>AI排行榜</span>
                  </Link>
                  <Link
                    to="/about"
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      isActive('/about') 
                        ? 'text-primary-500' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    关于我们
                  </Link>
                </>
              )}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/5">
                    <User className="w-4 h-4 text-primary-500" />
                    <span className="text-sm text-gray-300">
                      {user?.username}
                    </span>
                  </div>
                  
                  {/* AI 设置按钮 */}
                  <motion.button
                    onClick={() => setShowAISettings(true)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="AI 服务设置"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">AI设置</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">退出</span>
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    登录
                  </Link>
                  <Link
                    to="/login?mode=register"
                    className="px-4 py-2 bg-primary-500 text-dark-300 rounded-lg hover:bg-primary-600 transition-colors font-medium"
                  >
                    注册
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* AI 设置模态框 */}
      <AISettingsModal 
        isOpen={showAISettings}
        onClose={() => setShowAISettings(false)}
      />
    </>
  );
} 