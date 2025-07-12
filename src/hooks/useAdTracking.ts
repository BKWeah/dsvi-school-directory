import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

interface AdMetrics {
  ad_id: string
  impressions: number
  clicks: number
  ctr: number
  revenue: number
  last_updated: string
}

interface AdTrackingEvent {
  ad_id: string
  event_type: 'impression' | 'click'
  user_agent?: string
  referrer?: string
  timestamp: string
  school_id?: string
  visitor_id?: string
}

export const useAdTracking = () => {
  const [metrics, setMetrics] = useState<Record<string, AdMetrics>>({})
  const [isTracking, setIsTracking] = useState(true)

  // Track impression
  const trackImpression = useCallback(async (adId: string, schoolId?: string) => {
    if (!isTracking) return

    try {
      const event: AdTrackingEvent = {
        ad_id: adId,
        event_type: 'impression',
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        school_id: schoolId,
        visitor_id: localStorage.getItem('dsvi_visitor_id') || undefined
      }

      // In production, save to Supabase
      // await supabase.from('ad_tracking_events').insert(event)

      // Update local metrics
      setMetrics(prev => {
        const current = prev[adId] || {
          ad_id: adId,
          impressions: 0,
          clicks: 0,
          ctr: 0,
          revenue: 0,
          last_updated: new Date().toISOString()
        }

        const newImpressions = current.impressions + 1
        const newCtr = current.clicks > 0 ? (current.clicks / newImpressions) * 100 : 0

        return {
          ...prev,
          [adId]: {
            ...current,
            impressions: newImpressions,
            ctr: newCtr,
            last_updated: new Date().toISOString()
          }
        }
      })

      console.log(`Impression tracked for ad: ${adId}`)
    } catch (error) {
      console.error('Failed to track impression:', error)
    }
  }, [isTracking])

  // Track click
  const trackClick = useCallback(async (adId: string, targetUrl: string, schoolId?: string) => {
    if (!isTracking) return

    try {
      const event: AdTrackingEvent = {
        ad_id: adId,
        event_type: 'click',
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        school_id: schoolId,
        visitor_id: localStorage.getItem('dsvi_visitor_id') || undefined
      }

      // In production, save to Supabase
      // await supabase.from('ad_tracking_events').insert(event)

      // Update local metrics
      setMetrics(prev => {
        const current = prev[adId] || {
          ad_id: adId,
          impressions: 0,
          clicks: 0,
          ctr: 0,
          revenue: 0,
          last_updated: new Date().toISOString()
        }

        const newClicks = current.clicks + 1
        const newCtr = current.impressions > 0 ? (newClicks / current.impressions) * 100 : 0

        return {
          ...prev,
          [adId]: {
            ...current,
            clicks: newClicks,
            ctr: newCtr,
            last_updated: new Date().toISOString()
          }
        }
      })

      console.log(`Click tracked for ad: ${adId}`)
      
      // Navigate to target URL
      window.open(targetUrl, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Failed to track click:', error)
    }
  }, [isTracking])

  // Get metrics for specific ad
  const getAdMetrics = useCallback((adId: string): AdMetrics | null => {
    return metrics[adId] || null
  }, [metrics])

  // Get aggregated metrics
  const getAggregatedMetrics = useCallback(() => {
    const ads = Object.values(metrics)
    
    return {
      totalImpressions: ads.reduce((sum, ad) => sum + ad.impressions, 0),
      totalClicks: ads.reduce((sum, ad) => sum + ad.clicks, 0),
      averageCtr: ads.length > 0 
        ? ads.reduce((sum, ad) => sum + ad.ctr, 0) / ads.length 
        : 0,
      totalRevenue: ads.reduce((sum, ad) => sum + ad.revenue, 0),
      activeAds: ads.length
    }
  }, [metrics])

  // Load initial metrics from storage/database
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        // In production, load from Supabase
        // const { data, error } = await supabase
        //   .from('ad_metrics')
        //   .select('*')
        
        // Load from localStorage for now
        const stored = localStorage.getItem('dsvi_ad_metrics')
        if (stored) {
          setMetrics(JSON.parse(stored))
        }
      } catch (error) {
        console.error('Failed to load ad metrics:', error)
      }
    }

    loadMetrics()
  }, [])

  // Save metrics to localStorage (in production, would batch to database)
  useEffect(() => {
    if (Object.keys(metrics).length > 0) {
      localStorage.setItem('dsvi_ad_metrics', JSON.stringify(metrics))
    }
  }, [metrics])

  // Enable/disable tracking (for privacy compliance)
  const setTrackingEnabled = useCallback((enabled: boolean) => {
    setIsTracking(enabled)
    localStorage.setItem('dsvi_ad_tracking_enabled', enabled.toString())
  }, [])

  // Check if tracking is enabled
  useEffect(() => {
    const stored = localStorage.getItem('dsvi_ad_tracking_enabled')
    if (stored !== null) {
      setIsTracking(stored === 'true')
    }
  }, [])

  return {
    trackImpression,
    trackClick,
    getAdMetrics,
    getAggregatedMetrics,
    metrics,
    isTracking,
    setTrackingEnabled
  }
}

// Helper hook for real-time ad performance monitoring
export const useAdPerformance = (adId: string) => {
  const [performance, setPerformance] = useState<AdMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPerformance = async () => {
      try {
        setLoading(true)
        
        // In production, load from Supabase with real-time subscriptions
        // const { data, error } = await supabase
        //   .from('ad_metrics')
        //   .select('*')
        //   .eq('ad_id', adId)
        //   .single()

        // Mock data for now
        const mockPerformance: AdMetrics = {
          ad_id: adId,
          impressions: Math.floor(Math.random() * 1000) + 100,
          clicks: Math.floor(Math.random() * 50) + 5,
          ctr: 0,
          revenue: Math.floor(Math.random() * 100) + 10,
          last_updated: new Date().toISOString()
        }
        
        mockPerformance.ctr = (mockPerformance.clicks / mockPerformance.impressions) * 100

        setPerformance(mockPerformance)
      } catch (error) {
        console.error('Failed to load ad performance:', error)
      } finally {
        setLoading(false)
      }
    }

    if (adId) {
      loadPerformance()
    }
  }, [adId])

  return { performance, loading }
}