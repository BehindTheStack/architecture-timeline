#!/bin/bash
# Quick Commands - Netflix Architecture Timeline

echo "🎬 Netflix Architecture Timeline - Quick Commands"
echo "=================================================="
echo ""

# Check if running from webapp directory
if [ ! -f "docker-compose.yml" ]; then
    echo "⚠️  Please run this script from the webapp/ directory"
    echo "   cd webapp && ./commands.sh"
    exit 1
fi

show_menu() {
    echo ""
    echo "Choose an option:"
    echo ""
    echo "  1) 🐳 Start with Docker (Recommended)"
    echo "  2) 🔧 Start Backend Only (Development)"
    echo "  3) ⚛️  Start Frontend Only (Development)"
    echo "  4) 📊 Check Status"
    echo "  5) 📝 View API Docs"
    echo "  6) 🧹 Clean Docker Containers"
    echo "  7) 📦 Install Dependencies"
    echo "  8) 🚀 Build for Production"
    echo "  9) ❌ Stop All Services"
    echo "  0) 💡 Show Full Documentation"
    echo ""
    echo "  q) Quit"
    echo ""
    read -p "Enter choice: " choice
    echo ""
    
    case $choice in
        1)
            echo "🐳 Starting with Docker..."
            docker-compose up --build
            ;;
        2)
            echo "🔧 Starting Backend..."
            cd api
            python3 main.py
            ;;
        3)
            echo "⚛️  Starting Frontend..."
            cd frontend
            npm run dev
            ;;
        4)
            echo "📊 Checking Status..."
            echo ""
            echo "Backend (http://localhost:8000):"
            curl -s http://localhost:8000 > /dev/null && echo "✅ Running" || echo "❌ Not running"
            echo ""
            echo "Frontend (http://localhost:3000):"
            curl -s http://localhost:3000 > /dev/null && echo "✅ Running" || echo "❌ Not running"
            echo ""
            echo "Docker Containers:"
            docker-compose ps
            ;;
        5)
            echo "📝 Opening API Documentation..."
            echo ""
            echo "Swagger UI: http://localhost:8000/docs"
            echo "ReDoc: http://localhost:8000/redoc"
            echo ""
            if command -v xdg-open > /dev/null; then
                xdg-open http://localhost:8000/docs
            elif command -v open > /dev/null; then
                open http://localhost:8000/docs
            else
                echo "Please open http://localhost:8000/docs in your browser"
            fi
            ;;
        6)
            echo "🧹 Cleaning Docker..."
            docker-compose down -v
            docker system prune -f
            echo "✅ Cleaned!"
            ;;
        7)
            echo "📦 Installing Dependencies..."
            echo ""
            echo "Backend:"
            cd api && pip install -r requirements.txt && cd ..
            echo ""
            echo "Frontend:"
            cd frontend && npm install && cd ..
            echo ""
            echo "✅ Dependencies installed!"
            ;;
        8)
            echo "🚀 Building for Production..."
            echo ""
            echo "Building Docker images..."
            docker-compose build
            echo ""
            echo "✅ Production build complete!"
            echo ""
            echo "To deploy:"
            echo "  - Frontend: cd frontend && npm run build"
            echo "  - Backend: Already containerized"
            ;;
        9)
            echo "❌ Stopping All Services..."
            docker-compose down
            pkill -f "uvicorn"
            pkill -f "next dev"
            echo "✅ All services stopped!"
            ;;
        0)
            echo "💡 Documentation Files:"
            echo ""
            echo "  📄 README.md       - Complete technical documentation"
            echo "  📄 CASE_STUDY.md   - Career positioning guide"
            echo "  📄 QUICKSTART.md   - Quick setup guide"
            echo "  📄 OVERVIEW.md     - Project summary (Português)"
            echo ""
            echo "Quick Links:"
            echo "  🌐 Frontend:  http://localhost:3000"
            echo "  🔧 API:       http://localhost:8000"
            echo "  📚 API Docs:  http://localhost:8000/docs"
            ;;
        q|Q)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option"
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
    show_menu
}

# Start menu
show_menu
