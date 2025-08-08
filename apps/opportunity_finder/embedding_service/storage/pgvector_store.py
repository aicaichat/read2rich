"""PostgreSQL with pgvector extension store implementation."""

from typing import List, Dict, Any, Optional
import asyncio
import psycopg2
from psycopg2.extras import RealDictCursor
import json
from loguru import logger

from config import Settings


class PgVectorStore:
    """PostgreSQL with pgvector extension store implementation."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.connection = None
        
    async def initialize(self):
        """Initialize PostgreSQL connection and create tables if needed."""
        # Run in executor since psycopg2 is synchronous
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, self._initialize_sync)
    
    def _initialize_sync(self):
        """Initialize PostgreSQL connection synchronously."""
        try:
            self.connection = psycopg2.connect(
                self.settings.database_url,
                cursor_factory=RealDictCursor
            )
            
            # Create embeddings table if it doesn't exist
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS opportunity_embeddings (
                        id TEXT PRIMARY KEY,
                        embedding VECTOR(1536),
                        payload JSONB,
                        created_at TIMESTAMP DEFAULT NOW()
                    );
                """)
                
                # Create index for vector similarity search
                cursor.execute("""
                    CREATE INDEX IF NOT EXISTS opportunity_embeddings_embedding_idx 
                    ON opportunity_embeddings USING ivfflat (embedding vector_cosine_ops)
                    WITH (lists = 100);
                """)
                
                self.connection.commit()
                
            logger.info("PostgreSQL pgvector store initialized")
            
        except Exception as e:
            logger.error(f"Error initializing PostgreSQL pgvector store: {e}")
            raise
    
    async def store_embedding(
        self,
        vector_id: str,
        embedding: List[float],
        payload: Dict[str, Any]
    ) -> bool:
        """Store an embedding in PostgreSQL.
        
        Args:
            vector_id: Unique identifier for the vector
            embedding: Vector embedding
            payload: Metadata to store with the vector
            
        Returns:
            True if successful, False otherwise
        """
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None, 
            self._store_embedding_sync, 
            vector_id, embedding, payload
        )
    
    def _store_embedding_sync(
        self, 
        vector_id: str, 
        embedding: List[float], 
        payload: Dict[str, Any]
    ) -> bool:
        """Store embedding synchronously."""
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO opportunity_embeddings (id, embedding, payload)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET
                        embedding = EXCLUDED.embedding,
                        payload = EXCLUDED.payload,
                        created_at = NOW()
                """, (vector_id, embedding, json.dumps(payload)))
                
                self.connection.commit()
                return True
                
        except Exception as e:
            logger.error(f"Error storing embedding in PostgreSQL: {e}")
            self.connection.rollback()
            return False
    
    async def search_similar(
        self,
        query_embedding: List[float],
        limit: int = 10,
        score_threshold: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        """Search for similar vectors in PostgreSQL.
        
        Args:
            query_embedding: Query vector
            limit: Maximum number of results
            score_threshold: Minimum similarity score
            
        Returns:
            List of similar vectors with metadata and scores
        """
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None,
            self._search_similar_sync,
            query_embedding, limit, score_threshold
        )
    
    def _search_similar_sync(
        self,
        query_embedding: List[float],
        limit: int,
        score_threshold: Optional[float]
    ) -> List[Dict[str, Any]]:
        """Search for similar vectors synchronously."""
        try:
            with self.connection.cursor() as cursor:
                # Use cosine similarity for search
                query = """
                    SELECT id, payload, 1 - (embedding <=> %s) as score
                    FROM opportunity_embeddings
                    ORDER BY embedding <=> %s
                    LIMIT %s
                """
                
                cursor.execute(query, (query_embedding, query_embedding, limit))
                results = cursor.fetchall()
                
                # Filter by score threshold if provided
                if score_threshold is not None:
                    results = [r for r in results if r['score'] >= score_threshold]
                
                # Convert to list of dicts
                return [dict(result) for result in results]
                
        except Exception as e:
            logger.error(f"Error searching similar vectors in PostgreSQL: {e}")
            return []
    
    async def get_embedding(self, vector_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific embedding by ID.
        
        Args:
            vector_id: Vector identifier
            
        Returns:
            Vector data with metadata or None if not found
        """
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._get_embedding_sync, vector_id)
    
    def _get_embedding_sync(self, vector_id: str) -> Optional[Dict[str, Any]]:
        """Get embedding synchronously."""
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id, embedding, payload, created_at
                    FROM opportunity_embeddings
                    WHERE id = %s
                """, (vector_id,))
                
                result = cursor.fetchone()
                return dict(result) if result else None
                
        except Exception as e:
            logger.error(f"Error getting embedding from PostgreSQL: {e}")
            return None
    
    async def delete_embedding(self, vector_id: str) -> bool:
        """Delete an embedding from PostgreSQL.
        
        Args:
            vector_id: Vector identifier
            
        Returns:
            True if successful, False otherwise
        """
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._delete_embedding_sync, vector_id)
    
    def _delete_embedding_sync(self, vector_id: str) -> bool:
        """Delete embedding synchronously."""
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM opportunity_embeddings WHERE id = %s
                """, (vector_id,))
                
                self.connection.commit()
                return cursor.rowcount > 0
                
        except Exception as e:
            logger.error(f"Error deleting embedding from PostgreSQL: {e}")
            self.connection.rollback()
            return False
    
    async def get_collection_info(self) -> Dict[str, Any]:
        """Get information about the PostgreSQL collection.
        
        Returns:
            Collection statistics and info
        """
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._get_collection_info_sync)
    
    def _get_collection_info_sync(self) -> Dict[str, Any]:
        """Get collection info synchronously."""
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    SELECT COUNT(*) as count, 
                           MIN(created_at) as oldest,
                           MAX(created_at) as newest
                    FROM opportunity_embeddings
                """)
                
                result = cursor.fetchone()
                return dict(result) if result else {}
                
        except Exception as e:
            logger.error(f"Error getting PostgreSQL collection info: {e}")
            return {}
    
    async def close(self):
        """Close the PostgreSQL connection."""
        if self.connection:
            self.connection.close()
            self.connection = None