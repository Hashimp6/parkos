const Job = require("../models/jobs");

const deactivateExpiredJobs = async () => {
  try {
    const now = new Date();

    const result = await Job.updateMany(
      {
        isActive: true,
        lastDateToApply: { $lt: now, $ne: null },
      },
      { $set: { isActive: false } }
    );

    console.log(`[JOB EXPIRY] ${result.modifiedCount} job(s) deactivated.`);
  } catch (err) {
    console.error("[JOB EXPIRY] Error:", err.message);
  }
};

module.exports = deactivateExpiredJobs;