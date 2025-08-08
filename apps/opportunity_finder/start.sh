#!/bin/bash

# AI Opportunity Finder - Quick Start Script
# This script starts all services using Docker Compose

set -e

echo "🚀 Starting AI Opportunity Finder v1.0"
echo "======================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install docker-compose."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your API keys and configuration before continuing."
    echo "   Required: OPENAI_API_KEY, STRIPE_SECRET_KEY, JWT_SECRET"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p ./logs
mkdir -p ./data
mkdir -p ./models

# Pull latest images
echo "🐳 Pulling Docker images..."
docker-compose pull

# Start infrastructure services first
echo "🔧 Starting infrastructure services..."
docker-compose up -d redis zookeeper kafka postgres qdrant

# Wait for services to be ready
echo "⏳ Waiting for infrastructure services to be ready..."
sleep 30

# Check if Kafka is ready
echo "🔍 Checking Kafka readiness..."
timeout 60s bash -c 'until docker-compose exec kafka kafka-topics.sh --bootstrap-server localhost:9092 --list &> /dev/null; do sleep 1; done'

# Check if PostgreSQL is ready
echo "🔍 Checking PostgreSQL readiness..."
timeout 60s bash -c 'until docker-compose exec postgres pg_isready -U deepneed &> /dev/null; do sleep 1; done'

# Start application services
echo "🚀 Starting application services..."
docker-compose up -d

# Wait a bit for services to start
sleep 10

# Check service health
echo "🏥 Checking service health..."
services=("ingestion_service" "processing_service" "embedding_service" "scoring_service" "api_gateway" "reporting_service")

for service in "${services[@]}"; do
    if docker-compose ps | grep -q "$service.*Up"; then
        echo "✅ $service is running"
    else
        echo "❌ $service failed to start"
    fi
done

# Display service URLs
echo ""
echo "🌐 Service URLs:"
echo "================================"
echo "API Gateway:     http://localhost:8081"
echo "API Docs:        http://localhost:8081/docs"
echo "Qdrant UI:       http://localhost:6333/dashboard"
echo "Redis:           localhost:6379"
echo "PostgreSQL:      localhost:5433"
echo ""

# Display logs command
echo "📊 To view logs:"
echo "docker-compose logs -f [service_name]"
echo ""

# Display stop command
echo "🛑 To stop all services:"
echo "docker-compose down"
echo ""

echo "✨ AI Opportunity Finder is now running!"
echo "Check the API documentation at: http://localhost:8081/docs"