from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime
import json

app = FastAPI(
    title="Read2Rich API",
    description="AI-powered business opportunity discovery platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data
MOCK_OPPORTUNITIES = [
    {
        "id": 1,
        "title": "AI-Powered Personal Finance Assistant",
        "description": "A mobile app that uses AI to analyze spending patterns and provide personalized financial advice. With the growing interest in personal finance management, this could capture a significant market share.",
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
        "description": "An online marketplace connecting businesses with sustainable packaging suppliers. As environmental consciousness grows, this addresses a real need in the market.",
        "category": "ecommerce",
        "market_size": 25000000,
        "difficulty_level": 2,
        "investment_required": 75000,
        "time_to_market": "4-6 months",
        "source_url": "https://example.com/opportunity/2",
        "created_at": "2024-01-14T14:20:00Z"
    },
    {
        "id": 3,
        "title": "Remote Team Collaboration Platform",
        "description": "A specialized platform for remote teams with features like virtual workspaces, async communication, and productivity tracking. The remote work trend continues to grow.",
        "category": "saas",
        "market_size": 80000000,
        "difficulty_level": 4,
        "investment_required": 300000,
        "time_to_market": "12-18 months",
        "source_url": "https://example.com/opportunity/3",
        "created_at": "2024-01-13T09:15:00Z"
    },
    {
        "id": 4,
        "title": "Local Service Booking App",
        "description": "A mobile app for booking local services like cleaning, repairs, and maintenance. Focus on small towns and suburban areas underserved by existing platforms.",
        "category": "marketplace",
        "market_size": 35000000,
        "difficulty_level": 2,
        "investment_required": 100000,
        "time_to_market": "6-9 months",
        "source_url": "https://example.com/opportunity/4",
        "created_at": "2024-01-12T16:45:00Z"
    },
    {
        "id": 5,
        "title": "AI-Driven Health Monitoring Wearable",
        "description": "A wearable device that uses advanced AI to predict health issues before they become serious. Targets the growing health-conscious consumer market.",
        "category": "healthtech",
        "market_size": 120000000,
        "difficulty_level": 5,
        "investment_required": 500000,
        "time_to_market": "18-24 months",
        "source_url": "https://example.com/opportunity/5",
        "created_at": "2024-01-11T11:30:00Z"
    },
    {
        "id": 6,
        "title": "Micro-Learning Platform for Professionals",
        "description": "A platform delivering bite-sized learning content for busy professionals. Content is tailored to specific industries and job roles.",
        "category": "edtech",
        "market_size": 45000000,
        "difficulty_level": 3,
        "investment_required": 200000,
        "time_to_market": "8-12 months",
        "source_url": "https://example.com/opportunity/6",
        "created_at": "2024-01-10T13:20:00Z"
    }
]

CATEGORIES = [
    {"key": "all", "label": "All Categories"},
    {"key": "saas", "label": "SaaS"},
    {"key": "ecommerce", "label": "E-commerce"},
    {"key": "fintech", "label": "FinTech"},
    {"key": "healthtech", "label": "HealthTech"},
    {"key": "edtech", "label": "EdTech"},
    {"key": "marketplace", "label": "Marketplace"},
    {"key": "ai", "label": "AI/ML"},
    {"key": "blockchain", "label": "Blockchain"},
    {"key": "iot", "label": "IoT"},
    {"key": "mobile", "label": "Mobile App"}
]

@app.get("/")
async def root():
    return {"message": "Welcome to Read2Rich API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "read2rich-backend"}

@app.get("/api/v1/opportunities")
async def get_opportunities(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    category: Optional[str] = Query(None),
    language: str = Query("en", pattern="^(en|ko|ja)$")
):
    """Get list of business opportunities"""
    opportunities = MOCK_OPPORTUNITIES.copy()
    
    # Filter by category
    if category and category != "all":
        opportunities = [opp for opp in opportunities if opp["category"] == category]
    
    # Apply pagination
    opportunities = opportunities[skip:skip + limit]
    
    return opportunities

@app.get("/api/v1/opportunities/categories")
async def get_categories():
    """Get list of available categories"""
    return {"categories": CATEGORIES}

@app.get("/api/v1/opportunities/{opportunity_id}")
async def get_opportunity(opportunity_id: int):
    """Get specific opportunity by ID"""
    opportunity = next((opp for opp in MOCK_OPPORTUNITIES if opp["id"] == opportunity_id), None)
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    return opportunity

@app.post("/api/v1/auth/register")
async def register(user_data: dict):
    """Mock user registration"""
    return {
        "id": 1,
        "email": user_data.get("email"),
        "username": user_data.get("username"),
        "full_name": user_data.get("full_name"),
        "is_active": True,
        "is_superuser": False,
        "created_at": datetime.utcnow().isoformat()
    }

@app.post("/api/v1/auth/login")
async def login(user_data: dict):
    """Mock user login"""
    return {
        "access_token": "mock_jwt_token_12345",
        "token_type": "bearer"
    }

@app.get("/api/v1/auth/me")
async def get_current_user():
    """Mock current user info"""
    return {
        "id": 1,
        "email": "user@read2rich.com",
        "username": "testuser",
        "full_name": "Test User",
        "is_active": True,
        "is_superuser": False,
        "created_at": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)
