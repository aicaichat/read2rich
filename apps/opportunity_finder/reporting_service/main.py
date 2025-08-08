"""Simple reporting service placeholder for demo."""

import asyncio
from loguru import logger

async def main():
    logger.info("Reporting service starting (placeholder for demo)")
    
    # Keep service running
    while True:
        await asyncio.sleep(60)
        logger.debug("Reporting service heartbeat")

if __name__ == "__main__":
    asyncio.run(main())