import { useState, useEffect, useRef } from "react";

// ── Palette from screenshot ──────────────────────────────────────────────────
const C = {
  gold:      "#B08401",
  rose:      "#D49E8D",
  sand:      "#DED1BD",
  cream:     "#FAF6F2",
  brown:     "#683B2B",
  offWhite:  "#F5EFE8",
  darkBrown: "#3A1F14",
  text:      "#3A2A1E",
  muted:     "#9A8070",
};

// ── Sample company data (mirrors schema) ─────────────────────────────────────
const COMPANY = {
  companyName: "NovaTech Solutions",
  tagline: "Engineering Tomorrow, Today.",
  about:
    "We are a forward-thinking technology firm specialising in full-stack software engineering, cloud infrastructure, and AI-driven product development. Founded on the belief that great software transforms lives, we partner with startups and enterprises alike to build products that scale.",
  industry: "Software & Technology",
  companySize: "51–200",
  foundedYear: 2018,
  businessPark: "Infopark",
  logo: "",        // ← set your logo URL here
  banner: "",      // ← set your cover/banner URL here
  website: "https://novatech.io",
  address: {
    building: "Block C, 4th Floor",
    street: "Infopark Phase 1",
    place: "Kakkanad, Kochi, Kerala",
  },
  tags: ["React", "Node.js", "Cloud", "AI/ML", "DevOps"],
  contacts: {
    email: "hello@novatech.io",
    phone: "+91 98765 43210",
    linkedin: "https://linkedin.com/company/novatech",
    instagram: "https://instagram.com/novatech",
    twitter: "https://twitter.com/novatech",
    whatsapp: "+919876543210",
    facebook: "",
    youtube: "",
  },
  members: [
    { name: "Arjun Menon",     position: "CEO & Co-founder", image: "", url: "" },
    { name: "Priya Nair",      position: "CTO",              image: "", url: "" },
    { name: "Rahul Krishnan",  position: "Lead Designer",    image: "", url: "" },
    { name: "Sneha Thomas",    position: "Product Manager",  image: "", url: "" },
  ],
  services: [
    { title: "Full-Stack Development", description: "End-to-end web and mobile applications using React, Next.js, Node, and Go." },
    { title: "Cloud Infrastructure",   description: "AWS, GCP & Azure architecture, CI/CD pipelines, and 24×7 DevOps support." },
    { title: "AI & Machine Learning",  description: "Custom model training, NLP, computer vision, and LLM integration." },
    { title: "UX / Product Design",    description: "Research-driven design systems, high-fidelity prototypes, and brand identity." },
  ],
  projects: [
    { name: "HealthSync",  description: "HIPAA-compliant telemedicine platform serving 200k+ patients across South Asia.", link: "https://healthsync.io" },
    { name: "LogiFlow",    description: "Real-time supply-chain visibility dashboard with ML demand forecasting.", link: "" },
    { name: "EduPulse",    description: "Adaptive learning platform deployed in 300+ schools using spaced-repetition AI.", link: "https://edupulse.in" },
  ],
  clients: [
    { name: "Tata Consultancy", logo: "", website: "" },
    { name: "Infosys BPM",      logo: "", website: "" },
    { name: "UST Global",       logo: "", website: "" },
    { name: "IBS Software",     logo: "", website: "" },
    { name: "Fingent",          logo: "", website: "" },
  ],
  gallery: [],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const has = (v) => {
  if (!v) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") return Object.values(v).some(Boolean);
  return true;
};
const initials = (n) => n.split(" ").slice(0,2).map(w => w[0]).join("").toUpperCase();

// ── Shared typography ─────────────────────────────────────────────────────────
const displayFont = "'DM Serif Display', serif";
const bodyFont    = "'Jost', sans-serif";

// ── NavBar ────────────────────────────────────────────────────────────────────
function NavBar({ company }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["About", "Services", "Projects", "Team", "Contact"];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 3rem",
      height: 72,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(250,246,242,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.sand}` : "none",
      transition: "all 0.4s ease",
    }}>
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {company.logo ? (
          <img src={company.logo} alt="logo" style={{ height: 36, objectFit: "contain" }} />
        ) : (
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.gold}, ${C.brown})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: displayFont,
          }}>
            {company.companyName.slice(0,2).toUpperCase()}
          </div>
        )}
        <span style={{ fontFamily: displayFont, fontSize: 18, color: C.text, letterSpacing: "0.01em" }}>
          {company.companyName}
        </span>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "2.5rem" }}>
        {links.map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{
            fontFamily: bodyFont, fontSize: 12, letterSpacing: "0.14em",
            textTransform: "uppercase", color: C.muted, textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => e.target.style.color = C.gold}
          onMouseLeave={e => e.target.style.color = C.muted}>
            {l}
          </a>
        ))}
      </div>

      {/* CTA */}
      {has(company.contacts?.email) && (
        <a href={`mailto:${company.contacts.email}`} style={{
          fontFamily: bodyFont, fontSize: 12, letterSpacing: "0.12em",
          textTransform: "uppercase", color: C.cream, background: C.brown,
          padding: "10px 24px", borderRadius: 2, textDecoration: "none",
          transition: "background 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = C.gold}
        onMouseLeave={e => e.currentTarget.style.background = C.brown}>
          Work With Us
        </a>
      )}
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ company }) {
  return (
    <section id="hero" style={{
      minHeight: "100vh",
      background: company.banner
        ? `linear-gradient(to bottom, rgba(250,246,242,0.15) 0%, rgba(250,246,242,0.85) 60%, ${C.cream} 100%), url(${company.banner}) center/cover no-repeat`
        : `linear-gradient(150deg, ${C.cream} 0%, ${C.offWhite} 40%, #EDE3D6 100%)`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      padding: "0 2rem",
    }}>
      {/* Decorative geometric shapes */}
      <DecorShapes />

      {/* Big initial letter watermark */}
      <div style={{
        position: "absolute",
        fontSize: "clamp(14rem, 30vw, 28rem)",
        fontFamily: displayFont,
        color: "rgba(176,132,1,0.06)",
        lineHeight: 1,
        userSelect: "none",
        pointerEvents: "none",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        letterSpacing: "-0.05em",
      }}>
        {company.companyName[0]}
      </div>

      {/* Logo if available */}
      {company.logo && (
        <img src={company.logo} alt="logo" style={{
          height: 64, objectFit: "contain", marginBottom: 32,
          position: "relative", zIndex: 2,
        }} />
      )}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 720 }}>
        {/* Eyebrow */}
        {has(company.businessPark) && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            marginBottom: 28,
          }}>
            <div style={{ width: 24, height: 1, background: C.gold }} />
            <span style={{
              fontFamily: bodyFont, fontSize: 11, letterSpacing: "0.22em",
              textTransform: "uppercase", color: C.gold,
            }}>
              {company.businessPark} · Est. {company.foundedYear}
            </span>
            <div style={{ width: 24, height: 1, background: C.gold }} />
          </div>
        )}

        <h1 style={{
          fontFamily: displayFont,
          fontSize: "clamp(3rem, 7vw, 6.5rem)",
          color: C.text,
          lineHeight: 1.05,
          margin: "0 0 20px",
          letterSpacing: "-0.02em",
          animation: "fadeUp 0.9s ease both",
        }}>
          {company.companyName}
        </h1>

        {has(company.tagline) && (
          <p style={{
            fontFamily: displayFont,
            fontStyle: "italic",
            fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
            color: C.rose,
            marginBottom: 36,
            animation: "fadeUp 0.9s 0.15s ease both",
          }}>
            {company.tagline}
          </p>
        )}

        {/* Tags */}
        {has(company.tags) && (
          <div style={{
            display: "flex", flexWrap: "wrap", justifyContent: "center",
            gap: 8, marginBottom: 48,
            animation: "fadeUp 0.9s 0.3s ease both",
          }}>
            {company.tags.map(t => (
              <span key={t} style={{
                fontFamily: bodyFont, fontSize: 11, letterSpacing: "0.1em",
                textTransform: "uppercase",
                border: `1px solid ${C.sand}`,
                color: C.muted, padding: "5px 14px", borderRadius: 1,
                background: "rgba(255,255,255,0.5)",
              }}>{t}</span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap",
          animation: "fadeUp 0.9s 0.45s ease both",
        }}>
          {company.foundedYear && <HeroStat label="Est." val={company.foundedYear} />}
          {company.companySize && <HeroStat label="Team" val={company.companySize} />}
          {company.services?.length > 0 && <HeroStat label="Services" val={`${company.services.length}+`} />}
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        animation: "fadeUp 1.2s 0.8s ease both",
      }}>
        <span style={{ fontFamily: bodyFont, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted }}>
          Scroll
        </span>
        <div style={{ width: 1, height: 48, background: `linear-gradient(to bottom, ${C.sand}, transparent)` }} />
      </div>
    </section>
  );
}

