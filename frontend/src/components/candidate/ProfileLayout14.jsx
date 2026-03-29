import { useState, useEffect, useRef } from "react";

const DEMO = {
  name: "Arjun Menon",
  role: "Full‑Stack Engineer",
  tagline: "I build products people love.",
  about: "7+ years crafting digital experiences at the intersection of engineering and design. I turn complex problems into elegant, performant solutions.",
  email: "arjun.menon@gmail.com",
  place: "Kochi, Kerala",
  profilePhoto: "https://i.pravatar.cc/900?img=68",
  qualification: "B.Tech CS · NIT Calicut",
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
    { title: "DevBoard", description: "Real-time developer dashboard aggregating GitHub, Jira & Slack.", link: "#", year: "2024" },
    { title: "ShopSphere", description: "Multi-tenant e-commerce with live inventory sync and Razorpay.", link: "#", year: "2023" },
    { title: "AIResume", description: "AI-powered resume scorer optimised for ATS. 2,000+ users.", link: "#", year: "2023" },
    { title: "NoteStack", description: "Collaborative markdown workspace with real-time sync.", link: null, year: "2022" },
  ],
  socials: [{ linkedin: "https://linkedin.com", github: "https://github.com", twitter: "https://twitter.com", website: "https://arjunmenon.dev" }],
  lookingVacancy: ["Full-Stack Engineer", "Frontend Lead", "Technical Co-founder"],
};

const has = (v) => Array.isArray(v) ? v.length > 0 : typeof v === "string" ? v.trim().length > 0 : Boolean(v);
const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Present";
const getSoc = (s) => Array.isArray(s) ? s[0] || {} : s || {};

/* ═══════════════════════════════════════
   LAYOUT 7 — "WARM GRADIENT EDITORIAL"
   Cream + terracotta + indigo, geometric
   full-bleed hero, asymmetric layouts
═══════════════════════════════════════ */

const CSS7 = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400&display=swap');

.l7 {
  --cream: #F7F3EC;
  --cream2: #EDE8DF;
  --terra: #C4552A;
  --terra2: #A8431F;
  --terra-light: #F0CDB9;
  --indigo: #2D3561;
  --indigo2: #1E244A;
  --ink: #1C1B18;
  --mid: #6B6456;
  --light: #B5AFA4;
  --rule: #DDD7CC;
  --white: #FDFAF6;
  font-family: 'DM Sans', sans-serif;
  background: var(--cream);
  color: var(--ink);
  min-height: 100vh;
  overflow-x: hidden;
}

/* NAV */
.l7-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 0 3rem; height: 62px;
  display: flex; align-items: center; justify-content: space-between;
  transition: background 0.3s, border 0.3s;
}
.l7-nav.solid {
  background: rgba(247,243,236,0.95);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--rule);
}
.l7-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem; font-weight: 500; font-style: italic;
  color: var(--terra); letter-spacing: -0.01em;
}
.l7-nav-links { display: flex; gap: 2rem; align-items: center; }
.l7-nav-links a {
  font-size: 12px; font-weight: 500; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--mid); text-decoration: none;
  transition: color 0.2s;
}
.l7-nav-links a:hover { color: var(--terra); }
.l7-nav-cta {
  padding: 8px 20px;
  background: var(--terra); color: var(--white);
  font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase; text-decoration: none;
  border-radius: 100px; transition: background 0.2s;
}
.l7-nav-cta:hover { background: var(--terra2); }

