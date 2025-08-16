from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class OpportunityBase(BaseModel):
    title_en: Optional[str] = None
    title_ko: Optional[str] = None
    title_ja: Optional[str] = None
    description_en: Optional[str] = None
    description_ko: Optional[str] = None
    description_ja: Optional[str] = None
    category: str
    market_size: Optional[float] = None
    difficulty_level: int
    investment_required: Optional[float] = None
    time_to_market: Optional[str] = None
    source_url: Optional[str] = None
    source_language: Optional[str] = "en"

class OpportunityCreate(OpportunityBase):
    pass

class OpportunityResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    market_size: Optional[float]
    difficulty_level: int
    investment_required: Optional[float]
    time_to_market: Optional[str]
    source_url: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True