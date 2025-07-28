#!/usr/bin/env python3
"""
简化的测试服务器，用于验证前端登录功能
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import jwt
import hashlib

app = FastAPI(title="DeepNeed Test API")

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 模拟数据
USERS_DB = {
    "admin": {
        "id": 1,
        "username": "admin",
        "email": "admin@deepneed.com",
        "full_name": "Administrator",
        "password_hash": "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9",  # "admin123"
        "is_active": True,
        "created_at": "2024-01-01T00:00:00Z"
    }
}

# JWT 配置
JWT_SECRET = "test-secret-key"
JWT_ALGORITHM = "HS256"

class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    is_active: bool
    created_at: str

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

@app.get("/")
async def root():
    return {"message": "DeepNeed Test API is running"}

@app.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

@app.post("/auth/login", response_model=Token)
async def login(request: LoginRequest):
    user = USERS_DB.get(request.username)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    password_hash = hash_password(request.password)
    if password_hash != user["password_hash"]:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=User)
async def get_current_user():
    # 简化版本，直接返回管理员用户
    user = USERS_DB["admin"]
    return User(
        id=user["id"],
        username=user["username"],
        email=user["email"],
        full_name=user["full_name"],
        is_active=user["is_active"],
        created_at=user["created_at"]
    )

@app.post("/auth/register", response_model=User)
async def register():
    raise HTTPException(status_code=501, detail="Registration not implemented in test server")

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting DeepNeed Test API Server...")
    print("📝 Test credentials: username=admin, password=admin123")
    print("🌐 Frontend: http://localhost:5174")
    print("🔗 API Docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False) 