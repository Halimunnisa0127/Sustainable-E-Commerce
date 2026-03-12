// aiService.js - Service functions for AI interactions
const axios = require("axios")

async function generateProposal(prompt) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          { 
            role: "user", 
            content: prompt + "\n\nIMPORTANT: Return ONLY valid JSON. No explanations, no markdown, just the JSON object." 
          }
        ],
        temperature: 0.1 // Lower temperature for more consistent JSON
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:9000",
          "X-Title": "Rayeva AI Project"
        }
      }
    )

    const text = response.data.choices[0].message.content
    console.log("AI RAW RESPONSE:\n", text)

    // Clean the response - remove any markdown or extra text
    let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    // Find JSON object
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    throw new Error("No JSON found in response")

  } catch (err) {
    console.error("AI ERROR:", err.message)
    return null
  }
}
async function generateCategorySuggestions(prompt) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          { 
            role: "user", 
            content: prompt + "\n\nIMPORTANT: Return ONLY valid JSON. No explanations, no markdown." 
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:9000",
          "X-Title": "Rayeva AI Project"
        }
      }
    )

    const text = response.data.choices[0].message.content
    console.log("Category AI RAW RESPONSE:\n", text)

    // Clean the response
    let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    // Find JSON object
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    // Fallback: return default structure
    return {
      primaryCategory: "Eco Gifts",
      subCategory: "Sustainable Products",
      seoTags: ["eco-friendly", "sustainable", "green", productName.toLowerCase()],
      sustainabilityFilters: ["eco-friendly", "sustainable"]
    }

  } catch (err) {
    console.error("Category AI ERROR:", err.message)
    return null
  }
}

// Add to your existing aiService.js

async function generateCategoryTags(productName, description = '') {
  try {
    const prompt = `
You are an AI product categorization expert for an eco-friendly marketplace.

Product Name: ${productName}
${description ? `Description: ${description}` : 'No description provided'}

TASK: Analyze this product and return a JSON with:

1. PRIMARY CATEGORY - Choose from:
   - Personal Care (toothbrushes, soaps, skincare)
   - Lifestyle (bags, bottles, general accessories)
   - Stationery (pens, notebooks, office supplies)
   - Eco Gifts (gift items, seed bombs, special products)
   - Kitchen (utensils, food storage, wraps)
   - Clothing (apparel, accessories, fabrics)

2. SUB-CATEGORY - Be specific (e.g., "Oral Care", "Writing Instruments", "Food Storage")

3. SEO TAGS - Generate 5-10 relevant tags for search optimization
   - Include material (bamboo, cotton, steel)
   - Include use case (travel, office, kitchen)
   - Include benefits (eco-friendly, sustainable)

4. SUSTAINABILITY FILTERS - Choose ALL that apply:
   - plastic-free
   - compostable
   - vegan
   - recycled
   - biodegradable
   - reusable
   - organic
   - zero-waste
   - handmade
   - natural

Return ONLY valid JSON in this exact format:
{
  "primaryCategory": "string",
  "subCategory": "string",
  "seoTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "sustainabilityFilters": ["filter1", "filter2", "filter3"],
  "confidence": 0.95,
  "reasoning": "Brief explanation of why these categories were chosen"
}
`

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          { 
            role: "user", 
            content: prompt 
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:9000",
          "X-Title": "Rayeva AI Project"
        }
      }
    )

    const text = response.data.choices[0].message.content
    console.log("Category AI RAW RESPONSE:\n", text)

    // Clean and parse JSON
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    throw new Error("No JSON found")

  } catch (err) {
    console.error("Category Generation Error:", err.message)
    return null
  }
}


module.exports = { generateProposal, generateCategorySuggestions, generateCategoryTags }

