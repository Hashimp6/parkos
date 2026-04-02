import { useState, useEffect, useRef } from "react";

// ── Colour palette from screenshot ──────────────────────────────────────────
// #EFEFEF  light / text-on-dark
// #3C7D0A  (not used – screenshot shows teal, not green)
// #367D0A  → corrected: teal accent  #3ABFBF  / #36C0B8
// Actual palette: #EFEFEF · #3C7D8A → #36788A · #285A68 · #133350 · #010E03→#01100E
// From the screenshot swatches (right column):
//   #EFEFEF, #3C7D0A → NO → real swatches look like:
//   White/light, teal-mid, teal-dark, navy-dark, near-black

const COLORS = {
  light: "#EFEFEF",
  tealBright: "#38BEC9",
  tealMid: "#2E7D8A",       // ~#3C7D8A from swatch
  tealDark: "#1E5A68",      // ~#285A68
  navy: "#0E2D3F",          // ~#133350
  nearBlack: "#060E12",     // ~#010E03
};

// ── Sample data mirroring the schema ────────────────────────────────────────
const COMPANY = {
  companyName: "NovaTech Solutions",
  tagline: "Engineering Tomorrow, Today.",
  about:
    "We are a forward-thinking technology firm specialising in full-stack software engineering, cloud infrastructure, and AI-driven product development. Founded on the belief that great software transforms lives, we partner with startups and enterprises alike to build products that scale.",
  industry: "Software & Technology",
  companySize: "51-200",
  foundedYear: 2018,
  businessPark: "Infopark",
  logo: null,
  banner: null,
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
    { name: "Arjun Menon", position: "CEO & Co-founder", image: "", url: "" },
    { name: "Priya Nair", position: "CTO", image: "", url: "" },
    { name: "Rahul Krishnan", position: "Lead Designer", image: "", url: "" },
    { name: "Sneha Thomas", position: "Product Manager", image: "", url: "" },
  ],
  services: [
    {
      title: "Full-Stack Development",
      description:
        "End-to-end web and mobile application development using modern React, Next.js, Node, and Go stacks.",
    },
    {
      title: "Cloud Infrastructure",
      description:
        "AWS, GCP, and Azure architecture design, migration, CI/CD pipelines, and 24×7 DevOps support.",
    },
    {
      title: "AI & Machine Learning",
      description:
        "Custom model training, NLP, computer vision, and LLM integration for intelligent product experiences.",
    },
    {
      title: "UX / Product Design",
      description:
        "Research-driven design systems, high-fidelity prototypes, and brand identity that converts.",
    },
  ],
  projects: [
    {
      name: "HealthSync",
      description:
        "A HIPAA-compliant telemedicine platform serving 200k+ patients across South Asia.",
      link: "https://healthsync.io",
    },
    {
      name: "LogiFlow",
      description:
        "Real-time supply-chain visibility dashboard with ML demand forecasting for an FMCG giant.",
      link: "",
    },
    {
      name: "EduPulse",
      description:
        "Adaptive learning platform using spaced-repetition algorithms deployed in 300+ schools.",
      link: "https://edupulse.in",
    },
  ],
  clients: [
    { name: "Tata Consultancy", logo: "", website: "" },
    { name: "Infosys BPM", logo: "", website: "" },
    { name: "UST Global", logo: "", website: "" },
    { name: "IBS Software", logo: "", website: "" },
    { name: "Fingent", logo: "", website: "" },
  ],
  gallery: [],
};

// ── Utility ──────────────────────────────────────────────────────────────────
const has = (val) => {
  if (!val) return false;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === "object") return Object.values(val).some((v) => !!v);
  return true;
};

const initials = (name) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

// ── Components ───────────────────────────────────────────────────────────────

