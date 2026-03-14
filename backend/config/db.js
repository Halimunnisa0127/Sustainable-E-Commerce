const mongoose = require("mongoose")

// Cache the database connection
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

const connectDB = async () => {
  try {
    if (cached.conn) {
      console.log("📦 Using cached MongoDB connection")
      return cached.conn
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false, // Disable buffering
        bufferMaxEntries: 0,
        connectTimeoutMS: 10000, // 10 seconds
        socketTimeoutMS: 45000, // 45 seconds
        serverSelectionTimeoutMS: 10000 // 10 seconds
      }

      console.log("🔄 Connecting to MongoDB...")
      cached.promise = mongoose.connect(process.env.MONGO_URI, opts)
    }

    cached.conn = await cached.promise
    console.log("✅ MongoDB connected successfully")
    return cached.conn
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message)
    throw error // Let the API handle the error
  }
}

module.exports = connectDB