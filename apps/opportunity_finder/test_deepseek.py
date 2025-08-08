#!/usr/bin/env python3
"""Simple test to verify DeepSeek API connection."""

import asyncio
import sys
import os

# Add the embedding service directory to the Python path
sys.path.insert(0, 'embedding_service')

from embedding_service.config import Settings
from embedding_service.embedders.deepseek_embedder import DeepSeekEmbedder


async def test_deepseek_connection():
    """Test DeepSeek API connection and embedding generation."""
    print("🔍 测试DeepSeek API连接...")
    
    # Load settings
    settings = Settings()
    
    if not settings.deepseek_api_key:
        print("❌ DeepSeek API Key未设置")
        return False
    
    print(f"✅ API Key已配置: {settings.deepseek_api_key[:10]}...")
    print(f"📋 使用模型: {settings.deepseek_model}")
    
    # Initialize DeepSeek embedder
    embedder = DeepSeekEmbedder(settings)
    
    try:
        await embedder.initialize()
        print("✅ DeepSeek embedder初始化成功")
        
        # Test embedding generation
        test_texts = [
            "AI创业机会分析",
            "用户需求痛点识别"
        ]
        
        print(f"🧪 测试文本embedding生成...")
        embeddings = await embedder.generate_embeddings(test_texts)
        
        if embeddings and len(embeddings) == len(test_texts):
            print(f"✅ 成功生成 {len(embeddings)} 个embeddings")
            print(f"📏 Embedding维度: {len(embeddings[0])}")
            print(f"🎯 第一个embedding前5维: {embeddings[0][:5]}")
            return True
        else:
            print("❌ Embedding生成失败")
            return False
            
    except Exception as e:
        print(f"❌ 测试失败: {e}")
        return False
    finally:
        await embedder.cleanup()


if __name__ == "__main__":
    success = asyncio.run(test_deepseek_connection())
    exit(0 if success else 1)