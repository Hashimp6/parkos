const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidate");

// Auth
router.post("/register", candidateController.registerCandidate);
router.post("/login", candidateController.loginCandidate);
router.put("/change-password/:candidateId", candidateController.changePassword);

// Profile
router.put("/update/:candidateId", candidateController.updateProfile);
router.get("/search/by-name", candidateController.searchCandidateByName);
// Get
router.get("/", candidateController.getAllCandidates);
router.get("/:candidateId", candidateController.getCandidateById);

// Delete
router.delete("/:candidateId", candidateController.deleteCandidate);

module.exports = router;