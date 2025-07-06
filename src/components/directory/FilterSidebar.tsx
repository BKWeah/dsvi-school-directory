import React, { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { SCHOOL_CATEGORIES, LIBERIAN_COUNTIES } from '../../types/database'
import type { DirectoryFilters } from '../../types/database'

interface FilterSidebarProps {
  onFilterChange: (filters: DirectoryFilters) => void
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<DirectoryFilters>({
    school_type: 'all',
    categories: [],
    county: '',
    city: ''
  })
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (key: keyof DirectoryFilters, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleCategoryToggle = (category: string) => {
    const currentCategories = filters.categories || []
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category]
    
    handleFilterChange('categories', newCategories)
  }

  const clearFilters = () => {
    const clearedFilters: DirectoryFilters = {
      school_type: 'all',
      categories: [],
      county: '',
      city: ''
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = filters.school_type !== 'all' || 
    (filters.categories && filters.categories.length > 0) ||
    filters.county || filters.city

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <FilterContent 
          filters={filters}
          onFilterChange={handleFilterChange}
          onCategoryToggle={handleCategoryToggle}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Mobile Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto h-full pb-20">
              <FilterContent 
                filters={filters}
                onFilterChange={handleFilterChange}
                onCategoryToggle={handleCategoryToggle}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

interface FilterContentProps {
  filters: DirectoryFilters
  onFilterChange: (key: keyof DirectoryFilters, value: any) => void
  onCategoryToggle: (category: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

const FilterContent: React.FC<FilterContentProps> = ({
  filters,
  onFilterChange,
  onCategoryToggle,
  onClearFilters,
  hasActiveFilters
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear all
          </button>
        )}
      </div>

      {/* School Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          School Type
        </label>
        <div className="space-y-2">
          {[
            { value: 'all', label: 'All Schools' },
            { value: 'public', label: 'Public Schools' },
            { value: 'private', label: 'Private Schools' }
          ].map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="school_type"
                value={option.value}
                checked={filters.school_type === option.value}
                onChange={(e) => onFilterChange('school_type', e.target.value)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Location
        </label>
        <div className="space-y-3">
          <div>
            <select
              value={filters.county || ''}
              onChange={(e) => onFilterChange('county', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Counties</option>
              {LIBERIAN_COUNTIES.map(county => (
                <option key={county} value={county}>{county}</option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="City/Town"
              value={filters.city || ''}
              onChange={(e) => onFilterChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Educational Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Educational Level
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {SCHOOL_CATEGORIES.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.categories?.includes(category) || false}
                onChange={() => onCategoryToggle(category)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.school_type !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {filters.school_type} schools
              </span>
            )}
            {filters.county && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {filters.county}
              </span>
            )}
            {filters.city && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {filters.city}
              </span>
            )}
            {filters.categories?.map((category) => (
              <span key={category} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {category.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterSidebar
