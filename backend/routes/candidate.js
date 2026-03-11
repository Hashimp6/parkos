const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidate");
const { upload } = require("../middleware/upload");
// Auth
router.post("/register", candidateController.registerCandidate);
router.post("/login", candidateController.loginCandidate);
router.put("/change-password/:candidateId", candidateController.changePassword);

// Profile
router.put(
    "/update/:candidateId",
    upload.fields([
      { name: "profilePhoto", maxCount: 1 },
      { name: "cv", maxCount: 1 }
    ]),
    candidateController.updateProfile
  );
router.get("/search/by-name", candidateController.searchCandidateByName);
router.get("/search/by-username", candidateController.searchCandidateByProfileId);
// Get
router.get("/", candidateController.getAllCandidates);
router.get("/:candidateId", candidateController.getCandidateById);

// Delete
router.delete("/:candidateId", candidateController.deleteCandidate);

module.exports = router;