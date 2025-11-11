'use client'

import React, { useState, useMemo } from 'react'
import { Calendar, Clock, Layers, ChevronDown, ChevronUp } from 'lucide-react'

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

const LAYER_COLORS: Record<string, string> = {
  'data': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  'streaming': 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  'video/encoding': 'bg-pink-500/20 text-pink-400 border-pink-500/50',
  'infrastructure': 'bg-green-500/20 text-green-400 border-green-500/50',
  'platform': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  'frontend/ui': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
  'api/backend': 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  'observability': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50',
  'ml/data-science': 'bg-red-500/20 text-red-400 border-red-500/50',
  'security': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
  'uncategorized': 'bg-gray-500/20 text-gray-400 border-gray-500/50',
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
                    const layerColor = LAYER_COLORS[primaryLayer] || LAYER_COLORS['uncategorized']
                    
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
                                className={`text-xs px-2 py-0.5 rounded border ${LAYER_COLORS[layer] || LAYER_COLORS['uncategorized']} whitespace-nowrap`}
                              >
                                {layer}
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
