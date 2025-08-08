"""Configuration settings for the ingestion service."""

from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Kafka Configuration
    kafka_bootstrap_servers: str = "localhost:9092"
    kafka_topic_raw_items: str = "raw_opportunities"
    kafka_batch_size: int = 100
    kafka_linger_ms: int = 1000
    
    # Redis Configuration (for caching and rate limiting)
    redis_url: str = "redis://localhost:6379/0"
    
    # Scraping Configuration
    scrape_interval_minutes: int = 30
    max_items_per_run: int = 1000
    request_delay_seconds: float = 2.0
    
    # Reddit API (if available)
    reddit_client_id: Optional[str] = None
    reddit_client_secret: Optional[str] = None
    reddit_user_agent: str = "DeepNeed OpportunityFinder v1.0"
    reddit_subreddits: List[str] = [
        "entrepreneur", "startups", "SaaS", "EntrepreneurRideAlong",
        "productivity", "webdev", "artificial", "MachineLearning"
    ]
    
    # Hacker News
    hn_api_base: str = "https://hacker-news.firebaseio.com/v0"
    hn_max_items: int = 500
    
    # G2 Configuration
    g2_base_url: str = "https://www.g2.com"
    g2_categories: List[str] = [
        "artificial-intelligence", "productivity-software", 
        "marketing-automation", "customer-service"
    ]
    
    # LinkedIn (requires authentication)
    linkedin_access_token: Optional[str] = None
    
    # Newsletter sources
    newsletter_feeds: List[str] = [
        "https://trends.vc/feed",
        "https://www.indiehackers.com/feed.xml"
    ]
    
    # Rate limiting
    requests_per_minute: int = 60
    concurrent_requests: int = 5
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        env_prefix = ""