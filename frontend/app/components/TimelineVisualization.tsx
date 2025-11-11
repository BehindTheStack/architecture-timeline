'use client'

import React, { useEffect, useRef } from 'react'
import { Timeline } from 'vis-timeline/standalone'
import 'vis-timeline/styles/vis-timeline-graph2d.css'

interface TimelineEntry {
  path: string
  title: string
  date: string | null
  layers: string[]
  snippet: string
}

interface TimelineVisualizationProps {
  entries: TimelineEntry[]
  onPostClick: (entry: TimelineEntry) => void
}

const LAYER_COLORS: Record<string, string> = {
  'data': '#3b82f6',
  'streaming': '#a855f7',
  'video/encoding': '#ec4899',
  'infrastructure': '#10b981',
  'platform': '#eab308',
  'frontend/ui': '#06b6d4',
  'api/backend': '#f97316',
  'observability': '#6366f1',
  'ml/data-science': '#ef4444',
  'security': '#059669',
  'uncategorized': '#6b7280',
}

export default function TimelineVisualization({ entries, onPostClick }: TimelineVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<Timeline | null>(null)

  useEffect(() => {
    if (!containerRef.current || entries.length === 0) return

    // Limpar timeline anterior se existir
    if (timelineRef.current) {
      timelineRef.current.destroy()
      timelineRef.current = null
    }

    // ESTRATÉGIA BIG TECH: Limitar dados renderizados
    // Renderizar apenas items visíveis + buffer
    const MAX_ITEMS = 200 // Netflix: renderiza apenas viewport + buffer
    const sortedEntries = entries
      .filter(e => e.date !== null)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, MAX_ITEMS) // Top 200 mais recentes

    // Prepare data for vis-timeline
    const items = sortedEntries.map((entry, idx) => {
      const primaryLayer = entry.layers[0] || 'uncategorized'
      const layerColor = LAYER_COLORS[primaryLayer] || LAYER_COLORS['uncategorized']
      
      return {
        id: idx,
        content: entry.title.substring(0, 40) + (entry.title.length > 40 ? '...' : ''),
        start: entry.date as string,
        group: primaryLayer,
        title: `${entry.title}\n${entry.date}`,
        className: 'timeline-item',
        style: `background-color: ${layerColor}; border: 1px solid ${layerColor}; color: white; border-radius: 4px; padding: 4px 8px; font-size: 10px;`,
        entry: entry,
      }
    })

    // Create groups - apenas layers que aparecem nos items filtrados
    const uniqueLayers = Array.from(new Set(sortedEntries.flatMap(e => e.layers))).sort()
    const groups = uniqueLayers.map(layer => {
      const layerColor = LAYER_COLORS[layer] || LAYER_COLORS['uncategorized']
      const count = sortedEntries.filter(e => e.layers.includes(layer)).length
      return {
        id: layer,
        content: `<div style="font-weight: 600; color: ${layerColor}; font-size: 11px;">${layer} (${count})</div>`,
        className: 'timeline-group',
      }
    })

    const options = {
      width: '100%',
      height: '650px',
      margin: {
        item: {
          horizontal: 8,
          vertical: 10
        },
        axis: 8,
      },
      orientation: 'top' as const,
      groupOrder: 'content',
      zoomMin: 1000 * 60 * 60 * 24 * 60, // 2 months
      zoomMax: 1000 * 60 * 60 * 24 * 365 * 20, // 20 years
      stack: true,
      stackSubgroups: false,
      showCurrentTime: false,
      selectable: true,
      multiselect: false,
      tooltip: {
        followMouse: false, // CRÍTICO: Remove lag
        overflowMethod: 'cap' as const,
      },
      verticalScroll: true,
      horizontalScroll: true,
      maxHeight: 650,
      // PERFORMANCE: Reduzir redraws
      onInitialDrawComplete: () => {
        console.log('Timeline loaded:', sortedEntries.length, 'items')
      },
    }

    // Initialize timeline
    const timeline = new Timeline(containerRef.current, items, groups, options)

    // Handle item clicks - DEBOUNCED para evitar lag
    let clickTimeout: NodeJS.Timeout | null = null
    timeline.on('select', (properties) => {
      if (clickTimeout) clearTimeout(clickTimeout)
      
      clickTimeout = setTimeout(() => {
        if (properties.items.length > 0) {
          const item = items.find(i => i.id === properties.items[0])
          if (item && item.entry) {
            onPostClick(item.entry)
          }
        }
      }, 150) // Debounce 150ms
    })

    timelineRef.current = timeline

    return () => {
      if (clickTimeout) clearTimeout(clickTimeout)
      if (timelineRef.current) {
        timelineRef.current.destroy()
        timelineRef.current = null
      }
    }
  }, [entries, onPostClick])

  if (entries.length === 0) {
    return (
      <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-12 text-center">
        <p className="text-gray-400">No posts found matching your criteria.</p>
        <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search query.</p>
      </div>
    )
  }

  const totalPosts = entries.filter(e => e.date).length
  const displayedPosts = Math.min(totalPosts, 200)
  
  return (
    <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Timeline Visualization</h2>
          <p className="text-xs text-gray-400 mt-1">
            Mostrando {displayedPosts} de {totalPosts} posts
            {displayedPosts < totalPosts && ' (mais recentes)'}
          </p>
        </div>
        {displayedPosts < totalPosts && (
          <div className="text-xs text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-md border border-yellow-500/30">
            ⚡ Performance mode: Top {displayedPosts} posts
          </div>
        )}
      </div>
      <div ref={containerRef} className="rounded-lg overflow-hidden border border-gray-700/50 bg-gray-900/50" />
    </div>
  )
}
