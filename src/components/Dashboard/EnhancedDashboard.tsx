import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import EnhancedAdminDashboard from './EnhancedAdminDashboard'
import EnhancedStaffDashboard from './EnhancedStaffDashboard'
import EnhancedPoliceDashboard from './EnhancedPoliceDashboard'
import EnhancedPublicDashboard from './EnhancedPublicDashboard'

const EnhancedDashboard: React.FC = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ek-accent-gold mx-auto mb-4"></div>
          <p className="text-ek-text-muted">Loading your personalized dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-ek-text-main mb-4">
            Access Required
          </h2>
          <p className="text-ek-text-muted mb-6">
            Please sign in to access your personalized dashboard and manage your cases.
          </p>
          <div className="bg-ek-accent-mint/10 border border-ek-accent-mint/30 rounded-lg p-4">
            <p className="text-sm text-ek-text-muted">
              Your dashboard provides role-specific tools and information tailored to your responsibilities.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Check approval status for professional accounts
  if ((user.role === 'mortuary_staff' || user.role === 'police') && user.approval_status !== 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-ek-accent-gold/20 border border-ek-accent-gold/30 rounded-xl p-8">
            <div className="w-16 h-16 bg-ek-accent-gold/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-ek-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-ek-text-main mb-4">
              Account Under Review
            </h2>
            <p className="text-ek-text-muted mb-4">
              Your {user.role === 'mortuary_staff' ? 'mortuary staff' : 'police'} account 
              is currently pending administrative approval for security and verification purposes.
            </p>
            <div className="bg-ek-bg-main/50 rounded-lg p-4 mb-4">
              <p className="text-sm text-ek-text-muted mb-2">
                <strong>Current Status:</strong> 
                <span className="font-medium text-ek-accent-gold capitalize ml-2">
                  {user.approval_status}
                </span>
              </p>
              <p className="text-sm text-ek-text-muted">
                <strong>Account Type:</strong> 
                <span className="ml-2">{user.role === 'mortuary_staff' ? 'Mortuary Staff' : 'Police Officer'}</span>
              </p>
            </div>
            <div className="text-xs text-ek-text-muted">
              You'll receive an email notification once your account is reviewed and approved.
              This process typically takes 24-48 hours.
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render appropriate dashboard based on user role
  switch (user.role) {
    case 'admin':
      return <EnhancedAdminDashboard />
    case 'mortuary_staff':
      return <EnhancedStaffDashboard />
    case 'police':
      return <EnhancedPoliceDashboard />
    default:
      return <EnhancedPublicDashboard />
  }
}

export default EnhancedDashboard