'use client'

import React, { useState } from 'react'
import { Calendar, Filter, X, ChevronDown, ChevronUp } from 'lucide-react'

interface AdvancedFiltersProps {
  onDateRangeChange: (start: string | null, end: string | null) => void
  minDate: string
  maxDate: string
}

export default function AdvancedFilters({ 
  onDateRangeChange, 
  minDate, 
  maxDate 
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [startYear, setStartYear] = useState<string>('')
  const [endYear, setEndYear] = useState<string>('')

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

  const handleApply = () => {
    const start = startYear ? `${startYear}-01-01` : null
    const end = endYear ? `${endYear}-12-31` : null
    onDateRangeChange(start, end)
  }

  const handleClear = () => {
    setStartYear('')
    setEndYear('')
    onDateRangeChange(null, null)
  }

  const hasActiveFilters = startYear || endYear

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
          {/* Date Range Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <label className="text-xs font-medium text-gray-300">Timeline Range</label>
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
            <div className="pt-2 border-t border-gray-700">
              <p className="text-xs text-gray-500">
                Showing posts from{' '}
                <span className="text-blue-400 font-medium">
                  {startYear || 'earliest'}
                </span>
                {' '}to{' '}
                <span className="text-blue-400 font-medium">
                  {endYear || 'latest'}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
