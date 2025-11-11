'use client'

import React, { useState } from 'react'
import { Calendar, X, ChevronDown, ChevronUp, Tag, ArrowUpDown, Zap, Filter } from 'lucide-react'

interface AdvancedFiltersProps {
  onDateRangeChange: (start: string | null, end: string | null) => void
  onCategoryChange?: (categories: string[]) => void
  onSortChange?: (sort: string) => void
  minDate: string
  maxDate: string
  availableCategories?: string[]
}

/**
 * OPÇÃO 1: "Spotify Controls Style"
 * - Controles compactos com ícones destacados
 * - Seções expansíveis com animações suaves
 * - Badge de "Active" quando tem filtros
 * - Design minimalista e elegante
 */
export default function AdvancedFiltersSpotify({ 
  onDateRangeChange, 
  onCategoryChange,
  onSortChange,
  minDate, 
  maxDate,
  availableCategories = []
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [startYear, setStartYear] = useState<string>('')
  const [endYear, setEndYear] = useState<string>('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>('date-desc')

  const years = React.useMemo(() => {
    if (!minDate || !maxDate) return []
    const start = parseInt(minDate.substring(0, 4))
    const end = parseInt(maxDate.substring(0, 4))
    const yearList = []
    for (let year = start; year <= end; year++) {
      yearList.push(year.toString())
    }
    return yearList
  }, [minDate, maxDate])

  const quickPresets = [
    { label: 'Last Year', years: 1, icon: '1Y' },
    { label: 'Last 3 Years', years: 3, icon: '3Y' },
    { label: 'Last 5 Years', years: 5, icon: '5Y' },
    { label: 'All Time', years: null, icon: '∞' },
  ]

  const handleQuickPreset = (yearsAgo: number | null) => {
    if (yearsAgo === null) {
      setStartYear('')
      setEndYear('')
      onDateRangeChange(null, null)
    } else {
      const currentYear = new Date().getFullYear()
      const startYearValue = (currentYear - yearsAgo + 1).toString()
      setStartYear(startYearValue)
      setEndYear(currentYear.toString())
      onDateRangeChange(`${startYearValue}-01-01`, `${currentYear}-12-31`)
    }
  }

  const handleApply = () => {
    const start = startYear ? `${startYear}-01-01` : null
    const end = endYear ? `${endYear}-12-31` : null
    onDateRangeChange(start, end)
  }

  const handleClear = () => {
    setStartYear('')
    setEndYear('')
    setSelectedCategories([])
    setSortBy('date-desc')
    onDateRangeChange(null, null)
    onCategoryChange?.([])
    onSortChange?.('date-desc')
  }

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]
    setSelectedCategories(newCategories)
    onCategoryChange?.(newCategories)
  }

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort)
    onSortChange?.(newSort)
  }

  const hasActiveFilters = startYear || endYear || selectedCategories.length > 0 || sortBy !== 'date-desc'

  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-800/20 border border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-sm">
      {/* Header - Spotify style with play button aesthetic */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-800/30 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-all ${hasActiveFilters ? 'bg-blue-500/20' : 'bg-gray-700/30 group-hover:bg-gray-700/50'}`}>
            <Filter className={`w-4 h-4 transition-colors ${hasActiveFilters ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'}`} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Advanced Filters</span>
              {hasActiveFilters && (
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full font-medium border border-blue-500/30">
                  Active
                </span>
              )}
            </div>
            {hasActiveFilters && (
              <div className="text-xs text-gray-400 mt-0.5">
                {[
                  startYear || endYear ? '📅 Date' : null,
                  selectedCategories.length > 0 ? `🏷️ ${selectedCategories.length} cats` : null,
                  sortBy !== 'date-desc' ? '🔽 Sorted' : null
                ].filter(Boolean).join(' • ')}
              </div>
            )}
          </div>
        </div>
        <div className={`p-1.5 rounded-full transition-all ${isExpanded ? 'bg-gray-700/50 rotate-180' : 'bg-transparent'}`}>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </button>

      {/* Content - Smooth expand */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-4 animate-fadeIn">
          {/* Quick Presets - Spotify playback controls inspired */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-300 mb-2.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              Quick Select
            </label>
            <div className="grid grid-cols-4 gap-2">
              {quickPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleQuickPreset(preset.years)}
                  className="aspect-square flex flex-col items-center justify-center bg-gray-800/40 hover:bg-gray-700/60 border border-gray-700/50 hover:border-blue-500/50 rounded-xl transition-all group"
                  title={preset.label}
                >
                  <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {preset.icon}
                  </span>
                  <span className="text-xs text-gray-500 group-hover:text-gray-400 mt-1">
                    {preset.label.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range - Compact inline */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-300 mb-2.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              Custom Range
            </label>
            <div className="flex items-center gap-2">
              <select
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              >
                <option value="">From</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <span className="text-gray-600">→</span>
              <select
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              >
                <option value="">To</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort - Compact select */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-300 mb-2.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
            >
              <option value="date-desc">⬇️ Newest First</option>
              <option value="date-asc">⬆️ Oldest First</option>
              <option value="title-asc">🔤 Title (A-Z)</option>
              <option value="title-desc">🔤 Title (Z-A)</option>
            </select>
          </div>

          {/* Categories - Pills */}
          {availableCategories.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-300 mb-2.5">
                <Tag className="w-3.5 h-3.5 text-gray-400" />
                Categories
                {selectedCategories.length > 0 && (
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full font-medium">
                    {selectedCategories.length}
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {availableCategories.slice(0, 12).map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      selectedCategories.includes(category)
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                        : 'bg-gray-800/40 text-gray-400 border-gray-700/50 hover:border-purple-500/30 hover:text-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions - Spotify button style */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleApply}
              disabled={!startYear && !endYear}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700/50 disabled:text-gray-500 text-white text-sm font-bold rounded-full transition-all disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
            >
              Apply Filters
            </button>
            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="px-4 py-2.5 bg-gray-700/50 hover:bg-gray-700 text-white text-sm font-bold rounded-full transition-all flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
