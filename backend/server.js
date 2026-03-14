// Add this BEFORE your routes to see all requests
app.use((req, res, next) => {
  console.log('📨 Incoming request:');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Origin:', req.headers.origin);
  console.log('User-Agent:', req.headers['user-agent']);
  
  // Check if it's a preflight request
  if (req.method === 'OPTIONS') {
    console.log('🔧 Preflight request detected');
    console.log('Request headers:', req.headers);
  }
  
  next();
});
// server.js
require("dotenv").config()

const express = require("express")
const cors = require("cors")
// const corsOptions = require("./CorsOptions/corsOptions") // COMMENT THIS OUT - we're replacing it
const connectDB = require("./config/db")

// Import routes - make sure these files exist
const categoryRoutes = require("./module/Auto-Tagging Robot/routes/category")
const proposalRoutes = require("./module/module2-b2b-proposal/routes/proposal")

const app = express()

// =============================================
// ✅ ADD YOUR NEW CORS CONFIGURATION HERE
// =============================================
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://sustainable-e-commerce-8qd3.vercel.app",
      "https://sustainable-e-commerce.vercel.app"
    ];
    
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('🚫 Blocked origin:', origin);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// IMPORTANT: Handle preflight requests
app.options('*', cors(corsOptions));

// =============================================
// ✅ REST OF YOUR MIDDLEWARE
// =============================================
app.use(express.json())

connectDB()

// =============================================
// ✅ YOUR ROUTES COME AFTER CORS
// =============================================
app.get("/", (req, res) => {
  res.send("Rayeva AI Backend Running")
})

// Use routes
app.use("/api/category", categoryRoutes)
app.use("/api/proposal", proposalRoutes)

// =============================================
// ✅ ERROR HANDLING (optional but good)
// =============================================
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 9000
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})

process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION:', err);
  console.error('Stack:', err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 UNHANDLED REJECTION:', reason);
});