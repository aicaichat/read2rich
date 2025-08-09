export const APP_CONFIG = {
  SITE_NAME: 'DeepNeed',
  DOMAINS: {
    MAIN: 'https://deepneed.com.cn',
    API: 'https://api.deepneed.com',
  },
  CONTACT: {
    SUPPORT_EMAIL: 'support@deepneed.com',
    SALES_EMAIL: 'vip@deepneed.com.cn',
    WECHAT_ID: 'deepneed-support',
    WECHAT_QR: 'https://deepneed.com.cn/_static/images/contact-qr.png',
  },
  POLICIES: {
    REFUND: '30天无理由退款',
  },
  COMMERCE: {
    CURRENCY: 'CNY',
    PRICES: {
      PREMIUM_REPORT: 99,
    },
  },
  DEMO: {
    CLOTHING_MATCHER_URL: 'https://wtwt.cn',
    CLOTHING_MATCHER_QR: 'https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=https%3A%2F%2Fwtwt.cn',
  },
  PAYMENT: {
    // 支付宝收款码
    ALIPAY_QR: 'https://ssswork.oss-cn-hangzhou.aliyuncs.com/%E6%94%AF%E4%BB%98%E5%AE%9D%E6%94%B6%E6%AC%BE.JPG'
  },
  OSS_STATIC: {
    // 使用可访问的 video.sss.work 域名，避免强制下载
    BASE_BP: 'http://video.sss.work/bp/bp/',
    BASE_REPORTS: 'http://video.sss.work/reports/reports/'
  }
} as const;

export type AppConfig = typeof APP_CONFIG;

