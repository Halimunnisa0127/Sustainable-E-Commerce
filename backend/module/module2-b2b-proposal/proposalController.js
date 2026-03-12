// controllers/proposalController.js

const { generateProposal } = require("../services/aiService")
const Product = require("../../modelsShemas/Product")
const Log = require("../../modelsShemas/Log")

exports.createProposal = async (req, res) => {
  try {
    const { eventType, budget, requirement } = req.body

    if (!eventType || !budget || !requirement) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      })
    }

    // Get products from database
    const products = await Product.find()
    console.log(`Found ${products.length} products in database`)

    // Create better product list with categories
    const productList = products
      .map(p => `- ${p.name} (₹${p.price}) - ${p.sustainability?.join(', ') || 'eco-friendly'}`)
      .join("\n")

    const prompt = `
Generate a sustainable B2B proposal.

Event Type: ${eventType}
Budget: ₹${budget}
Requirement: ${requirement}

Available products:
${productList}

IMPORTANT RULES:
1. ONLY choose products from the list above
2. Total cost must be LESS than or equal to ₹${budget}
3. Choose 3-5 different products
4. Calculate quantities that make sense for ${eventType}
5. Return ONLY valid JSON - no other text

Expected JSON format:
{
  "products": [
    {"name": "Bamboo Toothbrush", "quantity": 25},
    {"name": "Cotton Bag", "quantity": 50}
  ],
  "impactSummary": "Brief description of environmental impact"
}
`

    // Get AI response
    const aiResult = await generateProposal(prompt)

    if (!aiResult) {
      return res.status(500).json({
        success: false,
        error: "AI generation failed"
      })
    }

    console.log("AI RAW RESPONSE:", JSON.stringify(aiResult, null, 2))

    // IMPROVED PRODUCT MATCHING
    const validProducts = []
    const productMap = new Map(products.map(p => [p.name.toLowerCase(), p]))

    // If AI returned products, try to match them
    if (aiResult.products && Array.isArray(aiResult.products)) {
      for (const item of aiResult.products) {
        // Try exact match first
        const exactMatch = products.find(p =>
          p.name.toLowerCase() === item.name?.toLowerCase()
        )

        // Try partial match if exact fails
        const partialMatch = !exactMatch ? products.find(p =>
          p.name.toLowerCase().includes(item.name?.toLowerCase()) ||
          item.name?.toLowerCase().includes(p.name.toLowerCase())
        ) : null

        const dbProduct = exactMatch || partialMatch

        if (dbProduct) {
          validProducts.push({
            name: dbProduct.name, // Use database name
            quantity: Math.max(1, Math.floor(item.quantity || 10)),
            price: dbProduct.price,
            sustainability: dbProduct.sustainability || []
          })
          console.log(`✅ Matched: "${item.name}" → "${dbProduct.name}"`)
        } else {
          console.log(`❌ No match for: "${item.name}"`)
        }
      }
    }

    // FALLBACK: If no products matched, use smart defaults
    if (validProducts.length === 0) {
      console.log("⚠️ No products matched, using fallback selection")

      // Select products based on requirement
      let fallbackProducts = []

      if (requirement.toLowerCase().includes('gift')) {
        fallbackProducts = products.filter(p =>
          p.category === 'Eco Gifts' || p.name.includes('Bomb') || p.name.includes('Bag')
        )
      } else if (requirement.toLowerCase().includes('office')) {
        fallbackProducts = products.filter(p =>
          p.category === 'Stationery' || p.name.includes('Pen') || p.name.includes('Notebook')
        )
      } else {
        // Default: take first 4 products
        fallbackProducts = products.slice(0, 4)
      }

      // If still empty, take any products
      if (fallbackProducts.length === 0) {
        fallbackProducts = products.slice(0, 4)
      }

      // Add fallback products with default quantities
      fallbackProducts.forEach(p => {
        validProducts.push({
          name: p.name,
          quantity: 25,
          price: p.price,
          sustainability: p.sustainability || []
        })
      })
    }

    // Calculate costs
    let totalCost = 0
    const finalProducts = validProducts.map(p => {
      const cost = p.quantity * p.price
      totalCost += cost
      return {
        name: p.name,
        quantity: p.quantity,
        unitPrice: p.price,
        estimatedCost: cost,
        sustainability: p.sustainability
      }
    })

    // Ensure we're within budget
    if (totalCost > budget) {
      console.log(`⚠️ Total cost ₹${totalCost} exceeds budget ₹${budget}, scaling down...`)

      const scaleFactor = budget / totalCost
      finalProducts.forEach(p => {
        p.quantity = Math.floor(p.quantity * scaleFactor)
        p.estimatedCost = p.quantity * p.unitPrice
      })

      // Recalculate total
      totalCost = finalProducts.reduce((sum, p) => sum + p.estimatedCost, 0)
    }

    // Generate impact summary if AI didn't provide one
    let impactSummary = aiResult.impactSummary
    if (!impactSummary) {
      const totalItems = finalProducts.reduce((sum, p) => sum + p.quantity, 0)
      const uniqueProducts = finalProducts.length

      impactSummary = `This sustainable proposal for ${eventType} includes ${uniqueProducts} eco-friendly products (${totalItems} total items). `

      // Add sustainability highlights
      const sustainableFeatures = []
      if (finalProducts.some(p => p.sustainability?.includes('plastic-free'))) {
        sustainableFeatures.push('plastic-free')
      }
      if (finalProducts.some(p => p.sustainability?.includes('biodegradable'))) {
        sustainableFeatures.push('biodegradable')
      }
      if (finalProducts.some(p => p.sustainability?.includes('recycled'))) {
        sustainableFeatures.push('recycled materials')
      }

      if (sustainableFeatures.length > 0) {
        impactSummary += `Features ${sustainableFeatures.join(', ')} products. `
      }

      impactSummary += `All products stay within the ₹${budget} budget while supporting your ${requirement} needs.`
    }

    // Prepare final result
    const result = {
      products: finalProducts,
      totalCost,
      impactSummary,
      budget: {
        allocated: totalCost,
        remaining: budget - totalCost,
        total: budget
      },
      summary: {
        productCount: finalProducts.length,
        totalItems: finalProducts.reduce((sum, p) => sum + p.quantity, 0)
      }
    }

    // Log the interaction
    await Log.create({
      prompt,
      response: result,
      module: "proposal",
      metadata: {
        eventType,
        budget,
        requirement,
        matchedProducts: validProducts.length
      }
    })

    // Send success response
    res.json({
      success: true,
      data: result,
      message: "Proposal generated successfully"
    })

  } catch (err) {
    console.error("Controller Error:", err)
    res.status(500).json({
      success: false,
      error: "Proposal generation failed",
      details: err.message
    })
  }
}

