// utils/categoryHelpers.js

// Predefined categories for validation
const VALID_CATEGORIES = ['Personal Care', 'Lifestyle', 'Stationery', 'Eco Gifts', 'Kitchen', 'Clothing']

const VALID_SUSTAINABILITY_FILTERS = [
  'plastic-free', 'compostable', 'vegan', 'recycled', 'biodegradable', 'reusable', 'organic', 'zero-waste', 'handmade', 'natural'
]

// Validate and clean AI response
function validateCategoryResponse(aiResponse, productName) {
  const cleaned = {
    primaryCategory: VALID_CATEGORIES.includes(aiResponse.primaryCategory)
      ? aiResponse.primaryCategory
      : 'Eco Gifts', // Default fallback

    subCategory: aiResponse.subCategory || 'General',

    seoTags: Array.isArray(aiResponse.seoTags)
      ? aiResponse.seoTags.slice(0, 10).map(tag => tag.toLowerCase().trim())
      : [productName.toLowerCase(), 'eco-friendly', 'sustainable'],

    sustainabilityFilters: Array.isArray(aiResponse.sustainabilityFilters)
      ? aiResponse.sustainabilityFilters
        .filter(filter => VALID_SUSTAINABILITY_FILTERS.includes(filter))
        .slice(0, 5)
      : ['eco-friendly'],

    confidence: aiResponse.confidence || 0.8,
    reasoning: aiResponse.reasoning || 'Auto-categorized by AI'
  }

  return cleaned
}

// Generate SEO-friendly slug
function generateSlug(productName) {
  return productName
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-')
}

// Suggest related categories based on product name
function suggestRelatedCategories(productName, primaryCategory) {
  const suggestions = {
    'Personal Care': ['Bath & Body', 'Oral Care', 'Skin Care', 'Hair Care'],
    'Lifestyle': ['Bags', 'Bottles', 'Travel', 'Home'],
    'Stationery': ['Writing', 'Notebooks', 'Art Supplies', 'Office'],
    'Eco Gifts': ['Gift Sets', 'Eco Kits', 'Plants', 'Workshops'],
    'Kitchen': ['Food Storage', 'Utensils', 'Cleaning', 'Beverage'],
    'Clothing': ['Tops', 'Bags', 'Accessories', 'Sustainable Fashion']
  }

  return suggestions[primaryCategory] || ['General', 'Eco-friendly']
}

module.exports = {
  VALID_CATEGORIES,
  VALID_SUSTAINABILITY_FILTERS,
  validateCategoryResponse,
  generateSlug,
  suggestRelatedCategories
}

