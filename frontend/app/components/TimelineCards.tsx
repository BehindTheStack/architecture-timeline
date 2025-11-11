'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Calendar, Clock, Layers, Tag, TrendingUp, Zap, Database, Globe, ArrowUpRight } from 'lucide-react'
import { getLayerGradient, getLayerName, getLayerIcon, getLayerConfig } from '../lib/layers'

interface TimelineEntry {
  path: string
  title: string
  date: string | null
  layers: string[]
  snippet: string
}

interface TimelineCardsProps {
  entries: TimelineEntry[]
  onPostClick: (entry: TimelineEntry) => void
}

const POSTS_PER_PAGE = 30

export default function TimelineCards({ entries, onPostClick }: TimelineCardsProps) {
  const [loadedPages, setLoadedPages] = useState(1)
  
  // Entries are already sorted by parent component
  const sortedEntries = entries.filter(e => e.date)

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

    const sentinel = document.getElementById('cards-scroll-sentinel')
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

  return (
    <div className="space-y-8">
      {/* Summary Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800/30 border border-gray-700 rounded-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">
              <span className="font-semibold text-white">{sortedEntries.length}</span> posts
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">
              <span className="font-semibold text-white">{new Set(sortedEntries.flatMap(e => e.layers)).size}</span> categories
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Showing {displayedEntries.length} of {sortedEntries.length}
        </div>
      </div>

      {/* Cards Grid - Pinterest/Medium Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayedEntries.map((entry, idx) => {
          const primaryLayer = entry.layers[0] || 'uncategorized'
          const config = getLayerConfig(primaryLayer)

          return (
            <article
              key={`${entry.path}-${idx}`}
              onClick={() => onPostClick(entry)}
              className="group cursor-pointer bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700 hover:border-gray-600 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1"
            >
              {/* Header Banner */}
              <div className={`h-32 bg-gradient-to-br ${config.gradient} relative overflow-hidden`}>
                {/* Animated pattern */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h60v60H0z\' fill=\'none\'/%3E%3Cpath d=\'M30 0v60M0 30h60\' stroke=\'%23fff\' stroke-width=\'0.5\'/%3E%3C/svg%3E")',
                  backgroundSize: '30px 30px'
                }}></div>
                
                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
                    {getLayerName(primaryLayer)}
                  </span>
                </div>

                {/* Date badge */}
                <div className="absolute bottom-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-black/30 backdrop-blur-sm text-white">
                    <Calendar className="w-3 h-3" />
                    {entry.date ? formatDate(entry.date) : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 leading-tight group-hover:text-red-400 transition-colors">
                  {entry.title}
                </h3>

                {/* Snippet */}
                <p className="text-sm text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                  {entry.snippet || 'Explore this architectural insight from Netflix Engineering...'}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                  <div className="flex items-center gap-2">
                    {entry.layers.slice(0, 2).map((layer, i) => {
                      const layerConfig = getLayerConfig(layer)
                      return (
                        <span
                          key={i}
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${layerConfig.bgClass} ${layerConfig.textClass} ${layerConfig.borderClass} border`}
                        >
                          {getLayerName(layer)}
                        </span>
                      )
                    })}
                    {entry.layers.length > 2 && (
                      <span className="text-xs text-gray-500">+{entry.layers.length - 2}</span>
                    )}
                  </div>

                  {/* Read more indicator */}
                  <div className="flex items-center gap-1 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-medium">Read</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Load More */}
      {hasMore && (
        <div id="cards-scroll-sentinel" className="py-8 flex justify-center">
          <button
            onClick={loadMore}
            className="group px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/25 flex items-center gap-2"
          >
            <span>Load More</span>
            <span className="text-sm opacity-75">({sortedEntries.length - displayedEntries.length} remaining)</span>
          </button>
        </div>
      )}

      {/* End Marker */}
      {!hasMore && displayedEntries.length > 0 && (
        <div className="py-12 text-center">
          <div className="inline-flex flex-col items-center gap-3">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-700"></div>
              <span>You've explored all {sortedEntries.length} posts</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gray-700"></div>
            </div>
            <div className="text-xs text-gray-600">
              🎉 Great work! You've reached the end of Netflix's technical timeline
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
