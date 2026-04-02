import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE from "../../../config";

// ─── Fallback mock — only used in isolation/dev without router state ───────
const DEV_MOCK_JOB = {
  _id: "dev",
  role: "Senior Frontend Engineer",
  department: "Engineering",
  location: "Bangalore, India",
  jobType: "Full-time",
  workMode: "Hybrid",
  salary: 1800000,
  currency: "INR",
  isActive: true,
  lastDateToApply: "2025-02-28",
  company: { name: "TechVentures Pvt. Ltd.", industry: "SaaS / B2B", logo: null },
};

// ─── Design tokens (shared with CompanyJobsAdmin) ─────────────────────────
const STATUSES = ["Applied", "Shortlisted", "Interview", "Selected", "Rejected"];

const STATUS_BADGE = {
  Applied:     "bg-zinc-100 text-zinc-500 border border-zinc-200",
  Shortlisted: "bg-blue-50 text-blue-600 border border-blue-200",
  Interview:   "bg-amber-50 text-amber-600 border border-amber-200",
  Selected:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Rejected:    "bg-red-50 text-red-500 border border-red-200",
};

const STATUS_DOT = {
  Applied:     "bg-zinc-400",
  Shortlisted: "bg-blue-500",
  Interview:   "bg-amber-500",
  Selected:    "bg-emerald-500",
  Rejected:    "bg-red-400",
};

const WORK_MODE_STYLES = {
  "On-site": "bg-blue-50 text-blue-600 border border-blue-200",
  Hybrid:    "bg-violet-50 text-violet-600 border border-violet-200",
  Remote:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
};
const IconEdit = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M15.232 5.232l3.536 3.536M9 11l6.768-6.768a2.5 2.5 0 013.536 3.536L12.536 14.536a4 4 0 01-1.414.943L7 17l1.521-4.121A4 4 0 019 11z"
      />
    </svg>
  );
const JOB_TYPE_STYLES = {
  "Full-time": "text-zinc-700",
  "Part-time":  "text-orange-600",
  Contract:     "text-rose-600",
  Internship:   "text-sky-600",
};

// ─── Helpers ───────────────────────────────────────────────────────────────
const initials = (name) =>
  name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "??";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const fmtSalary = (from, to, currency) => {
  const f = (n) =>
    currency === "INR"
      ? `₹${(n / 100000).toFixed(1)}L`
      : `$${(n / 1000).toFixed(0)}K`;
  return `${f(from)} – ${f(to)} / yr`;
};

const countByStatus = (apps, s) => apps.filter((a) => a.status === s).length;

// ─── Inline Icons ──────────────────────────────────────────────────────────
const IconArrowLeft = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);
const IconArrowRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);
const IconSearch = () => (
  <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const IconUsers = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// ─── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-100 px-4 py-3.5">
      <p className={`text-2xl font-semibold ${accent || "text-zinc-900"}`}>{value}</p>
      <p className="text-xs text-zinc-400 mt-0.5 font-medium uppercase tracking-wide">{label}</p>
    </div>
  );
}

// ─── Job Details Page ──────────────────────────────────────────────────────
function JobDetailsPage({ job, applications, onViewApplicants, loadingApps, onBack }) {
    const navigate = useNavigate();
    console.log("job",job);
    
    const fields = [
    { label: "Department", value: job.department },
    { label: "Location",   value: job.location },
    { label: "Job Type",   value: job.jobType },
    { label: "Work Mode",  value: job.workMode },
    { label: "Salary",     value: job.salary},
    { label: "Last Date",  value: fmtDate(job.lastDateToApply) },
    { label: "Company",    value: job.company.name },
    { label: "Industry",   value: job.company.industry },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header — matches CompanyJobsAdmin header style */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <>
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                <IconArrowLeft />
                Jobs
              </button>
              <span className="w-px h-4 bg-zinc-200" />
            </>
          )}
     
          <div>
            <h1 className="text-lg font-semibold text-zinc-900 leading-tight tracking-tight">{job.role}</h1>
            <p className="text-xs text-zinc-400 mt-0.5">{job.company.name}</p>
          </div>
        </div>

        {/* Status badge — same style as table rows */}
        <div className="flex items-center gap-2">
        <button
  onClick={() => navigate("/jobs/form", { state: { job } })}
  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium"
  title="Edit Job"
>
  <IconEdit />
  Edit
