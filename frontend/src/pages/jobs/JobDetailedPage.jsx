import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import API_BASE from "../../../config";

/* ─── Normalize API job to internal shape ─────────────────────────────── */
const normalizeJob = (j) => ({
  ...j,
  title:        j.role || j.title || "Untitled Role",
  company:      typeof j.company === "object"
                  ? (j.company?.companyName || j.company?.name || "")
                  : (j.company || ""),
  companyLogo:  (typeof j.company === "object" ? j.company?.logo : null) || j.companyLogo || null,
  workType:     j.workMode === "On-site" ? "Onsite" : (j.workMode || j.workType || ""),
  salaryMin:    j.salary ?? null,
  tags:         j.skills     || j.tags    || [],
  postedAt:     j.postedDate || j.postedAt || null,
  businessPark: j.businessPark || null,
});

/* ─── Helpers ─────────────────────────────────────────────────────────── */
const timeAgo = (d) => {
  if (!d) return null;
  const days = Math.floor((Date.now() - new Date(d)) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 7)  return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

/* ─── Design tokens ───────────────────────────────────────────────────── */
const T = {
  white: "#FFFFFF",
  bg:    "#F7F7F8",
  g50:   "#F4F4F5",
  g100:  "#EBEBED",
  g200:  "#D4D4D8",
  g400:  "#9A9A9E",
  g600:  "#52525A",
  black: "#0A0A0B",
};

/* ─── Global CSS ──────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Manrope:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #F7F7F8; }
  button, input, select { font-family: inherit; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #E0E0E4; border-radius: 99px; }
  @keyframes fdIn   { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
  @keyframes shimmer { from{background-position:-200% 0} to{background-position:200% 0} }
  @keyframes toastIn { from{transform:translate(-50%,12px);opacity:0} to{transform:translate(-50%,0);opacity:1} }
`;

/* ─── Markdown renderer ───────────────────────────────────────────────── */
function RenderDesc({ text }) {
  if (!text?.trim()) return null;
  return (
    <div style={{ fontFamily: "'Manrope', sans-serif" }}>
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: 10 }} />;
        if (/^\*\*(.+)\*\*$/.test(line))
          return (
            <p key={i} style={{ fontWeight: 700, fontSize: 14, color: T.black, margin: "20px 0 8px", letterSpacing: "-0.01em" }}>
              {line.replace(/\*\*/g, "")}
            </p>
          );
        if (line.startsWith("- "))
          return (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.g400, flexShrink: 0, marginTop: 9 }} />
              <p style={{ fontSize: 14, color: T.g600, lineHeight: 1.75, margin: 0 }}>{line.slice(2)}</p>
            </div>
          );
        return <p key={i} style={{ fontSize: 14, color: T.g600, lineHeight: 1.8, margin: "0 0 4px" }}>{line}</p>;
      })}
    </div>
  );
}

