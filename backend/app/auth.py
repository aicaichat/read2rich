"""
认证和授权管理
JWT token生成、验证、密码加密等
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db, User, get_user_by_email
import os

# 密码加密上下文
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT设置
SECRET_KEY = os.getenv("SECRET_KEY", "deepneed-secret-key-2025")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# 安全认证
security = HTTPBearer()

class AuthManager:
    """认证管理器"""
    
    def __init__(self, secret_key: str = SECRET_KEY):
        self.secret_key = secret_key
        self.algorithm = ALGORITHM
    
    def hash_password(self, password: str) -> str:
        """加密密码"""
        return pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """验证密码"""
        return pwd_context.verify(plain_password, hashed_password)
    
    def create_access_token(self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """创建访问令牌"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire, "type": "access"})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def create_refresh_token(self, data: Dict[str, Any]) -> str:
        """创建刷新令牌"""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire, "type": "refresh"})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def verify_token(self, token: str) -> Dict[str, Any]:
        """验证令牌"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="令牌已过期",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="无效的令牌",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    def authenticate_user(self, db: Session, email: str, password: str) -> Optional[User]:
        """验证用户身份"""
        user = get_user_by_email(db, email)
        if not user:
            return None
        if not self.verify_password(password, user.hashed_password):
            return None
        return user

# 全局认证管理器实例
auth_manager = AuthManager()

# 依赖注入函数
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """获取当前用户"""
    
    # 验证令牌
    payload = auth_manager.verify_token(credentials.credentials)
    
    # 检查令牌类型
    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的令牌类型",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 获取用户ID
    user_id: int = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的令牌",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 查询用户
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户不存在",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 检查用户状态
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户已被禁用",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """获取当前活跃用户"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="用户已被禁用")
    return current_user

# 权限检查装饰器
def require_permissions(*permissions):
    """要求特定权限的装饰器"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # 这里可以实现基于角色的权限检查
            # 暂时返回原函数
            return await func(*args, **kwargs)
        return wrapper
    return decorator

# 管理员权限检查
async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """要求管理员权限"""
    # 简单的管理员检查，可以根据需要扩展
    if current_user.email != "admin@deepneed.ai":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="需要管理员权限"
        )
    return current_user

# 用户数据传输对象
class TokenResponse:
    """令牌响应"""
    def __init__(self, access_token: str, refresh_token: str, token_type: str = "bearer"):
        self.access_token = access_token
        self.refresh_token = refresh_token
        self.token_type = token_type

class UserResponse:
    """用户响应"""
    def __init__(self, user: User):
        self.id = user.id
        self.email = user.email
        self.username = user.username
        self.full_name = user.full_name
        self.is_active = user.is_active
        self.is_verified = user.is_verified
        self.created_at = user.created_at 