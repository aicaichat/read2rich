import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';

interface PaymentSettings {
  wechat_app_id: string;
  wechat_merchant_id: string;
  wechat_api_key: string;
  wechat_cert_path: string;
  wechat_key_path: string;
  alipay_app_id: string;
  alipay_private_key: string;
  alipay_public_key: string;
  stripe_secret_key: string;
  stripe_webhook_secret: string;
}

export default function AdminPaymentSettingsPage() {
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/payment/settings');
      const data = await res.json();
      setSettings(data);
    } catch (e: any) {
      setError(e.message || '加载失败');
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/payment/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || '保存失败');
      }
      await loadSettings();
      alert('已保存');
    } catch (e: any) {
      setError(e.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-white">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-white">支付配置</h1>
        {error && <div className="text-red-400">{error}</div>}

        <section className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">微信支付</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white" placeholder="App ID" value={settings.wechat_app_id} onChange={e=>setSettings({...settings, wechat_app_id: e.target.value})}/>
            <input className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white" placeholder="商户号" value={settings.wechat_merchant_id} onChange={e=>setSettings({...settings, wechat_merchant_id: e.target.value})}/>
            <input className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white" placeholder="API Key" value={settings.wechat_api_key} onChange={e=>setSettings({...settings, wechat_api_key: e.target.value})}/>
            <input className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white" placeholder="证书路径" value={settings.wechat_cert_path} onChange={e=>setSettings({...settings, wechat_cert_path: e.target.value})}/>
            <input className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white" placeholder="私钥路径" value={settings.wechat_key_path} onChange={e=>setSettings({...settings, wechat_key_path: e.target.value})}/>
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">支付宝</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white" placeholder="App ID" value={settings.alipay_app_id} onChange={e=>setSettings({...settings, alipay_app_id: e.target.value})}/>
            <textarea className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white md:col-span-2" rows={4} placeholder="私钥" value={settings.alipay_private_key} onChange={e=>setSettings({...settings, alipay_private_key: e.target.value})}/>
            <textarea className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white md:col-span-2" rows={4} placeholder="公钥" value={settings.alipay_public_key} onChange={e=>setSettings({...settings, alipay_public_key: e.target.value})}/>
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Stripe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white" placeholder="Secret Key" value={settings.stripe_secret_key} onChange={e=>setSettings({...settings, stripe_secret_key: e.target.value})}/>
            <input className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white" placeholder="Webhook Secret" value={settings.stripe_webhook_secret} onChange={e=>setSettings({...settings, stripe_webhook_secret: e.target.value})}/>
          </div>
        </section>

        <div className="flex justify-end">
          <Button onClick={saveSettings} disabled={saving} className="bg-emerald-600 hover:bg-emerald-500">
            {saving ? '保存中...' : '保存配置'}
          </Button>
        </div>
      </div>
    </div>
  );
}


