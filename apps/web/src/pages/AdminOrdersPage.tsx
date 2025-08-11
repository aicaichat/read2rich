import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

type OrderItem = {
  order_number: string;
  amount: number;
  payment_method: string;
  status: string;
  channel?: string;
  product_type?: string;
  order_source?: string;
  created_at?: string;
};

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/orders').then(r=>r.json());
      setOrders(res || []);
    } catch (e) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-white">支付订单</h1>
          <button onClick={fetchOrders} className="px-3 py-2 rounded bg-white/10 text-white hover:bg-white/20">刷新</button>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm text-gray-200">
            <thead>
              <tr className="text-left border-b border-white/10">
                <th className="py-2 pr-4">订单号</th>
                <th className="py-2 pr-4">金额</th>
                <th className="py-2 pr-4">方式</th>
                <th className="py-2 pr-4">状态</th>
                <th className="py-2 pr-4">渠道</th>
                <th className="py-2 pr-4">类型</th>
                <th className="py-2 pr-4">来源</th>
                <th className="py-2 pr-4">创建时间</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="py-4" colSpan={8}>加载中...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td className="py-4" colSpan={8}>暂无数据</td></tr>
              ) : orders.map(o => (
                <tr key={o.order_number} className="border-b border-white/5">
                  <td className="py-2 pr-4">{o.order_number}</td>
                  <td className="py-2 pr-4">¥{o.amount?.toFixed?.(2) ?? '-'}</td>
                  <td className="py-2 pr-4">{o.payment_method}</td>
                  <td className="py-2 pr-4">{o.status}</td>
                  <td className="py-2 pr-4">{o.channel || '-'}</td>
                  <td className="py-2 pr-4">{o.product_type || '-'}</td>
                  <td className="py-2 pr-4">{o.order_source || '-'}</td>
                  <td className="py-2 pr-4">{o.created_at || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;


