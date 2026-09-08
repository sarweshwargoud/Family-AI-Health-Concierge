import numpy as np
from typing import List, Dict, Any, Optional
from backend.ai.rag.embeddings import embedding_service

class InMemoryVectorStore:
    """
    In-memory vector store partition scoped by user_id and family member_id.
    Calculates cosine similarity across document embeddings.
    """
    def __init__(self):
        self._store: List[Dict[str, Any]] = []

    async def add_document(
        self,
        doc_id: str,
        user_id: str,
        member_id: str,
        text: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        if not text or not text.strip():
            return

        # Deduplicate if doc_id and member_id already exist
        for item in self._store:
            if item.get("doc_id") == doc_id and item.get("member_id") == member_id:
                return

        vector = await embedding_service.get_embedding(text)
        self._store.append({
            "doc_id": doc_id,
            "user_id": user_id,
            "member_id": member_id,
            "text": text,
            "vector": np.array(vector, dtype=np.float32),
            "metadata": metadata or {}
        })

    async def index_reports(
        self,
        reports: List[Dict[str, Any]],
        user_id: str
    ) -> None:
        """Batch index medical reports into vector store for grounded RAG search."""
        for report in reports:
            rep_id = str(report.get("id") or report.get("title") or "")
            member_id = str(report.get("memberId") or report.get("member_id") or "")
            if not rep_id or not member_id:
                continue

            doc_id = f"rep_{rep_id}"
            # Check if already indexed
            if any(item.get("doc_id") == doc_id for item in self._store):
                continue

            title = report.get("title", "Clinical Report")
            category = report.get("category", "")
            date = report.get("date", "")
            hospital = report.get("hospital", "")
            doctor = report.get("doctor", "")
            summary = report.get("summary", "")
            
            ext = report.get("extractedData") or report.get("extracted_data") or {}
            ext_text = ""
            if isinstance(ext, dict):
                diseases = ext.get("diseases", [])
                meds = ext.get("medications", [])
                values = ext.get("values", {})
                if diseases:
                    ext_text += f"Diagnosed Conditions: {', '.join(diseases)}\n"
                if meds:
                    ext_text += f"Medications: {', '.join(meds)}\n"
                if values and isinstance(values, dict):
                    ext_text += "Lab Biomarkers & Test Values:\n"
                    for k, v in values.items():
                        ext_text += f"- {k}: {v}\n"

            doc_text = (
                f"Medical Report: {title}\n"
                f"Category: {category} | Date: {date}\n"
                f"Hospital: {hospital} | Doctor: {doctor}\n"
                f"Clinical Summary: {summary}\n"
                f"{ext_text}"
            ).strip()

            await self.add_document(
                doc_id=doc_id,
                user_id=user_id,
                member_id=member_id,
                text=doc_text,
                metadata={
                    "title": title,
                    "category": category,
                    "date": date,
                    "hospital": hospital,
                    "doctor": doctor,
                    "source": "clinical_record"
                }
            )

    async def search(
        self,
        query: str,
        user_id: str,
        member_id: Optional[str] = None,
        top_k: int = 4
    ) -> List[Dict[str, Any]]:
        if not self._store:
            return []

        query_vector = np.array(await embedding_service.get_embedding(query), dtype=np.float32)
        q_norm = np.linalg.norm(query_vector)
        if q_norm == 0:
            return []

        scored_docs = []
        for item in self._store:
            # Check user scoping (or guest demo mode)
            if item["user_id"] != user_id and item["user_id"] != "guest_demo_user" and user_id != "guest_demo_user":
                continue
            if member_id and item["member_id"] != member_id:
                continue

            doc_vector = item["vector"]
            d_norm = np.linalg.norm(doc_vector)
            if d_norm == 0:
                continue

            # Cosine similarity
            similarity = float(np.dot(query_vector, doc_vector) / (q_norm * d_norm))
            scored_docs.append({
                "doc_id": item["doc_id"],
                "member_id": item["member_id"],
                "text": item["text"],
                "score": similarity,
                "metadata": item["metadata"]
            })

        scored_docs.sort(key=lambda x: x["score"], reverse=True)
        return scored_docs[:top_k]

    def clear_for_user(self, user_id: str) -> None:
        self._store = [item for item in self._store if item["user_id"] != user_id]

vector_store = InMemoryVectorStore()
