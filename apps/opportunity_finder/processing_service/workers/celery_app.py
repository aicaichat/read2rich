"""Celery application configuration."""

from celery import Celery
from config import Settings

# Load settings
settings = Settings()

# Create Celery app
celery_app = Celery(
    'processing_service',
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=['workers.tasks']
)

# Configure Celery
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=settings.celery_task_timeout,
    task_soft_time_limit=settings.celery_task_timeout - 30,
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    worker_max_tasks_per_child=1000,
)