/* HERO — full bleed with big type */
.l7-hero {
  min-height: 100vh;
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 0 3rem 5rem;
}
.l7-hero-bg {
  position: absolute; inset: 0;
  background: linear-gradient(160deg, var(--indigo2) 0%, var(--indigo) 40%, #3D2B5C 100%);
}
.l7-hero-photo {
  position: absolute; right: 0; top: 0; bottom: 0;
  width: 55%;
}
.l7-hero-photo img {
  width: 100%; height: 100%; object-fit: cover; object-position: top center;
  mix-blend-mode: luminosity; opacity: 0.4;
}
.l7-hero-photo::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(to right, var(--indigo2) 0%, transparent 40%);
}
/* Decorative circle */
.l7-hero-circle {
  position: absolute; top: 10%; right: 15%;
  width: clamp(200px, 30vw, 400px);
  height: clamp(200px, 30vw, 400px);
  border-radius: 50%;
  border: 1px solid rgba(196, 85, 42, 0.25);
  pointer-events: none;
}
.l7-hero-circle2 {
  position: absolute; top: 15%; right: 20%;
  width: clamp(140px, 20vw, 280px);
  height: clamp(140px, 20vw, 280px);
  border-radius: 50%;
  border: 1px solid rgba(196, 85, 42, 0.15);
  pointer-events: none;
}
.l7-hero-content { position: relative; z-index: 2; max-width: 700px; }
.l7-hero-eyebrow {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 2rem;
}
.l7-hero-eyebrow-line { width: 40px; height: 1px; background: var(--terra); }
.l7-hero-eyebrow-text {
  font-family: 'DM Mono', monospace;
  font-size: 11px; color: var(--terra); letter-spacing: 0.15em; text-transform: uppercase;
}
.l7-hero-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(4rem, 10vw, 9rem);
  font-weight: 300; line-height: 0.9;
  letter-spacing: -0.02em; color: var(--white);
  margin-bottom: 2rem;
}
.l7-hero-name em { font-style: italic; color: var(--terra); }
.l7-hero-about {
  font-size: 16px; line-height: 1.8;
  color: rgba(255,255,255,0.55); max-width: 480px;
  margin-bottom: 2.5rem; font-weight: 300;
}
.l7-hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.l7-btn-a {
  padding: 14px 32px; background: var(--terra); color: var(--white);
  font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
  text-decoration: none; border-radius: 100px; transition: background 0.2s, transform 0.2s;
}
.l7-btn-a:hover { background: var(--terra2); transform: translateY(-2px); }
.l7-btn-b {
  padding: 13px 30px;
  border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.7);
  font-size: 13px; font-weight: 400; letter-spacing: 0.06em;
  text-decoration: none; border-radius: 100px; transition: border-color 0.2s, color 0.2s;
}
.l7-btn-b:hover { border-color: var(--terra); color: var(--terra); }

/* META STRIP */
.l7-meta {
  display: flex; align-items: stretch;
  border-top: 1px solid var(--rule);
  background: var(--white);
}
.l7-meta-item {
  flex: 1; padding: 1.6rem 2.5rem;
  border-right: 1px solid var(--rule);
  display: flex; flex-direction: column; gap: 4px;
}
.l7-meta-item:last-child { border-right: none; }
.l7-meta-label {
  font-family: 'DM Mono', monospace;
  font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--light);
}
.l7-meta-value { font-size: 14px; font-weight: 500; color: var(--ink); }

/* SECTION */
.l7-section { padding: 6rem 3rem; }
.l7-eyebrow {
  display: flex; align-items: center; gap: 12px; margin-bottom: 1rem;
}
.l7-eyebrow-line { width: 28px; height: 1px; background: var(--terra); }
.l7-eyebrow-text {
  font-family: 'DM Mono', monospace;
  font-size: 10px; color: var(--terra); letter-spacing: 0.2em; text-transform: uppercase;
}
.l7-section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3rem, 6vw, 6rem);
  font-weight: 300; line-height: 0.95; letter-spacing: -0.02em;
  color: var(--ink); margin-bottom: 3rem;
}
.l7-section-title em { font-style: italic; color: var(--terra); }

/* SERVICES — asymmetric */
.l7-svc-layout {
  display: grid; grid-template-columns: 280px 1fr; gap: 4rem; align-items: start;
}
.l7-svc-sidebar { position: sticky; top: 100px; }
.l7-svc-sidebar-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem; font-weight: 400; font-style: italic;
  color: var(--mid); margin-bottom: 1.5rem;
}
.l7-svc-count {
  font-family: 'DM Mono', monospace;
  font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--light);
}
.l7-svc-list { display: flex; flex-direction: column; gap: 0; }
.l7-svc-item {
  padding: 2.5rem 0;
  border-bottom: 1px solid var(--rule);
  display: grid; grid-template-columns: 64px 1fr; gap: 2rem;
  align-items: start; cursor: default;
}
.l7-svc-item:first-child { border-top: 1px solid var(--rule); }
.l7-svc-num {
  font-family: 'DM Mono', monospace;
  font-size: 10px; color: var(--terra); letter-spacing: 0.1em; padding-top: 3px;
}
.l7-svc-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.6rem; font-weight: 400; font-style: italic;
  color: var(--ink); margin-bottom: 8px;
}
.l7-svc-desc { font-size: 14px; color: var(--mid); line-height: 1.8; }

/* EXPERIENCE */
.l7-exp-section { background: var(--indigo2); padding: 6rem 3rem; }
.l7-exp-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3rem, 6vw, 6rem);
  font-weight: 300; line-height: 0.95; letter-spacing: -0.02em;
  color: var(--cream); margin-bottom: 4rem;
}
.l7-exp-title em { color: var(--terra); font-style: italic; }
.l7-exp-list { display: flex; flex-direction: column; gap: 0; max-width: 800px; }
.l7-exp-item {
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;
  padding: 2rem 0; border-bottom: 1px solid rgba(255,255,255,0.08);
  transition: padding 0.2s;
}
.l7-exp-item:first-child { border-top: 1px solid rgba(255,255,255,0.08); }
.l7-exp-item:hover { padding-left: 1rem; }
.l7-exp-role {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem; font-weight: 400; color: var(--cream); margin-bottom: 4px;
}
.l7-exp-co { font-size: 13px; color: var(--terra); font-weight: 500; letter-spacing: 0.04em; }
.l7-exp-dates {
  font-family: 'DM Mono', monospace;
  font-size: 11px; color: rgba(255,255,255,0.3); text-align: right;
}
.l7-exp-current {
  display: inline-block; margin-top: 6px; padding: 2px 10px;
  background: rgba(196,85,42,0.2); border: 1px solid rgba(196,85,42,0.35);
  border-radius: 100px; font-size: 9px; color: var(--terra); letter-spacing: 0.1em;
}

/* SKILLS — scattered pill cloud */
.l7-skills-section { background: var(--cream2); padding: 5rem 3rem; }
.l7-skills-inner { max-width: 900px; }
.l7-skills-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 300; font-style: italic; color: var(--ink);
  margin-bottom: 2.5rem;
}
.l7-pills { display: flex; flex-wrap: wrap; gap: 10px; }
.l7-pill {
  padding: 10px 22px;
  border: 1px solid var(--rule); border-radius: 100px;
  font-size: 13px; color: var(--mid); background: var(--white);
  cursor: default; transition: all 0.2s;
}
.l7-pill:hover { border-color: var(--terra); color: var(--terra); background: rgba(196,85,42,0.04); }

/* EDUCATION */
.l7-edu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
.l7-edu-card {
  background: var(--white);
  border: 1px solid var(--rule);
  border-radius: 4px;
  padding: 2rem;
  position: relative; overflow: hidden;
}
.l7-edu-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0;
  height: 3px; background: var(--terra);
}
.l7-edu-year {
  display: inline-block; padding: 3px 12px;
  background: var(--terra-light); border-radius: 100px;
  font-family: 'DM Mono', monospace;
  font-size: 10px; color: var(--terra); margin-bottom: 1rem;
}
.l7-edu-name { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 500; color: var(--ink); margin-bottom: 6px; }
.l7-edu-inst { font-size: 13px; color: var(--mid); margin-bottom: 10px; }
.l7-edu-grade { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--terra); }

/* PROJECTS */
.l7-proj-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2px; }
.l7-proj-card {
  background: var(--white); border: 1px solid var(--rule);
  padding: 2.5rem; cursor: default; transition: background 0.2s;
  position: relative;
}
.l7-proj-card:hover { background: var(--cream2); }
.l7-proj-card::before {
  content: attr(data-index);
  position: absolute; bottom: 1.5rem; right: 2rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 5rem; font-weight: 300; color: rgba(0,0,0,0.04); line-height: 1;
  pointer-events: none;
}
.l7-proj-year { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--light); margin-bottom: 1rem; }
.l7-proj-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.6rem; font-weight: 400; font-style: italic;
  color: var(--ink); margin-bottom: 8px;
  display: flex; justify-content: space-between; align-items: flex-start;
}
.l7-proj-arrow { color: var(--terra); font-style: normal; font-size: 1.2rem; }
.l7-proj-desc { font-size: 13px; color: var(--mid); line-height: 1.8; }

/* OPEN TO */
.l7-opento-section { background: var(--terra); padding: 5rem 3rem; }
.l7-opento-inner { display: flex; align-items: center; gap: 5rem; flex-wrap: wrap; }
.l7-opento-heading {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3rem, 5vw, 5rem);
  font-weight: 300; line-height: 0.9; color: var(--white);
}
.l7-opento-heading em { font-style: italic; display: block; }
.l7-opento-tags { display: flex; gap: 10px; flex-wrap: wrap; flex: 1; }
.l7-opento-tag {
  padding: 12px 24px;
  border: 1px solid rgba(255,255,255,0.3); border-radius: 100px;
  font-size: 14px; font-weight: 500; color: var(--white);
  cursor: default; transition: background 0.2s;
}
.l7-opento-tag:hover { background: rgba(255,255,255,0.1); }

/* CONTACT */
.l7-contact-section {
  display: grid; grid-template-columns: 1fr 1fr;
  background: var(--cream);
}
.l7-contact-left {
  padding: 6rem 3rem;
  border-right: 1px solid var(--rule);
}
.l7-contact-big {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3rem, 6vw, 6rem);
  font-weight: 300; line-height: 0.9;
  letter-spacing: -0.02em; color: var(--ink); margin-bottom: 1.5rem;
}
.l7-contact-big em { font-style: italic; color: var(--terra); }
.l7-contact-sub { font-size: 15px; color: var(--mid); line-height: 1.8; margin-bottom: 2.5rem; font-weight: 300; }
.l7-contact-btn {
  display: inline-block; padding: 14px 36px;
  background: var(--ink); color: var(--white);
  font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
  text-decoration: none; border-radius: 100px; transition: background 0.2s, transform 0.2s;
}
.l7-contact-btn:hover { background: var(--terra); transform: translateY(-2px); }
.l7-contact-right { padding: 6rem 3rem; display: flex; flex-direction: column; justify-content: space-between; }
.l7-contact-fields { display: flex; flex-direction: column; gap: 0; }
.l7-field {
  padding: 1.6rem 0; border-bottom: 1px solid var(--rule);
  display: flex; flex-direction: column; gap: 4px; cursor: default;
  transition: padding 0.2s;
}
.l7-field:first-child { border-top: 1px solid var(--rule); }
.l7-field:hover { padding-left: 0.5rem; }
.l7-field-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--light); }
.l7-field-val {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem; font-weight: 400; color: var(--ink);
  text-decoration: none; transition: color 0.2s;
}
.l7-field-val:hover { color: var(--terra); }
.l7-soc-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 2rem; }
.l7-soc-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 8px 16px; border: 1px solid var(--rule); border-radius: 100px;
  font-size: 12px; color: var(--mid); text-decoration: none;
  transition: border-color 0.2s, color 0.2s;
}
.l7-soc-btn:hover { border-color: var(--terra); color: var(--terra); }

