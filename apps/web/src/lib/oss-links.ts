import { APP_CONFIG } from '@/config';

type OssItem = {
  title: string; // 文件基名（不含扩展名），例如：AI服装搭配师__AI-Based_Clothing_Matcher_
  report?: string; // HTML 报告完整 URL
  bp_basic?: string; // 基础 BP HTML URL（.bp.html）
  bp_reveal?: string; // Reveal WebPPT URL（.reveal.html）
};

type OssLinks = {
  baseBp: string;
  baseReports: string;
  items: OssItem[];
};

let cached: OssLinks | null = null;
let loading: Promise<OssLinks | null> | null = null;

export function sanitizeTitle(name: string): string {
  return name.replace(/[^\w\u4e00-\u9fa5-]/g, '_');
}

async function load(): Promise<OssLinks | null> {
  if (cached) return cached;
  if (loading) return loading;
  loading = fetch('/oss-links.json')
    .then(async (r) => {
      if (!r.ok) return null;
      const data = (await r.json()) as OssLinks;
      cached = data;
      return data;
    })
    .catch(() => null)
    .finally(() => {
      loading = null;
    });
  return loading;
}

function findItem(links: OssLinks, titleKey: string): OssItem | undefined {
  return links.items.find((it) => it.title === titleKey);
}

// 优先使用清单里的直链；若无，则按约定用 BASE + 文件名 兜底
export async function getReportUrlFromOSS(opportunityTitle: string): Promise<string | null> {
  const titleKey = sanitizeTitle(opportunityTitle);
  const links = await load();
  if (links) {
    const it = findItem(links, titleKey);
    if (it?.report) return it.report;
    // fallback：按规则拼接
    return `${links.baseReports}${titleKey}.html`;
  }
  // 最后兜底：用 APP_CONFIG 的 base
  return `${APP_CONFIG.OSS_STATIC.BASE_REPORTS}${titleKey}.html`;
}

export async function getBpRevealUrlFromOSS(opportunityTitle: string): Promise<string | null> {
  const titleKey = sanitizeTitle(opportunityTitle);
  const links = await load();
  if (links) {
    const it = findItem(links, titleKey);
    if (it?.bp_reveal) return it.bp_reveal;
    return `${links.baseBp}${titleKey}.reveal.html`;
  }
  return `${APP_CONFIG.OSS_STATIC.BASE_BP}${titleKey}.reveal.html`;
}

export async function getBpBasicUrlFromOSS(opportunityTitle: string): Promise<string | null> {
  const titleKey = sanitizeTitle(opportunityTitle);
  const links = await load();
  if (links) {
    const it = findItem(links, titleKey);
    if (it?.bp_basic) return it.bp_basic;
    return `${links.baseBp}${titleKey}.bp.html`;
  }
  return `${APP_CONFIG.OSS_STATIC.BASE_BP}${titleKey}.bp.html`;
}

// 优化的 URL 打开函数，video.sss.work 域名直接打开，其他使用 iframe 代理
export async function openUrlAsInlineHtml(url: string): Promise<boolean> {
  try {
    // 导入移动端检测函数
    const { isMobileDevice } = await import('@/utils/mobile-window');
    const isMobile = isMobileDevice();
    
    // video.sss.work 域名可以直接打开，不会强制下载
    if (url.includes('video.sss.work') || (!url.includes('.oss-cn-') && !url.includes('.aliyuncs.com'))) {
      if (isMobile) {
        // 移动端：直接在当前页面打开
        window.location.href = url;
      } else {
        // 桌面端：新窗口打开
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      return true;
    }
    
    // 对于其他可能强制下载的域名，使用简化的 iframe 代理
    const proxyHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>查看报告 - DeepNeed</title>
  <style>
    body { margin: 0; font-family: system-ui; }
    .header { background: #fff; padding: 10px 16px; border-bottom: 1px solid #eee; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .title { font-size: 14px; color: #333; font-weight: 500; }
    iframe { width: 100%; height: calc(100vh - 41px); border: none; }
  </style>
</head>
<body>
  <div class="header"><div class="title">📊 DeepNeed 深度报告</div></div>
  <iframe src="${url}"></iframe>
</body>
</html>`;
    
    const blob = new Blob([proxyHtml], { type: 'text/html;charset=utf-8' });
    const proxyUrl = URL.createObjectURL(blob);
    
    if (isMobile) {
      // 移动端：直接在当前页面打开代理页面
      window.location.href = proxyUrl;
    } else {
      // 桌面端：新窗口打开代理页面
      window.open(proxyUrl, '_blank', 'noopener,noreferrer');
    }
    
    setTimeout(() => URL.revokeObjectURL(proxyUrl), 30000);
    return true;
  } catch (error) {
    console.warn('openUrlAsInlineHtml failed:', error);
    // 导入移动端检测函数
    try {
      const { isMobileDevice } = await import('@/utils/mobile-window');
      const isMobile = isMobileDevice();
      
      if (isMobile) {
        window.location.href = url;
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch {
      // 回退到默认行为
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    return true;
  }
}


