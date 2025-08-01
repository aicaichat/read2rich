import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, BookOpen, TrendingUp, Clock, Star, Award,
  Filter, Search, Download, Calendar, Target, PieChart,
  UserCheck, UserX, Zap, Trophy, ArrowRight, Play,
  BarChart3, Activity, CheckCircle, AlertCircle
} from 'lucide-react';
import Button from '../components/ui/Button';

interface Student {
  id: number;
  name: string;
  email: string;
  avatar: string;
  category: 'student-tech' | 'student-business' | 'entrepreneur-0to1' | 'entrepreneur-growth';
  enrollmentDate: string;
  progress: number;
  completedModules: number;
  totalModules: number;
  currentWeek: number;
  status: 'active' | 'paused' | 'completed' | 'dropped';
  achievements: string[];
  mvpStatus: 'not_started' | 'in_progress' | 'completed' | 'deployed';
  revenue: number;
  weeklyActivity: number[];
}

interface CourseAnalytics {
  totalStudents: number;
  activeStudents: number;
  completionRate: number;
  averageProgress: number;
  totalRevenue: number;
  weeklyEngagement: number;
  topPerformers: Student[];
}

const EnhancedCourseManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [analytics, setAnalytics] = useState<CourseAnalytics | null>(null);

  // 模拟数据
  useEffect(() => {
    const mockStudents: Student[] = [
      {
        id: 1,
        name: "张小明",
        email: "zhangxm@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhang",
        category: "student-tech",
        enrollmentDate: "2024-01-15",
        progress: 85,
        completedModules: 5,
        totalModules: 6,
        currentWeek: 5,
        status: "active",
        achievements: ["首个MVP上线", "获得投资人关注", "月收入过万"],
        mvpStatus: "deployed",
        revenue: 12000,
        weeklyActivity: [8, 7, 9, 8, 6, 7, 8]
      },
      {
        id: 2,
        name: "李小红",
        email: "lixh@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=li",
        category: "entrepreneur-0to1",
        enrollmentDate: "2024-01-20",
        progress: 92,
        completedModules: 6,
        totalModules: 6,
        currentWeek: 6,
        status: "completed",
        achievements: ["课程完成", "Demo Day优秀奖", "获得Pre-A轮融资"],
        mvpStatus: "deployed",
        revenue: 45000,
        weeklyActivity: [9, 8, 9, 9, 8, 9, 9]
      },
      {
        id: 3,
        name: "王大力",
        email: "wangdl@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wang",
        category: "student-business",
        enrollmentDate: "2024-02-01",
        progress: 45,
        completedModules: 3,
        totalModules: 6,
        currentWeek: 3,
        status: "active",
        achievements: ["需求验证通过", "用户访谈专家"],
        mvpStatus: "in_progress",
        revenue: 0,
        weeklyActivity: [6, 5, 7, 6, 4, 5, 6]
      },
      {
        id: 4,
        name: "陈创业",
        email: "chenchy@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chen",
        category: "entrepreneur-growth",
        enrollmentDate: "2024-01-10",
        progress: 78,
        completedModules: 5,
        totalModules: 6,
        currentWeek: 5,
        status: "active",
        achievements: ["转化率提升300%", "用户增长黑客", "社区建设专家"],
        mvpStatus: "deployed",
        revenue: 28000,
        weeklyActivity: [7, 8, 8, 9, 7, 8, 9]
      }
    ];

    const mockAnalytics: CourseAnalytics = {
      totalStudents: 156,
      activeStudents: 142,
      completionRate: 87,
      averageProgress: 68,
      totalRevenue: 1250000,
      weeklyEngagement: 85,
      topPerformers: mockStudents.slice(0, 3)
    };

    setStudents(mockStudents);
    setAnalytics(mockAnalytics);
  }, []);

  const categories = [
    { id: 'all', label: '全部学员', count: students.length },
    { id: 'student-tech', label: '学生-技术方向', count: students.filter(s => s.category === 'student-tech').length },
    { id: 'student-business', label: '学生-商业方向', count: students.filter(s => s.category === 'student-business').length },
    { id: 'entrepreneur-0to1', label: '创业者-0到1', count: students.filter(s => s.category === 'entrepreneur-0to1').length },
    { id: 'entrepreneur-growth', label: '创业者-增长期', count: students.filter(s => s.category === 'entrepreneur-growth').length }
  ];

  const filteredStudents = students.filter(student => {
    const matchesCategory = selectedCategory === 'all' || student.category === selectedCategory;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (category: string) => {
    const categoryMap = {
      'student-tech': '学生-技术',
      'student-business': '学生-商业',
      'entrepreneur-0to1': '创业者-0到1',
      'entrepreneur-growth': '创业者-增长'
    };
    return categoryMap[category as keyof typeof categoryMap] || category;
  };

  const getStatusColor = (status: string) => {
    const statusColors = {
      'active': 'text-green-400 bg-green-400/20',
      'paused': 'text-yellow-400 bg-yellow-400/20',
      'completed': 'text-blue-400 bg-blue-400/20',
      'dropped': 'text-red-400 bg-red-400/20'
    };
    return statusColors[status as keyof typeof statusColors] || 'text-gray-400 bg-gray-400/20';
  };

  const getMVPStatusColor = (status: string) => {
    const statusColors = {
      'not_started': 'text-gray-400 bg-gray-400/20',
      'in_progress': 'text-yellow-400 bg-yellow-400/20',
      'completed': 'text-blue-400 bg-blue-400/20',
      'deployed': 'text-green-400 bg-green-400/20'
    };
    return statusColors[status as keyof typeof statusColors] || 'text-gray-400 bg-gray-400/20';
  };

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">AI应用创新课程管理</h1>
          <p className="text-gray-300">管理学员进度，跟踪学习成果，优化课程体验</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { id: 'overview', label: '总览', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'students', label: '学员管理', icon: <Users className="w-4 h-4" /> },
              { id: 'progress', label: '进度跟踪', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'analytics', label: '数据分析', icon: <PieChart className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">总学员数</p>
                    <p className="text-3xl font-bold text-white">{analytics.totalStudents}</p>
                  </div>
                  <Users className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">活跃学员</p>
                    <p className="text-3xl font-bold text-white">{analytics.activeStudents}</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">完课率</p>
                    <p className="text-3xl font-bold text-white">{analytics.completionRate}%</p>
                  </div>
                  <Trophy className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">学员总营收</p>
                    <p className="text-3xl font-bold text-white">¥{(analytics.totalRevenue / 10000).toFixed(0)}万</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">优秀学员排行榜</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analytics.topPerformers.map((student, index) => (
                  <div key={student.id} className="bg-gradient-to-br from-emerald-500/10 to-purple-500/10 border border-emerald-500/20 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="relative">
                        <img 
                          src={student.avatar} 
                          alt={student.name}
                          className="w-12 h-12 rounded-full border-2 border-emerald-500/50"
                        />
                        <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' : index === 1 ? 'bg-gray-400 text-white' : 'bg-amber-600 text-white'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-white font-semibold">{student.name}</h3>
                        <p className="text-emerald-400 text-sm">{getCategoryLabel(student.category)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">进度</span>
                        <span className="text-white">{student.progress}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">营收</span>
                        <span className="text-emerald-400">¥{student.revenue.toLocaleString()}</span>
                      </div>
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {student.achievements.slice(0, 2).map((achievement, achIndex) => (
                            <span key={achIndex} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                              {achievement}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'students' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Filters and Search */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.label} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="搜索学员..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 w-64"
                    />
                  </div>
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    导出数据
                  </Button>
                </div>
              </div>
            </div>

            {/* Students List */}
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={student.avatar} 
                        alt={student.name}
                        className="w-12 h-12 rounded-full border-2 border-emerald-500/50"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-white">{student.name}</h3>
                        <p className="text-gray-400">{student.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                            {getCategoryLabel(student.category)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(student.status)}`}>
                            {student.status === 'active' ? '学习中' : student.status === 'completed' ? '已完成' : student.status === 'paused' ? '暂停' : '已退课'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-8 items-center">
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">学习进度</p>
                        <div className="flex items-center mt-1">
                          <div className="w-16 bg-slate-700 rounded-full h-2 mr-2">
                            <div 
                              className="bg-emerald-500 h-2 rounded-full" 
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-white text-sm">{student.progress}%</span>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-gray-400 text-sm">当前周次</p>
                        <p className="text-white font-semibold">第{student.currentWeek}周</p>
                      </div>

                      <div className="text-center">
                        <p className="text-gray-400 text-sm">MVP状态</p>
                        <span className={`px-2 py-1 rounded text-xs ${getMVPStatusColor(student.mvpStatus)}`}>
                          {student.mvpStatus === 'deployed' ? '已上线' : 
                           student.mvpStatus === 'completed' ? '已完成' :
                           student.mvpStatus === 'in_progress' ? '开发中' : '未开始'}
                        </span>
                      </div>

                      <div className="text-center">
                        <p className="text-gray-400 text-sm">产品营收</p>
                        <p className="text-emerald-400 font-semibold">¥{student.revenue.toLocaleString()}</p>
                      </div>
                    </div>

                    <Button variant="secondary" size="sm">
                      查看详情
                    </Button>
                  </div>

                  {student.achievements.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <p className="text-gray-400 text-sm mb-2">获得成就：</p>
                      <div className="flex flex-wrap gap-2">
                        {student.achievements.map((achievement, index) => (
                          <span key={index} className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs flex items-center">
                            <Award className="w-3 h-3 mr-1" />
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'progress' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Weekly Progress Overview */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">6周进度概览</h2>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6].map((week) => {
                    const weekStudents = students.filter(s => s.currentWeek >= week);
                    const completionRate = (weekStudents.length / students.length) * 100;
                    
                    return (
                      <div key={week} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mr-3 ${
                            completionRate > 80 ? 'bg-emerald-500/20 text-emerald-400' :
                            completionRate > 60 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            W{week}
                          </div>
                          <span className="text-white">第{week}周</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-32 bg-slate-700 rounded-full h-2 mr-3">
                            <div 
                              className={`h-2 rounded-full ${
                                completionRate > 80 ? 'bg-emerald-500' :
                                completionRate > 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${completionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-400 text-sm w-12">{completionRate.toFixed(0)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Performance */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">各类学员表现</h2>
                <div className="space-y-4">
                  {categories.filter(c => c.id !== 'all').map((category) => {
                    const categoryStudents = students.filter(s => s.category === category.id);
                    const avgProgress = categoryStudents.reduce((sum, s) => sum + s.progress, 0) / categoryStudents.length || 0;
                    const avgRevenue = categoryStudents.reduce((sum, s) => sum + s.revenue, 0) / categoryStudents.length || 0;
                    
                    return (
                      <div key={category.id} className="bg-slate-700/50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-white font-medium">{category.label}</h3>
                          <span className="text-gray-400 text-sm">{category.count}人</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-400 text-sm">平均进度</p>
                            <p className="text-emerald-400 font-semibold">{avgProgress.toFixed(0)}%</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">平均营收</p>
                            <p className="text-yellow-400 font-semibold">¥{avgRevenue.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Engagement Metrics */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">参与度分析</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">周活跃度</span>
                    <span className="text-emerald-400 text-xl font-bold">{analytics.weeklyEngagement}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">平均完成率</span>
                    <span className="text-blue-400 text-xl font-bold">{analytics.completionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">MVP部署率</span>
                    <span className="text-purple-400 text-xl font-bold">
                      {Math.round((students.filter(s => s.mvpStatus === 'deployed').length / students.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Revenue Analytics */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">营收分析</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">学员总营收</span>
                    <span className="text-emerald-400 text-xl font-bold">¥{(analytics.totalRevenue / 10000).toFixed(0)}万</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">人均营收</span>
                    <span className="text-yellow-400 text-xl font-bold">
                      ¥{Math.round(analytics.totalRevenue / analytics.totalStudents).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">盈利学员比例</span>
                    <span className="text-blue-400 text-xl font-bold">
                      {Math.round((students.filter(s => s.revenue > 0).length / students.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Stories */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mt-8">
              <h2 className="text-2xl font-bold text-white mb-6">成功案例展示</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.filter(s => s.revenue > 10000).map((student) => (
                  <div key={student.id} className="bg-gradient-to-br from-emerald-500/10 to-purple-500/10 border border-emerald-500/20 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <img 
                        src={student.avatar} 
                        alt={student.name}
                        className="w-12 h-12 rounded-full border-2 border-emerald-500/50 mr-3"
                      />
                      <div>
                        <h3 className="text-white font-semibold">{student.name}</h3>
                        <p className="text-emerald-400 text-sm">{getCategoryLabel(student.category)}</p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                      <div className="text-center">
                        <p className="text-emerald-400 text-2xl font-bold">¥{student.revenue.toLocaleString()}</p>
                        <p className="text-gray-400 text-sm">月收入</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {student.achievements.slice(0, 2).map((achievement, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                          {achievement}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCourseManagement;