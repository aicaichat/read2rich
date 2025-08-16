import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Button from '@/components/ui/Button';

type Row = { id: number; name: string; ts: string; props: Record<string, any> };

export default function AdminAnalyticsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/analytics');
      const data = await res.json();
      setRows(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // 简单聚合
  const counts = rows.reduce((acc, r) => { acc[r.name] = (acc[r.name] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">转化分析</h1>
          <Button onClick={load} disabled={isLoading}>{isLoading ? '加载中...' : '刷新'}</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(counts).map(([k, v]) => (
            <div key={k} className="bg-dark-300 rounded-xl p-4 border border-gray-700">
              <div className="text-gray-400 text-sm">{k}</div>
              <div className="text-2xl font-bold text-white">{v}</div>
            </div>
          ))}
        </div>
        <div className="bg-dark-300 rounded-xl p-4 border border-gray-700 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400">
                <th className="text-left p-2">时间</th>
                <th className="text-left p-2">事件</th>
                <th className="text-left p-2">属性</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-t border-gray-700">
                  <td className="p-2 text-gray-400">{new Date(r.ts).toLocaleString()}</td>
                  <td className="p-2 text-white">{r.name}</td>
                  <td className="p-2 text-gray-300 whitespace-pre-wrap">{JSON.stringify(r.props)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}



