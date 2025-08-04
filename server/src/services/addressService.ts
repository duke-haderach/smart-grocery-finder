import axios from 'axios'

export interface AddressResult {
  placeId: string
  description: string
  mainText: string
  secondaryText: string
  types: string[]
}

export interface AddressDetails {
  address: string
  city: string
  state: string
  zipcode: string
  country: string
  latitude: number
  longitude: number
}

// Google Places API Autocomplete for address suggestions
export async function searchAddresses(query: string): Promise<AddressResult[]> {
  // Use the same API key from environment
  const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyACUJGdxBppZxr6SMBEfxbXzbgb5n65Pm0'
  
  if (!apiKey) {
    console.warn('Google API key not found for address autocomplete')
    return []
  }

  try {
    console.log(`🔍 Searching addresses with Google API for: "${query}"`)
    
    // Use Google Places API Autocomplete for addresses
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
      params: {
        input: query,
        types: 'address', // Focus on addresses
        components: 'country:us', // Restrict to US
        key: apiKey
      },
      timeout: 5000
    })

    if (response.data.status === 'OK') {
      const suggestions: AddressResult[] = response.data.predictions.slice(0, 8).map((prediction: any) => ({
        placeId: prediction.place_id,
        description: prediction.description,
        mainText: prediction.structured_formatting?.main_text || prediction.description,
        secondaryText: prediction.structured_formatting?.secondary_text || '',
        types: prediction.types || []
      }))
      
      console.log(`✅ Found ${suggestions.length} addresses from Google API`)
      return suggestions
    }
    
    console.log(`⚠️ Google API status: ${response.data.status}`)
    return []
  } catch (error: any) {
    console.error('Google Places Address Autocomplete error:', error.message)
    return []
  }
}

// Get detailed address information using Place Details API
export async function getAddressDetails(placeId: string): Promise<AddressDetails | null> {
  const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyACUJGdxBppZxr6SMBEfxbXzbgb5n65Pm0'
  
  if (!apiKey) {
    console.warn('Google API key not found for address details')
    return null
  }

  try {
    console.log(`🔍 Fetching address details for place ID: ${placeId}`)
    
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        fields: 'address_components,formatted_address,geometry',
        key: apiKey
      },
      timeout: 5000
    })

    if (response.data.status === 'OK') {
      const place = response.data.result
      const components = place.address_components || []
      
      // Extract address components
      let streetNumber = ''
      let route = ''
      let city = ''
      let state = ''
      let zipcode = ''
      let country = ''
      
      for (const component of components) {
        const types = component.types
        
        if (types.includes('street_number')) {
          streetNumber = component.long_name
        }
        if (types.includes('route')) {
          route = component.long_name
        }
        if (types.includes('locality')) {
          city = component.long_name
        }
        if (types.includes('administrative_area_level_1')) {
          state = component.short_name
        }
        if (types.includes('postal_code')) {
          zipcode = component.long_name
        }
        if (types.includes('country')) {
          country = component.short_name
        }
      }
      
      // Construct full address
      const address = `${streetNumber} ${route}`.trim() || place.formatted_address
      
      const addressDetails: AddressDetails = {
        address,
        city,
        state,
        zipcode,
        country,
        latitude: place.geometry?.location?.lat || 0,
        longitude: place.geometry?.location?.lng || 0
      }
      
      console.log(`✅ Address details parsed: ${address}, ${city}, ${state} ${zipcode}`)
      return addressDetails
    }
    
    console.log(`⚠️ Google Place Details API status: ${response.data.status}`)
    return null
  } catch (error: any) {
    console.error('Google Place Details error:', error.message)
    return null
  }
} 