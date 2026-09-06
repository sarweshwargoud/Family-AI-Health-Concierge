from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from backend.services.auth_service import get_current_user, AuthenticatedUser
from backend.ai.orchestrator import ai_orchestrator

router = APIRouter(prefix="/ai", tags=["AI Conversational Concierge"])

class ChatRequest(BaseModel):
    query: str
    activeMemberId: str
    familyMembers: List[Dict[str, Any]]
    conversationHistory: Optional[List[Dict[str, Any]]] = None

class ChatResponse(BaseModel):
    reply: str
    clinicalCards: Optional[List[Dict[str, Any]]] = None
    targetMemberId: Optional[str] = None
    status: str = "success"

@router.post("/chat", response_model=ChatResponse)
async def chat_with_concierge(
    request: ChatRequest,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    result = await ai_orchestrator.process_chat(
        query=request.query,
        user_id=current_user.id,
        active_member_id=request.activeMemberId,
        family_members=request.familyMembers,
        conversation_history=request.conversationHistory
    )

    return ChatResponse(
        reply=result["reply"],
        clinicalCards=result.get("clinicalCards"),
        targetMemberId=result.get("targetMemberId"),
        status="success"
    )
