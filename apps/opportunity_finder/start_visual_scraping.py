#!/usr/bin/env python3
"""
启动可视化浏览器抓取演示
这个脚本将在本地运行浏览器自动化抓取，让您能够看到整个过程
"""

import asyncio
import sys
import os
import signal
from datetime import datetime

# Add the ingestion_service to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'ingestion_service'))

from config import Settings
from scrapers.browser_scraper import BrowserScraper
from producers.kafka_producer import KafkaProducer


class VisualScrapingDemo:
    """可视化抓取演示类"""
    
    def __init__(self):
        self.settings = Settings()
        self.kafka_producer = None
        self.scraper = None
        self.running = True
    
    async def setup(self):
        """初始化设置"""
        print("🔧 初始化可视化抓取演示...")
        
        try:
            # Initialize Kafka producer (optional for demo)
            self.kafka_producer = KafkaProducer(self.settings)
            print("✅ Kafka连接初始化完成")
        except Exception as e:
            print(f"⚠️  Kafka连接失败，使用演示模式: {e}")
            self.kafka_producer = None
        
        # Initialize browser scraper
        self.scraper = BrowserScraper(self.kafka_producer, self.settings)
        print("✅ 浏览器抓取器初始化完成")
    
    async def run_visual_demo(self):
        """运行可视化演示"""
        print("\n🎭 开始可视化浏览器自动化抓取演示")
        print("=" * 60)
        print("⚠️  注意: 浏览器窗口将会自动打开，请不要关闭!")
        print("🎯 演示将依次访问: Reddit, HackerNews, Product Hunt")
        print("⏱️  整个过程大约需要 2-3 分钟")
        print("=" * 60)
        
        try:
            # Wait a moment for user to see the message
            await asyncio.sleep(3)
            
            # Start scraping with visual feedback
            items = await self.scraper.scrape_batch()
            
            # Display results
            print("\n🎉 可视化抓取演示完成!")
            print("=" * 60)
            print(f"📊 总共获取数据: {len(items)} 条")
            
            if items:
                print("\n📝 数据样本:")
                for i, item in enumerate(items[:5]):  # Show first 5 items
                    platform = item.get('platform', 'unknown')
                    title = item.get('title', 'No title')[:50]
                    print(f"  {i+1}. [{platform.upper()}] {title}...")
                
                # Group by platform
                platforms = {}
                for item in items:
                    platform = item.get('platform', 'unknown')
                    platforms[platform] = platforms.get(platform, 0) + 1
                
                print(f"\n📈 数据源分布:")
                for platform, count in platforms.items():
                    print(f"  🌐 {platform}: {count} 条")
            
            print(f"\n💾 抓取完成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            
        except KeyboardInterrupt:
            print("\n\n⏹️  用户中断演示")
        except Exception as e:
            print(f"\n❌ 演示过程中发生错误: {e}")
            import traceback
            traceback.print_exc()
    
    async def cleanup(self):
        """清理资源"""
        print("\n🧹 清理资源...")
        
        if self.scraper:
            await self.scraper.cleanup()
        
        if self.kafka_producer:
            try:
                await self.kafka_producer.close()
            except:
                pass
        
        print("✅ 清理完成")
    
    def setup_signal_handlers(self):
        """设置信号处理器"""
        def signal_handler(signum, frame):
            print(f"\n📡 收到信号 {signum}, 正在优雅退出...")
            self.running = False
        
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)


async def main():
    """主函数"""
    print("🚀 AI Opportunity Finder 可视化抓取演示")
    print(f"启动时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    demo = VisualScrapingDemo()
    demo.setup_signal_handlers()
    
    try:
        await demo.setup()
        await demo.run_visual_demo()
    except Exception as e:
        print(f"❌ 演示失败: {e}")
    finally:
        await demo.cleanup()


if __name__ == "__main__":
    print("🎯 提示: 请确保您有GUI环境来显示浏览器窗口")
    print("🔧 如果在服务器环境，请使用VNC或X11转发")
    print()
    
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 演示已退出")
    except Exception as e:
        print(f"\n💥 启动失败: {e}")
        sys.exit(1)