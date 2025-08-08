#!/usr/bin/env python3
"""
增强版浏览器自动化抓取解决方案
这是最优的现代网站抓取方法
"""

import asyncio
import random
from datetime import datetime
from playwright.async_api import async_playwright
import json


class EnhancedBrowserScraper:
    """增强版浏览器抓取器 - 专注于现代网站抓取"""
    
    def __init__(self):
        self.browser = None
        self.context = None
        self.results = []
    
    async def setup_browser(self):
        """设置高级浏览器环境"""
        print("🔧 初始化增强版浏览器环境...")
        
        self.playwright = await async_playwright().start()
        
        # 高级浏览器配置
        self.browser = await self.playwright.chromium.launch(
            headless=False,          # 可视化运行
            slow_mo=1500,           # 动作间延迟1.5秒
            args=[
                '--start-maximized',
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
                '--no-sandbox',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor'
            ]
        )
        
        # 创建隐身上下文，每次都是"新用户"
        self.context = await self.browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            locale='en-US',
            timezone_id='America/New_York'
        )
        
        # 注入反检测脚本
        await self.context.add_init_script("""
            // 隐藏webdriver特征
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });
            
            // 模拟真实浏览器特征
            Object.defineProperty(navigator, 'languages', {
                get: () => ['en-US', 'en'],
            });
            
            // 模拟插件
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5],
            });
            
            // 覆盖Permission API
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ?
                    Promise.resolve({ state: Notification.permission }) :
                    originalQuery(parameters)
            );
            
            console.log('🕵️ 反检测脚本已加载');
        """)
        
        print("✅ 浏览器环境设置完成")
    
    async def scrape_reddit_enhanced(self, subreddit='entrepreneur'):
        """增强版Reddit抓取"""
        print(f"\n📱 开始增强抓取 Reddit r/{subreddit}...")
        
        page = await self.context.new_page()
        items = []
        
        try:
            # 访问Reddit
            url = f"https://www.reddit.com/r/{subreddit}/"
            print(f"🌐 访问: {url}")
            await page.goto(url, wait_until='networkidle', timeout=30000)
            
            # 等待页面完全加载
            await asyncio.sleep(3)
            
            # 尝试关闭弹窗
            try:
                close_buttons = ['[aria-label="Close"]', 'button:has-text("Close")', '[data-testid="close-button"]']
                for selector in close_buttons:
                    if await page.query_selector(selector):
                        await page.click(selector)
                        await asyncio.sleep(1)
                        break
            except:
                pass
            
            # 滚动加载更多内容
            print("📜 滚动页面加载更多内容...")
            for i in range(3):
                await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                await asyncio.sleep(2)
            
            # 寻找帖子 - 尝试多种选择器
            post_selectors = [
                '[data-testid="post-container"]',
                'article',
                'div[data-click-id="body"]',
                'h3',
                '.Post'
            ]
            
            posts = []
            for selector in post_selectors:
                posts = await page.query_selector_all(selector)
                if posts:
                    print(f"✅ 找到 {len(posts)} 个帖子 (使用选择器: {selector})")
                    break
            
            if not posts:
                print("⚠️  未找到帖子，可能需要登录或网站结构已变化")
                # 截图用于调试
                await page.screenshot(path=f'reddit_debug_{subreddit}.png')
                print("📸 已保存调试截图")
            
            # 提取帖子信息
            for i, post in enumerate(posts[:10]):
                try:
                    # 提取标题
                    title_selectors = ['h3', '[slot="title"]', 'a[data-click-id="body"]']
                    title = ""
                    for sel in title_selectors:
                        title_elem = await post.query_selector(sel)
                        if title_elem:
                            title = await title_elem.text_content()
                            if title and len(title.strip()) > 5:
                                break
                    
                    if title and len(title.strip()) > 5:
                        item = {
                            'id': f"reddit_{subreddit}_{i}_{int(datetime.now().timestamp())}",
                            'title': title.strip()[:200],
                            'source': f'reddit_r_{subreddit}',
                            'platform': 'reddit',
                            'scraped_at': datetime.now().isoformat(),
                            'method': 'enhanced_browser'
                        }
                        items.append(item)
                        print(f"  📝 {i+1:2d}. {title.strip()[:60]}...")
                
                except Exception as e:
                    print(f"⚠️  提取帖子{i}时出错: {e}")
                    continue
            
            print(f"✅ Reddit r/{subreddit} 抓取完成: {len(items)} 条数据")
            
        except Exception as e:
            print(f"❌ Reddit抓取失败: {e}")
            await page.screenshot(path=f'reddit_error_{subreddit}.png')
        
        finally:
            await page.close()
        
        return items
    
    async def scrape_hackernews_enhanced(self):
        """增强版HackerNews抓取"""
        print(f"\n📰 开始增强抓取 Hacker News...")
        
        page = await self.context.new_page()
        items = []
        
        try:
            print("🌐 访问: https://news.ycombinator.com/")
            await page.goto("https://news.ycombinator.com/", wait_until='networkidle')
            await asyncio.sleep(2)
            
            # HackerNews相对简单，直接抓取
            stories = await page.query_selector_all('span.titleline > a')
            print(f"✅ 找到 {len(stories)} 个故事")
            
            for i, story in enumerate(stories[:15]):
                try:
                    title = await story.text_content()
                    href = await story.get_attribute('href')
                    
                    if title:
                        # 获取评分信息
                        score = 0
                        try:
                            score_elem = await page.query_selector(f'#score_{i}')
                            if score_elem:
                                score_text = await score_elem.text_content()
                                score = int(''.join(filter(str.isdigit, score_text))) if score_text else 0
                        except:
                            pass
                        
                        item = {
                            'id': f"hn_{i}_{int(datetime.now().timestamp())}",
                            'title': title.strip(),
                            'url': href if href and href.startswith('http') else f"https://news.ycombinator.com/{href}",
                            'score': score,
                            'source': 'hackernews',
                            'platform': 'hackernews',
                            'scraped_at': datetime.now().isoformat(),
                            'method': 'enhanced_browser'
                        }
                        items.append(item)
                        print(f"  📝 {i+1:2d}. {title.strip()[:60]}... (评分: {score})")
                
                except Exception as e:
                    print(f"⚠️  提取故事{i}时出错: {e}")
                    continue
            
            print(f"✅ HackerNews抓取完成: {len(items)} 条数据")
            
        except Exception as e:
            print(f"❌ HackerNews抓取失败: {e}")
            await page.screenshot(path='hn_error.png')
        
        finally:
            await page.close()
        
        return items
    
    async def scrape_producthunt_enhanced(self):
        """增强版Product Hunt抓取"""
        print(f"\n🚀 开始增强抓取 Product Hunt...")
        
        page = await self.context.new_page()
        items = []
        
        try:
            print("🌐 访问: https://www.producthunt.com/")
            await page.goto("https://www.producthunt.com/", wait_until='networkidle')
            await asyncio.sleep(3)
            
            # 等待产品加载
            try:
                await page.wait_for_selector('h3, h2, [data-test]', timeout=10000)
            except:
                print("⚠️  页面加载超时，尝试继续...")
            
            # 滚动加载
            for i in range(2):
                await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                await asyncio.sleep(2)
            
            # 寻找产品 - 尝试多种选择器
            product_selectors = ['h3', 'h2', '[data-test*="product"]', 'article']
            products = []
            
            for selector in product_selectors:
                products = await page.query_selector_all(selector)
                if len(products) > 5:  # 找到足够的产品
                    print(f"✅ 找到 {len(products)} 个产品 (使用选择器: {selector})")
                    break
            
            if not products:
                print("⚠️  未找到产品，保存调试截图...")
                await page.screenshot(path='ph_debug.png')
            
            # 提取产品信息
            for i, product in enumerate(products[:10]):
                try:
                    title = await product.text_content()
                    
                    if title and len(title.strip()) > 3 and len(title.strip()) < 100:
                        item = {
                            'id': f"ph_{i}_{int(datetime.now().timestamp())}",
                            'title': title.strip(),
                            'source': 'product_hunt',
                            'platform': 'product_hunt',
                            'scraped_at': datetime.now().isoformat(),
                            'method': 'enhanced_browser'
                        }
                        items.append(item)
                        print(f"  📝 {i+1:2d}. {title.strip()[:60]}...")
                
                except Exception as e:
                    continue
            
            print(f"✅ Product Hunt抓取完成: {len(items)} 条数据")
            
        except Exception as e:
            print(f"❌ Product Hunt抓取失败: {e}")
            await page.screenshot(path='ph_error.png')
        
        finally:
            await page.close()
        
        return items
    
    async def run_comprehensive_scraping(self):
        """运行全面的增强抓取"""
        print("🎭 开始全面增强浏览器抓取")
        print("=" * 60)
        
        await self.setup_browser()
        
        all_items = []
        
        # 抓取多个Reddit社区
        reddit_communities = ['entrepreneur', 'startups', 'SaaS']
        for community in reddit_communities:
            items = await self.scrape_reddit_enhanced(community)
            all_items.extend(items)
            await asyncio.sleep(3)  # 社区间延迟
        
        # 抓取HackerNews
        hn_items = await self.scrape_hackernews_enhanced()
        all_items.extend(hn_items)
        await asyncio.sleep(3)
        
        # 抓取Product Hunt
        ph_items = await self.scrape_producthunt_enhanced()
        all_items.extend(ph_items)
        
        self.results = all_items
        return all_items
    
    async def cleanup(self):
        """清理资源"""
        print("\n🧹 清理浏览器资源...")
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()
        print("✅ 清理完成")
    
    def display_results(self):
        """展示结果"""
        print("\n🎉 增强浏览器抓取完成!")
        print("=" * 60)
        print(f"📊 总共获取数据: {len(self.results)} 条")
        
        if self.results:
            # 按平台分组
            platforms = {}
            for item in self.results:
                platform = item.get('platform', 'unknown')
                platforms[platform] = platforms.get(platform, 0) + 1
            
            print(f"\n📈 数据源分布:")
            for platform, count in platforms.items():
                print(f"  🌐 {platform:15}: {count:3d} 条")
            
            print(f"\n📝 最新数据样本 (前10条):")
            for i, item in enumerate(self.results[:10]):
                platform = item.get('platform', '').upper()
                title = item.get('title', 'No title')[:50]
                print(f"  {i+1:2d}. [{platform:12}] {title}...")
            
            # 保存结果
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"enhanced_scraping_results_{timestamp}.json"
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(self.results, f, ensure_ascii=False, indent=2)
            print(f"\n💾 完整结果已保存到: {filename}")
        
        print(f"\n⏰ 完成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


async def main():
    """主函数"""
    print("🚀 Enhanced Browser Scraping Solution")
    print("增强版浏览器抓取解决方案")
    print(f"启动时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    scraper = EnhancedBrowserScraper()
    
    try:
        await scraper.run_comprehensive_scraping()
        scraper.display_results()
        
    except KeyboardInterrupt:
        print("\n⏹️  用户中断")
    except Exception as e:
        print(f"\n❌ 抓取失败: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await scraper.cleanup()


if __name__ == "__main__":
    asyncio.run(main())