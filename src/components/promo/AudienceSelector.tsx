import React from 'react'
import { Users, MapPin, GraduationCap, Briefcase, Calendar, Target } from 'lucide-react'
import { LIBERIAN_COUNTIES, EDUCATION_LEVELS, PROFESSIONS } from '../../types/database'

interface AudienceSelectorProps {
  reachCount: number
  durationDays: number
  targetAudience: {
    county?: string
    city?: string
    education_levels?: string[]
    professions?: string[]
  }
  onReachChange: (reach: number) => void
  onDurationChange: (days: number) => void
  onTargetAudienceChange: (audience: {
    county?: string
    city?: string
    education_levels?: string[]
    professions?: string[]
  }) => void
}

const AudienceSelector: React.FC<AudienceSelectorProps> = ({
  reachCount,
  durationDays,
  targetAudience,
  onReachChange,
  onDurationChange,
  onTargetAudienceChange
}) => {
  const reachPresets = [
    { value: 100, label: '100', tier: 'Starter' },
    { value: 250, label: '250', tier: 'Basic' },
    { value: 500, label: '500', tier: 'Standard' },
    { value: 1000, label: '1K', tier: 'Premium' },
    { value: 2500, label: '2.5K', tier: 'Professional' },
    { value: 5000, label: '5K', tier: 'Enterprise' },
    { value: 10000, label: '10K', tier: 'Elite' }
  ]

  const getTierInfo = (reach: number): { tier: string; description: string } => {
    if (reach <= 100) return { tier: 'Starter', description: 'Local visibility' }
    if (reach <= 250) return { tier: 'Basic', description: 'Neighborhood reach' }
    if (reach <= 500) return { tier: 'Standard', description: 'Community focus' }
    if (reach <= 1000) return { tier: 'Premium', description: 'Regional presence' }
    if (reach <= 2500) return { tier: 'Professional', description: 'County-wide reach' }
    if (reach <= 5000) return { tier: 'Enterprise', description: 'Multi-county reach' }
    if (reach <= 10000) return { tier: 'Elite', description: 'National visibility' }
    return { tier: 'Custom', description: 'Maximum exposure' }
  }

  const durationPresets = [
    { days: 1, label: '1 Day' },
    { days: 3, label: '3 Days' },
    { days: 7, label: '1 Week' },
    { days: 14, label: '2 Weeks' },
    { days: 30, label: '1 Month' },
    { days: 60, label: '2 Months' }
  ]

  const handleEducationLevelToggle = (level: string) => {
    const currentLevels = targetAudience.education_levels || []
    const updatedLevels = currentLevels.includes(level)
      ? currentLevels.filter(l => l !== level)
      : [...currentLevels, level]
    
    onTargetAudienceChange({
      ...targetAudience,
      education_levels: updatedLevels
    })
  }

  const handleProfessionToggle = (profession: string) => {
    const currentProfessions = targetAudience.professions || []
    const updatedProfessions = currentProfessions.includes(profession)
      ? currentProfessions.filter(p => p !== profession)
      : [...currentProfessions, profession]
    
    onTargetAudienceChange({
      ...targetAudience,
      professions: updatedProfessions
    })
  }

  const formatEducationLevel = (level: string): string => {
    return level.charAt(0).toUpperCase() + level.slice(1).replace('_', ' ')
  }

  const formatProfession = (profession: string): string => {
    return profession.charAt(0).toUpperCase() + profession.slice(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Target className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Target Audience</h3>
      </div>

      {/* Reach Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Users className="w-4 h-4 inline mr-2" />
          Reach Size
        </label>
        
        {/* Custom Reach Input */}
        <div className="mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="number"
                min="1"
                max="100000"
                value={reachCount}
                onChange={(e) => onReachChange(parseInt(e.target.value) || 1)}
                placeholder="Enter target reach"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
              />
            </div>
            <div className="text-sm text-gray-600">
              <div className="font-medium text-blue-600">{getTierInfo(reachCount).tier}</div>
              <div className="text-xs">{getTierInfo(reachCount).description}</div>
            </div>
          </div>
        </div>

        {/* Quick Preset Options */}
        <div className="mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Quick Presets:</span>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {reachPresets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => onReachChange(preset.value)}
              className={`p-2 rounded-md border text-center transition-colors ${
                reachCount === preset.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="text-sm font-medium">{preset.label}</div>
              <div className="text-xs text-gray-500">{preset.tier}</div>
            </button>
          ))}
        </div>
        
        {/* Reach Guidelines */}
        <div className="mt-3 p-3 bg-gray-50 rounded-md">
          <div className="text-xs text-gray-600">
            <strong>Reach Guidelines:</strong> Start with 100-500 for local campaigns, 1K-2.5K for county-wide reach, 
            5K+ for regional presence. Higher reach increases visibility but also cost.
          </div>
        </div>
      </div>

      {/* Duration Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Calendar className="w-4 h-4 inline mr-2" />
          Campaign Duration
        </label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-3">
          {durationPresets.map((preset) => (
            <button
              key={preset.days}
              type="button"
              onClick={() => onDurationChange(preset.days)}
              className={`p-2 rounded-lg border text-center transition-colors ${
                durationDays === preset.days
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="text-sm font-medium">{preset.label}</div>
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="customDuration" className="text-sm text-gray-600">Custom:</label>
          <input
            type="number"
            id="customDuration"
            min="1"
            max="365"
            value={durationDays}
            onChange={(e) => onDurationChange(parseInt(e.target.value) || 1)}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
          />
          <span className="text-sm text-gray-600">days</span>
        </div>
      </div>

      {/* Geographic Targeting */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            County (Optional)
          </label>
          <select
            id="county"
            value={targetAudience.county || ''}
            onChange={(e) => onTargetAudienceChange({
              ...targetAudience,
              county: e.target.value || undefined
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Counties</option>
            {LIBERIAN_COUNTIES.map((county) => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            City/Town (Optional)
          </label>
          <input
            type="text"
            id="city"
            value={targetAudience.city || ''}
            onChange={(e) => onTargetAudienceChange({
              ...targetAudience,
              city: e.target.value || undefined
            })}
            placeholder="Enter specific city/town"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Education Level Targeting */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <GraduationCap className="w-4 h-4 inline mr-2" />
          Education Levels (Optional)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {EDUCATION_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => handleEducationLevelToggle(level)}
              className={`p-2 rounded-lg border text-sm transition-colors ${
                targetAudience.education_levels?.includes(level)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {formatEducationLevel(level)}
            </button>
          ))}
        </div>
        {targetAudience.education_levels && targetAudience.education_levels.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Selected: {targetAudience.education_levels.length} education level(s)
          </p>
        )}
      </div>

      {/* Profession Targeting */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Briefcase className="w-4 h-4 inline mr-2" />
          Professions (Optional)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {PROFESSIONS.map((profession) => (
            <button
              key={profession}
              type="button"
              onClick={() => handleProfessionToggle(profession)}
              className={`p-2 rounded-lg border text-sm transition-colors ${
                targetAudience.professions?.includes(profession)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {formatProfession(profession)}
            </button>
          ))}
        </div>
        {targetAudience.professions && targetAudience.professions.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Selected: {targetAudience.professions.length} profession(s)
          </p>
        )}
      </div>

      {/* Targeting Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Targeting Summary</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div>• Reach: <span className="font-medium">{reachCount.toLocaleString()} viewers</span></div>
          <div>• Duration: <span className="font-medium">{durationDays} days</span></div>
          {targetAudience.county && (
            <div>• County: <span className="font-medium">{targetAudience.county}</span></div>
          )}
          {targetAudience.city && (
            <div>• City: <span className="font-medium">{targetAudience.city}</span></div>
          )}
          {targetAudience.education_levels && targetAudience.education_levels.length > 0 && (
            <div>• Education: <span className="font-medium">{targetAudience.education_levels.length} levels selected</span></div>
          )}
          {targetAudience.professions && targetAudience.professions.length > 0 && (
            <div>• Professions: <span className="font-medium">{targetAudience.professions.length} selected</span></div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AudienceSelector