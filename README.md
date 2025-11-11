# 🏗️ Architecture Timeline

> A modern, interactive web application for exploring Netflix's technical evolution through architecture layers and engineering blog posts.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## 🎯 Overview

**Architecture Timeline** is a BigTech-inspired web application that visualizes 700+ Netflix engineering blog posts across multiple architecture layers and categories. Built with modern web technologies, it offers four distinct visualization modes inspired by industry-leading platforms like Pinterest, Medium, and Spotify.

### ✨ Key Features

- **🎨 4 Visualization Modes**
  - **Cards View** - Pinterest-style infinite scroll with gradient cards
  - **Magazine View** - Medium-inspired editorial layout with large banners
  - **Grid View** - Year-collapsible compact timeline
  - **Classic Timeline** - Interactive swimlane visualization

- **📊 Advanced Analytics**
  - Real-time statistics with gradient cards
  - Collapsible sections for top years and categories
  - Layer distribution analysis
  - Temporal trend insights

- **🔍 Smart Filtering**
  - Multi-layer architecture filtering (Presentation, Application, Domain, Infrastructure, ML)
  - Date range filtering with quick presets (Last Year, Last 3/5 Years, All Time)
  - Category multi-select with visual chips
  - Sort options (Newest/Oldest, Title A-Z/Z-A)
  - Full-text search across titles and content
  - Real-time filter updates with 300ms debounce

- **🎭 Modern UI/UX**
  - GitHub-style footer with tech stack and credits
  - Gradient-based color coding by category
  - Responsive design for all screen sizes
  - Dark mode optimized
  - Smooth animations and transitions
  - BigTech-inspired design patterns

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Git

### Development Setup

1. **Clone the repository**
```bash
git clone git@github.com:BehindTheStack/architecture-timeline.git
cd architecture-timeline
```

2. **Start development environment**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

3. **Access the application**
- Frontend: http://localhost:3000
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

4. **Hot-reload is enabled!** 🔥
   - Frontend changes auto-reload instantly
   - Backend changes auto-reload with uvicorn --reload

### Production Setup

```bash
docker-compose up -d
```

## 📁 Project Structure

```
webapp/
├── frontend/                 # Next.js 14 Application
│   ├── app/
│   │   ├── components/      # React Components
│   │   │   ├── TimelineCards.tsx       # Pinterest-style cards
│   │   │   ├── TimelineMagazine.tsx    # Medium editorial layout
│   │   │   ├── TimelineGrid.tsx        # Year-collapsible grid
│   │   │   ├── TimelineVisualization.tsx # Classic timeline
│   │   │   ├── StatsPanel.tsx          # Analytics dashboard
│   │   │   ├── AdvancedFilters.tsx     # Smart filters with presets
│   │   │   ├── LayerFilter.tsx         # Architecture layer filters
│   │   │   ├── PostDetail.tsx          # Modal with full post
│   │   │   └── CreditsFooter.tsx       # GitHub-style footer
│   │   ├── page.tsx         # Main page component
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   ├── Dockerfile           # Production build
│   ├── Dockerfile.dev       # Development build
│   └── package.json
│
├── api/                     # FastAPI Backend
│   ├── main.py              # API routes and logic
│   ├── Dockerfile           # Production build
│   ├── Dockerfile.dev       # Development build
│   └── requirements.txt
│
├── docker-compose.yml       # Production compose
├── docker-compose.dev.yml   # Development compose
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Timeline**: vis-timeline
- **State**: React Hooks

### Backend
- **Framework**: FastAPI 0.100+
- **Language**: Python 3.11
- **Server**: Uvicorn with uvloop & httptools
- **Performance**: Multi-stage Docker builds

### DevOps
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose
- **Development**: Hot-reload enabled for both services
- **Production**: Optimized standalone builds (~150MB frontend, ~180MB backend)

## 📊 Data Structure

### Architecture Layers
Posts are classified across 5 layers:
- **Presentation Layer** - UI/UX, frontends, mobile apps
- **Application Layer** - Business logic, microservices
- **Domain Layer** - Core domain models and logic
- **Infrastructure Layer** - Databases, caching, messaging
- **ML Layer** - Machine learning, AI, recommendation systems

### Post Categories (10+)
- Engineering Culture
- System Design
- Performance
- Security
- Data Engineering
- DevOps
- Testing
- Mobile
- And more...

## 🎨 Design Inspirations

This project follows BigTech design standards, inspired by:
- **Pinterest** - Masonry card layout with infinite scroll
- **Medium** - Editorial magazine layout with large imagery
- **Spotify** - Credits presentation and dark theme
- **Netflix** - Color palette and gradient usage

## 🔧 Configuration

### Environment Variables

**Frontend** (`frontend/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend** (`api/.env`):
```bash
# No additional configuration required
```

### Docker Compose Options

**Development** (with hot-reload):
```bash
docker-compose -f docker-compose.dev.yml up -d
```

