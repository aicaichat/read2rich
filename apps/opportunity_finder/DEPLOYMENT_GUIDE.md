# AI Opportunity Finder - Deployment Guide

This guide covers deployment of the AI Opportunity Finder system based on PRD v1.0.

## Quick Start (Local Development)

### Prerequisites
- Docker & Docker Compose
- 8GB+ RAM recommended
- OpenAI API key
- Stripe API key (for payments)

### 1. Environment Setup
```bash
cd apps/opportunity_finder
cp env.example .env
# Edit .env with your API keys
```

### 2. Start All Services
```bash
./start.sh
```

This will start:
- PostgreSQL (port 5433)
- Redis (port 6379) 
- Kafka + Zookeeper (port 9092)
- Qdrant Vector DB (port 6333)
- All 6 microservices

### 3. Verify Deployment
- API Docs: http://localhost:8081/docs
- Health Check: http://localhost:8081/health
- Qdrant Dashboard: http://localhost:6333/dashboard

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ ingestion_service│───▶│ processing_service│───▶│ embedding_service│
│ (Scrapy+Kafka)  │    │ (NLP+Celery)    │    │ (OpenAI/Local)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      Kafka      │    │   PostgreSQL    │    │     Qdrant      │
│   (Raw Queue)   │    │  (Metadata)     │    │   (Vectors)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ scoring_service │    │  api_gateway    │    │reporting_service│
│(CatBoost+Bandit)│    │ (FastAPI+JWT)   │    │  (PDF+S3)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Service Details

### Ingestion Service
- **Purpose**: Scrape pain points from Reddit, HN, G2, LinkedIn, newsletters
- **Tech**: Scrapy + Playwright + Kafka Producer
- **Sources**: 12+ configured sources
- **Output**: Raw opportunity items → Kafka

### Processing Service  
- **Purpose**: Clean text, extract entities, language detection
- **Tech**: FastAPI + Celery + spaCy + NLTK
- **Input**: Raw items from Kafka
- **Output**: Clean items → Kafka

### Embedding Service
- **Purpose**: Generate vector embeddings for semantic search
- **Tech**: OpenAI API + sentence-transformers (fallback)
- **Storage**: Qdrant vector database
- **Features**: GPU support, rate limiting, batch processing

### Scoring Service
- **Purpose**: Multi-dimensional opportunity scoring
- **Tech**: CatBoost + RL Bandit + PostgreSQL
- **Scores**: Pain, TAM, Gap, AI-Fit, Solo-Fit, Risk, Total
- **Features**: Online learning, model retraining

### API Gateway
- **Purpose**: REST API + authentication + payments
- **Tech**: FastAPI + JWT + Stripe + GraphQL
- **Endpoints**: /opportunities, /auth, /payments, /reports
- **Features**: Rate limiting, CORS, documentation

### Reporting Service
- **Purpose**: Generate PDF reports and Quick-Start Kits
- **Tech**: Jinja2 + WeasyPrint + S3
- **Outputs**: Lite reports (free), Full reports ($29), Development kits

## Production Deployment

### Cloud Infrastructure (Recommended)
```yaml
# docker-compose.prod.yml
version: "3.9"
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - api_gateway

  api_gateway:
    build: ./api_gateway
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/db
      - REDIS_URL=redis://redis:6379
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
    deploy:
      replicas: 3
```

### Scaling Guidelines
- **Ingestion**: 1-2 instances (rate limited by source sites)
- **Processing**: 2-4 instances (CPU intensive)
- **Embedding**: 1-2 instances (API rate limited)
- **Scoring**: 2-3 instances (ML compute)
- **API Gateway**: 3-5 instances (user-facing)
- **Reporting**: 1-2 instances (batch jobs)

### Database Scaling
- **PostgreSQL**: Use read replicas for API queries
- **Qdrant**: Cluster mode for >1M vectors
- **Redis**: Cluster mode for high availability
- **Kafka**: 3+ brokers for production

## Monitoring & Observability

### Health Checks
```bash
# Service health
curl http://localhost:8081/health

# Database health  
docker-compose exec postgres pg_isready

# Kafka health
docker-compose exec kafka kafka-topics.sh --bootstrap-server localhost:9092 --list
```

### Logs
```bash
# View all logs
docker-compose logs -f

# Service-specific logs
docker-compose logs -f api_gateway
docker-compose logs -f scoring_service
```

### Metrics (Production)
- Prometheus + Grafana for metrics
- ELK Stack for log aggregation
- Jaeger for distributed tracing
- Sentry for error tracking

## Security Considerations

### API Security
- JWT authentication with rotation
- Rate limiting per user/IP
- CORS configuration
- Input validation & sanitization

### Data Security  
- Encrypt sensitive data at rest
- Use SSL/TLS for all connections
- Rotate API keys regularly
- Audit logging for payments

### Infrastructure Security
- Container image scanning
- Network policies
- Secrets management (K8s secrets, HashiCorp Vault)
- Regular security updates

## Backup & Recovery

### Data Backup
```bash
# PostgreSQL backup
docker-compose exec postgres pg_dump -U deepneed deepneed_opf > backup.sql

# Qdrant backup
curl -X POST http://localhost:6333/collections/opportunities/snapshots

# Redis backup
docker-compose exec redis redis-cli BGSAVE
```

### Recovery Testing
- Test backup restoration monthly
- Verify data integrity
- Document recovery procedures
- Automate where possible

## Performance Tuning

### Database Optimization
- Index optimization for query patterns
- Connection pooling
- Query optimization
- Partitioning for large tables

### Cache Strategy
- Redis for session data
- Application-level caching
- CDN for static assets
- Query result caching

### Resource Limits
```yaml
services:
  api_gateway:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

## Troubleshooting

### Common Issues

**Services won't start**
```bash
# Check Docker resources
docker system df
docker system prune

# Check logs
docker-compose logs [service_name]
```

**High memory usage**
```bash
# Monitor resource usage
docker stats

# Check for memory leaks
docker-compose exec [service] top
```

**Slow API responses**
- Check database query performance
- Monitor vector search latency
- Review caching effectiveness
- Analyze request patterns

## Cost Optimization

### OpenAI API Costs
- Use embedding caching
- Batch API calls
- Implement fallback to local models
- Monitor token usage

### Infrastructure Costs
- Right-size instances
- Use spot instances for batch processing
- Implement auto-scaling
- Regular cost reviews

## Support & Maintenance

### Regular Tasks
- Model retraining (weekly)
- Database maintenance (monthly)
- Security updates (weekly)
- Performance reviews (monthly)

### Contact
- Technical Issues: tech@deepneed.com
- Business Questions: hello@deepneed.com
- Emergency: +1-XXX-XXX-XXXX