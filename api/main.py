"""
Netflix Architecture Timeline API
FastAPI backend serving timeline data with filtering and search capabilities.
Production-ready with CORS, caching, and comprehensive endpoints.
"""
from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
from datetime import datetime
import json
from pathlib import Path
from collections import defaultdict
from functools import lru_cache
import hashlib

app = FastAPI(
    title="Netflix Architecture Timeline API",
    description="Explore the evolution of Netflix's technical architecture through time",
    version="1.0.0",
)

# CORS configuration for local development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Try to load refined timeline (ML-reclassified) first, then fallback to original
# Priority: Docker mount refined > repository refined > Docker mount original > repository original
if Path("/data/Netflix_timeline_refined.json").exists():
    TIMELINE_PATH = Path("/data/Netflix_timeline_refined.json")
elif (Path(__file__).resolve().parent.parent.parent / "outputs" / "Netflix_timeline_refined.json").exists():
    TIMELINE_PATH = Path(__file__).resolve().parent.parent.parent / "outputs" / "Netflix_timeline_refined.json"
elif Path("/data/Netflix_timeline.json").exists():
    TIMELINE_PATH = Path("/data/Netflix_timeline.json")
else:
    TIMELINE_PATH = Path(__file__).resolve().parent.parent.parent / "outputs" / "Netflix_timeline.json"

timeline_data = None
timeline_hash = None  # Cache invalidation

@lru_cache(maxsize=128)
def extract_snippet_from_markdown(md_path: str, max_length: int = 200) -> str:
    """Extract a real content snippet from markdown file."""
    try:
        # Handle both local paths and Docker container paths
        path = Path(md_path)
        
        # If path doesn't exist, try converting to Docker mount path
        if not path.exists():
            # Convert /opt/BehindTheStack/medium-scrap/outputs/... to /outputs/...
            path_str = str(path)
            if '/outputs/' in path_str:
                relative_path = path_str.split('/outputs/', 1)[1]
                path = Path(f'/outputs/{relative_path}')
        
        if not path.exists():
            return ""
        
        content = path.read_text(encoding='utf-8')
        
        # Skip title (first # line)
        lines = content.split('\n')
        text_lines = []
        
        for line in lines:
            line = line.strip()
            # Skip empty, markdown syntax, images, links
            if (line and 
                not line.startswith('#') and 
                not line.startswith('!') and
                not line.startswith('[') and
                not line.startswith('*') and
                not line.startswith('-') and
                not line.startswith('>') and
                not line.startswith('`') and
                len(line) > 30):  # Skip very short lines
                text_lines.append(line)
                if len(' '.join(text_lines)) >= max_length:
                    break
        
        snippet = ' '.join(text_lines)
        if len(snippet) > max_length:
            snippet = snippet[:max_length].rsplit(' ', 1)[0] + '...'
        
        return snippet if snippet else "No preview available"
    except Exception:
        return ""


