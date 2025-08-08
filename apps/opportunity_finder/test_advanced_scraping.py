#!/usr/bin/env python3
"""
Test script for advanced scraping methods.
Tests browser automation and smart HTTP scraping.
"""

import asyncio
import sys
import os
import json
from datetime import datetime
from loguru import logger

# Add the ingestion_service to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'ingestion_service'))

from config import Settings
from scrapers.smart_http_scraper import SmartHttpScraper
from scrapers.browser_scraper import BrowserScraper


async def test_smart_http_scraping():
    """Test the smart HTTP scraper."""
    print("\n🧠 测试智能HTTP抓取器...")
    print("=" * 50)
    
    try:
        settings = Settings()
        scraper = SmartHttpScraper(settings)
        
        # Test Reddit scraping
        print("📱 测试Reddit抓取...")
        reddit_items = await scraper._scrape_reddit_smart('entrepreneur')
        print(f"✅ Reddit成功抓取: {len(reddit_items)} 条数据")
        
        if reddit_items:
            print("📝 Reddit示例数据:")
            sample = reddit_items[0]
            print(f"   标题: {sample.get('title', '')[:60]}...")
            print(f"   评分: {sample.get('score', 0)}")
            print(f"   作者: {sample.get('author', '')}")
        
        # Test HackerNews scraping
        print("\n📰 测试HackerNews抓取...")
        hn_items = await scraper._scrape_hackernews_smart()
        print(f"✅ HackerNews成功抓取: {len(hn_items)} 条数据")
        
        if hn_items:
            print("📝 HackerNews示例数据:")
            sample = hn_items[0]
            print(f"   标题: {sample.get('title', '')[:60]}...")
            print(f"   积分: {sample.get('points', 0)}")
            print(f"   评论: {sample.get('num_comments', 0)}")
        
        total_items = len(reddit_items) + len(hn_items)
        print(f"\n🎉 智能HTTP抓取完成! 总共获取: {total_items} 条数据")
        
        return reddit_items + hn_items
        
    except Exception as e:
        print(f"❌ 智能HTTP抓取错误: {e}")
        logger.exception("Smart HTTP scraping error")
        return []


async def test_browser_scraping():
    """Test the browser automation scraper."""
    print("\n🌐 测试浏览器自动化抓取器...")
    print("=" * 50)
    
    try:
        settings = Settings()
        scraper = BrowserScraper(settings)
        
        # Test Reddit browser scraping
        print("📱 测试浏览器Reddit抓取...")
        reddit_items = await scraper._scrape_reddit_with_browser('startups')
        print(f"✅ 浏览器Reddit成功抓取: {len(reddit_items)} 条数据")
        
        if reddit_items:
            print("📝 浏览器Reddit示例数据:")
            sample = reddit_items[0]
            print(f"   标题: {sample.get('title', '')[:60]}...")
            print(f"   评分: {sample.get('score', 0)}")
            print(f"   作者: {sample.get('author', '')}")
        
        # Test HackerNews browser scraping
        print("\n📰 测试浏览器HackerNews抓取...")
        hn_items = await scraper._scrape_hackernews_with_browser()
        print(f"✅ 浏览器HackerNews成功抓取: {len(hn_items)} 条数据")
        
        if hn_items:
            print("📝 浏览器HackerNews示例数据:")
            sample = hn_items[0]
            print(f"   标题: {sample.get('title', '')[:60]}...")
            print(f"   Story ID: {sample.get('story_id', '')}")
        
        total_items = len(reddit_items) + len(hn_items)
        print(f"\n🎉 浏览器自动化抓取完成! 总共获取: {total_items} 条数据")
        
        # Cleanup browser resources
        await scraper.cleanup()
        
        return reddit_items + hn_items
        
    except Exception as e:
        print(f"❌ 浏览器抓取错误: {e}")
        logger.exception("Browser scraping error")
        return []


async def compare_scraping_methods():
    """Compare different scraping methods."""
    print("\n📊 抓取方法对比测试")
    print("=" * 50)
    
    results = {}
    
    # Test smart HTTP scraping
    start_time = datetime.now()
    smart_items = await test_smart_http_scraping()
    smart_duration = (datetime.now() - start_time).total_seconds()
    results['smart_http'] = {
        'items': len(smart_items),
        'duration': smart_duration,
        'success_rate': (len(smart_items) / 50) * 100 if smart_items else 0  # Assuming target of 50 items
    }
    
    # Test browser scraping
    start_time = datetime.now()
    browser_items = await test_browser_scraping()
    browser_duration = (datetime.now() - start_time).total_seconds()
    results['browser'] = {
        'items': len(browser_items),
        'duration': browser_duration,
        'success_rate': (len(browser_items) / 35) * 100 if browser_items else 0  # Assuming target of 35 items
    }
    
    # Print comparison
    print("\n📋 抓取方法对比结果:")
    print("-" * 50)
    print(f"{'方法':<15} {'数据量':<8} {'耗时(秒)':<10} {'成功率':<8}")
    print("-" * 50)
    
    for method, data in results.items():
        print(f"{method:<15} {data['items']:<8} {data['duration']:<10.1f} {data['success_rate']:<8.1f}%")
    
    # Save results to file
    with open('scraping_test_results.json', 'w', encoding='utf-8') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'results': results,
            'smart_items_sample': smart_items[:3] if smart_items else [],
            'browser_items_sample': browser_items[:3] if browser_items else []
        }, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 详细结果已保存到: scraping_test_results.json")
    
    # Recommendations
    print("\n💡 建议:")
    if results['smart_http']['items'] > results['browser']['items']:
        print("   ✅ 智能HTTP抓取器表现更好，推荐优先使用")
    elif results['browser']['items'] > results['smart_http']['items']:
        print("   ✅ 浏览器自动化抓取器表现更好，推荐优先使用")
    else:
        print("   ⚖️  两种方法表现相当，可以并行使用提高覆盖率")
    
    return results


async def main():
    """Main test function."""
    print("🚀 AI Opportunity Finder 高级抓取测试")
    print("=" * 60)
    print(f"测试时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    try:
        # Run comparison test
        results = await compare_scraping_methods()
        
        print("\n🎯 测试总结:")
        total_items = sum(data['items'] for data in results.values())
        total_duration = sum(data['duration'] for data in results.values())
        
        print(f"   📊 总数据量: {total_items} 条")
        print(f"   ⏱️  总耗时: {total_duration:.1f} 秒")
        print(f"   📈 平均速度: {total_items/total_duration:.1f} 条/秒")
        
        if total_items > 30:
            print("   ✅ 抓取测试成功! 高级抓取器工作正常")
        elif total_items > 10:
            print("   ⚠️  抓取测试部分成功，可能存在网络限制")
        else:
            print("   ❌ 抓取测试失败，需要检查网络和配置")
        
    except Exception as e:
        print(f"❌ 测试过程中发生错误: {e}")
        logger.exception("Test error")


if __name__ == "__main__":
    # Configure logging
    logger.remove()
    logger.add(sys.stdout, level="INFO", format="{time:HH:mm:ss} | {level} | {message}")
    
    # Run tests
    asyncio.run(main())