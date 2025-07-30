import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, BookOpen, TrendingUp, DollarSign, 
  Plus, Settings, BarChart3, FileText,
  MessageSquare, Star, Eye, Download,
  ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
import Button from '../components/ui/Button';

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

interface RecentActivity {
  id: number;
  type: 'course' | 'user' | 'order' | 'review';
  title: string;
  description: string;
  time: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats: StatCard[] = [
    {
      title: '总用户数',
      value: '12,847',
      change: 12.5,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: '课程数量',
      value: '24',
      change: 8.2,
      icon: BookOpen,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20'
    },
    {
      title: '总收入',
      value: '¥1,247,890',
      change: -2.1,
      icon: DollarSign,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      title: '活跃用户',
      value: '8,234',
      change: 15.3,
      icon: TrendingUp,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    }
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: 1,
      type: 'course',
      title: '新课程上架',
      description: '《AI产品经理实战课程》已成功上架',
      time: '2分钟前',
      status: 'success'
    },
    {
      id: 2,
      type: 'user',
      title: '新用户注册',
      description: '用户 张三 完成注册',
      time: '5分钟前',
      status: 'info'
    },
    {
      id: 3,
      type: 'order',
      title: '新订单',
      description: '订单 #DN2024001 支付成功，金额 ¥599',
      time: '12分钟前',
      status: 'success'
    },
    {
      id: 4,
      type: 'review',
      title: '新评价',
      description: '《百万应用创作课》收到5星评价',
      time: '18分钟前',
      status: 'success'
    },
    {
      id: 5,
      type: 'course',
      title: '课程更新',
      description: '《ChatGPT编程实战》新增3个课时',
      time: '25分钟前',
      status: 'info'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-emerald-400 bg-emerald-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      case 'error': return 'text-red-400 bg-red-500/20';
      case 'info': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return BookOpen;
      case 'user': return Users;
      case 'order': return DollarSign;
      case 'review': return Star;
      default: return Activity;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 顶部导航 */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">DeepNeed 后台管理</h1>
              <p className="text-gray-400">欢迎回来，管理员</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Settings className="w-4 h-4 mr-2" />
                设置
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <BarChart3 className="w-4 h-4 mr-2" />
                报表
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center text-sm ${
                  stat.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {stat.change >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：快速操作 */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
              <h2 className="text-xl font-semibold text-white mb-6">快速操作</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  className="w-full bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white py-4 rounded-xl font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  上架新课程
                </Button>
                <Button
                  variant="ghost"
                  className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 py-4 rounded-xl font-semibold"
                >
                  <Users className="w-5 h-5 mr-2" />
                  用户管理
                </Button>
                <Button
                  variant="ghost"
                  className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10 py-4 rounded-xl font-semibold"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  订单管理
                </Button>
                <Button
                  variant="ghost"
                  className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 py-4 rounded-xl font-semibold"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  客服管理
                </Button>
              </div>
            </div>

            {/* 最近活动 */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6">最近活动</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const IconComponent = getTypeIcon(activity.type);
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className={`w-10 h-10 ${getStatusColor(activity.status)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{activity.title}</h4>
                        <p className="text-gray-300 text-sm mb-2">{activity.description}</p>
                        <span className="text-gray-400 text-xs">{activity.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 右侧：快捷统计 */}
          <div className="space-y-6">
            {/* 热门课程 */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">热门课程</h3>
              <div className="space-y-3">
                {[
                  { title: '百万应用创作课', students: 2847, rating: 4.9 },
                  { title: 'AI产品经理实战', students: 1567, rating: 4.8 },
                  { title: 'ChatGPT编程实战', students: 2134, rating: 4.7 },
                  { title: 'AI创业实战指南', students: 892, rating: 4.9 }
                ].map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <h4 className="text-white text-sm font-medium">{course.title}</h4>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>{course.students} 学员</span>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                          {course.rating}
                        </div>
                      </div>
                    </div>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* 系统状态 */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">系统状态</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">服务器状态</span>
                  <span className="text-emerald-400 text-sm font-medium">正常</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">数据库连接</span>
                  <span className="text-emerald-400 text-sm font-medium">正常</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">AI服务</span>
                  <span className="text-emerald-400 text-sm font-medium">正常</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">存储空间</span>
                  <span className="text-yellow-400 text-sm font-medium">75%</span>
                </div>
              </div>
            </div>

            {/* 今日数据 */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">今日数据</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">新增用户</span>
                  <span className="text-white font-medium">127</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">课程购买</span>
                  <span className="text-white font-medium">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">收入</span>
                  <span className="text-emerald-400 font-medium">¥53,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">活跃用户</span>
                  <span className="text-white font-medium">1,234</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 