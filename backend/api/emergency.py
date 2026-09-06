from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from backend.services.auth_service import get_current_user, AuthenticatedUser
from backend.ai.orchestrator import ai_orchestrator

router = APIRouter(prefix="/ai", tags=["Emergency Summary Generator"])

class EmergencySummaryRequest(BaseModel):
    member: Dict[str, Any]
    recentReports: Optional[List[Dict[str, Any]]] = []
    timelineEvents: Optional[List[Dict[str, Any]]] = []

@router.post("/emergency-summary")
async def generate_emergency_summary(
    request: EmergencySummaryRequest,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    result = await ai_orchestrator.generate_emergency_card(
        member=request.member,
        recent_reports=request.recentReports or [],
        timeline_events=request.timelineEvents or []
    )

    return {
        "status": "success",
        "data": result
    }
