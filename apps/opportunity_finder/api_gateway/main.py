"""FastAPI main application for AI Opportunity Finder API Gateway."""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import asyncio
from loguru import logger

from config import Settings
from database.db_manager import DatabaseManager
from services.opportunity_service import OpportunityService
from services.auth_service import AuthService
from services.payment_service import PaymentService
from routers import opportunities, auth, payments, users
from middleware.rate_limiting import RateLimitMiddleware


# Global instances
settings = Settings()
db_manager = None
opportunity_service = None
auth_service = None
payment_service = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management."""
    global db_manager, opportunity_service, auth_service, payment_service
    
    logger.info("Starting AI Opportunity Finder API Gateway")
    
    # Initialize services
    db_manager = DatabaseManager(settings)
    await db_manager.initialize()
    
    opportunity_service = OpportunityService(settings, db_manager)
    await opportunity_service.initialize()
    
    auth_service = AuthService(settings, db_manager)
    payment_service = PaymentService(settings, db_manager)
    
    logger.info("API Gateway initialized successfully")
    
    yield
    
    # Cleanup
    logger.info("Shutting down API Gateway")
    if opportunity_service:
        await opportunity_service.cleanup()
    if db_manager:
        await db_manager.close()


# Create FastAPI app
app = FastAPI(
    title="AI Opportunity Finder API",
    description="API for discovering and scoring AI business opportunities",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(','),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add rate limiting middleware
app.add_middleware(RateLimitMiddleware, redis_url=settings.redis_url)

# Security
security = HTTPBearer()

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(opportunities.router, prefix="/api/v1/opportunities", tags=["opportunities"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["payments"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "AI Opportunity Finder API",
        "version": "1.0.0",
        "status": "healthy"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    try:
        # Check database connection
        if db_manager:
            await db_manager.health_check()
        
        # Check opportunity service
        if opportunity_service:
            await opportunity_service.health_check()
        
        return {
            "status": "healthy",
            "services": {
                "database": "up",
                "opportunity_service": "up",
                "vector_store": "up"
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service unhealthy"
        )


# Dependency for getting services
def get_db_manager() -> DatabaseManager:
    """Get database manager dependency."""
    if db_manager is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service unavailable"
        )
    return db_manager


def get_opportunity_service() -> OpportunityService:
    """Get opportunity service dependency."""
    if opportunity_service is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Opportunity service unavailable"
        )
    return opportunity_service


def get_auth_service() -> AuthService:
    """Get auth service dependency."""
    if auth_service is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Auth service unavailable"
        )
    return auth_service


def get_payment_service() -> PaymentService:
    """Get payment service dependency."""
    if payment_service is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Payment service unavailable"
        )
    return payment_service


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )