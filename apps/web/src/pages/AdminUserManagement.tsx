import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Search, Filter, Edit, Trash2, Eye, 
  Mail, Phone, Calendar, MapPin, Crown,
  Shield, UserCheck, UserX, MoreHorizontal,
  Star, BookOpen, DollarSign, Activity,
  CheckCircle, XCircle, AlertCircle, Download, Plus,
  RefreshCw, User, Upload, Clock
} from 'lucide-react';
import Button from '../components/ui/Button';
import { User as UserType, userManager } from '../lib/user-management';
import UserEditModal from '../components/UserEditModal';

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    pending: 0,
    admin: 0,
    instructor: 0,
    student: 0,
    guest: 0,
    verified: 0,
    totalSpent: 0,
    totalPoints: 0,
    totalCoursesEnrolled: 0,
    totalCoursesCompleted: 0
  });

  const roles = [
    { id: 'all', name: '全部角色', icon: Users },
    { id: 'admin', name: '管理员', icon: Shield },
    { id: 'instructor', name: '讲师', icon: Crown },
    { id: 'student', name: '学生', icon: User },
    { id: 'guest', name: '访客', icon: UserX }
  ];

  const statuses = [
    { id: 'all', name: '全部状态', color: 'text-gray-400' },
    { id: 'active', name: '活跃', color: 'text-emerald-400' },
    { id: 'inactive', name: '非活跃', color: 'text-red-400' },
    { id: 'suspended', name: '已暂停', color: 'text-yellow-400' },
    { id: 'pending', name: '待审核', color: 'text-blue-400' }
  ];

  const levels = [
    { id: 'all', name: '全部等级' },
    { id: 'bronze', name: '青铜' },
    { id: 'silver', name: '白银' },
    { id: 'gold', name: '黄金' },
    { id: 'platinum', name: '铂金' },
    { id: 'diamond', name: '钻石' }
  ];

  // 加载用户数据
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await userManager.getAllUsers();
      setUsers(allUsers);
      setFilteredUsers(allUsers);
      
      // 加载统计信息
      const userStats = await userManager.getUserStats();
      setStats(userStats as any);
    } catch (error) {
      console.error('加载用户失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 搜索和筛选
  const filterUsers = () => {
    let filtered = users;

    // 搜索筛选
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 角色筛选
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    // 状态筛选
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => user.status === selectedStatus);
    }

    // 等级筛选
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(user => user.level === selectedLevel);
    }

    setFilteredUsers(filtered);
  };

  // 处理用户操作成功
  const handleUserSuccess = () => {
    loadUsers();
  };

  // 删除用户
  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('确定要删除这个用户吗？此操作不可撤销。')) {
      try {
        await userManager.deleteUser(userId);
        loadUsers();
      } catch (error) {
        console.error('删除用户失败:', error);
      }
    }
  };

  // 更新用户状态
  const handleUpdateStatus = async (userId: number, status: UserType['status']) => {
    try {
      await userManager.updateUserStatus(userId, status);
      loadUsers();
    } catch (error) {
      console.error('更新用户状态失败:', error);
    }
  };

  // 更新用户角色
  const handleUpdateRole = async (userId: number, role: UserType['role']) => {
    try {
      await userManager.updateUserRole(userId, role);
      loadUsers();
    } catch (error) {
      console.error('更新用户角色失败:', error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole, selectedStatus, selectedLevel]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-400 bg-red-500/20';
      case 'instructor': return 'text-purple-400 bg-purple-500/20';
      case 'student': return 'text-blue-400 bg-blue-500/20';
      case 'guest': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-500/20';
      case 'inactive': return 'text-red-400 bg-red-500/20';
      case 'suspended': return 'text-yellow-400 bg-yellow-500/20';
      case 'pending': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'bronze': return 'text-amber-600 bg-amber-500/20';
      case 'silver': return 'text-gray-400 bg-gray-500/20';
      case 'gold': return 'text-yellow-400 bg-yellow-500/20';
      case 'platinum': return 'text-cyan-400 bg-cyan-500/20';
      case 'diamond': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return '管理员';
      case 'instructor': return '讲师';
      case 'student': return '学生';
      case 'guest': return '访客';
      default: return '未知';
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'active': return '活跃';
      case 'inactive': return '非活跃';
      case 'suspended': return '已暂停';
      case 'pending': return '待审核';
      default: return '未知';
    }
  };

  const getLevelName = (level: string) => {
    switch (level) {
      case 'bronze': return '青铜';
      case 'silver': return '白银';
      case 'gold': return '黄金';
      case 'platinum': return '铂金';
      case 'diamond': return '钻石';
      default: return '未知';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 顶部导航 */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">用户管理</h1>
              <p className="text-gray-400">管理所有用户信息和权限</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                添加用户
              </Button>
              <Button
                onClick={loadUsers}
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
            { title: '总用户数', value: stats.total, icon: Users, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
            { title: '活跃用户', value: stats.active, icon: UserCheck, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
            { title: '总收入', value: `¥${stats.totalSpent.toLocaleString()}`, icon: DollarSign, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
            { title: '总积分', value: stats.totalPoints.toLocaleString(), icon: Star, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' }
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="搜索用户名、邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* 角色筛选 */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id} className="bg-slate-800">
                  {role.name}
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

            {/* 等级筛选 */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              {levels.map((level) => (
                <option key={level.id} value={level.id} className="bg-slate-800">
                  {level.name}
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

        {/* 用户列表 */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">用户列表</h2>
              <span className="text-gray-400 text-sm">共 {filteredUsers.length} 位用户</span>
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
                      用户信息
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      角色状态
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      学习数据
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      消费积分
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      最后登录
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="text-white font-medium mb-1">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-gray-400 text-sm mb-1">@{user.username}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Mail className="w-3 h-3" />
                              <span>{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                                <Phone className="w-3 h-3" />
                                <span>{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {user.role === 'admin' && <Shield className="w-4 h-4 text-red-400" />}
                            {user.role === 'instructor' && <Crown className="w-4 h-4 text-purple-400" />}
                            {user.role === 'student' && <User className="w-4 h-4 text-blue-400" />}
                            {user.role === 'guest' && <UserX className="w-4 h-4 text-gray-400" />}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                              {getRoleName(user.role)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {user.status === 'active' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                            {user.status === 'inactive' && <XCircle className="w-4 h-4 text-red-400" />}
                            {user.status === 'suspended' && <AlertCircle className="w-4 h-4 text-yellow-400" />}
                            {user.status === 'pending' && <Clock className="w-4 h-4 text-blue-400" />}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                              {getStatusName(user.status)}
                            </span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(user.level)}`}>
                            {getLevelName(user.level)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <BookOpen className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-white">{user.coursesEnrolled}</span>
                            <span className="text-gray-400 ml-1">门课程</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-white">{user.coursesCompleted}</span>
                            <span className="text-gray-400 ml-1">门已完成</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Activity className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-white">{user.loginCount}</span>
                            <span className="text-gray-400 ml-1">次登录</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-white font-medium">¥{user.totalSpent}</div>
                          <div className="text-gray-400 text-sm">消费总额</div>
                          <div className="flex items-center text-sm">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-white">{user.points}</span>
                            <span className="text-gray-400 ml-1">积分</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          {user.lastLoginAt ? (
                            <div>
                              <p className="text-white text-sm">{formatDate(user.lastLoginAt)}</p>
                              <p className="text-gray-400 text-xs">最后登录</p>
                            </div>
                          ) : (
                            <p className="text-gray-400 text-sm">从未登录</p>
                          )}
                          <div className="mt-2">
                            <p className="text-gray-400 text-xs">{formatDate(user.createdAt)}</p>
                            <p className="text-gray-400 text-xs">注册时间</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                            className="text-emerald-400 hover:text-emerald-300"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
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

          {!isLoading && filteredUsers.length === 0 && (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">暂无用户数据</p>
            </div>
          )}
        </div>
      </div>

      {/* 用户编辑弹窗 */}
      <UserEditModal
        isOpen={showAddModal || !!selectedUser}
        onClose={() => {
          setShowAddModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSuccess={handleUserSuccess}
      />
    </div>
  );
};

export default AdminUserManagement; 