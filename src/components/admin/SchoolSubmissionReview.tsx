import React, { useState, useEffect } from 'react'
import { School, CheckCircle, XCircle, Clock, Eye, ExternalLink, FileText, MapPin, Calendar, User } from 'lucide-react'
import type { DirectoryManualSchool } from '../../types/database'
import { getManualSchoolSubmissions, updateSchoolSubmissionStatus } from '../../lib/directoryService'
import { useAdminAuth } from '../../contexts/AdminAuthContext'

const SchoolSubmissionReview: React.FC = () => {
  const [submissions, setSubmissions] = useState<DirectoryManualSchool[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<DirectoryManualSchool | null>(null)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [processing, setProcessing] = useState(false)
  const { admin } = useAdminAuth()

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const data = await getManualSchoolSubmissions()
      setSubmissions(data)
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
      setSubmissions([])
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (submission: DirectoryManualSchool, action: 'approve' | 'reject', notes: string) => {
    setProcessing(true)
    try {
      // Update submission status in database
      const success = await updateSchoolSubmissionStatus(
        submission.id,
        action === 'approve' ? 'approved' : 'rejected',
        notes,
        admin?.id || 'unknown_admin'
      )

      if (!success) {
        throw new Error('Failed to update submission status')
      }

      // Update local state
      setSubmissions(prev => prev.map(s => 
        s.id === submission.id 
          ? {
              ...s,
              status: action === 'approve' ? 'approved' : 'rejected',
              reviewed_by: admin?.id || 'unknown_admin',
              reviewed_at: new Date().toISOString(),
              admin_notes: notes
            }
          : s
      ))

      // Reset form
      setSelectedSubmission(null)
      setReviewAction(null)
      setAdminNotes('')

      // Refresh submissions list
      await fetchSubmissions()

      alert(`School ${action === 'approve' ? 'approved' : 'rejected'} successfully!`)
    } catch (error) {
      console.error('Review action failed:', error)
      alert('Failed to process review. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const pendingSubmissions = submissions.filter(s => s.status === 'pending')
  const reviewedSubmissions = submissions.filter(s => s.status !== 'pending')

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <School className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No school submissions</h3>
        <p className="mt-1 text-sm text-gray-500">
          There are currently no school submissions to review.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <School className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Submissions</p>
              <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{pendingSubmissions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {submissions.filter(s => s.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {submissions.filter(s => s.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Submissions - Priority Section */}
      {pendingSubmissions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 text-yellow-600 mr-2" />
              Pending Reviews ({pendingSubmissions.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingSubmissions.map((submission) => (
              <div key={submission.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex space-x-4 flex-1">
                    {submission.logo_url && (
                      <img
                        src={submission.logo_url}
                        alt={`${submission.school_name} logo`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {submission.school_name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {submission.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <School className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 capitalize">{submission.school_type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Est. {submission.year_established}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{submission.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{submission.categories.length} programs</span>
                        </div>
                      </div>

                      {/* Contact Info */}
                      {submission.contact_info && (
                        <div className="mt-3 text-xs text-gray-500">
                          {typeof submission.contact_info === 'object' && submission.contact_info !== null && (
                            <>
                              {(submission.contact_info as any).email && (
                                <div>Email: {(submission.contact_info as any).email}</div>
                              )}
                              {(submission.contact_info as any).phone && (
                                <div>Phone: {(submission.contact_info as any).phone}</div>
                              )}
                            </>
                          )}
                        </div>
                      )}

                      <div className="flex items-center space-x-4 mt-4">
                        {submission.website_url && (
                          <a
                            href={submission.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Visit Website</span>
                          </a>
                        )}
                        {submission.permit_url && (
                          <a
                            href={submission.permit_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm"
                          >
                            <FileText className="w-4 h-4" />
                            <span>View Permit</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedSubmission(submission)
                        setReviewAction('approve')
                        setAdminNotes('')
                      }}
                      className="flex items-center space-x-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSubmission(submission)
                        setReviewAction('reject')
                        setAdminNotes('')
                      }}
                      className="flex items-center space-x-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Submissions Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All School Submissions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {submission.logo_url && (
                        <img
                          src={submission.logo_url}
                          alt="Logo"
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {submission.school_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Est. {submission.year_established}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">
                      {submission.school_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{submission.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(submission.status)}`}>
                      {getStatusIcon(submission.status)}
                      <span className="capitalize">{submission.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(submission.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedSubmission && reviewAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} School Submission
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">School: <strong>{selectedSubmission.school_name}</strong></p>
              <p className="text-sm text-gray-600">
                You are about to {reviewAction} this school submission.
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes {reviewAction === 'reject' ? '(Required)' : '(Optional)'}
              </label>
              <textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={
                  reviewAction === 'approve' 
                    ? "Add any approval notes or conditions..."
                    : "Please specify the reason for rejection..."
                }
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedSubmission(null)
                  setReviewAction(null)
                  setAdminNotes('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={() => handleReview(selectedSubmission, reviewAction, adminNotes)}
                disabled={processing || (reviewAction === 'reject' && !adminNotes.trim())}
                className={`px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  reviewAction === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {processing ? 'Processing...' : `${reviewAction === 'approve' ? 'Approve' : 'Reject'} School`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SchoolSubmissionReview