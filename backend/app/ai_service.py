"""
AI服务管理
集成Claude和DeepSeek API，提供统一的AI调用接口
"""

import httpx
import json
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime
import os

class AIService:
    """AI服务管理器"""
    
    def __init__(self, claude_api_key: str = None, deepseek_api_key: str = None):
        self.claude_api_key = claude_api_key or os.getenv("CLAUDE_API_KEY")
        self.deepseek_api_key = deepseek_api_key or os.getenv("DEEPSEEK_API_KEY")
        
        # API配置
        self.claude_config = {
            "url": "https://api.anthropic.com/v1/messages",
            "headers": {
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01",
                "Authorization": f"Bearer {self.claude_api_key}"
            }
        }
        
        self.deepseek_config = {
            "url": "https://api.deepseek.com/v1/chat/completions",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.deepseek_api_key}"
            }
        }
        
        # 创建HTTP客户端
        self.client = httpx.AsyncClient(timeout=30.0)
        
        print("✅ AI服务初始化完成")
        if self.claude_api_key:
            print("  - Claude API: 已配置")
        else:
            print("  - Claude API: 未配置")
        if self.deepseek_api_key:
            print("  - DeepSeek API: 已配置")
        else:
            print("  - DeepSeek API: 未配置")
    
    async def call_claude_api(self, messages: List[Dict[str, str]], max_tokens: int = 1500) -> str:
        """调用Claude API"""
        if not self.claude_api_key:
            raise Exception("Claude API密钥未配置")
        
        try:
            # 构造Claude API请求
            request_data = {
                "model": "claude-3-haiku-20240307",
                "max_tokens": max_tokens,
                "temperature": 0.7,
                "messages": messages
            }
            
            print(f"🤖 调用Claude API...")
            response = await self.client.post(
                self.claude_config["url"],
                headers=self.claude_config["headers"],
                json=request_data
            )
            
            if response.status_code != 200:
                error_text = response.text
                print(f"❌ Claude API错误: {response.status_code} - {error_text}")
                raise Exception(f"Claude API错误: {response.status_code}")
            
            result = response.json()
            content = result.get("content", [])
            if content and len(content) > 0:
                return content[0].get("text", "")
            else:
                raise Exception("Claude API返回格式错误")
                
        except httpx.TimeoutException:
            raise Exception("Claude API请求超时")
        except Exception as e:
            print(f"❌ Claude API调用失败: {e}")
            raise e
    
    async def call_deepseek_api(self, messages: List[Dict[str, str]], max_tokens: int = 1500) -> str:
        """调用DeepSeek API"""
        if not self.deepseek_api_key:
            raise Exception("DeepSeek API密钥未配置")
        
        try:
            # 构造DeepSeek API请求
            request_data = {
                "model": "deepseek-chat",
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": 0.7,
                "stream": False
            }
            
            print(f"🤖 调用DeepSeek API...")
            response = await self.client.post(
                self.deepseek_config["url"],
                headers=self.deepseek_config["headers"],
                json=request_data
            )
            
            if response.status_code != 200:
                error_text = response.text
                print(f"❌ DeepSeek API错误: {response.status_code} - {error_text}")
                raise Exception(f"DeepSeek API错误: {response.status_code}")
            
            result = response.json()
            choices = result.get("choices", [])
            if choices and len(choices) > 0:
                return choices[0].get("message", {}).get("content", "")
            else:
                raise Exception("DeepSeek API返回格式错误")
                
        except httpx.TimeoutException:
            raise Exception("DeepSeek API请求超时")
        except Exception as e:
            print(f"❌ DeepSeek API调用失败: {e}")
            raise e
    
    async def call_ai_with_fallback(self, messages: List[Dict[str, str]], max_tokens: int = 1500) -> str:
        """带回退机制的AI调用"""
        errors = []
        
        # 优先尝试Claude API
        if self.claude_api_key:
            try:
                result = await self.call_claude_api(messages, max_tokens)
                print("✅ Claude API调用成功")
                return result
            except Exception as e:
                errors.append(f"Claude API: {str(e)}")
                print(f"⚠️ Claude API失败，尝试DeepSeek...")
        
        # 回退到DeepSeek API
        if self.deepseek_api_key:
            try:
                result = await self.call_deepseek_api(messages, max_tokens)
                print("✅ DeepSeek API调用成功")
                return result
            except Exception as e:
                errors.append(f"DeepSeek API: {str(e)}")
        
        # 所有API都失败
        error_msg = f"所有AI API都不可用: {'; '.join(errors)}"
        print(f"❌ {error_msg}")
        raise Exception(error_msg)
    
    async def generate_requirements_document(self, project_info: Dict[str, Any]) -> str:
        """生成需求文档"""
        messages = [
            {
                "role": "system",
                "content": "你是一位资深的产品经理，专门负责撰写高质量的产品需求文档。请根据项目信息生成详细的PRD文档。"
            },
            {
                "role": "user",
                "content": f"""请为以下项目生成完整的产品需求文档(PRD)：

项目名称：{project_info.get('name', '未知项目')}
项目类型：{project_info.get('type', '通用项目')}
项目描述：{project_info.get('description', '无描述')}
目标用户：{project_info.get('target_users', '待确定')}

请生成包含以下部分的完整PRD：
1. 项目概述
2. 需求背景
3. 目标用户分析
4. 功能需求
5. 非功能需求
6. 用户体验要求
7. 技术约束
8. 项目时间线
9. 风险评估

请使用Markdown格式，内容要专业、详细、可执行。"""
            }
        ]
        
        return await self.call_ai_with_fallback(messages, max_tokens=2000)
    
    async def generate_technical_document(self, project_info: Dict[str, Any]) -> str:
        """生成技术文档"""
        messages = [
            {
                "role": "system",
                "content": "你是一位资深的技术架构师，专门负责设计技术架构和撰写技术文档。请根据项目信息生成详细的技术设计文档。"
            },
            {
                "role": "user",
                "content": f"""请为以下项目生成完整的技术架构文档：

项目名称：{project_info.get('name', '未知项目')}
项目类型：{project_info.get('type', '通用项目')}
项目描述：{project_info.get('description', '无描述')}
技术要求：{project_info.get('technical_requirements', '待确定')}

请生成包含以下部分的完整技术文档：
1. 技术架构概述
2. 技术栈选择
3. 系统架构设计
4. 数据库设计
5. API设计
6. 安全架构
7. 部署架构
8. 性能优化
9. 监控和日志
10. 扩展性考虑

请使用Markdown格式，内容要技术专业、详细、可实施。"""
            }
        ]
        
        return await self.call_ai_with_fallback(messages, max_tokens=2000)
    
    async def generate_design_document(self, project_info: Dict[str, Any]) -> str:
        """生成设计文档"""
        messages = [
            {
                "role": "system",
                "content": "你是一位资深的UI/UX设计师，专门负责用户体验设计和视觉设计。请根据项目信息生成详细的设计文档。"
            },
            {
                "role": "user",
                "content": f"""请为以下项目生成完整的设计文档：

项目名称：{project_info.get('name', '未知项目')}
项目类型：{project_info.get('type', '通用项目')}
项目描述：{project_info.get('description', '无描述')}
目标用户：{project_info.get('target_users', '待确定')}

请生成包含以下部分的完整设计文档：
1. 设计概述和目标
2. 用户体验策略
3. 视觉设计风格
4. 界面设计规范
5. 交互设计原则
6. 响应式设计
7. 可访问性设计
8. 设计系统
9. 原型设计流程
10. 设计评审标准

请使用Markdown格式，内容要专业、系统、可执行。"""
            }
        ]
        
        return await self.call_ai_with_fallback(messages, max_tokens=2000)
    
    async def generate_project_management_document(self, project_info: Dict[str, Any]) -> str:
        """生成项目管理文档"""
        messages = [
            {
                "role": "system",
                "content": "你是一位资深的项目经理，专门负责项目管理和团队协作。请根据项目信息生成详细的项目管理文档。"
            },
            {
                "role": "user",
                "content": f"""请为以下项目生成完整的项目管理文档：

项目名称：{project_info.get('name', '未知项目')}
项目类型：{project_info.get('type', '通用项目')}
项目描述：{project_info.get('description', '无描述')}
项目时间线：{project_info.get('timeline', '待确定')}

请生成包含以下部分的完整项目管理文档：
1. 项目管理概述
2. 项目范围和目标
3. 项目组织架构
4. 项目时间计划
5. 资源分配计划
6. 风险管理计划
7. 质量管理计划
8. 沟通管理计划
9. 变更管理流程
10. 项目监控和报告

请使用Markdown格式，内容要专业、实用、可操作。"""
            }
        ]
        
        return await self.call_ai_with_fallback(messages, max_tokens=2000)
    
    async def chat_completion(self, messages: List[Dict[str, str]], max_tokens: int = 1000) -> str:
        """通用聊天完成"""
        return await self.call_ai_with_fallback(messages, max_tokens)
    
    async def close(self):
        """关闭HTTP客户端"""
        await self.client.aclose()
        print("✅ AI服务已关闭")

# 全局AI服务实例
ai_service = None

def get_ai_service() -> AIService:
    """获取AI服务实例"""
    global ai_service
    if ai_service is None:
        ai_service = AIService()
    return ai_service 