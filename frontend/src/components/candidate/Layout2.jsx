import { useState, useEffect, useRef } from "react";

const DEMO = {
  name: "Alex Mercer",
  tagline: "The way digital presence is shaped.",
  qualification: "Full Stack Developer",
  company: "currently @ Niche Studios",
  place: "Kerala, India",
  profilePhoto: "https://i.pravatar.cc/900?img=68",
  about:
    "I build products that live at the intersection of elegant design and robust engineering. With a deep obsession for clean code and intentional UX, I turn complex problems into seamless, lasting experiences.",
  skills: ["React", "Node.js", "MongoDB", "TypeScript", "Python", "Figma", "AWS", "GraphQL", "Docker", "Redis"],
  services: [
    { heading: "Web Development", description: "Full-stack applications built with modern frameworks, focused on performance and scalability." },
    { heading: "UI/UX Design", description: "Interfaces that feel intuitive and look stunning — from wireframe to pixel-perfect reality." },
    { heading: "API Architecture", description: "Robust REST & GraphQL APIs designed for scale, security, and developer happiness." },
    { heading: "Consulting", description: "Strategic technical guidance for startups and growing teams navigating complexity." },
  ],
  experience: [
    { jobTitle: "Senior Full Stack Engineer", company: "Niche Studios", startDate: "2023", endDate: "Present" },
    { jobTitle: "Frontend Engineer", company: "Axiom Labs", startDate: "2021", endDate: "2023" },
    { jobTitle: "Junior Developer", company: "ByteForge", startDate: "2019", endDate: "2021" },
  ],
  education: [
    { education: "B.Tech Computer Science", institution: "NIT Calicut", year: 2019, percentage: "8.7 CGPA" },
    { education: "Higher Secondary", institution: "Kerala State Board", year: 2015, percentage: "94%" },
  ],
  projects: [
    { title: "Lumina", description: "An AI-powered design system generator that creates production-ready component libraries from natural language prompts.", link: "#", year: "2024" },
    { title: "Vantage", description: "Real-time analytics dashboard with 3D data visualizations processing 10M+ events/day.", link: "#", year: "2023" },
    { title: "Drift Protocol", description: "Decentralized file-sharing network with end-to-end encryption and zero-knowledge proofs.", link: "#", year: "2023" },
    { title: "Echospace", description: "Collaborative music production platform with live jam sessions and AI-assisted mixing.", link: "#", year: "2022" },
  ],
  socials: [{ github: "github.com/alexmercer", linkedin: "linkedin.com/in/alexmercer", twitter: "@alexmercer", instagram: "@alexmercer.dev" }],
};

