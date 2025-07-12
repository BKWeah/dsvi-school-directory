import React, { useState } from 'react'
import { toast } from 'sonner'
import { submitManualSchool } from '../lib/directoryService'
import type { ManualSchoolSubmissionForm } from '../types/database'
import { SCHOOL_CATEGORIES, LIBERIAN_COUNTIES } from '../types/database'

const ManualSubmission: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ManualSchoolSubmissionForm>({
    school_name: '',
    logo_url: '',
    description: '',
    school_type: 'private',
    year_established: undefined,
    location: '',
    website_url: '',
    permit_url: '',
    contact_info: {
      email: '',
      phone: '',
      address: ''
    },
    categories: []
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.startsWith('contact_info.')) {
      const contactField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        contact_info: {
          ...prev.contact_info,
          [contactField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'year_established' ? (value ? parseInt(value) : undefined) : value
      }))
    }
  }

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.school_name.trim()) {
      toast.error('School name is required')
      return
    }
    
    if (!formData.location.trim()) {
      toast.error('Location is required')
      return
    }
    
    if (formData.categories.length === 0) {
      toast.error('Please select at least one school category')
      return
    }
    
    if (!formData.contact_info.email && !formData.contact_info.phone) {
      toast.error('Please provide either email or phone contact information')
      return
    }

    setIsSubmitting(true)
    try {
      const success = await submitManualSchool(formData)
      if (success) {
        toast.success('School submission successful! We will review your application and get back to you.')
        setFormData({
          school_name: '',
          logo_url: '',
          description: '',
          school_type: 'private',
          year_established: undefined,
          location: '',
          website_url: '',
          permit_url: '',
          contact_info: {
            email: '',
            phone: '',
            address: ''
          },
          categories: []
        })
      } else {
        toast.error('Submission failed. Please try again.')
      }
    } catch (error) {
      toast.error('An error occurred while submitting. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCategoryLabel = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Submit Your School</h1>
        <div className="bg-white rounded-lg shadow p-8">
          <p className="text-gray-600 mb-8">
            Submit your school to be listed in the DSVI School Directory. All submissions will be reviewed before being published.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Basic Information</h2>
              
              <div>
                <label htmlFor="school_name" className="block text-sm font-medium text-gray-700 mb-2">
                  School Name *
                </label>
                <input
                  type="text"
                  id="school_name"
                  name="school_name"
                  value={formData.school_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter school name"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of your school"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="school_type" className="block text-sm font-medium text-gray-700 mb-2">
                    School Type *
                  </label>
                  <select
                    id="school_type"
                    name="school_type"
                    value={formData.school_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="year_established" className="block text-sm font-medium text-gray-700 mb-2">
                    Year Established
                  </label>
                  <input
                    type="number"
                    id="year_established"
                    name="year_established"
                    value={formData.year_established || ''}
                    onChange={handleInputChange}
                    min="1800"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 2010"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="City, County (e.g., Monrovia, Montserrado)"
                />
              </div>
            </div>

            {/* School Categories */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">School Categories *</h2>
              <p className="text-sm text-gray-600">Select all education levels your school offers:</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {SCHOOL_CATEGORIES.map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{formatCategoryLabel(category)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Contact Information</h2>
              <p className="text-sm text-gray-600">Please provide at least one contact method (email or phone):</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact_info.email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="contact_info.email"
                    name="contact_info.email"
                    value={formData.contact_info.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="school@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="contact_info.phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="contact_info.phone"
                    name="contact_info.phone"
                    value={formData.contact_info.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+231 XXX XXXX"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact_info.address" className="block text-sm font-medium text-gray-700 mb-2">
                  Physical Address
                </label>
                <textarea
                  id="contact_info.address"
                  name="contact_info.address"
                  value={formData.contact_info.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Complete physical address"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Additional Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    id="website_url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://www.yourschool.com"
                  />
                </div>

                <div>
                  <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    id="logo_url"
                    name="logo_url"
                    value={formData.logo_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="permit_url" className="block text-sm font-medium text-gray-700 mb-2">
                  Permit/License Document URL
                </label>
                <input
                  type="url"
                  id="permit_url"
                  name="permit_url"
                  value={formData.permit_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/permit.pdf"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? 'Submitting...' : 'Submit School for Review'}
              </button>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Your submission will be reviewed within 2-3 business days.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ManualSubmission
