'use client'

import React from 'react'
import { Code, Heart, Github, Linkedin, Globe, ExternalLink } from 'lucide-react'

export default function Credits() {
  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-xs">
      <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600/20 to-purple-600/20 px-4 py-3 border-b border-gray-700/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Built with</h3>
              <p className="text-xs text-gray-400">BehindTheStack</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Project Info */}
          <div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Exploring Netflix's technical evolution through{' '}
              <span className="text-red-400 font-medium">architecture layers</span> and{' '}
              <span className="text-purple-400 font-medium">engineering blogs</span>.
            </p>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20">
              Next.js 14
            </span>
            <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded border border-green-500/20">
              FastAPI
            </span>
            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded border border-purple-500/20">
              TypeScript
            </span>
            <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded border border-yellow-500/20">
              Python
            </span>
          </div>

          {/* Links */}
          <div className="pt-2 border-t border-gray-700/50">
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/BehindTheStack/medium-scrap"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
              >
                <Github className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" />
                <span className="text-xs text-gray-400 group-hover:text-white">GitHub</span>
                <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-gray-400" />
              </a>
              <a
                href="https://github.com/BehindTheStack"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
              >
                <Globe className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-gray-700/50">
            <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for the tech community
            </p>
            <p className="text-xs text-gray-600 text-center mt-1">
              © 2025 BehindTheStack
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
