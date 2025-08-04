// Smart store-item matching based on store specialties and typical inventory
interface StoreProfile {
  specialty: string[]
  commonItems: string[]
  likelihood: number // 0-1 probability of having any given item
  strengths: string[] // What this store is particularly good for
}

const STORE_PROFILES: Record<string, StoreProfile> = {
  'ALDI': {
    specialty: ['budget', 'basic', 'essentials'],
    commonItems: ['milk', 'bread', 'eggs', 'cheese', 'butter', 'yogurt', 'chicken', 'ground beef', 'pasta', 'rice', 'cereal', 'bananas', 'apples', 'potatoes', 'onions'],
    likelihood: 0.7,
    strengths: ['Low prices', 'Basic groceries', 'European brands']
  },
  'Whole Foods Market': {
    specialty: ['organic', 'premium', 'natural', 'health', 'specialty'],
    commonItems: ['organic milk', 'almond milk', 'oat milk', 'organic eggs', 'grass-fed beef', 'organic chicken', 'quinoa', 'kale', 'avocado', 'organic bread', 'kombucha', 'coconut oil'],
    likelihood: 0.9,
    strengths: ['Organic products', 'High quality', 'Specialty diets', 'Fresh produce']
  },
  'Trader Joe\'s': {
    specialty: ['unique', 'gourmet', 'affordable premium', 'private label'],
    commonItems: ['specialty cheese', 'wine', 'frozen meals', 'nuts', 'chocolate', 'seasonal items', 'international foods', 'organic options'],
    likelihood: 0.8,
    strengths: ['Unique products', 'Good prices', 'Private label quality']
  },
  'Walmart': {
    specialty: ['everything', 'bulk', 'budget', 'convenience'],
    commonItems: ['milk', 'bread', 'eggs', 'diapers', 'cleaning supplies', 'pharmacy', 'electronics', 'clothing'],
    likelihood: 0.8,
    strengths: ['Wide selection', 'Low prices', 'One-stop shopping']
  },
  'Target': {
    specialty: ['trendy', 'home goods', 'convenience', 'brands', 'one-stop'],
    commonItems: ['milk', 'snacks', 'frozen foods', 'home goods', 'beauty products', 'clothing', 'basic groceries', 'household items', 'personal care'],
    likelihood: 0.7,
    strengths: ['Trendy products', 'Good prices', 'Home & lifestyle', 'Convenient shopping', 'Wide selection']
  },
  'Dierbergs Markets': {
    specialty: ['fresh', 'local', 'full-service', 'quality'],
    commonItems: ['fresh produce', 'meat', 'seafood', 'bakery', 'deli', 'local products'],
    likelihood: 0.8,
    strengths: ['Fresh products', 'Local sourcing', 'Full-service deli']
  },
  'Straub\'s Market': {
    specialty: ['premium', 'gourmet', 'fresh', 'local'],
    commonItems: ['premium meats', 'fine cheese', 'wine', 'gourmet items', 'fresh seafood', 'artisan bread'],
    likelihood: 0.8,
    strengths: ['Premium quality', 'Gourmet selection', 'Local specialties']
  },
  'Costco': {
    specialty: ['bulk', 'wholesale', 'value', 'large quantities'],
    commonItems: ['bulk milk', 'bulk bread', 'large eggs', 'meat in bulk', 'household supplies'],
    likelihood: 0.7,
    strengths: ['Bulk quantities', 'Great value', 'Business supplies']
  },
  'Fresh Thyme': {
    specialty: ['organic', 'natural', 'health', 'fresh', 'specialty'],
    commonItems: ['organic produce', 'natural products', 'supplements', 'fresh meat', 'organic dairy', 'gluten-free', 'vegan options'],
    likelihood: 0.9,
    strengths: ['Organic focus', 'Natural products', 'Health-conscious options']
  },
  'Sprouts': {
    specialty: ['organic', 'natural', 'health', 'vitamins', 'specialty diets'],
    commonItems: ['organic produce', 'natural supplements', 'bulk foods', 'gluten-free', 'plant-based options'],
    likelihood: 0.9,
    strengths: ['Natural foods', 'Organic produce', 'Health supplements']
  }
}

