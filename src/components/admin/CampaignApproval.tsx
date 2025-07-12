import React, { useState, useEffect } from 'react'
import { Megaphone, CheckCircle, XCircle, Clock, Eye, Play, Pause, BarChart, DollarSign, Users, Calendar } from 'lucide-react'
import type { DirectoryAd } from '../../types/database'

const CampaignApproval: React.FC = () => {
  const [campaigns, setCampaigns] = useState<DirectoryAd[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCampaign, setSelectedCampaign] = useState<DirectoryAd | null>(null)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [processing, setProcessing] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'completed'>('all')

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    setLoading(true)
    try {
      // Mock data for demonstration - in production, fetch from Supabase
      const mockCampaigns: DirectoryAd[] = [
        {
          id: '1',
          created_at: '2025-01-10T10:00:00Z',
          updated_at: '2025-01-10T10:00:00Z',
          school_id: 'school_1',
          school_type: 'dsvi',
          ad_content: 'Enroll now for our new academic year! Excellence in education awaits at Saint Mary\'s School.',
          ad_type: 'text',
          target_audience: { county: 'Montserrado', education_levels: ['primary', 'secondary'] },
          reach_count: 500,
          duration_days: 14,
          pricing: 85.50,
          status: 'pending',
          impressions: 0,
          clicks: 0,
          payment_status: 'paid',
          payment_reference: 'DSVI_1234567890',
          approved_by: undefined,
          approved_at: undefined
        },
        {
          id: '2',
          created_at: '2025-01-09T14:30:00Z',
          updated_at: '2025-01-11T09:15:00Z',
          school_id: 'school_2',
          school_type: 'manual',
          ad_content: 'New scholarship program available for outstanding students. Apply now!',
          ad_type: 'banner',
          ad_file_url: 'https://via.placeholder.com/400x200/3B82F6/FFFFFF?text=Scholarship+Program',
          target_audience: { education_levels: ['undergraduate', 'graduate'] },
          reach_count: 1000,
          duration_days: 30,
          pricing: 145.00,
          status: 'active',
          impressions: 2847,
          clicks: 156,
          expires_at: '2025-02-10T14:30:00Z',
          payment_status: 'paid',
          payment_reference: 'DSVI_0987654321',
          approved_by: 'admin_1',
          approved_at: '2025-01-11T09:15:00Z'
        },
        {
          id: '3',
          created_at: '2025-01-08T16:45:00Z',
          updated_at: '2025-01-08T16:45:00Z',
          school_id: 'school_3',
          school_type: 'dsvi',
          ad_content: 'Learn cutting-edge technology skills at our state-of-the-art computer lab!',
          ad_type: 'video',
          ad_file_url: 'https://example.com/videos/tech-lab-promo.mp4',
          target_audience: { county: 'Bong', professions: ['student', 'parent'] },
          reach_count: 250,
          duration_days: 7,
          pricing: 65.25,
          status: 'rejected',
          impressions: 0,
          clicks: 0,
          payment_status: 'paid',
          payment_reference: 'DSVI_5544332211',
          approved_by: 'admin_2',
          approved_at: '2025-01-09T08:30:00Z'
        },
        {
          id: '4',
          created_at: '2025-01-12T11:20:00Z',
          updated_at: '2025-01-12T11:20:00Z',
          school_id: 'school_4',
          school_type: 'manual',
          ad_content: 'Open House Event this Saturday! Visit our beautiful campus and meet our teachers.',
          ad_type: 'text',
          target_audience: { county: 'Maryland', professions: ['parent'] },
          reach_count: 300,
          duration_days: 3,
          pricing: 42.60,
          status: 'pending',
          impressions: 0,
          clicks: 0,
          payment_status: 'paid',
          payment_reference: 'DSVI_9988776655',
          approved_by: undefined,
          approved_at: undefined
        },
        {
          id: '5',
          created_at: '2025-01-07T09:30:00Z',
          updated_at: '2025-01-14T17:00:00Z',
          school_id: 'school_5',
          school_type: 'dsvi',
          ad_content: 'Congratulations to our graduating class of 2024! 100% college acceptance rate.',
          ad_type: 'banner',
          ad_file_url: 'https://via.placeholder.com/400x200/059669/FFFFFF?text=Graduation+Success',
          target_audience: { county: 'Lofa', education_levels: ['secondary'] },
          reach_count: 750,
          duration_days: 21,
          pricing: 128.75,
          status: 'completed',
          impressions: 4521,
          clicks: 298,
          expires_at: '2025-01-28T09:30:00Z',
          payment_status: 'paid',
          payment_reference: 'DSVI_1122334455',
          approved_by: 'admin_1',
          approved_at: '2025-01-07T12:00:00Z'
        }
      ]

      setCampaigns(mockCampaigns)
    } catch (error) {
      console.error('Failed to fetch campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (campaign: DirectoryAd, action: 'approve' | 'reject', notes?: string) => {
    setProcessing(true)
    try {
      // In production, update campaign status in Supabase
      const updatedCampaign = {
        ...campaign,
        status: action === 'approve' ? 'active' : 'rejected',
        approved_by: 'current_admin',
        approved_at: new Date().toISOString(),
        expires_at: action === 'approve' 
          ? new Date(Date.now() + campaign.duration_days * 24 * 60 * 60 * 1000).toISOString()
          : undefined
      }

      setCampaigns(prev => prev.map(c => 
        c.id === campaign.id ? updatedCampaign : c
      ))

      setSelectedCampaign(null)
      setReviewAction(null)
      setAdminNotes('')

      alert(`Campaign ${action === 'approve' ? 'approved' : 'rejected'} successfully!`)
    } catch (error) {
      console.error('Review action failed:', error)
      alert('Failed to process review. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const toggleCampaignStatus = async (campaign: DirectoryAd) => {
    if (campaign.status !== 'active' && campaign.status !== 'paused') return

    const newStatus = campaign.status === 'active' ? 'paused' : 'active'
    
    setCampaigns(prev => prev.map(c => 
      c.id === campaign.id ? { ...c, status: newStatus } : c
    ))
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-orange-100 text-orange-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'active': return <Play className="w-4 h-4" />
      case 'paused': return <Pause className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
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

  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`
  }

  const calculateCTR = (clicks: number, impressions: number): string => {
    if (impressions === 0) return '0.0%'
    return ((clicks / impressions) * 100).toFixed(1) + '%'
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    if (filter === 'all') return true
    if (filter === 'pending') return campaign.status === 'pending'
    if (filter === 'active') return campaign.status === 'active'
    if (filter === 'completed') return campaign.status === 'completed'
    return true
  })

  const pendingCampaigns = campaigns.filter(c => c.status === 'pending')
  const activeCampaigns = campaigns.filter(c => c.status === 'active')
  const totalRevenue = campaigns.reduce((sum, c) => c.status !== 'rejected' ? sum + c.pricing : sum, 0)
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Megaphone className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCampaigns.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Play className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{activeCampaigns.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals - Priority Section */}
      {pendingCampaigns.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 text-yellow-600 mr-2" />
              Pending Approvals ({pendingCampaigns.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingCampaigns.map((campaign) => (
              <div key={campaign.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start space-x-4">
                      {campaign.ad_file_url && (
                        <div className="flex-shrink-0">
                          {campaign.ad_type === 'banner' ? (
                            <img
                              src={campaign.ad_file_url}
                              alt="Ad preview"
                              className="w-24 h-16 object-cover rounded border"
                            />
                          ) : campaign.ad_type === 'video' ? (
                            <video
                              src={campaign.ad_file_url}
                              className="w-24 h-16 object-cover rounded border"
                              controls={false}
                            />
                          ) : null}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Campaign #{campaign.id}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {campaign.ad_content}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <BarChart className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 capitalize">{campaign.ad_type}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{campaign.reach_count.toLocaleString()} reach</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{campaign.duration_days} days</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{formatCurrency(campaign.pricing)}</span>
                          </div>
                        </div>

                        {campaign.target_audience && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {Object.entries(campaign.target_audience).map(([key, value]) => {
                              if (!value) return null
                              const displayValue = Array.isArray(value) ? value.join(', ') : value
                              return (
                                <span key={key} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  {key.replace('_', ' ')}: {displayValue}
                                </span>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedCampaign(campaign)
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
                        setSelectedCampaign(campaign)
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

      {/* All Campaigns Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">All Campaigns</h2>
            <div className="flex space-x-2">
              {['all', 'pending', 'active', 'completed'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType as any)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    filter === filterType
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      {campaign.ad_file_url && (
                        <img
                          src={campaign.ad_file_url}
                          alt="Campaign"
                          className="w-12 h-8 object-cover rounded flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {campaign.ad_content.substring(0, 50)}
                          {campaign.ad_content.length > 50 && '...'}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500 capitalize">{campaign.ad_type}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{campaign.reach_count.toLocaleString()} reach</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                      {getStatusIcon(campaign.status)}
                      <span className="capitalize">{campaign.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span>{campaign.impressions.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BarChart className="w-4 h-4 text-gray-400" />
                          <span>{campaign.clicks}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        CTR: {calculateCTR(campaign.clicks, campaign.impressions)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{campaign.duration_days} days</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(campaign.pricing)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {campaign.status === 'active' && (
                        <button 
                          onClick={() => toggleCampaignStatus(campaign)}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                      )}
                      {campaign.status === 'paused' && (
                        <button 
                          onClick={() => toggleCampaignStatus(campaign)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedCampaign && reviewAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} Campaign
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Campaign: <strong>#{selectedCampaign.id}</strong></p>
              <p className="text-sm text-gray-600 mb-2">Content: {selectedCampaign.ad_content}</p>
              <p className="text-sm text-gray-600">
                You are about to {reviewAction} this campaign.
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
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={
                  reviewAction === 'approve' 
                    ? "Add any approval notes..."
                    : "Please specify the reason for rejection..."
                }
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedCampaign(null)
                  setReviewAction(null)
                  setAdminNotes('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={() => handleReview(selectedCampaign, reviewAction, adminNotes)}
                disabled={processing || (reviewAction === 'reject' && !adminNotes.trim())}
                className={`px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  reviewAction === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {processing ? 'Processing...' : `${reviewAction === 'approve' ? 'Approve' : 'Reject'} Campaign`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CampaignApproval