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

// 智能处理 OSS URL，自定义域名直接打开，默认域名使用 iframe 代理
export async function openUrlAsInlineHtml(url: string): Promise<boolean> {
  try {
    // 如果是自定义域名，直接打开（不会强制下载）
    if (!url.includes('.oss-cn-') && !url.includes('.aliyuncs.com')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return true;
    }
    
    // 如果是 OSS 默认域名，使用 iframe 代理避免强制下载
    const proxyHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>查看报告 - DeepNeed</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      background: #f5f5f5;
    }
    .container { 
      width: 100vw; height: 100vh; 
      display: flex; flex-direction: column;
    }
    .header {
      background: #fff; padding: 12px 20px; 
      border-bottom: 1px solid #e5e5e5;
      display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .title { font-size: 14px; color: #333; font-weight: 500; }
    .loading { 
      position: absolute; top: 50%; left: 50%; 
      transform: translate(-50%, -50%);
      color: #666; font-size: 14px; z-index: 1000;
      display: flex; align-items: center; gap: 8px;
    }
    .spinner {
      width: 16px; height: 16px; border: 2px solid #e5e5e5;
      border-top: 2px solid #007AFF; border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    iframe { 
      flex: 1; width: 100%; border: none; 
      background: #fff;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">📊 DeepNeed 深度报告</div>
    </div>
    <div class="loading">
      <div class="spinner"></div>
      <span>正在加载报告...</span>
    </div>
    <iframe src="${url}" onload="document.querySelector('.loading').style.display='none'"></iframe>
  </div>
</body>
</html>`;
    
    const blob = new Blob([proxyHtml], { type: 'text/html;charset=utf-8' });
    const proxyUrl = URL.createObjectURL(blob);
    window.open(proxyUrl, '_blank', 'noopener,noreferrer');
    
    // 延迟清理 URL
    setTimeout(() => URL.revokeObjectURL(proxyUrl), 60000);
    return true;
  } catch (error) {
    console.warn('openUrlAsInlineHtml failed:', error);
    // 回退：直接打开原 URL
    window.open(url, '_blank', 'noopener,noreferrer');
    return true;
  }
}


