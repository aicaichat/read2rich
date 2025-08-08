from fastapi import APIRouter, HTTPException, Depends, status, Form, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from datetime import timedelta

from ..core.auth import get_current_active_user, create_access_token, get_password_hash, verify_password
from ..core.config import settings
from ..schemas.user import User, UserCreate, Token
from ..db.database import get_db
from ..db.models import User as UserModel
from ..services.oauth_service import oauth_service

router = APIRouter()
security = HTTPBearer()

@router.get("/me", response_model=User)
async def get_current_user(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.post("/register", response_model=User)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """用户注册"""
    # 检查用户名是否已存在
    existing_user = db.query(UserModel).filter(UserModel.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户名已存在"
        )
    
    # 检查邮箱是否已存在
    existing_email = db.query(UserModel).filter(UserModel.email == user_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="邮箱已被注册"
        )
    
    # 创建新用户
    hashed_password = get_password_hash(user_data.password)
    db_user = UserModel(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
        is_active=True
    )
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        # 返回用户信息（不包含密码）
        return User(
            id=db_user.id,
            email=db_user.email,
            username=db_user.username,
            full_name=db_user.full_name,
            is_active=db_user.is_active,
            created_at=db_user.created_at,
            updated_at=db_user.updated_at
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="注册失败，请稍后重试"
        )

@router.post("/login", response_model=Token)
async def login(username: str, password: str, db: Session = Depends(get_db)):
    """用户登录"""
    # 查找用户
    user = db.query(UserModel).filter(UserModel.username == username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误"
        )
    
    # 验证密码
    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误"
        )
    
    # 检查用户是否激活
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="账户已被禁用"
        )
    
    # 创建访问令牌
    access_token_expires = timedelta(hours=settings.JWT_EXPIRE_HOURS)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout():
    """用户登出（客户端清除令牌）"""
    return {"message": "登出成功"}

# OAuth 路由
@router.get("/github/login")
async def github_login():
    """GitHub OAuth 登录"""
    github_auth_url = f"https://github.com/login/oauth/authorize?client_id={settings.GITHUB_CLIENT_ID}&redirect_uri={settings.GITHUB_REDIRECT_URI}&scope=user:email"
    return RedirectResponse(url=github_auth_url)

@router.get("/github/callback")
async def github_callback(code: str, request: Request, db: Session = Depends(get_db)):
    """GitHub OAuth 回调"""
    try:
        # 交换访问令牌
        access_token = await oauth_service.exchange_github_code(code)
        if not access_token:
            raise HTTPException(status_code=400, detail="Failed to get access token")
        
        # 获取用户信息
        user_info = await oauth_service.get_github_user_info(access_token)
        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to get user info")
        
        # 获取或创建用户
        user = oauth_service.get_or_create_user(db, user_info, "github")
        
        # 创建 JWT 令牌
        access_token_expires = timedelta(hours=settings.JWT_EXPIRE_HOURS)
        jwt_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        
        # 重定向到前端，携带令牌
        frontend_url = f"{settings.FRONTEND_URL}/oauth-callback?token={jwt_token}&provider=github"
        return RedirectResponse(url=frontend_url)
        
    except Exception as e:
        error_url = f"{settings.FRONTEND_URL}/login?error=oauth_failed"
        return RedirectResponse(url=error_url)

@router.get("/google/login")
async def google_login():
    """Google OAuth 登录"""
    google_auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?client_id={settings.GOOGLE_CLIENT_ID}&redirect_uri={settings.GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile"
    return RedirectResponse(url=google_auth_url)

@router.get("/google/callback")
async def google_callback(code: str, request: Request, db: Session = Depends(get_db)):
    """Google OAuth 回调"""
    try:
        # 交换访问令牌
        access_token = await oauth_service.exchange_google_code(code)
        if not access_token:
            raise HTTPException(status_code=400, detail="Failed to get access token")
        
        # 获取用户信息
        user_info = await oauth_service.get_google_user_info(access_token)
        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to get user info")
        
        # 获取或创建用户
        user = oauth_service.get_or_create_user(db, user_info, "google")
        
        # 创建 JWT 令牌
        access_token_expires = timedelta(hours=settings.JWT_EXPIRE_HOURS)
        jwt_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        
        # 重定向到前端，携带令牌
        frontend_url = f"{settings.FRONTEND_URL}/oauth-callback?token={jwt_token}&provider=google"
        return RedirectResponse(url=frontend_url)
        
    except Exception as e:
        error_url = f"{settings.FRONTEND_URL}/login?error=oauth_failed"
        return RedirectResponse(url=error_url) 