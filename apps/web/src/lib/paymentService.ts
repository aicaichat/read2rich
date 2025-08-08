/**
 * 支付服务 - 集成微信支付和支付宝支付
 */

// 支付方式枚举
export enum PaymentMethod {
  ALIPAY = 'alipay',
  WECHAT = 'wechat',
  CREDIT_CARD = 'credit'
}

// 支付状态枚举
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// 支付参数接口
export interface PaymentParams {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
  notifyUrl?: string;
  returnUrl?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

// 支付结果接口
export interface PaymentResult {
  success: boolean;
  paymentId: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  paymentUrl?: string; // 支付页面URL
  qrCode?: string; // 二维码数据
  message?: string;
  error?: string;
  transactionId?: string;
}

// 微信支付配置
interface WeChatPayConfig {
  appId: string;
  merchantId: string;
  apiKey: string;
  notifyUrl: string;
  returnUrl: string;
}

// 支付宝配置
interface AlipayConfig {
  appId: string;
  privateKey: string;
  publicKey: string;
  notifyUrl: string;
  returnUrl: string;
  gatewayUrl: string;
}

// 支付服务类
export class PaymentService {
  private wechatConfig: WeChatPayConfig;
  private alipayConfig: AlipayConfig;

  constructor() {
    // 从环境变量读取配置
    this.wechatConfig = {
      appId: process.env.NEXT_PUBLIC_WECHAT_APP_ID || '',
      merchantId: process.env.WECHAT_MERCHANT_ID || '',
      apiKey: process.env.WECHAT_API_KEY || '',
      notifyUrl: process.env.NEXT_PUBLIC_BASE_URL + '/api/payment/wechat/notify',
      returnUrl: process.env.NEXT_PUBLIC_BASE_URL + '/payment/success'
    };

    this.alipayConfig = {
      appId: process.env.NEXT_PUBLIC_ALIPAY_APP_ID || '',
      privateKey: process.env.ALIPAY_PRIVATE_KEY || '',
      publicKey: process.env.ALIPAY_PUBLIC_KEY || '',
      notifyUrl: process.env.NEXT_PUBLIC_BASE_URL + '/api/payment/alipay/notify',
      returnUrl: process.env.NEXT_PUBLIC_BASE_URL + '/payment/success',
      gatewayUrl: 'https://openapi.alipay.com/gateway.do'
    };
  }

  /**
   * 创建支付订单
   */
  async createPayment(method: PaymentMethod, params: PaymentParams): Promise<PaymentResult> {
    try {
      switch (method) {
        case PaymentMethod.ALIPAY:
          return await this.createAlipayOrder(params);
        case PaymentMethod.WECHAT:
          return await this.createWeChatOrder(params);
        case PaymentMethod.CREDIT_CARD:
          return await this.createCreditCardOrder(params);
        default:
          throw new Error('不支持的支付方式');
      }
    } catch (error) {
      console.error('创建支付订单失败:', error);
      return {
        success: false,
        paymentId: '',
        orderId: params.orderId,
        amount: params.amount,
        status: PaymentStatus.FAILED,
        error: error instanceof Error ? error.message : '创建支付订单失败'
      };
    }
  }

  /**
   * 创建支付宝支付订单
   */
  private async createAlipayOrder(params: PaymentParams): Promise<PaymentResult> {
    const requestData = {
      method: 'alipay.trade.page.pay',
      app_id: this.alipayConfig.appId,
      charset: 'utf-8',
      sign_type: 'RSA2',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      version: '1.0',
      notify_url: this.alipayConfig.notifyUrl,
      return_url: this.alipayConfig.returnUrl,
      biz_content: JSON.stringify({
        out_trade_no: params.orderId,
        total_amount: params.amount.toFixed(2),
        subject: params.description,
        product_code: 'FAST_INSTANT_TRADE_PAY',
        quit_url: process.env.NEXT_PUBLIC_BASE_URL + '/payment/cancel'
      })
    };

    // 生成签名
    const sign = await this.generateAlipaySign(requestData);
    requestData['sign'] = sign;

    // 构建支付URL
    const paymentUrl = this.alipayConfig.gatewayUrl + '?' + 
      Object.keys(requestData)
        .map(key => `${key}=${encodeURIComponent(requestData[key])}`)
        .join('&');

    return {
      success: true,
      paymentId: `alipay_${params.orderId}`,
      orderId: params.orderId,
      amount: params.amount,
      status: PaymentStatus.PENDING,
      paymentUrl: paymentUrl,
      message: '支付宝订单创建成功'
    };
  }

