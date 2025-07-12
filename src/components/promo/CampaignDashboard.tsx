import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { BarChart, Eye, MousePointer, Calendar, DollarSign, Plus, Pause, Play, Edit, Trash2 } from 'lucide-react'
import { useSchoolAuth } from '../../contexts/SchoolAuthContext'
import type { DirectoryAd } from '../../types/database'

const CampaignDashboard: React.FC = () => {
  const { user } = useSchoolAuth()
  const [campaigns, setCampaigns] = useState<DirectoryAd[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalImpressions: 0,
    totalClicks: 0,
    totalSpent: 0
  })

  useEffect(() => {
    if (user) {
      fetchCampaigns()
    }
  }, [user])

  const fetchCampaigns = async () => {
    setLoading(true)
    try {
      // In a real implementation, you would fetch campaigns for the current school
      // const { data } = await supabase
      //   .from('directory_ads')
      //   .select('*')
      //   .eq('school_id', user.school.id)
      //   .order('created_at', { ascending: false })

      // Mock data for demonstration
      const mockCampaigns: DirectoryAd[] = [
        {
          id: '1',
          created_at: '2025-01-10T10:00:00Z',
          updated_at: '2025-01-10T10:00:00Z',
          school_id: user?.school.id || '',
          school_type: user?.school.source || 'dsvi',
          ad_content: 'Enroll now for our new academic year! Excellence in education awaits.',
          ad_type: 'text',
          target_audience: { county: 'Montserrado', education_levels: ['primary', 'secondary'] },
          reach_count: 500,
          duration_days: 14,
          pricing: 85.50,
          status: 'active',
          impressions: 1247,
          clicks: 89,
          expires_at: '2025-01-24T10:00:00Z',
          payment_status: 'paid',
          payment_reference: 'DSVI_1234567890',
          approved_by: 'admin',
          approved_at: '2025-01-10T12:00:00Z'
        },
        {
          id: '2',
          created_at: '2025-01-05T14:30:00Z',
          updated_at: '2025-01-05T14:30:00Z',
          school_id: user?.school.id || '',
          school_type: user?.school.source || 'dsvi',
          ad_content: 'Open House Event - Visit our campus this Saturday!',
          ad_type: 'text',
          target_audience: { county: 'Montserrado', professions: ['parent'] },
          reach_count: 250,
          duration_days: 7,
          pricing: 42.75,
          status: 'completed',
          impressions: 456,
          clicks: 34,
          expires_at: '2025-01-12T14:30:00Z',
          payment_status: 'paid',
          payment_reference: 'DSVI_0987654321',
          approved_by: 'admin',
          approved_at: '2025-01-05T16:30:00Z'
        },
        {
          id: '3',
          created_at: '2025-01-12T09:15:00Z',
          updated_at: '2025-01-12T09:15:00Z',
          school_id: user?.school.id || '',
          school_type: user?.school.source || 'dsvi',
          ad_content: 'New scholarship program available for outstanding students.',
          ad_type: 'banner',
          ad_file_url: 'https://via.placeholder.com/400x200/3B82F6/FFFFFF?text=Scholarship+Program',
          target_audience: { education_levels: ['undergraduate', 'graduate'] },
          reach_count: 1000,
          duration_days: 30,
          pricing: 145.00,
          status: 'pending',
          impressions: 0,
          clicks: 0,
          payment_status: 'paid',
          payment_reference: 'DSVI_1122334455',
          approved_by: undefined,
          approved_at: undefined
        }
      ]

      setCampaigns(mockCampaigns)

      // Calculate stats
      const totalImpressions = mockCampaigns.reduce((sum, campaign) => sum + campaign.impressions, 0)
      const totalClicks = mockCampaigns.reduce((sum, campaign) => sum + campaign.clicks, 0)
      const totalSpent = mockCampaigns.reduce((sum, campaign) => sum + campaign.pricing, 0)
      const activeCampaigns = mockCampaigns.filter(c => c.status === 'active').length

      setStats({
        totalCampaigns: mockCampaigns.length,
        activeCampaigns,
        totalImpressions,
        totalClicks,
        totalSpent
      })

    } catch (error) {
      console.error('Failed to fetch campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`
  }

  const calculateCTR = (clicks: number, impressions: number): string => {
    if (impressions === 0) return '0.0%'
    return ((clicks / impressions) * 100).toFixed(1) + '%'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your campaigns...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Campaign Dashboard - DSVI Promo Boost</title>
        <meta name="description" content="Manage and track your school's promotional campaigns in the DSVI Directory." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Campaign Dashboard</h1>
                <p className="text-gray-600 mt-1">{user?.school.name}</p>
              </div>
              <a
                href="/promo-boost"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Campaign</span>
              </a>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <BarChart className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Play className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeCampaigns}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalImpressions.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <MousePointer className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClicks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Campaigns Table */}
          <div className="bg-white shadow-sm border rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Your Campaigns</h2>
            </div>

            {campaigns.length === 0 ? (
              <div className="p-8 text-center">
                <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
                <p className="text-gray-600 mb-4">Create your first promotional campaign to start reaching more students and parents.</p>
                <a
                  href="/promo-boost"
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Campaign</span>
                </a>
              </div>
            ) : (
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
                        Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {campaigns.map((campaign) => (
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
                                {campaign.ad_content.substring(0, 60)}
                                {campaign.ad_content.length > 60 && '...'}
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
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
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
                                <MousePointer className="w-4 h-4 text-gray-400" />
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
                          {campaign.expires_at && (
                            <div className="text-xs text-gray-500 mt-1">
                              Expires: {formatDate(campaign.expires_at)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(campaign.pricing)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {campaign.status === 'active' && (
                              <button className="text-yellow-600 hover:text-yellow-900">
                                <Pause className="w-4 h-4" />
                              </button>
                            )}
                            {campaign.status === 'pending' && (
                              <button className="text-blue-600 hover:text-blue-900">
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            <button className="text-gray-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Campaign Tips</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-2">Optimize Your Reach</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Target specific counties for local reach</li>
                  <li>Use education levels to reach your ideal students</li>
                  <li>Consider parent profession targeting for enrollment</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Improve Performance</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Keep ad text clear and compelling</li>
                  <li>Use high-quality images for banner ads</li>
                  <li>Test different campaign durations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CampaignDashboard