import React, { useState, useEffect } from 'react'
import { Plus, FileText, Users, Calendar, Clock, AlertCircle, CheckCircle, Eye } from 'lucide-react'
import { getDashboardStats, DashboardStats } from '../../lib/supabase'

const EnhancedStaffDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({})
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'create' | 'inquiries'>('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const dashboardData = await getDashboardStats('mortuary_staff')
      setStats(dashboardData)
    } catch (error) {
      console.error('Error fetching mortuary staff dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ek-accent-gold mx-auto mb-4"></div>
          <p className="text-ek-text-muted">Loading your case management dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ek-text-main">Case Management Suite</h1>
          <p className="text-ek-text-muted mt-2">
            Manage deceased records with care, dignity, and professional oversight
          </p>
        </div>
        <button className="mt-4 sm:mt-0 bg-ek-accent-gold hover:bg-ek-accent-gold/80 text-ek-bg-main px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl">
          <Plus className="w-5 h-5" />
          <span>New Record</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-xl p-6 hover:border-ek-accent-mint/50 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ek-text-muted text-sm font-medium">My Cases</p>
              <p className="text-3xl font-bold text-ek-text-main mt-2 group-hover:text-ek-accent-mint transition-colors">
                {stats.case_stats?.total_assigned || 0}
              </p>
              <p className="text-ek-text-muted text-xs mt-1">Active records</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-xl p-6 hover:border-ek-accent-mint/50 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ek-text-muted text-sm font-medium">Identified</p>
              <p className="text-3xl font-bold text-ek-text-main mt-2 group-hover:text-ek-success transition-colors">
                {stats.case_stats?.identified || 0}
              </p>
              <p className="text-ek-text-muted text-xs mt-1">Successful matches</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-xl p-6 hover:border-ek-accent-mint/50 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ek-text-muted text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-ek-text-main mt-2 group-hover:text-ek-accent-gold transition-colors">
                {stats.case_stats?.pending || 0}
              </p>
              <p className="text-ek-text-muted text-xs mt-1">Awaiting confirmation</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500 group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-xl p-6 hover:border-ek-accent-mint/50 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ek-text-muted text-sm font-medium">Unidentified</p>
              <p className="text-3xl font-bold text-ek-text-main mt-2 group-hover:text-ek-error transition-colors">
                {stats.case_stats?.unidentified || 0}
              </p>
              <p className="text-ek-text-muted text-xs mt-1">Require attention</p>
            </div>
            <div className="p-3 rounded-lg bg-red-500 group-hover:scale-110 transition-transform duration-300">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-ek-accent-gold/30">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'cases', label: 'My Cases', icon: FileText },
            { id: 'inquiries', label: 'Family Inquiries', icon: Users },
            { id: 'create', label: 'Create Record', icon: Plus },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? 'border-ek-accent-mint text-ek-text-main'
                  : 'border-transparent text-ek-text-muted hover:text-ek-text-main hover:border-ek-accent-gold/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Cases */}
            <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-xl">
              <div className="p-6 border-b border-ek-accent-gold/20">
                <h3 className="text-lg font-semibold text-ek-text-main">Recent Cases</h3>
              </div>
              <div className="p-6">
                {stats.assigned_cases && stats.assigned_cases.length > 0 ? (
                  <div className="space-y-4">
                    {stats.assigned_cases.slice(0, 5).map((record: any) => (
                      <div key={record.id} className="flex items-center justify-between p-4 bg-ek-accent-gold/5 rounded-lg hover:bg-ek-accent-gold/10 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium text-ek-text-main">{record.full_name}</h4>
                          <p className="text-sm text-ek-text-muted">
                            {record.location_found} • {new Date(record.date_of_death).toLocaleDateString()}
                          </p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            record.identification_status === 'identified' ? 'bg-ek-success/20 text-ek-success' :
                            record.identification_status === 'pending_confirmation' ? 'bg-ek-accent-gold/20 text-ek-accent-gold' :
                            'bg-ek-error/20 text-ek-error'
                          }`}>
                            {record.identification_status.replace('_', ' ')}
                          </span>
                        </div>
                        <button className="text-ek-accent-mint hover:text-ek-accent-mint/80 transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-ek-text-muted text-center py-8">
                    No cases assigned yet. Create your first record to get started.
                  </p>
                )}
              </div>
            </div>

            {/* Family Inquiries */}
            <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-xl">
              <div className="p-6 border-b border-ek-accent-gold/20">
                <h3 className="text-lg font-semibold text-ek-text-main">Recent Family Inquiries</h3>
              </div>
              <div className="p-6">
                {stats.next_of_kin_inquiries && stats.next_of_kin_inquiries.length > 0 ? (
                  <div className="space-y-4">
                    {stats.next_of_kin_inquiries.slice(0, 5).map((inquiry: any) => (
                      <div key={inquiry.id} className="p-4 bg-ek-accent-mint/5 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-ek-text-main">{inquiry.inquirer_name}</h4>
                            <p className="text-sm text-ek-text-muted">
                              Inquiring about: {inquiry.deceased_name}
                            </p>
                            <p className="text-xs text-ek-text-muted mt-1">
                              Relationship: {inquiry.relationship} • {inquiry.contact_phone}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            inquiry.verified ? 'bg-ek-success/20 text-ek-success' : 'bg-ek-accent-gold/20 text-ek-accent-gold'
                          }`}>
                            {inquiry.verified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-ek-text-muted text-center py-8">
                    No recent family inquiries.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-xl">
            <div className="p-6 border-b border-ek-accent-gold/20">
              <h3 className="text-lg font-semibold text-ek-text-main">My Assigned Cases</h3>
              <p className="text-ek-text-muted text-sm mt-1">
                Records you've created or are assigned to manage
              </p>
            </div>
            <div className="p-6">
              {stats.assigned_cases && stats.assigned_cases.length > 0 ? (
                <div className="space-y-4">
                  {stats.assigned_cases.map((record: any) => (
                    <div key={record.id} className="border border-ek-accent-gold/20 rounded-lg p-6 hover:border-ek-accent-mint/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-ek-text-main mb-2">{record.full_name}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-ek-text-muted">
                            <div>
                              <p><strong>Date of Death:</strong> {new Date(record.date_of_death).toLocaleDateString()}</p>
                              <p><strong>Location Found:</strong> {record.location_found}</p>
                            </div>
                            <div>
                              <p><strong>Status:</strong> 
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                  record.identification_status === 'identified' ? 'bg-ek-success/20 text-ek-success' :
                                  record.identification_status === 'pending_confirmation' ? 'bg-ek-accent-gold/20 text-ek-accent-gold' :
                                  'bg-ek-error/20 text-ek-error'
                                }`}>
                                  {record.identification_status.replace('_', ' ')}
                                </span>
                              </p>
                              <p><strong>Public:</strong> {record.is_public_viewable ? 'Yes' : 'No'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-ek-accent-mint hover:text-ek-accent-mint/80 transition-colors p-2">
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-ek-text-muted text-center py-8">
                  No cases assigned. Create your first record to get started.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-xl">
            <div className="p-6 border-b border-ek-accent-gold/20">
              <h3 className="text-lg font-semibold text-ek-text-main">Family Inquiries</h3>
              <p className="text-ek-text-muted text-sm mt-1">
                Next of kin inquiries for your assigned cases
              </p>
            </div>
            <div className="p-6">
              <p className="text-ek-text-muted text-center py-8">
                Comprehensive family inquiry management interface will be implemented here.
                This includes inquiry verification, communication tools, and family connection facilitation.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-xl">
            <div className="p-6 border-b border-ek-accent-gold/20">
              <h3 className="text-lg font-semibold text-ek-text-main">Create New Deceased Record</h3>
              <p className="text-ek-text-muted text-sm mt-1">
                Add a new deceased individual record to the system with care and accuracy
              </p>
            </div>
            <div className="p-6">
              <p className="text-ek-text-muted text-center py-8">
                Comprehensive record creation form will be implemented here.
                This includes personal details, discovery information, forensic data, and media uploads.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EnhancedStaffDashboard