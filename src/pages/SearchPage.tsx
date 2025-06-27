import React from 'react'
import PublicSearch from '../components/Search/PublicSearch'

const SearchPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PublicSearch />
      </div>
    </div>
  )
}

export default SearchPage