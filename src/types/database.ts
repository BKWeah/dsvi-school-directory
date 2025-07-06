export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface DirectoryVisitor {
  id: string
  created_at: string
  updated_at: string
  first_name: string
  email_or_whatsapp: string
  city?: string
  county?: string
  education_level?: string
  profession?: string
  consent_given: boolean
  session_id?: string
}

export interface DirectoryManualSchool {
  id: string
  created_at: string
  updated_at: string
  school_name: string
  logo_url?: string
  description?: string
  school_type?: 'public' | 'private'
  year_established?: number
  location?: string
  website_url?: string
  permit_url?: string
  contact_info: Json
  categories: string[]
  status: 'pending' | 'approved' | 'rejected'
  reviewed_by?: string
  reviewed_at?: string
  admin_notes?: string
}

export interface DirectoryAd {
  id: string
  created_at: string
  updated_at: string
  school_id: string
  school_type: 'dsvi' | 'manual'
  ad_content: string
  ad_type: 'banner' | 'text' | 'video'
  ad_file_url?: string
  target_audience: Json
  reach_count: number
  duration_days: number
  pricing: number
  status: 'pending' | 'approved' | 'active' | 'completed' | 'rejected'
  impressions: number
  clicks: number
  expires_at?: string
  payment_status: 'pending' | 'paid' | 'failed'
  payment_reference?: string
  approved_by?: string
  approved_at?: string
}

export interface DirectoryAdTargeting {
  id: string
  ad_id: string
  county?: string
  city?: string
  education_levels?: string[]
  professions?: string[]
  created_at: string
}

// DSVI School interface (from existing schools table)
export interface DSVISchool {
  id: string
  created_at: string
  updated_at: string
  name: string
  slug: string
  logo_url?: string
  admin_user_id?: string
  contact_info?: Json
  year_established?: number
  permit_url?: string
  theme_settings?: Json
}

// Unified interface for directory display
export interface DirectorySchool {
  id: string
  name: string
  logo_url?: string
  description?: string
  school_type?: 'public' | 'private'
  year_established?: number
  location?: string
  website_url?: string
  permit_url?: string
  categories: string[]
  source: 'dsvi' | 'manual'
  is_dsvi_client: boolean
  contact_info?: Json
}

// Search and filter types
export interface DirectoryFilters {
  school_type?: 'public' | 'private' | 'all'
  categories?: string[]
  county?: string
  city?: string
  search?: string
}

export interface DirectoryStats {
  total_dsvi_schools: number
  total_manual_schools: number
  pending_manual_schools: number
  total_visitors: number
  active_ads: number
  pending_ads: number
}

// Ad creation types
export interface CreateAdRequest {
  school_id: string
  school_type: 'dsvi' | 'manual'
  ad_content: string
  ad_type: 'banner' | 'text' | 'video'
  ad_file_url?: string
  target_audience: {
    county?: string
    city?: string
    education_levels?: string[]
    professions?: string[]
  }
  reach_count: number
  duration_days: number
}

// Visitor signup form
export interface VisitorSignupForm {
  first_name: string
  email_or_whatsapp: string
  city?: string
  county?: string
  education_level?: string
  profession?: string
}

// Manual school submission form
export interface ManualSchoolSubmissionForm {
  school_name: string
  logo_url?: string
  description?: string
  school_type: 'public' | 'private'
  year_established?: number
  location: string
  website_url?: string
  permit_url?: string
  contact_info: {
    email?: string
    phone?: string
    address?: string
  }
  categories: string[]
}

export const SCHOOL_CATEGORIES = [
  'day_care',
  'nursery', 
  'kindergarten',
  'elementary',
  'primary',
  'junior_high',
  'senior_high',
  'vocational',
  'technical',
  'college',
  'polytechnic',
  'university'
] as const

export const LIBERIAN_COUNTIES = [
  'Bomi',
  'Bong',
  'Gbarpolu',
  'Grand Bassa',
  'Grand Cape Mount',
  'Grand Gedeh',
  'Grand Kru',
  'Lofa',
  'Margibi',
  'Maryland',
  'Montserrado',
  'Nimba',
  'River Cess',
  'River Gee',
  'Sinoe'
] as const

export const EDUCATION_LEVELS = [
  'primary',
  'secondary',
  'undergraduate',
  'graduate',
  'postgraduate',
  'professional'
] as const

export const PROFESSIONS = [
  'teacher',
  'parent',
  'student',
  'administrator',
  'researcher',
  'consultant',
  'other'
] as const
