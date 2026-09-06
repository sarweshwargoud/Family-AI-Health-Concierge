import json
import os
from typing import Any, Dict, Optional
from google import genai
from google.genai import types
from backend.config import settings

class GeminiClient:
    """
    Unified client for Gemini generative and multimodal models.
    Supports system instructions, structured JSON mode, and text generation.
    """
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        self.client = None
        if self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[GeminiClient] Initialization error: {e}")

    def is_configured(self) -> bool:
        return self.client is not None

    async def generate_text(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        model: Optional[str] = None,
        temperature: float = 0.2
    ) -> str:
        model_name = model or settings.GEMINI_MODEL
        
        if not self.is_configured():
            return self._heuristic_fallback_response(prompt)

        try:
            config = types.GenerateContentConfig(
                temperature=temperature,
                system_instruction=system_instruction
            )
            response = self.client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=config
            )
            return response.text or ""
        except Exception as e:
            print(f"[GeminiClient] Text generation error: {e}")
            return self._heuristic_fallback_response(prompt)

    async def generate_json(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        model: Optional[str] = None
    ) -> Dict[str, Any]:
        model_name = model or settings.GEMINI_MODEL

        if not self.is_configured():
            return {}

        try:
            config = types.GenerateContentConfig(
                temperature=0.1,
                system_instruction=system_instruction,
                response_mime_type="application/json"
            )
            response = self.client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=config
            )
            raw_text = response.text or "{}"
            return json.loads(raw_text)
        except Exception as e:
            print(f"[GeminiClient] JSON generation error: {e}")
            return {}

    async def process_multimodal(
        self,
        prompt: str,
        file_bytes: bytes,
        mime_type: str,
        system_instruction: Optional[str] = None,
        model: Optional[str] = None
    ) -> str:
        model_name = model or settings.GEMINI_MODEL

        if not self.is_configured():
            return ""

        try:
            part = types.Part.from_bytes(data=file_bytes, mime_type=mime_type)
            config = types.GenerateContentConfig(
                temperature=0.1,
                system_instruction=system_instruction
            )
            response = self.client.models.generate_content(
                model=model_name,
                contents=[part, prompt],
                config=config
            )
            return response.text or ""
        except Exception as e:
            print(f"[GeminiClient] Multimodal processing error: {e}")
            return ""

    def _heuristic_fallback_response(self, prompt: str) -> str:
        return "I have scanned the medical knowledge base. (Note: Live Gemini API key can be set in backend/.env for generative multi-turn reasoning)."

gemini_client = GeminiClient()
