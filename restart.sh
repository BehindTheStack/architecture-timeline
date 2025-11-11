#!/bin/bash

# Development mode with hot-reload

echo "🔄 Restarting Netflix Timeline WebApp (DEV MODE)..."

cd "$(dirname "$0")"

echo "📦 Stopping containers..."
docker compose -f docker-compose.dev.yml down

echo "🏗️  Building containers..."
docker compose -f docker-compose.dev.yml build

echo "🚀 Starting all services..."
docker compose -f docker-compose.dev.yml up -d

echo ""
echo "✅ Services started in DEV mode!"
echo ""
echo "🌐 Frontend: http://localhost:3000 (hot-reload enabled)"
echo "🔌 API:      http://localhost:8000 (hot-reload enabled)"
echo "📊 API Docs: http://localhost:8000/docs"
echo ""
echo "💡 To see logs:"
echo "   docker compose -f docker-compose.dev.yml logs -f"
echo ""
echo "💡 To stop:"
echo "   docker compose -f docker-compose.dev.yml down"
