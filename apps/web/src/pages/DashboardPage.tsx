import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, MessageSquare, FileText, Code, Clock, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { useAuth } from '../contexts/AuthContext';
import { unifiedSessionAPI } from '../lib/session-api';
import Button from '../components/ui/Button';
import { formatRelativeTime } from '../lib/utils';
import type { Session } from '../types';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 获取用户会话列表
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['user-sessions'],
    queryFn: unifiedSessionAPI.getUserSessions,
    enabled: !!user,
  });

  const handleCreateSession = () => {
    navigate('/chat');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'archived':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '进行中';
      case 'completed':
        return '已完成';
      case 'archived':
        return '已归档';
      default:
        return '未知';
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen pt-20 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        {/* 页面标题 */}
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              项目面板
            </h1>
            <p className="text-gray-400">
              管理您的需求分析项目和生成的代码
            </p>
          </div>
          <Button
            onClick={handleCreateSession}
            variant="gradient"
            size="lg"
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            新建项目
          </Button>
        </motion.div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: '总项目数',
              value: sessions?.length || 0,
              icon: BarChart3,
              color: 'bg-blue-500',
            },
            {
              title: '进行中',
              value: sessions?.filter(s => s.status === 'active').length || 0,
              icon: Clock,
              color: 'bg-green-500',
            },
            {
              title: '已完成',
              value: sessions?.filter(s => s.status === 'completed').length || 0,
              icon: FileText,
              color: 'bg-purple-500',
            },
            {
              title: '代码生成',
              value: 0, // TODO: 从 API 获取
              icon: Code,
              color: 'bg-orange-500',
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 项目列表 */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">最近项目</h2>
            <Link
              to="/chat"
              className="text-primary-500 hover:text-primary-400 transition-colors"
            >
              查看全部
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : sessions && sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.slice(0, 5).map((session: Session) => (
                <motion.div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  onClick={() => navigate(`/chat/${session.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{session.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {session.initial_idea.substring(0, 60)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`}></div>
                      <span className="text-sm text-gray-400">{getStatusText(session.status)}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatRelativeTime(session.created_at)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">暂无项目</h3>
              <p className="text-gray-400 mb-4">创建您的第一个需求分析项目</p>
              <Button
                onClick={handleCreateSession}
                variant="primary"
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                开始新项目
              </Button>
            </div>
          )}
        </motion.div>

        {/* 快速操作 */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {[
            {
              title: '需求澄清',
              description: '通过 AI 对话澄清项目需求',
              icon: MessageSquare,
              action: () => navigate('/chat'),
              color: 'bg-blue-500',
            },
            {
              title: '浏览模板',
              description: '查看专业的提示词模板库',
              icon: FileText,
              action: () => navigate('/templates'),
              color: 'bg-green-500',
            },
            {
              title: '代码生成',
              description: '使用 AI 生成完整项目代码',
              icon: Code,
              action: () => navigate('/generate'),
              color: 'bg-purple-500',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="card cursor-pointer group hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              onClick={item.action}
            >
              <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage; 