import { useState } from "react";

// ── Sample data matching the Mongoose schema ──────────────────────────────────
const DEMO_CANDIDATE =  {
  name: "Arjun Menon",
  firstName: "Arjun",
  lastName: "Menon",
  role: "Full‑Stack Engineer",
  tagline: "I build products people love.",
  about: "7+ years crafting digital experiences at the intersection of engineering and design. I turn complex problems into elegant, performant solutions — from pixel to production.",
  email: "arjun.menon@gmail.com",
  phone: "+91 98765 43210",
  place: "Kochi, Kerala",
  profilePhoto: "https://i.pravatar.cc/900?img=68",
  qualification: "B.Tech CS · NIT Calicut",
  cv: "/cv.pdf",
  skills: ["React","Node.js","TypeScript","MongoDB","GraphQL","Docker","AWS","Figma","Python","Redis","Next.js","PostgreSQL"],
  services: [
    { heading: "Product Engineering", description: "End-to-end web applications built with obsessive attention to performance, scalability, and maintainability." },
    { heading: "Interface Design", description: "Pixel-perfect interfaces that feel inevitable. Every micro-interaction earned, every animation purposeful." },
    { heading: "API Architecture", description: "REST & GraphQL APIs with clean domain logic, robust auth, and built-in room to grow." },
    { heading: "Cloud & DevOps", description: "Production infrastructure that just works — CI/CD, containers, AWS & GCP deployments." },
  ],
  experience: [
    { jobTitle: "Senior Frontend Engineer", company: "Infosys Ltd.", startDate: "2022-06-01", endDate: null },
    { jobTitle: "Full‑Stack Developer", company: "Zoho Corporation", startDate: "2019-08-01", endDate: "2022-05-31" },
    { jobTitle: "Junior Developer", company: "TCS", startDate: "2017-07-01", endDate: "2019-07-31" },
  ],
  education: [
    { education: "B.Tech — Computer Science", institution: "NIT Calicut", year: 2017, percentage: "8.7 CGPA" },
    { education: "Higher Secondary", institution: "St. Joseph's HSS", year: 2013, percentage: "94%" },
  ],
  projects: [
    { title: "DevBoard", description: "Real-time developer dashboard aggregating GitHub, Jira & Slack. Adopted by 3 product teams.", link: "#", year: "2024" },
    { title: "ShopSphere", description: "Multi-tenant e-commerce with live inventory sync and Stripe/Razorpay integration.", link: "#", year: "2023" },
    { title: "AIResume", description: "AI-powered resume scorer and rewriter optimised for ATS. 2,000+ users in month one.", link: "#", year: "2023" },
    { title: "NoteStack", description: "Collaborative markdown workspace with real-time sync and full version history.", link: null, year: "2022" },
  ],
  socials: [{ linkedin:"https://linkedin.com", github:"https://github.com", twitter:"https://twitter.com", website:"https://arjunmenon.dev" }],
  lookingVacancy: ["Full-Stack Engineer","Frontend Lead","Technical Co-founder"],
};

// ── Utility helpers ───────────────────────────────────────────────────────────
function fmt(dateStr) {
  if (!dateStr) return " ";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function initials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Avatar({ src, name, size = 180 }) {
  const [err, setErr] = useState(false);
  const style = {
    width: size,
    height: size,
    borderRadius: "50%",
    objectFit: "cover",
    display: "block",
  };

  if (src && !err) {
    return (
      <img src={src} alt={name} style={style} onError={() => setErr(true)} />
    );
  }
  return (
    <div
      style={{
        ...style,
        background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.32,
        fontWeight: 700,
        color: "#fff",
        letterSpacing: "-1px",
      }}
    >
      {initials(name)}
    </div>
  );
}

function NavLink({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "6px 4px",
        fontSize: 15,
        fontWeight: active ? 600 : 400,
        color: active ? "#1d4ed8" : "#374151",
        borderBottom: active ? "2px solid #1d4ed8" : "2px solid transparent",
        transition: "all .2s",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: "#111827",
          margin: 0,
          fontFamily: "'Playfair Display', Georgia, serif",
        }}
      >
        {children}
      </h2>
      <div
        style={{
          marginTop: 8,
          width: 44,
          height: 3,
          borderRadius: 2,
          background: "linear-gradient(90deg,#1d4ed8,#60a5fa)",
        }}
      />
    </div>
  );
}

