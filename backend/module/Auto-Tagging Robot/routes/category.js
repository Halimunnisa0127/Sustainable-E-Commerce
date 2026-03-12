// const express = require("express")
// const router = express.Router()
// const { createCategory, getCategories } = require("../module2-b2b-proposal/categoryController")

// // POST /api/category - Generate category suggestions
// router.post("/", createCategory)

// // GET /api/category - Get all categories
// router.get("/", getCategories)

// module.exports = router

const express = require("express")
const router = express.Router()
const {
  generateCategories,
  bulkGenerateCategories,
  getCategories,
  updateProductCategories
} = require("../categoryController")

// GET all categories
router.get("/", getCategories)

// POST generate categories for a product
router.post("/generate", generateCategories)

// POST bulk generate categories
router.post("/bulk-generate", bulkGenerateCategories)

// PUT update product categories
router.put("/product/:productId", updateProductCategories)

module.exports = router