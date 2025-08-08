import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Shield,
  Clock,
  QrCode
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { reportGenerator } from '@/lib/premiumReportGenerator';
import { 
  paymentService, 
  PaymentMethod, 
  PaymentStatusPoller,
  PaymentStatus,
  type PaymentParams 
} from '@/lib/paymentService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityId: string;
  opportunityTitle: string;
  price: number;
  onPaymentSuccess: (reportData: any) => void;
}

type PaymentStep = 'selecting' | 'processing' | 'qr-code' | 'success' | 'error';

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  opportunityId,
  opportunityTitle, 
  price, 
  onPaymentSuccess 
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.ALIPAY);
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('selecting');
  const [errorMessage, setErrorMessage] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [currentPaymentId, setCurrentPaymentId] = useState<string>('');
  const [statusPoller] = useState(new PaymentStatusPoller());

  const paymentMethods = [
    {
      id: PaymentMethod.ALIPAY,
      name: '支付宝',
      icon: Smartphone,
      description: '快速安全的移动支付',
      color: 'text-blue-500'
    },
    {
      id: PaymentMethod.WECHAT,
      name: '微信支付',
      icon: Smartphone,
      description: '便捷的微信钱包支付',
      color: 'text-green-500'
    },
    {
      id: PaymentMethod.CREDIT_CARD,
      name: '信用卡/借记卡',
      icon: CreditCard,
      description: 'Visa, MasterCard, 银联',
      color: 'text-purple-500'
    }
  ];

  const handlePayment = async () => {
    setPaymentStep('processing');
    setErrorMessage('');

    try {
      // 创建支付订单
      const orderId = `order_${opportunityId}_${Date.now()}`;
      const paymentParams: PaymentParams = {
        amount: price,
        currency: 'USD',
        orderId: orderId,
        description: `购买报告: ${opportunityTitle}`,
        notifyUrl: `${window.location.origin}/api/payment/${selectedMethod}/notify`,
        returnUrl: `${window.location.origin}/payment/success`,
        userId: 'user_' + Date.now(),
        metadata: {
          opportunityId: opportunityId,
          productType: 'premium_report'
        }
      };

      const paymentResult = await paymentService.createPayment(selectedMethod, paymentParams);

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || '创建支付订单失败');
      }

      setCurrentPaymentId(paymentResult.paymentId);

      // 根据支付方式处理不同流程
      if (selectedMethod === PaymentMethod.ALIPAY) {
        // 支付宝 - 跳转到支付页面
        if (paymentResult.paymentUrl) {
          window.open(paymentResult.paymentUrl, '_blank');
          setPaymentStep('processing');
          startPaymentStatusPolling(paymentResult.paymentId);
        }
      } else if (selectedMethod === PaymentMethod.WECHAT) {
        // 微信支付 - 显示二维码
        if (paymentResult.qrCode) {
          setQrCodeUrl(paymentResult.qrCode);
          setPaymentStep('qr-code');
          startPaymentStatusPolling(paymentResult.paymentId);
        }
      } else if (selectedMethod === PaymentMethod.CREDIT_CARD) {
        // 信用卡 - 跳转到Stripe页面
        if (paymentResult.paymentUrl) {
          window.open(paymentResult.paymentUrl, '_blank');
          setPaymentStep('processing');
          startPaymentStatusPolling(paymentResult.paymentId);
        }
      }

    } catch (error) {
      console.error('支付处理失败:', error);
      setPaymentStep('error');
      setErrorMessage(error instanceof Error ? error.message : '支付失败，请重试或联系客服');
    }
  };

  const startPaymentStatusPolling = (paymentId: string) => {
    statusPoller.startPolling(
      paymentId,
      selectedMethod,
      (status) => {
        if (status === PaymentStatus.SUCCESS) {
          handlePaymentSuccess();
        } else if (status === PaymentStatus.FAILED) {
          setPaymentStep('error');
          setErrorMessage('支付失败，请重试');
        }
      },
      () => {
        setPaymentStep('error');
        setErrorMessage('支付超时，请重试');
      }
    );
  };

  const handlePaymentSuccess = () => {
    // 生成报告内容
    const reportContent = reportGenerator.generatePDFContent(opportunityId);
    const quickStartKit = reportGenerator.generateQuickStartKit(opportunityId);
    
    // 创建下载文件
    const pdfBlob = new Blob([reportContent], { type: 'text/plain' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    const kitBlob = new Blob([JSON.stringify(quickStartKit, null, 2)], { type: 'application/json' });
    const kitUrl = URL.createObjectURL(kitBlob);
    
    const reportData = {
      reportId: currentPaymentId,
      downloadUrl: pdfUrl,
      quickStartKitUrl: kitUrl,
      reportContent: reportContent,
      quickStartKit: quickStartKit,
      opportunityId: opportunityId,
      purchaseDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    setPaymentStep('success');
    setTimeout(() => {
      onPaymentSuccess(reportData);
      onClose();
    }, 2000);
  };

  const renderPaymentContent = () => {
    switch (paymentStep) {
      case 'selecting':
        return (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">购买完整报告</h3>
              <p className="text-gray-300 text-sm">{opportunityTitle}</p>
              
              <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">总价</span>
                  <span className="text-2xl font-bold text-primary-400">${price}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-white font-medium mb-3">选择支付方式</h4>
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedMethod === method.id
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center">
                        <IconComponent className={`w-6 h-6 ${method.color} mr-3`} />
                        <div>
                          <div className="text-white font-medium">{method.name}</div>
                          <div className="text-gray-400 text-sm">{method.description}</div>
                        </div>
                        {selectedMethod === method.id && (
                          <CheckCircle className="w-5 h-5 text-primary-500 ml-auto" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <h5 className="text-white font-medium mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-400" />
                购买保障
              </h5>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• 30天无理由退款</li>
                <li>• 安全加密支付</li>
                <li>• 即时下载交付</li>
                <li>• 7x24小时客服支持</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                onClick={handlePayment}
                className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500"
              >
                立即支付 ${price}
              </Button>
            </div>
          </>
        );

      case 'processing':
        return (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 text-primary-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-bold text-white mb-2">等待支付完成...</h3>
            <p className="text-gray-300 mb-4">
              {selectedMethod === PaymentMethod.ALIPAY && '请在新打开的支付宝页面完成支付'}
              {selectedMethod === PaymentMethod.CREDIT_CARD && '请在新打开的页面完成信用卡支付'}
              {selectedMethod === PaymentMethod.WECHAT && '请使用微信扫描二维码完成支付'}
            </p>
            <div className="mt-4 text-sm text-gray-400">
              <Clock className="w-4 h-4 inline mr-1" />
              支付完成后将自动跳转
            </div>
          </div>
        );

      case 'qr-code':
        return (
          <div className="text-center py-8">
            <h3 className="text-xl font-bold text-white mb-4">微信支付</h3>
            <div className="bg-white p-6 rounded-lg inline-block mb-4">
              {qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="微信支付二维码" 
                  className="w-48 h-48"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            <p className="text-gray-300 mb-2">请使用微信扫描上方二维码</p>
            <p className="text-sm text-gray-400">扫码后在手机上完成支付</p>
            <div className="mt-6 flex justify-center">
              <Button
                variant="secondary"
                onClick={() => setPaymentStep('selecting')}
                className="mr-3"
              >
                返回重选
              </Button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">支付成功！</h3>
            <p className="text-gray-300 mb-4">
              您的完整报告正在准备中，即将为您下载
            </p>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-green-400 text-sm">
                感谢您的购买！报告和快速启动工具包将在2秒后自动下载。
              </p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">支付失败</h3>
            <p className="text-gray-300 mb-4">{errorMessage}</p>
            
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setPaymentStep('selecting');
                  setErrorMessage('');
                  statusPoller.stopPolling();
                }}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500"
              >
                重新支付
              </Button>
              <Button
                variant="secondary"
                onClick={onClose}
                className="w-full"
              >
                稍后再试
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          
          {/* 模态框 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-dark-300 rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* 关闭按钮 */}
            {paymentStep === 'selecting' && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}

            {renderPaymentContent()}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}