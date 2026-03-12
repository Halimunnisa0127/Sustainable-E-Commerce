// controllers/proposalController.js
const { generateProposal } = require("../services/aiService");
const Product = require("../../modelsShemas/Product");
const Log = require("../../modelsShemas/Log");
const {
  matchProductsFromAI,
  getFallbackProducts,
  calculateCostsAndBudget,
  generateImpactSummary
} = require("./proposalHelpers");

exports.createProposal = async (req, res) => {
  try {
    const { eventType, budget, requirement } = req.body;

    if (!eventType || !budget || !requirement) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }

    // Get products from database
    const products = await Product.find();
    console.log(`Found ${products.length} products in database`);

    // Create better product list with categories
    const productList = products
      .map(p => `- ${p.name} (₹${p.price}) - ${p.sustainability?.join(', ') || 'eco-friendly'}`)
      .join("\n");

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
`;

    // Get AI response
    const aiResult = await generateProposal(prompt);

    if (!aiResult) {
      return res.status(500).json({
        success: false,
        error: "AI generation failed"
      });
    }

    console.log("AI RAW RESPONSE:", JSON.stringify(aiResult, null, 2));

    // Match products from AI response
    let validProducts = matchProductsFromAI(aiResult, products);

    // FALLBACK: If no products matched, use smart defaults
    if (validProducts.length === 0) {
      console.log("⚠️ No products matched, using fallback selection");
      validProducts = getFallbackProducts(products, requirement);
    }

    // Calculate costs and ensure budget compliance
    const { finalProducts, totalCost } = calculateCostsAndBudget(
      validProducts,
      budget
    );

    // Generate impact summary if AI didn't provide one
    let impactSummary = aiResult.impactSummary;
    if (!impactSummary) {
      impactSummary = generateImpactSummary(
        finalProducts,
        eventType,
        requirement,
        budget,
        totalCost
      );
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
    };

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
    });

    // Send success response
    res.json({
      success: true,
      data: result,
      message: "Proposal generated successfully"
    });

  } catch (err) {
    console.error("Controller Error:", err);
    res.status(500).json({
      success: false,
      error: "Proposal generation failed",
      details: err.message
    });
  }
};