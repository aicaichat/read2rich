"""Simplified API Gateway for quick demo."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import json
from datetime import datetime

app = FastAPI(
    title="AI Opportunity Finder API (Demo)",
    description="Simplified API for demonstration",
    version="1.0.0-demo"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserProfile(BaseModel):
    skills: List[str]
    budget: int
    timeCommitment: str
    experience: str

class Opportunity(BaseModel):
    id: str
    title: str
    description: str
    painScore: float
    tamScore: float
    gapScore: float
    aiFitScore: float
    soloFitScore: float
    riskScore: float
    totalScore: float
    tags: List[str]
    sources: List[str]
    estimatedRevenue: str
    timeToMarket: str
    difficulty: str

# Mock data - 10个新的高潜力AI应用创意清单
MOCK_OPPORTUNITIES = [
    # 个人成长与心理健康类
    {
        "id": "1",
        "title": "AI职业路径规划师 (AI Career Path Finder)",
        "description": "通过深度分析用户的现有技能、性格特质和兴趣偏好，为用户量身定制职业发展路径。将宏大的职业目标分解为具体、可执行的微观学习目标和技能提升任务，解决职业发展迷茫与技能提升焦虑。",
        "painScore": 9.1,
        "tamScore": 8.7,
        "gapScore": 7.8,
        "aiFitScore": 8.5,
        "soloFitScore": 8.2,
        "riskScore": 3.5,
        "totalScore": 8.13,
        "tags": ["AI", "Career Development", "Personal Growth", "Education"],
        "sources": ["LinkedIn Jobs Market", "Career Forums", "Educational Platforms"],
        "estimatedRevenue": "$100k-500k/年",
        "timeToMarket": "12-16周",
        "difficulty": "Medium"
    },
    {
        "id": "2",
        "title": "AI心理倦怠检测器 (AI Mental Burnout Detector)",
        "description": "通过被动且非侵入式的方式，持续监测用户在数字交互中产生的数据，预测心理状态变化。分析语音语调、打字模式、日程安排等数据，在检测到倦怠风险时主动推送个性化干预建议。",
        "painScore": 9.3,
        "tamScore": 7.9,
        "gapScore": 8.5,
        "aiFitScore": 9.2,
        "soloFitScore": 7.1,
        "riskScore": 4.2,
        "totalScore": 7.97,
        "tags": ["AI", "Mental Health", "Wellness", "Monitoring"],
        "sources": ["Mental Health Forums", "Workplace Research", "Psychology Studies"],
        "estimatedRevenue": "$200k-1M/年",
        "timeToMarket": "16-24周",
        "difficulty": "Hard"
    },
    {
        "id": "3",
        "title": "AI每日反思与日记助手 (AI-Powered Daily Reflection App)",
        "description": "将日记从简单的记录工具升级为深度自我认知和个人成长引擎。根据用户当天的情绪状态、活动记录和个人成长目标，智能生成引导性反思问题，帮助用户进行更深层次的思考。",
        "painScore": 7.8,
        "tamScore": 8.1,
        "gapScore": 7.5,
        "aiFitScore": 8.7,
        "soloFitScore": 8.9,
        "riskScore": 2.8,
        "totalScore": 7.87,
        "tags": ["AI", "Personal Growth", "Journaling", "Mindfulness"],
        "sources": ["Self-improvement Communities", "App Store Reviews", "Wellness Blogs"],
        "estimatedRevenue": "$50k-250k/年",
        "timeToMarket": "8-12周",
        "difficulty": "Medium"
    },
    {
        "id": "4",
        "title": "AI梦境日记分析器 (AI-Based Dream Journal Analyzer)",
        "description": "为用户提供专门记录梦境的平台，利用AI技术分析梦境内容，揭示潜在的心理模式和象征意义。自动提取梦境中的关键元素，结合心理学理论和现代梦境研究提供解释。",
        "painScore": 6.8,
        "tamScore": 6.5,
        "gapScore": 8.9,
        "aiFitScore": 8.2,
        "soloFitScore": 8.5,
        "riskScore": 3.1,
        "totalScore": 7.48,
        "tags": ["AI", "Psychology", "Dream Analysis", "Personal Insight"],
        "sources": ["Psychology Forums", "Dream Communities", "Research Papers"],
        "estimatedRevenue": "$30k-150k/年",
        "timeToMarket": "10-14周",
        "difficulty": "Medium"
    },
    # 生活方式与娱乐类
    {
        "id": "5",
        "title": "AI服装搭配师 (AI-Based Clothing Matcher)",
        "description": "解决'今天穿什么'这一永恒难题。用户通过拍照上传衣物，应用自动识别类别、颜色、材质等属性。根据天气、场合、心情生成穿搭方案，提供AR虚拟试穿功能，分析衣橱使用情况。",
        "painScore": 8.2,
        "tamScore": 9.1,
        "gapScore": 7.3,
        "aiFitScore": 8.8,
        "soloFitScore": 8.7,
        "riskScore": 3.7,
        "totalScore": 8.07,
        "tags": ["AI", "Fashion", "Computer Vision", "AR", "E-commerce"],
        "sources": ["Fashion Forums", "Shopping Apps Reviews", "Style Communities"],
        "estimatedRevenue": "$150k-750k/年",
        "timeToMarket": "14-20周",
        "difficulty": "Hard"
    },
    {
        "id": "6",
        "title": "AI宠物健康追踪器 (AI Pet Health Tracker)",
        "description": "利用AI技术帮助宠物主人主动监测和管理宠物健康。通过图像扫描分析宠物体型变化、毛发状况，通过视频分析追踪行为模式，提供营养分析模块评估饮食均衡性。",
        "painScore": 8.7,
        "tamScore": 8.3,
        "gapScore": 8.1,
        "aiFitScore": 9.0,
        "soloFitScore": 7.8,
        "riskScore": 4.0,
        "totalScore": 7.98,
        "tags": ["AI", "Pet Care", "Health Monitoring", "Computer Vision"],
        "sources": ["Pet Owner Forums", "Veterinary Studies", "Pet Care Apps"],
        "estimatedRevenue": "$100k-400k/年",
        "timeToMarket": "12-18周",
        "difficulty": "Hard"
    },
    {
        "id": "7",
        "title": "AI人际关系兼容性分析 (AI Relationship Compatibility App)",
        "description": "帮助用户（情侣、朋友或商业伙伴）更深入地理解彼此，改善沟通和关系。分析双方聊天记录中的情感倾向、沟通风格和话题分布，生成详细的'关系兼容性报告'。",
        "painScore": 7.9,
        "tamScore": 7.5,
        "gapScore": 8.2,
        "aiFitScore": 8.4,
        "soloFitScore": 8.1,
        "riskScore": 4.5,
        "totalScore": 7.61,
        "tags": ["AI", "Relationships", "Communication", "Psychology"],
        "sources": ["Dating Apps Research", "Relationship Forums", "Psychology Studies"],
        "estimatedRevenue": "$75k-300k/年",
        "timeToMarket": "10-16周",
        "difficulty": "Medium"
    },
    {
        "id": "8",
        "title": "AI故事情节生成器 (AI-Based Story Plot Generator)",
        "description": "为作家、编剧、游戏设计师等创意工作者解决'灵感枯竭'和'情节卡壳'问题。用户输入简单创意提示或基本设定，应用快速构建完整故事框架，包括情节点、人物弧线和关键场景。",
        "painScore": 8.1,
        "tamScore": 7.8,
        "gapScore": 7.7,
        "aiFitScore": 9.3,
        "soloFitScore": 9.2,
        "riskScore": 2.9,
        "totalScore": 8.20,
        "tags": ["AI", "Creative Writing", "Content Creation", "Storytelling"],
        "sources": ["Writer Communities", "Creative Forums", "Publishing Platforms"],
        "estimatedRevenue": "$60k-250k/年",
        "timeToMarket": "8-14周",
        "difficulty": "Medium"
    },
    {
        "id": "9",
        "title": "AI兴趣爱好发现器 (AI Hobby Finder)",
        "description": "帮助用户摆脱无聊、发现生活乐趣、找到真正热爱的活动。通过交互了解用户的空闲时间、预算、性格偏好和期望收益，从庞大的爱好数据库中筛选最匹配的选项。",
        "painScore": 7.6,
        "tamScore": 8.0,
        "gapScore": 8.3,
        "aiFitScore": 7.9,
        "soloFitScore": 9.1,
        "riskScore": 2.5,
        "totalScore": 7.87,
        "tags": ["AI", "Lifestyle", "Hobby Discovery", "Personal Development"],
        "sources": ["Lifestyle Forums", "Hobby Communities", "Social Platforms"],
        "estimatedRevenue": "$40k-180k/年",
        "timeToMarket": "6-10周",
        "difficulty": "Easy"
    },
    # 商业与法律支持类
    {
        "id": "10",
        "title": "AI小型企业法律顾问 (AI Legal Advisor for Small Businesses)",
        "description": "为小型企业、初创公司和自由职业者提供低成本、即时的法律支持。核心功能包括智能合同生成与审查，用户通过自然语言描述需求即可获得专业合同草案。",
        "painScore": 9.4,
        "tamScore": 9.2,
        "gapScore": 8.6,
        "aiFitScore": 8.9,
        "soloFitScore": 7.3,
        "riskScore": 5.8,
        "totalScore": 7.93,
        "tags": ["AI", "Legal Tech", "Small Business", "Contract Analysis"],
        "sources": ["Small Business Forums", "Legal Industry Reports", "Startup Communities"],
        "estimatedRevenue": "$200k-1M/年",
        "timeToMarket": "18-24周",
        "difficulty": "Hard"
    }
]

@app.get("/")
async def root():
    return {
        "message": "AI Opportunity Finder API (Demo Mode)",
        "version": "1.0.0-demo",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "api": "up",
            "mock_data": "available"
        },
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/v1/opportunities/generate")
async def generate_opportunities(profile: UserProfile) -> Dict[str, List[Opportunity]]:
    """Generate personalized opportunities based on user profile."""
    
    # Simple scoring adjustment based on profile
    opportunities = []
    for opp_data in MOCK_OPPORTUNITIES:
        adjusted_opp = opp_data.copy()
        
        # Boost AI-related opportunities if user has AI skills
        if "AI/ML" in profile.skills and "AI" in opp_data["tags"]:
            adjusted_opp["totalScore"] += 0.5
            adjusted_opp["aiFitScore"] = min(10.0, adjusted_opp["aiFitScore"] + 0.5)
        
        # Boost based on budget compatibility
        if profile.budget >= 10000:
            adjusted_opp["totalScore"] += 0.2
        
        # Experience factor
        if profile.experience == "expert":
            adjusted_opp["totalScore"] += 0.3
        elif profile.experience == "beginner":
            adjusted_opp["soloFitScore"] = max(1.0, adjusted_opp["soloFitScore"] - 0.5)
        
        # Clamp scores to valid range
        for score_key in ["painScore", "tamScore", "gapScore", "aiFitScore", "soloFitScore", "riskScore", "totalScore"]:
            adjusted_opp[score_key] = max(0.0, min(10.0, adjusted_opp[score_key]))
        
        opportunities.append(Opportunity(**adjusted_opp))
    
    # Sort by total score
    opportunities.sort(key=lambda x: x.totalScore, reverse=True)
    
    return {"opportunities": opportunities}

@app.get("/api/v1/opportunities/{opportunity_id}")
async def get_opportunity(opportunity_id: str) -> Opportunity:
    """Get detailed information about a specific opportunity."""
    
    for opp_data in MOCK_OPPORTUNITIES:
        if opp_data["id"] == opportunity_id:
            return Opportunity(**opp_data)
    
    raise HTTPException(status_code=404, detail="Opportunity not found")

@app.get("/api/v1/opportunities/search")
async def search_opportunities(q: str = "", limit: int = 10) -> Dict[str, List[Opportunity]]:
    """Search for opportunities."""
    
    if not q:
        opportunities = [Opportunity(**opp) for opp in MOCK_OPPORTUNITIES[:limit]]
    else:
        # Simple text search
        filtered = []
        q_lower = q.lower()
        for opp_data in MOCK_OPPORTUNITIES:
            if (q_lower in opp_data["title"].lower() or 
                q_lower in opp_data["description"].lower() or
                any(q_lower in tag.lower() for tag in opp_data["tags"])):
                filtered.append(Opportunity(**opp_data))
        
        opportunities = filtered[:limit]
    
    return {"opportunities": opportunities}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)