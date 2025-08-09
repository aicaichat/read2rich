import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ExternalLink, Download, Sparkles, Upload } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import Button from '@/components/ui/Button';
import { reportGenerator } from '@/lib/premiumReportGenerator';
import { reportsAPI } from '@/lib/api';

const AdminReportGeneratorPage: React.FC = () => {
  const projects = reportGenerator.getAvailableReports();

  const openHtml = async (projectId: string, title?: string) => {
    if (projectId === '5') {
      window.open('/reports/clothing-matcher.html', '_blank', 'noopener,noreferrer');
      return;
    }
    // 优先调用后端生成；失败则回退前端生成
    let html = '';
    try {
      html = await reportsAPI.generateHTML(projectId, title, undefined);
    } catch (e) {
      html = reportGenerator.generateHTMLReportDeep(projectId);
    }
    if (!html) return;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const downloadHtml = (projectId: string, title: string) => {
    const html = reportGenerator.generateHTMLReportDeep(projectId);
    if (!html) return;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^\w\u4e00-\u9fa5-]/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const batchDownload = () => {
    projects.forEach(p => downloadHtml(p.id, p.title));
  };

  const openWebPPT = (projectId: string, title: string) => {
    const filename = `${title.replace(/[^\w\u4e00-\u9fa5-]/g, '_')}.bp.html`;
    window.open(`/bp/${filename}`, '_blank', 'noopener,noreferrer');
  };

  const publishToServer = async (projectId: string, title: string) => {
    const html = reportGenerator.generateHTMLReport(projectId);
    const res = await reportsAPI.publish(projectId, title, html);
    window.open(res.htmlUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-400" /> 深度报告生成工具
          </h1>
          <p className="text-gray-400 mt-2">一键为每个项目生成专业 HTML 深度报告，可预览或批量下载（浏览器本地保存）。</p>
          <div className="mt-3">
            <Button onClick={batchDownload} className="bg-gradient-to-r from-primary-500 to-secondary-500">
              <Download className="w-4 h-4 mr-2" /> 批量下载全部 HTML
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((proj) => (
            <motion.div key={proj.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-300 rounded-xl border border-white/10 p-4">
              <div className="flex items-start gap-3">
                <FileText className="w-6 h-6 text-primary-400 mt-1" />
                <div className="flex-1">
                  <div className="text-white font-medium">{proj.title}</div>
                  <div className="text-xs text-gray-500 mt-1">ID: {proj.id}</div>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button onClick={() => openHtml(proj.id, proj.title)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <ExternalLink className="w-4 h-4 mr-2" /> 预览HTML
                </Button>
                <Button onClick={() => downloadHtml(proj.id, proj.title)} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  <Download className="w-4 h-4 mr-2" /> 下载HTML
                </Button>
                <Button onClick={() => publishToServer(proj.id, proj.title)} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  <Upload className="w-4 h-4 mr-2" /> 发布到服务器
                </Button>
                <Button onClick={() => openWebPPT(proj.id, proj.title)} className="flex-1 bg-amber-600 hover:bg-amber-700">
                  <Sparkles className="w-4 h-4 mr-2" /> 预览BP(WebPPT)
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReportGeneratorPage;


