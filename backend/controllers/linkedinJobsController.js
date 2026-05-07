const axios = require("axios");

const getLinkedinJobs = async (req, res) => {
  const {
    keyword = "",
    location = "Kozhikode, Kerala, India",
    hours = "24",
  } = req.query;

  try {
    const response = await axios.get(
      "https://api.adzuna.com/v1/api/jobs/in/search/1",
      {
        params: {
          app_id: process.env.ADZUNA_APP_ID,
          app_key: process.env.ADZUNA_APP_KEY,
          results_per_page: 20,
          what: keyword || "developer",
          where: location,
          sort_by: "date",
          max_days_old:
            hours === "24"
              ? 1
              : hours === "168"
              ? 7
              : 30,
        },
      }
    );

    const jobs = response.data.results.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company?.display_name || "Unknown",
        location: job.location?.display_name || location,
        description: job.description ? job.description.slice(0, 220) + "..." : "",
        postedAt: job.created,
        applyLink: job.redirect_url,
        salary: job.salary_min
          ? `₹${Math.round(job.salary_min / 1000)}k - ₹${Math.round(job.salary_max / 1000)}k`
          : null,
        // ✅ Add these 3 missing fields
        employmentType: job.contract_time === "full_time" ? "Full-time"
          : job.contract_time === "part_time" ? "Part-time" : "Full-time",
        isRemote: job.title?.toLowerCase().includes("remote") ||
          job.description?.toLowerCase().includes("work from home") || false,
        source: "Adzuna",
      }));

    res.status(200).json({
      success: true,
      total: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Adzuna API Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

module.exports = {
  getLinkedinJobs,
};