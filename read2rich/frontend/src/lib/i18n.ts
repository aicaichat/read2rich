// 简化的国际化支持
export const useT = () => {
  return (key: string, defaultValue?: string) => {
    // 简单的翻译函数，返回默认值或key
    return defaultValue || key;
  };
};
