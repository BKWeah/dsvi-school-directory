import React, { useState, useEffect } from 'react'
import { ExternalLink, Eye, MousePointer, Calendar, AlertCircle } from 'lucide-react'

interface AdCampaign {
  id: string
  title: string
  school_name: string
  ad_type: 'banner' | 'spotlight' | 'featured'
  image_url?: string
  target_url: string
  description: string
  status: 'active' | 'paused' | 'expired'
  start_date: string
  end_date: string
  impressions: number
  clicks: number
  ctr: number
  priority: number
}

interface AdSlotProps {
  slotId: string
  slotType: 'banner' | 'spotlight' | 'sidebar' | 'footer'
  className?: string
  maxAds?: number
  schoolFilter?: string[] // Show only ads from specific schools
}

const AdSlot: React.FC<AdSlotProps> = ({ 
  slotId, 
  slotType, 
  className = '', 
  maxAds = 1,
  schoolFilter 
}) => {
  const [ads, setAds] = useState<AdCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAds()
  }, [slotId, slotType, schoolFilter])

  const loadAds = async () => {
    try {
      setLoading(true)
      setError('')

      // Mock ad data - in production this would come from Supabase
      const mockAds: AdCampaign[] = [
        {
          id: 'ad_1',
          title: 'Enroll Now for 2025 Academic Year',
          school_name: 'Saint Mary Catholic School',
          ad_type: 'banner',
          image_url: '/api/placeholder/400/200',
          target_url: '/schools/saint-mary-catholic',
          description: 'Join our prestigious institution. Applications now open!',
          status: 'active',
          start_date: '2025-01-01',
          end_date: '2025-03-31',
          impressions: 1250,
          clicks: 48,
          ctr: 3.84,
          priority: 1
        },
        {
          id: 'ad_2',
          title: 'Scholarship Opportunities Available',
          school_name: 'Lagos International School',
          ad_type: 'spotlight',
          image_url: '/api/placeholder/300/300',
          target_url: '/schools/lagos-international',
          description: 'Merit-based scholarships for outstanding students.',
          status: 'active',
          start_date: '2025-01-05',
          end_date: '2025-02-28',
          impressions: 892,
          clicks: 67,
          ctr: 7.51,
          priority: 2
        },
        {
          id: 'ad_3',
          title: 'Open House Event - January 25th',
          school_name: 'Greenwood Academy',
          ad_type: 'featured',
          image_url: '/api/placeholder/350/250',
          target_url: '/schools/greenwood-academy',
          description: 'Tour our facilities and meet our teachers.',
          status: 'active',
          start_date: '2025-01-10',
          end_date: '2025-01-26',
          impressions: 567,
          clicks: 23,
          ctr: 4.06,
          priority: 3
        }
      ]

      // Filter ads based on slot type and school filter
      let filteredAds = mockAds.filter(ad => {
        // Filter by slot type compatibility
        const slotCompatibility = {
          banner: ['banner', 'featured'],
          spotlight: ['spotlight', 'featured'],
          sidebar: ['spotlight', 'banner'],
          footer: ['banner']
        }
        
        if (!slotCompatibility[slotType].includes(ad.ad_type)) {
          return false
        }

        // Filter by school if specified
        if (schoolFilter && schoolFilter.length > 0) {
          return schoolFilter.includes(ad.school_name)
        }

        return ad.status === 'active' && new Date(ad.end_date) > new Date()
      })

      // Sort by priority and limit results
      filteredAds = filteredAds
        .sort((a, b) => a.priority - b.priority)
        .slice(0, maxAds)

      setAds(filteredAds)
    } catch (err) {
      setError('Failed to load advertisements')
      console.error('Ad loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  const trackImpression = async (adId: string) => {
    try {
      // Track impression - in production this would update Supabase
      console.log(`Impression tracked for ad: ${adId}`)
      
      // Update local state
      setAds(prev => prev.map(ad => 
        ad.id === adId 
          ? { ...ad, impressions: ad.impressions + 1 }
          : ad
      ))
    } catch (error) {
      console.error('Failed to track impression:', error)
    }
  }

  const trackClick = async (adId: string, targetUrl: string) => {
    try {
      // Track click - in production this would update Supabase
      console.log(`Click tracked for ad: ${adId}`)
      
      // Update local state
      setAds(prev => prev.map(ad => 
        ad.id === adId 
          ? { 
              ...ad, 
              clicks: ad.clicks + 1,
              ctr: ((ad.clicks + 1) / (ad.impressions + 1)) * 100
            }
          : ad
      ))

      // Navigate to target URL
      window.open(targetUrl, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Failed to track click:', error)
    }
  }

  // Track impressions when ads are loaded and visible
  useEffect(() => {
    if (ads.length > 0) {
      ads.forEach(ad => {
        trackImpression(ad.id)
      })
    }
  }, [ads])

  const getSlotStyles = () => {
    const baseStyles = "rounded-lg overflow-hidden transition-all duration-300"
    
    switch (slotType) {
      case 'banner':
        return `${baseStyles} w-full max-w-4xl mx-auto`
      case 'spotlight':
        return `${baseStyles} max-w-sm`
      case 'sidebar':
        return `${baseStyles} w-full max-w-xs`
      case 'footer':
        return `${baseStyles} w-full`
      default:
        return baseStyles
    }
  }

  const renderAd = (ad: AdCampaign) => {
    const isExpiringSoon = new Date(ad.end_date).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000

    return (
      <div 
        key={ad.id}
        className={`bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group ${getSlotStyles()}`}
        onClick={() => trackClick(ad.id, ad.target_url)}
      >
        {/* Ad Image */}
        {ad.image_url && (
          <div className="relative">
            <img 
              src={ad.image_url} 
              alt={ad.title}
              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {isExpiringSoon && (
              <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                Ending Soon
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              Sponsored
            </div>
          </div>
        )}

        {/* Ad Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
              {ad.title}
            </h3>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
          
          <p className="text-xs text-gray-600 mb-2">{ad.school_name}</p>
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{ad.description}</p>
          
          {/* Ad Metrics (visible to admins only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="flex items-center space-x-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{ad.impressions}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MousePointer className="w-3 h-3" />
                <span>{ad.clicks}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>CTR: {ad.ctr.toFixed(1)}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`${getSlotStyles()} ${className}`}>
        <div className="bg-gray-100 animate-pulse rounded-lg h-48 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading advertisement...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${getSlotStyles()} ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      </div>
    )
  }

  if (ads.length === 0) {
    return (
      <div className={`${getSlotStyles()} ${className}`}>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-gray-400 text-sm">No advertisements available</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {ads.map(renderAd)}
    </div>
  )
}

export default AdSlot