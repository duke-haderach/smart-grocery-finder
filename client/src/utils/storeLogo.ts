// Store logo mapping using reliable sources that allow hotlinking
const STORE_LOGOS: Record<string, string> = {
  // Major grocery chains - Using SVG data URIs for reliability
  'ALDI': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDA2OEIzIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1OCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPkFMREk8L3RleHQ+Cjwvc3ZnPg==',
  'Whole Foods Market': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDA2NDMzIi8+Cjx0ZXh0IHg9IjUwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPldIT0xFPC90ZXh0Pgo8dGV4dCB4PSI1MCIgeT0iNjUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIj5GT09EUzwvdGV4dD4KPC9zdmc+',
  'Trader Joe\'s': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRDQxMjI5Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1OCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPlRKPC90ZXh0Pgo8L3N2Zz4=',
  'Walmart': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDA0Qzc0Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjgiIGZpbGw9IiNGRkNGMDAiLz4KPGNpcmNsZSBjeD0iMzAiIGN5PSI2MCIgcj0iNiIgZmlsbD0iI0ZGQ0YwMCIvPgo8Y2lyY2xlIGN4PSI3MCIgY3k9IjYwIiByPSI2IiBmaWxsPSIjRkZDRjAwIi8+Cjx0ZXh0IHg9IjUwIiB5PSI4NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPldBTE1BUlQ8L3RleHQ+Cjwvc3ZnPg==',
  'Target': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMwIiBmaWxsPSIjRkYwMDAwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIwIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjEwIiBmaWxsPSIjRkYwMDAwIi8+Cjwvc3ZnPg==',
  'Kroger': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDA3NUJFIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1OCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPktyb2dlcjwvdGV4dD4KPC9zdmc+',
  'Safeway': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkYwMDAwIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1OCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPlNhZmV3YXk8L3RleHQ+Cjwvc3ZnPg==',
  'Food Lion': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZBNTAwIi8+Cjx0ZXh0IHg9IjUwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPkZPT0Q8L3RleHQ+Cjx0ZXh0IHg9IjUwIiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPkxJT048L3RleHQ+Cjwvc3ZnPg==',
  'Publix': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDA3NTQyIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1OCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPlB1YmxpeDwvdGV4dD4KPC9zdmc+',
  'Costco': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkYwMDAwIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1OCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPkNvc3RjbzwvdGV4dD4KPC9zdmc+',
  
  // Major chains with branded-color placeholders
  'Albertsons': 'https://via.placeholder.com/200x80/0066CC/ffffff?text=ALBERTSONS',
  'Wegmans': 'https://via.placeholder.com/200x80/FFB81C/000000?text=WEGMANS',
  'Giant Eagle': 'https://via.placeholder.com/200x80/FF0000/ffffff?text=GIANT+EAGLE',
  'Harris Teeter': 'https://via.placeholder.com/200x80/0066CC/ffffff?text=HARRIS+TEETER',
  'Stop & Shop': 'https://via.placeholder.com/200x80/FF6600/ffffff?text=STOP+%26+SHOP',
  'Giant': 'https://via.placeholder.com/200x80/FF0000/ffffff?text=GIANT',
  'Acme': 'https://via.placeholder.com/200x80/FF0000/ffffff?text=ACME',
  'ShopRite': 'https://via.placeholder.com/200x80/009639/ffffff?text=SHOPRITE',
  'King Soopers': 'https://via.placeholder.com/200x80/0066CC/ffffff?text=KING+SOOPERS',
  'City Market': 'https://via.placeholder.com/200x80/0066CC/ffffff?text=CITY+MARKET',
  'Smith\'s': 'https://via.placeholder.com/200x80/0066CC/ffffff?text=SMITH%27S',
  'Ralphs': 'https://via.placeholder.com/200x80/0066CC/ffffff?text=RALPHS',
  'Vons': 'https://via.placeholder.com/200x80/FF0000/ffffff?text=VONS',
  'Jewel-Osco': 'https://via.placeholder.com/200x80/FF6600/ffffff?text=JEWEL-OSCO',
  'Shaw\'s': 'https://via.placeholder.com/200x80/FF0000/ffffff?text=SHAW%27S',
  'Star Market': 'https://via.placeholder.com/200x80/FF0000/ffffff?text=STAR+MARKET',
  
  // Warehouse clubs  
  'Sam\'s Club': 'https://via.placeholder.com/200x80/0066CC/ffffff?text=SAM%27S+CLUB',
  'BJ\'s Wholesale Club': 'https://via.placeholder.com/200x80/FF0000/ffffff?text=BJ%27S',
  
  // Regional chains
  'H-E-B': 'https://via.placeholder.com/200x80/FF0000/ffffff?text=H-E-B',
  'Hy-Vee': 'https://via.placeholder.com/200x80/FFB81C/000000?text=HY-VEE',
  'Meijer': 'https://via.placeholder.com/200x80/FF0000/ffffff?text=MEIJER',
  'Fred Meyer': 'https://via.placeholder.com/200x80/0066CC/ffffff?text=FRED+MEYER',
  'Winn-Dixie': 'https://via.placeholder.com/200x80/FF6600/ffffff?text=WINN-DIXIE',
  'Piggly Wiggly': 'https://via.placeholder.com/200x80/FF1493/ffffff?text=PIGGLY+WIGGLY',
  'Ingles': 'https://via.placeholder.com/200x80/008000/ffffff?text=INGLES',
  'Food 4 Less': 'https://via.placeholder.com/200x80/FFB81C/000000?text=FOOD+4+LESS',
  'WinCo Foods': 'https://via.placeholder.com/200x80/FF6600/ffffff?text=WINCO+FOODS',
  'Market Basket': 'https://via.placeholder.com/200x80/FF0000/ffffff?text=MARKET+BASKET',
  
  // Natural/Organic chains
  'Sprouts Farmers Market': 'https://via.placeholder.com/200x80/4CAF50/ffffff?text=SPROUTS',
  'Natural Grocers': 'https://via.placeholder.com/200x80/4CAF50/ffffff?text=NATURAL+GROCERS',
  'Fresh Market': 'https://via.placeholder.com/200x80/4CAF50/ffffff?text=FRESH+MARKET',
  'Earth Fare': 'https://via.placeholder.com/200x80/4CAF50/ffffff?text=EARTH+FARE',
  
  // Missouri/Local chains - Using brand-consistent placeholder logos
  'Dierbergs Markets': 'https://via.placeholder.com/200x80/1f4e9e/ffffff?text=DIERBERGS',
  'Straub\'s Market': 'https://via.placeholder.com/200x80/28a745/ffffff?text=STRAUB%27S',
  'Schnucks': 'https://via.placeholder.com/200x80/dc3545/ffffff?text=SCHNUCKS',
  'Fresh Thyme': 'https://via.placeholder.com/200x80/4CAF50/ffffff?text=FRESH+THYME',
  
  // Additional chains with placeholder logos (branded colors)
  'Festival Foods': 'https://via.placeholder.com/200x80/FF5722/ffffff?text=FESTIVAL+FOODS',
  'Save-A-Lot': 'https://via.placeholder.com/200x80/2196F3/ffffff?text=SAVE-A-LOT',
  'Price Chopper': 'https://via.placeholder.com/200x80/E91E63/ffffff?text=PRICE+CHOPPER',
  'IGA': 'https://via.placeholder.com/200x80/795548/ffffff?text=IGA',
  'Lucky': 'https://via.placeholder.com/200x80/009688/ffffff?text=LUCKY',
  'FoodMaxx': 'https://via.placeholder.com/200x80/FF9800/ffffff?text=FOODMAXX',
  'Nob Hill': 'https://via.placeholder.com/200x80/9C27B0/ffffff?text=NOB+HILL',
  'Save Mart': 'https://via.placeholder.com/200x80/607D8B/ffffff?text=SAVE+MART',
  
  // Convenience stores
  '7-Eleven': 'https://via.placeholder.com/200x80/FF6600/ffffff?text=7-ELEVEN',
  'Casey\'s': 'https://via.placeholder.com/200x80/FF0000/ffffff?text=CASEY%27S',
  'QuikTrip': 'https://via.placeholder.com/200x80/FF0000/ffffff?text=QUIKTRIP',
  'Wawa': 'https://via.placeholder.com/200x80/FF6600/ffffff?text=WAWA',
  'Sheetz': 'https://via.placeholder.com/200x80/FF0000/ffffff?text=SHEETZ',
  
  // Pharmacy chains that sell groceries
  'Walgreens': 'https://via.placeholder.com/200x80/FF0000/ffffff?text=WALGREENS',
  'CVS': 'https://via.placeholder.com/200x80/FF0000/ffffff?text=CVS',
  'Rite Aid': 'https://via.placeholder.com/200x80/0066CC/ffffff?text=RITE+AID',
  
  // Dollar stores (often have groceries)
  'Dollar General': 'https://via.placeholder.com/200x80/FFB81C/000000?text=DOLLAR+GENERAL',
  'Dollar Tree': 'https://via.placeholder.com/200x80/4CAF50/ffffff?text=DOLLAR+TREE',
  'Family Dollar': 'https://via.placeholder.com/200x80/0066CC/ffffff?text=FAMILY+DOLLAR',
  
  // Common variations to handle
  'Walmart Supercenter': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDA0Qzc0Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjgiIGZpbGw9IiNGRkNGMDAiLz4KPGNpcmNsZSBjeD0iMzAiIGN5PSI2MCIgcj0iNiIgZmlsbD0iI0ZGQ0YwMCIvPgo8Y2lyY2xlIGN4PSI3MCIgY3k9IjYwIiByPSI2IiBmaWxsPSIjRkZDRjAwIi8+Cjx0ZXh0IHg9IjUwIiB5PSI4NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPldBTE1BUlQ8L3RleHQ+Cjwvc3ZnPg==',
  'Super Target': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMwIiBmaWxsPSIjRkYwMDAwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIwIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjEwIiBmaWxsPSIjRkYwMDAwIi8+Cjwvc3ZnPg==',
  'Sprouts': 'https://via.placeholder.com/200x80/4CAF50/ffffff?text=SPROUTS', // Alias for Sprouts Farmers Market
}

