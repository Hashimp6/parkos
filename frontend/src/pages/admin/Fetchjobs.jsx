import { useState, useEffect, useCallback } from "react";
import API_BASE from "../../../config";

const LOCATIONS = [
  { label: "Kozhikode", value: "Kozhikode, Kerala, India" },
  { label: "Malappuram", value: "Malappuram, Kerala, India" },
  { label: "Kochi", value: "Kochi, Kerala, India" },
  { label: "All Kerala", value: "Kerala, India" },
];

const TIME_FILTERS = [
  { label: "24 hours", value: "24" },
  { label: "This week", value: "168" },
  { label: "This month", value: "720" },
];

const CATEGORIES = [
  { label: "All", keyword: "" },
  { label: "Tech", keyword: "software developer" },
  { label: "Design", keyword: "UI UX designer" },
  { label: "Marketing", keyword: "digital marketing" },
  { label: "Sales", keyword: "sales executive" },
  { label: "Finance", keyword: "accountant" },
  { label: "HR", keyword: "human resources" },
];

function timeAgo(dateStr) {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

const LOGO_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

function logoColor(name = "") {
  let sum = 0;
  for (const c of name) sum += c.charCodeAt(0);
  return LOGO_COLORS[sum % LOGO_COLORS.length];
}

function CompanyLogo({ name, logo }) {
  if (logo) {
    return (
      <img
        src={logo}
        alt={name}
        onError={(e) => { e.target.style.display = "none"; }}
        className="w-11 h-11 rounded-xl object-contain border border-gray-200 bg-white p-1 flex-shrink-0"
      />
    );
  }
  return (
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${logoColor(name)}`}>
      {getInitials(name)}
    </div>
  );
}

function JobCard({ job }) {
  return (
    <div
      onClick={() => window.open(job.applyLink, "_blank")}
      className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-400 hover:shadow-sm transition-all duration-150 cursor-pointer group"
    >
      <div className="flex items-start gap-3 mb-3">
        <CompanyLogo name={job.company} logo={job.logo} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate group-hover:text-black">
            {job.title}
          </h3>
          <p className="text-gray-500 text-xs mt-0.5 truncate">{job.company}</p>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5">
          {timeAgo(job.postedAt)}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </span>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {job.employmentType}
        </span>
        {job.isRemote && (
          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
            Remote
          </span>
        )}
        {job.salary && (
  <span className="text-xs text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full font-medium">
    {job.salary}
  </span>
)}
        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
          {job.source}
        </span>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
        {job.description}
      </p>

      <div className="flex justify-end mt-3">
        <span className="text-xs text-gray-400 group-hover:text-gray-700 flex items-center gap-1 transition-colors">
          View & Apply
          <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-gray-200 flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
      <div className="flex gap-2 mb-3">
        <div className="h-5 bg-gray-100 rounded-full w-24" />
        <div className="h-5 bg-gray-100 rounded-full w-16" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
      </div>
    </div>
  );
}

export default function LinkedInJobsMonitor() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [selectedTime, setSelectedTime] = useState(TIME_FILTERS[0]);
  const [lastFetched, setLastFetched] = useState(null);

  const activeKeyword = keyword.trim() || selectedCategory.keyword;

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        keyword: activeKeyword,
        location: selectedLocation.value,
        hours: selectedTime.value,
      });
     // Change the endpoint in your fetch call
const res = await fetch(`${API_BASE}/api/linked/linkedin-jobs?${params}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Unknown error");
      setJobs(data.jobs);
      setLastFetched(new Date());
    } catch (e) {
      setError(e.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [activeKeyword, selectedLocation.value, selectedTime.value]);

  useEffect(() => {
    fetchJobs();
  }, [selectedLocation, selectedTime]);

  const linkedInURL = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(activeKeyword)}&location=${encodeURIComponent(selectedLocation.value)}&f_TPR=r${selectedTime.value === "24" ? "86400" : selectedTime.value === "168" ? "604800" : "2592000"}&sortBy=DD`;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
              LinkedIn Job Monitor
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {lastFetched
                ? `Last updated: ${lastFetched.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
                : "Ready to fetch"}
            </p>
          </div>
          <button
            onClick={fetchJobs}
            disabled={loading}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl px-4 py-2 hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50"
          >
            <svg
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 space-y-4">
          {/* Search row */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setSelectedCategory(CATEGORIES[0]); }}
                onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
                placeholder="Search job title, skill, or company…"
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 bg-gray-50 text-gray-900 placeholder-gray-400"
              />
            </div>
            <button
              onClick={fetchJobs}
              className="px-5 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 active:scale-95 transition-all"
            >
              Search
            </button>
          </div>

          {/* Category */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 font-medium w-16">Category</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => { setSelectedCategory(cat); setKeyword(""); }}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${
                  selectedCategory.label === cat.label
                    ? "bg-black text-white border-black"
                    : "border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 font-medium w-16">Location</span>
            {LOCATIONS.map((loc) => (
              <button
                key={loc.label}
                onClick={() => setSelectedLocation(loc)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${
                  selectedLocation.label === loc.label
                    ? "bg-black text-white border-black"
                    : "border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 font-medium w-16">Posted</span>
            {TIME_FILTERS.map((t) => (
              <button
                key={t.label}
                onClick={() => setSelectedTime(t)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${
                  selectedTime.value === t.value
                    ? "bg-black text-white border-black"
                    : "border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {loading
              ? "Loading jobs…"
              : error
              ? "Could not load jobs"
              : `${jobs.length} job${jobs.length !== 1 ? "s" : ""} · ${selectedLocation.label} · ${selectedTime.label}`}
          </p>
          <a
            href={linkedInURL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            View all on LinkedIn
          </a>
        </div>

        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchJobs} className="text-red-700 underline text-xs font-medium">
              Retry
            </button>
          </div>
        )}

        {/* Job grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : jobs.length === 0 && !error ? (
            <div className="col-span-3 text-center py-20 text-gray-400">
              <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm">No jobs found for this filter</p>
              <button
                onClick={() => { setKeyword(""); setSelectedCategory(CATEGORIES[0]); fetchJobs(); }}
                className="mt-3 text-xs text-gray-500 underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            jobs.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </div>
      </div>
    </div>
  );
}