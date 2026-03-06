import { useState } from "react";

const DEMO_JOB = {
  title: "Senior Frontend Engineer",
  company: "Stripe",
  companyLogo: "https://logo.clearbit.com/stripe.com",
  companyDescription: "Stripe builds economic infrastructure for the internet. Businesses of every size use our software to accept payments and manage their businesses online.",
  location: "San Francisco, CA",
  workType: "Hybrid",
  jobType: "Full-time",
  salaryMin: 140000,
  salaryMax: 190000,
  currency: "USD",
  tags: ["React", "TypeScript", "GraphQL"],
  description: `We're looking for a Senior Frontend Engineer to join Stripe's Dashboard team.

**What you'll do**
- Build high-quality React components for Stripe's core dashboard
- Collaborate with designers and product managers
- Drive frontend architecture decisions
- Mentor junior engineers

**What we're looking for**
- 5+ years of React experience
- Deep TypeScript knowledge
- Strong attention to detail`,
};

const T = {
  white: "#FFFFFF",
  g50:   "#F4F4F4",
  g100:  "#EBEBEB",
  g200:  "#D4D4D4",
  g400:  "#9A9A9A",
  g600:  "#555555",
  black: "#111111",
};

const fmtSalary = (min, max, cur) => {
  if (!min) return null;
  const sym = cur === "GBP" ? "£" : cur === "EUR" ? "€" : "$";
  const f = n => `${sym}${Math.round(n / 1000)}k`;
  return max && max !== min ? `${f(min)} – ${f(max)}` : f(min);
};

function Logo({ company, logo }) {
  const [err, setErr] = useState(false);
  const initials = (company || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: 52, height: 52, borderRadius: 12, overflow: "hidden", background: T.g50, border: `1px solid ${T.g100}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {logo && !err
        ? <img src={logo} alt="" onError={() => setErr(true)} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
        : <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 16, color: T.g400 }}>{initials}</span>
      }
    </div>
  );
}

function RenderDesc({ text }) {
  if (!text?.trim()) return null;
  return (
    <div>
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: 6 }} />;
        if (/^\*\*(.+)\*\*$/.test(line))
          return <p key={i} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 13, color: T.black, margin: "20px 0 8px" }}>{line.replace(/\*\*/g, "")}</p>;
        if (line.startsWith("- "))
          return (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.g400, flexShrink: 0, marginTop: 8 }} />
              <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, color: T.g600, lineHeight: 1.75, margin: 0 }}>{line.slice(2)}</p>
            </div>
          );
        return <p key={i} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, color: T.g600, lineHeight: 1.8, margin: "0 0 4px" }}>{line}</p>;
      })}
    </div>
  );
}

export default function JobDetailPage({ job = DEMO_JOB, onBack }) {
  const [applied, setApplied] = useState(false);
  const salary = fmtSalary(job.salaryMin, job.salaryMax, job.currency);

  return (
    <div style={{ background: "#F7F7F7", minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap'); * { box-sizing: border-box; }`}</style>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 16px 64px" }}>

        {/* Back */}
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, fontWeight: 700, color: T.g400, textTransform: "uppercase", letterSpacing: "0.06em", padding: "0 0 24px", display: "block" }}>
          ← Back
        </button>

        {/* Job Details Card */}
        <div style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.g100}`, padding: 28, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <Logo company={job.company} logo={job.companyLogo} />
            <div>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 20, color: T.black, margin: 0, letterSpacing: "-0.03em" }}>{job.title}</h1>
              <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, color: T.g400, margin: 0 }}>{job.company}{job.location ? ` · ${job.location}` : ""}</p>
            </div>
          </div>

          {/* Meta pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
            {[job.workType, job.jobType, salary].filter(Boolean).map((v, i) => (
              <span key={i} style={{ padding: "4px 10px", borderRadius: 5, background: i === 2 ? T.black : T.g50, border: i === 2 ? "none" : `1px solid ${T.g100}`, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, fontWeight: i === 2 ? 700 : 400, color: i === 2 ? T.white : T.g600 }}>
                {v}
              </span>
            ))}
            {job.tags?.map((t, i) => (
              <span key={i} style={{ padding: "4px 10px", borderRadius: 5, background: T.g50, border: `1px solid ${T.g100}`, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, color: T.g600 }}>{t}</span>
            ))}
          </div>

          <RenderDesc text={job.description} />
        </div>

        {/* Company Details Card */}
        <div style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.g100}`, padding: 28, marginBottom: 16 }}>
          <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 700, color: T.g400, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>About {job.company}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <Logo company={job.company} logo={job.companyLogo} />
            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15, color: T.black, margin: 0 }}>{job.company}</p>
          </div>
          {job.companyDescription && (
            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, color: T.g600, lineHeight: 1.8, margin: 0 }}>{job.companyDescription}</p>
          )}
        </div>

        {/* Apply Button */}
        <button
          onClick={() => setApplied(true)}
          disabled={applied}
          style={{ width: "100%", padding: 14, background: applied ? T.g100 : T.black, color: applied ? T.g400 : T.white, border: "none", borderRadius: 10, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, fontWeight: 700, cursor: applied ? "default" : "pointer", letterSpacing: "-0.01em", transition: "all .2s" }}
        >
          {applied ? "✓ Applied!" : "Apply Now →"}
        </button>

      </div>
    </div>
  );
}