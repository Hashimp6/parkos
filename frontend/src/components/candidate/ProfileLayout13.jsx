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

/* ══════════════════════════
   LAYOUT 6 — "NEON SPLIT"
   Diagonal cut, neon lime + black, full bleed photo
══════════════════════════ */

const CSS6 = `
@import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fira+Code:wght@300;400&display=swap');

.l6 {
  --lime: #C6F135;
  --lime2: #B5E020;
  --black: #0A0A0A;
  --card: #111111;
  --card2: #161616;
  --muted: rgba(255,255,255,0.45);
  --border: rgba(255,255,255,0.08);
  --white: #FFFFFF;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: var(--black);
  color: var(--white);
  min-height: 100vh;
  overflow-x: hidden;
}

/* NAV */
.l6-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 0 3rem;
  height: 64px;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid var(--border);
  background: rgba(10,10,10,0.8);
  backdrop-filter: blur(16px);
}
.l6-logo {
  font-family: 'Fira Code', monospace;
  font-size: 13px; font-weight: 300;
  color: var(--lime); letter-spacing: 0.06em;
}
.l6-nav-links { display: flex; gap: 2rem; align-items: center; }
.l6-nav-links a {
  font-size: 12px; font-weight: 500;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--muted); text-decoration: none;
  transition: color 0.2s;
}
.l6-nav-links a:hover { color: var(--lime); }
.l6-nav-badge {
  padding: 6px 16px;
  border: 1px solid var(--lime);
  border-radius: 2px;
  font-family: 'Fira Code', monospace;
  font-size: 11px; color: var(--lime);
}

/* HERO */
.l6-hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  overflow: hidden;
}
.l6-hero-left {
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 8rem 4rem 5rem;
  position: relative; z-index: 2;
}
.l6-hero-right {
  position: relative; overflow: hidden;
}
.l6-hero-right img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: top;
  filter: grayscale(20%) contrast(1.1);
}
.l6-hero-right::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, var(--black) 0%, transparent 50%);
  z-index: 1;
}
.l6-hero-right::after {
  content: '';
  position: absolute; top: 0; right: 0; bottom: 0; left: 0;
  background: linear-gradient(to bottom, transparent 60%, var(--black) 100%);
  z-index: 1;
}
.l6-hero-right-overlay {
  position: absolute; bottom: 2rem; left: 2rem; right: 2rem;
  z-index: 2;
}
.l6-tag {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 14px;
  border: 1px solid rgba(198,241,53,0.3);
  background: rgba(198,241,53,0.06);
  border-radius: 2px;
  font-family: 'Fira Code', monospace;
  font-size: 11px; color: var(--lime); letter-spacing: 0.1em;
  margin-bottom: 2rem;
}
.l6-tag-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--lime);
  animation: l6pulse 2s ease-in-out infinite;
}
@keyframes l6pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.6)} }
.l6-name {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: clamp(3.5rem, 7vw, 7rem);
  font-weight: 800; line-height: 0.9;
  letter-spacing: -0.04em;
  margin-bottom: 2rem;
}
.l6-name span { color: var(--lime); }
.l6-about {
  font-size: 15px; line-height: 1.8;
  color: var(--muted); max-width: 420px;
  margin-bottom: 2.5rem;
}
.l6-cta-row { display: flex; gap: 12px; flex-wrap: wrap; }
.l6-btn-primary {
  padding: 14px 32px;
  background: var(--lime); color: var(--black);
  font-weight: 700; font-size: 13px;
  letter-spacing: 0.08em; text-transform: uppercase;
  text-decoration: none; border-radius: 2px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.l6-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 30px rgba(198,241,53,0.4); }
.l6-btn-ghost {
  padding: 13px 30px;
  border: 1px solid rgba(255,255,255,0.15);
  color: var(--white); font-size: 13px;
  letter-spacing: 0.08em; text-transform: uppercase;
  text-decoration: none; border-radius: 2px;
  transition: border-color 0.2s;
}
.l6-btn-ghost:hover { border-color: var(--lime); color: var(--lime); }

/* STATS STRIP */
.l6-stats {
  display: flex; gap: 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.l6-stat {
  flex: 1; padding: 2rem 3rem;
  border-right: 1px solid var(--border);
}
.l6-stat:last-child { border-right: none; }
.l6-stat-num {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 800; color: var(--lime); line-height: 1;
  margin-bottom: 6px;
}
.l6-stat-label {
  font-family: 'Fira Code', monospace;
  font-size: 11px; color: var(--muted); letter-spacing: 0.12em; text-transform: uppercase;
}

/* SKILLS MARQUEE */
.l6-marquee { overflow: hidden; padding: 18px 0; background: var(--card); }
.l6-marquee-track { display: flex; animation: l6marq 20s linear infinite; white-space: nowrap; }
.l6-marquee-item {
  display: inline-flex; align-items: center; gap: 12px;
  padding: 0 1.5rem;
  font-family: 'Fira Code', monospace;
  font-size: 12px; color: rgba(255,255,255,0.2);
  letter-spacing: 0.06em;
}
.l6-marquee-dot { color: var(--lime); font-size: 8px; }
@keyframes l6marq { from{transform:translateX(0)} to{transform:translateX(-50%)} }

/* SERVICES */
.l6-section { padding: 6rem 3rem; }
.l6-section-header { margin-bottom: 3rem; }
.l6-eyebrow {
  font-family: 'Fira Code', monospace;
  font-size: 11px; color: var(--lime);
  letter-spacing: 0.2em; text-transform: uppercase;
  display: flex; align-items: center; gap: 12px; margin-bottom: 1rem;
}
.l6-eyebrow::before { content:''; width: 32px; height: 1px; background: var(--lime); }
.l6-section-title {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 800; line-height: 0.95;
  letter-spacing: -0.03em;
}
.l6-section-title em { color: var(--lime); font-style: normal; }

.l6-svc-grid {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 1px; background: var(--border);
  border: 1px solid var(--border);
}
.l6-svc-card {
  background: var(--card); padding: 2.5rem;
  transition: background 0.25s;
  position: relative; overflow: hidden; cursor: default;
}
.l6-svc-card:hover { background: var(--card2); }
.l6-svc-card::before {
  content: ''; position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px; background: var(--lime);
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.3s ease;
}
.l6-svc-card:hover::before { transform: scaleX(1); }
.l6-svc-num {
  font-family: 'Fira Code', monospace;
  font-size: 10px; color: var(--lime);
  letter-spacing: 0.1em; margin-bottom: 1.5rem;
}
.l6-svc-title { font-size: 1.3rem; font-weight: 700; margin-bottom: 0.7rem; }
.l6-svc-desc { font-size: 13px; color: var(--muted); line-height: 1.75; }

/* EXPERIENCE */
.l6-exp-list { border: 1px solid var(--border); }
.l6-exp-item {
  display: grid; grid-template-columns: 1fr auto;
  align-items: center; gap: 2rem;
  padding: 2rem 2.5rem;
  border-bottom: 1px solid var(--border);
  transition: background 0.2s; cursor: default;
}
.l6-exp-item:last-child { border-bottom: none; }
.l6-exp-item:hover { background: var(--card); }
.l6-exp-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 4px; }
.l6-exp-company { font-family: 'Fira Code', monospace; font-size: 12px; color: var(--lime); }
.l6-exp-date { font-family: 'Fira Code', monospace; font-size: 11px; color: var(--muted); text-align: right; }
.l6-exp-current {
  display: inline-block; margin-top: 6px; padding: 2px 10px;
  background: rgba(198,241,53,0.1); border: 1px solid rgba(198,241,53,0.3);
  border-radius: 2px;
  font-size: 9px; color: var(--lime); letter-spacing: 0.1em;
}

/* EDU GRID */
.l6-edu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1px; background: var(--border); border: 1px solid var(--border); }
.l6-edu-card { background: var(--card); padding: 2rem; }
.l6-edu-year {
  display: inline-block; padding: 3px 10px;
  background: var(--lime); color: var(--black);
  font-family: 'Fira Code', monospace; font-size: 10px;
  font-weight: 700; margin-bottom: 1rem;
}
.l6-edu-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 6px; }
.l6-edu-inst { font-size: 13px; color: var(--muted); margin-bottom: 10px; }
.l6-edu-grade { font-family: 'Fira Code', monospace; font-size: 12px; color: var(--lime); }

/* PROJECTS */
.l6-proj-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); }
.l6-proj-card {
  background: var(--card); padding: 2.5rem;
  position: relative; overflow: hidden;
  transition: background 0.25s; cursor: default;
}
.l6-proj-card:hover { background: var(--card2); }
.l6-proj-year { font-family: 'Fira Code', monospace; font-size: 10px; color: var(--muted); margin-bottom: 1rem; }
.l6-proj-title { font-size: 1.3rem; font-weight: 700; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.l6-proj-arrow { color: var(--lime); font-size: 18px; }
.l6-proj-desc { font-size: 13px; color: var(--muted); line-height: 1.7; }

/* OPEN TO */
.l6-opento {
  padding: 5rem 3rem;
  display: flex; gap: 4rem; align-items: center; flex-wrap: wrap;
  background: var(--lime);
}
.l6-opento-label {
  font-family: 'Fira Code', monospace;
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(0,0,0,0.45); margin-bottom: 8px;
}
.l6-opento-title {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 800; color: var(--black); line-height: 0.95;
}
.l6-opento-tags { display: flex; gap: 10px; flex-wrap: wrap; flex: 1; }
.l6-opento-tag {
  padding: 12px 24px;
  border: 1px solid rgba(0,0,0,0.25);
  font-size: 15px; font-weight: 600;
  color: var(--black); border-radius: 2px;
  transition: background 0.2s;
}
.l6-opento-tag:hover { background: rgba(0,0,0,0.08); }

/* CONTACT */
.l6-contact {
  padding: 6rem 3rem;
  display: grid; grid-template-columns: 1fr 1fr; gap: 4rem;
}
.l6-contact-big {
  font-size: clamp(3rem, 6vw, 6rem);
  font-weight: 800; line-height: 0.9; letter-spacing: -0.04em;
  margin-bottom: 2rem;
}
.l6-contact-big span { color: var(--lime); }
.l6-contact-sub { font-size: 15px; color: var(--muted); line-height: 1.75; margin-bottom: 2.5rem; }
.l6-contact-fields { display: flex; flex-direction: column; gap: 0; border: 1px solid var(--border); }
.l6-contact-field {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: center;
  transition: background 0.2s;
}
.l6-contact-field:last-child { border-bottom: none; }
.l6-contact-field:hover { background: var(--card); }
.l6-contact-field-label { font-family: 'Fira Code', monospace; font-size: 10px; color: var(--muted); letter-spacing: 0.15em; text-transform: uppercase; }
.l6-contact-field-val { font-size: 15px; font-weight: 600; }
.l6-soc-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 2rem; }
.l6-soc-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 16px;
  border: 1px solid var(--border);
  font-size: 12px; color: var(--muted);
  text-decoration: none; border-radius: 2px;
  transition: border-color 0.2s, color 0.2s;
}
.l6-soc-btn:hover { border-color: var(--lime); color: var(--lime); }

/* FOOTER */
.l6-footer {
  padding: 1.5rem 3rem;
  border-top: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;
}
.l6-footer-text { font-family: 'Fira Code', monospace; font-size: 11px; color: var(--muted); letter-spacing: 0.08em; }

/* RESPONSIVE */
@media(max-width: 900px) {
  .l6-hero { grid-template-columns: 1fr; }
  .l6-hero-right { display: none; }
  .l6-hero-left { padding: 7rem 1.5rem 4rem; }
  .l6-stats { flex-wrap: wrap; }
  .l6-stat { min-width: 50%; border-right: none; border-bottom: 1px solid var(--border); }
  .l6-section { padding: 4rem 1.5rem; }
  .l6-nav { padding: 0 1.5rem; }
  .l6-svc-grid, .l6-proj-grid { grid-template-columns: 1fr; }
  .l6-contact { grid-template-columns: 1fr; gap: 2rem; padding: 4rem 1.5rem; }
  .l6-opento { padding: 3rem 1.5rem; gap: 2rem; }
  .l6-footer { padding: 1.5rem; }
  .l6-nav-links { display: none; }
}
`;

