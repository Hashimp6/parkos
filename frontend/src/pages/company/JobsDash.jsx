import { useEffect, useState } from "react";
import { useCompany } from "../../context/CompanyContext";
import axios from "axios";
import API_BASE from "../../../config";
import { useNavigate } from "react-router-dom";

// ─── Design tokens ─────────────────────────────────────────────────────────
const WORK_MODE_STYLES = {
  "On-site": "bg-blue-50 text-blue-600 border border-blue-200",
  Hybrid:    "bg-violet-50 text-violet-600 border border-violet-200",
  Remote:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const JOB_TYPE_STYLES = {
  "Full-time": "text-zinc-700",
  "Part-time":  "text-orange-600",
  Contract:     "text-rose-600",
  Internship:   "text-sky-600",
};

// ─── Icons ─────────────────────────────────────────────────────────────────
const IconSearch = () => (
  <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
const IconEdit = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const IconTrash = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const IconCheck = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
const IconUsers = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconChevronRight = () => (
  <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// ─── Delete Confirm Modal ──────────────────────────────────────────────────
function DeleteModal({ job, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-4 sm:pb-0">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-zinc-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
            <IconTrash />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 text-sm">Delete Job Posting</h3>
            <p className="text-xs text-zinc-400 mt-0.5">This cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-zinc-600 mb-5 leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-zinc-900">"{job.role}"</span>? All associated data will be permanently removed.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ─────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium text-white transition-all ${
        toast.type === "error" ? "bg-red-500" : "bg-zinc-900"
      }`}
    >
      <IconCheck />
      {toast.msg}
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-100 px-4 py-3.5 flex-1">
      <p className={`text-2xl font-semibold ${accent || "text-zinc-900"}`}>{value}</p>
      <p className="text-xs text-zinc-400 mt-0.5 font-medium uppercase tracking-wide">{label}</p>
    </div>
  );
}

// ─── Toggle Switch ─────────────────────────────────────────────────────────
function Toggle({ active, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${
        active ? "bg-emerald-500" : "bg-zinc-200"
      }`}
    >
      <span
        className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform"
        style={{ transform: active ? "translateX(18px)" : "translateX(2px)" }}
      />
    </button>
  );
}

// ─── Job Card (replaces table row) ────────────────────────────────────────
function JobCard({ job, onView, onEdit, onDelete, onToggle }) {
  const handleCardClick = (e) => {
    // Don't navigate if clicking interactive elements
    if (e.target.closest("button")) return;
    onView();
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-zinc-100 rounded-2xl p-4 hover:border-zinc-200 hover:shadow-sm active:scale-[0.99] transition-all cursor-pointer relative group"
    >
      {/* Top Row: Role + Chevron */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-zinc-900 text-sm leading-tight truncate">{job.role}</h3>
          {job.department && (
            <p className="text-xs text-zinc-400 mt-0.5 truncate">{job.department}</p>
          )}
        </div>
        <IconChevronRight />
      </div>

      {/* Badges Row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`text-xs font-medium ${JOB_TYPE_STYLES[job.jobType] || "text-zinc-600"}`}>
          {job.jobType}
        </span>
        <span className="text-zinc-200 text-xs">•</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${WORK_MODE_STYLES[job.workMode] || "bg-zinc-100 text-zinc-600 border border-zinc-200"}`}>
          {job.workMode}
        </span>
      </div>

      {/* Bottom Row: Status + Applicants + Actions */}
      <div className="flex items-center justify-between gap-3">
        {/* Status Toggle */}
        <div className="flex items-center gap-2">
          <Toggle
            active={job.isActive}
            onChange={(e) => { e.stopPropagation(); onToggle(); }}
          />
          <span className={`text-xs font-medium ${job.isActive ? "text-emerald-600" : "text-zinc-400"}`}>
            {job.isActive ? "Active" : "Closed"}
          </span>
        </div>

        {/* Right-side Actions */}
        <div className="flex items-center gap-2">
          {/* Applicants pill */}
          <button
            onClick={(e) => { e.stopPropagation(); onView(); }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 text-xs font-semibold hover:bg-indigo-100 transition-all"
          >
            <IconUsers />
            {job.applicationsCount ?? 0}
          </button>

          {/* Edit */}
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all"
          >
            <IconEdit />
            <span className="hidden sm:inline">Edit</span>
          </button>

          {/* Delete */}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-red-500 bg-red-50 border border-red-200 hover:bg-red-100 transition-all"
          >
            <IconTrash />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function CompanyJobsAdmin() {
  const navigate = useNavigate();
  const { company } = useCompany();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!company?._id) return;
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API_BASE}/jobs/company/${company._id}`);
        const raw = res.data?.data || res.data;
        const jobsArray = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.jobs)
          ? raw.jobs
          : [];
        setJobs(jobsArray);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setJobs([]);
      }
    };
    fetchJobs();
  }, [company]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/jobs/${deleteTarget._id}`);
      setJobs((prev) => prev.filter((j) => j._id !== deleteTarget._id));
      showToast(`"${deleteTarget.role}" deleted`);
      setDeleteTarget(null);
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const toggleActive = async (id, currentStatus) => {
    // Only block when trying to activate (inactive → active)
    if (!currentStatus) {
      const job = jobs.find((j) => j._id === id);
      if (job?.lastDateToApply) {
        const last = new Date(job.lastDateToApply);
        const today = new Date();
  
        // Compare dates only, ignore time — user picked a day, not a timestamp
        const lastDateOnly = new Date(last.getFullYear(), last.getMonth(), last.getDate());
        const todayOnly    = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
        if (lastDateOnly < todayOnly) {
          showToast("Last date to apply has passed. Please edit the date first.", "error");
          return;
        }
      }
    }
  
    try {
      const newStatus = !currentStatus;
      await axios.put(`${API_BASE}/jobs/${id}`, { isActive: newStatus });
      setJobs((prev) =>
        prev.map((j) => (j._id === id ? { ...j, isActive: newStatus } : j))
      );
      showToast(newStatus ? "Job activated" : "Job closed");
    } catch (err) {
      console.error(err);
      showToast("Failed to update status", "error");
    }
  };

  const filtered = Array.isArray(jobs)
    ? jobs.filter(
        (j) =>
          !search ||
          j.role?.toLowerCase().includes(search.toLowerCase()) ||
          j.department?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const activeCount = jobs.filter((j) => j.isActive).length;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <Toast toast={toast} />

      {deleteTarget && (
        <DeleteModal
          job={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center flex-shrink-0">
              {company?.logo ? (
                <img src={company.logo} alt={company.companyName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-zinc-700 font-bold text-base">
                  {company?.companyName?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-base font-semibold text-zinc-900 leading-tight tracking-tight">
                {company?.companyName}
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">Job Listings</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/jobs/form")}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 active:scale-[0.98] transition-all"
          >
            <IconPlus />
            <span>Add Job</span>
          </button>
        </div>

        {/* ── Stats Row ── */}
        <div className="flex gap-3 mb-5">
          <StatCard label="Total"  value={jobs.length} />
          <StatCard label="Active" value={activeCount} accent="text-emerald-600" />
          <StatCard label="Closed" value={jobs.length - activeCount} accent="text-zinc-400" />
        </div>

        {/* ── Search + Count ── */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 text-sm border border-zinc-200 rounded-xl text-zinc-800 placeholder-zinc-300 focus:outline-none focus:border-zinc-400 bg-white transition-all"
            />
          </div>
          <span className="text-xs text-zinc-400 whitespace-nowrap">{filtered.length} jobs</span>
        </div>

        {/* ── Job Cards ── */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-zinc-100 py-16 text-center">
              <p className="text-zinc-400 text-sm">No jobs found</p>
            </div>
          ) : (
            filtered.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onView={() => navigate(`/company/jobs/${job._id}`, { state: { job } })}
                onEdit={() => navigate("/jobs/form", { state: { job } })}
                onDelete={() => setDeleteTarget(job)}
                onToggle={() => toggleActive(job._id, job.isActive)}
              />
            ))
          )}
        </div>

        {/* ── Footer ── */}
        {jobs.length > 0 && (
          <p className="text-center text-xs text-zinc-400 mt-5">
            Showing {filtered.length} of {jobs.length} jobs
          </p>
        )}
      </div>
    </div>
  );
}