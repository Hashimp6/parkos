import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   DUMMY DATA
═══════════════════════════════════════════════════════════ */
const DUMMY = {
  companyName: "Axiom Digital",
  tagline: "Building Products That Define Markets.",
  about:
    "We are a full-service technology company delivering world-class software, design, and strategy to ambitious businesses. From Technopark's innovation corridor, we partner with startups and enterprises to engineer digital products that create lasting competitive advantage.",
  industry: "Software & Technology",
  companySize: "51–200",
  foundedYear: 2018,
  businessPark: "Technopark",
  website: "https://axiomdigital.io",
  tags: ["SaaS", "AI", "Cloud", "Mobile", "Enterprise"],
  logo: "",
  banner: "",
  address: {
    building: "Nila Building, Floor 4",
    street: "Technopark Phase I",
    city: "Thiruvananthapuram",
    state: "Kerala",
    pincode: "695581",
    country: "India",
  },
  contacts: {
    email: "hello@axiomdigital.io",
    phone: "+91 98765 43210",
    linkedin: "#",
    twitter: "#",
    instagram: "#",
    whatsapp: "919876543210",
  },
  services: [
    { title: "Product Engineering",    description: "End-to-end web & mobile products built for scale — from idea to launch and beyond." },
    { title: "AI & Automation",        description: "LLM integration, ML pipelines, and intelligent automation that makes your product smarter." },
    { title: "UI/UX Design",           description: "Research-driven interfaces and design systems that convert visitors into loyal users." },
    { title: "Cloud & DevOps",         description: "AWS/GCP/Azure architecture, CI/CD, and zero-downtime deployments at any scale." },
    { title: "Data & Analytics",       description: "Real-time dashboards, ETL pipelines, and BI tools that turn raw data into decisions." },
    { title: "Technology Consulting",  description: "CTO advisory, architecture audits, and technology roadmap planning for growth-stage companies." },
  ],
  projects: [
    { name: "PayFlow",    category: "FinTech",    year: "2024", description: "Real-time B2B payment rails processing ₹300 Cr/month for 800+ merchants across India.", link: "#" },
    { name: "CareSync",  category: "HealthTech", year: "2023", description: "Clinical workflow platform adopted by 60+ hospitals, cutting patient wait times by 45%.", link: "#" },
    { name: "TrackPro",  category: "Logistics",  year: "2024", description: "IoT fleet intelligence SaaS monitoring 60,000+ shipments daily with live GPS tracking.", link: "#" },
    { name: "EduPulse",  category: "EdTech",     year: "2022", description: "AI-adaptive learning platform serving 250K+ students with personalised curriculum paths.", link: "#" },
  ],
  members: [
    { name: "Arun Nair",      position: "Founder & CEO",   image: "", url: "", bio: "2x entrepreneur. Built and scaled tech teams across fintech and healthtech." },
    { name: "Divya Menon",    position: "CTO",             image: "", url: "", bio: "Ex-Amazon engineer. Distributed systems expert who ships at startup velocity." },
    { name: "Rahul George",   position: "Head of Design",  image: "", url: "", bio: "Formerly at Zomato. Turns complex problems into interfaces people love." },
    { name: "Sneha Krishnan", position: "VP Engineering",  image: "", url: "", bio: "15 years building production systems. Champion of clean code and fast deploys." },
    { name: "Kiran Pillai",   position: "Head of AI/ML",   image: "", url: "", bio: "PhD. Bridges research and production — ML that actually works at scale." },
    { name: "Meera Das",      position: "Director Growth", image: "", url: "", bio: "Scaled 3 startups to ₹100 Cr ARR. Growth strategy grounded in data." },
  ],
  clients: [
    { name: "Federal Bank",    sector: "Banking",       logo: "", website: "" },
    { name: "KIMS Health",     sector: "Healthcare",    logo: "", website: "" },
    { name: "UST Global",      sector: "Technology",    logo: "", website: "" },
    { name: "IBS Software",    sector: "Aviation",      logo: "", website: "" },
    { name: "Muthoot Finance", sector: "Finance",       logo: "", website: "" },
    { name: "Tata Elxsi",      sector: "Engineering",   logo: "", website: "" },
    { name: "HCLTech",         sector: "IT Services",   logo: "", website: "" },
    { name: "Kerala Govt.",    sector: "Public Sector", logo: "", website: "" },
  ],
  gallery: [
    { imageUrl: "", caption: "Design Week 2024",      tag: "Event"   },
    { imageUrl: "", caption: "Product Launch — PayFlow", tag: "Launch" },
    { imageUrl: "", caption: "Team Retreat, Munnar",  tag: "Culture" },
    { imageUrl: "", caption: "Hackathon Champions",   tag: "Award"   },
    { imageUrl: "", caption: "Sprint Workshop",       tag: "Work"    },
    { imageUrl: "", caption: "Client Summit 2023",    tag: "Client"  },
  ],
};

/* ═══════════════════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════════════════ */
const has = (v) => {
  if (v == null) return false;
  if (typeof v === "string") return v.trim() !== "";
  if (typeof v === "number") return !isNaN(v) && v !== 0;
  if (Array.isArray(v))      return v.length > 0;
  if (typeof v === "object") return Object.values(v).some(has);
  return !!v;
};

const ini = (n = "") =>
  n.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase();

const YR = new Date().getFullYear();

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════ */
const BG     = "#F9FAFB";
const BG2    = "#F3F4F6";
const BG3    = "#FFFFFF";
const TEXT   = "#111827";
const TEXT2  = "#374151";
const TEXT3  = "#6B7280";
const IND    = "#6366F1";   // indigo primary
const IND2   = "#4F46E5";   // indigo dark
const IND3   = "#818CF8";   // indigo light
const INDXL  = "#EEF2FF";   // indigo tint bg
const INDBRD = "#C7D2FE";   // indigo border
const BRD    = "#E5E7EB";

