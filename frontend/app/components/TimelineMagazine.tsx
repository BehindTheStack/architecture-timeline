'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Calendar, Clock, Layers, Tag, ChevronRight, TrendingUp, Zap, Database, Globe } from 'lucide-react'
import { getLayerGradient, getLayerName, getLayerIcon, getLayerConfig } from '../lib/layers'

interface TimelineEntry {
  path: string
  title: string
  date: string | null
  layers: string[]
  snippet: string
}

interface TimelineMagazineProps {
  entries: TimelineEntry[]
  onPostClick: (entry: TimelineEntry) => void
}

const POSTS_PER_PAGE = 24

export default function TimelineMagazine({ entries, onPostClick }: TimelineMagazineProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loadedPages, setLoadedPages] = useState(1)
  
  // Entries are already sorted by parent component
  const sortedEntries = entries.filter(e => e.date)

  // Group posts by year/month for section headers
  const groupedEntries = useMemo(() => {
    const groups: Record<string, TimelineEntry[]> = {}
    
    sortedEntries.forEach(entry => {
      if (!entry.date) return
      const yearMonth = entry.date.substring(0, 7) // YYYY-MM
      if (!groups[yearMonth]) groups[yearMonth] = []
      groups[yearMonth].push(entry)
    })
    
    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
  }, [sortedEntries])

  // Paginated display
  const displayedEntries = useMemo(() => {
    return sortedEntries.slice(0, loadedPages * POSTS_PER_PAGE)
  }, [sortedEntries, loadedPages])

  const hasMore = displayedEntries.length < sortedEntries.length

  const loadMore = () => {
    setLoadedPages(prev => prev + 1)
  }

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    const sentinel = document.getElementById('scroll-sentinel')
    if (sentinel) observer.observe(sentinel)

    return () => {
      if (sentinel) observer.unobserve(sentinel)
    }
  }, [hasMore])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const getYearMonth = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  if (sortedEntries.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-20 text-center backdrop-blur-sm">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
          <p className="text-gray-400">Try adjusting your filters or search query to see more content.</p>
        </div>
      </div>
    )
  }

  // Get current section (year-month)
  let currentSection = ''

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{sortedEntries.length}</div>
              <div className="text-xs text-gray-400">Total Posts</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{groupedEntries.length}</div>
              <div className="text-xs text-gray-400">Time Periods</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {new Set(sortedEntries.flatMap(e => e.layers)).size}
              </div>
              <div className="text-xs text-gray-400">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Magazine Grid */}
      <div className="space-y-12">
        {displayedEntries.map((entry, idx) => {
          const entryYearMonth = entry.date ? getYearMonth(entry.date) : ''
          const showSection = entryYearMonth !== currentSection
          if (showSection) currentSection = entryYearMonth

          const primaryLayer = entry.layers[0] || 'uncategorized'
          const config = getLayerConfig(primaryLayer)

          return (
            <React.Fragment key={`${entry.path}-${idx}`}>
              {/* Section Header */}
              {showSection && (
                <div className="flex items-center gap-4 pt-8 first:pt-0">
                  <div className="flex-shrink-0">
                    <div className="text-3xl font-bold text-white">{entryYearMonth}</div>
                    <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-transparent rounded-full mt-2"></div>
                  </div>
                  <div className="flex-grow h-px bg-gradient-to-r from-gray-700 to-transparent"></div>
                </div>
              )}

              {/* Post Card - Magazine Style */}
              <article
                className="group cursor-pointer"
                onClick={() => onPostClick(entry)}
              >
                <div className="flex gap-6 items-start">
                  {/* Visual Banner */}
                  <div className="flex-shrink-0 w-64 h-40 relative overflow-hidden rounded-xl">
                    <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white/30 transform scale-150">
                          {config.icon}
                        </div>
                      </div>
                    </div>
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10" style={{
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0z\' fill=\'none\'/%3E%3Cpath d=\'M10 0v20M0 10h20\' stroke=\'%23fff\' stroke-width=\'0.5\'/%3E%3C/svg%3E")'
                    }}></div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    {/* Categories */}
                    <div className="flex items-center gap-2 mb-3">
                      {entry.layers.slice(0, 3).map((layer, i) => {
                        const layerConfig = getLayerConfig(layer)
                        return (
                          <span
                            key={i}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${layerConfig.color}-500/20 text-${layerConfig.color}-400 border border-${layerConfig.color}-500/30`}
                          >
                            {layerConfig.icon}
                            {getLayerName(layer)}
                          </span>
                        )
                      })}
                      {entry.layers.length > 3 && (
                        <span className="text-xs text-gray-500">+{entry.layers.length - 3} more</span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors duration-200 leading-tight">
                      {entry.title}
                    </h2>

                    {/* Snippet */}
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                      {entry.snippet || 'Explore this architectural insight from Netflix Engineering...'}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{entry.date ? formatDate(entry.date) : 'Unknown date'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        <span>{entry.layers.length} {entry.layers.length === 1 ? 'layer' : 'layers'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="font-medium">Read more</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </React.Fragment>
          )
        })}
      </div>

      {/* Load More / Infinite Scroll Sentinel */}
      {hasMore && (
        <div id="scroll-sentinel" className="py-8 flex justify-center">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/25"
          >
            Load More Posts ({sortedEntries.length - displayedEntries.length} remaining)
          </button>
        </div>
      )}

      {/* End Marker */}
      {!hasMore && displayedEntries.length > 0 && (
        <div className="py-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <div className="h-px w-12 bg-gray-700"></div>
            <span>You've reached the end</span>
            <div className="h-px w-12 bg-gray-700"></div>
          </div>
        </div>
      )}
    </div>
  )
}
