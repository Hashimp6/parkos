const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const experienceSchema = new mongoose.Schema({
  jobTitle: { type: String },
  company: { type: String},
  startDate: { type: Date},
  endDate: { type: Date },
});

const educationSchema = new mongoose.Schema({
  education: { type: String}, 
  institution: { type: String},
  year: { type: Number },
  percentage: { type: String }, // or CGPA
});

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      select: false, // won't return password in queries by default
    },
    place: {
      type: String,
      trim: true,
    },
    profilePhoto: {
      type: String, // URL to uploaded photo
      default: "",
    },
    cv: {
      type: String, // URL to uploaded CV/resume file
      default: "",
    },
    about: {
      type: String, // short bio about the candidate
      default: "",
    },
    layoutType: {
      type: String, // layout option
      default: "",
    },
    tagline: {
      type: String, // tagline of the candidate
      default: "",
    },
    qualification: {
        type: String, // 
        default: "",
      },
      services: [
        {
          heading: {
            type: String,
            trim: true,
          },
          description: {
            type: String,
            trim: true,
          },
        },
      ],
    skills: [
      {
        type: String, // e.g. ["JavaScript", "React", "Node.js"]
      },
    ],
    education: [educationSchema], // array of qualifications
    experience: [experienceSchema],        // array of work experience
    lookingVacancy: [
      {
        type: String, // e.g. ["Software Engineer", "Frontend Developer"]
      },
    ],
    appliedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobPost",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Hash password before saving
candidateSchema.pre("save", async function () {
    if (!this.password) return;
    if (!this.isModified("password")) return;
  
    this.password = await bcrypt.hash(this.password, 10);
  });

// Method to compare password on login
candidateSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Candidate", candidateSchema);