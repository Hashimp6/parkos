const Job = require("../models/jobs");
const JobApplication = require("../models/jobApplication");
const mongoose = require("mongoose");

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
// CREATE JOB
// POST /api/jobs
// ─────────────────────────────────────────────
exports.createJob = async (req, res) => {
  try {
    const {
      company,
      role,
      department,
      jobCode,
      description,
      skills,
      salaryFrom,
      salaryTo,
      currency,
      jobType,
      workMode,
      experienceRequired,
      location,
      openings,
      lastDateToApply,
      isActive,
      businessPark
    } = req.body;

    if (!company || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Company and role are required." });
    }

    if (!isValidObjectId(company)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid company ID." });
    }

    if (salaryFrom && salaryTo && Number(salaryFrom) > Number(salaryTo)) {
      return res.status(400).json({
        success: false,
        message: "salaryFrom cannot be greater than salaryTo.",
      });
    }

    const job = await Job.create({
      company,
      role,
      department,
      jobCode,
      description,
      skills: skills || [],
      salaryFrom,
      salaryTo,
      currency,
      jobType,
      workMode,
      experienceRequired,
      location,
      openings,
      lastDateToApply,
      isActive,
      businessPark
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully.",
      data: job,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Job code already exists.",
      });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// UPDATE JOB
// PUT /api/jobs/:id
// ─────────────────────────────────────────────
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid job ID." });
    }

    const {
      salaryFrom,
      salaryTo,
      role,
      department,
      jobCode,
      description,
      skills,
      currency,
      jobType,
      workMode,
      experienceRequired,
      location,
      openings,
      lastDateToApply,
      isActive,
      businessPark
    } = req.body;

    if (salaryFrom !== undefined && salaryTo !== undefined) {
      if (Number(salaryFrom) > Number(salaryTo)) {
        return res.status(400).json({
          success: false,
          message: "salaryFrom cannot be greater than salaryTo.",
        });
      }
    }

    const allowedUpdates = {
      role,
      department,
      jobCode,
      description,
      skills,
      salaryFrom,
      salaryTo,
      currency,
      jobType,
      workMode,
      experienceRequired,
      location,
      openings,
      lastDateToApply,
      isActive,
      businessPark
    };

    // strip undefined keys
    Object.keys(allowedUpdates).forEach(
      (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const job = await Job.findByIdAndUpdate(id, allowedUpdates, {
      new: true,
      runValidators: true,
    }).populate("company", "name logo");

    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Job updated successfully.",
      data: job,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Job code already exists.",
      });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// DELETE JOB
// DELETE /api/jobs/:id
// ─────────────────────────────────────────────
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid job ID." });
    }

    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found." });
    }

    // Remove all applications tied to this job
    await JobApplication.deleteMany({ job: id });

    return res.status(200).json({
      success: true,
      message: "Job and related applications deleted successfully.",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// GET SINGLE JOB BY ID
// GET /api/jobs/:id
// ─────────────────────────────────────────────
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid job ID." });
    }

    const job = await Job.findById(id).populate("company", "name logo website");

    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found." });
    }

    return res.status(200).json({ success: true, data: job });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// GET JOB WITH CANDIDATES (applications)
