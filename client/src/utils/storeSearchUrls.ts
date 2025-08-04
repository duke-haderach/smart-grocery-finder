// Store website search URL generators
interface StoreSearchConfig {
  searchUrl: string
  paramName: string
  hasApp?: boolean
  appStoreUrl?: string
  playStoreUrl?: string
}

const STORE_SEARCH_CONFIGS: Record<string, StoreSearchConfig> = {
  'ALDI': {
    searchUrl: 'https://www.aldi.us/en/products/search/',
    paramName: 'q',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/aldi-usa/id1467574532',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.aldi.us'
  },
  'Whole Foods Market': {
    searchUrl: 'https://www.wholefoodsmarket.com/search',
    paramName: 'text',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/whole-foods-market/id583030483',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.amazon.wholefoods'
  },
  'Trader Joe\'s': {
    searchUrl: 'https://www.traderjoes.com/home/search',
    paramName: 'q',
    hasApp: false
  },
  'Walmart': {
    searchUrl: 'https://www.walmart.com/search',
    paramName: 'q',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/walmart-shopping-grocery/id338137227',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.walmart.android'
  },
  'Target': {
    searchUrl: 'https://www.target.com/s',
    paramName: 'searchTerm',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/target/id297430070',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.target.ui'
  },
  'Costco': {
    searchUrl: 'https://www.costco.com/CatalogSearch',
    paramName: 'keyword',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/costco-wholesale/id535509415',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.costco.app.android'
  },
  'Kroger': {
    searchUrl: 'https://www.kroger.com/search',
    paramName: 'query',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/kroger/id316766015',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.kroger.mobile'
  },
  'Safeway': {
    searchUrl: 'https://www.safeway.com/shop/search-results.html',
    paramName: 'q',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/safeway-deals-delivery/id518815116',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.safeway.client.android.safeway'
  },
  'Publix': {
    searchUrl: 'https://www.publix.com/shop',
    paramName: 'q',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/publix/id567196458',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.publix.mobile'
  },
  'H-E-B': {
    searchUrl: 'https://www.heb.com/search',
    paramName: 'q',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/h-e-b/id463783850',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.heb.mobile'
  },
  'Meijer': {
    searchUrl: 'https://www.meijer.com/shop/search/',
    paramName: 'q',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/meijer/id1037748204',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.meijer.mobile'
  },
  'Food Lion': {
    searchUrl: 'https://www.foodlion.com/search',
    paramName: 'q',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/food-lion/id1082734439',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.foodlion.foodlion'
  },
  // Regional chains
  'Dierbergs Markets': {
    searchUrl: 'https://www.dierbergs.com/search',
    paramName: 'q',
    hasApp: false
  },
  'Straub\'s Market': {
    searchUrl: 'https://www.straubsmarkets.com/search',
    paramName: 'q', 
    hasApp: false
  },
  'Fresh Market': {
    searchUrl: 'https://www.thefreshmarket.com/search',
    paramName: 'q',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/the-fresh-market/id1508854606',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.thefreshmarket.mobile'
  },
  // Additional chains
  'Fresh Thyme': {
    searchUrl: 'https://www.freshthyme.com/sm/search',
    paramName: 'q',
    hasApp: false
  },
  'Sprouts': {
    searchUrl: 'https://shop.sprouts.com/search',
    paramName: 'q',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/sprouts-farmers-market/id666870638',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.freshop.sprouts'
  },
  'Hy-Vee': {
    searchUrl: 'https://www.hy-vee.com/grocery/search',
    paramName: 'q',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/hy-vee/id1056732346',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.hyvee.android'
  },
  'Giant Eagle': {
    searchUrl: 'https://www.gianteagle.com/search',
    paramName: 'q',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/giant-eagle/id1522896052',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.giant_eagle.ge'
  },
  'Schnucks': {
    searchUrl: 'https://www.schnucks.com/search',
    paramName: 'q',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/schnucks/id1178719090',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.schnucks.schnucks'
  },
  'Wegmans': {
    searchUrl: 'https://shop.wegmans.com/search',
    paramName: 'q',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/wegmans/id1104728977',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.wegmans.mobile'
  },
  'Harris Teeter': {
    searchUrl: 'https://www.harristeeter.com/search',
    paramName: 'q',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/harris-teeter/id1488821954',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.harristeeter.mobile'
  },
  'Stop & Shop': {
    searchUrl: 'https://stopandshop.com/search',
    paramName: 'q',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/stop-shop/id1440468344',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.stopandshop.mobile'
  },
  'Giant': {
    searchUrl: 'https://giantfood.com/search',
    paramName: 'q',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/giant-food/id1440468321',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.giantfood.mobile'
  },
  'ShopRite': {
    searchUrl: 'https://www.shoprite.com/sm/search',
    paramName: 'q',
    hasApp: true,
    appStoreUrl: 'https://apps.apple.com/us/app/shoprite/id1517944516',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.shoprite.mobile'
  }
}

