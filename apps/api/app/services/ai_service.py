import httpx
import openai
import anthropic
from typing import List, Dict, Optional
import json
import asyncio

from ..core.config import settings

class AIService:
    """AI 服务集成类"""
    
    def __init__(self):
        self.deepseek_client = httpx.AsyncClient(
            base_url=settings.DEEPSEEK_BASE_URL,
            headers={"Authorization": f"Bearer {settings.DEEPSEEK_API_KEY}"}
        )
        self.claude_client = anthropic.AsyncAnthropic(
            api_key=settings.CLAUDE_API_KEY
        )
        self.openai_client = openai.AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY
        )

    async def generate_clarification_questions(self, initial_idea: str) -> str:
        """生成澄清问题"""
        prompt = f"""
你是一名资深产品经理，善于将模糊需求拆解为精准问题。

用户初始想法：
{initial_idea}

请针对这个想法，提出 2-3 个关键澄清问题，帮助用户细化需求。

要求：
1. 问题要具体、可操作
2. 避免过于技术性的术语
3. 每个问题单独成行
4. 问题要有逻辑递进关系

格式：
1. [问题1]
2. [问题2]
3. [问题3]
"""

        try:
            response = await self._call_deepseek(prompt)
            return response
        except Exception as e:
            # 备用方案：使用预定义模板
            return self._get_fallback_questions(initial_idea)

    async def continue_clarification(self, conversation_history: List[Dict]) -> str:
        """继续澄清对话"""
        # 构建对话上下文
        context = "\n".join([
            f"{msg['role']}: {msg['content']}" 
            for msg in conversation_history[-10:]  # 取最近10条消息
        ])
        
        prompt = f"""
基于以下对话历史，继续澄清用户需求：

{context}

作为产品经理，请：
1. 如果需求还不够清晰，继续提问澄清
2. 如果需求已经比较明确，总结需求要点
3. 保持友好、专业的语调

请给出回复：
"""

        try:
            response = await self._call_deepseek(prompt)
            return response
        except Exception as e:
            return "抱歉，我遇到了一些技术问题。请继续描述您的需求，我会尽力帮助您。"

    async def generate_prompts(self, conversation_history: List[Dict]) -> Dict[str, str]:
        """根据对话历史生成三段提示词"""
        # 提取需求信息
        context = "\n".join([
            f"{msg['role']}: {msg['content']}" 
            for msg in conversation_history
        ])
        
        prompt = f"""
基于以下对话历史，生成三段专业提示词：

对话历史：
{context}

请分别生成：

1. **需求总结** - 简洁明了地总结用户的核心需求
2. **代码生成提示词** - 给 Claude/GPT 的详细技术提示词
3. **项目管理提示词** - 用于生成项目计划和里程碑的提示词

要求：
- 每段提示词都要完整、可执行
- 代码提示词要包含技术栈、架构、功能等详细信息
- 项目管理提示词要包含时间规划、资源分配、风险控制等

请按以下JSON格式输出：
{{
    "summary": "需求总结内容",
    "code_prompt": "代码生成提示词内容", 
    "pm_prompt": "项目管理提示词内容"
}}
"""

        try:
            response = await self._call_deepseek(prompt)
            # 尝试解析 JSON
            try:
                result = json.loads(response)
                return result
            except json.JSONDecodeError:
                # 如果不是有效 JSON，使用备用解析
                return self._parse_prompts_fallback(response)
        except Exception as e:
            return self._get_fallback_prompts(context)

    async def generate_code_with_claude(self, code_prompt: str) -> Dict[str, str]:
        """使用 Claude 生成代码"""
        try:
            message = await self.claude_client.messages.create(
                model=settings.CLAUDE_MODEL,
                max_tokens=4000,
                messages=[{
                    "role": "user",
                    "content": code_prompt
                }]
            )
            
            return {
                "code": message.content[0].text,
                "model": settings.CLAUDE_MODEL,
                "status": "success"
            }
        except Exception as e:
            return {
                "error": str(e),
                "status": "error"
            }

    async def generate_project_plan(self, pm_prompt: str) -> str:
        """生成项目管理计划"""
        try:
            response = await self._call_deepseek(pm_prompt)
            return response
        except Exception as e:
            return f"生成项目计划时出错：{str(e)}"

    async def _call_deepseek(self, prompt: str) -> str:
        """调用 DeepSeek API"""
        try:
            response = await self.deepseek_client.post(
                "/chat/completions",
                json={
                    "model": "deepseek-chat",
                    "messages": [
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2000
                }
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except Exception as e:
            raise Exception(f"DeepSeek API 调用失败: {str(e)}")

    def _get_fallback_questions(self, initial_idea: str) -> str:
        """备用澄清问题"""
        return """
1. 您希望这个系统主要解决什么问题？
2. 您期望的用户群体是谁？他们有什么特征？
3. 您对技术实现有什么特殊要求或偏好吗？
"""

    def _parse_prompts_fallback(self, response: str) -> Dict[str, str]:
        """备用提示词解析"""
        # 简单的文本解析逻辑
        lines = response.split('\n')
        result = {
            "summary": "需求总结：" + response[:200] + "...",
            "code_prompt": "请根据以下需求生成完整的项目代码：\n" + response,
            "pm_prompt": "请根据以下需求生成详细的项目管理计划：\n" + response
        }
        return result

    def _get_fallback_prompts(self, context: str) -> Dict[str, str]:
        """备用提示词生成"""
        return {
            "summary": f"基于用户对话，核心需求是：{context[:200]}...",
            "code_prompt": f"请生成一个满足以下需求的完整项目：\n{context}",
            "pm_prompt": f"请为以下项目生成详细的管理计划：\n{context}"
        }

    async def close(self):
        """关闭客户端连接"""
        await self.deepseek_client.aclose()

# 创建全局实例
ai_service = AIService() 