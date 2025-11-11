'use client'

import React from 'react'
import { X, ExternalLink, Calendar, Tag } from 'lucide-react'
import { getLayerConfig, getLayerName } from '../lib/layers'

interface TimelineEntry {
  path: string
  title: string
  date: string | null
  layers: string[]
  snippet: string
}

interface PostDetailProps {
  post: TimelineEntry
  onClose: () => void
}

/**
 * Helper to get layer color classes (combines bg, text, border)
 */
const getLayerColorClasses = (layerId: string): string => {
  const config = getLayerConfig(layerId)
  return `${config.bgClass} ${config.textClass} ${config.borderClass}`
}

export default function PostDetail({ post, onClose }: PostDetailProps) {
  // Extrair ID do post do caminho do arquivo
  // Formato: /path/to/POST_ID_Title.md
  const extractPostUrl = (path: string): string => {
    const filename = path.split('/').pop() || ''
    const postId = filename.split('_')[0]
    
    // Construir URL do Medium
    // Formato: https://netflixtechblog.medium.com/TITLE-POST_ID
    const titleSlug = post.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 60)
    
    return `https://netflixtechblog.medium.com/${titleSlug}-${postId}`
  }

  const mediumUrl = extractPostUrl(post.path)

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-bold text-white mb-3">{post.title}</h2>
              
              {post.date && (
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              )}
            </div>
            
            <button
              onClick={onClose}
              className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Layers */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Tag className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-300">Architecture Layers</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.layers.map((layer) => (
                <span
                  key={layer}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${getLayerColorClasses(layer)}`}
                >
                  {getLayerName(layer)}
                </span>
              ))}
            </div>
          </div>

          {/* Snippet */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Content Preview</h3>
            <p className="text-gray-400 leading-relaxed">{post.snippet}</p>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-700">
            <a
              href={mediumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Full Post on Medium</span>
            </a>
            
            <p className="text-xs text-gray-500 mt-3">
              Medium URL: <code className="bg-gray-800 px-2 py-1 rounded text-xs">{mediumUrl}</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
