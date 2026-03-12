// //proposal.js

const express = require("express")
const router = express.Router()
const { createProposal } = require("../proposalController")

// POST /api/proposal/generate - Generate B2B proposal
router.post("/generate", createProposal)

module.exports = router
