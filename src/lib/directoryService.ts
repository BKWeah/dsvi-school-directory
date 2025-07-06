import { supabase } from './supabase'
import type { 
  DirectorySchool, 
  DSVISchool, 
  DirectoryManualSchool, 
  DirectoryFilters,
  VisitorSignupForm,
  ManualSchoolSubmissionForm,
  CreateAdRequest,
  DirectoryStats
} from '../types/database'

// Function to combine and map DSVI and manual schools
export const getDirectorySchools = async (filters?: DirectoryFilters): Promise<DirectorySchool[]> => {
  try {
    // Fetch DSVI schools
    let dsviQuery = supabase
      .from('schools')
      .select(`
        id, name, slug, logo_url, contact_info, 
        year_established, permit_url,
        pages(sections)
      `)

    // Fetch approved manual schools
    let manualQuery = supabase
      .from('directory_manual_schools')
      .select('*')
      .eq('status', 'approved')

    // Apply filters
    if (filters?.search) {
      dsviQuery = dsviQuery.ilike('name', `%${filters.search}%`)
      manualQuery = manualQuery.ilike('school_name', `%${filters.search}%`)
    }

    const [dsviResult, manualResult] = await Promise.all([
      dsviQuery,
      manualQuery
    ])

    if (dsviResult.error) throw dsviResult.error
    if (manualResult.error) throw manualResult.error

    // Map DSVI schools to unified format
    const dsviSchools: DirectorySchool[] = (dsviResult.data || []).map((school: any) => ({
      id: school.id,
      name: school.name,
      logo_url: school.logo_url,
      description: extractDescriptionFromPages(school.pages),
      school_type: undefined, // DSVI schools may not have this specified
      year_established: school.year_established,
      location: extractLocationFromContactInfo(school.contact_info),
      website_url: `https://${school.slug}.dsvi.com`, // Assuming subdomain pattern
      permit_url: school.permit_url,
      categories: extractCategoriesFromPages(school.pages),
      source: 'dsvi' as const,
      is_dsvi_client: true,
      contact_info: school.contact_info
    }))

    // Map manual schools to unified format
    const manualSchools: DirectorySchool[] = (manualResult.data || []).map((school: DirectoryManualSchool) => ({
      id: school.id,
      name: school.school_name,
      logo_url: school.logo_url,
      description: school.description,
      school_type: school.school_type,
      year_established: school.year_established,
      location: school.location,
      website_url: school.website_url,
      permit_url: school.permit_url,
      categories: school.categories,
      source: 'manual' as const,
      is_dsvi_client: false,
      contact_info: school.contact_info
    }))

    // Combine and filter
    let allSchools = [...dsviSchools, ...manualSchools]

    // Apply additional filters
    if (filters?.school_type && filters.school_type !== 'all') {
      allSchools = allSchools.filter(school => school.school_type === filters.school_type)
    }

    if (filters?.categories && filters.categories.length > 0) {
      allSchools = allSchools.filter(school => 
        school.categories.some(cat => filters.categories!.includes(cat))
      )
    }

    if (filters?.county) {
      allSchools = allSchools.filter(school => 
        school.location?.toLowerCase().includes(filters.county!.toLowerCase())
      )
    }

    return allSchools

  } catch (error) {
    console.error('Error fetching directory schools:', error)
    return []
  }
}

// Helper function to extract description from DSVI pages
const extractDescriptionFromPages = (pages: any[]): string => {
  if (!pages || pages.length === 0) return ''
  
  // Look for about page or home page content
  const aboutPage = pages.find(p => p.sections?.some((s: any) => s.type === 'about'))
  if (aboutPage) {
    const aboutSection = aboutPage.sections.find((s: any) => s.type === 'about')
    return aboutSection?.content?.substring(0, 200) || ''
  }
  
  // Fallback to first text content found
  const firstPage = pages[0]
  if (firstPage?.sections) {
    const textSection = firstPage.sections.find((s: any) => s.content)
    return textSection?.content?.substring(0, 200) || ''
  }
  
  return ''
}

// Helper function to extract location from contact info
const extractLocationFromContactInfo = (contactInfo: any): string => {
  if (!contactInfo) return ''
  return contactInfo.address || contactInfo.location || ''
}

// Helper function to extract categories from pages (basic implementation)
const extractCategoriesFromPages = (pages: any[]): string[] => {
  // This is a simplified implementation
  // In reality, you might want to analyze page content or have specific categorization logic
  return ['general'] // Default category for DSVI schools
}

// Submit visitor signup
export const submitVisitorSignup = async (data: VisitorSignupForm, sessionId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('directory_visitors')
      .insert({
        ...data,
        session_id: sessionId,
        consent_given: true
      })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error submitting visitor signup:', error)
    return false
  }
}

// Check if visitor has already signed up in this session
export const checkVisitorSession = async (sessionId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('directory_visitors')
      .select('id')
      .eq('session_id', sessionId)
      .limit(1)

    if (error) throw error
    return (data && data.length > 0)
  } catch (error) {
    console.error('Error checking visitor session:', error)
    return false
  }
}

// Submit manual school registration
export const submitManualSchool = async (data: ManualSchoolSubmissionForm): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('directory_manual_schools')
      .insert({
        school_name: data.school_name,
        logo_url: data.logo_url,
        description: data.description,
        school_type: data.school_type,
        year_established: data.year_established,
        location: data.location,
        website_url: data.website_url,
        permit_url: data.permit_url,
        contact_info: data.contact_info,
        categories: data.categories,
        status: 'pending'
      })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error submitting manual school:', error)
    return false
  }
}

// Get directory statistics
export const getDirectoryStats = async (): Promise<DirectoryStats | null> => {
  try {
    const { data, error } = await supabase.rpc('get_directory_stats')
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching directory stats:', error)
    return null
  }
}

// Get active ads for display
export const getActiveAds = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('directory_ads')
      .select('*')
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching active ads:', error)
    return []
  }
}

// Create ad campaign (placeholder pricing)
export const createAdCampaign = async (data: CreateAdRequest): Promise<{ success: boolean; adId?: string; pricing?: number }> => {
  try {
    // Calculate placeholder pricing
    const basePricePerView = 0.05
    const basePricePerDay = 5.00
    const totalPricing = (data.reach_count * basePricePerView) + (data.duration_days * basePricePerDay)

    const { data: result, error } = await supabase
      .from('directory_ads')
      .insert({
        school_id: data.school_id,
        school_type: data.school_type,
        ad_content: data.ad_content,
        ad_type: data.ad_type,
        ad_file_url: data.ad_file_url,
        target_audience: data.target_audience,
        reach_count: data.reach_count,
        duration_days: data.duration_days,
        pricing: totalPricing,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error
    
    return {
      success: true,
      adId: result.id,
      pricing: totalPricing
    }
  } catch (error) {
    console.error('Error creating ad campaign:', error)
    return { success: false }
  }
}

// Record ad impression
export const recordAdImpression = async (adId: string): Promise<void> => {
  try {
    await supabase.rpc('increment_ad_impressions', { ad_id: adId })
  } catch (error) {
    console.error('Error recording ad impression:', error)
  }
}

// Generate session ID for visitor tracking
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
