import { useState, useEffect } from 'react'

interface GeolocationState {
  location: {
    latitude: number
    longitude: number
  } | null
  isLoading: boolean
  error: string | null
  isSupported: boolean
  permission: PermissionState | null
}

interface UseGeolocationResult extends GeolocationState {
  getCurrentLocation: () => void
  clearLocation: () => void
}

export function useGeolocation(): UseGeolocationResult {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    isLoading: false,
    error: null,
    isSupported: 'geolocation' in navigator,
    permission: null
  })

  // Check permission status
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        setState(prev => ({ ...prev, permission: result.state }))
        
        // Listen for permission changes
        result.addEventListener('change', () => {
          setState(prev => ({ ...prev, permission: result.state }))
        })
      }).catch(() => {
        // Permission API not supported
        setState(prev => ({ ...prev, permission: null }))
      })
    }
  }, [])

  const getCurrentLocation = () => {
    if (!state.isSupported) {
      setState(prev => ({ 
        ...prev, 
        error: 'Geolocation is not supported by this browser' 
      }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ Location detected:', position.coords.latitude, position.coords.longitude)
        setState(prev => ({
          ...prev,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          isLoading: false,
          error: null
        }))
      },
      (error) => {
        console.error('❌ Geolocation error:', error)
        let errorMessage = 'Unable to retrieve location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.'
            break
          default:
            errorMessage = 'An unknown error occurred while retrieving location.'
        }
        
        setState(prev => ({
          ...prev,
          location: null,
          isLoading: false,
          error: errorMessage
        }))
      },
      options
    )
  }

  const clearLocation = () => {
    setState(prev => ({
      ...prev,
      location: null,
      error: null
    }))
  }

  return {
    ...state,
    getCurrentLocation,
    clearLocation
  }
} 