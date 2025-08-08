"""Embedding manager that coordinates different embedding providers."""

import asyncio
from typing import List, Union
from loguru import logger

from config import Settings
from .openai_embedder import OpenAIEmbedder
from .deepseek_embedder import DeepSeekEmbedder
from .local_embedder import LocalEmbedder


class EmbeddingManager:
    """Manages embedding generation with fallback strategies."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.primary_embedder = None
        self.fallback_embedder = None
        
    async def initialize(self):
        """Initialize embedding providers."""
        logger.info(f"Initializing embedding manager with provider: {self.settings.embedding_provider}")
        
        if self.settings.embedding_provider == "openai":
            self.primary_embedder = OpenAIEmbedder(self.settings)
            self.fallback_embedder = LocalEmbedder(self.settings)
        elif self.settings.embedding_provider == "deepseek":
            self.primary_embedder = DeepSeekEmbedder(self.settings)
            self.fallback_embedder = LocalEmbedder(self.settings)
        else:  # local
            self.primary_embedder = LocalEmbedder(self.settings)
            # Try DeepSeek first, then OpenAI as fallback
            if self.settings.deepseek_api_key:
                self.fallback_embedder = DeepSeekEmbedder(self.settings)
            elif self.settings.openai_api_key:
                self.fallback_embedder = OpenAIEmbedder(self.settings)
        
        # Initialize embedders
        await self.primary_embedder.initialize()
        if self.fallback_embedder:
            try:
                await self.fallback_embedder.initialize()
            except Exception as e:
                logger.warning(f"Fallback embedder initialization failed: {e}")
                self.fallback_embedder = None
    
    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts.
        
        Args:
            texts: List of text strings to embed
            
        Returns:
            List of embedding vectors
        """
        if not texts:
            return []
        
        try:
            # Try primary embedder first
            embeddings = await self.primary_embedder.generate_embeddings(texts)
            logger.debug(f"Generated {len(embeddings)} embeddings using primary embedder")
            return embeddings
            
        except Exception as e:
            logger.error(f"Primary embedder failed: {e}")
            
            # Try fallback embedder
            if self.fallback_embedder:
                try:
                    logger.info("Attempting fallback embedder")
                    embeddings = await self.fallback_embedder.generate_embeddings(texts)
                    logger.warning(f"Generated {len(embeddings)} embeddings using fallback embedder")
                    return embeddings
                except Exception as fe:
                    logger.error(f"Fallback embedder also failed: {fe}")
            
            # If both fail, raise the original error
            raise e
    
    async def generate_single_embedding(self, text: str) -> List[float]:
        """Generate embedding for a single text.
        
        Args:
            text: Text string to embed
            
        Returns:
            Embedding vector
        """
        embeddings = await self.generate_embeddings([text])
        return embeddings[0] if embeddings else []
    
    async def cleanup(self):
        """Clean up resources."""
        if self.primary_embedder:
            await self.primary_embedder.cleanup()
        if self.fallback_embedder:
            await self.fallback_embedder.cleanup()
    
    def get_embedding_dimension(self) -> int:
        """Get the dimension of embeddings from the primary embedder."""
        if self.primary_embedder:
            return self.primary_embedder.get_embedding_dimension()
        return 1536  # Default OpenAI dimension