const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ─── Meet Our Members ───────────────────────────────────────────────────────
const memberSchema = new mongoose.Schema({
  name: { type: String},
  role: { type: String},
  photo: { type: String, default: "" },
  bio: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  twitter: { type: String, default: "" },
  portfolio: { type: String, default: "" },
});

// ─── Services ───────────────────────────────────────────────────────────────
const serviceSchema = new mongoose.Schema({
  title: { type: String,  },
  description: { type: String, default: "" },
  icon: { type: String, default: "" },
});

// ─── Client / Partner Logos ──────────────────────────────────────────────────
const clientSchema = new mongoose.Schema({
  name: { type: String },
  logo: { type: String, default: "" },
  website: { type: String, default: "" },
});

// ─── Gallery ────────────────────────────────────────────────────────────────
const gallerySchema = new mongoose.Schema({
  imageUrl: { type: String},
  caption: { type: String, default: "" },
});

// ─── Main Company Schema ────────────────────────────────────────────────────
const companySchema = new mongoose.Schema(
  {
    // Auth & Basic
    companyName: { type: String,  trim: true },
    email: { type: String,  unique: true, lowercase: true, trim: true },
    phone: { type: String, },
    password: { type: String, minlength: 6, select: false },

    // Hero Section
    logo: { type: String, default: "" },
    coverPhoto: { type: String, default: "" },
    tagline: { type: String, default: "" },
    industry: { type: String, default: "" },
    companySize: { type: String, default: "" },
    foundedYear: { type: Number },

    // Location
    businessPark: { type: String, },
    address: {
      building: { type: String, default: "" },
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
    mapEmbedLink: { type: String, default: "" },

    // About
    about: { type: String, default: "" },

    // Mini Website Sections
    members: [memberSchema],
    services: [serviceSchema],
    gallery: [gallerySchema],
    clients: [clientSchema],

    // Contact & Socials
    website: { type: String, default: "" },
    socialMedia: {
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },

    // Admin
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

companySchema.pre("save", async function () {
    if (!this.password) return;
    if (!this.isModified("password")) return;
  
    this.password = await bcrypt.hash(this.password, 10);
  });

companySchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Company", companySchema);