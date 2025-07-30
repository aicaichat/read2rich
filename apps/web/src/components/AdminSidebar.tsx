import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Users, DollarSign,
  MessageSquare, BarChart3, Settings, FileText,
  Shield, Bell, HelpCircle, LogOut, ChevronLeft,
  ChevronRight, Home, GraduationCap, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NavItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  path: string;
  badge?: number;
  children?: NavItem[];
}

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      name: '仪表盘',
      icon: LayoutDashboard,
      path: '/admin'
    },
    {
      id: 'courses',
      name: '课程管理',
      icon: BookOpen,
      path: '/admin/courses',
      badge: 24
    },
    {
      id: 'instructors',
      name: '讲师管理',
      icon: GraduationCap,
      path: '/admin/instructors',
      badge: 8
    },
    {
      id: 'users',
      name: '用户管理',
      icon: Users,
      path: '/admin/users',
      badge: 12847
    },
    {
      id: 'orders',
      name: '订单管理',
      icon: DollarSign,
      path: '/admin/orders',
      badge: 156
    },
    {
      id: 'content',
      name: '内容管理',
      icon: FileText,
      path: '/admin/content',
      children: [
        { id: 'articles', name: '文章管理', icon: FileText, path: '/admin/content/articles' },
        { id: 'prompts', name: '提示词库', icon: FileText, path: '/admin/content/prompts' },
        { id: 'templates', name: '模板管理', icon: FileText, path: '/admin/content/templates' }
      ]
    },
    {
      id: 'support',
      name: '客服管理',
      icon: MessageSquare,
      path: '/admin/support',
      badge: 8
    },
    {
      id: 'analytics',
      name: '数据分析',
      icon: BarChart3,
      path: '/admin/analytics',
      children: [
        { id: 'revenue', name: '收入分析', icon: BarChart3, path: '/admin/analytics/revenue' },
        { id: 'users', name: '用户分析', icon: BarChart3, path: '/admin/analytics/users' },
        { id: 'courses', name: '课程分析', icon: BarChart3, path: '/admin/analytics/courses' }
      ]
    },
    {
      id: 'system',
      name: '系统管理',
      icon: Settings,
      path: '/admin/system',
      children: [
        { id: 'settings', name: '系统设置', icon: Settings, path: '/admin/system/settings' },
        { id: 'permissions', name: '权限管理', icon: Shield, path: '/admin/system/permissions' },
        { id: 'logs', name: '系统日志', icon: FileText, path: '/admin/system/logs' }
      ]
    },
    {
      id: 'ai-crawler',
      name: 'AI抓取管理',
      icon: RefreshCw,
      path: '/admin/ai-crawler'
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isParentActive = (item: NavItem) => {
    if (item.children) {
      return item.children.some(child => isActive(child.path));
    }
    return isActive(item.path);
  };

  return (
    <motion.div
      initial={{ width: isCollapsed ? 80 : 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-800/90 backdrop-blur-sm border-r border-white/10 h-screen fixed left-0 top-0 z-40"
    >
      {/* 顶部Logo区域 */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">DeepNeed</span>
          </motion.div>
        )}
        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* 导航菜单 */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <div key={item.id}>
              {/* 主菜单项 */}
              <Link
                to={item.path}
                className={`group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isParentActive(item)
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${
                  isParentActive(item) ? 'text-emerald-400' : 'text-gray-400 group-hover:text-white'
                }`} />
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex-1 flex items-center justify-between"
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full">
                        {item.badge > 999 ? `${(item.badge / 1000).toFixed(1)}k` : item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </Link>

              {/* 子菜单 */}
              {item.children && !isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 0.2 }}
                  className="ml-8 mt-2 space-y-1"
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      to={child.path}
                      className={`group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(child.path)
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <child.icon className={`w-4 h-4 mr-3 flex-shrink-0 ${
                        isActive(child.path) ? 'text-emerald-400' : 'text-gray-400 group-hover:text-white'
                      }`} />
                      <span>{child.name}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* 底部操作区域 */}
      <div className="border-t border-white/10 p-4">
        <div className="space-y-2">
          {/* 返回前台 */}
          <Link
            to="/"
            className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Home className="w-5 h-5 mr-3 text-gray-400" />
            {!isCollapsed && <span>返回前台</span>}
          </Link>

          {/* 通知 */}
          <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
            <Bell className="w-5 h-5 mr-3 text-gray-400" />
            {!isCollapsed && (
              <div className="flex-1 flex items-center justify-between">
                <span>通知</span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
              </div>
            )}
          </button>

          {/* 帮助 */}
          <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
            <HelpCircle className="w-5 h-5 mr-3 text-gray-400" />
            {!isCollapsed && <span>帮助</span>}
          </button>

          {/* 退出登录 */}
          <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            {!isCollapsed && <span>退出登录</span>}
          </button>
        </div>

        {/* 用户信息 */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 pt-4 border-t border-white/10"
          >
            <div className="flex items-center space-x-3">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                alt="管理员"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">管理员</p>
                <p className="text-xs text-gray-400">admin@deepneed.com</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminSidebar; 