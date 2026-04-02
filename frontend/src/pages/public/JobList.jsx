import axios from "axios";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import API_BASE from "../../../config";
import { useNavigate } from "react-router-dom";

/* ─── Normalize API job to internal shape ─────────────────────────────── */
const normalizeJob = (j) => ({
  ...j,
  title:       j.role || j.title || "Untitled Role",
  company:     typeof j.company === "object"
                 ? (j.company?.companyName || j.company?.name || "")
                 : (j.company || ""),
  companyLogo: (typeof j.company === "object" ? j.company?.logo : null) || j.companyLogo || null,
  workType:    j.workMode === "On-site" ? "Onsite" : (j.workMode || j.workType || ""),
  salaryMin:   j.salary ?? j.salary ?? null,
  tags:        j.skills      || j.tags       || [],
  postedAt:    j.postedDate  || j.postedAt   || null,
  businessPark: j.businessPark || null,
});

/* ─── Helpers ─────────────────────────────────────────────────────────── */
const timeAgo = (d) => {
  if (!d) return null;
  const days = Math.floor((Date.now() - new Date(d)) / 86400000);
  if (days === 0)  return "Today";
  if (days === 1)  return "1d ago";
  if (days < 7)   return `${days}d ago`;
  if (days < 30)  return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const fmtSalary = (min, max, cur) => {
  if (min === null || min === undefined) return null;
  const sym = cur === "GBP" ? "£" : cur === "EUR" ? "€" : cur === "INR" ? "₹" : "$";
  const f   = n => n >= 100000
    ? `${sym}${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`
    : `${sym}${Math.round(n / 1000)}k`;
  return (max && max !== min) ? `${f(min)} – ${f(max)}` : f(min);
};

/* ─── Design tokens ───────────────────────────────────────────────────── */
const T = {
  white:  "#FFFFFF",
  bg:     "#F7F7F8",
  g50:    "#F4F4F5",
  g100:   "#EBEBED",
  g200:   "#D4D4D8",
  g400:   "#9A9A9E",
  g600:   "#52525A",
  black:  "#0A0A0B",
};

const PARK_OPTIONS = [ "All","Business Park", "Cyber Park","others"];

/* ─── Global styles ───────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Manrope:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #F7F7F8; }
  button, input, select { font-family: inherit; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #E0E0E4; border-radius: 99px; }

  @keyframes fdIn     { from{opacity:0}                                 to{opacity:1} }
  @keyframes panelIn  { from{transform:translateX(100%)}                to{transform:none} }
  @keyframes sheetUp  { from{transform:translateY(100%)}                to{transform:none} }
  @keyframes rowIn    { from{opacity:0;transform:translateY(10px)}      to{opacity:1;transform:none} }
  @keyframes toastPop { from{transform:translate(-50%,12px);opacity:0}  to{transform:translate(-50%,0);opacity:1} }
  @keyframes shimmer  { from{background-position:-200% 0} to{background-position:200% 0} }
  @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:none} }
`;

/* ─── useIsMobile ─────────────────────────────────────────────────────── */
function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 700);
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 700);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return m;
}

/* ─── Markdown renderer ───────────────────────────────────────────────── */
function RenderDesc({ text }) {
  if (!text?.trim()) return null;
  return (
    <div style={{ fontFamily: "'Manrope', sans-serif" }}>
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: 10 }} />;
        if (/^\*\*(.+)\*\*$/.test(line))
          return (
            <p key={i} style={{ fontWeight: 700, fontSize: 13, color: T.black, margin: "18px 0 8px", letterSpacing: "-0.01em" }}>
              {line.replace(/\*\*/g, "")}
            </p>
          );
        if (line.startsWith("- "))
          return (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6, alignItems: "flex-start" }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.g400, flexShrink: 0, marginTop: 8 }} />
              <p style={{ fontSize: 13, color: T.g600, lineHeight: 1.75, margin: 0 }}>{line.slice(2)}</p>
            </div>
          );
        return <p key={i} style={{ fontSize: 13, color: T.g600, lineHeight: 1.8, margin: "0 0 4px" }}>{line}</p>;
      })}
    </div>
  );
}