  /**
   * 创建微信支付订单
   */
  private async createWeChatOrder(params: PaymentParams): Promise<PaymentResult> {
    const requestData = {
      appid: this.wechatConfig.appId,
      mch_id: this.wechatConfig.merchantId,
      nonce_str: this.generateNonceStr(),
      body: params.description,
      out_trade_no: params.orderId,
      total_fee: Math.round(params.amount * 100), // 微信支付金额单位为分
      spbill_create_ip: '127.0.0.1',
      notify_url: this.wechatConfig.notifyUrl,
      trade_type: 'NATIVE' // 扫码支付
    };

    // 生成签名
    const sign = this.generateWeChatSign(requestData);
    requestData['sign'] = sign;

    // 调用微信统一下单API
    const response = await fetch('/api/payment/wechat/unifiedorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    const result = await response.json();

    if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
      return {
        success: true,
        paymentId: `wechat_${params.orderId}`,
        orderId: params.orderId,
        amount: params.amount,
        status: PaymentStatus.PENDING,
        qrCode: result.code_url, // 二维码链接
        message: '微信支付订单创建成功'
      };
    } else {
      throw new Error(result.err_code_des || '微信支付订单创建失败');
    }
  }

  /**
   * 创建信用卡支付订单（使用Stripe）
   */
  private async createCreditCardOrder(params: PaymentParams): Promise<PaymentResult> {
    try {
      const response = await fetch('/api/payment/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: Math.round(params.amount * 100), // Stripe金额单位为分
          currency: params.currency.toLowerCase(),
          orderId: params.orderId,
          description: params.description,
          metadata: params.metadata
        })
      });

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          paymentId: result.paymentIntentId,
          orderId: params.orderId,
          amount: params.amount,
          status: PaymentStatus.PENDING,
          paymentUrl: `/payment/stripe?payment_intent=${result.paymentIntentId}&client_secret=${result.clientSecret}`,
          message: '信用卡支付订单创建成功'
        };
      } else {
        throw new Error(result.error || '信用卡支付订单创建失败');
      }
    } catch (error) {
      throw new Error('信用卡支付服务暂时不可用');
    }
  }

  /**
   * 查询支付状态
   */
  async queryPaymentStatus(paymentId: string, method: PaymentMethod): Promise<PaymentStatus> {
    try {
      const response = await fetch(`/api/payment/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentId,
          method
        })
      });

      const result = await response.json();
      return result.status || PaymentStatus.PENDING;
    } catch (error) {
      console.error('查询支付状态失败:', error);
      return PaymentStatus.FAILED;
    }
  }

  /**
   * 生成支付宝签名
   */
  private async generateAlipaySign(params: Record<string, any>): Promise<string> {
    // 排序参数
    const sortedParams = Object.keys(params)
      .filter(key => key !== 'sign' && params[key] !== '' && params[key] !== null)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    // 这里需要使用RSA私钥签名，实际生产环境中应该在后端完成
    // 前端仅做演示，实际应该调用后端API
    const response = await fetch('/api/payment/alipay/sign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: sortedParams })
    });

    const result = await response.json();
    return result.sign;
  }

  /**
   * 生成微信支付签名
   */
  private generateWeChatSign(params: Record<string, any>): string {
    // 排序参数
    const sortedParams = Object.keys(params)
      .filter(key => key !== 'sign' && params[key] !== '' && params[key] !== null)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    // 添加API密钥
    const stringToSign = sortedParams + `&key=${this.wechatConfig.apiKey}`;

    // 这里需要MD5加密，实际生产环境中应该在后端完成
    // 前端仅做演示
    return this.md5(stringToSign).toUpperCase();
  }

  /**
   * 生成随机字符串
   */
  private generateNonceStr(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * MD5加密（简化版，实际应使用crypto库）
   */
  private md5(str: string): string {
    // 这里应该使用实际的MD5实现
    // 前端演示用简化版本
    return btoa(str).replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 32);
  }

  /**
   * 验证支付回调
   */
  async verifyPaymentCallback(method: PaymentMethod, callbackData: any): Promise<boolean> {
    try {
      const response = await fetch('/api/payment/verify-callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          method,
          data: callbackData
        })
      });

      const result = await response.json();
      return result.verified === true;
    } catch (error) {
      console.error('验证支付回调失败:', error);
      return false;
    }
  }
}

// 导出单例实例
export const paymentService = new PaymentService();

// 支付状态轮询工具
export class PaymentStatusPoller {
  private pollingInterval: number = 2000; // 2秒轮询一次
  private maxPollingTime: number = 300000; // 最大轮询5分钟
  private polling = false;

  async startPolling(
    paymentId: string, 
    method: PaymentMethod,
    onStatusChange: (status: PaymentStatus) => void,
    onTimeout?: () => void
  ): Promise<void> {
    if (this.polling) return;

    this.polling = true;
    const startTime = Date.now();

    const poll = async () => {
      if (!this.polling) return;

      try {
        const status = await paymentService.queryPaymentStatus(paymentId, method);
        onStatusChange(status);

        // 如果支付完成或失败，停止轮询
        if (status === PaymentStatus.SUCCESS || status === PaymentStatus.FAILED) {
          this.stopPolling();
          return;
        }

        // 检查是否超时
        if (Date.now() - startTime > this.maxPollingTime) {
          this.stopPolling();
          if (onTimeout) onTimeout();
          return;
        }

        // 继续轮询
        setTimeout(poll, this.pollingInterval);
      } catch (error) {
        console.error('轮询支付状态失败:', error);
        setTimeout(poll, this.pollingInterval);
      }
    };

    // 开始轮询
    poll();
  }

  stopPolling(): void {
    this.polling = false;
  }
}