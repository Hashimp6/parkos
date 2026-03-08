const express = require("express");
const router = express.Router();
const companyController = require("../controllers/comapany");

// PUBLIC ROUTES
router.post("/register", companyController.register);
router.post("/login", companyController.login);

router.get("/", companyController.getAllCompanies);
router.get("/:id", companyController.getCompany);

// PRIVATE ROUTES
router.get("/me/profile",  companyController.getMe);
router.patch("/update/:id", companyController.updateCompany);
router.put("/me/password", companyController.updatePassword);
router.delete("/me",  companyController.deleteCompany);

// ADMIN ROUTES
router.delete("/:id",companyController.hardDeleteCompany);
router.patch("/:id/verify", companyController.verifyCompany);

module.exports = router;