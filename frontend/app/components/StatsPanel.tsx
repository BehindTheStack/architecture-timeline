'use client'

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, Calendar, Layers, Activity, BarChart2, 
  PieChart, Clock, Sparkles, ChevronDown, ChevronUp 
} from 'lucide-react'

interface StatsPanelProps {
  apiBase: string
  selectedLayers: string[]
}

interface Stats {
  total_posts: number
  date_range: {
    earliest: string | null
    latest: string | null
  }
  posts_per_year: Record<string, number>
  layer_distribution: Record<string, number>
  multi_layer_posts: number
  avg_layers_per_post: number
}

export default function StatsPanel({ apiBase, selectedLayers }: StatsPanelProps) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedSection, setExpandedSection] = useState<'years' | 'layers' | null>('years')

  useEffect(() => {
    fetchStats()
  }, [selectedLayers])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${apiBase}/stats`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (section: 'years' | 'layers') => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded-xl"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-700/50 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="text-center text-gray-500">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Failed to load statistics</p>
        </div>
      </div>
    )
  }

  const topYears = Object.entries(stats.posts_per_year)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  const topLayers = Object.entries(stats.layer_distribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  const timelineSpan = stats.date_range.earliest && stats.date_range.latest
    ? parseInt(stats.date_range.latest.substring(0, 4)) - parseInt(stats.date_range.earliest.substring(0, 4))
    : 0

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600/20 to-purple-600/20 border-b border-gray-700 p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Analytics
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </h2>
            <p className="text-xs text-gray-400">Comprehensive timeline insights</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Total Posts */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4 group hover:border-blue-500/40 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <BarChart2 className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.total_posts}</div>
            <div className="text-xs text-gray-400">Total Posts</div>
          </div>

          {/* Timeline Span */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4 group hover:border-green-500/40 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{timelineSpan}+</div>
            <div className="text-xs text-gray-400">Years of Content</div>
          </div>

          {/* Multi-layer Posts */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-4 group hover:border-purple-500/40 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.multi_layer_posts}</div>
            <div className="text-xs text-gray-400">Multi-Category</div>
          </div>

          {/* Avg Layers */}
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-4 group hover:border-orange-500/40 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <PieChart className="w-4 h-4 text-orange-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.avg_layers_per_post.toFixed(1)}</div>
            <div className="text-xs text-gray-400">Avg Categories</div>
          </div>
        </div>

        {/* Date Range Banner */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Timeline Range</span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-white">
              {stats.date_range.earliest?.substring(0, 4)}
            </span>
            <div className="flex-1 h-1 bg-gradient-to-r from-red-500 to-purple-600 rounded-full"></div>
            <span className="text-lg font-bold text-white">
              {stats.date_range.latest?.substring(0, 4)}
            </span>
          </div>
        </div>

        {/* Most Active Years - Collapsible */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('years')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-white">Most Active Years</span>
            </div>
            {expandedSection === 'years' ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {expandedSection === 'years' && (
            <div className="px-4 pb-4 space-y-2.5">
              {topYears.map(([year, count], idx) => {
                const maxCount = topYears[0][1]
                const percentage = (count / maxCount) * 100
                return (
                  <div key={year} className="group">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-300 font-medium">{year}</span>
                      <span className="text-gray-400">{count} posts</span>
                    </div>
                    <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Category Distribution - Collapsible */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('layers')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-white">Top Categories</span>
            </div>
            {expandedSection === 'layers' ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {expandedSection === 'layers' && (
            <div className="px-4 pb-4 space-y-2.5">
              {topLayers.map(([layer, count], idx) => {
                const maxCount = topLayers[0][1]
                const percentage = (count / maxCount) * 100
                
                // Color mapping
                const colors: Record<string, string> = {
                  'data': 'from-blue-500 to-blue-600',
                  'streaming': 'from-purple-500 to-purple-600',
                  'video/encoding': 'from-pink-500 to-pink-600',
                  'infrastructure': 'from-green-500 to-green-600',
                  'ml/data-science': 'from-red-500 to-red-600',
                  'observability': 'from-indigo-500 to-indigo-600',
                  'platform': 'from-yellow-500 to-yellow-600',
                  'frontend/ui': 'from-cyan-500 to-cyan-600',
                }
                const gradient = colors[layer] || 'from-gray-500 to-gray-600'

                return (
                  <div key={layer} className="group">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-300 font-medium truncate">{layer}</span>
                      <span className="text-gray-400">{count}</span>
                    </div>
                    <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            📊 Real-time analytics
          </p>
        </div>
      </div>
    </div>
  )
}
