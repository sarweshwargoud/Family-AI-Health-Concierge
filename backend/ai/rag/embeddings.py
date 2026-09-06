import numpy as np
from typing import List, Optional
from google import genai
from backend.config import settings
from backend.ai.gemini.client import gemini_client

class EmbeddingService:
    """
    Generates high-dimensional semantic vector embeddings
    using Google's text-embedding-004 model.
    """
    def __init__(self):
        self.dimension = 768

    async def get_embedding(self, text: str) -> List[float]:
        if not text or not text.strip():
            return [0.0] * self.dimension

        if gemini_client.is_configured():
            try:
                response = gemini_client.client.models.embed_content(
                    model=settings.GEMINI_EMBEDDING_MODEL,
                    contents=text
                )
                if response.embedding and response.embedding.values:
                    return response.embedding.values
            except Exception as e:
                print(f"[EmbeddingService] Remote embedding error: {e}")

        # Deterministic lightweight pseudo-embedding fallback when API key is unconfigured
        return self._generate_fallback_embedding(text)

    def _generate_fallback_embedding(self, text: str) -> List[float]:
        # Hash-based normalized vector
        vec = np.zeros(self.dimension, dtype=np.float32)
        words = text.lower().split()
        for i, w in enumerate(words):
            val = hash(w) % 10000 / 10000.0
            vec[i % self.dimension] += val
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec.tolist()

embedding_service = EmbeddingService()
