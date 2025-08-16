// 简化的分析追踪
export const track = (event: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    console.log('Analytics:', event, data);
    // 在实际项目中，这里会发送到分析服务
  }
};
