import React, { useState, useEffect, useRef } from 'react'
import { Search, Calendar, MapPin, User, Clock, FileText, Shield, Loader2 } from 'lucide-react'
import { universalSearch, SearchResult, logAuditAction } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const UniversalSearch: React.FC = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Handle search with debouncing
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (searchTerm.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        performSearch(searchTerm.trim())
      }, 300)
    } else {
      setResults([])
      setShowResults(false)
      setHasSearched(false)
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchTerm])

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const performSearch = async (term: string) => {
    setLoading(true)
    setHasSearched(true)

    try {
      const searchResults = await universalSearch(term)
      setResults(searchResults)
      setShowResults(true)

      // Log search action
      await logAuditAction('Universal search performed', {
        details: {
          searchTerm: term.substring(0, 50),
          resultsCount: searchResults.length,
          userRole: user?.role || 'anonymous'
        }
      })
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      performSearch(searchTerm.trim())
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRecordIcon = (recordType: string) => {
    switch (recordType) {
      case 'deceased':
        return <User className="w-5 h-5 text-ek-accent-gold" />
      case 'police_report':
        return <Shield className="w-5 h-5 text-blue-400" />
      default:
        return <FileText className="w-5 h-5 text-ek-text-muted" />
    }
  }

  const getRecordTypeLabel = (recordType: string) => {
    switch (recordType) {
      case 'deceased':
        return 'Deceased Record'
      case 'police_report':
        return 'Police Report'
      default:
        return 'Record'
    }
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto" ref={searchRef}>
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ek-text-muted w-6 h-6" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setShowResults(true)
            }}
            className="w-full pl-14 pr-12 py-4 bg-ek-bg-main border-2 border-ek-accent-gold/30 rounded-xl text-ek-text-main placeholder-ek-text-muted focus:outline-none focus:border-ek-accent-mint transition-all duration-300 text-lg shadow-lg"
            placeholder="Search for loved ones by name, location, distinguishing marks, or description..."
          />
          {loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Loader2 className="w-6 h-6 text-ek-accent-mint animate-spin" />
            </div>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-ek-bg-main border border-ek-accent-gold/30 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 text-ek-accent-mint animate-spin mx-auto mb-4" />
              <p className="text-ek-text-muted">Searching with care and respect...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-4 border-b border-ek-accent-gold/20">
                <p className="text-sm text-ek-text-muted">
                  Found {results.length} result{results.length !== 1 ? 's' : ''} for "{searchTerm}"
                </p>
              </div>
              <div className="divide-y divide-ek-accent-gold/20">
                {results.map((result, index) => (
                  <div
                    key={`${result.record_type}-${result.record_id}-${index}`}
                    className="p-4 hover:bg-ek-accent-gold/5 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getRecordIcon(result.record_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-ek-text-main group-hover:text-ek-accent-mint transition-colors">
                            {result.display_name}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-1 bg-ek-accent-gold/20 text-ek-accent-gold rounded-full">
                              {getRecordTypeLabel(result.record_type)}
                            </span>
                            {result.is_public && (
                              <span className="text-xs px-2 py-1 bg-ek-accent-mint/20 text-ek-accent-mint rounded-full">
                                Public
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-ek-text-muted mb-2 line-clamp-2">
                          {result.display_details}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-ek-text-muted">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Added {formatDate(result.created_at)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>Relevance: {Math.round(result.relevance_score * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {results.length >= 100 && (
                <div className="p-4 text-center border-t border-ek-accent-gold/20">
                  <p className="text-sm text-ek-text-muted">
                    Showing first 100 results. Please refine your search for more specific results.
                  </p>
                </div>
              )}
            </>
          ) : hasSearched ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-ek-text-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-ek-text-muted" />
              </div>
              <h3 className="text-lg font-semibold text-ek-text-main mb-2">
                No Records Found
              </h3>
              <p className="text-ek-text-muted max-w-md mx-auto">
                We couldn't find any records matching "{searchTerm}". 
                Please try different search terms or contact support for assistance.
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* Search Tips */}
      {!hasSearched && (
        <div className="mt-6 bg-ek-accent-mint/10 border border-ek-accent-mint/30 rounded-lg p-4">
          <h4 className="font-medium text-ek-text-main mb-2">Search Tips:</h4>
          <ul className="text-sm text-ek-text-muted space-y-1">
            <li>• Try searching by full name, partial name, or nickname</li>
            <li>• Include location details like "Nairobi CBD" or "Thika Road"</li>
            <li>• Describe distinguishing marks like "tattoo", "scar", or "birthmark"</li>
            <li>• Use clothing descriptions like "blue jacket" or "red dress"</li>
            <li>• Search is not case-sensitive and handles partial matches</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default UniversalSearch