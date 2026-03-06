import { useState, useEffect } from "react";

/* ─── Demo Data ─────────────────────────────────────────────────────── */
const DEMO_JOBS = [
  {
    _id: "1",
    title: "Senior Frontend Engineer",
    company: "Stripe",
    companyLogo: "https://logo.clearbit.com/stripe.com",
    location: "San Francisco, CA",
    workType: "Hybrid",
    salaryMin: 140000, salaryMax: 190000, currency: "USD",
    jobType: "Full-time",
    tags: ["React", "TypeScript", "GraphQL", "Design Systems"],
    postedAt: "2025-02-20T10:00:00Z",
    isUrgent: true, isFeatured: true,
    shortDescription: "Build the next generation of financial infrastructure UI with a world-class team.",
    description: `We're looking for a Senior Frontend Engineer to join Stripe's Dashboard team, building products used by millions of businesses worldwide.

**What you'll do:**
- Architect and build high-quality React components for Stripe's core dashboard
- Collaborate with designers and product managers to ship delightful experiences
- Drive technical decisions on the frontend architecture
- Mentor junior engineers and contribute to engineering culture

**What we're looking for:**
- 5+ years of experience building production React applications
- Deep knowledge of TypeScript and modern JavaScript
- Strong sense of UX and attention to detail

**Benefits:**
- Competitive salary + equity
- Remote-friendly with flexible work arrangements
- $2,000 annual learning budget`,
  },
  {
    _id: "2",
    title: "Product Designer",
    company: "Notion",
    companyLogo: "https://logo.clearbit.com/notion.so",
    location: "Remote",
    workType: "Remote",
    jobType: "Full-time",
    tags: ["Figma", "UX Research", "Prototyping"],
    postedAt: "2025-02-22T09:00:00Z",
    isFeatured: true,
    shortDescription: "Shape the future of how people think and work — one pixel at a time.",
    description: `Notion is looking for a Product Designer excited about rethinking how people organize knowledge and collaborate.

**What you'll do:**
- Own end-to-end design for key product areas
- Conduct user research and synthesize insights into design decisions
- Build and maintain scalable design system components

**What we're looking for:**
- 3+ years of product design experience
- Expert-level Figma skills
- Portfolio showing end-to-end product thinking`,
  },
  {
    _id: "3",
    title: "Backend Engineer — Infra",
    company: "Vercel",
    companyLogo: "https://logo.clearbit.com/vercel.com",
    location: "New York, NY",
    workType: "Onsite",
    salaryMin: 160000, salaryMax: 220000, currency: "USD",
    jobType: "Full-time",
    tags: ["Node.js", "Rust", "Kubernetes", "AWS"],
    postedAt: "2025-02-25T11:00:00Z",
    isUrgent: true,
    description: `Vercel's infrastructure team is hiring a Backend Engineer to help scale our deployment platform across 100+ regions globally.

**What you'll do:**
- Design and implement distributed systems handling millions of requests
- Work on edge computing infrastructure globally
- Improve reliability, latency, and scalability of our core platform

**What we're looking for:**
- 4+ years backend engineering experience
- Experience with distributed systems and cloud infrastructure
- Proficiency in Node.js, Go, or Rust`,
  },
  {
    _id: "4",
    title: "iOS Engineer",
    company: "Linear",
    companyLogo: "https://logo.clearbit.com/linear.app",
    workType: "Hybrid",
    tags: ["Swift", "SwiftUI", "UIKit"],
    postedAt: "2025-02-28T08:00:00Z",
    shortDescription: "Build the fastest project management app on iOS. Every millisecond matters.",
    description: `Linear is hiring an iOS Engineer to build the best project management experience on mobile.

**What you'll do:**
- Build and maintain Linear's iOS app
- Obsess over performance — sub-16ms render targets
- Work closely with designers for pixel-perfect UI

**What we're looking for:**
- 3+ years of professional iOS development
- Deep knowledge of Swift, SwiftUI, and UIKit`,
  },
  {
    _id: "5",
    title: "DevOps / Platform Engineer",
    company: "Figma",
    companyLogo: "https://logo.clearbit.com/figma.com",
    location: "Austin, TX",
    workType: "Remote",
    salaryMin: 130000, salaryMax: 175000, currency: "USD",
    jobType: "Contract",
    postedAt: "2025-03-01T14:00:00Z",
    shortDescription: "Empower engineers to ship faster with world-class platform tooling.",
    description: `Figma's Platform team is looking for a DevOps Engineer to build internal systems that let engineering move fast with confidence.

**What you'll do:**
- Own and improve CI/CD pipelines and deployment systems
- Build infrastructure-as-code using Terraform
- Improve developer experience through automation

**What we're looking for:**
- 3+ years in DevOps, SRE, or Platform Engineering
- Strong AWS and cloud infrastructure experience`,
  },
  {
    _id: "6",
    title: "Data Scientist",
    company: "Airbnb",
    companyLogo: "https://logo.clearbit.com/airbnb.com",
    location: "Seattle, WA",
    workType: "Hybrid",
    salaryMin: 145000, salaryMax: 200000, currency: "USD",
    jobType: "Full-time",
    tags: ["Python", "SQL", "ML", "Spark"],
    postedAt: "2025-03-02T10:00:00Z",
    shortDescription: "Turn complex data into insights that shape how millions of people travel.",
    description: `Airbnb's data science team is hiring to help understand our marketplace at scale.

**What you'll do:**
- Design and run experiments to measure product impact
- Build predictive models for pricing and demand
- Partner with product teams to turn insights into action

**What we're looking for:**
- MS or PhD in a quantitative field
- Expert SQL and Python skills
- Experience with A/B testing and causal inference`,
  },
];

