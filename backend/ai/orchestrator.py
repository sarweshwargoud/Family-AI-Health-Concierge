from typing import Dict, Any, List, Optional
from backend.ai.rag.vector_store import vector_store
from backend.ai.rag.chunking import chunker
from backend.ai.document_processing.ocr import document_ocr
from backend.ai.document_processing.extraction import data_extractor
from backend.ai.agents.concierge_agent import concierge_agent
from backend.ai.agents.emergency_agent import emergency_agent
from backend.ai.agents.timeline_agent import timeline_agent
from backend.ai.language.detector import detect_language
from backend.ai.language.query_normalizer import normalize_query_to_english

# ---------------------------------------------------------------------------
# Multilingual member reference keywords
# ---------------------------------------------------------------------------
_FATHER_KEYWORDS = {
    # English
    "father", "dad", "papa", "daddy", "naan",
    # Telugu / Tenglish
    "నాన్న", "నాన్నగారు", "నాన", "nanna", "naana",
    # Hindi / Hinglish
    "पिताजी", "पापा", "पिता", "bapu", "pitaji", "pita",
    # Tamil
    "அப்பா", "appa",
    # Kannada
    "ಅಪ್ಪ", "appa",
    # Malayalam
    "അപ്പൻ", "achan",
    # Bengali
    "বাবা", "baba",
    # Gujarati
    "પિતાજી",
    # Marathi
    "बाबा", "बाबांना",
    # Punjabi / Urdu
    "ابا", "والد", "walid",
}

_MOTHER_KEYWORDS = {
    # English
    "mother", "mom", "mum", "mommy", "mama",
    # Telugu / Tenglish
    "అమ్మ", "అమ్మగారు", "amma",
    # Hindi / Hinglish
    "माँ", "माम", "माता", "maa", "mummy", "mummi",
    # Tamil
    "அம்மா",
    # Kannada
    "ಅಮ್ಮ",
    # Malayalam
    "അമ്മ",
    # Bengali
    "মা", "মাতা",
    # Gujarati
    "માતા",
    # Marathi
    "आई",
    # Punjabi / Urdu
    "امی", "والدہ", "walida",
}

_SISTER_KEYWORDS = {
    # English
    "sister", "sis", "didi",
    # Telugu / Tenglish
    "అక్క", "చెల్లి", "akka", "chelli",
    # Hindi / Hinglish
    "बहन", "दीदी", "behen", "behan",
    # Tamil
    "அக்கா", "தங்கை", "akka", "thangai",
    # Kannada
    "ಅಕ್ಕ", "ತಂಗಿ",
    # Malayalam
    "ചേച്ചി", "അനുജത്തി",
    # Bengali
    "দিদি", "বোন",
    # Gujarati
    "બહેન",
    # Marathi
    "बहीण", "ताई",
}

_SELF_KEYWORDS = {
    "me", "myself", "i", "sarweshwar", "sarwesh",
    "నేను", "నాకు",
    "मैं", "मुझे", "मुझको",
}


