'use client'

import React, { useState } from 'react'
import { Calendar, Filter, X, ChevronDown, ChevronUp, Tag, ArrowUpDown, Zap } from 'lucide-react'

interface AdvancedFiltersProps {
  onDateRangeChange: (start: string | null, end: string | null) => void
  onCategoryChange?: (categories: string[]) => void
  onSortChange?: (sort: string) => void
  minDate: string
  maxDate: string
  availableCategories?: string[]
}

export default function AdvancedFilters({ 
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

  // Quick preset ranges
  const quickPresets = [
    { label: 'Last Year', years: 1 },
    { label: 'Last 3 Years', years: 3 },
    { label: 'Last 5 Years', years: 5 },
    { label: 'All Time', years: null },
  ]

  const handleQuickPreset = (yearsAgo: number | null) => {
    if (yearsAgo === null) {
      // All time
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
    <div className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-white">Advanced Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
              Active
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Quick Presets */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <label className="text-xs font-medium text-gray-300">Quick Presets</label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleQuickPreset(preset.years)}
                  className="px-3 py-2 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/50 hover:border-blue-500/50 rounded-lg text-xs text-gray-300 hover:text-white transition-all"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <label className="text-xs font-medium text-gray-300">Custom Range</label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Start Year */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">From</label>
                <select
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* End Year */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">To</label>
                <select
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <label className="text-xs font-medium text-gray-300">Sort By</label>
            </div>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
          </div>

          {/* Category Filter */}
          {availableCategories.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-3.5 h-3.5 text-gray-400" />
                <label className="text-xs font-medium text-gray-300">Categories</label>
                {selectedCategories.length > 0 && (
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                    {selectedCategories.length}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {availableCategories.slice(0, 10).map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                      selectedCategories.includes(category)
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                        : 'bg-gray-700/30 text-gray-400 border-gray-600/50 hover:border-purple-500/30 hover:text-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleApply}
              disabled={!startYear && !endYear}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              Apply
            </button>
            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>

          {/* Info */}
          {hasActiveFilters && (
            <div className="pt-2 border-t border-gray-700 space-y-1">
              {(startYear || endYear) && (
                <p className="text-xs text-gray-500">
                  📅 Range: <span className="text-blue-400 font-medium">{startYear || 'earliest'}</span>
                  {' → '}
                  <span className="text-blue-400 font-medium">{endYear || 'latest'}</span>
                </p>
              )}
              {selectedCategories.length > 0 && (
                <p className="text-xs text-gray-500">
                  🏷️ Categories: <span className="text-purple-400 font-medium">{selectedCategories.join(', ')}</span>
                </p>
              )}
              {sortBy !== 'date-desc' && (
                <p className="text-xs text-gray-500">
                  🔽 Sort: <span className="text-gray-400 font-medium">
                    {sortBy === 'date-asc' ? 'Oldest First' : sortBy === 'title-asc' ? 'Title (A-Z)' : 'Title (Z-A)'}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
