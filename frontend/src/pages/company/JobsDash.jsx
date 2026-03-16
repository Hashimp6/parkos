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
const IconEye = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const IconUsers = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// ─── Delete Confirm Modal ──────────────────────────────────────────────────
function DeleteModal({ job, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
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
    <div className="bg-white rounded-xl border border-zinc-100 px-4 py-3.5">
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
        setJobs(res.data.data || res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
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
    try {
      const newStatus = !currentStatus;
  
      await axios.put(`${API_BASE}/jobs/${id}`, {
        isActive: newStatus,
      });
  
      setJobs((prev) =>
        prev.map((j) =>
          j._id === id ? { ...j, isActive: newStatus } : j
        )
      );
  
      showToast(newStatus ? "Job activated" : "Job closed");
    } catch (err) {
      console.error(err);
      showToast("Failed to update status", "error");
    }
  };

  const filtered = jobs.filter(
    (j) =>
      !search ||
      j.role?.toLowerCase().includes(search.toLowerCase()) ||
      j.department?.toLowerCase().includes(search.toLowerCase())
  );

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between mb-6">
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
              <h1 className="text-lg font-semibold text-zinc-900 leading-tight tracking-tight">
                {company?.companyName}
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">Job Listings</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/company/jobs/create")}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 active:scale-[0.98] transition-all"
          >
            <IconPlus />
            Add Job
          </button>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <StatCard label="Total Jobs"  value={jobs.length} />
          <StatCard label="Active"      value={activeCount} accent="text-emerald-600" />
          <StatCard label="Closed"      value={jobs.length - activeCount} accent="text-zinc-400" />
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-zinc-100">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <IconSearch />
              </span>
              <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm border border-zinc-200 rounded-xl text-zinc-800 placeholder-zinc-300 focus:outline-none focus:border-zinc-400 w-52 transition-all"
              />
            </div>
            <span className="text-xs text-zinc-400">{filtered.length} jobs</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100">
                  {["Role", "Type / Mode", "Status", "Applicants", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-zinc-400 text-sm">
                      No jobs found
                    </td>
                  </tr>
                ) : (
                  filtered.map((job) => (
                    <tr key={job._id} className="hover:bg-zinc-50/70 transition-colors">

                      {/* Role */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div>
                          <span className="font-semibold text-zinc-900 text-sm">{job.role}</span>
                          {job.department && (
                            <p className="text-xs text-zinc-400 mt-0.5">{job.department}</p>
                          )}
                        </div>
                      </td>

                      {/* Type / Mode */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`text-xs font-medium ${JOB_TYPE_STYLES[job.jobType] || "text-zinc-600"}`}>
                            {job.jobType}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit ${WORK_MODE_STYLES[job.workMode] || "bg-zinc-100 text-zinc-600 border border-zinc-200"}`}>
                            {job.workMode}
                          </span>
                        </div>
                      </td>

                      {/* Status toggle */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                        <Toggle
  active={job.isActive}
  onChange={() => toggleActive(job._id, job.isActive)}
/>
                          <span className={`text-xs font-medium ${job.isActive ? "text-emerald-600" : "text-zinc-400"}`}>
                            {job.isActive ? "Active" : "Closed"}
                          </span>
                        </div>
                      </td>

                      {/* Applicants count */}
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => navigate(`/company/jobs/${job._id}`, { state: { job } })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 text-xs font-semibold hover:bg-indigo-100 hover:border-indigo-300 transition-all"
                        >
                          <IconUsers />
                          {job.applicationsCount ?? 0}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => navigate(`/company/jobs/${job._id}`, { state: { job } })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 shadow-sm hover:shadow transition-all active:scale-95"
                          >
                            <IconEye />
                            View
                          </button>
                          <button
                            onClick={() => navigate("/jobs/form", { state: { job } })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all active:scale-95"
                            title="Edit"
                          >
                            <IconEdit />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget(job)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 bg-red-50 border border-red-200 hover:bg-red-100 hover:border-red-300 transition-all active:scale-95"
                            title="Delete"
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3.5 border-t border-zinc-100 bg-zinc-50/50">
            <span className="text-xs text-zinc-400">
              Showing {filtered.length} of {jobs.length} jobs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}