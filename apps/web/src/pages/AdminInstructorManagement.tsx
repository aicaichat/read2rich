import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, 
  Upload, Download, MoreHorizontal, Star,
  Users, BookOpen, User, Mail, Briefcase,
  CheckCircle, XCircle, Clock, RefreshCw,
  Linkedin, Twitter, Github, Globe
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Instructor, instructorManager } from '../lib/instructor-management';
import InstructorEditModal from '../components/InstructorEditModal';

const AdminInstructorManagement: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [filteredInstructors, setFilteredInstructors] = useState<Instructor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
    totalStudents: 0,
    totalCourses: 0,
    avgRating: 0
  });

  const statuses = [
    { id: 'all', name: '全部状态', color: 'text-gray-400' },
    { id: 'active', name: '活跃', color: 'text-emerald-400' },
    { id: 'inactive', name: '非活跃', color: 'text-red-400' },
    { id: 'pending', name: '待审核', color: 'text-yellow-400' }
  ];

  const expertiseAreas = [
    { id: 'all', name: '全部领域' },
    { id: 'AI产品设计', name: 'AI产品设计' },
    { id: '产品管理', name: '产品管理' },
    { id: '编程', name: '编程' },
    { id: 'AI开发', name: 'AI开发' },
    { id: '创业', name: '创业' },
    { id: '机器学习', name: '机器学习' }
  ];

  // 加载讲师数据
  const loadInstructors = async () => {
    setIsLoading(true);
    try {
      const allInstructors = await instructorManager.getAllInstructors();
      setInstructors(allInstructors);
      setFilteredInstructors(allInstructors);
      
      // 加载统计信息
      const instructorStats = await instructorManager.getInstructorStats();
      setStats(instructorStats as any);
    } catch (error) {
      console.error('加载讲师失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 搜索和筛选
  const filterInstructors = () => {
    let filtered = instructors;

    // 搜索筛选
    if (searchTerm) {
      filtered = filtered.filter(instructor =>
        instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 状态筛选
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(instructor => instructor.status === selectedStatus);
    }

    // 专业领域筛选
    if (selectedExpertise !== 'all') {
      filtered = filtered.filter(instructor => 
        instructor.expertise.includes(selectedExpertise)
      );
    }

    setFilteredInstructors(filtered);
  };

  // 处理讲师操作成功
  const handleInstructorSuccess = () => {
    loadInstructors();
  };

  // 删除讲师
  const handleDeleteInstructor = async (instructorId: number) => {
    if (window.confirm('确定要删除这个讲师吗？此操作不可撤销。')) {
      try {
        await instructorManager.deleteInstructor(instructorId);
        loadInstructors();
      } catch (error) {
        console.error('删除讲师失败:', error);
      }
    }
  };

  // 更新讲师状态
  const handleUpdateStatus = async (instructorId: number, status: Instructor['status']) => {
    try {
      await instructorManager.updateInstructorStatus(instructorId, status);
      loadInstructors();
    } catch (error) {
      console.error('更新讲师状态失败:', error);
    }
  };

  useEffect(() => {
    loadInstructors();
  }, []);

  useEffect(() => {
    filterInstructors();
  }, [instructors, searchTerm, selectedStatus, selectedExpertise]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-500/20';
      case 'inactive': return 'text-red-400 bg-red-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'active': return '活跃';
      case 'inactive': return '非活跃';
      case 'pending': return '待审核';
      default: return '未知';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 顶部导航 */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">讲师管理</h1>
              <p className="text-gray-400">管理所有讲师信息</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                添加讲师
              </Button>
              <Button
                onClick={loadInstructors}
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
            { title: '总讲师数', value: stats.total, icon: User, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
            { title: '活跃讲师', value: stats.active, icon: CheckCircle, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
            { title: '总学生数', value: stats.totalStudents.toLocaleString(), icon: Users, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
            { title: '平均评分', value: stats.avgRating.toFixed(1), icon: Star, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' }
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
                placeholder="搜索讲师..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

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

            {/* 专业领域筛选 */}
            <select
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              {expertiseAreas.map((area) => (
                <option key={area.id} value={area.id} className="bg-slate-800">
                  {area.name}
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

        {/* 讲师列表 */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">讲师列表</h2>
              <span className="text-gray-400 text-sm">共 {filteredInstructors.length} 位讲师</span>
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
                      讲师信息
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      专业领域
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      数据统计
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
                  {filteredInstructors.map((instructor) => (
                    <tr key={instructor.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={instructor.avatar}
                            alt={instructor.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="text-white font-medium mb-1">{instructor.name}</h3>
                            <p className="text-gray-400 text-sm mb-1">{instructor.title}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Mail className="w-3 h-3" />
                              <span>{instructor.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                              <Briefcase className="w-3 h-3" />
                              <span>{instructor.experience} 年经验</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {instructor.expertise.slice(0, 3).map((exp, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs"
                            >
                              {exp}
                            </span>
                          ))}
                          {instructor.expertise.length > 3 && (
                            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                              +{instructor.expertise.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <BookOpen className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-white">{instructor.courses}</span>
                            <span className="text-gray-400 ml-1">门课程</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Users className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-white">{instructor.students.toLocaleString()}</span>
                            <span className="text-gray-400 ml-1">名学生</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-white">{instructor.rating}</span>
                            <span className="text-gray-400 ml-1">分</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(instructor.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(instructor.status)}`}>
                            {getStatusName(instructor.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedInstructor(instructor)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedInstructor(instructor)}
                            className="text-emerald-400 hover:text-emerald-300"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteInstructor(instructor.id)}
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

          {!isLoading && filteredInstructors.length === 0 && (
            <div className="p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">暂无讲师数据</p>
            </div>
          )}
        </div>
      </div>

      {/* 讲师编辑弹窗 */}
      <InstructorEditModal
        isOpen={showAddModal || !!selectedInstructor}
        onClose={() => {
          setShowAddModal(false);
          setSelectedInstructor(null);
        }}
        instructor={selectedInstructor}
        onSuccess={handleInstructorSuccess}
      />
    </div>
  );
};

export default AdminInstructorManagement; 