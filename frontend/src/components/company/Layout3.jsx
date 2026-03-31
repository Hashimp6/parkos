import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   HARDCODED COMPANY DATA  (swap with API later)
───────────────────────────────────────────── */
const DUMMY = {
  companyName: "NexaCore Technologies",
  tagline: "Engineering Tomorrow, Today.",
  about:
    "We are a product-focused technology company building scalable digital infrastructure for the next generation of enterprises. From deep-tech consulting to full-stack product delivery, NexaCore blends engineering rigour with design intelligence.",
  industry: "Information Technology",
  companySize: "51–200",
  foundedYear: 2017,
  businessPark: "Technopark",
  website: "https://nexacore.io",
  tags: ["SaaS", "AI / ML", "Cloud", "DevOps", "FinTech"],
  address: {
    building: "Tower C, Floor 9",
    street: "Technopark Phase II",
    city: "Thiruvananthapuram",
    state: "Kerala",
    pincode: "695581",
    country: "India",
  },
  contacts: {
    email: "hello@nexacore.io",
    phone: "+91 98765 43210",
    linkedin: "#",
    twitter: "#",
    instagram: "#",
    whatsapp: "#",
  },
  services: [
    { title: "Product Engineering", description: "End-to-end web & mobile product development with a relentless focus on performance, scalability, and user delight." },
    { title: "AI & Data Intelligence", description: "Machine-learning pipelines, predictive analytics, and AI integrations that make your product smarter every day." },
    { title: "Cloud Infrastructure", description: "AWS, GCP, and Azure architecture, migration, cost-optimisation, and 24 / 7 monitoring so you never lose sleep." },
    { title: "UX Strategy & Design", description: "Research-driven design systems and brand experiences built to convert, retain, and inspire." },
    { title: "DevOps & Automation", description: "CI / CD pipelines, infrastructure-as-code, and release automation that compresses your delivery cycle." },
    { title: "Tech Consulting", description: "CTO-as-a-service, architecture audits, and technology roadmap planning for ambitious scaling companies." },
  ],
  projects: [
    { name: "FinFlow", year: "2023", category: "FinTech · Payments", description: "A real-time B2B payments platform processing ₹200 Cr+ monthly across 300+ SMEs in South India. Built on event-driven microservices with sub-100 ms settlement.", link: "#" },
    { name: "MediSync", year: "2022", category: "HealthTech · AI", description: "AI-powered patient data platform adopted by 40 hospitals, reducing diagnostic turnaround time by 60% and integrating with 8 existing HIS systems.", link: "#" },
    { name: "LogiTrack", year: "2023", category: "Logistics · IoT", description: "End-to-end supply-chain visibility SaaS with live IoT tracking, serving 12 logistics companies and monitoring 50,000+ shipments per month.", link: "#" },
    { name: "EduSphere", year: "2021", category: "EdTech · Platform", description: "Adaptive learning platform used by 200,000+ students, powered by recommendation AI that personalises every learning path in real time.", link: "#" },
  ],
  members: [
    { name: "Arjun Menon", position: "Founder & CEO", bio: "15 years in product engineering. Previously VP Engineering at a Fortune 500 fintech.", url: "#" },
    { name: "Priya Krishnan", position: "Chief Technology Officer", bio: "Ex-Google engineer. Architected systems that serve 100M+ daily users.", url: "#" },
    { name: "Rahul Nair", position: "Head of Design", bio: "Award-winning UX lead. Obsessed with typography, motion, and the spaces in between.", url: "#" },
    { name: "Sneha Pillai", position: "VP Engineering", bio: "Full-stack systems thinker. Champion of developer experience and zero-downtime deployments.", url: "#" },
    { name: "Kiran Das", position: "Head of AI / ML", bio: "PhD in machine learning. Published researcher. Turns papers into production-grade pipelines.", url: "#" },
    { name: "Meera Varma", position: "Director of Growth", bio: "Built GTM engines at 3 startups. Scaled revenue from zero to ₹50 Cr in 18 months.", url: "#" },
  ],
  clients: [
    { name: "Axis Bank", sector: "Banking" },
    { name: "KIMS Health", sector: "Healthcare" },
    { name: "Federal Bank", sector: "Banking" },
    { name: "UST Global", sector: "Technology" },
    { name: "IBS Software", sector: "Aviation" },
    { name: "Carnival Group", sector: "Hospitality" },
    { name: "Muthoot Finance", sector: "Finance" },
    { name: "Kerala Govt.", sector: "Public Sector" },
  ],
  gallery: [
    { caption: "Annual Tech Summit 2024", tag: "Event" },
    { caption: "Product Launch — FinFlow 3.0", tag: "Launch" },
    { caption: "Team Offsite, Munnar", tag: "Culture" },
    { caption: "Hackathon Champions", tag: "Achievement" },
    { caption: "Design Sprint Workshop", tag: "Workshop" },
    { caption: "Client Day, Bangalore", tag: "Client" },
  ],
};

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const C = {
  rust: "#C4500A",
  rustHover: "#A8430A",
  rustLight: "#E8734A",
  cream: "#FDF6EE",
  creamDark: "#F5EBE0",
  ink: "#1A0F08",
  inkLight: "#2E1B0E",
  stone: "#8C6A50",
  stoneMid: "#5A3A25",
  stonePale: "#D4B896",
  border: "#E8D5C0",
  borderDark: "#2C1A0E",
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const initials = (n) =>
  n.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, [threshold]);
  return scrolled;
}

