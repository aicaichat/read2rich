export const APP_CONFIG = {
  SITE_NAME: 'DeepNeed',
  DOMAINS: {
    MAIN: 'https://deepneed.com.cn',
    API: 'https://api.deepneed.com',
  },
  CONTACT: {
    SUPPORT_EMAIL: 'support@deepneed.com',
    SALES_EMAIL: 'vip@deepneed.com.cn',
  },
  POLICIES: {
    REFUND: '30天无理由退款',
  },
  COMMERCE: {
    CURRENCY: 'USD',
    PRICES: {
      PREMIUM_REPORT: 29,
    },
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
