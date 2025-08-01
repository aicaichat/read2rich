from pydantic import BaseModel, EmailStr
from typing import List, Dict, Optional
from datetime import datetime

class InstructorBase(BaseModel):
    name: str
    email: EmailStr
    avatar: Optional[str] = None
    bio: Optional[str] = None
    title: Optional[str] = None
    expertise: List[str] = []
    experience: int = 0
    status: str = "pending"  # active, inactive, pending
    social_links: Dict[str, str] = {}

class InstructorCreate(InstructorBase):
    pass

class InstructorUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None
    title: Optional[str] = None
    expertise: Optional[List[str]] = None
    experience: Optional[int] = None
    status: Optional[str] = None
    social_links: Optional[Dict[str, str]] = None

class Instructor(InstructorBase):
    id: int
    courses: int = 0
    students: int = 0
    rating: float = 0.0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class InstructorList(BaseModel):
    instructors: List[Instructor]
    total: int
    page: int
    size: int 