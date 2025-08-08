#!/usr/bin/env python3
"""
Reddit 终极抓取器
专门针对Reddit优化的世界级抓取解决方案
"""

import asyncio
import random
import json
import time
from datetime import datetime
from typing import List, Dict, Any
from playwright.async_api import async_playwright, Page


class RedditMasterScraper:
    """Reddit终极抓取器 - 专门破解Reddit的反爬虫机制"""
    
    def __init__(self):
        self.browser = None
        self.context = None
        self.playwright = None
        self.session_id = f"reddit_{int(time.time())}"
    
    async def setup_reddit_optimized_browser(self):
        """设置专门优化的Reddit浏览器环境"""
        print("🔥 初始化Reddit终极抓取环境...")
        
        self.playwright = await async_playwright().start()
        
        # Reddit专用的用户代理（避免被识别为爬虫）
        reddit_user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
        
        # 启动浏览器
        self.browser = await self.playwright.chromium.launch(
            headless=False,
            slow_mo=1200,
            args=[
                '--start-maximized',
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage', 
                '--no-sandbox',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--enable-automation=false',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--no-first-run',
                '--password-store=basic',
                '--use-mock-keychain',
                f'--user-agent={reddit_user_agent}'
            ]
        )
        
        # 创建上下文
        self.context = await self.browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent=reddit_user_agent,
            locale='en-US',
            timezone_id='America/New_York',
            extra_http_headers={
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cache-Control': 'max-age=0',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'sec-ch-ua': '"Google Chrome";v="121", "Not A(Brand";v="99", "Chromium";v="121"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"'
            }
        )
        
        # 注入超级反检测脚本
        await self.context.add_init_script("""
            console.log('🛡️ Reddit反检测系统已激活');
            
            // 1. 完全移除webdriver痕迹
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });
            
            // 2. 覆盖User Agent相关属性
            Object.defineProperty(navigator, 'languages', {
                get: () => ['en-US', 'en'],
            });
            
            // 3. 模拟真实的插件列表
            Object.defineProperty(navigator, 'plugins', {
                get: () => [
                    {name: 'Chrome PDF Plugin', description: 'Portable Document Format', filename: 'internal-pdf-viewer'},
                    {name: 'Chrome PDF Viewer', description: '', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai'},
                    {name: 'Native Client', description: '', filename: 'internal-nacl-plugin'}
                ],
            });
            
            // 4. 覆盖权限API
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ?
                    Promise.resolve({ state: Notification.permission }) :
                    originalQuery(parameters)
            );
            
            // 5. 移除所有Playwright/Automation相关的痕迹
            delete window.playwright;
            delete window.__playwright;
            delete window._playwright;
            delete window.callPhantom;
            delete window._phantom;
            delete window.phantom;
            delete window.fmget_targets;
            delete window.spawn;
            delete window.emit;
            delete window.webdriver;
            delete window.domAutomation;
            delete window.domAutomationController;
            delete window.__webdriver_script_fn;
            delete window.__driver_evaluate;
            delete window.__webdriver_evaluate;
            delete window.__selenium_evaluate;
            delete window.__fxdriver_evaluate;
            delete window.__driver_unwrapped;
            delete window.__webdriver_unwrapped;
            delete window.__selenium_unwrapped;
            delete window.__fxdriver_unwrapped;
            
            // 6. 覆盖console.debug以隐藏调试信息
            const originalDebug = console.debug;
            console.debug = function(...args) {
                if (args[0] && typeof args[0] === 'string' && 
                    (args[0].includes('playwright') || args[0].includes('automation'))) {
                    return;
                }
                return originalDebug.apply(console, args);
            };
            
            // 7. 模拟真实的screen属性
            Object.defineProperty(screen, 'availHeight', {
                get: () => 1055,
            });
            
            // 8. 模拟硬件信息
            Object.defineProperty(navigator, 'hardwareConcurrency', {
                get: () => 8,
            });
            
            Object.defineProperty(navigator, 'deviceMemory', {
                get: () => 8,
            });
            
            // 9. 覆盖Date时区
            const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset;
            Date.prototype.getTimezoneOffset = function() {
                return 300; // EST
            };
            
            // 10. 添加真实的Chrome runtime
            if (!window.chrome) {
                window.chrome = {
                    runtime: {}
                };
            }
            
            console.log('✅ Reddit超级反检测脚本配置完成');
        """)
        
        print("✅ Reddit专用浏览器环境配置完成")
    
    async def navigate_to_reddit_with_stealth(self, subreddit: str) -> Page:
        """使用隐身技术访问Reddit"""
        page = await self.context.new_page()
        
        # 添加页面级别的反检测
        await page.add_init_script("""
            // 页面级别的额外保护
            Object.defineProperty(document, 'hidden', {
                get: () => false,
            });
            
            Object.defineProperty(document, 'visibilityState', {
                get: () => 'visible',
            });
        """)
        
        url = f"https://www.reddit.com/r/{subreddit}/"
        print(f"🌐 隐身访问: {url}")
        
        try:
            # 首先访问Reddit主页建立会话
            await page.goto("https://www.reddit.com/", wait_until='domcontentloaded', timeout=20000)
            await asyncio.sleep(random.uniform(2, 4))
            
            # 然后访问目标subreddit
            await page.goto(url, wait_until='domcontentloaded', timeout=20000)
            await asyncio.sleep(random.uniform(3, 5))
            
            return page
            
        except Exception as e:
            print(f"⚠️ 访问失败: {e}")
            return page
    
    async def handle_reddit_popups_aggressively(self, page: Page):
        """激进处理Reddit弹窗"""
        print("🚫 激进处理Reddit弹窗和覆盖层...")
        
        # Reddit特定的弹窗选择器
        reddit_popup_selectors = [
            # App推广弹窗
            '[data-testid="onboarding-close"]',
            '[data-testid="onboarding-dismiss"]',
            'button[aria-label="Close"]',
            
            # Cookie同意
            'button:has-text("Accept all")',
            'button:has-text("Accept")',
            'button:has-text("Got it")',
            'button:has-text("OK")',
            
            # 登录弹窗
            'button:has-text("Maybe Later")',
            'button:has-text("Not now")',
            'button:has-text("Skip")',
            
            # Premium推广
            '[data-testid="premium-banner-close"]',
            '.premium-banner-close',
            
            # 通用关闭按钮
            'button:has-text("×")',
            'button:has-text("✕")',
            '[aria-label*="close"]',
            '[aria-label*="Close"]',
            '.close',
            '.dismiss',
            
            # 特定的Reddit弹窗
            '[data-click-id="close"]',
            '[data-testid="close-button"]'
        ]
        
        for selector in reddit_popup_selectors:
            try:
                elements = await page.query_selector_all(selector)
                for element in elements:
                    if await element.is_visible():
                        await element.click()
                        print(f"✅ 关闭弹窗: {selector}")
                        await asyncio.sleep(0.5)
            except:
                continue
        
        # 处理覆盖层
        await page.evaluate("""
            // 移除可能的覆盖层
            const overlays = document.querySelectorAll('[style*="position: fixed"], [style*="z-index"]');
            overlays.forEach(overlay => {
                if (overlay.style.zIndex > 1000) {
                    overlay.remove();
                }
            });
            
            // 确保页面可滚动
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
        """)
    
    async def smart_reddit_scroll_and_load(self, page: Page):
        """智能Reddit滚动和内容加载"""
        print("📜 执行智能Reddit滚动策略...")
        
        # 等待初始内容加载
        await asyncio.sleep(3)
        
        # 执行多轮滚动，模拟真实用户行为
        for round_num in range(4):
            print(f"   滚动轮次 {round_num + 1}/4")
            
            # 缓慢滚动，模拟阅读
            viewport_height = await page.evaluate("window.innerHeight")
            current_position = await page.evaluate("window.pageYOffset")
            target_position = current_position + viewport_height * 2
            
            # 分段滚动
            steps = 5
            for step in range(steps):
                position = current_position + (target_position - current_position) * (step + 1) / steps
                await page.evaluate(f"window.scrollTo(0, {position})")
                await asyncio.sleep(random.uniform(0.8, 1.5))
            
            # 等待新内容加载
            await asyncio.sleep(random.uniform(2, 4))
            
            # 检查是否到达底部
            is_at_bottom = await page.evaluate("""
                (window.innerHeight + window.pageYOffset) >= document.body.scrollHeight - 1000
            """)
            
            if is_at_bottom:
                print("   📄 已接近页面底部")
                break
    
    async def extract_reddit_posts_intelligently(self, page: Page, subreddit: str) -> List[Dict[str, Any]]:
        """智能提取Reddit帖子"""
        print("🧠 开始智能Reddit数据提取...")
        
        items = []
        
        # Reddit新旧版本的多重选择器策略
        post_selectors = [
            # 新版Reddit
            '[data-testid^="post-container"]',
            '[data-click-id="background"]',
            '[data-adclicklocation="title"]',
            
            # 旧版Reddit
            '.thing',
            '.link',
            
            # 移动版和其他版本
            'article',
            '.Post',
            '[role="article"]',
            
            # 通用容器
            'div[tabindex="0"]',
            'div[data-click-id]'
        ]
        
        posts = []
        for selector in post_selectors:
            posts = await page.query_selector_all(selector)
            if len(posts) > 5:  # 找到足够的帖子
                print(f"✅ 使用选择器找到 {len(posts)} 个帖子: {selector}")
                break
        
        if not posts:
            print("⚠️ 未找到帖子容器，尝试全页面搜索...")
            # 备用策略：搜索所有可能的标题元素
            posts = await page.query_selector_all('h1, h2, h3, [role="heading"], .title, a[data-click-id="body"]')
            print(f"🔍 备用策略找到 {len(posts)} 个可能的帖子元素")
        
        # 提取帖子信息
        extracted_count = 0
        for i, post in enumerate(posts[:30]):  # 限制处理数量
            try:
                # 多重标题提取策略
                title = await self._extract_reddit_title(post)
                if not title or len(title.strip()) < 10:
                    continue
                
                # 提取其他信息
                author = await self._extract_reddit_author(post)
                score = await self._extract_reddit_score(post)
                comments_count = await self._extract_reddit_comments(post)
                url = await self._extract_reddit_url(post, subreddit)
                
                item = {
                    'id': f"reddit_{subreddit}_{i}_{int(time.time())}",
                    'title': title.strip()[:300],
                    'author': author,
                    'score': score,
                    'comments_count': comments_count,
                    'url': url,
                    'subreddit': subreddit,
                    'platform': 'reddit',
                    'source': f'reddit_r_{subreddit}',
                    'scraped_at': datetime.now().isoformat(),
                    'method': 'reddit_master_scraper',
                    'session_id': self.session_id
                }
                
                items.append(item)
                extracted_count += 1
                print(f"  📝 {extracted_count:2d}. {title[:60]}...")
                
                if extracted_count >= 15:  # 限制提取数量
                    break
                    
            except Exception as e:
                print(f"⚠️ 提取帖子 {i} 时出错: {e}")
                continue
        
        print(f"✅ Reddit智能提取完成: {len(items)} 条数据")
        return items
    
    async def _extract_reddit_title(self, post_element) -> str:
        """提取Reddit标题"""
        title_selectors = [
            'h3',
            '[slot="title"]',
            'a[data-click-id="body"]',
            '[data-adclicklocation="title"]',
            '.title a',
            '.Post-title',
            'h1', 'h2',
            '[role="heading"]',
            '.link-title'
        ]
        
        for selector in title_selectors:
            try:
                title_elem = await post_element.query_selector(selector)
                if title_elem:
                    title = await title_elem.text_content()
                    if title and len(title.strip()) > 5:
                        return title.strip()
            except:
                continue
        
        # 备用策略：直接获取元素文本
        try:
            text = await post_element.text_content()
            if text and len(text.strip()) > 10:
                # 如果是长文本，取前100个字符作为标题
                return text.strip()[:100]
        except:
            pass
        
        return ""
    
    async def _extract_reddit_author(self, post_element) -> str:
        """提取Reddit作者"""
        author_selectors = [
            'a[data-testid="post_author_link"]',
            '[data-click-id="user"]',
            '.author',
            'a[href*="/user/"]',
            'a[href*="/u/"]'
        ]
        
        for selector in author_selectors:
            try:
                author_elem = await post_element.query_selector(selector)
                if author_elem:
                    author = await author_elem.text_content()
                    if author and author.strip():
                        return author.strip()
            except:
                continue
        return "Unknown"
    
    async def _extract_reddit_score(self, post_element) -> int:
        """提取Reddit评分"""
        score_selectors = [
            '[data-testid="vote-arrows"] button span',
            '.score',
            '[aria-label*="upvote"]',
            '.upvotes'
        ]
        
        for selector in score_selectors:
            try:
                score_elem = await post_element.query_selector(selector)
                if score_elem:
                    score_text = await score_elem.text_content()
                    if score_text:
                        # 解析数字
                        import re
                        numbers = re.findall(r'\d+', score_text.replace(',', ''))
                        if numbers:
                            return int(numbers[0])
            except:
                continue
        return 0
    
    async def _extract_reddit_comments(self, post_element) -> int:
        """提取Reddit评论数"""
        comment_selectors = [
            'a[data-click-id="comments"]',
            'a[href*="/comments/"]',
            '.comments',
            '[data-click-id="comments"] span'
        ]
        
        for selector in comment_selectors:
            try:
                comment_elem = await post_element.query_selector(selector)
                if comment_elem:
                    comment_text = await comment_elem.text_content()
                    if comment_text:
                        import re
                        numbers = re.findall(r'\d+', comment_text.replace(',', ''))
                        if numbers:
                            return int(numbers[0])
            except:
                continue
        return 0
    
    async def _extract_reddit_url(self, post_element, subreddit: str) -> str:
        """提取Reddit URL"""
        url_selectors = [
            'a[data-click-id="body"]',
            'a[href*="/comments/"]',
            '.title a',
            'h3 a'
        ]
        
        for selector in url_selectors:
            try:
                url_elem = await post_element.query_selector(selector)
                if url_elem:
                    href = await url_elem.get_attribute('href')
                    if href:
                        if href.startswith('http'):
                            return href
                        elif href.startswith('/'):
                            return f"https://www.reddit.com{href}"
            except:
                continue
        
        return f"https://www.reddit.com/r/{subreddit}/"
    
    async def scrape_reddit_subreddit(self, subreddit: str) -> List[Dict[str, Any]]:
        """抓取Reddit子版块"""
        print(f"\n🎯 开始抓取 r/{subreddit}")
        print("="*50)
        
        page = await self.navigate_to_reddit_with_stealth(subreddit)
        
        try:
            # 等待页面稳定
            await asyncio.sleep(3)
            
            # 处理弹窗
            await self.handle_reddit_popups_aggressively(page)
            
            # 智能滚动加载
            await self.smart_reddit_scroll_and_load(page)
            
            # 再次处理可能出现的弹窗
            await self.handle_reddit_popups_aggressively(page)
            
            # 智能数据提取
            items = await self.extract_reddit_posts_intelligently(page, subreddit)
            
            return items
            
        except Exception as e:
            print(f"❌ 抓取 r/{subreddit} 失败: {e}")
            # 保存调试截图
            await page.screenshot(path=f'reddit_{subreddit}_error_{self.session_id}.png')
            return []
        
        finally:
            await page.close()
    
    async def run_reddit_master_scraping(self) -> List[Dict[str, Any]]:
        """运行Reddit终极抓取"""
        print("🔥 启动Reddit终极抓取系统")
        print("="*60)
        
        await self.setup_reddit_optimized_browser()
        
        # 要抓取的subreddit列表
        subreddits = ['entrepreneur', 'startups', 'SaaS', 'smallbusiness', 'indiehackers']
        all_results = []
        
        for subreddit in subreddits[:3]:  # 限制3个以避免过长
            try:
                items = await self.scrape_reddit_subreddit(subreddit)
                all_results.extend(items)
                
                # 随机延迟，避免被检测
                delay = random.uniform(5, 10)
                print(f"⏳ 等待 {delay:.1f} 秒后继续下一个subreddit...")
                await asyncio.sleep(delay)
                
            except Exception as e:
                print(f"❌ 抓取 {subreddit} 时发生错误: {e}")
                continue
        
        return all_results
    
    def analyze_results(self, results: List[Dict[str, Any]]):
        """分析抓取结果"""
        print("\n" + "="*60)
        print("🎉 Reddit终极抓取完成!")
        print("="*60)
        
        if not results:
            print("⚠️ 未获取到数据")
            return
        
        # 统计分析
        total = len(results)
        subreddits = {}
        quality_metrics = {
            'has_author': 0,
            'has_score': 0,
            'has_comments': 0,
            'has_url': 0
        }
        
        for item in results:
            subreddit = item.get('subreddit', 'unknown')
            subreddits[subreddit] = subreddits.get(subreddit, 0) + 1
            
            if item.get('author') and item['author'] != 'Unknown':
                quality_metrics['has_author'] += 1
            if item.get('score', 0) > 0:
                quality_metrics['has_score'] += 1
            if item.get('comments_count', 0) > 0:
                quality_metrics['has_comments'] += 1
            if item.get('url') and 'reddit.com' in item['url']:
                quality_metrics['has_url'] += 1
        
        print(f"📊 总数据量: {total} 条")
        print(f"📈 数据质量指标:")
        for metric, count in quality_metrics.items():
            percentage = (count / total) * 100 if total > 0 else 0
            print(f"   {metric}: {count}/{total} ({percentage:.1f}%)")
        
        print(f"\n🌐 Subreddit分布:")
        for subreddit, count in sorted(subreddits.items()):
            percentage = (count / total) * 100
            print(f"   r/{subreddit:15}: {count:3d} 条 ({percentage:5.1f}%)")
        
        print(f"\n📝 高质量数据样本:")
        # 显示质量最高的帖子
        sorted_results = sorted(results, key=lambda x: (
            len(x.get('title', '')),
            x.get('score', 0),
            x.get('comments_count', 0)
        ), reverse=True)
        
        for i, item in enumerate(sorted_results[:8]):
            title = item.get('title', 'No title')[:50]
            author = item.get('author', 'Unknown')
            score = item.get('score', 0)
            comments = item.get('comments_count', 0)
            subreddit = item.get('subreddit', '')
            
            print(f"  {i+1}. [r/{subreddit}] {title}...")
            print(f"      👤 {author} | ⭐ {score} | 💬 {comments}")
        
        # 保存结果
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"reddit_master_results_{timestamp}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump({
                'session_id': self.session_id,
                'timestamp': timestamp,
                'total_items': total,
                'quality_metrics': quality_metrics,
                'subreddits': subreddits,
                'data': results
            }, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 完整结果已保存到: {filename}")
        print(f"⏰ 完成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    async def cleanup(self):
        """清理资源"""
        print("\n🧹 清理Reddit终极抓取器资源...")
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()
        print("✅ 清理完成")


async def main():
    """主函数"""
    print("🔥 Reddit终极抓取器")
    print("🕷️ 专门破解Reddit反爬虫机制")
    print(f"⏰ 启动时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    scraper = RedditMasterScraper()
    
    try:
        results = await scraper.run_reddit_master_scraping()
        scraper.analyze_results(results)
        
    except KeyboardInterrupt:
        print("\n⏹️ 用户中断")
    except Exception as e:
        print(f"\n❌ 执行失败: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await scraper.cleanup()


if __name__ == "__main__":
    asyncio.run(main())