require("dotenv").config()
const express = require("express")
const cors = require("cors")
const corsOptions = require("./CorsOptions/corsOptions")
const connectDB = require("./config/db")

const categoryRoutes = require("./module/Auto-Tagging Robot/routes/category")
const proposalRoutes = require("./module/module2-b2b-proposal/routes/proposal")

const app = express()

app.use(express.json())
app.use(cors(corsOptions)) // This already handles OPTIONS preflight

connectDB()

app.get("/", (req, res) => {
  res.send("EcoMind AI Backend Running")
})

app.use("/api/category", categoryRoutes)
app.use("/api/proposal", proposalRoutes)


const PORT = process.env.PORT || 9000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();