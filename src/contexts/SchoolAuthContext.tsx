import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { DirectorySchool } from '../types/database'

interface SchoolUser {
  id: string
  school: DirectorySchool
  email: string
  isAuthenticated: boolean
  loginMethod: 'dsvi' | 'manual'
}

interface SchoolAuthContextType {
  user: SchoolUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginWithSchoolCode: (schoolCode: string) => Promise<boolean>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const SchoolAuthContext = createContext<SchoolAuthContextType | undefined>(undefined)

export const useSchoolAuth = () => {
  const context = useContext(SchoolAuthContext)
  if (context === undefined) {
    throw new Error('useSchoolAuth must be used within a SchoolAuthProvider')
  }
  return context
}

export const SchoolAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SchoolUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      setLoading(true)
      
      // Check for stored session
      const storedSession = localStorage.getItem('dsvi_directory_school_session')
      if (storedSession) {
        const sessionData = JSON.parse(storedSession)
        
        // Verify session is still valid (within 24 hours)
        const sessionAge = Date.now() - sessionData.timestamp
        if (sessionAge < 24 * 60 * 60 * 1000) {
          setUser(sessionData.user)
          setLoading(false)
          return
        } else {
          // Session expired
          localStorage.removeItem('dsvi_directory_school_session')
        }
      }
    } catch (error) {
      console.error('Error checking session:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      // For DSVI schools, check against the schools table via admin_user_id
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

      // Find the school associated with this user
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .select('*')
        .eq('admin_user_id', authData.user.id)
        .single()

      if (schoolError || !schoolData) {
        // Not a DSVI school admin, check manual schools
        const { data: manualSchoolData, error: manualError } = await supabase
          .from('directory_manual_schools')
          .select('*')
          .eq('status', 'approved')
          .contains('contact_info', { email })
          .single()

        if (manualError || !manualSchoolData) {
          await supabase.auth.signOut()
          return false
        }

        // Map manual school to DirectorySchool format
        const school: DirectorySchool = {
          id: manualSchoolData.id,
          name: manualSchoolData.school_name,
          logo_url: manualSchoolData.logo_url,
          description: manualSchoolData.description,
          school_type: manualSchoolData.school_type,
          year_established: manualSchoolData.year_established,
          location: manualSchoolData.location,
          website_url: manualSchoolData.website_url,
          permit_url: manualSchoolData.permit_url,
          categories: manualSchoolData.categories,
          source: 'manual',
          is_dsvi_client: false,
          contact_info: manualSchoolData.contact_info
        }

        const schoolUser: SchoolUser = {
          id: authData.user.id,
          school,
          email,
          isAuthenticated: true,
          loginMethod: 'manual'
        }

        setUser(schoolUser)
        storeSession(schoolUser)
        return true
      }

      // DSVI school found - map to DirectorySchool format
      const school: DirectorySchool = {
        id: schoolData.id,
        name: schoolData.name,
        logo_url: schoolData.logo_url,
        description: '', // Will be extracted from pages if needed
        school_type: undefined,
        year_established: schoolData.year_established,
        location: extractLocationFromContactInfo(schoolData.contact_info),
        website_url: `https://${schoolData.slug}.dsvi.com`,
        permit_url: schoolData.permit_url,
        categories: ['general'], // Default for DSVI schools
        source: 'dsvi',
        is_dsvi_client: true,
        contact_info: schoolData.contact_info
      }

      const schoolUser: SchoolUser = {
        id: authData.user.id,
        school,
        email,
        isAuthenticated: true,
        loginMethod: 'dsvi'
      }

      setUser(schoolUser)
      storeSession(schoolUser)
      return true

    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const loginWithSchoolCode = async (schoolCode: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      // For manual schools that don't have Supabase auth, use school code
      const { data: manualSchoolData, error } = await supabase
        .from('directory_manual_schools')
        .select('*')
        .eq('status', 'approved')
        .eq('id', schoolCode) // Assuming school code is the school ID
        .single()

      if (error || !manualSchoolData) {
        return false
      }

      const school: DirectorySchool = {
        id: manualSchoolData.id,
        name: manualSchoolData.school_name,
        logo_url: manualSchoolData.logo_url,
        description: manualSchoolData.description,
        school_type: manualSchoolData.school_type,
        year_established: manualSchoolData.year_established,
        location: manualSchoolData.location,
        website_url: manualSchoolData.website_url,
        permit_url: manualSchoolData.permit_url,
        categories: manualSchoolData.categories,
        source: 'manual',
        is_dsvi_client: false,
        contact_info: manualSchoolData.contact_info
      }

      const schoolUser: SchoolUser = {
        id: `manual_${manualSchoolData.id}`,
        school,
        email: manualSchoolData.contact_info?.email || '',
        isAuthenticated: true,
        loginMethod: 'manual'
      }

      setUser(schoolUser)
      storeSession(schoolUser)
      return true

    } catch (error) {
      console.error('School code login error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      localStorage.removeItem('dsvi_directory_school_session')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const storeSession = (schoolUser: SchoolUser) => {
    const sessionData = {
      user: schoolUser,
      timestamp: Date.now()
    }
    localStorage.setItem('dsvi_directory_school_session', JSON.stringify(sessionData))
  }

  const extractLocationFromContactInfo = (contactInfo: any): string => {
    if (!contactInfo) return ''
    return contactInfo.address || contactInfo.location || ''
  }

  const value: SchoolAuthContextType = {
    user,
    loading,
    login,
    loginWithSchoolCode,
    logout,
    isAuthenticated: !!user
  }

  return (
    <SchoolAuthContext.Provider value={value}>
      {children}
    </SchoolAuthContext.Provider>
  )
}