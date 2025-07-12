import React, { useState } from 'react'
import { Users, Plus, Edit, Trash2, Shield, Mail, UserCheck, UserX } from 'lucide-react'

interface AdminUser {
  id: string
  name: string
  email: string
  admin_level: number
  permissions: string[]
  last_login?: string
  status: 'active' | 'inactive'
  created_at: string
}

const AdminManagement: React.FC = () => {
  // Mock admin users data
  const [admins, setAdmins] = useState<AdminUser[]>([
    {
      id: '1',
      name: 'DSVI Super Admin',
      email: 'admin@dsvi.com',
      admin_level: 1,
      permissions: ['manage_admins', 'manage_system', 'view_all_data'],
      last_login: '2025-01-12T10:30:00Z',
      status: 'active',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'DSVI Director',
      email: 'director@dsvi.com',
      admin_level: 1,
      permissions: ['manage_admins', 'manage_system', 'view_all_data'],
      last_login: '2025-01-11T16:45:00Z',
      status: 'active',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      name: 'Content Admin',
      email: 'content@dsvi.com',
      admin_level: 3,
      permissions: ['review_schools', 'approve_campaigns', 'moderate_content'],
      last_login: '2025-01-10T09:15:00Z',
      status: 'active',
      created_at: '2024-06-15T00:00:00Z'
    },
    {
      id: '4',
      name: 'Support Admin',
      email: 'support@dsvi.com',
      admin_level: 4,
      permissions: ['view_visitors', 'view_basic_analytics'],
      last_login: '2025-01-09T14:20:00Z',
      status: 'inactive',
      created_at: '2024-09-01T00:00:00Z'
    }
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null)

  const getAdminLevelName = (level: number): string => {
    switch (level) {
      case 1: return 'Super Admin'
      case 2: return 'System Admin'
      case 3: return 'Content Admin'
      case 4: return 'Support Admin'
      default: return 'Unknown'
    }
  }

  const getAdminLevelColor = (level: number): string => {
    switch (level) {
      case 1: return 'bg-red-100 text-red-800'
      case 2: return 'bg-orange-100 text-orange-800'
      case 3: return 'bg-yellow-100 text-yellow-800'
      case 4: return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
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

  const toggleAdminStatus = (adminId: string) => {
    setAdmins(prev => prev.map(admin => 
      admin.id === adminId 
        ? { ...admin, status: admin.status === 'active' ? 'inactive' : 'active' }
        : admin
    ))
  }

  const deleteAdmin = (adminId: string) => {
    if (confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      setAdmins(prev => prev.filter(admin => admin.id !== adminId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
          <p className="text-gray-600">Manage administrative users and their permissions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Admin</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Admins</p>
              <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {admins.filter(a => a.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Super Admins</p>
              <p className="text-2xl font-bold text-gray-900">
                {admins.filter(a => a.admin_level === 1).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <UserX className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-900">
                {admins.filter(a => a.status === 'inactive').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Administrative Users</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                        <div className="text-sm text-gray-500">{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAdminLevelColor(admin.admin_level)}`}>
                      Level {admin.admin_level} - {getAdminLevelName(admin.admin_level)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {admin.permissions.length} permission{admin.permissions.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-500">
                      {admin.permissions.slice(0, 2).map(p => p.replace('_', ' ')).join(', ')}
                      {admin.permissions.length > 2 && ` +${admin.permissions.length - 2} more`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {admin.last_login ? formatDate(admin.last_login) : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      admin.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {admin.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingAdmin(admin)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleAdminStatus(admin.id)}
                        className={`${
                          admin.status === 'active' 
                            ? 'text-orange-600 hover:text-orange-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {admin.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteAdmin(admin.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Implementation Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-3">Implementation Notes</h3>
        <div className="text-sm text-yellow-800 space-y-2">
          <p><strong>Current Status:</strong> This is a UI mockup showing the planned admin management interface.</p>
          <p><strong>Database Integration:</strong> Requires creating an `admin_users` table in Supabase.</p>
          <p><strong>Security:</strong> Admin creation/modification should require additional authentication.</p>
          <p><strong>Permissions:</strong> The permission system is designed to be flexible and role-based.</p>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-100 rounded border border-yellow-300">
          <p className="text-xs text-yellow-700">
            <strong>Production Deployment:</strong> This interface should only be accessible to Level 1 Super Admins 
            and should include additional security measures like 2FA and audit logging.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminManagement