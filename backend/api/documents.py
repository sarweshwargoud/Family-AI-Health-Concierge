from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from pydantic import BaseModel
from backend.services.auth_service import get_current_user, AuthenticatedUser
from backend.ai.orchestrator import ai_orchestrator

router = APIRouter(prefix="/documents", tags=["Document Processing & OCR"])

@router.post("/process")
async def process_medical_document(
    file: UploadFile = File(...),
    memberId: str = Form(...),
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    try:
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        result = await ai_orchestrator.process_document(
            file_bytes=file_bytes,
            filename=file.filename or "uploaded_document.pdf",
            content_type=file.content_type or "application/pdf",
            user_id=current_user.id,
            member_id=memberId
        )

        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        print(f"[DocumentAPI] Error processing document: {e}")
        raise HTTPException(status_code=500, detail=str(e))
