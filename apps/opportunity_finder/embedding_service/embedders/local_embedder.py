"""Local embedding provider using sentence-transformers."""

import asyncio
from typing import List
import torch
from sentence_transformers import SentenceTransformer
from loguru import logger

from config import Settings


class LocalEmbedder:
    """Local embedding provider using sentence-transformers."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.model = None
        self.device = None
        
    async def initialize(self):
        """Initialize local embedding model."""
        logger.info(f"Loading local embedding model: {self.settings.local_model_name}")
        
        # Determine device
        if self.settings.device == "auto":
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
        else:
            self.device = self.settings.device
        
        logger.info(f"Using device: {self.device}")
        
        # Load model in executor to avoid blocking
        loop = asyncio.get_event_loop()
        self.model = await loop.run_in_executor(
            None,
            self._load_model
        )
        
        logger.info("Local embedding model loaded successfully")
    
    def _load_model(self) -> SentenceTransformer:
        """Load the sentence transformer model."""
        model = SentenceTransformer(self.settings.local_model_name)
        model.to(self.device)
        return model
    
    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings using local model.
        
        Args:
            texts: List of text strings to embed
            
        Returns:
            List of embedding vectors
        """
        if not texts:
            return []
        
        if not self.model:
            raise RuntimeError("Local embedding model not initialized")
        
        try:
            # Run embedding generation in executor
            loop = asyncio.get_event_loop()
            embeddings = await loop.run_in_executor(
                None,
                self._generate_embeddings_sync,
                texts
            )
            
            return embeddings.tolist()
            
        except Exception as e:
            logger.error(f"Error generating local embeddings: {e}")
            raise
    
    def _generate_embeddings_sync(self, texts: List[str]):
        """Generate embeddings synchronously."""
        # Process in batches to manage memory
        batch_size = self.settings.local_batch_size
        all_embeddings = []
        
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            
            with torch.no_grad():
                batch_embeddings = self.model.encode(
                    batch,
                    convert_to_tensor=True,
                    device=self.device,
                    show_progress_bar=False
                )
                
            all_embeddings.append(batch_embeddings.cpu())
        
        # Concatenate all batches
        if all_embeddings:
            return torch.cat(all_embeddings, dim=0)
        else:
            return torch.empty(0, self.get_embedding_dimension())
    
    def get_embedding_dimension(self) -> int:
        """Get embedding dimension for the current model."""
        if self.model:
            return self.model.get_sentence_embedding_dimension()
        
        # Default dimensions for common models
        model_dimensions = {
            "all-MiniLM-L6-v2": 384,
            "all-mpnet-base-v2": 768,
            "all-MiniLM-L12-v2": 384
        }
        return model_dimensions.get(self.settings.local_model_name, 384)
    
    async def cleanup(self):
        """Clean up resources."""
        if self.model:
            # Move model to CPU to free GPU memory
            self.model.to("cpu")
            del self.model
            self.model = None
            
        # Clear CUDA cache if using GPU
        if self.device == "cuda" and torch.cuda.is_available():
            torch.cuda.empty_cache()
            
        logger.info("Local embedder cleaned up")