/* FOOTER */
.l7-footer {
  padding: 1.5rem 3rem;
  border-top: 1px solid var(--rule);
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;
  background: var(--cream2);
}
.l7-footer-text { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--light); letter-spacing: 0.08em; }
.l7-footer-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--terra); }

/* RESPONSIVE */
@media(max-width: 900px) {
  .l7-nav { padding: 0 1.5rem; }
  .l7-nav-links { display: none; }
  .l7-hero { padding: 0 1.5rem 4rem; }
  .l7-hero-photo { width: 100%; opacity: 0.15; }
  .l7-section { padding: 4rem 1.5rem; }
  .l7-svc-layout { grid-template-columns: 1fr; gap: 2rem; }
  .l7-svc-sidebar { position: static; }
  .l7-exp-section { padding: 4rem 1.5rem; }
  .l7-skills-section { padding: 4rem 1.5rem; }
  .l7-proj-grid { grid-template-columns: 1fr; }
  .l7-opento-section { padding: 4rem 1.5rem; }
  .l7-opento-inner { gap: 2rem; }
  .l7-contact-section { grid-template-columns: 1fr; }
  .l7-contact-left { padding: 4rem 1.5rem; border-right: none; border-bottom: 1px solid var(--rule); }
  .l7-contact-right { padding: 3rem 1.5rem; }
  .l7-footer { padding: 1.5rem; }
  .l7-meta { flex-wrap: wrap; }
  .l7-meta-item { min-width: 50%; }
}
`;

function Layout7({ data }) {
  const c = data && has(data.name) ? data : DEMO;
  const soc = getSoc(c.socials);
  const [scrolled, setScrolled] = useState(false);
  const expYears = has(c.experience)
    ? new Date().getFullYear() - new Date(c.experience[c.experience.length - 1].startDate).getFullYear()
    : null;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const displayName = has(c.name) ? c.name : "Your Name";
  const nameParts = displayName.split(" ");

  return (
    <div className="l7">
      <style>{CSS7}</style>

      {/* NAV */}
      <nav className={`l7-nav${scrolled ? " solid" : ""}`}>
        <div className="l7-logo">{nameParts[0]}<em style={{ color: "var(--terra)" }}>.</em></div>
        <div className="l7-nav-links">
          {has(c.services) && <a href="#l7-svc">Services</a>}
          {has(c.experience) && <a href="#l7-exp">Work</a>}
          {has(c.projects) && <a href="#l7-proj">Projects</a>}
          {has(c.email) && <a href="#l7-contact">Contact</a>}
        </div>
        {has(c.email) && <a href={`mailto:${c.email}`} className="l7-nav-cta">Say hello</a>}
      </nav>

      {/* HERO */}
      <section className="l7-hero">
        <div className="l7-hero-bg" />
        {has(c.profilePhoto) && (
          <div className="l7-hero-photo">
            <img src={c.profilePhoto} alt={displayName} />
          </div>
        )}
        <div className="l7-hero-circle" />
        <div className="l7-hero-circle2" />
        <div className="l7-hero-content">
          {(has(c.role) || has(c.tagline)) && (
            <div className="l7-hero-eyebrow">
              <div className="l7-hero-eyebrow-line" />
              <span className="l7-hero-eyebrow-text">{c.role || c.tagline}</span>
            </div>
          )}
          <h1 className="l7-hero-name">
            {nameParts[0]}<br />
            {nameParts[1] && <em>{nameParts[1]}</em>}
          </h1>
          {has(c.about) && <p className="l7-hero-about">{c.about}</p>}
          <div className="l7-hero-actions">
            {has(c.email) && <a href={`mailto:${c.email}`} className="l7-btn-a">Let's connect →</a>}
            {has(c.projects) && <a href="#l7-proj" className="l7-btn-b">See my work</a>}
          </div>
        </div>
      </section>

      {/* META STRIP */}
      <div className="l7-meta">
        {has(c.place) && (
          <div className="l7-meta-item">
            <span className="l7-meta-label">Location</span>
            <span className="l7-meta-value">{c.place}</span>
          </div>
        )}
        {has(c.qualification) && (
          <div className="l7-meta-item">
            <span className="l7-meta-label">Education</span>
            <span className="l7-meta-value">{c.qualification}</span>
          </div>
        )}
        {expYears && (
          <div className="l7-meta-item">
            <span className="l7-meta-label">Experience</span>
            <span className="l7-meta-value">{expYears}+ years</span>
          </div>
        )}
        {has(c.lookingVacancy) && (
          <div className="l7-meta-item">
            <span className="l7-meta-label">Status</span>
            <span className="l7-meta-value" style={{ color: "var(--terra)" }}>Open to work ✦</span>
          </div>
        )}
      </div>

      {/* SERVICES */}
      {has(c.services) && (
        <section id="l7-svc" className="l7-section">
          <div className="l7-eyebrow">
            <div className="l7-eyebrow-line" />
            <span className="l7-eyebrow-text">01 — Services</span>
          </div>
          <div className="l7-svc-layout">
            <div className="l7-svc-sidebar">
              <div className="l7-section-title">What I <em>do</em></div>
              <div className="l7-svc-sidebar-title">Crafting digital experiences end to end.</div>
              <div className="l7-svc-count">{c.services.length} core services</div>
            </div>
            <div className="l7-svc-list">
              {c.services.map((s, i) => (
                <div key={i} className="l7-svc-item">
                  <div className="l7-svc-num">/{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <div className="l7-svc-title">{s.heading}</div>
                    {has(s.description) && <div className="l7-svc-desc">{s.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {has(c.experience) && (
        <section id="l7-exp" className="l7-exp-section">
          <div className="l7-eyebrow" style={{ "--terra": "#C4552A" }}>
            <div className="l7-eyebrow-line" style={{ background: "var(--terra)" }} />
            <span className="l7-eyebrow-text" style={{ color: "var(--terra)" }}>02 — Career</span>
          </div>
          <div className="l7-exp-title">Work <em>History</em></div>
          <div className="l7-exp-list">
            {c.experience.map((e, i) => (
              <div key={i} className="l7-exp-item">
                <div>
                  <div className="l7-exp-role">{e.jobTitle}</div>
                  {has(e.company) && <div className="l7-exp-co">{e.company}</div>}
                </div>
                <div className="l7-exp-dates">
                  {has(e.startDate) && <div>{fmt(e.startDate)} — {fmt(e.endDate)}</div>}
                  {!e.endDate && <div className="l7-exp-current">Current</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS */}
      {has(c.skills) && (
        <section className="l7-skills-section">
          <div className="l7-eyebrow">
            <div className="l7-eyebrow-line" />
            <span className="l7-eyebrow-text">03 — Stack</span>
          </div>
          <div className="l7-skills-inner">
            <div className="l7-skills-title">Technologies I <em>love</em></div>
            <div className="l7-pills">
              {c.skills.map((s, i) => <div key={i} className="l7-pill">{s}</div>)}
            </div>
          </div>
        </section>
      )}

      {/* EDUCATION */}
      {has(c.education) && (
        <section className="l7-section">
          <div className="l7-eyebrow">
            <div className="l7-eyebrow-line" />
            <span className="l7-eyebrow-text">04 — Education</span>
          </div>
          <div className="l7-section-title">Acade<em>mia</em></div>
          <div className="l7-edu-grid">
            {c.education.map((e, i) => (
              <div key={i} className="l7-edu-card">
                {e.year && <div className="l7-edu-year">{e.year}</div>}
                <div className="l7-edu-name">{e.education}</div>
                {has(e.institution) && <div className="l7-edu-inst">{e.institution}</div>}
                {has(e.percentage) && <div className="l7-edu-grade">{e.percentage}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {has(c.projects) && (
        <section id="l7-proj" className="l7-section" style={{ paddingTop: 0 }}>
          <div className="l7-eyebrow">
            <div className="l7-eyebrow-line" />
            <span className="l7-eyebrow-text">05 — Portfolio</span>
          </div>
          <div className="l7-section-title">Selected <em>Work</em></div>
          <div className="l7-proj-grid">
            {c.projects.map((p, i) => (
              <div
                key={i} className="l7-proj-card"
                data-index={String(i + 1).padStart(2, "0")}
                style={{ cursor: p.link && p.link !== "#" ? "pointer" : "default" }}
                onClick={() => p.link && p.link !== "#" && window.open(p.link, "_blank")}
              >
                {has(p.year) && <div className="l7-proj-year">{p.year}</div>}
                <div className="l7-proj-title">
                  <em>{p.title}</em>
                  {p.link && p.link !== "#" && <span className="l7-proj-arrow">↗</span>}
                </div>
                {has(p.description) && <div className="l7-proj-desc">{p.description}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* OPEN TO */}
      {has(c.lookingVacancy) && (
        <section className="l7-opento-section">
          <div className="l7-opento-inner">
            <div className="l7-opento-heading">
              Open<br />to <em>Next</em><br />Role
            </div>
            <div className="l7-opento-tags">
              {c.lookingVacancy.map((v, i) => (
                <div key={i} className="l7-opento-tag">{v}</div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      {(has(c.email) || has(c.place)) && (
        <section id="l7-contact" className="l7-contact-section">
          <div className="l7-contact-left">
            <div className="l7-contact-big">Let's <em>Create</em> Together</div>
            <p className="l7-contact-sub">
              Open to new opportunities, collaborations, and conversations about interesting problems.
            </p>
            {has(c.email) && (
              <a href={`mailto:${c.email}`} className="l7-contact-btn">Send a message →</a>
            )}
          </div>
          <div className="l7-contact-right">
            <div className="l7-contact-fields">
              {has(c.email) && (
                <div className="l7-field" style={{ cursor: "pointer" }} onClick={() => window.open(`mailto:${c.email}`)}>
                  <span className="l7-field-label">Email</span>
                  <a href={`mailto:${c.email}`} className="l7-field-val">{c.email}</a>
                </div>
              )}
              {has(c.place) && (
                <div className="l7-field">
                  <span className="l7-field-label">Location</span>
                  <span className="l7-field-val" style={{ fontSize: "1.1rem", color: "var(--mid)" }}>{c.place}</span>
                </div>
              )}
              {has(c.role) && (
                <div className="l7-field">
                  <span className="l7-field-label">Role</span>
                  <span className="l7-field-val" style={{ fontSize: "1.1rem" }}>{c.role}</span>
                </div>
              )}
            </div>
            {Object.values(soc).some(Boolean) && (
              <div className="l7-soc-row">
                {soc.linkedin && <a href={soc.linkedin} target="_blank" rel="noreferrer" className="l7-soc-btn">LinkedIn</a>}
                {soc.github && <a href={soc.github} target="_blank" rel="noreferrer" className="l7-soc-btn">GitHub</a>}
                {soc.twitter && <a href={soc.twitter} target="_blank" rel="noreferrer" className="l7-soc-btn">Twitter</a>}
                {soc.website && <a href={soc.website} target="_blank" rel="noreferrer" className="l7-soc-btn">Website</a>}
                {soc.instagram && <a href={soc.instagram} target="_blank" rel="noreferrer" className="l7-soc-btn">Instagram</a>}
              </div>
            )}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="l7-footer">
        <span className="l7-footer-text">© {new Date().getFullYear()} {displayName}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="l7-footer-dot" />
          <span className="l7-footer-text">{has(c.place) ? c.place : "Built with passion"}</span>
        </div>
      </footer>
    </div>
  );
}

export default function PersonalPortfolio14({ data }) {
  return <Layout7 data={data} />;
}