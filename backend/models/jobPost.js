const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    park: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
    },
    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Contract", "Internship", "Freelance"],
      default: "Full-Time",
    },
    salary: {
      min: { type: Number },
      max: { type: Number },
      period: { type: String, default: "Monthly" }, // Monthly / Yearly
    },
    description: {
      type: String,
    },
    requirements: [
      {
        type: String, // e.g. ["3+ years experience", "B.Tech required"]
      },
    ],
    skills: [
      {
        type: String, // e.g. ["React", "Node.js"]
      },
    ],
    category: {
      type: String, // e.g. "IT", "Marketing", "Finance"
    },
    openings: {
      type: Number,
      default: 1,
    },
    applicants: [
      {
        candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
        appliedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["Applied", "Shortlisted", "Rejected", "Hired"],
          default: "Applied",
        },
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", // the company who posted
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("JobPost", jobPostSchema);