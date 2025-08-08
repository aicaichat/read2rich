"""Hacker News scraper for tech pain points and Show HN projects."""

import asyncio
import httpx
from typing import Dict, Any, List
from datetime import datetime
from loguru import logger

from .base_scraper import BaseScraper


class HackerNewsScraper(BaseScraper):
    """Scraper for Hacker News stories and comments."""
    
    def get_source_type(self) -> str:
        return "hackernews"
    
    async def scrape_batch(self) -> List[Dict[str, Any]]:
        """Scrape top stories from Hacker News."""
        items = []
        
        async with httpx.AsyncClient() as client:
            try:
                # Get top stories
                top_stories_url = f"{self.settings.hn_api_base}/topstories.json"
                response = await client.get(top_stories_url)
                response.raise_for_status()
                
                story_ids = response.json()[:self.settings.hn_max_items]
                
                # Process stories in batches to avoid overwhelming the API
                for i in range(0, len(story_ids), 10):
                    batch_ids = story_ids[i:i+10]
                    batch_items = await self._fetch_story_batch(client, batch_ids)
                    items.extend(batch_items)
                    
                    # Rate limiting between batches
                    await asyncio.sleep(self.settings.request_delay_seconds)
                
            except Exception as e:
                logger.error(f"Error scraping Hacker News: {e}")
        
        return items
    
    async def _fetch_story_batch(self, client: httpx.AsyncClient, story_ids: List[int]) -> List[Dict[str, Any]]:
        """Fetch a batch of stories concurrently."""
        items = []
        
        # Create tasks for concurrent fetching
        tasks = []
        for story_id in story_ids:
            task = self._fetch_single_story(client, story_id)
            tasks.append(task)
        
        # Wait for all tasks to complete
        story_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for result in story_results:
            if isinstance(result, dict) and result:
                items.append(result)
        
        return items
    
    async def _fetch_single_story(self, client: httpx.AsyncClient, story_id: int) -> Dict[str, Any]:
        """Fetch a single story and check if it's relevant."""
        try:
            # Check if already processed
            if self._is_duplicate(str(story_id)):
                return {}
            
            story_url = f"{self.settings.hn_api_base}/item/{story_id}.json"
            response = await client.get(story_url)
            response.raise_for_status()
            
            story = response.json()
            
            if story and self._is_relevant_story(story):
                item = self._extract_story_data(story)
                self._mark_as_scraped(str(story_id))
                return item
                
        except Exception as e:
            logger.debug(f"Error fetching HN story {story_id}: {e}")
        
        return {}
    
    def _is_relevant_story(self, story: Dict[str, Any]) -> bool:
        """Determine if a HN story is relevant for opportunity finding."""
        title = story.get('title', '').lower()
        text = story.get('text', '').lower()
        story_type = story.get('type', '')
        score = story.get('score', 0)
        descendants = story.get('descendants', 0)  # comment count
        
        # Basic filters
        if story_type != 'story':
            return False
            
        if score < 10:  # Minimum score threshold
            return False
            
        if descendants < 5:  # Minimum discussion
            return False
        
        # Look for Show HN, Ask HN, or pain point indicators
        show_hn = title.startswith('show hn:')
        ask_hn = title.startswith('ask hn:')
        
        # Pain point keywords
        pain_keywords = [
            'problem', 'issue', 'struggle', 'difficult', 'frustrated',
            'alternative to', 'better than', 'replacement for',
            'why is', 'how to solve', 'tired of', 'hate using'
        ]
        
        # Opportunity keywords
        opportunity_keywords = [
            'built', 'created', 'launched', 'made', 'startup',
            'side project', 'weekend project', 'open source',
            'tool', 'app', 'service', 'platform'
        ]
        
        full_text = f"{title} {text}"
        
        has_pain = any(keyword in full_text for keyword in pain_keywords)
        has_opportunity = any(keyword in full_text for keyword in opportunity_keywords)
        
        return show_hn or ask_hn or has_pain or has_opportunity
    
    def _extract_story_data(self, story: Dict[str, Any]) -> Dict[str, Any]:
        """Extract relevant data from a HN story."""
        return {
            'id': story.get('id'),
            'title': story.get('title'),
            'text': story.get('text', ''),
            'by': story.get('by'),  # author
            'score': story.get('score'),
            'descendants': story.get('descendants'),  # comment count
            'time': story.get('time'),  # Unix timestamp
            'url': story.get('url', ''),
            'hn_url': f"https://news.ycombinator.com/item?id={story.get('id')}",
            'type': story.get('type'),
            'scraped_at': datetime.utcnow().isoformat(),
            'kids': story.get('kids', [])[:10]  # Top 10 comment IDs for potential follow-up
        }