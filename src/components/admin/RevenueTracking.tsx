import React, { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Eye, MousePointer, Users, Calendar } from 'lucide-react'

interface RevenueData {
  date: string
  revenue: number
  impressions: number
  clicks: number
  campaigns: number
}

interface CampaignRevenue {
  id: string
  school_name: string
  campaign_title: string
  total_spent: number
  impressions: number
  clicks: number
  ctr: number
  cost_per_click: number
  start_date: string
  end_date: string
  status: 'active' | 'completed' | 'paused'
}

const RevenueTracking: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [campaignRevenues, setCampaignRevenues] = useState<CampaignRevenue[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRevenueData()
  }, [selectedPeriod])

  const loadRevenueData = async () => {
    try {
      setLoading(true)

      // Mock revenue data - in production this would come from Supabase
      const mockRevenueData: RevenueData[] = [
        { date: '2025-01-01', revenue: 245.50, impressions: 3420, clicks: 156, campaigns: 8 },
        { date: '2025-01-02', revenue: 312.75, impressions: 4100, clicks: 189, campaigns: 9 },
        { date: '2025-01-03', revenue: 198.25, impressions: 2890, clicks: 134, campaigns: 7 },
        { date: '2025-01-04', revenue: 425.00, impressions: 5200, clicks: 267, campaigns: 12 },
        { date: '2025-01-05', revenue: 356.80, impressions: 4650, clicks: 221, campaigns: 10 },
        { date: '2025-01-06', revenue: 289.90, impressions: 3980, clicks: 178, campaigns: 8 },
        { date: '2025-01-07', revenue: 445.20, impressions: 5680, clicks: 298, campaigns: 13 },
        { date: '2025-01-08', revenue: 378.60, impressions: 4420, clicks: 205, campaigns: 11 },
        { date: '2025-01-09', revenue: 512.30, impressions: 6100, clicks: 334, campaigns: 15 },
        { date: '2025-01-10', revenue: 267.45, impressions: 3210, clicks: 145, campaigns: 8 },
        { date: '2025-01-11', revenue: 398.75, impressions: 4890, clicks: 256, campaigns: 12 },
        { date: '2025-01-12', revenue: 423.90, impressions: 5320, clicks: 278, campaigns: 13 }
      ]

      const mockCampaignRevenues: CampaignRevenue[] = [
        {
          id: 'camp_1',
          school_name: 'Saint Mary Catholic School',
          campaign_title: 'Enrollment Campaign 2025',
          total_spent: 1250.00,
          impressions: 15420,
          clicks: 687,
          ctr: 4.45,
          cost_per_click: 1.82,
          start_date: '2025-01-01',
          end_date: '2025-03-31',
          status: 'active'
        },
        {
          id: 'camp_2',
          school_name: 'Lagos International School',
          campaign_title: 'Scholarship Program Ad',
          total_spent: 890.50,
          impressions: 12100,
          clicks: 523,
          ctr: 4.32,
          cost_per_click: 1.70,
          start_date: '2025-01-05',
          end_date: '2025-02-28',
          status: 'active'
        },
        {
          id: 'camp_3',
          school_name: 'Greenwood Academy',
          campaign_title: 'Open House Promotion',
          total_spent: 456.75,
          impressions: 8900,
          clicks: 234,
          ctr: 2.63,
          cost_per_click: 1.95,
          start_date: '2025-01-10',
          end_date: '2025-01-26',
          status: 'active'
        },
        {
          id: 'camp_4',
          school_name: 'Elite Secondary School',
          campaign_title: 'Science Program Highlight',
          total_spent: 780.25,
          impressions: 11200,
          clicks: 445,
          ctr: 3.97,
          cost_per_click: 1.75,
          start_date: '2024-12-15',
          end_date: '2025-01-15',
          status: 'completed'
        },
        {
          id: 'camp_5',
          school_name: 'Royal International School',
          campaign_title: 'International Curriculum Ad',
          total_spent: 1100.00,
          impressions: 16800,
          clicks: 672,
          ctr: 4.00,
          cost_per_click: 1.64,
          start_date: '2025-01-08',
          end_date: '2025-04-08',
          status: 'active'
        }
      ]

      setRevenueData(mockRevenueData)
      setCampaignRevenues(mockCampaignRevenues)
    } catch (error) {
      console.error('Failed to load revenue data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotals = () => {
    const totalRevenue = revenueData.reduce((sum, day) => sum + day.revenue, 0)
    const totalImpressions = revenueData.reduce((sum, day) => sum + day.impressions, 0)
    const totalClicks = revenueData.reduce((sum, day) => sum + day.clicks, 0)
    const averageCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
    const averageRevenuePerDay = revenueData.length > 0 ? totalRevenue / revenueData.length : 0

    return {
      totalRevenue,
      totalImpressions,
      totalClicks,
      averageCtr,
      averageRevenuePerDay
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totals = calculateTotals()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Revenue Tracking</h2>
          <p className="text-gray-600">Monitor advertising revenue and campaign performance</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="period" className="text-sm font-medium text-gray-700">Period:</label>
          <select
            id="period"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totals.totalRevenue)}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+12.5% from last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Impressions</p>
              <p className="text-2xl font-bold text-gray-900">{totals.totalImpressions.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+8.3% from last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <MousePointer className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">{totals.totalClicks.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+15.7% from last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average CTR</p>
              <p className="text-2xl font-bold text-gray-900">{totals.averageCtr.toFixed(2)}%</p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+2.1% from last period</span>
          </div>
        </div>
      </div>

      {/* Revenue Chart (Placeholder) */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Revenue Trend</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-2" />
            <p>Revenue chart visualization would go here</p>
            <p className="text-sm">Integration with charting library (Chart.js, Recharts, etc.)</p>
          </div>
        </div>
      </div>

      {/* Campaign Revenue Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Campaign Revenue Breakdown</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaignRevenues.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{campaign.campaign_title}</div>
                      <div className="text-sm text-gray-500">ID: {campaign.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.school_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(campaign.total_spent)}</div>
                    <div className="text-sm text-gray-500">₦{campaign.cost_per_click.toFixed(2)} per click</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {campaign.impressions.toLocaleString()} impressions
                    </div>
                    <div className="text-sm text-gray-500">
                      {campaign.clicks.toLocaleString()} clicks ({campaign.ctr.toFixed(2)}% CTR)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Calendar className="w-4 h-4" />
            <span>Export Revenue Report</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <DollarSign className="w-4 h-4" />
            <span>Export Campaign Data</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            <TrendingUp className="w-4 h-4" />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default RevenueTracking