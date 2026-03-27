const JobApplication = require("../models/jobApplication");
const Job = require("../models/jobs");
const Candidate = require("../models/candidate");
const mongoose = require("mongoose");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const paginate = (query = {}) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// ─────────────────────────────────────────────
// APPLY FOR A JOB
// POST /api/applications/apply
//
// Resume priority:
//   1. New file uploaded  →  multipart field: "resume"
//   2. useCandidateCV: "true"  →  reuse CV already on candidate profile
//   3. Neither  →  apply without resume
// ─────────────────────────────────────────────
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, candidateId, coverLetter} = req.body;
console.log("gyy",jobId, candidateId, coverLetter);

    if (!jobId || !candidateId) {
      return res.status(400).json({ success: false, message: "jobId and candidateId are required." });
    }
    if (!isValidObjectId(jobId) || !isValidObjectId(candidateId)) {
      return res.status(400).json({ success: false, message: "Invalid jobId or candidateId." });
    }

    // Job checks
    const job = await Job.findById(jobId);
    console.log("jobb",job);
    
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    if (!job.isActive) {
      return res.status(400).json({ success: false, message: "This job is no longer accepting applications." });
    }
    if (job.lastDateToApply && new Date() > new Date(job.lastDateToApply)) {
      return res.status(400).json({ success: false, message: "The application deadline for this job has passed." });
    }
