// categoryController.js - Handles category generation and management
const {generateCategoryTags}= require("../services/aiService")
const Product = require("../../modelsShemas/Product")
const Log = require("../../modelsShemas/Log")
const {
  validateCategoryResponse,
  generateSlug,
  suggestRelatedCategories,
  VALID_CATEGORIES
} = require("../../utils/categoryHelpers")
// Generate categories for a single product
exports.generateCategories = async (req, res) => {
  try {
    const { productName, description, price, existingProductId } = req.body

    if (!productName) {
      return res.status(400).json({
        success: false,
        error: "Product name is required"
      })
    }

    console.log(`🔍 Generating categories for: "${productName}"`)

    // Get AI suggestions
    const aiResponse = await generateCategoryTags(productName, description)
    
    if (!aiResponse) {
      return res.status(500).json({
        success: false,
        error: "AI generation failed"
      })
    }

    // Validate and clean AI response
    const categories = validateCategoryResponse(aiResponse, productName)
    
    // Generate additional metadata
    const slug = generateSlug(productName)
    const relatedCategories = suggestRelatedCategories(productName, categories.primaryCategory)
    
    // Prepare final result
    const result = {
      productName,
      ...categories,
      slug,
      relatedCategories,
      metadata: {
        generatedAt: new Date(),
        model: "llama-3.1-8b-instruct",
        confidence: categories.confidence
      }
    }

    // If existingProductId provided, update the product
    if (existingProductId) {
      await Product.findByIdAndUpdate(existingProductId, {
        category: categories.primaryCategory,
        subCategory: categories.subCategory,
        tags: categories.seoTags,
        sustainability: categories.sustainabilityFilters,
        slug: slug
      })
      console.log(`✅ Updated product: ${existingProductId}`)
    }

    // Log the interaction
    await Log.create({
      prompt: `Generate categories for: ${productName}`,
      response: result,
      module: "category-generator",
      metadata: {
        productName,
        description: description || 'none'
      }
    })

    // Send response
    res.json({
      success: true,
      data: result,
      message: "Categories generated successfully"
    })

  } catch (err) {
    console.error("Category Controller Error:", err)
    res.status(500).json({
      success: false,
      error: "Category generation failed",
      details: err.message
    })
  }
}

// Bulk generate categories for multiple products
exports.bulkGenerateCategories = async (req, res) => {
  try {
    const { products } = req.body
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Products array is required"
      })
    }

    console.log(`📦 Bulk generating categories for ${products.length} products`)

    const results = []
    const errors = []

    // Process products sequentially to avoid rate limits
    for (let i = 0; i < products.length; i++) {
      const { productName, description } = products[i]
      
      try {
        console.log(`Processing ${i + 1}/${products.length}: ${productName}`)
        
        const aiResponse = await generateCategoryTags(productName, description)
        
        if (aiResponse) {
          const categories = validateCategoryResponse(aiResponse, productName)
          results.push({
            productName,
            ...categories,
            status: 'success'
          })
        } else {
          errors.push({
            productName,
            error: 'AI generation failed',
            status: 'failed'
          })
        }
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500))
        
      } catch (err) {
        errors.push({
          productName,
          error: err.message,
          status: 'failed'
        })
      }
    }

    // Log bulk operation
    await Log.create({
      prompt: `Bulk generate for ${products.length} products`,
      response: { success: results.length, failed: errors.length },
      module: "category-bulk-generator",
      metadata: {
        total: products.length,
        successful: results.length,
        failed: errors.length
      }
    })

    res.json({
      success: true,
      data: {
        processed: products.length,
        successful: results.length,
        failed: errors.length,
        results,
        errors: errors.length > 0 ? errors : undefined
      },
      message: `Processed ${products.length} products. ${results.length} successful, ${errors.length} failed.`
    })

  } catch (err) {
    console.error("Bulk Category Error:", err)
    res.status(500).json({
      success: false,
      error: "Bulk generation failed",
      details: err.message
    })
  }
}

// Get all available categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category')
    const subCategories = await Product.distinct('subCategory')
    
    res.json({
      success: true,
      data: {
        mainCategories: VALID_CATEGORIES,
        usedCategories: categories.filter(Boolean),
        usedSubCategories: subCategories.filter(Boolean),
        sustainabilityFilters: [
          'plastic-free', 'compostable', 'vegan', 'recycled',
          'biodegradable', 'reusable', 'organic', 'zero-waste'
        ]
      }
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
}

// Update product with categories
exports.updateProductCategories = async (req, res) => {
  try {
    const { productId } = req.params
    const { category, subCategory, tags, sustainability } = req.body

    const product = await Product.findByIdAndUpdate(
      productId,
      {
        category,
        subCategory,
        tags,
        sustainability,
        updatedAt: new Date()
      },
      { new: true }
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found"
      })
    }

    res.json({
      success: true,
      data: product,
      message: "Product categories updated successfully"
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
}

