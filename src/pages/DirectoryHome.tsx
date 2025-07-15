import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Search, School, MapPin, GraduationCap, Building, Users } from 'lucide-react'
import VisitorSignupModal from '../components/directory/VisitorSignupModal'
import SchoolGrid from '../components/directory/SchoolGrid'
import FilterSidebar from '../components/directory/FilterSidebar'
import AdBanner from '../components/directory/AdBanner'
import AdSlot from '../components/ads/AdSlot'
import { getDirectorySchools } from '../lib/directoryService'
import { generateSessionId } from '../lib/directoryService'
import type { DirectorySchool, DirectoryFilters } from '../types/database'

const DirectoryHome: React.FC = () => {
  const [schools, setSchools] = useState<DirectorySchool[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<DirectoryFilters>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showVisitorModal, setShowVisitorModal] = useState(false)
  const [hasDirectoryAccess, setHasDirectoryAccess] = useState(false)
  const [accessCheckComplete, setAccessCheckComplete] = useState(false)
  const [sessionId] = useState(() => generateSessionId())

  // Handle successful visitor signup completion
  const handleSignupComplete = () => {
    try {
      // Set localStorage flag to remember completion across sessions
      localStorage.setItem('dsvi_visitor_signup_completed', 'true')
      // Optional: store completion timestamp for analytics or cleanup
      localStorage.setItem('dsvi_visitor_signup_timestamp', new Date().toISOString())
      console.log('Visitor signup completion saved to localStorage')
    } catch (error) {
      // localStorage might be disabled or full
      console.warn('Could not save signup completion to localStorage:', error)
      // Could implement fallback like session storage or just continue
    }
    
    // Grant directory access immediately after successful signup
    setHasDirectoryAccess(true)
  }

  // Utility function for testing/debugging - can be called from browser console
  // Usage: window.clearDSVISignup()
  React.useEffect(() => {
    (window as any).clearDSVISignup = () => {
      try {
        localStorage.removeItem('dsvi_visitor_signup_completed')
        localStorage.removeItem('dsvi_visitor_signup_timestamp')
        setHasDirectoryAccess(false)
        setAccessCheckComplete(false)
        console.log('DSVI visitor signup localStorage cleared - refresh page to see access gate again')
      } catch (error) {
        console.warn('Could not clear localStorage:', error)
      }
    }
  }, [])

  // Check access status and show visitor modal if needed
  useEffect(() => {
    // Check if user has already completed the visitor signup
    try {
      const hasCompletedSignup = localStorage.getItem('dsvi_visitor_signup_completed')
      
      if (hasCompletedSignup === 'true') {
        // User already completed signup, grant access and don't show modal
        console.log('Visitor signup already completed, granting directory access')
        setHasDirectoryAccess(true)
        setAccessCheckComplete(true)
        return
      }
    } catch (error) {
      // localStorage might be disabled in some browsers/modes
      console.warn('Could not access localStorage, showing modal anyway:', error)
    }

    // User hasn't completed signup, access check is complete but no access granted
    setAccessCheckComplete(true)

    const timer = setTimeout(() => {
      setShowVisitorModal(true)
    }, 10000)

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowVisitorModal(true)
        window.removeEventListener('scroll', handleScroll)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Fetch schools
  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true)
      const searchFilters = {
        ...filters,
        search: searchTerm || undefined
      }
      const data = await getDirectorySchools(searchFilters)
      setSchools(data)
      setLoading(false)
    }

    fetchSchools()
  }, [filters, searchTerm])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleFilterChange = (newFilters: DirectoryFilters) => {
    setFilters(newFilters)
  }

  // Show loading state while checking access
  if (!accessCheckComplete) {
    return (
      <>
        <Helmet>
          <title>DSVI School Directory - Loading...</title>
          <meta name="description" content="Loading the DSVI School Directory..." />
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Directory...</p>
          </div>
        </div>
      </>
    )
  }

  // Show access gate if user doesn't have directory access
  if (!hasDirectoryAccess) {
    return (
      <>
        <Helmet>
          <title>DSVI School Directory - Get Access</title>
          <meta name="description" content="Get instant access to Liberia's comprehensive school directory" />
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
          <div className="text-center text-white max-w-2xl">
            <School className="h-20 w-20 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              DSVI School Directory
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Liberia's Central Hub for Verified Schools
            </p>
            <p className="text-lg mb-8 text-blue-100">
              Join thousands of parents, educators, and students exploring verified Liberian schools. 
              Complete a quick signup to get instant access to our comprehensive directory.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <School className="h-8 w-8 mx-auto mb-2 text-blue-200" />
                  <h3 className="font-semibold mb-1">Verified Schools</h3>
                  <p className="text-sm text-blue-100">All schools are verified and regularly updated</p>
                </div>
                <div>
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-200" />
                  <h3 className="font-semibold mb-1">Trusted Community</h3>
                  <p className="text-sm text-blue-100">Join parents and educators across Liberia</p>
                </div>
                <div>
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-blue-200" />
                  <h3 className="font-semibold mb-1">Find Schools Near You</h3>
                  <p className="text-sm text-blue-100">Search by location, type, and programs</p>
                </div>
              </div>
            </div>
            {!showVisitorModal && (
              <div className="text-blue-200 text-lg">
                Your access form will appear shortly...
              </div>
            )}
          </div>
        </div>
        
        {/* Visitor Signup Modal - Mandatory for access */}
        <VisitorSignupModal
          isOpen={showVisitorModal}
          onClose={() => setShowVisitorModal(false)}
          sessionId={sessionId}
          onSignupComplete={handleSignupComplete}
        />
      </>
    )
  }

  // Show full directory if user has access
  return (
    <>
      <Helmet>
        <title>DSVI School Directory - Liberia's Central Hub for Verified Schools</title>
        <meta name="description" content="The DSVI School Directory is a trusted, public-facing directory that connects parents, educators, students, and partners with verified Liberian schools at every educational level." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                <School className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">DSVI School Directory</span>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
                <a href="/submit-school" className="text-gray-600 hover:text-gray-900">Submit School</a>
                <a href="/promo-boost" className="text-blue-600 hover:text-blue-700 font-medium">Promote Your School</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Liberia's Central Hub for Verified Schools
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              The DSVI School Directory is a trusted, public-facing directory that connects parents, educators, students, and partners with verified Liberian schools at every educational level.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for schools..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Directory Section */}
        <section id="about" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Use the Directory?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Every school listed has been verified and meets our quality standards
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">DSVI Built or Verified Website</h3>
                <p className="text-gray-600 text-sm">Every school was either built by DSVI or has a verified, live website</p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Building className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Professional Format</h3>
                <p className="text-gray-600 text-sm">Appears in a clean, professional format with consistent data</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">National Visibility</h3>
                <p className="text-gray-600 text-sm">Gains national and international visibility all year long</p>
              </div>

              <div className="text-center">
                <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Official Documentation</h3>
                <p className="text-gray-600 text-sm">Displays permit to operate or accreditation certificate from Ministry of Education</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <div className="lg:w-1/4 space-y-6">
                <FilterSidebar onFilterChange={handleFilterChange} />
                
                {/* Sidebar Ad Slot */}
                <AdSlot 
                  slotId="directory-sidebar"
                  slotType="sidebar"
                  maxAds={2}
                />
              </div>

              {/* Schools Grid */}
              <div className="lg:w-3/4">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Directory of Schools ({schools.length})
                  </h2>
                </div>

                {/* Banner Ad Slot */}
                <AdSlot 
                  slotId="directory-top-banner"
                  slotType="banner"
                  className="mb-8"
                  maxAds={1}
                />

                {/* Schools Grid */}
                <SchoolGrid schools={schools} loading={loading} />

                {/* Spotlight Ad after every 6 schools */}
                {schools.length > 6 && (
                  <div className="my-8">
                    <AdSlot 
                      slotId="directory-mid-content"
                      slotType="spotlight"
                      maxAds={3}
                      className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer Ad Slot */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdSlot 
              slotId="directory-footer-banner"
              slotType="footer"
              maxAds={1}
            />
          </div>
        </section>

        {/* Manual Submission CTA */}
        <section className="bg-gray-100 py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Want to Get Listed?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Already have your own website? You're welcome to join! Simply complete our Directory Listing Form.
            </p>
            <a
              href="/submit-school"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Your School
            </a>
            <p className="text-sm text-gray-500 mt-4">
              Upon approval and payment of a small annual fee, your school will be published in the same format as DSVI-developed schools.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <School className="h-6 w-6" />
                  <span className="text-lg font-bold">DSVI School Directory</span>
                </div>
                <p className="text-gray-300">
                  Connecting parents, educators, students, and partners with verified Liberian schools.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="/" className="hover:text-white">Home</a></li>
                  <li><a href="/submit-school" className="hover:text-white">Submit School</a></li>
                  <li><a href="/promo-boost" className="hover:text-white">Promote Your School</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Contact</h3>
                <p className="text-gray-300">
                  For questions about the directory or to report issues, please contact DSVI support.
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 DSVI School Directory. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default DirectoryHome
