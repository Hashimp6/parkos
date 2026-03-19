import { useState, useEffect, useRef } from "react";

/* ─── Dummy Data ─────────────────────────────────────────────────────────── */
const DUMMY = {
  companyName: "Nexora Technologies",
  tagline: "We build the systems that power tomorrow.",
  industry: "Software & AI",
  companySize: "51–200",
  foundedYear: 2017,
  about:
    "Nexora is a full-stack technology company specialising in enterprise software, cloud infrastructure, and AI-powered automation. Founded in Technopark, Thiruvananthapuram, we partner with businesses across India and Southeast Asia to design, build, and scale digital products that create lasting impact.",
  logo: "",
  banner: "",
  businessPark: "Technopark",
  address: {
    building: "Tower B, Floor 7",
    street: "Rajiv Gandhi IT Park",
    city: "Thiruvananthapuram",
    state: "Kerala",
    pincode: "695581",
    country: "India",
  },
  website: "https://nexora.io",
  tags: ["AI", "SaaS", "Enterprise", "Cloud", "DevOps"],
  contacts: {
    email: "hello@nexora.io",
    phone: "+91 98765 43210",
    linkedin: "#",
    twitter: "#",
    instagram: "#",
    facebook: "#",
    whatsapp: "#",
  },
  members: [
    { name: "Arjun Menon",   position: "CEO & Co-founder",        image: "", url: "" },
    { name: "Priya Nair",    position: "Chief Technology Officer", image: "", url: "" },
    { name: "Rohit Das",     position: "Head of Design",          image: "", url: "" },
    { name: "Sneha Pillai",  position: "Lead Engineer",           image: "", url: "" },
    { name: "Vikram Iyer",   position: "VP Sales",                image: "", url: "" },
    { name: "Meera Thomas",  position: "Product Manager",         image: "", url: "" },
  ],
  services: [
    { title: "AI & Automation",       description: "Intelligent automation pipelines, LLM integration, and predictive analytics tailored to your domain." },
    { title: "Cloud Architecture",    description: "Resilient, cost-efficient AWS/GCP/Azure infrastructure designed for scale from day one." },
    { title: "Product Engineering",   description: "End-to-end product development from UX research and prototyping through launch and iteration." },
    { title: "Data & Analytics",      description: "Real-time dashboards, ETL pipelines, and ML-driven insights that turn raw data into decisions." },
    { title: "Enterprise Integration",description: "Seamlessly connect legacy systems, third-party APIs, and modern microservices architectures." },
    { title: "Security & Compliance", description: "Penetration testing, VAPT, ISO 27001 readiness, and ongoing security monitoring." },
  ],
  projects: [
    { name: "OrbitCMS",    description: "Headless CMS powering 200+ enterprise sites globally, handling 50M+ requests per month.", link: "" },
    { name: "FluxOps",     description: "DevOps automation platform reducing deployment cycles by 60% for mid-market teams.",      link: "" },
    { name: "AuraAI",      description: "Conversational AI for fintech customer support — 94% automated resolution rate.",         link: "" },
    { name: "DataBridge",  description: "Real-time data sync middleware used by 3 national banks across India.",                   link: "" },
  ],
  clients: [
    { name: "Infosys",       logo: "", website: "" },
    { name: "UST Global",    logo: "", website: "" },
    { name: "Tata Elxsi",   logo: "", website: "" },
    { name: "IBS Group",    logo: "", website: "" },
    { name: "Ernst & Young", logo: "", website: "" },
    { name: "KPMG",          logo: "", website: "" },
    { name: "Wipro",         logo: "", website: "" },
    { name: "HCLTech",       logo: "", website: "" },
  ],
  gallery: [
    { imageUrl: "", caption: "Team offsite 2024" },
    { imageUrl: "", caption: "Product launch — AuraAI" },
    { imageUrl: "", caption: "Annual Hackathon" },
    { imageUrl: "", caption: "Technopark HQ" },
    { imageUrl: "", caption: "Design sprint workshop" },
    { imageUrl: "", caption: "Client summit 2023" },
  ],
};

