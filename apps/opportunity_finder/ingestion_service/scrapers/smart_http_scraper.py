"""Smart HTTP scraper with proxy rotation, header randomization, and rate limiting."""

import asyncio
import random
import time
from typing import Dict, Any, List, Optional
from datetime import datetime
from loguru import logger
import httpx
from fake_useragent import UserAgent

from .base_scraper import BaseScraper


class SmartHttpScraper(BaseScraper):
    """Advanced HTTP scraper with anti-detection features."""
    
    def __init__(self, kafka_producer, settings):
        super().__init__(kafka_producer, settings)
        
        # Initialize user agent generator
        try:
            self.ua = UserAgent()
        except:
            self.ua = None
            
        # Fallback user agents
        self.fallback_user_agents = [
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15"
        ]
        
        # Free proxy list (you can expand this with paid services)
        self.proxy_list = [
            # Add proxy servers here if available
            # "http://proxy1:port",
            # "http://proxy2:port",
        ]
        
        # Rate limiting
        self.last_request_time = {}
        self.min_delay = 2  # Minimum delay between requests
        self.max_delay = 5  # Maximum delay between requests
    
    def get_source_type(self) -> str:
        return "smart_http"
    
    def _get_random_user_agent(self) -> str:
        """Get a random user agent."""
        try:
            if self.ua:
                return self.ua.random
        except:
            pass
        return random.choice(self.fallback_user_agents)
    
    def _get_smart_headers(self, referer: Optional[str] = None) -> Dict[str, str]:
        """Generate realistic HTTP headers."""
        headers = {
            'User-Agent': self._get_random_user_agent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': random.choice([
                'en-US,en;q=0.5',
                'en-US,en;q=0.9',
                'en-GB,en;q=0.8',
                'en-US,en;q=0.7'
            ]),
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': random.choice(['none', 'same-origin', 'cross-site']),
            'Cache-Control': 'max-age=0',
            'DNT': '1',
        }
        
        if referer:
            headers['Referer'] = referer
            
        # Randomly add some optional headers
        if random.random() > 0.5:
            headers['Sec-GPC'] = '1'
            
        return headers
    
    async def _smart_delay(self, domain: str):
        """Implement smart rate limiting per domain."""
        current_time = time.time()
        
        if domain in self.last_request_time:
            time_since_last = current_time - self.last_request_time[domain]
            if time_since_last < self.min_delay:
                delay = random.uniform(self.min_delay, self.max_delay)
                logger.debug(f"Rate limiting: waiting {delay:.2f}s for {domain}")
                await asyncio.sleep(delay)
        
        self.last_request_time[domain] = time.time()
    
    async def _make_smart_request(self, url: str, session: httpx.AsyncClient, 
                                retries: int = 3) -> Optional[httpx.Response]:
        """Make HTTP request with smart retry and error handling."""
        domain = url.split('/')[2] if '://' in url else url.split('/')[0]
        
        for attempt in range(retries):
            try:
                # Rate limiting
                await self._smart_delay(domain)
                
                # Generate fresh headers for each attempt
                headers = self._get_smart_headers()
                
                logger.debug(f"Attempting request to {url} (attempt {attempt + 1})")
                
                # Make request with timeout
                response = await session.get(
                    url, 
                    headers=headers,
                    timeout=30.0,
                    follow_redirects=True
                )
                
                if response.status_code == 200:
                    logger.debug(f"Successful request to {url}")
                    return response
                elif response.status_code == 429:
                    # Rate limited - wait longer
                    wait_time = random.uniform(10, 20)
                    logger.warning(f"Rate limited on {url}, waiting {wait_time:.2f}s")
                    await asyncio.sleep(wait_time)
                    continue
                elif response.status_code in [403, 404]:
                    logger.warning(f"Access denied or not found for {url}: {response.status_code}")
                    return None
                else:
                    logger.warning(f"Unexpected status {response.status_code} for {url}")
                    
            except httpx.TimeoutException:
                logger.warning(f"Timeout on attempt {attempt + 1} for {url}")
                await asyncio.sleep(random.uniform(2, 5))
                
            except Exception as e:
                logger.warning(f"Request error on attempt {attempt + 1} for {url}: {e}")
                await asyncio.sleep(random.uniform(1, 3))
        
        logger.error(f"All attempts failed for {url}")
        return None
    
    async def _scrape_reddit_smart(self, subreddit: str) -> List[Dict[str, Any]]:
        """Smart Reddit scraping with multiple fallback methods."""
        items = []
        
        # Multiple API endpoints to try
        endpoints = [
            f"https://www.reddit.com/r/{subreddit}/hot.json?limit=25",
            f"https://www.reddit.com/r/{subreddit}/new.json?limit=25",
            f"https://api.reddit.com/r/{subreddit}/hot?limit=25",
        ]
        
        async with httpx.AsyncClient() as session:
            for endpoint in endpoints:
                try:
                    response = await self._make_smart_request(endpoint, session)
                    
                    if response and response.status_code == 200:
                        data = response.json()
                        posts = data.get('data', {}).get('children', [])
                        
                        for post_wrapper in posts:
                            post = post_wrapper.get('data', {})
                            
                            # Extract post data
                            post_id = post.get('id')
                            if not post_id:
                                continue
                                
                            title = post.get('title', '')
                            if not title or len(title) < 10:
                                continue
                            
                            item = {
                                'id': f"reddit_smart_{subreddit}_{post_id}",
                                'title': title,
                                'url': f"https://reddit.com{post.get('permalink', '')}",
                                'source': f'reddit_r_{subreddit}',
                                'source_type': 'reddit_smart',
                                'author': post.get('author', 'unknown'),
                                'score': post.get('score', 0),
                                'num_comments': post.get('num_comments', 0),
                                'created_utc': post.get('created_utc', 0),
                                'scraped_at': datetime.now().isoformat(),
                                'content_type': 'discussion',
                                'platform': 'reddit',
                                'subreddit': subreddit,
                                'selftext': post.get('selftext', '')[:500],  # First 500 chars
                                'upvote_ratio': post.get('upvote_ratio', 0)
                            }
                            
                            items.append(item)
                        
                        logger.info(f"Successfully scraped {len(items)} posts from r/{subreddit}")
                        break  # Success, no need to try other endpoints
                        
                except Exception as e:
                    logger.warning(f"Error with endpoint {endpoint}: {e}")
                    continue
            
            if not items:
                logger.error(f"Failed to scrape any data from r/{subreddit}")
        
        return items
    
    async def _scrape_hackernews_smart(self) -> List[Dict[str, Any]]:
        """Smart Hacker News scraping."""
        items = []
        
        # HN API endpoints
        endpoints = [
            "https://hacker-news.firebaseio.com/v0/topstories.json",
            "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=30"
        ]
        
        async with httpx.AsyncClient() as session:
            # Try Algolia API first (more reliable)
            try:
                response = await self._make_smart_request(endpoints[1], session)
                
                if response and response.status_code == 200:
                    data = response.json()
                    hits = data.get('hits', [])
                    
                    for hit in hits[:20]:  # Limit to 20
                        item = {
                            'id': f"hn_smart_{hit.get('objectID')}",
                            'title': hit.get('title', ''),
                            'url': hit.get('url', f"https://news.ycombinator.com/item?id={hit.get('objectID')}"),
                            'source': 'hackernews',
                            'source_type': 'hackernews_smart',
                            'author': hit.get('author', ''),
                            'points': hit.get('points', 0),
                            'num_comments': hit.get('num_comments', 0),
                            'created_at': hit.get('created_at', ''),
                            'scraped_at': datetime.now().isoformat(),
                            'content_type': 'news',
                            'platform': 'hackernews'
                        }
                        
                        items.append(item)
                    
                    logger.info(f"Successfully scraped {len(items)} stories from Hacker News")
                    
            except Exception as e:
                logger.error(f"Error scraping Hacker News: {e}")
        
        return items
    
    async def scrape_batch(self) -> List[Dict[str, Any]]:
        """Main smart scraping method."""
        all_items = []
        
        try:
            # Scrape Reddit subreddits
            subreddits = ['entrepreneur', 'startups', 'SaaS', 'smallbusiness']
            
            for subreddit in subreddits[:3]:  # Limit for demo
                logger.info(f"Smart scraping Reddit r/{subreddit}...")
                reddit_items = await self._scrape_reddit_smart(subreddit)
                all_items.extend(reddit_items)
                
                # Random delay between subreddits
                delay = random.uniform(3, 7)
                logger.debug(f"Waiting {delay:.2f}s before next subreddit...")
                await asyncio.sleep(delay)
            
            # Scrape Hacker News
            logger.info("Smart scraping Hacker News...")
            hn_items = await self._scrape_hackernews_smart()
            all_items.extend(hn_items)
            
        except Exception as e:
            logger.error(f"Error in smart scraping batch: {e}")
        
        logger.info(f"Smart scraping completed. Total items: {len(all_items)}")
        return all_items