import React, { useState } from 'react'
import { Search, Heart, Shield, Users, ArrowRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthPopup from '../components/Auth/AuthPopup'

const HomePage: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setIsAuthOpen(true)
  }

  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-24 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-ek-accent-gold/5 via-transparent to-ek-accent-mint/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-ek-text-main leading-tight">
                Connecting Families
                <span className="block text-ek-accent-gold">with Dignity</span>
              </h1>
              <p className="mt-6 text-xl text-ek-text-muted max-w-3xl mx-auto leading-relaxed">
                Everlasting Kin provides a respectful, secure platform for connecting lost loved ones 
                with their families. Supporting mortuary staff, police departments, and families 
                during their most difficult moments.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/search"
                  className="bg-ek-accent-gold hover:bg-ek-accent-gold/80 text-ek-bg-main px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Search className="w-5 h-5" />
                  <span>Start Your Search</span>
                </Link>
                <button
                  onClick={() => handleAuthClick('signup')}
                  className="border-2 border-ek-accent-mint text-ek-accent-mint hover:bg-ek-accent-mint hover:text-ek-bg-main px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Users className="w-5 h-5" />
                  <span>Professional Access</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-ek-bg-main/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-ek-text-main mb-4">
                Serving with Compassion
              </h2>
              <p className="text-xl text-ek-text-muted max-w-2xl mx-auto">
                Our platform bridges the gap between families and their loved ones through 
                advanced technology and respectful service.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Public Search */}
              <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-xl p-8 hover:border-ek-accent-mint/50 transition-colors group">
                <div className="w-12 h-12 bg-ek-accent-gold/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-ek-accent-mint/20 transition-colors">
                  <Search className="w-6 h-6 text-ek-accent-gold group-hover:text-ek-accent-mint" />
                </div>
                <h3 className="text-xl font-semibold text-ek-text-main mb-4">
                  Respectful Search
                </h3>
                <p className="text-ek-text-muted mb-6">
                  Search our secure database with dignity and privacy. Our system protects 
                  sensitive information while helping families find the answers they need.
                </p>
                <Link 
                  to="/search"
                  className="text-ek-accent-mint hover:text-ek-accent-mint/80 font-medium flex items-center space-x-2"
                >
                  <span>Search Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Professional Support */}
              <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-xl p-8 hover:border-ek-accent-mint/50 transition-colors group">
                <div className="w-12 h-12 bg-ek-accent-mint/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-ek-accent-gold/20 transition-colors">
                  <Shield className="w-6 h-6 text-ek-accent-mint group-hover:text-ek-accent-gold" />
                </div>
                <h3 className="text-xl font-semibold text-ek-text-main mb-4">
                  Professional Tools
                </h3>
                <p className="text-ek-text-muted mb-6">
                  Dedicated portals for mortuary staff and police departments with specialized 
                  tools for case management and family connection.
                </p>
                <button
                  onClick={() => handleAuthClick('signup')}
                  className="text-ek-accent-mint hover:text-ek-accent-mint/80 font-medium flex items-center space-x-2"
                >
                  <span>Get Access</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Support */}
              <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-xl p-8 hover:border-ek-accent-mint/50 transition-colors group">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-ek-text-main mb-4">
                  24/7 Support
                </h3>
                <p className="text-ek-text-muted mb-6">
                  Our compassionate support team is available around the clock to assist 
                  families and professionals during difficult times.
                </p>
                <a 
                  href="mailto:support@everlastingkin.com"
                  className="text-ek-accent-mint hover:text-ek-accent-mint/80 font-medium flex items-center space-x-2"
                >
                  <span>Contact Support</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Security Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-2xl p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-ek-text-main mb-6">
                    Trust, Security & Privacy
                  </h2>
                  <p className="text-ek-text-muted text-lg mb-8">
                    We understand the sensitive nature of our service. Every aspect of our platform 
                    is designed with the highest security standards and deepest respect for privacy.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-ek-success/20 rounded-full flex items-center justify-center mt-0.5">
                        <Shield className="w-4 h-4 text-ek-success" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-ek-text-main">End-to-End Security</h4>
                        <p className="text-ek-text-muted text-sm">
                          All data is encrypted and protected with enterprise-grade security measures.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-ek-success/20 rounded-full flex items-center justify-center mt-0.5">
                        <Users className="w-4 h-4 text-ek-success" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-ek-text-main">Professional Oversight</h4>
                        <p className="text-ek-text-muted text-sm">
                          All professional accounts undergo rigorous verification and approval processes.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-ek-success/20 rounded-full flex items-center justify-center mt-0.5">
                        <Heart className="w-4 h-4 text-ek-success" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-ek-text-main">Compassionate Service</h4>
                        <p className="text-ek-text-muted text-sm">
                          Every interaction is handled with empathy, dignity, and the utmost care.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-ek-accent-mint/10 rounded-full mb-6">
                    <Shield className="w-16 h-16 text-ek-accent-mint" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-ek-accent-gold fill-current" />
                      ))}
                    </div>
                    <p className="text-ek-text-main font-semibold">Trusted by Families</p>
                    <p className="text-ek-text-muted text-sm">
                      "A beacon of hope during our darkest hour. Professional, compassionate, and secure."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-ek-accent-gold/10 to-ek-accent-mint/10">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-ek-text-main mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-ek-text-muted mb-8">
              Whether you're searching for a loved one or need professional access, 
              we're here to help with dignity and respect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/search"
                className="bg-ek-accent-gold hover:bg-ek-accent-gold/80 text-ek-bg-main px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Begin Your Search</span>
              </Link>
              <button
                onClick={() => handleAuthClick('signin')}
                className="border-2 border-ek-accent-mint text-ek-accent-mint hover:bg-ek-accent-mint hover:text-ek-bg-main px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
              >
                Professional Sign In
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Auth Popup */}
      <AuthPopup 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}
        onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
      />
    </>
  )
}

export default HomePage