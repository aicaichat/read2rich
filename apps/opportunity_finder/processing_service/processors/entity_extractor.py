"""Entity extraction and keyword identification."""

import re
from typing import List, Dict, Any
from collections import Counter
import spacy
from textblob import TextBlob
from loguru import logger

from config import Settings


class EntityExtractor:
    """Handles entity extraction and keyword identification."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        
        # Load spaCy model
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            logger.warning("spaCy model not found, entity extraction will be limited")
            self.nlp = None
        
        # Define business/tech entity patterns
        self.business_patterns = [
            r'\b(?:startup|company|business|firm|corporation|enterprise|venture)\b',
            r'\b(?:SaaS|PaaS|IaaS|B2B|B2C|API|SDK|platform)\b',
            r'\b(?:market|industry|sector|vertical|niche)\b',
            r'\b(?:revenue|profit|funding|investment|valuation)\b'
        ]
        
        # Pain point indicators
        self.pain_indicators = [
            r'\b(?:problem|issue|challenge|difficulty|struggle)\b',
            r'\b(?:frustrating|annoying|time-consuming|manual|tedious)\b',
            r'\b(?:lacking|missing|need|want|wish|hope)\b',
            r'\b(?:inefficient|slow|expensive|complicated)\b'
        ]
        
        # Opportunity indicators
        self.opportunity_indicators = [
            r'\b(?:opportunity|gap|demand|potential|untapped)\b',
            r'\b(?:solution|tool|app|service|platform|system)\b',
            r'\b(?:automate|optimize|improve|streamline|simplify)\b',
            r'\b(?:profitable|scalable|viable|marketable)\b'
        ]
    
    def extract_entities(self, text: str) -> Dict[str, List[str]]:
        """Extract named entities from text.
        
        Args:
            text: Input text
            
        Returns:
            Dictionary of entity types and their values
        """
        entities = {
            'organizations': [],
            'technologies': [],
            'business_terms': [],
            'pain_points': [],
            'opportunities': []
        }
        
        if not text:
            return entities
        
        # Use spaCy if available
        if self.nlp:
            doc = self.nlp(text)
            
            for ent in doc.ents:
                if ent.label_ in ['ORG', 'PRODUCT']:
                    entities['organizations'].append(ent.text.strip())
                elif ent.label_ in ['PERSON', 'GPE']:
                    # Include relevant person/location entities
                    if any(keyword in ent.text.lower() for keyword in ['ceo', 'founder', 'startup']):
                        entities['business_terms'].append(ent.text.strip())
        
        # Extract pattern-based entities
        entities['business_terms'].extend(self._extract_patterns(text, self.business_patterns))
        entities['pain_points'].extend(self._extract_patterns(text, self.pain_indicators))
        entities['opportunities'].extend(self._extract_patterns(text, self.opportunity_indicators))
        
        # Extract technology terms
        entities['technologies'].extend(self._extract_tech_terms(text))
        
        # Remove duplicates and clean
        for entity_type in entities:
            entities[entity_type] = list(set(entities[entity_type]))
            entities[entity_type] = [e for e in entities[entity_type] if len(e.strip()) > 2]
        
        return entities
    
    def extract_keywords(self, text: str, max_keywords: int = 20) -> List[Dict[str, Any]]:
        """Extract important keywords from text.
        
        Args:
            text: Input text
            max_keywords: Maximum number of keywords to return
            
        Returns:
            List of keyword dictionaries with scores
        """
        if not text:
            return []
        
        keywords = []
        
        try:
            # Use TextBlob for noun phrase extraction
            blob = TextBlob(text)
            
            # Extract noun phrases
            noun_phrases = [str(phrase).lower() for phrase in blob.noun_phrases]
            
            # Count frequency
            phrase_counts = Counter(noun_phrases)
            
            # Score keywords (frequency + business relevance)
            for phrase, count in phrase_counts.most_common(max_keywords * 2):
                if len(phrase) > 3 and count > 1:  # Filter short and rare phrases
                    relevance_score = self._calculate_business_relevance(phrase)
                    final_score = count * relevance_score
                    
                    keywords.append({
                        'keyword': phrase,
                        'frequency': count,
                        'relevance_score': relevance_score,
                        'final_score': final_score
                    })
            
            # Sort by final score and return top keywords
            keywords.sort(key=lambda x: x['final_score'], reverse=True)
            return keywords[:max_keywords]
            
        except Exception as e:
            logger.debug(f"Keyword extraction failed: {e}")
            return []
    
    def _extract_patterns(self, text: str, patterns: List[str]) -> List[str]:
        """Extract text matching specific patterns.
        
        Args:
            text: Input text
            patterns: List of regex patterns
            
        Returns:
            List of matched terms
        """
        matches = []
        text_lower = text.lower()
        
        for pattern in patterns:
            found = re.findall(pattern, text_lower, re.IGNORECASE)
            matches.extend(found)
        
        return matches
    
    def _extract_tech_terms(self, text: str) -> List[str]:
        """Extract technology-related terms.
        
        Args:
            text: Input text
            
        Returns:
            List of technology terms
        """
        tech_terms = []
        text_lower = text.lower()
        
        # Common tech terms and acronyms
        tech_keywords = [
            'ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning',
            'nlp', 'natural language processing', 'computer vision', 'automation',
            'api', 'rest', 'graphql', 'microservices', 'cloud', 'aws', 'azure', 'gcp',
            'docker', 'kubernetes', 'serverless', 'lambda', 'database', 'sql', 'nosql',
            'react', 'angular', 'vue', 'node.js', 'python', 'javascript', 'typescript',
            'mobile app', 'ios', 'android', 'flutter', 'react native',
            'blockchain', 'cryptocurrency', 'web3', 'smart contracts'
        ]
        
        for term in tech_keywords:
            if term in text_lower:
                tech_terms.append(term)
        
        return tech_terms
    
    def _calculate_business_relevance(self, phrase: str) -> float:
        """Calculate business relevance score for a phrase.
        
        Args:
            phrase: Input phrase
            
        Returns:
            Relevance score between 0 and 1
        """
        score = 0.5  # Base score
        
        # Boost score for business-relevant terms
        business_boosters = [
            'market', 'customer', 'user', 'business', 'revenue', 'profit',
            'solution', 'problem', 'opportunity', 'startup', 'company',
            'tool', 'app', 'service', 'platform', 'software', 'technology'
        ]
        
        for booster in business_boosters:
            if booster in phrase:
                score += 0.1
        
        # Reduce score for common but less relevant terms
        reducers = [
            'thing', 'stuff', 'way', 'time', 'people', 'person',
            'good', 'bad', 'nice', 'great', 'awesome'
        ]
        
        for reducer in reducers:
            if reducer in phrase:
                score -= 0.1
        
        return max(0.1, min(1.0, score))  # Clamp between 0.1 and 1.0