def load_timeline():
    global timeline_data, timeline_hash
    if timeline_data is None:
        with open(TIMELINE_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
            timeline_data = json.loads(content)
            # Generate hash for cache validation
            timeline_hash = hashlib.md5(content.encode()).hexdigest()
        
        # Enhance snippets if they're just "X min read"
        entries = timeline_data.get('entries', timeline_data if isinstance(timeline_data, list) else [])
        for entry in entries:
            snippet = entry.get('snippet', '')
            if snippet and 'min read' in snippet and len(snippet) < 15:
                # Extract real snippet from markdown
                md_path = entry.get('path')
                if md_path:
                    real_snippet = extract_snippet_from_markdown(md_path)
                    if real_snippet:
                        entry['snippet'] = real_snippet
    
    return timeline_data

@app.on_event("startup")
async def startup_event():
    load_timeline()

def add_cache_headers(response: JSONResponse, max_age: int = 3600):
    """Add HTTP cache headers for better performance."""
    response.headers["Cache-Control"] = f"public, max-age={max_age}"
    response.headers["ETag"] = timeline_hash
    return response

@app.get("/")
async def root():
    response = JSONResponse({
        "message": "Netflix Architecture Timeline API",
        "version": "1.0.0",
        "endpoints": {
            "/timeline": "Get all timeline entries with optional filtering",
            "/layers": "Get list of all available layers with post counts",
            "/stats": "Get statistics about the timeline data",
            "/search": "Search posts by keyword",
        }
    })
    return add_cache_headers(response, 86400)  # Cache for 24 hours

@app.get("/timeline")
async def get_timeline(
    layers: Optional[List[str]] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    limit: Optional[int] = Query(None, ge=1),
):
    """
    Get timeline entries with optional filtering.
    
    - **layers**: Filter by one or more layers (e.g., data, streaming, frontend/ui)
    - **start_date**: Filter entries from this date (YYYY-MM-DD)
    - **end_date**: Filter entries until this date (YYYY-MM-DD)
    - **limit**: Limit number of results
    """
    data = load_timeline()
    entries = data['entries']
    
    # Filter by layers
    if layers:
        entries = [
            e for e in entries 
            if any(layer in e['layers'] for layer in layers)
        ]
    
    # Filter by date range
    if start_date:
        entries = [e for e in entries if e['date'] and e['date'] >= start_date]
    
    if end_date:
        entries = [e for e in entries if e['date'] and e['date'] <= end_date]
    
    # Limit results
    if limit:
        entries = entries[:limit]
    
    response = JSONResponse({
        "count": len(entries),
        "entries": entries
    })
    return add_cache_headers(response, 3600)  # Cache for 1 hour

@app.get("/layers")
async def get_layers():
    """Get all available layers with post counts and date ranges."""
    data = load_timeline()
    
    # Handle both old format (per_layer) and new format (entries with layers)
    if 'per_layer' in data:
        # Old format
        per_layer = data['per_layer']
        layer_info = []
        for layer, posts in per_layer.items():
            dates = [p['date'] for p in posts if p['date']]
            layer_info.append({
                "name": layer,
                "count": len(posts),
                "earliest": min(dates) if dates else None,
                "latest": max(dates) if dates else None,
            })
    else:
        # New format: build per_layer from entries
        entries = data.get('entries', data if isinstance(data, list) else [])
        per_layer = defaultdict(list)
        
        for entry in entries:
            layers = entry.get('layers', [])
            for layer in layers:
                per_layer[layer].append(entry)
        
        layer_info = []
        for layer, posts in per_layer.items():
            dates = [p.get('date') for p in posts if p.get('date')]
            layer_info.append({
                "name": layer,
                "count": len(posts),
                "earliest": min(dates) if dates else None,
                "latest": max(dates) if dates else None,
            })
    
    # Sort by count descending
    layer_info.sort(key=lambda x: x['count'], reverse=True)
    
    response = JSONResponse({
        "total_layers": len(layer_info),
        "layers": layer_info
    })
    return add_cache_headers(response, 3600)  # Cache for 1 hour

@app.get("/stats")
async def get_stats():
    """Get comprehensive statistics about the timeline."""
    data = load_timeline()
    entries = data['entries']
    
    # Date range
    dates = [e['date'] for e in entries if e['date']]
    
    # Posts per year
    posts_per_year = defaultdict(int)
    for e in entries:
        if e['date']:
            year = e['date'][:4]
            posts_per_year[year] += 1
    
    # Layer distribution - count posts by layer
    layer_counts = defaultdict(int)
    for e in entries:
        for layer in e.get('layers', []):
            layer_counts[layer] += 1
    
    # Posts with multiple layers
    multi_layer_posts = [e for e in entries if len(e['layers']) > 1]
    
    response = JSONResponse({
        "total_posts": len(entries),
        "date_range": {
            "earliest": min(dates) if dates else None,
            "latest": max(dates) if dates else None,
        },
        "posts_per_year": dict(sorted(posts_per_year.items())),
        "layer_distribution": dict(sorted(layer_counts.items(), key=lambda x: x[1], reverse=True)),
        "multi_layer_posts": len(multi_layer_posts),
        "avg_layers_per_post": sum(len(e['layers']) for e in entries) / len(entries) if entries else 0,
    })
    return add_cache_headers(response, 3600)  # Cache for 1 hour

@app.get("/search")
async def search_posts(
    q: str = Query(..., min_length=2),
    layers: Optional[List[str]] = Query(None),
):
    """
    Search posts by keyword in title and snippet.
    
    - **q**: Search query (minimum 2 characters)
    - **layers**: Optional layer filter
    """
    data = load_timeline()
    entries = data['entries']
    
    q_lower = q.lower()
    
    # Search in title and snippet
    results = [
        e for e in entries
        if q_lower in e['title'].lower() or q_lower in e['snippet'].lower()
    ]
    
    # Filter by layers if provided
    if layers:
        results = [
            e for e in results
            if any(layer in e['layers'] for layer in layers)
        ]
    
    response = JSONResponse({
        "query": q,
        "count": len(results),
        "results": results
    })
    # Shorter cache for search (5 minutes)
    return add_cache_headers(response, 300)

@app.get("/layer/{layer_name}")
async def get_layer_timeline(layer_name: str):
    """Get all posts for a specific layer with timeline metadata."""
    data = load_timeline()
    per_layer = data['per_layer']
    
    if layer_name not in per_layer:
        raise HTTPException(status_code=404, detail=f"Layer '{layer_name}' not found")
    
    posts = per_layer[layer_name]
    dates = [p['date'] for p in posts if p['date']]
    
    # Group by year
    by_year = defaultdict(list)
    for post in posts:
        if post['date']:
            year = post['date'][:4]
            by_year[year].append(post)
    
    return {
        "layer": layer_name,
        "total_posts": len(posts),
        "date_range": {
            "earliest": min(dates) if dates else None,
            "latest": max(dates) if dates else None,
        },
        "posts_by_year": dict(sorted(by_year.items())),
        "posts": posts
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
