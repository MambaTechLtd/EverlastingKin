import React, { useState, useEffect } from 'react'
import { Search, Calendar, MapPin, User, AlertCircle, Clock } from 'lucide-react'
import { supabase, DeceasedRecord, logAuditAction } from '../../lib/supabase'

const PublicSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<'name' | 'location' | 'date'>('name')
  const [results, setResults] = useState<DeceasedRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setLoading(true)
    setHasSearched(true)

    try {
      let query = supabase
        .from('deceased_records')
        .select(`
          id,
          name,
          date_of_death,
          location,
          created_at
        `)

      // Build search query based on type
      switch (searchType) {
        case 'name':
          query = query.ilike('name', `%${searchTerm}%`)
          break
        case 'location':
          query = query.ilike('location', `%${searchTerm}%`)
          break
        case 'date':
          query = query.eq('date_of_death', searchTerm)
          break
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Search error:', error)
        setResults([])
      } else {
        setResults(data || [])
        
        // Log the search action
        await logAuditAction('Public search performed', 'deceased_records', undefined, {
          searchType,
          searchTerm: searchTerm.substring(0, 50), // Limit logged search term length
          resultsCount: data?.length || 0
        })
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-ek-text-main mb-4">
          Search for Loved Ones
        </h1>
        <p className="text-ek-text-muted text-lg max-w-2xl mx-auto">
          Use our respectful search system to find information about deceased individuals. 
          All searches are conducted with the utmost care and privacy.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-xl p-6 mb-8 shadow-lg">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Type */}
            <div className="sm:w-1/3">
              <label className="block text-sm font-medium text-ek-text-main mb-2">
                Search by
              </label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as any)}
                className="w-full px-4 py-3 bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg text-ek-text-main focus:outline-none focus:border-ek-accent-mint transition-colors"
              >
                <option value="name">Name</option>
                <option value="location">Location</option>
                <option value="date">Date of Death</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="sm:w-2/3">
              <label className="block text-sm font-medium text-ek-text-main mb-2">
                {searchType === 'name' && 'Full name or partial name'}
                {searchType === 'location' && 'City, state, or location'}
                {searchType === 'date' && 'Date (YYYY-MM-DD)'}
              </label>
              <div className="relative">
                {searchType === 'name' && <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ek-text-muted w-5 h-5" />}
                {searchType === 'location' && <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ek-text-muted w-5 h-5" />}
                {searchType === 'date' && <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ek-text-muted w-5 h-5" />}
                <input
                  type={searchType === 'date' ? 'date' : 'text'}
                  required
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg text-ek-text-main placeholder-ek-text-muted focus:outline-none focus:border-ek-accent-mint transition-colors"
                  placeholder={
                    searchType === 'name' ? 'Enter name to search...' :
                    searchType === 'location' ? 'Enter location...' :
                    'Select date...'
                  }
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !searchTerm.trim()}
            className="w-full bg-ek-accent-gold hover:bg-ek-accent-gold/80 disabled:opacity-50 disabled:cursor-not-allowed text-ek-bg-main font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>{loading ? 'Searching...' : 'Search Records'}</span>
          </button>
        </form>
      </div>

      {/* Privacy Notice */}
      <div className="bg-ek-accent-mint/10 border border-ek-accent-mint/30 rounded-lg p-4 mb-8">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-ek-accent-mint mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-ek-text-main mb-1">Privacy & Respect Notice</p>
            <p className="text-ek-text-muted">
              Search results show limited public information only. Full details and contact information 
              for next of kin are available to authorized personnel. All searches are logged for security purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-ek-text-main">
              Search Results
            </h2>
            <span className="text-ek-text-muted text-sm">
              {results.length} record{results.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ek-accent-gold mx-auto mb-4"></div>
              <p className="text-ek-text-muted">Searching records...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid gap-4">
              {results.map((record) => (
                <div 
                  key={record.id}
                  className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg p-6 hover:border-ek-accent-mint/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-ek-text-main mb-2">
                        {record.name}
                      </h3>
                      <div className="space-y-2 text-sm text-ek-text-muted">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Date of Death: {formatDate(record.date_of_death)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>Location: {record.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>Record Created: {formatDate(record.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-ek-text-muted mb-2">
                        Record ID: {record.id.slice(0, 8)}...
                      </p>
                      <div className="bg-ek-accent-mint/20 text-ek-accent-mint px-3 py-1 rounded-full text-xs font-medium">
                        Public Record
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-ek-text-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-ek-text-muted" />
              </div>
              <h3 className="text-lg font-semibold text-ek-text-main mb-2">
                No Records Found
              </h3>
              <p className="text-ek-text-muted max-w-md mx-auto">
                We couldn't find any records matching your search criteria. 
                Please try different search terms or contact support for assistance.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PublicSearch