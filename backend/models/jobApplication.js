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
      enum: ["Applied", "Shortlisted", "Interview", "Selected", "Rejected"],
      default: "Applied",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },

    // Track status change history
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["Applied", "Shortlisted", "Interview", "Selected", "Rejected"],
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
          default: "",
        },
      },
    ],

    // notes/remarks by HR
    internalNote: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications
jobApplicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
jobApplicationSchema.index({ job: 1, status: 1 });
jobApplicationSchema.index({ candidate: 1, appliedAt: -1 });

module.exports = mongoose.model("JobApplication", jobApplicationSchema);