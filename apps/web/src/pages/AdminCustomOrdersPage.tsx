import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, RefreshCw } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import Button from '@/components/ui/Button';
import { customOrderAPI } from '@/lib/api';

type OrderRow = {
  order_number: string;
  company: string;
  name: string;
  contact: string;
  status: string;
  project_title?: string;
  created_at?: string;
};

const AdminCustomOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await customOrderAPI.list();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary-400" />
            <h1 className="text-2xl font-bold text-white">定制预约订单</h1>
          </div>
          <Button onClick={fetchOrders} disabled={loading} className="bg-slate-700 hover:bg-slate-600">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> 刷新
          </Button>
        </motion.div>

        <div className="bg-dark-300 rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">订单号</th>
                <th className="px-4 py-3 text-left">项目</th>
                <th className="px-4 py-3 text-left">公司/团队</th>
                <th className="px-4 py-3 text-left">联系人</th>
                <th className="px-4 py-3 text-left">联系方式</th>
                <th className="px-4 py-3 text-left">状态</th>
                <th className="px-4 py-3 text-left">时间</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.order_number} className="border-t border-white/5 text-gray-200">
                  <td className="px-4 py-3 font-mono">{o.order_number}</td>
                  <td className="px-4 py-3">{o.project_title || '-'}</td>
                  <td className="px-4 py-3">{o.company}</td>
                  <td className="px-4 py-3">{o.name}</td>
                  <td className="px-4 py-3">{o.contact}</td>
                  <td className="px-4 py-3">{o.status}</td>
                  <td className="px-4 py-3">{o.created_at ? new Date(o.created_at).toLocaleString() : '-'}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-400" colSpan={7}>暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomOrdersPage;


