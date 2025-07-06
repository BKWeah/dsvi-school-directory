import React, { useEffect, useState } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { getActiveAds, recordAdImpression } from '../../lib/directoryService'

interface AdBannerProps {
  className?: string
}

const AdBanner: React.FC<AdBannerProps> = ({ className = '' }) => {
  const [currentAd, setCurrentAd] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const ads = await getActiveAds()
        if (ads.length > 0) {
          // Randomly select an ad
          const randomAd = ads[Math.floor(Math.random() * ads.length)]
          setCurrentAd(randomAd)
          setIsVisible(true)
          
          // Record impression
          if (randomAd.id) {
            await recordAdImpression(randomAd.id)
          }
        }
      } catch (error) {
        console.error('Error fetching ads:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleClick = () => {
    // In a real implementation, you'd track clicks and redirect
    console.log('Ad clicked:', currentAd)
  }

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-200 rounded-lg h-32"></div>
      </div>
    )
  }

  if (!currentAd || !isVisible) {
    return null
  }

  return (
    <div className={`relative bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 ${className}`}>
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Ad Content */}
      <div className="flex items-center space-x-4">
        {/* Ad Icon/Image */}
        <div className="flex-shrink-0">
          {currentAd.ad_file_url && currentAd.ad_type === 'banner' ? (
            <img 
              src={currentAd.ad_file_url} 
              alt="Advertisement"
              className="w-16 h-16 object-cover rounded-lg"
            />
          ) : (
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <ExternalLink className="h-8 w-8 text-white" />
            </div>
          )}
        </div>

        {/* Ad Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-1">
            <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
              Sponsored
            </span>
          </div>
          <p className="text-gray-900 font-medium text-sm mb-1">
            {currentAd.ad_content}
          </p>
          {currentAd.school_name && (
            <p className="text-gray-600 text-xs">
              {currentAd.school_name}
            </p>
          )}
        </div>

        {/* CTA Button */}
        <div className="flex-shrink-0">
          <button
            onClick={handleClick}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Learn More
            <ExternalLink className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Video Ad Support */}
      {currentAd.ad_type === 'video' && currentAd.ad_file_url && (
        <div className="mt-4">
          <video 
            controls 
            className="w-full max-h-48 rounded-lg"
            poster={currentAd.thumbnail_url}
          >
            <source src={currentAd.ad_file_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-3 text-xs text-gray-500">
        This is a sponsored listing. DSVI School Directory earns revenue from these placements to support our platform.
      </div>
    </div>
  )
}

export default AdBanner
