import { geocodeZipcode } from './geocodeService'
import { PlacesService } from './placesService'
import type { SearchRequest, SearchResult, GroceryStore, GeocodeResult } from '../types/index'

const placesService = new PlacesService()

export async function searchStores(request: SearchRequest): Promise<SearchResult> {
  const { zipcode, item } = request
  
  try {
    // Get user location from zipcode
    const userLocation = await geocodeZipcode(zipcode)
    console.log(`📍 User location: ${userLocation.latitude}, ${userLocation.longitude}`)
    
    // Get real-time data from Google Places API
    let stores = await placesService.searchGroceryStores(userLocation)
    
    // If no stores from API, add mock fallback data
    if (stores.length === 0) {
      console.log('No stores from Google Places API, using mock data')
      stores = getMockStores(userLocation)
    }
    
    console.log(`🏪 Generated ${stores.length} stores:`)
    stores.forEach((store, i) => {
      console.log(`  ${i+1}. ${store.name}: ${store.distance} miles away`)
    })
    
    // For now, just use all generated stores (they're mock data anyway)
    const nearbyStores = stores
    
    console.log(`✅ Using ${nearbyStores.length} stores`)
    
    if (nearbyStores.length === 0) {
      throw new Error('No stores found')
    }
    
        // Find recommendations based on different criteria
    const shortest = findShortestStore(nearbyStores)
    const healthiest = findHealthiestStore(nearbyStores)
    const budgetFriendly = findBudgetFriendlyStore(nearbyStores)

    return {
      shortest,
      healthiest,
      budgetFriendly,
      searchedItem: item,
      userLocation
    }
  } catch (error) {
    console.error('Error in searchStores:', error)
    throw error
  }
}

export async function getStoreDetails(storeId: string): Promise<GroceryStore | null> {
  // For now, return null - could implement Google Places details lookup in the future
  return null
}

// Enhanced store finding algorithms

function findShortestStore(stores: GroceryStore[]): GroceryStore {
  return stores.reduce((closest, current) => 
    current.distance < closest.distance ? current : closest
  )
}

function findHealthiestStore(stores: GroceryStore[]): GroceryStore {
  return stores.reduce((healthiest, current) => {
    // Enhanced scoring algorithm
    // Weight: health score (60%), rating (25%), freshness bonus (10%), distance penalty (5%)
    const healthiestScore = (healthiest.healthScore * 0.6) + 
                           (healthiest.rating * 0.25) + 
                           (getHealthBonus(healthiest) * 0.1) - 
                           (healthiest.distance * 0.05)
    
    const currentScore = (current.healthScore * 0.6) + 
                        (current.rating * 0.25) + 
                        (getHealthBonus(current) * 0.1) - 
                        (current.distance * 0.05)
    
    return currentScore > healthiestScore ? current : healthiest
  })
}

function findBudgetFriendlyStore(stores: GroceryStore[]): GroceryStore {
  return stores.reduce((budgetFriendly, current) => {
    // Enhanced scoring algorithm based on store reputation for affordability
    // Weight: price reputation (70%), rating (15%), distance penalty (10%), convenience bonus (5%)
    const budgetFriendlyScore = (budgetFriendly.priceScore * 0.7) + 
                               (budgetFriendly.rating * 0.15) - 
                               (budgetFriendly.distance * 0.1) + 
                               (getPriceBonus(budgetFriendly) * 0.05)
    
    const currentScore = (current.priceScore * 0.7) + 
                        (current.rating * 0.15) - 
                        (current.distance * 0.1) + 
                        (getPriceBonus(current) * 0.05)
    
    return currentScore > budgetFriendlyScore ? current : budgetFriendly
  })
}

// Bonus points for health-focused stores
function getHealthBonus(store: GroceryStore): number {
  const healthCategories = ['Organic', 'Natural Foods', 'Fresh Produce', 'Premium']
  const storeCategories = store.categories.map(cat => cat.toLowerCase())
  
  let bonus = 0
  if (storeCategories.some(cat => cat.includes('organic'))) bonus += 2
  if (storeCategories.some(cat => cat.includes('natural'))) bonus += 1.5
  if (storeCategories.some(cat => cat.includes('fresh'))) bonus += 1
  if (storeCategories.some(cat => cat.includes('premium'))) bonus += 0.5
  
  return Math.min(bonus, 3) // Cap at 3 bonus points
}

