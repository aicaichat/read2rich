import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, 
  Upload, Download, MoreHorizontal, Star,
  Users, Clock, DollarSign, BookOpen, 
  CheckCircle, XCircle, AlertCircle, RefreshCw
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Course, courseManager } from '../lib/course-management';
import CourseEditModal from '../components/CourseEditModal';

const AdminCourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
    hot: 0,
    new: 0,
    free: 0
  });

  const categories = [
    { id: 'all', name: '全部分类' },
    { id: 'AI开发', name: 'AI开发' },
    { id: '产品设计', name: '产品设计' },
    { id: '编程', name: '编程' },
    { id: '创业', name: '创业' },
    { id: '数据分析', name: '数据分析' },
    { id: '营销', name: '营销' }
  ];

  const statuses = [
    { id: 'all', name: '全部状态', color: 'text-gray-400' },
    { id: 'draft', name: '草稿', color: 'text-yellow-400' },
    { id: 'published', name: '已发布', color: 'text-emerald-400' },
    { id: 'archived', name: '已归档', color: 'text-red-400' }
  ];

  // 加载课程数据
  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const allCourses = await courseManager.getAllCourses();
      setCourses(allCourses);
      setFilteredCourses(allCourses);
      
      // 加载统计信息
      const courseStats = await courseManager.getCourseStats();
      setStats(courseStats as any);
    } catch (error) {
      console.error('加载课程失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 搜索和筛选
  const filterCourses = () => {
    let filtered = courses;

    // 搜索筛选
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 分类筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // 状态筛选
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(course => course.status === selectedStatus);
    }

    setFilteredCourses(filtered);
  };

  // 处理课程操作成功
  const handleCourseSuccess = () => {
    loadCourses();
  };

  // 删除课程
  const handleDeleteCourse = async (courseId: number) => {
    if (window.confirm('确定要删除这个课程吗？此操作不可撤销。')) {
      try {
        await courseManager.deleteCourse(courseId);
        loadCourses();
      } catch (error) {
        console.error('删除课程失败:', error);
      }
    }
  };

  // 批量删除课程
  const handleBatchDelete = async (courseIds: number[]) => {
    if (window.confirm(`确定要删除选中的 ${courseIds.length} 个课程吗？此操作不可撤销。`)) {
      try {
        await courseManager.deleteCourses(courseIds);
        loadCourses();
      } catch (error) {
        console.error('批量删除课程失败:', error);
      }
    }
  };

  // 更新课程状态
  const handleUpdateStatus = async (courseId: number, status: Course['status']) => {
    try {
      await courseManager.updateCourseStatus(courseId, status);
      loadCourses();
    } catch (error) {
      console.error('更新课程状态失败:', error);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedCategory, selectedStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-emerald-400 bg-emerald-500/20';
      case 'draft': return 'text-yellow-400 bg-yellow-500/20';
      case 'archived': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-emerald-400 bg-emerald-500/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'published': return '已发布';
      case 'draft': return '草稿';
      case 'archived': return '已归档';
      default: return '未知';
    }
  };

  const getLevelName = (level: string) => {
    switch (level) {
      case 'beginner': return '初级';
      case 'intermediate': return '中级';
      case 'advanced': return '高级';
      default: return '未知';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 顶部导航 */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">课程管理</h1>
              <p className="text-gray-400">管理所有课程内容</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                添加课程
              </Button>
              <Button
                onClick={loadCourses}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: '总课程数', value: stats.total, icon: BookOpen, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
            { title: '已发布', value: stats.published, icon: CheckCircle, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
            { title: '草稿', value: stats.draft, icon: Clock, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
            { title: '热门课程', value: stats.hot, icon: Star, color: 'text-purple-400', bgColor: 'bg-purple-500/20' }
          ].map((stat, index) => (
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
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="搜索课程..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* 分类筛选 */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id} className="bg-slate-800">
                  {category.name}
                </option>
              ))}
            </select>

            {/* 状态筛选 */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              {statuses.map((status) => (
                <option key={status.id} value={status.id} className="bg-slate-800">
                  {status.name}
                </option>
              ))}
            </select>

            {/* 操作按钮 */}
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Upload className="w-4 h-4 mr-2" />
                导入
              </Button>
            </div>
          </div>
        </div>

        {/* 课程列表 */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">课程列表</h2>
              <span className="text-gray-400 text-sm">共 {filteredCourses.length} 门课程</span>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">加载中...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      课程信息
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      讲师
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      价格
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      数据
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-16 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="text-white font-medium mb-1">{course.title}</h3>
                            <p className="text-gray-400 text-sm mb-2">{course.subtitle}</p>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                                {getLevelName(course.level)}
                              </span>
                              {course.isHot && (
                                <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                                  热门
                                </span>
                              )}
                              {course.isNew && (
                                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                                  新课
                                </span>
                              )}
                              {course.isFree && (
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                                  免费
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <img
                            src={course.instructor.avatar}
                            alt={course.instructor.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-white">{course.instructor.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">
                            {course.isFree ? '免费' : `¥${course.price}`}
                          </div>
                          {!course.isFree && course.originalPrice > course.price && (
                            <div className="text-gray-400 text-sm line-through">
                              ¥{course.originalPrice}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Users className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-white">{course.students.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-white">{course.rating}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-gray-400">{course.duration}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                          {getStatusName(course.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCourse(course)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCourse(course)}
                            className="text-emerald-400 hover:text-emerald-300"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCourse(course.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && filteredCourses.length === 0 && (
            <div className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">暂无课程数据</p>
            </div>
          )}
        </div>
      </div>

      {/* 课程编辑弹窗 */}
      <CourseEditModal
        isOpen={showAddModal || !!selectedCourse}
        onClose={() => {
          setShowAddModal(false);
          setSelectedCourse(null);
        }}
        course={selectedCourse}
        onSuccess={handleCourseSuccess}
      />
    </div>
  );
};

export default AdminCourseManagement; 