/* ─── Logo ────────────────────────────────────────────────────────────── */
function Logo({ company, logo, size = 56 }) {
  const name     = typeof company === "string" ? company : "";
  const initials = name.split(" ").filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";
  const base     = { width: size, height: size, borderRadius: 14, flexShrink: 0 };

  if (logo)
    return (
      <div style={{ ...base, overflow: "hidden", border: `1px solid ${T.g100}`, background: T.white }}>
        <img src={logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }}
          onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement.textContent = initials; }} />
      </div>
    );

  return (
    <div style={{ ...base, background: T.g50, border: `1px solid ${T.g100}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: Math.round(size * 0.32), color: T.g400 }}>
      {initials}
    </div>
  );
}

/* ─── WorkBadge ───────────────────────────────────────────────────────── */
function WorkBadge({ type }) {
  if (!type) return null;
  const filled = type === "Remote";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "4px 12px", borderRadius: 6,
      fontFamily: "'Manrope',sans-serif", fontSize: 11, fontWeight: 700,
      letterSpacing: "0.07em", textTransform: "uppercase",
      background: filled ? T.black : T.white,
      color: filled ? T.white : T.black,
      border: `1.5px solid ${T.black}`,
      whiteSpace: "nowrap",
    }}>
      {type}
    </span>
  );
}

/* ─── Tag ─────────────────────────────────────────────────────────────── */
function Tag({ children }) {
  return (
    <span style={{
      padding: "4px 12px", borderRadius: 6,
      background: T.g50, border: `1px solid ${T.g100}`,
      fontFamily: "'Manrope',sans-serif",
      fontSize: 12, color: T.g600, whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

/* ─── Pill ────────────────────────────────────────────────────────────── */
function Pill({ children }) {
  return (
    <span style={{
      padding: "4px 12px", borderRadius: 6,
      background: T.g50, border: `1px solid ${T.g100}`,
      fontFamily: "'Manrope',sans-serif",
      fontSize: 11, color: T.g600, whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

/* ─── Section Label ───────────────────────────────────────────────────── */
function SLabel({ children }) {
  return (
    <p style={{
      fontFamily: "'Manrope',sans-serif", fontSize: 10, fontWeight: 800,
      letterSpacing: "0.12em", textTransform: "uppercase",
      color: T.g400, margin: "0 0 14px",
    }}>
      {children}
    </p>
  );
}

/* ─── MetaItem ────────────────────────────────────────────────────────── */
function MetaItem({ icon, label, value }) {
  if (!value) return null;
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 4,
      padding: "14px 16px", borderRadius: 12,
      background: T.g50, border: `1px solid ${T.g100}`,
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 10, fontWeight: 600, color: T.g400, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </span>
      <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, fontWeight: 700, color: T.black }}>
        {value}
      </span>
    </div>
  );
}

/* ─── Skeleton ────────────────────────────────────────────────────────── */
function Skeleton() {
  const s = {
    background: `linear-gradient(90deg, ${T.g50} 25%, #ECECEE 50%, ${T.g50} 75%)`,
    backgroundSize: "200% 100%",
    animation: "shimmer 1.6s infinite",
    borderRadius: 8,
  };
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ ...s, height: 16, width: 80, marginBottom: 32 }} />
      <div style={{ display: "flex", gap: 16, marginBottom: 24, alignItems: "center" }}>
        <div style={{ ...s, width: 64, height: 64, borderRadius: 14, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ ...s, height: 24, width: "60%", marginBottom: 10 }} />
          <div style={{ ...s, height: 14, width: "40%" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[80, 70, 90].map((w, i) => <div key={i} style={{ ...s, height: 28, width: w, borderRadius: 6 }} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
        {[1,2,3,4,5,6].map(i => <div key={i} style={{ ...s, height: 80, borderRadius: 12 }} />)}
      </div>
      {[100, 80, 90, 70, 85].map((w, i) => (
        <div key={i} style={{ ...s, height: 14, width: `${w}%`, marginBottom: 10 }} />
      ))}
    </div>
  );
}

/* ─── Toast ───────────────────────────────────────────────────────────── */
function Toast({ data, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed", bottom: 28, left: "50%",
      transform: "translateX(-50%)", zIndex: 400,
      background: data.type === "success" ? "#111" : "#7f1d1d",
      color: "#fff", padding: "12px 22px", borderRadius: 12,
      fontSize: 13, fontWeight: 600,
      display: "flex", alignItems: "center", gap: 10,
      animation: "toastIn .3s ease", whiteSpace: "nowrap",
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    }}>
      <span>{data.type === "success" ? "✓" : "✕"}</span>
      <span>{data.message}</span>
    </div>
  );
}