export default function Portfolio2({ data }) {
  const [loaded, setLoaded] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [hovering, setHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const cursorRef = useRef(null);
  const portfolio = data || DEMO;

  // Derived booleans — check once, use everywhere
  const hasName        = !!portfolio.name;
  const hasPhoto       = !!portfolio.profilePhoto;
  const hasAbout       = !!portfolio.about;
  const hasQual        = !!portfolio.qualification;
  const hasCompany     = !!portfolio.company;
  const hasSkills      = portfolio.skills?.length > 0;
  const hasServices    = portfolio.services?.length > 0;
  const hasProjects    = portfolio.projects?.length > 0;
  const hasExperience  = portfolio.experience?.length > 0;
  const hasEducation   = portfolio.education?.length > 0;
  const hasSocials     = portfolio.socials?.[0] && Object.values(portfolio.socials[0]).some(Boolean);

  // Show Journey section only if at least one sub-section exists
  const hasJourney = hasExperience || hasEducation;

  useEffect(() => {
    setTimeout(() => setLoaded(true), 80);
    const onMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${cursorPos.x - 12}px, ${cursorPos.y - 12}px)`;
    }
  }, [cursorPos]);

  return (
    <div style={{ fontFamily: "'Playfair Display', serif", background: "#f5efe6", color: "#3E362E", minHeight: "100vh", cursor: "none", overflowX: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Jost:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f5efe6; }
        ::-webkit-scrollbar-thumb { background: #937858; border-radius: 3px; }

        .cursor {
          position: fixed; top: 0; left: 0;
          width: 24px; height: 24px;
          border: 1.5px solid #865D36;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transition: transform 0.07s ease, width 0.25s, height 0.25s, background 0.25s;
          mix-blend-mode: multiply;
        }
        .cursor.big {
          width: 48px; height: 48px;
          background: rgba(134,93,54,0.12);
          border-color: #AC8960;
        }

        .fade-up { opacity: 0; transform: translateY(28px); transition: opacity 0.9s cubic-bezier(.16,1,.3,1), transform 0.9s cubic-bezier(.16,1,.3,1); }
        .fade-up.in { opacity: 1; transform: none; }

        .nav-link {
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #865D36;
          text-decoration: none;
          cursor: none;
          transition: color 0.2s;
          background: none; border: none;
        }
        .nav-link:hover { color: #3E362E; }

        .hero-name { font-size: clamp(4rem, 10vw, 10rem); font-weight: 400; line-height: 0.88; letter-spacing: -0.03em; color: #3E362E; }
        .hero-name em { font-style: italic; color: #865D36; }

        .hero-image-box {
          position: absolute;
          top: 52%;
          right: 4rem;
          transform: translateY(-50%);
          width: 320px;
          height: 420px;
          z-index: 2;
        }
        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 160px 160px 20px 20px;
          filter: grayscale(10%) contrast(1.05);
          transition: transform 0.5s ease, filter 0.4s ease;
        }
        .hero-image:hover {
          transform: scale(1.03);
          filter: grayscale(0%) contrast(1.1);
        }
        .hero-image-box::before {
          content: "";
          position: absolute;
          inset: -12px;
          border: 1px solid rgba(134,93,54,0.25);
          border-radius: 180px 180px 30px 30px;
          z-index: -1;
        }
        @media (max-width: 900px) {
          .hero-image-box {
            position: relative;
            top: auto; right: auto; transform: none;
            width: 220px; height: 280px;
            margin: 2rem auto 0;
          }
        }

        .tag {
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem; font-weight: 400;
          letter-spacing: 0.18em; text-transform: uppercase;
          padding: 0.45rem 1.1rem;
          border: 1px solid rgba(134,93,54,0.35);
          color: #865D36; background: transparent;
          transition: background 0.25s, color 0.25s; cursor: none;
        }
        .tag:hover { background: #865D36; color: #f5efe6; }

        .svc-card {
          padding: 2.5rem 2rem;
          border-top: 1px solid rgba(134,93,54,0.22);
          transition: background 0.3s; cursor: none;
        }
        .svc-card:hover { background: rgba(134,93,54,0.05); }

        .proj-row {
          display: grid;
          grid-template-columns: 3rem 1fr auto;
          align-items: center; gap: 2rem;
          padding: 1.8rem 0;
          border-bottom: 1px solid rgba(134,93,54,0.15);
          cursor: none; transition: background 0.25s;
        }
        .proj-row:hover { background: rgba(134,93,54,0.04); padding-left: 1rem; padding-right: 1rem; margin: 0 -1rem; }

        .cta-btn {
          display: inline-flex; align-items: center; gap: 0.75rem;
          font-family: 'Jost', sans-serif; font-size: 0.75rem; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          background: #3E362E; color: #f5efe6;
          padding: 1.1rem 2.8rem; text-decoration: none; cursor: none;
          transition: background 0.25s, transform 0.2s; border: none;
        }
        .cta-btn:hover { background: #865D36; transform: translateY(-2px); }

        .outline-btn {
          display: inline-flex; align-items: center; gap: 0.75rem;
          font-family: 'Jost', sans-serif; font-size: 0.72rem; font-weight: 400;
          letter-spacing: 0.22em; text-transform: uppercase;
          background: transparent; color: #865D36;
          padding: 0.9rem 2rem; text-decoration: none; cursor: none;
          border: 1px solid rgba(134,93,54,0.4);
          transition: background 0.25s, color 0.25s;
        }
        .outline-btn:hover { background: #865D36; color: #f5efe6; }

        .divider { height: 1px; background: linear-gradient(90deg, rgba(134,93,54,0.4), rgba(134,93,54,0.05)); }

        .section-no {
          font-family: 'Jost', sans-serif; font-size: 0.62rem;
          letter-spacing: 0.25em; color: #AC8960; text-transform: uppercase;
        }

        .exp-dot {
          width: 7px; height: 7px; border-radius: 50%;
          border: 1.5px solid #865D36; background: #f5efe6;
          flex-shrink: 0; margin-top: 6px;
        }
        .exp-vline {
          width: 1px; flex: 1;
          background: linear-gradient(180deg, #865D36 0%, rgba(134,93,54,0) 100%);
          margin-top: 4px;
        }

        .grain-overlay {
          position: fixed; inset: 0; pointer-events: none; z-index: 200;
          opacity: 0.028;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-repeat: repeat; background-size: 200px 200px;
        }

        @media (max-width: 768px) {
          .hero-name { font-size: clamp(3rem, 14vw, 5rem); }
          .two-col { grid-template-columns: 1fr !important; }
          nav > div:last-child { display: none; }
        }
      `}</style>

      {/* Grain */}
      <div className="grain-overlay" />

      {/* Cursor */}
      <div ref={cursorRef} className={`cursor ${hovering ? "big" : ""}`} />

      {/* Ambient blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "5%", right: "15%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(172,137,96,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "0%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(147,120,88,0.09) 0%, transparent 70%)" }} />
      </div>

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.6rem 4rem", background: "rgba(245,239,230,0.88)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(134,93,54,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <div style={{ width: 28, height: 28, border: "1.5px solid #865D36", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 8, height: 8, background: "#865D36" }} />
          </div>
          {hasName && (
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#3E362E", fontWeight: 500 }}>
              {portfolio.name.split(" ")[0]}
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: "2.5rem" }}>
          {/* Only show nav links for sections that will actually render */}
          {[
            { label: "About",    id: "about",    show: true },
            { label: "Services", id: "services", show: hasServices },
            { label: "Work",     id: "work",     show: hasProjects },
            { label: "Journey",  id: "journey",  show: hasJourney },
            { label: "Contact",  id: "contact",  show: true },
          ]
            .filter((n) => n.show)
            .map(({ label, id }) => (
              <button key={id} className="nav-link"
                onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
                {label}
              </button>
            ))}
        </div>

        {/* <a href="mailto:hello@alexmercer.dev" className="outline-btn"
          onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
          Hire Me
        </a> */}
      </nav>

      {/* ── HERO ── */}
      <section id="about" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 4rem 6rem", position: "relative", zIndex: 1, paddingTop: "8rem" }}>

        {/* Profile photo — only if URL exists */}
        {hasPhoto && (
          <div className={`hero-image-box fade-up ${loaded ? "in" : ""}`} style={{ transitionDelay: "0.12s" }}>
            <img src={portfolio.profilePhoto} alt={portfolio.name || "Profile"} className="hero-image" loading="lazy" />
          </div>
        )}

        {/* Name — only if name exists */}
        {hasName && (
          <div className={`fade-up ${loaded ? "in" : ""}`} style={{ transitionDelay: "0.18s", marginTop: "4rem" }}>
            <h1 className="hero-name">
              {portfolio.name.split(" ")[0]}
              {portfolio.name.split(" ")[1] && (
                <><br /><em>{portfolio.name.split(" ")[1]}</em></>
              )}
            </h1>
          </div>
        )}

        {/* Bottom row — about, qualification, company */}
        {(hasAbout || hasQual || hasCompany) && (
          <div className={`fade-up ${loaded ? "in" : ""}`} style={{ transitionDelay: "0.32s", display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: "3rem", flexWrap: "wrap", gap: "2rem" }}>

            {hasAbout && (
              <div style={{ maxWidth: 420 }}>
                <div style={{ height: 1, background: "linear-gradient(90deg, #865D36, rgba(134,93,54,0.1))", marginBottom: "1.5rem", width: 60 }} />
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "1.05rem", fontWeight: 300, lineHeight: 1.75, color: "rgba(62,54,46,0.7)" }}>
                  {portfolio.about}
                </p>
                {hasProjects && (
                  <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
                    <a href="#work" className="cta-btn"
                      onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
                      View Work →
                    </a>
                  </div>
                )}
              </div>
            )}

            {(hasQual || hasCompany) && (
              <div style={{ textAlign: "right" }}>
                {hasQual && (
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#AC8960", marginBottom: "0.5rem" }}>
                    {portfolio.qualification}
                  </p>
                )}
                {hasCompany && (
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.1em", color: "rgba(62,54,46,0.5)" }}>
                    {portfolio.company}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: "3rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem", opacity: 0.35 }}>
          <div style={{ width: 1, height: 60, background: "linear-gradient(180deg, transparent, #865D36)" }} />
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#865D36" }}>Scroll</span>
        </div>
      </section>

      {/* ── SKILLS STRIP — only if skills exist ── */}
      {hasSkills && (
        <section style={{ padding: "3rem 4rem", background: "#3E362E", position: "relative", zIndex: 1, overflow: "hidden" }}>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#AC8960", marginRight: "1rem", flexShrink: 0 }}>
              Proficient in
            </span>
            {portfolio.skills.map((s, i) => (
              <span key={i}
                onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
                style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.12em", color: "rgba(245,239,230,0.5)", transition: "color 0.2s", cursor: "none" }}
                onMouseOver={e => e.target.style.color = "#f5efe6"}
                onMouseOut={e => e.target.style.color = "rgba(245,239,230,0.5)"}>
                {s}
                {i < portfolio.skills.length - 1 && (
                  <span style={{ color: "#865D36", marginLeft: "1.5rem" }}>·</span>
                )}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── SERVICES — only if services exist ── */}
      {hasServices && (
        <section id="services" style={{ padding: "8rem 4rem", background: "#f5efe6", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "2rem", marginBottom: "4rem" }}>
            <span className="section-no">01 — Services</span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(134,93,54,0.25), transparent)" }} />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 400, fontStyle: "italic", color: "rgba(62,54,46,0.12)" }}>What I Do</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }} className="two-col">
            {portfolio.services.map((s, i) => (
              <div key={i} className="svc-card"
                onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
                style={{ borderRight: i % 2 === 0 ? "1px solid rgba(134,93,54,0.15)" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.2rem" }}>
                  <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#AC8960" }}>0{i + 1}</span>
                  <div style={{ width: 24, height: 24, border: "1px solid rgba(134,93,54,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", color: "#865D36" }}>→</div>
                </div>
                {s.heading && <h3 style={{ fontSize: "1.6rem", fontWeight: 400, color: "#3E362E", marginBottom: "1rem" }}>{s.heading}</h3>}
                {s.description && <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(62,54,46,0.6)", fontWeight: 300 }}>{s.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── WORK — only if projects exist ── */}
      {hasProjects && (
        <section id="work" style={{ padding: "8rem 4rem", background: "#ede5d8", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "2rem", marginBottom: "4rem" }}>
            <span className="section-no">02 — Selected Work</span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(134,93,54,0.25), transparent)" }} />
          </div>

          <div style={{ borderTop: "1px solid rgba(134,93,54,0.18)" }}>
            {portfolio.projects.map((p, i) => (
              <div key={i} className="proj-row"
                onMouseEnter={() => { setHovering(true); setActiveProject(i); }}
                onMouseLeave={() => { setHovering(false); setActiveProject(null); }}>

                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", color: activeProject === i ? "#865D36" : "#AC8960", transition: "color 0.3s" }}>
                  0{i + 1}
                </span>

                <div>
                  {p.title && (
                    <h3 style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", fontWeight: 400, color: "#3E362E", transition: "color 0.2s", fontStyle: activeProject === i ? "italic" : "normal" }}>
                      {p.title}
                    </h3>
                  )}
                  {p.description && (
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(62,54,46,0.5)", fontWeight: 300, marginTop: "0.3rem", maxWidth: 480 }}>
                      {p.description}
                    </p>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem", flexShrink: 0 }}>
                  {p.year && (
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", letterSpacing: "0.15em", color: "rgba(62,54,46,0.4)" }}>
                      {p.year}
                    </span>
                  )}
                  {p.link && (
                    <a href={p.link}
                      onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
                      style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#865D36", textDecoration: "none", opacity: activeProject === i ? 1 : 0, transition: "opacity 0.3s", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      View →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── JOURNEY — only if experience or education exist ── */}
      {hasJourney && (
        <section id="journey" style={{ padding: "8rem 4rem", background: "#f5efe6", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "2rem", marginBottom: "5rem" }}>
            <span className="section-no">03 — Journey</span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(134,93,54,0.25), transparent)" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: hasExperience && hasEducation ? "1fr 1fr" : "1fr", gap: "6rem" }} className="two-col">

            {/* Experience — only if exists */}
            {hasExperience && (
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 400, fontStyle: "italic", color: "#3E362E", marginBottom: "3rem" }}>Experience</h3>
                {portfolio.experience.map((e, i) => (
                  <div key={i} style={{ display: "flex", gap: "1.5rem", paddingBottom: "2.5rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div className="exp-dot" />
                      {i < portfolio.experience.length - 1 && <div className="exp-vline" />}
                    </div>
                    <div>
                      {e.jobTitle && <h4 style={{ fontSize: "1.2rem", fontWeight: 400, color: "#3E362E", marginBottom: "0.3rem" }}>{e.jobTitle}</h4>}
                      {e.company && <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", color: "#865D36", textTransform: "uppercase", marginBottom: "0.2rem" }}>{e.company}</p>}
                      {(e.startDate || e.endDate) && (
                        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.68rem", color: "rgba(62,54,46,0.4)" }}>
                          {e.startDate}{e.startDate && e.endDate ? " — " : ""}{e.endDate}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Education — only if exists */}
            {hasEducation && (
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 400, fontStyle: "italic", color: "#3E362E", marginBottom: "3rem" }}>Education</h3>
                {portfolio.education.map((e, i) => (
                  <div key={i} style={{ display: "flex", gap: "1.5rem", paddingBottom: "2.5rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div className="exp-dot" style={{ borderColor: "rgba(134,93,54,0.5)" }} />
                      {i < portfolio.education.length - 1 && <div className="exp-vline" style={{ opacity: 0.4 }} />}
                    </div>
                    <div>
                      {e.education && <h4 style={{ fontSize: "1.2rem", fontWeight: 400, color: "#3E362E", marginBottom: "0.3rem" }}>{e.education}</h4>}
                      {e.institution && <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", color: "#865D36", textTransform: "uppercase", marginBottom: "0.2rem" }}>{e.institution}</p>}
                      {(e.year || e.percentage) && (
                        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.68rem", color: "rgba(62,54,46,0.4)" }}>
                          {e.year}{e.year && e.percentage ? " · " : ""}{e.percentage}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── CONTACT ── */}
     {/* ── CONTACT ── */}
<section
  id="contact"
  style={{
    padding: "8rem 4rem",
    background: "#3E362E",
    color: "#f5efe6",
    position: "relative",
    zIndex: 1,
    overflow: "hidden",
  }}
>
  {/* Background text */}
  <div
    style={{
      position: "absolute",
      bottom: "-2rem",
      right: "-1rem",
      fontFamily: "'Playfair Display', serif",
      fontSize: "18rem",
      fontWeight: 700,
      fontStyle: "italic",
      opacity: 0.04,
      lineHeight: 1,
      userSelect: "none",
      color: "#f5efe6",
    }}
  >
    Hello
  </div>

  <div style={{ position: "relative", zIndex: 2 }}>
    {/* LABEL */}
    <span
      style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: "0.65rem",
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        color: "#AC8960",
      }}
    >
      04 — Contact
    </span>

    {/* HEADING */}
    <h2
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(2.5rem, 6vw, 6rem)",
        fontWeight: 400,
        lineHeight: 1,
        marginTop: "2rem",
        marginBottom: "3rem",
      }}
    >
      Have an idea?<br />
      <em style={{ color: "#AC8960" }}>Let's create it.</em>
    </h2>

    {/* DESCRIPTION */}
    <p
      style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: "1rem",
        lineHeight: 1.8,
        color: "rgba(245,239,230,0.55)",
        fontWeight: 300,
        maxWidth: 440,
        marginBottom: "3rem",
      }}
    >
      Whether you're looking to collaborate, build something meaningful, or just want to talk craft — I'm always open.
    </p>

    {/* CTA BUTTONS */}
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        marginBottom: "3rem",
      }}
    >
      {/* PHONE */}
      {data.phone && (
        <a
          href={`tel:${data.phone}`}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "1rem",
            fontFamily: "'Jost', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            background: "#AC8960",
            color: "#3E362E",
            padding: "1.1rem 2.8rem",
            textDecoration: "none",
            transition: "all 0.25s",
            cursor: "none",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "#f5efe6")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "#AC8960")
          }
        >
          Call Me →
        </a>
      )}

      {/* EMAIL */}
      {data.email && (
        <a
          href={`mailto:${data.email}`}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "1rem",
            fontFamily: "'Jost', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            background: data.phone ? "transparent" : "#AC8960",
            color: data.phone
              ? "rgba(245,239,230,0.7)"
              : "#3E362E",
            border: data.phone
              ? "1px solid rgba(245,239,230,0.2)"
              : "none",
            padding: "1.1rem 2.8rem",
            textDecoration: "none",
            transition: "all 0.25s",
            cursor: "none",
          }}
          onMouseOver={(e) => {
            if (data.phone) {
              e.currentTarget.style.color = "#AC8960";
              e.currentTarget.style.borderColor = "#AC8960";
            } else {
              e.currentTarget.style.background = "#f5efe6";
            }
          }}
          onMouseOut={(e) => {
            if (data.phone) {
              e.currentTarget.style.color =
                "rgba(245,239,230,0.7)";
              e.currentTarget.style.borderColor =
                "rgba(245,239,230,0.2)";
            } else {
              e.currentTarget.style.background = "#AC8960";
            }
          }}
        >
          Say Hello →
        </a>
      )}
    </div>

    {/* FOOTER ROW */}
    <div
      style={{
        marginTop: "4rem",
        paddingTop: "2rem",
        borderTop: "1px solid rgba(245,239,230,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1.5rem",
      }}
    >
      {/* NAME */}
      {data.name && (
        <span
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(245,239,230,0.25)",
          }}
        >
          © {new Date().getFullYear()} {data.name}
        </span>
      )}

      {/* PHONE */}
      {data.phone && (
        <span
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.18em",
            color: "rgba(245,239,230,0.25)",
          }}
        >
          {data.phone}
        </span>
      )}
    </div>
  </div>
</section>
    </div>
  );
}