function NavBar({ company }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["About", "Services", "Projects", "Team", "Clients", "Contact"];

  return (
    <nav
      style={{
        background: scrolled ? "rgba(6,14,18,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(56,190,201,0.15)" : "none",
        transition: "all 0.4s ease",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "68px",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: 36,
            height: 36,
            background: `linear-gradient(135deg, ${COLORS.tealBright}, ${COLORS.tealDark})`,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 14,
            color: "#fff",
            fontFamily: "serif",
            letterSpacing: 1,
          }}
        >
          {company.companyName.slice(0, 2).toUpperCase()}
        </div>
        <span
          style={{
            color: COLORS.light,
            fontFamily: "'Playfair Display', serif",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          {company.companyName}
        </span>
      </div>

      {/* Desktop links */}
      <div style={{ display: "flex", gap: "2rem" }} className="nav-links">
        {links.map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            style={{
              color: "rgba(239,239,239,0.7)",
              textDecoration: "none",
              fontSize: 13,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = COLORS.tealBright)}
            onMouseLeave={(e) => (e.target.style.color = "rgba(239,239,239,0.7)")}
          >
            {l}
          </a>
        ))}
      </div>

      {/* CTA */}
      {has(company.contacts?.email) && (
        <a
          href={`mailto:${company.contacts.email}`}
          style={{
            background: `linear-gradient(135deg, ${COLORS.tealBright}, ${COLORS.tealMid})`,
            color: "#fff",
            padding: "8px 20px",
            borderRadius: 4,
            fontSize: 12,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Get in Touch
        </a>
      )}
    </nav>
  );
}

function Hero({ company }) {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${COLORS.nearBlack} 0%, ${COLORS.navy} 50%, ${COLORS.tealDark} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "0 2rem",
      }}
    >
      {/* Background decorative circles */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            borderRadius: "50%",
            border: `1px solid rgba(56,190,201,${0.05 + i * 0.03})`,
            width: `${400 + i * 200}px`,
            height: `${400 + i * 200}px`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: `pulse ${4 + i}s ease-in-out infinite alternate`,
          }}
        />
      ))}

      {/* Grain texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />

      <div style={{ textAlign: "center", position: "relative", zIndex: 2, maxWidth: 900 }}>
        {/* Eyebrow */}
        {has(company.businessPark) && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(56,190,201,0.12)",
              border: "1px solid rgba(56,190,201,0.3)",
              borderRadius: 999,
              padding: "6px 18px",
              marginBottom: 32,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: COLORS.tealBright,
                display: "inline-block",
              }}
            />
            <span
              style={{
                color: COLORS.tealBright,
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontFamily: "sans-serif",
              }}
            >
              {company.businessPark} · {company.industry}
            </span>
          </div>
        )}

        {/* Company name */}
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(3rem, 8vw, 7rem)",
            fontWeight: 700,
            color: COLORS.light,
            lineHeight: 1.05,
            margin: "0 0 24px",
            letterSpacing: "-0.02em",
          }}
        >
          {company.companyName}
        </h1>

        {/* Tagline */}
        {has(company.tagline) && (
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
              color: COLORS.tealBright,
              fontStyle: "italic",
              marginBottom: 32,
              letterSpacing: "0.02em",
            }}
          >
            {company.tagline}
          </p>
        )}

        {/* Tags */}
        {has(company.tags) && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 10,
              marginBottom: 48,
            }}
          >
            {company.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  background: "rgba(30,90,104,0.5)",
                  border: "1px solid rgba(56,190,201,0.2)",
                  color: COLORS.tealBright,
                  padding: "4px 14px",
                  borderRadius: 4,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  fontFamily: "sans-serif",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "3rem",
            flexWrap: "wrap",
          }}
        >
          {company.foundedYear && (
            <Stat label="Founded" value={company.foundedYear} />
          )}
          {company.companySize && (
            <Stat label="Team Size" value={company.companySize} />
          )}
          {company.services?.length > 0 && (
            <Stat label="Services" value={company.services.length + "+"} />
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          animation: "bounce 2s infinite",
        }}
      >
        <div style={{ width: 1, height: 48, background: `linear-gradient(to bottom, transparent, ${COLORS.tealBright})` }} />
        <span style={{ color: COLORS.tealBright, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "2rem",
          color: COLORS.light,
          fontWeight: 700,
        }}
      >
        {value}
      </div>
      <div
        style={{
          color: "rgba(239,239,239,0.5)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontFamily: "sans-serif",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function SectionLabel({ text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
      }}
    >
      <div style={{ width: 32, height: 1, background: COLORS.tealBright }} />
      <span
        style={{
          color: COLORS.tealBright,
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontFamily: "sans-serif",
          fontWeight: 600,
        }}
      >
        {text}
      </span>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(2rem, 4vw, 3.2rem)",
        color: COLORS.light,
        fontWeight: 700,
        lineHeight: 1.1,
        margin: "0 0 48px",
        letterSpacing: "-0.02em",
      }}
    >
      {children}
    </h2>
  );
}

