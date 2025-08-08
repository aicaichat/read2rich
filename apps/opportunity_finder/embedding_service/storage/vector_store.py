"""Vector store abstraction supporting Qdrant and pgvector."""

from typing import List, Dict, Any, Optional
from loguru import logger

from config import Settings
from .qdrant_store import QdrantStore
from .pgvector_store import PgVectorStore


class VectorStore:
    """Vector store abstraction with multiple backend support."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.store = None
        
    async def initialize(self):
        """Initialize the vector store backend."""
        if self.settings.vector_store_type == "qdrant":
            self.store = QdrantStore(self.settings)
        elif self.settings.vector_store_type == "pgvector":
            self.store = PgVectorStore(self.settings)
        else:
            raise ValueError(f"Unsupported vector store type: {self.settings.vector_store_type}")
        
        await self.store.initialize()
        logger.info(f"Vector store initialized: {self.settings.vector_store_type}")
    
    async def store_embedding(
        self,
        vector_id: str,
        embedding: List[float],
        payload: Dict[str, Any]
    ) -> bool:
        """Store an embedding with metadata.
        
        Args:
            vector_id: Unique identifier for the vector
            embedding: Vector embedding
            payload: Metadata to store with the vector
            
        Returns:
            True if successful, False otherwise
        """
        try:
            return await self.store.store_embedding(vector_id, embedding, payload)
        except Exception as e:
            logger.error(f"Error storing embedding {vector_id}: {e}")
            return False
    
    async def search_similar(
        self,
        query_embedding: List[float],
        limit: int = 10,
        score_threshold: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        """Search for similar vectors.
        
        Args:
            query_embedding: Query vector
            limit: Maximum number of results
            score_threshold: Minimum similarity score
            
        Returns:
            List of similar vectors with metadata and scores
        """
        try:
            return await self.store.search_similar(query_embedding, limit, score_threshold)
        except Exception as e:
            logger.error(f"Error searching similar vectors: {e}")
            return []
    
    async def get_embedding(self, vector_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific embedding by ID.
        
        Args:
            vector_id: Vector identifier
            
        Returns:
            Vector data with metadata or None if not found
        """
        try:
            return await self.store.get_embedding(vector_id)
        except Exception as e:
            logger.error(f"Error getting embedding {vector_id}: {e}")
            return None
    
    async def delete_embedding(self, vector_id: str) -> bool:
        """Delete an embedding.
        
        Args:
            vector_id: Vector identifier
            
        Returns:
            True if successful, False otherwise
        """
        try:
            return await self.store.delete_embedding(vector_id)
        except Exception as e:
            logger.error(f"Error deleting embedding {vector_id}: {e}")
            return False
    
    async def get_collection_info(self) -> Dict[str, Any]:
        """Get information about the vector collection.
        
        Returns:
            Collection statistics and info
        """
        try:
            return await self.store.get_collection_info()
        except Exception as e:
            logger.error(f"Error getting collection info: {e}")
            return {}
    
    async def close(self):
        """Close the vector store connection."""
        if self.store:
            await self.store.close()
            logger.info("Vector store connection closed")