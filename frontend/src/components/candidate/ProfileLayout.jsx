import { useState } from "react";

const mockCandidate = {
  name: "Arjun Menon",
  email: "arjun.menon@example.com",
  phone: "+91 98765 43210",
  place: "Kochi, Kerala",
  profilePhoto: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp",
  about:
    "Full-stack dev who loves crafting products people actually enjoy using. Open to exciting roles and collaborations.",
  qualification: "B.Tech Computer Science",
  skills: ["JavaScript", "React", "Node.js", "MongoDB", "Tailwind CSS", "Express"],
  education: [
    { education: "B.Tech", institution: "College of Engineering, Trivandrum", year: 2022, percentage: "8.4 CGPA" },
    { education: "Higher Secondary", institution: "St. Joseph's HSS, Kochi", year: 2018, percentage: "92%" },
  ],
  experience: [
  ],
  lookingVacancy: ["Frontend Developer", "Full Stack Engineer", "React Developer"],
  appliedJobs: ["job1", "job2", "job3"],
  isActive: true,
  cv: "resume.pdf",
};

const fmt = (d) => {
  if (!d) return " ";
  return new Date(d).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

function UnknownAvatar({ size, dark }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="60" fill={dark ? "#1e1e1e" : "#e5e7eb"} />
      <circle cx="60" cy="46" r="20" fill={dark ? "#3a3a3a" : "#c4c4c4"} />
      <path d="M20 105c0-22.091 17.909-40 40-40s40 17.909 40 40" fill={dark ? "#2e2e2e" : "#d1d5db"} />
    </svg>
  );
}

