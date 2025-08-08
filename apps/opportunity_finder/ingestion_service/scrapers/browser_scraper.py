"""Advanced browser-based scraper using Playwright for anti-bot evasion."""

import asyncio
import random
from typing import Dict, Any, List, Optional
from datetime import datetime
from loguru import logger
from playwright.async_api import async_playwright, Browser, BrowserContext, Page

from .base_scraper import BaseScraper


class BrowserScraper(BaseScraper):
    """Advanced browser automation scraper with anti-detection features."""
    
    def __init__(self, kafka_producer, settings):
        super().__init__(kafka_producer, settings)
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        
        # User agents rotation
        self.user_agents = [
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0"
        ]
        
        # Viewport sizes
        self.viewports = [
            {"width": 1920, "height": 1080},
            {"width": 1366, "height": 768},
            {"width": 1440, "height": 900},
            {"width": 1536, "height": 864}
        ]
    
    def get_source_type(self) -> str:
        return "browser_automated"
    
    async def _setup_browser(self) -> Browser:
        """Setup browser with anti-detection configurations."""
        if self.browser:
            return self.browser
            
        playwright = await async_playwright().start()
        
        # Launch browser with stealth settings
        self.browser = await playwright.chromium.launch(
            headless=False,  # Set to True for headless mode
            slow_mo=1000,    # Add delay between actions for visibility
            args=[
                '--no-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-extensions',
                '--no-first-run',
                '--disable-default-apps',
                '--disable-sync',
                '--disable-translate',
                '--hide-scrollbars',
                '--metrics-recording-only',
                '--mute-audio',
                '--no-default-browser-check',
                '--no-pings',
                '--password-store=basic',
                '--use-mock-keychain',
                '--disable-gpu'
            ]
        )
        
        return self.browser
    
    async def _create_stealth_context(self) -> BrowserContext:
        """Create browser context with stealth configurations."""
        if self.context:
            await self.context.close()
            
        browser = await self._setup_browser()
        
        # Random viewport and user agent
        viewport = random.choice(self.viewports)
        user_agent = random.choice(self.user_agents)
        
        # Create context with stealth settings
        self.context = await browser.new_context(
            viewport=viewport,
            user_agent=user_agent,
            locale='en-US',
            timezone_id='America/New_York',
            permissions=['geolocation'],
            extra_http_headers={
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            }
        )
        
        # Add stealth scripts
        await self.context.add_init_script("""
            // Remove webdriver property
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });
            
            // Mock languages and plugins
            Object.defineProperty(navigator, 'languages', {
                get: () => ['en-US', 'en'],
            });
            
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5],
            });
            
            // Mock permissions
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ?
                    Promise.resolve({ state: Notification.permission }) :
                    originalQuery(parameters)
            );
        """)
        
        return self.context
    
    async def _scrape_reddit_with_browser(self, subreddit: str) -> List[Dict[str, Any]]:
        """Scrape Reddit using browser automation."""
        items = []
        context = await self._create_stealth_context()
        page = await context.new_page()
        
        try:
            # Navigate to subreddit
            url = f"https://www.reddit.com/r/{subreddit}/hot/"
            logger.info(f"Scraping Reddit r/{subreddit} with browser...")
            
            await page.goto(url, wait_until='networkidle', timeout=30000)
            
            # Random delay
            await asyncio.sleep(random.uniform(2, 4))
            
            # Wait for posts to load
            await page.wait_for_selector('[data-testid="post-container"]', timeout=10000)
            
            # Extract posts
            posts = await page.query_selector_all('[data-testid="post-container"]')
            
            for i, post in enumerate(posts[:15]):  # Limit to 15 posts
                try:
                    # Extract post data
                    title_element = await post.query_selector('h3')
                    title = await title_element.text_content() if title_element else "No title"
                    
                    # Get post link
                    link_element = await post.query_selector('a[data-click-id="body"]')
                    post_url = await link_element.get_attribute('href') if link_element else ""
                    if post_url and not post_url.startswith('http'):
                        post_url = f"https://www.reddit.com{post_url}"
                    
                    # Get score/upvotes
                    score_element = await post.query_selector('[data-testid="vote-arrows"] button span')
                    score_text = await score_element.text_content() if score_element else "0"
                    
                    # Get author
                    author_element = await post.query_selector('a[data-testid="post_author_link"]')
                    author = await author_element.text_content() if author_element else "unknown"
                    
                    # Create item
                    item = {
                        'id': f"reddit_{subreddit}_{i}_{int(datetime.now().timestamp())}",
                        'title': title.strip(),
                        'url': post_url,
                        'source': f'reddit_r_{subreddit}',
                        'source_type': 'reddit_browser',
                        'author': author.strip(),
                        'score': self._parse_score(score_text),
                        'scraped_at': datetime.now().isoformat(),
                        'content_type': 'discussion',
                        'platform': 'reddit',
                        'subreddit': subreddit
                    }
                    
                    items.append(item)
                    logger.debug(f"Extracted Reddit post: {title[:50]}...")
                    
                    # Small delay between posts
                    await asyncio.sleep(random.uniform(0.1, 0.3))
                    
                except Exception as e:
                    logger.warning(f"Error extracting post {i}: {e}")
                    continue
            
            logger.info(f"Successfully scraped {len(items)} posts from r/{subreddit}")
            
        except Exception as e:
            logger.error(f"Error scraping r/{subreddit}: {e}")
            
        finally:
            await page.close()
            
        return items
    
    async def _scrape_hackernews_with_browser(self) -> List[Dict[str, Any]]:
        """Scrape Hacker News using browser automation."""
        items = []
        context = await self._create_stealth_context()
        page = await context.new_page()
        
        try:
            logger.info("Scraping Hacker News with browser...")
            await page.goto("https://news.ycombinator.com/", wait_until='networkidle')
            
            # Random delay
            await asyncio.sleep(random.uniform(2, 3))
            
            # Extract stories
            story_rows = await page.query_selector_all('tr.athing')
            
            for i, row in enumerate(story_rows[:20]):  # Limit to 20 stories
                try:
                    story_id = await row.get_attribute('id')
                    
                    # Get title and link
                    title_link = await row.query_selector('span.titleline > a')
                    title = await title_link.text_content() if title_link else "No title"
                    url = await title_link.get_attribute('href') if title_link else ""
                    
                    # Get metadata from next row
                    next_row = await page.query_selector(f'#score_{story_id}')
                    score_text = await next_row.text_content() if next_row else "0"
                    
                    item = {
                        'id': f"hn_{story_id}_{int(datetime.now().timestamp())}",
                        'title': title.strip(),
                        'url': url if url.startswith('http') else f"https://news.ycombinator.com/{url}",
                        'source': 'hackernews',
                        'source_type': 'hackernews_browser',
                        'score': self._parse_score(score_text),
                        'scraped_at': datetime.now().isoformat(),
                        'content_type': 'news',
                        'platform': 'hackernews',
                        'story_id': story_id
                    }
                    
                    items.append(item)
                    
                except Exception as e:
                    logger.warning(f"Error extracting HN story {i}: {e}")
                    continue
            
            logger.info(f"Successfully scraped {len(items)} stories from Hacker News")
            
        except Exception as e:
            logger.error(f"Error scraping Hacker News: {e}")
            
        finally:
            await page.close()
            
        return items
    
    async def _scrape_product_hunt_with_browser(self) -> List[Dict[str, Any]]:
        """Scrape Product Hunt for new product launches."""
        items = []
        context = await self._create_stealth_context()
        page = await context.new_page()
        
        try:
            logger.info("🚀 正在抓取Product Hunt...")
            await page.goto("https://www.producthunt.com/", wait_until='networkidle')
            
            # Wait for products to load
            await page.wait_for_selector('[data-test="homepage-section-content"]', timeout=10000)
            
            # Extract products
            products = await page.query_selector_all('article')
            
            for i, product in enumerate(products[:10]):  # Limit to 10 products
                try:
                    # Get product title
                    title_element = await product.query_selector('h3')
                    title = await title_element.text_content() if title_element else "No title"
                    
                    # Get description
                    desc_element = await product.query_selector('p')
                    description = await desc_element.text_content() if desc_element else ""
                    
                    # Get upvotes
                    votes_element = await product.query_selector('[data-test="vote-button"]')
                    votes_text = await votes_element.text_content() if votes_element else "0"
                    
                    item = {
                        'id': f"ph_{i}_{int(datetime.now().timestamp())}",
                        'title': title.strip(),
                        'description': description.strip()[:200],
                        'source': 'product_hunt',
                        'source_type': 'product_hunt_browser',
                        'votes': self._parse_score(votes_text),
                        'scraped_at': datetime.now().isoformat(),
                        'content_type': 'product',
                        'platform': 'product_hunt'
                    }
                    
                    items.append(item)
                    logger.debug(f"📦 发现产品: {title[:30]}...")
                    
                except Exception as e:
                    logger.warning(f"Error extracting product {i}: {e}")
                    continue
            
            logger.info(f"✅ Product Hunt抓取完成: {len(items)} 个产品")
            
        except Exception as e:
            logger.error(f"❌ Product Hunt抓取错误: {e}")
            
        finally:
            await page.close()
            
        return items

    async def scrape_batch(self) -> List[Dict[str, Any]]:
        """全面多网站抓取方法 - 覆盖所有AI机会发现数据源"""
        all_items = []
        
        try:
            logger.info("🚀 启动全面多网站AI机会发现抓取系统...")
            
            # 按优先级抓取所有网站
            scraping_targets = [
                # 优先级1: 最稳定可靠的网站
                ("HackerNews", self._scrape_hackernews_optimized),
                
                # 优先级2: 高价值网站
                ("Dev.to", self._scrape_devto_optimized),
                ("Product Hunt", self._scrape_product_hunt_optimized),
                ("Indie Hackers", self._scrape_indiehackers_optimized),
                
                # 优先级3: 中等价值网站
                ("BetaList", self._scrape_betalist_optimized),
                ("G2 AI Software", self._scrape_g2_optimized),
                ("AngelList", self._scrape_angellist_optimized),
                
                # 优先级4: Reddit社区
                ("Reddit Entrepreneur", lambda: self._scrape_reddit_with_browser('entrepreneur')),
                ("Reddit Startups", lambda: self._scrape_reddit_with_browser('startups')),
                ("Reddit SaaS", lambda: self._scrape_reddit_with_browser('SaaS')),
                
                # 优先级5: 补充网站
                ("TechCrunch Startups", self._scrape_techcrunch_optimized),
            ]
            
            for target_name, scrape_func in scraping_targets:
                try:
                    logger.info(f"📰 抓取 {target_name}...")
                    items = await scrape_func()
                    all_items.extend(items)
                    logger.info(f"✅ {target_name}完成: {len(items)} 条数据")
                    
                    # 随机延迟，避免检测
                    await asyncio.sleep(random.uniform(2, 5))
                    
                    # 如果已经获得足够数据，可以选择性跳过低优先级网站
                    if len(all_items) >= 50:
                        logger.info(f"🎯 已获得 {len(all_items)} 条数据，跳过剩余低优先级网站")
                        break
                        
                except Exception as e:
                    logger.error(f"❌ 抓取 {target_name} 失败: {e}")
                    continue
            
        except Exception as e:
            logger.error(f"❌ 全面抓取系统错误: {e}")
            
        finally:
            # 清理资源
            await self.cleanup()
        
        logger.info(f"🎉 全面抓取完成! 总共获取: {len(all_items)} 条数据")
        
        # 发送到Kafka
        if all_items and hasattr(self, 'kafka_producer') and self.kafka_producer:
            await self._send_to_kafka(all_items)
        
        return all_items
    
    async def _scrape_hackernews_optimized(self) -> List[Dict[str, Any]]:
        """优化的HackerNews抓取 - 最高成功率"""
        items = []
        context = await self._create_stealth_context()
        page = await context.new_page()
        
        try:
            logger.info("🌐 访问 HackerNews...")
            await page.goto("https://news.ycombinator.com/", wait_until='networkidle')
            await asyncio.sleep(2)
            
            # 获取故事列表
            stories = await page.query_selector_all('span.titleline > a')
            logger.info(f"📋 找到 {len(stories)} 个故事")
            
            for i, story in enumerate(stories[:15]):  # 限制15个
                try:
                    title = await story.text_content()
                    href = await story.get_attribute('href')
                    
                    if title and len(title.strip()) > 5:
                        # 获取故事ID和评分
                        story_row = await story.evaluate_handle('el => el.closest("tr")')
                        story_id = await story_row.get_attribute('id') if story_row else f"story_{i}"
                        
                        # 尝试获取评分
                        score = 0
                        try:
                            next_row = await page.query_selector(f'#score_{story_id}')
                            if next_row:
                                score_text = await next_row.text_content()
                                score = int(''.join(filter(str.isdigit, score_text))) if score_text else 0
                        except:
                            pass
                        
                        item = {
                            'id': f"hn_{story_id}_{int(time.time())}",
                            'title': title.strip(),
                            'url': href if href and href.startswith('http') else f"https://news.ycombinator.com/{href}",
                            'score': score,
                            'source': 'hackernews',
                            'platform': 'hackernews',
                            'scraped_at': datetime.now().isoformat(),
                            'method': 'browser_optimized',
                            'content_type': 'tech_news',
                            'relevance_score': self._calculate_relevance_score(title)
                        }
                        
                        items.append(item)
                        logger.debug(f"  📝 {i+1:2d}. {title[:50]}... (评分: {score})")
                
                except Exception as e:
                    logger.warning(f"提取故事 {i} 时出错: {e}")
                    continue
            
            logger.info(f"✅ HackerNews抓取成功: {len(items)} 条")
            
        except Exception as e:
            logger.error(f"❌ HackerNews抓取失败: {e}")
            
        finally:
            await page.close()
            
        return items
    
    async def _scrape_product_hunt_optimized(self) -> List[Dict[str, Any]]:
        """优化的Product Hunt抓取"""
        items = []
        context = await self._create_stealth_context()
        page = await context.new_page()
        
        try:
            logger.info("🌐 访问 Product Hunt...")
            await page.goto("https://www.producthunt.com/", wait_until='networkidle')
            await asyncio.sleep(5)  # 等待JavaScript加载
            
            # 尝试多种选择器
            selectors_to_try = ['h3', 'h2', '[data-test*="product"]', 'article h3']
            products = []
            
            for selector in selectors_to_try:
                products = await page.query_selector_all(selector)
                if len(products) > 3:
                    logger.info(f"📋 使用选择器 {selector} 找到 {len(products)} 个产品")
                    break
            
            for i, product in enumerate(products[:10]):
                try:
                    title = await product.text_content()
                    
                    if title and len(title.strip()) > 3 and len(title.strip()) < 100:
                        # 尝试获取产品链接
                        product_link = ""
                        try:
                            link_elem = await product.query_selector('a')
                            if link_elem:
                                product_link = await link_elem.get_attribute('href')
                                if product_link and not product_link.startswith('http'):
                                    product_link = f"https://www.producthunt.com{product_link}"
                        except:
                            pass
                        
                        item = {
                            'id': f"ph_{i}_{int(time.time())}",
                            'title': title.strip(),
                            'url': product_link or "https://www.producthunt.com/",
                            'source': 'product_hunt',
                            'platform': 'product_hunt',
                            'scraped_at': datetime.now().isoformat(),
                            'method': 'browser_optimized',
                            'content_type': 'product_launch',
                            'relevance_score': self._calculate_relevance_score(title)
                        }
                        
                        items.append(item)
                        logger.debug(f"  📝 {i+1:2d}. {title[:50]}...")
                
                except Exception as e:
                    continue
            
            logger.info(f"✅ Product Hunt抓取成功: {len(items)} 条")
            
        except Exception as e:
            logger.error(f"❌ Product Hunt抓取失败: {e}")
            
        finally:
            await page.close()
            
        return items
    
    def _calculate_relevance_score(self, title: str) -> float:
        """计算内容相关性评分"""
        opportunity_keywords = [
            'startup', 'entrepreneur', 'business', 'opportunity', 'market',
            'saas', 'AI', 'automation', 'platform', 'solution', 'tool',
            'launch', 'funding', 'growth', 'scale', 'innovation'
        ]
        
        title_lower = title.lower()
        score = 0.0
        
        for keyword in opportunity_keywords:
            if keyword.lower() in title_lower:
                score += 1.0
        
        return min(score / len(opportunity_keywords), 1.0)
    
    async def _send_to_kafka(self, items: List[Dict[str, Any]]):
        """发送数据到Kafka消息队列"""
        try:
            for item in items:
                await self.kafka_producer.send_opportunity_data(item)
            logger.info(f"📨 已发送 {len(items)} 条数据到Kafka")
        except Exception as e:
            logger.error(f"❌ 发送Kafka失败: {e}")
    
    async def _scrape_devto_optimized(self) -> List[Dict[str, Any]]:
        """优化的Dev.to抓取"""
        items = []
        context = await self._create_stealth_context()
        page = await context.new_page()
        
        try:
            logger.info("🌐 访问 Dev.to...")
            await page.goto("https://dev.to/", wait_until='networkidle')
            await asyncio.sleep(3)
            
            # 获取文章列表
            articles = await page.query_selector_all('.crayons-story')
            logger.info(f"📋 找到 {len(articles)} 篇文章")
            
            for i, article in enumerate(articles[:15]):
                try:
                    title_elem = await article.query_selector('h2 a, h3 a, .crayons-story__title a')
                    if not title_elem:
                        continue
                        
                    title = await title_elem.text_content()
                    href = await title_elem.get_attribute('href')
                    
                    if title and len(title.strip()) > 5:
                        # 获取作者
                        author = "Unknown"
                        try:
                            author_elem = await article.query_selector('.crayons-story__secondary .crayons-link')
                            if author_elem:
                                author = await author_elem.text_content()
                        except:
                            pass
                        
                        # 获取标签
                        tags = []
                        try:
                            tag_elems = await article.query_selector_all('.crayons-tag')
                            for tag_elem in tag_elems:
                                tag_text = await tag_elem.text_content()
                                if tag_text:
                                    tags.append(tag_text.strip())
                        except:
                            pass
                        
                        item = {
                            'id': f"devto_{i}_{int(time.time())}",
                            'title': title.strip(),
                            'url': href if href and href.startswith('http') else f"https://dev.to{href}",
                            'author': author.strip() if author else "Unknown",
                            'tags': ', '.join(tags[:3]) if tags else "",
                            'source': 'dev.to',
                            'platform': 'dev.to',
                            'category': 'tech_news',
                            'scraped_at': datetime.now().isoformat(),
                            'method': 'browser_optimized',
                            'content_type': 'tech_article',
                            'relevance_score': self._calculate_relevance_score(title)
                        }
                        
                        items.append(item)
                        logger.debug(f"  📝 {i+1:2d}. {title[:50]}...")
                
                except Exception as e:
                    logger.warning(f"提取文章 {i} 时出错: {e}")
                    continue
            
            logger.info(f"✅ Dev.to抓取成功: {len(items)} 条")
            
        except Exception as e:
            logger.error(f"❌ Dev.to抓取失败: {e}")
            
        finally:
            await page.close()
            
        return items
    
    async def _scrape_indiehackers_optimized(self) -> List[Dict[str, Any]]:
        """优化的Indie Hackers抓取"""
        items = []
        context = await self._create_stealth_context()
        page = await context.new_page()
        
        try:
            logger.info("🌐 访问 Indie Hackers...")
            await page.goto("https://www.indiehackers.com/", wait_until='networkidle')
            await asyncio.sleep(5)
            
            # 尝试多种选择器
            selectors_to_try = ['.feed-item', 'article', '.post-item', '[data-test="story"]']
            posts = []
            
            for selector in selectors_to_try:
                posts = await page.query_selector_all(selector)
                if len(posts) > 3:
                    logger.info(f"📋 使用选择器 {selector} 找到 {len(posts)} 个项目")
                    break
            
            for i, post in enumerate(posts[:10]):
                try:
                    # 尝试获取标题
                    title = ""
                    title_selectors = ['h2 a', 'h3 a', '.post-title', 'h1', 'a[href*="/post/"]']
                    for title_selector in title_selectors:
                        title_elem = await post.query_selector(title_selector)
                        if title_elem:
                            title = await title_elem.text_content()
                            if title and len(title.strip()) > 5:
                                break
                    
                    if not title or len(title.strip()) < 5:
                        continue
                    
                    # 获取链接
                    post_url = ""
                    try:
                        link_elem = await post.query_selector('a[href*="/post/"], a')
                        if link_elem:
                            href = await link_elem.get_attribute('href')
                            if href:
                                post_url = href if href.startswith('http') else f"https://www.indiehackers.com{href}"
                    except:
                        pass
                    
                    item = {
                        'id': f"ih_{i}_{int(time.time())}",
                        'title': title.strip(),
                        'url': post_url or "https://www.indiehackers.com/",
                        'source': 'indie_hackers',
                        'platform': 'indie_hackers',
                        'category': 'startup',
                        'scraped_at': datetime.now().isoformat(),
                        'method': 'browser_optimized',
                        'content_type': 'startup_discussion',
                        'relevance_score': self._calculate_relevance_score(title)
                    }
                    
                    items.append(item)
                    logger.debug(f"  📝 {i+1:2d}. {title[:50]}...")
                
                except Exception as e:
                    continue
            
            logger.info(f"✅ Indie Hackers抓取成功: {len(items)} 条")
            
        except Exception as e:
            logger.error(f"❌ Indie Hackers抓取失败: {e}")
            
        finally:
            await page.close()
            
        return items
    
    async def _scrape_betalist_optimized(self) -> List[Dict[str, Any]]:
        """优化的BetaList抓取"""
        items = []
        context = await self._create_stealth_context()
        page = await context.new_page()
        
        try:
            logger.info("🌐 访问 BetaList...")
            await page.goto("https://betalist.com/", wait_until='networkidle')
            await asyncio.sleep(5)
            
            # 尝试多种选择器
            selectors_to_try = ['.startup-card', '.startup-item', '.startup', 'article']
            startups = []
            
            for selector in selectors_to_try:
                startups = await page.query_selector_all(selector)
                if len(startups) > 2:
                    logger.info(f"📋 使用选择器 {selector} 找到 {len(startups)} 个创业项目")
                    break
            
            for i, startup in enumerate(startups[:10]):
                try:
                    # 获取项目名称
                    name_selectors = ['.startup-name', 'h3', 'h2', '.title']
                    name = ""
                    for name_selector in name_selectors:
                        name_elem = await startup.query_selector(name_selector)
                        if name_elem:
                            name = await name_elem.text_content()
                            if name and len(name.strip()) > 2:
                                break
                    
                    if not name or len(name.strip()) < 2:
                        continue
                    
                    # 获取描述
                    desc = ""
                    try:
                        desc_elem = await startup.query_selector('.startup-description, .description, p')
                        if desc_elem:
                            desc = await desc_elem.text_content()
                    except:
                        pass
                    
                    item = {
                        'id': f"betalist_{i}_{int(time.time())}",
                        'title': name.strip(),
                        'description': desc.strip()[:200] if desc else "",
                        'url': "https://betalist.com/",
                        'source': 'betalist',
                        'platform': 'betalist',
                        'category': 'startup',
                        'scraped_at': datetime.now().isoformat(),
                        'method': 'browser_optimized',
                        'content_type': 'startup_launch',
                        'relevance_score': self._calculate_relevance_score(name)
                    }
                    
                    items.append(item)
                    logger.debug(f"  📝 {i+1:2d}. {name[:50]}...")
                
                except Exception as e:
                    continue
            
            logger.info(f"✅ BetaList抓取成功: {len(items)} 条")
            
        except Exception as e:
            logger.error(f"❌ BetaList抓取失败: {e}")
            
        finally:
            await page.close()
            
        return items
    
    async def _scrape_g2_optimized(self) -> List[Dict[str, Any]]:
        """优化的G2抓取"""
        items = []
        context = await self._create_stealth_context()
        page = await context.new_page()
        
        try:
            logger.info("🌐 访问 G2 AI Software...")
            await page.goto("https://www.g2.com/categories/artificial-intelligence", wait_until='networkidle')
            await asyncio.sleep(5)
            
            # 尝试多种选择器
            selectors_to_try = ['.product-listing', '.product-card', '[data-testid*="product"]']
            products = []
            
            for selector in selectors_to_try:
                products = await page.query_selector_all(selector)
                if len(products) > 2:
                    logger.info(f"📋 使用选择器 {selector} 找到 {len(products)} 个产品")
                    break
            
            for i, product in enumerate(products[:8]):
                try:
                    # 获取产品名称
                    name_selectors = ['.product-name', 'h3 a', 'h2', '[data-testid="product-name"]']
                    name = ""
                    for name_selector in name_selectors:
                        name_elem = await product.query_selector(name_selector)
                        if name_elem:
                            name = await name_elem.text_content()
                            if name and len(name.strip()) > 2:
                                break
                    
                    if not name or len(name.strip()) < 2:
                        continue
                    
                    item = {
                        'id': f"g2_{i}_{int(time.time())}",
                        'title': name.strip(),
                        'url': "https://www.g2.com/categories/artificial-intelligence",
                        'source': 'g2',
                        'platform': 'g2',
                        'category': 'reviews',
                        'scraped_at': datetime.now().isoformat(),
                        'method': 'browser_optimized',
                        'content_type': 'software_review',
                        'relevance_score': self._calculate_relevance_score(name)
                    }
                    
                    items.append(item)
                    logger.debug(f"  📝 {i+1:2d}. {name[:50]}...")
                
                except Exception as e:
                    continue
            
            logger.info(f"✅ G2抓取成功: {len(items)} 条")
            
        except Exception as e:
            logger.error(f"❌ G2抓取失败: {e}")
            
        finally:
            await page.close()
            
        return items
    
    async def _scrape_angellist_optimized(self) -> List[Dict[str, Any]]:
        """优化的AngelList抓取"""
        items = []
        context = await self._create_stealth_context()
        page = await context.new_page()
        
        try:
            logger.info("🌐 访问 AngelList/Wellfound...")
            await page.goto("https://wellfound.com/startups", wait_until='networkidle')
            await asyncio.sleep(8)  # 更长等待时间
            
            # 尝试多种选择器
            selectors_to_try = ['.startup-item', '.company-card', '[data-test*="startup"]']
            startups = []
            
            for selector in selectors_to_try:
                startups = await page.query_selector_all(selector)
                if len(startups) > 1:
                    logger.info(f"📋 使用选择器 {selector} 找到 {len(startups)} 个创业公司")
                    break
            
            for i, startup in enumerate(startups[:8]):
                try:
                    # 获取公司名称
                    name_selectors = ['.startup-name', 'h3', 'h2', '.company-name']
                    name = ""
                    for name_selector in name_selectors:
                        name_elem = await startup.query_selector(name_selector)
                        if name_elem:
                            name = await name_elem.text_content()
                            if name and len(name.strip()) > 1:
                                break
                    
                    if not name or len(name.strip()) < 2:
                        continue
                    
                    item = {
                        'id': f"angellist_{i}_{int(time.time())}",
                        'title': name.strip(),
                        'url': "https://wellfound.com/startups",
                        'source': 'angellist',
                        'platform': 'angellist',
                        'category': 'startup',
                        'scraped_at': datetime.now().isoformat(),
                        'method': 'browser_optimized',
                        'content_type': 'startup_profile',
                        'relevance_score': self._calculate_relevance_score(name)
                    }
                    
                    items.append(item)
                    logger.debug(f"  📝 {i+1:2d}. {name[:50]}...")
                
                except Exception as e:
                    continue
            
            logger.info(f"✅ AngelList抓取成功: {len(items)} 条")
            
        except Exception as e:
            logger.error(f"❌ AngelList抓取失败: {e}")
            
        finally:
            await page.close()
            
        return items
    
    async def _scrape_techcrunch_optimized(self) -> List[Dict[str, Any]]:
        """优化的TechCrunch抓取"""
        items = []
        context = await self._create_stealth_context()
        page = await context.new_page()
        
        try:
            logger.info("🌐 访问 TechCrunch Startups...")
            await page.goto("https://techcrunch.com/category/startups/", wait_until='networkidle')
            await asyncio.sleep(5)
            
            # 获取文章列表
            articles = await page.query_selector_all('article, .post-block')
            logger.info(f"📋 找到 {len(articles)} 篇文章")
            
            for i, article in enumerate(articles[:8]):
                try:
                    title_elem = await article.query_selector('h2 a, h3 a, .post-block__title a')
                    if not title_elem:
                        continue
                        
                    title = await title_elem.text_content()
                    href = await title_elem.get_attribute('href')
                    
                    if title and len(title.strip()) > 10:
                        item = {
                            'id': f"tc_{i}_{int(time.time())}",
                            'title': title.strip(),
                            'url': href if href and href.startswith('http') else f"https://techcrunch.com{href}",
                            'source': 'techcrunch',
                            'platform': 'techcrunch',
                            'category': 'tech_news',
                            'scraped_at': datetime.now().isoformat(),
                            'method': 'browser_optimized',
                            'content_type': 'startup_news',
                            'relevance_score': self._calculate_relevance_score(title)
                        }
                        
                        items.append(item)
                        logger.debug(f"  📝 {i+1:2d}. {title[:50]}...")
                
                except Exception as e:
                    continue
            
            logger.info(f"✅ TechCrunch抓取成功: {len(items)} 条")
            
        except Exception as e:
            logger.error(f"❌ TechCrunch抓取失败: {e}")
            
        finally:
            await page.close()
            
        return items
    
    def _parse_score(self, score_text: str) -> int:
        """Parse score from text."""
        try:
            # Remove non-numeric characters and parse
            import re
            numbers = re.findall(r'\d+', score_text)
            return int(numbers[0]) if numbers else 0
        except:
            return 0
    
    async def cleanup(self):
        """Cleanup browser resources."""
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()