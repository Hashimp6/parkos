const Candidate = require("../models/candidate");
const jwt = require("jsonwebtoken");

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
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await Candidate.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    // Generate unique profileId with collision retry
    let profileId;
    let isUnique = false;
    while (!isUnique) {
      profileId = generateProfileId(name);
      const existing = await Candidate.findOne({ profileId });
      if (!existing) isUnique = true;
    }

    const candidate = await Candidate.create({ name, email, password, profileId });
    const token = generateToken(candidate._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      data: {
        id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        profileId: candidate.profileId,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    // Fields that cannot be updated
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
      profilePhoto,
      cv,
      skills,
      lookingVacancy,
      education,
      experience,
      services,
    } = req.body;

    const setPayload = {};

    // Helper: set only if defined
    const setIfDefined = (key, value) => {
      if (value !== undefined) setPayload[key] = value;
    };

    // Helper: clean arrays (remove empty values)
    const cleanArray = (arr) => {
      if (!Array.isArray(arr)) return undefined;

      return arr.filter((item) => {
        if (typeof item === "string") return item.trim() !== "";
        if (typeof item === "object") return Object.keys(item).length > 0;
        return true;
      });
    };

    // ── Scalars ─────────────────────────────
    setIfDefined("name", name);
    setIfDefined("phone", phone);
    setIfDefined("place", place);
    setIfDefined("about", about);
    setIfDefined("tagline", tagline);
    setIfDefined("qualification", qualification);
    setIfDefined("layoutType", layoutType);
    setIfDefined("profilePhoto", profilePhoto);
    setIfDefined("cv", cv);

    // ── Arrays (clean before saving) ─────────────────────────────
    setIfDefined("skills", cleanArray(skills));
    setIfDefined("lookingVacancy", cleanArray(lookingVacancy));
    setIfDefined("education", cleanArray(education));
    setIfDefined("experience", cleanArray(experience));
    setIfDefined("services", cleanArray(services));

    // Nothing to update
    if (!Object.keys(setPayload).length) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    const updated = await Candidate.findByIdAndUpdate(
      candidateId,
      { $set: setPayload },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    // Ensure arrays always exist (important for React)
    updated.skills = updated.skills || [];
    updated.education = updated.education || [];
    updated.experience = updated.experience || [];
    updated.services = updated.services || [];
    updated.lookingVacancy = updated.lookingVacancy || [];

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