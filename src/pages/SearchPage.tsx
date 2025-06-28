import React from 'react'
import UniversalSearch from '../components/Search/UniversalSearch'

const SearchPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-ek-text-main mb-4">
            Search for Loved Ones
          </h1>
          <p className="text-ek-text-muted text-lg max-w-3xl mx-auto">
            Use our intelligent search system to find information about deceased individuals. 
            Our search understands natural language and respects the dignity of every inquiry.
          </p>
        </div>
        
        <UniversalSearch />
        
        {/* Search Tips */}
        <div className="mt-12 bg-ek-accent-mint/10 border border-ek-accent-mint/30 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-ek-text-main mb-6 text-center">
            How to Search Effectively
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-ek-text-main mb-3">Search by Name</h4>
              <ul className="text-sm text-ek-text-muted space-y-2">
                <li>• Full name: "John Smith"</li>
                <li>• Partial name: "John" or "Smith"</li>
                <li>• Nicknames or known aliases</li>
                <li>• Maiden names for married individuals</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-ek-text-main mb-3">Search by Location</h4>
              <ul className="text-sm text-ek-text-muted space-y-2">
                <li>• City: "Nairobi" or "Mombasa"</li>
                <li>• Specific areas: "Westlands" or "CBD"</li>
                <li>• Roads: "Thika Road" or "Mombasa Road"</li>
                <li>• Landmarks: "near hospital" or "market"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-ek-text-main mb-3">Search by Description</h4>
              <ul className="text-sm text-ek-text-muted space-y-2">
                <li>• Physical features: "tall", "short", "beard"</li>
                <li>• Distinguishing marks: "tattoo", "scar", "birthmark"</li>
                <li>• Clothing: "blue jacket", "red dress", "uniform"</li>
                <li>• Personal effects: "wallet", "jewelry", "phone"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-ek-text-main mb-3">Natural Language</h4>
              <ul className="text-sm text-ek-text-muted space-y-2">
                <li>• "Male found near Lake Victoria"</li>
                <li>• "Woman with eagle tattoo on arm"</li>
                <li>• "Person wearing blue jacket in Nairobi"</li>
                <li>• "Individual with birthmark on face"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage