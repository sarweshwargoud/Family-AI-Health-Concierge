from fastapi import APIRouter
from backend.config import settings
from backend.ai.gemini.client import gemini_client

router = APIRouter(tags=["Health"])

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "gemini_configured": gemini_client.is_configured(),
        "model": settings.GEMINI_MODEL
    }
