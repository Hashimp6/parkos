const axios = require("axios");

const getLinkedinJobs = async (req, res) => {
  const {
    keyword = "",
    location = "Kozhikode, Kerala, India",
    hours = "24",
  } = req.query;

  try {
    const response = await axios.get("https://jsearch.p.rapidapi.com/search", {
      params: {
        query: `${keyword || "jobs"} in ${location}`,
        page: "1",
        num_pages: "1",
        date_posted:
          hours === "24" ? "today" : hours === "168" ? "week" : "month",
        sort_by: "date",
        country: "in",
        language: "en",
      },
      headers: {
        "X-RapidAPI-Key": process.env.JSEARCH_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
      timeout: 10000,
    });

    const raw = response.data?.data?.jobs || response.data?.data || [];

    const allJobs = raw.map((job) => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name || "Unknown",
      location: `${job.job_city || ""}${job.job_city ? ", " : ""}${job.job_state || "Kerala"}`,
      description: job.job_description
        ? job.job_description.slice(0, 220) + "..."
        : "",
      employmentType:
        job.job_employment_type === "FULLTIME" ? "Full-time"
        : job.job_employment_type === "PARTTIME" ? "Part-time"
        : job.job_employment_type || "Full-time",
      isRemote: job.job_is_remote || false,
      postedAt: job.job_posted_at_datetime_utc,
      logo: job.employer_logo || null,
      applyLink: job.job_apply_link,
      source: job.job_publisher || "",
      salary: job.job_min_salary
        ? `₹${Math.round(job.job_min_salary / 1000)}k - ₹${Math.round(job.job_max_salary / 1000)}k`
        : null,
    }));

    // ✅ Filter LinkedIn jobs only
    const jobs = allJobs.filter((job) =>
      job.source?.toLowerCase().includes("linkedin") ||
      job.applyLink?.toLowerCase().includes("linkedin.com")
    );

    res.status(200).json({ success: true, total: jobs.length, jobs });
  } catch (error) {
    console.error("JSearch error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

module.exports = { getLinkedinJobs };