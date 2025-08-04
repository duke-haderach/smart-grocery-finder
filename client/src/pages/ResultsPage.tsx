import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Clock, Heart, DollarSign, MapPin, Phone, Star, ArrowLeft, AlertCircle, Filter, X, ExternalLink, Navigation, Info, CheckCircle, Circle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { SearchResult, GroceryStore, RecommendationType } from '../types'
import { getStoreLogo, getStorePlaceholder } from '../utils/storeLogo'
import { calculateItemAvailability, getItemSuggestions } from '../utils/storeItemMatcher'
import { generateStoreSearchUrl, getStoreAppLinks, generateGoogleStoreSearch } from '../utils/storeSearchUrls'

interface FilterState {
  maxDistance: number
  minRating: number
  storeTypes: string[]
  priceRange: [number, number]
  healthRange: [number, number]
}

const ResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const location = searchParams.get('location')
  const item = searchParams.get('item')
  const [activeRecommendation, setActiveRecommendation] = useState<RecommendationType>('shortest')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    maxDistance: 25,
    minRating: 0,
    storeTypes: [],
    priceRange: [0, 10],
    healthRange: [0, 10]
  })

  // Real API call to our backend
  const { data: results, isLoading, error } = useQuery({
    queryKey: ['search-results', location, item],
    queryFn: async (): Promise<SearchResult> => {
      const response = await fetch(
                  `/api/grocery/search?location=${encodeURIComponent(location!)}&item=${encodeURIComponent(item!)}`
      )
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch results')
      }
      
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Search failed')
      }
      
      return data.data
    },
    enabled: !!location && !!item,
    retry: 1,
    retryDelay: 1000
  })

  useEffect(() => {
    if (!location || !item) {
      toast.error('Missing search parameters')
    }
  }, [location, item])

  const getDirectionsUrl = (store: GroceryStore) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(store.address)}`
  }

  const getAllStores = (): GroceryStore[] => {
    if (!results) return []
    return [results.shortest, results.healthiest, results.budgetFriendly]
      .filter((store, index, arr) => arr.findIndex(s => s.id === store.id) === index) // Remove duplicates
  }

  const filteredStores = getAllStores().filter(store => {
    if (store.distance > filters.maxDistance) return false
    if (store.rating < filters.minRating) return false
    if (store.priceScore < filters.priceRange[0] || store.priceScore > filters.priceRange[1]) return false
    if (store.healthScore < filters.healthRange[0] || store.healthScore > filters.healthRange[1]) return false
    if (filters.storeTypes.length > 0 && !filters.storeTypes.some(type => 
      store.categories.some(cat => cat.toLowerCase().includes(type.toLowerCase())))) return false
    return true
  })

  if (!location || !item) {
    return (
      <div className="text-center">
        <p className="text-gray-600 mb-4">No search parameters found.</p>
        <Link to="/" className="btn-primary">
          Go Back to Search
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Finding the best stores for you...</h2>
          <p className="text-gray-600">
            Searching real-time data for "{item}" near {location}
          </p>
        </div>
      </div>
    )
  }

  if (error || !results) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="card">
          <div className="card-body">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Search Error</h2>
            <p className="text-red-600 mb-4">
              {error instanceof Error ? error.message : 'Unable to load results. Please try again.'}
            </p>
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <p>This could be due to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Invalid or unrecognized zipcode</li>
                <li>No grocery stores found in the area</li>
                <li>Temporary API service issues</li>
                <li>Network connectivity problems</li>
              </ul>
            </div>
            <Link to="/" className="btn-primary">
              Try New Search
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const recommendations = {
    shortest: { store: results.shortest, icon: Clock, color: 'primary', title: 'Closest Store' },
    healthiest: { store: results.healthiest, icon: Heart, color: 'success', title: 'Healthiest Option' },
    budgetFriendly: { store: results.budgetFriendly, icon: DollarSign, color: 'warning', title: 'Budget-Friendly' }
  }

  const activeStore = recommendations[activeRecommendation].store
  const allStores = getAllStores()

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          to="/"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          New Search
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Results for "{results.searchedItem}" in {results.userLocation.zipcode}
            </h1>
            <p className="text-gray-600">
              Found {allStores.length} real-time grocery store options{results.userLocation.city && results.userLocation.state ? ` • ${results.userLocation.city}, ${results.userLocation.state}` : ''}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              showFilters ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </motion.div>

      {/* Transparency Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 mb-2">
                How We Estimate Item Availability & Store Recommendations
              </h3>
              <p className="text-blue-800 text-sm mb-3">
                <strong>We don't have real-time inventory or pricing data.</strong> Our predictions are based on store specialties, 
                typical inventory patterns, and the type of item you're searching for. Availability percentages are estimates only.
                <br /><br />
                <strong>💰 Pricing Note:</strong> "Budget-Friendly" recommendations are based on store reputation for low prices, not actual current prices.
                <br /><br />
                <strong>🔍 New!</strong> Click "Search" buttons to check actual inventory on store websites with your item pre-searched.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">💡 Smart Tips:</h4>
                  <ul className="text-blue-700 space-y-1">
                    {getItemSuggestions(item!).map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-1">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">🎯 Best Practices:</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-1">•</span>
                      Use "Search" buttons for real-time inventory
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-1">•</span>
                      Download store apps for best inventory visibility
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-1">•</span>
                      Higher percentages = better likelihood
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-1">•</span>
                      Call ahead to confirm availability
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card mb-8 bg-gray-50"
        >
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filter Stores</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Distance Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Distance: {filters.maxDistance} miles
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={filters.maxDistance}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Rating: {filters.minRating} stars
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.minRating}
                  onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Score: {filters.priceRange[0]}-{filters.priceRange[1]}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      priceRange: [parseInt(e.target.value), prev.priceRange[1]] 
                    }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Health Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Score: {filters.healthRange[0]}-{filters.healthRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={filters.healthRange[0]}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    healthRange: [parseInt(e.target.value), prev.healthRange[1]] 
                  }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recommendation Cards - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {Object.entries(recommendations).map(([type, rec]) => {
          const Icon = rec.icon
          const isActive = activeRecommendation === type
          
          return (
            <motion.div
              key={type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveRecommendation(type as RecommendationType)}
              className={`card cursor-pointer transition-all duration-200 ${
                isActive ? `ring-2 ring-${rec.color}-500 shadow-lg` : 'hover:shadow-lg'
              }`}
            >
              <div className="card-body">
                <div className="flex items-center mb-3">
                  <div className={`w-10 h-10 bg-${rec.color}-100 rounded-full flex items-center justify-center mr-3`}>
                    <Icon className={`h-5 w-5 text-${rec.color}-600`} />
                  </div>
                  <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                </div>
                
                {/* Store Logo and Name */}
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 mr-3 flex-shrink-0">
                    <img
                      src={getStoreLogo(rec.store.name) || getStorePlaceholder(rec.store.name)}
                      alt={`${rec.store.name} logo`}
                      className="w-full h-full object-contain rounded-lg bg-white border border-gray-100"
                      onLoad={() => console.log('✅ Logo loaded successfully for:', rec.store.name)}
                      onError={(e) => {
                        console.log('❌ Logo failed to load for:', rec.store.name, 'Error:', e)
                        // Fallback to placeholder if logo fails to load
                        const target = e.target as HTMLImageElement
                        const placeholder = getStorePlaceholder(rec.store.name)
                        console.log('🔄 Using placeholder for:', rec.store.name, placeholder)
                        target.src = placeholder
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{rec.store.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{rec.store.address}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Distance:</span>
                    <span className="font-medium">{rec.store.distance} miles</span>
                  </div>
                  
                  {/* Item Availability */}
                  {(() => {
                    const availability = calculateItemAvailability(rec.store.name, item!)
                    const percentage = Math.round(availability.likelihood * 100)
                    const confidenceColor = availability.confidence === 'high' ? 'text-green-600' : 
                                          availability.confidence === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                    return (
                      <div className="bg-gray-50 rounded p-2 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center">
                            <Circle className={`h-3 w-3 mr-1 ${availability.confidence === 'high' ? 'fill-green-500 text-green-500' : 
                                                                availability.confidence === 'medium' ? 'fill-yellow-500 text-yellow-500' : 
                                                                'fill-gray-500 text-gray-500'}`} />
                            Likely has "{item}":
                          </span>
                          <span className={`font-medium ${confidenceColor}`}>{percentage}%</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {availability.reasons.slice(0, 2).join(' • ')}
                        </div>
                      </div>
                    )
                  })()}
                  
                  <div className="flex justify-between">
                    <span>Health Score:</span>
                    <span className="font-medium text-success-600">{rec.store.healthScore}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price Score:</span>
                    <span className="font-medium text-warning-600">{rec.store.priceScore}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rating:</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium ml-1">{rec.store.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  {/* Primary Actions Row */}
                  <div className="flex space-x-2">
                    {(() => {
                      const storeSearchUrl = generateStoreSearchUrl(rec.store.name, item!)
                      if (storeSearchUrl) {
                        return (
                          <a
                            href={storeSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Search "{item}"
                          </a>
                        )
                      } else {
                        // Fallback to Google search
                        return (
                          <a
                            href={generateGoogleStoreSearch(rec.store.name, item!)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Google Search
                          </a>
                        )
                      }
                    })()}
                    <a
                      href={getDirectionsUrl(rec.store)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary-100 hover:bg-primary-200 text-primary-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Directions
                    </a>
                  </div>
                  
                  {/* Secondary Actions Row */}
                  <div className="flex space-x-2">
                    {(() => {
                      const appLinks = getStoreAppLinks(rec.store.name)
                      if (appLinks.hasApp && appLinks.appStoreUrl) {
                        return (
                          <a
                            href={appLinks.appStoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1.5 rounded text-xs transition-colors duration-200 flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            📱 Get App
                          </a>
                        )
                      }
                      return null
                    })()}
                    {rec.store.website && (
                      <a
                        href={rec.store.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1.5 rounded text-xs transition-colors duration-200 flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        🌐 Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Detailed View */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Store Details */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Store Details</h3>
          </div>
          <div className="card-body space-y-4">
            {/* Store Header with Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={getStoreLogo(activeStore.name) || getStorePlaceholder(activeStore.name)}
                  alt={`${activeStore.name} logo`}
                  className="w-full h-full object-contain rounded-lg bg-white border border-gray-100"
                  onLoad={() => console.log('✅ Logo loaded successfully for:', activeStore.name)}
                  onError={(e) => {
                    console.log('❌ Logo failed to load for:', activeStore.name, 'Error:', e)
                    const target = e.target as HTMLImageElement
                    const placeholder = getStorePlaceholder(activeStore.name)
                    console.log('🔄 Using placeholder for:', activeStore.name, placeholder)
                    target.src = placeholder
                  }}
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-xl mb-1">{activeStore.name}</h4>
              <div className="flex items-start text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{activeStore.address}</span>
              </div>
              {activeStore.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-1" />
                  <a href={`tel:${activeStore.phone}`} className="hover:text-primary-600">
                    {activeStore.phone}
                  </a>
                </div>
              )}
              {activeStore.website && (
                <div className="mt-2">
                  <a 
                    href={activeStore.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    Visit Website →
                  </a>
                </div>
              )}
              </div>
            </div>

            {/* Item Availability for Selected Store */}
            {(() => {
              const availability = calculateItemAvailability(activeStore.name, item!)
              const percentage = Math.round(availability.likelihood * 100)
              const confidenceColor = availability.confidence === 'high' ? 'text-green-600' : 
                                    availability.confidence === 'medium' ? 'text-yellow-600' : 'text-gray-600'
              return (
                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-900 mb-3">Item Availability Estimate</h5>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center font-medium">
                        <Circle className={`h-4 w-4 mr-2 ${availability.confidence === 'high' ? 'fill-green-500 text-green-500' : 
                                                            availability.confidence === 'medium' ? 'fill-yellow-500 text-yellow-500' : 
                                                            'fill-gray-500 text-gray-500'}`} />
                        Likely to have "{item}":
                      </span>
                      <span className={`text-xl font-bold ${confidenceColor}`}>{percentage}%</span>
                    </div>
                    <div className="space-y-2">
                      <h6 className="font-medium text-sm text-gray-700">Why this estimate:</h6>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {availability.reasons.map((reason, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-gray-400 mr-2">•</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-xs text-gray-500 bg-white rounded p-2 border-l-4 border-blue-400">
                      <strong>Remember:</strong> This is an estimate based on store type and typical inventory. 
                      Call ahead to confirm "{item}" is currently in stock.
                    </div>
                  </div>
                </div>
              )
            })()}

            <div className="border-t pt-4">
              <h5 className="font-medium text-gray-900 mb-2">Store Hours</h5>
              <div className="grid grid-cols-1 gap-1 text-sm">
                {Object.entries(activeStore.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize font-medium">{day}:</span>
                    <span className="text-gray-600 text-right">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <h5 className="font-medium text-gray-900 mb-2">Store Categories</h5>
              <div className="flex flex-wrap gap-2">
                {activeStore.categories.map((category) => (
                  <span
                    key={category}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <h5 className="font-medium text-gray-900 mb-3">Score Breakdown</h5>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Health Score</span>
                    <span className="font-medium">{activeStore.healthScore}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-success-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(activeStore.healthScore / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Price Score</span>
                    <span className="font-medium">{activeStore.priceScore}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-warning-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(activeStore.priceScore / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Distance</span>
                    <span className="font-medium">{activeStore.distance} miles</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(10, 100 - (activeStore.distance / 25) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-4 space-y-3">
              {/* Primary Search Action */}
              {(() => {
                const storeSearchUrl = generateStoreSearchUrl(activeStore.name, item!)
                if (storeSearchUrl) {
                  return (
                    <a
                      href={storeSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Search for "{item}" on Store Website
                    </a>
                  )
                } else {
                  return (
                    <a
                      href={generateGoogleStoreSearch(activeStore.name, item!)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Google Search: "{item}" at {activeStore.name}
                    </a>
                  )
                }
              })()}
              
              {/* Secondary Actions Row */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={getDirectionsUrl(activeStore)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <Navigation className="h-5 w-5 mr-2" />
                  Directions
                </a>
                {activeStore.phone && (
                  <a
                    href={`tel:${activeStore.phone}`}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Call
                  </a>
                )}
              </div>
              
              {/* App & Website Links */}
              <div className="grid grid-cols-2 gap-2">
                {(() => {
                  const appLinks = getStoreAppLinks(activeStore.name)
                  if (appLinks.hasApp && appLinks.appStoreUrl) {
                    return (
                      <a
                        href={appLinks.appStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                      >
                        📱 Download App
                      </a>
                    )
                  }
                  return null
                })()}
                {activeStore.website && (
                  <a
                    href={activeStore.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    🌐 Store Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Store Locations</h3>
          </div>
          <div className="card-body p-0">
            <div className="h-96 rounded-lg overflow-hidden">
              <MapContainer
                center={[results.userLocation.latitude, results.userLocation.longitude]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* User Location Marker */}
                <Marker position={[results.userLocation.latitude, results.userLocation.longitude]}>
                  <Popup>
                    <div className="text-center">
                      <strong>Your Location</strong><br />
                      {results.userLocation.zipcode}
                      {results.userLocation.city && results.userLocation.state && (
                        <><br />{results.userLocation.city}, {results.userLocation.state}</>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {results.userLocation.latitude.toFixed(4)}, {results.userLocation.longitude.toFixed(4)}
                      </div>
                    </div>
                  </Popup>
                </Marker>

                {/* Store Markers */}
                {allStores.map((store) => (
                  <Marker
                    key={store.id}
                    position={[store.latitude, store.longitude]}
                  >
                    <Popup>
                      <div className="max-w-sm">
                        {/* Store Header with Logo */}
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 mr-3 flex-shrink-0">
                            <img
                              src={getStoreLogo(store.name) || getStorePlaceholder(store.name)}
                              alt={`${store.name} logo`}
                              className="w-full h-full object-contain rounded bg-white border border-gray-100"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = getStorePlaceholder(store.name)
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 mb-1">{store.name}</div>
                            <div className="text-sm text-gray-600 mb-2">{store.address}</div>
                          </div>
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Distance:</span>
                            <span className="font-medium">{store.distance} miles</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rating:</span>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                              <span className="font-medium">{store.rating}</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Coordinates:</span>
                            <span>{store.latitude.toFixed(4)}, {store.longitude.toFixed(4)}</span>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <a
                            href={getDirectionsUrl(store)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            Get Directions →
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ResultsPage 