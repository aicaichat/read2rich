import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Lock, Star, TrendingUp, Code, Zap, ExternalLink } from 'lucide-react';
import { reportGenerator } from '../lib/premiumReportGenerator';
import { APP_CONFIG } from '../config';

interface ReportPreviewProps {
  opportunityId: string;
  opportunityTitle: string;
}

export default function ReportPreview({ opportunityId, opportunityTitle }: ReportPreviewProps) {
  console.log('ReportPreview - opportunityId:', opportunityId);
  const report = reportGenerator.getReport(opportunityId);
  console.log('ReportPreview - report:', report);
  
  if (!report) {
    return (
      <div className="bg-dark-300 rounded-2xl p-8">
        <div className="text-center text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-4" />
          <p>报告预览暂不可用</p>
        </div>
      </div>
    );
  }

  const previewSections = [
    {
      icon: TrendingUp,
      title: '市场分析预览',
      content: `市场规模: ${report.marketAnalysis.marketSize.tam}`,
      subtitle: '完整版包含详细的TAM/SAM/SOM分析、竞品对比、市场趋势预测',
      isLocked: false
    },
    {
      icon: Star,
      title: '财务预测',
      content: `第一年预计收入: ${report.businessModel.financialProjections.year1.revenue}`,
      subtitle: '完整版包含3年详细财务模型、现金流分析、投资回报计算',
      isLocked: true
    },
    {
      icon: Code,
      title: '技术实现',
      content: `核心技术栈: ${report.technicalImplementation.techStack.frontend.slice(0, 2).join(', ')}等`,
      subtitle: '完整版包含完整代码模板、API设计、数据库方案、部署脚本',
      isLocked: true
    },
    {
      icon: Zap,
      title: '快速启动工具包',
      content: '包含项目配置、示例代码、部署指南',
      subtitle: '完整版提供可运行的MVP代码、环境配置、测试用例',
      isLocked: true
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-dark-300 rounded-2xl p-8"
    >
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <FileText className="w-6 h-6 mr-2" />
        报告预览
        <span className="ml-2 text-sm text-green-400">(免费查看)</span>
      </h2>
      
      {/* 执行摘要预览 */}
      <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
        <h3 className="font-medium text-white mb-2">📋 执行摘要</h3>
        <p className="text-gray-300 text-sm mb-2">
          {report.executiveSummary.projectOverview}
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">市场规模: </span>
            <span className="text-green-400">{report.executiveSummary.marketSize}</span>
          </div>
          <div>
            <span className="text-gray-400">上市时间: </span>
            <span className="text-blue-400">{report.executiveSummary.timeToMarket}</span>
          </div>
        </div>
      </div>

      {/* 预览章节 */}
      <div className="space-y-4">
        {previewSections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <div
              key={index}
              className={`border-l-4 pl-4 ${
                section.isLocked ? 'border-yellow-500' : 'border-green-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-white mb-2 flex items-center">
                    <IconComponent className="w-4 h-4 mr-2" />
                    {section.title}
                    {section.isLocked && (
                      <Lock className="w-3 h-3 ml-2 text-yellow-400" />
                    )}
                  </h3>
                  <p className="text-gray-300 text-sm mb-1">
                    {section.content}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {section.subtitle}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 完整报告包含内容 */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-lg">
        <h4 className="font-medium text-white mb-3">🎯 完整报告包含:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
          <div>• 50+页详细商业计划书</div>
          <div>• 完整技术实现方案</div>
          <div>• 可运行MVP代码模板</div>
          <div>• 快速启动工具包</div>
          <div>• 3年财务预测模型</div>
          <div>• 竞品分析和市场策略</div>
          <div>• 风险评估和应对方案</div>
          <div>• 14天开发支持</div>
        </div>
        
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="text-primary-400 font-medium">第一级价格：¥{APP_CONFIG.COMMERCE.PRICES.PREMIUM_REPORT}（报告 + BP）</div>
          <a href="/reports" onClick={(e)=>e.preventDefault()} className="text-blue-400 flex items-center text-sm">
            <ExternalLink className="w-4 h-4 mr-1" /> 预览报告截图（交付页内）
          </a>
        </div>
      </div>
    </motion.div>
  );
}