function HeroStat({ label, val }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: displayFont, fontSize: "2rem", color: C.text, lineHeight: 1 }}>{val}</div>
      <div style={{ fontFamily: bodyFont, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, marginTop: 4 }}>{label}</div>
    </div>
  );
}

function DecorShapes() {
  const shapes = [
    { top: "12%", left: "8%",  size: 16, color: C.brown,  shape: "circle" },
    { top: "20%", left: "80%", size: 10, color: C.rose,   shape: "circle" },
    { top: "68%", left: "85%", size: 28, color: C.sand,   shape: "circle" },
    { top: "75%", left: "10%", size: 18, color: C.gold,   shape: "circle" },
    { top: "30%", left: "15%", size: 40, color: C.rose,   shape: "rect", rotate: 20 },
    { top: "55%", left: "75%", size: 30, color: C.sand,   shape: "rect", rotate: -15 },
  ];
  return (
    <>
      {shapes.map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          top: s.top, left: s.left,
          width: s.size, height: s.size,
          borderRadius: s.shape === "circle" ? "50%" : 3,
          background: s.shape === "circle" ? s.color : "transparent",
          border: s.shape === "rect" ? `2px solid ${s.color}` : "none",
          transform: `rotate(${s.rotate || 0}deg)`,
          opacity: 0.55,
          animation: `float${i % 3} ${5 + i}s ease-in-out infinite alternate`,
          pointerEvents: "none",
        }} />
      ))}
    </>
  );
}

