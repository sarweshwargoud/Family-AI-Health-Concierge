"""
Query Normalizer — Cross-Lingual RAG Bridge
============================================
Translates a non-English user query to English so the vector embedding
and cosine-similarity search works accurately against English medical documents.

The original query is PRESERVED for the final answer generation step.
Only the translated English version is used for RAG retrieval.

Uses Gemini with a focused, low-latency single-shot prompt.
Falls back to the original query if translation fails or API is unavailable.
"""

from backend.ai.gemini.client import gemini_client


_TRANSLATION_SYSTEM = (
    "You are a precise medical query translator. "
    "Your only task is to translate the given text to English. "
    "Output ONLY the English translation. "
    "Do not add explanations, notes, or extra text."
)


async def normalize_query_to_english(query: str, lang_code: str) -> str:
    """
    Translate a non-English query to English for RAG embedding.

    Args:
        query:     The original user query in any language.
        lang_code: The detected language code (e.g. "te", "hi", "hi-en").

    Returns:
        English translation of the query, or the original query if already
        in English or if translation fails.
    """
    # English and Tenglish/Hinglish already have enough Latin content for retrieval
    if lang_code in ("en", "te-en", "hi-en"):
        return query

    if not gemini_client.is_configured():
        return query  # Fallback: use original, embedding is still multilingual

    try:
        prompt = f"Translate to English:\n\n{query}"
        translated = await gemini_client.generate_text(
            prompt,
            system_instruction=_TRANSLATION_SYSTEM
        )
        # Strip quotes/whitespace that Gemini occasionally adds
        translated = translated.strip().strip('"').strip("'").strip()
        if translated:
            return translated
    except Exception as e:
        print(f"[QueryNormalizer] Translation failed: {e}")

    return query  # Graceful fallback
