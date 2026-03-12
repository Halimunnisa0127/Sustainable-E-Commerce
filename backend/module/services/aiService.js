// aiService.js - Main AI service (combines all modules)

const { MODELS } = require("./aiConfig")
const {
  getCachedResponse,
  cacheResponse,
  createCacheKey,
  callAI,
  parseAIResponse,
  createCategoryPrompt,
  createProposalPrompt
} = require("./aiHelpers")
const {
  getFallbackCategories,
  getFallbackProposal
} = require("./aiFallbacks")


/* Generate B2B proposal using AI */
async function generateProposal(prompt, options = {}) {
  const startTime = Date.now()
  const {
    useCache = true,
    model = MODELS.FAST,
    eventType = "Corporate Event",
    budget = 50000,
    requirement = "Eco products"
  } = options

  try {
    console.log(" Generating proposal...")
    
    // Check cache
    if (useCache) {
      const cacheKey = createCacheKey("prop", prompt)
      const cached = getCachedResponse(cacheKey)
      if (cached) return cached
    }

    // Call AI
    const messages = [
      { role: "system", content: "You are a B2B proposal generator. Return ONLY JSON." },
      { role: "user", content: prompt + "\nReturn ONLY JSON." }
    ]
    
    const aiResponse = await callAI(messages, model)
    console.log(" AI response received")
    
    // Parse response
    const result = await parseAIResponse(aiResponse)
    
    // Cache result
    if (useCache) {
      const cacheKey = createCacheKey("prop", prompt)
      cacheResponse(cacheKey, result)
    }

    console.log(` Proposal done in ${(Date.now() - startTime) / 1000}s`)
    return result

  } catch (error) {
    console.error(" Proposal Error:", error.message)
    console.log(" Using fallback proposal")
    return getFallbackProposal(eventType, budget, requirement)
  }
}
/* Generate category tags for a product */
async function generateCategoryTags(productName, description = '', options = {}) {
  const startTime = Date.now()
  const { useCache = true, model = MODELS.FAST } = options

  try {
    console.log(`Categorizing: ${productName}`)
    
    // Check cache
    if (useCache) {
      const cacheKey = createCacheKey("cat", `${productName}:${description}`)
      const cached = getCachedResponse(cacheKey)
      if (cached) return cached
    }

    // Create prompt and call AI
    const prompt = createCategoryPrompt(productName, description)
    const messages = [
      { role: "system", content: "You are a product categorizer. Return only JSON." },
      { role: "user", content: prompt }
    ]
    
    const aiResponse = await callAI(messages, model)
    
    // Parse response
    let result = await parseAIResponse(aiResponse)
    
    // Ensure required fields
    result = {
      primaryCategory: result.primaryCategory || 'Eco Gifts',
      subCategory: result.subCategory || 'General',
      seoTags: result.seoTags || [productName.toLowerCase(), 'eco-friendly'],
      sustainabilityFilters: result.sustainabilityFilters || ['eco-friendly'],
      confidence: result.confidence || 0.8,
      reasoning: result.reasoning || 'Auto-categorized',
      ...result
    }

    // Cache result
    if (useCache) {
      const cacheKey = createCacheKey("cat", `${productName}:${description}`)
      cacheResponse(cacheKey, result)
    }

    console.log(`Categories done in ${(Date.now() - startTime) / 1000}s`)
    return result

  } catch (error) {
    console.error(" Category Error:", error.message)
    console.log(" Using fallback categories")
    return getFallbackCategories(productName)
  }
}

/* Generate category suggestions (legacy support) */
async function generateCategorySuggestions(prompt) {
  try {
    const nameMatch = prompt.match(/Product Name: (.+)/i) || 
                     ['', 'Unknown Product']
    const productName = nameMatch[1].trim()
    return await generateCategoryTags(productName)
  } catch (err) {
    return getFallbackCategories('Product')
  }
}


module.exports = {generateProposal, generateCategoryTags, generateCategorySuggestions,MODELS}