/* ─── Utils ──────────────────────────────────────────────────────────────── */
const has = (v) => {
  if (v == null) return false;
  if (typeof v === "string") return v.trim() !== "";
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") return Object.values(v).some(has);
  return !!v;
};
const merge = (r, f) => {
  if (!r) return f;
  const o = { ...f };
  Object.keys(r).forEach((k) => { if (has(r[k])) o[k] = r[k]; });
  return o;
};
const ini = (n = "") => n.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
const AV_COLORS = ["#1b3a2d","#163028","#0f2d20","#1a3325","#122b1f","#0d2619"];
const avc = (n = "") => AV_COLORS[n.charCodeAt(0) % AV_COLORS.length];
const YR = new Date().getFullYear();

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const Icon = {
  mail:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></svg>,
  phone:   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6.07 6.07l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  globe:   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  pin:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  arrow:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ext:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  menu:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  li:      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  tw:      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  ig:      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>,
  fb:      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  wa:      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>,
};

/* ─── Color tokens ────────────────────────────────────────────────────────── */
// G = dark green family   W = white/light family
const G = {
  deepest:  "#0b1f14",   // near-black green – hero bg, footer
  dark:     "#122b1c",   // dark section bg
  mid:      "#1a3d28",   // navbar, cards on dark
  rich:     "#1e4d30",   // accent fills
  base:     "#2d6a4f",   // primary brand green
  muted:    "#40916c",   // secondary green
  light:    "#74c69d",   // light accent, highlights
  pale:     "#d8f3dc",   // very light green tint
  ghost:    "#f0faf3",   // near-white with green tint
};
const W = {
  pure:     "#ffffff",
  off:      "#f7faf8",
  soft:     "#eef5f1",
  muted:    "rgba(255,255,255,0.7)",
  faint:    "rgba(255,255,255,0.35)",
  hairline: "rgba(255,255,255,0.1)",
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function Company5({ data: rawData }) {
  const D = merge(rawData, DUMMY);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (id) => {
    document.getElementById("sec-" + id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const addr = D.address || {};
  const addrStr = [addr.building, addr.street, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ");

  const navLinks = [
    { k: "about",    l: "About"    },
    has(D.services)  && { k: "services",  l: "Services"  },
    has(D.projects)  && { k: "projects",  l: "Work"      },
    has(D.members)   && { k: "team",      l: "Team"      },
    has(D.clients)   && { k: "clients",   l: "Clients"   },
    has(D.gallery)   && { k: "gallery",   l: "Gallery"   },
    { k: "contact",  l: "Contact"  },
  ].filter(Boolean);

  const socials = [
    has(D.contacts?.linkedin)  && { icon: Icon.li, href: D.contacts.linkedin,  t: "LinkedIn"  },
    has(D.contacts?.twitter)   && { icon: Icon.tw, href: D.contacts.twitter,   t: "Twitter"   },
    has(D.contacts?.instagram) && { icon: Icon.ig, href: D.contacts.instagram, t: "Instagram" },
    has(D.contacts?.facebook)  && { icon: Icon.fb, href: D.contacts.facebook,  t: "Facebook"  },
    has(D.contacts?.whatsapp)  && { icon: Icon.wa, href: `https://wa.me/${D.contacts.whatsapp}`, t: "WhatsApp" },
  ].filter(Boolean);

  /* ── shared style helpers ── */
  const sectionPad = { padding: "96px 32px" };
  const maxW = { maxWidth: 1200, margin: "0 auto" };

  const eyebrow = (txt, light = false) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 28, height: 2, background: light ? G.light : G.base, borderRadius: 2 }} />
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: light ? G.light : G.base, fontFamily: "'Outfit', sans-serif" }}>{txt}</span>
    </div>
  );

  const h2 = (txt, light = false) => (
    <h2 style={{ margin: "0 0 20px", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: light ? W.pure : G.deepest, fontFamily: "'Syne', sans-serif" }}>
      {txt}
    </h2>
  );

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: W.off, color: G.deepest, overflowX: "hidden" }}>

      {/* ── Google Fonts ── */}
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }
        ::selection { background: ${G.base}; color: #fff; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fu  { animation: fadeUp 0.65s ease both; }
        .fu1 { animation: fadeUp 0.65s 0.12s ease both; }
        .fu2 { animation: fadeUp 0.65s 0.24s ease both; }
        .fu3 { animation: fadeUp 0.65s 0.36s ease both; }

        .card {
          background: #fff;
          border: 1px solid ${G.pale};
          border-radius: 14px;
          box-shadow: 0 2px 16px rgba(18,43,28,0.06);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 48px rgba(18,43,28,0.12);
          border-color: ${G.muted};
        }

        .dark-card {
          background: ${G.mid};
          border: 1px solid rgba(116,198,157,0.14);
          border-radius: 14px;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }
        .dark-card:hover {
          transform: translateY(-4px);
          border-color: rgba(116,198,157,0.4);
        }

        .nav-btn {
          background: none; border: none; cursor: pointer; padding: 0;
          font: 600 12px/1 'Outfit', sans-serif;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255,255,255,0.65); transition: color 0.2s;
        }
        .nav-btn:hover { color: ${G.light}; }

        .primary-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; border-radius: 8px; border: none;
          background: ${G.base}; color: #fff;
          font: 600 14px/1 'Outfit', sans-serif;
          cursor: pointer; text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }
        .primary-btn:hover { background: ${G.muted}; transform: translateY(-1px); }

        .outline-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 26px; border-radius: 8px;
          border: 1.5px solid ${G.base}; background: transparent;
          color: ${G.base}; font: 600 14px/1 'Outfit', sans-serif;
          cursor: pointer; text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }
        .outline-btn:hover { background: ${G.ghost}; transform: translateY(-1px); }

        .outline-btn-white {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 26px; border-radius: 8px;
          border: 1.5px solid rgba(255,255,255,0.4); background: transparent;
          color: #fff; font: 600 14px/1 'Outfit', sans-serif;
          cursor: pointer; text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }
        .outline-btn-white:hover { background: rgba(255,255,255,0.1); transform: translateY(-1px); }

        .social-btn {
          width: 40px; height: 40px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.55); text-decoration: none;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .social-btn:hover {
          background: ${G.base}; color: #fff; border-color: ${G.base};
        }

        .contact-link {
          display: flex; align-items: center; gap: 14px;
          color: rgba(255,255,255,0.6); text-decoration: none;
          font-size: 15px; transition: color 0.2s;
        }
        .contact-link:hover { color: #fff; }

        .tag {
          font-size: 12px; color: ${G.muted}; padding: 4px 12px;
          border-radius: 100px; border: 1px solid ${G.pale};
          background: ${G.ghost}; font-family: 'Outfit', sans-serif;
        }

        @media (max-width: 820px) {
          .two-col  { grid-template-columns: 1fr !important; gap: 48px !important; }
          .three-col{ grid-template-columns: 1fr 1fr !important; }
          .four-col { grid-template-columns: repeat(2,1fr) !important; }
          .hide-mob { display: none !important; }
          .show-mob { display: flex !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, height: 68,
        background: scrolled ? G.dark : "transparent",
        borderBottom: scrolled ? `1px solid ${W.hairline}` : "1px solid transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        transition: "all 0.3s ease",
        display: "flex", alignItems: "center",
      }}>
        <div style={{ ...maxW, padding: "0 32px", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => go("hero")}>
            {has(D.logo) ? (
              <img src={D.logo} alt="logo" style={{ height: 36, objectFit: "contain" }} />
            ) : (
              <div style={{ width: 38, height: 38, borderRadius: 9, background: G.base, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif" }}>
                {ini(D.companyName)}
              </div>
            )}
            <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.01em" }}>
              {D.companyName}
            </span>
          </div>

          {/* Desktop links */}
          <div className="hide-mob" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {navLinks.map(({ k, l }) => (
              <button key={k} className="nav-btn" onClick={() => go(k)}>{l}</button>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {has(D.contacts?.email) && (
              <a href={`mailto:${D.contacts.email}`} className="primary-btn hide-mob" style={{ padding: "9px 20px", fontSize: 13 }}>
                Get In Touch
              </a>
            )}
            <button className="show-mob" onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", display: "none", alignItems: "center" }}>
              {menuOpen ? Icon.close : Icon.menu}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ position: "absolute", top: 68, left: 0, right: 0, background: G.dark, borderBottom: `1px solid ${W.hairline}`, padding: "12px 32px 20px" }}>
            {navLinks.map(({ k, l }) => (
              <div key={k} onClick={() => go(k)}
                style={{ padding: "14px 0", borderBottom: `1px solid ${W.hairline}`, fontSize: 14, fontWeight: 600, cursor: "pointer", color: "rgba(255,255,255,0.7)", fontFamily: "'Syne', sans-serif", letterSpacing: "0.05em" }}>
                {l}
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section id="sec-hero" style={{
        minHeight: "100vh", paddingTop: 68,
        background: `linear-gradient(160deg, ${G.deepest} 0%, ${G.dark} 55%, ${G.rich} 100%)`,
        display: "flex", flexDirection: "column", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* BG leaf pattern */}
        <svg style={{ position: "absolute", right: "-3%", top: "50%", transform: "translateY(-50%)", opacity: 0.06, pointerEvents: "none" }} width="520" height="520" viewBox="0 0 520 520">
          {[60, 120, 180, 240, 300, 360].map(r => <circle key={r} cx="520" cy="260" r={r} fill="none" stroke={G.light} strokeWidth="1" />)}
        </svg>
        <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle, rgba(45,106,79,0.18) 0%, transparent 70%)`, pointerEvents: "none" }} />

        <div style={{ ...maxW, padding: "80px 32px 72px", position: "relative", zIndex: 1, width: "100%" }}>
          <div style={{ maxWidth: 760 }}>

            {/* Location badge */}
            {(has(D.businessPark) || has(addr.city)) && (
              <div className="fu" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, padding: "6px 14px 6px 8px", background: "rgba(116,198,157,0.12)", border: `1px solid rgba(116,198,157,0.25)`, borderRadius: 100 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: G.light }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: G.light, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif" }}>
                  {[D.businessPark, addr.city].filter(Boolean).join(" · ")}
                </span>
              </div>
            )}

            {/* Headline */}
            <h1 className="fu1" style={{
              margin: "0 0 22px",
              fontSize: "clamp(38px,5.5vw,76px)", fontWeight: 800,
              letterSpacing: "-0.04em", lineHeight: 1.06,
              color: "#fff", fontFamily: "'Syne', sans-serif",
            }}>
              {D.tagline}
            </h1>

            {has(D.about) && (
              <p className="fu2" style={{ margin: "0 0 36px", fontSize: 18, lineHeight: 1.75, color: W.muted, fontWeight: 300, maxWidth: 580 }}>
                {D.about.length > 160 ? D.about.slice(0, 160) + "…" : D.about}
              </p>
            )}

            <div className="fu3" style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 48 }}>
              <button className="primary-btn" onClick={() => go("services")} style={{ fontSize: 15, padding: "14px 32px" }}>
                Our Services {Icon.arrow}
              </button>
              <button className="outline-btn-white" onClick={() => go("contact")} style={{ fontSize: 15, padding: "13px 30px" }}>
                Contact Us
              </button>
            </div>

            {has(D.tags) && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {D.tags.map(t => (
                  <span key={t} style={{ fontSize: 12, color: W.faint, padding: "4px 12px", borderRadius: 100, border: `1px solid rgba(255,255,255,0.15)`, background: "rgba(255,255,255,0.05)", fontFamily: "'Outfit', sans-serif" }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 36, position: "relative", zIndex: 1 }}>
          <div onClick={() => go("about")} style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 7, opacity: 0.35, transition: "opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
            onMouseLeave={e => e.currentTarget.style.opacity = "0.35"}>
            <span style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff", fontFamily: "'Outfit',sans-serif" }}>Scroll</span>
            <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
              <rect x="1" y="1" width="12" height="20" rx="6" stroke="white" strokeWidth="1.5" />
              <circle cx="7" cy="7" r="2" fill="white">
                <animate attributeName="cy" values="7;13;7" dur="1.5s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div style={{ background: G.base, display: "grid", gridTemplateColumns: "repeat(4,1fr)" }} className="four-col">
        {[
          { n: `${YR - D.foundedYear}+`, l: "Years Experience" },
          { n: `${D.members.length}+`,   l: "Team Members"     },
          { n: `${D.clients.length}+`,   l: "Clients Served"   },
          { n: `${D.projects.length}+`,  l: "Projects Delivered"},
        ].map(({ n, l }, i) => (
          <div key={i} style={{ padding: "36px 20px", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.18)" : "none" }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em", lineHeight: 1 }}>{n}</div>
            <div style={{ marginTop: 6, fontSize: 11, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{l}</div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════ */}
      {has(D.about) && (
        <section id="sec-about" style={{ ...sectionPad, background: W.off }}>
          <div className="two-col" style={{ ...maxW, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

            <div>
              {eyebrow("Who We Are")}
              {h2(D.companyName)}
              <p style={{ margin: "0 0 28px", fontSize: 16, lineHeight: 1.85, color: "#445", fontWeight: 300 }}>{D.about}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {has(D.website) && <a href={D.website} target="_blank" rel="noreferrer" className="primary-btn">Visit Website {Icon.ext}</a>}
                <button className="outline-btn" onClick={() => go("contact")}>Talk to Us</button>
              </div>
            </div>

            {/* Info cards grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                has(D.industry)     && { l: "Industry",   v: D.industry     },
                has(D.companySize)  && { l: "Team Size",  v: D.companySize  },
                has(D.foundedYear)  && { l: "Founded",    v: D.foundedYear  },
                has(D.businessPark) && { l: "Location",   v: D.businessPark },
              ].filter(Boolean).map(({ l, v }) => (
                <div key={l} className="card" style={{ padding: "24px 20px" }}>
                  <p style={{ margin: "0 0 6px", fontSize: 10, color: G.muted, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: "'Outfit', sans-serif" }}>{l}</p>
                  <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: G.deepest, fontFamily: "'Syne', sans-serif" }}>{v}</p>
                </div>
              ))}
              {/* Address card */}
              {has(addrStr) && (
                <div className="card" style={{ padding: "22px 20px", gridColumn: "1 / -1", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ color: G.base, marginTop: 2, flexShrink: 0 }}>{Icon.pin}</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "#667" }}>{addrStr}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          SERVICES
      ══════════════════════════════════════════ */}
      {has(D.services) && (
        <section id="sec-services" style={{ ...sectionPad, background: G.dark }}>
          <div style={maxW}>
            <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 56px" }}>
              {eyebrow("What We Do", true)}
              {h2("Our Services", true)}
              <p style={{ margin: 0, fontSize: 16, color: W.muted, lineHeight: 1.75, fontWeight: 300 }}>
                End-to-end technology solutions built for scale, reliability, and lasting impact.
              </p>
            </div>

            <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
              {D.services.map((s, i) => (
                <div key={i} className="dark-card" style={{ padding: "32px 28px" }}>
                  <div style={{ width: 46, height: 46, borderRadius: 10, background: "rgba(116,198,157,0.12)", border: `1px solid rgba(116,198,157,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 14, fontWeight: 800, color: G.light, fontFamily: "'Syne', sans-serif" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>{s.title}</h3>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: W.muted, fontWeight: 300 }}>{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          PROJECTS
      ══════════════════════════════════════════ */}
      {has(D.projects) && (
        <section id="sec-projects" style={{ ...sectionPad, background: W.off }}>
          <div style={maxW}>
            <div style={{ marginBottom: 52 }}>
              {eyebrow("Portfolio")}
              {h2("Featured Work")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 22 }}>
              {D.projects.map((p, i) => {
                const bgs = [`linear-gradient(135deg,${G.deepest} 0%,${G.rich} 100%)`, `linear-gradient(135deg,${G.dark} 0%,${G.base} 100%)`, `linear-gradient(135deg,#0a1a0f 0%,${G.mid} 100%)`, `linear-gradient(135deg,${G.rich} 0%,${G.muted} 100%)`];
                return (
                  <div key={i} className="card" style={{ overflow: "hidden" }}>
                    <div style={{ height: 140, background: bgs[i % bgs.length], display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 40, fontWeight: 800, color: "rgba(255,255,255,0.1)", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.04em" }}>
                        {p.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div style={{ padding: "24px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: G.deepest, fontFamily: "'Syne',sans-serif" }}>{p.name}</h3>
                        {has(p.link) && <a href={p.link} target="_blank" rel="noreferrer" style={{ color: G.base }}>{Icon.ext}</a>}
                      </div>
                      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#667", fontWeight: 300 }}>{p.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          TEAM
      ══════════════════════════════════════════ */}
      {has(D.members) && (
        <section id="sec-team" style={{ ...sectionPad, background: G.deepest }}>
          <div style={maxW}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              {eyebrow("The People", true)}
              {h2("Meet Our Team", true)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 20 }}>
              {D.members.map((m, i) => (
                <div key={i} className="dark-card" style={{ padding: "30px 18px", textAlign: "center", cursor: has(m.url) ? "pointer" : "default" }}
                  onClick={() => has(m.url) && window.open(m.url, "_blank")}>
                  {has(m.image) ? (
                    <img src={m.image} alt={m.name} style={{ width: 76, height: 76, borderRadius: "50%", objectFit: "cover", margin: "0 auto 14px", display: "block", border: `3px solid ${G.rich}` }} />
                  ) : (
                    <div style={{ width: 76, height: 76, borderRadius: "50%", background: G.rich, border: `3px solid rgba(116,198,157,0.25)`, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: G.light, fontFamily: "'Syne',sans-serif" }}>
                      {ini(m.name)}
                    </div>
                  )}
                  <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "'Syne',sans-serif" }}>{m.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: W.faint, lineHeight: 1.5 }}>{m.position}</p>
                  {has(m.url) && <p style={{ margin: "10px 0 0", fontSize: 12, color: G.light, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>Profile {Icon.ext}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          CLIENTS
      ══════════════════════════════════════════ */}
      {has(D.clients) && (
        <section id="sec-clients" style={{ ...sectionPad, background: W.soft }}>
          <div style={maxW}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              {eyebrow("Trusted By")}
              {h2("Clients & Partners")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))" }}>
              {D.clients.map((c, i) => (
                <div key={i}
                  onClick={() => has(c.website) && window.open(c.website, "_blank")}
                  style={{ padding: "28px 18px", textAlign: "center", border: `1px solid ${G.pale}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, cursor: has(c.website) ? "pointer" : "default", transition: "background 0.2s", background: "#fff" }}
                  onMouseEnter={e => e.currentTarget.style.background = G.ghost}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  {has(c.logo) ? (
                    <img src={c.logo} alt={c.name} style={{ height: 36, objectFit: "contain", filter: "grayscale(1)", opacity: 0.5, transition: "all 0.2s" }}
                      onMouseEnter={e => { e.target.style.filter = "none"; e.target.style.opacity = "1"; }}
                      onMouseLeave={e => { e.target.style.filter = "grayscale(1)"; e.target.style.opacity = "0.5"; }} />
                  ) : (
                    <div style={{ width: 44, height: 44, borderRadius: 9, background: G.ghost, border: `1px solid ${G.pale}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: G.base, fontFamily: "'Syne',sans-serif" }}>
                      {ini(c.name)}
                    </div>
                  )}
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#445", fontFamily: "'Syne',sans-serif" }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          GALLERY
      ══════════════════════════════════════════ */}
      {has(D.gallery) && (
        <section id="sec-gallery" style={{ ...sectionPad, background: W.off }}>
          <div style={maxW}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              {eyebrow(`Life at ${D.companyName}`)}
              {h2("Gallery")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
              {D.gallery.map((g, i) => {
                const bgs = [G.deepest, G.dark, G.mid, "#0a1a10", "#0e2118", "#091510"];
                return has(g.imageUrl) ? (
                  <div key={i} style={{ borderRadius: 12, overflow: "hidden", position: "relative" }}>
                    <img src={g.imageUrl} alt={g.caption} style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", display: "block" }} />
                    {has(g.caption) && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 14px", background: "linear-gradient(transparent,rgba(0,0,0,0.65))", fontSize: 12, color: "#eee" }}>{g.caption}</div>}
                  </div>
                ) : (
                  <div key={i} style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "16/10", background: bgs[i % bgs.length], display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(116,198,157,0.25)" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                    {has(g.caption) && <p style={{ margin: 0, fontSize: 12, color: "rgba(116,198,157,0.35)", textAlign: "center", padding: "0 16px" }}>{g.caption}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════ */}
      <section id="sec-contact" style={{ ...sectionPad, background: G.dark }}>
        <div className="two-col" style={{ ...maxW, display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 80, alignItems: "start" }}>

          {/* Left: info */}
          <div>
            {eyebrow("Get In Touch", true)}
            <h2 style={{ margin: "0 0 18px", fontSize: "clamp(30px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#fff", fontFamily: "'Syne',sans-serif" }}>
              Let's build something<br />
              <span style={{ color: G.light }}>great together.</span>
            </h2>
            <p style={{ margin: "0 0 44px", fontSize: 16, lineHeight: 1.8, color: W.muted, fontWeight: 300, maxWidth: 440 }}>
              Have a project in mind, or just want to explore possibilities? We'd love to hear from you.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 40 }}>
              {[
                has(D.contacts?.email) && { href: `mailto:${D.contacts.email}`, icon: Icon.mail, text: D.contacts.email },
                has(D.contacts?.phone) && { href: `tel:${D.contacts.phone}`,    icon: Icon.phone, text: D.contacts.phone },
                has(D.website)         && { href: D.website, icon: Icon.globe,  text: D.website.replace(/^https?:\/\//, "") },
              ].filter(Boolean).map(({ href, icon, text }) => (
                <a key={text} href={href} target="_blank" rel="noreferrer" className="contact-link">
                  <div style={{ width: 42, height: 42, borderRadius: 9, background: "rgba(116,198,157,0.1)", border: "1px solid rgba(116,198,157,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {icon}
                  </div>
                  {text}
                </a>
              ))}
              {has(addrStr) && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, color: W.faint, fontSize: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 9, background: "rgba(116,198,157,0.1)", border: "1px solid rgba(116,198,157,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {Icon.pin}
                  </div>
                  <span style={{ paddingTop: 12, lineHeight: 1.6 }}>{addrStr}</span>
                </div>
              )}
            </div>

            {/* Social icons */}
            {socials.length > 0 && (
              <div>
                <p style={{ margin: "0 0 12px", fontSize: 11, color: W.faint, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Outfit',sans-serif" }}>Follow Us</p>
                <div style={{ display: "flex", gap: 10 }}>
                  {socials.map(({ icon, href, t }) => (
                    <a key={t} href={href} target="_blank" rel="noreferrer" title={t} className="social-btn">{icon}</a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: contact form */}
          <div style={{ background: G.mid, border: `1px solid rgba(116,198,157,0.15)`, borderRadius: 16, padding: "36px 32px" }}>
            <p style={{ margin: "0 0 24px", fontSize: 16, fontWeight: 600, color: "#fff", fontFamily: "'Syne',sans-serif" }}>Send a Message</p>
            {[
              { ph: "Your full name",    type: "text"     },
              { ph: "Email address",     type: "email"    },
              { ph: "Phone (optional)",  type: "tel"      },
            ].map(({ ph, type }) => (
              <input key={ph} type={type} placeholder={ph} style={{
                display: "block", width: "100%", marginBottom: 14,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(116,198,157,0.18)",
                borderRadius: 8, padding: "12px 16px", color: "#fff", fontSize: 14,
                fontFamily: "'Outfit',sans-serif", outline: "none",
              }}
              onFocus={e => e.target.style.borderColor = "rgba(116,198,157,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(116,198,157,0.18)"}
              />
            ))}
            <textarea placeholder="Tell us about your project…" rows={4} style={{
              display: "block", width: "100%", marginBottom: 18,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(116,198,157,0.18)",
              borderRadius: 8, padding: "12px 16px", color: "#fff", fontSize: 14,
              fontFamily: "'Outfit',sans-serif", outline: "none", resize: "vertical",
            }}
            onFocus={e => e.target.style.borderColor = "rgba(116,198,157,0.5)"}
            onBlur={e => e.target.style.borderColor = "rgba(116,198,157,0.18)"}
            />
            <button style={{
              width: "100%", background: G.base, color: "#fff", border: "none",
              borderRadius: 8, padding: "14px", fontSize: 15, fontWeight: 600,
              fontFamily: "'Syne',sans-serif", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = G.muted}
            onMouseLeave={e => e.currentTarget.style.background = G.base}>
              Send Message {Icon.arrow}
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: G.deepest, padding: "28px 32px", borderTop: `1px solid rgba(116,198,157,0.1)` }}>
        <div style={{ ...maxW, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: G.base, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff", fontFamily: "'Syne',sans-serif" }}>
              {ini(D.companyName)}
            </div>
            <span style={{ fontSize: 13, color: W.faint, fontFamily: "'Outfit',sans-serif" }}>
              © {YR} {D.companyName}. All rights reserved.
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {socials.slice(0, 4).map(({ icon, href, t }) => (
              <a key={t} href={href} target="_blank" rel="noreferrer" title={t} style={{ color: W.faint, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = G.light}
                onMouseLeave={e => e.currentTarget.style.color = W.faint}>
                {icon}
              </a>
            ))}
            {has(D.website) && (
              <a href={D.website} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: W.faint, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = G.light}
                onMouseLeave={e => e.currentTarget.style.color = W.faint}>
                {D.website.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}