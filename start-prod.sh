#!/bin/bash

# Production mode (build once, no hot-reload)

echo "🚀 Starting Netflix Timeline WebApp (PRODUCTION MODE)..."

cd "$(dirname "$0")"

echo "📦 Stopping containers..."
docker compose down

echo "🏗️  Building containers..."
docker compose build

echo "🚀 Starting all services..."
docker compose up -d

echo ""
echo "✅ Services started in PRODUCTION mode!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 API:      http://localhost:8000"
echo "📊 API Docs: http://localhost:8000/docs"
echo ""
echo "💡 To see logs:"
echo "   docker compose logs -f"
echo ""
echo "💡 To stop:"
echo "   docker compose down"
