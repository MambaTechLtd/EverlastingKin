import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import AdminDashboard from './AdminDashboard'
import StaffDashboard from './StaffDashboard'
import PoliceDashboard from './PoliceDashboard'
import PublicDashboard from './PublicDashboard'

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ek-accent-gold mx-auto mb-4"></div>
          <p className="text-ek-text-muted">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-ek-text-main mb-4">
            Access Required
          </h2>
          <p className="text-ek-text-muted">
            Please sign in to access your dashboard.
          </p>
        </div>
      </div>
    )
  }

  // Check approval status for professional accounts
  if ((user.role === 'mortuary_staff' || user.role === 'police') && user.approval_status !== 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-ek-accent-gold/20 border border-ek-accent-gold/30 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-ek-text-main mb-4">
              Account Under Review
            </h2>
            <p className="text-ek-text-muted mb-4">
              Your {user.role === 'mortuary_staff' ? 'mortuary staff' : 'police'} account 
              is currently pending administrative approval.
            </p>
            <p className="text-ek-text-muted text-sm">
              Status: <span className="font-medium text-ek-accent-gold capitalize">
                {user.approval_status}
              </span>
            </p>
            <div className="mt-6 text-xs text-ek-text-muted">
              You'll receive an email notification once your account is reviewed.
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render appropriate dashboard based on user role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />
    case 'mortuary_staff':
      return <StaffDashboard />
    case 'police':
      return <PoliceDashboard />
    default:
      return <PublicDashboard />
  }
}

export default Dashboard