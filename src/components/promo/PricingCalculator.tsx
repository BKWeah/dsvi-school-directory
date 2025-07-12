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
  // Enhanced pricing logic
  const calculatePrice = (): number => {
    // Base pricing structure
    const basePricing = {
      reach: {
        100: 10.00,   // $10 for 100 views
        250: 22.50,   // $22.50 for 250 views  
        500: 40.00,   // $40 for 500 views
        1000: 70.00,  // $70 for 1000 views
        2500: 150.00, // $150 for 2500 views
        5000: 275.00  // $275 for 5000 views
      },
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

    // Calculate base reach price
    let reachPrice = 0
    if (reachCount <= 100) {
      reachPrice = basePricing.reach[100]
    } else if (reachCount <= 250) {
      reachPrice = basePricing.reach[250]
    } else if (reachCount <= 500) {
      reachPrice = basePricing.reach[500]
    } else if (reachCount <= 1000) {
      reachPrice = basePricing.reach[1000]
    } else if (reachCount <= 2500) {
      reachPrice = basePricing.reach[2500]
    } else {
      reachPrice = basePricing.reach[5000]
    }

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
    return 'Enterprise'
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