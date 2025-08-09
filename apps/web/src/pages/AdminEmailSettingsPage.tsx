import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/AdminLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import api from '@/lib/api';

type Settings = {
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_pass: string;
  use_tls: boolean;
  from_address: string;
};

const AdminEmailSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    smtp_host: 'localhost',
    smtp_port: 25,
    smtp_user: '',
    smtp_pass: '',
    use_tls: false,
    from_address: 'no-reply@deepneed.com'
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const resp = await api.get('/email/settings');
    setSettings({ ...settings, ...resp.data });
  };

  const save = async () => {
    setSaving(true);
    await api.post('/email/settings', settings);
    setSaving(false);
    alert('已保存');
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 max-w-3xl">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-white mb-6">
          邮件(SMTP)配置
        </motion.h1>
        <div className="space-y-4 bg-dark-300 rounded-xl border border-white/10 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input value={settings.smtp_host} onChange={e => setSettings({ ...settings, smtp_host: e.target.value })} placeholder="SMTP 主机" />
            <Input type="number" value={settings.smtp_port} onChange={e => setSettings({ ...settings, smtp_port: Number(e.target.value) })} placeholder="SMTP 端口" />
            <Input value={settings.smtp_user} onChange={e => setSettings({ ...settings, smtp_user: e.target.value })} placeholder="用户名(可选)" />
            <Input type="password" value={settings.smtp_pass} onChange={e => setSettings({ ...settings, smtp_pass: e.target.value })} placeholder="密码(可选)" />
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" checked={settings.use_tls} onChange={e => setSettings({ ...settings, use_tls: e.target.checked })} />
              启用 TLS
            </label>
            <Input value={settings.from_address} onChange={e => setSettings({ ...settings, from_address: e.target.value })} placeholder="发件人地址" />
          </div>
          <Button onClick={save} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
            {saving ? '保存中...' : '保存'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEmailSettingsPage;


