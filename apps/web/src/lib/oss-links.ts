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

// 优先将 OSS 返回的 HTML 以 inline 的方式打开，避免浏览器下载
export async function openUrlAsInlineHtml(url: string): Promise<boolean> {
  try {
    const resp = await fetch(url, { mode: 'cors' });
    if (!resp.ok) return false;
    const html = await resp.text();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const obj = URL.createObjectURL(blob);
    window.open(obj, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(obj), 10000);
    return true;
  } catch {
    return false;
  }
}