function Pill({ label, blue }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "5px 14px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 500,
        background: blue ? "#eff6ff" : "#f3f4f6",
        color: blue ? "#1d4ed8" : "#374151",
        border: `1px solid ${blue ? "#bfdbfe" : "#e5e7eb"}`,
      }}
    >
      {label}
    </span>
  );
}

function TimelineDot() {
  return (
    <div
      style={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: "#1d4ed8",
        border: "2px solid #bfdbfe",
        flexShrink: 0,
        marginTop: 5,
      }}
    />
  );
}

// ── Section: Hero ─────────────────────────────────────────────────────────────
function HeroSection({ c }) {
  return (
    <section
      id="hero"
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 48,
        padding: "60px 0 72px",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          flexShrink: 0,
          background: "radial-gradient(circle at 50% 50%,#e0e7ff 0%,#f8fafc 70%)",
          borderRadius: "50%",
          padding: 12,
          boxShadow: "0 8px 40px rgba(30,64,175,.12)",
        }}
      >
        <Avatar src={c.profilePhoto} name={c.name} size={200} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 260 }}>
        {c.tagline && (
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 14,
              fontWeight: 500,
              color: "#6b7280",
              letterSpacing: ".06em",
              textTransform: "uppercase",
            }}
          >
            {c.tagline}
          </p>
        )}
        <h1
          style={{
            margin: "0 0 16px",
            fontSize: "clamp(32px,5vw,52px)",
            fontWeight: 800,
            color: "#111827",
            lineHeight: 1.1,
            fontFamily: "'Playfair Display', Georgia, serif",
          }}
        >
          {c.name}
        </h1>

        {c.about && (
          <p
            style={{
              margin: "0 0 28px",
              fontSize: 16,
              lineHeight: 1.7,
              color: "#4b5563",
              maxWidth: 520,
            }}
          >
            {c.about}
          </p>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {c.cv && (
            <a
              href={c.cv}
              download
              style={{
                padding: "11px 28px",
                borderRadius: 999,
                background: "#1d4ed8",
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                border: "2px solid #1d4ed8",
                transition: "all .2s",
              }}
            >
              Download CV
            </a>
          )}
          {c.email && (
            <a
              href={`mailto:${c.email}`}
              style={{
                padding: "11px 28px",
                borderRadius: 999,
                background: "transparent",
                color: "#374151",
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                border: "2px solid #d1d5db",
                transition: "all .2s",
              }}
            >
              Contact
            </a>
          )}
        </div>

        {/* Quick meta */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 24px",
          }}
        >
          {c.place && <Meta icon="📍" label={c.place} />}
          {c.phone && <Meta icon="📞" label={c.phone} />}
          {c.email && <Meta icon="✉️" label={c.email} />}
        </div>
      </div>
    </section>
  );
}

function Meta({ icon, label }) {
  return (
    <span style={{ fontSize: 14, color: "#6b7280", display: "flex", gap: 6, alignItems: "center" }}>
      <span>{icon}</span>
      {label}
    </span>
  );
}

