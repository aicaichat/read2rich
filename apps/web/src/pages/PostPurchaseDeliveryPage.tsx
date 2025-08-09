import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, GraduationCap, Sparkles, ExternalLink, ListChecks, FileText, Code, Smartphone } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import GenerationProgress from '@/components/GenerationProgress';
import { APP_CONFIG } from '@/config';
import { reportGenerator } from '@/lib/premiumReportGenerator';
import { getReportUrlFromOSS, getBpRevealUrlFromOSS, openUrlAsInlineHtml } from '@/lib/oss-links';
import { reportsAPI, customOrderAPI } from '@/lib/api';

export default function PostPurchaseDeliveryPage() {
  const [searchParams] = useSearchParams();
  const [showProgress, setShowProgress] = useState(true);

  const opportunityId = searchParams.get('opportunityId') || '';
  const opportunityTitle = searchParams.get('opportunityTitle') || '机会报告';
  const orderId = searchParams.get('order_id') || searchParams.get('payment_id') || '';
  const score = searchParams.get('score');
  const difficulty = searchParams.get('difficulty');

  // 统一文件名规则：与批量生成脚本一致（中文、英文、连字符保留，其它替换为下划线）
  const sanitizeTitle = (name: string) => name.replace(/[^\w\u4e00-\u9fa5-]/g, '_');

  // 基于演示回退规则构造下载地址（与 generate-reports.cjs 的输出一致）
  const reportUrl = useMemo(() => {
    if (!opportunityId) return '';
    // AI服装搭配师（id: '5'）使用指定OSS PDF地址
    if (opportunityId === '5') {
      return 'https://ssswork.oss-cn-hangzhou.aliyuncs.com/%E9%A2%9C%E6%90%AD%E6%90%AD%E7%8E%84%E5%AD%A6%E7%A9%BF%E6%90%AD%E5%9C%BA%E6%99%AF%E5%BA%94%E7%94%A8BP.pdf';
    }
    // 其它项目暂以 WebPPT 作为BP展示
    const filename = `${sanitizeTitle(opportunityTitle)}.reveal.html`;
    return `/bp/${filename}`;
  }, [opportunityId]);

  const quickStartKitUrl = useMemo(() => (
    opportunityId ? `/api/reports/quickstart/${opportunityId}-kit.zip` : ''
  ), [opportunityId]);

  const staticHtmlUrl = useMemo(() => {
    if (!opportunityId || !opportunityTitle) return '';
    const filename = `${sanitizeTitle(opportunityTitle)}.html`;
    return `/reports/${filename}`;
  }, [opportunityId, opportunityTitle]);

  useEffect(() => {
    if (!showProgress) return;
    const timer = setTimeout(() => setShowProgress(false), 3200);
    return () => clearTimeout(timer);
  }, [showProgress]);

  const openInNewTab = (url: string) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openHTMLReport = async () => {
    if (!opportunityId) return;
    // 1) 优先打开 OSS 直链
    try {
      const ossUrl = await getReportUrlFromOSS(opportunityTitle);
      if (ossUrl) {
        // 优先 inline 打开，避免直接下载
        const ok = await openUrlAsInlineHtml(ossUrl);
        if (ok) return;
        openInNewTab(ossUrl);
        return;
      }
    } catch {}
    // 2) 本地静态文件（开发环境）
    // 优先后端生成，失败回退前端渲染
    let html = '';
    try {
      html = await reportsAPI.generateHTML(opportunityId, opportunityTitle);
    } catch (e) {
      html = reportGenerator.generateHTMLReportDeep(opportunityId);
    }
    if (!html) return;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    openInNewTab(url);
    // 释放URL（延后，避免立即失效）
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const openBPWebPPT = async () => {
    if (!opportunityId || !opportunityTitle) return;
    // 优先 OSS 直链（Reveal 专业版）
    try {
      const oss = await getBpRevealUrlFromOSS(opportunityTitle);
      if (oss) {
        openInNewTab(oss);
        return;
      }
    } catch {}
    const filename = `${sanitizeTitle(opportunityTitle)}.reveal.html`;
    openInNewTab(`/bp/${filename}`);
  };

  return (
    <div className="min-h-screen bg-dark-400 pt-20">
      <GenerationProgress 
        isVisible={showProgress}
        onComplete={() => setShowProgress(false)}
        onError={() => setShowProgress(false)}
      />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">支付成功，内容已解锁</h1>
          <p className="text-gray-300">
            {orderId ? `订单号：${orderId} • ` : ''}已为你启动《{opportunityTitle}》交付流程
            {score ? ` • 总分: ${score}/10` : ''}
            {difficulty ? ` • 难度: ${difficulty}` : ''}
          </p>
        </motion.div>

        {/* 交付区：BP / Demo / 代码 / 课程 / 需求生成 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* BP 下载 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-300 rounded-2xl p-6 border border-gray-700"
          >
            <div className="text-center mb-4">
              <FileText className="w-10 h-10 text-primary-400 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-white">商业计划书（BP）</h3>
              <p className="text-gray-400 text-sm">PDF 版本，随时下载与分享</p>
            </div>
            {opportunityId === '5' && (
              <Button 
                disabled={!reportUrl}
                onClick={() => openInNewTab(reportUrl)}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500"
              >
                <Download className="w-4 h-4 mr-2" /> 下载BP
              </Button>
            )}
            <Button 
              onClick={openBPWebPPT}
              className="w-full mt-3 bg-amber-600 hover:bg-amber-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" /> 打开BP（WebPPT）
            </Button>
            <Button 
              onClick={openHTMLReport}
              className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" /> 查看HTML完整报告
            </Button>
            <Button 
              disabled={!quickStartKitUrl}
              onClick={() => openInNewTab(quickStartKitUrl)}
              className="w-full mt-3 bg-gray-700 hover:bg-gray-600"
            >
              <Download className="w-4 h-4 mr-2" /> 下载工具包
            </Button>
          </motion.div>

          {/* Demo 体验（仅对 AI服装搭配师 开放） */}
          {opportunityId === '5' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-dark-300 rounded-2xl p-6 border border-gray-700"
            >
              <div className="text-center mb-4">
                <Smartphone className="w-10 h-10 text-green-400 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-white">在线 Demo</h3>
                <p className="text-gray-400 text-sm">扫码即用，或直接打开体验</p>
              </div>
              <div className="flex items-center justify-center mb-3">
                <img src={APP_CONFIG.DEMO.CLOTHING_MATCHER_QR} alt="Demo QR" className="w-32 h-32 rounded-lg border border-gray-700" />
              </div>
              <Button onClick={() => window.open(APP_CONFIG.DEMO.CLOTHING_MATCHER_URL, '_blank', 'noopener,noreferrer')} className="w-full bg-green-600 hover:bg-green-700">
                <ExternalLink className="w-4 h-4 mr-2" /> 立即体验 Demo
              </Button>
            </motion.div>
          )}

          {/* 上手课程 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-dark-300 rounded-2xl p-6 border border-gray-700 flex flex-col"
          >
            <div className="text-center mb-4">
              <GraduationCap className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-white">10分钟上手课</h3>
              <p className="text-gray-400 text-sm">最快速度理解报告并做出第一个版本</p>
            </div>
            <div className="mt-auto">
              <Button onClick={() => window.open(`${window.location.origin}/course/1/learn`, '_blank', 'noopener,noreferrer')} className="w-full bg-indigo-600 hover:bg-indigo-700">
                <ExternalLink className="w-4 h-4 mr-2" /> 立即学习
              </Button>
            </div>
          </motion.div>

          {/* 定制需求预约表单 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="bg-dark-300 rounded-2xl p-6 border border-gray-700 flex flex-col"
          >
            <div className="text-center mb-4">
              <Sparkles className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-white">预约定制需求</h3>
              <p className="text-gray-400 text-sm">留下信息，我们将在24小时内与您确认方案</p>
            </div>
            <form
              className="space-y-3 bg-dark-200/40 border border-gray-700 rounded-xl p-4"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const formData = new FormData(form);
                const payload = {
                  opportunityId,
                  opportunityTitle,
                  orderId,
                  company: String(formData.get('company') || ''),
                  name: String(formData.get('name') || ''),
                  contact: String(formData.get('contact') || ''),
                  requirement: String(formData.get('requirement') || ''),
                  budgetTimeline: String(formData.get('budgetTimeline') || ''),
                  ts: Date.now()
                };
                try {
                  const key = 'dn_custom_requests';
                  const list = JSON.parse(localStorage.getItem(key) || '[]');
                  list.push(payload);
                  localStorage.setItem(key, JSON.stringify(list));
                  // 调用后端生成订单并发邮件
                  customOrderAPI.create({
                    project_id: opportunityId,
                    project_title: opportunityTitle,
                    company: payload.company,
                    name: payload.name,
                    contact: payload.contact,
                    requirement: payload.requirement,
                    budget_timeline: String(formData.get('budgetTimeline') || '')
                  }).then((res) => {
                    alert('预约已提交，订单号：' + res.order_number + '。我们将尽快联系您（也可添加微信：' + APP_CONFIG.CONTACT.WECHAT_ID + '）');
                  }).catch(() => {
                    alert('预约已提交（本地保存）。如需加急，请添加微信：' + APP_CONFIG.CONTACT.WECHAT_ID);
                  });
                  form.reset();
                } catch (err) {
                  console.error('save request failed', err);
                  alert('提交成功');
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input name="company" placeholder="公司/团队（必填）" required />
                <Input name="name" placeholder="姓名（必填）" required />
              </div>
              <Input name="contact" placeholder="微信/电话（必填）" required />
              <textarea
                name="requirement"
                placeholder="具体需求（必填）"
                required
                className="w-full rounded-lg bg-dark-300 border border-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
              />
              <Input name="budgetTimeline" placeholder="期望预算与时间（选填）" />
              <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                <Sparkles className="w-4 h-4 mr-2" /> 提交预约
              </Button>
              <div className="text-gray-400 text-xs mt-1 text-center">
                微信客服：{APP_CONFIG.CONTACT.WECHAT_ID}
              </div>
            </form>
          </motion.div>
        </div>

        {/* 首周行动清单（简版） */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <ListChecks className="w-6 h-6 mr-2" /> 首周 5 步行动清单
          </h2>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li>✓ 下载《{opportunityTitle}》完整报告与工具包</li>
            <li>✓ 学完“10分钟极速上手课”，完成第一个落地任务</li>
            <li>✓ 在需求生成器中创建冷启动方案草案</li>
            <li>✓ 从报告中挑选 1 个细分市场并验证 3 位目标用户</li>
            <li>✓ 预约下次复盘：对比报告建议与用户反馈，调整方案</li>
          </ul>
        </motion.div>

        {/* 客服/返回 */}
        <div className="mt-8 text-center">
          <div className="space-x-3 mb-4">
            <Button variant="secondary" onClick={() => window.open(`${window.location.origin}/opportunity-finder`, '_blank', 'noopener,noreferrer')}>
              返回机会发现器
            </Button>
            <Button onClick={() => window.open(`mailto:${APP_CONFIG.CONTACT.SUPPORT_EMAIL}`, '_blank')} className="bg-gradient-to-r from-primary-500 to-secondary-500">
              联系客服
            </Button>
          </div>
          <div className="text-gray-400 text-sm">
            微信客服：{APP_CONFIG.CONTACT.WECHAT_ID}
          </div>
          <div className="flex items-center justify-center mt-2">
            <img src={APP_CONFIG.CONTACT.WECHAT_QR} alt="WeChat QR" className="w-24 h-24 rounded-lg border border-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}


