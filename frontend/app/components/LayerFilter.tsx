'use client'

import React from 'react'
import { X, Filter } from 'lucide-react'
import { getLayerGradient, getLayerName } from '../lib/layers'

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

export default function LayerFilter({ layers, selectedLayers, onToggleLayer }: LayerFilterProps) {
  return (
    <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5 backdrop-blur-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-semibold text-white">Architecture Layers</h2>
      </div>

      <div className="space-y-2">
        {layers.map((layer) => {
          const isSelected = selectedLayers.includes(layer.name)
          const colorClass = getLayerGradient(layer.name)
          const displayName = getLayerName(layer.name)

          return (
            <button
              key={layer.name}
              onClick={() => onToggleLayer(layer.name)}
              className={`w-full text-left px-3 py-2 rounded-md transition-all duration-150 ${
                isSelected
                  ? `bg-gradient-to-r ${colorClass} shadow-md`
                  : 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                  {displayName}
                </span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded ml-2 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {layer.count}
                </span>
              </div>

              {layer.earliest && layer.latest && (
                <div className={`text-xs mt-1 ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                  {layer.earliest.substring(0, 4)} - {layer.latest.substring(0, 4)}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {selectedLayers.length > 0 && (
        <button
          onClick={() => selectedLayers.forEach(onToggleLayer)}
          className="w-full mt-3 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-md transition-all border border-red-400/30"
        >
          <X className="w-3.5 h-3.5" /> Clear ({selectedLayers.length})
        </button>
      )}
    </div>
  )
}
