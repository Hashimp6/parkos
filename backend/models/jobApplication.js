const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
{
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },

  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true,
  },

  resume: {
    type: String,
    default: "",
  },

  coverLetter: {
    type: String,
    default: "",
  },

  status: {
    type: String,
    enum: [
      "Applied",
      "Shortlisted",
      "Interview",
      "Selected",
      "Rejected"
    ],
    default: "Applied",
  },

  appliedAt: {
    type: Date,
    default: Date.now,
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);