**Production** (optimized builds):
```bash
docker-compose up -d
```

**Rebuild after dependency changes**:
```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

## 📈 Performance Optimizations

- **Frontend**: Next.js standalone output, SWC minification, automatic code splitting
- **Backend**: uvloop for faster async I/O, httptools for faster HTTP parsing
- **Docker**: Multi-stage builds with layer caching, minimal base images
- **Caching**: Multi-layer strategy (in-memory, LRU, HTTP headers) - see [PERFORMANCE.md](PERFORMANCE.md)

## 🏗️ Architecture Layer Configuration

The application uses a centralized layer configuration system that synchronizes with the ML classification pipeline. All layer definitions, colors, and metadata are managed in `frontend/app/lib/layers.ts`.

**Current Layers (9 ML-classified)**:
- Backend APIs (Orange)
- Video Streaming (Pink)
- Platform Tooling (Yellow)
- Data Infrastructure (Blue)
- Observability (Indigo)
- Engineering Culture (Purple)
- Performance (Red)
- Distributed Systems (Green)
- Cloud Infrastructure (Cyan)

**📚 For detailed information on layer management, synchronization with the ML pipeline, and how to update layers after retraining, see [LAYER_CONFIGURATION.md](LAYER_CONFIGURATION.md)**
- **UI**: Infinite scroll pagination (30 posts/page), lazy loading, debounced search
- **Filtering**: Client-side sorting and filtering for instant response
- **Data**: JSON-based storage with in-memory caching

## 🎬 Screenshots

### Cards View (Pinterest-inspired)
Modern card layout with infinite scroll and gradient accents.

### Magazine View (Medium-inspired)
Editorial layout with large banners perfect for immersive reading.

### Advanced Filters
Quick presets, category selection, and sort options.

## 📊 API Endpoints

### `GET /timeline`
Get all timeline entries with optional layer filtering.

**Query Parameters:**
- `layers` (array): Filter by architecture layers

**Response:**
```json
{
  "entries": [
    {
      "path": "string",
      "title": "string",
      "date": "2024-01-01",
      "layers": ["Application", "Infrastructure"],
      "snippet": "string"
    }
  ]
}
```

### `GET /layers`
Get all available architecture layers with metadata.

**Response:**
```json
{
  "layers": [
    {
      "name": "Application Layer",
      "count": 150,
      "earliest": "2010-01-01",
      "latest": "2024-12-31"
    }
  ]
}
```

### `GET /stats`
Get comprehensive statistics about the timeline.

**Query Parameters:**
- `layers` (array): Filter statistics by layers

**Response:**
```json
{
  "total_posts": 541,
  "date_range": {
    "earliest": "2010-01-01",
    "latest": "2024-12-31"
  },
  "layer_distribution": {
    "Application Layer": 150
  },
  "top_years": [
    {"year": "2023", "count": 45}
  ],
  "top_categories": [
    {"category": "System Design", "count": 78}
  ]
}
```

### `GET /search?q={query}`
Full-text search across posts.

**Query Parameters:**
- `q` (string): Search query
- `layers` (array): Optional layer filtering

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Usage and Attribution

This project is **open source** and **free to use** for:
- ✅ Personal projects and learning
- ✅ Commercial applications
- ✅ Portfolio demonstrations
- ✅ Educational purposes
- ✅ Research and analysis

**We encourage:**
- 🌟 **Star this repository** if you find it useful
- 🔗 **Link back** to this project in your README or about page
- 💬 **Share** what you built with it!
- 🤝 **Contribute** improvements back to the community

**Optional Attribution:**
```markdown
Built with [Architecture Timeline](https://github.com/BehindTheStack/architecture-timeline) by BehindTheStack
```

**No attribution required**, but greatly appreciated! ❤️

### What You Can Do
- ✅ Use this code in your own projects
- ✅ Modify and adapt for your needs
- ✅ Create derivative works
- ✅ Use commercially without fees
- ✅ Fork and create your own version

### Data Source
The Netflix blog posts data is publicly available from [Netflix Tech Blog](https://netflixtechblog.com/). This project provides a visualization layer for educational and analysis purposes.

## 🎯 Roadmap

- [ ] Export timeline as PNG/PDF
- [ ] Social sharing features
- [ ] User annotations and bookmarks
- [ ] GraphQL API support
- [ ] Real-time collaboration features
- [ ] AI-powered post recommendations
- [ ] Advanced data visualizations (D3.js charts)

## 📧 Contact

**BehindTheStack** - [@BehindTheStack](https://github.com/BehindTheStack)

Project Link: [https://github.com/BehindTheStack/architecture-timeline](https://github.com/BehindTheStack/architecture-timeline)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/BehindTheStack">BehindTheStack</a>
</p>

<p align="center">
  <sub>Exploring tech evolution, one blog post at a time 🚀</sub>
</p>
