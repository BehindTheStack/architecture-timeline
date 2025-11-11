'use client'

import React, { useState, useMemo } from 'react'
import { Calendar, Clock, Layers, ChevronDown, ChevronUp } from 'lucide-react'
import { getLayerConfig, getLayerName } from '../lib/layers'

interface TimelineEntry {
  path: string
  title: string
  date: string | null
  layers: string[]
  snippet: string
}

interface TimelineGridProps {
  entries: TimelineEntry[]
  onPostClick: (entry: TimelineEntry) => void
}

/**
 * Helper to get layer color classes (combines bg, text, border)
 */
const getLayerColorClasses = (layerId: string): string => {
  const config = getLayerConfig(layerId)
  return `${config.bgClass} ${config.textClass} ${config.borderClass}`
}

export default function TimelineGrid({ entries, onPostClick }: TimelineGridProps) {
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set(['2024', '2025']))
  
  // Agrupar posts por ano
  const groupedByYear = useMemo(() => {
    const groups: Record<string, TimelineEntry[]> = {}
    
    entries
      .filter(e => e.date)
      .forEach(entry => {
        const year = entry.date!.substring(0, 4)
        if (!groups[year]) groups[year] = []
        groups[year].push(entry)
      })
    
    // Ordenar anos decrescente
    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([year, posts]) => ({
        year,
        posts: posts.sort((a, b) => (b.date || '').localeCompare(a.date || '')),
        count: posts.length
      }))
  }, [entries])

  const toggleYear = (year: string) => {
    setExpandedYears(prev => {
      const next = new Set(prev)
      if (next.has(year)) {
        next.delete(year)
      } else {
        next.add(year)
      }
      return next
    })
  }

  const totalPosts = entries.filter(e => e.date).length

  if (totalPosts === 0) {
    return (
      <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-12 text-center">
        <p className="text-gray-400">No posts found matching your criteria.</p>
        <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search query.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Timeline View</h2>
        <p className="text-xs text-gray-400 mt-1">
          {totalPosts} posts organizados por ano • Clique para expandir/colapsar
        </p>
      </div>

      {/* Timeline por Ano */}
      <div className="space-y-3">
        {groupedByYear.map(({ year, posts, count }) => {
          const isExpanded = expandedYears.has(year)
          
          return (
            <div key={year} className="border border-gray-700 rounded-lg overflow-hidden">
              {/* Year Header */}
              <button
                onClick={() => toggleYear(year)}
                className="w-full bg-gray-800/50 hover:bg-gray-700/50 px-4 py-3 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-red-500" />
                  <span className="text-lg font-bold text-white">{year}</span>
                  <span className="text-sm text-gray-400">
                    {count} post{count !== 1 ? 's' : ''}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Posts Grid */}
              {isExpanded && (
                <div className="p-3 space-y-2 bg-gray-900/30">
                  {posts.map((post, idx) => {
                    const primaryLayer = post.layers[0] || 'uncategorized'
                    const layerColor = getLayerColorClasses(primaryLayer)
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => onPostClick(post)}
                        className="w-full text-left bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-red-500/50 rounded-lg p-3 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-white group-hover:text-red-400 transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>{post.date}</span>
                              <span className="text-gray-600">•</span>
                              <Layers className="w-3 h-3" />
                              <span>{post.layers.length} layer{post.layers.length !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            {post.layers.slice(0, 2).map((layer, i) => (
                              <span
                                key={i}
                                className={`text-xs px-2 py-0.5 rounded border ${getLayerColorClasses(layer)} whitespace-nowrap`}
                              >
                                {getLayerName(layer)}
                              </span>
                            ))}
                            {post.layers.length > 2 && (
                              <span className="text-xs text-gray-500 px-2">
                                +{post.layers.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