/**
 * Generate a search URL for a specific store with the item pre-filled
 */
export function generateStoreSearchUrl(storeName: string, searchItem: string): string | null {
  // Find matching store config using fuzzy matching
  const normalizedStoreName = Object.keys(STORE_SEARCH_CONFIGS).find(configName => 
    storeName.toLowerCase().includes(configName.toLowerCase()) ||
    configName.toLowerCase().includes(storeName.toLowerCase().split(' ')[0].toLowerCase())
  )
  
  const config = normalizedStoreName ? STORE_SEARCH_CONFIGS[normalizedStoreName] : null
  
  if (!config) {
    console.log(`❌ No search URL config found for store: ${storeName}`)
    return null
  }
  
  // Encode the search item for URL
  const encodedItem = encodeURIComponent(searchItem.trim())
  
  // Build the search URL
  const searchUrl = `${config.searchUrl}?${config.paramName}=${encodedItem}`
  
  console.log(`🔗 Generated search URL for ${storeName}: ${searchUrl}`)
  return searchUrl
}

/**
 * Get app store links for a store (if available)
 */
export function getStoreAppLinks(storeName: string): {
  hasApp: boolean
  appStoreUrl?: string
  playStoreUrl?: string
} {
  const normalizedStoreName = Object.keys(STORE_SEARCH_CONFIGS).find(configName => 
    storeName.toLowerCase().includes(configName.toLowerCase()) ||
    configName.toLowerCase().includes(storeName.toLowerCase().split(' ')[0].toLowerCase())
  )
  
  const config = normalizedStoreName ? STORE_SEARCH_CONFIGS[normalizedStoreName] : null
  
  if (!config) {
    return { hasApp: false }
  }
  
  return {
    hasApp: config.hasApp || false,
    appStoreUrl: config.appStoreUrl,
    playStoreUrl: config.playStoreUrl
  }
}

/**
 * Generate a generic Google search URL for the item + store
 */
export function generateGoogleStoreSearch(storeName: string, searchItem: string): string {
  const query = `${searchItem} site:${getStoreDomain(storeName)} OR "${storeName}" "${searchItem}" buy online`
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}

/**
 * Get the main domain for a store
 */
function getStoreDomain(storeName: string): string {
  const domains: Record<string, string> = {
    'ALDI': 'aldi.us',
    'Whole Foods Market': 'wholefoodsmarket.com',
    'Trader Joe\'s': 'traderjoes.com',
    'Walmart': 'walmart.com',
    'Target': 'target.com',
    'Costco': 'costco.com',
    'Kroger': 'kroger.com',
    'Safeway': 'safeway.com',
    'Publix': 'publix.com',
    'H-E-B': 'heb.com',
    'Meijer': 'meijer.com',
    'Food Lion': 'foodlion.com',
    'Dierbergs Markets': 'dierbergs.com',
    'Straub\'s Market': 'straubsmarkets.com',
    'Fresh Thyme': 'freshthyme.com',
    'Sprouts': 'sprouts.com',
    'Hy-Vee': 'hy-vee.com',
    'Giant Eagle': 'gianteagle.com',
    'Schnucks': 'schnucks.com',
    'Wegmans': 'wegmans.com',
    'Harris Teeter': 'harristeeter.com',
    'Stop & Shop': 'stopandshop.com',
    'Giant': 'giantfood.com',
    'Albertsons': 'albertsons.com',
    'Vons': 'vons.com',
    'Acme': 'acmemarkets.com',
    'ShopRite': 'shoprite.com',
    'King Soopers': 'kingsoopers.com',
    'Smith\'s': 'smithsfoodanddrug.com',
    'Ralphs': 'ralphs.com',
    'Fred Meyer': 'fredmeyer.com',
    'Winn-Dixie': 'winndixie.com',
    'Casey\'s': 'caseys.com',
    'QuikTrip': 'quiktrip.com',
    'Wawa': 'wawa.com',
    'Sheetz': 'sheetz.com'
  }
  
  const normalizedStoreName = Object.keys(domains).find(name => 
    storeName.toLowerCase().includes(name.toLowerCase())
  )
  
  return normalizedStoreName ? domains[normalizedStoreName] : 'google.com'
}

/**
 * Get helpful search tips for finding items online
 */
export function getOnlineSearchTips(item: string): string[] {
  const tips = [
    "Try searching with brand names (e.g., 'Coca Cola' instead of 'soda')",
    "Use specific terms (e.g., 'whole milk' instead of just 'milk')",
    "Check the store's app for better inventory visibility",
    "Look for 'Available in store' or 'Pickup today' indicators"
  ]
  
  // Add item-specific tips
  if (item.toLowerCase().includes('organic')) {
    tips.push("Organic items are often in a separate section on store websites")
  }
  
  if (item.toLowerCase().includes('milk') || item.toLowerCase().includes('dairy')) {
    tips.push("Check dairy/refrigerated sections on store websites")
  }
  
  return tips.slice(0, 3) // Return max 3 tips
} 