"""DeepSeek embedding provider."""

import asyncio
from typing import List
import openai
from asyncio_throttle import Throttler
from loguru import logger

from config import Settings


class DeepSeekEmbedder:
    """DeepSeek embedding provider with rate limiting and error handling."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.client = None
        self.throttler = None
        
    async def initialize(self):
        """Initialize DeepSeek client and rate limiter."""
        if not self.settings.deepseek_api_key:
            raise ValueError("DeepSeek API key is required")
        
        # DeepSeek uses OpenAI-compatible API
        self.client = openai.AsyncOpenAI(
            api_key=self.settings.deepseek_api_key,
            base_url="https://api.deepseek.com/v1",  # DeepSeek API base URL
            timeout=self.settings.deepseek_timeout or 30
        )
        
        # Create rate limiter (DeepSeek may have different limits)
        rate_per_second = (self.settings.deepseek_requests_per_minute or 60) / 60
        self.throttler = Throttler(rate_limit=rate_per_second)
        
        logger.info(f"DeepSeek embedder initialized with model: {self.settings.deepseek_model}")
    
    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings using DeepSeek API.
        
        Args:
            texts: List of text strings to embed
            
        Returns:
            List of embedding vectors
        """
        if not texts:
            return []
        
        embeddings = []
        
        # Process in batches to respect rate limits
        batch_size = self.settings.deepseek_batch_size or 20
        
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            batch_embeddings = await self._generate_batch_embeddings(batch)
            embeddings.extend(batch_embeddings)
        
        return embeddings
    
    async def _generate_batch_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a batch of texts."""
        retries = 0
        max_retries = self.settings.deepseek_max_retries or 3
        
        while retries <= max_retries:
            try:
                # Apply rate limiting
                async with self.throttler:
                    response = await self.client.embeddings.create(
                        model=self.settings.deepseek_model,
                        input=texts
                    )
                
                # Extract embeddings
                embeddings = [item.embedding for item in response.data]
                return embeddings
                
            except openai.RateLimitError as e:
                retries += 1
                wait_time = min(60, 2 ** retries)  # Exponential backoff, max 60s
                logger.warning(f"DeepSeek rate limit hit, waiting {wait_time}s (retry {retries}/{max_retries})")
                await asyncio.sleep(wait_time)
                
            except openai.APIError as e:
                retries += 1
                if retries > max_retries:
                    logger.error(f"DeepSeek API error after {retries} retries: {e}")
                    raise
                wait_time = 2 ** retries
                logger.warning(f"DeepSeek API error, retrying in {wait_time}s: {e}")
                await asyncio.sleep(wait_time)
                
            except Exception as e:
                logger.error(f"Unexpected error in DeepSeek embedder: {e}")
                raise
        
        raise Exception(f"Failed to generate embeddings after {max_retries} retries")
    
    def get_embedding_dimension(self) -> int:
        """Get embedding dimension for the current model."""
        # DeepSeek embedding dimensions (adjust based on actual models)
        model_dimensions = {
            "deepseek-embedder": 1536,  # Default dimension
            "text-embedding-3-small": 1536,
            "text-embedding-ada-002": 1536
        }
        return model_dimensions.get(self.settings.deepseek_model, 1536)
    
    async def cleanup(self):
        """Clean up resources."""
        if self.client:
            await self.client.close()
        logger.info("DeepSeek embedder cleaned up")