import { useState, useEffect, useRef } from "react";

/* ─────────────────────────── DEMO DATA ─────────────────────────── */
const DEMO = {
  name: "Alex Smith",
  email: "alex@example.com",
  phone: "+1 (555) 234-5678",
  place: "San Francisco, CA",
  profilePhoto: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp",
  cv: "",
  about:
    "I craft fast, accessible, and beautiful web experiences. Passionate about clean code, thoughtful UI, and turning complex problems into elegant solutions that live at the intersection of design and engineering.",
  tagline: "Frontend Developer",
  qualification: "B.Sc. Computer Science",
  services: [
    { heading: "UI Development", description: "Pixel-perfect interfaces built with React, Tailwind, and modern CSS." },
    { heading: "Performance", description: "Lighthouse in the green. Lazy-loading, code-splitting, edge delivery." },
    { heading: "Design Systems", description: "Scalable component libraries with Storybook, tokens, Figma handoffs." },
    { heading: "API Integration", description: "REST & GraphQL wiring, caching strategies, real-time WebSocket features." },
  ],
  skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "GraphQL", "Figma", "Next.js", "PostgreSQL", "AWS", "Docker"],
  education: [
    { education: "B.Sc. Computer Science", institution: "Stanford University", year: 2018, percentage: "3.9 GPA" },
    { education: "High School Diploma", institution: "Lincoln High School", year: 2014, percentage: "95%" },
  ],
//   experience: [
//     { jobTitle: "Senior Frontend Engineer", company: "Stripe", startDate: "2021-06-01", endDate: null },
//     { jobTitle: "Frontend Developer", company: "Figma", startDate: "2019-02-01", endDate: "2021-05-31" },
//     { jobTitle: "Junior Developer", company: "Agency X", startDate: "2018-08-01", endDate: "2019-01-31" },
//   ],
  lookingVacancy: ["Senior Frontend Engineer", "Tech Lead", "UI Architect"],
};

/* ─────────────────────────── HELPERS ───────────────────────────── */
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Present";
const initials = (n = "") =>
  n.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ─────────────────────────── THEME ─────────────────────────────── */
