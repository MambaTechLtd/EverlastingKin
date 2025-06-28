import React, { useState, useEffect } from 'react'
import { Users, FileText, Shield, Clock, CheckCircle, XCircle, AlertTriangle, Eye, TrendingUp, Activity, Plus, Camera, Video, Upload } from 'lucide-react'
import { getDashboardStats, updateUserApproval, DashboardStats, AppUser } from '../../lib/supabase'
import { useTheme, applyTheme } from '../../hooks/useTheme'
import DeceasedRecordForm from './DataEntry/DeceasedRecordForm'
import PoliceReportForm from './DataEntry/PoliceReportForm'

const EnhancedAdminDashboard: React.FC = () => {
  const theme = useTheme()
  const [stats, setStats] = useState<DashboardStats>({})
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'records' | 'reports' | 'logs'>('overview')
  const [loading, setLoading] = useState(true)
  const [showDeceasedForm, setShowDeceasedForm] = useState(false)
  const [showPoliceForm, setShowPoliceForm] = useState(false)

  useEffect(() => {
    applyTheme(theme)
    fetchDashboardData()
  }, [theme])

  const fetchDashboardData = async () => {
    try {
      const dashboardData = await getDashboardStats('admin')
      setStats(dashboardData)
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserApproval = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await updateUserApproval(userId, status)
      if (!error) {
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error updating user approval:', error)
    }
  }

  const StatCard: React.FC<{
    title: string
    value: number
    description: string
    icon: React.ReactNode
    color: string
    trend?: { value: number; isPositive: boolean }
  }> = ({ title, value, description, icon, color, trend }) => (
    <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6 hover:border-[var(--theme-accent)]/50 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-[var(--theme-text-muted)] text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-[var(--theme-text)] mt-2 group-hover:text-[var(--theme-accent)] transition-colors">
            {value.toLocaleString()}
          </p>
          <p className="text-[var(--theme-text-muted)] text-xs mt-1">{description}</p>
          {trend && (
            <div className={`flex items-center space-x-1 mt-2 text-xs ${trend.isPositive ? 'text-[var(--theme-success)]' : 'text-[var(--theme-error)]'}`}>
              <TrendingUp className={`w-3 h-3 ${trend.isPositive ? '' : 'rotate-180'}`} />
              <span>{trend.value}% from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--theme-background)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--theme-accent)] mx-auto mb-4"></div>
          <p className="text-[var(--theme-text-muted)]">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8" style={{ backgroundColor: 'var(--theme-background)', minHeight: '100vh' }}>
      {/* Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-text)]">System Administration</h1>
          <p className="text-[var(--theme-text-muted)] mt-2">
            Comprehensive oversight and management of the Everlasting Kin platform
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <button
            onClick={() => setShowDeceasedForm(true)}
            className="bg-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/80 text-[var(--theme-background)] px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Add Deceased Record</span>
          </button>
          <button
            onClick={() => setShowPoliceForm(true)}
            className="border-2 border-[var(--theme-accent)] text-[var(--theme-accent)] hover:bg-[var(--theme-accent)] hover:text-[var(--theme-background)] px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
          >
            <Shield className="w-5 h-5" />
            <span>New Police Report</span>
          </button>
          <div className="flex items-center space-x-2 text-sm text-[var(--theme-text-muted)]">
            <Activity className="w-4 h-4 text-[var(--theme-success)]" />
            <span>System Operational</span>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="relative h-48 rounded-2xl overflow-hidden">
        <img 
          src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
          alt="Administrative oversight" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-background)]/80 to-transparent flex items-center">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-2">
              Comprehensive System Management
            </h2>
            <p className="text-[var(--theme-text-muted)]">
              Monitor, manage, and maintain the integrity of all platform operations
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.user_counts?.total || 0}
          description="All registered users"
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.user_counts?.pending_approval || 0}
          description="Awaiting review"
          icon={<Clock className="w-6 h-6 text-white" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Deceased Records"
          value={stats.deceased_records?.total || 0}
          description="Total records in system"
          icon={<FileText className="w-6 h-6 text-white" />}
          color="bg-green-500"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Police Reports"
          value={stats.police_reports?.total || 0}
          description="Investigation reports"
          icon={<Shield className="w-6 h-6 text-white" />}
          color="bg-purple-500"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6 hover:border-[var(--theme-accent)]/50 transition-colors">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-[var(--theme-accent)]/20 rounded-lg">
              <Camera className="w-6 h-6 text-[var(--theme-accent)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--theme-text)]">Media Management</h3>
          </div>
          <p className="text-[var(--theme-text-muted)] mb-4">
            Upload and manage photos, videos, and documents for records
          </p>
          <button className="text-[var(--theme-accent)] hover:underline font-medium">
            Manage Media →
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
            Secure video storage and playback for investigation purposes
          </p>
          <button className="text-[var(--theme-accent)] hover:underline font-medium">
            View Videos →
          </button>
        </div>

        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6 hover:border-[var(--theme-accent)]/50 transition-colors">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-[var(--theme-warning)]/20 rounded-lg">
              <Upload className="w-6 h-6 text-[var(--theme-warning)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--theme-text)]">Bulk Import</h3>
          </div>
          <p className="text-[var(--theme-text-muted)] mb-4">
            Import multiple records and data from external sources
          </p>
          <button className="text-[var(--theme-accent)] hover:underline font-medium">
            Import Data →
          </button>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[var(--theme-text)] mb-4">User Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[var(--theme-text-muted)]">Administrators</span>
              <span className="font-medium text-[var(--theme-text)]">{stats.user_counts?.admins || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--theme-text-muted)]">Mortuary Staff</span>
              <span className="font-medium text-[var(--theme-text)]">{stats.user_counts?.mortuary_staff || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--theme-text-muted)]">Police Officers</span>
              <span className="font-medium text-[var(--theme-text)]">{stats.user_counts?.police || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--theme-text-muted)]">Public Users</span>
              <span className="font-medium text-[var(--theme-text)]">{stats.user_counts?.public_users || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[var(--theme-text)] mb-4">Record Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[var(--theme-text-muted)]">Unidentified</span>
              <span className="font-medium text-[var(--theme-error)]">{stats.deceased_records?.unidentified || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--theme-text-muted)]">Pending Confirmation</span>
              <span className="font-medium text-[var(--theme-warning)]">{stats.deceased_records?.pending_confirmation || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--theme-text-muted)]">Identified</span>
              <span className="font-medium text-[var(--theme-success)]">{stats.deceased_records?.identified || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--theme-text-muted)]">Public Records</span>
              <span className="font-medium text-[var(--theme-accent)]">{stats.deceased_records?.public || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[var(--theme-text)] mb-4">Report Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[var(--theme-text-muted)]">Draft Reports</span>
              <span className="font-medium text-[var(--theme-text-muted)]">{stats.police_reports?.draft || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--theme-text-muted)]">Submitted</span>
              <span className="font-medium text-[var(--theme-warning)]">{stats.police_reports?.submitted || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--theme-text-muted)]">Closed</span>
              <span className="font-medium text-[var(--theme-success)]">{stats.police_reports?.closed || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-[var(--theme-border)]/30">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'records', label: 'Records', icon: FileText },
            { id: 'reports', label: 'Reports', icon: Shield },
            { id: 'logs', label: 'Activity Logs', icon: Activity },
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
          <div className="space-y-6">
            {/* Pending Approvals */}
            {stats.pending_users && stats.pending_users.length > 0 && (
              <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl">
                <div className="p-6 border-b border-[var(--theme-border)]/20">
                  <h3 className="text-lg font-semibold text-[var(--theme-text)] flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-[var(--theme-warning)]" />
                    <span>Pending User Approvals ({stats.pending_users.length})</span>
                  </h3>
                </div>
                <div className="divide-y divide-[var(--theme-border)]/20">
                  {stats.pending_users.slice(0, 5).map((user: AppUser) => (
                    <div key={user.id} className="p-6 flex items-center justify-between hover:bg-[var(--theme-accent)]/5 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[var(--theme-accent)]/20 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-[var(--theme-accent)]" />
                          </div>
                          <div>
                            <h4 className="font-medium text-[var(--theme-text)]">
                              {user.first_name} {user.last_name}
                            </h4>
                            <p className="text-sm text-[var(--theme-text-muted)]">
                              {user.email} • {user.role.replace('_', ' ')}
                            </p>
                            {user.organization && (
                              <p className="text-xs text-[var(--theme-text-muted)]">
                                {user.organization}
                                {user.badge_number && ` • Badge: ${user.badge_number}`}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleUserApproval(user.id, 'approved')}
                          className="flex items-center space-x-1 bg-[var(--theme-success)] hover:bg-[var(--theme-success)]/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleUserApproval(user.id, 'rejected')}
                          className="flex items-center space-x-1 bg-[var(--theme-error)] hover:bg-[var(--theme-error)]/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl">
              <div className="p-6 border-b border-[var(--theme-border)]/20">
                <h3 className="text-lg font-semibold text-[var(--theme-text)]">Recent System Activity</h3>
              </div>
              <div className="p-6">
                {stats.recent_activity && stats.recent_activity.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recent_activity.slice(0, 8).map((log, index) => (
                      <div key={index} className="flex items-start space-x-3 text-sm">
                        <div className="w-2 h-2 bg-[var(--theme-accent)] rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-[var(--theme-text)]">{log.action}</p>
                          <p className="text-[var(--theme-text-muted)] text-xs">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--theme-text-muted)] text-center py-4">
                    No recent activity recorded
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab !== 'overview' && (
          <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)]/30 rounded-xl">
            <div className="p-6 border-b border-[var(--theme-border)]/20">
              <h3 className="text-lg font-semibold text-[var(--theme-text)]">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
              </h3>
              <p className="text-[var(--theme-text-muted)] text-sm mt-1">
                Comprehensive {activeTab} management interface
              </p>
            </div>
            <div className="p-6">
              <p className="text-[var(--theme-text-muted)] text-center py-8">
                Advanced {activeTab} management interface will be implemented here.
                This includes detailed views, editing capabilities, and administrative controls.
              </p>
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

      <PoliceReportForm
        isOpen={showPoliceForm}
        onClose={() => setShowPoliceForm(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  )
}

export default EnhancedAdminDashboard