/* ─── Main JobDetailPage ──────────────────────────────────────────────── */
export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [job, setJob]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [toast, setToast]   = useState(null);
  const [applying, setApplying] = useState(false);

  /* ── Fetch job ── */
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`${API_BASE}/jobs/${id}`)
      .then(res => {
        const raw = res.data?.data ?? res.data;
        setJob(normalizeJob(raw));
      })
      .catch(() => setError("Could not load this job. It may have been removed."))
      .finally(() => setLoading(false));
  }, [id]);

  /* ── Apply ── */
  const handleApply = async () => {
    if (!user?._id) {
      setToast({ type: "error", message: "Please login to apply" });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    if (!user?.cv) {
      setToast({ type: "error", message: "Please upload your CV first" });
      setTimeout(() => navigate("/profile/set/form"), 1500);
      return;
    }
    try {
      setApplying(true);
      const res = await axios.post(`${API_BASE}/jobs-application/apply`, {
        jobId: job._id,
        candidateId: user._id,
        coverLetter: "",
      });
      if (res.data.success) {
        setToast({ type: "success", message: "Applied successfully!" });
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setToast({ type: "error", message: "You already applied for this job" });
      } else {
        setToast({ type: "error", message: "Failed to apply. Please try again." });
      }
    } finally {
      setApplying(false);
    }
  };

  /* ── Share ── */
  const handleShare = async () => {
   
    
    const url = window.location.href;
    const shareData = { title: job?.title, text: `Looking for a ${job?.title} role? 🚀 Apply now at ${job?.company}!`, url };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (_) {}
    } else {
      await navigator.clipboard.writeText(url);
      setToast({ type: "success", message: "Link copied to clipboard" });
    }
  };

  const posted   = job ? timeAgo(job.postedAt) : null;
  const salary   = job?.salary ?? null;
  const deadline = job?.lastDateToApply
    ? new Date(job.lastDateToApply).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── Top nav bar ── */}
      <div style={{
        background: T.white, borderBottom: `1px solid ${T.g100}`,
        position: "sticky", top: 0, zIndex: 50,
        padding: "0 16px",
      }}>
        <div style={{
          maxWidth: 720, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 56,
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Manrope',sans-serif", fontSize: 13,
              fontWeight: 600, color: T.g600, padding: "6px 0",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Jobs
          </button>

          {job && (
            <button
              onClick={handleShare}
              style={{
                width: 36, height: 36, borderRadius: 8,
                border: `1.5px solid ${T.g200}`,
                background: T.white, cursor: "pointer",
                color: T.g400, display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 100px" }}>
        {loading ? (
          <Skeleton />
        ) : error ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: T.black, marginBottom: 8 }}>
              Job not found
            </p>
            <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: T.g400, marginBottom: 24 }}>
              {error}
            </p>
            <button
              onClick={() => navigate("/jobs")}
              style={{ padding: "10px 24px", borderRadius: 10, background: T.black, color: T.white, border: "none", fontFamily: "'Manrope',sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              Browse all jobs
            </button>
          </div>
        ) : job ? (
          <div style={{ animation: "fdIn .3s ease" }}>

            {/* ── Header card ── */}
            <div style={{
              background: T.white, borderRadius: 20,
              border: `1px solid ${T.g100}`,
              padding: "24px 20px 20px",
              marginTop: 20, marginBottom: 14,
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}>
              {/* Logo row */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 18 }}>
                <Logo company={job.company} logo={job.companyLogo} size={56} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h1 style={{
                    fontFamily: "'DM Serif Display',serif", fontWeight: 400,
                    fontSize: 24, color: T.black, letterSpacing: "-0.03em",
                    lineHeight: 1.15, margin: "0 0 5px",
                  }}>
                    {job.title}
                  </h1>
                  <p style={{
                    fontFamily: "'Manrope',sans-serif", fontSize: 13,
                    color: T.g400, fontWeight: 500, margin: 0,
                  }}>
                    {
                    [
                      job.company === "Admin" ? job.secondName : job.company,
                      job.location
                    ]
                      .filter(Boolean)
                      .join("  ·  ")
                    }
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                <WorkBadge type={job.workMode ?? job.workType} />
                {job.jobType      && <Pill>{job.jobType}</Pill>}
                {job.businessPark && <Pill>{job.businessPark}</Pill>}
                {job.isUrgent && (
                  <span style={{ padding: "4px 12px", borderRadius: 6, border: `1.5px solid ${T.black}`, fontFamily: "'Manrope',sans-serif", fontSize: 10, fontWeight: 700, color: T.black, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Urgent
                  </span>
                )}
              </div>

              {/* Time info */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {posted && (
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: T.g400 }}>
                    🕓 Posted {posted}
                  </span>
                )}
                {deadline && (
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: T.g400 }}>
                    ⏳ Apply by {deadline}
                  </span>
                )}
              </div>
            </div>

            {/* ── Meta grid ── */}
            <div style={{
              background: T.white, borderRadius: 20,
              border: `1px solid ${T.g100}`,
              padding: "20px",
              marginBottom: 14,
            }}>
              <SLabel>Job Details</SLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                <MetaItem icon="💰" label="Salary"     value={salary ? `${salary}` : "Not mentioned"} />
                <MetaItem icon="💼" label="Type"       value={job.jobType} />
                <MetaItem icon="🏢" label="Work Mode"  value={job.workMode ?? job.workType} />
                <MetaItem icon="🕐" label="Experience" value={job.experienceRequired ? `${job.experienceRequired} yr${Number(job.experienceRequired) !== 1 ? "s" : ""}` : null} />
                <MetaItem icon="📍" label="Location"   value={job.location} />
                {job.businessPark && <MetaItem icon="🏙️" label="Park" value={job.businessPark} />}
              </div>
            </div>

            {/* ── Skills ── */}
            {(job.tags?.length > 0 || job.skills?.length > 0) && (
              <div style={{
                background: T.white, borderRadius: 20,
                border: `1px solid ${T.g100}`,
                padding: "20px", marginBottom: 14,
              }}>
                <SLabel>Skills &amp; Tags</SLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(job.skills?.length ? job.skills : job.tags ?? []).map((t, i) => (
                    <Tag key={i}>{t}</Tag>
                  ))}
                </div>
              </div>
            )}

            {/* ── Description ── */}
            <div style={{
              background: T.white, borderRadius: 20,
              border: `1px solid ${T.g100}`,
              padding: "20px", marginBottom: 14,
            }}>
              <SLabel>About the Role</SLabel>
              {(job.description || job.shortDescription)
                ? <RenderDesc text={job.description || job.shortDescription} />
                : <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: T.g400 }}>No description available.</p>
              }
            </div>
          </div>
        ) : null}
      </div>

      {/* ── Sticky Apply CTA ── */}
      {job && !loading && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: T.white, borderTop: `1px solid ${T.g100}`,
          padding: "12px 16px",
          paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
          zIndex: 100,
          boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
        }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <button
              onClick={handleApply}
              disabled={applying}
              onMouseEnter={e => e.currentTarget.style.opacity = ".82"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              style={{
                width: "100%", padding: "15px",
                background: applying ? T.g400 : T.black,
                color: T.white, border: "none", borderRadius: 14,
                fontFamily: "'Manrope',sans-serif", fontSize: 15, fontWeight: 800,
                cursor: applying ? "default" : "pointer",
                letterSpacing: "-0.01em", transition: "opacity .15s",
              }}
            >
              {applying ? "Applying…" : "Apply Now →"}
            </button>
          </div>
        </div>
      )}

      {toast && <Toast data={toast} onClose={() => setToast(null)} />}
    </div>
  );
}