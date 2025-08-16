from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import engine, get_db
from app.api.v1 import auth, opportunities
from app.models.models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Read2Rich API",
    description="AI-powered business opportunity discovery platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(opportunities.router, prefix="/api/v1/opportunities", tags=["opportunities"])

@app.get("/")
async def root():
    return {"message": "Welcome to Read2Rich API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "read2rich-backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)