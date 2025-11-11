'use client'

import React from 'react'
import { X, Layers, TrendingUp } from 'lucide-react'
import { getLayerGradient, getLayerName, getLayerIcon } from '../lib/layers'

interface LayerInfo {
  name: string
  count: number
  earliest: string | null
  latest: string | null
}

interface LayerFilterProps {
  layers: LayerInfo[]
  selectedLayers: string[]
  onToggleLayer: (layerName: string) => void
}

/**
 * OPÇÃO 1: "Spotify Sidebar Style"
 * - Cards compactos com hover effects
 * - Contadores discretos à direita
 * - Gradientes sutis no hover
 * - Clear all no topo como botão secundário
 */
export default function LayerFilterSpotify({ layers, selectedLayers, onToggleLayer }: LayerFilterProps) {
  const totalPosts = layers.reduce((sum, l) => sum + l.count, 0)
  const selectedCount = selectedLayers.length

  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-800/20 border border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-sm">
      {/* Header - Spotify inspired */}
      <div className="px-5 py-4 border-b border-gray-700/50 bg-gradient-to-r from-red-500/5 to-transparent">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Layers className="w-4 h-4 text-red-400" />
            </div>
            <h2 className="text-base font-bold text-white">Architecture Layers</h2>
          </div>
          {selectedCount > 0 && (
            <button
              onClick={() => selectedLayers.forEach(onToggleLayer)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full transition-all"
            >
              <X className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>
            {totalPosts} posts
            {selectedCount > 0 && (
              <span className="text-red-400 font-medium ml-1">
                • {selectedCount} selected
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Layer List - Compact Cards */}
      <div className="p-4 space-y-1.5">
        {layers.map((layer) => {
          const isSelected = selectedLayers.includes(layer.name)
          const colorClass = getLayerGradient(layer.name)
          const displayName = getLayerName(layer.name)
          const icon = getLayerIcon(layer.name)
          const percentage = ((layer.count / totalPosts) * 100).toFixed(0)

          return (
            <button
              key={layer.name}
              onClick={() => onToggleLayer(layer.name)}
              className={`group w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isSelected
                  ? `bg-gradient-to-r ${colorClass} shadow-lg shadow-red-500/10 scale-[1.02]`
                  : 'bg-gray-800/40 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600 hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Left: Icon + Name */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className={`flex-shrink-0 ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                      {displayName}
                    </div>
                    {layer.earliest && layer.latest && (
                      <div className={`text-xs mt-0.5 ${isSelected ? 'text-white/60' : 'text-gray-500'}`}>
                        {layer.earliest.substring(0, 4)}–{layer.latest.substring(0, 4)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Count + Percentage */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className={`text-right ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                    <div className="text-sm font-bold">{layer.count}</div>
                    <div className="text-xs opacity-70">{percentage}%</div>
                  </div>
                  {isSelected && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>

              {/* Progress bar at bottom */}
              {isSelected && (
                <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white/60 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Footer Stats */}
      {selectedCount > 0 && (
        <div className="px-5 py-3 border-t border-gray-700/50 bg-gray-800/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Active filters:</span>
            <span className="text-red-400 font-bold">{selectedCount} / {layers.length}</span>
          </div>
        </div>
      )}
    </div>
  )
}
