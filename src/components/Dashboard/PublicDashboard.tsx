import React from 'react'
import { Search, Heart, Shield, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const PublicDashboard: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-ek-text-main mb-4">
          Welcome to Everlasting Kin
        </h1>
        <p className="text-ek-text-muted text-lg max-w-2xl mx-auto">
          Our compassionate platform helps connect families with their lost loved ones. 
          Search our respectful database or learn about our services.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/search"
          className="group bg-ek-bg-main border border-ek-accent-gold/30 rounded-xl p-8 hover:border-ek-accent-mint/50 transition-all duration-300 hover:shadow-lg"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-ek-accent-gold/20 rounded-lg group-hover:bg-ek-accent-mint/20 transition-colors">
              <Search className="w-6 h-6 text-ek-accent-gold group-hover:text-ek-accent-mint" />
            </div>
            <h3 className="text-xl font-semibold text-ek-text-main">Search Records</h3>
          </div>
          <p className="text-ek-text-muted mb-4">
            Search our database to find information about deceased individuals. 
            Our search is conducted with the highest respect and privacy.
          </p>
          <div className="text-ek-accent-mint font-medium group-hover:underline">
            Start searching →
          </div>
        </Link>

        <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-xl p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-ek-accent-mint/20 rounded-lg">
              <Heart className="w-6 h-6 text-ek-accent-mint" />
            </div>
            <h3 className="text-xl font-semibold text-ek-text-main">Support Resources</h3>
          </div>
          <p className="text-ek-text-muted mb-4">
            Access support resources, grief counseling information, and community assistance programs.
          </p>
          <button className="text-ek-accent-mint font-medium hover:underline">
            Learn more →
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-xl p-8">
        <h3 className="text-xl font-semibold text-ek-text-main mb-6 text-center">
          How Everlasting Kin Helps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-ek-accent-gold/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-ek-accent-gold" />
            </div>
            <h4 className="font-semibold text-ek-text-main mb-2">Respectful Search</h4>
            <p className="text-ek-text-muted text-sm">
              Search with dignity using our privacy-focused database designed for families in need.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-ek-accent-mint/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-ek-accent-mint" />
            </div>
            <h4 className="font-semibold text-ek-text-main mb-2">Secure & Private</h4>
            <p className="text-ek-text-muted text-sm">
              All information is handled with the highest security standards and professional oversight.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="font-semibold text-ek-text-main mb-2">24/7 Support</h4>
            <p className="text-ek-text-muted text-sm">
              Our support team is available around the clock to assist families during difficult times.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-ek-accent-mint/10 border border-ek-accent-mint/30 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-ek-text-main mb-2">Need Additional Help?</h3>
        <p className="text-ek-text-muted mb-4">
          Our compassionate support team is here to assist you during this difficult time.
        </p>
        <div className="space-y-2 text-sm text-ek-text-muted">
          <p>Emergency Support: Available 24/7</p>
          <p>Email: support@everlastingkin.com</p>
          <p>All communications are handled with complete confidentiality</p>
        </div>
      </div>
    </div>
  )
}

export default PublicDashboard