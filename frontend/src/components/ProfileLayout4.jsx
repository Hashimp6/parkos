import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────── DEMO DATA ─────────────────────────── */
const DEMO = {
  name: "Alex Smith",
  email: "alex@example.com",
  phone: "+1 (555) 234-5678",
  place: "San Francisco, CA",
  profilePhoto: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp",
  cv: "",
  about: "I craft fast, accessible, and beautiful web experiences. Passionate about clean code, thoughtful UI, and turning complex problems into elegant solutions at the intersection of design and engineering.",
  tagline: "Frontend Developer",
  qualification: "B.Sc. Computer Science",
  services: [
    { heading: "UI Development", description: "Pixel-perfect interfaces built with React, Tailwind, and modern CSS that feel alive." },
    { heading: "Performance", description: "Lighthouse in the green. Lazy-loading, code-splitting, edge delivery at scale." },
    { heading: "Design Systems", description: "Scalable component libraries with Storybook, tokens, and clean Figma handoffs." },
    { heading: "API Integration", description: "REST & GraphQL wiring, caching strategies, real-time WebSocket features." },
  ],
  skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "GraphQL", "Figma", "Next.js", "PostgreSQL", "AWS", "Docker"],
  education: [
    { education: "B.Sc. Computer Science", institution: "Stanford University", year: 2018, percentage: "3.9 GPA" },
    { education: "High School Diploma", institution: "Lincoln High School", year: 2014, percentage: "95%" },
  ],
  experience: [
    { jobTitle: "Senior Frontend Engineer", company: "Stripe", startDate: "2021-06-01", endDate: null },
    { jobTitle: "Frontend Developer", company: "Figma", startDate: "2019-02-01", endDate: "2021-05-31" },
    { jobTitle: "Junior Developer", company: "Agency X", startDate: "2018-08-01", endDate: "2019-01-31" },
  ],
  lookingVacancy: ["Senior Frontend Engineer", "Tech Lead", "UI Architect"],
};

/* ─────────────────────────── HELPERS ───────────────────────────── */
const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Present";

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function useMouse() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const fn = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return pos;
}

/* ─────────────────────────── THEME ─────────────────────────────── */
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=Space+Mono:wght@400;700&display=swap');
`;

const CSS = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #22d3ee, #a855f7); border-radius: 3px; }

  @keyframes float1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.05)} 66%{transform:translate(-20px,20px) scale(0.97)} }
  @keyframes float2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-50px,20px) scale(1.08)} 66%{transform:translate(30px,-40px) scale(0.95)} }
  @keyframes float3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,30px) scale(1.06)} }
  @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes pulse-ring { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2.4);opacity:0} }
  @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes bounce-dot { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes scan { 0%{top:0%} 100%{top:100%} }

  .glass {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.08);
  }
  .glass-hover:hover {
    background: rgba(255,255,255,0.07) !important;
    border-color: rgba(34,211,238,0.3) !important;
    transform: translateY(-3px);
  }
  .glass-hover { transition: all .3s ease !important; }

  .shimmer-text {
    background: linear-gradient(90deg, #22d3ee 0%, #a855f7 25%, #ec4899 50%, #a855f7 75%, #22d3ee 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  .nav-dot:hover { background: #22d3ee !important; transform: scale(1.3); }
  .nav-dot { transition: all .2s ease !important; }

  .skill-chip:hover { 
    border-color: #22d3ee !important; 
    color: #22d3ee !important;
    box-shadow: 0 0 20px rgba(34,211,238,0.3) !important;
    transform: translateY(-2px);
  }
  .skill-chip { transition: all .2s ease !important; }

  .exp-card:hover {
    border-color: rgba(168,85,247,0.4) !important;
    box-shadow: 0 8px 40px rgba(168,85,247,0.1) !important;
    transform: translateX(6px) !important;
  }
  .exp-card { transition: all .3s ease !important; }

  .svc-card:hover .svc-num { opacity: 1 !important; }
  .svc-card:hover { 
    border-color: rgba(34,211,238,0.25) !important;
    box-shadow: 0 0 40px rgba(34,211,238,0.06) !important;
  }

  .contact-btn:hover {
    background: linear-gradient(135deg, #22d3ee, #a855f7) !important;
    color: #000 !important;
    box-shadow: 0 0 40px rgba(34,211,238,0.4) !important;
    transform: translateY(-2px) !important;
  }
  .contact-btn { transition: all .3s ease !important; }
`;

