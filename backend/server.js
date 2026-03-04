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
// app.use("/api/company", require("./routes/companyRoutes")); // Mini website profiles

// Health check
app.get("/", (req, res) => {
  res.send("Business Park Job Platform API is running...");
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 