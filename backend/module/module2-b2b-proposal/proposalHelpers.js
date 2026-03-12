// utils/proposalHelpers.js

exports.matchProductsFromAI = (aiResult, products) => {
  const validProducts = [];
  const productMap = new Map(products.map(p => [p.name.toLowerCase(), p]));

  // If AI returned products, try to match them
  if (aiResult.products && Array.isArray(aiResult.products)) {
    for (const item of aiResult.products) {
      // Try exact match first
      const exactMatch = products.find(p =>
        p.name.toLowerCase() === item.name?.toLowerCase()
      );

      // Try partial match if exact fails
      const partialMatch = !exactMatch ? products.find(p =>
        p.name.toLowerCase().includes(item.name?.toLowerCase()) ||
        item.name?.toLowerCase().includes(p.name.toLowerCase())
      ) : null;

      const dbProduct = exactMatch || partialMatch;

      if (dbProduct) {
        validProducts.push({
          name: dbProduct.name, // Use database name
          quantity: Math.max(1, Math.floor(item.quantity || 10)),
          price: dbProduct.price,
          sustainability: dbProduct.sustainability || []
        });
        console.log(`✅ Matched: "${item.name}" → "${dbProduct.name}"`);
      } else {
        console.log(`❌ No match for: "${item.name}"`);
      }
    }
  }

  return validProducts;
};
/* Fallback products when AI fails to generate a valid proposal */
exports.getFallbackProducts = (products, requirement) => {
  const validProducts = [];
  let fallbackProducts = [];

  if (requirement.toLowerCase().includes('gift')) {
    fallbackProducts = products.filter(p =>
      p.category === 'Eco Gifts' || 
      p.name.includes('Bomb') || 
      p.name.includes('Bag')
    );
  } else if (requirement.toLowerCase().includes('office')) {
    fallbackProducts = products.filter(p =>
      p.category === 'Stationery' || 
      p.name.includes('Pen') || 
      p.name.includes('Notebook')
    );
  } else {
    // Default: take first 4 products
    fallbackProducts = products.slice(0, 4);
  }

  // If still empty, take any products
  if (fallbackProducts.length === 0) {
    fallbackProducts = products.slice(0, 4);
  }

  // Add fallback products with default quantities
  fallbackProducts.forEach(p => {
    validProducts.push({
      name: p.name,
      quantity: 25,
      price: p.price,
      sustainability: p.sustainability || []
    });
  });

  return validProducts;
};
/* Calculate total costs and ensure proposal is within budget */
exports.calculateCostsAndBudget = (products, budget) => {
  let totalCost = 0;
  
  // Calculate initial costs
  const finalProducts = products.map(p => {
    const cost = p.quantity * p.price;
    totalCost += cost;
    return {
      name: p.name,
      quantity: p.quantity,
      unitPrice: p.price,
      estimatedCost: cost,
      sustainability: p.sustainability
    };
  });

  // Ensure we're within budget
  if (totalCost > budget) {
    console.log(`⚠️ Total cost ₹${totalCost} exceeds budget ₹${budget}, scaling down...`);

    const scaleFactor = budget / totalCost;
    totalCost = 0;
    
    finalProducts.forEach(p => {
      p.quantity = Math.floor(p.quantity * scaleFactor);
      p.estimatedCost = p.quantity * p.unitPrice;
      totalCost += p.estimatedCost;
    });
  }

  return { finalProducts, totalCost };
};

/* Generate impact summary based on selected products and event details */
exports.generateImpactSummary = (products, eventType, requirement, budget, totalCost) => {
  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
  const uniqueProducts = products.length;

  let summary = `This sustainable proposal for ${eventType} includes ${uniqueProducts} eco-friendly products (${totalItems} total items). `;

  // Add sustainability highlights
  const sustainableFeatures = [];
  if (products.some(p => p.sustainability?.includes('plastic-free'))) {
    sustainableFeatures.push('plastic-free');
  }
  if (products.some(p => p.sustainability?.includes('biodegradable'))) {
    sustainableFeatures.push('biodegradable');
  }
  if (products.some(p => p.sustainability?.includes('recycled'))) {
    sustainableFeatures.push('recycled materials');
  }

  if (sustainableFeatures.length > 0) {
    summary += `Features ${sustainableFeatures.join(', ')} products. `;
  }

  summary += `All products stay within the ₹${budget} budget while supporting your ${requirement} needs.`;

  return summary;
};

/* Validate proposal data before saving or sending response */
exports.validateProposal = (proposalData) => {
  const errors = [];

  if (!proposalData.products || !Array.isArray(proposalData.products)) {
    errors.push("Products must be an array");
  }

  if (proposalData.products && proposalData.products.length === 0) {
    errors.push("At least one product is required");
  }

  if (proposalData.totalCost < 0) {
    errors.push("Total cost cannot be negative");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};