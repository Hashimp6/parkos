import { useState, useEffect, useRef } from "react";

const Demo = {
  name: "Alex Mercer",
  tagline: "Crafting digital experiences that leave a mark",
  qualification: "Full Stack Developer",
  company: "Currently @ Vercel",
  profilePhoto: "https://i.pravatar.cc/900?img=68",
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

const ALL_NAV = [
  { label: "Work",     id: "work" },
  { label: "Services", id: "services" },
  { label: "About",    id: "about" },
  { label: "Contact",  id: "contact" },
];

export default function Portfolio3({ data}) {
  const [active, setActive] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const datas = data || Demo;

  // ── Derived booleans ──────────────────────────────────────────
  const hasName        = !!datas.name;
  const hasTagline     = !!datas.tagline;
  const hasPhoto       = !!datas.profilePhoto;
  const hasQual        = !!datas.qualification;
  const hasCompany     = !!datas.company;
  const hasPlace       = !!datas.place;
  const hasAbout       = !!datas.about;
  const hasSkills      = datas.skills?.length > 0;
  const hasServices    = datas.services?.length > 0;
  const hasProjects    = datas.projects?.length > 0;
  const hasExperience  = datas.experience?.length > 0;
  const hasEducation   = datas.education?.length > 0;
  const hasSocials     = datas.socials?.[0] && Object.values(datas.socials[0]).some(Boolean);

  // Show toolkit/journey section only if at least one sub-column exists
  const hasToolkitSection = hasSkills || hasExperience;

  // Filter nav to only sections that will render
  const NAV = ALL_NAV.filter(({ id }) => {
    if (id === "work")     return hasProjects;
    if (id === "services") return hasServices;
    if (id === "about")    return hasAbout;
    return true; // contact always shown
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onMouse  = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMouse);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  const parallaxX = (mousePos.x / (window.innerWidth  || 1) - 0.5) * 20;
  const parallaxY = (mousePos.y / (window.innerHeight || 1) - 0.5) * 20;

  return (
    <div className="min-h-screen bg-[#0d1f2d] text-white font-sans overflow-x-hidden"
      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d1f2d; }
        ::-webkit-scrollbar-thumb { background: #5C7C89; border-radius: 2px; }
        .mono { font-family: 'DM Mono', monospace; }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
        .float { animation: float 6s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.9s ease forwards; }
        .slide-in { animation: slideIn 0.6s ease forwards; }
        .skill-tag:hover { background: #5C7C89; color: white; transform: translateY(-2px); }
        .card-hover:hover { transform: translateY(-6px); border-color: #5C7C89; }
        .nav-link::after { content:''; display:block; height:1px; background:#5C7C89; transform:scaleX(0); transition:transform 0.3s; transform-origin:left; }
        .nav-link:hover::after, .nav-link.active::after { transform:scaleX(1); }
        .arch { position:relative; width:220px; height:300px; border-radius:110px 110px 0 0; border:1px solid rgba(92,124,137,0.3); display:flex; align-items:flex-end; justify-content:center; overflow:hidden; }
        .grain { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); }
        .line-deco { height: 1px; background: linear-gradient(to right, transparent, #5C7C89, transparent); }
        .project-num { font-size: 5rem; line-height:1; color: rgba(92,124,137,0.15); font-weight: 300; }
      `}</style>

      {/* Ambient cursor glow */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(92,124,137,0.07), transparent 60%)`
      }} />

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-4 bg-[#0d1f2d]/90 backdrop-blur-md border-b border-white/5" : "py-7"}`}>
        <div className="max-w-6xl mx-auto px-8 flex justify-between items-center">
          {hasName && (
            <div className="mono text-xs tracking-widest text-[#5C7C89] uppercase">
              {datas.name.split(" ")[0]}
              {datas.name.split(" ")[1] && (
                <span className="text-white">.{datas.name.split(" ")[1]}</span>
              )}
            </div>
          )}
          <div className="flex gap-10">
            {NAV.map(({ label, id }) => (
              <a key={id} href={`#${id}`}
                className={`nav-link mono text-xs tracking-widest uppercase transition-colors ${active === label ? "text-white active" : "text-[#5C7C89] hover:text-white"}`}
                onClick={() => setActive(label)}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden" id="home">
        {/* Background arches */}
        <div className="absolute inset-0 flex items-end justify-center opacity-20"
          style={{ transform: `translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px)` }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="absolute bottom-0 rounded-t-full border border-[#5C7C89]/30"
              style={{ width: `${300 + i * 160}px`, height: `${380 + i * 100}px`, borderRadius: `${150 + i * 80}px ${150 + i * 80}px 0 0` }} />
          ))}
        </div>

        {/* Floating orb */}
        <div className="absolute right-1/4 top-1/3 w-64 h-64 rounded-full float opacity-30"
          style={{ background: "radial-gradient(circle, #1F4959 0%, transparent 70%)", transform: `translate(${parallaxX}px, ${parallaxY}px)` }} />

        <div className="relative max-w-6xl mx-auto px-8 pt-32 pb-20 grid md:grid-cols-2 items-center gap-12">
          <div>
            {/* Name */}
            {hasName && (
              <h1 className="text-7xl md:text-9xl font-light leading-[0.9] mb-8 fade-up"
                style={{ animationDelay: "0.2s", opacity: 0, letterSpacing: "-0.02em" }}>
                {datas.name.split(" ").map((word, i) => (
                  <span key={i} className={`block ${i === 1 ? "italic text-[#5C7C89]" : ""}`}>{word}</span>
                ))}
              </h1>
            )}

            <div className="line-deco my-10 w-48 fade-up" style={{ animationDelay: "0.35s", opacity: 0 }} />

            {/* Tagline */}
            {hasTagline && (
              <p className="text-xl font-light text-white/60 max-w-lg leading-relaxed fade-up"
                style={{ animationDelay: "0.45s", opacity: 0 }}>
                {datas.tagline}
              </p>
            )}
          </div>

          {/* Profile photo */}
          {hasPhoto && (
            <div className="flex justify-center md:justify-end mt-12 md:mt-0">
              <div className="relative group">
                {/* Glow */}
                <div className="absolute -inset-10 rounded-full blur-3xl opacity-20 hidden md:block"
                  style={{ background: "radial-gradient(circle, #5C7C89, transparent 70%)", transform: `translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px)` }} />

                {/* Arch image */}
                <div className="arch overflow-hidden w-44 h-60 md:w-56 md:h-72">
                  <img src={datas.profilePhoto} alt={datas.name || "Profile"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ transform: `translate(${parallaxX * 0.4}px, ${parallaxY * 0.4}px)` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f2d]/50 to-transparent" />
                </div>

                {/* Outer border */}
                <div className="absolute -inset-6 w-64 h-80 md:w-72 md:h-96 rounded-t-full border border-[#5C7C89]/20 -z-10" />

                {/* Qualification label */}
                {hasQual && (
                  <div className="mt-4 text-center">
                    <div className="mono text-xs text-[#5C7C89] tracking-widest">{datas.qualification}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 mono text-xs text-white/30 tracking-widest flex flex-col items-center gap-3">
          <span>scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#5C7C89] to-transparent" />
        </div>
      </section>

      {/* ── WORK / PROJECTS — only if projects exist ── */}
      {hasProjects && (
        <section id="work" className="py-32 relative">
          <div className="max-w-6xl mx-auto px-8">
            <div className="flex items-end justify-between mb-20">
              <div>
                <div className="mono text-xs tracking-widest text-[#5C7C89] mb-4">02 — Selected work</div>
                <h2 className="text-6xl font-light" style={{ letterSpacing: "-0.02em" }}>
                  What I've<br /><em className="italic">built</em>
                </h2>
              </div>
              <div className="line-deco flex-1 mx-16 mb-5" />
            </div>

            <div className="space-y-4">
              {datas.projects.map((p, i) => (
                <a key={i} href={p.link || "#"}
                  className="card-hover group flex items-start gap-8 p-8 border border-white/5 bg-white/2 hover:bg-[#1F4959]/20 transition-all duration-500 cursor-pointer"
                  style={{ transitionDelay: `${i * 50}ms` }}>
                  <div className="project-num mono shrink-0 w-24">{String(i + 1).padStart(2, "0")}</div>
                  <div className="flex-1 pt-3">
                    <div className="flex items-center justify-between mb-3">
                      {p.title && (
                        <h3 className="text-3xl font-light group-hover:text-[#5C7C89] transition-colors">{p.title}</h3>
                      )}
                      {p.link && (
                        <span className="mono text-xs text-white/30 group-hover:text-[#5C7C89] transition-colors">↗ view</span>
                      )}
                    </div>
                    {p.description && (
                      <p className="text-white/50 font-light leading-relaxed">{p.description}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SKILLS + EXPERIENCE — only if at least one exists ── */}
      {hasToolkitSection && (
        <section className="py-32 bg-[#1F4959]/10 relative overflow-hidden">
          <div className="absolute inset-0 grain opacity-50 pointer-events-none" />
          <div className="max-w-6xl mx-auto px-8">
            <div className={`grid gap-24 ${hasSkills && hasExperience ? "grid-cols-2" : "grid-cols-1"}`}>

              {/* Skills — only if skills exist */}
              {hasSkills && (
                <div>
                  <div className="mono text-xs tracking-widest text-[#5C7C89] mb-4">03 — Toolkit</div>
                  <h2 className="text-5xl font-light mb-12" style={{ letterSpacing: "-0.02em" }}>
                    The <em className="italic">craft</em>
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {datas.skills.map((s, i) => (
                      <span key={i}
                        className="skill-tag mono text-xs tracking-wider px-4 py-2 border border-[#5C7C89]/30 text-[#5C7C89] transition-all duration-300 cursor-default"
                        style={{ animationDelay: `${i * 50}ms` }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience — only if experience exists */}
              {hasExperience && (
                <div>
                  <div className="mono text-xs tracking-widest text-[#5C7C89] mb-4">04 — Journey</div>
                  <h2 className="text-5xl font-light mb-12" style={{ letterSpacing: "-0.02em" }}>
                    Where I've <em className="italic">been</em>
                  </h2>
                  <div className="space-y-8">
                    {datas.experience.map((e, i) => (
                      <div key={i} className="flex gap-6 group">
                        <div className="w-px bg-[#5C7C89]/20 group-hover:bg-[#5C7C89] transition-colors mt-1 shrink-0" />
                        <div>
                          {(e.startDate || e.endDate) && (
                            <div className="mono text-xs text-[#5C7C89] mb-1">
                              {e.startDate}{e.startDate && e.endDate ? " — " : ""}{e.endDate}
                            </div>
                          )}
                          {e.jobTitle && <div className="text-xl font-light">{e.jobTitle}</div>}
                          {e.company  && <div className="text-white/40 mono text-sm mt-1">{e.company}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── SERVICES — only if services exist ── */}
      {hasServices && (
        <section id="services" className="py-32">
          <div className="max-w-6xl mx-auto px-8">
            <div className="mono text-xs tracking-widest text-[#5C7C89] mb-4">05 — What I do</div>
            <h2 className="text-6xl font-light mb-20" style={{ letterSpacing: "-0.02em" }}>Services</h2>
            <div className="grid grid-cols-2 gap-px bg-white/5">
              {datas.services.map((s, i) => (
                <div key={i} className="group bg-[#0d1f2d] p-10 hover:bg-[#1F4959]/15 transition-all duration-500">
                  <div className="mono text-xs text-[#5C7C89] mb-6">{String(i + 1).padStart(2, "0")}</div>
                  {s.heading && (
                    <h3 className="text-2xl font-light mb-4 group-hover:text-[#5C7C89] transition-colors">{s.heading}</h3>
                  )}
                  <div className="line-deco mb-4 w-12" />
                  {s.description && (
                    <p className="text-white/40 font-light leading-relaxed text-sm">{s.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ABOUT — only if about text exists ── */}
      {hasAbout && (
        <section id="about" className="py-32 bg-[#1F4959]/10 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at right, #5C7C89, transparent 70%)" }} />
          <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-5 gap-16 md:gap-20 items-center">
            <div className="md:col-span-3">
              <div className="mono text-xs tracking-widest text-[#5C7C89] mb-4">06 — The person</div>
              <h2 className="text-6xl font-light mb-10" style={{ letterSpacing: "-0.02em" }}>
                About <em className="italic text-[#5C7C89]">me</em>
              </h2>
              <p className="text-xl font-light text-white/70 leading-relaxed mb-8">{datas.about}</p>
              <div className="line-deco w-48 mb-8" />

              {/* Meta pills — only render non-empty ones */}
              {(hasPlace || hasCompany || hasEducation) && (
                <div className="flex gap-8 flex-wrap">
                  {hasPlace && (
                    <div>
                      <div className="mono text-xs text-[#5C7C89] tracking-wider mb-1">Based in</div>
                      <div className="font-light">{datas.place}</div>
                    </div>
                  )}
                  {hasCompany && (
                    <div>
                      <div className="mono text-xs text-[#5C7C89] tracking-wider mb-1">Currently</div>
                      <div className="font-light">{datas.company}</div>
                    </div>
                  )}
                  {hasEducation && datas.education[0]?.institution && (
                    <div>
                      <div className="mono text-xs text-[#5C7C89] tracking-wider mb-1">Education</div>
                      <div className="font-light">{datas.education[0].institution}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex justify-center mt-10 md:mt-0">
              <div className="relative">
                <div className="w-56 h-72 rounded-t-full border border-[#5C7C89]/30 flex items-end justify-center pb-8 relative overflow-hidden"
                  style={{ background: "linear-gradient(to bottom, rgba(31,73,89,0.2), transparent)" }}>
                  <div className="absolute inset-0 grain opacity-30" />
                  <div className="relative text-center">
                    {hasQual && (
                      <div className="mono text-xs text-[#5C7C89] tracking-widest">{datas.qualification}</div>
                    )}
                    {hasEducation && datas.education[0]?.year && (
                      <div className="mono text-[10px] text-white/30 mt-1">{datas.education[0].year}</div>
                    )}
                  </div>
                </div>
                {/* Outer arch frame */}
                <div className="absolute -inset-6 w-72 h-96 rounded-t-full border border-[#5C7C89]/10 -z-10"
                  style={{ left: "-28px", top: "-24px" }} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CONTACT ── */}
      <section id="contact" className="py-40 relative overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center bottom, rgba(31,73,89,0.3), transparent 60%)" }} />
        <div className="relative max-w-6xl mx-auto px-8 text-center">
          <div className="mono text-xs tracking-widest text-[#5C7C89] mb-8">07 — Let's talk</div>
          <h2 className="text-8xl font-light mb-6" style={{ letterSpacing: "-0.03em" }}>
            Got a<br /><em className="italic text-[#5C7C89]">project?</em>
          </h2>
          <p className="text-white/40 font-light text-lg mb-16 max-w-md mx-auto leading-relaxed">
            Open to interesting problems, ambitious products, and the occasional impossible deadline.
          </p>

          <div className="line-deco w-32 mx-auto mb-16" />

          {/* Socials — only if at least one link exists */}
          {hasSocials && (
            <div className="flex justify-center gap-12 mb-16">
              {Object.entries(datas.socials[0]).map(([k, v]) =>
                v ? (
                  <a key={k} href={`https://${v}`} target="_blank" rel="noreferrer"
                    className="mono text-xs tracking-widest text-[#5C7C89] hover:text-white transition-colors uppercase">
                    {k}
                  </a>
                ) : null
              )}
            </div>
          )}

          <a href="mailto:hello@alexmercer.dev"
            className="inline-flex items-center gap-4 border border-[#5C7C89] px-12 py-5 text-lg font-light hover:bg-[#5C7C89] transition-all duration-300 group">
            Say Hello
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-8 flex justify-between items-center">
          {hasName && (
            <div className="mono text-xs text-white/20 tracking-widest">© 2026 {datas.name}</div>
          )}
          <div className="mono text-xs text-white/20 tracking-widest">Designed & Built with intent</div>
        </div>
      </footer>
    </div>
  );
}