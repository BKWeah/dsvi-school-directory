import React from 'react'

const DirectoryAdmin: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Directory Admin Panel</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Manage directory visitors, school submissions, and ad campaigns.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            This page will provide admin tools for managing the directory platform.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DirectoryAdmin
