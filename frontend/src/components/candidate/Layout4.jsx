import { useState, useEffect } from "react";

const DEMO = {
  name: "Alex Mercer",
  tagline: "Crafting digital experiences that leave a mark",
  qualification: "Full Stack Developer",
  company: "Currently @ Vercel",
  profilePhoto: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp",
  place: "San Francisco, CA",
  about:
    "I build things for the web. Obsessed with clean architecture, thoughtful UX, and the intersection where design meets engineering. Five years in, still learning something new every day.",
  skills: ["React", "Node.js", "TypeScript", "MongoDB", "Next.js", "Figma", "AWS", "GraphQL", "Tailwind", "Docker"],
  services: [
    { heading: "Web Development", description: "End-to-end web applications built with modern stacks. From architecture to deployment." },
    { heading: "UI/UX Design", description: "Interfaces that feel inevitable. Design systems that scale without losing soul." },
    { heading: "API Architecture", description: "RESTful and GraphQL APIs designed for clarity, performance, and longevity." },
    { heading: "Technical Consulting", description: "Helping teams make better decisions before writing a single line of code." },
  ],
  experience: [
    { jobTitle: "Senior Engineer", company: "Vercel", startDate: "2023", endDate: "Present" },
    { jobTitle: "Frontend Lead", company: "Stripe", startDate: "2021", endDate: "2023" },
    { jobTitle: "Full Stack Dev", company: "Linear", startDate: "2019", endDate: "2021" },
  ],
  education: [
    { education: "B.Tech Computer Science", institution: "MIT", year: 2019, percentage: "9.1 CGPA" },
  ],
  projects: [
    { title: "Void", description: "A minimal note-taking app with AI-powered organization. 12k users in 3 months.", link: "#" },
    { title: "Palettify", description: "Extract, generate and export color palettes from any image. Used by 40k+ designers.", link: "#" },
    { title: "Cronstack", description: "Visual cron job scheduler with real-time monitoring and Slack alerts.", link: "#" },
  ],
  socials: [{ github: "github.com/alexmercer", linkedin: "linkedin.com/in/alexmercer", twitter: "@alexmercer" }],
};

function AvatarPlaceholder() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <circle cx="100" cy="75" r="42" fill="#CC8B65" opacity="0.5" />
      <ellipse cx="100" cy="175" rx="65" ry="45" fill="#CC8B65" opacity="0.3" />
    </svg>
  );
}

