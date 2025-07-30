import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, Search, Filter, Eye, Edit, 
  CheckCircle, XCircle, Clock, AlertCircle,
  Download, Upload, MoreHorizontal, CreditCard,
  Calendar, User, BookOpen, TrendingUp,
  ArrowUpRight, ArrowDownRight, RefreshCw,
  Smartphone, ShoppingCart, Trash2
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Order, orderManager } from '../lib/order-management';

const AdminOrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    completed: 0,
    cancelled: 0,
    refunded: 0,
    totalRevenue: 0,
    totalDiscount: 0
  });

  const statuses = [
    { id: 'all', name: '全部状态', color: 'text-gray-400' },
    { id: 'pending', name: '待支付', color: 'text-yellow-400' },
    { id: 'paid', name: '已支付', color: 'text-blue-400' },
    { id: 'completed', name: '已完成', color: 'text-emerald-400' },
    { id: 'cancelled', name: '已取消', color: 'text-red-400' },
    { id: 'refunded', name: '已退款', color: 'text-purple-400' }
  ];

  const paymentMethods = [
    { id: 'all', name: '全部方式', icon: CreditCard },
    { id: 'alipay', name: '支付宝', icon: Smartphone },
    { id: 'wechat', name: '微信支付', icon: Smartphone },
    { id: 'card', name: '银行卡', icon: CreditCard },
    { id: 'other', name: '其他', icon: ShoppingCart }
  ];

  // 加载订单数据
  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const allOrders = await orderManager.getAllOrders();
      setOrders(allOrders);
      setFilteredOrders(allOrders);
      
      // 加载统计信息
      const orderStats = await orderManager.getOrderStats();
      setStats(orderStats as any);
    } catch (error) {
      console.error('加载订单失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 搜索和筛选
  const filterOrders = () => {
    let filtered = orders;

    // 搜索筛选
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 状态筛选
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    // 支付方式筛选
    if (selectedPaymentMethod !== 'all') {
      filtered = filtered.filter(order => order.paymentMethod === selectedPaymentMethod);
    }

    setFilteredOrders(filtered);
  };

  // 删除订单
  const handleDeleteOrder = async (orderId: number) => {
    if (window.confirm('确定要删除这个订单吗？此操作不可撤销。')) {
      try {
        await orderManager.deleteOrder(orderId);
        loadOrders();
      } catch (error) {
        console.error('删除订单失败:', error);
      }
    }
  };

  // 更新订单状态
  const handleUpdateStatus = async (orderId: number, status: Order['status']) => {
    try {
      await orderManager.updateOrderStatus(orderId, status);
      loadOrders();
    } catch (error) {
      console.error('更新订单状态失败:', error);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, selectedStatus, selectedPaymentMethod]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-500/20';
      case 'paid': return 'text-blue-400 bg-blue-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/20';
      case 'refunded': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'refunded': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'paid': return '已支付';
      case 'pending': return '待支付';
      case 'cancelled': return '已取消';
      case 'refunded': return '已退款';
      default: return '未知';
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'alipay': return '支付宝';
      case 'wechat': return '微信支付';
      case 'card': return '银行卡';
      case 'other': return '其他';
      default: return '未知';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'alipay': return <Smartphone className="w-4 h-4" />;
      case 'wechat': return <Smartphone className="w-4 h-4" />;
      case 'card': return <CreditCard className="w-4 h-4" />;
      case 'other': return <ShoppingCart className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
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
              <h1 className="text-2xl font-bold text-white">订单管理</h1>
              <p className="text-gray-400">管理所有订单和支付信息</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={loadOrders}
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
            { title: '总订单数', value: stats.total, icon: ShoppingCart, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
            { title: '总收入', value: `¥${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
            { title: '待处理', value: stats.pending, icon: Clock, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
            { title: '已完成', value: stats.completed, icon: CheckCircle, color: 'text-purple-400', bgColor: 'bg-purple-500/20' }
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
                placeholder="搜索订单号、用户名、课程..."
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

            {/* 支付方式筛选 */}
            <select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id} className="bg-slate-800">
                  {method.name}
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

        {/* 订单列表 */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">订单列表</h2>
              <span className="text-gray-400 text-sm">共 {filteredOrders.length} 个订单</span>
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
                      订单信息
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      用户信息
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      课程信息
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      金额
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      支付方式
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
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <h3 className="text-white font-medium mb-1">{order.orderNumber}</h3>
                          <p className="text-gray-400 text-sm">{formatDate(order.createdAt)}</p>
                          {order.notes && (
                            <p className="text-gray-500 text-xs mt-1">{order.notes}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <h4 className="text-white font-medium">{order.userName}</h4>
                          <p className="text-gray-400 text-sm">{order.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={order.courseImage}
                            alt={order.courseTitle}
                            className="w-12 h-8 object-cover rounded"
                          />
                          <div>
                            <h4 className="text-white font-medium text-sm">{order.courseTitle}</h4>
                            <p className="text-gray-400 text-xs">{order.instructorName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">¥{order.amount}</div>
                          {order.originalAmount > order.amount && (
                            <div className="text-gray-400 text-sm line-through">¥{order.originalAmount}</div>
                          )}
                          {order.discount > 0 && (
                            <div className="text-emerald-400 text-xs">优惠 ¥{order.discount}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getPaymentMethodIcon(order.paymentMethod)}
                          <span className="text-white text-sm">{getPaymentMethodName(order.paymentMethod)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusName(order.status)}
                          </span>
                        </div>
                        {order.paymentTime && (
                          <p className="text-gray-400 text-xs mt-1">支付: {formatDate(order.paymentTime)}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-400 hover:text-emerald-300"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteOrder(order.id)}
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

          {!isLoading && filteredOrders.length === 0 && (
            <div className="p-8 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">暂无订单数据</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderManagement; 