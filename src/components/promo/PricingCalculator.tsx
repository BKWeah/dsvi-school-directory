import React from 'react'
import { Calculator, Users, Calendar, MapPin, GraduationCap, Briefcase } from 'lucide-react'

interface PricingCalculatorProps {
  reachCount: number
  durationDays: number
  targetAudience: {
    county?: string
    city?: string
    education_levels?: string[]
    professions?: string[]
  }
  onPriceCalculated?: (price: number) => void
}

const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  reachCount,
  durationDays,
  targetAudience,
  onPriceCalculated
}) => {
  // Enhanced pricing logic with dynamic reach calculation
  const calculatePrice = (): number => {
    // Base pricing structure
    const basePricing = {
      duration: {
        daily: 2.00,   // $2 per day
        weekly: 12.00  // $12 per week (discount)
      },
      targeting: {
        county_premium: 1.2,      // 20% premium for county targeting
        city_premium: 1.5,        // 50% premium for city targeting
        education_premium: 1.1,   // 10% premium for education targeting
        profession_premium: 1.15  // 15% premium for profession targeting
      }
    }

    // Dynamic reach pricing formula
    // Base cost per view decreases as reach increases (economies of scale)
    const calculateReachPrice = (reach: number): number => {
      if (reach <= 0) return 0
      
      // Tiered pricing with diminishing cost per view
      let totalPrice = 0
      let remainingReach = reach
      
      // Tier 1: First 100 views at $0.10 per view
      const tier1 = Math.min(remainingReach, 100)
      totalPrice += tier1 * 0.10
      remainingReach -= tier1
      
      if (remainingReach > 0) {
        // Tier 2: Next 400 views (101-500) at $0.08 per view
        const tier2 = Math.min(remainingReach, 400)
        totalPrice += tier2 * 0.08
        remainingReach -= tier2
      }
      
      if (remainingReach > 0) {
        // Tier 3: Next 1500 views (501-2000) at $0.06 per view
        const tier3 = Math.min(remainingReach, 1500)
        totalPrice += tier3 * 0.06
        remainingReach -= tier3
      }
      
      if (remainingReach > 0) {
        // Tier 4: Next 3000 views (2001-5000) at $0.05 per view
        const tier4 = Math.min(remainingReach, 3000)
        totalPrice += tier4 * 0.05
        remainingReach -= tier4
      }
      
      if (remainingReach > 0) {
        // Tier 5: Remaining views at $0.04 per view
        totalPrice += remainingReach * 0.04
      }
      
      return totalPrice
    }

    // Calculate base reach price
    const reachPrice = calculateReachPrice(reachCount)

    // Calculate duration price
    const weeks = Math.floor(durationDays / 7)
    const remainingDays = durationDays % 7
    const durationPrice = (weeks * basePricing.duration.weekly) + (remainingDays * basePricing.duration.daily)

    // Calculate base price
    let basePrice = reachPrice + durationPrice

    // Apply targeting premiums
    let targetingMultiplier = 1.0

    if (targetAudience.county) {
      targetingMultiplier *= basePricing.targeting.county_premium
    }

    if (targetAudience.city) {
      targetingMultiplier *= basePricing.targeting.city_premium
    }

    if (targetAudience.education_levels && targetAudience.education_levels.length > 0) {
      targetingMultiplier *= basePricing.targeting.education_premium
    }

    if (targetAudience.professions && targetAudience.professions.length > 0) {
      targetingMultiplier *= basePricing.targeting.profession_premium
    }

    const finalPrice = basePrice * targetingMultiplier
    return finalPrice
  }

  const price = calculatePrice()
  
  // Call the callback with the calculated price
  React.useEffect(() => {
    onPriceCalculated?.(price)
  }, [price, onPriceCalculated])
  const pricePerDay = price / durationDays
  const pricePerView = price / reachCount

  const getReachTier = (reach: number): string => {
    if (reach <= 100) return 'Starter'
    if (reach <= 250) return 'Basic'
    if (reach <= 500) return 'Standard'
    if (reach <= 1000) return 'Premium'
    if (reach <= 2500) return 'Professional'
    if (reach <= 5000) return 'Enterprise'
    if (reach <= 10000) return 'Elite'
    return 'Custom'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Calculator className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Campaign Pricing</h3>
      </div>

      {/* Price Summary */}
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            ${price.toFixed(2)}
          </div>
          <div className="text-sm text-blue-700">Total Campaign Cost</div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Reach ({getReachTier(reachCount)})</span>
          </div>
          <span className="text-sm font-medium">{reachCount.toLocaleString()} viewers</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Duration</span>
          </div>
          <span className="text-sm font-medium">
            {durationDays} {durationDays === 1 ? 'day' : 'days'}
          </span>
        </div>

        {targetAudience.county && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">County Targeting</span>
            </div>
            <span className="text-sm font-medium text-blue-600">{targetAudience.county}</span>
          </div>
        )}

        {targetAudience.city && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">City Targeting</span>
            </div>
            <span className="text-sm font-medium text-blue-600">{targetAudience.city}</span>
          </div>
        )}

        {targetAudience.education_levels && targetAudience.education_levels.length > 0 && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Education Targeting</span>
            </div>
            <span className="text-sm font-medium text-blue-600">
              {targetAudience.education_levels.length} level{targetAudience.education_levels.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {targetAudience.professions && targetAudience.professions.length > 0 && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Profession Targeting</span>
            </div>
            <span className="text-sm font-medium text-blue-600">
              {targetAudience.professions.length} profession{targetAudience.professions.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Cost Per Metrics */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            ${pricePerDay.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">Per Day</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            ${pricePerView.toFixed(3)}
          </div>
          <div className="text-xs text-gray-500">Per View</div>
        </div>
      </div>

      {/* Pricing Note */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> Pricing includes ad creation, targeting optimization, and performance tracking. 
          More specific targeting increases visibility but comes with premium pricing.
        </p>
      </div>
    </div>
  )
}

export default PricingCalculator