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
        vector = await embedding_service.get_embedding(text)
        self._store.append({
            "doc_id": doc_id,
            "user_id": user_id,
            "member_id": member_id,
            "text": text,
            "vector": np.array(vector, dtype=np.float32),
            "metadata": metadata or {}
        })

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