function About({ company }) {
  if (!has(company.about)) return null;
  return (
    <section
      id="about"
      style={{
        background: COLORS.nearBlack,
        padding: "100px 2rem",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
        {/* Text */}
        <div>
          <SectionLabel text="About Us" />
          <SectionTitle>Who We{"\u00A0"}Are</SectionTitle>
          <p
            style={{
              color: "rgba(239,239,239,0.65)",
              lineHeight: 1.85,
              fontSize: 16,
              fontFamily: "sans-serif",
              marginBottom: 32,
            }}
          >
            {company.about}
          </p>
          {has(company.address) && (
            <div
              style={{
                borderLeft: `2px solid ${COLORS.tealBright}`,
                paddingLeft: 16,
                color: "rgba(239,239,239,0.5)",
                fontSize: 14,
                lineHeight: 1.7,
                fontFamily: "sans-serif",
              }}
            >
              {company.address.building && <div>{company.address.building}</div>}
              {company.address.street && <div>{company.address.street}</div>}
              {company.address.place && <div>{company.address.place}</div>}
            </div>
          )}
        </div>

        {/* Detail cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            company.industry && { label: "Industry", val: company.industry },
            company.companySize && { label: "Company Size", val: company.companySize + " employees" },
            company.foundedYear && { label: "Founded", val: company.foundedYear },
            company.businessPark && { label: "Location Park", val: company.businessPark },
          ]
            .filter(Boolean)
            .map(({ label, val }) => (
              <div
                key={label}
                style={{
                  background: "rgba(30,90,104,0.2)",
                  border: "1px solid rgba(56,190,201,0.12)",
                  borderRadius: 8,
                  padding: "20px 20px",
                }}
              >
                <div
                  style={{
                    color: COLORS.tealBright,
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontFamily: "sans-serif",
                    marginBottom: 8,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    color: COLORS.light,
                    fontSize: 15,
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                  }}
                >
                  {val}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

function Services({ company }) {
  if (!has(company.services)) return null;
  return (
    <section
      id="services"
      style={{
        background: COLORS.navy,
        padding: "100px 2rem",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel text="What We Do" />
        <SectionTitle>Our Services</SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
          }}
        >
          {company.services.map((svc, i) => (
            <div
              key={svc.title}
              style={{
                background: "rgba(6,14,18,0.6)",
                border: "1px solid rgba(56,190,201,0.12)",
                borderRadius: 12,
                padding: "36px 28px",
                position: "relative",
                overflow: "hidden",
                transition: "border-color 0.3s, transform 0.3s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(56,190,201,0.5)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(56,190,201,0.12)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Number watermark */}
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 20,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 64,
                  fontWeight: 700,
                  color: "rgba(56,190,201,0.06)",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Dot */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: COLORS.tealBright,
                  marginBottom: 20,
                }}
              />

              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 18,
                  color: COLORS.light,
                  fontWeight: 600,
                  marginBottom: 12,
                  lineHeight: 1.3,
                }}
              >
                {svc.title}
              </h3>
              <p
                style={{
                  color: "rgba(239,239,239,0.55)",
                  fontSize: 14,
                  lineHeight: 1.7,
                  fontFamily: "sans-serif",
                }}
              >
                {svc.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects({ company }) {
  if (!has(company.projects)) return null;
  return (
    <section
      id="projects"
      style={{
        background: COLORS.nearBlack,
        padding: "100px 2rem",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel text="Our Work" />
        <SectionTitle>Featured Projects</SectionTitle>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {company.projects.map((proj, i) => (
            <div
              key={proj.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "32px 0",
                borderBottom: "1px solid rgba(56,190,201,0.1)",
                gap: 24,
                cursor: "default",
                transition: "padding-left 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.paddingLeft = "16px")}
              onMouseLeave={(e) => (e.currentTarget.style.paddingLeft = "0")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 24, flex: 1 }}>
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 13,
                    color: COLORS.tealBright,
                    minWidth: 28,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                      color: COLORS.light,
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    {proj.name}
                  </h3>
                  <p
                    style={{
                      color: "rgba(239,239,239,0.5)",
                      fontSize: 14,
                      fontFamily: "sans-serif",
                      lineHeight: 1.6,
                      maxWidth: 500,
                    }}
                  >
                    {proj.description}
                  </p>
                </div>
              </div>

              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: COLORS.tealBright,
                    border: `1px solid ${COLORS.tealBright}`,
                    borderRadius: 4,
                    padding: "8px 18px",
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    textDecoration: "none",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    transition: "background 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = COLORS.tealBright;
                    e.target.style.color = COLORS.nearBlack;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = COLORS.tealBright;
                  }}
                >
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

function Team({ company }) {
  if (!has(company.members)) return null;
  return (
    <section
      id="team"
      style={{
        background: COLORS.navy,
        padding: "100px 2rem",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel text="The People" />
        <SectionTitle>Meet the Team</SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 24,
          }}
        >
          {company.members.map((m) => (
            <div
              key={m.name}
              style={{
                textAlign: "center",
                padding: "36px 20px",
                background: "rgba(6,14,18,0.5)",
                border: "1px solid rgba(56,190,201,0.1)",
                borderRadius: 12,
                transition: "border-color 0.3s, transform 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(56,190,201,0.4)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(56,190,201,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: m.image
                    ? `url(${m.image}) center/cover`
                    : `linear-gradient(135deg, ${COLORS.tealDark}, ${COLORS.tealMid})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  border: `2px solid rgba(56,190,201,0.3)`,
                  fontSize: 22,
                  fontWeight: 700,
                  color: COLORS.light,
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {!m.image && initials(m.name)}
              </div>

              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 16,
                  color: COLORS.light,
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                {m.image ? (
                  <a href={m.image} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                    {m.name}
                  </a>
                ) : (
                  m.name
                )}
              </div>
              <div
                style={{
                  color: COLORS.tealBright,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  fontFamily: "sans-serif",
                }}
              >
                {m.position}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Clients({ company }) {
  if (!has(company.clients)) return null;
  return (
    <section
      id="clients"
      style={{
        background: COLORS.nearBlack,
        padding: "80px 2rem",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <SectionLabel text="Trusted By" />
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.5rem, 3vw, 2.4rem)",
            color: COLORS.light,
            fontWeight: 700,
            marginBottom: 48,
          }}
        >
          Our Clients &amp; Partners
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 16,
          }}
        >
          {company.clients.map((c) => (
            <div
              key={c.name}
              style={{
                background: "rgba(30,90,104,0.15)",
                border: "1px solid rgba(56,190,201,0.15)",
                borderRadius: 8,
                padding: "18px 32px",
                minWidth: 140,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "border-color 0.3s, background 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(56,190,201,0.5)";
                e.currentTarget.style.background = "rgba(56,190,201,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(56,190,201,0.15)";
                e.currentTarget.style.background = "rgba(30,90,104,0.15)";
              }}
            >
              {c.logo ? (
                <img src={c.logo} alt={c.name} style={{ height: 32, filter: "brightness(0) invert(1) opacity(0.6)" }} />
              ) : (
                <span
                  style={{
                    color: "rgba(239,239,239,0.6)",
                    fontSize: 13,
                    fontFamily: "sans-serif",
                    letterSpacing: "0.06em",
                    fontWeight: 500,
                  }}
                >
                  {c.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ company }) {
  const c = company.contacts || {};
  const socials = [
    { key: "linkedin", label: "LinkedIn", icon: "in", href: c.linkedin },
    { key: "twitter", label: "Twitter / X", icon: "𝕏", href: c.twitter },
    { key: "instagram", label: "Instagram", icon: "◎", href: c.instagram },
    { key: "whatsapp", label: "WhatsApp", icon: "✆", href: c.whatsapp ? `https://wa.me/${c.whatsapp.replace(/\D/g, "")}` : "" },
  ].filter((s) => !!s.href);

  const hasContact = has(c.email) || has(c.phone) || socials.length > 0;
  if (!hasContact) return null;

  return (
    <section
      id="contact"
      style={{
        background: `linear-gradient(160deg, ${COLORS.navy} 0%, ${COLORS.tealDark} 60%, ${COLORS.tealMid} 100%)`,
        padding: "100px 2rem",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <SectionLabel text="Let's Talk" />
        <SectionTitle>Get In Touch</SectionTitle>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 24,
            marginBottom: 56,
          }}
        >
          {c.email && (
            <ContactCard
              icon="✉"
              label="Email"
              value={c.email}
              href={`mailto:${c.email}`}
            />
          )}
          {c.phone && (
            <ContactCard
              icon="☏"
              label="Phone"
              value={c.phone}
              href={`tel:${c.phone}`}
            />
          )}
          {company.website && (
            <ContactCard
              icon="⊹"
              label="Website"
              value={company.website.replace(/https?:\/\//, "")}
              href={company.website}
            />
          )}
        </div>

        {socials.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            {socials.map((s) => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                title={s.label}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: `1px solid rgba(239,239,239,0.3)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COLORS.light,
                  textDecoration: "none",
                  fontSize: 16,
                  transition: "background 0.2s, border-color 0.2s",
                  fontFamily: "sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239,239,239,0.15)";
                  e.currentTarget.style.borderColor = "rgba(239,239,239,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(239,239,239,0.3)";
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ContactCard({ icon, label, value, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        background: "rgba(6,14,18,0.4)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(239,239,239,0.15)",
        borderRadius: 12,
        padding: "28px 32px",
        textDecoration: "none",
        textAlign: "center",
        minWidth: 180,
        transition: "border-color 0.2s, transform 0.2s",
        display: "block",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(239,239,239,0.4)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(239,239,239,0.15)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
      <div style={{ color: "rgba(239,239,239,0.5)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ color: COLORS.light, fontSize: 14, fontFamily: "sans-serif", fontWeight: 500 }}>
        {value}
      </div>
    </a>
  );
}

function Footer({ company }) {
  return (
    <footer
      style={{
        background: COLORS.nearBlack,
        borderTop: "1px solid rgba(56,190,201,0.1)",
        padding: "32px 2rem",
        textAlign: "center",
      }}
    >
      <p
        style={{
          color: "rgba(239,239,239,0.3)",
          fontSize: 12,
          fontFamily: "sans-serif",
          letterSpacing: "0.06em",
        }}
      >
        © {new Date().getFullYear()} {company.companyName}. All rights reserved.
        {company.businessPark && ` · ${company.businessPark}`}
      </p>
    </footer>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function Company8() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #060E12; }
        @keyframes pulse {
          from { transform: translate(-50%,-50%) scale(0.95); opacity: 0.5; }
          to   { transform: translate(-50%,-50%) scale(1.05); opacity: 1; }
        }
        @keyframes bounce {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(8px); }
        }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
        }
        @media (max-width: 640px) {
          section > div[style*='grid-template-columns: 1fr 1fr'] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <NavBar company={COMPANY} />
      <Hero company={COMPANY} />
      <About company={COMPANY} />
      <Services company={COMPANY} />
      <Projects company={COMPANY} />
      <Team company={COMPANY} />
      <Clients company={COMPANY} />
      <Contact company={COMPANY} />
      <Footer company={COMPANY} />
    </>
  );
}