/* ─────────────────────────── CURSOR ────────────────────────────── */
function Cursor() {
  const mouse = useMouse();
  const [trail, setTrail] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let raf;
    const tick = () => {
      setTrail(prev => ({
        x: prev.x + (mouse.x - prev.x) * 0.12,
        y: prev.y + (mouse.y - prev.y) * 0.12,
      }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mouse]);

  return (
    <>
      <div style={{
        position: "fixed", left: mouse.x - 4, top: mouse.y - 4,
        width: 8, height: 8, borderRadius: "50%",
        background: "#22d3ee",
        pointerEvents: "none", zIndex: 9999,
        boxShadow: "0 0 12px #22d3ee",
        transition: "transform .1s",
      }} />
      <div style={{
        position: "fixed", left: trail.x - 18, top: trail.y - 18,
        width: 36, height: 36, borderRadius: "50%",
        border: "1px solid rgba(34,211,238,0.4)",
        pointerEvents: "none", zIndex: 9998,
        transition: "width .2s, height .2s",
      }} />
    </>
  );
}

/* ─────────────────────────── AURORA BG ─────────────────────────── */
function AuroraBg() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* Deep background */}
      <div style={{ position: "absolute", inset: 0, background: "#050510" }} />
      {/* Noise texture overlay */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }}>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
      {/* Blob 1 - cyan */}
      <div style={{
        position: "absolute", top: "-20%", left: "-10%",
        width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(34,211,238,0.18) 0%, transparent 70%)",
        animation: "float1 18s ease-in-out infinite",
        filter: "blur(40px)",
      }} />
      {/* Blob 2 - violet */}
      <div style={{
        position: "absolute", top: "20%", right: "-15%",
        width: 800, height: 800, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)",
        animation: "float2 22s ease-in-out infinite",
        filter: "blur(50px)",
      }} />
      {/* Blob 3 - pink */}
      <div style={{
        position: "absolute", bottom: "-10%", left: "30%",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)",
        animation: "float3 16s ease-in-out infinite",
        filter: "blur(60px)",
      }} />
      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />
    </div>
  );
}

/* ─────────────────────────── ATOMS ─────────────────────────────── */
function Tag({ children }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 12px",
      background: "rgba(34,211,238,0.08)",
      border: "1px solid rgba(34,211,238,0.2)",
      borderRadius: 100,
      fontFamily: "'Space Mono', monospace",
      fontSize: 10, color: "#22d3ee",
      letterSpacing: "0.1em",
    }}>
      <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#22d3ee", animation: "bounce-dot 1.5s ease-in-out infinite" }} />
      {children}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <div style={{ width: 24, height: 1, background: "linear-gradient(to right, #22d3ee, transparent)" }} />
      <span style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 10, letterSpacing: "0.2em",
        textTransform: "uppercase", color: "#22d3ee",
      }}>
        {children}
      </span>
    </div>
  );
}

function Reveal({ children, delay = 0, direction = "up" }) {
  const [ref, vis] = useInView();
  const transforms = { up: "translateY(30px)", left: "translateX(-24px)", right: "translateX(24px)", scale: "scale(0.94)" };
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : (transforms[direction] || "translateY(30px)"),
      transition: `opacity .7s ${delay}s cubic-bezier(0.22,1,0.36,1), transform .7s ${delay}s cubic-bezier(0.22,1,0.36,1)`,
    }}>
      {children}
    </div>
  );
}

/* ─────────────────────────── NAV ───────────────────────────────── */
function Nav({ c }) {
  const [active, setActive] = useState(0);
  const sections = ["Home", "Services", "Experience", "Education", "Contact"];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 48px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 68,
      background: "rgba(5,5,16,0.7)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      {/* Logo */}
      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800, fontSize: 18,
        color: "#fff", letterSpacing: "-0.02em",
      }}>
        {c.name?.split(" ")[0]}
        <span className="shimmer-text">.</span>
      </div>

      {/* Dot nav */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {sections.map((s, i) => (
          <div key={i} title={s} className="nav-dot" onClick={() => setActive(i)} style={{
            width: active === i ? 24 : 6,
            height: 6, borderRadius: 3,
            background: active === i
              ? "linear-gradient(to right, #22d3ee, #a855f7)"
              : "rgba(255,255,255,0.2)",
            cursor: "pointer",
            transition: "width .3s ease, background .3s ease",
          }} />
        ))}
      </div>

      {c.tagline && (
        <Tag>{c.tagline}</Tag>
      )}
    </nav>
  );
}

