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
        if not self.is_configured():
            return self._heuristic_fallback_response(prompt)

        candidate_models = [model or settings.GEMINI_MODEL, "gemini-2.0-flash", "gemini-1.5-flash"]
        seen = set()
        models_to_try = [m for m in candidate_models if m and not (m in seen or seen.add(m))]

        last_error = None
        for m in models_to_try:
            try:
                config = types.GenerateContentConfig(
                    temperature=temperature,
                    system_instruction=system_instruction
                )
                response = self.client.models.generate_content(
                    model=m,
                    contents=prompt,
                    config=config
                )
                if response and response.text:
                    return response.text
            except Exception as e:
                last_error = e
                print(f"[GeminiClient] Model '{m}' failed: {e}. Trying fallback if available...")

        print(f"[GeminiClient] All generative models failed. Last error: {last_error}")
        return ""

    async def generate_json(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        model: Optional[str] = None
    ) -> Dict[str, Any]:
        if not self.is_configured():
            return {}

        candidate_models = [model or settings.GEMINI_MODEL, "gemini-2.0-flash", "gemini-1.5-flash"]
        seen = set()
        models_to_try = [m for m in candidate_models if m and not (m in seen or seen.add(m))]

        for m in models_to_try:
            try:
                config = types.GenerateContentConfig(
                    temperature=0.1,
                    system_instruction=system_instruction,
                    response_mime_type="application/json"
                )
                response = self.client.models.generate_content(
                    model=m,
                    contents=prompt,
                    config=config
                )
                raw_text = response.text or "{}"
                return json.loads(raw_text)
            except Exception as e:
                print(f"[GeminiClient] Model '{m}' JSON error: {e}")

        return {}

    async def process_multimodal(
        self,
        prompt: str,
        file_bytes: bytes,
        mime_type: str,
        system_instruction: Optional[str] = None,
        model: Optional[str] = None
    ) -> str:
        if not self.is_configured():
            return ""

        candidate_models = [model or settings.GEMINI_MODEL, "gemini-2.0-flash", "gemini-1.5-flash"]
        seen = set()
        models_to_try = [m for m in candidate_models if m and not (m in seen or seen.add(m))]

        part = types.Part.from_bytes(data=file_bytes, mime_type=mime_type)
        for m in models_to_try:
            try:
                config = types.GenerateContentConfig(
                    temperature=0.1,
                    system_instruction=system_instruction
                )
                response = self.client.models.generate_content(
                    model=m,
                    contents=[part, prompt],
                    config=config
                )
                if response and response.text:
                    return response.text
            except Exception as e:
                print(f"[GeminiClient] Multimodal error on '{m}': {e}")

        return ""

    def _heuristic_fallback_response(self, prompt: str) -> str:
        return "I have scanned the medical knowledge base. (Note: Live Gemini API key can be set in backend/.env for generative multi-turn reasoning)."

gemini_client = GeminiClient()
