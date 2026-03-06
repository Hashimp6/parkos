const Company = require("../models/company");
const jwt = require("jsonwebtoken");

// ─── Helper: generate JWT ─────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ─── Helper: send token response ─────────────────────────────────────────────
const sendToken = (company, statusCode, res) => {
  const token = generateToken(company._id);
  company.password = undefined; // strip password from output
  res.status(statusCode).json({ success: true, token, data: company });
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/companies/register
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { companyName, email, phone, password } = req.body;

    if (!companyName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "companyName, email and password are required." });
    }

    const existing = await Company.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email is already registered." });
    }

    const company = await Company.create({ companyName, email, phone, password });
    sendToken(company, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/companies/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    const company = await Company.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!company || !(await company.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    if (!company.isActive) {
      return res
        .status(403)
        .json({ success: false, message: "This account has been deactivated." });
    }

    sendToken(company, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/companies
// @access  Public  (add auth middleware if you want to restrict)
// Supports: ?page=1&limit=10&industry=IT&businessPark=Technopark&search=acme
// ─────────────────────────────────────────────────────────────────────────────
exports.getAllCompanies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      industry,
      businessPark,
      search,
      isVerified,
    } = req.query;

    const filter = { isActive: true };
    if (industry)     filter.industry     = industry;
    if (businessPark) filter.businessPark = businessPark;
    if (isVerified !== undefined) filter.isVerified = isVerified === "true";
    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { tagline:     { $regex: search, $options: "i" } },
        { tags:        { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [companies, total] = await Promise.all([
      Company.find(filter)
        .select("-password -contacts.whatsapp") // hide sensitive fields in lists
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Company.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
      data:  companies,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/companies/:id
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company || !company.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found." });
    }
    res.status(200).json({ success: true, data: company });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/companies/me
// @access  Private (requires auth middleware that sets req.company)
// ─────────────────────────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const company = await Company.findById(req.company._id);
    res.status(200).json({ success: true, data: company });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/companies/me
// @access  Private
// Full profile update — send only the fields you want to change.
// Nested objects (address, contacts) are merged, not replaced.
// ─────────────────────────────────────────────────────────────────────────────
exports.updateCompany = async (req, res) => {
  try {
    // Fields that must NOT be changed via this endpoint
    const restricted = ["password", "email", "isVerified", "isActive"];
    restricted.forEach((f) => delete req.body[f]);

    // Merge nested objects instead of overwriting them wholesale
    const update = { ...req.body };
    if (req.body.address) {
      update.$set = {};
      Object.entries(req.body.address).forEach(([k, v]) => {
        update.$set[`address.${k}`] = v;
      });
      delete update.address;
    }
    if (req.body.contacts) {
      update.$set = update.$set || {};
      Object.entries(req.body.contacts).forEach(([k, v]) => {
        update.$set[`contacts.${k}`] = v;
      });
      delete update.contacts;
    }

    const company = await Company.findByIdAndUpdate(
      req.company._id,
      update,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: company });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PATCH /api/companies/me/field
// @access  Private
// Update a SINGLE top-level field (or one nested key).
// Body: { "field": "tagline", "value": "We build great things" }
//   or  { "field": "address.city", "value": "Kochi" }
//   or  { "field": "contacts.linkedin", "value": "https://..." }
// ─────────────────────────────────────────────────────────────────────────────
exports.updateField = async (req, res) => {
  try {
    const { field, value } = req.body;

    if (!field || value === undefined) {
      return res
        .status(400)
        .json({ success: false, message: '"field" and "value" are required.' });
    }

    const restricted = ["password", "email", "isVerified", "isActive", "_id"];
    if (restricted.some((r) => field.startsWith(r))) {
      return res
        .status(403)
        .json({ success: false, message: `Field "${field}" cannot be updated here.` });
    }

    const company = await Company.findByIdAndUpdate(
      req.company._id,
      { $set: { [field]: value } },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: company });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/companies/me/password
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "currentPassword and newPassword are required." });
    }

    const company = await Company.findById(req.company._id).select("+password");
    if (!(await company.comparePassword(currentPassword))) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect." });
    }

    company.password = newPassword;
    await company.save(); // triggers the pre-save hash
    sendToken(company, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   DELETE /api/companies/me
// @access  Private  — soft-delete (sets isActive = false)
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteCompany = async (req, res) => {
  try {
    await Company.findByIdAndUpdate(req.company._id, { isActive: false });
    res
      .status(200)
      .json({ success: true, message: "Account deactivated successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   DELETE /api/companies/:id          (admin)
// @access  Private + Admin — hard delete
// ─────────────────────────────────────────────────────────────────────────────
exports.hardDeleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found." });
    }
    res
      .status(200)
      .json({ success: true, message: "Company permanently deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PATCH /api/companies/:id/verify    (admin)
// @access  Private + Admin
// ─────────────────────────────────────────────────────────────────────────────
exports.verifyCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found." });
    }
    res.status(200).json({ success: true, data: company });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};