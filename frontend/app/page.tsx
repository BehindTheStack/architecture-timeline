'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Search, BarChart3, Calendar, Layers, Grid3x3, LayoutGrid, BookOpen } from 'lucide-react'
import TimelineVisualization from './components/TimelineVisualization'
import TimelineGrid from './components/TimelineGrid'
import TimelineMagazine from './components/TimelineMagazine'
import TimelineCards from './components/TimelineCards'
import LayerFilter from './components/LayerFilter'
import StatsPanel from './components/StatsPanel'
import PostDetail from './components/PostDetail'
import AdvancedFilters from './components/AdvancedFilters'
import CreditsFooter from './components/CreditsFooter'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface TimelineEntry {
  path: string
  title: string
  date: string | null
  layers: string[]
  snippet: string
}

interface LayerInfo {
  name: string
  count: number
  earliest: string | null
  latest: string | null
}

export default function Home() {
  const [entries, setEntries] = useState<TimelineEntry[]>([])
  const [allEntries, setAllEntries] = useState<TimelineEntry[]>([]) // Store all entries for client-side filtering
  const [layers, setLayers] = useState<LayerInfo[]>([])
  const [selectedLayers, setSelectedLayers] = useState<string[]>([])
  const [selectedPost, setSelectedPost] = useState<TimelineEntry | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showStats, setShowStats] = useState(false)
  const [viewMode, setViewMode] = useState<'cards' | 'magazine' | 'grid' | 'timeline'>('cards') // Cards é o novo padrão BigTech
  const [dateRange, setDateRange] = useState<{ startYear: number | null; endYear: number | null }>({ 
    startYear: null, 
    endYear: null 
  })
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>('date-desc')

  useEffect(() => {
    fetchLayers()
    fetchTimeline()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchPosts()
      } else {
        fetchTimeline()
      }
    }, 300) // Debounce 300ms

    return () => clearTimeout(timer)
  }, [selectedLayers, searchQuery, dateRange, sortBy])

  const fetchLayers = async () => {
    try {
      const response = await fetch(`${API_BASE}/layers`)
      const data = await response.json()
      setLayers(data.layers)
    } catch (error) {
      console.error('Failed to fetch layers:', error)
    }
  }

  const fetchTimeline = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      selectedLayers.forEach(layer => params.append('layers', layer))

      const response = await fetch(`${API_BASE}/timeline?${params}`)
      const data = await response.json()
      
      // Store all entries for category extraction
      setAllEntries(data.entries)
      
      // Apply date range filter client-side
      let filteredEntries = data.entries
      if (dateRange.startYear || dateRange.endYear) {
        filteredEntries = filteredEntries.filter((entry: TimelineEntry) => {
          if (!entry.date) return false
          const year = new Date(entry.date).getFullYear()
          if (dateRange.startYear && year < dateRange.startYear) return false
          if (dateRange.endYear && year > dateRange.endYear) return false
          return true
        })
      }
      
      // Apply sorting
      const sortedEntries = sortEntries(filteredEntries)
      
      setEntries(sortedEntries)
    } catch (error) {
      console.error('Failed to fetch timeline:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchPosts = async () => {
    if (searchQuery.length < 2) {
      fetchTimeline()
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams({ q: searchQuery })
      selectedLayers.forEach(layer => params.append('layers', layer))

      const response = await fetch(`${API_BASE}/search?${params}`)
      const data = await response.json()
      
      // Apply date range filter client-side
      let filteredResults = data.results
      if (dateRange.startYear || dateRange.endYear) {
        filteredResults = filteredResults.filter((entry: TimelineEntry) => {
          if (!entry.date) return false
          const year = new Date(entry.date).getFullYear()
          if (dateRange.startYear && year < dateRange.startYear) return false
          if (dateRange.endYear && year > dateRange.endYear) return false
          return true
        })
      }
      
      setEntries(filteredResults)
    } catch (error) {
      console.error('Failed to search posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleLayer = (layerName: string) => {
    setSelectedLayers(prev =>
      prev.includes(layerName)
        ? prev.filter(l => l !== layerName)
        : [...prev, layerName]
    )
  }

  const handlePostClick = (entry: TimelineEntry) => {
    setSelectedPost(entry)
  }

  const handleDateRangeChange = (startYear: string | null, endYear: string | null) => {
    setDateRange({ 
      startYear: startYear ? parseInt(startYear) : null, 
      endYear: endYear ? parseInt(endYear) : null 
    })
  }

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
  }

  // Apply client-side sorting
  const sortEntries = (entriesToSort: TimelineEntry[]) => {
    const sorted = [...entriesToSort]
    switch (sortBy) {
      case 'date-desc':
        return sorted.sort((a, b) => {
          if (!a.date) return 1
          if (!b.date) return -1
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
      case 'date-asc':
        return sorted.sort((a, b) => {
          if (!a.date) return 1
          if (!b.date) return -1
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        })
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title))
      default:
        return sorted
    }
  }

  // Get unique categories from entries
  const availableCategories = React.useMemo(() => {
    const categories = new Set<string>()
    allEntries.forEach(entry => {
      // Extract category from title or use a default
      // This is a simple heuristic - adjust based on your data structure
      const match = entry.title.match(/\[(.*?)\]/)
      if (match) {
        categories.add(match[1])
      }
    })
    return Array.from(categories).sort()
  }, [allEntries])

  // Calculate min and max years from entries
  const getYearRange = () => {
    const years = entries
      .filter(e => e.date)
      .map(e => new Date(e.date!).getFullYear())
    return {
      minYear: years.length > 0 ? Math.min(...years) : 2010,
      maxYear: years.length > 0 ? Math.max(...years) : new Date().getFullYear()
    }
  }

  const { minYear, maxYear } = getYearRange()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                  Netflix Architecture Timeline
                </h1>
                <p className="text-sm text-gray-400">
                  Explore {entries.length} technical posts across {layers.length} architecture layers
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-800 rounded-lg p-1 gap-0.5">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded transition-colors ${viewMode === 'cards'
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white'
                    }`}
                  title="Cards View (Recommended)"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('magazine')}
                  className={`p-2 rounded transition-colors ${viewMode === 'magazine'
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white'
                    }`}
                  title="Magazine View"
                >
                  <BookOpen className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${viewMode === 'grid'
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white'
                    }`}
                  title="Compact Grid View"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
              </div>

              {/* Statistics Toggle Button */}
              <button
                onClick={() => setShowStats(!showStats)}
                className={`group relative px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${showStats
                    ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-lg shadow-red-500/25'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                  }`}
                title="Toggle Analytics"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Analytics</span>
                {showStats && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-11 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
              />
            </div>
            {!loading && entries.length > 0 && (
              <div className="flex items-center justify-between">
                {viewMode === 'timeline' && entries.length > 300 && (
                  <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/30">
                    ⚠️ {entries.length} posts - Cards/Magazine View recomendados
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <LayerFilter
              layers={layers}
              selectedLayers={selectedLayers}
              onToggleLayer={toggleLayer}
            />

            <AdvancedFilters
              onDateRangeChange={handleDateRangeChange}
              onCategoryChange={handleCategoryChange}
              onSortChange={handleSortChange}
              minDate={`${minYear}-01-01`}
              maxDate={`${maxYear}-12-31`}
              availableCategories={availableCategories}
            />

            {showStats && (
              <StatsPanel
                apiBase={API_BASE}
                selectedLayers={selectedLayers}
              />
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <>
                {viewMode === 'cards' && (
                  <TimelineCards
                    entries={entries}
                    onPostClick={handlePostClick}
                  />
                )}
                {viewMode === 'magazine' && (
                  <TimelineMagazine
                    entries={entries}
                    onPostClick={handlePostClick}
                  />
                )}
                {viewMode === 'grid' && (
                  <TimelineGrid
                    entries={entries}
                    onPostClick={handlePostClick}
                  />
                )}
                {viewMode === 'timeline' && (
                  <TimelineVisualization
                    entries={entries}
                    onPostClick={handlePostClick}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetail
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}

      {/* Credits - GitHub Footer Style */}
      <CreditsFooter />
    </div>
  )
}
