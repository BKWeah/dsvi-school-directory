import React from 'react'
import { MapPin, ExternalLink, Calendar, Award } from 'lucide-react'
import type { DirectorySchool } from '../../types/database'

interface SchoolGridProps {
  schools: DirectorySchool[]
  loading: boolean
}

const SchoolGrid: React.FC<SchoolGridProps> = ({ schools, loading }) => {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded mb-4"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (schools.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {schools.map((school) => (
        <div key={school.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
          {/* School Logo */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-center mb-4">
              {school.logo_url ? (
                <img 
                  src={school.logo_url} 
                  alt={`${school.name} logo`}
                  className="w-16 h-16 object-contain rounded-full border-2 border-gray-100"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
              )}
            </div>

            {/* School Name */}
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2 line-clamp-2">
              {school.name}
            </h3>

            {/* DSVI Client Badge */}
            {school.is_dsvi_client && (
              <div className="flex justify-center mb-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  DSVI Built
                </span>
              </div>
            )}

            {/* Description */}
            {school.description && (
              <p className="text-sm text-gray-600 text-center mb-4 line-clamp-3">
                {school.description}
              </p>
            )}

            {/* School Details */}
            <div className="space-y-2">
              {school.location && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{school.location}</span>
                </div>
              )}

              {school.year_established && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Established {school.year_established}</span>
                </div>
              )}

              {school.school_type && (
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="capitalize">{school.school_type} School</span>
                </div>
              )}
            </div>

            {/* Categories */}
            {school.categories && school.categories.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-1">
                  {school.categories.slice(0, 3).map((category) => (
                    <span 
                      key={category}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
                  {school.categories.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      +{school.categories.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 pb-6">
            <div className="flex gap-2">
              {school.website_url && (
                <a
                  href={school.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </a>
              )}
              
              <button
                onClick={() => {
                  // Navigate to school profile page
                  window.location.href = `/school/${school.id}`
                }}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                View Profile
              </button>
            </div>

            {/* Permit/Certificate Link */}
            {school.permit_url && (
              <div className="mt-3">
                <a
                  href={school.permit_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700"
                >
                  <Award className="h-3 w-3 mr-1" />
                  View Permit/Certificate
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SchoolGrid