/**
 * Get the logo URL for a store by name
 * Performs fuzzy matching to handle variations in store names
 */
export function getStoreLogo(storeName: string): string | null {
  if (!storeName) {
    console.log('❌ No store name provided')
    return null
  }

  console.log('🎨 Getting logo for store:', storeName)

  // Direct match first
  const directMatch = STORE_LOGOS[storeName]
  if (directMatch) {
    console.log('✅ Direct match found for:', storeName, '→', directMatch.substring(0, 50) + '...')
    return directMatch
  }

  // Enhanced fuzzy matching for store variations
  const normalizedName = storeName.toLowerCase().trim()
  
  // Generate possible variations of the store name
  const storeVariations = [
    normalizedName,
    normalizedName.replace(/\s+/g, ''), // No spaces
    normalizedName.replace(/[^\w\s]/g, ''), // No special chars
    normalizedName.split(' ')[0], // First word only
    normalizedName.split('-')[0], // Before dash
    normalizedName.replace(/\s+(market|markets|store|stores|supermarket|foods?|wholesale club|farmers market)$/i, ''),
    normalizedName.replace(/^(the\s+)/i, ''), // Remove "The" prefix
    normalizedName.replace(/\s+(llc|inc|corp|corporation)$/i, ''), // Remove business suffixes
  ]
  
  // Check for direct and variation matches
  for (const [logoStoreName, logoUrl] of Object.entries(STORE_LOGOS)) {
    const normalizedLogoName = logoStoreName.toLowerCase()
    
    // Direct contains check
    if (normalizedName.includes(normalizedLogoName) || normalizedLogoName.includes(normalizedName)) {
      console.log('✅ Fuzzy match found:', logoStoreName, '→', logoUrl)
      return logoUrl
    }
    
    // Check all variations
    for (const variation of storeVariations) {
      if (variation && (variation.includes(normalizedLogoName) || normalizedLogoName.includes(variation))) {
        console.log('✅ Variation match found:', logoStoreName, '→', logoUrl)
        return logoUrl
      }
    }
    
    // Handle word-by-word matching
    const storeParts = normalizedName.split(/[\s\-\–\—]/);
    const logoParts = normalizedLogoName.split(/[\s\-\–\—]/);
    
    // Check if first few words match
    if (storeParts.length >= logoParts.length) {
      const firstPartsMatch = logoParts.every((part, index) => 
        storeParts[index] && storeParts[index].includes(part)
      );
      if (firstPartsMatch) {
        console.log('✅ Parts match found:', logoStoreName, '→', logoUrl)
        return logoUrl
      }
    }
    
    // Special case mappings for common variations
    const specialMappings: Record<string, string> = {
      'sprouts': 'sprouts farmers market',
      'bjs': 'bj\'s wholesale club',
      'jewel': 'jewel-osco',
      'sams': 'sam\'s club',
      'heb': 'h-e-b',
      'winco': 'winco foods',
      'stop shop': 'stop & shop',
      'harris': 'harris teeter',
      'giant eagle': 'giant eagle',
      'fred meyer': 'fred meyer',
    }
    
    const mapped = specialMappings[normalizedName] || specialMappings[storeParts[0]]
    if (mapped && normalizedLogoName === mapped) {
      console.log('✅ Special mapping match found:', logoStoreName, '→', logoUrl)
      return logoUrl
    }
  }

  console.log('❌ No logo found for store:', storeName)
  return null
}

/**
 * Get a fallback placeholder for stores without logos
 */
export function getStorePlaceholder(storeName: string): string {
  // Generate a simple initial-based placeholder
  const initials = storeName
    .split(' ')
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('')
  
  return `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#f3f4f6"/>
      <text x="50" y="55" font-family="Arial, sans-serif" font-size="32" font-weight="bold" 
            text-anchor="middle" fill="#6b7280">${initials}</text>
    </svg>
  `)}`
} 