const express = require("express");
const router = express.Router();
const {
  createJob,
  updateJob,
  deleteJob,
  getJobById,
  getJobWithCandidates,
  getJobsByCompany,
  getAllJobs,
  toggleJobStatus,
  getJobStats,
} = require("../controllers/jobs");

// ─────────────────────────────────────────────
// Plug in your auth middleware below if needed
// e.g.  const { protect } = require("../middleware/auth");
// ─────────────────────────────────────────────

// Collection routes
router.get("/", getAllJobs);               // GET  /api/jobs               — list + filter + search + pagination
router.post("/", createJob);              // POST /api/jobs               — create

// Company-scoped
router.get("/company/:companyId", getJobsByCompany); // GET /api/jobs/company/:companyId

// Single-job routes  (keep after /company/:companyId to avoid param clash)
router.get("/:id", getJobById);           // GET    /api/jobs/:id
router.put("/:id", updateJob);            // PUT    /api/jobs/:id
router.delete("/:id", deleteJob);         // DELETE /api/jobs/:id
router.patch("/:id/toggle", toggleJobStatus); // PATCH  /api/jobs/:id/toggle

// Sub-resources
router.get("/:id/candidates", getJobWithCandidates); // GET /api/jobs/:id/candidates
router.get("/:id/stats", getJobStats);               // GET /api/jobs/:id/stats

module.exports = router;