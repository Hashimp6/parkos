const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

// ✅ Check required env variables on startup
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "BREVO_API_KEY"];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing env variable: ${key}`);
    process.exit(1);
  } else {
    console.log(`✅ ${key} is loaded`);
  }
});

const app = express();

// ✅ CORS
app.use(cors({
  origin: [
    "https://parkos-inky.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5178",
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

// Health check
app.get("/", (req, res) => {
  res.send("Business Park Job Platform API is running...");
});

// Env debug route
app.get("/debug-env", (req, res) => {
  res.json({
    MONGO_URI: process.env.MONGO_URI ? "✅ loaded" : "❌ missing",
    JWT_SECRET: process.env.JWT_SECRET ? "✅ loaded" : "❌ missing",
    EMAIL_USER: process.env.EMAIL_USER ? "✅ loaded" : "❌ missing",
    BREVO_API_KEY: process.env.BREVO_API_KEY ? "✅ loaded" : "❌ missing",
    PORT: process.env.PORT || "using default 5002",
  });
});

const PORT = process.env.PORT || 5002;

// ✅ Listen FIRST so Railway health check passes immediately
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);

  // ✅ Connect DB after port is open
  connectDB()
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => {
      console.error("❌ DB connection failed:", err.message);
      process.exit(1);
    });
});

// ✅ Graceful shutdown — prevents Railway SIGTERM from crashing with npm error
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});