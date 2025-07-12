import React, { useState, useEffect } from 'react'
import { Users, Download, Filter, Search, Eye, MapPin, GraduationCap, Briefcase, Calendar, TrendingUp } from 'lucide-react'
import type { DirectoryVisitor } from '../../types/database'

interface VisitorStats {
  total_visitors: number
  new_this_week: number
  top_county: string
  top_profession: string
  conversion_rate: number
}

const VisitorManagement: React.FC = () => {
  const [visitors, setVisitors] = useState<DirectoryVisitor[]>([])
  const [filteredVisitors, setFilteredVisitors] = useState<DirectoryVisitor[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<VisitorStats>({
    total_visitors: 0,
    new_this_week: 0,
    top_county: '',
    top_profession: '',
    conversion_rate: 0
  })

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    county: '',
    education_level: '',
    profession: '',
    date_range: '30' // days
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    fetchVisitors()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [visitors, filters])

  const fetchVisitors = async () => {
    setLoading(true)
    try {
      // Mock data for demonstration - in production, fetch from Supabase
      const mockVisitors: DirectoryVisitor[] = [
        {
          id: '1',
          created_at: '2025-01-10T08:30:00Z',
          updated_at: '2025-01-10T08:30:00Z',
          first_name: 'John',
          email_or_whatsapp: 'john.doe@email.com',
          city: 'Monrovia',
          county: 'Montserrado',
          education_level: 'undergraduate',
          profession: 'parent',
          consent_given: true,
          session_id: 'session_1'
        },
        {
          id: '2',
          created_at: '2025-01-11T14:15:00Z',
          updated_at: '2025-01-11T14:15:00Z',
          first_name: 'Mary',
          email_or_whatsapp: '+231770123456',
          city: 'Gbarnga',
          county: 'Bong',
          education_level: 'secondary',
          profession: 'teacher',
          consent_given: true,
          session_id: 'session_2'
        },
        {
          id: '3',
          created_at: '2025-01-12T10:45:00Z',
          updated_at: '2025-01-12T10:45:00Z',
          first_name: 'David',
          email_or_whatsapp: 'david.k@gmail.com',
          city: 'Harper',
          county: 'Maryland',
          education_level: 'graduate',
          profession: 'administrator',
          consent_given: true,
          session_id: 'session_3'
        },
        {
          id: '4',
          created_at: '2025-01-12T16:20:00Z',
          updated_at: '2025-01-12T16:20:00Z',
          first_name: 'Sarah',
          email_or_whatsapp: '+231555987654',
          city: 'Voinjama',
          county: 'Lofa',
          education_level: 'primary',
          profession: 'student',
          consent_given: true,
          session_id: 'session_4'
        },
        {
          id: '5',
          created_at: '2025-01-13T09:10:00Z',
          updated_at: '2025-01-13T09:10:00Z',
          first_name: 'Michael',
          email_or_whatsapp: 'michael.j@yahoo.com',
          city: 'Buchanan',
          county: 'Grand Bassa',
          education_level: 'undergraduate',
          profession: 'researcher',
          consent_given: true,
          session_id: 'session_5'
        }
      ]

      setVisitors(mockVisitors)

      // Calculate stats
      const totalVisitors = mockVisitors.length
      const newThisWeek = mockVisitors.filter(v => {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return new Date(v.created_at) > weekAgo
      }).length

      // Most common county
      const countyCounts = mockVisitors.reduce((acc, v) => {
        if (v.county) acc[v.county] = (acc[v.county] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      const topCounty = Object.keys(countyCounts).reduce((a, b) => 
        countyCounts[a] > countyCounts[b] ? a : b, '')

      // Most common profession
      const professionCounts = mockVisitors.reduce((acc, v) => {
        if (v.profession) acc[v.profession] = (acc[v.profession] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      const topProfession = Object.keys(professionCounts).reduce((a, b) => 
        professionCounts[a] > professionCounts[b] ? a : b, '')

      setStats({
        total_visitors: totalVisitors,
        new_this_week: newThisWeek,
        top_county: topCounty,
        top_profession: topProfession,
        conversion_rate: 15.8 // Mock conversion rate
      })

    } catch (error) {
      console.error('Failed to fetch visitors:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...visitors]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(v => 
        v.first_name.toLowerCase().includes(searchLower) ||
        v.email_or_whatsapp.toLowerCase().includes(searchLower) ||
        v.city?.toLowerCase().includes(searchLower) ||
        v.county?.toLowerCase().includes(searchLower)
      )
    }

    // County filter
    if (filters.county) {
      filtered = filtered.filter(v => v.county === filters.county)
    }

    // Education level filter
    if (filters.education_level) {
      filtered = filtered.filter(v => v.education_level === filters.education_level)
    }

    // Profession filter
    if (filters.profession) {
      filtered = filtered.filter(v => v.profession === filters.profession)
    }

    // Date range filter
    if (filters.date_range) {
      const daysAgo = new Date()
      daysAgo.setDate(daysAgo.getDate() - parseInt(filters.date_range))
      filtered = filtered.filter(v => new Date(v.created_at) > daysAgo)
    }

    setFilteredVisitors(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const exportVisitors = () => {
    // Create CSV content
    const headers = ['Name', 'Contact', 'City', 'County', 'Education', 'Profession', 'Registration Date']
    const csvContent = [
      headers.join(','),
      ...filteredVisitors.map(v => [
        v.first_name,
        v.email_or_whatsapp,
        v.city || '',
        v.county || '',
        v.education_level || '',
        v.profession || '',
        new Date(v.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n')

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `directory-visitors-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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

  const formatContact = (contact: string): string => {
    if (contact.includes('@')) {
      return contact // Email
    } else if (contact.startsWith('+')) {
      return contact // Phone with country code
    } else {
      return `+231${contact}` // Assume Liberian number
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedVisitors = filteredVisitors.slice(startIndex, startIndex + itemsPerPage)

  // Get unique values for filter dropdowns
  const uniqueCounties = [...new Set(visitors.map(v => v.county).filter(Boolean))]
  const uniqueEducationLevels = [...new Set(visitors.map(v => v.education_level).filter(Boolean))]
  const uniqueProfessions = [...new Set(visitors.map(v => v.profession).filter(Boolean))]

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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Visitors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_visitors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New This Week</p>
              <p className="text-2xl font-bold text-gray-900">{stats.new_this_week}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top County</p>
              <p className="text-lg font-bold text-gray-900">{stats.top_county}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Briefcase className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top Profession</p>
              <p className="text-lg font-bold text-gray-900">{stats.top_profession}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.conversion_rate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Visitor Management</h2>
          <button
            onClick={exportVisitors}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search visitors..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={filters.county}
            onChange={(e) => setFilters(prev => ({ ...prev, county: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Counties</option>
            {uniqueCounties.map(county => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>

          <select
            value={filters.education_level}
            onChange={(e) => setFilters(prev => ({ ...prev, education_level: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Education Levels</option>
            {uniqueEducationLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          <select
            value={filters.profession}
            onChange={(e) => setFilters(prev => ({ ...prev, profession: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Professions</option>
            {uniqueProfessions.map(profession => (
              <option key={profession} value={profession}>{profession}</option>
            ))}
          </select>

          <select
            value={filters.date_range}
            onChange={(e) => setFilters(prev => ({ ...prev, date_range: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>

        {/* Results Summary */}
        <div className="text-sm text-gray-600 mb-4">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredVisitors.length)} of {filteredVisitors.length} visitors
        </div>

        {/* Visitors Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visitor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Education
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profession
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedVisitors.map((visitor) => (
                <tr key={visitor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{visitor.first_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatContact(visitor.email_or_whatsapp)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {visitor.city && visitor.county ? `${visitor.city}, ${visitor.county}` : visitor.county || visitor.city || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{visitor.education_level || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{visitor.profession || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(visitor.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VisitorManagement