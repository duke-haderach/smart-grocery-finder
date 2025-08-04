import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

interface AddressResult {
  placeId: string
  description: string
  mainText: string
  secondaryText: string
  types: string[]
}

interface AddressDetails {
  address: string
  city: string
  state: string
  zipcode: string
  country: string
  latitude: number
  longitude: number
}

interface UseAddressAutocompleteResult {
  suggestions: AddressResult[]
  isLoading: boolean
  error: string | null
  clearSuggestions: () => void
  getAddressDetails: (placeId: string) => Promise<AddressDetails | null>
}

export function useAddressAutocomplete(query: string, delay: number = 300): UseAddressAutocompleteResult {
  const [suggestions, setSuggestions] = useState<AddressResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounced search function
  const debouncedSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery || searchQuery.length < 2) {
        setSuggestions([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        console.log(`🔍 Fetching address suggestions for: "${searchQuery}"`)
        
        const response = await axios.get('/api/grocery/addresses', {
          params: { q: searchQuery },
          timeout: 5000
        })

        if (response.data.success) {
          console.log(`✅ Received ${response.data.data.length} address suggestions`)
          setSuggestions(response.data.data)
        } else {
          console.error('❌ Address API error:', response.data.error)
          setError('Failed to fetch address suggestions')
          setSuggestions([])
        }
      } catch (err) {
        console.error('❌ Address autocomplete error:', err)
        if (axios.isAxiosError(err)) {
          if (err.code === 'ECONNABORTED') {
            setError('Request timeout - please try again')
          } else if (err.response?.status === 429) {
            setError('Too many requests - please wait a moment')
          } else {
            setError('Failed to fetch address suggestions')
          }
        } else {
          setError('Network error - please check your connection')
        }
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  // Get detailed address information
  const getAddressDetails = useCallback(async (placeId: string): Promise<AddressDetails | null> => {
    try {
      console.log(`🔍 Fetching address details for place ID: ${placeId}`)
      
      const response = await axios.get('/api/grocery/address-details', {
        params: { placeId },
        timeout: 5000
      })

      if (response.data.success) {
        console.log('✅ Address details retrieved')
        return response.data.data
      } else {
        console.error('❌ Address details error:', response.data.error)
        return null
      }
    } catch (err) {
      console.error('❌ Address details fetch error:', err)
      return null
    }
  }, [])

  // Debounce the search
  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(query)
    }, delay)

    return () => clearTimeout(timer)
  }, [query, delay, debouncedSearch])

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    suggestions,
    isLoading,
    error,
    clearSuggestions,
    getAddressDetails
  }
} 