</button>

  <span
    className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
      job.isActive
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-zinc-100 text-zinc-400 border-zinc-200"
    }`}
  >
    {job.isActive ? "Active" : "Closed"}
  </span>
</div>
      </div>

 

      {/* Job Info Card */}
      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden mb-4">
        <div className="px-5 py-3.5 border-b border-zinc-100">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Job Details</p>
        </div>
        <div className="divide-y divide-zinc-50">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-zinc-400">{label}</span>
              {label === "Work Mode" ? (
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${WORK_MODE_STYLES[value] || "bg-zinc-100 text-zinc-600 border-zinc-200"}`}>
                  {value}
                </span>
              ) : label === "Job Type" ? (
                <span className={`text-sm font-medium ${JOB_TYPE_STYLES[value] || "text-zinc-700"}`}>{value}</span>
              ) : (
                <span className="text-sm font-medium text-zinc-800">{value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* View Applicants CTA — same button style as table action buttons but prominent */}
      <button
        onClick={onViewApplicants}
        disabled={loadingApps}
        className="w-full flex items-center justify-between px-5 py-4 bg-zinc-900 hover:bg-zinc-800 active:scale-[0.99] text-white rounded-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
            <IconUsers />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold">
              {loadingApps ? "Loading applicants…" : "View Applicants"}
            </span>
            <span className="text-xs text-zinc-400 mt-0.5">
              {loadingApps ? "Fetching from server" : `${applications.length > 0 ? applications.length : "—"} people applied for this role`}
            </span>
          </div>
        </div>
        {loadingApps ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <IconArrowRight />
        )}
      </button>
    </div>
  );
}

