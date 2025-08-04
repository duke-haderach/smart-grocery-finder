import axios from 'axios';
// Cache for zipcode geocoding to reduce API calls
const geocodeCache = new Map();
// Google Geocoding API service
async function geocodeWithGoogle(zipcode) {
    // Temporarily hardcode the API key for testing
    const apiKey = 'AIzaSyACUJGdxBppZxr6SMBEfxbXzbgb5n65Pm0';
    if (!apiKey) {
        console.warn('Google Geocoding API key not found, using fallback data');
        return null;
    }
    else {
        console.log('✅ Google Geocoding API key loaded successfully');
    }
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: zipcode,
                key: apiKey,
                components: 'country:US' // Restrict to US for better results
            },
            timeout: 5000
        });
        if (response.data.status === 'OK' && response.data.results.length > 0) {
            const result = response.data.results[0];
            const location = result.geometry.location;
            // Extract city and state from address components
            let city, state;
            for (const component of result.address_components) {
                if (component.types.includes('locality')) {
                    city = component.long_name;
                }
                if (component.types.includes('administrative_area_level_1')) {
                    state = component.short_name;
                }
            }
            return {
                latitude: location.lat,
                longitude: location.lng,
                zipcode,
                city,
                state
            };
        }
        return null;
    }
    catch (error) {
        console.error('Google Geocoding API error:', error.message);
        return null;
    }
}
export async function geocodeZipcode(zipcode) {
    // Check cache first
    if (geocodeCache.has(zipcode)) {
        return geocodeCache.get(zipcode);
    }
    try {
        // Try Google Geocoding API first
        const googleResult = await geocodeWithGoogle(zipcode);
        if (googleResult) {
            // Cache the result
            geocodeCache.set(zipcode, googleResult);
            return googleResult;
        }
        // Fallback to mock data for common zipcodes
        const mockLocation = getMockLocationForZipcode(zipcode);
        if (mockLocation) {
            geocodeCache.set(zipcode, mockLocation);
            return mockLocation;
        }
        throw new Error(`Failed to geocode zipcode: ${zipcode}`);
    }
    catch (error) {
        console.error('Geocoding error:', error);
        // Final fallback to mock data
        const mockLocation = getMockLocationForZipcode(zipcode);
        if (mockLocation) {
            geocodeCache.set(zipcode, mockLocation);
            return mockLocation;
        }
        throw new Error(`Failed to geocode zipcode: ${zipcode}`);
    }
}
// Enhanced fallback mock data for common zipcodes
function getMockLocationForZipcode(zipcode) {
    const mockData = {
        // Major US Cities
        '10001': { latitude: 40.7505, longitude: -73.9934, zipcode: '10001', city: 'New York', state: 'NY' },
        '90210': { latitude: 34.0901, longitude: -118.4065, zipcode: '90210', city: 'Beverly Hills', state: 'CA' },
        '60601': { latitude: 41.8781, longitude: -87.6298, zipcode: '60601', city: 'Chicago', state: 'IL' },
        '33101': { latitude: 25.7617, longitude: -80.1918, zipcode: '33101', city: 'Miami', state: 'FL' },
        '77001': { latitude: 29.7604, longitude: -95.3698, zipcode: '77001', city: 'Houston', state: 'TX' },
        '85001': { latitude: 33.4484, longitude: -112.0740, zipcode: '85001', city: 'Phoenix', state: 'AZ' },
        '19101': { latitude: 39.9526, longitude: -75.1652, zipcode: '19101', city: 'Philadelphia', state: 'PA' },
        '92101': { latitude: 32.7157, longitude: -117.1611, zipcode: '92101', city: 'San Diego', state: 'CA' },
        '78701': { latitude: 30.2672, longitude: -97.7431, zipcode: '78701', city: 'Austin', state: 'TX' },
        '98101': { latitude: 47.6062, longitude: -122.3321, zipcode: '98101', city: 'Seattle', state: 'WA' },
        // Additional major cities
        '02101': { latitude: 42.3601, longitude: -71.0589, zipcode: '02101', city: 'Boston', state: 'MA' },
        '30301': { latitude: 33.7490, longitude: -84.3880, zipcode: '30301', city: 'Atlanta', state: 'GA' },
        '80201': { latitude: 39.7392, longitude: -104.9903, zipcode: '80201', city: 'Denver', state: 'CO' },
        '97201': { latitude: 45.5152, longitude: -122.6784, zipcode: '97201', city: 'Portland', state: 'OR' },
        '89101': { latitude: 36.1699, longitude: -115.1398, zipcode: '89101', city: 'Las Vegas', state: 'NV' },
        '84101': { latitude: 40.7608, longitude: -111.8910, zipcode: '84101', city: 'Salt Lake City', state: 'UT' },
        '37201': { latitude: 36.1627, longitude: -86.7816, zipcode: '37201', city: 'Nashville', state: 'TN' },
        '32801': { latitude: 28.5383, longitude: -81.3792, zipcode: '32801', city: 'Orlando', state: 'FL' },
        '28201': { latitude: 35.2271, longitude: -80.8431, zipcode: '28201', city: 'Charlotte', state: 'NC' },
        '63101': { latitude: 38.6270, longitude: -90.1994, zipcode: '63101', city: 'St. Louis', state: 'MO' },
        '63368': { latitude: 38.8108, longitude: -90.7143, zipcode: '63368', city: 'St. Peters', state: 'MO' }
    };
    return mockData[zipcode] || null;
}
