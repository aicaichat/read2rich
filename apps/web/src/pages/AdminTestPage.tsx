import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, XCircle, AlertCircle, RefreshCw,
  BookOpen, GraduationCap, Users, DollarSign
} from 'lucide-react';
import Button from '../components/ui/Button';
import { courseManager } from '../lib/course-management';
import { instructorManagerFixed as instructorManager } from '../lib/instructor-management';
import { orderManager } from '../lib/order-management';

const AdminTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    courses: { success: boolean; message: string; data?: any };
    instructors: { success: boolean; message: string; data?: any };
    orders: { success: boolean; message: string; data?: any };
  }>({
    courses: { success: false, message: '未测试', data: undefined },
    instructors: { success: false, message: '未测试', data: undefined },
    orders: { success: false, message: '未测试', data: undefined }
  });

  const [isLoading, setIsLoading] = useState(false);

  const runAllTests = async () => {
    setIsLoading(true);
    const results: {
      courses: { success: boolean; message: string; data?: any };
      instructors: { success: boolean; message: string; data?: any };
      orders: { success: boolean; message: string; data?: any };
    } = {
      courses: { success: false, message: '测试中...', data: undefined },
      instructors: { success: false, message: '测试中...', data: undefined },
      orders: { success: false, message: '测试中...', data: undefined }
    };

    try {
      // 测试课程管理
      const courses = await courseManager.getAllCourses();
      const courseStats = await courseManager.getCourseStats();
      results.courses = {
        success: true,
        message: `成功加载 ${courses.length} 门课程，统计信息正常`,
        data: { courses: courses.length, stats: courseStats }
      };

      // 测试讲师管理
      const instructors = await instructorManager.getAllInstructors();
      const instructorStats = await instructorManager.getInstructorStats();
      results.instructors = {
        success: true,
        message: `成功加载 ${instructors.length} 位讲师，统计信息正常`,
        data: { instructors: instructors.length, stats: instructorStats }
      };

      // 测试订单管理
      const orders = await orderManager.getAllOrders();
      const orderStats = await orderManager.getOrderStats();
      results.orders = {
        success: true,
        message: `成功加载 ${orders.length} 个订单，统计信息正常`,
        data: { orders: orders.length, stats: orderStats }
      };

    } catch (error) {
      console.error('测试失败:', error);
      if (!results.courses.success) {
        results.courses = { success: false, message: `课程管理测试失败: ${error}` };
      }
      if (!results.instructors.success) {
        results.instructors = { success: false, message: `讲师管理测试失败: ${error}` };
      }
      if (!results.orders.success) {
        results.orders = { success: false, message: `订单管理测试失败: ${error}` };
      }
    }

    setTestResults(results);
    setIsLoading(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const getStatusIcon = (success: boolean) => {
    if (success) {
      return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'text-emerald-400' : 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 顶部导航 */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">管理功能测试</h1>
              <p className="text-gray-400">验证所有管理功能是否正常工作</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={runAllTests}
                disabled={isLoading}
                className="bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    测试中...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    重新测试
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 测试结果 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: '课程管理',
              icon: BookOpen,
              result: testResults.courses,
              color: 'text-blue-400',
              bgColor: 'bg-blue-500/20'
            },
            {
              title: '讲师管理',
              icon: GraduationCap,
              result: testResults.instructors,
              color: 'text-emerald-400',
              bgColor: 'bg-emerald-500/20'
            },
            {
              title: '订单管理',
              icon: DollarSign,
              result: testResults.orders,
              color: 'text-purple-400',
              bgColor: 'bg-purple-500/20'
            }
          ].map((test, index) => (
            <motion.div
              key={test.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${test.bgColor} rounded-lg flex items-center justify-center`}>
                  <test.icon className={`w-6 h-6 ${test.color}`} />
                </div>
                {getStatusIcon(test.result.success)}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{test.title}</h3>
              <p className={`text-sm mb-4 ${getStatusColor(test.result.success)}`}>
                {test.result.message}
              </p>
              {test.result.data && (
                <div className="bg-white/5 rounded-lg p-3">
                  <h4 className="text-white font-medium text-sm mb-2">测试数据:</h4>
                  <pre className="text-xs text-gray-400 overflow-auto">
                    {JSON.stringify(test.result.data, null, 2)}
                  </pre>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* 功能说明 */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">功能说明</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-3">课程管理功能</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• 课程列表展示和搜索</li>
                <li>• 课程创建、编辑、删除</li>
                <li>• 课程状态管理（草稿、已发布、已归档）</li>
                <li>• 课程分类和标签管理</li>
                <li>• 课程统计信息</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-3">讲师管理功能</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• 讲师信息管理</li>
                <li>• 专业领域和职称管理</li>
                <li>• 社交媒体链接管理</li>
                <li>• 讲师状态管理</li>
                <li>• 讲师统计信息</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-3">订单管理功能</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• 订单列表和搜索</li>
                <li>• 订单状态管理</li>
                <li>• 支付方式统计</li>
                <li>• 收入统计</li>
                <li>• 订单详情查看</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-3">访问地址</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• 课程管理: <span className="text-emerald-400">/admin/courses</span></li>
                <li>• 讲师管理: <span className="text-emerald-400">/admin/instructors</span></li>
                <li>• 订单管理: <span className="text-emerald-400">/admin/orders</span></li>
                <li>• 用户管理: <span className="text-emerald-400">/admin/users</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTestPage; 