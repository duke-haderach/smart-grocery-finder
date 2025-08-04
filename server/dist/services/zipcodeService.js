import axios from 'axios';
// Google Places API Autocomplete for real-time zipcode suggestions
async function searchZipcodesWithGoogle(query) {
    // Use the same API key from environment
    const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyACUJGdxBppZxr6SMBEfxbXzbgb5n65Pm0';
    if (!apiKey) {
        console.warn('Google API key not found for zipcode autocomplete');
        return [];
    }
    try {
        // Use Google Places API Autocomplete with postal_code type
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
            params: {
                input: query,
                types: 'postal_code',
                components: 'country:us',
                key: apiKey
            },
            timeout: 5000
        });
        if (response.data.status === 'OK') {
            const suggestions = [];
            for (const prediction of response.data.predictions.slice(0, 8)) {
                // Extract zipcode from the structured data
                const zipcode = extractZipcodeFromPrediction(prediction);
                const location = await getLocationDetails(prediction.place_id, apiKey);
                if (zipcode && location) {
                    suggestions.push({
                        zipcode,
                        city: location.city,
                        state: location.state,
                        area: location.area
                    });
                }
            }
            return suggestions;
        }
        return [];
    }
    catch (error) {
        console.error('Google Places Autocomplete error:', error.message);
        return [];
    }
}
// Extract zipcode from Google Places prediction
function extractZipcodeFromPrediction(prediction) {
    // Look for zipcode in structured_formatting or description
    const description = prediction.description;
    const zipcodeMatch = description.match(/\b\d{5}(-\d{4})?\b/);
    return zipcodeMatch ? zipcodeMatch[0] : null;
}
// Get detailed location information using Place Details API
async function getLocationDetails(placeId, apiKey) {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                place_id: placeId,
                fields: 'address_components',
                key: apiKey
            },
            timeout: 3000
        });
        if (response.data.status === 'OK') {
            const components = response.data.result.address_components;
            let city = '', state = '', area = '';
            for (const component of components) {
                if (component.types.includes('locality')) {
                    city = component.long_name;
                }
                if (component.types.includes('administrative_area_level_1')) {
                    state = component.short_name;
                }
                if (component.types.includes('sublocality') || component.types.includes('neighborhood')) {
                    area = component.long_name;
                }
            }
            return { city, state, area };
        }
        return null;
    }
    catch (error) {
        console.error('Google Place Details error:', error);
        return null;
    }
}
// Fallback with a small set of popular zipcodes for offline/error scenarios
const POPULAR_ZIPCODES = [
    { zipcode: '10001', city: 'New York', state: 'NY', area: 'Manhattan' },
    { zipcode: '90210', city: 'Beverly Hills', state: 'CA' },
    { zipcode: '60601', city: 'Chicago', state: 'IL', area: 'Loop' },
    { zipcode: '33101', city: 'Miami', state: 'FL', area: 'Downtown' },
    { zipcode: '77001', city: 'Houston', state: 'TX', area: 'Downtown' },
    { zipcode: '85001', city: 'Phoenix', state: 'AZ', area: 'Downtown' },
    { zipcode: '19101', city: 'Philadelphia', state: 'PA', area: 'Center City' },
    { zipcode: '02101', city: 'Boston', state: 'MA', area: 'Downtown' },
    { zipcode: '98101', city: 'Seattle', state: 'WA', area: 'Downtown' },
    { zipcode: '30301', city: 'Atlanta', state: 'GA', area: 'Downtown' },
    { zipcode: '63101', city: 'St. Louis', state: 'MO', area: 'Downtown' },
    { zipcode: '63376', city: 'St. Charles', state: 'MO' }
];
// Search zipcodes with Google API first, fallback to popular list
export async function searchZipcodes(query) {
    if (!query || query.length < 1) {
        return [];
    }
    console.log(`🔍 Searching zipcodes with Google API for: "${query}"`);
    // Try Google Places API first
    const googleResults = await searchZipcodesWithGoogle(query);
    if (googleResults.length > 0) {
        console.log(`✅ Found ${googleResults.length} zipcodes from Google API`);
        return googleResults;
    }
    // Fallback to popular zipcodes if Google API fails or returns no results
    console.log(`⚠️ Google API returned no results, using fallback search`);
    const normalizedQuery = query.toLowerCase().trim();
    const fallbackResults = POPULAR_ZIPCODES
        .filter(location => {
        return (location.zipcode.startsWith(query) ||
            location.city.toLowerCase().includes(normalizedQuery) ||
            location.state.toLowerCase() === normalizedQuery ||
            (location.area && location.area.toLowerCase().includes(normalizedQuery)));
    })
        .slice(0, 6);
    console.log(`✅ Found ${fallbackResults.length} zipcodes from fallback`);
    return fallbackResults;
}
