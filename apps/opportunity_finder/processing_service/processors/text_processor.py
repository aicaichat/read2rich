"""Text processing utilities for cleaning and normalization."""

import re
from typing import List
from langdetect import detect, DetectorFactory
from textblob import TextBlob
from loguru import logger

from config import Settings

# Set seed for consistent language detection
DetectorFactory.seed = 0


class TextProcessor:
    """Handles text cleaning, normalization, and language detection."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.supported_languages = set(settings.supported_languages)
        
    def clean_text(self, text: str) -> str:
        """Clean and normalize text content.
        
        Args:
            text: Raw text to clean
            
        Returns:
            Cleaned text
        """
        if not text:
            return ""
        
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', ' ', text)
        
        # Remove URLs
        text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', ' ', text)
        
        # Remove email addresses
        text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', ' ', text)
        
        # Remove special characters but keep basic punctuation
        text = re.sub(r'[^\w\s.,!?;:()\-\'\"]', ' ', text)
        
        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove excessive punctuation
        text = re.sub(r'[.]{3,}', '...', text)
        text = re.sub(r'[!]{2,}', '!', text)
        text = re.sub(r'[?]{2,}', '?', text)
        
        # Trim and check length
        text = text.strip()
        
        # Truncate if too long
        if len(text) > self.settings.max_text_length:
            text = text[:self.settings.max_text_length]
            # Try to cut at sentence boundary
            last_period = text.rfind('.')
            if last_period > len(text) * 0.8:  # If period is in last 20%
                text = text[:last_period + 1]
        
        return text
    
    def is_supported_language(self, text: str) -> bool:
        """Detect if text is in a supported language.
        
        Args:
            text: Text to check
            
        Returns:
            True if language is supported
        """
        if not text or len(text) < self.settings.min_text_length:
            return False
        
        try:
            detected_lang = detect(text)
            return detected_lang in self.supported_languages
        except Exception as e:
            logger.debug(f"Language detection failed: {e}")
            # Default to English assumption for short texts
            return True
    
    def extract_sentences(self, text: str) -> List[str]:
        """Extract sentences from text.
        
        Args:
            text: Input text
            
        Returns:
            List of sentences
        """
        try:
            blob = TextBlob(text)
            return [str(sentence).strip() for sentence in blob.sentences]
        except Exception as e:
            logger.debug(f"Sentence extraction failed: {e}")
            # Fallback to simple sentence splitting
            sentences = re.split(r'[.!?]+', text)
            return [s.strip() for s in sentences if s.strip()]
    
    def get_text_stats(self, text: str) -> dict:
        """Get basic statistics about the text.
        
        Args:
            text: Input text
            
        Returns:
            Dictionary with text statistics
        """
        words = text.split()
        sentences = self.extract_sentences(text)
        
        return {
            'char_count': len(text),
            'word_count': len(words),
            'sentence_count': len(sentences),
            'avg_words_per_sentence': len(words) / max(len(sentences), 1),
            'unique_words': len(set(word.lower() for word in words))
        }