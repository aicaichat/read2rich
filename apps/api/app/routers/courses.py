from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..db.database import get_db
from ..db.models import Course, Instructor
from ..schemas.course import CourseCreate, CourseUpdate, Course as CourseSchema, CourseList

router = APIRouter(prefix="/courses", tags=["courses"])

@router.get("/", response_model=CourseList)
def get_courses(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[str] = None,
    category: Optional[str] = None,
    level: Optional[str] = None,
    instructor_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """获取课程列表"""
    query = db.query(Course)
    
    if status:
        query = query.filter(Course.status == status)
    
    if category:
        query = query.filter(Course.category == category)
    
    if level:
        query = query.filter(Course.level == level)
    
    if instructor_id:
        query = query.filter(Course.instructor_id == instructor_id)
    
    total = query.count()
    courses = query.offset(skip).limit(limit).all()
    
    return CourseList(
        courses=courses,
        total=total,
        page=skip // limit + 1,
        size=limit
    )

@router.get("/{course_id}", response_model=CourseSchema)
def get_course(course_id: int, db: Session = Depends(get_db)):
    """根据ID获取课程"""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="课程不存在")
    return course

@router.post("/", response_model=CourseSchema)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    """创建新课程"""
    # 检查讲师是否存在
    instructor = db.query(Instructor).filter(Instructor.id == course.instructor_id).first()
    if not instructor:
        raise HTTPException(status_code=400, detail="讲师不存在")
    
    # 计算折扣
    discount = course.original_price - course.price if course.original_price > course.price else 0.0
    
    db_course = Course(
        **course.dict(),
        discount=discount
    )
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    
    # 更新讲师的课程数量
    instructor.courses = len(instructor.courses_rel)
    db.commit()
    
    return db_course

@router.put("/{course_id}", response_model=CourseSchema)
def update_course(
    course_id: int, 
    course_update: CourseUpdate, 
    db: Session = Depends(get_db)
):
    """更新课程信息"""
    db_course = db.query(Course).filter(Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="课程不存在")
    
    # 如果更新讲师ID，检查讲师是否存在
    if course_update.instructor_id and course_update.instructor_id != db_course.instructor_id:
        instructor = db.query(Instructor).filter(Instructor.id == course_update.instructor_id).first()
        if not instructor:
            raise HTTPException(status_code=400, detail="讲师不存在")
    
    # 更新字段
    update_data = course_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_course, field, value)
    
    # 重新计算折扣
    if 'price' in update_data or 'original_price' in update_data:
        db_course.discount = db_course.original_price - db_course.price if db_course.original_price > db_course.price else 0.0
    
    db_course.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_course)
    
    # 更新相关讲师的课程数量
    if 'instructor_id' in update_data:
        # 更新原讲师的课程数量
        old_instructor = db.query(Instructor).filter(Instructor.id == db_course.instructor_id).first()
        if old_instructor:
            old_instructor.courses = len(old_instructor.courses_rel)
        
        # 更新新讲师的课程数量
        new_instructor = db.query(Instructor).filter(Instructor.id == course_update.instructor_id).first()
        if new_instructor:
            new_instructor.courses = len(new_instructor.courses_rel)
        
        db.commit()
    
    return db_course

@router.delete("/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    """删除课程"""
    db_course = db.query(Course).filter(Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="课程不存在")
    
    instructor_id = db_course.instructor_id
    db.delete(db_course)
    db.commit()
    
    # 更新讲师的课程数量
    instructor = db.query(Instructor).filter(Instructor.id == instructor_id).first()
    if instructor:
        instructor.courses = len(instructor.courses_rel)
        db.commit()
    
    return {"message": "课程删除成功"}

@router.get("/stats/summary")
def get_course_stats(db: Session = Depends(get_db)):
    """获取课程统计信息"""
    total = db.query(Course).count()
    published = db.query(Course).filter(Course.status == "published").count()
    draft = db.query(Course).filter(Course.status == "draft").count()
    archived = db.query(Course).filter(Course.status == "archived").count()
    
    # 计算总学生数和平均评分
    total_students = db.query(Course).with_entities(
        db.func.sum(Course.students)
    ).scalar() or 0
    
    avg_rating = db.query(Course).with_entities(
        db.func.avg(Course.rating)
    ).scalar() or 0.0
    
    # 计算总收入
    total_revenue = db.query(Course).with_entities(
        db.func.sum(Course.price * Course.students)
    ).scalar() or 0.0
    
    return {
        "total": total,
        "published": published,
        "draft": draft,
        "archived": archived,
        "total_students": total_students,
        "avg_rating": round(float(avg_rating), 1),
        "total_revenue": round(float(total_revenue), 2)
    }

@router.get("/categories/list")
def get_categories(db: Session = Depends(get_db)):
    """获取所有课程分类"""
    categories = db.query(Course.category).distinct().filter(
        Course.category.isnot(None)
    ).all()
    
    return {"categories": [cat[0] for cat in categories if cat[0]]}

@router.get("/{course_id}/with-instructor")
def get_course_with_instructor(course_id: int, db: Session = Depends(get_db)):
    """获取课程及其讲师信息"""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="课程不存在")
    
    instructor = db.query(Instructor).filter(Instructor.id == course.instructor_id).first()
    
    return {
        **course.__dict__,
        "instructor": {
            "id": instructor.id,
            "name": instructor.name,
            "email": instructor.email,
            "avatar": instructor.avatar,
            "bio": instructor.bio,
            "title": instructor.title
        } if instructor else None
    } 