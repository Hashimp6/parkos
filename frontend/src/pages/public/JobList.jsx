import axios from "axios";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import API_BASE from "../../../config";

/* ─── Normalize API job to internal shape ───────────────────────────── */
const normalizeJob = (j) => ({
  ...j,
  title:       j.role || j.title || "Untitled Role",
  company:     typeof j.company === "object"
                 ? (j.company?.companyName || j.company?.name || "")
                 : (j.company || ""),
  companyLogo: (typeof j.company === "object" ? j.company?.logo : null) || j.companyLogo || null,
  workType:    j.workMode === "On-site" ? "Onsite" : (j.workMode || j.workType || ""),
  salaryMin:   j.salaryFrom  ?? j.salaryMin  ?? null,
  salaryMax:   j.salaryTo    ?? j.salaryMax  ?? null,
  tags:        j.skills      || j.tags       || [],
  postedAt:    j.postedDate  || j.postedAt   || null,
  businessPark: j.businessPark || null,
});

/* ─── Helpers ────────────────────────────────────────────────────────── */
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

/* ─── Pure B&W theme ─────────────────────────────────────────────────── */
const T = {
  white: "#FFFFFF",
  bg:    "#F9F9F9",
  g50:   "#F4F4F4",
  g100:  "#EBEBEB",
  g200:  "#D4D4D4",
  g400:  "#9A9A9A",
  g600:  "#555555",
  black: "#111111",
};

/* ─── Business Park options ──────────────────────────────────────────── */
const PARK_OPTIONS = ["Business Park", "Cyber Park", "All"];

/* ─── useIsMobile ────────────────────────────────────────────────────── */
function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 700);
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 700);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return m;
}

/* ─── Markdown renderer ──────────────────────────────────────────────── */
function RenderDesc({ text }) {
  if (!text?.trim()) return null;
  return (
    <div>
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: 10 }} />;
        if (/^\*\*(.+)\*\*$/.test(line))
          return (
            <p key={i} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 13, color: T.black, margin: "18px 0 8px", letterSpacing: "-0.01em" }}>
              {line.replace(/\*\*/g, "")}
            </p>
          );
        if (line.startsWith("- "))
          return (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6, alignItems: "flex-start" }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.g400, flexShrink: 0, marginTop: 8 }} />
              <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, color: T.g600, lineHeight: 1.75, margin: 0 }}>
                {line.slice(2)}
              </p>
            </div>
          );
        return (
          <p key={i} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, color: T.g600, lineHeight: 1.8, margin: "0 0 4px" }}>
            {line}
          </p>
        );
      })}
    </div>
  );
}

