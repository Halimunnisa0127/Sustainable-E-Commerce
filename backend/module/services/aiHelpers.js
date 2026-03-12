// aiHelpers.js - Helper functions for AI service

const axios = require("axios")
const { API_CONFIG, getHeaders } = require("./aiConfig")

// Simple in-memory cache
const responseCache = new Map()

/* Check cache for existing respons */
function getCachedResponse(key) {
  const cached = responseCache.get(key)
  if (cached) {
    const isExpired = Date.now() - cached.timestamp > 3600000 // 1 hour
    if (!isExpired) {
      console.log(`⚡ Cache hit: ${key.substring(0, 50)}...`)
      return cached.data
    }
    // Remove expired entry
    responseCache.delete(key)
  }
  return null
}
/*  Store response in cache */


function cacheResponse(key, data) {
  responseCache.set(key, {
    data,
    timestamp: Date.now()
  })
  console.log(`💾 Cached: ${key.substring(0, 50)}...`)
}


/* Create cache key from prompt  */

function createCacheKey(prefix, text) {
  return `${prefix}:${text.substring(0, 100).replace(/\s+/g, ' ')}`
}

/* Make API call to OpenRouter  */
async function callAI(messages, model, timeout = API_CONFIG.TIMEOUT_MS) {
  try {
    const response = await axios.post(
      API_CONFIG.BASE_URL,
      {
        model: model,
        messages: messages,
        temperature: API_CONFIG.TEMPERATURE,
        max_tokens: API_CONFIG.MAX_TOKENS,
        top_p: 0.9
      },
      {
        headers: getHeaders(),
        timeout: timeout
      }
    )

    return response.data.choices[0].message.content

  } catch (error) {
    console.error("API Call Error:", error.message)
    throw error
  }
}


/* Generate SEO tags based on product name and category */
function cleanAIResponse(text) {
  // Remove markdown code blocks
  let cleanText = text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .replace(/`/g, '')
    .trim()
  
  // Find JSON object
  const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    return jsonMatch[0]
  }
  
  return cleanText
}

/* Fallback category guess based on product name */

function parseAIResponse(text) {
  try {
    const cleanText = cleanAIResponse(text)
    return JSON.parse(cleanText)
  } catch (err) {
    // Try regex as fallback
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0])
      } catch (e) {
        throw new Error("Could not parse JSON response")
      }
    }
    throw new Error("No JSON found in response")
  }
}


/* Create prompt for category generation */
function createCategoryPrompt(productName, description) {
  return `
You are an AI categorizer for eco products.

Product: ${productName}
${description ? `Description: ${description}` : ''}

Return JSON with:
- primaryCategory (Personal Care/Lifestyle/Stationery/Eco Gifts/Kitchen/Clothing)
- subCategory (specific)
- seoTags (5-8 relevant tags)
- sustainabilityFilters (choose from: plastic-free, compostable, vegan, recycled, biodegradable, reusable, organic)
- confidence (0-1)
- reasoning (brief)

Return ONLY JSON object.`
}

/* Create prompt for proposal generation */
function createProposalPrompt(eventType, budget, requirement, productList) {
  return `
Create B2B proposal for:
Event: ${eventType}
Budget: ₹${budget}
Need: ${requirement}

Available products:
${productList}

Return JSON: {
  "products": [{"name": "string", "quantity": number}],
  "impactSummary": "string"
}`
}

module.exports = {
  // Cache functions
getCachedResponse,
  cacheResponse,
  createCacheKey,
  
  // AI functions
  callAI,
  
  // Parsing functions
  cleanAIResponse,
  parseAIResponse,
  
  // Prompt functions
  createCategoryPrompt,
  createProposalPrompt
}