function Layout6({ data }) {
  const c = data && has(data.name) ? data : DEMO;
  const soc = getSoc(c.socials);
  const expYears = has(c.experience) ? new Date().getFullYear() - new Date(c.experience[c.experience.length - 1].startDate).getFullYear() : null;

  return (
    <div className="l6">
      <style>{CSS6}</style>

      {/* NAV */}
      <nav className="l6-nav">
        <div className="l6-logo">{has(c.name) ? `<${c.name.split(" ")[0].toLowerCase()}/>` : "<dev/>"}</div>
        <div className="l6-nav-links">
          {has(c.services) && <a href="#l6-services">Services</a>}
          {has(c.experience) && <a href="#l6-exp">Work</a>}
          {has(c.projects) && <a href="#l6-proj">Projects</a>}
          {has(c.email) && <a href="#l6-contact">Contact</a>}
        </div>
        {has(c.lookingVacancy) && <div className="l6-nav-badge">Open to work</div>}
      </nav>

      {/* HERO */}
      <section className="l6-hero">
        <div className="l6-hero-left">
          {has(c.lookingVacancy) && (
            <div className="l6-tag">
              <span className="l6-tag-dot" />
              Available for work
            </div>
          )}
          <h1 className="l6-name">
            {has(c.name) ? c.name.split(" ").map((w, i) => (
              <span key={i} style={{ display: "block" }}>
                {i === 1 ? <span>{w}</span> : w}
              </span>
            )) : "Your Name"}
          </h1>
          {has(c.about) && <p className="l6-about">{c.about}</p>}
          <div className="l6-cta-row">
            {has(c.email) && <a href={`mailto:${c.email}`} className="l6-btn-primary">Say hello →</a>}
            <a href="#l6-proj" className="l6-btn-ghost">View work</a>
          </div>
        </div>
        {has(c.profilePhoto) && (
          <div className="l6-hero-right">
            <img src={c.profilePhoto} alt={c.name} />
            <div className="l6-hero-right-overlay">
              {has(c.role) && (
                <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", marginBottom: 4 }}>
                  {c.role}
                </div>
              )}
              {has(c.place) && (
                <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 11, color: "rgba(198,241,53,0.7)", letterSpacing: "0.06em" }}>
                  📍 {c.place}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* STATS */}
      {(expYears || has(c.skills) || has(c.experience)) && (
        <div className="l6-stats">
          {expYears && (
            <div className="l6-stat">
              <div className="l6-stat-num">{expYears}+</div>
              <div className="l6-stat-label">Years exp.</div>
            </div>
          )}
          {has(c.skills) && (
            <div className="l6-stat">
              <div className="l6-stat-num">{c.skills.length}+</div>
              <div className="l6-stat-label">Skills</div>
            </div>
          )}
          {has(c.experience) && (
            <div className="l6-stat">
              <div className="l6-stat-num">{c.experience.length}</div>
              <div className="l6-stat-label">Companies</div>
            </div>
          )}
          {has(c.projects) && (
            <div className="l6-stat">
              <div className="l6-stat-num">{c.projects.length}</div>
              <div className="l6-stat-label">Projects</div>
            </div>
          )}
        </div>
      )}

      {/* SKILLS MARQUEE */}
      {has(c.skills) && (
        <div className="l6-marquee">
          <div className="l6-marquee-track">
            {[...c.skills, ...c.skills, ...c.skills, ...c.skills].map((s, i) => (
              <div key={i} className="l6-marquee-item">{s}<span className="l6-marquee-dot">✦</span></div>
            ))}
          </div>
        </div>
      )}

      {/* SERVICES */}
      {has(c.services) && (
        <section id="l6-services" className="l6-section">
          <div className="l6-section-header">
            <div className="l6-eyebrow">01 What I do</div>
            <h2 className="l6-section-title">My <em>Services</em></h2>
          </div>
          <div className="l6-svc-grid">
            {c.services.map((s, i) => (
              <div key={i} className="l6-svc-card">
                <div className="l6-svc-num">/{String(i + 1).padStart(2, "0")}</div>
                <div className="l6-svc-title">{s.heading}</div>
                {has(s.description) && <div className="l6-svc-desc">{s.description}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {has(c.experience) && (
        <section id="l6-exp" className="l6-section" style={{ paddingTop: 0 }}>
          <div className="l6-section-header">
            <div className="l6-eyebrow">02 Career</div>
            <h2 className="l6-section-title">Work <em>History</em></h2>
          </div>
          <div className="l6-exp-list">
            {c.experience.map((e, i) => (
              <div key={i} className="l6-exp-item">
                <div>
                  <div className="l6-exp-title">{e.jobTitle}</div>
                  {has(e.company) && <div className="l6-exp-company">@ {e.company}</div>}
                </div>
                <div className="l6-exp-date">
                  {has(e.startDate) && <div>{fmt(e.startDate)} → {fmt(e.endDate)}</div>}
                  {!e.endDate && <div className="l6-exp-current">CURRENT</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EDUCATION */}
      {has(c.education) && (
        <section className="l6-section" style={{ paddingTop: 0 }}>
          <div className="l6-section-header">
            <div className="l6-eyebrow">03 Education</div>
            <h2 className="l6-section-title">Acad<em>emia</em></h2>
          </div>
          <div className="l6-edu-grid">
            {c.education.map((e, i) => (
              <div key={i} className="l6-edu-card">
                {e.year && <div className="l6-edu-year">{e.year}</div>}
                <div className="l6-edu-title">{e.education}</div>
                {has(e.institution) && <div className="l6-edu-inst">{e.institution}</div>}
                {has(e.percentage) && <div className="l6-edu-grade">{e.percentage}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {has(c.projects) && (
        <section id="l6-proj" className="l6-section" style={{ paddingTop: 0 }}>
          <div className="l6-section-header">
            <div className="l6-eyebrow">04 Portfolio</div>
            <h2 className="l6-section-title">Selected <em>Work</em></h2>
          </div>
          <div className="l6-proj-grid">
            {c.projects.map((p, i) => (
              <div
                key={i} className="l6-proj-card"
                style={{ cursor: p.link && p.link !== "#" ? "pointer" : "default" }}
                onClick={() => p.link && p.link !== "#" && window.open(p.link, "_blank")}
              >
                {has(p.year) && <div className="l6-proj-year">{p.year}</div>}
                <div className="l6-proj-title">
                  {p.title}
                  {p.link && p.link !== "#" && <span className="l6-proj-arrow">↗</span>}
                </div>
                {has(p.description) && <div className="l6-proj-desc">{p.description}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* OPEN TO */}
      {has(c.lookingVacancy) && (
        <section className="l6-opento">
          <div>
            <div className="l6-opento-label">Open to</div>
            <div className="l6-opento-title">Next<br />Role</div>
          </div>
          <div className="l6-opento-tags">
            {c.lookingVacancy.map((v, i) => (
              <div key={i} className="l6-opento-tag">{v}</div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      {(has(c.email) || has(c.place)) && (
        <section id="l6-contact" className="l6-contact">
          <div>
            <div className="l6-contact-big">
              Let's<br /><span>Build</span><br />Something.
            </div>
            <p className="l6-contact-sub">
              Open to new roles, collaborations, and conversations about interesting problems.
            </p>
            {has(c.email) && (
              <a href={`mailto:${c.email}`} className="l6-btn-primary" style={{ display: "inline-block" }}>
                Send a message →
              </a>
            )}
            {/* Socials */}
            {Object.values(soc).some(Boolean) && (
              <div className="l6-soc-row">
                {soc.linkedin && <a href={soc.linkedin} target="_blank" rel="noreferrer" className="l6-soc-btn">LinkedIn ↗</a>}
                {soc.github && <a href={soc.github} target="_blank" rel="noreferrer" className="l6-soc-btn">GitHub ↗</a>}
                {soc.twitter && <a href={soc.twitter} target="_blank" rel="noreferrer" className="l6-soc-btn">Twitter ↗</a>}
                {soc.website && <a href={soc.website} target="_blank" rel="noreferrer" className="l6-soc-btn">Website ↗</a>}
                {soc.instagram && <a href={soc.instagram} target="_blank" rel="noreferrer" className="l6-soc-btn">Instagram ↗</a>}
              </div>
            )}
          </div>
          <div>
            <div className="l6-contact-fields">
              {has(c.email) && (
                <div className="l6-contact-field" onClick={() => window.open(`mailto:${c.email}`)} style={{ cursor: "pointer" }}>
                  <span className="l6-contact-field-label">Email</span>
                  <span className="l6-contact-field-val">{c.email}</span>
                </div>
              )}
              {has(c.place) && (
                <div className="l6-contact-field">
                  <span className="l6-contact-field-label">Location</span>
                  <span className="l6-contact-field-val">{c.place}</span>
                </div>
              )}
              {has(c.qualification) && (
                <div className="l6-contact-field">
                  <span className="l6-contact-field-label">Education</span>
                  <span className="l6-contact-field-val" style={{ fontSize: 13 }}>{c.qualification}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="l6-footer">
        <span className="l6-footer-text">© {new Date().getFullYear()} {has(c.name) ? c.name : "Portfolio"}</span>
        <span className="l6-footer-text">Built with passion · {has(c.place) ? c.place : ""}</span>
      </footer>
    </div>
  );
}

export default function PersonalPortfolio13({ data }) {
  return <Layout6 data={data} />;
}