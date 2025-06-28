import React, { useState, useEffect } from 'react'
import { Plus, FileText, Users, Calendar, Clock, AlertCircle, CheckCircle, Eye, Camera, Video, Upload } from 'lucide-react'
import { getDashboardStats, DashboardStats } from '../../lib/supabase'
import { useTheme, applyTheme } from '../../hooks/useTheme'
import DeceasedRecordForm from './DataEntry/DeceasedRecordForm'

const EnhancedStaffDashboard: React.FC = () => {
  const theme = useTheme()
  const [stats, setStats] = useState<DashboardStats>({})
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'create' | 'inquiries'>('overview')
  const [loading, setLoading] = useState(true)
  const [showDeceasedForm, setShowDeceasedForm] = useState(false)

  useEffect(() => {
    applyTheme(theme)
    fetchDashboardData()
  }, [theme])

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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--theme-background)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--theme-accent)] mx-auto mb-4"></div>
          <p className="text-[var(--theme-text-muted)]">Loading your case management dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8" style={{ backgroundColor: 'var(--theme-background)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-text)]">Case Management Suite</h1>
          <p className="text-[var(--theme-text-muted)] mt-2">
            Manage deceased records with care, dignity, and professional oversight
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <button 
            onClick={() => setShowDeceasedForm(true)}
            className="bg-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/80 text-[var(--theme-background)] px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>New Record</span>
          </button>
          <button className="border-2 border-[var(--theme-accent)] text-[var(--theme-accent)] hover:bg-[var(--theme-accent)] hover:text-[var(--theme-background)] px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload Media</span>
          </button>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="relative h-48 rounded-2xl overflow-hidden">
        <img 
          src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
          alt="Compassionate care" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-background)]/80 to-transparent flex items-center">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-2">
              Serving Families with Dignity
            </h2>
            <p className="text-[var(--theme-text-muted)]">
              Professional case management and family support services
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6 hover:border-[var(--theme-accent)]/50 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--theme-text-muted)] text-sm font-medium">My Cases</p>
              <p className="text-3xl font-bold text-[var(--theme-text)] mt-2 group-hover:text-[var(--theme-accent)] transition-colors">
                {stats.case_stats?.total_assigned || 0}
              </p>
              <p className="text-[var(--theme-text-muted)] text-xs mt-1">Active records</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6 hover:border-[var(--theme-accent)]/50 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--theme-text-muted)] text-sm font-medium">Identified</p>
              <p className="text-3xl font-bold text-[var(--theme-text)] mt-2 group-hover:text-[var(--theme-success)] transition-colors">
                {stats.case_stats?.identified || 0}
              </p>
              <p className="text-[var(--theme-text-muted)] text-xs mt-1">Successful matches</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6 hover:border-[var(--theme-accent)]/50 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--theme-text-muted)] text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-[var(--theme-text)] mt-2 group-hover:text-[var(--theme-warning)] transition-colors">
                {stats.case_stats?.pending || 0}
              </p>
              <p className="text-[var(--theme-text-muted)] text-xs mt-1">Awaiting confirmation</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500 group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6 hover:border-[var(--theme-accent)]/50 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--theme-text-muted)] text-sm font-medium">Unidentified</p>
              <p className="text-3xl font-bold text-[var(--theme-text)] mt-2 group-hover:text-[var(--theme-error)] transition-colors">
                {stats.case_stats?.unidentified || 0}
              </p>
              <p className="text-[var(--theme-text-muted)] text-xs mt-1">Require attention</p>
            </div>
            <div className="p-3 rounded-lg bg-red-500 group-hover:scale-110 transition-transform duration-300">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Media Management Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6 hover:border-[var(--theme-accent)]/50 transition-colors">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-[var(--theme-accent)]/20 rounded-lg">
              <Camera className="w-6 h-6 text-[var(--theme-accent)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--theme-text)]">Photo Management</h3>
          </div>
          <p className="text-[var(--theme-text-muted)] mb-4">
            Upload and manage photos for deceased records with privacy controls
          </p>
          <button className="text-[var(--theme-accent)] hover:underline font-medium">
            Manage Photos →
          </button>
        </div>

        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6 hover:border-[var(--theme-accent)]/50 transition-colors">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-[var(--theme-success)]/20 rounded-lg">
              <Video className="w-6 h-6 text-[var(--theme-success)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--theme-text)]">Video Documentation</h3>
          </div>
          <p className="text-[var(--theme-text-muted)] mb-4">
            Secure video storage for identification and family communication
          </p>
          <button className="text-[var(--theme-accent)] hover:underline font-medium">
            Upload Videos →
          </button>
        </div>

        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6 hover:border-[var(--theme-accent)]/50 transition-colors">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-[var(--theme-warning)]/20 rounded-lg">
              <FileText className="w-6 h-6 text-[var(--theme-warning)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--theme-text)]">Document Archive</h3>
          </div>
          <p className="text-[var(--theme-text-muted)] mb-4">
            Store medical records, identification documents, and certificates
          </p>
          <button className="text-[var(--theme-accent)] hover:underline font-medium">
            Manage Documents →
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-[var(--theme-border)]/30">
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
                  ? 'border-[var(--theme-accent)] text-[var(--theme-text)]'
                  : 'border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:border-[var(--theme-border)]/50'
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
            <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl">
              <div className="p-6 border-b border-[var(--theme-border)]/20">
                <h3 className="text-lg font-semibold text-[var(--theme-text)]">Recent Cases</h3>
              </div>
              <div className="p-6">
                {stats.assigned_cases && stats.assigned_cases.length > 0 ? (
                  <div className="space-y-4">
                    {stats.assigned_cases.slice(0, 5).map((record: any) => (
                      <div key={record.id} className="flex items-center justify-between p-4 bg-[var(--theme-accent)]/5 rounded-lg hover:bg-[var(--theme-accent)]/10 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium text-[var(--theme-text)]">{record.full_name}</h4>
                          <p className="text-sm text-[var(--theme-text-muted)]">
                            {record.location_found} • {new Date(record.date_of_death).toLocaleDateString()}
                          </p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            record.identification_status === 'identified' ? 'bg-[var(--theme-success)]/20 text-[var(--theme-success)]' :
                            record.identification_status === 'pending_confirmation' ? 'bg-[var(--theme-warning)]/20 text-[var(--theme-warning)]' :
                            'bg-[var(--theme-error)]/20 text-[var(--theme-error)]'
                          }`}>
                            {record.identification_status.replace('_', ' ')}
                          </span>
                        </div>
                        <button className="text-[var(--theme-accent)] hover:text-[var(--theme-accent)]/80 transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--theme-text-muted)] text-center py-8">
                    No cases assigned yet. Create your first record to get started.
                  </p>
                )}
              </div>
            </div>

            {/* Family Inquiries */}
            <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl">
              <div className="p-6 border-b border-[var(--theme-border)]/20">
                <h3 className="text-lg font-semibold text-[var(--theme-text)]">Recent Family Inquiries</h3>
              </div>
              <div className="p-6">
                {stats.next_of_kin_inquiries && stats.next_of_kin_inquiries.length > 0 ? (
                  <div className="space-y-4">
                    {stats.next_of_kin_inquiries.slice(0, 5).map((inquiry: any) => (
                      <div key={inquiry.id} className="p-4 bg-[var(--theme-accent)]/5 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-[var(--theme-text)]">{inquiry.inquirer_name}</h4>
                            <p className="text-sm text-[var(--theme-text-muted)]">
                              Inquiring about: {inquiry.deceased_name}
                            </p>
                            <p className="text-xs text-[var(--theme-text-muted)] mt-1">
                              Relationship: {inquiry.relationship} • {inquiry.contact_phone}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            inquiry.verified ? 'bg-[var(--theme-success)]/20 text-[var(--theme-success)]' : 'bg-[var(--theme-warning)]/20 text-[var(--theme-warning)]'
                          }`}>
                            {inquiry.verified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--theme-text-muted)] text-center py-8">
                    No recent family inquiries.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl">
            <div className="p-6 border-b border-[var(--theme-border)]/20">
              <h3 className="text-lg font-semibold text-[var(--theme-text)]">My Assigned Cases</h3>
              <p className="text-[var(--theme-text-muted)] text-sm mt-1">
                Records you've created or are assigned to manage
              </p>
            </div>
            <div className="p-6">
              {stats.assigned_cases && stats.assigned_cases.length > 0 ? (
                <div className="space-y-4">
                  {stats.assigned_cases.map((record: any) => (
                    <div key={record.id} className="border border-[var(--theme-border)]/20 rounded-lg p-6 hover:border-[var(--theme-accent)]/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-[var(--theme-text)] mb-2">{record.full_name}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[var(--theme-text-muted)]">
                            <div>
                              <p><strong>Date of Death:</strong> {new Date(record.date_of_death).toLocaleDateString()}</p>
                              <p><strong>Location Found:</strong> {record.location_found}</p>
                            </div>
                            <div>
                              <p><strong>Status:</strong> 
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                  record.identification_status === 'identified' ? 'bg-[var(--theme-success)]/20 text-[var(--theme-success)]' :
                                  record.identification_status === 'pending_confirmation' ? 'bg-[var(--theme-warning)]/20 text-[var(--theme-warning)]' :
                                  'bg-[var(--theme-error)]/20 text-[var(--theme-error)]'
                                }`}>
                                  {record.identification_status.replace('_', ' ')}
                                </span>
                              </p>
                              <p><strong>Public:</strong> {record.is_public_viewable ? 'Yes' : 'No'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-[var(--theme-accent)] hover:text-[var(--theme-accent)]/80 transition-colors p-2">
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[var(--theme-text-muted)] text-center py-8">
                  No cases assigned. Create your first record to get started.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl">
            <div className="p-6 border-b border-[var(--theme-border)]/20">
              <h3 className="text-lg font-semibold text-[var(--theme-text)]">Family Inquiries</h3>
              <p className="text-[var(--theme-text-muted)] text-sm mt-1">
                Next of kin inquiries for your assigned cases
              </p>
            </div>
            <div className="p-6">
              <p className="text-[var(--theme-text-muted)] text-center py-8">
                Comprehensive family inquiry management interface will be implemented here.
                This includes inquiry verification, communication tools, and family connection facilitation.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl">
            <div className="p-6 border-b border-[var(--theme-border)]/20">
              <h3 className="text-lg font-semibold text-[var(--theme-text)]">Create New Deceased Record</h3>
              <p className="text-[var(--theme-text-muted)] text-sm mt-1">
                Add a new deceased individual record to the system with care and accuracy
              </p>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[var(--theme-accent)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-[var(--theme-accent)]" />
                </div>
                <h4 className="text-lg font-semibold text-[var(--theme-text)] mb-2">Ready to Create a New Record?</h4>
                <p className="text-[var(--theme-text-muted)] mb-6 max-w-md mx-auto">
                  Use the comprehensive form to add all relevant information about a deceased individual with dignity and care.
                </p>
                <button 
                  onClick={() => setShowDeceasedForm(true)}
                  className="bg-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/80 text-[var(--theme-background)] px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create New Record</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Forms */}
      <DeceasedRecordForm
        isOpen={showDeceasedForm}
        onClose={() => setShowDeceasedForm(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  )
}

export default EnhancedStaffDashboard