# 🎬 Netflix Architecture Timeline

> **Interactive visualization of Netflix's technical evolution through architectural layers**

A production-grade web application that transforms Medium blog posts into an interactive, explorable timeline — showcasing how Netflix's architecture evolved across data, streaming, infrastructure, and more.

![Netflix Timeline Demo](https://img.shields.io/badge/Status-Production%20Ready-success)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-green)
![Version](https://img.shields.io/badge/Version-2.0.0-red)

> 🚀 **v2.0.0 Released!** - **4 visualizações profissionais** inspiradas em Big Techs (Medium, Spotify, Pinterest). Cards modernos, Magazine layout, infinite scroll. [Ver Redesign](./REDESIGN_V2.md)

---

## 🎯 Project Vision

This project demonstrates:
- **Full-stack engineering** with modern TypeScript/React and Python FastAPI
- **Data visualization** expertise using D3.js and vis-timeline
- **System architecture** understanding through real-world case study
- **Production deployment** patterns with Docker and CI/CD readiness

**Perfect for:**
- Senior Engineering positions requiring full-stack + data viz skills
- Technical Leadership roles focused on architecture
- Product Engineering roles in data-driven companies
- Portfolio showcasing production-quality code

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface (Next.js)                  │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Layer Filter│  │  Timeline    │  │ Stats Panel  │       │
│  │  Component  │  │  Viz (D3/Vis)│  │  Component   │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend API (FastAPI)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  /timeline   │  │   /layers    │  │    /stats    │      │
│  │  /search     │  │  /layer/{id} │  │   filtering  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ Timeline JSON │
                  │   (Cached)    │
                  └──────────────┘
```

### Tech Stack

**Frontend:**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first styling
- **vis-timeline** - Timeline visualization library
- **Lucide Icons** - Modern icon set

**Backend:**
- **FastAPI** - High-performance Python API framework
- **Python 3.11+** - Modern Python with type hints
- **Uvicorn** - ASGI server

**Infrastructure:**
- **Docker & Docker Compose** - Containerization
- **GitHub Actions** (ready) - CI/CD pipeline
- **Vercel** (compatible) - Frontend deployment
- **AWS/GCP** (compatible) - Backend deployment

---

## ✨ Key Features

### 1. Multiple Visualization Modes ⭐ NEW!
- **Cards View** - Pinterest/Spotify-inspired cards with gradients (recommended for 700+ posts)
- **Magazine View** - Medium/NY Times editorial layout for immersive reading
- **Compact Grid** - Year-based collapsible view for quick navigation
- **Timeline View** - Classic swimlane visualization with zoom & pan

### 2. Interactive Timeline Visualization
- **Infinite scroll** with auto-loading for smooth browsing
- **Visual hierarchy** with color-coded categories
- **Hover effects** and micro-interactions
- **Responsive design** optimized for desktop, tablet, and mobile

### 3. Advanced Filtering
- **Multi-layer selection** with visual feedback
- **Real-time search** across titles and content
- **Date range filtering** (API-ready)
- **Intelligent keyword matching** with layer classification

### 4. Analytics Dashboard
- **Timeline span** visualization (2010-2025)
- **Posts per year** distribution charts
- **Multi-layer analysis** for cross-cutting concerns
- **Layer statistics** with post counts and date ranges

### 5. Production-Ready Code
- **Type-safe** throughout (TypeScript + Python type hints)
- **Component architecture** with clear separation of concerns
- **Error handling** and loading states
- **Performance optimized** with memo and efficient re-renders

---

## 🚀 Quick Start

### Development Mode (Hot-reload enabled)

```bash
cd webapp

# Start containers with hot-reload
docker compose -f docker-compose.dev.yml up -d

# Or use the script
./restart.sh

# View logs
docker compose -f docker-compose.dev.yml logs -f

# Stop
docker compose -f docker-compose.dev.yml down
```

### Production Mode (Optimized build)

```bash
cd webapp

# Start containers
docker compose up -d

# Or use the script
./start-prod.sh

# View logs
docker compose logs -f

# Stop
docker compose down
```

**URLs:**
- Frontend: http://localhost:3000
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 🏗️ Architecture
- Unit tests: >80%
- Integration tests: API endpoints
- E2E tests: Critical user flows

---

## 🚢 Deployment

### Option 1: Vercel + AWS Lambda

**Frontend (Vercel):**
```bash
cd webapp/frontend
vercel --prod
```

**Backend (AWS Lambda with API Gateway):**
```bash
cd webapp/api
serverless deploy
```

### Option 2: Docker + Cloud Run / ECS

```bash
# Build and push images
docker build -t netflix-timeline-api ./webapp/api
docker build -t netflix-timeline-frontend ./webapp/frontend

# Deploy to GCP Cloud Run / AWS ECS
# (configuration specific to your cloud provider)
```

### Option 3: Single VPS with Nginx

```bash
# Use docker-compose.yml
docker-compose up -d

# Configure Nginx reverse proxy
# API: proxy_pass http://localhost:8000
# Frontend: proxy_pass http://localhost:3000
```

---

## 📝 API Reference

### Endpoints

#### `GET /timeline`
Get timeline entries with optional filtering.

**Query Parameters:**
- `layers` (array): Filter by layers
- `start_date` (string): Filter from date (YYYY-MM-DD)
- `end_date` (string): Filter to date
- `limit` (int): Limit results

**Example:**
```bash
curl "http://localhost:8000/timeline?layers=data&layers=streaming&limit=50"
```

#### `GET /layers`
Get all available layers with metadata.

#### `GET /stats`
Get timeline statistics and distributions.

#### `GET /search?q={query}`
Search posts by keyword.

#### `GET /layer/{layer_name}`
Get all posts for a specific layer with timeline metadata.

**Full API Docs:** `http://localhost:8000/docs`

---

## 🎓 Educational Value

### What This Project Demonstrates

**1. Full-Stack Development**
- Modern React patterns (hooks, context, composition)
- RESTful API design principles
- Type-safe development workflow

**2. Data Visualization**
- Timeline data modeling
- Interactive chart implementation
- Performance optimization for large datasets

**3. System Design**
- Separation of concerns (3-tier architecture)
- Caching strategies
- API design patterns

**4. Production Engineering**
- Dockerization and orchestration
- Environment configuration
- Deployment strategies

**5. UX Engineering**
- Responsive design
- Loading states and error handling
- Accessibility considerations

---

## 🤝 Contributing

This project is designed as a portfolio piece but welcomes improvements:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

MIT License - feel free to use this project as inspiration for your own portfolio!

---

## 👤 About

**Built by:** [Your Name]
**Portfolio:** [your-portfolio.com]
**LinkedIn:** [linkedin.com/in/yourprofile]
**GitHub:** [github.com/yourusername]

---

## 🌟 Showcase This Project

### For Recruiters

This project demonstrates:
- ✅ Full-stack TypeScript/Python proficiency
- ✅ Modern React architecture (Next.js App Router)
- ✅ Data visualization with D3.js/vis-timeline
- ✅ RESTful API design with FastAPI
- ✅ Docker containerization
- ✅ Production-ready code quality
- ✅ System design thinking
- ✅ UI/UX sensitivity

### Use Cases Beyond Netflix

This architecture can be adapted for:
- **Tech Blog Analysis** - Any company's technical blog (Uber, Airbnb, etc.)
- **Product Roadmap Visualization** - Timeline of product launches
- **Research Paper Tracker** - Academic publication timelines
- **Code Repository Evolution** - Visualize Git history
- **Project Management** - Sprint/milestone timelines

---

## 📸 Screenshots

*Add screenshots of your running application here*

---

**⭐ If this project helped you, please give it a star!**
