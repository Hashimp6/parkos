const express = require("express");
const router = express.Router();
const companyController = require("../controllers/comapany");
const { uploadCompanyFields } = require("../middleware/upload");

// PUBLIC ROUTES
router.post("/register", companyController.register);
router.post("/login", companyController.login);

router.get("/", companyController.getAllCompanies);
router.get("/:id", companyController.getCompany);

// PRIVATE ROUTES
router.get("/me/profile", companyController.getMe);
router.patch("/update/:id", (req, res, next) => {
  uploadCompanyFields(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err); // ← this will tell you exactly what's wrong
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, companyController.updateCompany);
router.put("/me/password", companyController.updatePassword);
router.delete("/me", companyController.deleteCompany);

// ADMIN ROUTES
router.delete("/:id", companyController.hardDeleteCompany);
router.patch("/:id/verify", companyController.verifyCompany);

module.exports = router;