// Bonus points for budget-friendly stores
function getPriceBonus(store: GroceryStore): number {
  const budgetCategories = ['Discount', 'Budget-Friendly', 'Bulk Shopping', 'Warehouse']
  const storeCategories = store.categories.map(cat => cat.toLowerCase())
  
  let bonus = 0
  if (storeCategories.some(cat => cat.includes('discount'))) bonus += 2
  if (storeCategories.some(cat => cat.includes('budget'))) bonus += 1.5
  if (storeCategories.some(cat => cat.includes('bulk'))) bonus += 1
  if (storeCategories.some(cat => cat.includes('warehouse'))) bonus += 1
  
  return Math.min(bonus, 3) // Cap at 3 bonus points
}

// Calculate distance using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10 // Round to 1 decimal place
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Mock store data for fallback when API is not available
function getMockStores(userLocation: GeocodeResult): GroceryStore[] {
  const mockStores = [
    {
      id: 'mock-1',
      name: 'Fresh Market',
      address: '123 Main St',
      latitude: userLocation.latitude + 0.001,  // Much closer - about 0.07 miles
      longitude: userLocation.longitude + 0.001,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        userLocation.latitude + 0.001,
        userLocation.longitude + 0.001
      ),
      rating: 4.5,
      priceScore: 7,
      healthScore: 8,
      categories: ['Grocery', 'Organic', 'Fresh Produce'],
      hours: {
        monday: '7:00 AM - 10:00 PM',
        tuesday: '7:00 AM - 10:00 PM',
        wednesday: '7:00 AM - 10:00 PM',
        thursday: '7:00 AM - 10:00 PM',
        friday: '7:00 AM - 10:00 PM',
        saturday: '7:00 AM - 10:00 PM',
        sunday: '8:00 AM - 9:00 PM'
      },
      phone: '(555) 123-4567',
      website: 'https://freshmarket.com'
    },
    {
      id: 'mock-2',
      name: 'Budget Grocery',
      address: '456 Oak Ave',
      latitude: userLocation.latitude - 0.002,  // About 0.14 miles
      longitude: userLocation.longitude + 0.002,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        userLocation.latitude - 0.002,
        userLocation.longitude + 0.002
      ),
      rating: 4.0,
      priceScore: 9,
      healthScore: 6,
      categories: ['Grocery', 'Discount', 'Budget-Friendly'],
      hours: {
        monday: '6:00 AM - 11:00 PM',
        tuesday: '6:00 AM - 11:00 PM',
        wednesday: '6:00 AM - 11:00 PM',
        thursday: '6:00 AM - 11:00 PM',
        friday: '6:00 AM - 11:00 PM',
        saturday: '6:00 AM - 11:00 PM',
        sunday: '7:00 AM - 10:00 PM'
      },
      phone: '(555) 987-6543',
      website: 'https://budgetgrocery.com'
    },
    {
      id: 'mock-3',
      name: 'Premium Foods',
      address: '789 Pine Rd',
      latitude: userLocation.latitude + 0.003,  // About 0.21 miles
      longitude: userLocation.longitude - 0.001,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        userLocation.latitude + 0.003,
        userLocation.longitude - 0.001
      ),
      rating: 4.8,
      priceScore: 5,
      healthScore: 9,
      categories: ['Grocery', 'Premium', 'Organic', 'Natural Foods'],
      hours: {
        monday: '8:00 AM - 9:00 PM',
        tuesday: '8:00 AM - 9:00 PM',
        wednesday: '8:00 AM - 9:00 PM',
        thursday: '8:00 AM - 9:00 PM',
        friday: '8:00 AM - 9:00 PM',
        saturday: '8:00 AM - 9:00 PM',
        sunday: '9:00 AM - 8:00 PM'
      },
      phone: '(555) 456-7890',
      website: 'https://premiumfoods.com'
    }
  ]
  
  return mockStores
} 