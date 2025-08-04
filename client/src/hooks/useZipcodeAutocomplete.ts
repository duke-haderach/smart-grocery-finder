import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

interface ZipcodeResult {
  zipcode: string
  city: string
  state: string
  area?: string
}

interface UseZipcodeAutocompleteResult {
  suggestions: ZipcodeResult[]
  isLoading: boolean
  error: string | null
  clearSuggestions: () => void
}

export function useZipcodeAutocomplete(query: string, delay: number = 300): UseZipcodeAutocompleteResult {
  const [suggestions, setSuggestions] = useState<ZipcodeResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounced search function
  const debouncedSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery || searchQuery.length < 1) {
        setSuggestions([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        console.log(`🔍 Fetching zipcode suggestions for: "${searchQuery}"`)
        
        const response = await axios.get('/api/grocery/zipcodes', {
          params: { q: searchQuery },
          timeout: 5000
        })

        if (response.data.success) {
          console.log(`✅ Received ${response.data.data.length} suggestions`)
          setSuggestions(response.data.data)
        } else {
          console.error('❌ Zipcode API error:', response.data.error)
          setError('Failed to fetch suggestions')
          setSuggestions([])
        }
      } catch (err) {
        console.error('❌ Zipcode autocomplete error:', err)
        if (axios.isAxiosError(err)) {
          if (err.code === 'ECONNABORTED') {
            setError('Request timeout - please try again')
          } else if (err.response?.status === 429) {
            setError('Too many requests - please wait a moment')
          } else {
            setError('Failed to fetch suggestions')
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
    clearSuggestions
  }
} 