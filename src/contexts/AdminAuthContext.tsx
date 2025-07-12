import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface AdminUser {
  id: string
  email: string
  name: string
  admin_level: number
  permissions: string[]
  last_login?: string
  school_id?: string // For school-specific admins
  isAuthenticated: boolean
}

interface AdminAuthContextType {
  admin: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  hasPermission: (permission: string) => boolean
  hasMinimumLevel: (level: number) => boolean
  isAuthenticated: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

// Admin Permission Constants
export const ADMIN_PERMISSIONS = {
  // Level 1 - Super Admin
  MANAGE_ADMINS: 'manage_admins',
  MANAGE_SYSTEM: 'manage_system',
  VIEW_ALL_DATA: 'view_all_data',
  EXPORT_ALL_DATA: 'export_all_data',
  
  // Level 2 - System Admin  
  MANAGE_SCHOOLS: 'manage_schools',
  MANAGE_VISITORS: 'manage_visitors',
  MANAGE_CAMPAIGNS: 'manage_campaigns',
  VIEW_ANALYTICS: 'view_analytics',
  
  // Level 3 - Content Admin
  REVIEW_SCHOOLS: 'review_schools',
  APPROVE_CAMPAIGNS: 'approve_campaigns',
  MODERATE_CONTENT: 'moderate_content',
  
  // Level 4 - Support Admin
  VIEW_VISITORS: 'view_visitors',
  VIEW_BASIC_ANALYTICS: 'view_basic_analytics',
  
  // School Admin
  MANAGE_OWN_SCHOOL: 'manage_own_school',
  MANAGE_OWN_CAMPAIGNS: 'manage_own_campaigns'
} as const

// Default permissions by admin level
const getDefaultPermissions = (level: number): string[] => {
  switch (level) {
    case 1: // Super Admin
      return Object.values(ADMIN_PERMISSIONS)
    case 2: // System Admin
      return [
        ADMIN_PERMISSIONS.MANAGE_SCHOOLS,
        ADMIN_PERMISSIONS.MANAGE_VISITORS,
        ADMIN_PERMISSIONS.MANAGE_CAMPAIGNS,
        ADMIN_PERMISSIONS.VIEW_ANALYTICS,
        ADMIN_PERMISSIONS.REVIEW_SCHOOLS,
        ADMIN_PERMISSIONS.APPROVE_CAMPAIGNS,
        ADMIN_PERMISSIONS.MODERATE_CONTENT,
        ADMIN_PERMISSIONS.VIEW_VISITORS,
        ADMIN_PERMISSIONS.VIEW_BASIC_ANALYTICS
      ]
    case 3: // Content Admin
      return [
        ADMIN_PERMISSIONS.REVIEW_SCHOOLS,
        ADMIN_PERMISSIONS.APPROVE_CAMPAIGNS,
        ADMIN_PERMISSIONS.MODERATE_CONTENT,
        ADMIN_PERMISSIONS.VIEW_VISITORS,
        ADMIN_PERMISSIONS.VIEW_BASIC_ANALYTICS
      ]
    case 4: // Support Admin
      return [
        ADMIN_PERMISSIONS.VIEW_VISITORS,
        ADMIN_PERMISSIONS.VIEW_BASIC_ANALYTICS
      ]
    case 99: // School Admin (special level)
      return [
        ADMIN_PERMISSIONS.MANAGE_OWN_SCHOOL,
        ADMIN_PERMISSIONS.MANAGE_OWN_CAMPAIGNS
      ]
    default:
      return []
  }
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      setLoading(true)
      
      // Check for stored admin session
      const storedSession = localStorage.getItem('dsvi_directory_admin_session')
      if (storedSession) {
        const sessionData = JSON.parse(storedSession)
        
        // Verify session is still valid (within 8 hours for admins)
        const sessionAge = Date.now() - sessionData.timestamp
        if (sessionAge < 8 * 60 * 60 * 1000) {
          setAdmin(sessionData.admin)
          setLoading(false)
          return
        } else {
          // Session expired
          localStorage.removeItem('dsvi_directory_admin_session')
        }
      }
    } catch (error) {
      console.error('Error checking admin session:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      // Known DSVI admin emails (this would be replaced with database lookup)
      const knownAdmins = [
        { email: 'admin@dsvi.com', level: 1, name: 'DSVI Super Admin', password: 'admin123' },
        { email: 'director@dsvi.com', level: 1, name: 'DSVI Director', password: 'director123' },
        { email: 'manager@dsvi.com', level: 2, name: 'DSVI Manager', password: 'manager123' },
        { email: 'content@dsvi.com', level: 3, name: 'Content Admin', password: 'content123' },
        { email: 'support@dsvi.com', level: 4, name: 'Support Admin', password: 'support123' }
      ]

      // DEVELOPMENT MODE: Check for hardcoded credentials first
      const isDevelopment = import.meta.env.DEV || !import.meta.env.VITE_SUPABASE_URL
      const knownAdmin = knownAdmins.find(admin => admin.email === email)
      
      let adminUser: AdminUser | null = null

      if (isDevelopment && knownAdmin && password === knownAdmin.password) {
        // Development mode: Use hardcoded credentials
        adminUser = {
          id: `dev_${knownAdmin.email}`,
          email: email,
          name: knownAdmin.name,
          admin_level: knownAdmin.level,
          permissions: getDefaultPermissions(knownAdmin.level),
          last_login: new Date().toISOString(),
          isAuthenticated: true
        }
      } else {
        // Production mode or non-hardcoded credentials: Authenticate with Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (authError) {
          console.error('Auth error:', authError)
          return false
        }

        if (!authData.user) {
          return false
        }

        if (knownAdmin) {
          // Production mode: This is a known DSVI admin, authenticate via Supabase
          adminUser = {
            id: authData.user.id,
            email: email,
            name: knownAdmin.name,
            admin_level: knownAdmin.level,
            permissions: getDefaultPermissions(knownAdmin.level),
            last_login: new Date().toISOString(),
            isAuthenticated: true
          }
        } else {
          // Check if they're a school admin that should have directory access
          const { data: schoolData, error: schoolError } = await supabase
            .from('schools')
            .select('id, name, admin_user_id')
            .eq('admin_user_id', authData.user.id)
            .single()

          if (!schoolError && schoolData) {
            // This is a school admin - give them limited directory access
            adminUser = {
              id: authData.user.id,
              email: email,
              name: `${schoolData.name} Admin`,
              admin_level: 99, // Special level for school admins
              permissions: getDefaultPermissions(99),
              school_id: schoolData.id,
              last_login: new Date().toISOString(),
              isAuthenticated: true
            }
          } else {
            // Check manual schools
            const { data: manualSchoolData, error: manualError } = await supabase
              .from('directory_manual_schools')
              .select('id, school_name')
              .eq('status', 'approved')
              .contains('contact_info', { email })
              .single()

            if (!manualError && manualSchoolData) {
              // This is a manual school admin
              adminUser = {
                id: authData.user.id,
                email: email,
                name: `${manualSchoolData.school_name} Admin`,
                admin_level: 99,
                permissions: getDefaultPermissions(99),
                school_id: manualSchoolData.id,
                last_login: new Date().toISOString(),
                isAuthenticated: true
              }
            }
          }
        }

        if (!adminUser) {
          // User is not an admin
          await supabase.auth.signOut()
          return false
        }
      }

      if (!adminUser) {
        return false
      }

      setAdmin(adminUser)
      storeSession(adminUser)
      return true

    } catch (error) {
      console.error('Admin login error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut()
      setAdmin(null)
      localStorage.removeItem('dsvi_directory_admin_session')
    } catch (error) {
      console.error('Admin logout error:', error)
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!admin) return false
    return admin.permissions.includes(permission)
  }

  const hasMinimumLevel = (level: number): boolean => {
    if (!admin) return false
    // Lower numbers = higher privileges (Level 1 is highest)
    return admin.admin_level <= level
  }

  const storeSession = (adminUser: AdminUser) => {
    const sessionData = {
      admin: adminUser,
      timestamp: Date.now()
    }
    localStorage.setItem('dsvi_directory_admin_session', JSON.stringify(sessionData))
  }

  const value: AdminAuthContextType = {
    admin,
    loading,
    login,
    logout,
    hasPermission,
    hasMinimumLevel,
    isAuthenticated: !!admin
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}