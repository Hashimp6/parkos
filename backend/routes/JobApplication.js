const express = require("express");
const router = express.Router();
const { uploadApplicationResume } = require("../middleware/upload");
const {
  applyForJob,
  getAllApplications,
  getApplicationById,
  getApplicationsByCandidate,
  updateApplicationStatus,
  bulkUpdateStatus,
  addInternalNote,
  getResumeUrl,
  deleteApplication,
  getStatusHistory,
  getJobStats,
} = require("../controllers/jobApplication");

// ── Candidate actions ────────────────────────────────────────────
router.post("/apply",  applyForJob);           // Submit application (+ optional resume file)
router.get("/candidate/:candidateId", getApplicationsByCandidate);     // Candidate's own applications
router.delete("/:id", deleteApplication);                              // Withdraw application

// ── HR / Admin actions ────────────────────────────────────────────
router.get("/", getAllApplications);                                    // All applications (filterable)
router.patch("/bulk-status", bulkUpdateStatus);                        // Bulk status change   ← must be before /:id
router.get("/stats/:jobId", getJobStats);                              // Stats for a job      ← must be before /:id

router.get("/:id", getApplicationById);                                // Single application
router.patch("/:id/status", updateApplicationStatus);                  // Change status
router.patch("/:id/note", addInternalNote);                            // Add internal note
router.get("/:id/resume", getResumeUrl);                               // Get resume / download URL
router.get("/:id/history", getStatusHistory);                          // Full status audit trail

module.exports = router;