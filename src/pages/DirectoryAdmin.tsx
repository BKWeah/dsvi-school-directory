import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Shield, Users, School, Megaphone, BarChart, Settings, LogOut, User, DollarSign } from 'lucide-react'
import { AdminAuthProvider, useAdminAuth, ADMIN_PERMISSIONS } from '../contexts/AdminAuthContext'
import ProtectedAdminRoute, { 
  VisitorManagementRoute, 
  SchoolManagementRoute, 
  CampaignManagementRoute,
  SystemAdminRoute,
  SuperAdminRoute 
} from '../components/admin/ProtectedAdminRoute'
import VisitorManagement from '../components/admin/VisitorManagement'
import SchoolSubmissionReview from '../components/admin/SchoolSubmissionReview'
import CampaignApproval from '../components/admin/CampaignApproval'
import RevenueTracking from '../components/admin/RevenueTracking'

type AdminTab = 'overview' | 'visitors' | 'schools' | 'campaigns' | 'revenue' | 'analytics' | 'settings'

const DirectoryAdminContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const { admin, logout, hasPermission, hasMinimumLevel } = useAdminAuth()

  // Define tabs based on admin permissions
  const getAvailableTabs = () => {
    const baseTabs = [
      { id: 'overview', label: 'Overview', icon: BarChart, permission: null }
    ]

    if (hasPermission(ADMIN_PERMISSIONS.VIEW_VISITORS)) {
      baseTabs.push({ id: 'visitors', label: 'Visitors', icon: Users, permission: ADMIN_PERMISSIONS.VIEW_VISITORS })
    }

    if (hasPermission(ADMIN_PERMISSIONS.REVIEW_SCHOOLS)) {
      baseTabs.push({ id: 'schools', label: 'School Submissions', icon: School, permission: ADMIN_PERMISSIONS.REVIEW_SCHOOLS })
    }

    if (hasPermission(ADMIN_PERMISSIONS.APPROVE_CAMPAIGNS)) {
      baseTabs.push({ id: 'campaigns', label: 'Ad Campaigns', icon: Megaphone, permission: ADMIN_PERMISSIONS.APPROVE_CAMPAIGNS })
    }

    if (hasPermission(ADMIN_PERMISSIONS.VIEW_ANALYTICS)) {
      baseTabs.push({ id: 'revenue', label: 'Revenue', icon: BarChart, permission: ADMIN_PERMISSIONS.VIEW_ANALYTICS })
    }

    if (hasPermission(ADMIN_PERMISSIONS.VIEW_ANALYTICS)) {
      baseTabs.push({ id: 'analytics', label: 'Analytics', icon: BarChart, permission: ADMIN_PERMISSIONS.VIEW_ANALYTICS })
    }

    if (hasMinimumLevel(1)) {
      baseTabs.push({ id: 'settings', label: 'Settings', icon: Settings, permission: ADMIN_PERMISSIONS.MANAGE_SYSTEM })
    }

    return baseTabs
  }

  const tabs = getAvailableTabs()

  const getAdminLevelColor = (level: number): string => {
    switch (level) {
      case 1: return 'text-red-600 bg-red-100'
      case 2: return 'text-orange-600 bg-orange-100'
      case 3: return 'text-yellow-600 bg-yellow-100'
      case 4: return 'text-green-600 bg-green-100'
      case 99: return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getAdminLevelName = (level: number): string => {
    switch (level) {
      case 1: return 'Super Admin'
      case 2: return 'System Admin'
      case 3: return 'Content Admin'
      case 4: return 'Support Admin'
      case 99: return 'School Admin'
      default: return 'Unknown'
    }
  }

  const quickStats = {
    totalVisitors: 1247,
    newVisitorsThisWeek: 89,
    pendingSchools: 3,
    pendingCampaigns: 2,
    totalRevenue: 4567.85,
    activeAds: 12,
    monthlyRevenue: 1234.50,
    impressionsToday: 2456
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel - GyaWe School Directory</title>
        <meta name="description" content="Manage visitors, school submissions, and promotional campaigns for the GyaWe School Directory." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <span className="text-xl font-bold text-gray-900">Directory Admin</span>
                  <div className="text-sm text-gray-500">Management Console</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Admin Info */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{admin?.name}</div>
                    <div className="text-xs text-gray-500">{admin?.email}</div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getAdminLevelColor(admin?.admin_level || 0)}`}>
                    {getAdminLevelName(admin?.admin_level || 0)}
                  </div>
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as AdminTab)}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                      <p className="text-2xl font-bold text-gray-900">{quickStats.totalVisitors.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">New This Week</p>
                      <p className="text-2xl font-bold text-gray-900">{quickStats.newVisitorsThisWeek}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <School className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending Schools</p>
                      <p className="text-2xl font-bold text-gray-900">{quickStats.pendingSchools}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <Megaphone className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending Campaigns</p>
                      <p className="text-2xl font-bold text-gray-900">{quickStats.pendingCampaigns}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <BarChart className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Ads</p>
                      <p className="text-2xl font-bold text-gray-900">{quickStats.activeAds}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <BarChart className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${quickStats.totalRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-emerald-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">This Month</p>
                      <p className="text-2xl font-bold text-gray-900">${quickStats.monthlyRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('visitors')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Users className="w-6 h-6 text-blue-600 mb-2" />
                    <h3 className="font-medium text-gray-900">Manage Visitors</h3>
                    <p className="text-sm text-gray-600">View and export visitor data</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('schools')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <School className="w-6 h-6 text-yellow-600 mb-2" />
                    <h3 className="font-medium text-gray-900">Review Schools</h3>
                    <p className="text-sm text-gray-600">Approve pending school submissions</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('campaigns')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Megaphone className="w-6 h-6 text-orange-600 mb-2" />
                    <h3 className="font-medium text-gray-900">Review Campaigns</h3>
                    <p className="text-sm text-gray-600">Approve and manage ad campaigns</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('revenue')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <BarChart className="w-6 h-6 text-green-600 mb-2" />
                    <h3 className="font-medium text-gray-900">Revenue Tracking</h3>
                    <p className="text-sm text-gray-600">Monitor advertising revenue and performance</p>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">5 new visitor registrations</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <School className="w-5 h-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New school submission: Saint Teresa Catholic School</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Megaphone className="w-5 h-5 text-orange-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Campaign approved: Scholarship Program Ad</p>
                      <p className="text-xs text-gray-500">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'visitors' && (
            <VisitorManagementRoute>
              <VisitorManagement />
            </VisitorManagementRoute>
          )}
          
          {activeTab === 'schools' && (
            <SchoolManagementRoute>
              <SchoolSubmissionReview />
            </SchoolManagementRoute>
          )}
          
          {activeTab === 'campaigns' && (
            <CampaignManagementRoute>
              <CampaignApproval />
            </CampaignManagementRoute>
          )}
          
          {activeTab === 'revenue' && (
            <SystemAdminRoute>
              <RevenueTracking />
            </SystemAdminRoute>
          )}
          
          {activeTab === 'analytics' && (
            <SystemAdminRoute>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h2>
                <p className="text-gray-600">Comprehensive analytics and reporting coming soon...</p>
              </div>
            </SystemAdminRoute>
          )}
          
          {activeTab === 'settings' && (
            <SuperAdminRoute>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h2>
                <p className="text-gray-600">System configuration and settings coming soon...</p>
                
                {/* Admin Management Preview */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Future Features</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Admin user management</li>
                    <li>• Permission level configuration</li>
                    <li>• System-wide settings</li>
                    <li>• Audit log viewer</li>
                    <li>• Database backup and restore</li>
                  </ul>
                </div>
              </div>
            </SuperAdminRoute>
          )}
        </div>
      </div>
    </>
  )
}

const DirectoryAdmin: React.FC = () => {
  return (
    <AdminAuthProvider>
      <ProtectedAdminRoute>
        <DirectoryAdminContent />
      </ProtectedAdminRoute>
    </AdminAuthProvider>
  )
}

export default DirectoryAdmin