// ── Section primitives ────────────────────────────────────────────────────────
function SecLabel({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <div style={{ width: 28, height: 1, background: C.gold }} />
      <span style={{ fontFamily: bodyFont, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: C.gold }}>
        {text}
      </span>
    </div>
  );
}
function SecTitle({ children, center }) {
  return (
    <h2 style={{
      fontFamily: displayFont,
      fontSize: "clamp(2rem, 4vw, 3.2rem)",
      color: C.text,
      lineHeight: 1.1,
      marginBottom: 48,
      textAlign: center ? "center" : "left",
      letterSpacing: "-0.02em",
    }}>
      {children}
    </h2>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About({ company }) {
  if (!has(company.about)) return null;
  return (
    <section id="about" style={{ background: C.cream, padding: "100px 3rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>

        {/* Image / banner panel */}
        <div style={{ position: "relative" }}>
          {company.banner ? (
            <img src={company.banner} alt="cover" style={{
              width: "100%", height: 480, objectFit: "cover", borderRadius: 4,
              display: "block",
            }} />
          ) : (
            <div style={{
              width: "100%", height: 480, borderRadius: 4,
              background: `linear-gradient(145deg, ${C.sand}, ${C.rose}40)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontFamily: displayFont, fontSize: "8rem", color: "rgba(255,255,255,0.5)" }}>
                {company.companyName[0]}
              </span>
            </div>
          )}
          {/* Gold accent frame */}
          <div style={{
            position: "absolute", bottom: -16, right: -16,
            width: "70%", height: "70%",
            border: `2px solid ${C.gold}`,
            borderRadius: 4,
            zIndex: -1,
          }} />
          {/* Rose dot */}
          <div style={{
            position: "absolute", top: -12, left: -12,
            width: 28, height: 28, borderRadius: "50%",
            background: C.rose,
          }} />
        </div>

        {/* Text */}
        <div>
          <SecLabel text="Our Story" />
          <SecTitle>Who We{"\u00A0"}Are</SecTitle>

          <p style={{
            fontFamily: bodyFont, fontSize: 15.5, lineHeight: 1.9,
            color: C.muted, marginBottom: 32,
          }}>
            {company.about}
          </p>

          {has(company.address) && (
            <div style={{
              borderLeft: `3px solid ${C.rose}`,
              paddingLeft: 16, marginBottom: 32,
              fontFamily: bodyFont, fontSize: 13.5,
              color: C.muted, lineHeight: 1.8,
            }}>
              {company.address.building && <div>{company.address.building}</div>}
              {company.address.street   && <div>{company.address.street}</div>}
              {company.address.place    && <div>{company.address.place}</div>}
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {[
              company.industry    && { l: "Industry",  v: company.industry },
              company.companySize && { l: "Team Size", v: company.companySize },
              company.foundedYear && { l: "Founded",   v: company.foundedYear },
              company.businessPark && { l: "Park",     v: company.businessPark },
            ].filter(Boolean).map(({l, v}) => (
              <div key={l} style={{
                background: C.offWhite, border: `1px solid ${C.sand}`,
                borderRadius: 2, padding: "12px 18px",
              }}>
                <div style={{ fontFamily: bodyFont, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: 4 }}>{l}</div>
                <div style={{ fontFamily: displayFont, fontSize: 15, color: C.text }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Services ──────────────────────────────────────────────────────────────────
function Services({ company }) {
  if (!has(company.services)) return null;
  return (
    <section id="services" style={{ background: C.offWhite, padding: "100px 3rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 0 }}>
          <SecLabel text="What We Do" />
        </div>
        <SecTitle center>Our Services</SecTitle>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))", gap: 24 }}>
          {company.services.map((s, i) => (
            <div key={s.title} style={{
              background: i % 2 === 0 ? C.cream : C.sand + "60",
              border: `1px solid ${C.sand}`,
              borderRadius: 4,
              padding: "40px 28px",
              position: "relative", overflow: "hidden",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 16px 40px rgba(104,59,43,0.1)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              {/* Watermark number */}
              <div style={{
                position: "absolute", bottom: 12, right: 20,
                fontFamily: displayFont, fontSize: 72, color: "rgba(176,132,1,0.07)",
                lineHeight: 1, userSelect: "none",
              }}>
                {String(i+1).padStart(2,"0")}
              </div>

              <div style={{ width: 36, height: 3, background: C.gold, borderRadius: 2, marginBottom: 24 }} />

              <h3 style={{ fontFamily: displayFont, fontSize: 19, color: C.text, marginBottom: 12, lineHeight: 1.25 }}>
                {s.title}
              </h3>
              <p style={{ fontFamily: bodyFont, fontSize: 14, color: C.muted, lineHeight: 1.75 }}>
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────
function Projects({ company }) {
  if (!has(company.projects)) return null;
  const accent = [C.rose, C.gold, C.brown];
  return (
    <section id="projects" style={{ background: C.cream, padding: "100px 3rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SecLabel text="Our Work" />
        <SecTitle>Selected Projects</SecTitle>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {company.projects.map((p, i) => (
            <div key={p.name} style={{
              display: "flex", alignItems: "flex-start", gap: 40,
              padding: "40px 0",
              borderBottom: `1px solid ${C.sand}`,
              transition: "padding-left 0.35s cubic-bezier(0.4,0,0.2,1)",
              cursor: "default",
            }}
            onMouseEnter={e => e.currentTarget.style.paddingLeft = "20px"}
            onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}>
              {/* Colored index tab */}
              <div style={{
                minWidth: 4, alignSelf: "stretch",
                background: accent[i % accent.length], borderRadius: 4,
              }} />

              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: bodyFont, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: accent[i % accent.length] }}>
                  Project {String(i+1).padStart(2,"0")}
                </span>
                <h3 style={{ fontFamily: displayFont, fontSize: "clamp(1.3rem,2.5vw,1.9rem)", color: C.text, margin: "6px 0 10px" }}>
                  {p.name}
                </h3>
                <p style={{ fontFamily: bodyFont, fontSize: 14.5, color: C.muted, lineHeight: 1.75, maxWidth: 560 }}>
                  {p.description}
                </p>
              </div>

              {p.link && (
                <a href={p.link} target="_blank" rel="noreferrer" style={{
                  alignSelf: "center",
                  fontFamily: bodyFont, fontSize: 11, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: C.brown,
                  border: `1px solid ${C.brown}`, padding: "10px 22px",
                  borderRadius: 1, textDecoration: "none", whiteSpace: "nowrap",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.brown; e.currentTarget.style.color = C.cream; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.brown; }}>
                  View →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Team ──────────────────────────────────────────────────────────────────────
function Team({ company }) {
  if (!has(company.members)) return null;
  const palettes = [
    `linear-gradient(135deg,${C.rose},${C.sand})`,
    `linear-gradient(135deg,${C.gold},${C.brown})`,
    `linear-gradient(135deg,${C.sand},${C.rose})`,
    `linear-gradient(135deg,${C.brown},${C.rose})`,
  ];
  return (
    <section id="team" style={{ background: C.offWhite, padding: "100px 3rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center" }}>
          <SecLabel text="The Makers" />
          <SecTitle center>Meet the Team</SecTitle>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 28 }}>
          {company.members.map((m, i) => (
            <div key={m.name} style={{
              background: C.cream, border: `1px solid ${C.sand}`,
              borderRadius: 4, padding: "36px 20px", textAlign: "center",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 16px 40px rgba(104,59,43,0.1)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              {/* Avatar */}
              <div style={{
                width: 80, height: 80, borderRadius: "50%", margin: "0 auto 20px",
                background: m.image ? `url(${m.image}) center/cover` : palettes[i % palettes.length],
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontFamily: displayFont, color: "#fff", fontWeight: 400,
              }}>
                {!m.image && initials(m.name)}
              </div>

              <div style={{ fontFamily: displayFont, fontSize: 16.5, color: C.text, marginBottom: 6 }}>
                {m.url ? (
                  <a href={m.url} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                    {m.name}
                  </a>
                ) : m.name}
              </div>
              <div style={{ fontFamily: bodyFont, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gold }}>
                {m.position}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Clients ───────────────────────────────────────────────────────────────────
function Clients({ company }) {
  if (!has(company.clients)) return null;
  return (
    <section id="clients" style={{ background: C.cream, padding: "80px 3rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <SecLabel text="Trusted By" />
        <SecTitle center>Our Clients</SecTitle>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
          {company.clients.map(cl => (
            <div key={cl.name} style={{
              background: C.offWhite, border: `1px solid ${C.sand}`,
              borderRadius: 2, padding: "18px 36px",
              transition: "border-color 0.25s, transform 0.25s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.sand; e.currentTarget.style.transform = "translateY(0)"; }}>
              {cl.logo ? (
                <img src={cl.logo} alt={cl.name} style={{ height: 28, opacity: 0.65 }} />
              ) : (
                <span style={{ fontFamily: bodyFont, fontSize: 13, letterSpacing: "0.06em", color: C.muted }}>
                  {cl.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact({ company }) {
  const c = company.contacts || {};
  const socials = [
    { label: "LinkedIn",   href: c.linkedin,  icon: "in" },
    { label: "Instagram",  href: c.instagram, icon: "◎" },
    { label: "Twitter",    href: c.twitter,   icon: "𝕏" },
    { label: "WhatsApp",   href: c.whatsapp ? `https://wa.me/${c.whatsapp.replace(/\D/g,"")}` : "", icon: "✆" },
  ].filter(s => !!s.href);

  return (
    <section id="contact" style={{
      background: C.darkBrown,
      padding: "100px 3rem",
      position: "relative", overflow: "hidden",
    }}>
      {/* Decorative large letter */}
      <div style={{
        position: "absolute", bottom: -40, right: -20,
        fontFamily: displayFont, fontSize: "clamp(12rem,25vw,22rem)",
        color: "rgba(255,255,255,0.03)", lineHeight: 1, userSelect: "none", pointerEvents: "none",
      }}>
        {company.companyName[0]}
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 28, height: 1, background: C.rose }} />
            <span style={{ fontFamily: bodyFont, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: C.rose }}>
              Let's Connect
            </span>
            <div style={{ width: 28, height: 1, background: C.rose }} />
          </div>
        </div>

        <h2 style={{
          fontFamily: displayFont,
          fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
          color: C.cream,
          lineHeight: 1.08,
          marginBottom: 48,
          letterSpacing: "-0.02em",
        }}>
          Ready to Build<br />
          <span style={{ color: C.rose, fontStyle: "italic" }}>Something Great?</span>
        </h2>

        {/* Contact cards */}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 20, marginBottom: 48 }}>
          {c.email && <ContactCard icon="✉" label="Email" val={c.email} href={`mailto:${c.email}`} />}
          {c.phone && <ContactCard icon="☏" label="Phone" val={c.phone} href={`tel:${c.phone}`} />}
          {company.website && <ContactCard icon="⊹" label="Website" val={company.website.replace(/https?:\/\//,"")} href={company.website} />}
        </div>

        {/* Socials */}
        {socials.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label} style={{
                width: 46, height: 46, borderRadius: "50%",
                border: `1px solid rgba(212,158,141,0.35)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: C.rose, textDecoration: "none", fontSize: 15,
                fontFamily: bodyFont,
                transition: "background 0.2s, border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.rose; e.currentTarget.style.color = C.darkBrown; e.currentTarget.style.borderColor = C.rose; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.rose; e.currentTarget.style.borderColor = "rgba(212,158,141,0.35)"; }}>
                {s.icon}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ContactCard({ icon, label, val, href }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{
      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(222,209,189,0.2)",
      borderRadius: 4, padding: "24px 28px", textDecoration: "none", textAlign: "center",
      minWidth: 160, transition: "border-color 0.2s, transform 0.2s",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${C.rose},0.5)`; e.currentTarget.style.transform = "translateY(-3px)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(222,209,189,0.2)"; e.currentTarget.style.transform = "translateY(0)"; }}>
      <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontFamily: bodyFont, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: C.rose, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: bodyFont, fontSize: 13, color: C.cream }}>{val}</div>
    </a>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({ company }) {
  return (
    <footer style={{
      background: "#1E0E07",
      borderTop: `1px solid rgba(222,209,189,0.08)`,
      padding: "28px 3rem",
      display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
    }}>
      <span style={{ fontFamily: displayFont, fontSize: 15, color: "rgba(250,246,242,0.5)", letterSpacing: "0.01em" }}>
        {company.companyName}
      </span>
      <span style={{ fontFamily: bodyFont, fontSize: 11, color: "rgba(250,246,242,0.25)", letterSpacing: "0.08em" }}>
        © {new Date().getFullYear()} · All rights reserved
        {company.businessPark && ` · ${company.businessPark}`}
      </span>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function Company9() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Jost:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #FAF6F2; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float0 {
          from { transform: translateY(0px) rotate(0deg); }
          to   { transform: translateY(-14px) rotate(5deg); }
        }
        @keyframes float1 {
          from { transform: translateY(0px) rotate(0deg); }
          to   { transform: translateY(-10px) rotate(-8deg); }
        }
        @keyframes float2 {
          from { transform: translateY(0px) rotate(0deg); }
          to   { transform: translateY(-18px) rotate(3deg); }
        }

        @media (max-width: 768px) {
          nav > div:nth-child(2) { display: none !important; }
          section > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <NavBar   company={COMPANY} />
      <Hero     company={COMPANY} />
      <About    company={COMPANY} />
      <Services company={COMPANY} />
      <Projects company={COMPANY} />
      <Team     company={COMPANY} />
      <Clients  company={COMPANY} />
      <Contact  company={COMPANY} />
      <Footer   company={COMPANY} />
    </>
  );
}