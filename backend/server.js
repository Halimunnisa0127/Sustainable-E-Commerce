// server.js
require("dotenv").config()

const express = require("express")
const cors = require("cors")
const corsOptions = require("./CorsOptions/corsOptions")
const connectDB = require("./config/db")

// Import routes - make sure these files exist
const categoryRoutes = require("./module/Auto-Tagging Robot/routes/category")
const proposalRoutes = require("./module/module2-b2b-proposal/routes/proposal") // Make sure this is proposal.js, not proposalRoutes.js

const app = express()

app.use(cors(corsOptions))
app.use(express.json())

connectDB()

app.get("/", (req, res) => {
  res.send("Rayeva AI Backend Running")
})

// Use routes
app.use("/api/category", categoryRoutes)
app.use("/api/proposal", proposalRoutes)

const PORT = process.env.PORT || 9000
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})