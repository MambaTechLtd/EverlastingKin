import React, { useState } from 'react'
import { Shield, FileText, Search, Plus, AlertCircle } from 'lucide-react'

const PoliceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'cases'>('overview')

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ek-text-main">Police Dashboard</h1>
          <p className="text-ek-text-muted mt-1">
            Investigation support and case management
          </p>
        </div>
        <button className="mt-4 sm:mt-0 bg-ek-accent-gold hover:bg-ek-accent-gold/80 text-ek-bg-main px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Report</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ek-text-muted text-sm font-medium">Active Cases</p>
              <p className="text-3xl font-bold text-ek-text-main mt-2">7</p>
              <p className="text-ek-text-muted text-xs mt-1">Under investigation</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ek-text-muted text-sm font-medium">Fingerprint Matches</p>
              <p className="text-3xl font-bold text-ek-text-main mt-2">4</p>
              <p className="text-ek-text-muted text-xs mt-1">This month</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ek-text-muted text-sm font-medium">Pending Reviews</p>
              <p className="text-3xl font-bold text-ek-text-main mt-2">2</p>
              <p className="text-ek-text-muted text-xs mt-1">Require attention</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-ek-accent-gold/30">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'reports', label: 'My Reports', icon: FileText },
            { id: 'cases', label: 'Case Search', icon: Search },
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
                <h3 className="text-lg font-semibold text-ek-text-main">Recent Investigation Activity</h3>
              </div>
              <div className="p-6">
                <p className="text-ek-text-muted text-center py-8">
                  Your recent investigation activity will appear here.
                  This includes new reports filed, fingerprint analysis results, and case updates.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg">
            <div className="p-6 border-b border-ek-accent-gold/20">
              <h3 className="text-lg font-semibold text-ek-text-main">Police Reports</h3>
              <p className="text-ek-text-muted text-sm mt-1">
                Reports you've created and are managing
              </p>
            </div>
            <div className="p-6">
              <p className="text-ek-text-muted text-center py-8">
                Your police reports will be displayed here.
                This includes case details, fingerprint match status, and investigation notes.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg">
            <div className="p-6 border-b border-ek-accent-gold/20">
              <h3 className="text-lg font-semibold text-ek-text-main">Case Search & Investigation</h3>
              <p className="text-ek-text-muted text-sm mt-1">
                Search deceased records for investigation purposes
              </p>
            </div>
            <div className="p-6">
              <p className="text-ek-text-muted text-center py-8">
                Advanced case search interface will be implemented here.
                This includes fingerprint matching, cross-referencing capabilities, and detailed case analysis tools.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PoliceDashboard