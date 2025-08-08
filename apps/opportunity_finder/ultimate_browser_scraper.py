#!/usr/bin/env python3
"""
终极浏览器自动化抓取系统
世界级爬虫专家设计的高级抓取解决方案
"""

import asyncio
import random
import json
import time
import hashlib
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from playwright.async_api import async_playwright, Page, BrowserContext
import re


@dataclass
class ScrapingTarget:
    """抓取目标配置"""
    name: str
    url: str
    selectors: Dict[str, List[str]]  # 多重选择器策略
    wait_conditions: List[str]
    scroll_strategy: str = "default"
    anti_detection: Dict[str, Any] = None


class WorldClassBrowserScraper:
    """世界级浏览器自动化抓取器"""
    
    def __init__(self):
        self.browser = None
        self.context = None
        self.playwright = None
        self.results = []
        self.session_id = self._generate_session_id()
        
        # 高级用户代理池
        self.user_agents = [
            # Chrome - Windows
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            # Chrome - macOS  
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            # Firefox
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:122.0) Gecko/20100101 Firefox/122.0",
            # Safari
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15",
        ]
        
        # 视窗大小池
        self.viewports = [
            {"width": 1920, "height": 1080},
            {"width": 1366, "height": 768}, 
            {"width": 1440, "height": 900},
            {"width": 1536, "height": 864},
            {"width": 1280, "height": 720}
        ]
        
        # 抓取目标配置
        self.targets = {
            'reddit': ScrapingTarget(
                name="Reddit",
                url="https://www.reddit.com/r/{}/",
                selectors={
                    'posts': [
                        '[data-testid="post-container"]',
                        'article',
                        'div[data-click-id="body"]',
                        '.Post',
                        '[data-adclicklocation="title"]'
                    ],
                    'title': [
                        'h3',
                        '[slot="title"]', 
                        'a[data-click-id="body"]',
                        '.title a',
                        '[data-adclicklocation="title"]'
                    ],
                    'score': [
                        '[data-testid="vote-arrows"] button span',
                        '.score',
                        '[aria-label*="upvote"]'
                    ],
                    'author': [
                        'a[data-testid="post_author_link"]',
                        '.author',
                        '[data-click-id="user"]'
                    ],
                    'comments': [
                        'a[data-click-id="comments"]',
                        '[data-click-id="comments"] span'
                    ]
                },
                wait_conditions=['networkidle', '[data-testid="post-container"], article, .Post'],
                scroll_strategy="infinite",
                anti_detection={
                    'close_popups': True,
                    'random_mouse_movement': True,
                    'typing_delay': True
                }
            ),
            
            'hackernews': ScrapingTarget(
                name="HackerNews", 
                url="https://news.ycombinator.com/",
                selectors={
                    'posts': [
                        'tr.athing',
                        '.storylink'
                    ],
                    'title': [
                        'span.titleline > a',
                        '.storylink'
                    ],
                    'score': [
                        '.score',
                        'span[id^="score_"]'
                    ],
                    'comments': [
                        'a[href*="item?id="]'
                    ],
                    'domain': [
                        '.sitestr'
                    ]
                },
                wait_conditions=['networkidle', 'tr.athing'],
                scroll_strategy="none"
            ),
            
            'producthunt': ScrapingTarget(
                name="Product Hunt",
                url="https://www.producthunt.com/",
                selectors={
                    'posts': [
                        '[data-test*="product"]',
                        'article',
                        '.item',
                        'div[style*="cursor: pointer"]'
                    ],
                    'title': [
                        'h3',
                        'h2', 
                        '[data-test="product-name"]',
                        'strong'
                    ],
                    'description': [
                        'p',
                        '[data-test="product-description"]',
                        '.description'
                    ],
                    'votes': [
                        '[data-test="vote-button"]',
                        '.vote-count',
                        'button[aria-label*="upvote"]'
                    ]
                },
                wait_conditions=['networkidle', 'h3, h2, article'],
                scroll_strategy="smooth",
                anti_detection={
                    'wait_for_js': 5,
                    'random_scroll': True
                }
            ),
            
            'indiehackers': ScrapingTarget(
                name="IndieHackers",
                url="https://www.indiehackers.com/",
                selectors={
                    'posts': [
                        '.feed-item',
                        'article',
                        '.post-item'
                    ],
                    'title': [
                        'h2 a',
                        'h3 a',
                        '.post-title'
                    ],
                    'author': [
                        '.author',
                        '[data-test="username"]'
                    ],
                    'engagement': [
                        '.engagement',
                        '.stats'
                    ]
                },
                wait_conditions=['networkidle', '.feed-item, article'],
                scroll_strategy="smooth"
            )
        }
    
    def _generate_session_id(self) -> str:
        """生成会话ID"""
        return hashlib.md5(str(time.time()).encode()).hexdigest()[:12]
    
    async def setup_ultimate_browser(self) -> None:
        """设置终极浏览器环境"""
        print("🚀 初始化世界级浏览器自动化环境...")
        
        self.playwright = await async_playwright().start()
        
        # 随机选择用户代理和视窗
        user_agent = random.choice(self.user_agents)
        viewport = random.choice(self.viewports)
        
        print(f"🎭 使用用户代理: {user_agent[:50]}...")
        print(f"📱 视窗大小: {viewport['width']}x{viewport['height']}")
        
        # 高级浏览器配置
        self.browser = await self.playwright.chromium.launch(
            headless=False,  # 可视化模式
            slow_mo=800,     # 适中的延迟
            args=[
                '--start-maximized',
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
                '--no-sandbox',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-field-trial-config',
                '--disable-back-forward-cache',
                '--disable-ipc-flooding-protection',
                '--enable-automation=false',
                '--no-first-run',
                '--password-store=basic',
                '--use-mock-keychain',
                f'--user-agent={user_agent}'
            ]
        )
        
        # 创建隐身上下文
        self.context = await self.browser.new_context(
            viewport=viewport,
            user_agent=user_agent,
            locale='en-US',
            timezone_id='America/New_York',
            permissions=['geolocation'],
            color_scheme='light',
            reduced_motion='reduce',
            extra_http_headers={
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cache-Control': 'max-age=0',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1'
            }
        )
        
        # 注入世界级反检测脚本
        await self.context.add_init_script("""
            console.log('🛡️ 世界级反检测系统已激活');
            
            // 1. 移除webdriver标识
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });
            
            // 2. 模拟真实浏览器特征
            Object.defineProperty(navigator, 'languages', {
                get: () => ['en-US', 'en', 'zh-CN', 'zh'],
            });
            
            Object.defineProperty(navigator, 'plugins', {
                get: () => [
                    {name: 'Chrome PDF Plugin', description: 'Portable Document Format'},
                    {name: 'Chrome PDF Viewer', description: 'PDF Viewer'},
                    {name: 'Native Client', description: 'Native Client'},
                    {name: 'Chromium PDF Plugin', description: 'Portable Document Format'},
                    {name: 'Microsoft Edge PDF Plugin', description: 'PDF Plugin'}
                ],
            });
            
            // 3. 覆盖Permission API
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ?
                    Promise.resolve({ state: Notification.permission }) :
                    originalQuery(parameters)
            );
            
            // 4. 模拟真实的screen属性
            Object.defineProperty(screen, 'availHeight', {
                get: () => window.screen.height - 40,
            });
            
            Object.defineProperty(screen, 'availWidth', {
                get: () => window.screen.width,
            });
            
            // 5. 覆盖Date.prototype.getTimezoneOffset
            const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset;
            Date.prototype.getTimezoneOffset = function() {
                return 300; // EST timezone
            };
            
            // 6. 模拟真实的hardwareConcurrency
            Object.defineProperty(navigator, 'hardwareConcurrency', {
                get: () => 8,
            });
            
            // 7. 模拟deviceMemory
            Object.defineProperty(navigator, 'deviceMemory', {
                get: () => 8,
            });
            
            // 8. 移除Playwright特征
            delete window.playwright;
            delete window.__playwright;
            delete window._playwright;
            
            // 9. 覆盖console.debug
            const originalDebug = console.debug;
            console.debug = function(...args) {
                if (args[0] && args[0].includes && args[0].includes('playwright')) {
                    return;
                }
                return originalDebug.apply(console, args);
            };
            
            console.log('✅ 反检测脚本配置完成');
        """)
        
        print("✅ 世界级浏览器环境设置完成")
    
    async def smart_wait_and_load(self, page: Page, target: ScrapingTarget) -> None:
        """智能等待和加载策略"""
        print(f"⏳ 智能等待页面加载...")
        
        # 1. 基础等待
        try:
            await page.wait_for_load_state('networkidle', timeout=15000)
        except:
            print("⚠️ 网络空闲等待超时，继续...")
        
        # 2. 元素等待
        for condition in target.wait_conditions:
            if condition != 'networkidle':
                try:
                    await page.wait_for_selector(condition, timeout=8000)
                    print(f"✅ 找到元素: {condition}")
                    break
                except:
                    print(f"⚠️ 元素等待超时: {condition}")
                    continue
        
        # 3. JavaScript执行等待
        if target.anti_detection and target.anti_detection.get('wait_for_js'):
            await asyncio.sleep(target.anti_detection['wait_for_js'])
        
        # 4. 智能滚动策略
        await self._execute_scroll_strategy(page, target.scroll_strategy)
    
    async def _execute_scroll_strategy(self, page: Page, strategy: str) -> None:
        """执行智能滚动策略"""
        if strategy == "infinite":
            print("📜 执行无限滚动策略...")
            for i in range(5):
                await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                await asyncio.sleep(random.uniform(2, 4))
                
                # 检查是否有新内容加载
                old_height = await page.evaluate("document.body.scrollHeight")
                await asyncio.sleep(2)
                new_height = await page.evaluate("document.body.scrollHeight")
                
                if old_height == new_height:
                    print("📄 已到达页面底部")
                    break
        
        elif strategy == "smooth":
            print("🌊 执行平滑滚动策略...")
            viewport_height = await page.evaluate("window.innerHeight")
            total_height = await page.evaluate("document.body.scrollHeight")
            
            for position in range(0, total_height, viewport_height // 2):
                await page.evaluate(f"window.scrollTo(0, {position})")
                await asyncio.sleep(random.uniform(1, 2))
    
    async def handle_popups_and_overlays(self, page: Page) -> None:
        """处理弹窗和覆盖层"""
        print("🚫 检查并关闭弹窗...")
        
        popup_selectors = [
            # 通用关闭按钮
            '[aria-label="Close"]',
            '[aria-label="close"]', 
            'button:has-text("Close")',
            'button:has-text("×")',
            'button:has-text("✕")',
            '[data-testid="close-button"]',
            '.close-button',
            '.modal-close',
            
            # Reddit特定
            '[data-testid="onboarding-close"]',
            '[data-testid="premium-banner-close"]',
            'button[aria-label="Close"]',
            
            # Product Hunt特定
            '[data-test="dismiss-button"]',
            '.dismiss',
            
            # Cookie横幅
            'button:has-text("Accept")',
            'button:has-text("Got it")',
            'button:has-text("OK")',
            '.cookie-accept'
        ]
        
        for selector in popup_selectors:
            try:
                element = await page.query_selector(selector)
                if element:
                    await element.click()
                    print(f"✅ 关闭弹窗: {selector}")
                    await asyncio.sleep(0.5)
            except:
                continue
    
    async def smart_extract_data(self, page: Page, target: ScrapingTarget) -> List[Dict[str, Any]]:
        """智能数据提取"""
        print(f"🧠 开始智能数据提取...")
        
        items = []
        
        # 1. 寻找主要内容容器
        posts = []
        for selector_list in target.selectors['posts']:
            posts = await page.query_selector_all(selector_list)
            if posts and len(posts) > 3:  # 至少找到3个以上才认为有效
                print(f"✅ 找到 {len(posts)} 个内容项 (选择器: {selector_list})")
                break
        
        if not posts:
            print("⚠️ 未找到内容项，尝试备用策略...")
            await page.screenshot(path=f'{target.name.lower()}_debug_{self.session_id}.png')
            return items
        
        # 2. 智能提取每个项目的数据
        for i, post in enumerate(posts[:20]):  # 限制前20个项目
            try:
                item_data = {
                    'id': f"{target.name.lower()}_{i}_{int(time.time())}",
                    'source': target.name.lower(),
                    'platform': target.name.lower(),
                    'scraped_at': datetime.now().isoformat(),
                    'session_id': self.session_id
                }
                
                # 提取标题
                title = await self._extract_field(post, target.selectors.get('title', []))
                if title:
                    item_data['title'] = title.strip()[:300]
                
                # 提取描述
                description = await self._extract_field(post, target.selectors.get('description', []))
                if description:
                    item_data['description'] = description.strip()[:500]
                
                # 提取评分/投票
                score = await self._extract_field(post, target.selectors.get('score', []))
                if score:
                    item_data['score'] = self._parse_number(score)
                
                votes = await self._extract_field(post, target.selectors.get('votes', []))
                if votes:
                    item_data['votes'] = self._parse_number(votes)
                
                # 提取作者
                author = await self._extract_field(post, target.selectors.get('author', []))
                if author:
                    item_data['author'] = author.strip()
                
                # 提取评论数
                comments = await self._extract_field(post, target.selectors.get('comments', []))
                if comments:
                    item_data['comments_count'] = self._parse_number(comments)
                
                # 提取链接
                url = await self._extract_link(post)
                if url:
                    item_data['url'] = url
                
                # 只保存有标题的项目
                if item_data.get('title') and len(item_data['title']) > 5:
                    items.append(item_data)
                    print(f"  📝 {i+1:2d}. {item_data['title'][:60]}...")
                
            except Exception as e:
                print(f"⚠️ 提取项目 {i} 时出错: {e}")
                continue
        
        print(f"✅ 智能提取完成: {len(items)} 条有效数据")
        return items
    
    async def _extract_field(self, element, selectors: List[str]) -> Optional[str]:
        """从元素中提取字段"""
        for selector in selectors:
            try:
                field_element = await element.query_selector(selector)
                if field_element:
                    text = await field_element.text_content()
                    if text and text.strip():
                        return text.strip()
            except:
                continue
        return None
    
    async def _extract_link(self, element) -> Optional[str]:
        """提取链接"""
        link_selectors = ['a', '[href]', 'a[data-click-id="body"]']
        for selector in link_selectors:
            try:
                link_element = await element.query_selector(selector)
                if link_element:
                    href = await link_element.get_attribute('href')
                    if href:
                        return href if href.startswith('http') else f"https://reddit.com{href}"
            except:
                continue
        return None
    
    def _parse_number(self, text: str) -> int:
        """解析数字"""
        if not text:
            return 0
        
        # 移除非数字字符，保留k, m等
        text = re.sub(r'[^\d.km]', '', text.lower())
        
        try:
            if 'k' in text:
                return int(float(text.replace('k', '')) * 1000)
            elif 'm' in text:
                return int(float(text.replace('m', '')) * 1000000)
            else:
                return int(float(re.sub(r'[^\d.]', '', text)))
        except:
            return 0
    
    async def scrape_target(self, target_name: str, **kwargs) -> List[Dict[str, Any]]:
        """抓取指定目标"""
        if target_name not in self.targets:
            print(f"❌ 未知目标: {target_name}")
            return []
        
        target = self.targets[target_name]
        page = await self.context.new_page()
        
        try:
            # 构建URL
            url = target.url
            if '{}' in url and kwargs.get('subreddit'):
                url = url.format(kwargs['subreddit'])
            
            print(f"\n🎯 抓取目标: {target.name}")
            print(f"🌐 访问: {url}")
            
            # 访问页面
            await page.goto(url, wait_until='domcontentloaded', timeout=30000)
            
            # 智能等待和加载
            await self.smart_wait_and_load(page, target)
            
            # 处理弹窗
            if target.anti_detection and target.anti_detection.get('close_popups'):
                await self.handle_popups_and_overlays(page)
            
            # 随机鼠标移动（模拟真实用户）
            if target.anti_detection and target.anti_detection.get('random_mouse_movement'):
                await self._simulate_human_behavior(page)
            
            # 智能数据提取
            items = await self.smart_extract_data(page, target)
            
            return items
            
        except Exception as e:
            print(f"❌ 抓取 {target.name} 失败: {e}")
            await page.screenshot(path=f'{target_name}_error_{self.session_id}.png')
            return []
        
        finally:
            await page.close()
    
    async def _simulate_human_behavior(self, page: Page) -> None:
        """模拟人类行为"""
        # 随机鼠标移动
        for _ in range(3):
            x = random.randint(100, 800)
            y = random.randint(100, 600) 
            await page.mouse.move(x, y)
            await asyncio.sleep(random.uniform(0.5, 1.5))
    
    async def run_comprehensive_scraping(self) -> List[Dict[str, Any]]:
        """运行全面抓取"""
        print("🚀 启动世界级全面抓取系统")
        print("=" * 70)
        
        await self.setup_ultimate_browser()
        
        all_results = []
        
        # Reddit 多社区抓取
        reddit_communities = ['entrepreneur', 'startups', 'SaaS', 'smallbusiness']
        for community in reddit_communities[:2]:  # 限制2个社区避免过长
            print(f"\n{'='*50}")
            items = await self.scrape_target('reddit', subreddit=community)
            all_results.extend(items)
            await asyncio.sleep(random.uniform(3, 5))
        
        # HackerNews
        print(f"\n{'='*50}")
        hn_items = await self.scrape_target('hackernews')
        all_results.extend(hn_items)
        await asyncio.sleep(random.uniform(2, 4))
        
        # Product Hunt
        print(f"\n{'='*50}")
        ph_items = await self.scrape_target('producthunt')
        all_results.extend(ph_items)
        await asyncio.sleep(random.uniform(2, 4))
        
        # IndieHackers
        print(f"\n{'='*50}")
        ih_items = await self.scrape_target('indiehackers')
        all_results.extend(ih_items)
        
        self.results = all_results
        return all_results
    
    def analyze_and_display_results(self) -> None:
        """分析和展示结果"""
        print("\n" + "="*70)
        print("🎉 世界级抓取系统执行完成!")
        print("="*70)
        
        if not self.results:
            print("⚠️ 未获取到数据")
            return
        
        # 统计分析
        total_items = len(self.results)
        platforms = {}
        quality_score = 0
        
        for item in self.results:
            platform = item.get('platform', 'unknown')
            platforms[platform] = platforms.get(platform, 0) + 1
            
            # 数据质量评分
            score = 0
            if item.get('title'): score += 2
            if item.get('description'): score += 1
            if item.get('score') or item.get('votes'): score += 1
            if item.get('author'): score += 1
            if item.get('url'): score += 1
            quality_score += score
        
        avg_quality = quality_score / total_items if total_items > 0 else 0
        
        print(f"📊 抓取统计:")
        print(f"   总数据量: {total_items} 条")
        print(f"   数据质量评分: {avg_quality:.1f}/6.0 ⭐")
        print(f"   会话ID: {self.session_id}")
        
        print(f"\n📈 平台分布:")
        for platform, count in sorted(platforms.items()):
            percentage = (count / total_items) * 100
            print(f"   🌐 {platform:15}: {count:3d} 条 ({percentage:5.1f}%)")
        
        print(f"\n📝 高质量数据样本:")
        # 按质量排序显示
        sorted_items = sorted(self.results, 
                            key=lambda x: len(str(x.get('title', ''))), 
                            reverse=True)
        
        for i, item in enumerate(sorted_items[:10]):
            platform = item.get('platform', '').upper()
            title = item.get('title', 'No title')[:60]
            score = item.get('score', item.get('votes', 0))
            quality_indicators = []
            
            if item.get('description'): quality_indicators.append('📝')
            if item.get('author'): quality_indicators.append('👤')
            if item.get('url'): quality_indicators.append('🔗')
            if score: quality_indicators.append(f'⭐{score}')
            
            indicators = ' '.join(quality_indicators)
            print(f"  {i+1:2d}. [{platform:12}] {title}... {indicators}")
        
        # 保存结果
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"ultimate_scraping_results_{timestamp}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump({
                'session_id': self.session_id,
                'timestamp': timestamp,
                'total_items': total_items,
                'quality_score': avg_quality,
                'platforms': platforms,
                'data': self.results
            }, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 详细结果已保存到: {filename}")
        print(f"⏰ 完成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    async def cleanup(self) -> None:
        """清理资源"""
        print("\n🧹 清理世界级浏览器资源...")
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()
        print("✅ 清理完成")


async def main():
    """主函数"""
    print("🌟 世界级浏览器自动化抓取系统")
    print("🕷️ 由顶级爬虫专家设计")
    print(f"⏰ 启动时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    scraper = WorldClassBrowserScraper()
    
    try:
        await scraper.run_comprehensive_scraping()
        scraper.analyze_and_display_results()
        
    except KeyboardInterrupt:
        print("\n⏹️ 用户中断执行")
    except Exception as e:
        print(f"\n❌ 执行失败: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await scraper.cleanup()


if __name__ == "__main__":
    asyncio.run(main())