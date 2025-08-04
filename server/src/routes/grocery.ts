import { Router } from 'express'
import { z } from 'zod'
import { searchStores, getStoreDetails } from '../services/storeService.js'
import { searchZipcodes } from '../services/zipcodeService.js'
import { searchAddresses, getAddressDetails } from '../services/addressService.js'
import type { SearchRequest, ApiResponse, SearchResult } from '../types/index.js'

const router = Router()

// Validation schemas
const searchRequestSchema = z.object({
  zipcode: z.string().min(3, 'Zipcode must be at least 3 characters').max(10, 'Zipcode too long'),
  item: z.string().min(1, 'Item name is required').max(100, 'Item name too long')
})

const searchQuerySchema = z.object({
  location: z.string().min(3, 'Location must be at least 3 characters').max(200, 'Location too long'),
  item: z.string().min(1, 'Item name is required').max(100, 'Item name too long')
})

const zipcodeQuerySchema = z.object({
  q: z.string().min(1, 'Query is required').max(50, 'Query too long')
})

const addressQuerySchema = z.object({
  q: z.string().min(2, 'Query must be at least 2 characters').max(100, 'Query too long')
})

const placeIdSchema = z.object({
  placeId: z.string().min(1, 'Place ID is required')
})

// Search for grocery stores (GET endpoint for frontend)
router.get('/search', async (req, res) => {
  try {
    const validation = searchQuerySchema.safeParse(req.query)
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: validation.error.issues
      })
    }
    
    const { location, item } = validation.data
    // Extract zipcode from location string or use the location as is
    const zipcode = location.match(/\b\d{5}\b/)?.[0] || location
    const searchRequest: SearchRequest = { zipcode, item }
    
    console.log(`🔍 Searching for "${item}" in location "${location}" (using zipcode: ${zipcode})`)
    
    const result = await searchStores(searchRequest)
    
    console.log(`✅ Search successful, found ${result.shortest ? 'results' : 'no results'}`)
    
    const response: ApiResponse<SearchResult> = {
      success: true,
      data: result
    }
    
    res.json(response)
  } catch (error) {
    console.error('❌ Search error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to search stores',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Search for grocery stores (POST endpoint - legacy)
router.post('/search', async (req, res) => {
  try {
    const validation = searchRequestSchema.safeParse(req.body)
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: validation.error.issues
      })
    }
    
    const { zipcode, item } = validation.data
    const searchRequest: SearchRequest = { zipcode, item }
    
    console.log(`🔍 Searching for "${item}" in zipcode ${zipcode}`)
    
    const result = await searchStores(searchRequest)
    
    console.log(`✅ Search successful, found ${result.shortest ? 'results' : 'no results'}`)
    
    const response: ApiResponse<SearchResult> = {
      success: true,
      data: result
    }
    
    res.json(response)
  } catch (error) {
    console.error('Search error details:', error)
    
    // Return more detailed error information for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    res.status(500).json({
      success: false,
      error: 'Failed to search stores',
      details: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
    })
  }
})

// Zipcode autocomplete endpoint
router.get('/zipcodes', async (req, res) => {
  try {
    const validation = zipcodeQuerySchema.safeParse(req.query)
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameter',
        details: validation.error.issues
      })
    }
    
    const { q: query } = validation.data
    console.log(`🔍 Zipcode autocomplete search: "${query}"`)
    
    const suggestions = await searchZipcodes(query)
    
    console.log(`✅ Found ${suggestions.length} zipcode suggestions`)
    
    res.json({
      success: true,
      data: suggestions
    })
  } catch (error) {
    console.error('Zipcode search error:', error)
    
    res.status(500).json({
      success: false,
      error: 'Failed to search zipcodes'
    })
  }
})

// Address autocomplete endpoint
router.get('/addresses', async (req, res) => {
  try {
    const validation = addressQuerySchema.safeParse(req.query)
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameter',
        details: validation.error.issues
      })
    }
    
    const { q: query } = validation.data
    console.log(`🔍 Address autocomplete search: "${query}"`)
    
    const suggestions = await searchAddresses(query)
    
    console.log(`✅ Found ${suggestions.length} address suggestions`)
    
    res.json({
      success: true,
      data: suggestions
    })
  } catch (error) {
    console.error('Address search error:', error)
    
    res.status(500).json({
      success: false,
      error: 'Failed to search addresses'
    })
  }
})

// Address details endpoint
router.get('/address-details', async (req, res) => {
  try {
    const validation = placeIdSchema.safeParse(req.query)
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid place ID parameter',
        details: validation.error.issues
      })
    }
    
    const { placeId } = validation.data
    console.log(`🔍 Fetching address details for place: ${placeId}`)
    
    const addressDetails = await getAddressDetails(placeId)
    
    if (!addressDetails) {
      return res.status(404).json({
        success: false,
        error: 'Address details not found'
      })
    }
    
    console.log(`✅ Address details retrieved for: ${addressDetails.address}`)
    
    res.json({
      success: true,
      data: addressDetails
    })
  } catch (error) {
    console.error('Address details error:', error)
    
    res.status(500).json({
      success: false,
      error: 'Failed to get address details'
    })
  }
})

// Get store details by ID
router.get('/store/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params
    
    if (!storeId) {
      return res.status(400).json({
        success: false,
        error: 'Store ID is required'
      })
    }
    
    const store = await getStoreDetails(storeId)
    
    if (!store) {
      return res.status(404).json({
        success: false,
        error: 'Store not found'
      })
    }
    
    const response: ApiResponse<any> = {
      success: true,
      data: store
    }
    
    res.json(response)
  } catch (error) {
    console.error('Store details error:', error)
    
    res.status(500).json({
      success: false,
      error: 'Failed to get store details'
    })
  }
})

export { router as groceryRoutes } 