import httpx
from typing import Optional
from fastapi import Header, HTTPException, status
from pydantic import BaseModel
from backend.config import settings

class AuthenticatedUser(BaseModel):
    id: str
    email: Optional[str] = None
    role: str = "authenticated"
    is_guest: bool = False

async def get_current_user(authorization: Optional[str] = Header(None)) -> AuthenticatedUser:
    """
    Validates Supabase Bearer token if present.
    If no authorization header is passed, provides a guest demo user context.
    """
    if not authorization or not authorization.startswith("Bearer "):
        return AuthenticatedUser(
            id="guest_demo_user",
            email="guest@healthconcierge.local",
            role="guest",
            is_guest=True
        )

    token = authorization.replace("Bearer ", "").strip()
    
    if token == "guest_demo_token" or token == "demo":
        return AuthenticatedUser(
            id="guest_demo_user",
            email="guest@healthconcierge.local",
            role="guest",
            is_guest=True
        )

    # Verify token against Supabase Auth API
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{settings.SUPABASE_URL}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {token}",
                    "apikey": settings.SUPABASE_ANON_KEY
                },
                timeout=5.0
            )
            
            if response.status_code == 200:
                data = response.json()
                return AuthenticatedUser(
                    id=data.get("id", "unknown_user"),
                    email=data.get("email"),
                    role=data.get("role", "authenticated"),
                    is_guest=False
                )
            else:
                # If expired or invalid, fallback gracefully for guest interaction
                return AuthenticatedUser(
                    id="guest_demo_user",
                    email="guest@healthconcierge.local",
                    role="guest",
                    is_guest=True
                )
    except Exception as err:
        print(f"[AuthService] Token verification warning: {err}")
        return AuthenticatedUser(
            id="guest_demo_user",
            email="guest@healthconcierge.local",
            role="guest",
            is_guest=True
        )