/* ─────────────────────────── HERO ──────────────────────────────── */
function Hero({ c }) {
  const [on, setOn] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => { setTimeout(() => setOn(true), 100); }, []);
  useEffect(() => {
    if (!on) return;
    const t = setInterval(() => setCount(p => p < (c.experience?.length || 3) * 1 + 2 ? p + 1 : p), 150);
    return () => clearInterval(t);
  }, [on]);

  return (
    <section style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center",
      textAlign: "center",
      padding: "120px 40px 80px",
      position: "relative", zIndex: 1,
    }}>
      {/* Glowing ring behind photo */}
      <div style={{
        position: "relative",
        marginBottom: 40,
        opacity: on ? 1 : 0,
        transition: "opacity 1s .2s",
      }}>
        {/* Pulsing rings */}
        {[0, 1].map(i => (
          <div key={i} style={{
            position: "absolute",
            inset: -20 - i * 20,
            borderRadius: "50%",
            border: "1px solid rgba(34,211,238,0.2)",
            animation: `pulse-ring ${2 + i * 0.8}s ease-out ${i * 0.4}s infinite`,
          }} />
        ))}
        {/* Spinning dashed ring */}
        <div style={{
          position: "absolute", inset: -14,
          borderRadius: "50%",
          border: "1px dashed rgba(168,85,247,0.4)",
          animation: "spin-slow 12s linear infinite",
        }} />
        {/* Photo */}
        {c.profilePhoto ? (
          <img src={c.profilePhoto} alt={c.name} style={{
            width: 130, height: 130,
            borderRadius: "50%",
            objectFit: "cover", objectPosition: "top",
            border: "2px solid rgba(34,211,238,0.3)",
            boxShadow: "0 0 60px rgba(34,211,238,0.2), 0 0 120px rgba(168,85,247,0.1)",
          }} />
        ) : (
          <div style={{
            width: 130, height: 130, borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(34,211,238,0.2), rgba(168,85,247,0.2))",
            border: "2px solid rgba(34,211,238,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 40, color: "#22d3ee",
          }}>
            {c.name?.split(" ").map(w => w[0]).join("")}
          </div>
        )}
        {/* Online indicator */}
        <div style={{
          position: "absolute", bottom: 8, right: 8,
          width: 14, height: 14, borderRadius: "50%",
          background: "#22c55e",
          border: "2px solid #050510",
          boxShadow: "0 0 10px #22c55e",
        }} />
      </div>

      {/* Available badge */}
      <div style={{
        opacity: on ? 1 : 0,
        transform: on ? "none" : "translateY(-10px)",
        transition: "all .6s .35s",
        marginBottom: 24,
      }}>
        <Tag>Available for work</Tag>
      </div>

      {/* Name */}
      <div style={{
        opacity: on ? 1 : 0,
        transform: on ? "none" : "translateY(20px)",
        transition: "all .8s .45s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(52px, 10vw, 130px)",
          lineHeight: 0.95, letterSpacing: "-0.04em",
          color: "#fff",
          marginBottom: 4,
        }}>
          {c.name?.split(" ").map((word, i) => (
            <span key={i} style={{ display: "block" }}>
              {i === 1 ? <span className="shimmer-text">{word}</span> : word}
            </span>
          ))}
        </h1>
      </div>

      {/* Tagline */}
      {c.tagline && (
        <div style={{
          opacity: on ? 1 : 0,
          transition: "opacity .8s .6s",
          marginTop: 16, marginBottom: 20,
        }}>
          <span style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic", fontSize: 20,
            color: "rgba(255,255,255,0.4)",
          }}>
            {c.tagline}
          </span>
        </div>
      )}

      {/* About */}
      {c.about && (
        <p style={{
          maxWidth: 560,
          fontFamily: "'Syne', sans-serif",
          fontWeight: 400, fontSize: 16,
          lineHeight: 1.8,
          color: "rgba(255,255,255,0.45)",
          marginBottom: 36,
          opacity: on ? 1 : 0,
          transition: "opacity .8s .7s",
        }}>
          {c.about}
        </p>
      )}

      {/* Stats row */}
      <div style={{
        display: "flex", gap: 40, justifyContent: "center",
        marginBottom: 40,
        opacity: on ? 1 : 0,
        transition: "opacity .8s .8s",
      }}>
        {[
          { num: `${(c.experience?.length || 3) + 2}+`, label: "Years Exp" },
          { num: `${c.skills?.length || 10}+`, label: "Skills" },
          { num: `${c.experience?.length || 3}`, label: "Companies" },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800, fontSize: 32,
              background: "linear-gradient(135deg, #22d3ee, #a855f7)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              {stat.num}
            </div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9, color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.15em", textTransform: "uppercase",
              marginTop: 2,
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div style={{
        display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap",
        opacity: on ? 1 : 0,
        transition: "opacity .8s .9s",
      }}>
        {c.email && (
          <a href={`mailto:${c.email}`} className="contact-btn" style={{
            padding: "14px 36px",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 100,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600, fontSize: 14,
            color: "#fff", textDecoration: "none",
            background: "rgba(255,255,255,0.05)",
            cursor: "pointer",
          }}>
            Let's Talk →
          </a>
        )}
        {c.cv && (
          <a href={c.cv} download style={{
            padding: "14px 36px",
            background: "linear-gradient(135deg, #22d3ee, #a855f7)",
            borderRadius: 100,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600, fontSize: 14,
            color: "#000", textDecoration: "none",
            boxShadow: "0 0 40px rgba(34,211,238,0.3)",
          }}>
            Download CV
          </a>
        )}
      </div>

      {/* Scroll cue */}
      <div style={{
        position: "absolute", bottom: 32,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        opacity: on ? 0.4 : 0,
        transition: "opacity 1s 1.2s",
      }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#fff", letterSpacing: "0.2em" }}>SCROLL</span>
        <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #22d3ee, transparent)" }} />
      </div>
    </section>
  );
}

/* ─────────────────────────── SKILLS STRIP ──────────────────────── */
function SkillsStrip({ skills }) {
  if (!skills?.length) return null;
  return (
    <section style={{ padding: "60px 48px", position: "relative", zIndex: 1 }}>
      <Reveal>
        <SectionLabel>Tech Stack</SectionLabel>
      </Reveal>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
        {skills.map((s, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <span className="skill-chip glass" style={{
              padding: "8px 20px", borderRadius: 100,
              fontFamily: "'Space Mono', monospace",
              fontSize: 11, color: "rgba(255,255,255,0.6)",
              cursor: "default", letterSpacing: "0.05em",
            }}>
              {s}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── SERVICES ──────────────────────────── */
function Services({ services }) {
  if (!services?.length) return null;
  return (
    <section id="services" style={{ padding: "80px 48px", position: "relative", zIndex: 1 }}>
      <Reveal>
        <SectionLabel>What I Do</SectionLabel>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800, fontSize: "clamp(36px,5vw,72px)",
          color: "#fff", letterSpacing: "-0.03em", lineHeight: 1,
          marginBottom: 48,
        }}>
          My <span className="shimmer-text">Services</span>
        </h2>
      </Reveal>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 16,
      }}>
        {services.map((s, i) => (
          <Reveal key={i} delay={i * 0.1} direction="scale">
            <div className="svc-card glass glass-hover" style={{
              padding: "36px 32px",
              borderRadius: 20,
              cursor: "default",
              position: "relative", overflow: "hidden",
            }}>
              {/* BG gradient accent */}
              <div style={{
                position: "absolute", top: -40, right: -40,
                width: 120, height: 120, borderRadius: "50%",
                background: `radial-gradient(circle, ${["rgba(34,211,238,0.08)", "rgba(168,85,247,0.08)", "rgba(236,72,153,0.08)", "rgba(34,211,238,0.06)"][i % 4]} 0%, transparent 70%)`,
              }} />
              <div className="svc-num" style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11, color: "#22d3ee",
                letterSpacing: "0.1em", marginBottom: 20,
                opacity: 0.5, transition: "opacity .3s",
              }}>
                {String(i + 1).padStart(2, "0")} /
              </div>
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700, fontSize: 20,
                color: "#fff", marginBottom: 12,
              }}>
                {s.heading}
              </h3>
              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 400, fontSize: 14,
                lineHeight: 1.75, color: "rgba(255,255,255,0.4)",
              }}>
                {s.description}
              </p>
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
    <section id="experience" style={{ padding: "80px 48px", position: "relative", zIndex: 1 }}>
      <Reveal>
        <SectionLabel>Career Path</SectionLabel>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800, fontSize: "clamp(36px,5vw,72px)",
          color: "#fff", letterSpacing: "-0.03em", lineHeight: 1,
          marginBottom: 48,
        }}>
          Work <span className="shimmer-text">History</span>
        </h2>
      </Reveal>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 760 }}>
        {experience.map((e, i) => (
          <Reveal key={i} delay={i * 0.1} direction="left">
            <div className="exp-card glass" style={{
              padding: "28px 32px",
              borderRadius: 16,
              display: "flex", justifyContent: "space-between",
              alignItems: "center", flexWrap: "wrap", gap: 16,
              cursor: "default",
              borderLeft: `3px solid ${["#22d3ee", "#a855f7", "#ec4899"][i % 3]}`,
            }}>
              <div>
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700, fontSize: 18,
                  color: "#fff", marginBottom: 4,
                }}>
                  {e.jobTitle}
                </p>
                <p style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11, letterSpacing: "0.08em",
                  color: ["#22d3ee", "#a855f7", "#ec4899"][i % 3],
                }}>
                  @ {e.company}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11, color: "rgba(255,255,255,0.3)",
                  display: "block",
                }}>
                  {fmt(e.startDate)} → {fmt(e.endDate)}
                </span>
                {!e.endDate && (
                  <span style={{
                    display: "inline-block",
                    marginTop: 6,
                    padding: "2px 10px", borderRadius: 100,
                    background: "rgba(34,197,94,0.15)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 9, color: "#22c55e",
                    letterSpacing: "0.1em",
                  }}>
                    CURRENT
                  </span>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── EDUCATION ─────────────────────────── */
function Education({ education }) {
  if (!education?.length) return null;
  return (
    <section id="education" style={{ padding: "80px 48px", position: "relative", zIndex: 1 }}>
      <Reveal>
        <SectionLabel>Academic Background</SectionLabel>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800, fontSize: "clamp(36px,5vw,72px)",
          color: "#fff", letterSpacing: "-0.03em", lineHeight: 1,
          marginBottom: 48,
        }}>
          Edu<span className="shimmer-text">cation</span>
        </h2>
      </Reveal>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 16,
      }}>
        {education.map((e, i) => (
          <Reveal key={i} delay={i * 0.12} direction="scale">
            <div className="glass glass-hover" style={{
              padding: "36px 32px",
              borderRadius: 20,
              cursor: "default",
              position: "relative", overflow: "hidden",
            }}>
              {/* Ghost year */}
              <div style={{
                position: "absolute", bottom: -16, right: -8,
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800, fontSize: 100,
                color: "rgba(255,255,255,0.025)",
                lineHeight: 1, userSelect: "none", pointerEvents: "none",
                letterSpacing: "-0.04em",
              }}>
                {e.year}
              </div>
              {/* Year badge */}
              <div style={{
                display: "inline-block",
                padding: "4px 14px", borderRadius: 100,
                background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(168,85,247,0.15))",
                border: "1px solid rgba(34,211,238,0.2)",
                fontFamily: "'Space Mono', monospace",
                fontSize: 10, color: "#22d3ee",
                marginBottom: 20,
              }}>
                {e.year}
              </div>
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700, fontSize: 18,
                color: "#fff", marginBottom: 8,
              }}>
                {e.education}
              </h3>
              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 13, color: "rgba(255,255,255,0.4)",
                marginBottom: 12,
              }}>
                {e.institution}
              </p>
              {e.percentage && (
                <p style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  background: "linear-gradient(135deg, #22d3ee, #a855f7)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 700,
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
    <section style={{ padding: "80px 48px", position: "relative", zIndex: 1 }}>
      <Reveal>
        <SectionLabel>Open Roles</SectionLabel>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800, fontSize: "clamp(36px,5vw,72px)",
          color: "#fff", letterSpacing: "-0.03em", lineHeight: 1,
          marginBottom: 40,
        }}>
          Looking <span className="shimmer-text">For</span>
        </h2>
      </Reveal>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {lookingVacancy.map((v, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div style={{
              padding: "16px 32px",
              borderRadius: 100,
              background: i === 0
                ? "linear-gradient(135deg, #22d3ee, #a855f7)"
                : "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600, fontSize: 16,
              color: i === 0 ? "#000" : "rgba(255,255,255,0.7)",
              cursor: "default",
              boxShadow: i === 0 ? "0 0 40px rgba(34,211,238,0.25)" : "none",
            }}>
              {v}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── CONTACT ───────────────────────────── */
function Contact({ c }) {
  const rows = [
    c.email && { label: "Email", value: c.email, icon: "✉", href: `mailto:${c.email}` },
    c.phone && { label: "Phone", value: c.phone, icon: "☎", href: `tel:${c.phone}` },
    c.place && { label: "Location", value: c.place, icon: "📍", href: null },
  ].filter(Boolean);
  if (!rows.length) return null;

  return (
    <section id="contact" style={{ padding: "80px 48px", position: "relative", zIndex: 1 }}>
      <Reveal>
        <SectionLabel>Contact</SectionLabel>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800, fontSize: "clamp(36px,5vw,72px)",
          color: "#fff", letterSpacing: "-0.03em", lineHeight: 1,
          marginBottom: 16,
        }}>
          Let's <span className="shimmer-text">Connect</span>
        </h2>
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 16, color: "rgba(255,255,255,0.35)",
          marginBottom: 48, maxWidth: 400,
        }}>
          Open to new roles, collaborations, and interesting conversations.
        </p>
      </Reveal>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 560 }}>
        {rows.map((r, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div
              className="glass glass-hover"
              onClick={() => r.href && window.open(r.href)}
              style={{
                padding: "22px 28px",
                borderRadius: 14,
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                cursor: r.href ? "pointer" : "default",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 18 }}>{r.icon}</span>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10, letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
                }}>
                  {r.label}
                </span>
              </div>
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 500, fontSize: 15,
                color: "rgba(255,255,255,0.7)",
              }}>
                {r.value}
              </span>
            </div>
          </Reveal>
        ))}
      </div>

      {c.email && (
        <Reveal delay={0.4}>
          <a href={`mailto:${c.email}`} className="contact-btn" style={{
            display: "inline-block",
            marginTop: 32,
            padding: "16px 48px",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 100,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600, fontSize: 15,
            color: "#fff", textDecoration: "none",
            background: "rgba(255,255,255,0.04)",
          }}>
            Send me an email →
          </a>
        </Reveal>
      )}
    </section>
  );
}