console.log("d");

    // Duplicate check
    const existing = await JobApplication.findOne({ job: jobId, candidate: candidateId });
    if (existing) {
      return res.status(409).json({ success: false, message: "You have already applied for this job." });
    }

    // Candidate
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found." });

    const resume=candidate.cv
    console.log("SSS",candidate,resume);
    
    const application = await JobApplication.create({
      job: jobId,
      candidate: candidateId,
      coverLetter: coverLetter || "",
      resume: resume,
      status: "Applied",
      statusHistory: [{ status: "Applied", note: "Application submitted." }],
    });

    await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

    const populated = await application.populate([
      { path: "job", select: "role company location jobType" },
      { path: "candidate", select: "name email profileId" },
    ]);

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      data: populated,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "You have already applied for this job." });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// GET ALL APPLICATIONS  (HR / admin)
// GET /api/applications?jobId=&candidateId=&status=&page=&limit=
// ─────────────────────────────────────────────
exports.getAllApplications = async (req, res) => {
  try {
    const { jobId, candidateId, status, page, limit } = req.query;
    const { page: pg, limit: lmt, skip } = paginate({ page, limit });

    const filter = {};
    if (jobId && isValidObjectId(jobId)) filter.job = jobId;
    if (candidateId && isValidObjectId(candidateId)) filter.candidate = candidateId;
    if (status) filter.status = status;

    const [applications, total] = await Promise.all([
      JobApplication.find(filter)
        .populate("job", "role location jobType company")
        .populate("candidate", "name email phone profilePhoto cv profileId")
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(lmt)
        .lean(),
      JobApplication.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: applications,
      pagination: {
        total, page: pg, limit: lmt,
        totalPages: Math.ceil(total / lmt),
        hasNextPage: pg < Math.ceil(total / lmt),
        hasPrevPage: pg > 1,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// GET SINGLE APPLICATION BY ID
// GET /api/applications/:id
// ─────────────────────────────────────────────
exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid application ID." });
    }

    const application = await JobApplication.findById(id)
      .populate("job", "role department location jobType workMode company salaryFrom salaryTo currency")
      .populate("candidate", "name email phone profilePhoto cv profileId tagline skills");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    return res.status(200).json({ success: true, data: application });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// GET APPLICATIONS BY CANDIDATE  (candidate dashboard)
// GET /api/applications/candidate/:candidateId?status=&page=&limit=
// ─────────────────────────────────────────────
exports.getApplicationsByCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { status, page, limit } = req.query;

    if (!isValidObjectId(candidateId)) {
      return res.status(400).json({ success: false, message: "Invalid candidate ID." });
    }

    const { page: pg, limit: lmt, skip } = paginate({ page, limit });
    const filter = { candidate: candidateId };
    if (status) filter.status = status;

    const [applications, total] = await Promise.all([
      JobApplication.find(filter)
      .populate({
        path: "job",
        select: "role department location jobType workMode salaryFrom salaryTo currency isActive lastDateToApply",
        populate: {
          path: "company",
          select: "companyName logo",
        },
      })
      .populate({
        path: "candidate",
        select: "name email phone profilePhoto",
      })
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(lmt)
        .lean(),
      JobApplication.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: applications,
      pagination: {
        total, page: pg, limit: lmt,
        totalPages: Math.ceil(total / lmt),
        hasNextPage: pg < Math.ceil(total / lmt),
        hasPrevPage: pg > 1,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// UPDATE APPLICATION STATUS  (HR)
// PATCH /api/applications/:id/status
// Body: { status, note }
// ─────────────────────────────────────────────
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid application ID." });
    }

    const allowedStatuses = ["Applied", "Shortlisted", "Interview", "Selected", "Rejected"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    const application = await JobApplication.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    application.statusHistory.push({ status, changedAt: new Date(), note: note || "" });
    application.status = status;
    await application.save();

    const populated = await application.populate([
      { path: "job", select: "role company" },
      { path: "candidate", select: "name email profileId" },
    ]);

    return res.status(200).json({
      success: true,
      message: `Application status updated to "${status}".`,
      data: populated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// BULK UPDATE STATUS  (HR)
// PATCH /api/applications/bulk-status
// Body: { applicationIds: [...], status, note }
// ─────────────────────────────────────────────
exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { applicationIds, status, note } = req.body;

    if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({ success: false, message: "applicationIds must be a non-empty array." });
    }

    const allowedStatuses = ["Applied", "Shortlisted", "Interview", "Selected", "Rejected"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    const validIds = applicationIds.filter(isValidObjectId);

    await JobApplication.updateMany(
      { _id: { $in: validIds } },
      {
        $set: { status },
        $push: { statusHistory: { status, changedAt: new Date(), note: note || "" } },
      }
    );

    return res.status(200).json({
      success: true,
      message: `${validIds.length} application(s) updated to "${status}".`,
      updatedCount: validIds.length,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// ADD INTERNAL NOTE  (HR private note)
// PATCH /api/applications/:id/note
// Body: { note }
// ─────────────────────────────────────────────
exports.addInternalNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid application ID." });
    }
    if (!note || !note.trim()) {
      return res.status(400).json({ success: false, message: "Note cannot be empty." });
    }

    const application = await JobApplication.findByIdAndUpdate(
      id,
      { internalNote: note.trim() },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Internal note saved.",
      data: { internalNote: application.internalNote },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// GET RESUME URL  (returns the Cloudinary URL — no disk needed)
// GET /api/applications/:id/resume
//
// Returns:
//   resumeUrl   — direct Cloudinary URL (view in browser)
//   downloadUrl — same URL with fl_attachment flag (forces download)
// ─────────────────────────────────────────────
exports.getResumeUrl = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid application ID." });
    }

    const application = await JobApplication.findById(id)
      .select("resume candidate")
      .populate("candidate", "name cv");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    // Prefer application-specific resume, fall back to candidate profile CV
    const resumeUrl = application.resume || application.candidate?.cv || null;

    if (!resumeUrl) {
      return res.status(404).json({ success: false, message: "No resume found for this application." });
    }

    // Cloudinary trick: inserting fl_attachment forces the browser to download instead of preview
    const downloadUrl = resumeUrl.includes("cloudinary.com")
      ? resumeUrl.replace("/upload/", "/upload/fl_attachment/")
      : resumeUrl;

    return res.status(200).json({
      success: true,
      data: {
        resumeUrl,
        downloadUrl,
        candidateName: application.candidate?.name,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// DELETE APPLICATION  (candidate withdraws)
// DELETE /api/applications/:id
// ─────────────────────────────────────────────
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid application ID." });
    }

    const application = await JobApplication.findByIdAndDelete(id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    await Job.findByIdAndUpdate(application.job, { $inc: { applicationsCount: -1 } });

    return res.status(200).json({ success: true, message: "Application withdrawn successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// GET STATUS HISTORY  (full audit trail)
// GET /api/applications/:id/history
// ─────────────────────────────────────────────
exports.getStatusHistory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid application ID." });
    }

    const application = await JobApplication.findById(id)
      .select("statusHistory status candidate job")
      .populate("job", "role")
      .populate("candidate", "name email profileId");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    return res.status(200).json({
      success: true,
      data: {
        currentStatus: application.status,
        candidate: application.candidate,
        job: application.job,
        history: application.statusHistory,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// GET JOB STATS
// GET /api/applications/stats/:jobId
// ─────────────────────────────────────────────
exports.getJobStats = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!isValidObjectId(jobId)) {
      return res.status(400).json({ success: false, message: "Invalid job ID." });
    }

    const job = await Job.findById(jobId).lean();
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });

    const statusBreakdown = await JobApplication.aggregate([
      { $match: { job: new mongoose.Types.ObjectId(jobId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const stats = { openings: job.openings, totalApplications: 0, breakdown: {} };
    statusBreakdown.forEach(({ _id, count }) => {
      stats.breakdown[_id] = count;
      stats.totalApplications += count;
    });

    return res.status(200).json({ success: true, data: stats });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};