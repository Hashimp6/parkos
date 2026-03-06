const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ─── Business Park Options ───────────────────────────────────────────────────
const BUSINESS_PARK_OPTIONS = [
  "Cyberpark",
  "Technopark",
  "Infopark",
  "Smart City",
  "KINFRA Tech Park",
  "Business Park",
  "SEZ",
  "Other",
];

// ─── Member ───────────────────────────────────────────────────────────────────
// name, position, image, website URL only
const memberSchema = new mongoose.Schema({
  name:     { type: String, default: "" },
  position: { type: String, default: "" },
  image:    { type: String, default: "" },  // photo URL
  url:      { type: String, default: "" },  // personal / portfolio website
});

// ─── Service ─────────────────────────────────────────────────────────────────
// title and description only
const serviceSchema = new mongoose.Schema({
  title:       { type: String, default: "" },
  description: { type: String, default: "" },
});

// ─── Client / Partner Logos ──────────────────────────────────────────────────
const clientSchema = new mongoose.Schema({
  name:    { type: String, default: "" },
  logo:    { type: String, default: "" },
  website: { type: String, default: "" },
});

// ─── Gallery ─────────────────────────────────────────────────────────────────
const gallerySchema = new mongoose.Schema({
  imageUrl: { type: String, default: "" },
  caption:  { type: String, default: "" },
});

// ─── Contact / Social Channels ────────────────────────────────────────────────
// one embedded object holding all the company's public contact & social links
const contactSchema = new mongoose.Schema({
  linkedin:  { type: String, default: "" },
  instagram: { type: String, default: "" },
  facebook:  { type: String, default: "" },
  twitter:   { type: String, default: "" },
  youtube:   { type: String, default: "" },
  whatsapp:  { type: String, default: "" },
  email:     { type: String, default: "" },
  phone:     { type: String, default: "" },
});

// ─── Main Company Schema ──────────────────────────────────────────────────────
const companySchema = new mongoose.Schema(
  {
    // ── Auth & Basic ──────────────────────────────────────────────────────────
    companyName: { type: String, trim: true },
    email:       { type: String, unique: true, lowercase: true, trim: true },
    phone:       { type: String },
    password:    { type: String, minlength: 6, select: false },

    // ── Branding ─────────────────────────────────────────────────────────────
    logo:    { type: String, default: "" },  // logo image URL
    banner:  { type: String, default: "" },  // hero / cover banner image URL
    tagline: { type: String, default: "" },

    // ── Layout ───────────────────────────────────────────────────────────────
    // numeric template selector: 1, 2, 3 … — maps to a template on the frontend
    layout: { type: Number, default: 1 },

    // ── Company Details ───────────────────────────────────────────────────────
    industry:     { type: String, default: "" },
    companySize:  { type: String, default: "" },  // e.g. "11-50", "51-200"
    employeeCount:{ type: Number, default: 0 },
    foundedYear:  { type: Number },
    about:        { type: String, default: "" },

    // ── Tags ─────────────────────────────────────────────────────────────────
    tags: [{ type: String }],

    // ── Location ─────────────────────────────────────────────────────────────
    businessPark: {
      type:    String,
      enum:    BUSINESS_PARK_OPTIONS,
      default: "Other",
    },
    address: {
      building: { type: String, default: "" },
      street:   { type: String, default: "" },
      city:     { type: String, default: "" },
      state:    { type: String, default: "" },
      pincode:  { type: String, default: "" },
      country:  { type: String, default: "India" },
    },
    mapEmbedLink: { type: String, default: "" },

    // ── Mini-Website Sections ─────────────────────────────────────────────────
    members:  [memberSchema],
    services: [serviceSchema],
    gallery:  [gallerySchema],
    clients:  [clientSchema],
    // jobs live in the separate Job collection (linked via company ObjectId)

    // ── Contact / Social Channels (single embedded object) ───────────────────
    contacts: { type: contactSchema, default: () => ({}) },

    // ── Public Website ────────────────────────────────────────────────────────
    website: { type: String, default: "" },

    // ── Admin ─────────────────────────────────────────────────────────────────
    isVerified: { type: Boolean, default: false },
    isActive:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ─── Password hashing ────────────────────────────────────────────────────────
companySchema.pre("save", async function () {
  if (!this.password) return;
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

companySchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Company", companySchema);
module.exports.BUSINESS_PARK_OPTIONS = BUSINESS_PARK_OPTIONS;