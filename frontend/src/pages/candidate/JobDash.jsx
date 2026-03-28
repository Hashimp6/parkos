import { useState, useEffect } from "react";
import API_BASE from "../../../config";
import { useUser } from "../../context/UserContext";
import axios from "axios";



// ─── Mock Data (matches exact schema) ───────────────────────────────────────
const MOCK_APPLICATIONS = [
  {
    _id: "app001",
    job: {
      _id: "job001",
      role: "Senior Frontend Engineer",
      department: "Engineering",
      location: "Bangalore, India",
      jobType: "Full-time",
      workMode: "Hybrid",
      company: "TechCorp Solutions",
      salaryFrom: 25,
      salaryTo: 40,
      currency: "LPA",
    },
    candidate: {
      _id: "cand001",
      name: "Arjun Menon",
      email: "arjun.menon@email.com",
      phone: "+91 98765 43210",
      tagline: "Crafting delightful user experiences",
      skills: ["React", "TypeScript", "Tailwind", "Node.js"],
    },
    resume: "https://example.com/resume.pdf",
    coverLetter: "I am excited to apply for this position as it aligns perfectly with my 5 years of experience building scalable frontend applications.",
    status: "Interview",
    appliedAt: "2025-03-10T08:30:00Z",
    statusHistory: [
      { status: "Applied", changedAt: "2025-03-10T08:30:00Z", note: "" },
      { status: "Shortlisted", changedAt: "2025-03-13T10:00:00Z", note: "Strong portfolio" },
      { status: "Interview", changedAt: "2025-03-18T14:00:00Z", note: "Scheduled for technical round" },
    ],
    internalNote: "Candidate has strong React skills. Proceed to system design round.",
    createdAt: "2025-03-10T08:30:00Z",
    updatedAt: "2025-03-18T14:00:00Z",
  },
  {
    _id: "app002",
    job: {
      _id: "job002",
      role: "Product Designer",
      department: "Design",
      location: "Remote",
      jobType: "Full-time",
      workMode: "Remote",
      company: "Designly Inc.",
      salaryFrom: 18,
      salaryTo: 28,
      currency: "LPA",
    },
    candidate: {
      _id: "cand001",
      name: "Arjun Menon",
      email: "arjun.menon@email.com",
      phone: "+91 98765 43210",
      tagline: "Crafting delightful user experiences",
      skills: ["Figma", "UX Research", "Prototyping"],
    },
    resume: "https://example.com/resume.pdf",
    coverLetter: "",
    status: "Shortlisted",
    appliedAt: "2025-03-15T11:00:00Z",
    statusHistory: [
      { status: "Applied", changedAt: "2025-03-15T11:00:00Z", note: "" },
      { status: "Shortlisted", changedAt: "2025-03-19T09:00:00Z", note: "Good design portfolio" },
    ],
    internalNote: "",
    createdAt: "2025-03-15T11:00:00Z",
    updatedAt: "2025-03-19T09:00:00Z",
  },
  {
    _id: "app003",
    job: {
      _id: "job003",
      role: "Full Stack Developer",
      department: "Engineering",
      location: "Chennai, India",
      jobType: "Contract",
      workMode: "On-site",
      company: "BuildFast Pvt Ltd",
      salaryFrom: 20,
      salaryTo: 30,
      currency: "LPA",
    },
    candidate: {
      _id: "cand001",
      name: "Arjun Menon",
      email: "arjun.menon@email.com",
      phone: "+91 98765 43210",
      tagline: "Crafting delightful user experiences",
      skills: ["React", "Django", "PostgreSQL", "Docker"],
    },
    resume: "",
    coverLetter: "",
    status: "Applied",
    appliedAt: "2025-03-20T09:15:00Z",
    statusHistory: [
      { status: "Applied", changedAt: "2025-03-20T09:15:00Z", note: "" },
    ],
    internalNote: "",
    createdAt: "2025-03-20T09:15:00Z",
    updatedAt: "2025-03-20T09:15:00Z",
  },
  {
    _id: "app004",
    job: {
      _id: "job004",
      role: "Backend Engineer",
      department: "Engineering",
      location: "Hyderabad, India",
      jobType: "Full-time",
      workMode: "Hybrid",
      company: "CloudNine Systems",
      salaryFrom: 22,
      salaryTo: 35,
      currency: "LPA",
    },
    candidate: {
      _id: "cand001",
      name: "Arjun Menon",
      email: "arjun.menon@email.com",
      phone: "+91 98765 43210",
      tagline: "Crafting delightful user experiences",
      skills: ["Node.js", "MongoDB", "Redis"],
    },
    resume: "https://example.com/resume.pdf",
    coverLetter: "Looking forward to contributing to your backend infrastructure.",
    status: "Rejected",
    appliedAt: "2025-02-28T14:00:00Z",
    statusHistory: [
      { status: "Applied", changedAt: "2025-02-28T14:00:00Z", note: "" },
      { status: "Shortlisted", changedAt: "2025-03-03T11:00:00Z", note: "" },
      { status: "Rejected", changedAt: "2025-03-07T10:00:00Z", note: "Position filled internally" },
    ],
    internalNote: "Position filled. Keep for future openings.",
    createdAt: "2025-02-28T14:00:00Z",
    updatedAt: "2025-03-07T10:00:00Z",
  },
  {
    _id: "app005",
    job: {
      _id: "job005",
      role: "React Native Developer",
      department: "Mobile",
      location: "Pune, India",
      jobType: "Full-time",
      workMode: "Hybrid",
      company: "Appify Studio",
      salaryFrom: 16,
      salaryTo: 24,
      currency: "LPA",
    },
    candidate: {
      _id: "cand001",
      name: "Arjun Menon",
      email: "arjun.menon@email.com",
      phone: "+91 98765 43210",
      tagline: "Crafting delightful user experiences",
      skills: ["React Native", "Expo", "Firebase"],
    },
    resume: "https://example.com/resume.pdf",
    coverLetter: "I have built 3 production apps using React Native.",
    status: "Selected",
    appliedAt: "2025-02-20T10:00:00Z",
    statusHistory: [
      { status: "Applied", changedAt: "2025-02-20T10:00:00Z", note: "" },
      { status: "Shortlisted", changedAt: "2025-02-23T09:00:00Z", note: "" },
      { status: "Interview", changedAt: "2025-02-26T14:00:00Z", note: "Technical interview passed" },
      { status: "Selected", changedAt: "2025-03-01T11:00:00Z", note: "Offer letter sent" },
    ],
    internalNote: "Exceptional candidate. Offer extended at top of band.",
    createdAt: "2025-02-20T10:00:00Z",
    updatedAt: "2025-03-01T11:00:00Z",
  },
];

