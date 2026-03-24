const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  addFreelanceService,
  updateFreelanceService,
  deleteFreelanceService,
  toggleServiceStatus,
  getAllFreelanceServices,
  getSingleService,
  getCandidateServices,
  createCategorySuggestion
} = require("../controllers/freelancer");

// 🔐 Protected routes
router.post("/add", auth, addFreelanceService);
router.put("/update/:id", auth, updateFreelanceService);
router.delete("/delete/:id", auth, deleteFreelanceService);
router.patch("/toggle/:id", auth, toggleServiceStatus);
router.get("/my",auth, getCandidateServices);

// 🌍 Public routes
router.get("/", getAllFreelanceServices);
router.get("/:id", getSingleService);
router.post("/suggestcategory", createCategorySuggestion);

module.exports = router;