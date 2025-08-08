"""Reddit scraper for pain points and startup discussions."""

import asyncio
import httpx
from typing import Dict, Any, List
from datetime import datetime
from loguru import logger

from .base_scraper import BaseScraper


class RedditScraper(BaseScraper):
    """Scraper for Reddit pain points and startup discussions."""
    
    def get_source_type(self) -> str:
        return "reddit"
    
    async def scrape_batch(self) -> List[Dict[str, Any]]:
        """Scrape posts from configured subreddits."""
        items = []
        
        async with httpx.AsyncClient() as client:
            for subreddit in self.settings.reddit_subreddits:
                try:
                    # Use Reddit JSON API (no auth required for public posts)
                    url = f"https://www.reddit.com/r/{subreddit}/hot.json"
                    headers = {
                        'User-Agent': self.settings.reddit_user_agent
                    }
                    
                    response = await client.get(url, headers=headers)
                    response.raise_for_status()
                    
                    data = response.json()
                    posts = data.get('data', {}).get('children', [])
                    
                    for post_wrapper in posts[:25]:  # Limit to top 25 posts
                        post = post_wrapper.get('data', {})
                        
                        # Skip if already processed
                        post_id = post.get('id')
                        if not post_id or self._is_duplicate(post_id):
                            continue
                        
                        # Filter for potentially valuable posts
                        if self._is_relevant_post(post):
                            item = self._extract_post_data(post, subreddit)
                            items.append(item)
                            self._mark_as_scraped(post_id)
                    
                    # Rate limiting
                    await asyncio.sleep(self.settings.request_delay_seconds)
                    
                except Exception as e:
                    logger.error(f"Error scraping r/{subreddit}: {e}")
                    continue
        
        return items
    
    def _is_relevant_post(self, post: Dict[str, Any]) -> bool:
        """Determine if a post is relevant for opportunity finding."""
        title = post.get('title', '').lower()
        selftext = post.get('selftext', '').lower()
        score = post.get('score', 0)
        num_comments = post.get('num_comments', 0)
        
        # Filter criteria
        if score < 5:  # Minimum upvotes
            return False
            
        if num_comments < 3:  # Minimum engagement
            return False
        
        # Look for pain point indicators
        pain_keywords = [
            'problem', 'issue', 'struggle', 'difficult', 'frustrated',
            'annoying', 'waste', 'time consuming', 'manual', 'repetitive',
            'inefficient', 'wish there was', 'need a tool', 'missing',
            'looking for', 'alternative to', 'better way'
        ]
        
        # Look for opportunity keywords
        opportunity_keywords = [
            'idea', 'startup', 'app', 'tool', 'service', 'solution',
            'business', 'monetize', 'market', 'niche', 'gap'
        ]
        
        text = f"{title} {selftext}"
        
        has_pain = any(keyword in text for keyword in pain_keywords)
        has_opportunity = any(keyword in text for keyword in opportunity_keywords)
        
        return has_pain or has_opportunity
    
    def _extract_post_data(self, post: Dict[str, Any], subreddit: str) -> Dict[str, Any]:
        """Extract relevant data from a Reddit post."""
        return {
            'id': post.get('id'),
            'title': post.get('title'),
            'selftext': post.get('selftext'),
            'author': post.get('author'),
            'subreddit': subreddit,
            'score': post.get('score'),
            'upvote_ratio': post.get('upvote_ratio'),
            'num_comments': post.get('num_comments'),
            'created_utc': post.get('created_utc'),
            'url': f"https://www.reddit.com{post.get('permalink', '')}",
            'scraped_at': datetime.utcnow().isoformat(),
            'flair_text': post.get('link_flair_text'),
            'is_self': post.get('is_self', False),
            'domain': post.get('domain')
        }