/* ═══════════════════════════════════════════════════════════
   BREAKPOINT HOOK
═══════════════════════════════════════════════════════════ */
function useBreakpoint() {
  const [bp, setBp] = useState({ isMobile: false, isTablet: false, isDesktop: true });
  useEffect(() => {
    const upd = () => setBp({
      isMobile:  window.innerWidth < 640,
      isTablet:  window.innerWidth >= 640 && window.innerWidth < 1024,
      isDesktop: window.innerWidth >= 1024,
    });
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);
  return bp;
}

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════ */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,700&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: ${BG}; color: ${TEXT}; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
      a { text-decoration: none; color: inherit; }
      ::selection { background: ${IND}; color: #fff; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: ${BG2}; }
      ::-webkit-scrollbar-thumb { background: ${IND}; border-radius: 2px; }

      .wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
      @media (min-width: 640px)  { .wrap { padding: 0 40px; } }
      @media (min-width: 1024px) { .wrap { padding: 0 64px; } }

      /* Typography */
      .heading {
        font-family: 'Fraunces', serif;
        font-weight: 900;
        line-height: 1.05;
        letter-spacing: -0.03em;
        color: ${TEXT};
      }
      .heading-italic {
        font-family: 'Fraunces', serif;
        font-weight: 700;
        font-style: italic;
        color: ${IND};
      }
      .label {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 600;
        font-size: 11px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: ${IND};
      }
      .body-text {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 400;
        line-height: 1.75;
        color: ${TEXT3};
        font-size: 15px;
      }

      /* Buttons */
      .btn-primary {
        display: inline-flex; align-items: center; gap: 8px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 700; font-size: 13px; letter-spacing: 0.02em;
        background: ${IND}; color: #fff;
        padding: 14px 28px; border: none; cursor: pointer;
        border-radius: 10px;
        transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        box-shadow: 0 4px 14px rgba(99,102,241,0.3);
      }
      .btn-primary:hover {
        background: ${IND2};
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(99,102,241,0.4);
      }
      .btn-outline {
        display: inline-flex; align-items: center; gap: 8px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 700; font-size: 13px; letter-spacing: 0.02em;
        background: transparent; color: ${TEXT};
        padding: 13px 28px;
        border: 1.5px solid ${BRD};
        cursor: pointer; border-radius: 10px;
        transition: border-color 0.2s, color 0.2s, background 0.2s, transform 0.2s;
      }
      .btn-outline:hover {
        border-color: ${IND}; color: ${IND}; background: ${INDXL};
        transform: translateY(-2px);
      }

      /* Nav link */
      .nav-link {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 500; font-size: 14px; color: ${TEXT2};
        transition: color 0.2s; position: relative;
      }
      .nav-link:hover { color: ${IND}; }

      /* Cards */
      .card {
        background: ${BG3}; border: 1.5px solid ${BRD};
        border-radius: 16px;
        transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
      }
      .card:hover {
        border-color: ${INDBRD};
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(99,102,241,0.1);
      }

      /* Service accordion row */
      .svc-row {
        border-bottom: 1.5px solid ${BRD};
        transition: background 0.2s; cursor: pointer;
        border-radius: 4px;
      }
      .svc-row:hover { background: ${INDXL}; }

      /* Gallery */
      .gal-wrap { position: relative; overflow: hidden; border-radius: 14px; cursor: pointer; }
      .gal-overlay {
        position: absolute; inset: 0; border-radius: 14px;
        background: linear-gradient(to top, rgba(99,102,241,0.88) 0%, transparent 55%);
        opacity: 0; transition: opacity 0.3s;
        display: flex; flex-direction: column;
        justify-content: flex-end; padding: 20px;
      }
      .gal-wrap:hover .gal-overlay { opacity: 1; }

      /* Form field */
      .form-field {
        width: 100%; background: ${BG};
        border: 1.5px solid ${BRD};
        border-radius: 10px; padding: 13px 16px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 400; font-size: 14px; color: ${TEXT};
        outline: none; transition: border-color 0.2s, box-shadow 0.2s;
      }
      .form-field:focus {
        border-color: ${IND};
        box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
      }
      .form-field::placeholder { color: #9CA3AF; }

      /* Client tile */
      .client-tile {
        background: ${BG3}; border: 1.5px solid ${BRD};
        border-radius: 12px; padding: 22px 16px;
        display: flex; flex-direction: column; align-items: center;
        gap: 10px; text-align: center;
        transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
      }
      .client-tile:hover {
        border-color: ${INDBRD};
        box-shadow: 0 6px 24px rgba(99,102,241,0.1);
        transform: translateY(-3px);
      }

      /* Ticker */
      @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      .ticker-track { animation: ticker 30s linear infinite; display: flex; white-space: nowrap; }

      /* Fade up */
      @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
      .fu  { animation: fadeUp 0.65s ease both; }
      .fu1 { animation: fadeUp 0.65s 0.1s  ease both; }
      .fu2 { animation: fadeUp 0.65s 0.2s  ease both; }
      .fu3 { animation: fadeUp 0.65s 0.32s ease both; }
      .fu4 { animation: fadeUp 0.65s 0.44s ease both; }

      /* Floating badge wiggle */
      @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      .float { animation: float 3.5s ease-in-out infinite; }

      @media (max-width: 639px) {
        .hide-mob { display: none !important; }
        .show-mob { display: flex !important; }
      }
      @media (min-width: 640px) {
        .show-mob { display: none !important; }
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════════════════════════
   EYEBROW LABEL
═══════════════════════════════════════════════════════════ */
function Eyebrow({ children, center }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, justifyContent: center ? "center" : "flex-start" }}>
      <div style={{ width: 20, height: 2, background: IND, borderRadius: 2 }} />
      <span className="label">{children}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════════════ */
function Nav({ company }) {
  const { isMobile } = useBreakpoint();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navItems = [
    has(company.about)    && { id: "about",    label: "About"    },
    has(company.services) && { id: "services", label: "Services" },
    has(company.projects) && { id: "projects", label: "Work"     },
    has(company.members)  && { id: "team",     label: "Team"     },
    has(company.clients)  && { id: "clients",  label: "Clients"  },
    has(company.gallery)  && { id: "gallery",  label: "Gallery"  },
                             { id: "contact",  label: "Contact"  },
  ].filter(Boolean);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
      background: scrolled ? "rgba(249,250,251,0.95)" : "rgba(249,250,251,0)",
      borderBottom: scrolled ? `1px solid ${BRD}` : "1px solid transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
      transition: "all 0.3s ease",
    }}>
      <div className="wrap" style={{ height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Brand */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {has(company.logo) ? (
            <img src={company.logo} alt={company.companyName} style={{ height: 32, objectFit: "contain" }} />
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${IND}, ${IND2})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px rgba(99,102,241,0.35)` }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: 14, color: "#fff" }}>
                {ini(company.companyName)}
              </span>
            </div>
          )}
          <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 19, color: TEXT, letterSpacing: "-0.01em" }}>
            {company.companyName}
          </span>
        </a>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
            {navItems.map(item => (
              <a key={item.id} href={`#${item.id}`} className="nav-link">{item.label}</a>
            ))}
          </div>
        )}

        {/* CTA / Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {!isMobile && has(company.contacts?.email) && (
            <a href={`mailto:${company.contacts.email}`} className="btn-primary" style={{ padding: "10px 22px", fontSize: 13 }}>
              Get Started
            </a>
          )}
          {isMobile && (
            <button onClick={() => setOpen(o => !o)} aria-label="Menu"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", flexDirection: "column", gap: 5 }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: "block", width: 22, height: 2, background: open ? IND : TEXT, borderRadius: 2,
                  transition: "all 0.3s",
                  transform: open ? (i === 0 ? "rotate(45deg) translate(5px,5px)" : i === 2 ? "rotate(-45deg) translate(4px,-4px)" : "none") : "none",
                  opacity: open && i === 1 ? 0 : 1,
                }} />
              ))}
            </button>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobile && open && (
        <div style={{ background: BG3, borderTop: `1px solid ${BRD}`, padding: "16px 24px 28px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
          {navItems.map(item => (
            <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)}
              style={{ display: "block", padding: "14px 0", borderBottom: `1px solid ${BRD}`, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: 15, color: TEXT2 }}>
              {item.label}
            </a>
          ))}
          {has(company.contacts?.email) && (
            <a href={`mailto:${company.contacts.email}`} className="btn-primary" style={{ marginTop: 20, display: "inline-flex" }}>
              Get Started
            </a>
          )}
        </div>
      )}
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO  — split layout, image/graphic right side
═══════════════════════════════════════════════════════════ */
function Hero({ company }) {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const addr = company.address || {};

  const stats = [
    has(company.foundedYear) && !isNaN(company.foundedYear) && { n: `${YR - company.foundedYear}+`, l: "Years" },
    has(company.members)  && { n: `${company.members.length}+`,  l: "Experts"  },
    has(company.clients)  && { n: `${company.clients.length}+`,  l: "Clients"  },
    has(company.projects) && { n: `${company.projects.length}`,  l: "Products" },
  ].filter(Boolean);

  const tickerItems = [
    ...(has(company.tags) ? company.tags : []),
    has(company.industry) ? company.industry : null,
    has(company.businessPark) && company.businessPark !== "Other" ? company.businessPark : null,
  ].filter(Boolean);

  /* ── Right-side graphic (when no banner image) ── */
  const HeroGraphic = () => (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: isMobile ? 280 : 460 }}>
      {/* Main rounded rectangle — indigo */}
      <div style={{
        position: "absolute",
        top: isMobile ? 20 : 40, left: isMobile ? "5%" : "8%",
        right: 0, bottom: isMobile ? 20 : 40,
        background: `linear-gradient(145deg, ${IND} 0%, ${IND2} 100%)`,
        borderRadius: isMobile ? "28px 0 0 28px" : "40px 0 0 40px",
        overflow: "hidden",
      }}>
        {/* Inner pattern grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }} />
        {/* Glowing orb inside */}
        <div style={{
          position: "absolute", top: "20%", right: "10%",
          width: isMobile ? 120 : 200, height: isMobile ? 120 : 200,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "5%",
          width: isMobile ? 80 : 140, height: isMobile ? 80 : 140,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }} />
        {/* Big initials watermark */}
        <div style={{
          position: "absolute", bottom: -20, right: -10,
          fontFamily: "'Fraunces',serif", fontWeight: 900,
          fontSize: isMobile ? 120 : 220, color: "rgba(255,255,255,0.07)",
          lineHeight: 1, userSelect: "none", letterSpacing: -8,
        }}>
          {ini(company.companyName)}
        </div>
        {/* Center content */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32 }}>
          <div style={{ width: isMobile ? 64 : 88, height: isMobile ? 64 : 88, borderRadius: 20, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: isMobile ? 24 : 32, color: "#fff" }}>
              {ini(company.companyName)}
            </span>
          </div>
          <p style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontStyle: "italic", fontSize: isMobile ? 18 : 26, color: "rgba(255,255,255,0.9)", textAlign: "center", lineHeight: 1.4, maxWidth: 280 }}>
            {has(company.tagline) ? `"${company.tagline}"` : `"${company.companyName}"`}
          </p>
          {(has(addr.city) || has(company.businessPark)) && (
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 500, fontSize: 12, color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {[company.businessPark !== "Other" ? company.businessPark : null, addr.city].filter(Boolean).join(" · ")}
            </span>
          )}
        </div>
      </div>

      {/* Floating badge — trusted clients */}
      {has(company.clients) && (
        <div className="float" style={{
          position: "absolute", bottom: isMobile ? 10 : 30, left: isMobile ? "2%" : "4%",
          background: BG3, borderRadius: 50, padding: "10px 18px 10px 10px",
          display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          border: `1.5px solid ${BRD}`,
        }}>
          {/* Stacked avatars */}
          <div style={{ display: "flex" }}>
            {["#6366F1","#4F46E5","#818CF8"].map((bg, i) => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: bg, border: "2px solid #fff", marginLeft: i === 0 ? 0 : -8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", fontFamily: "sans-serif" }}>
                  {String.fromCharCode(65 + i)}
                </span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 14, color: TEXT, lineHeight: 1 }}>
              {company.clients.length}+ Clients
            </div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400, fontSize: 10, color: TEXT3, marginTop: 2 }}>
              Trusted Partners
            </div>
          </div>
        </div>
      )}

      {/* Floating tag chip */}
      {has(company.tags) && (
        <div style={{
          position: "absolute", top: isMobile ? 10 : 20, left: isMobile ? "3%" : "6%",
          background: INDXL, borderRadius: 8, padding: "8px 14px",
          border: `1px solid ${INDBRD}`,
          boxShadow: "0 4px 16px rgba(99,102,241,0.15)",
        }}>
          <span className="label" style={{ fontSize: 10 }}>{company.tags[0]}</span>
        </div>
      )}
    </div>
  );

  return (
    <section style={{ background: BG, paddingTop: 68, overflow: "hidden" }}>
      {/* Info strip */}
      {!isMobile && (has(company.foundedYear) || has(company.industry) || has(company.businessPark)) && (
        <div style={{ borderBottom: `1px solid ${BRD}`, padding: "9px 0", background: BG3 }}>
          <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
              <span className="label" style={{ fontSize: 10, color: TEXT3 }}>
                {[has(company.foundedYear) && `Est. ${company.foundedYear}`, has(company.businessPark) && company.businessPark !== "Other" && company.businessPark, has(addr.city) && addr.city].filter(Boolean).join(" · ")}
              </span>
            </div>
            {has(company.industry) && (
              <span className="label" style={{ fontSize: 10, color: TEXT3 }}>{company.industry}</span>
            )}
            {has(company.contacts?.email) && (
              <a href={`mailto:${company.contacts.email}`} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 500, fontSize: 12, color: IND }}>
                {company.contacts.email}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Main split */}
      <div className="wrap">
        <div style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
          gap: 0,
          minHeight: isMobile ? "auto" : "calc(100vh - 110px)",
          alignItems: "center",
        }}>
          {/* LEFT — text */}
          <div style={{ padding: isMobile ? "48px 0 0" : isTablet ? "56px 0" : "0 64px 0 0", paddingRight: isDesktop ? 64 : 0 }}>

            {has(company.tags) && (
              <div className="fu" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", background: INDXL, border: `1px solid ${INDBRD}`, borderRadius: 100, marginBottom: 28 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: IND }} />
                <span className="label" style={{ fontSize: 10 }}>{company.tags.slice(0, 3).join(" · ")}</span>
              </div>
            )}

            <h1 className="heading fu1" style={{ fontSize: isMobile ? "clamp(38px,10vw,60px)" : isTablet ? 64 : 72, marginBottom: 22, maxWidth: 600 }}>
              {has(company.tagline) ? (
                (() => {
                  const words = company.tagline.replace(/\.$/, "").split(" ");
                  const half = Math.ceil(words.length * 0.55);
                  return (
                    <>
                      {words.slice(0, half).join(" ")}{" "}
                      <span className="heading-italic">{words.slice(half).join(" ")}.</span>
                    </>
                  );
                })()
              ) : company.companyName}
            </h1>

            {has(company.about) && (
              <p className="body-text fu2" style={{ marginBottom: 36, maxWidth: 500 }}>
                {company.about.length > 200 ? company.about.slice(0, 200) + "…" : company.about}
              </p>
            )}

            <div className="fu3" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 52 }}>
              {has(company.services) && (
                <a href="#services" className="btn-primary">
                  Explore Services
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              )}
              <a href="#contact" className="btn-outline">Talk to Us</a>
            </div>

            {/* Stats row */}
            {stats.length > 0 && (
              <div className="fu4" style={{ display: "flex", gap: 0, borderTop: `1.5px solid ${BRD}`, paddingTop: 28, flexWrap: "wrap" }}>
                {stats.map((s, i) => (
                  <div key={s.l} style={{ paddingRight: 32, marginRight: 32, borderRight: i < stats.length - 1 ? `1.5px solid ${BRD}` : "none", marginBottom: 16 }}>
                    <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: isMobile ? 34 : 44, color: TEXT, lineHeight: 1, letterSpacing: "-0.03em" }}>
                      {s.n}
                    </div>
                    <span className="label" style={{ fontSize: 10, color: TEXT3, marginTop: 4, display: "block" }}>{s.l}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — graphic or banner */}
          <div style={{ padding: isMobile ? "32px 0 0" : isTablet ? "40px 0" : "40px 0", height: isMobile ? 300 : isTablet ? 420 : "100%", minHeight: isDesktop ? 480 : "auto" }}>
            {has(company.banner) ? (
              <div style={{ position: "relative", height: "100%", minHeight: isMobile ? 280 : 460 }}>
                <div style={{ position: "absolute", top: isMobile ? 20 : 40, left: "8%", right: 0, bottom: isMobile ? 20 : 40, borderRadius: "40px 0 0 40px", overflow: "hidden" }}>
                  <img src={company.banner} alt={company.companyName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, rgba(99,102,241,0.3) 0%, transparent 60%)` }} />
                </div>
              </div>
            ) : (
              <HeroGraphic />
            )}
          </div>
        </div>
      </div>

      {/* Ticker */}
      {tickerItems.length > 0 && (
        <div style={{ background: TEXT, padding: "11px 0", overflow: "hidden", marginTop: isMobile ? 32 : 0 }}>
          <div className="ticker-track">
            {[...Array(8)].map((_, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                {tickerItems.map((t, j) => (
                  <span key={j} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9CA3AF", padding: "0 18px" }}>
                    {t}
                    <span style={{ color: IND, marginLeft: 18 }}>✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   ABOUT
═══════════════════════════════════════════════════════════ */
function About({ company }) {
  const { isMobile, isDesktop } = useBreakpoint();
  const addr = company.address || {};
  const addrStr = [addr.building, addr.street, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ");

  const metaRows = [
    has(company.industry)    && ["Industry",  company.industry],
    has(company.companySize) && ["Team Size", company.companySize],
    has(company.foundedYear) && ["Founded",   String(company.foundedYear)],
    has(company.businessPark) && company.businessPark !== "Other" && ["Park", company.businessPark],
    has(addr.city)           && ["City",      addr.city],
  ].filter(Boolean);

  return (
    <section id="about" style={{ background: BG3, padding: isMobile ? "80px 0" : "110px 0", borderTop: `1px solid ${BRD}` }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: isMobile ? 48 : 80, alignItems: "center" }}>
          <div>
            <Eyebrow>Who We Are</Eyebrow>
            <h2 className="heading" style={{ fontSize: isMobile ? 38 : 52, marginBottom: 20 }}>
              We build for<br />
              <span className="heading-italic">the long run.</span>
            </h2>
            {has(company.about) && (
              <p className="body-text" style={{ marginBottom: 28 }}>{company.about}</p>
            )}
            {has(addrStr) && (
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 18px", background: INDXL, border: `1px solid ${INDBRD}`, borderRadius: 10, marginBottom: 32 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={IND} strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span className="body-text" style={{ fontSize: 13 }}>{addrStr}</span>
              </div>
            )}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {has(company.website) && <a href={company.website} target="_blank" rel="noreferrer" className="btn-primary">Visit Website</a>}
              <a href="#contact" className="btn-outline">Contact Us</a>
            </div>
          </div>

          {metaRows.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {metaRows.map(([k, v]) => (
                <div key={k} className="card" style={{ padding: "22px 20px" }}>
                  <span className="label" style={{ fontSize: 9, display: "block", marginBottom: 8 }}>{k}</span>
                  <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 20, color: TEXT }}>{v}</span>
                </div>
              ))}
              {/* Accent feature card */}
              <div style={{ gridColumn: "1 / -1", background: `linear-gradient(135deg, ${IND} 0%, ${IND2} 100%)`, borderRadius: 16, padding: "24px 22px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <div>
                  <p style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 4 }}>
                    Delivering impact since {company.foundedYear || "day one"}
                  </p>
                  <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                    {has(company.clients) ? `${company.clients.length}+ businesses trust us` : "Trusted by businesses across India"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SERVICES
═══════════════════════════════════════════════════════════ */
function Services({ company }) {
  const { isMobile, isDesktop } = useBreakpoint();
  const [active, setActive] = useState(null);

  return (
    <section id="services" style={{ background: BG, padding: isMobile ? "80px 0" : "110px 0", borderTop: `1px solid ${BRD}` }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "360px 1fr" : "1fr", gap: isMobile ? 40 : 80 }}>

          <div style={{ position: isDesktop ? "sticky" : "relative", top: isDesktop ? 100 : 0, alignSelf: "start" }}>
            <Eyebrow>What We Do</Eyebrow>
            <h2 className="heading" style={{ fontSize: isMobile ? 38 : 52, marginBottom: 18 }}>
              Our core<br />
              <span className="heading-italic">services.</span>
            </h2>
            <p className="body-text" style={{ marginBottom: 28 }}>
              {company.services.length} specialist practice areas. Every project is led by seniors, not handed off to juniors.
            </p>
            <a href="#contact" className="btn-primary">Start a Project</a>
          </div>

          <div>
            {company.services.map((s, i) => (
              <div key={i} className="svc-row"
                onClick={() => setActive(active === i ? null : i)}
                style={{ padding: isMobile ? "18px 12px" : "22px 16px", marginBottom: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ width: 36, height: 36, borderRadius: 10, background: active === i ? IND : INDXL, border: `1px solid ${active === i ? IND : INDBRD}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 12, color: active === i ? "#fff" : IND, flexShrink: 0, transition: "all 0.2s" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: isMobile ? 19 : 24, color: active === i ? IND : TEXT, flex: 1, transition: "color 0.2s", letterSpacing: "-0.01em" }}>
                    {s.title}
                  </h3>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", border: `1.5px solid ${active === i ? IND : BRD}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: active === i ? IND : TEXT3, transform: active === i ? "rotate(45deg)" : "none", transition: "all 0.25s", flexShrink: 0 }}>
                    +
                  </div>
                </div>
                {active === i && has(s.description) && (
                  <p className="body-text" style={{ fontSize: 14, marginTop: 12, paddingLeft: 52 }}>
                    {s.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROJECTS
═══════════════════════════════════════════════════════════ */
function Projects({ company }) {
  const { isMobile, isDesktop } = useBreakpoint();

  const categoryColors = {
    "FinTech":    { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
    "HealthTech": { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
    "Logistics":  { bg: "#FFF7ED", text: "#9A3412", border: "#FED7AA" },
    "EdTech":     { bg: "#FAF5FF", text: "#6B21A8", border: "#E9D5FF" },
  };
  const defaultCat = { bg: INDXL, text: IND2, border: INDBRD };

  return (
    <section id="projects" style={{ background: BG3, padding: isMobile ? "80px 0" : "110px 0", borderTop: `1px solid ${BRD}` }}>
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 48 }}>
          <div>
            <Eyebrow>Our Work</Eyebrow>
            <h2 className="heading" style={{ fontSize: isMobile ? 38 : 52 }}>
              Featured<br />
              <span className="heading-italic">projects.</span>
            </h2>
          </div>
          {has(company.website) && (
            <a href={company.website} target="_blank" rel="noreferrer" className="btn-outline" style={{ alignSelf: "flex-end" }}>
              View All Work
            </a>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: 20 }}>
          {company.projects.map((p, i) => {
            const cat = categoryColors[p.category] || defaultCat;
            return (
              <a key={i} href={has(p.link) ? p.link : undefined}
                className="card"
                style={{ display: "block", padding: isMobile ? "28px 24px" : "36px 32px", cursor: has(p.link) ? "pointer" : "default" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    {has(p.category) && (
                      <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: 11, color: cat.text, background: cat.bg, border: `1px solid ${cat.border}`, padding: "4px 12px", borderRadius: 100, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        {p.category}
                      </span>
                    )}
                    {has(p.year) && (
                      <span className="label" style={{ fontSize: 10, color: TEXT3 }}>{p.year}</span>
                    )}
                  </div>
                  {has(p.link) && (
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: INDXL, border: `1px solid ${INDBRD}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={IND} strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                    </div>
                  )}
                </div>

                {/* Big number */}
                <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: isMobile ? 64 : 88, color: BG, lineHeight: 1, marginBottom: -8, letterSpacing: "-0.04em", userSelect: "none" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="heading" style={{ fontSize: isMobile ? 28 : 38, marginBottom: 12 }}>{p.name}</h3>
                {has(p.description) && (
                  <p className="body-text" style={{ fontSize: 14 }}>{p.description}</p>
                )}

                {/* Bottom accent */}
                <div style={{ height: 3, background: `linear-gradient(90deg, ${IND}, ${IND3})`, borderRadius: 3, marginTop: 24 }} />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEAM
═══════════════════════════════════════════════════════════ */
function Team({ company }) {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const cols = isMobile ? 1 : isTablet ? 2 : 3;
  const avatarBgs = [IND, IND2, "#7C3AED", "#0891B2", "#059669", "#DC2626"];

  return (
    <section id="team" style={{ background: BG, padding: isMobile ? "80px 0" : "110px 0", borderTop: `1px solid ${BRD}` }}>
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 48 }}>
          <div>
            <Eyebrow>Our People</Eyebrow>
            <h2 className="heading" style={{ fontSize: isMobile ? 38 : 52 }}>
              The team<br />
              <span className="heading-italic">behind it all.</span>
            </h2>
          </div>
          <p className="body-text" style={{ maxWidth: 340 }}>
            Senior experts only. No account managers — you speak directly with the people building your product.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>
          {company.members.map((m, i) => (
            <div key={i} className="card" style={{ padding: "28px 24px", cursor: has(m.url) ? "pointer" : "default" }}
              onClick={() => has(m.url) && window.open(m.url, "_blank")}>
              {has(m.image) ? (
                <img src={m.image} alt={m.name} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", marginBottom: 16, border: `2px solid ${BRD}` }} />
              ) : (
                <div style={{ width: 52, height: 52, borderRadius: 14, background: avatarBgs[i % avatarBgs.length], display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: 18, color: "#fff" }}>
                    {ini(m.name)}
                  </span>
                </div>
              )}
              <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 18, color: TEXT, marginBottom: 4 }}>{m.name}</h3>
              {has(m.position) && (
                <span className="label" style={{ fontSize: 10, display: "block", marginBottom: has(m.bio) ? 12 : 0 }}>{m.position}</span>
              )}
              {has(m.bio) && (
                <p className="body-text" style={{ fontSize: 13, lineHeight: 1.7 }}>{m.bio}</p>
              )}
              {has(m.url) && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14 }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: 12, color: IND }}>View Profile</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={IND} strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CLIENTS
═══════════════════════════════════════════════════════════ */
function Clients({ company }) {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const cols = isMobile ? 2 : isTablet ? 3 : 4;

  return (
    <section id="clients" style={{ background: BG3, padding: isMobile ? "80px 0" : "110px 0", borderTop: `1px solid ${BRD}` }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Eyebrow center>Trusted By</Eyebrow>
          <h2 className="heading" style={{ fontSize: isMobile ? 38 : 52, marginBottom: 14 }}>
            Clients &{" "}
            <span className="heading-italic">partners.</span>
          </h2>
          <p className="body-text" style={{ maxWidth: 460, margin: "0 auto" }}>
            From ambitious startups to established enterprises — across banking, health, logistics, and government.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 14 }}>
          {company.clients.map((c, i) => (
            <div key={i} className="client-tile"
              onClick={() => has(c.website) && window.open(c.website, "_blank")}
              style={{ cursor: has(c.website) ? "pointer" : "default" }}>
              {has(c.logo) ? (
                <img src={c.logo} alt={c.name} style={{ height: 36, objectFit: "contain", opacity: 0.6 }} />
              ) : (
                <div style={{ width: 44, height: 44, borderRadius: 12, background: INDXL, border: `1.5px solid ${INDBRD}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: 15, color: IND }}>
                    {ini(c.name)}
                  </span>
                </div>
              )}
              <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: 13, color: TEXT }}>{c.name}</span>
              {has(c.sector) && (
                <span className="label" style={{ fontSize: 9, color: TEXT3 }}>{c.sector}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   GALLERY
═══════════════════════════════════════════════════════════ */
function Gallery({ company }) {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const placeholderBgs = [
    `linear-gradient(135deg, ${IND} 0%, ${IND2} 100%)`,
    `linear-gradient(135deg, #0891B2 0%, #0E7490 100%)`,
    `linear-gradient(135deg, #059669 0%, #047857 100%)`,
    `linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)`,
    `linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)`,
    `linear-gradient(135deg, #D97706 0%, #B45309 100%)`,
  ];

  const GItem = ({ g, i, height }) => (
    <div className="gal-wrap" style={{ height, background: has(g.imageUrl) ? "transparent" : placeholderBgs[i % placeholderBgs.length] }}>
      {has(g.imageUrl) ? (
        <img src={g.imageUrl} alt={g.caption || ""} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: height > 200 ? 96 : 56, color: "rgba(255,255,255,0.15)", lineHeight: 1 }}>
            {String(i + 1).padStart(2, "0")}
          </span>
        </div>
      )}
      <div className="gal-overlay">
        {has(g.tag) && <span className="label" style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 4 }}>{g.tag}</span>}
        {has(g.caption) && <p style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 15, color: "#fff" }}>{g.caption}</p>}
      </div>
    </div>
  );

  return (
    <section id="gallery" style={{ background: BG, padding: isMobile ? "80px 0" : "110px 0", borderTop: `1px solid ${BRD}` }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Eyebrow center>Our Culture</Eyebrow>
          <h2 className="heading" style={{ fontSize: isMobile ? 38 : 52 }}>
            Behind the{" "}
            <span className="heading-italic">scenes.</span>
          </h2>
        </div>

        {isDesktop ? (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "280px 280px", gap: 14 }}>
            {company.gallery.map((g, i) => (
              <div key={i} style={{ gridColumn: i === 0 ? "1" : undefined, gridRow: i === 0 ? "1 / 3" : undefined }}>
                <GItem g={g} i={i} height={i === 0 ? 574 : 280} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isTablet ? "repeat(3,1fr)" : "repeat(2,1fr)", gap: 12 }}>
            {company.gallery.map((g, i) => <GItem key={i} g={g} i={i} height={isMobile ? 150 : 200} />)}
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONTACT
═══════════════════════════════════════════════════════════ */
function Contact({ company }) {
  const { isMobile, isDesktop } = useBreakpoint();
  const [form, setForm]    = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent]    = useState(false);
  const [loading, setLoad] = useState(false);
  const contacts = company.contacts || {};
  const addr     = company.address  || {};

  const contactRows = [
    has(contacts.email) && { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></svg>, label: "Email", value: contacts.email, href: `mailto:${contacts.email}` },
    has(contacts.phone) && { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6.07 6.07l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, label: "Phone", value: contacts.phone, href: `tel:${contacts.phone}` },
    has(company.website) && { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, label: "Website", value: company.website.replace(/^https?:\/\//, ""), href: company.website },
    has(addr.city) && { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, label: "Location", value: [addr.building, addr.city].filter(Boolean).join(", ") },
  ].filter(Boolean);

  const socials = [
    has(contacts.linkedin)  && { label: "LinkedIn",  href: contacts.linkedin  },
    has(contacts.twitter)   && { label: "Twitter",   href: contacts.twitter   },
    has(contacts.instagram) && { label: "Instagram", href: contacts.instagram },
    has(contacts.whatsapp)  && { label: "WhatsApp",  href: `https://wa.me/${(contacts.whatsapp || "").replace(/\D/g, "")}` },
    has(contacts.facebook)  && { label: "Facebook",  href: contacts.facebook  },
  ].filter(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoad(true);
    setTimeout(() => { setLoad(false); setSent(true); }, 1500);
  };

  return (
    <section id="contact" style={{ background: BG3, padding: isMobile ? "80px 0" : "110px 0", borderTop: `1px solid ${BRD}` }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: isMobile ? 48 : 80 }}>

          {/* Left info */}
          <div>
            <Eyebrow>Contact</Eyebrow>
            <h2 className="heading" style={{ fontSize: isMobile ? 40 : 56, marginBottom: 16, lineHeight: 1.08 }}>
              Let's build<br />
              <span className="heading-italic">something great.</span>
            </h2>
            <p className="body-text" style={{ marginBottom: 40, maxWidth: 400 }}>
              Drop us a message and we'll respond within 24 hours. No commitment, just a conversation.
            </p>

            {contactRows.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 36, borderRadius: 12, overflow: "hidden", border: `1.5px solid ${BRD}` }}>
                {contactRows.map(({ icon, label, value, href }, i) => (
                  <div key={label}
                    onClick={() => href && window.open(href, href.startsWith("mailto") || href.startsWith("tel") ? "_self" : "_blank")}
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: BG, borderBottom: i < contactRows.length - 1 ? `1px solid ${BRD}` : "none", cursor: href ? "pointer" : "default", transition: "background 0.2s" }}
                    onMouseEnter={e => { if (href) e.currentTarget.style.background = INDXL; }}
                    onMouseLeave={e => e.currentTarget.style.background = BG}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: INDXL, border: `1px solid ${INDBRD}`, display: "flex", alignItems: "center", justifyContent: "center", color: IND, flexShrink: 0 }}>
                      {icon}
                    </div>
                    <div>
                      <span className="label" style={{ fontSize: 9, display: "block", color: TEXT3, marginBottom: 2 }}>{label}</span>
                      <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 500, fontSize: 13, color: TEXT2 }}>{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {socials.length > 0 && (
              <div>
                <span className="label" style={{ fontSize: 10, color: TEXT3, display: "block", marginBottom: 14 }}>Follow Us</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {socials.map(({ label, href }) => (
                    <a key={label} href={href} target="_blank" rel="noreferrer"
                      style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: 12, color: TEXT2, padding: "8px 16px", border: `1.5px solid ${BRD}`, borderRadius: 8, transition: "all 0.2s" }}
                      onMouseEnter={e => { e.target.style.borderColor = IND; e.target.style.color = IND; e.target.style.background = INDXL; }}
                      onMouseLeave={e => { e.target.style.borderColor = BRD; e.target.style.color = TEXT2; e.target.style.background = "transparent"; }}>
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div style={{ background: BG, border: `1.5px solid ${BRD}`, borderRadius: 20, padding: isMobile ? "28px 24px" : "44px 40px" }}>
            {sent ? (
              <div style={{ minHeight: 360, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: INDXL, border: `2px solid ${INDBRD}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: `0 0 24px rgba(99,102,241,0.2)` }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={IND} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="heading" style={{ fontSize: 30, marginBottom: 10 }}>Message Sent!</h3>
                <p className="body-text" style={{ maxWidth: 260, marginBottom: 28 }}>We'll get back to you within 24 hours.</p>
                <button className="btn-outline" onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", message: "" }); }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label className="label" style={{ fontSize: 10, display: "block", marginBottom: 8, color: TEXT3 }}>Full Name *</label>
                  <input className="form-field" type="text" placeholder="Your full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="label" style={{ fontSize: 10, display: "block", marginBottom: 8, color: TEXT3 }}>Email Address *</label>
                  <input className="form-field" type="email" placeholder="you@company.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                </div>
                <div>
                  <label className="label" style={{ fontSize: 10, display: "block", marginBottom: 8, color: TEXT3 }}>Phone</label>
                  <input className="form-field" type="tel" placeholder="+91 00000 00000" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="label" style={{ fontSize: 10, display: "block", marginBottom: 8, color: TEXT3 }}>Message *</label>
                  <textarea className="form-field" rows={isMobile ? 4 : 5} placeholder="Tell us about your project…" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required style={{ resize: "none" }} />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}
                  style={{ alignSelf: "flex-start", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
                  {loading ? "Sending…" : "Send Message"}
                  {!loading && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════ */
function Footer({ company }) {
  const { isMobile } = useBreakpoint();
  const contacts = company.contacts || {};
  const addr     = company.address  || {};
  const locStr   = [addr.city, addr.state, addr.country].filter(Boolean).join(", ");

  const navLinks = [
    has(company.about)    && { label: "About",    href: "#about"    },
    has(company.services) && { label: "Services", href: "#services" },
    has(company.projects) && { label: "Work",     href: "#projects" },
    has(company.members)  && { label: "Team",     href: "#team"     },
    has(company.clients)  && { label: "Clients",  href: "#clients"  },
    has(company.gallery)  && { label: "Gallery",  href: "#gallery"  },
                             { label: "Contact",  href: "#contact"  },
  ].filter(Boolean);

  const socialLinks = [
    has(contacts.linkedin)  && { label: "LinkedIn",  href: contacts.linkedin  },
    has(contacts.twitter)   && { label: "Twitter",   href: contacts.twitter   },
    has(contacts.instagram) && { label: "Instagram", href: contacts.instagram },
    has(contacts.whatsapp)  && { label: "WhatsApp",  href: `https://wa.me/${(contacts.whatsapp||"").replace(/\D/g,"")}` },
  ].filter(Boolean);

  return (
    <footer style={{ background: TEXT, padding: isMobile ? "56px 0 28px" : "72px 0 36px" }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr", gap: isMobile ? 36 : 56, paddingBottom: 40, borderBottom: `1px solid rgba(255,255,255,0.1)` }}>

          {/* Brand */}
          <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              {has(company.logo) ? (
                <img src={company.logo} alt={company.companyName} style={{ height: 28, objectFit: "contain" }} />
              ) : (
                <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${IND}, ${IND2})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: 13, color: "#fff" }}>
                    {ini(company.companyName)}
                  </span>
                </div>
              )}
              <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 17, color: "#fff" }}>
                {company.companyName}
              </span>
            </div>
            {has(company.about) && (
              <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 300, fontSize: 14, color: "#9CA3AF", lineHeight: 1.7, maxWidth: 280, marginBottom: 14 }}>
                {company.about.slice(0, 110)}{company.about.length > 110 ? "…" : ""}
              </p>
            )}
            {has(locStr) && (
              <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 500, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280" }}>{locStr}</span>
            )}
          </div>

          {/* Nav */}
          <div>
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6B7280", display: "block", marginBottom: 18 }}>Navigate</span>
            {navLinks.map(l => (
              <a key={l.label} href={l.href}
                style={{ display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400, fontSize: 14, color: "#9CA3AF", marginBottom: 12, transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "#9CA3AF"}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Connect */}
          {socialLinks.length > 0 && (
            <div>
              <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6B7280", display: "block", marginBottom: 18 }}>Connect</span>
              {socialLinks.map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                  style={{ display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400, fontSize: 14, color: "#9CA3AF", marginBottom: 12, transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "#fff"}
                  onMouseLeave={e => e.target.style.color = "#9CA3AF"}>
                  {l.label}
                </a>
              ))}
              {has(company.website) && (
                <a href={company.website} target="_blank" rel="noreferrer"
                  style={{ display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400, fontSize: 14, color: IND3, marginBottom: 12, transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "#fff"}
                  onMouseLeave={e => e.target.style.color = IND3}>
                  Website ↗
                </a>
              )}
            </div>
          )}
        </div>

        <div style={{ paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 300, fontSize: 13, color: "#6B7280" }}>
            © {YR} {company.companyName}. All rights reserved.
          </span>
          {(has(company.businessPark) || has(company.foundedYear)) && (
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 500, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4B5563" }}>
              {[company.businessPark !== "Other" ? company.businessPark : null, has(company.foundedYear) && `Est. ${company.foundedYear}`].filter(Boolean).join(" · ")}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
export default function Company7({ data }) {
  const company = data && Object.keys(data).length > 0 ? data : DUMMY;
  return (
    <>
      <GlobalStyles />
      <Nav     company={company} />
      <Hero    company={company} />
      {has(company.about)    && <About    company={company} />}
      {has(company.services) && <Services company={company} />}
      {has(company.projects) && <Projects company={company} />}
      {has(company.members)  && <Team     company={company} />}
      {has(company.clients)  && <Clients  company={company} />}
      {has(company.gallery)  && <Gallery  company={company} />}
      <Contact company={company} />
      <Footer  company={company} />
    </>
  );
}