export const APP_CONFIG = {
  COMMERCE: {
    CURRENCY: 'CNY' as const,
    PRICES: {
      PREMIUM_REPORT: 29.9,
      TRAINING_COURSE: 299,
      ENTERPRISE_PACKAGE: 2999
    }
  },
  PAYMENT: {
    ALIPAY_QR: '/images/alipay-qr.svg', // 支付宝收款码
    WECHAT_QR: '/images/wechat-qr.svg'  // 微信收款码
  },
  API: {
    BASE_URL: process.env.NODE_ENV === 'production' ? 'https://api.read2rich.com' : 'http://localhost:8001'
  }
};