import React, { useState } from 'react'
import { X } from 'lucide-react'
import { submitVisitorSignup, checkVisitorSession } from '../../lib/directoryService'
import { LIBERIAN_COUNTIES, EDUCATION_LEVELS, PROFESSIONS } from '../../types/database'
import type { VisitorSignupForm } from '../../types/database'

interface VisitorSignupModalProps {
  isOpen: boolean
  onClose: () => void
  sessionId: string
  onSignupComplete?: () => void // Callback when signup is successfully completed
}

const VisitorSignupModal: React.FC<VisitorSignupModalProps> = ({ isOpen, onClose, sessionId, onSignupComplete }) => {
  const [formData, setFormData] = useState<VisitorSignupForm>({
    first_name: '',
    email_or_whatsapp: '',
    city: '',
    county: '',
    education_level: '',
    profession: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Prevent ESC key from closing modal during form phase
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !submitted) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    if (isOpen && !submitted) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, submitted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Check if already submitted in this session
    const hasSubmitted = await checkVisitorSession(sessionId)
    if (hasSubmitted) {
      setSubmitted(true)
      setLoading(false)
      return
    }

    const success = await submitVisitorSignup(formData, sessionId)
    
    if (success) {
      setSubmitted(true)
      // Notify parent component that signup was completed
      onSignupComplete?.()
    }
    
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen) return null

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for joining the GyaWe School Directory. You now have full access to explore all listed schools.
            </p>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Exploring
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.stopPropagation()} // Prevent backdrop click from closing modal
    >
      <div 
        className="bg-white rounded-lg max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from bubbling
      >
        {/* X button removed - modal is mandatory during form phase */}
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Instant Access</h2>
          <p className="text-gray-600">
            Join thousands of parents, educators, and students exploring verified Liberian schools.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              required
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email_or_whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
              Email or WhatsApp Number *
            </label>
            <input
              type="text"
              id="email_or_whatsapp"
              name="email_or_whatsapp"
              required
              value={formData.email_or_whatsapp}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-1">
                County
              </label>
              <select
                id="county"
                name="county"
                value={formData.county}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select County</option>
                {LIBERIAN_COUNTIES.map(county => (
                  <option key={county} value={county}>{county}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City/Town
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="education_level" className="block text-sm font-medium text-gray-700 mb-1">
                Education Level
              </label>
              <select
                id="education_level"
                name="education_level"
                value={formData.education_level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Level</option>
                {EDUCATION_LEVELS.map(level => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-1">
                Profession
              </label>
              <select
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Profession</option>
                {PROFESSIONS.map(profession => (
                  <option key={profession} value={profession}>
                    {profession.charAt(0).toUpperCase() + profession.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Processing...' : 'Get Instant Access'}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            By continuing, you agree to receive occasional updates about schools in your area. 
            Your data is secure and never shared.
          </p>
        </form>
      </div>
    </div>
  )
}

export default VisitorSignupModal
