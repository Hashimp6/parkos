import { useEffect, useState } from "react";
import { useCompany } from "../../context/CompanyContext";
import axios from "axios";
import API_BASE from "../../../config";
import { useNavigate } from "react-router-dom";




const WORK_MODE_COLORS = {
  "On-site": "bg-blue-50 text-blue-700",
  Hybrid: "bg-violet-50 text-violet-700",
  Remote: "bg-emerald-50 text-emerald-700",
};

const JOB_TYPE_COLORS = {
  "Full-time": "text-slate-600",
  "Part-time": "text-orange-600",
  Contract: "text-rose-600",
  Internship: "text-sky-600",
};

function fmt(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(0)}K` : n;
}

function timeAgo(d) {
  const days = Math.floor((Date.now() - new Date(d)) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function DeleteModal({ job, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
            <svg className="w-4.5 h-4.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Delete Job</h3>
            <p className="text-xs text-slate-400">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-5">
          Are you sure you want to delete <span className="font-semibold text-slate-900">"{job.role}"</span>?
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CompanyJobsAdmin() {
  const navigate = useNavigate();
    const { company } = useCompany();
    const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [selected, setSelected] = useState([]);
  useEffect(() => {
    console.log("cmm",company);
    
    if (!company?._id) return;
  
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/jobs/company/${company._id}`
        );
  console.log("HH",res.data.data );
  
        setJobs(res.data.data || res.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
  
    fetchJobs();
  }, [company]);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = (job) => setDeleteTarget(job);

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${API_BASE}/jobs/${deleteTarget._id}`
      );
  
      setJobs((prev) => prev.filter((j) => j._id !== deleteTarget._id));
      setSelected((prev) => prev.filter((id) => id !== deleteTarget._id));
  
      showToast(`"${deleteTarget.role}" deleted`);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Delete failed:", error);
      showToast("Delete failed", "error");
    }
  };

  const toggleActive = (id) => {
    setJobs((prev) =>
      prev.map((j) => (j._id === id ? { ...j, isActive: !j.isActive } : j))
    );
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map((j) => j._id));
  };

  const deleteSelected = () => {
    setJobs((prev) => prev.filter((j) => !selected.includes(j._id)));
    showToast(`${selected.length} job(s) deleted`);
    setSelected([]);
  };

  const filtered = jobs.filter(
    (j) =>
      !search ||
      j.role.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = jobs.filter((j) => j.isActive).length;

  return (
    <div className="min-h-screen bg-[#f5f5f4] p-4 md:p-6 font-sans">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold text-white transition-all ${toast.type === "success" ? "bg-slate-800" : "bg-red-500"}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {toast.msg}
        </div>
      )}

      {deleteTarget && (
        <DeleteModal
          job={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-xl border border-white shadow overflow-hidden bg-slate-200 flex items-center justify-center">
    {company?.logo ? (
      <img
        src={company.logo}
        alt={company.companyName}
        className="w-full h-full object-cover"
      />
    ) : (
      <span className="text-slate-700 font-bold text-lg">
        {company?.companyName?.charAt(0).toUpperCase()}
      </span>
    )}
  </div>

  <div>
    <h1 className="text-lg font-black text-slate-900 leading-none">
      {company?.companyName}
    </h1>
    <p className="text-xs text-slate-500 mt-0.5">Job Listings</p>
  </div>
</div>
          <button
  onClick={() => navigate("/company/jobs/create")}
  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors"
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
  Add Job
</button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Total Jobs", value: jobs.length, color: "text-slate-900" },
            { label: "Active", value: activeCount, color: "text-emerald-600" },
            { label: "Closed", value: jobs.length - activeCount, color: "text-slate-400" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 px-4 py-3">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 w-56 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              {selected.length > 0 && (
                <button
                  onClick={deleteSelected}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete {selected.length} selected
                </button>
              )}
              <span className="text-xs text-slate-400">{filtered.length} records</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="w-10 px-4 py-2.5">
                    <input
                      type="checkbox"
                      checked={selected.length === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 accent-slate-800"
                    />
                  </th>
                  {["Role", "Department", "Type / Mode", "Location", "Salary", "Openings", "Applications", "Posted", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-12 text-slate-400 text-sm">
                      No jobs found
                    </td>
                  </tr>
                ) : (
                  filtered.map((job) => (
                    <tr
                      key={job._id}
                      className={`transition-colors hover:bg-slate-50/80 ${selected.includes(job._id) ? "bg-slate-50" : ""}`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.includes(job._id)}
                          onChange={() => toggleSelect(job._id)}
                          className="rounded border-slate-300 accent-slate-800"
                        />
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-semibold text-slate-900">{job.role}</span>
                      </td>

                      {/* Department */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-slate-500 text-xs">{job.department}</span>
                      </td>

                      {/* Type / Mode */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`text-xs font-medium ${JOB_TYPE_COLORS[job.jobType] || "text-slate-600"}`}>{job.jobType}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit ${WORK_MODE_COLORS[job.workMode] || "bg-slate-100 text-slate-600"}`}>{job.workMode}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500 text-xs">{job.location}</td>

                      {/* Salary */}
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600 font-mono">
                        {job.currency} {fmt(job.salaryFrom)}–{fmt(job.salaryTo)}
                      </td>

                      {/* Openings */}
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-bold text-slate-700">{job.openings}</span>
                      </td>

                      {/* Applications */}
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-bold text-slate-700">{job.applicationsCount}</span>
                      </td>

                      {/* Posted */}
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-400">{timeAgo(job.postedDate)}</td>

                      {/* Status toggle */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleActive(job._id)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${job.isActive ? "bg-emerald-500" : "bg-slate-200"}`}
                        >
                          <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${job.isActive ? "translate-x-4.5" : "translate-x-0.5"}`} style={{ transform: job.isActive ? "translateX(18px)" : "translateX(2px)" }} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                        <button
  onClick={() =>
    navigate("/jobs/form", { state: { job } })
  }
  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
  title="Edit"
>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(job)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="Delete"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-400">
              {selected.length > 0 ? `${selected.length} selected` : `Showing ${filtered.length} of ${jobs.length} jobs`}
            </span>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1 text-xs text-slate-500 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors" disabled>
                Previous
              </button>
              <span className="px-2.5 py-1 text-xs font-semibold bg-slate-900 text-white rounded-lg">1</span>
              <button className="px-2.5 py-1 text-xs text-slate-500 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}