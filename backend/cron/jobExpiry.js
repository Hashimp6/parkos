const cron = require("node-cron");
const deactivateExpiredJobs = require("../utils/deactivateExpired");

// Runs every day at midnight (00:00)
cron.schedule("0 0 * * *", async () => {
  console.log("[CRON] Running job expiry check...");
  await deactivateExpiredJobs();
});

console.log("[CRON] Job expiry scheduler registered.");