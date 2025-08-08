# AI Opportunity Finder Subproject (AIOF)

This directory contains the code and assets for DeepNeed's **AI Opportunity Finder**, as outlined in the PRD v1.0 (2025-08-07).

## Goal
Turn multi-source market pain signals into 3-5 validated, high-potential AI product opportunities that a 1-3 person team can ship in ≤ 12 weeks, complete with Quick-Start Kits that accelerate execution.

## High-Level Architecture (per PRD §10)
```
+ ingestion_service   ─┐               + kafka / raw queue
+ processing_service  ─┼──► kafka ───► + embedding_service  ──► pgvector / qdrant
+ scoring_service     ─┘               + postgres (core tables)
                                    ▲
+ api_gateway (GraphQL / REST) ──────┘
                                    ▼
+ reporting_service  (PDF, S3)
```

Each box above maps to a standalone, dockerised micro-service located under this directory.

## Directory Layout
```
apps/opportunity_finder/
├── ingestion_service/   # Scrapy-Playwright + Go async workers
├── processing_service/  # FastAPI + Celery for NLP / rules
├── embedding_service/   # GPU-enabled batch embedding
├── scoring_service/     # CatBoost + RL Bandit
├── api_gateway/         # GraphQL / REST; JWT auth
├── reporting_service/   # Jinja2 → WeasyPrint PDF generator
└── docker-compose.yml   # Local orchestration (TBD)
```

> NOTE: For now each service only contains an empty `__init__.py`. Implementations will be added in subsequent commits.

## Next Steps
1. Flesh out `docker-compose.yml` to wire Kafka, Postgres, Qdrant, and all services.
2. Implement `ingestion_service` crawler pipelines.
3. Define shared protobuf or Pydantic schemas for message passing.
4. Build scoring model baseline inside `scoring_service`.
5. Connect `api_gateway` to existing `apps/api` auth & user tables to enable Single-Sign-On.
