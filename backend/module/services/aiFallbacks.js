// aiFallbacks.js - Fallback responses when AI fails

/* Smart category guessing based on product name */
function guessCategoryFromName(productName) {
  const nameLower = productName.toLowerCase()
  
  // Personal Care
  if (nameLower.includes('toothbrush') || nameLower.includes('soap') || 
      nameLower.includes('cream') || nameLower.includes('lotion')) {
    return {
      primary: "Personal Care",
      sub: nameLower.includes('tooth') ? "Oral Care" : "Bath & Body"
    }
  }
  
  // Lifestyle
  if (nameLower.includes('bag') || nameLower.includes('bottle') || 
      nameLower.includes('tote') || nameLower.includes('wallet')) {
    return {
      primary: "Lifestyle",
      sub: nameLower.includes('bag') ? "Bags" : "Bottles"
    }
  }
  
  // Stationery
  if (nameLower.includes('pen') || nameLower.includes('notebook') || 
      nameLower.includes('paper') || nameLower.includes('pencil')) {
    return {
      primary: "Stationery",
      sub: nameLower.includes('pen') ? "Writing" : "Notebooks"
    }
  }
  
  // Eco Gifts
  if (nameLower.includes('seed') || nameLower.includes('plant') || 
      nameLower.includes('bomb') || nameLower.includes('gift')) {
    return {
      primary: "Eco Gifts",
      sub: "Gardening"
    }
  }
  
  // Kitchen
  if (nameLower.includes('wrap') || nameLower.includes('straw') || 
      nameLower.includes('bowl') || nameLower.includes('utensil')) {
    return {
      primary: "Kitchen",
      sub: "Eco Kitchen"
    }
  }
  
  // Default
  return {
    primary: "Eco Gifts",
    sub: "General"
  }
}

/* Generate SEO tags from product name */
function generateSEOTags(productName, category) {
  const words = productName.toLowerCase().split(' ')
  const tags = [
    productName.toLowerCase(),
    'eco-friendly',
    'sustainable',
    'green',
    category.toLowerCase().replace(' ', '-'),
    ...words.filter(w => w.length > 3)
  ]
  
  // Remove duplicates and limit to 8
  return [...new Set(tags)].slice(0, 8)
}

/*  Fallback categories when AI fails */
function getFallbackCategories(productName) {
  const { primary, sub } = guessCategoryFromName(productName)
  
  return {
    primaryCategory: primary,
    subCategory: sub,
    seoTags: generateSEOTags(productName, primary),
    sustainabilityFilters: ['eco-friendly', 'sustainable'],
    confidence: 0.7,
    reasoning: "Auto-generated fallback categories based on product name",
    _fallback: true
  }
}

/* Fallback proposal when AI fails */

function getFallbackProposal(eventType = "Corporate Event", budget = 50000, requirement = "Eco products") {
  // Default products that always work
  const defaultProducts = [
    { name: "Bamboo Toothbrush", price: 60 },
    { name: "Cotton Bag", price: 150 },
    { name: "Seed Bombs", price: 50 },
    { name: "Recycled Notebook", price: 120 }
  ]
  
  // Calculate quantities based on budget
  const totalValue = defaultProducts.reduce((sum, p) => sum + p.price, 0)
  const baseQuantity = Math.floor(budget / totalValue)
  
  const products = defaultProducts.map(p => ({
    name: p.name,
    quantity: Math.max(10, Math.floor(baseQuantity * 0.8)),
    unitPrice: p.price,
    estimatedCost: p.price * Math.max(10, Math.floor(baseQuantity * 0.8))
  }))
  
  const totalCost = products.reduce((sum, p) => sum + p.estimatedCost, 0)
  
  return {
    products,
    totalCost,
    impactSummary: `Sustainable proposal for ${eventType} focusing on ${requirement}. Includes ${products.length} eco-friendly products within ₹${budget} budget.`,
    budget: {
      allocated: totalCost,
      remaining: budget - totalCost,
      total: budget
    },
    _fallback: true
  }
}

module.exports = {
  getFallbackCategories,
  getFallbackProposal,
  guessCategoryFromName,
  generateSEOTags
}