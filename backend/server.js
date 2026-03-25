const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/candidate", require("./routes/candidate"));
// app.use("/api/employer", require("./routes/employerRoutes"));
// app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/companies", require("./routes/company")); // Mini website profiles
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/jobs-application", require("./routes/JobApplication"));
app.use("/api/freelance", require("./routes/freelancer"));
// Health check
app.get("/", (req, res) => {
  res.send("Business Park Job Platform API is running...");
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});