/* ─── Logo ────────────────────────────────────────────────────────────── */
function Logo({ company, logo, size = 44 }) {
  const name     = typeof company === "string" ? company : "";
  const initials = name.split(" ").filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";
  const base     = { width: size, height: size, borderRadius: 12, flexShrink: 0 };

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
      padding: "3px 9px", borderRadius: 5,
      fontFamily: "'Manrope',sans-serif", fontSize: 10, fontWeight: 700,
      letterSpacing: "0.07em", textTransform: "uppercase",
      background: filled ? T.black : T.white,
      color: filled ? T.white : T.black,
      border: `1.5px solid ${T.black}`,
      whiteSpace: "nowrap", flexShrink: 0,
    }}>
      {type}
    </span>
  );
}

/* ─── Tag ─────────────────────────────────────────────────────────────── */
function Tag({ children }) {
  return (
    <span style={{
      padding: "3px 9px", borderRadius: 5,
      background: T.g50, border: `1px solid ${T.g100}`,
      fontFamily: "'Manrope',sans-serif",
      fontSize: 11, color: T.g600, whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

/* ─── Pill ────────────────────────────────────────────────────────────── */
function Pill({ children, dark }) {
  return (
    <span style={{
      padding: "3px 9px", borderRadius: 5,
      background: dark ? T.black : T.g50,
      border: dark ? "none" : `1px solid ${T.g100}`,
      fontFamily: "'Manrope',sans-serif",
      fontSize: 11, fontWeight: dark ? 700 : 400,
      color: dark ? T.white : T.g600,
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

/* ─── Detail Panel ────────────────────────────────────────────────────── */
function DetailPanel({ job, onClose, onApply, isSaved, onToggleSave, isMobile }) {
  const min    = job.salary ?? job.salary;
  const handleShare = async () => {
    const url = `${window.location.origin}/jobs/${job._id}`;
    const shareData = {
      title: job.title,
      text: `Check out this job: ${job.title} at ${job.company?.name ?? job.company}`,
      url,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (_) {}
    } else {
      await navigator.clipboard.writeText(url);
      // optionally show a small toast
    }
  };
  const salary = !min? "Not mentioned" : min;
  const posted = timeAgo(job.postedDate ?? job.postedAt);

  useEffect(() => {
    const fn = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  const MetaRow = ({ icon, label, value }) =>
    value ? (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${T.g100}` }}>
        <span style={{ fontSize: 15, width: 22, textAlign: "center", flexShrink: 0 }}>{icon}</span>
        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 11, color: T.g400, minWidth: 88, flexShrink: 0, fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, fontWeight: 700, color: T.black }}>{value}</span>
      </div>
    ) : null;

  const SLabel = ({ children }) => (
    <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 9.5, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: T.g400, margin: "0 0 12px" }}>
      {children}
    </p>
  );

  const body = (
    <>
      {/* Header */}
      <div style={{ padding: isMobile ? "20px 20px 18px" : "28px 30px 22px", borderBottom: `1px solid ${T.g100}`, flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <Logo company={job.company} logo={job.company?.logo ?? job.companyLogo} size={isMobile ? 44 : 52} />
          <div style={{ display: "flex", gap: 8 }}>
            {/* <button onClick={() => onToggleSave(job._id)} title={isSaved ? "Unsave" : "Save"}
              style={{ width: 34, height: 34, borderRadius: 8, border: `1.5px solid ${isSaved ? T.black : T.g200}`, background: isSaved ? T.black : T.white, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>
              <span style={{ filter: isSaved ? "invert(1)" : "none" }}>🤍</span>
            </button> */}
           <button
  onClick={handleShare}
  title="Share job"
  style={{ 
    width: 34, height: 34, borderRadius: 8,
    border: `1.5px solid ${T.g200}`,
    background: T.white, cursor: "pointer",
    color: T.g400, fontSize: 15,
    display: "flex", alignItems: "center",
    justifyContent: "center", transition: "border-color .15s",
  }}
>
<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <circle cx="18" cy="5" r="3"/>
  <circle cx="6" cy="12" r="3"/>
  <circle cx="18" cy="19" r="3"/>
  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
</svg>
</button> <button onClick={onClose}
              style={{ width: 34, height: 34, borderRadius: 8, border: `1.5px solid ${T.g200}`, background: T.white, cursor: "pointer", color: T.g400, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color .15s" }}>
              ✕
            </button>
          </div>
        </div>

        <h2 style={{ fontFamily: "'DM Serif Display',serif", fontWeight: 400, fontSize: isMobile ? 22 : 26, color: T.black, margin: "0 0 5px", letterSpacing: "-0.03em", lineHeight: 1.15 }}>
          {job.title}
        </h2>

        {((job.company?.name ?? job.company) || job.location) && (
          <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: T.g400, margin: "0 0 16px", fontWeight: 500 }}>
            {[job.company?.name ?? (typeof job.company === "string" ? job.company : null), job.location].filter(Boolean).join("  ·  ")}
          </p>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <WorkBadge type={job.workMode ?? job.workType} />
          {job.jobType && <Pill>{job.jobType}</Pill>}
          {job.businessPark && <Pill>{job.businessPark}</Pill>}
          {job.isUrgent && (
            <span style={{ padding: "3px 9px", borderRadius: 5, border: `1.5px solid ${T.black}`, fontFamily: "'Manrope',sans-serif", fontSize: 10, fontWeight: 700, color: T.black, letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Urgent
            </span>
          )}
        </div>
      </div>

      {/* Meta grid */}
      <div style={{ padding: isMobile ? "18px 20px" : "20px 30px", borderBottom: `1px solid ${T.g100}`, flexShrink: 0 }}>
        <SLabel>Job Details</SLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <div>
            <MetaRow icon="💰" label="Salary"     value={salary} />
            <MetaRow icon="💼" label="Type"       value={job.jobType} />
            <MetaRow icon="🏢" label="Work mode"  value={job.workMode ?? job.workType} />
          </div>
          <div>
            <MetaRow icon="🕐" label="Experience" value={job.experienceRequired ? `${job.experienceRequired} yr${Number(job.experienceRequired) !== 1 ? "s" : ""}` : null} />
            <MetaRow icon="🏙️" label="Park"       value={job.businessPark} />
            <MetaRow icon="📍" label="Location"   value={job.location} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 8, flexWrap: "wrap" }}>
          {posted && <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 11, color: T.g400 }}>🕓 Posted {posted}</span>}
          {job.lastDateToApply && (
            <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 11, color: T.g400 }}>
              ⏳ Deadline {new Date(job.lastDateToApply).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          )}
        </div>
      </div>

      {/* Skills */}
      {(job.tags?.length > 0 || job.skills?.length > 0) && (
        <div style={{ padding: isMobile ? "14px 20px" : "16px 30px", borderBottom: `1px solid ${T.g100}`, flexShrink: 0 }}>
          <SLabel>Skills &amp; Tags</SLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {(job.skills?.length ? job.skills : job.tags ?? []).map((t, i) => <Tag key={i}>{t}</Tag>)}
          </div>
        </div>
      )}

      {/* Description */}
      <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "18px 20px" : "24px 30px" }}>
        <SLabel>About the role</SLabel>
        {(job.description || job.shortDescription)
          ? <RenderDesc text={job.description || job.shortDescription} />
          : <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: T.g400 }}>No description available.</p>
        }
      </div>

      {/* CTA */}
      <div style={{ padding: isMobile ? "14px 20px" : "20px 30px", borderTop: `1px solid ${T.g100}`, flexShrink: 0, background: T.white }}>
        <button onClick={() => onApply(job)}
          onMouseEnter={e => e.currentTarget.style.opacity = ".82"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          style={{ width: "100%", padding: "14px", background: T.black, color: T.white, border: "none", borderRadius: 12, fontFamily: "'Manrope',sans-serif", fontSize: 14, fontWeight: 800, cursor: "pointer", letterSpacing: "-0.01em", transition: "opacity .15s" }}>
          Apply Now →
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", animation: "fdIn .2s ease" }} />
        <div style={{ position: "fixed", inset: "5vh 0 0 0", zIndex: 201, background: T.white, borderRadius: "20px 20px 0 0", display: "flex", flexDirection: "column", animation: "sheetUp .3s cubic-bezier(0.22,1,0.36,1)", overflow: "hidden" }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: T.g200, margin: "12px auto 0", flexShrink: 0 }} />
          {body}
        </div>
      </>
    );
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.25)", backdropFilter: "blur(3px)", animation: "fdIn .2s ease" }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(560px, 54vw)", zIndex: 201, background: T.white, borderLeft: `1px solid ${T.g100}`, display: "flex", flexDirection: "column", animation: "panelIn .3s cubic-bezier(0.22,1,0.36,1)", boxShadow: "-16px 0 48px rgba(0,0,0,0.07)" }}>
        {body}
      </div>
    </>
  );
}

/* ─── Job Card ────────────────────────────────────────────────────────── */
function JobCard({ job, index, onOpen, onApply, isSaved, onToggleSave, isMobile, isSelected }) {
  const [hov, setHov] = useState(false);
  const posted    = timeAgo(job.postedAt);
  const active    = isSelected || hov;
  const shownTags = (job.tags || []).slice(0, isMobile ? 2 : 3);
  const extra     = (job.tags?.length || 0) - shownTags.length;
console.log("KKK",job);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onOpen(job)}
      style={{
        position: "relative",
        background: T.white,
        border: `1px solid ${active ? T.g200 : T.g100}`,
        borderRadius: 18,
        padding: isMobile ? "16px" : "20px 22px",
        cursor: "pointer",
        transition: "transform .25s cubic-bezier(.34,1.4,.64,1), box-shadow .25s ease, border-color .2s",
        transform: active ? "translateY(-3px) scale(1.008)" : "none",
        boxShadow: active
          ? "0 10px 36px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        animation: `fadeUp .4s ${Math.min(index * 0.05, 0.35)}s both`,
        overflow: "hidden",
      }}
    >
      {/* Featured accent bar */}
      {job.isFeatured && (
        <div style={{ position: "absolute", top: 0, left: 20, right: 20, height: 2.5, borderRadius: "0 0 4px 4px", background: T.black }} />
      )}

      {/* Corner fold */}
      <div style={{ position: "absolute", top: 0, right: 0, width: 36, height: 36, background: `linear-gradient(225deg, ${T.g50} 45%, transparent 46%)`, borderRadius: "0 18px 0 0", pointerEvents: "none" }} />

      {/* Top row: logo + badges + time */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <Logo company={job.company} logo={job.companyLogo} size={44} />
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {posted && (
            <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 10.5, color: T.g400, fontWeight: 500 }}>
              {posted}
            </span>
          )}
          {/* <button
            onClick={e => { e.stopPropagation(); onToggleSave(job._id); }}
            style={{ width: 28, height: 28, borderRadius: 7, border: `1.5px solid ${isSaved ? T.black : T.g200}`, background: isSaved ? T.black : T.white, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s", flexShrink: 0 }}>
            <span style={{ filter: isSaved ? "invert(1)" : "none" }}>🤍</span>
          </button> */}
        </div>
      </div>

      {/* Title + company */}
      <h3 style={{ fontFamily: "'DM Serif Display',serif", fontWeight: 400, fontSize: isMobile ? 16 : 18, color: T.black, margin: "0 0 3px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
        {job.title}
        {job.isUrgent && (
          <span style={{ marginLeft: 8, padding: "2px 6px", borderRadius: 4, border: `1px solid ${T.black}`, fontFamily: "'Manrope',sans-serif", fontSize: 8, fontWeight: 800, color: T.black, letterSpacing: "0.08em", textTransform: "uppercase", verticalAlign: "middle" }}>
            Urgent
          </span>
        )}
      </h3>

      {(job.company?.companyName || job.location) && (
  <p
    style={{
      fontFamily: "'Manrope',sans-serif",
      fontSize: 12,
      color: T.g400,
      margin: "0 0 12px",
      fontWeight: 500,
    }}
  >
    {job.company && (
      <strong style={{ color: T.g600, fontWeight: 600 }}>
        {job.company}
      </strong>
    )}

    {job.company && job.location && (
      <span style={{ margin: "0 6px", color: T.g300 }}>•</span>
    )}

    {job.location && <span>{job.location}</span>}
  </p>
)}

      {/* Divider rule */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "10px 0" }}>
        <div style={{ flex: 1, height: 1, background: T.g100 }} />
        <div style={{ width: 3, height: 3, borderRadius: "50%", background: T.g200 }} />
        <div style={{ flex: 1, height: 1, background: T.g100 }} />
      </div>

      {/* Tags row */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
        <WorkBadge type={job.workType} />
        {job.businessPark && <Tag>{job.businessPark}</Tag>}
        {shownTags.map((t, i) => <Tag key={i}>{t}</Tag>)}
        {extra > 0 && <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 11, color: T.g400 }}>+{extra}</span>}
      </div>

    
    </div>
  );
}

/* ─── Filter Bar ──────────────────────────────────────────────────────── */
function FilterBar({ search, onSearch, activePark, onPark, isMobile }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: T.g400, fontSize: 15, pointerEvents: "none" }}>⌕</span>
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search role, company or skill…"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: "11px 36px 11px 38px",
            borderRadius: 10, fontSize: 13,
            fontFamily: "'Manrope',sans-serif", fontWeight: 500,
            color: T.black, background: T.white,
            border: `1.5px solid ${focused ? T.black : T.g200}`,
            outline: "none", transition: "border-color .18s, box-shadow .18s",
            boxShadow: focused ? "0 0 0 3px rgba(0,0,0,0.06)" : "none",
          }}
        />
        {search && (
          <button onClick={() => onSearch("")}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: T.g400, fontSize: 18, lineHeight: 1 }}>
            ×
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {PARK_OPTIONS.map(park => (
          <button key={park} onClick={() => onPark(park)}
            style={{
              padding: isMobile ? "6px 12px" : "7px 16px",
              borderRadius: 8, fontSize: 12,
              fontFamily: "'Manrope',sans-serif", fontWeight: 700,
              cursor: "pointer", transition: "all .15s",
              background: activePark === park ? T.black : T.white,
              color: activePark === park ? T.white : T.g600,
              border: `1.5px solid ${activePark === park ? T.black : T.g200}`,
            }}>
            {park}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Skeleton ────────────────────────────────────────────────────────── */
function Skeleton() {
  const shimmerStyle = {
    background: `linear-gradient(90deg, ${T.g50} 25%, #ECECEE 50%, ${T.g50} 75%)`,
    backgroundSize: "200% 100%",
    animation: "shimmer 1.6s infinite",
    borderRadius: 6,
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, padding: "0 24px" }}>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} style={{ background: T.white, border: `1px solid ${T.g100}`, borderRadius: 18, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ ...shimmerStyle, width: 44, height: 44, borderRadius: 12 }} />
            <div style={{ ...shimmerStyle, width: 48, height: 14 }} />
          </div>
          <div style={{ ...shimmerStyle, height: 18, width: "70%", marginBottom: 8 }} />
          <div style={{ ...shimmerStyle, height: 12, width: "45%", marginBottom: 14 }} />
          <div style={{ height: 1, background: T.g100, margin: "10px 0" }} />
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {[52, 68, 44].map((w, j) => <div key={j} style={{ ...shimmerStyle, height: 22, width: w, borderRadius: 5 }} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ ...shimmerStyle, height: 14, width: 56 }} />
            <div style={{ ...shimmerStyle, height: 28, width: 72, borderRadius: 8 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Empty state ─────────────────────────────────────────────────────── */
function EmptyState({ hasSearch }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 24px" }}>
      <div style={{ width: 52, height: 52, borderRadius: "50%", border: `1.5px solid ${T.g200}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22, color: T.g400 }}>
        ∅
      </div>
      <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, color: T.black, margin: "0 0 6px" }}>
        {hasSearch ? "No results" : "No openings right now"}
      </p>
      <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: T.g400 }}>
        {hasSearch ? "Try adjusting your search or filters." : "Check back soon — roles are posted regularly."}
      </p>
    </div>
  );
}

/* ─── Toast ───────────────────────────────────────────────────────────── */
function Toast({ data, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const isSuccess = data.type === "success";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 400,
        background: isSuccess ? "#111" : "#7f1d1d",
        color: "#fff",
        padding: "12px 22px",
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div>✓</div>

      {isSuccess ? (
        <>
          Applied to <strong>{data.job?.title}</strong>
          {data.job?.company && <span> · {data.job.company}</span>}
        </>
      ) : (
        <span>{data.message}</span>
      )}
    </div>
  );
}

/* ─── Section label ───────────────────────────────────────────────────── */
function SectionLabel({ children, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 24px 10px" }}>
      <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 9.5, fontWeight: 800, color: T.g400, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
        {children}
      </span>
      {count !== undefined && (
        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 9.5, fontWeight: 700, color: T.white, background: T.black, borderRadius: 4, padding: "1px 6px", letterSpacing: "0.04em" }}>
          {count}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: T.g100 }} />
    </div>
  );
}



/* ─── Main Export ─────────────────────────────────────────────────────── */
export default function JobListings({
  onApply,
  title  = "Open Positions",
  apiUrl = `${API_BASE}/jobs`,
}) {
  const isMobile = useIsMobile();
  const { user } = useUser();

  const [search,     setSearch]  = useState("");
  const [activePark, setPark]    = useState("All");
  const [openJob,    setOpenJob] = useState(null);
  const [savedIds,   setSaved]   = useState(new Set());
  const [toast,      setToast]   = useState(null);
  const [jobs,       setJobs]    = useState([]);
  const [isLoading,  setLoading] = useState(true);
  const [error,      setError]   = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const toggleSave = id => setSaved(p => {
    const n = new Set(p);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const navigate = useNavigate();
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400); // 400ms delay
  
    return () => {
      clearTimeout(handler); // cancel previous timeout
    };
  }, [search]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const params = {
          sort: "newest",
          search: debouncedSearch || undefined, // ✅ use debounced value
        };
  
        if (activePark !== "All") {
          params.businessPark = activePark;
        }
  
        const res = await axios.get(`${API_BASE}/jobs/search`, {
          params: {
            search: debouncedSearch,
          },
        });
        const raw = res.data?.data || [];
        console.log(raw);
        
        setJobs(Array.isArray(raw) ? raw.map(normalizeJob) : []);
  
      } catch (err) {
        console.error(err);
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchJobs();
  }, [apiUrl, activePark, debouncedSearch]); // ✅ depend on debouncedSearch

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true); setError(null);
        const params = { sort: "newest", search: search || undefined };
        if (activePark !== "All") params.businessPark = activePark;
        const res = await axios.get(apiUrl, { params });
        const raw = res.data?.data || [];
        setJobs(Array.isArray(raw) ? raw.map(normalizeJob) : []);
      } catch (err) {
        console.error(err); setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [apiUrl, activePark, search]);

  const handleApply = async (job) => {
    try {
      if (!user?._id) {
        setToast({ type: "error", message: "Please login to apply" });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
        return;
      }
      if (!user?.cv) {
        setToast({ type: "error", message: "Please upload your CV before applying" });
  
        setTimeout(() => {
          navigate("/profile/set/form");
        }, 1500);
  
        return;
      }
  
      const res = await axios.post(`${API_BASE}/jobs-application/apply`, {
        jobId: job._id,
        candidateId: user._id,
        coverLetter: "",
      });
  
      if (res.data.success) {
        setToast({
          type: "success",
          message: "Applied successfully",
          job
        });
        setOpenJob(null);
      }
    } catch (error) {
      console.error(error);
  
      if (error.response?.status === 409) {
        setToast({ type: "error", message: "You already applied for this job" });
      } else {
        setToast({ type: "error", message: "Failed to apply" });
      }
    }
  };

  const filtered = jobs;
  const featured = filtered.filter(j => j.isFeatured);
  const regular  = filtered.filter(j => !j.isFeatured);

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── Sticky header ── */}
      <div style={{ background: T.white, borderBottom: `1px solid ${T.g100}`, position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "16px 16px 14px" : "28px 28px 20px" }}>

          {/* Title row */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'Manrope',sans-serif", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.g400, marginBottom: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.black, display: "inline-block", animation: "blink 2s ease infinite" }} />
                Live Listings
              </div>
              <h1 style={{ fontFamily: "'DM Serif Display',serif", fontWeight: 400, fontSize: isMobile ? 26 : 36, color: T.black, margin: 0, letterSpacing: "-0.04em", lineHeight: 1 }}>
                {title}
              </h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, paddingBottom: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.black }} />
              <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, fontWeight: 700, color: T.g600 }}>
                {filtered.length} {filtered.length === 1 ? "role" : "roles"}
              </span>
            </div>
          </div>

          <FilterBar
            search={search} onSearch={setSearch}
            activePark={activePark} onPark={setPark}
            isMobile={isMobile}
          />
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", paddingBottom: 60 }}>
        {isLoading ? (
          <div style={{ paddingTop: 24 }}><Skeleton /></div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, color: T.g400 }}>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState hasSearch={!!search} />
        ) : (
          <>
            {featured.length > 0 && (
              <>
                <SectionLabel count={featured.length}>Featured</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? 280 : 300}px, 1fr))`, gap: 14, padding: "0 24px" }}>
                  {featured.map((job, i) => (
                    <JobCard key={job._id} job={job} index={i} isMobile={isMobile}
                      onOpen={setOpenJob} onApply={handleApply}
                      isSaved={savedIds.has(job._id)} onToggleSave={toggleSave}
                      isSelected={openJob?._id === job._id} />
                  ))}
                </div>
              </>
            )}
            {regular.length > 0 && (
              <>
                <SectionLabel count={regular.length}>{featured.length > 0 ? "All Roles" : "Roles"}</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? 280 : 300}px, 1fr))`, gap: 14, padding: "0 24px" }}>
                  {regular.map((job, i) => (
                    <JobCard key={job._id} job={job} index={featured.length + i} isMobile={isMobile}
                      onOpen={setOpenJob} onApply={handleApply}
                      isSaved={savedIds.has(job._id)} onToggleSave={toggleSave}
                      isSelected={openJob?._id === job._id} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {openJob && (
        <DetailPanel
          job={openJob} isMobile={isMobile}
          onClose={() => setOpenJob(null)} onApply={handleApply}
          isSaved={savedIds.has(openJob._id)} onToggleSave={toggleSave}
        />
      )}

{toast && <Toast data={toast} onClose={() => setToast(null)} />}
    </div>
  );
}