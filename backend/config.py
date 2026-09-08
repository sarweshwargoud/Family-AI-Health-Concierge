import os
from pathlib import Path
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Always load .env from the backend/ directory, regardless of CWD
_backend_dir = Path(__file__).parent
load_dotenv(dotenv_path=_backend_dir / ".env")


class Settings(BaseSettings):
    PROJECT_NAME: str = "Family Health Concierge AI - Python AI/ML Service"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Gemini API Key (Backend secret)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://losngojpoqiunigkqumq.supabase.co")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "sb_publishable_fm2uzzPc-n_JvNC17Kj3-A_nfIefowX")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")
    
    # CORS Origins
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:3000"
    ]
    
    # Models
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    GEMINI_EMBEDDING_MODEL: str = os.getenv("GEMINI_EMBEDDING_MODEL", "text-embedding-004")

    class Config:
        env_file = str(Path(__file__).resolve().parent / ".env")
        extra = "ignore"

settings = Settings()
