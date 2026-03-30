const Company = require("../models/company");
const jwt = require("jsonwebtoken");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const { sendMail } = require("../config/nodemailer");
const getCoordinates = require("../utils/geocoder");



const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
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
      return res.status(400).json({
        success: false,
        message: "companyName, email and password are required.",
      });
    }

    let company = await Company.findOne({ email: email.toLowerCase() });

    if (company && company.isVerified) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 30 * 60 * 1000);

    if (!company) {
      company = new Company({
        companyName,
        email,
        phone,
        password,
        otp,
        otpExpires,
      });
    } else {
      company.otp = otp;
      company.otpExpires = otpExpires;
    }

    await company.save();

    await sendMail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.verifyCompanyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const company = await Company.findOne({ email });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (company.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (company.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    company.isVerified = true;
    company.otp = null;
    company.otpExpires = null;

    await company.save();

    const token = generateToken(company._id);

    res.status(200).json({
      success: true,
      message: "Email verified",
      token,
      data: company,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const company = await Company.findOne({ email });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (company.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 30 * 60 * 1000);

    company.otp = otp;
    company.otpExpires = otpExpires;

    await company.save();

    await sendMail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP resent",
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =======================================
// FORGOT PASSWORD - Step 1: Send OTP
// Route: POST /forgot-password
// =======================================
exports.forgotPassword = async (req, res) => {
  try {
    console.log("Body received:", req.body);
    const { email } = req.body;

    const company = await Company.findOne({ email });
    console.log("Company found:", company);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    const otp = generateOTP();
    console.log("OTP generated:", otp);

    company.otp = otp;
    company.otpExpires = new Date(Date.now() + 30 * 60 * 1000);

    await company.save();
    console.log("Company saved");

    await sendMail(email, otp);
    console.log("Mail sent");

    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// FORGOT PASSWORD - Step 2: Reset Password
// Route: POST /reset-password
// =======================================
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const company = await Company.findOne({ email });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (company.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (company.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // Update password (make sure you have pre-save hashing in model)
    company.password = newPassword;
    company.otp = null;
    company.otpExpires = null;

    await company.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
// @route   PATCH /api/companies/:id
// companyController.js  —  updateCompany

exports.updateCompany = async (req, res) => {
  try {
    console.log("hiii");
    
    const { id } = req.params;
    console.log("FILES:", req.files);
    console.log("BODY:", req.body);
    // Strip fields that must never be updated via this endpoint
    const restrictedFields = ["password", "email", "_id", "isVerified", "isActive", "createdAt", "updatedAt"];
    restrictedFields.forEach((field) => delete req.body[field]);

    let updateData = { ...req.body };

    // ── Parse JSON fields sent via FormData ──────────────────────────────────
    const jsonFields = ["tags", "members", "services", "projects", "gallery", "clients", "contacts", "address"];
    jsonFields.forEach((key) => {
      if (typeof updateData[key] === "string") {
        try { updateData[key] = JSON.parse(updateData[key]); } catch {}
      }
    });

    if (updateData.address) {
      const hasAddress =
        updateData.address.building ||
        updateData.address.street ||
        updateData.address.place;
    
      if (hasAddress) {
        const coords = await getCoordinates(updateData.address);
        if (coords) {
          updateData.location = coords;
        }
      }
    }

    // ── Top-level image uploads (logo, banner) ───────────────────────────────
    if (req.files?.logo) {
      const result = await uploadToCloudinary(req.files.logo[0].buffer, "companies/logos");
      updateData.logo = result.secure_url;
    }

    if (req.files?.banner) {
      const result = await uploadToCloudinary(req.files.banner[0].buffer, "companies/banners");
      updateData.banner = result.secure_url;
    }

    // ── Nested image uploads ─────────────────────────────────────────────────
    // Frontend sends files as:
    //   member_image_0, member_image_1, …   → members[i].image
    //   gallery_image_0, gallery_image_1, … → gallery[i].imageUrl
    //   client_logo_0,  client_logo_1,  …   → clients[i].logo

    if (req.files) {
      // Helper: upload a buffer and return the secure_url
      const upload = (buffer, folder) => uploadToCloudinary(buffer, folder);

      // ── Members ──
      if (Array.isArray(updateData.members)) {
        const memberFiles = Object.entries(req.files)
          .filter(([key]) => key.startsWith("member_image_"));

        for (const [key, fileArr] of memberFiles) {
          const idx = parseInt(key.replace("member_image_", ""), 10);
          if (!isNaN(idx) && updateData.members[idx] && fileArr[0]?.buffer) {
            const result = await upload(fileArr[0].buffer, "companies/members");
            updateData.members[idx].image = result.secure_url;
          }
        }
      }

      // ── Gallery ──
      if (Array.isArray(updateData.gallery)) {
        const galleryFiles = Object.entries(req.files)
          .filter(([key]) => key.startsWith("gallery_image_"));

        for (const [key, fileArr] of galleryFiles) {
          const idx = parseInt(key.replace("gallery_image_", ""), 10);
          if (!isNaN(idx) && updateData.gallery[idx] && fileArr[0]?.buffer) {
            const result = await upload(fileArr[0].buffer, "companies/gallery");
            updateData.gallery[idx].imageUrl = result.secure_url;
          }
        }
      }

      // ── Clients ──
      if (Array.isArray(updateData.clients)) {
        const clientFiles = Object.entries(req.files)
          .filter(([key]) => key.startsWith("client_logo_"));

        for (const [key, fileArr] of clientFiles) {
          const idx = parseInt(key.replace("client_logo_", ""), 10);
          if (!isNaN(idx) && updateData.clients[idx] && fileArr[0]?.buffer) {
            const result = await upload(fileArr[0].buffer, "companies/clients");
            updateData.clients[idx].logo = result.secure_url;
          }
        }
      }
    }

    // ── Persist ──────────────────────────────────────────────────────────────
    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company: updatedCompany,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
// controllers/companyController.js


exports.updateLayout = async (req, res) => {
  try {
    console.log("fff",req.body);
    
    const { companyId, layout } = req.body;

    if (!companyId || layout === undefined) {
      return res.status(400).json({
        success: false,
        message: "Company ID and layout are required",
      });
    }


    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      { layout },
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Layout updated successfully",
      layout: updatedCompany.layout,
    });

  } catch (error) {
    console.error("Layout update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.searchCompanies = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const companies = await Company.find({
      companyName: { $regex: query, $options: "i" } // case-insensitive search
    })
      .select("companyName logo industry") // return only needed fields
      .limit(10); // limit results

    res.status(200).json({
      success: true,
      data: companies,
    });

  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// controllers/company.js

exports.checkCompanyName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const normalizedName = name.trim();

    // 🔥 escape regex
    const safeName = normalizedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const existing = await Company.findOne({
      companyName: { $regex: `^${safeName}$`, $options: "i" }
    });

    return res.status(200).json({
      success: true,
      available: !existing,
      message: existing
        ? "Company name already taken"
        : "Company name available",
    });

  } catch (err) {
    console.error("❌ checkCompanyName error:", err); // 👈 ADD THIS
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET /api/companies/by-tag?tag=web

exports.getCompaniesByTag = async (req, res) => {
  try {
    console.log("hii");
    
    const {
      tags,
      lat,
      lng,
      page = 1,
      limit = 12,
      mode = "or",
    } = req.query;

    console.log("querry",req.query);
    
    // ── Normalize tags ─────────────────────────────
    let tagArray = [];

    if (Array.isArray(tags)) {
      tagArray = tags.flatMap(t => t.split(","))
        .map(t => t.trim().toLowerCase())
        .filter(Boolean);
    } else if (typeof tags === "string" && tags.trim()) {
      tagArray = tags.split(",")
        .map(t => t.trim().toLowerCase())
        .filter(Boolean);
    }

    if (tagArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one tag is required"
      });
    }

    const skip = (Number(page) - 1) * Number(limit);

    // ── Base match ────────────────────────────────
    const tagQuery =
      mode === "and"
        ? { tags: { $all: tagArray } }
        : { tags: { $in: tagArray } };

    // ── CASE 1: WITH LOCATION (NEAREST FIRST) ─────
    if (lat && lng) {
      const companies = await Company.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [Number(lng), Number(lat)],
            },
            distanceField: "distance",
            spherical: true,
            query: {
              isActive: true,
              ...tagQuery,
            },
          },
        },
        {
          $addFields: {
            sortScore: {
              $add: [
                { $cond: ["$isVerified", 0, 100000] },
                "$distance"
              ]
            }
          }
        },
        { $sort: { sortScore: 1 } },
        { $skip: skip },
        { $limit: Number(limit) },
      ]);

      return res.json({
        success: true,
        mode,
        tags: tagArray,
        nearby: true,
        count: companies.length,
        companies,
      });
    }

    // ── CASE 2: WITHOUT LOCATION ──────────────────
    const [companies, total] = await Promise.all([
      Company.find({
        isActive: true,
        ...tagQuery,
      })
        .sort({ isVerified: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      Company.countDocuments({
        isActive: true,
        ...tagQuery,
      }),
    ]);

    return res.json({
      success: true,
      mode,
      tags: tagArray,
      nearby: false,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      companies,
    });

  } catch (err) {
    console.error("❌ ERROR IN getCompaniesByTag:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
 