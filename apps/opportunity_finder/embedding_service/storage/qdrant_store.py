"""Qdrant vector store implementation."""

from typing import List, Dict, Any, Optional
import uuid
from qdrant_client import AsyncQdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter
from loguru import logger

from config import Settings


class QdrantStore:
    """Qdrant vector store implementation."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.client = None
        
    async def initialize(self):
        """Initialize Qdrant client and create collection if needed."""
        self.client = AsyncQdrantClient(url=self.settings.qdrant_url)
        
        # Check if collection exists, create if not
        try:
            collections = await self.client.get_collections()
            collection_names = [col.name for col in collections.collections]
            
            if self.settings.qdrant_collection_name not in collection_names:
                await self.client.create_collection(
                    collection_name=self.settings.qdrant_collection_name,
                    vectors_config=VectorParams(
                        size=self.settings.qdrant_vector_size,
                        distance=Distance.COSINE
                    )
                )
                logger.info(f"Created Qdrant collection: {self.settings.qdrant_collection_name}")
            else:
                logger.info(f"Using existing Qdrant collection: {self.settings.qdrant_collection_name}")
                
        except Exception as e:
            logger.error(f"Error initializing Qdrant: {e}")
            raise
    
    async def store_embedding(
        self,
        vector_id: str,
        embedding: List[float],
        payload: Dict[str, Any]
    ) -> bool:
        """Store an embedding in Qdrant.
        
        Args:
            vector_id: Unique identifier for the vector
            embedding: Vector embedding
            payload: Metadata to store with the vector
            
        Returns:
            True if successful, False otherwise
        """
        try:
            point = PointStruct(
                id=vector_id,
                vector=embedding,
                payload=payload
            )
            
            await self.client.upsert(
                collection_name=self.settings.qdrant_collection_name,
                points=[point]
            )
            
            return True
            
        except Exception as e:
            logger.error(f"Error storing embedding in Qdrant: {e}")
            return False
    
    async def search_similar(
        self,
        query_embedding: List[float],
        limit: int = 10,
        score_threshold: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        """Search for similar vectors in Qdrant.
        
        Args:
            query_embedding: Query vector
            limit: Maximum number of results
            score_threshold: Minimum similarity score
            
        Returns:
            List of similar vectors with metadata and scores
        """
        try:
            search_result = await self.client.search(
                collection_name=self.settings.qdrant_collection_name,
                query_vector=query_embedding,
                limit=limit,
                score_threshold=score_threshold
            )
            
            results = []
            for hit in search_result:
                result = {
                    'id': hit.id,
                    'score': hit.score,
                    'payload': hit.payload
                }
                results.append(result)
            
            return results
            
        except Exception as e:
            logger.error(f"Error searching similar vectors in Qdrant: {e}")
            return []
    
    async def get_embedding(self, vector_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific embedding by ID.
        
        Args:
            vector_id: Vector identifier
            
        Returns:
            Vector data with metadata or None if not found
        """
        try:
            result = await self.client.retrieve(
                collection_name=self.settings.qdrant_collection_name,
                ids=[vector_id],
                with_payload=True,
                with_vectors=True
            )
            
            if result:
                point = result[0]
                return {
                    'id': point.id,
                    'vector': point.vector,
                    'payload': point.payload
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Error getting embedding from Qdrant: {e}")
            return None
    
    async def delete_embedding(self, vector_id: str) -> bool:
        """Delete an embedding from Qdrant.
        
        Args:
            vector_id: Vector identifier
            
        Returns:
            True if successful, False otherwise
        """
        try:
            await self.client.delete(
                collection_name=self.settings.qdrant_collection_name,
                points_selector=[vector_id]
            )
            return True
            
        except Exception as e:
            logger.error(f"Error deleting embedding from Qdrant: {e}")
            return False
    
    async def get_collection_info(self) -> Dict[str, Any]:
        """Get information about the Qdrant collection.
        
        Returns:
            Collection statistics and info
        """
        try:
            info = await self.client.get_collection(self.settings.qdrant_collection_name)
            return {
                'name': info.name,
                'vectors_count': info.vectors_count,
                'points_count': info.points_count,
                'status': info.status,
                'optimizer_status': info.optimizer_status
            }
            
        except Exception as e:
            logger.error(f"Error getting Qdrant collection info: {e}")
            return {}
    
    async def close(self):
        """Close the Qdrant client connection."""
        if self.client:
            await self.client.close()
            self.client = None