/* ─── Helpers ────────────────────────────────────────────────────────── */
const timeAgo = (d) => {
  if (!d) return null;
  const days = Math.floor((Date.now() - new Date(d)) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 7)  return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const fmtSalary = (min, max, cur) => {
  if (!min && min !== 0) return null;
  const sym = cur === "GBP" ? "£" : cur === "EUR" ? "€" : "$";
  const f   = n => `${sym}${Math.round(n / 1000)}k`;
  return max && max !== min ? `${f(min)} – ${f(max)}` : f(min);
};

/* ─── Pure B&W theme ─────────────────────────────────────────────────── */
const T = {
  white:  "#FFFFFF",
  bg:     "#F9F9F9",
  g50:    "#F4F4F4",
  g100:   "#EBEBEB",
  g200:   "#D4D4D4",
  g400:   "#9A9A9A",
  g600:   "#555555",
  black:  "#111111",
};

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
          return <p key={i} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 13, color: T.black, margin: "18px 0 8px", letterSpacing: "-0.01em" }}>{line.replace(/\*\*/g, "")}</p>;
        if (line.startsWith("- "))
          return (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6, alignItems: "flex-start" }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.g400, flexShrink: 0, marginTop: 8 }} />
              <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, color: T.g600, lineHeight: 1.75, margin: 0 }}>{line.slice(2)}</p>
            </div>
          );
        return <p key={i} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, color: T.g600, lineHeight: 1.8, margin: "0 0 4px" }}>{line}</p>;
      })}
    </div>
  );
}