// ── Section: Services ─────────────────────────────────────────────────────────
function ServicesSection({ services }) {
  if (!services?.length) return null;
  return (
    <section id="services" style={{ padding: "60px 0" }}>
      <SectionTitle>What I Do</SectionTitle>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
          gap: 20,
        }}
      >
        {services.map((s, i) => (
          <div
            key={i}
            style={{
              padding: 28,
              borderRadius: 16,
              background: "#fff",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 12px rgba(0,0,0,.04)",
              transition: "transform .2s, box-shadow .2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(29,78,216,.10)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,.04)";
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
                fontSize: 20,
              }}
            >
              {["💻", "⚡", "🎨", "🔗", "📦", "🛠"][i % 6]}
            </div>
            {s.heading && (
              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {s.heading}
              </h3>
            )}
            {s.description && (
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "#6b7280" }}>
                {s.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Section: Skills ───────────────────────────────────────────────────────────
function SkillsSection({ skills }) {
  if (!skills?.length) return null;
  return (
    <section id="skills" style={{ padding: "60px 0" }}>
      <SectionTitle>Skills</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {skills.map((s, i) => (
          <Pill key={i} label={s} blue />
        ))}
      </div>
    </section>
  );
}

// ── Section: Experience ───────────────────────────────────────────────────────
function ExperienceSection({ experience }) {
  if (!experience?.length) return null;
  return (
    <section id="experience" style={{ padding: "60px 0" }}>
      <SectionTitle>Experience</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {experience.map((exp, i) => (
          <div key={i} style={{ display: "flex", gap: 20, paddingBottom: 32, position: "relative" }}>
            {/* Timeline line */}
            {i < experience.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  left: 5,
                  top: 18,
                  bottom: 0,
                  width: 2,
                  background: "#e5e7eb",
                }}
              />
            )}
            <TimelineDot />
            <div
              style={{
                flex: 1,
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                padding: "20px 24px",
                boxShadow: "0 2px 8px rgba(0,0,0,.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                {exp.jobTitle && (
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>
                    {exp.jobTitle}
                  </h3>
                )}
                {/* <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#6b7280",
                    background: "#f3f4f6",
                    borderRadius: 999,
                    padding: "3px 12px",
                  }}
                >
                  {fmt(exp.startDate)} – {fmt(exp.endDate)}
                </span> */}
              </div>
              {exp.company && (
                <p style={{ margin: "6px 0 0", fontSize: 14, color: "#1d4ed8", fontWeight: 500 }}>
                  {exp.company}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Section: Education ────────────────────────────────────────────────────────
function EducationSection({ education }) {
  if (!education?.length) return null;
  return (
    <section id="education" style={{ padding: "60px 0" }}>
      <SectionTitle>Education</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {education.map((e, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 20,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              padding: "20px 24px",
              boxShadow: "0 2px 8px rgba(0,0,0,.03)",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              🎓
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                {e.education && (
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>
                    {e.education}
                  </h3>
                )}
                {e.year && (
                  <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{e.year}</span>
                )}
              </div>
              <div style={{ marginTop: 4, display: "flex", gap: 12, flexWrap: "wrap" }}>
                {e.institution && (
                  <span style={{ fontSize: 14, color: "#1d4ed8", fontWeight: 500 }}>
                    {e.institution}
                  </span>
                )}
                {e.percentage && (
                  <span style={{ fontSize: 13, color: "#6b7280" }}>{e.percentage}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Section: Looking For ──────────────────────────────────────────────────────
function VacancySection({ lookingVacancy }) {
  if (!lookingVacancy?.length) return null;
  return (
    <section id="vacancy" style={{ padding: "60px 0" }}>
      <SectionTitle>Open To</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {lookingVacancy.map((v, i) => (
          <Pill key={i} label={v} />
        ))}
      </div>
    </section>
  );
}

// ── Section: Contact ──────────────────────────────────────────────────────────
function ContactSection({ c }) {
  const hasAny = c.email || c.phone || c.place;
  if (!hasAny) return null;
  return (
    <section id="contact" style={{ padding: "60px 0" }}>
      <SectionTitle>Get In Touch</SectionTitle>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
          gap: 16,
        }}
      >
        {c.email && (
          <ContactCard icon="✉️" label="Email" value={c.email} href={`mailto:${c.email}`} />
        )}
        {c.phone && (
          <ContactCard icon="📞" label="Phone" value={c.phone} href={`tel:${c.phone}`} />
        )}
        {c.place && <ContactCard icon="📍" label="Location" value={c.place} />}
      </div>
    </section>
  );
}

function ContactCard({ icon, label, value, href }) {
  const Inner = (
    <div
      style={{
        padding: "22px 24px",
        borderRadius: 14,
        background: "#fff",
        border: "1px solid #e5e7eb",
        display: "flex",
        gap: 16,
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,.03)",
        textDecoration: "none",
        color: "inherit",
        transition: "transform .2s, box-shadow .2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(29,78,216,.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.03)";
      }}
    >
      <span style={{ fontSize: 26 }}>{icon}</span>
      <div>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".05em" }}>
          {label}
        </p>
        <p style={{ margin: "3px 0 0", fontSize: 14, fontWeight: 600, color: "#111827" }}>{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href}>{Inner}</a> : <div>{Inner}</div>;
}

// ── Divider ───────────────────────────────────────────────────────────────────
function Divider() {
  return <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: 0 }} />;
}

// ── Main component ────────────────────────────────────────────────────────────
/**
 * PersonalPortfolio
 *
 * Props:
 *   candidate – object matching the Mongoose candidateSchema
 *               (any field can be missing / empty; nothing will be rendered for it)
 *
 * Usage:
 *   <PersonalPortfolio candidate={candidateData} />
 */
export default function PersonalPortfolio({ data }) {
  const c = data ||DEMO_CANDIDATE;
  const [activeNav, setActiveNav] = useState("About");

  const navItems = [
    { label: "About",      show: true },
    { label: "Services",   show: c.services?.length > 0 },
    { label: "Skills",     show: c.skills?.length > 0 },
    { label: "Experience", show: c.experience?.length > 0 },
    { label: "Education",  show: c.education?.length > 0 },
    { label: "Open To",    show: c.lookingVacancy?.length > 0 },
    { label: "Contact",    show: c.email || c.phone || c.place },
  ].filter((n) => n.show);

  const scrollTo = (id) => {
    const el = document.getElementById(id.toLowerCase().replace(/ /g, "-"));
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setActiveNav(id);
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
        color: "#111827",
      }}
    >
      {/* Google Font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        a { color: inherit; }
      `}</style>

      {/* ── Navbar ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(248,250,252,.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#1d4ed8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: 16,
              }}
            >
              {initials(c.name)}
            </div>
            <span style={{ fontWeight: 700, fontSize: 17, color: "#111827" }}>
              {c.name?.split(" ")[0]}{" "}
              <span style={{ fontWeight: 400, color: "#6b7280" }}>
                {c.name?.split(" ").slice(1).join(" ")}
              </span>
            </span>
          </div>

          {/* Nav links */}
          <nav style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {navItems.map((n) => (
              <NavLink
                key={n.label}
                label={n.label}
                active={activeNav === n.label}
                onClick={() => scrollTo(n.label)}
              />
            ))}
          </nav>
        </div>
      </header>

      {/* ── Page body ── */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        <HeroSection c={c} />
        <Divider />
        <div id="services"><ServicesSection services={c.services} /></div>
        {c.services?.length > 0 && <Divider />}
        <div id="skills"><SkillsSection skills={c.skills} /></div>
        {c.skills?.length > 0 && <Divider />}
        <div id="experience"><ExperienceSection experience={c.experience} /></div>
        {c.experience?.length > 0 && <Divider />}
        <div id="education"><EducationSection education={c.education} /></div>
        {c.education?.length > 0 && <Divider />}
        <div id="open-to"><VacancySection lookingVacancy={c.lookingVacancy} /></div>
        {c.lookingVacancy?.length > 0 && <Divider />}
        <div id="contact"><ContactSection c={c} /></div>
      </main>
    </div>
  );
}