// CVBuilderPage.jsx
// React + Tailwind CSS — CV Builder (Canva-style)
// Usage: <CVBuilderPage candidate={candidateObject} />

import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function normalizeCandidateData(raw) {
  if (!raw) return defaultData;
  const exp = (raw.experience || []).map((e) => ({
    role: e.jobTitle || e.role || "",
    company: e.company || "",
    duration:
      e.startDate && e.endDate
        ? `${e.startDate} – ${e.endDate}`
        : e.startDate
        ? `${e.startDate} – Present`
        : e.duration || "",
    description: e.description || "",
  }));
  const edu = (raw.education || []).map((e) => ({
    degree: e.education || e.degree || "",
    institution: e.institution || "",
    year: e.year ? String(e.year) : "",
  }));
  const skillsArr = Array.isArray(raw.skills)
    ? raw.skills
    : raw.skills
    ? raw.skills.split(",")
    : [];
  return {
    name: raw.name || "",
    title: raw.tagline || raw.title || "",
    email: raw.email || "",
    phone: raw.phone || "",
    location: raw.place || raw.location || "",
    linkedin:
      (raw.socials && raw.socials[0] && raw.socials[0].url) ||
      raw.linkedin ||
      "",
    photo: raw.profilePhoto || raw.photo || "",
    summary: raw.about || raw.summary || "",
    skills: skillsArr.map((s) => s.trim()).filter(Boolean).join(", "),
    experience: exp,
    education: edu,
  };
}

const defaultData = {
    name: "John Doe",
    title: "Senior Full Stack Developer",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    location: "Kochi, Kerala, India",
    linkedin: "linkedin.com/in/johndoe",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
  
    summary:
      "Results-driven Senior Full Stack Developer with over 5+ years of experience in designing, developing, and deploying scalable web applications. Skilled in both frontend and backend technologies with a strong focus on performance, security, and clean architecture. Proven ability to lead projects, collaborate with cross-functional teams, and deliver high-quality solutions under tight deadlines. Passionate about continuous learning, modern development practices, and building user-centric digital products that solve real-world problems.",
  
    skills:
      "React, Node.js, Express.js, JavaScript, TypeScript, Tailwind CSS, Redux,  Git, Docker,",
  
    experience: [
      {
        role: "Senior Full Stack Developer",
        company: "TechNova Solutions Pvt Ltd",
        from: "2022-03",
        to: "Present",
        description:
          "Leading a team of developers to build scalable SaaS applications using the MERN stack. Architected backend services, optimized database queries, and implemented secure authentication systems. Collaborated with product managers and designers to deliver user-focused features. Improved application performance by 30% through code optimization and efficient API handling.",
      },
      {
        role: "Full Stack Developer",
        company: "InnoWeb Technologies",
        from: "2020-01",
        to: "2022-02",
        description:
          "Developed and maintained multiple client projects, handling both frontend and backend development. Built responsive UI components using React and integrated REST APIs. Worked on database design and server-side logic using Node.js and MongoDB. Actively participated in code reviews and agile sprint planning.",
      },
      {
        role: "Junior Web Developer",
        company: "WebCraft Labs",
        from: "2018-06",
        to: "2019-12",
        description:
          "Assisted in developing websites and web applications with a focus on frontend development. Converted design mockups into responsive web pages and fixed UI/UX issues. Gained hands-on experience with modern JavaScript frameworks and version control systems.",
      },
    ],
  
    education: [
      {
        degree: "Master of Computer Applications (MCA)",
        institution: "Calicut University",
        from: "2018-06",
        to: "2020-05",
      },
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "Farook College, Kozhikode",
        from: "2015-06",
        to: "2018-04",
      },
    ],
  };

const LAYOUTS = [
  { id: 1, name: "Elegant Sidebar" },
  { id: 2, name: "Yellow Accent" },
  { id: 3, name: "Teal Pro" },
  { id: 4, name: "Classic Print" },
  { id: 5, name: "Modern Split" },
  { id: 6, name: "ATS Clean" },
  { id: 7, name: "Corporate Grey" },
  { id: 8, name: "Executive Bold" },
  { id: 9, name: "Minimal Stripe" },
  { id: 10, name: "Creative Edge" },
  { id: 11, name: "Minimal Clean Pro" },
  { id: 12, name: "Premium Modern" },
];



// ─────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────

function skillsArr(skills) {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills.filter(Boolean);
    return skills.split(/[,;|\n]+/).map((s) => s.trim()).filter(Boolean);
  }
  
  function Avatar({ src, size = 80, round = true, borderColor = "#e2e8f0" }) {
    const radius = round ? "50%" : "6px";
    if (!src) {
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: radius,
            background: "#e2e8f0",
            border: `3px solid ${borderColor}`,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size * 0.36,
            color: "#94a3b8",
            fontWeight: 700,
            letterSpacing: -0.5,
          }}
        >
          ?
        </div>
      );
    }
    return (
      <img
        src={src}
        alt="profile"
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          objectFit: "cover",
          border: `3px solid ${borderColor}`,
          flexShrink: 0,
          display: "block",
        }}
      />
    );
  }
  
  // ─────────────────────────────────────────────
  // Layout 1 — Navy sidebar, blue accent
  // ─────────────────────────────────────────────
  
  function L1SideSection({ label, children }) {
    return (
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            color: "#60a5fa",
            borderBottom: "1px solid #2d3f55",
            paddingBottom: 5,
            marginBottom: 10,
          }}
        >
          {label}
        </div>
        {children}
      </div>
    );
  }
  
  function L1SideRow({ children }) {
    return (
      <div style={{ fontSize: 11, color: "#cbd5e1", marginBottom: 5, wordBreak: "break-all", lineHeight: 1.5 }}>
        {children}
      </div>
    );
  }
  
  function L1MainLabel({ children }) {
    return (
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          color: "#1e2a3a",
          borderBottom: "2px solid #60a5fa",
          paddingBottom: 4,
          marginBottom: 12,
          marginTop: 4,
        }}
      >
        {children}
      </div>
    );
  }
  
  export function Layout1({ d }) {
    const sk = skillsArr(d.skills);
    return (
      <div
        style={{
          display: "flex",
          fontFamily: "'Segoe UI', Arial, sans-serif",
          fontSize: 13,
          minHeight: 1050,
          background: "#fff",
          color: "#1e293b",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: 230,
            background: "#1e2a3a",
            color: "#fff",
            padding: "40px 22px 32px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <Avatar src={d.photo} size={100} round borderColor="#2d3f55" />
          </div>
          <h1
            style={{
              fontSize: 17,
              fontWeight: 700,
              lineHeight: 1.3,
              color: "#f1f5f9",
              margin: "0 0 4px",
              textAlign: "center",
            }}
          >
            {d.name || "Your Name"}
          </h1>
          <p
            style={{
              fontSize: 11,
              color: "#94a3b8",
              textAlign: "center",
              margin: "0 0 24px",
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            {d.title}
          </p>
  
          <L1SideSection label="Contact">
            {d.email && <L1SideRow>{d.email}</L1SideRow>}
            {d.phone && <L1SideRow>{d.phone}</L1SideRow>}
            {d.location && <L1SideRow>{d.location}</L1SideRow>}
            {d.linkedin && <L1SideRow>{d.linkedin}</L1SideRow>}
          </L1SideSection>
  
          {sk.length > 0 && (
            <L1SideSection label="Skills">
              {sk.map((s) => (
                <div key={s} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: "#cbd5e1", marginBottom: 4 }}>{s}</div>
                  <div style={{ height: 4, background: "#2d3f55", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: 4, width: "100%", background: "#60a5fa", borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </L1SideSection>
          )}
  
          {d.education?.length > 0 && (
            <L1SideSection label="Education">
              {d.education.map((e, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.4 }}>{e.degree}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{e.institution}</div>
                  <div style={{ fontSize: 10, color: "#64748b", marginTop: 1 }}>{e.year}</div>
                </div>
              ))}
            </L1SideSection>
          )}
        </div>
  
        {/* Main */}
        <div style={{ flex: 1, padding: "40px 36px 32px" }}>
          {d.summary && (
            <>
              <L1MainLabel>Profile</L1MainLabel>
              <p style={{ color: "#475569", lineHeight: 1.75, marginBottom: 24, fontSize: 13 }}>{d.summary}</p>
            </>
          )}
  
          {d.experience?.length > 0 && (
            <>
              <L1MainLabel>Work Experience</L1MainLabel>
              {d.experience.map((e, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 18,
                    paddingLeft: 14,
                    borderLeft: "3px solid #60a5fa",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ fontWeight: 700, color: "#1e293b", fontSize: 13.5 }}>{e.role}</span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#94a3b8",
                        whiteSpace: "nowrap",
                        background: "#f1f5f9",
                        padding: "2px 8px",
                        borderRadius: 4,
                        flexShrink: 0,
                      }}
                    >
                      {e.duration}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "#60a5fa", fontWeight: 600, marginBottom: 5, marginTop: 2 }}>
                    {e.company}
                  </div>
                  {e.description && (
                    <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.65, margin: 0 }}>{e.description}</p>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    );
  }
  
  // ─────────────────────────────────────────────
  // Layout 2 — Black/yellow bold creative
  // ─────────────────────────────────────────────
  
  function L2SideLabel({ children }) {
    return (
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          color: "#f5c518",
          marginTop: 20,
          marginBottom: 8,
          paddingBottom: 4,
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        {children}
      </div>
    );
  }
  
  function L2MainLabel({ children }) {
    return (
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: "#f5c518",
          marginBottom: 10,
          marginTop: 2,
        }}
      >
        {children}
      </div>
    );
  }
  
  export function Layout2({ d }) {
    const sk = skillsArr(d.skills);
    return (
      <div
        style={{
          display: "flex",
          fontFamily: "'Segoe UI', Arial, sans-serif",
          fontSize: 13,
          minHeight: 1050,
          background: "#fff",
          color: "#1a1a1a",
        }}
      >
        {/* Sidebar */}
        <div style={{ width: 220, background: "#111", flexShrink: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#f5c518", padding: "28px 20px 22px" }}>
            <Avatar src={d.photo} size={88} round={false} borderColor="#f5c518" />
          </div>
          <div style={{ padding: "20px 18px", flex: 1 }}>
            <L2SideLabel>Contact</L2SideLabel>
            {[d.email, d.phone, d.location].filter(Boolean).map((v, i) => (
              <div key={i} style={{ color: "#9ca3af", fontSize: 11, marginBottom: 6, wordBreak: "break-all", lineHeight: 1.5 }}>
                {v}
              </div>
            ))}
  
            {sk.length > 0 && (
              <>
                <L2SideLabel>Skills</L2SideLabel>
                {sk.map((s) => (
                  <div
                    key={s}
                    style={{
                      color: "#d1d5db",
                      fontSize: 11,
                      marginBottom: 7,
                      paddingLeft: 9,
                      borderLeft: "2px solid #f5c518",
                      lineHeight: 1.4,
                    }}
                  >
                    {s}
                  </div>
                ))}
              </>
            )}
  
            {d.education?.length > 0 && (
              <>
                <L2SideLabel>Education</L2SideLabel>
                {d.education.map((e, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#f3f4f6", lineHeight: 1.4 }}>{e.institution}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{e.degree}</div>
                    <div style={{ fontSize: 10, color: "#6b7280", marginTop: 1 }}>{e.year}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
  
        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#1a1a1a", padding: "28px 30px 22px" }}>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "#fff",
                letterSpacing: -0.5,
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              {d.name || "Your Name"}
            </h1>
            <p
              style={{
                color: "#f5c518",
                fontSize: 12,
                fontWeight: 700,
                marginTop: 6,
                textTransform: "uppercase",
                letterSpacing: 1.5,
              }}
            >
              {d.title}
            </p>
          </div>
  
          <div style={{ padding: "24px 30px 28px" }}>
            {d.summary && (
              <>
                <L2MainLabel>About Me</L2MainLabel>
                <p style={{ color: "#4b5563", lineHeight: 1.72, fontSize: 12.5, marginBottom: 22 }}>{d.summary}</p>
              </>
            )}
            {d.experience?.length > 0 && (
              <>
                <L2MainLabel>Experience</L2MainLabel>
                {d.experience.map((e, i) => (
                  <div key={i} style={{ marginBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ fontWeight: 700, color: "#111", fontSize: 13.5 }}>{e.role}</span>
                      <span style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap", flexShrink: 0 }}>{e.duration}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#b48a05", fontWeight: 700, marginBottom: 4, marginTop: 2 }}>
                      {e.company}
                    </div>
                    {e.description && (
                      <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.65, margin: 0 }}>{e.description}</p>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // ─────────────────────────────────────────────
  // Layout 3 — Teal right sidebar
  // ─────────────────────────────────────────────
  
  function L3MainLabel({ children }) {
    return (
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          color: "#0d9488",
          borderBottom: "2px solid #0d9488",
          paddingBottom: 4,
          marginBottom: 12,
          marginTop: 4,
        }}
      >
        {children}
      </div>
    );
  }
  
  function L3SideLabel({ children }) {
    return (
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          color: "#2dd4bf",
          marginTop: 20,
          marginBottom: 8,
          paddingBottom: 4,
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        {children}
      </div>
    );
  }
  
  export function Layout3({ d }) {
    const sk = skillsArr(d.skills);
    return (
      <div
        style={{
          display: "flex",
          fontFamily: "'Segoe UI', Arial, sans-serif",
          fontSize: 13,
          minHeight: 1050,
          background: "#fff",
          color: "#1e293b",
        }}
      >
        {/* Main */}
        <div style={{ flex: 1, padding: "40px 32px 32px" }}>
          {d.summary && (
            <>
              <L3MainLabel>About Me</L3MainLabel>
              <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.72, marginBottom: 22 }}>{d.summary}</p>
            </>
          )}
          {d.experience?.length > 0 && (
            <>
              <L3MainLabel>Experience</L3MainLabel>
              {d.experience.map((e, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 16,
                    paddingBottom: 16,
                    borderBottom: "1px dashed #e5e7eb",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ fontWeight: 700, color: "#111827", fontSize: 13.5 }}>{e.role}</span>
                    <span style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap", flexShrink: 0 }}>{e.duration}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#0d9488", fontWeight: 600, marginBottom: 4, marginTop: 2 }}>
                    {e.company}
                  </div>
                  {e.description && (
                    <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.65, margin: 0 }}>{e.description}</p>
                  )}
                </div>
              ))}
            </>
          )}
          {d.education?.length > 0 && (
            <>
              <L3MainLabel>Education</L3MainLabel>
              {d.education.map((e, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, color: "#111827", fontSize: 13 }}>{e.institution}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                    {e.degree} · {e.year}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
  
        {/* Sidebar */}
        <div style={{ width: 210, background: "#0f766e", color: "#fff", flexShrink: 0 }}>
          <div style={{ background: "#0d9488", padding: "32px 20px 20px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Avatar src={d.photo} size={96} round borderColor="#2dd4bf" />
            </div>
            <h1
              style={{
                fontSize: 16,
                fontWeight: 800,
                marginTop: 12,
                lineHeight: 1.3,
                color: "#f0fdf4",
                margin: "12px 0 4px",
              }}
            >
              {d.name || "Your Name"}
            </h1>
            <p style={{ color: "#99f6e4", fontSize: 11, margin: 0, letterSpacing: 0.5 }}>{d.title}</p>
          </div>
  
          <div style={{ padding: "16px 18px 24px" }}>
            <L3SideLabel>Contact</L3SideLabel>
            {[d.email, d.phone, d.location].filter(Boolean).map((v, i) => (
              <div key={i} style={{ color: "#ccfbf1", fontSize: 11, marginBottom: 7, wordBreak: "break-all", lineHeight: 1.5 }}>
                {v}
              </div>
            ))}
  
            {sk.length > 0 && (
              <>
                <L3SideLabel>Skills</L3SideLabel>
                {sk.map((s) => (
                  <div key={s} style={{ marginBottom: 9 }}>
                    <div style={{ fontSize: 11, color: "#ccfbf1", marginBottom: 4 }}>{s}</div>
                    <div style={{ height: 3, background: "rgba(0,0,0,0.25)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: 3, width: "100%", background: "#2dd4bf", borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // ─────────────────────────────────────────────
  // Layout 4 — Classic serif centered header
  // ─────────────────────────────────────────────
  
  function L4Label({ children }) {
    return (
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#1a1a1a",
          borderBottom: "1.5px solid #1a1a1a",
          paddingBottom: 4,
          marginBottom: 10,
          marginTop: 20,
          fontFamily: "Arial, sans-serif",
        }}
      >
        {children}
      </div>
    );
  }
  
  export function Layout4({ d }) {
    const sk = skillsArr(d.skills);
    return (
      <div
        style={{
          background: "#fff",
          padding: "48px 56px",
          minHeight: 1050,
          fontFamily: "Georgia, serif",
          color: "#1a1a1a",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            borderBottom: "2px solid #1a1a1a",
            paddingBottom: 22,
            marginBottom: 28,
          }}
        >
          {d.photo && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <Avatar src={d.photo} size={88} round borderColor="#d1d5db" />
            </div>
          )}
          <h1
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 0.5,
              margin: "0 0 6px",
              lineHeight: 1.2,
            }}
          >
            {d.name || "Your Name"}
          </h1>
          {d.title && (
            <p
              style={{
                fontSize: 13,
                color: "#6b7280",
                margin: "0 0 10px",
                fontStyle: "italic",
                letterSpacing: 0.5,
              }}
            >
              {d.title}
            </p>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "6px 20px",
              fontSize: 12,
              color: "#6b7280",
              fontFamily: "Arial, sans-serif",
            }}
          >
            {[d.email, d.phone, d.location].filter(Boolean).map((v, i) => (
              <span key={i}>{v}</span>
            ))}
          </div>
        </div>
  
        {d.summary && (
          <>
            <L4Label>Objective</L4Label>
            <p style={{ fontSize: 13, lineHeight: 1.82, color: "#374151", marginBottom: 0 }}>{d.summary}</p>
          </>
        )}
  
        {d.experience?.length > 0 && (
          <>
            <L4Label>Professional Experience</L4Label>
            {d.experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 18 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 8,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{e.role}</span>
                  <span style={{ fontSize: 11.5, color: "#9ca3af", fontFamily: "Arial, sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {e.duration}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: "#6b7280",
                    fontStyle: "italic",
                    marginBottom: 5,
                    marginTop: 2,
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {e.company}
                </div>
                {e.description && (
                  <p
                    style={{
                      fontSize: 12.5,
                      lineHeight: 1.75,
                      color: "#4b5563",
                      margin: 0,
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    {e.description}
                  </p>
                )}
              </div>
            ))}
          </>
        )}
  
        {d.education?.length > 0 && (
          <>
            <L4Label>Education</L4Label>
            {d.education.map((e, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>{e.institution}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", fontStyle: "italic", marginTop: 2 }}>{e.degree}</div>
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap", marginLeft: 12 }}>{e.year}</div>
              </div>
            ))}
          </>
        )}
  
        {sk.length > 0 && (
          <>
            <L4Label>Skills</L4Label>
            <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, fontFamily: "Arial, sans-serif", margin: 0 }}>
              {sk.join("  ·  ")}
            </p>
          </>
        )}
      </div>
    );
  }
  
  // ─────────────────────────────────────────────
  // Layout 5 — Navy header, two-column body
  // ─────────────────────────────────────────────
  
  function L5Label({ children }) {
    return (
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          color: "#1d3557",
          borderBottom: "2px solid #457b9d",
          paddingBottom: 4,
          marginBottom: 12,
          marginTop: 4,
        }}
      >
        {children}
      </div>
    );
  }
  
  export function Layout5({ d }) {
    const sk = skillsArr(d.skills);
    return (
      <div
        style={{
          background: "#fff",
          minHeight: 1050,
          fontFamily: "'Segoe UI', Arial, sans-serif",
          fontSize: 13,
          color: "#1d3557",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#1d3557",
            padding: "30px 40px",
            display: "flex",
            alignItems: "center",
            gap: 22,
          }}
        >
          <Avatar src={d.photo} size={84} round borderColor="#a8c8f0" />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 4px", lineHeight: 1.2 }}>
              {d.name || "Your Name"}
            </h1>
            <p
              style={{
                color: "#a8c8f0",
                fontSize: 12,
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: 1.2,
                fontWeight: 600,
              }}
            >
              {d.title}
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            {[d.email, d.phone, d.location].filter(Boolean).map((v, i) => (
              <div key={i} style={{ fontSize: 11, color: "#a8c8f0", marginBottom: 4, lineHeight: 1.4 }}>
                {v}
              </div>
            ))}
          </div>
        </div>
  
        {/* Two-column body */}
        <div style={{ display: "flex", padding: "28px 40px 32px", gap: 32 }}>
          {/* Left: summary + experience */}
          <div style={{ flex: 1.4 }}>
            {d.summary && (
              <>
                <L5Label>Profile</L5Label>
                <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.72, marginBottom: 22 }}>{d.summary}</p>
              </>
            )}
            {d.experience?.length > 0 && (
              <>
                <L5Label>Work Experience</L5Label>
                {d.experience.map((e, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: 18,
                      paddingLeft: 12,
                      borderLeft: "3px solid #457b9d",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 13.5, color: "#1d3557" }}>{e.role}</span>
                      <span style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap", flexShrink: 0 }}>{e.duration}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#457b9d", fontWeight: 600, marginBottom: 4, marginTop: 2 }}>
                      {e.company}
                    </div>
                    {e.description && (
                      <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.65, margin: 0 }}>{e.description}</p>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
  
          {/* Right: education + skills */}
          <div style={{ width: 195, flexShrink: 0 }}>
            {d.education?.length > 0 && (
              <>
                <L5Label>Education</L5Label>
                {d.education.map((e, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: 12,
                      padding: "10px 12px",
                      background: "#f1f5f9",
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 12, color: "#1d3557", lineHeight: 1.4 }}>{e.institution}</div>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{e.degree}</div>
                    <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{e.year}</div>
                  </div>
                ))}
              </>
            )}
            {sk.length > 0 && (
              <>
                <L5Label>Skills</L5Label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                  {sk.map((s) => (
                    <span
                      key={s}
                      style={{
                        background: "#dbeafe",
                        color: "#1d4ed8",
                        fontSize: 11,
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontWeight: 600,
                        lineHeight: 1.5,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // ─────────────────────────────────────────────
  // Layout 6 — ATS-clean minimal
  // ─────────────────────────────────────────────
  
  function L6Label({ children }) {
    return (
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: "#111",
          margin: "18px 0 6px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        {children}
      </div>
    );
  }
  
  const L6Divider = () => (
    <div style={{ borderTop: "1.5px solid #111", margin: "12px 0 4px" }} />
  );
  
  export function Layout6({ d }) {
    const sk = skillsArr(d.skills);
    return (
      <div
        style={{
          background: "#fff",
          padding: "48px 56px",
          minHeight: 1050,
          fontFamily: "Arial, Helvetica, sans-serif",
          color: "#111",
          fontSize: 13,
        }}
      >
        {/* Header */}
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px", lineHeight: 1.2 }}>
          {d.name || "Your Name"}
        </h1>
        {d.title && <p style={{ fontSize: 13.5, color: "#444", margin: "0 0 8px" }}>{d.title}</p>}
        <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>
          {[d.email, d.phone, d.location].filter(Boolean).join("  |  ")}
        </div>
  
        <L6Divider />
  
        {d.summary && (
          <>
            <L6Label>Professional Summary</L6Label>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: "#222", margin: "6px 0 0" }}>{d.summary}</p>
            <L6Divider />
          </>
        )}
  
        {d.experience?.length > 0 && (
          <>
            <L6Label>Work Experience</L6Label>
            {d.experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 18, marginTop: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 8,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{e.role}</span>
                  <span style={{ fontSize: 12, color: "#555", whiteSpace: "nowrap", flexShrink: 0 }}>{e.duration}</span>
                </div>
                <div style={{ fontSize: 13, color: "#333", fontWeight: 600, marginTop: 2, marginBottom: 5 }}>
                  {e.company}
                </div>
                {e.description && (
                  <p style={{ fontSize: 12.5, lineHeight: 1.8, color: "#444", margin: 0 }}>{e.description}</p>
                )}
              </div>
            ))}
            <L6Divider />
          </>
        )}
  
        {d.education?.length > 0 && (
          <>
            <L6Label>Education</L6Label>
            {d.education.map((e, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  marginTop: 8,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{e.institution}</div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{e.degree}</div>
                </div>
                <div style={{ fontSize: 12, color: "#777", whiteSpace: "nowrap", marginLeft: 12 }}>{e.year}</div>
              </div>
            ))}
            {sk.length > 0 && <L6Divider />}
          </>
        )}
  
        {sk.length > 0 && (
          <>
            <L6Label>Skills</L6Label>
            <p style={{ fontSize: 13, color: "#333", lineHeight: 1.9, margin: "6px 0 0" }}>{sk.join(" · ")}</p>
          </>
        )}
      </div>
    );
  }
  
  // ─────────────────────────────────────────────
  // Layout 7 — Corporate slate-gray header
  // ─────────────────────────────────────────────
  
  function L7Label({ children }) {
    return (
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: "#2d3748",
          borderBottom: "2px solid #4a5568",
          paddingBottom: 4,
          marginBottom: 14,
          marginTop: 22,
        }}
      >
        {children}
      </div>
    );
  }
  
  export function Layout7({ d }) {
    const sk = skillsArr(d.skills);
    return (
      <div
        style={{
          background: "#fff",
          minHeight: 1050,
          fontFamily: "'Calibri', 'Segoe UI', Arial, sans-serif",
          color: "#1a1a1a",
          fontSize: 13,
        }}
      >
        {/* Header */}
        <div style={{ background: "#2d3748", padding: "32px 44px 26px" }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 5px", lineHeight: 1.2 }}>
            {d.name || "Your Name"}
          </h1>
          {d.title && <p style={{ color: "#a0aec0", fontSize: 12.5, margin: "0 0 10px" }}>{d.title}</p>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px", fontSize: 11.5, color: "#718096" }}>
            {[d.email, d.phone, d.location].filter(Boolean).map((v, i) => (
              <span key={i}>{v}</span>
            ))}
          </div>
        </div>
  
        <div style={{ padding: "28px 44px 36px" }}>
          {d.summary && (
            <div
              style={{
                marginBottom: 4,
                paddingLeft: 14,
                borderLeft: "4px solid #4a5568",
              }}
            >
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "#4a5568", margin: 0 }}>{d.summary}</p>
            </div>
          )}
  
          {d.experience?.length > 0 && (
            <>
              <L7Label>Experience</L7Label>
              {d.experience.map((e, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c" }}>{e.role}</div>
                      <div style={{ fontSize: 12, color: "#4a5568", fontWeight: 600, marginTop: 2 }}>{e.company}</div>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#fff",
                        background: "#4a5568",
                        padding: "3px 10px",
                        borderRadius: 3,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        marginTop: 2,
                        lineHeight: 1.5,
                      }}
                    >
                      {e.duration}
                    </div>
                  </div>
                  {e.description && (
                    <p style={{ fontSize: 12, color: "#718096", lineHeight: 1.72, margin: "8px 0 0" }}>
                      {e.description}
                    </p>
                  )}
                </div>
              ))}
            </>
          )}
  
          {d.education?.length > 0 && (
            <>
              <L7Label>Education</L7Label>
              {d.education.map((e, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#1a202c" }}>{e.institution}</div>
                    <div style={{ fontSize: 12, color: "#718096", marginTop: 2 }}>{e.degree}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#a0aec0", whiteSpace: "nowrap", marginLeft: 12 }}>{e.year}</div>
                </div>
              ))}
            </>
          )}
  
          {sk.length > 0 && (
            <>
              <L7Label>Skills</L7Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {sk.map((s) => (
                  <span
                    key={s}
                    style={{
                      background: "#edf2f7",
                      color: "#2d3748",
                      fontSize: 12,
                      padding: "4px 12px",
                      borderRadius: 3,
                      border: "1px solid #e2e8f0",
                      lineHeight: 1.5,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
  
  // ─────────────────────────────────────────────
  // Layout 8 — Executive serif, strong borders
  // ─────────────────────────────────────────────
  
  function L8Label({ children }) {
    return (
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          fontFamily: "Arial, sans-serif",
          color: "#1a1a1a",
          borderBottom: "2px solid #1a1a1a",
          paddingBottom: 4,
          marginBottom: 14,
          marginTop: 24,
        }}
      >
        {children}
      </div>
    );
  }
  
  export function Layout8({ d }) {
    const sk = skillsArr(d.skills);
    return (
      <div
        style={{
          background: "#fff",
          padding: "52px 56px",
          minHeight: 1050,
          fontFamily: "Georgia, serif",
          color: "#111",
          fontSize: 13,
        }}
      >
        {/* Header */}
        <div style={{ borderBottom: "4px solid #111", paddingBottom: 20, marginBottom: 26 }}>
          <h1
            style={{
              fontSize: 34,
              fontWeight: 700,
              margin: "0 0 6px",
              letterSpacing: -0.5,
              lineHeight: 1.1,
              color: "#111",
            }}
          >
            {d.name || "Your Name"}
          </h1>
          {d.title && (
            <p
              style={{
                fontSize: 13,
                color: "#555",
                margin: "0 0 10px",
                fontFamily: "Arial, sans-serif",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {d.title}
            </p>
          )}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "4px 16px",
              fontSize: 12,
              color: "#444",
              fontFamily: "Arial, sans-serif",
            }}
          >
            {[d.email, d.phone, d.location].filter(Boolean).map((v, i) => (
              <span key={i}>{v}</span>
            ))}
          </div>
        </div>
  
        {d.summary && (
          <p style={{ fontSize: 13.5, lineHeight: 1.88, color: "#333", margin: "0 0 28px", fontStyle: "italic" }}>
            {d.summary}
          </p>
        )}
  
        {d.experience?.length > 0 && (
          <>
            <L8Label>Career History</L8Label>
            {d.experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 22 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 2,
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{e.role}</span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#888",
                      fontFamily: "Arial, sans-serif",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {e.duration}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#555",
                    fontFamily: "Arial, sans-serif",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    marginBottom: 6,
                  }}
                >
                  {e.company}
                </div>
                {e.description && (
                  <p style={{ fontSize: 13, lineHeight: 1.8, color: "#444", fontFamily: "Arial, sans-serif", margin: 0 }}>
                    {e.description}
                  </p>
                )}
              </div>
            ))}
          </>
        )}
  
        {d.education?.length > 0 && (
          <>
            <L8Label>Education</L8Label>
            {d.education.map((e, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{e.institution}</div>
                  <div style={{ fontSize: 12, color: "#666", fontStyle: "italic", marginTop: 2 }}>{e.degree}</div>
                </div>
                <div style={{ fontSize: 12, color: "#999", whiteSpace: "nowrap", marginLeft: 12 }}>{e.year}</div>
              </div>
            ))}
          </>
        )}
  
        {sk.length > 0 && (
          <>
            <L8Label>Core Skills</L8Label>
            <p style={{ fontSize: 13, color: "#333", lineHeight: 2, fontFamily: "Arial, sans-serif", margin: 0 }}>
              {sk.join("  ·  ")}
            </p>
          </>
        )}
      </div>
    );
  }
  
  // ─────────────────────────────────────────────
  // Layout 9 — Blue accent stripe, clean modern
  // ─────────────────────────────────────────────
  
  function L9Label({ children }) {
    return (
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: "#2563eb",
          marginBottom: 12,
          marginTop: 4,
          paddingBottom: 5,
          borderBottom: "2px solid #bfdbfe",
        }}
      >
        {children}
      </div>
    );
  }
  
  export function Layout9({ d }) {
    const sk = skillsArr(d.skills);
    return (
      <div
        style={{
          display: "flex",
          minHeight: 1050,
          background: "#fff",
          fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif",
          fontSize: 13,
          color: "#0f172a",
        }}
      >
        {/* Left blue stripe */}
        <div style={{ width: 6, background: "#2563eb", flexShrink: 0 }} />
  
        <div style={{ flex: 1, padding: "44px 48px 36px" }}>
          {/* Header */}
          <div style={{ marginBottom: 26 }}>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#0f172a",
                margin: "0 0 5px",
                letterSpacing: -0.3,
                lineHeight: 1.2,
              }}
            >
              {d.name || "Your Name"}
            </h1>
            {d.title && (
              <p
                style={{
                  fontSize: 12,
                  color: "#2563eb",
                  margin: "0 0 8px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                }}
              >
                {d.title}
              </p>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px", fontSize: 12, color: "#64748b" }}>
              {[d.email, d.phone, d.location].filter(Boolean).map((v, i) => (
                <span key={i}>{v}</span>
              ))}
            </div>
          </div>
  
          {d.summary && (
            <div
              style={{
                marginBottom: 26,
                padding: "14px 18px",
                background: "#eff6ff",
                borderRadius: 5,
                borderLeft: "3px solid #3b82f6",
              }}
            >
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "#1e3a5f", margin: 0 }}>{d.summary}</p>
            </div>
          )}
  
          {d.experience?.length > 0 && (
            <>
              <L9Label>Experience</L9Label>
              {d.experience.map((e, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 20,
                    paddingBottom: 20,
                    borderBottom: i < d.experience.length - 1 ? "1px solid #f1f5f9" : "none",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>{e.role}</div>
                      <div style={{ fontSize: 12, color: "#2563eb", fontWeight: 600, marginTop: 2 }}>{e.company}</div>
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: "#94a3b8",
                        whiteSpace: "nowrap",
                        marginLeft: 12,
                        padding: "2px 8px",
                        border: "1px solid #e2e8f0",
                        borderRadius: 4,
                        lineHeight: 1.5,
                        flexShrink: 0,
                      }}
                    >
                      {e.duration}
                    </div>
                  </div>
                  {e.description && (
                    <p style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.75, margin: "8px 0 0" }}>
                      {e.description}
                    </p>
                  )}
                </div>
              ))}
            </>
          )}
  
          {d.education?.length > 0 && (
            <>
              <L9Label>Education</L9Label>
              {d.education.map((e, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{e.institution}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{e.degree}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap", marginLeft: 12 }}>{e.year}</div>
                </div>
              ))}
            </>
          )}
  
          {sk.length > 0 && (
            <>
              <L9Label>Skills</L9Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                {sk.map((s) => (
                  <span
                    key={s}
                    style={{
                      background: "#eff6ff",
                      color: "#1d4ed8",
                      fontSize: 12,
                      padding: "4px 12px",
                      borderRadius: 5,
                      fontWeight: 600,
                      border: "1px solid #bfdbfe",
                      lineHeight: 1.5,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
  export function Layout10({ d }) {
    const sk = skillsArr(d.skills);
    return (
      <div className="font-sans text-gray-800 bg-white min-h-[1050px] flex flex-col">
        {/* Top bar */}
        <div className="bg-yellow-400 flex gap-6 px-8 py-3 text-sm font-medium items-center">
          {d.phone && (
            <span className="flex items-center gap-1">
              <PhoneIcon /> {d.phone}
            </span>
          )}
          {d.email && (
            <span className="flex items-center gap-1">
              <MailIcon /> {d.email}
            </span>
          )}
          {d.linkedin && (
            <span className="flex items-center gap-1">
              <LinkIcon /> {d.linkedin}
            </span>
          )}
        </div>
   
        {/* Header */}
        <div className="px-8 pt-6 pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900">
              {d.name || "Your Name"}
            </h1>
            {d.summary && (
              <p className="text-sm text-gray-600 leading-relaxed mt-2 max-w-lg">
                {d.summary}
              </p>
            )}
          </div>
          <Avatar src={d.photo} size={90} className="mt-1 ring-4 ring-yellow-300" />
        </div>
   
        {/* Body */}
        <div className="flex flex-1 px-8 gap-8 pb-8">
          {/* Left */}
          <div className="w-52 flex-shrink-0 flex flex-col gap-6">
            {sk.length > 0 && (
              <section>
                <SectionLabel2>Skills</SectionLabel2>
                <ul className="mt-2 space-y-1">
                  {sk.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </section>
            )}
   
            {d.education?.length > 0 && (
              <section>
                <SectionLabel2>Education</SectionLabel2>
                {d.education.map((e, i) => (
                  <div key={i} className="mt-2 text-sm">
                    <div className="font-semibold text-gray-800">{e.degree}</div>
                    <div className="text-gray-500">{e.institution}</div>
                    <div className="text-gray-400 text-xs">{e.year}</div>
                  </div>
                ))}
              </section>
            )}
   
            {d.languages?.length > 0 && (
              <section>
                <SectionLabel2>Languages</SectionLabel2>
                {d.languages.map((l, i) => (
                  <div key={i} className="mt-2 text-sm text-gray-700">
                    {l.name}{l.level ? ` (${l.level})` : ""}
                  </div>
                ))}
              </section>
            )}
   
            {d.reference && (
              <section>
                <SectionLabel2>Reference</SectionLabel2>
                <div className="mt-2 text-sm">
                  <div className="font-semibold text-gray-800">{d.reference.name}</div>
                  <div className="text-gray-500">{d.reference.company}</div>
                  {d.reference.phone && <div className="text-gray-400 text-xs">Phone: {d.reference.phone}</div>}
                  {d.reference.email && <div className="text-gray-400 text-xs">Email: {d.reference.email}</div>}
                </div>
              </section>
            )}
          </div>
   
          {/* Right */}
          <div className="flex-1 flex flex-col gap-6">
            {d.experience?.length > 0 && (
              <section>
                <SectionLabel2>Work History</SectionLabel2>
                <div className="mt-2 space-y-5">
                  {d.experience.map((e, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-gray-900">{e.role}</span>
                        <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{e.duration}</span>
                      </div>
                      <div className="text-sm font-semibold text-yellow-600">{e.company}</div>
                      {e.description && (
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{e.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }
   
  function SectionLabel2({ children }) {
    return (
      <div className="text-xs font-black uppercase tracking-widest text-gray-800 border-b-2 border-yellow-400 pb-1">
        {children}
      </div>
    );
  }
   
  // ══════════════════════════════════════════════════════════════
  // LAYOUT 3 — Timeline style (teal accent, inspired by img 4)
  // ══════════════════════════════════════════════════════════════
  export function Layout11({ d }) {
    const sk = skillsArr(d.skills);
    return (
      <div className="font-sans bg-white text-gray-800 min-h-[1050px]">
        {/* Header */}
        <div className="flex items-start gap-6 p-10 pb-6">
          <div className="relative">
           
          <Avatar 
  src={d.photo} 
  size={110} 
  round={false}   // 🔥 THIS is the key
/>
          </div>
          <div className="mt-2">
            <h1 className="text-3xl font-extrabold text-gray-900">{d.name || "Your Name"}</h1>
            <p className="text-teal-600 font-medium text-sm mt-0.5">{d.title}</p>
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-gray-500">
              {d.email && <InfoRow3 icon={<MailIcon />}>{d.email}</InfoRow3>}
              {d.phone && <InfoRow3 icon={<PhoneIcon />}>{d.phone}</InfoRow3>}
              {d.location && <InfoRow3 icon={<LocationIcon />}>{d.location}</InfoRow3>}
              {d.linkedin && <InfoRow3 icon={<LinkIcon />}>{d.linkedin}</InfoRow3>}
            </div>
          </div>
        </div>
   
        {/* Body */}
        <div className="px-10 pb-10 flex gap-10">
          {/* Left column */}
          <div className="flex-1">
            {d.experience?.length > 0 && (
              <section className="mb-8">
                <SectionLabel3>Work Experience</SectionLabel3>
                <div className="mt-4 relative">
                  {/* Timeline line */}
                  <div className="absolute left-[5px] top-2 bottom-0 w-px bg-teal-200" />
                  <div className="space-y-6">
                    {d.experience.map((e, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex-shrink-0 mt-1.5">
                          <div className="w-3 h-3 rounded-full bg-teal-500 ring-4 ring-teal-100 relative z-10" />
                        </div>
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <span className="font-bold text-gray-900 text-sm">{e.role}</span>
                            <span className="text-xs text-gray-400 whitespace-nowrap">{e.duration}</span>
                          </div>
                          <div className="text-xs text-teal-600 font-semibold mt-0.5">{e.company}</div>
                          {e.description && (
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{e.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
   
            {d.education?.length > 0 && (
              <section>
                <SectionLabel3>Education</SectionLabel3>
                <div className="mt-4 relative">
                  <div className="absolute left-[5px] top-2 bottom-0 w-px bg-teal-200" />
                  <div className="space-y-5">
                    {d.education.map((e, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex-shrink-0 mt-1.5">
                          <div className="w-3 h-3 rounded-full bg-teal-400 ring-4 ring-teal-50 relative z-10" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-gray-900">{e.degree}</div>
                          <div className="text-xs text-gray-500">{e.institution}</div>
                          <div className="text-xs text-gray-400">{e.year}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
   
          {/* Right column */}
          <div className="w-52 flex-shrink-0 space-y-6">
            {sk.length > 0 && (
              <section>
                <SectionLabel3>Skills &amp; Interests</SectionLabel3>
                <div className="mt-3 space-y-3">
                  {sk.map((s) => (
                    <div key={s}>
                      <div className="text-xs text-gray-700 mb-1">{s}</div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full"
                          style={{ width: `100%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
   
            {d.summary && (
              <section>
                <SectionLabel3>Profile</SectionLabel3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{d.summary}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }
   
  function SectionLabel3({ children }) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-gray-800">{children}</span>
        <div className="flex-1 h-px bg-teal-200" />
      </div>
    );
  }
   
  function InfoRow3({ icon, children }) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-teal-500">{icon}</span>
        {children}
      </div>
    );
  }
   
  // ══════════════════════════════════════════════════════════════
  // LAYOUT 4 — Minimal dark header, dot-skill grid (inspired by img 2)
  // ══════════════════════════════════════════════════════════════
  export function Layout12({ d }) {
    const sk = skillsArr(d.skills);
    return (
      <div className="font-sans bg-white text-gray-800 min-h-[1050px] flex">
        {/* Sidebar */}
        <div className="w-52 flex-shrink-0 bg-gray-50 border-r border-gray-200 p-7 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3">
            <Avatar
              src={d.photo}
              size={90}
              className="ring-4 ring-white shadow-lg"
            />
            <div className="text-center">
              <h1 className="text-base font-black text-gray-900 leading-tight">
                {d.name || "Your Name"}
              </h1>
              <p className="text-xs font-semibold text-green-500 uppercase tracking-wider mt-0.5">
                {d.title}
              </p>
            </div>
          </div>
   
          <div>
            <SectionLabel4>Contact</SectionLabel4>
            <div className="mt-2 space-y-2 text-xs text-gray-600">
              {d.email && (
                <div className="flex items-center gap-1.5">
                  <MailIcon className="text-gray-400" /> {d.email}
                </div>
              )}
              {d.location && (
                <div className="flex items-center gap-1.5">
                  <LocationIcon className="text-gray-400" /> {d.location}
                </div>
              )}
              {d.phone && (
                <div className="flex items-center gap-1.5">
                  <PhoneIcon className="text-gray-400" /> {d.phone}
                </div>
              )}
              {d.linkedin && (
                <div className="flex items-center gap-1.5">
                  <LinkIcon className="text-gray-400" /> {d.linkedin}
                </div>
              )}
            </div>
          </div>
   
          {sk.length > 0 && (
            <div>
              <SectionLabel4>Technical Skills</SectionLabel4>
              <div className="mt-3 space-y-2">
                {sk.map((s, i) => (
                  <div key={s} className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-700 truncate">{s}</span>
                    <div className="flex gap-0.5 flex-shrink-0">
                      {[...Array(5)].map((_, j) => (
                        <div
                          key={j}
                          className={`w-2.5 h-2.5 rounded-sm ${
                            "bg-green-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
   
        {/* Main */}
        <div className="flex-1 p-8 flex flex-col gap-6">
          {d.summary && (
            <section>
              <SectionLabel4Main>Professional Summary</SectionLabel4Main>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{d.summary}</p>
            </section>
          )}
   
          {d.experience?.length > 0 && (
            <section>
              <SectionLabel4Main>Employment</SectionLabel4Main>
              <div className="mt-3 space-y-4">
                {d.experience.map((e, i) => (
                  <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-gray-900 text-sm">{e.role}</span>
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {e.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                      {e.company && (
                        <span className="flex items-center gap-1">
                          <span className="w-3 h-3 text-gray-300">⊙</span> {e.company}
                        </span>
                      )}
                    </div>
                    {e.description && (
                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{e.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
   
          {d.education?.length > 0 && (
            <section>
              <SectionLabel4Main>Education</SectionLabel4Main>
              <div className="mt-3 space-y-3">
                {d.education.map((e, i) => (
                  <div key={i} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="font-bold text-sm text-gray-900">{e.degree}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-0.5">
                      {e.institution && (
                        <span className="flex items-center gap-1">
                          <span>⊙</span> {e.institution}
                        </span>
                      )}
                      {e.year && (
                        <span className="flex items-center gap-1">
                          <span>⏱</span> {e.year}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }
   
  function SectionLabel4({ children }) {
    return (
      <div className="text-xs font-black uppercase tracking-widest text-gray-500 mt-1">
        {children}
      </div>
    );
  }
   
  function SectionLabel4Main({ children }) {
    return (
      <div className="text-sm font-black uppercase tracking-wider text-gray-800 border-b-2 border-green-400 pb-1">
        {children}
      </div>
    );
  }
   
  // ── Tiny icon components ─────────────────────────────────────
  function MailIcon() {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
      </svg>
    );
  }
  function PhoneIcon() {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.9v3a2 2 0 01-2.2 2A19.8 19.8 0 013 4.2 2 2 0 015 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.6a2 2 0 01-.5 2.1L9 9.9a16 16 0 006.1 6.1l1.5-1.2a2 2 0 012.1-.5c.8.3 1.7.6 2.6.7A2 2 0 0122 16.9z" />
      </svg>
    );
  }
  function LocationIcon() {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    );
  }
  function LinkIcon() {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.7 1.7" />
        <path d="M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7l1.7-1.7" />
      </svg>
    );
  }
   
 
 

// ─── Label helpers ────────────────────────────────────────────────────────────
function SideSection({ label, children }) { return (<><div style={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "18px 0 8px", borderBottom: "1px solid #2d3f55", paddingBottom: 4 }}>{label}</div>{children}</>); }
function SideRow({ children }) { return <div style={{ color: "#cbd5e1", fontSize: 11, marginBottom: 6, wordBreak: "break-all" }}>{children}</div>; }
function MainLabel({ color, children }) { return <div style={{ fontSize: 12, fontWeight: 800, color, textTransform: "uppercase", letterSpacing: 1.5, borderBottom: `2px solid ${color}`, paddingBottom: 4, marginBottom: 12 }}>{children}</div>; }
function YellowSectionLabel({ children }) { return <div style={{ color: "#f5c518", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "18px 0 8px", borderBottom: "1px solid #333", paddingBottom: 4 }}>{children}</div>; }
function YellowMainLabel({ children }) { return <div style={{ fontSize: 13, fontWeight: 800, color: "#111", textTransform: "uppercase", letterSpacing: 1, borderBottom: "2px solid #f5c518", paddingBottom: 4, marginBottom: 12 }}>{children}</div>; }
function TealSideLabel({ children }) { return <div style={{ color: "#99f6e4", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "16px 0 8px", borderBottom: "1px solid #0d9488", paddingBottom: 4 }}>{children}</div>; }
function ClassicLabel({ children }) { return <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, borderBottom: "1.5px solid #1a1a1a", paddingBottom: 5, marginBottom: 14, marginTop: 8, fontFamily: "Georgia, serif" }}>{children}</div>; }
function SplitLabel({ children }) { return <div style={{ fontSize: 12, fontWeight: 800, color: "#1d3557", textTransform: "uppercase", letterSpacing: 1, borderBottom: "2px solid #1d3557", paddingBottom: 4, marginBottom: 12 }}>{children}</div>; }
function AtsLabel({ children }) { return <div style={{ fontSize: 13, fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 2, marginTop: 14 }}>{children}</div>; }
function CorpLabel({ children }) { return <div style={{ fontSize: 11, fontWeight: 700, color: "#2d3748", textTransform: "uppercase", letterSpacing: 2, borderBottom: "2px solid #2d3748", paddingBottom: 4, marginBottom: 14, marginTop: 24 }}>{children}</div>; }
function ExecLabel({ children }) { return <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#111", borderBottom: "1.5px solid #ccc", paddingBottom: 5, marginBottom: 14, marginTop: 26, fontFamily: "Arial, sans-serif" }}>{children}</div>; }
function StripeLabel({ children }) { return <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: 2, borderBottom: "2px solid #2563eb", paddingBottom: 4, marginBottom: 14, marginTop: 24 }}>{children}</div>; }

// ─── Thumbnail — SQUARE ───────────────────────────────────────────────────────
// Sidebar is 220px wide. Padding 10px each side → usable = 200px.
// THUMB_SIZE = 200 makes a perfect square thumbnail.
const THUMB_SIZE = 200;
const CV_W = 794;
const SCALE = THUMB_SIZE / CV_W; // ~0.252

const LAYOUT_COMPONENTS = { 1: Layout1, 2: Layout2, 3: Layout3, 4: Layout4, 5: Layout5, 6: Layout6, 7: Layout7, 8: Layout8, 9: Layout9, 10: Layout10 , 11: Layout11 , 12: Layout12  };

function LayoutThumb({ layout, cvData, active, onClick }) {
  const LayoutComponent = LAYOUT_COMPONENTS[layout.id] || Layout9;
  return (
    <button
      onClick={onClick}
      style={{
        width: THUMB_SIZE,
        padding: 0,
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "block",
      }}
    >
      <div
        style={{
          borderRadius: 8,
          overflow: "hidden",
          border: active ? "2.5px solid #111" : "2px solid #e5e7eb",
          boxShadow: active ? "0 0 0 3px rgba(0,0,0,0.12)" : "0 1px 3px rgba(0,0,0,0.06)",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
      >
        {/* ── Square crop window ── */}
        <div
          style={{
            width: THUMB_SIZE,
            height: THUMB_SIZE, // ← SAME as width → perfect square
            overflow: "hidden",
            position: "relative",
            pointerEvents: "none",
            userSelect: "none",
            background: "#fff",
          }}
        >
          <div
            style={{
              width: CV_W,
              transformOrigin: "top left",
              transform: `scale(${SCALE})`,
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <LayoutComponent d={cvData} />
          </div>
        </div>
        {/* ── Name label ── */}
        <div
          style={{
            padding: "5px 8px 7px",
            borderTop: "1px solid #f0f0f0",
            background: active ? "#fafafa" : "#fff",
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: active ? "#111" : "#666" }}>
            {layout.name}
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ data, onSave, onClose }) {
  const [form, setForm] = useState({ ...data });
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setExp = (i, key, val) => { const exp = [...(form.experience || [])]; exp[i] = { ...exp[i], [key]: val }; setForm((f) => ({ ...f, experience: exp })); };
  const setEdu = (i, key, val) => { const edu = [...(form.education || [])]; edu[i] = { ...edu[i], [key]: val }; setForm((f) => ({ ...f, education: edu })); };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        set("photo", reader.result); // base64 image
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-[580px] max-h-[88vh] overflow-y-auto p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Edit CV Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl font-light leading-none">×</button>
        </div>
        <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Profile Photo
  </label>

  <div className="flex items-center gap-4">
    {/* Preview */}
    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border">
      {form.photo ? (
        <img
          src={form.photo}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
          No Image
        </div>
      )}
    </div>

    {/* Upload Button */}
    <label className="cursor-pointer px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
      Change Photo
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </label>
  </div>
</div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field label="Full Name"><input className={inp} value={form.name || ""} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="Job Title"><input className={inp} value={form.title || ""} onChange={(e) => set("title", e.target.value)} /></Field>
          <Field label="Email"><input className={inp} value={form.email || ""} onChange={(e) => set("email", e.target.value)} /></Field>
          <Field label="Phone"><input className={inp} value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} /></Field>
          <Field label="Location"><input className={inp} value={form.location || ""} onChange={(e) => set("location", e.target.value)} /></Field>
          <Field label="LinkedIn / Website"><input className={inp} value={form.linkedin || ""} onChange={(e) => set("linkedin", e.target.value)} /></Field>
        </div>

        <div className="mt-3"><Field label="Summary / About"><textarea className={`${inp} min-h-[72px] resize-y`} value={form.summary || ""} onChange={(e) => set("summary", e.target.value)} /></Field></div>
        <div className="mt-3"><Field label="Skills (comma-separated)"><input className={inp} value={form.skills || ""} onChange={(e) => set("skills", e.target.value)} placeholder="e.g. Management, Photography" /></Field></div>
        <SectionDivider>Experience</SectionDivider>
        {(form.experience || []).map((e, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-200">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Field label="Role"><input className={inp} value={e.role || ""} onChange={(v) => setExp(i, "role", v.target.value)} /></Field>
              <Field label="Company"><input className={inp} value={e.company || ""} onChange={(v) => setExp(i, "company", v.target.value)} /></Field>
              <Field label="Duration"><input className={inp} value={e.duration || ""} onChange={(v) => setExp(i, "duration", v.target.value)} placeholder="2020 – Present" /></Field>
            </div>
            <Field label="Description"><textarea className={`${inp} min-h-[56px] resize-y`} value={e.description || ""} onChange={(v) => setExp(i, "description", v.target.value)} /></Field>
          </div>
        ))}
        <button onClick={() => setForm((f) => ({ ...f, experience: [...(f.experience || []), { role: "", company: "", duration: "", description: "" }] }))} className="text-xs font-medium text-gray-600 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 mb-4">+ Add Experience</button>
        <SectionDivider>Education</SectionDivider>
        {(form.education || []).map((e, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-200">
            <div className="grid grid-cols-3 gap-3">
              <Field label="Degree"><input className={inp} value={e.degree || ""} onChange={(v) => setEdu(i, "degree", v.target.value)} /></Field>
              <Field label="Institution"><input className={inp} value={e.institution || ""} onChange={(v) => setEdu(i, "institution", v.target.value)} /></Field>
              <Field label="Year"><input className={inp} value={e.year || ""} onChange={(v) => setEdu(i, "year", v.target.value)} /></Field>
            </div>
          </div>
        ))}
        <button onClick={() => setForm((f) => ({ ...f, education: [...(f.education || []), { degree: "", institution: "", year: "" }] }))} className="text-xs font-medium text-gray-600 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 mb-4">+ Add Education</button>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(form)} className="px-5 py-2 text-sm font-semibold bg-black text-white rounded-lg hover:bg-gray-800">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

const inp = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-white text-gray-900";
function Field({ label, children }) { return (<div><label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>{children}</div>); }
function SectionDivider({ children }) { return (<div className="flex items-center gap-2 my-4"><div className="flex-1 h-px bg-gray-200" /><span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{children}</span><div className="flex-1 h-px bg-gray-200" /></div>); }

// ─── MAIN PAGE COMPONENT ──────────────────────────────────────────────────────
export default function CVBuilderPage() {
    const { state } = useLocation();
  
    const candidate =
      state?.candidate ||
      JSON.parse(localStorage.getItem("candidate"));
    const hasRealData = !!candidate;
  
    const [cvData, setCvData] = useState(() =>
      candidate ? normalizeCandidateData(candidate) : {
        name: "", title: "", email: "", phone: "",
        location: "", linkedin: "", photo: "", summary: "",
        skills: "", experience: [], education: [],
      }
    );
  
    const [showEdit, setShowEdit] = useState(!hasRealData);
    const [activeLayout, setActiveLayout] = useState(2);
    const [showLayoutPicker, setShowLayoutPicker] = useState(false);
  
    const previewRef = useRef(null);
    const ActiveLayout = LAYOUT_COMPONENTS[activeLayout] || Layout3;
  
    const handleDownload = () => {
      const html = previewRef.current?.innerHTML || "";
      const win = window.open("", "_blank");
      win.document.write(`
        <!DOCTYPE html><html><head>
          <title>${cvData.name || "CV"}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            * { box-sizing: border-box; }
            @page { size: A4; margin: 0; }
            body { margin: 0; padding: 0; background: white; }
            #cv-print { width: 794px; height: 1123px; overflow: hidden; }
            * { page-break-inside: avoid; break-inside: avoid; }
            .flex { display: flex !important; flex-wrap: nowrap !important; }
            @media print {
              html, body { width: 794px; height: 1123px; overflow: hidden; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body><div id="cv-print">${html}</div></body></html>
      `);
      win.document.close();
      setTimeout(() => { win.focus(); win.print(); }, 500);
    };
  
    return (
      <>
        {/* ── SEO: Meta tags ── */}
        <Helmet>
          <title>Free CV Maker & Resume Builder Online | ParkOS</title>
          <meta
            name="description"
            content="Create a professional CV or resume for free. Choose from multiple templates, fill your details and download as PDF instantly. No sign-up needed."
          />
          <meta
            name="keywords"
            content="free cv maker, free resume builder, cv template, resume template online, cv builder, free cv download, professional cv maker, resume maker India, cv maker Kerala, free resume Kerala"
          />
          <link rel="canonical" href="https://parkos.in/cv" />
  
          {/* Open Graph */}
          <meta property="og:title" content="Free CV Maker & Resume Builder | ParkOS" />
          <meta property="og:description" content="Build a professional CV for free. Multiple templates, instant PDF download. No sign-up required." />
          <meta property="og:url" content="https://parkos.in/cv" />
          <meta property="og:type" content="website" />
  
          {/* JSON-LD Schema */}
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Free CV Maker - ParkOS",
            "url": "https://parkos.in/cv",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR"
            },
            "description": "Free online CV maker and resume builder. Pick a template, fill your details, download as PDF.",
            "featureList": [
              "Multiple CV templates",
              "Instant PDF download",
              "No sign-up required",
              "Professional resume layouts"
            ]
          })}</script>
        </Helmet>
  
        <div style={{
          display: "flex",
          height: "100dvh",
          background: "#f3f4f6",
          fontFamily: "sans-serif",
          overflow: "hidden",
          flexDirection: "column",
        }}>
  
          {/* ── Hidden SEO text block (visible to crawlers, hidden from users) ── */}
          {/* 
            This is NOT cloaking — it's the same content Google would see 
            if it could render JS. Describes the page accurately.
          */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clip: "rect(0,0,0,0)",
              whiteSpace: "nowrap",
            }}
          >
            <h1>Free CV Maker and Resume Builder Online</h1>
            <p>
              ParkOS offers a free CV maker and resume builder. Create a professional
              CV online for free, choose from multiple resume templates, fill in your
              details and download your CV as a PDF instantly. No sign-up or
              registration required. Best free CV builder for job seekers in Kerala,
              Calicut, Kozhikode, and across India.
            </p>
            <ul>
              <li>Free CV templates</li>
              <li>Free resume builder online</li>
              <li>Download CV as PDF</li>
              <li>Professional resume maker</li>
              <li>CV maker Kerala</li>
              <li>Free resume builder India</li>
              <li>No sign-up CV maker</li>
            </ul>
          </div>
  
          {/* ── Header ── */}
          <header style={{
            background: "#fff",
            borderBottom: "1px solid #e5e7eb",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            gap: 8,
          }}>
            <button
              onClick={() => setShowLayoutPicker(v => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 12px", fontSize: 13, fontWeight: 500,
                color: "#374151", background: "#f9fafb",
                border: "1px solid #d1d5db", borderRadius: 8, cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              Layouts
            </button>
  
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button
                onClick={() => setShowEdit(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 12px", fontSize: 13, fontWeight: 500,
                  color: "#374151", background: "#fff",
                  border: "1px solid #d1d5db", borderRadius: 8, cursor: "pointer",
                }}
              >
                <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
                <span>Edit</span>
              </button>
              <button
                onClick={handleDownload}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", fontSize: 13, fontWeight: 600,
                  color: "#fff", background: "#111",
                  border: "none", borderRadius: 8, cursor: "pointer",
                }}
              >
                <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span>PDF</span>
              </button>
            </div>
          </header>
  
          {/* ── Layout Picker Dropdown ── */}
          {showLayoutPicker && (
            <>
              <div
                onClick={() => setShowLayoutPicker(false)}
                style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.2)" }}
              />
              <div style={{
                position: "fixed", top: 53, left: 0, right: 0, zIndex: 50,
                background: "#fff", borderBottom: "1px solid #e5e7eb",
                padding: "12px 16px",
                display: "flex", gap: 12, overflowX: "auto",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}>
                {LAYOUTS.map((layout) => (
                  <div
                    key={layout.id}
                    onClick={() => { setActiveLayout(layout.id); setShowLayoutPicker(false); }}
                    style={{ flexShrink: 0, cursor: "pointer" }}
                  >
                    <LayoutThumb layout={layout} cvData={defaultData} active={activeLayout === layout.id} onClick={() => {}} />
                  </div>
                ))}
              </div>
            </>
          )}
  
          {/* ── CV Preview ── */}
          <main style={{
            flex: 1, overflow: "auto", background: "#f3f4f6",
            display: "flex", justifyContent: "center",
            padding: "24px 12px", WebkitOverflowScrolling: "touch",
          }}>
            <div style={{ width: "min(794px, 100%)", display: "flex", justifyContent: "center" }}>
              <div
                style={{ width: 794, transformOrigin: "top center", transform: "scale(var(--cv-scale, 1))" }}
                ref={el => {
                  if (el) {
                    const parent = el.parentElement;
                    const scale = Math.min(1, parent.clientWidth / 794);
                    el.style.setProperty("--cv-scale", scale);
                    parent.style.height = `${1050 * scale}px`;
                  }
                }}
              >
                <div ref={previewRef} style={{ width: 794, minHeight: 1050, background: "#fff", boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>
                  <ActiveLayout d={hasRealData ? cvData : (cvData.name ? cvData : defaultData)} />
                </div>
              </div>
            </div>
          </main>
  
          {showEdit && (
            <EditModal
              data={cvData}
              onSave={(updated) => { setCvData(updated); setShowEdit(false); }}
              onClose={() => setShowEdit(false)}
            />
          )}
        </div>
      </>
    );
  }
  