/* ─── Logo ───────────────────────────────────────────────────────────── */
function Logo({ company, logo, size = 42 }) {
  const [err, setErr] = useState(false);
  const initials = (company || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: T.g50, border: `1px solid ${T.g100}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {logo && !err
        ? <img src={logo} alt="" onError={() => setErr(true)} style={{ width: "100%", height: "100%", objectFit: "contain", padding: size * 0.14 }} />
        : <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: size * 0.32, color: T.g400 }}>{initials}</span>
      }
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
    <span style={{ padding: "3px 8px", borderRadius: 4, background: T.g50, border: `1px solid ${T.g100}`, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, color: T.g600, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

/* ─── Small inline pill ──────────────────────────────────────────────── */
function Pill({ children, dark }) {
  return (
    <span style={{ padding: "3px 8px", borderRadius: 4, background: dark ? T.black : T.g50, border: dark ? "none" : `1px solid ${T.g100}`, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: dark ? 700 : 400, color: dark ? T.white : T.g600, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

/* ─── Detail Panel ───────────────────────────────────────────────────── */
function DetailPanel({ job, onClose, onApply, isSaved, onToggleSave, isMobile }) {
  const salary = fmtSalary(job.salaryMin, job.salaryMax, job.currency);
  const posted = timeAgo(job.postedAt);

  useEffect(() => {
    const fn = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  const body = (
    <>
      {/* Header */}
      <div style={{ padding: isMobile ? "20px 20px 18px" : "28px 32px 22px", borderBottom: `1px solid ${T.g100}`, flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <Logo company={job.company} logo={job.companyLogo} size={isMobile ? 44 : 52} />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => onToggleSave(job._id)}
              style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${isSaved ? T.black : T.g200}`, background: isSaved ? T.black : T.white, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}
            >
              <span style={{ filter: isSaved ? "invert(1)" : "none" }}>🤍</span>
            </button>
            <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${T.g200}`, background: T.white, cursor: "pointer", color: T.g400, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
        </div>

        <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: isMobile ? 20 : 24, color: T.black, margin: "0 0 5px", letterSpacing: "-0.03em", lineHeight: 1.15 }}>
          {job.title}
        </h2>
        {(job.company || job.location) && (
          <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, color: T.g400, margin: "0 0 16px" }}>
            {[job.company, job.location].filter(Boolean).join("  ·  ")}
          </p>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <WorkBadge type={job.workType} />
          {job.jobType && <Pill>{job.jobType}</Pill>}
          {salary      && <Pill dark>{salary}</Pill>}
          {posted      && <Pill>{posted}</Pill>}
          {job.isUrgent && (
            <span style={{ padding: "3px 8px", borderRadius: 4, border: `1px solid ${T.black}`, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 10, fontWeight: 700, color: T.black, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Urgent
            </span>
          )}
        </div>
      </div>

      {/* Tags */}
      {job.tags?.length > 0 && (
        <div style={{ padding: isMobile ? "12px 20px" : "14px 32px", borderBottom: `1px solid ${T.g100}`, display: "flex", flexWrap: "wrap", gap: 6, flexShrink: 0 }}>
          {job.tags.map((t, i) => <Tag key={i}>{t}</Tag>)}
        </div>
      )}

      {/* Description */}
      <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "18px 20px" : "24px 32px" }}>
        {(job.description || job.shortDescription)
          ? <RenderDesc text={job.description || job.shortDescription} />
          : <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, color: T.g400 }}>No description available.</p>
        }
      </div>

      {/* Footer */}
      <div style={{ padding: isMobile ? "14px 20px" : "20px 32px", borderTop: `1px solid ${T.g100}`, flexShrink: 0, background: T.white }}>
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
  const salary    = fmtSalary(job.salaryMin, job.salaryMax, job.currency);
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
      {/* Left black accent bar */}
      <div style={{ position: "absolute", left: 0, top: isMobile ? 14 : 12, bottom: isMobile ? 14 : 12, width: 3, borderRadius: "0 2px 2px 0", background: active ? T.black : "transparent", transition: "background .18s" }} />

      <Logo company={job.company} logo={job.companyLogo} size={isMobile ? 40 : 44} />

      {/* Main info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5, flexWrap: "wrap" }}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: isMobile ? 14 : 15, color: T.black, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            {job.title || "Untitled Role"}
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
            {job.company && job.location && <span style={{ color: T.g200 }}>·</span>}
            {job.location && <span>{job.location}</span>}
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 5 }}>
          <WorkBadge type={job.workType} />
          {shownTags.map((t, i) => <Tag key={i}>{t}</Tag>)}
          {extra > 0 && <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, color: T.g400 }}>+{extra}</span>}
        </div>
      </div>

      {/* Right: salary + date + buttons */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
        {salary && (
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 800, color: T.black, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
            {salary}
          </span>
        )}
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
function FilterBar({ search, onSearch, activeType, onType, activeSort, onSort, isMobile }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.g400, fontSize: 14, pointerEvents: "none" }}>⌕</span>
        <input
          value={search} onChange={e => onSearch(e.target.value)}
          placeholder="Search role, company or skill…"
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ width: "100%", padding: "10px 32px 10px 30px", borderRadius: 8, fontSize: 13, fontFamily: "'Plus Jakarta Sans',sans-serif", color: T.black, background: T.white, border: `1.5px solid ${focused ? T.black : T.g200}`, outline: "none", boxSizing: "border-box", transition: "border-color .18s", boxShadow: focused ? "0 0 0 3px rgba(0,0,0,0.06)" : "none" }}
        />
        {search && <button onClick={() => onSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: T.g400, fontSize: 18, lineHeight: 1 }}>×</button>}
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
        {["All", "Remote", "Hybrid", "Onsite"].map(t => (
          <button key={t} onClick={() => onType(t)} style={{ padding: isMobile ? "5px 12px" : "6px 14px", borderRadius: 6, fontSize: 12, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, cursor: "pointer", transition: "all .15s", background: activeType === t ? T.black : T.white, color: activeType === t ? T.white : T.g600, border: `1px solid ${activeType === t ? T.black : T.g200}` }}>
            {t}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <select value={activeSort} onChange={e => onSort(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, fontSize: 12, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, color: T.g600, background: T.white, border: `1px solid ${T.g200}`, outline: "none", cursor: "pointer" }}>
          <option>Newest</option>
          <option>Salary ↑</option>
          <option>Salary ↓</option>
        </select>
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
      {[1,2,3,4].map(i => (
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
/**
 * JobListings
 *
 * Props:
 *   jobs       – array from your API  (uses demo data if omitted)
 *   onApply    – (job) => void
 *   isLoading  – boolean
 *   title      – string
 */
export default function JobListings({
  jobs      = DEMO_JOBS,
  onApply,
  isLoading = false,
  title     = "Open Positions",
}) {
  const isMobile = useIsMobile();
  const [search,     setSearch]  = useState("");
  const [activeType, setType]    = useState("All");
  const [activeSort, setSort]    = useState("Newest");
  const [openJob,    setOpenJob] = useState(null);
  const [savedIds,   setSaved]   = useState(new Set());
  const [toast,      setToast]   = useState(null);

  const toggleSave = id => setSaved(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleApply = job => {
    if (onApply) onApply(job);
    setOpenJob(null);
    setToast(job);
  };

  const filtered = (jobs || [])
    .filter(j => {
      const q = search.toLowerCase().trim();
      const textOk = !q || [j.title, j.company, j.location, ...(j.tags || [])].some(v => v?.toLowerCase().includes(q));
      return textOk && (activeType === "All" || j.workType === activeType);
    })
    .sort((a, b) => {
      if (activeSort === "Newest")   return new Date(b.postedAt || 0) - new Date(a.postedAt || 0);
      if (activeSort === "Salary ↑") return (a.salaryMin || 0) - (b.salaryMin || 0);
      if (activeSort === "Salary ↓") return (b.salaryMin || 0) - (a.salaryMin || 0);
      return 0;
    });

  const featured = filtered.filter(j => j.isFeatured);
  const regular  = filtered.filter(j => !j.isFeatured);

  return (
    <div style={{ background: T.white, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fdIn    { from{opacity:0}                                  to{opacity:1} }
        @keyframes panelIn { from{transform:translateX(100%)}                 to{transform:none} }
        @keyframes sheetUp { from{transform:translateY(100%)}                 to{transform:none} }
        @keyframes rowIn   { from{opacity:0;transform:translateY(8px)}        to{opacity:1;transform:none} }
        @keyframes toastPop{ from{transform:translate(-50%,10px);opacity:0}   to{transform:translate(-50%,0);opacity:1} }
        * { box-sizing: border-box; }
        button, select, input { font-family: inherit; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${T.g100}; border-radius: 99px; }
      `}</style>

      {/* ── Sticky header ── */}
      <div style={{ background: T.white, borderBottom: `1px solid ${T.g100}`, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "16px 16px 14px" : "24px 24px 18px" }}>
          {/* Title + count */}
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
          <FilterBar search={search} onSearch={setSearch} activeType={activeType} onType={setType} activeSort={activeSort} onSort={setSort} isMobile={isMobile} />
        </div>
      </div>

      {/* ── List ── */}
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {isLoading ? <Skeleton /> : filtered.length === 0 ? <EmptyState hasSearch={!!search} /> : (
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

      {/* ── Detail panel ── */}
      {openJob && (
        <DetailPanel job={openJob} isMobile={isMobile}
          onClose={() => setOpenJob(null)} onApply={handleApply}
          isSaved={savedIds.has(openJob._id)} onToggleSave={toggleSave} />
      )}

      {/* ── Toast ── */}
      {toast && <Toast job={toast} onClose={() => setToast(null)} />}
    </div>
  );
}