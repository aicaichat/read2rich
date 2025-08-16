#!/usr/bin/env python3
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse

class RequestHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        
        # Health check
        if parsed_path.path == '/health':
            self.send_json_response({"status": "healthy", "service": "read2rich-minimal"})
            return
        
        # Opportunities
        if parsed_path.path == '/api/v1/opportunities':
            opportunities = [
                {
                    "id": 1,
                    "title": "AI-Powered Personal Finance Assistant",
                    "description": "A mobile app that uses AI to analyze spending patterns and provide personalized financial advice.",
                    "category": "fintech",
                    "market_size": 50000000,
                    "difficulty_level": 3,
                    "investment_required": 150000,
                    "time_to_market": "8-12 months",
                    "source_url": "https://example.com/opportunity/1",
                    "created_at": "2024-01-15T10:30:00Z"
                },
                {
                    "id": 2,
                    "title": "Sustainable Packaging Marketplace",
                    "description": "An online marketplace connecting businesses with sustainable packaging suppliers.",
                    "category": "ecommerce",
                    "market_size": 25000000,
                    "difficulty_level": 2,
                    "investment_required": 75000,
                    "time_to_market": "4-6 months",
                    "source_url": "https://example.com/opportunity/2",
                    "created_at": "2024-01-14T14:20:00Z"
                }
            ]
            self.send_json_response(opportunities)
            return
        
        # Categories
        if parsed_path.path == '/api/v1/opportunities/categories':
            categories = {
                "categories": [
                    {"key": "all", "label": "All Categories"},
                    {"key": "saas", "label": "SaaS"},
                    {"key": "fintech", "label": "FinTech"},
                    {"key": "ecommerce", "label": "E-commerce"}
                ]
            }
            self.send_json_response(categories)
            return
        
        # Business Report Generation
        if parsed_path.path == '/api/v1/business-report/generate':
            report = {
                "id": "ai-clothing-matcher-report",
                "title": "AI服装搭配师商业分析报告",
                "executive_summary": {
                    "overview": "AI服装搭配师是一个基于计算机视觉和机器学习的创新解决方案，旨在解决用户日常穿搭选择困难的痛点。",
                    "market_size": "680亿美元时尚电商市场",
                    "investment_required": "$150k-750k",
                    "expected_revenue": "$2-15M ARR",
                    "time_to_market": "14-20周MVP，6-9个月完整产品"
                },
                "market_analysis": {
                    "market_size": "680亿美元",
                    "growth_rate": "年增长率15.2%",
                    "key_trends": [
                        "个性化购物体验需求增长",
                        "AR/VR技术在时尚领域应用",
                        "可持续时尚意识提升",
                        "社交媒体影响力营销"
                    ],
                    "target_audience": {
                        "primary": "18-35岁都市女性，年收入5-20万",
                        "secondary": "时尚意识较强的男性用户",
                        "size": "全球约2.3亿潜在用户"
                    }
                },
                "competitive_analysis": {
                    "direct_competitors": [
                        {
                            "name": "Stitch Fix",
                            "strengths": ["成熟的个人造型师网络", "大数据分析能力"],
                            "weaknesses": ["主要限于北美市场", "依赖人工造型师成本高"]
                        },
                        {
                            "name": "Thread",
                            "strengths": ["AI驱动的推荐算法", "与品牌合作深度"],
                            "weaknesses": ["主要面向男性市场", "品牌选择相对有限"]
                        }
                    ],
                    "competitive_advantage": [
                        "计算机视觉技术领先",
                        "本土化用户体验",
                        "多元化变现模式",
                        "社交化功能创新"
                    ]
                },
                "financial_projections": {
                    "year_1": {"revenue": 500000, "expenses": 800000, "net_income": -300000},
                    "year_2": {"revenue": 2500000, "expenses": 2000000, "net_income": 500000},
                    "year_3": {"revenue": 8000000, "expenses": 5500000, "net_income": 2500000}
                },
                "risk_assessment": {
                    "high_risks": [
                        "技术开发复杂度高",
                        "用户获取成本上升",
                        "数据隐私合规要求"
                    ],
                    "medium_risks": [
                        "时尚趋势变化快",
                        "供应链依赖性",
                        "竞争加剧"
                    ],
                    "mitigation_strategies": [
                        "分阶段产品开发，快速迭代",
                        "多渠道用户获取策略",
                        "建立完善的数据保护机制"
                    ]
                }
            }
            self.send_json_response(report)
            return
        
        # Business Plan Generation
        if parsed_path.path == '/api/v1/business-plan/generate':
            business_plan = {
                "id": "ai-clothing-matcher-bp",
                "title": "AI服装搭配师商业计划书",
                "slides": [
                    {
                        "title": "项目概述",
                        "content": "解决'今天穿什么'的永恒问题，通过AI技术提供个性化穿搭建议",
                        "details": [
                            "目标用户：18-35岁都市女性",
                            "核心功能：衣物识别、智能搭配、AR试穿",
                            "商业价值：提升购物效率，减少决策疲劳"
                        ]
                    },
                    {
                        "title": "市场机会",
                        "content": "680亿美元时尚电商市场，年增长率15.2%，个性化需求强烈",
                        "details": [
                            "市场规模：680亿美元全球时尚电商市场",
                            "增长趋势：年复合增长率15.2%",
                            "用户痛点：选择困难症、搭配不当、购买后悔"
                        ]
                    },
                    {
                        "title": "产品方案",
                        "content": "计算机视觉识别 + 机器学习推荐 + AR虚拟试穿 + 社交分享",
                        "details": [
                            "AI识别：自动识别服装类别、颜色、风格",
                            "智能推荐：基于天气、场合、个人喜好推荐",
                            "AR试穿：虚拟试穿，降低购买风险",
                            "社交功能：分享搭配，获取反馈"
                        ]
                    },
                    {
                        "title": "商业模式",
                        "content": "订阅费用 + 电商分成 + 品牌广告 + 高级功能付费",
                        "details": [
                            "订阅模式：月费$9.99，年费$99",
                            "电商分成：合作品牌销售分成5-15%",
                            "品牌广告：精准投放广告收入",
                            "增值服务：个人造型师咨询等"
                        ]
                    },
                    {
                        "title": "竞争优势",
                        "content": "技术领先 + 本土化 + 多元变现 + 社交创新",
                        "details": [
                            "技术优势：先进的计算机视觉算法",
                            "用户体验：本土化的时尚理解",
                            "商业模式：多元化收入来源",
                            "产品创新：社交化穿搭分享"
                        ]
                    },
                    {
                        "title": "财务预测",
                        "content": "3年达到800万美元年收入，净利润250万美元",
                        "details": [
                            "第一年：50万美元收入，亏损30万美元",
                            "第二年：250万美元收入，盈利50万美元",
                            "第三年：800万美元收入，盈利250万美元"
                        ]
                    },
                    {
                        "title": "团队与融资",
                        "content": "寻求150万美元种子轮融资，组建15人核心团队",
                        "details": [
                            "融资需求：种子轮150万美元，A轮500万美元",
                            "团队规划：技术团队8人，运营团队4人，管理团队3人",
                            "里程碑：6个月MVP，12个月正式上线，18个月盈利"
                        ]
                    }
                ]
            }
            self.send_json_response(business_plan)
            return
        
        # Default response
        self.send_json_response({"message": "Read2Rich API", "version": "1.0.0"})
    
    def send_json_response(self, data):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 8001), RequestHandler)
    print("Read2Rich minimal server running on http://0.0.0.0:8001")
    print("Health check: http://localhost:8001/health")
    print("Opportunities: http://localhost:8001/api/v1/opportunities")
    server.serve_forever()