// ─── Applicant Detail Drawer ───────────────────────────────────────────────
function ApplicantDrawer({ app, onClose, onStatusChange }) {
  const [note, setNote] = useState("");

  const handleUpdate = (newStatus) => {
    onStatusChange(app._id, newStatus, note);
    setNote("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm p-0 sm:p-6">
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl border border-zinc-100 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-8 h-1 rounded-full bg-zinc-200" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100 flex-shrink-0">
          <div className="w-11 h-11 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
            {initials(app.candidate.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-900">{app.candidate.name}</p>
            <p className="text-xs text-zinc-400 truncate">{app.candidate.tagline}</p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${STATUS_BADGE[app.status]}`}>
            {app.status}
          </span>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 text-xl leading-none flex-shrink-0 ml-1">✕</button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-5 flex flex-col gap-5">
          {/* Contact */}
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Contact</p>
            <p className="text-sm text-zinc-700">{app.candidate.email}</p>
            <p className="text-sm text-zinc-500 mt-0.5">{app.candidate.phone}</p>
          </div>

          {/* Applied on */}
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Applied On</p>
            <p className="text-sm text-zinc-700">{fmtDate(app.appliedAt)}</p>
          </div>

          {/* Skills */}
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {(app.candidate.skills || []).map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">{s}</span>
              ))}
            </div>
          </div>

          {/* CV */}
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Resume / CV</p>
            <button
              onClick={() => alert(`Downloading: ${app.candidate.cv}\n\nReplace with real download URL from your backend.`)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-xs font-bold text-red-500 flex-shrink-0">PDF</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-800 truncate">{app.candidate.cv}</p>
                <p className="text-xs text-zinc-400">Click to download</p>
              </div>
              <span className="text-zinc-400 text-sm">↓</span>
            </button>
          </div>

          {/* Cover Letter */}
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Cover Letter</p>
            <p className="text-sm text-zinc-600 leading-relaxed bg-zinc-50 rounded-xl p-3.5 border border-zinc-100">{app.coverLetter}</p>
          </div>

          {/* Update Status */}
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Update Status</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleUpdate(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    app.status === s
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:bg-zinc-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional)..."
              rows={2}
              className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2 text-zinc-700 placeholder-zinc-300 focus:outline-none focus:border-zinc-400 resize-none"
            />
          </div>

          {/* Status History */}
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">History</p>
            <div className="flex flex-col">
              {[...app.statusHistory].reverse().map((h, i, arr) => (
                <div key={i} className="flex gap-3 pb-3">
                  <div className="flex flex-col items-center">
                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${STATUS_DOT[h.status]}`} />
                    {i < arr.length - 1 && <div className="w-px flex-1 bg-zinc-100 mt-1" />}
                  </div>
                  <div className="pb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-800">{h.status}</span>
                      <span className="text-xs text-zinc-400">{fmtDate(h.changedAt)}</span>
                    </div>
                    {h.note && <p className="text-xs text-zinc-400 mt-0.5">{h.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Applicants Page ───────────────────────────────────────────────────────
function ApplicantsPage({ job, applications, onBack, onStatusChange }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const filtered = applications.filter((a) => {
    const matchStatus = filter === "All" || a.status === filter;
    const matchSearch =
      search === "" ||
      a.candidate.name.toLowerCase().includes(search.toLowerCase()) ||
      a.candidate.email.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const selectedApp = applications.find((a) => a._id === selectedId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header — same style as CompanyJobsAdmin header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <IconArrowLeft />
            Job Details
          </button>
          <span className="w-px h-4 bg-zinc-200" />
          <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center flex-shrink-0">
            {job.company.logo ? (
              <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-zinc-700 font-bold text-base">{job.company.name?.charAt(0)}</span>
            )}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-zinc-900 leading-tight tracking-tight">Applicants</h1>
            <p className="text-xs text-zinc-400 mt-0.5">{job.role} · {applications.length} total</p>
          </div>
        </div>
      </div>

  

      {/* Table Card — same card style as CompanyJobsAdmin */}
      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">

       

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100">
                {["Candidate", "Contact", "Skills", "Status", "Applied", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-zinc-400 text-sm">
                    No applicants found
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr
                    key={app._id}
                    className="hover:bg-zinc-50/70 transition-colors cursor-pointer"
                    onClick={() => setSelectedId(app._id)}
                  >
                    {/* Candidate */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {initials(app.candidate.name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">{app.candidate.name}</p>
                          <p className="text-xs text-zinc-400 max-w-[160px] truncate">{app.candidate.tagline}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-zinc-500">{app.candidate.email}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{app.candidate.phone}</p>
                    </td>

                    {/* Skills */}
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1 flex-wrap">
                      {(app.candidate.skills || []).slice(0, 2).map((s) => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-500 border border-zinc-200">{s}</span>
                        ))}
{(app.candidate.skills || []).length > 2 && (
                          <span className="text-xs text-zinc-300">+{app.candidate.skills.length - 2}</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[app.status]}`}>
                        {app.status}
                      </span>
                    </td>

                    {/* Applied */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs text-zinc-400">
                      {fmtDate(app.appliedAt)}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <span className="text-xs text-zinc-300 hover:text-zinc-600 transition-colors">View →</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-zinc-100 bg-zinc-50/50">
          <span className="text-xs text-zinc-400">
            Showing {filtered.length} of {applications.length} applicants
          </span>
          <div className="flex items-center gap-1">
            <button disabled className="px-2.5 py-1 text-xs text-zinc-400 border border-zinc-200 rounded-lg bg-white disabled:opacity-40">Previous</button>
            <span className="px-2.5 py-1 text-xs font-semibold bg-zinc-900 text-white rounded-lg">1</span>
            <button disabled className="px-2.5 py-1 text-xs text-zinc-400 border border-zinc-200 rounded-lg bg-white disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {selectedApp && (
        <ApplicantDrawer
          app={selectedApp}
          onClose={() => setSelectedId(null)}
          onStatusChange={(id, status, note) => {
            onStatusChange(id, status, note);
            setSelectedId(null);
          }}
        />
      )}
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────
export default function JobDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Job object passed from CompanyJobsAdmin via navigate(route, { state: { job } })
  const job = location.state?.job || DEV_MOCK_JOB;

  const [view, setView] = useState("job"); // "job" | "applicants"
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Fetch applicants only when the user clicks "View Applicants"
  const handleViewApplicants = async () => {
    if (applications.length === 0) {
      setLoadingApps(true);
      try {
        const res = await axios.get( `${API_BASE}/jobs-application?jobId=${job._id}`);
        console.log("appli",res.data.data);
        
        setApplications(res.data.data || res.data);
      } catch (err) {
        console.error("Failed to load applicants:", err);
      } finally {
        setLoadingApps(false);
      }
    }
    setView("applicants");
  };

  // Wire to: PATCH /api/applications/:id/status
  const handleStatusChange = async (appId, newStatus, note) => {
    try {
      await axios.patch(`${API_BASE}/jobs-application/${appId}/status`, { status: newStatus, note });
    } catch (err) {
      console.error("Status update failed:", err);
    }
    setApplications((prev) =>
      prev.map((a) =>
        a._id === appId
          ? {
              ...a,
              status: newStatus,
              statusHistory: [
                ...a.statusHistory,
                { status: newStatus, changedAt: new Date().toISOString(), note: note || "" },
              ],
            }
          : a
      )
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {view === "job" ? (
        <JobDetailsPage
          job={job}
          applications={applications}
          onViewApplicants={handleViewApplicants}
          loadingApps={loadingApps}
          onBack={() => navigate(-1)}
        />
      ) : (
        <ApplicantsPage
          job={job}
          applications={applications}
          onBack={() => setView("job")}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}