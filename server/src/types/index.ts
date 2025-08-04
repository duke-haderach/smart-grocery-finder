export interface GroceryStore {
  id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  latitude: number;
  longitude: number;
  distance: number; // in miles
  priceScore: number; // 1-10 reputation score for affordability (10 = typically budget-friendly)
  healthScore: number; // 1-10 (10 = healthiest)
  rating: number; // 1-5 stars
  hours: StoreHours;
  categories: string[];
}

export interface StoreHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface GroceryItem {
  name: string;
  category: string;
  avgPrice: number;
}

export interface SearchRequest {
  zipcode: string;
  item: string;
}

export interface SearchResult {
  shortest: GroceryStore;
  healthiest: GroceryStore;
  budgetFriendly: GroceryStore;
  searchedItem: string;
  userLocation: {
    latitude: number;
    longitude: number;
    zipcode: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  zipcode: string;
  city?: string;
  state?: string;
} 