/* ─────────────────────────── FOOTER ────────────────────────────── */
function Footer({ name }) {
  return (
    <footer style={{
      position: "relative", zIndex: 1,
      padding: "28px 48px",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      display: "flex", justifyContent: "space-between",
      alignItems: "center", flexWrap: "wrap", gap: 12,
      background: "rgba(5,5,16,0.6)",
      backdropFilter: "blur(20px)",
    }}>
      <span style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 700, fontSize: 14,
        color: "rgba(255,255,255,0.3)",
      }}>
        {name}
      </span>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {["#22d3ee", "#a855f7", "#ec4899"].map((c, i) => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: c, opacity: 0.6 }} />
        ))}
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 9, color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.12em", marginLeft: 4,
        }}>
          © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}

/* ─────────────────────────── ROOT ──────────────────────────────── */
export default function PersonalPortfolio4({ candidate = DEMO }) {
  const c = candidate;
  return (
    <div style={{ background: "#050510", color: "#fff", minHeight: "100vh", overflowX: "hidden", cursor: "none" }}>
      <style>{CSS}</style>
      <AuroraBg />
      <Cursor />
      <Nav c={c} />
      <Hero c={c} />
      <SkillsStrip skills={c.skills} />
      <Services services={c.services} />
      <Experience experience={c.experience} />
      <Education education={c.education} />
      <OpenTo lookingVacancy={c.lookingVacancy} />
      <Contact c={c} />
      <Footer name={c.name} />
    </div>
  );
}