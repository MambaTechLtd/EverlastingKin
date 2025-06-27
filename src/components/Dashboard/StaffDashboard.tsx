import React, { useState } from 'react'
import { Plus, FileText, Users, Search, Calendar } from 'lucide-react'

const StaffDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'create'>('overview')

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ek-text-main">Mortuary Staff Dashboard</h1>
          <p className="text-ek-text-muted mt-1">
            Manage deceased records with care and dignity
          </p>
        </div>
        <button className="mt-4 sm:mt-0 bg-ek-accent-gold hover:bg-ek-accent-gold/80 text-ek-bg-main px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Record</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ek-text-muted text-sm font-medium">My Records</p>
              <p className="text-3xl font-bold text-ek-text-main mt-2">12</p>
              <p className="text-ek-text-muted text-xs mt-1">Active cases</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ek-text-muted text-sm font-medium">Families Connected</p>
              <p className="text-3xl font-bold text-ek-text-main mt-2">8</p>
              <p className="text-ek-text-muted text-xs mt-1">This month</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ek-text-muted text-sm font-medium">Pending Updates</p>
              <p className="text-3xl font-bold text-ek-text-main mt-2">3</p>
              <p className="text-ek-text-muted text-xs mt-1">Require attention</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-ek-accent-gold/30">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: FileText },
            { id: 'records', label: 'My Records', icon: Search },
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
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg">
              <div className="p-6 border-b border-ek-accent-gold/20">
                <h3 className="text-lg font-semibold text-ek-text-main">Recent Activity</h3>
              </div>
              <div className="p-6">
                <p className="text-ek-text-muted text-center py-8">
                  Your recent record management activity will appear here.
                  This includes new records created, updates made, and family connections facilitated.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg">
            <div className="p-6 border-b border-ek-accent-gold/20">
              <h3 className="text-lg font-semibold text-ek-text-main">My Records</h3>
              <p className="text-ek-text-muted text-sm mt-1">
                Records you've created or are assigned to manage
              </p>
            </div>
            <div className="p-6">
              <p className="text-ek-text-muted text-center py-8">
                Your managed deceased records will be displayed here.
                This includes search functionality, status updates, and family contact management.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg">
            <div className="p-6 border-b border-ek-accent-gold/20">
              <h3 className="text-lg font-semibold text-ek-text-main">Create New Record</h3>
              <p className="text-ek-text-muted text-sm mt-1">
                Add a new deceased individual record to the system
              </p>
            </div>
            <div className="p-6">
              <p className="text-ek-text-muted text-center py-8">
                Comprehensive record creation form will be implemented here.
                This includes personal details, location information, next of kin details, and document uploads.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StaffDashboard