from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.models import Opportunity
from app.schemas.opportunity import OpportunityResponse, OpportunityCreate

router = APIRouter()

@router.get("/", response_model=List[OpportunityResponse])
async def get_opportunities(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    category: Optional[str] = Query(None),
    language: str = Query("en", regex="^(en|ko|ja)$"),
    db: Session = Depends(get_db)
):
    """Get list of business opportunities"""
    query = db.query(Opportunity)
    
    if category:
        query = query.filter(Opportunity.category == category)
    
    opportunities = query.offset(skip).limit(limit).all()
    
    # Transform based on language preference
    result = []
    for opp in opportunities:
        title_field = f"title_{language}"
        desc_field = f"description_{language}"
        
        result.append({
            "id": opp.id,
            "title": getattr(opp, title_field) or opp.title_en,
            "description": getattr(opp, desc_field) or opp.description_en,
            "category": opp.category,
            "market_size": opp.market_size,
            "difficulty_level": opp.difficulty_level,
            "investment_required": opp.investment_required,
            "time_to_market": opp.time_to_market,
            "source_url": opp.source_url,
            "created_at": opp.created_at
        })
    
    return result

@router.get("/categories")
async def get_categories():
    """Get list of available categories"""
    return {
        "categories": [
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
    }

@router.post("/", response_model=OpportunityResponse)
async def create_opportunity(opportunity: OpportunityCreate, db: Session = Depends(get_db)):
    """Create a new business opportunity"""
    db_opportunity = Opportunity(**opportunity.dict())
    db.add(db_opportunity)
    db.commit()
    db.refresh(db_opportunity)
    
    return db_opportunity

@router.get("/{opportunity_id}", response_model=OpportunityResponse)
async def get_opportunity(opportunity_id: int, db: Session = Depends(get_db)):
    """Get specific opportunity by ID"""
    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    return opportunity