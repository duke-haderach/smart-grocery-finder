import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MapPin, Search, ShoppingCart, Package2, Clock, Loader2, Sparkles, ChevronDown, Heart, DollarSign } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Header from '../components/Header'
import { useZipcodeAutocomplete } from '../hooks/useZipcodeAutocomplete'
import { useAddressAutocomplete } from '../hooks/useAddressAutocomplete'

// Form validation schema
const searchSchema = z.object({
  location: z.string().min(3, 'Location must be at least 3 characters'),
  item: z.string().min(1, 'Please enter an item to search for')
})

type SearchFormData = z.infer<typeof searchSchema>

const SearchPage: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showItemSuggestions, setShowItemSuggestions] = useState(false)
  const [itemSuggestions, setItemSuggestions] = useState<typeof popularItems>([])
  const [isLoadingItems, setIsLoadingItems] = useState(false)
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(-1)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const [itemDropdownPosition, setItemDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const [formData, setFormData] = useState({
    location: '',
    item: ''
  })



  // Smart location autocomplete - combines both address and zipcode suggestions
  const { 
    suggestions: addressSuggestions, 
    isLoading: isLoadingAddresses, 
    error: addressError,
    clearSuggestions: clearAddressSuggestions,
    getAddressDetails
  } = useAddressAutocomplete(formData.location, 400) // Slightly longer for addresses

  const { 
    suggestions: zipcodeSuggestions, 
    isLoading: isLoadingZipcodes, 
    error: zipcodeError,
    clearSuggestions: clearZipcodeSuggestions 
  } = useZipcodeAutocomplete(formData.location, 200) // Faster for zipcodes

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: formData
  })

  // Calculate dropdown position relative to input field
  const calculateDropdownPosition = (inputElement: HTMLInputElement) => {
    const rect = inputElement.getBoundingClientRect()
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width
    })
  }

  // Calculate item dropdown position relative to input field
  const calculateItemDropdownPosition = (inputElement: HTMLInputElement) => {
    const rect = inputElement.getBoundingClientRect()
    setItemDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width
    })
  }

  // Sync form data with react-hook-form
  React.useEffect(() => {
    setValue('location', formData.location)
    setValue('item', formData.item)
  }, [formData, setValue])



  const watchedValues = watch()

  const onSubmit = async (data: SearchFormData) => {
    setIsLoading(true)
    try {
      // Navigate to results page with search parameters
      navigate(`/results?location=${encodeURIComponent(data.location)}&item=${encodeURIComponent(data.item)}`)
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const popularItems = [
    // Fresh Produce
    { name: 'Bananas', emoji: '🍌', category: 'Fresh Produce' },
    { name: 'Apples', emoji: '🍎', category: 'Fresh Produce' },
    { name: 'Avocado', emoji: '🥑', category: 'Fresh Produce' },
    { name: 'Tomatoes', emoji: '🍅', category: 'Fresh Produce' },
    { name: 'Onions', emoji: '🧅', category: 'Fresh Produce' },
    { name: 'Carrots', emoji: '🥕', category: 'Fresh Produce' },
    { name: 'Potatoes', emoji: '🥔', category: 'Fresh Produce' },
    { name: 'Bell Peppers', emoji: '🫑', category: 'Fresh Produce' },
    { name: 'Spinach', emoji: '🥬', category: 'Fresh Produce' },
    { name: 'Broccoli', emoji: '🥦', category: 'Fresh Produce' },
    { name: 'Lettuce', emoji: '🥬', category: 'Fresh Produce' },
    { name: 'Cucumbers', emoji: '🥒', category: 'Fresh Produce' },
    { name: 'Strawberries', emoji: '🍓', category: 'Fresh Produce' },
    { name: 'Blueberries', emoji: '🫐', category: 'Fresh Produce' },
    
    // Dairy & Milk Products
    { name: 'Whole Milk', emoji: '🥛', category: 'Dairy' },
    { name: '2% Milk', emoji: '🥛', category: 'Dairy' },
    { name: '1% Milk', emoji: '🥛', category: 'Dairy' },
    { name: 'Skim Milk', emoji: '🥛', category: 'Dairy' },
    { name: 'Almond Milk', emoji: '🥛', category: 'Dairy' },
    { name: 'Oat Milk', emoji: '🥛', category: 'Dairy' },
    { name: 'Soy Milk', emoji: '🥛', category: 'Dairy' },
    { name: 'Coconut Milk', emoji: '🥛', category: 'Dairy' },
    { name: 'Lactose-Free Milk', emoji: '🥛', category: 'Dairy' },
    { name: 'Organic Milk', emoji: '🥛', category: 'Dairy' },
    { name: 'Heavy Cream', emoji: '🥛', category: 'Dairy' },
    { name: 'Half and Half', emoji: '🥛', category: 'Dairy' },
    { name: 'Greek Yogurt', emoji: '🍦', category: 'Dairy' },
    { name: 'Regular Yogurt', emoji: '🍦', category: 'Dairy' },
    { name: 'Cheddar Cheese', emoji: '🧀', category: 'Dairy' },
    { name: 'Mozzarella Cheese', emoji: '🧀', category: 'Dairy' },
    { name: 'Cream Cheese', emoji: '🧀', category: 'Dairy' },
    { name: 'Butter', emoji: '🧈', category: 'Dairy' },
    { name: 'Eggs', emoji: '🥚', category: 'Dairy' },
    { name: 'Organic Eggs', emoji: '🥚', category: 'Dairy' },
    
    // Meat & Seafood
    { name: 'Chicken Breast', emoji: '🐔', category: 'Meat' },
    { name: 'Ground Beef', emoji: '🥩', category: 'Meat' },
    { name: 'Ground Turkey', emoji: '🦃', category: 'Meat' },
    { name: 'Salmon', emoji: '🐟', category: 'Seafood' },
    { name: 'Shrimp', emoji: '🦐', category: 'Seafood' },
    { name: 'Bacon', emoji: '🥓', category: 'Meat' },
    { name: 'Ham', emoji: '🍖', category: 'Meat' },
    
    // Bakery
    { name: 'White Bread', emoji: '🍞', category: 'Bakery' },
    { name: 'Whole Wheat Bread', emoji: '🍞', category: 'Bakery' },
    { name: 'Sourdough Bread', emoji: '🍞', category: 'Bakery' },
    { name: 'Bagels', emoji: '🥯', category: 'Bakery' },
    { name: 'Croissants', emoji: '🥐', category: 'Bakery' },
    
    // Pantry
    { name: 'White Rice', emoji: '🍚', category: 'Pantry' },
    { name: 'Brown Rice', emoji: '🍚', category: 'Pantry' },
    { name: 'Pasta', emoji: '🍝', category: 'Pantry' },
    { name: 'Olive Oil', emoji: '🫒', category: 'Pantry' },
    { name: 'Vegetable Oil', emoji: '🛢️', category: 'Pantry' },
    { name: 'Salt', emoji: '🧂', category: 'Pantry' },
    { name: 'Black Pepper', emoji: '🌶️', category: 'Pantry' },
    { name: 'Sugar', emoji: '🍯', category: 'Pantry' },
    { name: 'All-Purpose Flour', emoji: '🌾', category: 'Pantry' },
    { name: 'Honey', emoji: '🍯', category: 'Pantry' },
    
    // Breakfast
    { name: 'Cheerios', emoji: '🥣', category: 'Breakfast' },
    { name: 'Corn Flakes', emoji: '🥣', category: 'Breakfast' },
    { name: 'Granola', emoji: '🥣', category: 'Breakfast' },
    { name: 'Oatmeal', emoji: '🥣', category: 'Breakfast' },
    { name: 'Pancake Mix', emoji: '🥞', category: 'Breakfast' },
    
    // Beverages
    { name: 'Orange Juice', emoji: '🍊', category: 'Beverages' },
    { name: 'Apple Juice', emoji: '🍎', category: 'Beverages' },
    { name: 'Coffee', emoji: '☕', category: 'Beverages' },
    { name: 'Tea', emoji: '🍵', category: 'Beverages' },
    { name: 'Sparkling Water', emoji: '💧', category: 'Beverages' },
    { name: 'Bottled Water', emoji: '💧', category: 'Beverages' },
    
    // Frozen
    { name: 'Frozen Pizza', emoji: '🍕', category: 'Frozen' },
    { name: 'Vanilla Ice Cream', emoji: '🍨', category: 'Frozen' },
    { name: 'Chocolate Ice Cream', emoji: '🍨', category: 'Frozen' },
    { name: 'Frozen Vegetables', emoji: '🥶', category: 'Frozen' },
    { name: 'Frozen Berries', emoji: '🫐', category: 'Frozen' },
    
    // Snacks
    { name: 'Potato Chips', emoji: '🍟', category: 'Snacks' },
    { name: 'Crackers', emoji: '🍘', category: 'Snacks' },
    { name: 'Nuts', emoji: '🥜', category: 'Snacks' },
    { name: 'Granola Bars', emoji: '🍫', category: 'Snacks' }
  ]

  // Create fake suggestions for testing if we don't have enough
  const fakeLocationSuggestions = Array.from({ length: 8 }, (_, i) => ({
    type: 'zipcode' as const,
    id: `fake-${i}`,
    display: `Test City ${i + 1}, ST 1000${i}, USA`,
    subtitle: 'Test Zipcode',
    data: { zipcode: `1000${i}`, city: `Test City ${i + 1}`, state: 'ST' },
    priority: 1
  }))

  // Combine all location suggestions - ZIPCODE FIRST, then addresses, then fake ones
  const allLocationSuggestions = [
    // Real zipcode suggestions first (prioritized)
    ...zipcodeSuggestions.slice(0, 8).map(zip => ({
      type: 'zipcode' as const,
      id: zip.zipcode,
      display: `${zip.city}, ${zip.state} ${zip.zipcode}, USA`,
      subtitle: zip.area ? `${zip.area} area` : 'Zipcode',
      data: zip,
      priority: 1
    })),
    // Real address suggestions second
    ...addressSuggestions.slice(0, 8).map(addr => ({
      type: 'address' as const,
      id: addr.placeId,
      display: addr.description,
      subtitle: 'Address',
      data: addr,
      priority: 2
    })),
    // Add fake suggestions to ensure we always have at least 8 for testing
    ...fakeLocationSuggestions
  ].slice(0, 10) // Show up to 10 total suggestions (enough to test scrolling)
  
  // Debug: Log suggestion count
  console.log(`🔍 Location suggestions count: ${allLocationSuggestions.length}`)
  console.log(`🔍 Real zipcodes: ${zipcodeSuggestions.length}, Real addresses: ${addressSuggestions.length}`)



  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, item: value }))
    
    if (value.length > 0) {
      // Filter items based on user input
      const filtered = popularItems.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.category.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10) // Limit to 10 suggestions
      
      setItemSuggestions(filtered)
      setShowItemSuggestions(true)
      
      // Recalculate dropdown position in case input moved
      calculateItemDropdownPosition(e.target as HTMLInputElement)
    } else {
      setItemSuggestions([])
      setShowItemSuggestions(false)
    }
  }

  const selectItem = (itemName: string) => {
    setFormData(prev => ({ ...prev, item: itemName }))
    setShowItemSuggestions(false)
  }

  const selectLocation = async (suggestion: any) => {
    // Simply use the display text that the user clicked on
    setFormData(prev => ({ ...prev, location: suggestion.display }))
    
    setShowLocationSuggestions(false)
    setSelectedLocationIndex(-1)
    clearAddressSuggestions()
    clearZipcodeSuggestions()
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, location: value }))
    setShowLocationSuggestions(value.length > 1)
    setSelectedLocationIndex(-1)
    
    // Recalculate dropdown position in case input moved
    if (value.length > 1) {
      calculateDropdownPosition(e.target as HTMLInputElement)
    }
  }

  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showLocationSuggestions || allLocationSuggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedLocationIndex(prev => 
          prev < allLocationSuggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedLocationIndex(prev => 
          prev > 0 ? prev - 1 : allLocationSuggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedLocationIndex >= 0) {
          selectLocation(allLocationSuggestions[selectedLocationIndex])
        }
        break
      case 'Escape':
        setShowLocationSuggestions(false)
        setSelectedLocationIndex(-1)
        break
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="h-8 w-8 text-primary-600 mr-3 animate-pulse" />
          <h1 className="text-5xl font-bold text-gray-900">
            Find Your Perfect
            <span className="text-primary-600"> Grocery Store</span>
          </h1>
          <Sparkles className="h-8 w-8 text-primary-600 ml-3 animate-pulse" />
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Enter your zipcode and the item you're looking for. We'll find the closest, 
          healthiest, and cheapest options with <span className="font-semibold text-primary-600">real-time data</span>.
        </p>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="card mb-12 shadow-xl border-0 bg-gradient-to-br from-white to-primary-50"
      >
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location Input */}
              <div className="relative">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Your Location
                </label>
                

                
                <input
                  {...register('location')}
                  type="text"
                  id="location"
                  placeholder="Start typing a zipcode (e.g., '10001') or address..."
                  value={formData.location}
                  onChange={handleLocationChange}
                  onFocus={(e) => {
                    setShowLocationSuggestions(formData.location.length > 1)
                    calculateDropdownPosition(e.target as HTMLInputElement)
                  }}
                  onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                  onKeyDown={handleLocationKeyDown}
                  className={`input-field ${errors.location ? 'border-red-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'} transition-all duration-200`}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
                
                {/* Helper text */}
                <p className="mt-2 text-xs text-gray-500">
                  💡 Type a zipcode for fastest results, or enter any address - we'll show zipcode suggestions first
                </p>

                {/* Location Suggestions Dropdown - FIXED POSITION */}
                {showLocationSuggestions && allLocationSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-lg shadow-xl"
                    style={{
                      position: 'fixed',
                      top: `${dropdownPosition.top}px`,
                      left: `${dropdownPosition.left}px`,
                      width: `${dropdownPosition.width}px`,
                      height: '300px',
                      minHeight: '300px',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      zIndex: 99999,
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}
                                      >
                    {allLocationSuggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault() // Prevent onBlur from firing
                          selectLocation(suggestion)
                        }}
                        className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 transition-colors duration-200 dropdown-item ${
                          selectedLocationIndex === index ? 'bg-gray-100' : ''
                        }`}
                        style={{
                          height: '50px',
                          minHeight: '50px',
                          maxHeight: '50px',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          borderBottom: '1px solid #f3f4f6',
                          boxSizing: 'border-box'
                        }}
                      >
                          <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-900 truncate">{suggestion.display}</div>
                          </div>
                      </button>
                    ))}
                  </motion.div>
                )}
                
                {/* Loading state for location suggestions */}
                {(isLoadingAddresses || isLoadingZipcodes) && formData.location.length > 1 && !showLocationSuggestions && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                    <div className="px-4 py-3 flex items-center space-x-3">
                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                      <span className="text-sm text-gray-600">
                        Searching {isLoadingZipcodes && isLoadingAddresses ? 'locations' : isLoadingZipcodes ? 'zipcodes' : 'addresses'}...
                      </span>
                    </div>
                  </div>
                )}

                {/* Error state for location suggestions */}
                {(addressError || zipcodeError) && formData.location.length > 1 && !showLocationSuggestions && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                    <div className="px-4 py-3 text-sm text-red-600 flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Unable to load location suggestions</span>
                    </div>
                  </div>
                )}

                {/* No results state */}
                {showLocationSuggestions && 
                 !isLoadingAddresses && 
                 !isLoadingZipcodes && 
                 allLocationSuggestions.length === 0 && 
                 formData.location.length > 2 && 
                 !addressError && 
                 !zipcodeError && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                    <div className="px-4 py-3 text-sm text-gray-500 flex items-center space-x-2">
                      <Search className="h-4 w-4" />
                      <span>No locations found for "{formData.location}"</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Item Input */}
              <div className="relative">
                <label htmlFor="item" className="block text-sm font-medium text-gray-700 mb-2">
                  <Search className="inline h-4 w-4 mr-1" />
                  Grocery Item
                </label>
                <div className="relative">
                  <input
                    {...register('item')}
                    type="text"
                    id="item"
                    placeholder="e.g., Organic Bananas"
                    value={formData.item}
                    onChange={handleItemChange}
                    className={`input-field ${errors.item ? 'border-red-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'} transition-all duration-200`}
                    onFocus={(e) => {
                      calculateItemDropdownPosition(e.target as HTMLInputElement)
                      if (formData.item.length > 0) {
                        const filtered = popularItems.filter(item =>
                          item.name.toLowerCase().includes(formData.item.toLowerCase()) ||
                          item.category.toLowerCase().includes(formData.item.toLowerCase())
                        ).slice(0, 10)
                        setItemSuggestions(filtered)
                        setShowItemSuggestions(true)
                      } else {
                        setItemSuggestions(popularItems.slice(0, 10))
                        setShowItemSuggestions(true)
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowItemSuggestions(false), 200)}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      if (!showItemSuggestions) {
                        // Find the input element and calculate position
                        const inputElement = (e.target as HTMLElement).closest('.relative')?.querySelector('input') as HTMLInputElement
                        if (inputElement) {
                          calculateItemDropdownPosition(inputElement)
                        }
                        setItemSuggestions(popularItems.slice(0, 10))
                        setShowItemSuggestions(true)
                      } else {
                        setShowItemSuggestions(false)
                      }
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                {errors.item && (
                  <p className="mt-1 text-sm text-red-600">{errors.item.message}</p>
                )}

                {/* Item Suggestions Dropdown - FIXED POSITION */}
                {showItemSuggestions && itemSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-lg shadow-xl"
                    style={{
                      position: 'fixed',
                      top: `${itemDropdownPosition.top}px`,
                      left: `${itemDropdownPosition.left}px`,
                      width: `${itemDropdownPosition.width}px`,
                      height: '360px',
                      minHeight: '360px',
                      maxHeight: '360px',
                      overflowY: 'auto',
                      zIndex: 99999,
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    {itemSuggestions.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          selectItem(item.name)
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-primary-50 flex items-center space-x-3 transition-colors duration-200 dropdown-item-tall"
                      >
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.category}</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <motion.button
                type="submit"
                disabled={isLoading}
                className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Searching Real-Time Data...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span>Find Stores</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Popular Items Grid - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-12"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
          Popular Items
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {popularItems.slice(0, 10).map((item, index) => (
            <motion.button
              key={item.name}
              onClick={() => selectItem(item.name)}
              className="p-4 bg-white hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded-xl text-center transition-all duration-200 group shadow-sm hover:shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                {item.emoji}
              </div>
              <div className="font-medium text-gray-900 text-sm">{item.name}</div>
              <div className="text-xs text-gray-500 mt-1">{item.category}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Features - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <motion.div 
          className="text-center group"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors duration-200">
            <Clock className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Shortest Distance</h3>
          <p className="text-gray-600">
            Find the closest grocery store to save time on your shopping trip.
          </p>
        </motion.div>

        <motion.div 
          className="text-center group"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-success-200 transition-colors duration-200">
            <Heart className="h-8 w-8 text-success-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Healthiest Options</h3>
          <p className="text-gray-600">
            Discover stores with the best organic and fresh produce selections.
          </p>
        </motion.div>

        <motion.div 
          className="text-center group"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-warning-200 transition-colors duration-200">
            <DollarSign className="h-8 w-8 text-warning-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Prices</h3>
          <p className="text-gray-600">
            Compare prices across stores to get the best deals on your groceries.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SearchPage 