/* ─── Logo ───────────────────────────────────────────────────────────── */
function Logo({ company, logo, size = 44 }) {
  const name     = typeof company === "string" ? company : "";
  const initials = name.split(" ").filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  if (logo) {
    return (
      <div style={{ width: size, height: size, borderRadius: 10, overflow: "hidden", flexShrink: 0, border: `1px solid ${T.g100}`, background: T.white }}>
        <img
          src={logo}
          alt={`${name} logo`}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement.textContent = initials; }}
        />
      </div>
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: 10,
      background: T.g50, border: `1px solid ${T.g100}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
      fontSize: Math.round(size * 0.32), color: T.g400, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

/* ─── Work type badge ────────────────────────────────────────────────── */
function WorkBadge({ type }) {
  if (!type) return null;
  const filled = type === "Remote";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 8px", borderRadius: 4,
      fontFamily: "'Plus Jakarta Sans',sans-serif",
      fontSize: 10, fontWeight: 700,
      letterSpacing: "0.05em", textTransform: "uppercase",
      background: filled ? T.black : T.white,
      color: filled ? T.white : T.black,
      border: `1px solid ${T.black}`,
      whiteSpace: "nowrap", flexShrink: 0,
    }}>
      {type}
    </span>
  );
}

/* ─── Skill tag ──────────────────────────────────────────────────────── */
function Tag({ children }) {
  return (
    <span style={{
      padding: "3px 8px", borderRadius: 4,
      background: T.g50, border: `1px solid ${T.g100}`,
      fontFamily: "'Plus Jakarta Sans',sans-serif",
      fontSize: 11, color: T.g600, whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

/* ─── Small inline pill ──────────────────────────────────────────────── */
function Pill({ children, dark }) {
  return (
    <span style={{
      padding: "3px 8px", borderRadius: 4,
      background: dark ? T.black : T.g50,
      border: dark ? "none" : `1px solid ${T.g100}`,
      fontFamily: "'Plus Jakarta Sans',sans-serif",
      fontSize: 11, fontWeight: dark ? 700 : 400,
      color: dark ? T.white : T.g600,
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

/* ─── Detail Panel ───────────────────────────────────────────────────── */
function DetailPanel({ job, onClose, onApply, isSaved, onToggleSave, isMobile }) {
  const min = job.salaryFrom ?? job.salaryMin;
  const max = job.salaryTo ?? job.salaryMax;
  
  const salary =
    !min && !max
      ? "Not mentioned"
      : fmtSalary(min, max, job.currency);
  const posted = timeAgo(job.postedDate ?? job.postedAt);
console.log("jobbn",job);

  useEffect(() => {
    const fn = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  const MetaRow = ({ icon, label, value }) =>
    value ? (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${T.g100}` }}>
        <span style={{ fontSize: 16, width: 22, textAlign: "center", flexShrink: 0 }}>{icon}</span>
        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, color: T.g400, minWidth: 90, flexShrink: 0 }}>{label}</span>
        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 600, color: T.black }}>{value}</span>
      </div>
    ) : null;

  const SectionLabel = ({ children }) => (
    <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.g400, margin: "0 0 12px" }}>
      {children}
    </p>
  );

  const body = (
    <>
      <div style={{ padding: isMobile ? "20px 20px 18px" : "26px 30px 20px", borderBottom: `1px solid ${T.g100}`, flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <Logo company={job.company} logo={job.company?.logo ?? job.companyLogo} size={isMobile ? 44 : 52} />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => onToggleSave(job._id)}
              title={isSaved ? "Unsave" : "Save"}
              style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${isSaved ? T.black : T.g200}`, background: isSaved ? T.black : T.white, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}
            >
              <span style={{ filter: isSaved ? "invert(1)" : "none" }}>🤍</span>
            </button>
            <button
              onClick={onClose}
              style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${T.g200}`, background: T.white, cursor: "pointer", color: T.g400, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ✕
            </button>
          </div>
        </div>

        <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: isMobile ? 20 : 23, color: T.black, margin: "0 0 4px", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
          {job.title ?? `${job.role ? job.role.charAt(0).toUpperCase() + job.role.slice(1) : ""} Engineer`}
        </h2>

        {(job.company?.name ?? job.company) || job.location ? (
          <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, color: T.g400, margin: "0 0 16px" }}>
            {[job.company?.name ?? (typeof job.company === "string" ? job.company : null), job.location].filter(Boolean).join("  ·  ")}
          </p>
        ) : null}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <WorkBadge type={job.workMode ?? job.workType} />
          {job.jobType && <Pill>{job.jobType}</Pill>}
          {job.businessPark && <Pill>{job.businessPark}</Pill>}
          {job.isUrgent && (
            <span style={{ padding: "3px 8px", borderRadius: 4, border: `1px solid ${T.black}`, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 10, fontWeight: 700, color: T.black, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Urgent
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: isMobile ? "18px 20px" : "20px 30px", borderBottom: `1px solid ${T.g100}`, flexShrink: 0 }}>
        <SectionLabel>Job Details</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <div>
            <MetaRow icon="💰" label="Salary"      value={salary} />
            <MetaRow icon="💼" label="Type"        value={job.jobType} />
            <MetaRow icon="🏢" label="Work mode"   value={job.workMode ?? job.workType} />
           </div>
          <div>
          <MetaRow icon="🕐" label="Experience"  value={job.experienceRequired ? `${job.experienceRequired} yr${Number(job.experienceRequired) !== 1 ? "s" : ""}` : null} />
           <MetaRow icon="🏙️" label="Park"        value={job.businessPark} />
            <MetaRow icon="📍" label="Location"    value={job.location} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 4, flexWrap: "wrap" }}>
          {posted && (
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, color: T.g400 }}>
              🕓 Posted {posted}
            </span>
          )}
          {job.lastDateToApply && (
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, color: T.g400 }}>
              ⏳ Deadline {new Date(job.lastDateToApply).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          )}
        </div>
      </div>

      {(job.tags?.length > 0 || job.skills?.length > 0) && (
        <div style={{ padding: isMobile ? "14px 20px" : "16px 30px", borderBottom: `1px solid ${T.g100}`, flexShrink: 0 }}>
          <SectionLabel>Skills &amp; Tags</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {(job.skills?.length ? job.skills : job.tags ?? []).map((t, i) => <Tag key={i}>{t}</Tag>)}
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "18px 20px" : "22px 30px" }}>
        <SectionLabel>About the role</SectionLabel>
        {(job.description || job.shortDescription)
          ? <RenderDesc text={job.description || job.shortDescription} />
          : <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, color: T.g400 }}>No description available.</p>
        }
      </div>

      <div style={{ padding: isMobile ? "14px 20px" : "18px 30px", borderTop: `1px solid ${T.g100}`, flexShrink: 0, background: T.white }}>
        <button
          onClick={() => onApply(job)}
          onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          style={{ width: "100%", padding: "13px", background: T.black, color: T.white, border: "none", borderRadius: 10, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: "-0.01em", transition: "opacity .15s" }}
        >
          Apply Now →
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", animation: "fdIn .2s ease" }} />
        <div style={{ position: "fixed", inset: "5vh 0 0 0", zIndex: 201, background: T.white, borderRadius: "18px 18px 0 0", display: "flex", flexDirection: "column", animation: "sheetUp .3s cubic-bezier(0.22,1,0.36,1)", overflow: "hidden" }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: T.g200, margin: "12px auto 0", flexShrink: 0 }} />
          {body}
        </div>
      </>
    );
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.25)", backdropFilter: "blur(3px)", animation: "fdIn .2s ease" }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(560px, 54vw)", zIndex: 201, background: T.white, borderLeft: `1px solid ${T.g100}`, display: "flex", flexDirection: "column", animation: "panelIn .3s cubic-bezier(0.22,1,0.36,1)", boxShadow: "-12px 0 40px rgba(0,0,0,0.07)" }}>
        {body}
      </div>
    </>
  );
}

