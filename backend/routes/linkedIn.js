const express = require("express");
const router = express.Router();

const {
  getLinkedinJobs,
} = require("../controllers/linkedinJobsController");

router.get("/linkedin-jobs", getLinkedinJobs);

module.exports = router;