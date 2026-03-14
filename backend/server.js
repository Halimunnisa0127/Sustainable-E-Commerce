// server.js - Add this before your routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('CORS headers will be:', {
    'Access-Control-Allow-Origin': req.headers.origin,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  });
  next();
});



// server.js
require("dotenv").config()

const express = require("express")
const cors = require("cors")
const corsOptions = require("./CorsOptions/corsOptions")
const connectDB = require("./config/db")

// Import routes
const categoryRoutes = require("./module/Auto-Tagging Robot/routes/category")
const proposalRoutes = require("./module/module2-b2b-proposal/routes/proposal")

const app = express()

// Add this middleware to handle preflight requests for all routes
app.options('*', cors(corsOptions)) // This handles preflight requests

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