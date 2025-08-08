"""Newsletter scraper for trend analysis and pain points."""

import asyncio
import httpx
import feedparser
from typing import Dict, Any, List
from datetime import datetime
from loguru import logger

from .base_scraper import BaseScraper


class NewsletterScraper(BaseScraper):
    """Scraper for newsletter feeds and trend reports."""
    
    def get_source_type(self) -> str:
        return "newsletter"
    
    async def scrape_batch(self) -> List[Dict[str, Any]]:
        """Scrape newsletter feeds for trends and opportunities."""
        items = []
        
        async with httpx.AsyncClient() as client:
            for feed_url in self.settings.newsletter_feeds:
                try:
                    feed_items = await self._scrape_feed(client, feed_url)
                    items.extend(feed_items)
                    
                    # Rate limiting between feeds
                    await asyncio.sleep(self.settings.request_delay_seconds)
                    
                except Exception as e:
                    logger.error(f"Error scraping newsletter feed {feed_url}: {e}")
        
        return items
    
    async def _scrape_feed(self, client: httpx.AsyncClient, feed_url: str) -> List[Dict[str, Any]]:
        """Scrape a single RSS/Atom feed."""
        items = []
        
        try:
            # Fetch the feed
            response = await client.get(feed_url)
            response.raise_for_status()
            
            # Parse the feed
            feed = feedparser.parse(response.content)
            
            for entry in feed.entries[:10]:  # Limit to 10 most recent entries
                # Check if already processed
                entry_id = entry.get('id') or entry.get('link', '')
                if self._is_duplicate(entry_id):
                    continue
                
                # Extract content
                title = entry.get('title', '')
                summary = entry.get('summary', '')
                content = ''
                
                # Try to get full content
                if hasattr(entry, 'content') and entry.content:
                    content = entry.content[0].value if entry.content else ''
                elif hasattr(entry, 'description'):
                    content = entry.description
                
                # Check if content is relevant
                if self._is_relevant_content(title, summary, content):
                    item = {
                        'id': entry_id,
                        'title': title,
                        'summary': summary,
                        'content': content,
                        'link': entry.get('link', ''),
                        'published': entry.get('published', ''),
                        'author': entry.get('author', ''),
                        'tags': [tag.term for tag in entry.get('tags', [])],
                        'feed_url': feed_url,
                        'feed_title': feed.feed.get('title', ''),
                        'scraped_at': datetime.utcnow().isoformat()
                    }
                    
                    items.append(item)
                    self._mark_as_scraped(entry_id)
                    
        except Exception as e:
            logger.error(f"Error parsing feed {feed_url}: {e}")
        
        return items
    
    def _is_relevant_content(self, title: str, summary: str, content: str) -> bool:
        """Check if newsletter content is relevant for opportunity finding."""
        full_text = f"{title} {summary} {content}".lower()
        
        if len(full_text) < 100:  # Too short to be meaningful
            return False
        
        # Look for trend and opportunity indicators
        trend_keywords = [
            'trend', 'growing', 'emerging', 'opportunity', 'market',
            'startup', 'funding', 'investment', 'growth', 'demand',
            'problem', 'solution', 'gap', 'niche', 'untapped'
        ]
        
        # Look for technology and AI keywords
        tech_keywords = [
            'ai', 'artificial intelligence', 'machine learning', 'automation',
            'saas', 'software', 'app', 'platform', 'tool', 'api'
        ]
        
        has_trend = any(keyword in full_text for keyword in trend_keywords)
        has_tech = any(keyword in full_text for keyword in tech_keywords)
        
        return has_trend or has_tech