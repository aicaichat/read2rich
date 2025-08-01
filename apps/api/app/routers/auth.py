from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..core.auth import get_current_active_user
from ..schemas.user import User

router = APIRouter()
security = HTTPBearer()

@router.get("/me", response_model=User)
async def get_current_user(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.post("/login")
async def login():
    return {"message": "Login endpoint"}

@router.post("/register")
async def register():
    return {"message": "Register endpoint"} 