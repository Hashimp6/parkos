const mongoose = require("mongoose");
const BUSINESS_PARK_OPTIONS = [
  "Cyberpark",
  "Technopark",
  "Infopark",
  "Smart City",
  "KINFRA Tech Park",
  "Business Park",
  "SEZ",
  "Other",
];
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
      trim: true,
    },

    jobCode: {
      type: String,
      unique: true,
      sparse: true, // allows multiple nulls
    },

    description: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    salary: {
      type: Number,
      default: 0,
      min: 0,
    },

   

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      default: "Full-time",
    },

    workMode: {
      type: String,
      enum: ["Remote", "On-site", "Hybrid"],
      default: "On-site",
    },

    experienceRequired: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },
    businessPark: {
      type: String,
      enum: BUSINESS_PARK_OPTIONS,
      default: "Other",
    },

    openings: {
      type: Number,
      default: 1,
      min: 1,
    },

    postedDate: {
      type: Date,
      default: Date.now,
    },

    lastDateToApply: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // track total applications count (denormalized for perf)
    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Indexes for faster queries
jobSchema.index({ company: 1, isActive: 1 });
jobSchema.index({ role: "text", description: "text", skills: "text" });
jobSchema.index({ jobType: 1, workMode: 1, location: 1 });
jobSchema.index({ postedDate: -1 });
jobSchema.index({ businessPark: 1 });

module.exports = mongoose.model("Job", jobSchema);