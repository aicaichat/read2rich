"""Core scoring engine using CatBoost and RL Bandit."""

import asyncio
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional
from loguru import logger
import catboost as cb
import joblib
from datetime import datetime, timedelta

from config import Settings
from database.db_manager import DatabaseManager
from .feature_extractor import FeatureExtractor
from .bandit_optimizer import BanditOptimizer


class ScoringEngine:
    """Main scoring engine that coordinates all scoring models."""
    
    def __init__(self, settings: Settings, db_manager: DatabaseManager):
        self.settings = settings
        self.db_manager = db_manager
        self.feature_extractor = FeatureExtractor(settings)
        self.bandit_optimizer = BanditOptimizer(settings)
        
        # Model instances
        self.pain_model = None
        self.tam_model = None
        self.gap_model = None
        self.ai_fit_model = None
        self.solo_fit_model = None
        self.risk_model = None
        
        self.models_initialized = False
        self.last_training_time = None
        
    async def initialize(self):
        """Initialize the scoring engine."""
        logger.info("Initializing scoring engine")
        
        # Load or create models
        await self._load_or_create_models()
        
        # Initialize bandit optimizer
        await self.bandit_optimizer.initialize()
        
        self.models_initialized = True
        logger.info("Scoring engine initialized successfully")
    
    async def score_opportunity(self, opportunity_data: Dict[str, Any]) -> Dict[str, float]:
        """Score a single opportunity across all dimensions.
        
        Args:
            opportunity_data: Clean opportunity data from processing service
            
        Returns:
            Dictionary with all scores
        """
        if not self.models_initialized:
            raise RuntimeError("Scoring engine not initialized")
        
        try:
            # Extract features
            features = await self.feature_extractor.extract_features(opportunity_data)
            
            # Generate individual scores
            scores = {}
            
            if self.pain_model:
                scores['pain_score'] = self._predict_score(self.pain_model, features)
            else:
                scores['pain_score'] = self._fallback_pain_score(opportunity_data)
            
            if self.tam_model:
                scores['tam_score'] = self._predict_score(self.tam_model, features)
            else:
                scores['tam_score'] = self._fallback_tam_score(opportunity_data)
            
            if self.gap_model:
                scores['gap_score'] = self._predict_score(self.gap_model, features)
            else:
                scores['gap_score'] = self._fallback_gap_score(opportunity_data)
            
            if self.ai_fit_model:
                scores['ai_fit_score'] = self._predict_score(self.ai_fit_model, features)
            else:
                scores['ai_fit_score'] = self._fallback_ai_fit_score(opportunity_data)
            
            if self.solo_fit_model:
                scores['solo_fit_score'] = self._predict_score(self.solo_fit_model, features)
            else:
                scores['solo_fit_score'] = self._fallback_solo_fit_score(opportunity_data)
            
            if self.risk_model:
                scores['risk_score'] = self._predict_score(self.risk_model, features)
            else:
                scores['risk_score'] = self._fallback_risk_score(opportunity_data)
            
            # Calculate weighted total score using bandit optimizer
            total_score = await self.bandit_optimizer.calculate_weighted_score(scores)
            scores['total_score'] = total_score
            
            # Ensure all scores are in valid range [0, 10]
            for key, value in scores.items():
                scores[key] = max(0.0, min(10.0, float(value)))
            
            return scores
            
        except Exception as e:
            logger.error(f"Error scoring opportunity: {e}")
            # Return default scores on error
            return {
                'pain_score': 5.0,
                'tam_score': 5.0,
                'gap_score': 5.0,
                'ai_fit_score': 5.0,
                'solo_fit_score': 5.0,
                'risk_score': 5.0,
                'total_score': 5.0
            }
    
    def _predict_score(self, model, features: Dict[str, Any]) -> float:
        """Make prediction using a trained model."""
        try:
            # Convert features to DataFrame for CatBoost
            feature_df = pd.DataFrame([features])
            prediction = model.predict(feature_df)[0]
            return float(prediction)
        except Exception as e:
            logger.error(f"Error making prediction: {e}")
            return 5.0  # Default middle score
    
    def _fallback_pain_score(self, data: Dict[str, Any]) -> float:
        """Fallback pain scoring based on heuristics."""
        score = 5.0
        
        # Check for pain indicators in keywords
        keywords = data.get('keywords', [])
        pain_keywords = ['problem', 'issue', 'frustrating', 'difficult', 'struggle']
        
        pain_count = sum(1 for kw in keywords if any(pain in kw.get('keyword', '').lower() for pain in pain_keywords))
        score += min(3.0, pain_count * 0.5)
        
        # Source reliability boost
        source_type = data.get('source_type', '')
        reliability = self.settings.source_reliability_weights.get(source_type, 0.5)
        score *= (0.5 + reliability * 0.5)
        
        return min(10.0, score)
    
    def _fallback_tam_score(self, data: Dict[str, Any]) -> float:
        """Fallback TAM scoring based on market indicators."""
        score = 5.0
        
        # Check for market size indicators
        keywords = data.get('keywords', [])
        market_keywords = ['market', 'industry', 'business', 'revenue', 'customers']
        
        market_count = sum(1 for kw in keywords if any(market in kw.get('keyword', '').lower() for market in market_keywords))
        score += min(2.0, market_count * 0.3)
        
        # Technology boost (AI/SaaS markets tend to be larger)
        entities = data.get('entities', {})
        tech_terms = entities.get('technologies', [])
        if tech_terms:
            score += min(2.0, len(tech_terms) * 0.2)
        
        return min(10.0, score)
    
    def _fallback_gap_score(self, data: Dict[str, Any]) -> float:
        """Fallback gap scoring based on solution indicators."""
        score = 5.0
        
        # Check for gap indicators
        text = data.get('cleaned_text', '').lower()
        gap_indicators = ['missing', 'lack', 'need', 'wish there was', 'alternative to']
        
        gap_count = sum(1 for indicator in gap_indicators if indicator in text)
        score += min(3.0, gap_count * 0.7)
        
        return min(10.0, score)
    
    def _fallback_ai_fit_score(self, data: Dict[str, Any]) -> float:
        """Fallback AI fit scoring based on automation potential."""
        score = 5.0
        
        # Check for AI/automation keywords
        entities = data.get('entities', {})
        tech_terms = entities.get('technologies', [])
        
        ai_terms = ['ai', 'artificial intelligence', 'machine learning', 'automation', 'nlp']
        ai_relevance = sum(1 for term in tech_terms if any(ai_term in term.lower() for ai_term in ai_terms))
        
        score += min(3.0, ai_relevance * 1.0)
        
        # Data processing tasks are good for AI
        text = data.get('cleaned_text', '').lower()
        ai_suitable = ['data', 'analysis', 'processing', 'classification', 'prediction', 'recommendation']
        
        suitability_count = sum(1 for term in ai_suitable if term in text)
        score += min(2.0, suitability_count * 0.3)
        
        return min(10.0, score)
    
    def _fallback_solo_fit_score(self, data: Dict[str, Any]) -> float:
        """Fallback solo fit scoring based on complexity indicators."""
        score = 7.0  # Start higher as many software projects can be solo
        
        # Reduce score for complex indicators
        text = data.get('cleaned_text', '').lower()
        complex_indicators = ['enterprise', 'large scale', 'complex', 'team', 'compliance', 'regulation']
        
        complexity_count = sum(1 for indicator in complex_indicators if indicator in text)
        score -= min(4.0, complexity_count * 0.8)
        
        # Boost for simple indicators
        simple_indicators = ['simple', 'tool', 'app', 'widget', 'automation', 'script']
        simplicity_count = sum(1 for indicator in simple_indicators if indicator in text)
        score += min(2.0, simplicity_count * 0.4)
        
        return max(1.0, min(10.0, score))
    
    def _fallback_risk_score(self, data: Dict[str, Any]) -> float:
        """Fallback risk scoring (lower is better)."""
        score = 5.0
        
        # Check for risk indicators
        text = data.get('cleaned_text', '').lower()
        risk_indicators = ['legal', 'regulation', 'compliance', 'patent', 'lawsuit', 'banned']
        
        risk_count = sum(1 for indicator in risk_indicators if indicator in text)
        score += min(3.0, risk_count * 1.0)  # Higher risk score = worse
        
        # Technology maturity reduces risk
        entities = data.get('entities', {})
        tech_terms = entities.get('technologies', [])
        mature_tech = ['python', 'javascript', 'api', 'cloud', 'database']
        
        maturity_count = sum(1 for term in tech_terms if any(mature in term.lower() for mature in mature_tech))
        score -= min(2.0, maturity_count * 0.3)  # Mature tech = lower risk
        
        return max(1.0, min(10.0, score))
    
    async def _load_or_create_models(self):
        """Load existing models or create new ones."""
        try:
            # Try to load existing models
            # In production, these would be loaded from model storage
            logger.info("Creating new CatBoost models (pre-trained models not available)")
            
            # Create new CatBoost models with default parameters
            common_params = {
                'iterations': self.settings.catboost_iterations,
                'learning_rate': self.settings.catboost_learning_rate,
                'depth': self.settings.catboost_depth,
                'l2_leaf_reg': self.settings.catboost_l2_leaf_reg,
                'random_seed': 42,
                'verbose': False
            }
            
            self.pain_model = cb.CatBoostRegressor(**common_params)
            self.tam_model = cb.CatBoostRegressor(**common_params)
            self.gap_model = cb.CatBoostRegressor(**common_params)
            self.ai_fit_model = cb.CatBoostRegressor(**common_params)
            self.solo_fit_model = cb.CatBoostRegressor(**common_params)
            self.risk_model = cb.CatBoostRegressor(**common_params)
            
            logger.info("Models created successfully (will use fallback scoring until training data is available)")
            
        except Exception as e:
            logger.error(f"Error loading/creating models: {e}")
            # Models will remain None, fallback scoring will be used
    
    async def retrain_models(self):
        """Retrain models with new data."""
        logger.info("Starting model retraining")
        
        try:
            # Get training data from database
            training_data = await self.db_manager.get_training_data()
            
            if len(training_data) < 100:  # Need minimum data for training
                logger.info(f"Insufficient training data ({len(training_data)} samples), skipping retraining")
                return
            
            # This would implement actual model training
            # For now, just log that retraining would happen
            logger.info(f"Would retrain models with {len(training_data)} samples")
            
            self.last_training_time = datetime.utcnow()
            
        except Exception as e:
            logger.error(f"Error retraining models: {e}")
    
    async def cleanup(self):
        """Clean up resources."""
        if self.bandit_optimizer:
            await self.bandit_optimizer.cleanup()
        
        logger.info("Scoring engine cleaned up")