import React from 'react'

const ManualSubmission: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Submit Your School</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Submit your school to be listed in the DSVI School Directory.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            This page will contain a form for non-DSVI schools to submit their information.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ManualSubmission
