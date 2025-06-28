import React, { useState, useEffect } from 'react'
import { Search, Heart, Shield, Clock, CheckCircle, AlertCircle, Phone, Mail, Camera, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getDashboardStats, DashboardStats } from '../../lib/supabase'
import { useTheme, applyTheme } from '../../hooks/useTheme'

const EnhancedPublicDashboard: React.FC = () => {
  const theme = useTheme()
  const [stats, setStats] = useState<DashboardStats>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    applyTheme(theme)
    fetchDashboardData()
  }, [theme])

  const fetchDashboardData = async () => {
    try {
      const dashboardData = await getDashboardStats('public')
      setStats(dashboardData)
    } catch (error) {
      console.error('Error fetching public dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--theme-background)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--theme-accent)] mx-auto mb-4"></div>
          <p className="text-[var(--theme-text-muted)]">Loading your personal dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8" style={{ backgroundColor: 'var(--theme-background)', minHeight: '100vh' }}>
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[var(--theme-text)] mb-4">
          Welcome to Your Personal Space
        </h1>
        <p className="text-[var(--theme-text-muted)] text-lg max-w-3xl mx-auto">
          Your compassionate companion in finding answers. Track your inquiries, 
          access support resources, and stay connected with our caring community.
        </p>
      </div>

      {/* Hero Image Section */}
      <div className="relative h-64 rounded-2xl overflow-hidden">
        <img 
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
          alt="Compassionate support" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-background)]/80 to-transparent flex items-center">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-[var(--theme-text)] mb-4">
              Finding Hope Together
            </h2>
            <p className="text-[var(--theme-text-muted)] text-lg mb-6">
              We understand your journey and are here to support you every step of the way
            </p>
            <Link 
              to="/search"
              className="bg-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/80 text-[var(--theme-background)] px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Begin Your Search</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {stats.inquiry_stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6 text-center hover:border-[var(--theme-accent)]/50 transition-all duration-300">
            <div className="w-12 h-12 bg-[var(--theme-accent)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-[var(--theme-accent)]" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--theme-text)]">{stats.inquiry_stats.total_inquiries}</h3>
            <p className="text-[var(--theme-text-muted)] text-sm">Total Inquiries</p>
          </div>

          <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6 text-center hover:border-[var(--theme-accent)]/50 transition-all duration-300">
            <div className="w-12 h-12 bg-[var(--theme-success)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-[var(--theme-success)]" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--theme-text)]">{stats.inquiry_stats.verified_matches}</h3>
            <p className="text-[var(--theme-text-muted)] text-sm">Verified Matches</p>
          </div>

          <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6 text-center hover:border-[var(--theme-accent)]/50 transition-all duration-300">
            <div className="w-12 h-12 bg-[var(--theme-warning)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-[var(--theme-warning)]" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--theme-text)]">{stats.inquiry_stats.pending_verification}</h3>
            <p className="text-[var(--theme-text-muted)] text-sm">Pending Verification</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link 
          to="/search"
          className="group bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-8 hover:border-[var(--theme-accent)]/50 transition-all duration-300 hover:shadow-xl"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-4 bg-[var(--theme-accent)]/20 rounded-xl group-hover:bg-[var(--theme-accent)]/30 transition-colors">
              <Search className="w-8 h-8 text-[var(--theme-accent)]" />
            </div>
            <h3 className="text-2xl font-semibold text-[var(--theme-text)]">Search Records</h3>
          </div>
          <p className="text-[var(--theme-text-muted)] mb-6">
            Search our respectful database to find information about deceased individuals. 
            Our advanced search understands natural language and helps you find what you're looking for.
          </p>
          <div className="text-[var(--theme-accent)] font-medium group-hover:underline flex items-center space-x-2">
            <span>Start searching</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-8 hover:border-[var(--theme-accent)]/50 transition-all duration-300">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-4 bg-[var(--theme-accent)]/20 rounded-xl">
              <Heart className="w-8 h-8 text-[var(--theme-accent)]" />
            </div>
            <h3 className="text-2xl font-semibold text-[var(--theme-text)]">Support Resources</h3>
          </div>
          <p className="text-[var(--theme-text-muted)] mb-6">
            Access grief counseling information, community support groups, and professional assistance 
            during this difficult time.
          </p>
          <button className="text-[var(--theme-accent)] font-medium hover:underline flex items-center space-x-2">
            <span>Explore resources</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* My Inquiries */}
      <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl">
        <div className="p-6 border-b border-[var(--theme-border)]/20">
          <h3 className="text-xl font-semibold text-[var(--theme-text)]">My Inquiries</h3>
          <p className="text-[var(--theme-text-muted)] text-sm mt-1">
            Track the status of your submitted inquiries and any matches found
          </p>
        </div>
        <div className="p-6">
          {stats.my_inquiries && stats.my_inquiries.length > 0 ? (
            <div className="space-y-4">
              {stats.my_inquiries.map((inquiry: any) => (
                <div key={inquiry.id} className="border border-[var(--theme-border)]/20 rounded-lg p-6 hover:border-[var(--theme-accent)]/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-[var(--theme-text)] mb-2">{inquiry.deceased_name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[var(--theme-text-muted)]">
                        <div>
                          <p><strong>Date of Death:</strong> {new Date(inquiry.date_of_death).toLocaleDateString()}</p>
                          <p><strong>Location:</strong> {inquiry.location_found}</p>
                        </div>
                        <div>
                          <p><strong>Relationship:</strong> {inquiry.relationship}</p>
                          <p><strong>Inquiry Date:</strong> {new Date(inquiry.inquiry_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          inquiry.verified ? 'bg-[var(--theme-success)]/20 text-[var(--theme-success)]' : 'bg-[var(--theme-warning)]/20 text-[var(--theme-warning)]'
                        }`}>
                          {inquiry.verified ? 'Verified Match' : 'Pending Verification'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          inquiry.inquiry_status === 'completed' ? 'bg-[var(--theme-success)]/20 text-[var(--theme-success)]' :
                          inquiry.inquiry_status === 'in_progress' ? 'bg-[var(--theme-warning)]/20 text-[var(--theme-warning)]' :
                          'bg-[var(--theme-text-muted)]/20 text-[var(--theme-text-muted)]'
                        }`}>
                          Status: {inquiry.inquiry_status || 'pending'}
                        </span>
                      </div>
                    </div>
                    <button className="text-[var(--theme-accent)] hover:text-[var(--theme-accent)]/80 transition-colors p-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[var(--theme-text-muted)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-[var(--theme-text-muted)]" />
              </div>
              <h4 className="text-lg font-semibold text-[var(--theme-text)] mb-2">No Inquiries Yet</h4>
              <p className="text-[var(--theme-text-muted)] max-w-md mx-auto mb-6">
                You haven't submitted any inquiries yet. Use our search feature to look for your loved ones.
              </p>
              <Link 
                to="/search"
                className="inline-flex items-center space-x-2 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/80 text-[var(--theme-background)] px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Start Searching</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Support & Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* How We Help */}
        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-[var(--theme-text)] mb-6 text-center">
            How Everlasting Kin Helps
          </h3>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-[var(--theme-accent)]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5 text-[var(--theme-accent)]" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--theme-text)] mb-1">Respectful Search</h4>
                <p className="text-[var(--theme-text-muted)] text-sm">
                  Search with dignity using our privacy-focused database designed for families in need.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-[var(--theme-accent)]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-[var(--theme-accent)]" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--theme-text)] mb-1">Secure & Private</h4>
                <p className="text-[var(--theme-text-muted)] text-sm">
                  All information is handled with the highest security standards and professional oversight.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--theme-text)] mb-1">Compassionate Support</h4>
                <p className="text-[var(--theme-text-muted)] text-sm">
                  Our support team is available around the clock to assist families during difficult times.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-[var(--theme-success)]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Camera className="w-5 h-5 text-[var(--theme-success)]" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--theme-text)] mb-1">Photo Sharing</h4>
                <p className="text-[var(--theme-text-muted)] text-sm">
                  Securely share photos and information to help with identification processes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/30 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-[var(--theme-text)] mb-6 text-center">
            Need Additional Help?
          </h3>
          <p className="text-[var(--theme-text-muted)] mb-6 text-center">
            Our compassionate support team is here to assist you during this difficult time.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-[var(--theme-surface)]/50 rounded-lg">
              <Phone className="w-5 h-5 text-[var(--theme-accent)]" />
              <div>
                <p className="font-medium text-[var(--theme-text)]">24/7 Emergency Support</p>
                <p className="text-sm text-[var(--theme-text-muted)]">Available around the clock</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-[var(--theme-surface)]/50 rounded-lg">
              <Mail className="w-5 h-5 text-[var(--theme-accent)]" />
              <div>
                <p className="font-medium text-[var(--theme-text)]">support@everlastingkin.com</p>
                <p className="text-sm text-[var(--theme-text-muted)]">Email support team</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-[var(--theme-surface)]/50 rounded-lg">
              <FileText className="w-5 h-5 text-[var(--theme-accent)]" />
              <div>
                <p className="font-medium text-[var(--theme-text)]">Document Assistance</p>
                <p className="text-sm text-[var(--theme-text-muted)]">Help with paperwork and forms</p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-xs text-[var(--theme-text-muted)]">
              All communications are handled with complete confidentiality and respect
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedPublicDashboard