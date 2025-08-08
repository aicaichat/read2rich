import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, ArrowLeft, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/router';
import Button from '@/components/ui/Button';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [orderInfo, setOrderInfo] = useState<any>(null);

  useEffect(() => {
    // 从URL参数或localStorage获取订单信息
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');
    const paymentId = urlParams.get('payment_id');
    
    if (orderId || paymentId) {
      // 这里可以调用API获取订单详情
      setOrderInfo({
        orderId: orderId || paymentId,
        amount: '$29.00',
        status: 'success',
        purchaseDate: new Date().toISOString()
      });
    }
  }, []);

  const handleDownloadReport = () => {
    // 触发报告下载
    const link = document.createElement('a');
    link.href = '/api/download/report?order_id=' + orderInfo?.orderId;
    link.download = 'AI-Career-Path-Finder-Complete-Report.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadKit = () => {
    // 触发快速启动工具包下载
    const link = document.createElement('a');
    link.href = '/api/download/quickstart?order_id=' + orderInfo?.orderId;
    link.download = 'AI-Career-Path-Finder-QuickStart-Kit.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-dark-400 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">
            🎉 支付成功！
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            感谢您的购买，完整报告和快速启动工具包已准备就绪
          </p>
        </motion.div>

        {orderInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-300 rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">订单详情</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-400 mb-1">订单号</div>
                <div className="text-white font-mono">{orderInfo.orderId}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">支付金额</div>
                <div className="text-white font-bold">{orderInfo.amount}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">购买时间</div>
                <div className="text-white">
                  {new Date(orderInfo.purchaseDate).toLocaleString('zh-CN')}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">状态</div>
                <div className="text-green-400 font-medium">支付成功</div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-300 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">立即下载</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-600 rounded-lg p-6">
              <div className="text-center mb-4">
                <Download className="w-12 h-12 text-primary-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">完整商业计划书</h3>
                <p className="text-gray-300 text-sm">
                  50+页详细报告，包含市场分析、技术方案、财务预测等
                </p>
              </div>
              <Button 
                onClick={handleDownloadReport}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500"
              >
                <Download className="w-4 h-4 mr-2" />
                下载PDF报告
              </Button>
            </div>

            <div className="border border-gray-600 rounded-lg p-6">
              <div className="text-center mb-4">
                <Download className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">快速启动工具包</h3>
                <p className="text-gray-300 text-sm">
                  可运行的MVP代码、配置文件、部署脚本等
                </p>
              </div>
              <Button 
                onClick={handleDownloadKit}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                下载工具包
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">🎯 您获得的完整内容</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                <span>50+页详细商业计划书</span>
              </div>
              <div className="flex items-center text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                <span>完整技术实现方案</span>
              </div>
              <div className="flex items-center text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                <span>可运行MVP代码模板</span>
              </div>
              <div className="flex items-center text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                <span>快速启动工具包</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                <span>3年财务预测模型</span>
              </div>
              <div className="flex items-center text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                <span>竞品分析和市场策略</span>
              </div>
              <div className="flex items-center text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                <span>风险评估和应对方案</span>
              </div>
              <div className="flex items-center text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                <span>14天开发支持</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center space-y-4"
        >
          <div className="text-gray-300 text-sm">
            如有任何问题，请联系我们的客服团队
          </div>
          <div className="space-x-4">
            <Button
              variant="secondary"
              onClick={() => router.push('/opportunity-finder')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回机会发现器
            </Button>
            <Button
              onClick={() => window.open('mailto:support@deepneed.com')}
              className="bg-gradient-to-r from-primary-500 to-secondary-500"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              联系客服
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}