/**
 * Calculate how likely a store is to have a specific item
 */
export function calculateItemAvailability(storeName: string, searchedItem: string): {
  likelihood: number
  reasons: string[]
  confidence: 'high' | 'medium' | 'low'
} {
  const normalizedStoreName = Object.keys(STORE_PROFILES).find(name => 
    storeName.toLowerCase().includes(name.toLowerCase())
  )
  
  const profile = normalizedStoreName ? STORE_PROFILES[normalizedStoreName] : null
  
  if (!profile) {
    // Unknown store - generic grocery store assumption
    return {
      likelihood: 0.6,
      reasons: ['General grocery store'],
      confidence: 'low'
    }
  }
  
  const normalizedItem = searchedItem.toLowerCase()
  const reasons: string[] = []
  let likelihood = profile.likelihood
  
  // Check if item is in common items
  const hasCommonItem = profile.commonItems.some(item => 
    normalizedItem.includes(item.toLowerCase()) || item.toLowerCase().includes(normalizedItem)
  )
  
  if (hasCommonItem) {
    likelihood += 0.2
    reasons.push('Commonly stocked item')
  }
  
  // Check specialty matching
  const matchesSpecialty = profile.specialty.some(specialty => {
    if (specialty === 'organic' && normalizedItem.includes('organic')) {
      reasons.push('Specializes in organic products')
      return true
    }
    if (specialty === 'budget' && (normalizedItem.includes('basic') || normalizedItem.includes('cheap'))) {
      reasons.push('Budget-friendly store')
      return true
    }
    if (specialty === 'premium' && (normalizedItem.includes('premium') || normalizedItem.includes('gourmet'))) {
      reasons.push('Specializes in premium products')
      return true
    }
    if (specialty === 'bulk' && normalizedItem.includes('bulk')) {
      reasons.push('Bulk quantities available')
      return true
    }
    return false
  })
  
  if (matchesSpecialty) {
    likelihood += 0.15
  }
  
  // Add store strengths as reasons
  reasons.push(...profile.strengths.slice(0, 2))
  
  // Cap likelihood at 0.95 (never 100% certain without real data)
  likelihood = Math.min(likelihood, 0.95)
  
  // Determine confidence level
  let confidence: 'high' | 'medium' | 'low' = 'medium'
  if (likelihood >= 0.8) confidence = 'high'
  else if (likelihood < 0.6) confidence = 'low'
  
  return { likelihood, reasons, confidence }
}

/**
 * Get item category to help with matching
 */
export function categorizeItem(item: string): string {
  const normalized = item.toLowerCase()
  
  if (normalized.includes('milk') || normalized.includes('cream') || normalized.includes('yogurt') || normalized.includes('cheese')) {
    return 'dairy'
  }
  if (normalized.includes('organic') || normalized.includes('natural')) {
    return 'organic'
  }
  if (normalized.includes('meat') || normalized.includes('beef') || normalized.includes('chicken') || normalized.includes('pork')) {
    return 'meat'
  }
  if (normalized.includes('fruit') || normalized.includes('vegetable') || normalized.includes('produce')) {
    return 'produce'
  }
  if (normalized.includes('frozen')) {
    return 'frozen'
  }
  if (normalized.includes('bread') || normalized.includes('bakery') || normalized.includes('pastry')) {
    return 'bakery'
  }
  
  return 'general'
}

/**
 * Generate helpful suggestions for finding an item
 */
export function getItemSuggestions(item: string): string[] {
  const category = categorizeItem(item)
  const suggestions: string[] = []
  
  switch (category) {
    case 'organic':
      suggestions.push('Try Whole Foods for best organic selection', 'Check natural food stores')
      break
    case 'dairy':
      suggestions.push('Most grocery stores carry dairy products', 'Check expiration dates')
      break
    case 'meat':
      suggestions.push('Call ahead for specific cuts', 'Fresh meat counters have more options')
      break
    case 'specialty':
      suggestions.push('Call store to confirm availability', 'Consider ordering online')
      break
    default:
      suggestions.push('Call ahead to confirm availability', 'Check store website or app')
  }
  
  return suggestions
} 