/* ─────────────────────────────────────────────
   NAV
───────────────────────────────────────────── */
function Nav({ company }) {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const links = ["About", "Services", "Projects", "Team", "Clients", "Gallery", "Contact"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${C.cream}; }
        ::selection { background: ${C.rust}; color: ${C.cream}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.cream}; }
        ::-webkit-scrollbar-thumb { background: ${C.rust}; }

        .nav-link {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 12px;
          letter-spacing: 0.12em;
          color: ${C.stone};
          text-decoration: none;
          transition: color 0.2s;
          text-transform: uppercase;
        }
        .nav-link:hover { color: ${C.rust}; }

        .btn-primary {
          display: inline-block;
          background: ${C.rust};
          color: ${C.cream};
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 12px 28px;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-primary:hover { background: ${C.rustHover}; transform: translateY(-1px); }

        .btn-outline {
          display: inline-block;
          border: 1px solid ${C.border};
          color: ${C.stone};
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 12px 28px;
          transition: border-color 0.2s, color 0.2s, transform 0.15s;
        }
        .btn-outline:hover { border-color: ${C.rust}; color: ${C.rust}; transform: translateY(-1px); }

        .section-label {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: ${C.rust};
        }

        .display-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: ${C.ink};
          line-height: 0.92;
        }

        .body-text {
          font-family: 'IBM Plex Sans', sans-serif;
          font-weight: 300;
          color: ${C.stoneMid};
          line-height: 1.85;
        }

        .mono-label {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.22s; }
        .delay-3 { animation-delay: 0.34s; }
        .delay-4 { animation-delay: 0.46s; }

        .service-row {
          display: flex;
          align-items: center;
          gap: 32px;
          padding: 28px 0;
          border-bottom: 1px solid ${C.border};
          cursor: pointer;
          transition: padding-left 0.25s;
          text-decoration: none;
        }
        .service-row:hover { padding-left: 12px; }
        .service-row:hover .service-title { color: ${C.rust}; }
        .service-row:hover .service-arrow { color: ${C.rust}; }

        .project-card {
          display: block;
          text-decoration: none;
          border: 1px solid ${C.border};
          padding: 40px;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          background: ${C.cream};
        }
        .project-card:hover {
          border-color: ${C.rust};
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(196, 80, 10, 0.08);
        }

        .member-card {
          background: ${C.cream};
          border: 1px solid ${C.border};
          padding: 28px;
          transition: border-color 0.25s, transform 0.25s;
          cursor: pointer;
        }
        .member-card:hover { border-color: ${C.rust}; transform: translateY(-3px); }

        .client-chip {
          border: 1px solid ${C.border};
          padding: 14px 22px;
          transition: border-color 0.2s, background 0.2s;
          cursor: default;
        }
        .client-chip:hover { border-color: ${C.rust}; background: ${C.creamDark}; }

        .gallery-item {
          aspect-ratio: 1;
          background: ${C.creamDark};
          border: 1px solid ${C.border};
          overflow: hidden;
          position: relative;
          cursor: pointer;
        }
        .gallery-overlay {
          position: absolute; inset: 0;
          background: ${C.ink};
          opacity: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          transition: opacity 0.3s;
          padding: 24px;
          text-align: center;
        }
        .gallery-item:hover .gallery-overlay { opacity: 0.92; }

        .input-field {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid ${C.border};
          padding: 14px 0;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          color: ${C.ink};
          outline: none;
          transition: border-color 0.2s;
          display: block;
        }
        .input-field:focus { border-color: ${C.rust}; }
        .input-field::placeholder { color: ${C.stonePale}; }
        .input-field.on-dark { color: ${C.cream}; border-color: ${C.borderDark}; }
        .input-field.on-dark::placeholder { color: ${C.stoneMid}; }
        .input-field.on-dark:focus { border-color: ${C.rustLight}; }
      .cp-logo-mark {
  width: 36px;
  height: 36px;
  background: #C4500A;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FDF6EE;
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 12px;
  border-radius: 6px;
  overflow: hidden;
}
      `}</style>

      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? "rgba(253,246,238,0.97)" : "transparent",
          borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          transition: "all 0.4s",
          padding: "0 40px",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div className="cp-logo-mark">
          {company.logo
  ? <img src={company.logo} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  : initials(company.companyName)
}
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: C.ink, letterSpacing: -0.3 }}>
             {company.companyName}
            </span>
          </a>

          {/* Desktop links */}
          <div style={{ display: "flex", gap: 36, alignItems: "center" }} className="hidden-mobile">
            {links.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>
            ))}
          </div>

          <a href="#contact" className="btn-primary" style={{ display: window.innerWidth < 768 ? "none" : "inline-block" }}>
            Get in Touch
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "none", flexDirection: "column", gap: 5, padding: 4 }}
            id="hamburger"
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ display: "block", width: 22, height: 1.5, background: C.ink, transition: "all 0.3s" }} />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{ background: C.cream, borderTop: `1px solid ${C.border}`, padding: "20px 40px 28px" }}>
            {links.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
                style={{ display: "block", padding: "12px 0", borderBottom: `1px solid ${C.border}`, textDecoration: "none" }}
                className="nav-link"
              >{l}</a>
            ))}
            <a href="#contact" className="btn-primary" style={{ marginTop: 20, display: "inline-block" }}>Get in Touch</a>
          </div>
        )}
      </nav>
    </>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function Hero({ company }) {
  return (
    <section
      id="hero"
      style={{ minHeight: "100vh", background: C.cream, paddingTop: 68, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden", position: "relative" }}
    >
      {/* Decorative large numeral */}
      <div style={{ position: "absolute", top: "10%", right: -40, fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "clamp(200px, 28vw, 420px)", lineHeight: 1, color: C.creamDark, pointerEvents: "none", userSelect: "none", letterSpacing: -12 }}>
        {company.foundedYear}
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px 0", width: "100%", position: "relative" }}>
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 60, flexWrap: "wrap", gap: 24 }}>
          <div className="fade-up">
            <span className="section-label">{company.businessPark} · {company.address.city}</span>
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              {company.tags.map((t) => (
                <span key={t} style={{ border: `1px solid ${C.border}`, color: C.stone, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", padding: "4px 10px", textTransform: "uppercase" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="fade-up delay-1" style={{ textAlign: "right" }}>
            <p className="mono-label" style={{ color: C.stone, marginBottom: 8 }}>Scroll to explore</p>
            <div style={{ width: 1, height: 48, background: `linear-gradient(to bottom, ${C.rust}, transparent)`, marginLeft: "auto" }} />
          </div>
        </div>

        {/* Giant headline */}
        <div className="fade-up delay-2">
          <h1 className="display-heading" style={{ fontSize: "clamp(56px, 10vw, 136px)", marginBottom: 0 }}>
            We Build<br />
            <em style={{ color: C.rust, fontStyle: "italic" }}>Digital</em><br />
            Futures.
          </h1>
        </div>

        {/* Bottom row */}
       
      </div>

      {/* Full-width tagline band */}
      <div style={{ background: C.ink, padding: "20px 40px", marginTop: 0 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "clamp(18px, 2.5vw, 28px)", color: C.cream, fontWeight: 400 }}>
            "{company.tagline}"
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <a href="#services" className="btn-primary">Explore Services</a>
            <a href="#projects" className="btn-outline" style={{ borderColor: C.borderDark, color: C.stonePale }}>View Work →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────── */
function About({ company }) {
  return (
    <section id="about" style={{ background: C.creamDark, padding: "120px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "start" }}>
          {/* Left */}
          <div>
            <span className="section-label" style={{ display: "block", marginBottom: 20 }}>01 / About Us</span>
            <h2 className="display-heading" style={{ fontSize: "clamp(40px, 5vw, 64px)", marginBottom: 32 }}>
              Built on<br />
              <em style={{ color: C.rust }}>conviction.</em>
            </h2>
            <div style={{ width: 48, height: 3, background: C.rust, marginBottom: 40 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                ["Industry", company.industry],
                ["Company Size", company.companySize],
                ["Founded", company.foundedYear],
                ["HQ", `${company.address.building}, ${company.address.city}`],
                ["Business Park", company.businessPark],
                ["Website", company.website],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 16, borderBottom: `1px solid ${C.border}`, paddingBottom: 14 }}>
                  <span className="mono-label" style={{ color: C.stone, minWidth: 120, paddingTop: 2 }}>{k}</span>
                  <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.ink, fontWeight: 400 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div>
            <p className="body-text" style={{ fontSize: "clamp(16px, 1.8vw, 22px)", lineHeight: 1.75, marginBottom: 40, color: C.stoneMid }}>
              {company.about}
            </p>
            <p className="body-text" style={{ fontSize: 15, marginBottom: 56 }}>
              Headquartered at {company.businessPark} in Kerala's technology corridor, we work with
              startups, growth-stage ventures, and blue-chip enterprises across fintech, healthtech,
              logistics, and education — bringing senior-level engineering and design talent to every
              single engagement, no matter the size.
            </p>

            {/* Quote pull */}
            <div style={{ borderLeft: `4px solid ${C.rust}`, paddingLeft: 32, marginBottom: 56 }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "clamp(18px, 2vw, 24px)", color: C.ink, lineHeight: 1.6 }}>
                "We don't just ship code. We take ownership of outcomes."
              </p>
              <p className="mono-label" style={{ color: C.rust, marginTop: 12 }}>Arjun Menon, Founder & CEO</p>
            </div>

            {/* CTA */}
            <a href="#contact" className="btn-primary">Work With Us →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SERVICES
───────────────────────────────────────────── */
function Services({ company }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <section id="services" style={{ background: C.ink, padding: "120px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 72, flexWrap: "wrap", gap: 24 }}>
          <div>
            <span className="section-label" style={{ color: C.rust, display: "block", marginBottom: 16 }}>02 / Services</span>
            <h2 className="display-heading" style={{ fontSize: "clamp(44px, 6vw, 80px)", color: C.cream }}>
              What We Do
            </h2>
          </div>
          <p className="body-text" style={{ maxWidth: 380, color: C.stone, fontSize: 14 }}>
            From first-principles architecture to scaled delivery — our practice areas cover the complete product lifecycle.
          </p>
        </div>

        {/* Service list */}
        <div style={{ borderTop: `1px solid ${C.borderDark}` }}>
          {company.services.map((s, i) => (
            <div
              key={i}
              className="service-row"
              style={{ borderColor: C.borderDark, cursor: "pointer" }}
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <span className="mono-label" style={{ color: C.stoneMid, minWidth: 48 }}>0{i + 1}</span>
              <h3
                className="service-title"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(22px, 3vw, 36px)", color: C.cream, flex: 1, transition: "color 0.2s" }}
              >
                {s.title}
              </h3>
              {/* Expanded desc */}
              {expanded === i && (
                <p className="body-text" style={{ maxWidth: 480, fontSize: 14, color: C.stone, display: "none" }}>{s.description}</p>
              )}
              <p className="body-text" style={{ maxWidth: 380, fontSize: 13, color: C.stone, flex: "0 0 380px", display: expanded === i ? "block" : "none" }}>
                {s.description}
              </p>
              <span
                className="service-arrow"
                style={{ fontSize: 24, color: expanded === i ? C.rust : C.borderDark, transition: "all 0.2s", transform: expanded === i ? "rotate(45deg)" : "none" }}
              >
                +
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PROJECTS
───────────────────────────────────────────── */
function Projects({ company }) {
  return (
    <section id="projects" style={{ background: C.cream, padding: "120px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 72, flexWrap: "wrap", gap: 24 }}>
          <div>
            <span className="section-label" style={{ display: "block", marginBottom: 16 }}>03 / Projects</span>
            <h2 className="display-heading" style={{ fontSize: "clamp(44px, 6vw, 80px)" }}>Featured Work</h2>
          </div>
          <span className="body-text" style={{ fontSize: 13 }}>4 selected case studies</span>
        </div>

        {/* 2×2 grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(440px, 1fr))", gap: 0 }}>
          {company.projects.map((p, i) => (
            <a key={i} href={p.link} className="project-card" style={{ borderRight: i % 2 === 0 ? "none" : `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <span className="mono-label" style={{ color: C.rust }}>Project 0{i + 1}</span>
                  <p className="mono-label" style={{ color: C.stone, marginTop: 4 }}>{p.category}</p>
                </div>
                <span className="mono-label" style={{ color: C.stonePale }}>{p.year}</span>
              </div>
              <h3 className="display-heading" style={{ fontSize: "clamp(32px, 4vw, 52px)", marginBottom: 16, color: C.ink }}>
                {p.name}
              </h3>
              <p className="body-text" style={{ fontSize: 14, marginBottom: 32 }}>{p.description}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: C.rust }}>View Case Study</span>
                <span style={{ color: C.rust, fontSize: 18, transition: "transform 0.2s" }}>↗</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TEAM
