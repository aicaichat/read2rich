"""G2 scraper for software reviews and feature requests."""

import asyncio
import httpx
from typing import Dict, Any, List
from datetime import datetime
from loguru import logger
from playwright.async_api import async_playwright

from .base_scraper import BaseScraper


class G2Scraper(BaseScraper):
    """Scraper for G2 reviews and feature requests."""
    
    def get_source_type(self) -> str:
        return "g2"
    
    async def scrape_batch(self) -> List[Dict[str, Any]]:
        """Scrape G2 reviews for pain points and missing features."""
        items = []
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            try:
                for category in self.settings.g2_categories:
                    category_items = await self._scrape_category(page, category)
                    items.extend(category_items)
                    
                    # Rate limiting between categories
                    await asyncio.sleep(self.settings.request_delay_seconds * 2)
                    
            except Exception as e:
                logger.error(f"Error scraping G2: {e}")
            finally:
                await browser.close()
        
        return items
    
    async def _scrape_category(self, page, category: str) -> List[Dict[str, Any]]:
        """Scrape reviews from a specific G2 category."""
        items = []
        
        try:
            # Navigate to category page
            url = f"{self.settings.g2_base_url}/categories/{category}"
            await page.goto(url, wait_until="networkidle")
            
            # Look for review snippets that mention problems or missing features
            review_selectors = [
                '[data-testid="review-card"]',
                '.review-card',
                '.paper.paper--white'
            ]
            
            for selector in review_selectors:
                try:
                    reviews = await page.locator(selector).all()
                    
                    for i, review in enumerate(reviews[:20]):  # Limit to first 20 reviews
                        try:
                            # Extract review text
                            review_text = await review.locator('.review-text, .formatted-text').text_content()
                            
                            if review_text and self._is_relevant_review(review_text):
                                # Extract additional metadata
                                reviewer = await review.locator('.reviewer-name, [data-testid="reviewer-name"]').text_content()
                                rating = await review.locator('.stars, .rating').text_content()
                                
                                item = {
                                    'id': f"g2_{category}_{i}_{hash(review_text)}",
                                    'category': category,
                                    'review_text': review_text,
                                    'reviewer': reviewer or 'Anonymous',
                                    'rating': rating or 'N/A',
                                    'url': url,
                                    'scraped_at': datetime.utcnow().isoformat()
                                }
                                
                                if not self._is_duplicate(item['id']):
                                    items.append(item)
                                    self._mark_as_scraped(item['id'])
                        except:
                            continue
                    
                    break  # If we found reviews with this selector, stop trying others
                except:
                    continue
                    
        except Exception as e:
            logger.error(f"Error scraping G2 category {category}: {e}")
        
        return items
    
    def _is_relevant_review(self, review_text: str) -> bool:
        """Check if a review contains pain points or feature requests."""
        if not review_text or len(review_text) < 50:
            return False
            
        text = review_text.lower()
        
        # Look for pain point indicators
        pain_indicators = [
            'missing', 'lack', 'wish', 'would be nice', 'need',
            'problem', 'issue', 'difficult', 'frustrating',
            'could be better', 'improvement', 'feature request',
            'limitation', 'drawback', 'weakness'
        ]
        
        return any(indicator in text for indicator in pain_indicators)