// GET /api/jobs/:id/candidates
// ─────────────────────────────────────────────
exports.getJobWithCandidates = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, page, limit } = req.query;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid job ID." });
    }

    const job = await Job.findById(id).populate("company", "name logo");
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found." });
    }

    const { page: pg, limit: lmt, skip } = paginate({ page, limit });

    const filter = { job: id };
    if (status) filter.status = status;

    const [applications, total] = await Promise.all([
      JobApplication.find(filter)
        .populate("candidate", "name email phone resume")
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(lmt),
      JobApplication.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        job,
        applications,
        pagination: {
          total,
          page: pg,
          limit: lmt,
          totalPages: Math.ceil(total / lmt),
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// GET JOBS BY COMPANY ID
// GET /api/jobs/company/:companyId
// ─────────────────────────────────────────────
exports.getJobsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { isActive, jobType, workMode, page, limit } = req.query;

    if (!isValidObjectId(companyId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid company ID." });
    }

    const { page: pg, limit: lmt, skip } = paginate({ page, limit });

    const filter = { company: companyId };
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (jobType) filter.jobType = jobType;
    if (workMode) filter.workMode = workMode;

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate("company", "name logo")
        .sort({ postedDate: -1 })
        .skip(skip)
        .limit(lmt),
      Job.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page: pg,
        limit: lmt,
        totalPages: Math.ceil(total / lmt),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// GET ALL JOBS — with filter + search + pagination
// GET /api/jobs
//
// Query params:
//   search        — text search on role / description / skills
//   company       — company ObjectId
//   jobType       — Full-time | Part-time | Internship | Contract
//   workMode      — Remote | On-site | Hybrid
//   location      — partial match
//   department    — partial match
//   skills        — comma-separated list (e.g. React,Node)
//   isActive      — true | false
//   salaryMin     — min salaryFrom
//   salaryMax     — max salaryTo
//   currency      — INR | USD …
//   postedAfter   — ISO date string
//   postedBefore  — ISO date string
//   sortBy        — postedDate | salaryFrom | openings (default: postedDate)
//   sortOrder     — asc | desc (default: desc)
//   page          — page number (default: 1)
//   limit         — items per page (default: 10, max: 100)
// ─────────────────────────────────────────────
exports.getAllJobs = async (req, res) => {
  try {
    const {
      search,
      company,
      jobType,
      workMode,
      location,
      department,
      skills,
      isActive,
      salaryMin,
      salaryMax,
      currency,
      postedAfter,
      postedBefore,
      sortBy = "postedDate",
      sortOrder = "desc",
      page,
      limit,
      businessPark
    } = req.query;

    const { page: pg, limit: lmt, skip } = paginate({ page, limit });

    const filter = {};

    // Text search
    if (search && search.trim()) {
      filter.$or = [
        { role: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
        { skills: { $elemMatch: { $regex: search.trim(), $options: "i" } } },
        { department: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Exact / ID filters
    if (company && isValidObjectId(company)) filter.company = company;
    if (jobType) filter.jobType = jobType;
    if (workMode) filter.workMode = workMode;
    if (currency) filter.currency = currency.toUpperCase();
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (businessPark) {
      filter.businessPark = businessPark;
    }
    // Partial text filters
    if (location) filter.location = { $regex: location.trim(), $options: "i" };
    if (department)
      filter.department = { $regex: department.trim(), $options: "i" };

    // Skills filter (comma-separated → array)
    if (skills) {
      const skillArr = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (skillArr.length) {
        filter.skills = {
          $elemMatch: {
            $in: skillArr.map((s) => new RegExp(`^${s}$`, "i")),
          },
        };
      }
    }

    // Salary range
    if (salaryMin || salaryMax) {
      filter.salaryFrom = {};
      if (salaryMin) filter.salaryFrom.$gte = Number(salaryMin);
      if (salaryMax) filter.salaryTo = { $lte: Number(salaryMax) };
    }

    // Date range
    if (postedAfter || postedBefore) {
      filter.postedDate = {};
      if (postedAfter) filter.postedDate.$gte = new Date(postedAfter);
      if (postedBefore) filter.postedDate.$lte = new Date(postedBefore);
    }

    // Sorting
    const allowedSortFields = ["postedDate", "salaryFrom", "openings", "createdAt"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "postedDate";
    const sortDir = sortOrder === "asc" ? 1 : -1;

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate("company", "companyName logo location")
        .sort({ [sortField]: sortDir })
        .skip(skip)
        .limit(lmt)
        .lean(),
      Job.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page: pg,
        limit: lmt,
        totalPages: Math.ceil(total / lmt),
        hasNextPage: pg < Math.ceil(total / lmt),
        hasPrevPage: pg > 1,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// controllers/jobSearch.js


exports.searchJobs = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const pipeline = [];

    // 🔗 JOIN company collection
    pipeline.push({
      $lookup: {
        from: "companies", // ⚠️ collection name (must be correct)
        localField: "company",
        foreignField: "_id",
        as: "company",
      },
    });

    // convert array → object
    pipeline.push({
      $unwind: {
        path: "$company",
        preserveNullAndEmptyArrays: true,
      },
    });

    // 🔍 SEARCH logic
    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");

      pipeline.push({
        $match: {
          $or: [
            { role: regex },
            { department: regex },
            { description: regex },
            { skills: { $elemMatch: { $regex: regex } } },
            { "company.companyName": regex }, // ✅ company name search
          ],
        },
      });
    }

    // only active jobs (optional but recommended)
    pipeline.push({
      $match: { isActive: true },
    });

    // sorting
    pipeline.push({
      $sort: { postedDate: -1 },
    });

    // pagination
    pipeline.push({ $skip: Number(skip) });
    pipeline.push({ $limit: Number(limit) });

    // ▶ run aggregation
    const jobs = await Job.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      data: jobs,
    });

  } catch (err) {
    console.error("Search Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ─────────────────────────────────────────────
// TOGGLE JOB ACTIVE STATUS
// PATCH /api/jobs/:id/toggle
// ─────────────────────────────────────────────
exports.toggleJobStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid job ID." });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found." });
    }

    job.isActive = !job.isActive;
    await job.save();

    return res.status(200).json({
      success: true,
      message: `Job ${job.isActive ? "activated" : "deactivated"} successfully.`,
      data: { isActive: job.isActive },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// JOB STATS  (openings, applications breakdown)
// GET /api/jobs/:id/stats
// ─────────────────────────────────────────────
exports.getJobStats = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid job ID." });
    }

    const job = await Job.findById(id).lean();
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found." });
    }

    const statusBreakdown = await JobApplication.aggregate([
      { $match: { job: new mongoose.Types.ObjectId(id) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const stats = {
      openings: job.openings,
      totalApplications: 0,
      breakdown: {},
    };

    statusBreakdown.forEach(({ _id, count }) => {
      stats.breakdown[_id] = count;
      stats.totalApplications += count;
    });

    return res.status(200).json({ success: true, data: stats });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};