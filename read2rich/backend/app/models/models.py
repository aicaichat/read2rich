from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)  # OAuth users may not have password
    full_name = Column(String)
    avatar_url = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    
    # OAuth fields
    oauth_provider = Column(String)  # github, google
    oauth_id = Column(String)
    oauth_access_token = Column(String)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Opportunity(Base):
    __tablename__ = "opportunities"
    
    id = Column(Integer, primary_key=True, index=True)
    title_en = Column(String(500))
    title_ko = Column(String(500))
    title_ja = Column(String(500))
    description_en = Column(Text)
    description_ko = Column(Text)
    description_ja = Column(Text)
    category = Column(String(100))
    market_size = Column(Float)
    difficulty_level = Column(Integer)  # 1-5 scale
    investment_required = Column(Float)
    time_to_market = Column(String(50))
    source_url = Column(String(500))
    source_language = Column(String(10))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class UserPreference(Base):
    __tablename__ = "user_preferences"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    preferred_language = Column(String(10), default="en")
    preferred_categories = Column(JSON, default=[])
    investment_range_min = Column(Float)
    investment_range_max = Column(Float)
    risk_tolerance = Column(String(20))  # low, medium, high
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User")