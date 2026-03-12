// bulkCategoryController.js - Handles bulk category generation for multiple products
const { generateCategoryTags } = require("../services/aiService");
const Log = require("../../modelsShemas/Log");
const {
  validateCategoryResponse
} = require("../../utils/categoryHelpers");

// Bulk generate categories for multiple products
exports.bulkGenerateCategories = async (req, res) => {
  try {
    const { products } = req.body;
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Products array is required"
      });
    }

    console.log(`📦 Bulk generating categories for ${products.length} products`);

    const results = [];
    const errors = [];

    // Process products sequentially to avoid rate limits
    for (let i = 0; i < products.length; i++) {
      const { productName, description } = products[i];
      
      try {
        console.log(`Processing ${i + 1}/${products.length}: ${productName}`);
        
        const aiResponse = await generateCategoryTags(productName, description);
        
        if (aiResponse) {
          const categories = validateCategoryResponse(aiResponse, productName);
          results.push({
            productName,
            ...categories,
            status: 'success'
          });
        } else {
          errors.push({
            productName,
            error: 'AI generation failed',
            status: 'failed'
          });
        }
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (err) {
        errors.push({
          productName,
          error: err.message,
          status: 'failed'
        });
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
    });

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
    });

  } catch (err) {
    console.error("Bulk Category Error:", err);
    res.status(500).json({
      success: false,
      error: "Bulk generation failed",
      details: err.message
    });
  }
};

// Bulk update products with categories
exports.bulkUpdateProductCategories = async (req, res) => {
  try {
    const { updates } = req.body;
    
    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Updates array is required"
      });
    }

    console.log(`📦 Bulk updating ${updates.length} products`);

    const results = [];
    const errors = [];

    for (let i = 0; i < updates.length; i++) {
      const { productId, category, subCategory, tags, sustainability } = updates[i];
      
      try {
        // This would require importing Product model
        // You can add the update logic here if needed
        results.push({
          productId,
          status: 'pending',
          message: 'Update functionality to be implemented'
        });
      } catch (err) {
        errors.push({
          productId,
          error: err.message,
          status: 'failed'
        });
      }
    }

    res.json({
      success: true,
      data: {
        processed: updates.length,
        successful: results.length,
        failed: errors.length,
        results,
        errors: errors.length > 0 ? errors : undefined
      },
      message: `Processed ${updates.length} updates.`
    });

  } catch (err) {
    console.error("Bulk Update Error:", err);
    res.status(500).json({
      success: false,
      error: "Bulk update failed",
      details: err.message
    });
  }
};