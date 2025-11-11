'use client'

import React from 'react'
import { Code, Heart, Github, ExternalLink, Sparkles } from 'lucide-react'

/**
 * OPÇÃO 2: GitHub Footer Style
 * Design horizontal minimalista na parte inferior
 * Inspiração: GitHub, GitLab, Notion
 */
export default function CreditsFooter() {
  
  function getCurrentYear() {
    /* Get the current year */
    return new Date().getFullYear();
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-800/50 bg-black/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Branding */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Architecture Timeline</p>
              <p className="text-xs text-gray-500">by BehindTheStack</p>
            </div>
          </div>

          {/* Center: Tech Stack */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Built with</span>
            <div className="flex gap-1.5">
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20">
                Next.js
              </span>
              <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded border border-green-500/20">
                FastAPI
              </span>
              <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded border border-purple-500/20">
                TypeScript
              </span>
            </div>
          </div>

          {/* Right: Links & Copyright */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/BehindTheStack/architecture-timeline"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors group"
            >
              <Github className="w-4 h-4" />
              <span>View Source</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              <span>© {getCurrentYear()}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
