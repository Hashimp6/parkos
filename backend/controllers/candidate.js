const Candidate = require("../models/candidate");
const jwt = require("jsonwebtoken");
const helper = require("../models/helper");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const { sendMail } = require("../config/nodemailer");
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
};
// =======================================
// UTILITIES
// =======================================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const generateProfileId = (name) => {
  const slug = name.toLowerCase().trim().replace(/\s+/g, "-");
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${slug}-${suffix}`;
};

// =======================================
// 1️⃣ REGISTER
// =======================================
exports.registerCandidate = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let candidate = await Candidate.findOne({ email });

    if (candidate && candidate.isVerified) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const otp = generateOTP();

    const otpExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 min

    if (!candidate) {
      // Generate unique profileId
      let profileId;
      let isUnique = false;

      while (!isUnique) {
        profileId = generateProfileId(name);
        const existing = await Candidate.findOne({ profileId });
        if (!existing) isUnique = true;
      }

      candidate = new Candidate({
        name,
        email,
        password,
        profileId,
        otp,
        otpExpires,
      });

    } else {
      candidate.otp = otp;
      candidate.otpExpires = otpExpires;
    }

    await candidate.save();

    await sendMail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// 3️⃣ RESEND OTP
// =======================================
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const candidate = await Candidate.findOne({ email });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (candidate.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    candidate.otp = otp;
    candidate.otpExpires = otpExpires;

    await candidate.save();

    await sendMail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const candidate = await Candidate.findOne({ email });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (candidate.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (candidate.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    candidate.isVerified = true;
    candidate.otp = null;
    candidate.otpExpires = null;

    await candidate.save();

    const token = generateToken(candidate._id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token,
      data: {
        id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        profileId: candidate.profileId,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =======================================
// 2️⃣ LOGIN
// =======================================
exports.loginCandidate = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const candidate = await Candidate.findOne({ email }).select("+password");
    if (!candidate) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await candidate.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(candidate._id);
    const candidateData = candidate.toObject();
    delete candidateData.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: candidateData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================================
// 3️⃣ UPDATE PROFILE
// Route: PUT /update/:candidateId
// =======================================

exports.updateProfile = async (req, res) => {
  try {
    const { candidateId } = req.params;
console.log("ceed");
console.log("candidateId:", candidateId);

    const PROTECTED = ["password", "email", "_id", "profileId", "appliedJobs"];
    PROTECTED.forEach((field) => delete req.body[field]);

    const {
      name,
      phone,
      place,
      about,
      tagline,
      qualification,
      layoutType,
      skills,
      lookingVacancy,
      education,
      experience,
      services,
      socials,      // NEW
      projects 
    } = req.body;

    const setPayload = {};

    const setIfDefined = (key, value) => {
      if (value !== undefined) setPayload[key] = value;
    };

    const cleanArray = (arr) => {
      if (!Array.isArray(arr)) return undefined;
      return arr.filter((item) => {
        if (typeof item === "string") return item.trim() !== "";
        if (typeof item === "object") return Object.keys(item).length > 0;
        return true;
      });
    };
    const parseArray = (data) => {
      if (!data) return undefined;
    
      if (Array.isArray(data)) return data;
    
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch {
          return undefined;
        }
      }
    
      return undefined;
    };

    // ── FILE UPLOADS ─────────────────
    if (req.files?.profilePhoto) {
      const result = await uploadToCloudinary(
        req.files.profilePhoto[0].buffer,
        "profile_photos"
      );
      setPayload.profilePhoto = result.secure_url;
    }

    if (req.files?.cv) {
      const result = await uploadToCloudinary(
        req.files.cv[0].buffer,
        "candidate_cvs"
      );
      setPayload.cv = result.secure_url;
    }
 
    // ── Scalars ─────────────────
    setIfDefined("name", name);
    setIfDefined("phone", phone);
    setIfDefined("place", place);
    setIfDefined("about", about);
    setIfDefined("tagline", tagline);
    setIfDefined("qualification", qualification);
    setIfDefined("layoutType", layoutType);

    // ── Arrays ─────────────────
// ── Arrays ─────────────────
setIfDefined("skills", cleanArray(parseArray(skills)));
setIfDefined("lookingVacancy", cleanArray(parseArray(lookingVacancy)));
setIfDefined("education", cleanArray(parseArray(education)));
setIfDefined("experience", cleanArray(parseArray(experience)));
setIfDefined("services", cleanArray(parseArray(services)));
setIfDefined("socials", cleanArray(parseArray(socials)));
setIfDefined("projects", cleanArray(parseArray(projects)));
    if (!Object.keys(setPayload).length) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    const updated = await Candidate.findByIdAndUpdate(
      candidateId,
      { $set: setPayload },
      { returnDocument: "after", runValidators: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    updated.skills = updated.skills || [];
    updated.education = updated.education || [];
    updated.experience = updated.experience || [];
    updated.services = updated.services || [];
    updated.lookingVacancy = updated.lookingVacancy || [];
    updated.socials = updated.socials || [];
updated.projects = updated.projects || [];

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      candidate: updated,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// =======================================
// 4️⃣ CHANGE PASSWORD
// Route: PUT /change-password/:candidateId
// =======================================
exports.changePassword = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Both passwords are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    const candidate = await Candidate.findById(candidateId).select("+password");
    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    const isMatch = await candidate.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    candidate.password = newPassword; // pre-save hook will hash it
    await candidate.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================================
// 5️⃣ GET ALL CANDIDATES
// Route: GET /
// Supports: ?page=1&limit=10
// =======================================
exports.getAllCandidates = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    const total      = await Candidate.countDocuments({ isActive: true });
    const candidates = await Candidate.find({ isActive: true })
      .select("-__v")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: candidates,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================================
// 6️⃣ GET CANDIDATE BY ID
// Route: GET /:candidateId
// =======================================
exports.getCandidateById = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const candidate = await Candidate.findById(candidateId).select("-__v");
    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    res.status(200).json({ success: true, data: candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================================
// FORGOT PASSWORD - Step 1: Send OTP
// Route: POST /forgot-password
// =======================================
exports.forgotPassword = async (req, res) => {
  try {
    console.log("Body received:", req.body);        // ← check email arrives
    const { email } = req.body;

    const candidate = await Candidate.findOne({ email });
    console.log("Candidate found:", candidate);     // ← null means email not in DB

    if (!candidate) {
      return res.status(404).json({ success: false, message: "No account found with this email" });
    }
    const otp = generateOTP();
    console.log("OTP generated:", otp);

    candidate.otp = otp;
    candidate.otpExpires = new Date(Date.now() + 30 * 60 * 1000);
    await candidate.save();
    console.log("Candidate saved");                 // ← does it reach here?

    await sendMail(email, otp);
    console.log("Mail sent");                       // ← does it reach here?

    res.status(200).json({ success: true, message: "OTP sent to email" });

  } catch (error) {
    console.error("Error:", error);                 // ← catch any hidden errors
    res.status(500).json({ success: false, message: error.message });
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
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const candidate = await Candidate.findOne({ email });

    if (!candidate) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (candidate.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (candidate.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    candidate.password = newPassword; // pre-save hook will hash it
    candidate.otp = null;
    candidate.otpExpires = null;
    await candidate.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// =======================================
// 7️⃣ SEARCH CANDIDATE BY NAME
// Route: GET /search/by-name?name=hashim
// =======================================
exports.searchCandidateByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Name query is required" });
    }

    // Case-insensitive partial match
    const candidates = await Candidate.find({
      name: { $regex: name.trim(), $options: "i" },
      isActive: true,
    }).select("-__v");

    res.status(200).json({
      success: true,
      total: candidates.length,
      data: candidates,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.searchCandidateByProfileId = async (req, res) => {
  try {
    const { profileId } = req.query;

    if (!profileId || profileId.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Profile ID is required",
      });
    }

    const candidate = await Candidate.findOne({
      profileId: profileId.trim(),
      isActive: true,
    }).select("-__v");

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    res.status(200).json({
      success: true,
      data: candidate,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =======================================
// 8️⃣ DELETE CANDIDATE
// Route: DELETE /:candidateId
// =======================================
exports.deleteCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const candidate = await Candidate.findByIdAndDelete(candidateId);
    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    res.status(200).json({ success: true, message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.createCategorySuggestion = async (req, res) => {
  try {
    const { candidateCategory } = req.body;


    // ✅ save to DB
    const newSuggestion = await CategorySuggestion.create({
      candidateCategory: candidateCategory.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Suggestion submitted successfully",
      data: newSuggestion,
    });
  } catch (error) {
    console.error("Category Suggestion Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};