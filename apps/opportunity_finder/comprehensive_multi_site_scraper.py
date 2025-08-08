#!/usr/bin/env python3
"""
全面多网站抓取器 - 抓取所有目标网站
包含AI机会发现的所有重要数据源
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
    category: str  # 'social', 'tech_news', 'startup', 'newsletter', 'reviews'
    priority: int  # 1=highest, 5=lowest
    urls: List[str]
    selectors: Dict[str, List[str]]
    wait_conditions: List[str]
    scroll_strategy: str = "default"
    anti_detection: Dict[str, Any] = None
    success_rate: float = 0.0  # 历史成功率


class ComprehensiveMultiSiteScraper:
    """全面多网站抓取器 - 覆盖所有AI机会发现数据源"""
    
    def __init__(self):
        self.browser = None
        self.context = None
        self.playwright = None
        self.results = []
        self.session_id = self._generate_session_id()
        
        # 高级用户代理池（更真实的用户代理）
        self.user_agents = [
            # Chrome on Windows
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            # Chrome on macOS
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
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
        
        # 完整的目标网站配置
        self.targets = self._initialize_comprehensive_targets()
    
    def _generate_session_id(self) -> str:
        """生成会话ID"""
        return hashlib.md5(str(time.time()).encode()).hexdigest()[:12]
    
    def _initialize_comprehensive_targets(self) -> Dict[str, ScrapingTarget]:
        """初始化所有目标网站配置"""
        return {
            # 1. 技术新闻类 - 最高优先级
            'hackernews': ScrapingTarget(
                name="Hacker News",
                category="tech_news",
                priority=1,
                urls=["https://news.ycombinator.com/"],
                selectors={
                    'posts': ['tr.athing'],
                    'title': ['span.titleline > a', '.storylink'],
                    'score': ['.score', 'span[id^="score_"]'],
                    'comments': ['a[href*="item?id="]'],
                    'domain': ['.sitestr']
                },
                wait_conditions=['networkidle', 'tr.athing'],
                scroll_strategy="none",
                success_rate=1.0  # 100% 成功率
            ),
            
            # 2. 创业产品类 - 高优先级
            'producthunt': ScrapingTarget(
                name="Product Hunt",
                category="startup",
                priority=2,
                urls=["https://www.producthunt.com/"],
                selectors={
                    'posts': ['[data-test*="product"]', 'article', '.item'],
                    'title': ['h3', 'h2', '[data-test="product-name"]'],
                    'description': ['p', '[data-test="product-description"]'],
                    'votes': ['[data-test="vote-button"]', '.vote-count'],
                    'category': ['.category', '[data-test="category"]']
                },
                wait_conditions=['networkidle', 'h3, h2, article'],
                scroll_strategy="smooth",
                anti_detection={'wait_for_js': 5, 'random_scroll': True},
                success_rate=0.7
            ),
            
            # 3. 独立开发者社区 - 高优先级
            'indiehackers': ScrapingTarget(
                name="Indie Hackers",
                category="startup",
                priority=2,
                urls=["https://www.indiehackers.com/"],
                selectors={
                    'posts': ['.feed-item', 'article', '.post-item'],
                    'title': ['h2 a', 'h3 a', '.post-title'],
                    'author': ['.author', '[data-test="username"]'],
                    'engagement': ['.engagement', '.stats']
                },
                wait_conditions=['networkidle', '.feed-item, article'],
                scroll_strategy="smooth",
                success_rate=0.6
            ),
            
            # 4. Reddit 多社区 - 中优先级
            'reddit_entrepreneur': ScrapingTarget(
                name="Reddit - Entrepreneur",
                category="social",
                priority=3,
                urls=["https://www.reddit.com/r/entrepreneur/"],
                selectors={
                    'posts': ['[data-testid^="post-container"]', 'article', '.Post'],
                    'title': ['h3', '[slot="title"]', '[data-adclicklocation="title"]'],
                    'score': ['[data-testid="vote-arrows"] button span', '.score'],
                    'author': ['a[data-testid="post_author_link"]', '.author'],
                    'comments': ['a[data-click-id="comments"]']
                },
                wait_conditions=['networkidle', '[data-testid="post-container"], article'],
                scroll_strategy="infinite",
                anti_detection={'close_popups': True, 'random_mouse_movement': True},
                success_rate=0.4
            ),
            
            'reddit_startups': ScrapingTarget(
                name="Reddit - Startups",
                category="social", 
                priority=3,
                urls=["https://www.reddit.com/r/startups/"],
                selectors={
                    'posts': ['[data-testid^="post-container"]', 'article', '.Post'],
                    'title': ['h3', '[slot="title"]', '[data-adclicklocation="title"]'],
                    'score': ['[data-testid="vote-arrows"] button span', '.score'],
                    'author': ['a[data-testid="post_author_link"]', '.author'],
                    'comments': ['a[data-click-id="comments"]']
                },
                wait_conditions=['networkidle', '[data-testid="post-container"], article'],
                scroll_strategy="infinite", 
                anti_detection={'close_popups': True, 'random_mouse_movement': True},
                success_rate=0.4
            ),
            
            'reddit_saas': ScrapingTarget(
                name="Reddit - SaaS",
                category="social",
                priority=3,
                urls=["https://www.reddit.com/r/SaaS/"],
                selectors={
                    'posts': ['[data-testid^="post-container"]', 'article', '.Post'],
                    'title': ['h3', '[slot="title"]', '[data-adclicklocation="title"]'],
                    'score': ['[data-testid="vote-arrows"] button span', '.score'],
                    'author': ['a[data-testid="post_author_link"]', '.author'],
                    'comments': ['a[data-click-id="comments"]']
                },
                wait_conditions=['networkidle', '[data-testid="post-container"], article'],
                scroll_strategy="infinite",
                anti_detection={'close_popups': True, 'random_mouse_movement': True},
                success_rate=0.4
            ),
            
            # 5. 软件评测类 - 中优先级
            'g2_ai': ScrapingTarget(
                name="G2 - AI Software",
                category="reviews",
                priority=3,
                urls=["https://www.g2.com/categories/artificial-intelligence"],
                selectors={
                    'posts': ['.product-listing', '.product-card'],
                    'title': ['.product-name', 'h3 a'],
                    'rating': ['.rating', '.stars'],
                    'reviews_count': ['.review-count'],
                    'category': ['.category-name'],
                    'description': ['.product-description']
                },
                wait_conditions=['networkidle', '.product-listing'],
                scroll_strategy="smooth",
                anti_detection={'wait_for_js': 3},
                success_rate=0.5
            ),
            
            # 6. 技术博客和新闻源 - 中优先级
            'betalist': ScrapingTarget(
                name="BetaList",
                category="startup",
                priority=3,
                urls=["https://betalist.com/"],
                selectors={
                    'posts': ['.startup-card', '.startup-item'],
                    'title': ['.startup-name', 'h3'],
                    'description': ['.startup-description'],
                    'category': ['.startup-category'],
                    'status': ['.startup-status']
                },
                wait_conditions=['networkidle', '.startup-card'],
                scroll_strategy="smooth",
                success_rate=0.6
            ),
            
            # 7. 开发者社区 - 低优先级
            'devto': ScrapingTarget(
                name="Dev.to",
                category="tech_news",
                priority=4,
                urls=["https://dev.to/"],
                selectors={
                    'posts': ['article', '.crayons-story'],
                    'title': ['h2 a', '.crayons-story__title a'],
                    'author': ['.crayons-story__secondary .crayons-link'],
                    'tags': ['.crayons-tag'],
                    'reactions': ['.crayons-story__reaction']
                },
                wait_conditions=['networkidle', 'article'],
                scroll_strategy="smooth",
                success_rate=0.7
            ),
            
            # 8. 创业媒体 - 低优先级
            'techcrunch_startups': ScrapingTarget(
                name="TechCrunch Startups",
                category="tech_news",
                priority=4,
                urls=["https://techcrunch.com/category/startups/"],
                selectors={
                    'posts': ['article', '.post-block'],
                    'title': ['h2 a', '.post-block__title a'],
                    'author': ['.river-byline__authors'],
                    'publish_time': ['.river-byline__time'],
                    'excerpt': ['.post-block__content']
                },
                wait_conditions=['networkidle', 'article'],
                scroll_strategy="smooth",
                anti_detection={'wait_for_js': 3},
                success_rate=0.5
            ),
            
            # 9. AngelList/Wellfound - 中优先级
            'angellist': ScrapingTarget(
                name="AngelList/Wellfound",
                category="startup",
                priority=3,
                urls=["https://wellfound.com/startups"],
                selectors={
                    'posts': ['.startup-item', '.company-card'],
                    'title': ['.startup-name', 'h3'],
                    'description': ['.startup-pitch'],
                    'stage': ['.startup-stage'],
                    'location': ['.startup-location'],
                    'funding': ['.funding-info']
                },
                wait_conditions=['networkidle', '.startup-item'],
                scroll_strategy="smooth",
                anti_detection={'wait_for_js': 5},
                success_rate=0.4
            ),
            
            # 10. Trends.vc - 低优先级 
            'trends_vc': ScrapingTarget(
                name="Trends.vc",
                category="newsletter",
                priority=4,
                urls=["https://trends.vc/"],
                selectors={
                    'posts': ['.trend-item', 'article'],
                    'title': ['.trend-title', 'h2'],
                    'category': ['.trend-category'],
                    'description': ['.trend-description']
                },
                wait_conditions=['networkidle', '.trend-item'],
                scroll_strategy="smooth",
                success_rate=0.3
            )
        }
    
    async def setup_ultimate_browser(self) -> None:
        """设置终极浏览器环境"""
        print("🚀 初始化全面多网站抓取环境...")
        
        self.playwright = await async_playwright().start()
        
        # 随机选择用户代理和视窗
        user_agent = random.choice(self.user_agents)
        viewport = random.choice(self.viewports)
        
        print(f"🎭 使用用户代理: {user_agent[:50]}...")
        print(f"📱 视窗大小: {viewport['width']}x{viewport['height']}")
        
        # 高级浏览器配置
        self.browser = await self.playwright.chromium.launch(
            headless=False,  # 可视化模式便于调试
            slow_mo=500,     # 适中的延迟
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
        await self.context.add_init_script(self._get_anti_detection_script())
        
        print("✅ 全面多网站抓取环境设置完成")
    
    def _get_anti_detection_script(self) -> str:
        """获取反检测脚本"""
        return """
            console.log('🛡️ 反检测系统已激活');
            
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
            
            // 4. 移除Playwright特征
            delete window.playwright;
            delete window.__playwright;
            delete window._playwright;
            
            // 5. 覆盖console.debug
            const originalDebug = console.debug;
            console.debug = function(...args) {
                if (args[0] && args[0].includes && args[0].includes('playwright')) {
                    return;
                }
                return originalDebug.apply(console, args);
            };
            
            console.log('✅ 反检测脚本配置完成');
        """
    
    async def scrape_single_target(self, target_id: str, target: ScrapingTarget) -> List[Dict[str, Any]]:
        """抓取单个目标网站"""
        print(f"\n🎯 抓取目标: {target.name} (优先级: {target.priority})")
        print(f"🌐 URLs: {target.urls}")
        
        all_items = []
        
        for url in target.urls:
            items = await self._scrape_single_url(url, target)
            all_items.extend(items)
            
            # 如果获得足够数据，可以提前结束
            if len(all_items) >= 15:
                break
        
        # 更新成功率
        if all_items:
            target.success_rate = min(target.success_rate + 0.1, 1.0)
        else:
            target.success_rate = max(target.success_rate - 0.1, 0.0)
        
        print(f"✅ {target.name} 完成: {len(all_items)} 条数据 (成功率: {target.success_rate:.1%})")
        return all_items
    
    async def _scrape_single_url(self, url: str, target: ScrapingTarget) -> List[Dict[str, Any]]:
        """抓取单个URL"""
        page = await self.context.new_page()
        items = []
        
        try:
            print(f"  🌐 访问: {url}")
            
            # 访问页面
            await page.goto(url, wait_until='domcontentloaded', timeout=30000)
            
            # 智能等待和加载
            await self._smart_wait_and_load(page, target)
            
            # 处理弹窗（如果配置了）
            if target.anti_detection and target.anti_detection.get('close_popups'):
                await self._handle_popups(page)
            
            # 智能滚动（如果配置了）
            if target.anti_detection and target.anti_detection.get('random_scroll'):
                await self._simulate_human_scroll(page)
            
            # 执行滚动策略
            await self._execute_scroll_strategy(page, target.scroll_strategy)
            
            # 智能数据提取
            items = await self._smart_extract_data(page, target)
            
        except Exception as e:
            print(f"❌ 抓取 {url} 失败: {e}")
            # 保存调试截图
            await page.screenshot(path=f'{target.name.lower().replace(" ", "_")}_error_{self.session_id}.png')
            
        finally:
            await page.close()
        
        return items
    
    async def _smart_wait_and_load(self, page: Page, target: ScrapingTarget) -> None:
        """智能等待和加载策略"""
        # 1. 基础等待
        try:
            await page.wait_for_load_state('networkidle', timeout=15000)
        except:
            print("  ⚠️ 网络空闲等待超时，继续...")
        
        # 2. 元素等待
        for condition in target.wait_conditions:
            if condition != 'networkidle':
                try:
                    await page.wait_for_selector(condition, timeout=8000)
                    print(f"  ✅ 找到元素: {condition}")
                    break
                except:
                    continue
        
        # 3. JavaScript执行等待
        if target.anti_detection and target.anti_detection.get('wait_for_js'):
            await asyncio.sleep(target.anti_detection['wait_for_js'])
    
    async def _handle_popups(self, page: Page) -> None:
        """处理弹窗"""
        popup_selectors = [
            '[aria-label="Close"]', '[aria-label="close"]', 
            'button:has-text("Close")', 'button:has-text("×")',
            '.close-button', '.modal-close',
            'button:has-text("Accept")', 'button:has-text("Got it")'
        ]
        
        for selector in popup_selectors:
            try:
                element = await page.query_selector(selector)
                if element:
                    await element.click()
                    await asyncio.sleep(0.5)
            except:
                continue
    
    async def _simulate_human_scroll(self, page: Page) -> None:
        """模拟人类滚动行为"""
        for _ in range(3):
            x = random.randint(100, 800)
            y = random.randint(100, 600)
            await page.mouse.move(x, y)
            await asyncio.sleep(random.uniform(0.5, 1.5))
    
    async def _execute_scroll_strategy(self, page: Page, strategy: str) -> None:
        """执行滚动策略"""
        if strategy == "infinite":
            for i in range(3):
                await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                await asyncio.sleep(random.uniform(2, 3))
        elif strategy == "smooth":
            viewport_height = await page.evaluate("window.innerHeight")
            total_height = await page.evaluate("document.body.scrollHeight")
            
            for position in range(0, min(total_height, viewport_height * 3), viewport_height // 2):
                await page.evaluate(f"window.scrollTo(0, {position})")
                await asyncio.sleep(random.uniform(1, 2))
    
    async def _smart_extract_data(self, page: Page, target: ScrapingTarget) -> List[Dict[str, Any]]:
        """智能数据提取"""
        items = []
        
        # 寻找主要内容容器
        posts = []
        for selector_list in target.selectors['posts']:
            posts = await page.query_selector_all(selector_list)
            if posts and len(posts) > 2:
                print(f"  ✅ 找到 {len(posts)} 个内容项 (选择器: {selector_list})")
                break
        
        if not posts:
            print("  ⚠️ 未找到内容项")
            return items
        
        # 提取每个项目的数据
        for i, post in enumerate(posts[:15]):  # 限制15个项目
            try:
                item_data = {
                    'id': f"{target.name.lower().replace(' ', '_')}_{i}_{int(time.time())}",
                    'source': target.name.lower().replace(' ', '_'),
                    'platform': target.name,
                    'category': target.category,
                    'priority': target.priority,
                    'scraped_at': datetime.now().isoformat(),
                    'session_id': self.session_id,
                    'success_rate': target.success_rate
                }
                
                # 提取各种字段
                for field, selectors in target.selectors.items():
                    if field != 'posts':
                        value = await self._extract_field(post, selectors)
                        if value:
                            item_data[field] = value.strip()[:500]  # 限制长度
                
                # 计算相关性评分
                title = item_data.get('title', '')
                if title and len(title) > 5:
                    item_data['relevance_score'] = self._calculate_relevance_score(title)
                    items.append(item_data)
                    print(f"    📝 {i+1:2d}. {title[:50]}...")
                
            except Exception as e:
                print(f"  ⚠️ 提取项目 {i} 时出错: {e}")
                continue
        
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
    
    def _calculate_relevance_score(self, title: str) -> float:
        """计算内容相关性评分"""
        opportunity_keywords = [
            'startup', 'entrepreneur', 'business', 'opportunity', 'market',
            'saas', 'AI', 'automation', 'platform', 'solution', 'tool',
            'launch', 'funding', 'growth', 'scale', 'innovation', 'app',
            'software', 'tech', 'product', 'service', 'api', 'mobile'
        ]
        
        title_lower = title.lower()
        score = 0.0
        
        for keyword in opportunity_keywords:
            if keyword.lower() in title_lower:
                score += 1.0
        
        return min(score / len(opportunity_keywords), 1.0)
    
    async def run_comprehensive_scraping(self) -> List[Dict[str, Any]]:
        """运行全面抓取所有网站"""
        print("🚀 启动全面多网站抓取系统")
        print("覆盖所有AI机会发现数据源")
        print("=" * 80)
        
        await self.setup_ultimate_browser()
        
        all_results = []
        
        # 按优先级排序目标网站
        sorted_targets = sorted(
            self.targets.items(), 
            key=lambda x: (x[1].priority, -x[1].success_rate)
        )
        
        print(f"\n📊 抓取计划 ({len(sorted_targets)} 个网站):")
        for target_id, target in sorted_targets:
            print(f"  {target.priority}. {target.name} ({target.category}) - 成功率: {target.success_rate:.1%}")
        
        # 执行抓取
        for i, (target_id, target) in enumerate(sorted_targets):
            try:
                print(f"\n{'='*60}")
                print(f"进度: {i+1}/{len(sorted_targets)}")
                
                items = await self.scrape_single_target(target_id, target)
                all_results.extend(items)
                
                # 随机延迟，避免被检测
                delay = random.uniform(3, 8)
                print(f"⏳ 等待 {delay:.1f} 秒后继续...")
                await asyncio.sleep(delay)
                
            except Exception as e:
                print(f"❌ 抓取 {target.name} 时发生错误: {e}")
                continue
        
        self.results = all_results
        return all_results
    
    def analyze_and_display_results(self) -> None:
        """分析和展示结果"""
        print("\n" + "="*80)
        print("🎉 全面多网站抓取系统执行完成!")
        print("="*80)
        
        if not self.results:
            print("⚠️ 未获取到数据")
            return
        
        # 统计分析
        total_items = len(self.results)
        platforms = {}
        categories = {}
        quality_score = 0
        
        for item in self.results:
            platform = item.get('platform', 'unknown')
            category = item.get('category', 'unknown')
            platforms[platform] = platforms.get(platform, 0) + 1
            categories[category] = categories.get(category, 0) + 1
            
            # 数据质量评分
            score = 0
            if item.get('title'): score += 2
            if item.get('description'): score += 1
            if item.get('score') or item.get('votes'): score += 1
            if item.get('author'): score += 1
            if item.get('relevance_score', 0) > 0.1: score += 1
            quality_score += score
        
        avg_quality = quality_score / total_items if total_items > 0 else 0
        
        print(f"📊 抓取统计:")
        print(f"   总数据量: {total_items} 条")
        print(f"   数据质量评分: {avg_quality:.1f}/6.0 ⭐")
        print(f"   会话ID: {self.session_id}")
        
        print(f"\n📈 平台分布:")
        for platform, count in sorted(platforms.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / total_items) * 100
            print(f"   🌐 {platform:20}: {count:3d} 条 ({percentage:5.1f}%)")
        
        print(f"\n📂 类别分布:")
        for category, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / total_items) * 100
            print(f"   📁 {category:15}: {count:3d} 条 ({percentage:5.1f}%)")
        
        print(f"\n📝 高质量数据样本:")
        # 按相关性评分排序显示
        sorted_items = sorted(self.results, 
                            key=lambda x: (x.get('relevance_score', 0), len(str(x.get('title', '')))), 
                            reverse=True)
        
        for i, item in enumerate(sorted_items[:15]):
            platform = item.get('platform', '').upper()[:12]
            title = item.get('title', 'No title')[:50]
            relevance = item.get('relevance_score', 0)
            category = item.get('category', '')[:10]
            
            quality_indicators = []
            if item.get('description'): quality_indicators.append('📝')
            if item.get('author'): quality_indicators.append('👤')
            if item.get('score') or item.get('votes'): quality_indicators.append('⭐')
            if relevance > 0.2: quality_indicators.append(f'🎯{relevance:.1f}')
            
            indicators = ' '.join(quality_indicators)
            print(f"  {i+1:2d}. [{platform:12}] [{category:10}] {title}... {indicators}")
        
        # 保存结果
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"comprehensive_scraping_results_{timestamp}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump({
                'session_id': self.session_id,
                'timestamp': timestamp,
                'total_items': total_items,
                'quality_score': avg_quality,
                'platforms': platforms,
                'categories': categories,
                'targets_performance': {
                    target_id: {
                        'name': target.name,
                        'success_rate': target.success_rate,
                        'priority': target.priority,
                        'category': target.category
                    } for target_id, target in self.targets.items()
                },
                'data': self.results
            }, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 详细结果已保存到: {filename}")
        print(f"⏰ 完成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # 显示成功率统计
        print(f"\n📈 各网站成功率统计:")
        for target_id, target in sorted(self.targets.items(), key=lambda x: x[1].success_rate, reverse=True):
            status = "🟢" if target.success_rate > 0.7 else "🟡" if target.success_rate > 0.3 else "🔴"
            print(f"   {status} {target.name:20}: {target.success_rate:6.1%}")
    
    async def cleanup(self) -> None:
        """清理资源"""
        print("\n🧹 清理全面抓取系统资源...")
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()
        print("✅ 清理完成")


async def main():
    """主函数"""
    print("🌟 全面多网站AI机会发现抓取系统")
    print("🕷️ 覆盖所有重要数据源")
    print(f"⏰ 启动时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    scraper = ComprehensiveMultiSiteScraper()
    
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