export default function ProfilePage({ data }) {
  const [dark, setDark] = useState(false);
  const c = data || mockCandidate;

  const hasPhoto = !!c.profilePhoto;
  const hasAbout = !!c.about;
  const hasSkills = c.skills?.length > 0;
  const hasExperience = c.experience?.length > 0;
  const hasEducation = c.education?.length > 0;
  const hasLooking = c.lookingVacancy?.length > 0;

  // Theme tokens
  const t = {
    bg: dark ? "#0c0c0c" : "#f0f0ee",
    card: dark ? "#141414" : "#ffffff",
    cardBorder: dark ? "#232323" : "#e5e5e5",
    text: dark ? "#f0f0f0" : "#111111",
    sub: dark ? "#888" : "#666",
    muted: dark ? "#444" : "#bbb",
    tag: dark ? "#1e1e1e" : "#f3f3f3",
    tagBorder: dark ? "#2e2e2e" : "#ddd",
    tagText: dark ? "#bbb" : "#555",
    divider: dark ? "#1e1e1e" : "#ebebeb",
    heroGrad1: dark ? "#1a1a1a" : "#e8e8e6",
    heroGrad2: dark ? "#0c0c0c" : "#f5f5f3",
    nowBg: dark ? "#0f2a1a" : "#dcfce7",
    nowText: dark ? "#22c55e" : "#16a34a",
    nowBorder: dark ? "#155724" : "#bbf7d0",
    statText: dark ? "#fff" : "#111",
    cover1: dark ? "#1c1c1c" : "#e2e2de",
    cover2: dark ? "#111" : "#ececea",
  };

  const cardStyle = {
    background: t.card,
    border: `1px solid ${t.cardBorder}`,
    borderRadius: 20,
    marginBottom: 14,
    overflow: "hidden",
  };

  const sectionLabel = {
    fontSize: 10,
    fontWeight: 700,
    color: t.muted,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    marginBottom: 16,
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, transition: "background 0.3s", fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "0 0 48px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
        @keyframes rise { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pop  { from { transform:scale(0.92); opacity:0; }       to { transform:scale(1); opacity:1; } }
        .pfp-wrap:hover .pfp-ring { transform: scale(1.04); }
        .btn-ghost:hover { opacity: 0.75; }
        .skill-chip:hover { border-color: ${t.text} !important; color: ${t.text} !important; }
        * { box-sizing: border-box; }
      `}</style>

      {/* ── THEME TOGGLE ── */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 20px 0", maxWidth: 720, margin: "0 auto" }}>
        <button
          onClick={() => setDark(!dark)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 14px", borderRadius: 40, cursor: "pointer",
            background: t.card, border: `1px solid ${t.cardBorder}`,
            color: t.sub, fontSize: 12, fontWeight: 600, transition: "all 0.2s",
          }}
        >
          {dark ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          )}
          {dark ? "Light mode" : "Dark mode"}
        </button>
      </div>

      <div style={{ maxWidth: 720, margin: "14px auto 0", padding: "0 16px" }}>

        {/* ══════════════════════════════════
             HERO — social cover + avatar
        ══════════════════════════════════ */}
        <div style={{ ...cardStyle, animation: "rise 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>

          {/* Cover photo area */}
          <div style={{
            height: 160,
            background: `linear-gradient(135deg, ${t.cover1} 0%, ${t.cover2} 100%)`,
            position: "relative",
            overflow: "hidden",
          }}>

            {/* 🔥 Quick Actions (Top Right) */}
<div className="absolute top-3 right-3 flex gap-2">

{/* Call */}
{c.phone && (
  <a href={`tel:${c.phone}`} target="_blank" rel="noreferrer">
    <div className="w-9 h-9 flex items-center justify-center rounded-full 
                    bg-white/80 backdrop-blur-md border border-black/10
                    hover:scale-110 transition cursor-pointer">
      📞
    </div>
  </a>
)}

{/* Instagram */}
{c.instagram && (
  <a href={c.instagram} target="_blank" rel="noreferrer">
    <div className="w-9 h-9 flex items-center justify-center rounded-full 
                    bg-white/80 backdrop-blur-md border border-black/10
                    hover:scale-110 transition cursor-pointer">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="18" cy="6" r="1"/>
      </svg>
    </div>
  </a>
)}

{/* LinkedIn */}
{c.linkedin && (
  <a href={c.linkedin} target="_blank" rel="noreferrer">
    <div className="w-9 h-9 flex items-center justify-center rounded-full 
                    bg-white/80 backdrop-blur-md border border-black/10
                    hover:scale-110 transition cursor-pointer">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.27 2.3-2.6 4.73-2.6C21.4 7.6 24 10 24 14.2V24h-5v-8.4c0-2-.04-4.6-2.8-4.6-2.8 0-3.2 2.2-3.2 4.4V24h-5V8z"/>
      </svg>
    </div>
  </a>
)}

</div>
            {/* Decorative circles */}
            <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)", top: -60, right: -40 }} />
            <div style={{ position: "absolute", width: 140, height: 140, borderRadius: "50%", background: dark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.03)", bottom: -50, left: 30 }} />
            <div style={{ position: "absolute", width: 80, height: 80, borderRadius: "50%", background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)", top: 20, left: 120 }} />

            {/* Dot grid texture */}
            <svg style={{ position: "absolute", inset: 0, opacity: dark ? 0.08 : 0.06 }} width="100%" height="100%">
              <defs>
                <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.2" fill={dark ? "#fff" : "#000"} />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>

            {/* Active badge top-right */}
            {/* {c.isActive && (
              <div style={{
                position: "absolute", top: 14, right: 14,
                display: "flex", alignItems: "center", gap: 5,
                background: dark ? "rgba(20,20,20,0.85)" : "rgba(255,255,255,0.85)",
                backdropFilter: "blur(8px)",
                border: `1px solid ${t.cardBorder}`,
                padding: "5px 10px", borderRadius: 20,
                fontSize: 11, fontWeight: 600, color: "#22c55e",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px #22c55e" }} />
                Open to work
              </div>
            )} */}
          </div>

          {/* Avatar — overlapping cover */}
          <div style={{ padding: "0 24px 24px", marginTop: -44 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>

              {/* Avatar ring */}
              <div
                className="pfp-wrap"
                style={{ position: "relative", cursor: "pointer" }}
              >
                <div
                  className="pfp-ring"
                  style={{
                    width: 88, height: 88,
                    borderRadius: "50%",
                    padding: 3,
                    background: dark
                      ? "linear-gradient(135deg, #444, #222)"
                      : "linear-gradient(135deg, #ddd, #bbb)",
                    transition: "transform 0.2s",
                    boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.6)" : "0 8px 24px rgba(0,0,0,0.12)",
                  }}
                >
                  <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: t.card }}>
                    {hasPhoto ? (
                      <img src={c.profilePhoto} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <UnknownAvatar size={82} dark={dark} />
                    )}
                  </div>
                </div>
                {/* Online dot */}
                <span style={{
                  position: "absolute", bottom: 4, right: 4,
                  width: 14, height: 14, borderRadius: "50%",
                  background: "#22c55e", border: `2.5px solid ${t.card}`,
                }} />
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 8 }}>
              
                {c.cv && (
                  <button
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "9px 18px", borderRadius: 10, cursor: "pointer",
                      fontSize: 12, fontWeight: 700,
                      background: t.text, color: t.bg,
                      border: "none", transition: "opacity 0.15s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Resume
                  </button>
                )}
              </div>
            </div>

            {/* Name + info */}
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h1 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(20px, 5vw, 28px)",
                  fontWeight: 900, color: t.text,
                  margin: 0, letterSpacing: "-0.02em",
                }}>
                  {c.name}
                </h1>
              </div>
              {c.qualification && (
                <p style={{ fontSize: 13, color: t.sub, margin: "4px 0 0" }}>{c.qualification}</p>
              )}

              {/* Meta info row */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {[
                  { icon: "M", label: c.email },
                  c.phone && { icon: "P", label: c.phone },
                  c.place && { icon: "L", label: c.place },
                ].filter(Boolean).map(({ icon, label }, i) => (
                  <span key={i} style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 11, color: t.sub, background: t.tag,
                    border: `1px solid ${t.tagBorder}`,
                    padding: "4px 10px", borderRadius: 7,
                  }}>
                    {icon === "M" && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>}
                    {icon === "P" && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>}
                    {icon === "L" && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}
                    {label}
                  </span>
                ))}
              </div>
            </div>

        
          </div>
        </div>

        {/* ── ABOUT ── */}
        {hasAbout && (
          <div style={{ ...cardStyle, padding: 24, animation: "rise 0.5s 0.06s cubic-bezier(0.16,1,0.3,1) both" }}>
            <p style={sectionLabel}>About</p>
            <p style={{ fontSize: 14, color: t.sub, lineHeight: 1.75, margin: 0 }}>{c.about}</p>
          </div>
        )}

        {/* ── SKILLS ── */}
        {hasSkills && (
          <div style={{ ...cardStyle, padding: 24, animation: "rise 0.5s 0.1s cubic-bezier(0.16,1,0.3,1) both" }}>
            <p style={sectionLabel}>Skills</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {c.skills.map((s) => (
                <span
                  key={s}
                  className="skill-chip"
                  style={{
                    padding: "5px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600,
                    color: t.tagText, background: t.tag,
                    border: `1px solid ${t.tagBorder}`, cursor: "default",
                    transition: "all 0.15s",
                  }}
                >{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── LOOKING FOR ── */}
        {hasLooking && (
          <div style={{ ...cardStyle, padding: 24, animation: "rise 0.5s 0.14s cubic-bezier(0.16,1,0.3,1) both" }}>
            <p style={sectionLabel}>Open to roles</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {c.lookingVacancy.map((v) => (
                <span key={v} style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "5px 14px", borderRadius: 7, fontSize: 12, fontWeight: 700,
                  color: t.text, border: `1.5px solid ${t.text}`, background: "transparent",
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.text }} />
                  {v}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── EXPERIENCE + EDUCATION grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>

          {hasExperience && (
            <div style={{ ...cardStyle, padding: 24, marginBottom: 0, animation: "rise 0.5s 0.18s cubic-bezier(0.16,1,0.3,1) both" }}>
              <p style={sectionLabel}>Experience</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {c.experience.map((exp, i) => (
                  <div key={i} style={{ display: "flex", gap: 14 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.text, flexShrink: 0 }} />
                      {i < c.experience.length - 1 && <div style={{ width: 1, flex: 1, background: t.divider, marginTop: 6 }} />}
                    </div>
                    <div style={{ paddingBottom: 4 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: 0 }}>{exp.jobTitle}</p>
                      <p style={{ fontSize: 11, color: t.sub, margin: "3px 0 0" }}>{exp.company}</p>
                      <p style={{ fontSize: 10, color: t.muted, margin: "4px 0 0", display: "flex", alignItems: "center", gap: 6 }}>
                        {/* {fmt(exp.startDate)} — {fmt(exp.endDate)}
                        {!exp.endDate && (
                          <span style={{ padding: "2px 7px", borderRadius: 5, background: t.nowBg, color: t.nowText, fontSize: 9, fontWeight: 700, border: `1px solid ${t.nowBorder}` }}>
                            NOW
                          </span>
                        )} */}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasEducation && (
            <div style={{ ...cardStyle, padding: 24, marginBottom: 0, animation: "rise 0.5s 0.22s cubic-bezier(0.16,1,0.3,1) both" }}>
              <p style={sectionLabel}>Education</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {c.education.map((edu, i) => (
                  <div key={i} style={{ display: "flex", gap: 14 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, border: `2px solid ${t.text}`, background: "transparent", flexShrink: 0 }} />
                      {i < c.education.length - 1 && <div style={{ width: 1, flex: 1, background: t.divider, marginTop: 6 }} />}
                    </div>
                    <div style={{ paddingBottom: 4 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: 0 }}>{edu.education}</p>
                      <p style={{ fontSize: 11, color: t.sub, margin: "3px 0 0" }}>{edu.institution}</p>
                      <div style={{ display: "flex", gap: 8, marginTop: 5, alignItems: "center" }}>
                        {edu.year && <span style={{ fontSize: 10, color: t.muted }}>{edu.year}</span>}
                        {edu.percentage && (
                          <span style={{ fontSize: 10, fontWeight: 700, color: t.sub, background: t.tag, padding: "2px 8px", borderRadius: 5, border: `1px solid ${t.tagBorder}` }}>
                            {edu.percentage}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}