/* ─── Job Row ────────────────────────────────────────────────────────── */
function JobRow({ job, index, onOpen, onApply, isSaved, onToggleSave, isMobile, isSelected }) {
  const [hov, setHov] = useState(false);
  const posted    = timeAgo(job.postedAt);
  const active    = isSelected || hov;
  const maxTags   = isMobile ? 2 : 3;
  const shownTags = job.tags?.slice(0, maxTags) || [];
  const extra     = (job.tags?.length || 0) - shownTags.length;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onOpen(job)}
      style={{
        display: "flex", alignItems: isMobile ? "flex-start" : "center",
        gap: 14, padding: isMobile ? "16px 16px" : "18px 24px",
        background: active ? T.g50 : T.white,
        borderBottom: `1px solid ${T.g100}`,
        cursor: "pointer", transition: "background .15s",
        animation: `rowIn .35s ${Math.min(index * 0.05, 0.35)}s both`,
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", left: 0, top: isMobile ? 14 : 12, bottom: isMobile ? 14 : 12, width: 3, borderRadius: "0 2px 2px 0", background: active ? T.black : "transparent", transition: "background .18s" }} />

      <Logo company={job.company} logo={job.companyLogo} size={isMobile ? 40 : 44} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5, flexWrap: "wrap" }}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: isMobile ? 14 : 15, color: T.black, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            {job.title}
          </h3>
          {job.isFeatured && (
            <span style={{ padding: "1px 6px", borderRadius: 3, background: T.black, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 9, fontWeight: 700, color: T.white, letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Featured
            </span>
          )}
          {job.isUrgent && (
            <span style={{ padding: "1px 6px", borderRadius: 3, border: `1px solid ${T.black}`, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 9, fontWeight: 700, color: T.black, letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Urgent
            </span>
          )}
        </div>

        {(job.company || job.location) && (
          <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, color: T.g400, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
            {job.company  && <span style={{ fontWeight: 600, color: T.g600 }}>{job.company}</span>}
            {job.company  && job.location && <span style={{ color: T.g200 }}>·</span>}
            {job.location && <span>{job.location}</span>}
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 5 }}>
          <WorkBadge type={job.workType} />
          {job.businessPark && <Tag>{job.businessPark}</Tag>}
          {shownTags.map((t, i) => <Tag key={i}>{t}</Tag>)}
          {extra > 0 && <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, color: T.g400 }}>+{extra}</span>}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
        {posted && (
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, color: T.g400, whiteSpace: "nowrap" }}>
            {posted}
          </span>
        )}
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={e => { e.stopPropagation(); onToggleSave(job._id); }}
            style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${isSaved ? T.black : T.g200}`, background: isSaved ? T.black : T.white, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}
          >
            <span style={{ filter: isSaved ? "invert(1)" : "none" }}>🤍</span>
          </button>
          {!isMobile && (
            <button
              onClick={e => { e.stopPropagation(); onApply(job); }}
              onMouseEnter={e => { e.currentTarget.style.background = T.black; e.currentTarget.style.color = T.white; }}
              onMouseLeave={e => { e.currentTarget.style.background = T.white; e.currentTarget.style.color = T.black; }}
              style={{ padding: "0 12px", height: 28, borderRadius: 6, border: `1px solid ${T.black}`, background: T.white, color: T.black, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all .15s", whiteSpace: "nowrap" }}
            >
              Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Filter Bar ─────────────────────────────────────────────────────── */
function FilterBar({ search, onSearch, activePark, onPark, isMobile }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.g400, fontSize: 14, pointerEvents: "none" }}>⌕</span>
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search role, company or skill…"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ width: "100%", padding: "10px 32px 10px 30px", borderRadius: 8, fontSize: 13, fontFamily: "'Plus Jakarta Sans',sans-serif", color: T.black, background: T.white, border: `1.5px solid ${focused ? T.black : T.g200}`, outline: "none", boxSizing: "border-box", transition: "border-color .18s", boxShadow: focused ? "0 0 0 3px rgba(0,0,0,0.06)" : "none" }}
        />
        {search && (
          <button onClick={() => onSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: T.g400, fontSize: 18, lineHeight: 1 }}>×</button>
        )}
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
        {PARK_OPTIONS.map(park => (
          <button
            key={park}
            onClick={() => onPark(park)}
            style={{
              padding: isMobile ? "5px 12px" : "6px 14px",
              borderRadius: 6, fontSize: 12,
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700,
              cursor: "pointer", transition: "all .15s",
              background: activePark === park ? T.black : T.white,
              color: activePark === park ? T.white : T.g600,
              border: `1px solid ${activePark === park ? T.black : T.g200}`,
            }}
          >
            {park}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Empty state ────────────────────────────────────────────────────── */
function EmptyState({ hasSearch }) {
  return (
    <div style={{ textAlign: "center", padding: "72px 24px" }}>
      <div style={{ width: 52, height: 52, borderRadius: "50%", border: `1.5px solid ${T.g200}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22, color: T.g400 }}>∅</div>
      <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 16, color: T.black, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
        {hasSearch ? "No results" : "No openings right now"}
      </p>
      <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, color: T.g400 }}>
        {hasSearch ? "Try adjusting your search or filters." : "Check back soon — roles are posted regularly."}
      </p>
    </div>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 24px", borderBottom: `1px solid ${T.g100}` }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: T.g50, flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ height: 14, borderRadius: 4, background: T.g50, width: `${32 + (i * 11) % 26}%` }} />
            <div style={{ height: 11, borderRadius: 4, background: T.g50, width: `${20 + (i * 9) % 20}%` }} />
            <div style={{ display: "flex", gap: 5 }}>
              {[50, 68, 44].map((w, j) => <div key={j} style={{ height: 20, borderRadius: 4, background: T.g50, width: w }} />)}
            </div>
          </div>
          <div style={{ width: 60, height: 14, borderRadius: 4, background: T.g50 }} />
        </div>
      ))}
    </div>
  );
}

