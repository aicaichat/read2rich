from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CourseModule(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    duration: Optional[str] = None
    video_url: Optional[str] = None

class CourseBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    instructor_id: int
    price: float = 0.0
    original_price: float = 0.0
    level: str = "beginner"  # beginner, intermediate, advanced
    category: Optional[str] = None
    status: str = "draft"  # draft, published, archived
    is_hot: bool = False
    is_new: bool = False
    is_free: bool = False
    tags: List[str] = []
    image: Optional[str] = None
    video_url: Optional[str] = None
    modules: List[dict] = []  # 存储为JSON

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    instructor_id: Optional[int] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    level: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    is_hot: Optional[bool] = None
    is_new: Optional[bool] = None
    is_free: Optional[bool] = None
    tags: Optional[List[str]] = None
    image: Optional[str] = None
    video_url: Optional[str] = None
    modules: Optional[List[dict]] = None

class Course(CourseBase):
    id: int
    discount: float = 0.0
    rating: float = 0.0
    students: int = 0
    duration: str = "0小时"
    lessons: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CourseWithInstructor(Course):
    instructor: dict  # 包含讲师信息

class CourseList(BaseModel):
    courses: List[Course]
    total: int
    page: int
    size: int 