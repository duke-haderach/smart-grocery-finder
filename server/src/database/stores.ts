import { getDatabase } from './setup.js'
import type { GroceryStore } from '../types/index.js'

export async function getStoresFromDatabase(): Promise<GroceryStore[]> {
  const db = getDatabase()
  
  const stores = db.prepare(`
    SELECT 
      id, name, address, phone, website, latitude, longitude,
      price_score, health_score, rating, categories, hours
    FROM stores
    ORDER BY name
  `).all() as any[]

  return stores.map(store => ({
    id: store.id,
    name: store.name,
    address: store.address,
    phone: store.phone,
    website: store.website,
    latitude: store.latitude,
    longitude: store.longitude,
    distance: 0, // Will be calculated in service
    priceScore: store.price_score,
    healthScore: store.health_score,
    rating: store.rating,
    categories: JSON.parse(store.categories),
    hours: JSON.parse(store.hours)
  }))
}

export async function getStoreById(id: string): Promise<GroceryStore | null> {
  const db = getDatabase()
  
  const store = db.prepare(`
    SELECT 
      id, name, address, phone, website, latitude, longitude,
      price_score, health_score, rating, categories, hours
    FROM stores
    WHERE id = ?
  `).get(id) as any

  if (!store) return null

  return {
    id: store.id,
    name: store.name,
    address: store.address,
    phone: store.phone,
    website: store.website,
    latitude: store.latitude,
    longitude: store.longitude,
    distance: 0,
    priceScore: store.price_score,
    healthScore: store.health_score,
    rating: store.rating,
    categories: JSON.parse(store.categories),
    hours: JSON.parse(store.hours)
  }
} 