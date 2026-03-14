require("dotenv").config()

const allowedOrigins = [
  "http://localhost:5173",
  "https://sustainable-e-commerce-8qd3.vercel.app",
  "https://sustainable-e-commerce.vercel.app"
]

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
}

module.exports = corsOptions