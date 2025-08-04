import axios from 'axios';
// Google Places API service for finding grocery stores
export class PlacesService {
    constructor() {
        this.baseUrl = 'https://maps.googleapis.com/maps/api/place';
        // Temporarily hardcode the API key for testing
        this.apiKey = 'AIzaSyACUJGdxBppZxr6SMBEfxbXzbgb5n65Pm0';
        if (!this.apiKey) {
            console.warn('Google Places API key not found. Using mock data only.');
        }
        else {
            console.log('✅ Google Places API key loaded successfully');
        }
    }
    // Search for grocery stores near a location
    async searchGroceryStores(userLocation, radiusMeters = 25000) {
        if (!this.apiKey) {
            console.warn('No API key available, returning empty results');
            return [];
        }
        try {
            console.log(`🔍 Searching for grocery stores near ${userLocation.latitude}, ${userLocation.longitude}`);
            // Search for ALL store types that might sell groceries
            const storeTypes = [
                'grocery_or_supermarket',
                'supermarket',
                'food',
                'store',
                'department_store',
                'general_contractor',
                'establishment',
                'point_of_interest' // Sometimes used for major retailers
            ];
            const allResults = [];
            const seenPlaceIds = new Set();
            // Search with each type to get comprehensive results
            for (const storeType of storeTypes) {
                try {
                    console.log(`🔍 Searching for type: ${storeType}`);
                    const response = await axios.get(`${this.baseUrl}/nearbysearch/json`, {
                        params: {
                            location: `${userLocation.latitude},${userLocation.longitude}`,
                            radius: radiusMeters,
                            type: storeType,
                            key: this.apiKey,
                            language: 'en'
                        },
                        timeout: 10000
                    });
                    if (response.data.status === 'OK' && response.data.results) {
                        // Filter out duplicates and only keep food-related places
                        const filteredResults = response.data.results.filter((place) => {
                            if (seenPlaceIds.has(place.place_id)) {
                                return false;
                            }
                            // Include ALL stores that sell groceries
                            const name = (place.name || '').toLowerCase();
                            const types = place.types || [];
                            // First, exclude obvious non-grocery places
                            const isExcluded = name.includes('casino') ||
                                name.includes('hotel') ||
                                name.includes('restaurant') ||
                                name.includes('bar') ||
                                name.includes('gas station') ||
                                name.includes('bookstore') ||
                                name.includes('mall') ||
                                name.includes('outlet') ||
                                name.includes('fashion') ||
                                name.includes('jewelry') ||
                                name.includes('bank') ||
                                name.includes('pharmacy') && !name.includes('grocery') ||
                                types.includes('casino') ||
                                types.includes('lodging') ||
                                types.includes('restaurant') ||
                                types.includes('bar') ||
                                types.includes('gas_station') ||
                                types.includes('book_store') ||
                                types.includes('shopping_mall') ||
                                types.includes('jewelry_store') ||
                                types.includes('bank');
                            if (isExcluded) {
                                console.log(`❌ Excluded non-grocery place: ${place.name} (${place.types?.join(', ')})`);
                                return false;
                            }
                            const isGroceryStore = 
                            // Traditional grocery types
                            types.includes('grocery_or_supermarket') ||
                                types.includes('supermarket') ||
                                // Only include 'food' type if it has grocery-related name
                                (types.includes('food') && (name.includes('market') ||
                                    name.includes('grocery') ||
                                    name.includes('supermarket') ||
                                    name.includes('fresh') && (name.includes('market') || name.includes('thyme')))) ||
                                // Grocery-related keywords (more specific)
                                name.includes('grocery') ||
                                name.includes('supermarket') ||
                                name.includes('supercenter') ||
                                // Major chains with groceries
                                name.includes('walmart') ||
                                name.includes('target') ||
                                name.includes('super target') ||
                                name.includes('meijer') ||
                                name.includes('fred meyer') ||
                                name.includes('k-mart') ||
                                name.includes('kmart') ||
                                // Traditional grocery chains
                                name.includes('whole foods') ||
                                name.includes('trader joe') ||
                                name.includes('aldi') ||
                                name.includes('kroger') ||
                                name.includes('safeway') ||
                                name.includes('publix') ||
                                name.includes('wegmans') ||
                                name.includes('giant') ||
                                name.includes('stop & shop') ||
                                name.includes('shoprite') ||
                                name.includes('king soopers') ||
                                name.includes('city market') ||
                                name.includes('smith\'s') ||
                                name.includes('ralphs') ||
                                name.includes('vons') ||
                                name.includes('albertsons') ||
                                name.includes('jewel') ||
                                name.includes('acme') ||
                                name.includes('shaw\'s') ||
                                name.includes('star market') ||
                                // Warehouse clubs
                                name.includes('costco') ||
                                name.includes('sam\'s club') ||
                                name.includes('bj\'s') ||
                                // Regional chains
                                name.includes('heb') ||
                                name.includes('h-e-b') ||
                                name.includes('harris teeter') ||
                                name.includes('food lion') ||
                                name.includes('giant eagle') ||
                                name.includes('winn-dixie') ||
                                name.includes('piggly wiggly') ||
                                name.includes('ingles') ||
                                name.includes('bi-lo') ||
                                name.includes('food 4 less') ||
                                name.includes('winco') ||
                                name.includes('festival foods') ||
                                name.includes('hy-vee') ||
                                name.includes('schnucks') ||
                                name.includes('dierbergs') ||
                                name.includes('straub') ||
                                // Health/Natural food stores
                                name.includes('fresh thyme') ||
                                name.includes('sprouts') ||
                                name.includes('earth fare') ||
                                name.includes('natural grocers') ||
                                name.includes('vitamin cottage') ||
                                name.includes('mother\'s market') ||
                                name.includes('fresh market') ||
                                // International chains
                                name.includes('save mart') ||
                                name.includes('lucky') ||
                                name.includes('foodmaxx') ||
                                name.includes('nob hill') ||
                                // Discount chains
                                name.includes('save-a-lot') ||
                                name.includes('price chopper') ||
                                name.includes('market basket') ||
                                name.includes('winco foods') ||
                                // Any store explicitly tagged as selling food
                                (types.includes('department_store') && (name.includes('walmart') ||
                                    name.includes('target') ||
                                    name.includes('meijer') ||
                                    name.includes('fred meyer')));
                            if (isGroceryStore) {
                                console.log(`✅ Included grocery store: ${place.name} at ${place.geometry?.location?.lat}, ${place.geometry?.location?.lng}`);
                                seenPlaceIds.add(place.place_id);
                                return true;
                            }
                            return false;
                        });
                        console.log(`📍 Found ${filteredResults.length} unique ${storeType} places`);
                        allResults.push(...filteredResults);
                    }
                }
                catch (typeError) {
                    console.warn(`⚠️ Error searching for ${storeType}:`, typeError.message);
                }
            }
            console.log(`📡 Combined search found ${allResults.length} total places`);
            console.log(`🏪 Unique place IDs: ${seenPlaceIds.size}`);
            if (allResults.length > 0) {
                return this.convertPlacesToGroceryStores(allResults, userLocation);
            }
            else {
                console.warn('⚠️ No grocery stores found in any search');
            }
            return [];
        }
        catch (error) {
            console.error('❌ Google Places API error:', error.message);
            if (error.response) {
                console.error('❌ Response status:', error.response.status);
                console.error('❌ Response data:', error.response.data);
            }
            return [];
        }
    }
    // Convert Google Places API response to our GroceryStore format
    convertPlacesToGroceryStores(places, userLocation) {
        return places.map((place, index) => {
            // Calculate distance using Haversine formula
            const distance = this.calculateDistance(userLocation.latitude, userLocation.longitude, place.geometry.location.lat, place.geometry.location.lng);
            // Determine store category and scores based on name and types
            const storeInfo = this.analyzeStoreType(place.name || '', place.types || []);
            // Generate opening hours in our format (legacy API has different format)
            const hours = this.convertOpeningHours(place.opening_hours);
            return {
                id: place.place_id,
                name: place.name || 'Unknown Store',
                address: place.formatted_address || place.vicinity || '',
                phone: place.formatted_phone_number || undefined,
                website: place.website || undefined,
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
                distance: Math.round(distance * 10) / 10,
                priceScore: storeInfo.priceScore,
                healthScore: storeInfo.healthScore,
                rating: place.rating || 3.5,
                hours,
                categories: storeInfo.categories
            };
        });
    }
    // Analyze store type and assign scores based on name and types
    analyzeStoreType(name, types) {
        const nameLower = name.toLowerCase();
        const categories = [];
        let priceScore = 5; // Default
        let healthScore = 5; // Default
        // Organic/Health stores - high health score, lower price score
        if (nameLower.includes('whole foods') || nameLower.includes('organic') ||
            nameLower.includes('natural') || nameLower.includes('fresh market') ||
            nameLower.includes('fresh thyme') || nameLower.includes('sprouts') ||
            nameLower.includes('earth fare') || nameLower.includes('mother\'s market') ||
            nameLower.includes('natural grocers') || nameLower.includes('vitamin cottage')) {
            healthScore = 9;
            priceScore = 4;
            categories.push('Organic', 'Natural Foods', 'Fresh Produce');
        }
        // Premium stores
        else if (nameLower.includes('harris teeter') || nameLower.includes('publix') ||
            nameLower.includes('wegmans') || nameLower.includes('fresh market')) {
            healthScore = 8;
            priceScore = 5;
            categories.push('Premium', 'Fresh Produce');
        }
        // Budget stores - high price score, moderate health score
        else if (nameLower.includes('walmart') || nameLower.includes('aldi') ||
            nameLower.includes('food 4 less') || nameLower.includes('winco') ||
            nameLower.includes('price chopper') || nameLower.includes('save-a-lot') ||
            nameLower.includes('winco foods') || nameLower.includes('market basket')) {
            healthScore = 6;
            priceScore = 9;
            categories.push('Discount', 'Budget-Friendly', 'Bulk Shopping');
        }
        // Big box stores with groceries - balanced scores, wide selection
        else if (nameLower.includes('target') || nameLower.includes('super target') ||
            nameLower.includes('meijer') || nameLower.includes('fred meyer') ||
            nameLower.includes('k-mart') || nameLower.includes('kmart')) {
            healthScore = 7;
            priceScore = 7;
            categories.push('Department Store', 'One-Stop Shopping', 'Groceries & More');
        }
        // Warehouse stores
        else if (nameLower.includes('costco') || nameLower.includes('sam\'s club') ||
            nameLower.includes('bj\'s')) {
            healthScore = 7;
            priceScore = 8;
            categories.push('Warehouse', 'Bulk Shopping', 'Membership');
        }
        // Major chains - balanced scores
        else if (nameLower.includes('kroger') || nameLower.includes('safeway') ||
            nameLower.includes('giant') || nameLower.includes('stop & shop') ||
            nameLower.includes('king soopers') || nameLower.includes('ralph') ||
            nameLower.includes('albertsons') || nameLower.includes('vons') ||
            nameLower.includes('jewel') || nameLower.includes('acme') ||
            nameLower.includes('shaw\'s') || nameLower.includes('star market') ||
            nameLower.includes('smith\'s') || nameLower.includes('city market') ||
            nameLower.includes('food lion') || nameLower.includes('giant eagle') ||
            nameLower.includes('winn-dixie') || nameLower.includes('hy-vee') ||
            nameLower.includes('schnucks') || nameLower.includes('festival foods')) {
            healthScore = 7;
            priceScore = 6;
            categories.push('Supermarket', 'Full Service');
        }
        // Regional premium chains
        else if (nameLower.includes('h-e-b') || nameLower.includes('heb') ||
            nameLower.includes('dierbergs') || nameLower.includes('straub')) {
            healthScore = 8;
            priceScore = 6;
            categories.push('Regional Chain', 'Fresh Produce', 'Local Favorites');
        }
        // Convenience/smaller stores
        else if (types.includes('convenience_store') || nameLower.includes('corner') ||
            nameLower.includes('market') && !nameLower.includes('super')) {
            healthScore = 5;
            priceScore = 4;
            categories.push('Convenience', 'Quick Shopping');
        }
        // Default supermarket
        else {
            healthScore = 6;
            priceScore = 6;
            categories.push('Supermarket', 'Grocery Store');
        }
        return { priceScore, healthScore, categories };
    }
    // Convert Google Places opening hours to our format
    convertOpeningHours(openingHours) {
        const defaultHours = {
            monday: 'Hours not available',
            tuesday: 'Hours not available',
            wednesday: 'Hours not available',
            thursday: 'Hours not available',
            friday: 'Hours not available',
            saturday: 'Hours not available',
            sunday: 'Hours not available'
        };
        if (!openingHours || !openingHours.weekdayDescriptions) {
            return defaultHours;
        }
        const dayMap = {
            'Monday': 'monday',
            'Tuesday': 'tuesday',
            'Wednesday': 'wednesday',
            'Thursday': 'thursday',
            'Friday': 'friday',
            'Saturday': 'saturday',
            'Sunday': 'sunday'
        };
        const hours = { ...defaultHours };
        openingHours.weekdayDescriptions.forEach((desc) => {
            for (const [day, key] of Object.entries(dayMap)) {
                if (desc.startsWith(day)) {
                    // Extract just the hours part (remove day name and colon)
                    hours[key] = desc.substring(day.length + 2); // +2 for ': '
                    break;
                }
            }
        });
        return hours;
    }
    // Calculate distance between two points using Haversine formula
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 3959; // Earth's radius in miles
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRad(deg) {
        return deg * (Math.PI / 180);
    }
}