// ─── Config ──────────────────────────────────────────────────────────────────
const STATUS_PIPELINE = ["Applied", "Shortlisted", "Interview", "Selected", "Rejected"];

const STATUS_CONFIG = {
  Applied:    { bg: "bg-zinc-100",     text: "text-zinc-600",    border: "border-zinc-200",  dot: "bg-zinc-400",    ring: "ring-zinc-200" },
  Shortlisted:{ bg: "bg-blue-50",      text: "text-blue-600",    border: "border-blue-200",  dot: "bg-blue-400",    ring: "ring-blue-200" },
  Interview:  { bg: "bg-amber-50",     text: "text-amber-600",   border: "border-amber-200", dot: "bg-amber-400",   ring: "ring-amber-200" },
  Selected:   { bg: "bg-emerald-50",   text: "text-emerald-600", border: "border-emerald-200",dot: "bg-emerald-500", ring: "ring-emerald-200" },
  Rejected:   { bg: "bg-red-50",       text: "text-red-500",     border: "border-red-200",   dot: "bg-red-400",     ring: "ring-red-200" },
};

const WORK_MODE_ICON = { Remote: "🌐", Hybrid: "⚡", "On-site": "🏢" };

// ─── Helpers ─────────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 30) return `${diff}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, size = "sm" }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.Applied;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide ${c.bg} ${c.text} ${size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs"}`}>
      <span className={`rounded-full flex-shrink-0 ${c.dot} ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
      {status}
    </span>
  );
}

// ─── Pipeline Steps ───────────────────────────────────────────────────────────
function PipelineTrack({ history, currentStatus }) {
  const steps = STATUS_PIPELINE.filter(s => s !== "Rejected");
  const isRejected = currentStatus === "Rejected";
  const currentIdx = isRejected
    ? steps.length
    : steps.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((step, i) => {
        const histEntry = history.find(h => h.status === step);
        const done = isRejected ? false : i <= currentIdx;
        const active = !isRejected && i === currentIdx;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all
                ${active ? "bg-zinc-900 border-zinc-900 shadow-sm" : done ? "bg-zinc-800 border-zinc-800" : "bg-white border-zinc-200"}`}>
                {done || active ? (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                )}
              </div>
              <span className={`text-[9px] font-semibold whitespace-nowrap ${done || active ? "text-zinc-700" : "text-zinc-300"}`}>
                {step}
              </span>
              {histEntry && (
                <span className="text-[8px] text-zinc-300 whitespace-nowrap">
                  {new Date(histEntry.changedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
              )}
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-1 mb-5 ${done && i < currentIdx ? "bg-zinc-800" : "bg-zinc-100"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function DetailPanel({ app, onClose }) {
  const [tab, setTab] = useState("overview");
  if (!app) return null;
  const { job, candidate, status, appliedAt, resume, coverLetter, statusHistory, internalNote } = app;

  return (
    <div className="fixed inset-0 z-50 flex" style={{ fontFamily: "'Sora', sans-serif" }}>
      <div className="flex-1 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-lg bg-white h-full flex flex-col shadow-2xl" style={{ animation: "slideIn .22s cubic-bezier(.32,.72,0,1)" }}>

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-zinc-100 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-zinc-900 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
              <img
  src={job.company?.logo}
  alt={job.company?.companyName}
  className="w-9 h-9 rounded-xl object-cover"
/>
              </div>
              <div>
                <h2 className="font-bold text-zinc-900 text-base leading-tight">{job.role}</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
  {job.company?.companyName || job.company} · {job.department}
</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={status} size="md" />
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center flex-shrink-0 transition-colors">
                <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {["overview", "history", "documents"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${tab === t ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-zinc-700"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {tab === "overview" && (
            <div className="flex flex-col gap-5">
              {/* Job Details Grid */}
              <div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-2">Job Details</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["Location", job.location],
                    ["Work Mode", `${WORK_MODE_ICON[job.workMode] || ""} ${job.workMode}`],
                    ["Type", job.jobType],
                    ["Salary", `${job.salaryFrom}–${job.salaryTo} ${job.currency}`],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-zinc-50 rounded-xl px-3 py-2.5">
                      <p className="text-[9px] text-zinc-400 uppercase tracking-wider font-bold mb-0.5">{label}</p>
                      <p className="text-sm font-semibold text-zinc-900">{val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pipeline */}
              <div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-3">Application Pipeline</p>
                <div className="bg-zinc-50 rounded-2xl p-4">
                  <PipelineTrack history={statusHistory} currentStatus={status} />
                  {status === "Rejected" && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-red-500 font-medium">
                      <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-400">✕</span>
                      Application was not moved forward
                      {statusHistory.find(h => h.status === "Rejected")?.note && (
                        <span className="text-zinc-400 font-normal">— {statusHistory.find(h => h.status === "Rejected").note}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Candidate */}
              <div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-2">Candidate</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {candidate?.name?.split(" ").map(n => n[0]).join("") || "NA"}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 text-sm">{candidate.name}</p>
                    <p className="text-xs text-zinc-400">{candidate.email}</p>
                  </div>
                </div>
              </div>

              {/* Internal Note */}
              {internalNote && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                  <p className="text-[9px] text-amber-500 uppercase tracking-widest font-bold mb-1">HR Note</p>
                  <p className="text-xs text-amber-800 leading-relaxed">{internalNote}</p>
                </div>
              )}

              <p className="text-[10px] text-zinc-300 text-center">Applied {fmtDate(appliedAt)}</p>
            </div>
          )}

          {tab === "history" && (
            <div className="flex flex-col gap-1">
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-3">Status Timeline</p>
              <div className="relative">
                <div className="absolute left-[11px] top-0 bottom-0 w-px bg-zinc-100" />
                <div className="flex flex-col gap-3">
                  {[...statusHistory].reverse().map((entry, i) => {
                    const c = STATUS_CONFIG[entry.status] || STATUS_CONFIG.Applied;
                    return (
                      <div key={i} className="flex gap-4 items-start relative">
                        <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 bg-white z-10 ${c.border}`}>
                          <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                        </div>
                        <div className="flex-1 pb-3">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${c.text}`}>{entry.status}</span>
                            <span className="text-[10px] text-zinc-300">{fmtDate(entry.changedAt)}</span>
                          </div>
                          {entry.note && (
                            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{entry.note}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === "documents" && (
            <div className="flex flex-col gap-4">
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1">Documents</p>

              {/* Resume */}
              <div className="border border-zinc-100 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-lg">📄</div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">Resume / CV</p>
                      <p className="text-xs text-zinc-400">{resume ? "Uploaded" : "Not provided"}</p>
                    </div>
                  </div>
                  {resume ? (
                    <a href={resume} target="_blank" rel="noreferrer"
                      className="text-xs font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-lg transition-colors">
                      View ↗
                    </a>
                  ) : (
                    <span className="text-xs text-zinc-300">—</span>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              <div className="border border-zinc-100 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-lg">✉️</div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Cover Letter</p>
                    <p className="text-xs text-zinc-400">{coverLetter ? "Provided" : "Not provided"}</p>
                  </div>
                </div>
                {coverLetter ? (
                  <p className="text-xs text-zinc-500 leading-relaxed bg-zinc-50 rounded-xl p-3">{coverLetter}</p>
                ) : (
                  <p className="text-xs text-zinc-300 italic">No cover letter submitted.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Application Card ─────────────────────────────────────────────────────────
function ApplicationCard({ app, onClick, index }) {
  const { job, status, appliedAt, statusHistory, resume, coverLetter } = app;
  const lastUpdate = statusHistory[statusHistory.length - 1];

  return (
    <div
      onClick={onClick}
      className="group bg-white border border-zinc-100 rounded-2xl p-5 cursor-pointer hover:border-zinc-300 hover:shadow-md transition-all duration-200 flex flex-col gap-3.5"
      style={{ animation: `fadeUp .3s ease both`, animationDelay: `${index * 50}ms`, fontFamily: "'Sora', sans-serif" }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-9 h-9 rounded-xl overflow-hidden bg-zinc-100 flex items-center justify-center">
  {job.company?.logo ? (
    <img
      src={job.company.logo}
      alt={job.company.companyName}
      className="w-full h-full object-cover"
      onError={(e) => (e.target.style.display = "none")}
    />
  ) : (
    <span className="text-xs font-bold text-zinc-500">
      {job.company?.companyName?.[0]}
    </span>
  )}
</div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-zinc-900 leading-tight truncate">{job.role}</h3>
            <p className="text-[11px] text-zinc-400 truncate">{job.company?.companyName || "Unknown Company"}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-3 flex-wrap text-[11px] text-zinc-400">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {job.location}
        </span>
        <span>{WORK_MODE_ICON[job.workMode] || ""} {job.workMode}</span>
        <span className="bg-zinc-50 border border-zinc-100 px-2 py-0.5 rounded-full">{job.jobType}</span>
      </div>

      {/* Salary + applied */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-zinc-900">
          {job.salaryFrom}–{job.salaryTo}
          <span className="text-xs font-medium text-zinc-400 ml-1">{job.currency}</span>
        </span>
        <span className="text-[10px] text-zinc-300">{timeAgo(appliedAt)}</span>
      </div>

      {/* Mini pipeline */}
      <div className="pt-2 border-t border-zinc-50">
        <PipelineTrack history={statusHistory} currentStatus={status} />
      </div>

      {/* Footer: docs + last note */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {resume && (
            <span className="text-[10px] bg-zinc-50 border border-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">📄 Resume</span>
          )}
          {coverLetter && (
            <span className="text-[10px] bg-zinc-50 border border-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">✉️ Letter</span>
          )}
        </div>
        {lastUpdate?.note && (
          <span className="text-[10px] text-zinc-300 italic truncate max-w-[120px]">"{lastUpdate.note}"</span>
        )}
      </div>
    </div>
  );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────
const FILTER_OPTIONS = ["All", ...STATUS_PIPELINE];

function FilterBar({ active, onChange, counts }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {FILTER_OPTIONS.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            active === f ? "bg-zinc-900 text-white shadow-sm" : "bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-400"
          }`}
        >
          {f}
          {counts[f] > 0 && (
            <span className={`text-[10px] rounded-full w-4 h-4 flex items-center justify-center ${active === f ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"}`}>
              {counts[f]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState(null);
 const { user } = useUser();

 
 useEffect(() => {
   const fetchApplications = async () => {
     try {
       if (!user?._id) return;
 
       const res = await axios.get(
         `${API_BASE}/jobs-application/candidate/${user._id}`
       );
 
       console.log("API Response:", res.data.data);
 
       setApplications(res.data?.success ? res.data.data : []);
     } catch (err) {
       console.error("API Error:", err);
       setApplications(MOCK_APPLICATIONS); // fallback
     } finally {
       setLoading(false);
     }
   };
 
   fetchApplications();
 }, [user]);

  // Counts per status
  const counts = FILTER_OPTIONS.reduce((acc, f) => {
    acc[f] = f === "All" ? applications.length : applications.filter(a => a.status === f).length;
    return acc;
  }, {});

  // Filter + Search + Sort
  const visible = applications
    .filter(a => filter === "All" || a.status === filter)
    .filter(a => {
      const companyName = a.job.company?.companyName || a.job.company || "";
      return !search || a.job.role.toLowerCase().includes(search.toLowerCase()) 
        || companyName.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      if (sort === "company") {
        const ca = a.job.company?.companyName || a.job.company || "";
        const cb = b.job.company?.companyName || b.job.company || "";
        return ca.localeCompare(cb);
      }
      return 0;
    });

  // Summary stats
  const stats = [
    { label: "Total", value: applications.length, icon: "📬" },
    { label: "Active", value: applications.filter(a => !["Rejected", "Selected"].includes(a.status)).length, icon: "🔄" },
    { label: "Interviews", value: applications.filter(a => a.status === "Interview").length, icon: "🗓️" },
    { label: "Selected", value: applications.filter(a => a.status === "Selected").length, icon: "🎉" },
    { label: "Rejected", value: applications.filter(a => a.status === "Rejected").length, icon: "✖" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      <div className="min-h-screen bg-zinc-50 px-6 py-8 max-w-6xl mx-auto" style={{ fontFamily: "'Sora', sans-serif" }}>

        {/* Page Header */}
        <div className="mb-7 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">My Applications</h1>
            <p className="text-sm text-zinc-400 mt-0.5">Track every application, status update & document</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Sort */}
            {/* <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="bg-white border border-zinc-200 rounded-xl text-xs font-medium text-zinc-600 px-3 py-2 focus:outline-none focus:border-zinc-400 cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="company">Company A–Z</option>
            </select> */}
            {/* Search */}
            {/* <div className="relative">
              <input
                type="text"
                placeholder="Search role or company…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-white border border-zinc-200 rounded-xl pl-8 pr-4 py-2 text-xs text-zinc-700 focus:outline-none focus:border-zinc-400 placeholder-zinc-300 w-52"
              />
              <svg className="w-3.5 h-3.5 text-zinc-300 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div> */}
          </div>
        </div>

        {/* Stat pills */}
        {/* <div className="flex items-center gap-3 mb-6 flex-wrap">
          {stats.map(s => (
            <div key={s.label} className="bg-white border border-zinc-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <span className="text-base">{s.icon}</span>
              <div>
                <p className="text-lg font-bold text-zinc-900 leading-none">{s.value}</p>
                <p className="text-[10px] text-zinc-400 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div> */}

        {/* Filter Bar */}
        {/* <div className="mb-6">
          <FilterBar active={filter} onChange={setFilter} counts={counts} />
        </div> */}

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white border border-zinc-100 rounded-2xl p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-zinc-100 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-3 bg-zinc-100 rounded w-2/3 mb-2" />
                    <div className="h-2 bg-zinc-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-2 bg-zinc-100 rounded w-3/4 mb-2" />
                <div className="h-2 bg-zinc-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-300">
            <span className="text-5xl mb-3">📭</span>
            <p className="text-sm font-semibold">No applications found</p>
          
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {visible.map((app, i) => (
              <ApplicationCard key={app._id} app={app} index={i} onClick={() => setSelected(app)} />
            ))}
          </div>
        )}

        {/* Result count */}
        {!loading && visible.length > 0 && (
          <p className="text-center text-xs text-zinc-300 mt-8">
            Showing {visible.length} of {applications.length} application{applications.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Detail Panel */}
      {selected && <DetailPanel app={selected} onClose={() => setSelected(null)} />}
    </>
  );
}