import re
from typing import List, Dict, Any

class DocumentChunker:
    """
    Splits clinical documents, laboratory panels, and health records
    into semantically meaningful chunks with metadata.
    """
    def __init__(self, chunk_size: int = 400, overlap: int = 50):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk_text(self, text: str, metadata: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        if not text or not text.strip():
            return []

        metadata = metadata or {}
        # Clean text
        cleaned = re.sub(r'\s+', ' ', text).strip()
        words = cleaned.split(' ')

        if len(words) <= self.chunk_size:
            return [{
                "text": cleaned,
                "chunk_index": 0,
                "metadata": metadata
            }]

        chunks = []
        start = 0
        chunk_idx = 0

        while start < len(words):
            end = min(start + self.chunk_size, len(words))
            chunk_text = " ".join(words[start:end])
            
            chunks.append({
                "text": chunk_text,
                "chunk_index": chunk_idx,
                "metadata": {
                    **metadata,
                    "word_count": len(words[start:end])
                }
            })
            chunk_idx += 1
            if end >= len(words):
                break
            start += (self.chunk_size - self.overlap)

        return chunks

chunker = DocumentChunker()
