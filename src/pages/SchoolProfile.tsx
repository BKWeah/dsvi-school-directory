import React from 'react'
import { useParams } from 'react-router-dom'

const SchoolProfile: React.FC = () => {
  const { schoolId } = useParams<{ schoolId: string }>()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">School Profile</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            School profile page for ID: {schoolId}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            This page will display detailed information about the selected school.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SchoolProfile
