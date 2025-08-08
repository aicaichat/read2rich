"""OpenAI embedding provider."""

import asyncio
from typing import List
import openai
from asyncio_throttle import Throttler
from loguru import logger

from config import Settings


class OpenAIEmbedder:
    """OpenAI embedding provider with rate limiting and error handling."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.client = None
        self.throttler = None
        
    async def initialize(self):
        """Initialize OpenAI client and rate limiter."""
        if not self.settings.openai_api_key:
            raise ValueError("OpenAI API key is required")
        
        self.client = openai.AsyncOpenAI(
            api_key=self.settings.openai_api_key,
            timeout=self.settings.openai_timeout
        )
        
        # Create rate limiter
        rate_per_second = self.settings.requests_per_minute / 60
        self.throttler = Throttler(rate_limit=rate_per_second)
        
        logger.info(f"OpenAI embedder initialized with model: {self.settings.openai_model}")
    
    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings using OpenAI API.
        
        Args:
            texts: List of text strings to embed
            
        Returns:
            List of embedding vectors
        """
        if not texts:
            return []
        
        embeddings = []
        
        # Process in batches to respect rate limits
        batch_size = self.settings.openai_batch_size
        
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            batch_embeddings = await self._generate_batch_embeddings(batch)
            embeddings.extend(batch_embeddings)
        
        return embeddings
    
    async def _generate_batch_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a batch of texts."""
        retries = 0
        
        while retries <= self.settings.openai_max_retries:
            try:
                # Apply rate limiting
                async with self.throttler:
                    response = await self.client.embeddings.create(
                        model=self.settings.openai_model,
                        input=texts
                    )
                
                # Extract embeddings
                embeddings = [item.embedding for item in response.data]
                return embeddings
                
            except openai.RateLimitError as e:
                retries += 1
                wait_time = min(60, 2 ** retries)  # Exponential backoff, max 60s
                logger.warning(f"Rate limit hit, waiting {wait_time}s (retry {retries}/{self.settings.openai_max_retries})")
                await asyncio.sleep(wait_time)
                
            except openai.APIError as e:
                retries += 1
                if retries > self.settings.openai_max_retries:
                    logger.error(f"OpenAI API error after {retries} retries: {e}")
                    raise
                wait_time = 2 ** retries
                logger.warning(f"OpenAI API error, retrying in {wait_time}s: {e}")
                await asyncio.sleep(wait_time)
                
            except Exception as e:
                logger.error(f"Unexpected error in OpenAI embedder: {e}")
                raise
        
        raise Exception(f"Failed to generate embeddings after {self.settings.openai_max_retries} retries")
    
    def get_embedding_dimension(self) -> int:
        """Get embedding dimension for the current model."""
        model_dimensions = {
            "text-embedding-3-small": 1536,
            "text-embedding-3-large": 3072,
            "text-embedding-ada-002": 1536
        }
        return model_dimensions.get(self.settings.openai_model, 1536)
    
    async def cleanup(self):
        """Clean up resources."""
        if self.client:
            await self.client.close()
        logger.info("OpenAI embedder cleaned up")