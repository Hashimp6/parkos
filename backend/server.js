const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

// ✅ Check required env variables on startup
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing env variable: ${key}`);
    process.exit(1);
  } else {
    console.log(`✅ ${key} is loaded`);
  }
});

// ✅ DB with error handling
connectDB().catch((err) => {
  console.error("❌ DB connection failed:", err.message);
  process.exit(1);
});

const app = express();

// ✅ Fix CORS for your Vercel frontend
app.use(cors({
  origin: [
    "https://parkos-inky.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173", // if using Vite
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());
require("./cron/jobExpiry");

// Routes
app.use("/api/candidate", require("./routes/candidate"));
app.use("/api/companies", require("./routes/company"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/jobs-application", require("./routes/JobApplication"));
app.use("/api/freelance", require("./routes/freelancer"));

// Health check + env debug route
app.get("/", (req, res) => {
  res.send("Business Park Job Platform API is running...");
});

// ✅ Env check route — visit this in browser to confirm vars are loaded
app.get("/debug-env", (req, res) => {
  res.json({
    MONGO_URI: process.env.MONGO_URI ? "✅ loaded" : "❌ missing",
    JWT_SECRET: process.env.JWT_SECRET ? "✅ loaded" : "❌ missing",
    EMAIL_USER: process.env.EMAIL_USER ? "✅ loaded" : "❌ missing",
    EMAIL_PASS: process.env.APP_PASS ? "✅ loaded" : "❌ missing",
    PORT: process.env.PORT || "using default 5002",
  });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
