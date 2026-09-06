from typing import Dict, Any, List, Optional
from backend.ai.rag.vector_store import vector_store
from backend.ai.rag.chunking import chunker
from backend.ai.document_processing.ocr import document_ocr
from backend.ai.document_processing.extraction import data_extractor
from backend.ai.agents.concierge_agent import concierge_agent
from backend.ai.agents.emergency_agent import emergency_agent
from backend.ai.agents.timeline_agent import timeline_agent

class HealthAIOrchestrator:
    """
    Main entry point for all AI capabilities in the Family Health Concierge.
    Orchestrates RAG retrieval, agent selection, OCR parsing, and emergency synthesis.
    """
    async def process_chat(
        self,
        query: str,
        user_id: str,
        active_member_id: str,
        family_members: List[Dict[str, Any]],
        conversation_history: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        # 1. Resolve target family member from query mention or active default
        target_member = self._resolve_member(query, active_member_id, family_members)
        target_member_id = target_member.get("id", active_member_id)

        # 2. Perform RAG semantic retrieval from vector database
        retrieved_contexts = await vector_store.search(
            query=query,
            user_id=user_id,
            member_id=target_member_id,
            top_k=4
        )

        # 3. Execute Concierge Agent with grounded context
        response = await concierge_agent.respond(
            query=query,
            target_member=target_member,
            retrieved_contexts=retrieved_contexts,
            family_members=family_members,
            conversation_history=conversation_history
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

    def _resolve_member(
        self,
        query: str,
        active_member_id: str,
        family_members: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        if not family_members:
            return {"id": active_member_id, "name": "Family Member", "relation": "Self"}

        q_low = query.lower()

        # Check for direct name or relation match
        for member in family_members:
            m_name = member.get("name", "").lower()
            m_rel = member.get("relation", "").lower()

            if m_name and m_name in q_low:
                return member
            if "father" in m_rel or "dad" in m_rel:
                if "dad" in q_low or "father" in q_low or "eshwaraiah" in q_low:
                    return member
            if "mother" in m_rel or "mom" in m_rel:
                if "mom" in q_low or "mother" in q_low or "suvarna" in q_low:
                    return member
            if "sister" in m_rel:
                if "sister" in q_low or "gayathri" in q_low or "bhuvaneshwari" in q_low:
                    return member
            if "son" in m_rel or "self" in m_rel:
                if "sarweshwar" in q_low or "myself" in q_low or "me" in q_low.split():
                    return member

        # Default to active member
        for member in family_members:
            if member.get("id") == active_member_id:
                return member

        return family_members[0]

ai_orchestrator = HealthAIOrchestrator()