class HealthAIOrchestrator:
    """
    Main entry point for all AI capabilities in the Family Health Concierge.
    Orchestrates multilingual detection, RAG retrieval, agent selection,
    OCR parsing, and emergency synthesis.
    """

    async def process_chat(
        self,
        query: str,
        user_id: str,
        active_member_id: str,
        family_members: List[Dict[str, Any]],
        conversation_history: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:

        # 1. Detect user query language
        lang_code, lang_name = detect_language(query)
        print(f"[Orchestrator] Detected language: {lang_name} ({lang_code})")

        # 2. Translate query to English for RAG embedding (cross-lingual bridge)
        english_query = await normalize_query_to_english(query, lang_code)
        if english_query != query:
            print(f"[Orchestrator] RAG query normalised → '{english_query}'")

        # 3. Resolve target family member from multilingual query
        target_member = self._resolve_member(query, active_member_id, family_members)
        target_member_id = target_member.get("id", active_member_id)

        # 4. Perform RAG semantic retrieval using the English-normalised query
        retrieved_contexts = await vector_store.search(
            query=english_query,
            user_id=user_id,
            member_id=target_member_id,
            top_k=4
        )

        # 5. Execute Concierge Agent with grounded context + language info
        response = await concierge_agent.respond(
            query=query,
            target_member=target_member,
            retrieved_contexts=retrieved_contexts,
            family_members=family_members,
            conversation_history=conversation_history,
            lang_code=lang_code,
            lang_name=lang_name,
        )

        return response

    async def process_document(
        self,
        file_bytes: bytes,
        filename: str,
        content_type: str,
        user_id: str,
        member_id: str
    ) -> Dict[str, Any]:
        # 1. Optical Character Recognition (OCR) / Multimodal Vision Extraction
        raw_text = await document_ocr.extract_text(file_bytes, filename, content_type)

        # 2. Extract structured clinical entities (JSON)
        extracted = await data_extractor.extract_structured_data(raw_text, filename)

        # 3. Chunk text & store embeddings in vector database for RAG retrieval
        chunks = chunker.chunk_text(raw_text, metadata={
            "filename": filename,
            "title": extracted.get("title", ""),
            "category": extracted.get("category", "")
        })

        for chunk in chunks:
            await vector_store.add_document(
                doc_id=f"doc_{filename}",
                user_id=user_id,
                member_id=member_id,
                text=chunk["text"],
                metadata=chunk["metadata"]
            )

        # 4. Generate synthesized timeline event
        timeline_event = timeline_agent.synthesize_event_from_report(extracted, member_id)

        file_size_mb = f"{len(file_bytes) / (1024 * 1024):.1f} MB"
        file_type = "PDF" if filename.lower().endswith(".pdf") else "Image"

        return {
            "title": extracted.get("title", "Clinical Report"),
            "category": extracted.get("category", "Other"),
            "hospital": extracted.get("hospital", "Medical Center"),
            "doctor": extracted.get("doctor", "Physician"),
            "date": extracted.get("date", ""),
            "summary": extracted.get("summary", ""),
            "extractedData": extracted.get("extractedData", {}),
            "fileSize": file_size_mb,
            "fileType": file_type,
            "rawText": raw_text[:500],
            "timelineEvent": timeline_event
        }

    async def generate_emergency_card(
        self,
        member: Dict[str, Any],
        recent_reports: List[Dict[str, Any]],
        timeline_events: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        return await emergency_agent.generate_summary(member, recent_reports, timeline_events)

    # -----------------------------------------------------------------------
    # Multilingual member resolution
    # -----------------------------------------------------------------------
    def _resolve_member(
        self,
        query: str,
        active_member_id: str,
        family_members: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        if not family_members:
            return {"id": active_member_id, "name": "Family Member", "relation": "Self"}

        q_lower = query.lower()
        # Preserve original for Unicode keyword matching
        q_orig = query

        # Check direct name match first (most specific)
        for member in family_members:
            m_name = member.get("name", "").lower()
            if m_name and m_name in q_lower:
                return member

        # Check multilingual relation keywords
        def _query_contains(keywords: set) -> bool:
            """Return True if any keyword appears in the query (case-insensitive)."""
            for kw in keywords:
                if kw in q_orig or kw in q_lower:
                    return True
            return False

        father_match = _query_contains(_FATHER_KEYWORDS) or "eshwaraiah" in q_lower
        mother_match = _query_contains(_MOTHER_KEYWORDS) or "suvarna" in q_lower
        sister_match = _query_contains(_SISTER_KEYWORDS) or "gayathri" in q_lower or "bhuvaneshwari" in q_lower
        self_match   = _query_contains(_SELF_KEYWORDS)

        for member in family_members:
            rel = member.get("relation", "").lower()
            if father_match and ("father" in rel or "dad" in rel):
                return member
            if mother_match and ("mother" in rel or "mom" in rel):
                return member
            if sister_match and "sister" in rel:
                return member
            if self_match and ("son" in rel or "self" in rel):
                return member

        # Default to active member
        for member in family_members:
            if member.get("id") == active_member_id:
                return member

        return family_members[0]


ai_orchestrator = HealthAIOrchestrator()
