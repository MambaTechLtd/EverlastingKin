import React, { useState, useEffect } from 'react'
import { Users, FileText, Shield, Clock, CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react'
import { supabase, User, DeceasedRecord, AuditLog } from '../../lib/supabase'

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    totalRecords: 0,
    recentActivity: 0
  })
  const [pendingUsers, setPendingUsers] = useState<User[]>([])
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'records' | 'logs'>('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch user statistics
      const { data: users } = await supabase
        .from('users')
        .select('id, role, approval_status')

      const totalUsers = users?.length || 0
      const pendingApprovals = users?.filter(u => u.approval_status === 'pending').length || 0

      // Fetch pending users for approval
      const { data: pending } = await supabase
        .from('users')
        .select('*')
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false })

      // Fetch deceased records count
      const { count: recordsCount } = await supabase
        .from('deceased_records')
        .select('*', { count: 'exact', head: true })

      // Fetch recent audit logs
      const { data: logs } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      setStats({
        totalUsers,
        pendingApprovals,
        totalRecords: recordsCount || 0,
        recentActivity: logs?.length || 0
      })

      setPendingUsers(pending || [])
      setRecentLogs(logs || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserApproval = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          approval_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('Error updating user status:', error)
        return
      }

      // Refresh data
      fetchDashboardData()

      // TODO: Send notification email to user about approval/rejection
    } catch (error) {
      console.error('Error in handleUserApproval:', error)
    }
  }

  const StatCard: React.FC<{
    title: string
    value: number
    description: string
    icon: React.ReactNode
    color: string
  }> = ({ title, value, description, icon, color }) => (
    <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-ek-text-muted text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-ek-text-main mt-2">{value}</p>
          <p className="text-ek-text-muted text-xs mt-1">{description}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ek-accent-gold mx-auto mb-4"></div>
          <p className="text-ek-text-muted">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ek-text-main">Admin Dashboard</h1>
          <p className="text-ek-text-muted mt-1">
            System overview and administrative controls
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          description="All registered users"
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          description="Awaiting review"
          icon={<Clock className="w-6 h-6 text-white" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Total Records"
          value={stats.totalRecords}
          description="Deceased records"
          icon={<FileText className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Recent Activity"
          value={stats.recentActivity}
          description="Last 24 hours"
          icon={<Shield className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-ek-accent-gold/30">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'records', label: 'Records', icon: FileText },
            { id: 'logs', label: 'Audit Logs', icon: Shield },
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
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Pending Approvals */}
            {pendingUsers.length > 0 && (
              <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg">
                <div className="p-6 border-b border-ek-accent-gold/20">
                  <h3 className="text-lg font-semibold text-ek-text-main flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-ek-accent-gold" />
                    <span>Pending User Approvals</span>
                  </h3>
                </div>
                <div className="divide-y divide-ek-accent-gold/20">
                  {pendingUsers.slice(0, 5).map((user) => (
                    <div key={user.id} className="p-6 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-ek-accent-mint/20 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-ek-accent-mint" />
                          </div>
                          <div>
                            <h4 className="font-medium text-ek-text-main">
                              {user.first_name} {user.last_name}
                            </h4>
                            <p className="text-sm text-ek-text-muted">
                              {user.email} • {user.role.replace('_', ' ')}
                            </p>
                            {user.organization && (
                              <p className="text-xs text-ek-text-muted">
                                {user.organization}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleUserApproval(user.id, 'approved')}
                          className="flex items-center space-x-1 bg-ek-success hover:bg-ek-success/80 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleUserApproval(user.id, 'rejected')}
                          className="flex items-center space-x-1 bg-ek-error hover:bg-ek-error/80 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
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
            <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg">
              <div className="p-6 border-b border-ek-accent-gold/20">
                <h3 className="text-lg font-semibold text-ek-text-main">Recent System Activity</h3>
              </div>
              <div className="p-6">
                {recentLogs.length > 0 ? (
                  <div className="space-y-4">
                    {recentLogs.slice(0, 8).map((log) => (
                      <div key={log.id} className="flex items-start space-x-3 text-sm">
                        <div className="w-2 h-2 bg-ek-accent-mint rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-ek-text-main">{log.action}</p>
                          <p className="text-ek-text-muted text-xs">
                            {new Date(log.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-ek-text-muted text-center py-4">
                    No recent activity recorded
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg">
            <div className="p-6 border-b border-ek-accent-gold/20">
              <h3 className="text-lg font-semibold text-ek-text-main">User Management</h3>
              <p className="text-ek-text-muted text-sm mt-1">
                Manage user accounts and approval status
              </p>
            </div>
            <div className="p-6">
              <p className="text-ek-text-muted text-center py-8">
                Comprehensive user management interface will be implemented here.
                This includes user search, role management, and detailed approval workflows.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg">
            <div className="p-6 border-b border-ek-accent-gold/20">
              <h3 className="text-lg font-semibold text-ek-text-main">Records Management</h3>
              <p className="text-ek-text-muted text-sm mt-1">
                Overview and management of all deceased records
              </p>
            </div>
            <div className="p-6">
              <p className="text-ek-text-muted text-center py-8">
                Detailed records management interface will be implemented here.
                This includes record search, validation, and administrative oversight.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg">
            <div className="p-6 border-b border-ek-accent-gold/20">
              <h3 className="text-lg font-semibold text-ek-text-main">Audit Logs</h3>
              <p className="text-ek-text-muted text-sm mt-1">
                System activity and security monitoring
              </p>
            </div>
            <div className="p-6">
              {recentLogs.length > 0 ? (
                <div className="space-y-3">
                  {recentLogs.map((log) => (
                    <div key={log.id} className="bg-ek-bg-main border border-ek-accent-gold/20 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-ek-text-main">{log.action}</p>
                          {log.details && (
                            <p className="text-sm text-ek-text-muted mt-1">
                              {JSON.stringify(log.details)}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-xs text-ek-text-muted">
                          <p>{new Date(log.created_at).toLocaleDateString()}</p>
                          <p>{new Date(log.created_at).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-ek-text-muted text-center py-8">No audit logs available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard