const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
{
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },

  role: {
    type: String,
    required: true,
    trim: true,
  },

  department: {
    type: String,
    default: "",
  },

  jobCode: {
    type: String,
    unique: true,
  },

  description: {
    type: String,
    default: "",
  },

  // skills required
  skills: [
    {
      type: String,
      trim: true,
    },
  ],

  // salary
  salaryFrom: {
    type: Number,
    default: 0,
  },

  salaryTo: {
    type: Number,
    default: 0,
  },

  currency: {
    type: String,
    default: "INR",
  },

  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Internship", "Contract"],
    default: "Full-time",
  },

  experienceRequired: {
    type: String,
    default: "",
  },

  location: {
    type: String,
    default: "",
  },

  openings: {
    type: Number,
    default: 1,
  },

  postedDate: {
    type: Date,
    default: Date.now,
  },

  lastDateToApply: {
    type: Date,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

},
{ timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);