───────────────────────────────────────────── */
function Team({ company }) {
  const avatarColors = [C.rust, C.inkLight, C.stone, "#6B4226", C.rustLight, C.stoneMid];

  return (
    <section id="team" style={{ background: C.creamDark, padding: "120px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ marginBottom: 72 }}>
          <span className="section-label" style={{ display: "block", marginBottom: 16 }}>04 / Team</span>
          <h2 className="display-heading" style={{ fontSize: "clamp(44px, 6vw, 80px)" }}>
            The People<br />
            <em style={{ color: C.rust }}>Behind the Work.</em>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {company.members.map((m, i) => (
            <a key={i} href={m.url} className="member-card" style={{ textDecoration: "none" }}>
              {/* Avatar */}
              <div style={{ width: 64, height: 64, background: avatarColors[i % avatarColors.length], display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 22, color: C.cream }}>
                  {initials(m.name)}
                </span>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: C.ink, marginBottom: 4 }}>
                {m.name}
              </h3>
              <p className="mono-label" style={{ color: C.rust, marginBottom: 14 }}>{m.position}</p>
              <p className="body-text" style={{ fontSize: 13, lineHeight: 1.7 }}>{m.bio}</p>
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: C.rust, marginTop: 16, textTransform: "uppercase" }}>
                View Profile →
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CLIENTS
───────────────────────────────────────────── */
function Clients({ company }) {
  return (
    <section id="clients" style={{ background: C.ink, padding: "100px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64, flexWrap: "wrap", gap: 24 }}>
          <div>
            <span className="section-label" style={{ color: C.rust, display: "block", marginBottom: 16 }}>05 / Clients</span>
            <h2 className="display-heading" style={{ fontSize: "clamp(44px, 6vw, 72px)", color: C.cream }}>
              Trusted By<br />
              <em style={{ color: C.rust }}>the Best.</em>
            </h2>
          </div>
          <p className="body-text" style={{ color: C.stone, maxWidth: 320, fontSize: 14 }}>
            From government institutions to nimble VC-backed startups — our clients span every stage and sector.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 0, borderTop: `1px solid ${C.borderDark}`, borderLeft: `1px solid ${C.borderDark}` }}>
          {company.clients.map((c, i) => (
            <div
              key={i}
              className="client-chip"
              style={{
                borderColor: C.borderDark,
                borderRight: `1px solid ${C.borderDark}`,
                borderBottom: `1px solid ${C.borderDark}`,
                flex: "1 1 160px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px 24px",
                gap: 8,
                background: "transparent",
              }}
            >
              <div style={{ width: 48, height: 48, background: C.borderDark, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 16, color: C.rust }}>
                  {c.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500, fontSize: 13, color: C.cream, textAlign: "center" }}>{c.name}</span>
              <span className="mono-label" style={{ color: C.stone }}>{c.sector}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   GALLERY
───────────────────────────────────────────── */
function Gallery({ company }) {
  const palettes = [
    { bg: "#D4956A", label: "Warm Amber" },
    { bg: "#8C6A50", label: "Stone Brown" },
    { bg: C.rust, label: "Rust" },
    { bg: C.inkLight, label: "Deep Ink" },
    { bg: "#C4956A", label: "Sand" },
    { bg: "#5A3A25", label: "Dark Earth" },
  ];

  return (
    <section id="gallery" style={{ background: C.cream, padding: "120px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ marginBottom: 72 }}>
          <span className="section-label" style={{ display: "block", marginBottom: 16 }}>06 / Gallery</span>
          <h2 className="display-heading" style={{ fontSize: "clamp(44px, 6vw, 80px)" }}>
            Life at<br />
            <em style={{ color: C.rust }}>NexaCore.</em>
          </h2>
        </div>

        {/* 3-column masonry-style */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {company.gallery.map((g, i) => (
            <div
              key={i}
              className="gallery-item"
              style={{
                gridRow: i === 0 || i === 4 ? "span 2" : "span 1",
                aspectRatio: i === 0 || i === 4 ? "auto" : "1",
                minHeight: i === 0 || i === 4 ? 480 : 240,
                background: palettes[i % palettes.length].bg,
                border: `1px solid ${C.border}`,
              }}
            >
              {/* Placeholder visual */}
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "clamp(40px, 6vw, 80px)", color: "rgba(255,255,255,0.15)", letterSpacing: -2 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="gallery-overlay">
                <span className="mono-label" style={{ color: C.rust, marginBottom: 8 }}>{g.tag}</span>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.cream, textAlign: "center" }}>{g.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────── */
function Contact({ company }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1400);
  };

  return (
    <section id="contact" style={{ background: C.creamDark, padding: "120px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 80, alignItems: "start" }}>
          {/* Left */}
          <div>
            <span className="section-label" style={{ display: "block", marginBottom: 16 }}>07 / Contact</span>
            <h2 className="display-heading" style={{ fontSize: "clamp(44px, 5vw, 72px)", marginBottom: 32 }}>
              Let's Create<br />
              <em style={{ color: C.rust }}>Together.</em>
            </h2>
            <p className="body-text" style={{ fontSize: 15, marginBottom: 56 }}>
              Whether you're launching a product, scaling engineering, or need a technology audit —
              we're all ears. Drop us a message and we'll get back within 24 hours.
            </p>

            {/* Contact details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0, borderTop: `2px solid ${C.ink}`, marginBottom: 48 }}>
              {[
                { icon: "✉", label: "Email", value: company.contacts.email },
                { icon: "✆", label: "Phone", value: company.contacts.phone },
                { icon: "◎", label: "Address", value: `${company.address.building}, ${company.address.street}, ${company.address.city} – ${company.address.pincode}` },
              ].map((c) => (
                <div key={c.label} style={{ display: "flex", gap: 20, padding: "20px 0", borderBottom: `1px solid ${C.border}`, alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: C.rust, fontSize: 14 }}>{c.icon}</span>
                  </div>
                  <div>
                    <p className="mono-label" style={{ color: C.stone, marginBottom: 4 }}>{c.label}</p>
                    <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.ink, fontWeight: 400 }}>{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[["LinkedIn", company.contacts.linkedin], ["Twitter", company.contacts.twitter], ["Instagram", company.contacts.instagram], ["WhatsApp", company.contacts.whatsapp]].map(([name, href]) => (
                <a
                  key={name}
                  href={href}
                  style={{
                    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10, fontWeight: 600,
                    letterSpacing: "0.15em", textTransform: "uppercase", color: C.stone,
                    border: `1px solid ${C.border}`, padding: "8px 16px", textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.target.style.borderColor = C.rust; e.target.style.color = C.rust; }}
                  onMouseLeave={(e) => { e.target.style.borderColor = C.border; e.target.style.color = C.stone; }}
                >
                  {name}
                </a>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div style={{ background: C.ink, padding: "52px 48px" }}>
            {sent ? (
              <div style={{ minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <div style={{ width: 64, height: 64, border: `2px solid ${C.rust}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                  <span style={{ color: C.rust, fontSize: 28 }}>✓</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 28, color: C.cream, marginBottom: 12 }}>
                  Message Sent!
                </h3>
                <p className="body-text" style={{ color: C.stone, maxWidth: 280 }}>
                  We'll review your message and respond within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <div>
                  <p className="mono-label" style={{ color: C.stone, marginBottom: 10 }}>Your Name</p>
                  <input className="input-field on-dark" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <p className="mono-label" style={{ color: C.stone, marginBottom: 10 }}>Email Address</p>
                  <input className="input-field on-dark" type="email" placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div>
                  <p className="mono-label" style={{ color: C.stone, marginBottom: 10 }}>Company</p>
                  <input className="input-field on-dark" placeholder="Your company name" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </div>
                <div>
                  <p className="mono-label" style={{ color: C.stone, marginBottom: 10 }}>Message</p>
                  <textarea className="input-field on-dark" rows={5} placeholder="Tell us about your project, timeline, and goals…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required style={{ resize: "none" }} />
                </div>
                <button
                  type="submit"
                  style={{
                    background: loading ? C.stoneMid : C.rust,
                    color: C.cream,
                    border: "none",
                    padding: "18px 40px",
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "background 0.2s",
                    alignSelf: "flex-start",
                  }}
                >
                  {loading ? "Sending…" : "Send Message →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer({ company }) {
  return (
    <footer style={{ background: C.ink, borderTop: `1px solid ${C.borderDark}` }}>
      {/* Top band */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 40px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 28, height: 28, background: C.rust, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: C.cream, fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: 1 }}>NC</span>
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: C.cream }}>NexaCore</span>
            </div>
            <p className="body-text" style={{ color: C.stone, fontSize: 13, maxWidth: 280, lineHeight: 1.8 }}>
              Building scalable digital infrastructure for the next generation of enterprises. Based in Kerala, working globally.
            </p>
          </div>

          {/* Company */}
          <div>
            <p className="mono-label" style={{ color: C.stone, marginBottom: 20 }}>Company</p>
            {["About", "Services", "Projects", "Team"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ display: "block", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.stoneMid, textDecoration: "none", marginBottom: 12, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.target.style.color = C.rust)}
                onMouseLeave={(e) => (e.target.style.color = C.stoneMid)}>
                {l}
              </a>
            ))}
          </div>

          {/* Work */}
          <div>
            <p className="mono-label" style={{ color: C.stone, marginBottom: 20 }}>Work</p>
            {["Clients", "Gallery", "Case Studies", "Blog"].map((l) => (
              <a key={l} href="#" style={{ display: "block", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.stoneMid, textDecoration: "none", marginBottom: 12, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.target.style.color = C.rust)}
                onMouseLeave={(e) => (e.target.style.color = C.stoneMid)}>
                {l}
              </a>
            ))}
          </div>

          {/* Connect */}
          <div>
            <p className="mono-label" style={{ color: C.stone, marginBottom: 20 }}>Connect</p>
            {["LinkedIn", "Twitter", "Instagram", "GitHub"].map((l) => (
              <a key={l} href="#" style={{ display: "block", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.stoneMid, textDecoration: "none", marginBottom: 12, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.target.style.color = C.rust)}
                onMouseLeave={(e) => (e.target.style.color = C.stoneMid)}>
                {l}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: `1px solid ${C.borderDark}`, paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <p className="mono-label" style={{ color: C.stoneMid }}>
            © {new Date().getFullYear()} {company.companyName}. All rights reserved.
          </p>
          <p className="mono-label" style={{ color: C.stoneMid }}>
            {company.address.city}, {company.address.state} · {company.address.country}
          </p>
          <a href={company.website} style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: C.rust, textDecoration: "none" }}>
            {company.website} ↗
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   ROOT EXPORT
───────────────────────────────────────────── */
export default function Layout3({ data }) {
  console.log("ggg",data);
  
  const companyData = data ||DUMMY;
  return (
    <div>
      <Nav company={companyData} />
      <Hero company={companyData} />
      <About company={companyData} />
      <Services company={companyData} />
      <Projects company={companyData} />
      <Team company={companyData} />
      <Clients company={companyData} />
      <Gallery company={companyData} />
      <Contact company={companyData} />
      <Footer company={companyData} />
    </div>
  );
}