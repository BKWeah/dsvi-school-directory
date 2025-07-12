import React from 'react'
import { useAdminAuth, ADMIN_PERMISSIONS } from '../../contexts/AdminAuthContext'
import AdminLogin from './AdminLogin'
import { Shield, AlertTriangle } from 'lucide-react'

interface ProtectedAdminRouteProps {
  children: React.ReactNode
  requiredLevel?: number
  requiredPermissions?: string[]
  fallbackMessage?: string
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  children,
  requiredLevel,
  requiredPermissions = [],
  fallbackMessage
}) => {
  const { admin, loading, hasPermission, hasMinimumLevel, isAuthenticated } = useAdminAuth()

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Show login if not authenticated
  if (!isAuthenticated || !admin) {
    return <AdminLogin onLoginSuccess={() => window.location.reload()} />
  }

  // Check admin level requirement
  if (requiredLevel && !hasMinimumLevel(requiredLevel)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Insufficient Permissions</h1>
          <p className="text-gray-600 mb-4">
            {fallbackMessage || 
              `This section requires Level ${requiredLevel} admin access or higher. You currently have Level ${admin.admin_level} access.`
            }
          </p>
          <div className="text-sm text-gray-500">
            <p>Current access level: <strong>Level {admin.admin_level}</strong></p>
            <p>Required level: <strong>Level {requiredLevel} or higher</strong></p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="mt-6 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Check specific permission requirements
  if (requiredPermissions.length > 0) {
    const missingPermissions = requiredPermissions.filter(permission => !hasPermission(permission))
    
    if (missingPermissions.length > 0) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <Shield className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h1>
            <p className="text-gray-600 mb-4">
              {fallbackMessage || 
                'You do not have the required permissions to access this section.'
              }
            </p>
            <div className="text-sm text-gray-500 text-left">
              <p className="mb-2"><strong>Missing permissions:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                {missingPermissions.map(permission => (
                  <li key={permission} className="text-red-600">
                    {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => window.history.back()}
              className="mt-6 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      )
    }
  }

  // User has sufficient permissions, render the protected content
  return <>{children}</>
}

// Convenience components for common permission checks
export const SuperAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedAdminRoute 
    requiredLevel={1}
    fallbackMessage="This section requires Super Admin (Level 1) access."
  >
    {children}
  </ProtectedAdminRoute>
)

export const SystemAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedAdminRoute 
    requiredLevel={2}
    fallbackMessage="This section requires System Admin (Level 2) access or higher."
  >
    {children}
  </ProtectedAdminRoute>
)

export const ContentAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedAdminRoute 
    requiredLevel={3}
    fallbackMessage="This section requires Content Admin (Level 3) access or higher."
  >
    {children}
  </ProtectedAdminRoute>
)

export const VisitorManagementRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedAdminRoute 
    requiredPermissions={[ADMIN_PERMISSIONS.VIEW_VISITORS]}
    fallbackMessage="You need visitor management permissions to access this section."
  >
    {children}
  </ProtectedAdminRoute>
)

export const SchoolManagementRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedAdminRoute 
    requiredPermissions={[ADMIN_PERMISSIONS.REVIEW_SCHOOLS]}
    fallbackMessage="You need school management permissions to access this section."
  >
    {children}
  </ProtectedAdminRoute>
)

export const CampaignManagementRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedAdminRoute 
    requiredPermissions={[ADMIN_PERMISSIONS.APPROVE_CAMPAIGNS]}
    fallbackMessage="You need campaign management permissions to access this section."
  >
    {children}
  </ProtectedAdminRoute>
)

export default ProtectedAdminRoute