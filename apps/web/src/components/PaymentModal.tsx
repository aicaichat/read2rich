import React, { useEffect, useState } from 'react';
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
import { useT } from '@/i18n';
import { APP_CONFIG } from '@/config';
import { track } from '@/lib/analytics';

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
  const t = useT();
  const currencySymbol = APP_CONFIG.COMMERCE.CURRENCY === 'CNY' ? '¥' : '$';
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.ALIPAY);
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('selecting');
  const [errorMessage, setErrorMessage] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [currentPaymentId, setCurrentPaymentId] = useState<string>('');
  const [statusPoller] = useState(new PaymentStatusPoller());
  const isWeixin = typeof navigator !== 'undefined' && /MicroMessenger/i.test(navigator.userAgent || '');

  // 打开即可显示二维码（仅保留支付宝），免费项目直接成功
  useEffect(() => {
    if (!isOpen) return;
    // 埋点：支付弹窗打开
    try { track('pay_modal_open', { channel: isWeixin ? 'wechat_h5' : 'website', opportunityId, price }); } catch {}
    if (opportunityId === '5') {
      setPaymentStep('success');
      setTimeout(() => {
        handlePaymentSuccess();
      }, 800);
      return;
    }
    setQrCodeUrl(APP_CONFIG.PAYMENT.ALIPAY_QR);
    setPaymentStep('qr-code');
  }, [isOpen]);

  const paymentMethods = [
    {
      id: PaymentMethod.ALIPAY,
      name: '支付宝（推荐）',
      icon: Smartphone,
      description: `扫码支付 ¥${APP_CONFIG.COMMERCE.PRICES.PREMIUM_REPORT}，成功后自动解锁（报告+BP）`,
      color: 'text-blue-500'
    },
    ...(isWeixin ? [{
      id: PaymentMethod.WECHAT,
      name: '微信支付（站内）',
      icon: Smartphone,
      description: '在微信内一键调起支付，更流畅',
      color: 'text-green-500'
    }] : [])
  ];

  const handlePayment = async () => {
    setPaymentStep('processing');
    setErrorMessage('');

    try {
      // 创建支付订单
      const orderId = `order_${opportunityId}_${Date.now()}`;
      setCurrentPaymentId(orderId);
      try { track('pay_click', { method: isWeixin && selectedMethod === PaymentMethod.WECHAT ? 'wechat_jsapi' : 'alipay_qr', channel: isWeixin ? 'wechat_h5' : 'website', opportunityId, price }); } catch {}
      // 微信内优先走JSAPI
      if (isWeixin && selectedMethod === PaymentMethod.WECHAT && opportunityId !== '5') {
        const me = await fetch('/api/v1/wx/oauth/me').then(r=>r.json()).catch(()=>({}));
        const openid = me.openid || '';
        if (!openid) {
          setPaymentStep('error');
          setErrorMessage('未获取到openid');
          return;
        }
        const resp = await fetch('/api/v1/wxpay/jsapi/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: Math.round(price * 100), title: opportunityTitle, openid, out_trade_no: orderId })
        }).then(r=>r.json());
        const invoke = () => (window as any).WeixinJSBridge?.invoke('getBrandWCPayRequest', resp, (res: any)=>{
          if (res.err_msg === 'get_brand_wcpay_request:ok') handlePaymentSuccess();
          else { setPaymentStep('error'); setErrorMessage('支付未完成'); try { track('pay_error', { method: 'wechat_jsapi', reason: res.err_msg }); } catch {} }
        });
        if (!(window as any).WeixinJSBridge) {
          document.addEventListener('WeixinJSBridgeReady', invoke, false);
        } else { invoke(); }
        return;
      }
      const paymentParams: PaymentParams = {
        amount: price,
        currency: APP_CONFIG.COMMERCE.CURRENCY,
        orderId: orderId,
        description: `${t('pay.purchaseTitle','购买完整报告')}: ${opportunityTitle}`,
        notifyUrl: `${window.location.origin}/api/payment/${selectedMethod}/notify`,
        returnUrl: `${window.location.origin}/payment/success?opportunityId=${encodeURIComponent(opportunityId)}&opportunityTitle=${encodeURIComponent(opportunityTitle)}&order_id=${encodeURIComponent(orderId)}`,
        userId: 'user_' + Date.now(),
        metadata: {
          opportunityId: opportunityId,
          productType: 'premium_report'
        }
      };

      const paymentResult = await paymentService.createPayment(selectedMethod, paymentParams);

      // 限时免费逻辑：服装搭配师（id: '5'）直接走成功，不实际支付
      if (opportunityId === '5') {
        setPaymentStep('success');
        setTimeout(() => {
          handlePaymentSuccess();
        }, 1000);
        return;
      }

      // 常规路径：由于采用固定支付宝收款二维码，直接展示二维码并视为待支付
      setPaymentStep('qr-code');
      setQrCodeUrl(APP_CONFIG.PAYMENT.ALIPAY_QR);
      return;

      setCurrentPaymentId(paymentResult.paymentId);

      // 根据支付方式处理不同流程
      if (selectedMethod === PaymentMethod.ALIPAY) {
        // 支付宝 - 跳转到支付页面
        if (paymentResult.paymentUrl) {
          window.open(paymentResult.paymentUrl, '_blank');
          setPaymentStep('processing');
          startPaymentStatusPolling(paymentResult.paymentId);
        }
      }

    } catch (error) {
      console.error('支付处理失败:', error);
      setPaymentStep('error');
      setErrorMessage(error instanceof Error ? error.message : t('pay.failedGeneric','支付失败，请重试或联系客服'));
      try { track('pay_error', { method: isWeixin && selectedMethod === PaymentMethod.WECHAT ? 'wechat_jsapi' : 'alipay_qr', message: (error as any)?.message || 'unknown' }); } catch {}
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
          setErrorMessage(t('pay.errorTitle','支付失败'));
        }
      },
      () => {
        setPaymentStep('error');
        setErrorMessage(t('pay.timeout','支付超时，请重试'));
      }
    );
  };

  const handlePaymentSuccess = () => {
    try { track('pay_success', { channel: isWeixin ? 'wechat_h5' : 'website', opportunityId, orderId: currentPaymentId, price }); } catch {}
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
              <h3 className="text-xl font-bold text-white mb-2">{t('pay.purchaseTitle','购买完整报告')}</h3>
              <p className="text-gray-300 text-sm">{opportunityTitle}</p>
              
              <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{t('pay.totalPrice','总价')}</span>
                  <span className="text-2xl font-bold text-primary-400">{currencySymbol}{price}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-white font-medium mb-3">{t('pay.selectMethod','选择支付方式')}</h4>
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
                {t('pay.benefits.title','购买保障')}
              </h5>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• {t('pay.benefits.refund','30天无理由退款')}</li>
                <li>• {t('pay.benefits.secure','安全加密支付')}</li>
                <li>• {t('pay.benefits.instant','即时下载交付')}</li>
                <li>• {t('pay.benefits.support','7x24小时客服支持')}</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                {t('pay.cancel','取消')}
              </Button>
              <Button
                onClick={handlePayment}
                className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500"
              >
                {t('pay.payNow','立即支付')} {currencySymbol}{price}
              </Button>
            </div>
          </>
        );

      case 'processing':
        return (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 text-primary-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-bold text-white mb-2">{t('pay.waitingTitle','等待支付完成...')}</h3>
            <p className="text-gray-300 mb-4">
              {selectedMethod === PaymentMethod.ALIPAY && t('pay.alipayPrompt','请在新打开的支付宝页面完成支付')}
              {selectedMethod === PaymentMethod.CREDIT_CARD && t('pay.cardPrompt','请在新打开的页面完成信用卡支付')}
              {selectedMethod === PaymentMethod.WECHAT && t('pay.wechatPrompt','请使用微信扫描二维码完成支付')}
            </p>
            <div className="mt-4 text-sm text-gray-400">
              <Clock className="w-4 h-4 inline mr-1" />
              {t('pay.waitingNote','支付完成后将自动跳转')}
            </div>
          </div>
        );

      case 'qr-code':
        return (
          <div className="text-center py-8">
            <h3 className="text-xl font-bold text-white mb-4">支付宝扫码支付</h3>
            <div className="bg-white p-6 rounded-lg inline-block mb-4">
              {qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="支付宝收款二维码" 
                  className="w-48 h-48"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            <p className="text-gray-300 mb-2">请使用支付宝扫描上方二维码完成支付</p>
            <p className="text-sm text-gray-400">支付完成后将自动解锁；如未自动跳转，请点击“我已支付”</p>
            <div className="mt-6 flex justify-center">
              <Button
                variant="secondary"
                onClick={() => setPaymentStep('selecting')}
                className="mr-3"
              >
                {t('pay.backToSelect','返回重选')}
              </Button>
              <Button onClick={handlePaymentSuccess} className="bg-emerald-600 hover:bg-emerald-700">
                我已支付，去解锁
              </Button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t('pay.successTitle','支付成功！')}</h3>
            <p className="text-gray-300 mb-4">
              {t('pay.successDesc','您的完整报告正在准备中，即将为您下载')}
            </p>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-green-400 text-sm">
                {t('pay.successToast','感谢您的购买！报告和快速启动工具包将在2秒后自动下载。')}
              </p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t('pay.errorTitle','支付失败')}</h3>
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
                {t('pay.retry','重新支付')}
              </Button>
              <Button
                variant="secondary"
                onClick={onClose}
                className="w-full"
              >
                {t('pay.later','稍后再试')}
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