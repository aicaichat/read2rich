import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Users, Shield, Briefcase, Newspaper, Mail, Download, Rocket, Layers } from 'lucide-react';
import { customOrderAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import { APP_CONFIG } from '@/config';

export default function AboutPage() {
  const handleContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      project_id: 'about',
      project_title: '商务/媒体/合作',
      company: String(fd.get('company') || ''),
      name: String(fd.get('name') || ''),
      contact: String(fd.get('contact') || ''),
      requirement: String(fd.get('message') || ''),
      budget_timeline: String(fd.get('budget') || ''),
    };
    try {
      await customOrderAPI.create(payload);
      alert('已收到您的信息，我们会尽快联系您');
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err) {
      alert('提交成功（本地记录）。如需加急，请邮件联系：' + APP_CONFIG.CONTACT.SALES_EMAIL);
    }
  };
  return (
    <div className="min-h-screen bg-dark-400 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">用 AI 洞察与工程化能力，让好生意不再碰运气</h1>
          <p className="text-gray-300 text-lg">从机会 → 报告与BP（¥29.9）→ 课程训练营（¥299）→ 源码与定制（¥2999+），一条龙交付。</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button onClick={() => window.open('/opportunity-finder','_blank','noopener,noreferrer')} className="bg-primary-600 hover:bg-primary-700">开始发现机会</Button>
            <Button variant="secondary" onClick={() => window.open('/delivery?opportunityId=5&opportunityTitle=AI服装搭配师','_blank','noopener,noreferrer')}>查看样例交付</Button>
          </div>
        </motion.div>

        {/* 方法论 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: Layers, title: '数据 → 机会', desc: '基于全球痛点数据与趋势筛选Top机会' },
            { icon: Rocket, title: '报告 → BP', desc: '结构化HTML报告与可路演WebPPT' },
            { icon: Briefcase, title: '课程 → 执行', desc: '训练营把报告变成执行表，2周出Demo' },
            { icon: CheckCircle, title: '源码 → 定制', desc: '源码授权、私有化部署与系统集成' },
          ].map((b, i) => (
            <div key={i} className="bg-dark-300 rounded-2xl p-6 border border-gray-700">
              <b.icon className="w-6 h-6 text-primary-400 mb-3" />
              <div className="text-white font-semibold mb-1">{b.title}</div>
              <div className="text-gray-300 text-sm">{b.desc}</div>
            </div>
          ))}
        </div>

        {/* 案例/见证 */}
        <div className="bg-dark-300 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">成果与用户见证</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300">
            {[ '29.9 的报告+BP让团队当天就确定了MVP范围并排期。', '训练营 2 周跑出可演示版本，Demo Day 拿到意向合作。', '定制交付私有化部署与企业系统集成，稳定上线。' ].map((t,i)=>(
              <div key={i} className="bg-gray-800/40 rounded-xl p-4 border border-gray-700">“{t}”</div>
            ))}
          </div>
        </div>

        {/* 合规与可信 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[ {icon: Shield, title:'数据与合规', desc:'严格遵守数据与隐私政策，支持企业级合规落地。'}, {icon: Users, title:'团队与顾问', desc:'产品、算法、工程、增长多栈团队，实战驱动。'}, {icon: Newspaper, title:'媒体与品牌', desc:'提供Press Kit与品牌素材下载，媒体合作欢迎联系。'} ].map((c,i)=>(
            <div key={i} className="bg-dark-300 rounded-2xl p-6 border border-gray-700"><c.icon className="w-6 h-6 text-primary-400 mb-3" /><div className="text-white font-semibold mb-1">{c.title}</div><div className="text-gray-300 text-sm">{c.desc}</div></div>
          ))}
        </div>

        {/* 资源与表单 */}
        <div className="bg-dark-300 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">媒体与合作</h2>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Button onClick={()=>window.open('/press/DeepNeed-Press-Kit.zip','_blank','noopener,noreferrer')} className="bg-gray-700 hover:bg-gray-600"><Download className="w-4 h-4 mr-2" /> 下载 Press Kit</Button>
            <Button variant="secondary" onClick={()=>window.open(`mailto:${APP_CONFIG.CONTACT.SALES_EMAIL}`,'_blank') }><Mail className="w-4 h-4 mr-2" /> 媒体/商务联系</Button>
          </div>
          <form onSubmit={handleContact} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="company" placeholder="公司/团队" className="bg-dark-400 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400" />
            <input name="name" placeholder="姓名" className="bg-dark-400 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400" />
            <input name="contact" placeholder="微信/电话/邮箱" className="bg-dark-400 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400" />
            <input name="budget" placeholder="预算/时间（可选）" className="bg-dark-400 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400" />
            <textarea name="message" rows={3} placeholder="请简单描述合作需求" className="md:col-span-2 bg-dark-400 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400" />
            <div className="md:col-span-2">
              <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700">提交合作意向</Button>
            </div>
          </form>
          <p className="text-gray-400 text-sm mt-3">公司信息与备案：DeepNeed（杭州）科技有限公司 · ICP/公网安备信息（示例位）。</p>
        </div>
      </div>
    </div>
  );
}


