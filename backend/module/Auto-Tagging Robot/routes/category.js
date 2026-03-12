const express = require("express");
const router = express.Router();

// Import from the actual files
const categoryController = require("../categoryController");
const bulkCategoryController = require("../bulkCategoryController");

// GET all categories
router.get("/", categoryController.getCategories);

// POST generate categories for a product
router.post("/generate", categoryController.generateCategories);

// POST bulk generate categories
router.post("/bulk-generate", bulkCategoryController.bulkGenerateCategories);

// PUT update product categories
router.put("/product/:productId", categoryController.updateProductCategories);

module.exports = router;