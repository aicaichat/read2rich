import httpx
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from ..core.config import settings
from ..db.models import User

class OAuthService:
    def __init__(self):
        self.github_api_url = "https://api.github.com"
        self.google_api_url = "https://www.googleapis.com"
    
    async def get_github_user_info(self, access_token: str) -> Optional[Dict[str, Any]]:
        """获取 GitHub 用户信息"""
        async with httpx.AsyncClient() as client:
            headers = {
                "Authorization": f"token {access_token}",
                "Accept": "application/vnd.github.v3+json"
            }
            response = await client.get(f"{self.github_api_url}/user", headers=headers)
            
            if response.status_code == 200:
                user_data = response.json()
                return {
                    "id": str(user_data["id"]),
                    "username": user_data["login"],
                    "email": user_data.get("email"),
                    "full_name": user_data.get("name"),
                    "avatar_url": user_data.get("avatar_url")
                }
            return None
    
    async def get_google_user_info(self, access_token: str) -> Optional[Dict[str, Any]]:
        """获取 Google 用户信息"""
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {access_token}"}
            response = await client.get(
                f"{self.google_api_url}/oauth2/v2/userinfo",
                headers=headers
            )
            
            if response.status_code == 200:
                user_data = response.json()
                return {
                    "id": user_data["id"],
                    "username": user_data["email"].split("@")[0],
                    "email": user_data["email"],
                    "full_name": user_data.get("name"),
                    "avatar_url": user_data.get("picture")
                }
            return None
    
    async def exchange_github_code(self, code: str) -> Optional[str]:
        """使用授权码交换 GitHub 访问令牌"""
        async with httpx.AsyncClient() as client:
            data = {
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code
            }
            headers = {"Accept": "application/json"}
            
            response = await client.post(
                "https://github.com/login/oauth/access_token",
                data=data,
                headers=headers
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get("access_token")
            return None
    
    async def exchange_google_code(self, code: str) -> Optional[str]:
        """使用授权码交换 Google 访问令牌"""
        async with httpx.AsyncClient() as client:
            data = {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": settings.GOOGLE_REDIRECT_URI
            }
            
            response = await client.post(
                "https://oauth2.googleapis.com/token",
                data=data
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get("access_token")
            return None
    
    def get_or_create_user(self, db: Session, oauth_data: Dict[str, Any], provider: str) -> User:
        """获取或创建 OAuth 用户"""
        # 首先尝试通过 OAuth ID 查找用户
        user = db.query(User).filter(
            User.oauth_provider == provider,
            User.oauth_id == oauth_data["id"]
        ).first()
        
        if user:
            # 更新用户信息
            user.email = oauth_data["email"]
            user.full_name = oauth_data.get("full_name")
            user.avatar_url = oauth_data.get("avatar_url")
            db.commit()
            return user
        
        # 检查邮箱是否已被其他用户使用
        existing_user = db.query(User).filter(User.email == oauth_data["email"]).first()
        if existing_user:
            # 如果邮箱已存在，更新现有用户的 OAuth 信息
            existing_user.oauth_provider = provider
            existing_user.oauth_id = oauth_data["id"]
            existing_user.avatar_url = oauth_data.get("avatar_url")
            db.commit()
            return existing_user
        
        # 生成唯一的用户名
        base_username = oauth_data["username"]
        username = base_username
        counter = 1
        while db.query(User).filter(User.username == username).first():
            username = f"{base_username}{counter}"
            counter += 1
        
        # 创建新用户
        user = User(
            email=oauth_data["email"],
            username=username,
            full_name=oauth_data.get("full_name"),
            avatar_url=oauth_data.get("avatar_url"),
            oauth_provider=provider,
            oauth_id=oauth_data["id"],
            is_active=True
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

oauth_service = OAuthService()
