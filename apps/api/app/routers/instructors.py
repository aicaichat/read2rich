from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..db.database import get_db
from ..db.models import Instructor
from ..schemas.instructor import InstructorCreate, InstructorUpdate, Instructor as InstructorSchema, InstructorList

router = APIRouter(prefix="/instructors", tags=["instructors"])

@router.get("/", response_model=InstructorList)
def get_instructors(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[str] = None,
    expertise: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取讲师列表"""
    query = db.query(Instructor)
    
    if status:
        query = query.filter(Instructor.status == status)
    
    if expertise:
        # 在JSON字段中搜索专业领域
        query = query.filter(Instructor.expertise.contains([expertise]))
    
    total = query.count()
    instructors = query.offset(skip).limit(limit).all()
    
    return InstructorList(
        instructors=instructors,
        total=total,
        page=skip // limit + 1,
        size=limit
    )

@router.get("/{instructor_id}", response_model=InstructorSchema)
def get_instructor(instructor_id: int, db: Session = Depends(get_db)):
    """根据ID获取讲师"""
    instructor = db.query(Instructor).filter(Instructor.id == instructor_id).first()
    if not instructor:
        raise HTTPException(status_code=404, detail="讲师不存在")
    return instructor

@router.post("/", response_model=InstructorSchema)
def create_instructor(instructor: InstructorCreate, db: Session = Depends(get_db)):
    """创建新讲师"""
    # 检查邮箱是否已存在
    existing = db.query(Instructor).filter(Instructor.email == instructor.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="邮箱已存在")
    
    db_instructor = Instructor(**instructor.dict())
    db.add(db_instructor)
    db.commit()
    db.refresh(db_instructor)
    return db_instructor

@router.put("/{instructor_id}", response_model=InstructorSchema)
def update_instructor(
    instructor_id: int, 
    instructor_update: InstructorUpdate, 
    db: Session = Depends(get_db)
):
    """更新讲师信息"""
    db_instructor = db.query(Instructor).filter(Instructor.id == instructor_id).first()
    if not db_instructor:
        raise HTTPException(status_code=404, detail="讲师不存在")
    
    # 如果更新邮箱，检查是否与其他讲师冲突
    if instructor_update.email and instructor_update.email != db_instructor.email:
        existing = db.query(Instructor).filter(
            Instructor.email == instructor_update.email,
            Instructor.id != instructor_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="邮箱已存在")
    
    # 更新字段
    update_data = instructor_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_instructor, field, value)
    
    db_instructor.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_instructor)
    return db_instructor

@router.delete("/{instructor_id}")
def delete_instructor(instructor_id: int, db: Session = Depends(get_db)):
    """删除讲师"""
    db_instructor = db.query(Instructor).filter(Instructor.id == instructor_id).first()
    if not db_instructor:
        raise HTTPException(status_code=404, detail="讲师不存在")
    
    # 检查是否有相关课程
    if db_instructor.courses_rel:
        raise HTTPException(status_code=400, detail="该讲师有关联课程，无法删除")
    
    db.delete(db_instructor)
    db.commit()
    return {"message": "讲师删除成功"}

@router.get("/stats/summary")
def get_instructor_stats(db: Session = Depends(get_db)):
    """获取讲师统计信息"""
    total = db.query(Instructor).count()
    active = db.query(Instructor).filter(Instructor.status == "active").count()
    inactive = db.query(Instructor).filter(Instructor.status == "inactive").count()
    pending = db.query(Instructor).filter(Instructor.status == "pending").count()
    
    # 计算总学生数和平均评分
    total_students = db.query(Instructor).with_entities(
        db.func.sum(Instructor.students)
    ).scalar() or 0
    
    avg_rating = db.query(Instructor).with_entities(
        db.func.avg(Instructor.rating)
    ).scalar() or 0.0
    
    return {
        "total": total,
        "active": active,
        "inactive": inactive,
        "pending": pending,
        "total_students": total_students,
        "avg_rating": round(float(avg_rating), 1)
    }

@router.get("/expertise/areas")
def get_expertise_areas(db: Session = Depends(get_db)):
    """获取所有专业领域"""
    instructors = db.query(Instructor).all()
    areas = set()
    for instructor in instructors:
        if instructor.expertise:
            areas.update(instructor.expertise)
    
    return {"areas": sorted(list(areas))}

@router.get("/titles/list")
def get_titles(db: Session = Depends(get_db)):
    """获取所有职称"""
    titles = db.query(Instructor.title).distinct().filter(
        Instructor.title.isnot(None)
    ).all()
    
    return {"titles": [title[0] for title in titles if title[0]]} 