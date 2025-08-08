"""Configuration settings for the scoring service."""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database Configuration
    database_url: str = "postgresql://deepneed:deepneed@localhost:5433/deepneed_opf"
    
    # Kafka Configuration
    kafka_bootstrap_servers: str = "localhost:9092"
    kafka_topic_clean_items: str = "clean_opportunities"
    kafka_consumer_group: str = "scoring_service"
    
    # Redis Configuration
    redis_url: str = "redis://localhost:6379/2"
    
    # Scoring Configuration
    score_update_interval_minutes: int = 30
    batch_size: int = 50
    
    # Model Configuration
    model_retrain_threshold: int = 1000  # Retrain after N new samples
    model_save_interval_hours: int = 6
    
    # Feature Engineering
    keyword_importance_threshold: float = 0.1
    entity_boost_factor: float = 1.2
    source_reliability_weights: dict = {
        "reddit": 0.8,
        "hackernews": 0.9,
        "g2": 0.95,
        "linkedin": 0.85,
        "newsletter": 0.7
    }
    
    # Scoring Weights (will be learned by RL bandit)
    initial_score_weights: dict = {
        "pain_score": 0.25,
        "tam_score": 0.20,
        "gap_score": 0.20,
        "ai_fit_score": 0.15,
        "solo_fit_score": 0.15,
        "risk_score": -0.05  # Negative because higher risk = lower opportunity
    }
    
    # CatBoost Configuration
    catboost_iterations: int = 1000
    catboost_learning_rate: float = 0.1
    catboost_depth: int = 6
    catboost_l2_leaf_reg: float = 3.0
    
    # Bandit Configuration
    bandit_exploration_rate: float = 0.1
    bandit_decay_rate: float = 0.99
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        env_prefix = ""