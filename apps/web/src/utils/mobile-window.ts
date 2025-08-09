/**
 * 移动端友好的窗口打开工具函数
 * 解决移动端浏览器弹窗拦截问题
 */

/**
 * 检测是否为移动设备
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 移动端友好的打开新窗口
 * @param url 要打开的URL
 * @param target 目标窗口，默认 '_blank'
 * @param features 窗口特性，默认 'noopener,noreferrer'
 */
export function openWindow(url: string, target: string = '_blank', features: string = 'noopener,noreferrer'): Window | null {
  if (!url) return null;
  
  const isMobile = isMobileDevice();
  
  if (isMobile) {
    // 移动端：直接在当前页面打开，提供更好的用户体验
    window.location.href = url;
    return null;
  } else {
    // 桌面端：使用 window.open 新窗口
    return window.open(url, target, features);
  }
}

/**
 * 移动端友好的异步窗口打开
 * 适用于需要先执行异步操作再打开窗口的场景
 * @param asyncFn 异步函数，返回要打开的URL
 * @param target 目标窗口，默认 '_blank'
 * @param features 窗口特性，默认 'noopener,noreferrer'
 */
export async function openWindowAsync(
  asyncFn: () => Promise<string | null>,
  target: string = '_blank',
  features: string = 'noopener,noreferrer'
): Promise<boolean> {
  const isMobile = isMobileDevice();
  let newWindow: Window | null = null;
  
  if (!isMobile) {
    // 桌面端：预先打开空窗口，避免异步操作后被拦截
    newWindow = window.open('', target, features);
  }
  
  try {
    const url = await asyncFn();
    
    if (!url) {
      if (newWindow) newWindow.close();
      return false;
    }
    
    if (isMobile) {
      // 移动端：直接在当前页面打开
      window.location.href = url;
    } else {
      // 桌面端：在预开窗口中加载URL
      if (newWindow) {
        newWindow.location.href = url;
      } else {
        openWindow(url, target, features);
      }
    }
    
    return true;
  } catch (error) {
    console.error('openWindowAsync failed:', error);
    if (newWindow) newWindow.close();
    return false;
  }
}

/**
 * 创建并打开 Blob URL
 * @param content 内容
 * @param type MIME类型，默认 'text/html;charset=utf-8'
 * @param filename 文件名（用于下载场景）
 * @param target 目标窗口，默认 '_blank'
 */
export function openBlobUrl(
  content: string,
  type: string = 'text/html;charset=utf-8',
  filename?: string,
  target: string = '_blank'
): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  
  if (filename && isMobileDevice()) {
    // 移动端且指定文件名：触发下载
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    // 移动端：直接在当前页面打开，桌面端：新窗口打开
    openWindow(url, target);
  }
  
  // 延后释放URL，避免立即失效
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