/* ─── Toast ──────────────────────────────────────────────────────────── */
function Toast({ job, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 400, background: T.black, color: T.white, padding: "11px 20px", borderRadius: 10, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", gap: 10, animation: "toastPop .3s cubic-bezier(0.22,1,0.36,1)", whiteSpace: "nowrap", maxWidth: "calc(100vw - 32px)" }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>✓</div>
      Applied to <strong style={{ marginLeft: 2 }}>{job.title}</strong>
      {job.company && <span style={{ opacity: 0.45 }}>· {job.company}</span>}
    </div>
  );
}

/* ─── Section divider ────────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 24px 8px" }}>
      <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 10, fontWeight: 700, color: T.g400, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: T.g100 }} />
    </div>
  );
}

/* ─── Main Export ────────────────────────────────────────────────────── */
export default function JobListings({
  onApply,
  title  = "Open Positions",
  apiUrl = `${API_BASE}/jobs`,
}) {
  const isMobile = useIsMobile();
  const { user } = useUser();

  const [search,     setSearch]  = useState("");
  const [activePark, setPark]    = useState("Business Park");
  const [openJob,    setOpenJob] = useState(null);
  const [savedIds,   setSaved]   = useState(new Set());
  const [toast,      setToast]   = useState(null);
  const [jobs,       setJobs]    = useState([]);
  const [isLoading,  setLoading] = useState(true);
  const [error,      setError]   = useState(null);

  const toggleSave = id => setSaved(p => {
    const n = new Set(p);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  /* ── Fetch jobs — passes businessPark param when not "All" ── */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const params = {
          sort: "newest",
          search: search || undefined
        };
  
        if (activePark !== "All") params.businessPark = activePark;
  
        const res = await axios.get(apiUrl, { params });
  
        const raw = res.data?.data || [];
        setJobs(Array.isArray(raw) ? raw.map(normalizeJob) : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchJobs();
  }, [apiUrl, activePark, search]);

  const handleApply = async (job) => {
    try {
      if (!user?._id) { alert("Please login to apply"); return; }
      const res = await axios.post(`${API_BASE}/jobs-application/apply`, {
        jobId: job._id,
        candidateId: user._id,
        coverLetter: "",
      });
      if (res.data.success) alert("Application submitted successfully");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 409) alert("You already applied for this job");
      else alert("Failed to apply");
    }
  };

  /* ── Client-side search filter only (park filter handled by API) ── */
 const filtered = jobs;
  const featured = filtered.filter(j => j.isFeatured);
  const regular  = filtered.filter(j => !j.isFeatured);

  return (
    <div style={{ background: T.white, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fdIn    { from{opacity:0}                                to{opacity:1} }
        @keyframes panelIn { from{transform:translateX(100%)}               to{transform:none} }
        @keyframes sheetUp { from{transform:translateY(100%)}               to{transform:none} }
        @keyframes rowIn   { from{opacity:0;transform:translateY(8px)}      to{opacity:1;transform:none} }
        @keyframes toastPop{ from{transform:translate(-50%,10px);opacity:0} to{transform:translate(-50%,0);opacity:1} }
        * { box-sizing: border-box; }
        button, select, input { font-family: inherit; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${T.g100}; border-radius: 99px; }
      `}</style>

      {/* Sticky header */}
      <div style={{ background: T.white, borderBottom: `1px solid ${T.g100}`, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "16px 16px 14px" : "24px 24px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: isMobile ? 22 : 28, color: T.black, margin: 0, letterSpacing: "-0.04em", lineHeight: 1 }}>
              {title}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.black }} />
              <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, fontWeight: 700, color: T.g600 }}>
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

      {/* List */}
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {isLoading ? (
          <Skeleton />
        ) : error ? (
          <div style={{ textAlign: "center", padding: "72px 24px" }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, color: T.g400 }}>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState hasSearch={!!search} />
        ) : (
          <>
            {featured.length > 0 && (
              <>
                <SectionLabel>Featured</SectionLabel>
                {featured.map((job, i) => (
                  <JobRow key={job._id} job={job} index={i} isMobile={isMobile}
                    onOpen={setOpenJob} onApply={handleApply}
                    isSaved={savedIds.has(job._id)} onToggleSave={toggleSave}
                    isSelected={openJob?._id === job._id} />
                ))}
              </>
            )}
            {regular.length > 0 && (
              <>
                {featured.length > 0 && <SectionLabel>All Roles</SectionLabel>}
                {regular.map((job, i) => (
                  <JobRow key={job._id} job={job} index={featured.length + i} isMobile={isMobile}
                    onOpen={setOpenJob} onApply={handleApply}
                    isSaved={savedIds.has(job._id)} onToggleSave={toggleSave}
                    isSelected={openJob?._id === job._id} />
                ))}
              </>
            )}
            <div style={{ height: 48 }} />
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

      {toast && <Toast job={toast} onClose={() => setToast(null)} />}
    </div>
  );
}