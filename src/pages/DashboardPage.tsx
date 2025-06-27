import React from 'react'
import Dashboard from '../components/Dashboard/Dashboard'

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Dashboard />
      </div>
    </div>
  )
}

export default DashboardPage