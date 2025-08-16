export enum PaymentMethod {
  ALIPAY = 'alipay',
  WECHAT = 'wechat',
  CREDIT_CARD = 'credit_card'
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface PaymentParams {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
  notifyUrl: string;
  returnUrl: string;
  userId: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  paymentId: string;
  paymentUrl?: string;
  qrCode?: string;
  status: PaymentStatus;
}

class PaymentService {
  async createPayment(method: PaymentMethod, params: PaymentParams): Promise<PaymentResult> {
    // 模拟支付创建
    return {
      paymentId: `pay_${Date.now()}`,
      paymentUrl: `https://payment.example.com/${method}`,
      status: PaymentStatus.PENDING
    };
  }

  async checkPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    // 模拟支付状态检查
    return PaymentStatus.PENDING;
  }
}

export class PaymentStatusPoller {
  private pollInterval?: NodeJS.Timeout;

  startPolling(
    paymentId: string,
    method: PaymentMethod,
    onStatusChange: (status: PaymentStatus) => void,
    onTimeout: () => void,
    timeoutMs: number = 300000 // 5分钟
  ) {
    const startTime = Date.now();
    
    this.pollInterval = setInterval(async () => {
      if (Date.now() - startTime > timeoutMs) {
        this.stopPolling();
        onTimeout();
        return;
      }

      try {
        const status = await paymentService.checkPaymentStatus(paymentId);
        if (status !== PaymentStatus.PENDING) {
          this.stopPolling();
          onStatusChange(status);
        }
      } catch (error) {
        console.error('支付状态查询失败:', error);
      }
    }, 3000);
  }

  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = undefined;
    }
  }
}

export const paymentService = new PaymentService();