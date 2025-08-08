#!/bin/bash

# DeepNeed Complete System Startup Script
# Starts both the main website and AI Opportunity Finder microservices

set -e

echo "🚀 Starting DeepNeed Complete System"
echo "===================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create logs directory
mkdir -p ./logs

echo "📝 Starting main web application..."

# Start the main web application (frontend)
echo "Starting frontend development server..."
cd apps/web
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js and npm."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start the frontend in background
npm run dev > ../../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"
cd ../..

# Wait a moment for frontend to start
sleep 3

echo "🔧 Starting AI Opportunity Finder microservices..."

# Start AI Opportunity Finder microservices
cd apps/opportunity_finder

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit apps/opportunity_finder/.env with your API keys:"
    echo "   - OPENAI_API_KEY"
    echo "   - STRIPE_SECRET_KEY"
    echo "   - JWT_SECRET"
    echo ""
    echo "Press Enter after updating the .env file..."
    read -p ""
fi

# Start AI Opportunity Finder services
echo "Starting AI Opportunity Finder microservices..."
./start.sh > ../../logs/opportunity_finder.log 2>&1 &
OPF_PID=$!
echo "✅ AI Opportunity Finder started (PID: $OPF_PID)"
cd ../..

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 20

# Check if services are running
echo "🏥 Checking service health..."

# Check frontend
if curl -f http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend is running at http://localhost:5173"
else
    echo "❌ Frontend is not responding"
fi

# Check AI Opportunity Finder API
if curl -f http://localhost:8081/health > /dev/null 2>&1; then
    echo "✅ AI Opportunity Finder API is running at http://localhost:8081"
else
    echo "❌ AI Opportunity Finder API is not responding"
fi

echo ""
echo "🌐 Service URLs:"
echo "================================"
echo "Main Website:        http://localhost:5173"
echo "AI Opportunity Finder: http://localhost:5173/opportunity-finder"
echo "API Gateway:         http://localhost:8081"
echo "API Documentation:   http://localhost:8081/docs"
echo "Qdrant Dashboard:    http://localhost:6333/dashboard"
echo ""

echo "📊 To view logs:"
echo "Frontend:            tail -f logs/frontend.log"
echo "AI Services:         tail -f logs/opportunity_finder.log"
echo "Docker Services:     cd apps/opportunity_finder && docker-compose logs -f"
echo ""

echo "🛑 To stop all services:"
echo "kill $FRONTEND_PID"
echo "cd apps/opportunity_finder && docker-compose down"
echo ""

echo "✨ DeepNeed Complete System is now running!"
echo "Visit http://localhost:5173 to access the main website with integrated AI Opportunity Finder"

# Keep script running to monitor processes
trap 'echo "Shutting down..."; kill $FRONTEND_PID 2>/dev/null; cd apps/opportunity_finder && docker-compose down 2>/dev/null; exit' INT TERM

# Wait for user interrupt
wait