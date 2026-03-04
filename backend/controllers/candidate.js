const Candidate = require("../models/candidate");
const jwt = require("jsonwebtoken");

// Utility: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
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

    const candidate = await Candidate.create({ name, email, password });

    const token = generateToken(candidate._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      data: {
        id: candidate._id,
        name: candidate.name,
        email: candidate.email,
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
      return res.status(400).json({ success: false, message: "Email and password required" });
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

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: candidate._id,
        name: candidate.name,
        email: candidate.email,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// =======================================
// 3️⃣ CHANGE PASSWORD
// =======================================
exports.changePassword = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user.id).select("+password");

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Both passwords required" });
    }

    const isMatch = await candidate.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Old password incorrect" });
    }

    candidate.password = newPassword;
    await candidate.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// =======================================
// 4️⃣ UPDATE PROFILE (Safe)
// =======================================
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name", "email", "phone", "place", "qualification",
      "profilePhoto", "about", "skills",
      "experience", "education", "lookingVacancy"
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        const val = req.body[key];
        updates[key] = typeof val === "string" ? val.trim() : val;
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const candidate = await Candidate.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: candidate,
    });

  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// =======================================
// 5️⃣ GET ALL CANDIDATES (Admin Use)
// =======================================
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: candidates.length,
      data: candidates,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// =======================================
// 6️⃣ GET SINGLE CANDIDATE
// =======================================
exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).select("-password");

    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    res.status(200).json({
      success: true,
      data: candidate,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// =======================================
// 7️⃣ DELETE CANDIDATE (Admin)
// =======================================
exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);

    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    res.status(200).json({
      success: true,
      message: "Candidate deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// =======================================
// 8️⃣ SEARCH BY NAME
// =======================================
exports.searchCandidateByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name query is required" });
    }

    const candidates = await Candidate.find({
      name: { $regex: name, $options: "i" },
    }).select("-password");

    res.status(200).json({
      success: true,
      total: candidates.length,
      data: candidates,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};