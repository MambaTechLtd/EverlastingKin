import React, { useState, useEffect } from 'react'
import { Shield, FileText, Search, Plus, AlertCircle, Clock, CheckCircle, Eye, Camera, Video, Upload } from 'lucide-react'
import { getDashboardStats, DashboardStats } from '../../lib/supabase'
import { useTheme, applyTheme } from '../../hooks/useTheme'
import PoliceReportForm from './DataEntry/PoliceReportForm'

const EnhancedPoliceDashboard: React.FC = () => {
  const theme = useTheme()
  const [stats, setStats] = useState<DashboardStats>({})
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'cases' | 'investigations'>('overview')
  const [loading, setLoading] = useState(true)
  const [showPoliceForm, setShowPoliceForm] = useState(false)

  useEffect(() => {
    applyTheme(theme)
    fetchDashboardData()
  }, [theme])

  const fetchDashboardData = async () => {
    try {
      const dashboardData = await getDashboardStats('police')
      setStats(dashboardData)
    } catch (error) {
      console.error('Error fetching police dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--theme-background)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--theme-accent)] mx-auto mb-4"></div>
          <p className="text-[var(--theme-text-muted)]">Loading your investigation hub...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8" style={{ backgroundColor: 'var(--theme-background)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-text)]">Investigation Hub</h1>
          <p className="text-[var(--theme-text-muted)] mt-2">
            Investigation support, case management, and forensic coordination
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <button 
            onClick={() => setShowPoliceForm(true)}
            className="bg-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/80 text-[var(--theme-background)] px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>New Report</span>
          </button>
          <button className="border-2 border-[var(--theme-accent)] text-[var(--theme-accent)] hover:bg-[var(--theme-accent)] hover:text-[var(--theme-background)] px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload Evidence</span>
          </button>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="relative h-48 rounded-2xl overflow-hidden">
        <img 
          src="https://images.pexels.com/photos/8112199/pexels-photo-8112199.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
          alt="Police investigation" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-background)]/80 to-transparent flex items-center">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-2">
              Professional Investigation Support
            </h2>
            <p className="text-[var(--theme-text-muted)]">
              Advanced tools for case management and forensic coordination
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6 hover:border-[var(--theme-accent)]/50 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--theme-text-muted)] text-sm font-medium">My Reports</p>
              <p className="text-3xl font-bold text-[var(--theme-text)] mt-2 group-hover:text-[var(--theme-accent)] transition-colors">
                {stats.report_stats?.total || 0}
              </p>
              <p className="text-[var(--theme-text-muted)] text-xs mt-1">Total filed</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500 group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6 hover:border-[var(--theme-accent)]/50 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--theme-text-muted)] text-sm font-medium">Fingerprint Matches</p>
              <p className="text-3xl font-bold text-[var(--theme-text)] mt-2 group-hover:text-[var(--theme-success)] transition-colors">
                {stats.report_stats?.fingerprint_matches || 0}
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
              <p className="text-[var(--theme-text-muted)] text-sm font-medium">Active Cases</p>
              <p className="text-3xl font-bold text-[var(--theme-text)] mt-2 group-hover:text-[var(--theme-warning)] transition-colors">
                {(stats.report_stats?.draft || 0) + (stats.report_stats?.submitted || 0)}
              </p>
              <p className="text-[var(--theme-text-muted)] text-xs mt-1">Under investigation</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500 group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6 hover:border-[var(--theme-accent)]/50 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--theme-text-muted)] text-sm font-medium">Closed Cases</p>
              <p className="text-3xl font-bold text-[var(--theme-text)] mt-2 group-hover:text-[var(--theme-success)] transition-colors">
                {stats.report_stats?.closed || 0}
              </p>
              <p className="text-[var(--theme-text-muted)] text-xs mt-1">Completed</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Management Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6 hover:border-[var(--theme-accent)]/50 transition-colors">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-[var(--theme-accent)]/20 rounded-lg">
              <Camera className="w-6 h-6 text-[var(--theme-accent)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--theme-text)]">Crime Scene Photos</h3>
          </div>
          <p className="text-[var(--theme-text-muted)] mb-4">
            Secure photo evidence storage with chain of custody tracking
          </p>
          <button className="text-[var(--theme-accent)] hover:underline font-medium">
            Upload Photos →
          </button>
        </div>

        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6 hover:border-[var(--theme-accent)]/50 transition-colors">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-[var(--theme-success)]/20 rounded-lg">
              <Video className="w-6 h-6 text-[var(--theme-success)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--theme-text)]">Video Evidence</h3>
          </div>
          <p className="text-[var(--theme-text-muted)] mb-4">
            CCTV footage, interviews, and surveillance video management
          </p>
          <button className="text-[var(--theme-accent)] hover:underline font-medium">
            Manage Videos →
          </button>
        </div>

        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6 hover:border-[var(--theme-accent)]/50 transition-colors">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-[var(--theme-warning)]/20 rounded-lg">
              <FileText className="w-6 h-6 text-[var(--theme-warning)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--theme-text)]">Case Documents</h3>
          </div>
          <p className="text-[var(--theme-text-muted)] mb-4">
            Reports, witness statements, and forensic analysis documents
          </p>
          <button className="text-[var(--theme-accent)] hover:underline font-medium">
            View Documents →
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-[var(--theme-border)]/30">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'reports', label: 'My Reports', icon: FileText },
            { id: 'cases', label: 'Case Search', icon: Search },
            { id: 'investigations', label: 'Active Investigations', icon: AlertCircle },
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
            {/* Recent Reports */}
            <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl">
              <div className="p-6 border-b border-[var(--theme-border)]/20">
                <h3 className="text-lg font-semibold text-[var(--theme-text)]">Recent Reports</h3>
              </div>
              <div className="p-6">
                {stats.my_reports && stats.my_reports.length > 0 ? (
                  <div className="space-y-4">
                    {stats.my_reports.slice(0, 5).map((report: any) => (
                      <div key={report.id} className="flex items-center justify-between p-4 bg-[var(--theme-accent)]/5 rounded-lg hover:bg-[var(--theme-accent)]/10 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium text-[var(--theme-text)]">Case #{report.case_id}</h4>
                          <p className="text-sm text-[var(--theme-text-muted)]">
                            {report.deceased_name} • {report.jurisdiction}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              report.report_status === 'closed' ? 'bg-[var(--theme-success)]/20 text-[var(--theme-success)]' :
                              report.report_status === 'submitted' ? 'bg-[var(--theme-warning)]/20 text-[var(--theme-warning)]' :
                              'bg-[var(--theme-text-muted)]/20 text-[var(--theme-text-muted)]'
                            }`}>
                              {report.report_status}
                            </span>
                            {report.fingerprint_match_status && (
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                report.fingerprint_match_status === 'matched' ? 'bg-[var(--theme-success)]/20 text-[var(--theme-success)]' :
                                report.fingerprint_match_status === 'no_match' ? 'bg-[var(--theme-error)]/20 text-[var(--theme-error)]' :
                                'bg-[var(--theme-warning)]/20 text-[var(--theme-warning)]'
                              }`}>
                                Fingerprint: {report.fingerprint_match_status.replace('_', ' ')}
                              </span>
                            )}
                          </div>
                        </div>
                        <button className="text-[var(--theme-accent)] hover:text-[var(--theme-accent)]/80 transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--theme-text-muted)] text-center py-8">
                    No reports filed yet. Create your first report to get started.
                  </p>
                )}
              </div>
            </div>

            {/* Pending Investigations */}
            <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl">
              <div className="p-6 border-b border-[var(--theme-border)]/20">
                <h3 className="text-lg font-semibold text-[var(--theme-text)]">Pending Investigations</h3>
              </div>
              <div className="p-6">
                {stats.pending_investigations && stats.pending_investigations.length > 0 ? (
                  <div className="space-y-4">
                    {stats.pending_investigations.slice(0, 5).map((investigation: any) => (
                      <div key={investigation.id} className="p-4 bg-[var(--theme-accent)]/5 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-[var(--theme-text)]">Case #{investigation.case_id}</h4>
                            <p className="text-sm text-[var(--theme-text-muted)]">
                              {investigation.deceased_name}
                            </p>
                            <p className="text-xs text-[var(--theme-text-muted)] mt-1">
                              Open for {Math.floor(investigation.days_open)} days
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            investigation.fingerprint_status === 'matched' ? 'bg-[var(--theme-success)]/20 text-[var(--theme-success)]' :
                            investigation.fingerprint_status === 'no_match' ? 'bg-[var(--theme-error)]/20 text-[var(--theme-error)]' :
                            'bg-[var(--theme-warning)]/20 text-[var(--theme-warning)]'
                          }`}>
                            {investigation.fingerprint_status || 'pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--theme-text-muted)] text-center py-8">
                    No pending investigations.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl">
            <div className="p-6 border-b border-[var(--theme-border)]/20">
              <h3 className="text-lg font-semibold text-[var(--theme-text)]">My Police Reports</h3>
              <p className="text-[var(--theme-text-muted)] text-sm mt-1">
                Reports you've created and are managing
              </p>
            </div>
            <div className="p-6">
              {stats.my_reports && stats.my_reports.length > 0 ? (
                <div className="space-y-4">
                  {stats.my_reports.map((report: any) => (
                    <div key={report.id} className="border border-[var(--theme-border)]/20 rounded-lg p-6 hover:border-[var(--theme-accent)]/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-[var(--theme-text)] mb-2">Case #{report.case_id}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[var(--theme-text-muted)]">
                            <div>
                              <p><strong>Deceased:</strong> {report.deceased_name}</p>
                              <p><strong>Jurisdiction:</strong> {report.jurisdiction}</p>
                            </div>
                            <div>
                              <p><strong>Date Filed:</strong> {new Date(report.date_of_report).toLocaleDateString()}</p>
                              <p><strong>Status:</strong> 
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                  report.report_status === 'closed' ? 'bg-[var(--theme-success)]/20 text-[var(--theme-success)]' :
                                  report.report_status === 'submitted' ? 'bg-[var(--theme-warning)]/20 text-[var(--theme-warning)]' :
                                  'bg-[var(--theme-text-muted)]/20 text-[var(--theme-text-muted)]'
                                }`}>
                                  {report.report_status}
                                </span>
                              </p>
                            </div>
                          </div>
                          {report.fingerprint_match_status && (
                            <div className="mt-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                report.fingerprint_match_status === 'matched' ? 'bg-[var(--theme-success)]/20 text-[var(--theme-success)]' :
                                report.fingerprint_match_status === 'no_match' ? 'bg-[var(--theme-error)]/20 text-[var(--theme-error)]' :
                                'bg-[var(--theme-warning)]/20 text-[var(--theme-warning)]'
                              }`}>
                                Fingerprint Status: {report.fingerprint_match_status.replace('_', ' ')}
                              </span>
                            </div>
                          )}
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
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[var(--theme-accent)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-[var(--theme-accent)]" />
                  </div>
                  <h4 className="text-lg font-semibold text-[var(--theme-text)] mb-2">No Reports Yet</h4>
                  <p className="text-[var(--theme-text-muted)] mb-6 max-w-md mx-auto">
                    Create your first police report to start tracking investigations and evidence.
                  </p>
                  <button 
                    onClick={() => setShowPoliceForm(true)}
                    className="bg-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/80 text-[var(--theme-background)] px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create First Report</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl">
            <div className="p-6 border-b border-[var(--theme-border)]/20">
              <h3 className="text-lg font-semibold text-[var(--theme-text)]">Case Search & Investigation</h3>
              <p className="text-[var(--theme-text-muted)] text-sm mt-1">
                Search deceased records for investigation purposes
              </p>
            </div>
            <div className="p-6">
              <p className="text-[var(--theme-text-muted)] text-center py-8">
                Advanced case search interface will be implemented here.
                This includes fingerprint matching, cross-referencing capabilities, and detailed case analysis tools.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'investigations' && (
          <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl">
            <div className="p-6 border-b border-[var(--theme-border)]/20">
              <h3 className="text-lg font-semibold text-[var(--theme-text)]">Active Investigations</h3>
              <p className="text-[var(--theme-text-muted)] text-sm mt-1">
                Ongoing investigations requiring attention
              </p>
            </div>
            <div className="p-6">
              <p className="text-[var(--theme-text-muted)] text-center py-8">
                Comprehensive investigation management interface will be implemented here.
                This includes case timelines, evidence tracking, and collaboration tools.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Forms */}
      <PoliceReportForm
        isOpen={showPoliceForm}
        onClose={() => setShowPoliceForm(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  )
}

export default EnhancedPoliceDashboard