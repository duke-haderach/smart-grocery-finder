import { getDatabase } from './setup.js';
export async function getStoresFromDatabase() {
    const db = getDatabase();
    const stores = db.prepare(`
    SELECT 
      id, name, address, phone, website, latitude, longitude,
      price_score, health_score, rating, categories, hours
    FROM stores
    ORDER BY name
  `).all();
    return stores.map(store => ({
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
    }));
}
export async function getStoreById(id) {
    const db = getDatabase();
    const store = db.prepare(`
    SELECT 
      id, name, address, phone, website, latitude, longitude,
      price_score, health_score, rating, categories, hours
    FROM stores
    WHERE id = ?
  `).get(id);
    if (!store)
        return null;
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
    };
}