export default function Portfolio4({ data }) {
  const datas = data|| DEMO;

  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imgError, setImgError] = useState(false);

  // ── Derived booleans ─────────────────────────────────────────
  const hasName       = !!datas.name;
  const hasTagline    = !!datas.tagline;
  const hasQual       = !!datas.qualification;
  const hasPlace      = !!datas.place;
  const hasCompany    = !!datas.company;
  const hasAbout      = !!datas.about;
  const hasPhoto      = !!datas.profilePhoto;
  const hasSkills     = datas.skills?.length > 0;
  const hasServices   = datas.services?.length > 0;
  const hasProjects   = datas.projects?.length > 0;
  const hasExperience = datas.experience?.length > 0;
  const hasEducation  = datas.education?.length > 0;
  const hasSocials    = datas.socials?.[0] && Object.values(datas.socials[0]).some(Boolean);

  // Section-level guards
  const hasServicesSection = hasServices || hasSkills;
  const hasAboutSection    = hasAbout || hasPlace || hasCompany || hasExperience || hasEducation;

  // Nav — only show links for sections that will render
  const NAV_ITEMS = [
    { label: "Work",     href: "#work",     show: hasProjects        },
    { label: "Services", href: "#services", show: hasServicesSection },
    { label: "About",    href: "#about",    show: hasAboutSection    },
    { label: "Contact",  href: "#contact",  show: true               },
  ].filter(n => n.show);

  // Hero subline built only from present fields
  const heroSublineParts = [
    hasTagline && datas.tagline,
    hasQual    && datas.qualification,
    hasPlace   && `based in ${datas.place}`,
  ].filter(Boolean);

  // About meta cards — only include fields that have values
  const metaCards = [
    hasPlace    && ["Based in",    datas.place],
    hasCompany  && ["Currently",   datas.company],
    hasEducation && datas.education[0]?.institution && ["Institution", datas.education[0].institution],
    hasEducation && datas.education[0]?.percentage  && ["Result",      datas.education[0].percentage],
  ].filter(Boolean);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    const onMouse  = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMouse);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  const W = { maxWidth: "72rem", margin: "0 auto", padding: "0 2rem" };

  return (
    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", background: "#013328", color: "#E3DCD2", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Jost:wght@200;300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #013328; }
        ::-webkit-scrollbar-thumb { background: #CC8B65; }
        .jost { font-family: 'Jost', sans-serif; }

        @keyframes fadeUp    { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
        @keyframes scaleIn   { from { opacity:0; transform:scale(0.93); } to { opacity:1; transform:scale(1); } }
        @keyframes leafFloat { 0%,100%{ transform:rotate(-3deg) translateY(0); } 50%{ transform:rotate(3deg) translateY(-8px); } }

        .anim-1 { animation: fadeUp  0.8s ease 0.10s both; }
        .anim-2 { animation: fadeUp  0.8s ease 0.25s both; }
        .anim-3 { animation: fadeUp  0.8s ease 0.40s both; }
        .anim-4 { animation: fadeUp  0.8s ease 0.55s both; }
        .anim-5 { animation: scaleIn 1.0s ease 0.30s both; }
        .anim-6 { animation: fadeIn  1.2s ease 0.60s both; }
        .leaf-float { animation: leafFloat 7s ease-in-out infinite; }

        .hover-lift { transition: transform 0.35s ease, box-shadow 0.35s ease; }
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 20px 60px rgba(0,0,0,0.35); }

        .skill-pill { transition: all 0.28s ease; border: 1px solid rgba(204,139,101,0.3); cursor: default; }
        .skill-pill:hover { background: #CC8B65; color: #013328; border-color: #CC8B65; transform: translateY(-2px); }

        .service-card { border: 1px solid rgba(227,220,210,0.08); transition: all 0.4s ease; }
        .service-card:hover { border-color: rgba(204,139,101,0.4); background: rgba(204,139,101,0.05); }

        .project-row { border: 1px solid rgba(227,220,210,0.06); transition: all 0.35s ease; text-decoration: none; color: inherit; display: flex; align-items: center; gap: 2rem; padding: 1.8rem 2rem; background: rgba(227,220,210,0.02); }
        .project-row:hover { border-color: rgba(204,139,101,0.3); background: rgba(204,139,101,0.04); }
        .project-row:hover .proj-arrow { opacity: 1; color: #CC8B65; }
        .project-row:hover .proj-title { color: #CC8B65; }
        .proj-arrow { opacity: 0; transition: opacity 0.3s ease; }
        .proj-title { transition: color 0.3s ease; }

        .exp-line { position: relative; padding-left: 28px; padding-bottom: 1.5rem; }
        .exp-line::before { content:''; position:absolute; left:0; top:7px; width:9px; height:9px; border-radius:50%; background:#CC8B65; box-shadow:0 0 0 4px rgba(204,139,101,0.15); }
        .exp-line::after  { content:''; position:absolute; left:4px; top:20px; width:1px; height:calc(100% + 8px); background:rgba(204,139,101,0.18); }
        .exp-line:last-child::after { display:none; }

        .photo-ring-1 { position:absolute; inset:-14px; border-radius:50%; border:1px solid rgba(204,139,101,0.22); pointer-events:none; }
        .photo-ring-2 { position:absolute; inset:-28px; border-radius:50%; border:1px dashed rgba(204,139,101,0.10); pointer-events:none; }

        .stag { font-family:'Jost',sans-serif; font-size:11px; font-weight:300; letter-spacing:0.25em; text-transform:uppercase; color:#CC8B65; display:block; }
        .divider { height:1px; background:linear-gradient(to right, transparent, rgba(204,139,101,0.4), transparent); }
        .nav-link { font-family:'Jost',sans-serif; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:rgba(227,220,210,0.55); transition:color 0.25s; text-decoration:none; }
        .nav-link:hover { color:#CC8B65; }
        .grain { background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E"); position:absolute; inset:0; pointer-events:none; z-index:0; }
      `}</style>

      {/* Mouse glow */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, background:`radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(204,139,101,0.045), transparent 55%)` }} />

      {/* Leaves */}
      <div className="leaf-float" style={{ position:"fixed", top:"5rem", right:"2.5rem", opacity:0.08, pointerEvents:"none", zIndex:0 }}>
        <svg width="110" height="165" viewBox="0 0 110 165"><ellipse cx="55" cy="82" rx="32" ry="74" fill="none" stroke="#CC8B65" strokeWidth="1" transform="rotate(-15 55 82)"/><line x1="55" y1="8" x2="55" y2="156" stroke="#CC8B65" strokeWidth="0.5"/></svg>
      </div>
      <div className="leaf-float" style={{ position:"fixed", bottom:"8rem", left:"1.5rem", opacity:0.05, pointerEvents:"none", zIndex:0, animationDelay:"2.5s" }}>
        <svg width="70" height="110" viewBox="0 0 70 110"><ellipse cx="35" cy="55" rx="22" ry="50" fill="none" stroke="#CC8B65" strokeWidth="1" transform="rotate(18 35 55)"/><line x1="35" y1="5" x2="35" y2="105" stroke="#CC8B65" strokeWidth="0.5"/></svg>
      </div>

      {/* ── NAV ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:50, padding: scrolled ? "1rem 0" : "1.5rem 0", background: scrolled ? "rgba(1,51,40,0.92)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? "1px solid rgba(227,220,210,0.06)" : "none", transition:"all 0.4s ease" }}>
        <div style={{ ...W, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          {/* Logo */}
          {hasName && (
            <span className="jost" style={{ fontSize:"12px", letterSpacing:"0.25em", textTransform:"uppercase", color:"#E3DCD2" }}>
              {datas.name.split(" ")[0]}
              {datas.name.split(" ")[1] && <span style={{ color:"#CC8B65" }}> {datas.name.split(" ")[1]}</span>}
            </span>
          )}

          <div style={{ display:"flex", gap:"2.5rem", alignItems:"center" }}>
            {NAV_ITEMS.map(n => <a key={n.label} href={n.href} className="nav-link">{n.label}</a>)}
            {/* <a href="#contact" className="jost"
              style={{ fontSize:"11px", letterSpacing:"0.2em", textTransform:"uppercase", padding:"0.6rem 1.25rem", border:"1px solid rgba(204,139,101,0.45)", color:"#CC8B65", textDecoration:"none", transition:"all 0.25s ease" }}
              onMouseEnter={e => { e.target.style.background = "#CC8B65"; e.target.style.color = "#013328"; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#CC8B65"; }}>
              Hire me
            </a> */}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="home" style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", background:"#013328", overflow:"hidden" }}>
        <div className="grain" />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, fontFamily:"'Jost',sans-serif", fontSize:"18vw", fontWeight:200, color:"rgba(227,220,210,0.03)", whiteSpace:"nowrap", lineHeight:1, letterSpacing:"-0.03em", userSelect:"none", pointerEvents:"none" }}>DEVELOPER</div>

        <div style={{ position:"relative", zIndex:1, ...W, width:"100%", display:"grid", gridTemplateColumns: hasPhoto ? "3fr 2fr" : "1fr", gap:"3rem", alignItems:"center", paddingTop:"6rem", paddingBottom:"4rem" }}>
          <div>
            <span className="stag anim-1" style={{ marginBottom:"1.5rem" }}>Portfolio — {new Date().getFullYear()}</span>

            {hasName && (
              <h1 className="anim-2" style={{ fontSize:"clamp(3.2rem,7vw,5.8rem)", lineHeight:1.05, fontWeight:400, letterSpacing:"-0.02em", marginBottom:"1.5rem" }}>
                Hello, I'm<br /><em style={{ color:"#CC8B65", fontStyle:"italic" }}>{datas.name}</em>
              </h1>
            )}

            <div className="divider anim-3" style={{ width:"10rem", marginBottom:"1.5rem" }} />

            {heroSublineParts.length > 0 && (
              <p className="jost anim-3" style={{ color:"rgba(227,220,210,0.6)", lineHeight:1.85, fontSize:"1rem", maxWidth:"26rem", marginBottom:"2.5rem" }}>
                {heroSublineParts.join(". ")}.
              </p>
            )}

            <div className="anim-4" style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
              {hasProjects && (
                <a href="#work" className="jost hover-lift" style={{ fontSize:"11px", letterSpacing:"0.2em", textTransform:"uppercase", padding:"1rem 2rem", background:"#CC8B65", color:"#013328", fontWeight:500, textDecoration:"none" }}>
                  Explore Work
                </a>
              )}
              {hasAboutSection && (
                <a href="#about" className="jost"
                  style={{ fontSize:"11px", letterSpacing:"0.2em", textTransform:"uppercase", padding:"1rem 2rem", border:"1px solid rgba(227,220,210,0.2)", color:"#E3DCD2", textDecoration:"none", transition:"all 0.25s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#CC8B65"; e.currentTarget.style.color = "#CC8B65"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(227,220,210,0.2)"; e.currentTarget.style.color = "#E3DCD2"; }}>
                  About Me
                </a>
              )}
              {/* Fallback if neither projects nor about section */}
              {!hasProjects && !hasAboutSection && (
                <a href="#contact" className="jost hover-lift" style={{ fontSize:"11px", letterSpacing:"0.2em", textTransform:"uppercase", padding:"1rem 2rem", background:"#CC8B65", color:"#013328", fontWeight:500, textDecoration:"none" }}>
                  Get in Touch
                </a>
              )}
            </div>
          </div>

          {/* Photo — only if url exists */}
          {hasPhoto && (
            <div className="anim-5" style={{ display:"flex", justifyContent:"center" }}>
              <div style={{ position:"relative", width:"17rem", height:"17rem" }}>
                <div className="photo-ring-1" />
                <div className="photo-ring-2" />
                <div style={{ width:"100%", height:"100%", borderRadius:"50%", overflow:"hidden", border:"2px solid rgba(204,139,101,0.3)", background:"rgba(204,139,101,0.07)", filter:"drop-shadow(0 0 40px rgba(204,139,101,0.18))", position:"relative" }}>
                  {!imgError
                    ? <img src={datas.profilePhoto} alt={datas.name || "Profile"} onError={() => setImgError(true)} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    : <AvatarPlaceholder />}
                  <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"radial-gradient(circle at 30% 30%, transparent 50%, rgba(1,51,40,0.28) 100%)" }} />
                </div>
              
              </div>
            </div>
          )}
        </div>

        <div style={{ position:"absolute", bottom:"2.5rem", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"0.5rem" }}>
          <span className="jost" style={{ fontSize:"10px", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(227,220,210,0.22)" }}>scroll</span>
          <div style={{ width:"1px", height:"44px", background:"linear-gradient(to bottom, #CC8B65, transparent)" }} />
        </div>
      </section>

      {/* ── WORK — only if projects exist ── */}
      {hasProjects && (
        <section id="work" style={{ position:"relative", padding:"8rem 0", background:"#100C0D" }}>
          <div className="grain" />
          <div style={{ position:"relative", zIndex:1, ...W }}>
            <div style={{ display:"flex", alignItems:"flex-end", gap:"2rem", marginBottom:"4rem" }}>
              <div>
                <span className="stag" style={{ marginBottom:"0.75rem" }}>Selected projects</span>
                <h2 style={{ fontSize:"clamp(2.4rem,5vw,3.8rem)", fontWeight:400, letterSpacing:"-0.02em", lineHeight:1.1 }}>
                  Work that <em style={{ color:"#CC8B65", fontStyle:"italic" }}>speaks</em>
                </h2>
              </div>
              <div className="divider" style={{ flex:1, marginBottom:"0.6rem" }} />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              {datas.projects.map((p, i) => (
                <a key={i} href={p.link || "#"} className="project-row">
                  <span className="jost" style={{ fontSize:"3rem", fontWeight:200, color:"rgba(204,139,101,0.18)", lineHeight:1, minWidth:"4rem", flexShrink:0 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.5rem" }}>
                      {p.title && <h3 className="proj-title" style={{ fontSize:"1.6rem", fontWeight:400, letterSpacing:"-0.01em" }}>{p.title}</h3>}
                      {p.link  && <span className="jost proj-arrow" style={{ fontSize:"11px", letterSpacing:"0.18em", textTransform:"uppercase" }}>View ↗</span>}
                    </div>
                    <div className="divider" style={{ width:"3rem", marginBottom:"0.5rem" }} />
                    {p.description && (
                      <p className="jost" style={{ color:"rgba(227,220,210,0.48)", lineHeight:1.7, fontSize:"0.875rem" }}>{p.description}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SERVICES + SKILLS — only if at least one exists ── */}
      {hasServicesSection && (
        <section id="services" style={{ position:"relative", padding:"8rem 0", background:"#013328" }}>
          <div className="grain" />
          <div style={{ position:"relative", zIndex:1, ...W }}>
            <span className="stag" style={{ marginBottom:"0.75rem" }}>What I offer</span>
            <h2 style={{ fontSize:"clamp(2.4rem,5vw,3.8rem)", fontWeight:400, letterSpacing:"-0.02em", marginBottom:"3.5rem", lineHeight:1.1 }}>
              Services &amp; <em style={{ color:"#CC8B65", fontStyle:"italic" }}>expertise</em>
            </h2>

            {/* Services grid — only if services exist */}
            {hasServices && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem" }}>
                {datas.services.map((s, i) => (
                  <div key={i} className="service-card hover-lift" style={{ padding:"2.5rem", background:"rgba(227,220,210,0.02)" }}>
                    <span className="jost" style={{ fontSize:"11px", letterSpacing:"0.22em", textTransform:"uppercase", color:"#CC8B65", marginBottom:"1.25rem", display:"block" }}>0{i + 1}</span>
                    {s.heading && <h3 style={{ fontSize:"1.35rem", fontWeight:400, marginBottom:"1rem" }}>{s.heading}</h3>}
                    <div className="divider" style={{ width:"2.5rem", marginBottom:"1rem" }} />
                    {s.description && (
                      <p className="jost" style={{ color:"rgba(227,220,210,0.5)", lineHeight:1.8, fontSize:"0.875rem" }}>{s.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Skills — only if skills exist */}
            {hasSkills && (
              <div style={{ marginTop: hasServices ? "5rem" : 0, paddingTop: hasServices ? "3rem" : 0, borderTop: hasServices ? "1px solid rgba(227,220,210,0.06)" : "none" }}>
                <span className="stag" style={{ marginBottom:"1.25rem" }}>Toolkit</span>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"0.75rem" }}>
                  {datas.skills.map(s => (
                    <span key={s} className="skill-pill jost" style={{ fontSize:"11px", letterSpacing:"0.15em", textTransform:"uppercase", padding:"0.6rem 1.25rem", color:"rgba(227,220,210,0.7)" }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── ABOUT — only if section has content ── */}
      {hasAboutSection && (
        <section id="about" style={{ position:"relative", padding:"8rem 0", background:"#100C0D" }}>
          <div className="grain" />
          <div style={{ position:"relative", zIndex:1, ...W, display:"grid", gridTemplateColumns: (hasAbout || metaCards.length > 0) && (hasExperience || hasEducation) ? "1fr 1fr" : "1fr", gap:"5rem" }}>

            {/* Left col — about text + meta cards */}
            {(hasAbout || metaCards.length > 0) && (
              <div>
                <span className="stag" style={{ marginBottom:"0.75rem" }}>The person</span>
                <h2 style={{ fontSize:"clamp(2.4rem,5vw,3.8rem)", fontWeight:400, letterSpacing:"-0.02em", lineHeight:1.1, marginBottom:"1.5rem" }}>
                  About <em style={{ color:"#CC8B65", fontStyle:"italic" }}>me</em>
                </h2>
                <div className="divider" style={{ width:"5rem", marginBottom:"1.75rem" }} />

                {hasAbout && (
                  <p className="jost" style={{ color:"rgba(227,220,210,0.65)", lineHeight:1.95, fontSize:"1rem", marginBottom:"2.5rem" }}>
                    {datas.about}
                  </p>
                )}

                {metaCards.length > 0 && (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                    {metaCards.map(([label, val]) => (
                      <div key={label} style={{ padding:"1.25rem", border:"1px solid rgba(227,220,210,0.07)", background:"rgba(227,220,210,0.02)" }}>
                        <div className="jost" style={{ fontSize:"10px", letterSpacing:"0.22em", textTransform:"uppercase", color:"#CC8B65", marginBottom:"0.4rem" }}>{label}</div>
                        <div className="jost" style={{ color:"#E3DCD2", fontSize:"0.875rem", fontWeight:300 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Right col — experience + education */}
            {(hasExperience || hasEducation) && (
              <div>
                {/* Experience */}
                {hasExperience && (
                  <>
                    <span className="stag" style={{ marginBottom:"0.75rem" }}>Journey</span>
                    <h2 style={{ fontSize:"clamp(2rem,4vw,3rem)", fontWeight:400, letterSpacing:"-0.02em", marginBottom:"2.5rem" }}>
                      Where I've <em style={{ color:"#CC8B65", fontStyle:"italic" }}>been</em>
                    </h2>
                    <div style={{ display:"flex", flexDirection:"column" }}>
                      {datas.experience.map((e, i) => (
                        <div key={i} className="exp-line">
                          {(e.startDate || e.endDate) && (
                            <div className="jost" style={{ fontSize:"10px", letterSpacing:"0.22em", textTransform:"uppercase", color:"#CC8B65", marginBottom:"0.4rem" }}>
                              {e.startDate}{e.startDate && e.endDate ? " — " : ""}{e.endDate}
                            </div>
                          )}
                          {e.jobTitle && <div style={{ fontSize:"1.25rem", fontWeight:400 }}>{e.jobTitle}</div>}
                          {e.company  && <div className="jost" style={{ color:"rgba(227,220,210,0.42)", fontSize:"0.875rem", marginTop:"0.2rem", fontWeight:300 }}>{e.company}</div>}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Education */}
                {hasEducation && (
                  <div style={{ marginTop: hasExperience ? "3rem" : 0, paddingTop: hasExperience ? "2rem" : 0, borderTop: hasExperience ? "1px solid rgba(227,220,210,0.07)" : "none" }}>
                    <span className="stag" style={{ marginBottom:"1.25rem" }}>Education</span>
                    {datas.education.map((e, i) => (
                      <div key={i} style={{ padding:"1.5rem", border:"1px solid rgba(204,139,101,0.2)", background:"rgba(204,139,101,0.04)", marginBottom:"1rem" }}>
                        {e.year && (
                          <div className="jost" style={{ fontSize:"10px", letterSpacing:"0.22em", textTransform:"uppercase", color:"#CC8B65", marginBottom:"0.4rem" }}>{e.year}</div>
                        )}
                        {e.education && <div style={{ fontSize:"1.1rem", fontWeight:400 }}>{e.education}</div>}
                        {(e.institution || e.percentage) && (
                          <div className="jost" style={{ color:"rgba(227,220,210,0.48)", fontSize:"0.875rem", marginTop:"0.3rem", fontWeight:300 }}>
                            {e.institution}{e.institution && e.percentage ? " · " : ""}{e.percentage}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── CONTACT ── */}
      <section id="contact" style={{ position:"relative", padding:"10rem 0", background:"#013328" }}>
        <div className="grain" />
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center, rgba(204,139,101,0.06) 0%, transparent 60%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1, maxWidth:"48rem", margin:"0 auto", padding:"0 2rem", textAlign:"center" }}>
          <span className="stag" style={{ marginBottom:"1.5rem" }}>Let's collaborate</span>
          <h2 style={{ fontSize:"clamp(3rem,8vw,6rem)", fontWeight:400, letterSpacing:"-0.03em", lineHeight:1, marginBottom:"1.5rem" }}>
            Got an idea?<br /><em style={{ color:"#CC8B65", fontStyle:"italic" }}>Let's talk.</em>
          </h2>
          <p className="jost" style={{ color:"rgba(227,220,210,0.42)", fontSize:"1rem", lineHeight:1.85, marginBottom:"3.5rem" }}>
            Open to freelance projects, full-time roles,<br />and conversations that lead somewhere interesting.
          </p>
          <div className="divider" style={{ width:"7rem", margin:"0 auto 3.5rem" }} />

          {/* Socials — only if at least one link present */}
          {hasSocials && (
            <div style={{ display:"flex", justifyContent:"center", gap:"2.5rem", marginBottom:"3.5rem", flexWrap:"wrap" }}>
              {Object.entries(datas.socials[0]).map(([k, v]) =>
                v ? (
                  <a key={k} href={`https://${v}`} target="_blank" rel="noreferrer" className="jost"
                    style={{ fontSize:"11px", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(227,220,210,0.38)", textDecoration:"none", transition:"color 0.25s" }}
                    onMouseEnter={e => { e.target.style.color = "#CC8B65"; }}
                    onMouseLeave={e => { e.target.style.color = "rgba(227,220,210,0.38)"; }}>
                    {k}
                  </a>
                ) : null
              )}
            </div>
          )}
<div style={{
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2rem"
}}>

  {/* ACTION BUTTONS */}
  <div style={{
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    justifyContent: "center"
  }}>

    {/* PHONE */}
    {datas.phone && (
      <a
        href={`tel:${datas.phone}`}
        className="jost hover-lift"
        style={{
          padding: "1rem 2.5rem",
          background: "#CC8B65",
          color: "#013328",
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          textDecoration: "none",
          borderRadius: "2px",
          transition: "all 0.25s"
        }}
      >
        Call Me →
      </a>
    )}

    {/* EMAIL */}
    {datas.email && (
      <a
        href={`mailto:${datas.email}`}
        className="jost hover-lift"
        style={{
          padding: "1rem 2.5rem",
          border: "1px solid rgba(227,220,210,0.2)",
          color: "rgba(227,220,210,0.7)",
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          textDecoration: "none",
          borderRadius: "2px",
          transition: "all 0.25s"
        }}
        onMouseEnter={e => {
          e.target.style.color = "#CC8B65";
          e.target.style.borderColor = "#CC8B65";
        }}
        onMouseLeave={e => {
          e.target.style.color = "rgba(227,220,210,0.7)";
          e.target.style.borderColor = "rgba(227,220,210,0.2)";
        }}
      >
        Email →
      </a>
    )}

  </div>

  {/* OPTIONAL SMALL TEXT */}
  {(datas.phone || datas.email) && (
    <p
      className="jost"
      style={{
        fontSize: "10px",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "rgba(227,220,210,0.35)"
      }}
    >
      Available for projects & collaborations
    </p>
  )}

</div>
        </div>
    
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding:"1.75rem 0", background:"#100C0D", borderTop:"1px solid rgba(227,220,210,0.05)" }}>
        <div style={{ ...W, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          {hasName && (
            <span className="jost" style={{ fontSize:"10px", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(227,220,210,0.18)" }}>
              © {new Date().getFullYear()} {datas.name}
            </span>
          )}
          <span className="jost" style={{ fontSize:"10px", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(227,220,210,0.18)" }}>
            Designed with intent
          </span>
        </div>
      </footer>
    </div>
  );
}