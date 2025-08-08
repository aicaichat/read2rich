#!/usr/bin/env python3
"""
本地可视化浏览器抓取演示
直接在本地环境运行，无需Docker容器
"""

import asyncio
import sys
import os
import signal
from datetime import datetime
import json

async def install_playwright_if_needed():
    """检查并安装Playwright"""
    try:
        import playwright
        print("✅ Playwright已安装")
        return True
    except ImportError:
        print("📦 Playwright未安装，正在安装...")
        try:
            import subprocess
            subprocess.check_call([sys.executable, "-m", "pip", "install", "playwright", "--break-system-packages"])
            subprocess.check_call([sys.executable, "-m", "playwright", "install", "chromium"])
            print("✅ Playwright安装完成")
            return True
        except Exception as e:
            print(f"❌ Playwright安装失败: {e}")
            return False

async def run_visual_scraping_demo():
    """运行可视化抓取演示"""
    
    # Check playwright installation
    if not await install_playwright_if_needed():
        return
    
    # Import after installation
    from playwright.async_api import async_playwright
    import random
    
    print("🎭 开始可视化浏览器自动化抓取演示")
    print("=" * 60)
    print("⚠️  注意: 浏览器窗口将会自动打开，请不要关闭!")
    print("🎯 演示将依次访问: Reddit, HackerNews, Product Hunt")
    print("⏱️  整个过程大约需要 2-3 分钟")
    print("=" * 60)
    
    await asyncio.sleep(3)
    
    playwright = await async_playwright().start()
    all_items = []
    
    try:
        # Launch visible browser
        browser = await playwright.chromium.launch(
            headless=False,
            slow_mo=2000,  # 2 second delay between actions
            args=['--start-maximized']
        )
        
        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        )
        
        page = await context.new_page()
        
        # 1. Scrape Reddit
        print("\n📱 正在可视化抓取 Reddit r/entrepreneur...")
        try:
            await page.goto("https://www.reddit.com/r/entrepreneur/", wait_until='networkidle')
            await asyncio.sleep(3)  # Visual pause
            
            # Try to find posts
            posts = await page.query_selector_all('h3')
            reddit_items = []
            
            for i, post in enumerate(posts[:5]):
                try:
                    title = await post.text_content()
                    if title and len(title) > 10:
                        item = {
                            'id': f"reddit_visual_{i}",
                            'title': title.strip(),
                            'source': 'reddit_entrepreneur',
                            'platform': 'reddit',
                            'scraped_at': datetime.now().isoformat()
                        }
                        reddit_items.append(item)
                        print(f"  📝 发现帖子: {title[:50]}...")
                except:
                    continue
            
            all_items.extend(reddit_items)
            print(f"✅ Reddit抓取完成: {len(reddit_items)} 条数据")
            
        except Exception as e:
            print(f"❌ Reddit抓取失败: {e}")
        
        await asyncio.sleep(3)  # Visual pause
        
        # 2. Scrape Hacker News
        print("\n📰 正在可视化抓取 Hacker News...")
        try:
            await page.goto("https://news.ycombinator.com/", wait_until='networkidle')
            await asyncio.sleep(3)  # Visual pause
            
            # Find story titles
            stories = await page.query_selector_all('span.titleline > a')
            hn_items = []
            
            for i, story in enumerate(stories[:5]):
                try:
                    title = await story.text_content()
                    href = await story.get_attribute('href')
                    
                    if title:
                        item = {
                            'id': f"hn_visual_{i}",
                            'title': title.strip(),
                            'url': href,
                            'source': 'hackernews',
                            'platform': 'hackernews',
                            'scraped_at': datetime.now().isoformat()
                        }
                        hn_items.append(item)
                        print(f"  📝 发现故事: {title[:50]}...")
                except:
                    continue
            
            all_items.extend(hn_items)
            print(f"✅ HackerNews抓取完成: {len(hn_items)} 条数据")
            
        except Exception as e:
            print(f"❌ HackerNews抓取失败: {e}")
        
        await asyncio.sleep(3)  # Visual pause
        
        # 3. Scrape Product Hunt
        print("\n🚀 正在可视化抓取 Product Hunt...")
        try:
            await page.goto("https://www.producthunt.com/", wait_until='networkidle')
            await asyncio.sleep(5)  # Longer pause for Product Hunt
            
            # Find products
            products = await page.query_selector_all('h3')
            ph_items = []
            
            for i, product in enumerate(products[:5]):
                try:
                    title = await product.text_content()
                    
                    if title and len(title) > 5:
                        item = {
                            'id': f"ph_visual_{i}",
                            'title': title.strip(),
                            'source': 'product_hunt',
                            'platform': 'product_hunt',
                            'scraped_at': datetime.now().isoformat()
                        }
                        ph_items.append(item)
                        print(f"  📝 发现产品: {title[:50]}...")
                except:
                    continue
            
            all_items.extend(ph_items)
            print(f"✅ Product Hunt抓取完成: {len(ph_items)} 条数据")
            
        except Exception as e:
            print(f"❌ Product Hunt抓取失败: {e}")
        
        # Visual completion pause
        print("\n🎉 抓取演示即将完成...")
        await asyncio.sleep(3)
        
        await context.close()
        await browser.close()
        
    except Exception as e:
        print(f"❌ 浏览器操作失败: {e}")
    
    finally:
        await playwright.stop()
    
    # Display results
    print("\n🎉 可视化抓取演示完成!")
    print("=" * 60)
    print(f"📊 总共获取数据: {len(all_items)} 条")
    
    if all_items:
        print("\n📝 完整数据样本:")
        for i, item in enumerate(all_items):
            platform = item.get('platform', 'unknown')
            title = item.get('title', 'No title')[:60]
            print(f"  {i+1:2d}. [{platform.upper():12}] {title}...")
        
        # Group by platform
        platforms = {}
        for item in all_items:
            platform = item.get('platform', 'unknown')
            platforms[platform] = platforms.get(platform, 0) + 1
        
        print(f"\n📈 数据源分布:")
        for platform, count in platforms.items():
            print(f"  🌐 {platform:15}: {count} 条")
        
        # Save to file
        output_file = f"visual_scraping_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(all_items, f, ensure_ascii=False, indent=2)
        print(f"\n💾 详细结果已保存到: {output_file}")
    
    print(f"\n⏰ 演示完成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


async def main():
    """主函数"""
    print("🚀 AI Opportunity Finder 本地可视化抓取演示")
    print(f"启动时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    try:
        await run_visual_scraping_demo()
    except KeyboardInterrupt:
        print("\n\n⏹️  用户中断演示")
    except Exception as e:
        print(f"\n❌ 演示过程中发生错误: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    print("🎯 本地可视化抓取演示")
    print("🖥️  此演示将在您的本地环境运行浏览器")
    print("📱 您将看到浏览器自动访问各个网站并抓取数据")
    print()
    
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 演示已退出")
    except Exception as e:
        print(f"\n💥 启动失败: {e}")
        sys.exit(1)