const C = {
  bg: "#080808",
  surface: "#101010",
  border: "#1c1c1c",
  accent: "#f5a623",
  accentGlow: "rgba(245,166,35,0.10)",
  text: "#ede9e0",
  muted: "#555",
  sub: "#888",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');`;

const CSS = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: ${C.accent}; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:none; } }
  @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  .svc:hover { background: #141414 !important; }
  .exp-row:hover .exp-company { color: ${C.accent} !important; }
  .exp-row:hover .exp-dot { background: ${C.accent} !important; }
  .exp-row:hover { border-top-color: ${C.accent} !important; }
  .vac-tag:hover { border-color: ${C.accent} !important; color: ${C.accent} !important; }
  .ct-row:hover { background: #141414 !important; }
`;

/* ─────────────────────────── ATOMS ─────────────────────────────── */
function Label({ children }) {
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 10,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: C.accent,
    }}>
      {children}
    </span>
  );
}

function SectionHead({ children, sub }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} style={{
      marginBottom: 48,
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : "translateY(20px)",
      transition: "all .7s ease",
    }}>
      {sub && <Label>{sub}</Label>}
      <h2 style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(48px,7vw,96px)",
        color: C.text,
        lineHeight: 0.95,
        marginTop: sub ? 10 : 0,
      }}>
        {children}
      </h2>
    </div>
  );
}

function Reveal({ children, delay = 0 }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : "translateY(24px)",
      transition: `opacity .6s ${delay}s, transform .6s ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ─────────────────────────── HERO ──────────────────────────────── */
function Hero({ c }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 60); return () => clearTimeout(t); }, []);

  return (
    <section style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: "0 40px 64px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Grid bg */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,
        backgroundSize: "64px 64px",
        opacity: 0.5,
        pointerEvents: "none",
      }} />
      {/* Amber glow orb */}
      <div style={{
        position: "absolute", top: "18%", right: "12%",
        width: 360, height: 360, borderRadius: "50%",
        background: `radial-gradient(circle,${C.accentGlow} 0%,transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Navbar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "26px 40px",
        borderBottom: `1px solid ${C.border}`,
        backdropFilter: "blur(10px)",
        background: "rgba(8,8,8,.7)",
        zIndex: 10,
      }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: "0.15em", color: C.text }}>
          {c.name?.split(" ")[0]}<span style={{ color: C.accent }}>.</span>
        </div>
        {c.tagline && <Label>{c.tagline}</Label>}
      </div>

      {/* Profile photo or initials */}
      <div style={{
        position: "absolute", top: 90, right: 40,
        opacity: on ? 1 : 0,
        transition: "opacity 1.2s .3s",
      }}>
        {c.profilePhoto ? (
          <img src={c.profilePhoto} alt={c.name} style={{
            width: 210, height: 270,
            objectFit: "cover",
            filter: "grayscale(20%) contrast(1.1)",
            borderBottom: `3px solid ${C.accent}`,
          }} />
        ) : (
          <div style={{
            width: 180, height: 180,
            border: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 70, color: C.accent,
            background: C.surface,
          }}>
            {initials(c.name)}
          </div>
        )}
      </div>

      {/* Main text */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 860 }}>
        <div style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(12px)", transition: "all .7s .1s" }}>
          <Label>↗ Available for work</Label>
        </div>

        <h1 style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: "clamp(76px,13vw,168px)",
          lineHeight: 0.9,
          letterSpacing: "-0.01em",
          marginTop: 14,
          opacity: on ? 1 : 0,
          transform: on ? "none" : "translateY(32px)",
          transition: "all .9s .2s",
        }}>
          {c.name?.split(" ").map((word, i) => (
            <span key={i} style={{ display: "block", color: i === 1 ? C.accent : C.text }}>
              {word}
            </span>
          ))}
        </h1>

        {/* Meta row */}
        <div style={{
          marginTop: 28, display: "flex", gap: 28, flexWrap: "wrap",
          opacity: on ? 1 : 0, transition: "opacity .9s .45s",
        }}>
          {c.place && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: C.sub }}>📍 {c.place}</span>}
          {c.email && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: C.sub }}>✉ {c.email}</span>}
          {c.phone && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: C.sub }}>☎ {c.phone}</span>}
        </div>

        {c.about && (
          <p style={{
            marginTop: 26,
            maxWidth: 540,
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 19, lineHeight: 1.7,
            color: "#9a9082", fontStyle: "italic",
            opacity: on ? 1 : 0, transition: "opacity 1s .55s",
          }}>
            "{c.about}"
          </p>
        )}

        <div style={{
          marginTop: 36, display: "flex", gap: 14, flexWrap: "wrap",
          opacity: on ? 1 : 0, transition: "opacity 1s .65s",
        }}>
          {c.cv && (
            <a href={c.cv} download style={{
              padding: "13px 34px",
              background: C.accent, color: "#000",
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 18,
              letterSpacing: "0.1em", textDecoration: "none",
            }}>
              Download CV →
            </a>
          )}
          {c.email && (
            <a href={`mailto:${c.email}`} style={{
              padding: "13px 34px",
              border: `1px solid ${C.border}`, color: C.text,
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 18,
              letterSpacing: "0.1em", textDecoration: "none",
            }}>
              Contact
            </a>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 32, right: 40,
        fontFamily: "'JetBrains Mono',monospace", fontSize: 10,
        color: C.muted, letterSpacing: "0.2em",
        writingMode: "vertical-rl",
      }}>
        SCROLL ↓
      </div>
    </section>
  );
}

/* ─────────────────────────── SKILL TICKER ──────────────────────── */
function SkillTicker({ skills }) {
  if (!skills?.length) return null;
  const rep = [...skills, ...skills, ...skills, ...skills];
  return (
    <div style={{
      borderTop: `1px solid ${C.border}`,
      borderBottom: `1px solid ${C.border}`,
      padding: "14px 0",
      overflow: "hidden",
      background: C.accentGlow,
    }}>
      <div style={{
        display: "flex", gap: 52,
        animation: "ticker 20s linear infinite",
        whiteSpace: "nowrap",
      }}>
        {rep.map((s, i) => (
          <span key={i} style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 22, letterSpacing: "0.15em",
            color: i % 4 === 0 ? C.accent : C.muted,
          }}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── SERVICES ──────────────────────────── */
function Services({ services }) {
  if (!services?.length) return null;
  return (
    <section style={{ padding: "80px 40px" }}>
      <SectionHead sub={`Services / ${services.length} items`}>
        What I<br /><span style={{ color: C.accent }}>Do</span>
      </SectionHead>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))",
        gap: 1,
        background: C.border,
      }}>
        {services.map((s, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div className="svc" style={{
              background: C.surface, padding: "36px 30px",
              cursor: "default", transition: "background .25s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                <span style={{
                  fontFamily: "'Bebas Neue',sans-serif", fontSize: 13,
                  color: C.muted, letterSpacing: "0.1em",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div style={{ flex: 1, height: 1, background: C.accent }} />
              </div>
              {s.heading && (
                <h3 style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 26, fontWeight: 600,
                  color: C.text, marginBottom: 12,
                }}>
                  {s.heading}
                </h3>
              )}
              {s.description && (
                <p style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 11, lineHeight: 1.85, color: C.sub,
                }}>
                  {s.description}
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── EXPERIENCE ────────────────────────── */
function Experience({ experience }) {
  if (!experience?.length) return null;
  return (
    <section style={{ padding: "80px 40px" }}>
      <SectionHead sub={`${experience.length} positions`}>
        Experi<span style={{ color: C.accent }}>ence</span>
      </SectionHead>

      {experience.map((e, i) => (
        <Reveal key={i} delay={i * 0.09}>
          <div className="exp-row" style={{
            borderTop: `1px solid ${C.border}`,
            padding: "26px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            transition: "border-top-color .25s",
            cursor: "default",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div className="exp-dot" style={{
                width: 9, height: 9, borderRadius: "50%",
                background: C.muted, flexShrink: 0,
                transition: "background .25s",
              }} />
              <div>
                {e.jobTitle && (
                  <p style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 24, fontWeight: 600, color: C.text, marginBottom: 4,
                  }}>
                    {e.jobTitle}
                  </p>
                )}
                {e.company && (
                  <p className="exp-company" style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: 15, letterSpacing: "0.12em", color: C.muted,
                    transition: "color .25s",
                  }}>
                    {e.company}
                  </p>
                )}
              </div>
            </div>
            <span style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 11, color: C.sub, textAlign: "right",
            }}>
              {fmt(e.startDate)} → {fmt(e.endDate)}
            </span>
          </div>
        </Reveal>
      ))}
      <div style={{ height: 1, background: C.border }} />
    </section>
  );
}

/* ─────────────────────────── EDUCATION ─────────────────────────── */
function Education({ education }) {
  if (!education?.length) return null;
  return (
    <section style={{ padding: "80px 40px" }}>
      <SectionHead>
        Edu<span style={{ color: C.accent }}>cation</span>
      </SectionHead>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))",
        gap: 1,
        background: C.border,
      }}>
        {education.map((e, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div style={{ background: C.surface, padding: "32px 28px" }}>
              {e.year && (
                <span style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: 68, color: "rgba(245,166,35,.13)",
                  display: "block", lineHeight: 1,
                }}>
                  {e.year}
                </span>
              )}
              {e.education && (
                <h3 style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 22, fontWeight: 600,
                  color: C.text, marginTop: 8, marginBottom: 8,
                }}>
                  {e.education}
                </h3>
              )}
              {e.institution && (
                <p style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 11, color: C.accent, letterSpacing: "0.1em",
                }}>
                  {e.institution}
                </p>
              )}
              {e.percentage && (
                <p style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 11, color: C.sub, marginTop: 8,
                }}>
                  {e.percentage}
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── OPEN TO ───────────────────────────── */
function OpenTo({ lookingVacancy }) {
  if (!lookingVacancy?.length) return null;
  return (
    <section style={{ padding: "80px 40px", background: C.surface }}>
      <SectionHead sub="Open to opportunities">
        Looking<br /><span style={{ color: C.accent }}>For</span>
      </SectionHead>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {lookingVacancy.map((v, i) => (
          <Reveal key={i} delay={i * 0.07}>
            <span className="vac-tag" style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 20, fontWeight: 600, fontStyle: "italic",
              color: C.text,
              border: `1px solid ${C.border}`,
              padding: "10px 24px",
              display: "inline-block",
              transition: "all .25s", cursor: "default",
            }}>
              {v}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── CONTACT ───────────────────────────── */
function Contact({ c }) {
  const has = c.email || c.phone || c.place;
  if (!has) return null;

  const rows = [
    c.email && { label: "Email", value: c.email, href: `mailto:${c.email}` },
    c.phone && { label: "Phone", value: c.phone, href: `tel:${c.phone}` },
    c.place && { label: "Location", value: c.place, href: null },
  ].filter(Boolean);

  return (
    <section style={{ padding: "80px 40px", borderTop: `1px solid ${C.border}` }}>
      <SectionHead>
        Get in<br /><span style={{ color: C.accent }}>Touch</span>
      </SectionHead>

      <div style={{
        display: "flex", flexDirection: "column",
        gap: 1, background: C.border, maxWidth: 580,
      }}>
        {rows.map((r, i) => {
          const inner = (
            <div className="ct-row" style={{
              background: C.surface, padding: "24px 28px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              textDecoration: "none", color: "inherit",
              transition: "background .25s",
            }}>
              <Label>{r.label}</Label>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: C.text }}>
                {r.value}
              </span>
            </div>
          );
          return r.href
            ? <a key={i} href={r.href} style={{ textDecoration: "none" }}>{inner}</a>
            : <div key={i}>{inner}</div>;
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────── FOOTER ────────────────────────────── */
function Footer({ name }) {
  return (
    <footer style={{
      borderTop: `1px solid ${C.border}`,
      padding: "22px 40px",
      display: "flex", justifyContent: "space-between",
      alignItems: "center", flexWrap: "wrap", gap: 10,
    }}>
      <span style={{
        fontFamily: "'Bebas Neue',sans-serif",
        fontSize: 16, letterSpacing: "0.14em", color: C.muted,
      }}>
        {name}
      </span>
      <span style={{
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: 10, color: C.muted, letterSpacing: "0.1em",
      }}>
        © {new Date().getFullYear()} — ALL RIGHTS RESERVED
      </span>
    </footer>
  );
}

/* ─────────────────────────── ROOT ──────────────────────────────── */
/**
 * PersonalPortfolio
 *
 * Props:
 *   candidate – object matching the Mongoose candidateSchema.
 *               Any missing / empty field is gracefully hidden.
 *
 * Usage:
 *   <PersonalPortfolio candidate={candidateFromAPI} />
 *   <PersonalPortfolio />   // renders demo data
 */
export default function PersonalPortfolio2({ data}) {
  const c = data || DEMO
  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{CSS}</style>
      <Hero c={c} />
      <SkillTicker skills={c.skills} />
      <Services services={c.services} />
      <Experience experience={c.experience} />
      <Education education={c.education} />
      <OpenTo lookingVacancy={c.lookingVacancy} />
      <Contact c={c} />
      <Footer name={c.name} />
    </div>
  );
}