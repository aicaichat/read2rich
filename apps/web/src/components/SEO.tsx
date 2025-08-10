import React, { useEffect } from 'react';

type SEOProps = {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string; // og:type
  jsonLd?: Record<string, any> | Record<string, any>[];
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  if (!content) return;
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  const selector = `link[rel="${rel}"]`;
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function SEO({ title, description = '', url = '', image = '', type = 'website', jsonLd }: SEOProps) {
  useEffect(() => {
    // Title
    if (title) document.title = title;

    // Basic
    if (description) upsertMeta('name', 'description', description);
    if (url) upsertLink('canonical', url);

    // Open Graph
    if (title) upsertMeta('property', 'og:title', title);
    if (description) upsertMeta('property', 'og:description', description);
    if (url) upsertMeta('property', 'og:url', url);
    if (image) upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:type', type);

    // Twitter
    upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    if (title) upsertMeta('name', 'twitter:title', title);
    if (description) upsertMeta('name', 'twitter:description', description);
    if (image) upsertMeta('name', 'twitter:image', image);

    // JSON-LD
    const scriptId = 'seo-jsonld';
    const prev = document.getElementById(scriptId);
    if (prev) prev.remove();
    if (jsonLd) {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.id = scriptId;
      try {
        s.text = JSON.stringify(jsonLd);
        document.head.appendChild(s);
      } catch {}
    }
  }, [title, description, url, image, type, JSON.stringify(jsonLd)]);

  return null;
}


