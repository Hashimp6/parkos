import { useState, useEffect, useRef } from "react";

const DEMO = {
  name: "Alex Smith",
  email: "alex@example.com",
  phone: "+1 (555) 234-5678",
  place: "San Francisco, CA",
  profilePhoto: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp",
  cv: "",
  about: "I craft fast, accessible, and beautiful web experiences. Passionate about clean code, thoughtful UI, and turning complex problems into elegant solutions at the intersection of design and engineering.",
  tagline: "Frontend Developer",
  qualification: "B.Sc. Computer Science",
  services: [
    { heading: "UI Development", description: "Pixel-perfect interfaces built with React, Tailwind, and modern CSS that feel alive." },
    { heading: "Performance", description: "Lighthouse in the green. Lazy-loading, code-splitting, edge delivery at scale." },
    { heading: "Design Systems", description: "Scalable component libraries with Storybook, tokens, and clean Figma handoffs." },
    { heading: "API Integration", description: "REST & GraphQL wiring, caching strategies, real-time WebSocket features." },
  ],
  skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "GraphQL", "Figma", "Next.js", "PostgreSQL", "AWS", "Docker"],
  education: [
    { education: "B.Sc. Computer Science", institution: "Stanford University", year: 2018, percentage: "3.9 GPA" },
    { education: "High School Diploma", institution: "Lincoln High School", year: 2014, percentage: "95%" },
  ],
  experience: [
    { jobTitle: "Senior Frontend Engineer", company: "Stripe", startDate: "2021-06-01", endDate: null },
    { jobTitle: "Frontend Developer", company: "Figma", startDate: "2019-02-01", endDate: "2021-05-31" },
    { jobTitle: "Junior Developer", company: "Agency X", startDate: "2018-08-01", endDate: "2019-01-31" },
  ],
  lookingVacancy: ["Senior Frontend Engineer", "Tech Lead", "UI Architect"],
};

/* ── ICONS ─────────────────────────────────────────────────── */
const Ico = {
  arrow: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg>,
  arrowR: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  mail: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>,
  pin: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  li: <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  gh: <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>,
  tw: <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  web: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
};

/* ── COUNTER ANIMATION ─────────────────────────────────────── */
function Counter({ to, suffix="" }) {
  const [val, setVal] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = () => {
        start += Math.ceil(to / 40);
        if (start >= to) { setVal(to); return; }
        setVal(start);
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── REVEAL ────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("vis"); });
    }, { threshold: 0.1 });
    document.querySelectorAll(".rv").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ══════════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════════ */
export default function Profile6({ data }) {

  const D = data || DEMO||{};

  const soc = D.socials?.[0] || {};

  const fmt = d =>
    !d ? "  " :
    new Date(d).toLocaleDateString("en-US",{month:"short",year:"numeric"});

  const expYears =
    D.experience?.length
      ? new Date().getFullYear() -
        new Date(D.experience[D.experience.length-1].startDate).getFullYear()
      : 0;

  useReveal();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const go = id => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); };

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#f5f3ee;color:#0d0d0d;font-family:'Manrope',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        img{display:block;max-width:100%}
        a{color:inherit;text-decoration:none}

        /* REVEAL */
        .rv{opacity:0;transform:translateY(30px);transition:opacity .65s ease,transform .65s ease}
        .rv.vis{opacity:1;transform:none}
        .rv.d1{transition-delay:.1s} .rv.d2{transition-delay:.2s} .rv.d3{transition-delay:.3s} .rv.d4{transition-delay:.4s}

        /* NAV */
        .nav{position:fixed;top:0;left:0;right:0;z-index:999;height:68px;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(1.2rem,4vw,3.5rem);transition:all .35s}
        .nav.s{background:rgba(245,243,238,.93);backdrop-filter:blur(14px);border-bottom:2px solid #0d0d0d;box-shadow:0 2px 0 #0d0d0d}
        .nav-brand{font-family:'Syne',sans-serif;font-size:1.45rem;font-weight:800;letter-spacing:-.01em;cursor:pointer;color:#0d0d0d}
        .nav-brand span{color:#e85d04}
        .nav-links{display:flex;gap:2.2rem;list-style:none;align-items:center}
        .nav-links button{font-family:'Manrope',sans-serif;font-size:.8rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;background:none;border:none;cursor:pointer;color:#555;transition:color .2s;padding:4px 0;border-bottom:2px solid transparent}
        .nav-links button:hover{color:#e85d04;border-bottom-color:#e85d04}
        .nav-cv{padding:9px 22px;background:#0d0d0d;color:#f5f3ee!important;border-radius:0!important;font-family:'JetBrains Mono',monospace!important;font-size:.72rem!important;letter-spacing:.08em!important;text-transform:uppercase!important;border:2px solid #0d0d0d!important;transition:background .2s,color .2s!important}
        .nav-cv:hover{background:#e85d04!important;border-color:#e85d04!important;color:#fff!important}
        .ham{display:none;background:none;border:none;cursor:pointer;flex-direction:column;gap:5px;padding:4px}
        .ham span{display:block;width:24px;height:2px;background:#0d0d0d;transition:all .25s}

        /* HERO */
        .hero{min-height:100vh;display:grid;grid-template-columns:1fr 480px;padding-top:68px;overflow:hidden}
        .hero-left{display:flex;flex-direction:column;justify-content:center;padding:80px clamp(1.2rem,4vw,3.5rem) 80px clamp(1.2rem,4vw,3.5rem);border-right:3px solid #0d0d0d;position:relative;background:#f5f3ee}
        .hero-tag{display:inline-flex;align-items:center;gap:.7rem;margin-bottom:2rem;padding:8px 16px;border:2px solid #0d0d0d;font-family:'JetBrains Mono',monospace;font-size:.72rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;background:#e85d04;color:#fff}
        .hero-h1{font-family:'Syne',sans-serif;font-size:clamp(4rem,8.5vw,7.5rem);font-weight:800;line-height:.88;letter-spacing:-.03em;color:#0d0d0d;margin-bottom:2rem}
        .hero-h1 .ital{font-style:italic;color:#e85d04}
        .hero-bio{font-size:1rem;font-weight:400;color:#555;line-height:1.85;max-width:440px;margin-bottom:2.5rem}
        .hero-btns{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:3rem}
        .btn-blk{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:#0d0d0d;color:#f5f3ee;font-family:'Syne',sans-serif;font-weight:700;font-size:.85rem;letter-spacing:.06em;text-transform:uppercase;border:2px solid #0d0d0d;cursor:pointer;transition:all .2s}
        .btn-blk:hover{background:#e85d04;border-color:#e85d04}
        .btn-out{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:transparent;color:#0d0d0d;font-family:'Syne',sans-serif;font-weight:700;font-size:.85rem;letter-spacing:.06em;text-transform:uppercase;border:2px solid #0d0d0d;cursor:pointer;transition:all .2s}
        .btn-out:hover{background:#0d0d0d;color:#f5f3ee}
        .hero-meta{display:flex;gap:1.5rem;flex-wrap:wrap}
        .meta-item{display:flex;align-items:center;gap:.45rem;font-family:'JetBrains Mono',monospace;font-size:.72rem;color:#888;letter-spacing:.04em}
        .meta-item svg{color:#e85d04}

        /* PHOTO PANEL */
        .hero-right{position:relative;overflow:hidden;background:#0d0d0d}
        .hero-photo{width:100%;height:100%;min-height:600px;object-fit:cover;object-position:center top;filter:grayscale(15%) contrast(1.05);transition:transform .6s ease}
        .hero-right:hover .hero-photo{transform:scale(1.03)}
        .hero-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(13,13,13,.85) 0%,transparent 50%);pointer-events:none}
        .hero-name-badge{position:absolute;bottom:0;left:0;right:0;padding:2rem 2rem 2.5rem;z-index:2}
        .hero-name-badge h2{font-family:'Syne',sans-serif;font-size:2.2rem;font-weight:800;color:#fff;letter-spacing:-.02em;line-height:1}
        .hero-name-badge p{font-family:'JetBrains Mono',monospace;font-size:.72rem;color:rgba(255,255,255,.5);letter-spacing:.1em;text-transform:uppercase;margin-top:.4rem}
        .hero-status{position:absolute;top:2rem;right:2rem;display:flex;align-items:center;gap:.5rem;background:rgba(245,243,238,.12);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.15);padding:8px 14px;border-radius:0}
        .status-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;animation:blink 2s infinite}
        .status-txt{font-family:'JetBrains Mono',monospace;font-size:.65rem;color:rgba(255,255,255,.7);letter-spacing:.08em;text-transform:uppercase}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}

        /* STATS BAR */
        .stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:3px solid #0d0d0d;border-bottom:3px solid #0d0d0d;background:#0d0d0d}
        .stat-item{padding:2.2rem 2rem;border-right:2px solid #1c1c1c;text-align:center}
        .stat-item:last-child{border-right:none}
        .stat-n{font-family:'Syne',sans-serif;font-size:3rem;font-weight:800;color:#fff;line-height:1}
        .stat-l{font-family:'JetBrains Mono',monospace;font-size:.65rem;color:rgba(255,255,255,.35);letter-spacing:.14em;text-transform:uppercase;margin-top:.4rem}

        /* SECTION */
        .sec{padding:100px clamp(1.2rem,4vw,3.5rem)}
        .sec-hd{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:4rem;gap:2rem;flex-wrap:wrap}
        .sec-num{font-family:'JetBrains Mono',monospace;font-size:.72rem;color:#e85d04;letter-spacing:.18em;text-transform:uppercase;margin-bottom:.5rem}
        .sec-title{font-family:'Syne',sans-serif;font-size:clamp(2.8rem,5.5vw,4.5rem);font-weight:800;letter-spacing:-.03em;color:#0d0d0d;line-height:.95}

        /* SERVICES */
        .svc-wrap{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:0;border:3px solid #0d0d0d;overflow:hidden}
        .svc-card{padding:2.5rem 2rem;border-right:2px solid #0d0d0d;border-bottom:2px solid #0d0d0d;background:#f5f3ee;position:relative;transition:background .2s,color .2s;overflow:hidden;cursor:default}
        .svc-card:hover{background:#0d0d0d;color:#f5f3ee}
        .svc-card:hover .svc-n{color:rgba(245,243,238,.08)}
        .svc-card:hover .svc-desc{color:rgba(245,243,238,.55)}
        .svc-n{font-family:'Syne',sans-serif;font-size:4rem;font-weight:800;color:rgba(13,13,13,.05);position:absolute;top:.8rem;right:1rem;line-height:1;transition:color .2s}
        .svc-h{font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:800;margin-bottom:.7rem;position:relative;z-index:1}
        .svc-desc{font-size:.85rem;color:#666;line-height:1.7;position:relative;z-index:1;transition:color .2s}

        /* SKILLS */
        .skills-sec{background:#0d0d0d;padding:80px clamp(1.2rem,4vw,3.5rem)}
        .skills-inner{max-width:1280px;margin:0 auto}
        .skills-label{font-family:'JetBrains Mono',monospace;font-size:.72rem;color:rgba(255,255,255,.3);letter-spacing:.2em;text-transform:uppercase;margin-bottom:1.5rem}
        .skills-grid{display:flex;flex-wrap:wrap;gap:10px}
        .sk{padding:10px 22px;border:2px solid rgba(255,255,255,.1);font-family:'Syne',sans-serif;font-size:.9rem;font-weight:700;color:rgba(255,255,255,.4);letter-spacing:.04em;transition:all .2s;cursor:default}
        .sk:hover{border-color:#e85d04;color:#e85d04;background:rgba(232,93,4,.06)}

        /* PROJECTS */
        .proj-wrap{display:flex;flex-direction:column;gap:0;border:3px solid #0d0d0d;overflow:hidden}
        .proj-card{display:grid;grid-template-columns:60px 1fr auto;gap:2rem;align-items:center;padding:2rem 2.5rem;border-bottom:2px solid #0d0d0d;background:#f5f3ee;transition:background .22s,color .22s;position:relative;overflow:hidden}
        .proj-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:#e85d04;transform:scaleY(0);transition:transform .25s ease;transform-origin:bottom}
        .proj-card:hover::before{transform:scaleY(1)}
        .proj-card:last-child{border-bottom:none}
        .proj-card:hover{background:#0d0d0d;color:#f5f3ee}
        .proj-card:hover .proj-desc{color:rgba(245,243,238,.5)}
        .proj-card:hover .proj-tech span{background:rgba(255,255,255,.07);color:rgba(255,255,255,.4);border-color:rgba(255,255,255,.1)}
        .proj-idx{font-family:'Syne',sans-serif;font-size:2.2rem;font-weight:800;color:rgba(13,13,13,.1);transition:color .22s;line-height:1}
        .proj-card:hover .proj-idx{color:rgba(245,243,238,.08)}
        .proj-h{font-family:'Syne',sans-serif;font-size:1.5rem;font-weight:800;letter-spacing:-.02em;margin-bottom:.4rem}
        .proj-desc{font-size:.85rem;color:#666;line-height:1.6;margin-bottom:.7rem;transition:color .22s}
        .proj-tech{display:flex;gap:6px;flex-wrap:wrap}
        .proj-tech span{font-family:'JetBrains Mono',monospace;font-size:.65rem;padding:3px 10px;border:1px solid #ddd;color:#999;transition:all .22s}
        .proj-link-btn{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border:2px solid #0d0d0d;flex-shrink:0;transition:all .22s;color:#0d0d0d}
        .proj-card:hover .proj-link-btn{border-color:#e85d04;color:#e85d04;background:rgba(232,93,4,.1)}
        .no-link{opacity:.15;cursor:default}

        /* JOURNEY */
        .journey{display:grid;grid-template-columns:1fr 1fr;gap:0;border:3px solid #0d0d0d;overflow:hidden}
        .j-panel{padding:3rem}
        .j-panel:first-child{border-right:2px solid #0d0d0d}
        .j-label{font-family:'JetBrains Mono',monospace;font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;color:#e85d04;margin-bottom:2rem;padding-bottom:1rem;border-bottom:2px solid #0d0d0d}
        .exp-row{display:flex;flex-direction:column;gap:0}
        .exp-item{padding:1.4rem 0;border-bottom:1px solid #e8e4dc;display:grid;grid-template-columns:1fr auto;gap:1rem;align-items:start}
        .exp-item:last-child{border-bottom:none}
        .exp-role{font-family:'Syne',sans-serif;font-size:1.05rem;font-weight:800;color:#0d0d0d;margin-bottom:.2rem}
        .exp-co{font-size:.82rem;color:#888}
        .exp-date{font-family:'JetBrains Mono',monospace;font-size:.68rem;color:#bbb;white-space:nowrap;text-align:right;padding-top:3px}
        .edu-item{padding:1.4rem;margin-bottom:2px;background:#f0ece3;border-left:4px solid #e85d04}
        .edu-deg{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#0d0d0d;margin-bottom:.25rem}
        .edu-inst{font-size:.82rem;color:#888;margin-bottom:.6rem}
        .edu-tags{display:flex;gap:6px;flex-wrap:wrap}
        .edu-tag{font-family:'JetBrains Mono',monospace;font-size:.65rem;padding:3px 10px;background:#0d0d0d;color:#f5f3ee}

        /* CONTACT */
        .contact-wrap{display:grid;grid-template-columns:1fr 1fr;border:3px solid #0d0d0d;overflow:hidden}
        .contact-left-p{background:#e85d04;padding:4rem 3rem;display:flex;flex-direction:column;gap:2.5rem}
        .contact-bigtext{font-family:'Syne',sans-serif;font-size:clamp(2.6rem,5vw,4rem);font-weight:800;color:#fff;line-height:.9;letter-spacing:-.03em}
        .contact-sub-p{font-size:.95rem;color:rgba(255,255,255,.7);line-height:1.75}
        .contact-right-p{background:#f5f3ee;padding:4rem 3rem}
        .c-field{margin-bottom:2rem}
        .c-label{font-family:'JetBrains Mono',monospace;font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:#aaa;margin-bottom:.35rem}
        .c-val{font-family:'Syne',sans-serif;font-size:1.35rem;font-weight:800;color:#0d0d0d;transition:color .2s}
        .c-val:hover{color:#e85d04}
        .soc-list{display:flex;gap:8px;flex-wrap:wrap;padding-top:2rem;border-top:2px solid #e8e4dc;margin-top:.5rem}
        .soc-item{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border:2px solid #0d0d0d;font-family:'JetBrains Mono',monospace;font-size:.7rem;font-weight:500;color:#0d0d0d;transition:all .2s}
        .soc-item:hover{background:#0d0d0d;color:#f5f3ee}
        .vacancy-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:1.5rem}
        .vac-tag{padding:6px 14px;border:2px solid rgba(255,255,255,.3);font-family:'JetBrains Mono',monospace;font-size:.68rem;color:rgba(255,255,255,.7);letter-spacing:.06em}

        /* FOOTER */
        .footer{padding:1.6rem clamp(1.2rem,4vw,3.5rem);border-top:3px solid #0d0d0d;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.8rem;background:#f5f3ee}
        .footer p{font-family:'JetBrains Mono',monospace;font-size:.65rem;color:#aaa;letter-spacing:.08em}

        /* RESPONSIVE */
        @media(max-width:960px){
          .hero{grid-template-columns:1fr!important}
          .hero-right{height:70vw;max-height:500px}
          .hero-left{border-right:none!important;border-bottom:3px solid #0d0d0d}
          .stats{grid-template-columns:repeat(2,1fr)!important}
          .journey{grid-template-columns:1fr!important}
          .j-panel:first-child{border-right:none!important;border-bottom:2px solid #0d0d0d}
          .contact-wrap{grid-template-columns:1fr!important}
          .proj-card{grid-template-columns:1fr!important}
          .proj-idx{display:none}
        }
        @media(max-width:640px){
          .nav-links{display:none}
          .ham{display:flex!important}
        }
      `}</style>

      {/* NAV */}
      <nav className={`nav${scrolled?" s":""}`}>
        <div className="nav-brand" onClick={() => go("hero")}>{D.name?.split(" ")[0]}<span>.</span></div>
        <ul className="nav-links">
          {D.services?.length && <li><button onClick={() => go("services")}>Services</button></li>}
          {D.projects?.length && <li><button onClick={() => go("projects")}>Work</button></li>}
          {(D.experience?.length || D.education?.length) && <li><button onClick={() => go("journey")}>Journey</button></li>}
          <li><button onClick={() => go("contact")}>Contact</button></li>
          {D.cv && <li><a href={D.cv} className="nav-links nav-cv" style={{display:"inline-block"}}>CV ↓</a></li>}
        </ul>
        <button className="ham" onClick={() => setMenuOpen(o=>!o)}>
          {[0,1,2].map(i=><span key={i} style={{transform: menuOpen&&i===0?"translateY(7px) rotate(45deg)":menuOpen&&i===2?"translateY(-7px) rotate(-45deg)":menuOpen&&i===1?"scaleX(0)":"none"}}/>)}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div style={{position:"fixed",top:68,left:0,right:0,zIndex:998,background:"#f5f3ee",borderBottom:"3px solid #0d0d0d",padding:"1.5rem clamp(1.2rem,4vw,3.5rem)"}}>
          {[["services","Services"],[D.projects?.length&&"projects","Work"],[((D.experience?.length||D.education?.length))&&"journey","Journey"],["contact","Contact"]].filter(x=>x[0]).map(([id,lbl])=>(
            <button key={id} onClick={()=>go(id)} style={{display:"block",width:"100%",textAlign:"left",background:"none",border:"none",padding:"12px 0",borderBottom:"1px solid #e8e4dc",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.1rem",cursor:"pointer",letterSpacing:"-.01em"}}>{lbl}</button>
          ))}
        </div>
      )}

      {/* HERO */}
      <section id="hero" className="hero">
        <div className="hero-left">
          <div className="hero-tag rv">
            <span style={{width:8,height:8,borderRadius:"50%",background:"#fff",display:"inline-block"}}/>
            {D.tagline}
          </div>
          <h1 className="hero-h1 rv d1">
            {D.name?.split(" ")[0]}<br/>
            <span className="ital">{D.name?.split(" ")[1]}</span>
          </h1>
          {D.about && <p className="hero-bio rv d2">{D.about}</p>}
          <div className="hero-btns rv d3">
            <button className="btn-blk" onClick={()=>go("contact")}>Let's talk {Ico.arrowR}</button>
            {D.cv && <a href={D.cv} className="btn-out">Download CV</a>}
          </div>
          <div className="hero-meta rv d4">
            {D.place && <div className="meta-item">{Ico.pin}{D.place}</div>}
            {D.email && <div className="meta-item">{Ico.mail}{D.email}</div>}
          </div>
        </div>

        {D.profilePhoto && (
          <div className="hero-right">
            <img className="hero-photo" src={D.profilePhoto} alt={D.name}/>
            <div className="hero-overlay"/>
            <div className="hero-name-badge">
              <h2>{D.name}</h2>
              {D.qualification && <p>{D.qualification}</p>}
            </div>
         
          </div>
        )}
      </section>

      {/* STATS */}
      {/* <div className="stats">
        {[
          [expYears, "Years Experience"],
          [D.projects?.length || 0, "Projects Built"],
          [D.skills?.length || 0, "Technologies"],
          [D.experience?.length || 0, "Companies"],
        ].map(([n, l], i) => (
          <div key={i} className="stat-item rv">
            <div className="stat-n"><Counter to={n} suffix="+"/></div>
            <div className="stat-l">{l}</div>
          </div>
        ))}
      </div> */}

      {/* SERVICES */}
      {D.services?.length > 0 && (
        <section id="services" className="sec" style={{background:"#f5f3ee"}}>
          <div style={{maxWidth:1280,margin:"0 auto"}}>
            <div className="sec-hd rv">
              <div>
                <div className="sec-num">01 — What I offer</div>
                <h2 className="sec-title">Services</h2>
              </div>
            </div>
            <div className="svc-wrap rv d1">
              {D.services.map((sv,i)=>(
                <div key={i} className="svc-card">
                  <div className="svc-n">0{i+1}</div>
                  <div className="svc-h">{sv.heading}</div>
                  <div className="svc-desc">{sv.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SKILLS */}
      {D.skills?.length > 0 && (
        <div className="skills-sec">
          <div className="skills-inner">
            <div className="skills-label rv">Technologies & Tools</div>
            <div className="skills-grid">
              {D.skills.map((sk,i)=>(
                <div key={i} className={`sk rv d${Math.min(i%4+1,4)}`}>{sk}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PROJECTS */}
      {D.projects?.length > 0 && (
        <section id="projects" className="sec" style={{background:"#f5f3ee"}}>
          <div style={{maxWidth:1280,margin:"0 auto"}}>
            <div className="sec-hd rv">
              <div>
                <div className="sec-num">02 — Portfolio</div>
                <h2 className="sec-title">Selected Work</h2>
              </div>
            </div>
            <div className="proj-wrap rv d1">
              {D.projects.map((p,i)=>(
                <div key={i} className="proj-card">
                  <div className="proj-idx">0{i+1}</div>
                  <div>
                    <div className="proj-h">{p.title}</div>
                    <div className="proj-desc">{p.description}</div>
                    {p.tech && <div className="proj-tech">{p.tech.map((t,j)=><span key={j}>{t}</span>)}</div>}
                  </div>
                  {p.link
                    ? <a href={p.link} target="_blank" rel="noreferrer" className="proj-link-btn">{Ico.arrow}</a>
                    : <div className="proj-link-btn no-link">{Ico.arrow}</div>
                  }
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* JOURNEY */}
      {(D.experience?.length > 0 || D.education?.length > 0) && (
        <section id="journey" className="sec" style={{background:"#ede9e0"}}>
          <div style={{maxWidth:1280,margin:"0 auto"}}>
            <div className="sec-hd rv">
              <div>
                <div className="sec-num">03 — Background</div>
                <h2 className="sec-title">My Journey</h2>
              </div>
            </div>
            <div className="journey rv d1">
              {D.experience?.length > 0 && (
                <div className="j-panel">
                  <div className="j-label">Work Experience</div>
                  <div className="exp-row">
                    {D.experience.map((e,i)=>(
                      <div key={i} className="exp-item">
                        <div>
                          <div className="exp-role">{e.jobTitle}</div>
                          <div className="exp-co">{e.company}</div>
                        </div>
                        {/* <div className="exp-date">{fmt(e.startDate)}<br/>—<br/>{fmt(e.endDate)}</div> */}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {D.education?.length > 0 && (
                <div className="j-panel">
                  <div className="j-label">Education</div>
                  {D.education.map((e,i)=>(
                    <div key={i} className="edu-item" style={{marginBottom: i<D.education.length-1?"2px":0}}>
                      <div className="edu-deg">{e.education}</div>
                      <div className="edu-inst">{e.institution}</div>
                      <div className="edu-tags">
                        {e.year && <span className="edu-tag">{e.year}</span>}
                        {e.percentage && <span className="edu-tag">{e.percentage}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="sec" style={{background:"#f5f3ee"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div className="sec-hd rv">
            <div>
              <div className="sec-num">04 — Get in touch</div>
              <h2 className="sec-title">Contact</h2>
            </div>
          </div>
          <div className="contact-wrap rv d1">
            <div className="contact-left-p">
              <div>
                <div className="contact-bigtext">Let's Build<br/>Something<br/>Great.</div>
                <div className="contact-sub-p" style={{marginTop:"1.5rem"}}>Open to new projects, roles, and conversations. Don't be a stranger.</div>
              </div>
              {D.lookingVacancy?.length > 0 && (
                <div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".62rem",letterSpacing:".16em",textTransform:"uppercase",color:"rgba(255,255,255,.5)",marginBottom:".7rem"}}>Open to</div>
                  <div className="vacancy-tags">
                    {D.lookingVacancy.map((v,i)=><span key={i} className="vac-tag">{v}</span>)}
                  </div>
                </div>
              )}
            </div>
            <div className="contact-right-p">
              {D.email && <div className="c-field"><div className="c-label">Email</div><a href={`mailto:${D.email}`} className="c-val" style={{display:"block"}}>{D.email}</a></div>}
              {D.phone && <div className="c-field"><div className="c-label">Phone</div><a href={`tel:${D.phone}`} className="c-val" style={{display:"block"}}>{D.phone}</a></div>}
              {D.place && <div className="c-field"><div className="c-label">Location</div><div className="c-val" style={{fontSize:"1.1rem",color:"#555"}}>{D.place}</div></div>}
              <div className="soc-list">
                {soc.linkedin && <a href={soc.linkedin} target="_blank" rel="noreferrer" className="soc-item">{Ico.li} LinkedIn</a>}
                {soc.github && <a href={soc.github} target="_blank" rel="noreferrer" className="soc-item">{Ico.gh} GitHub</a>}
                {soc.twitter && <a href={soc.twitter} target="_blank" rel="noreferrer" className="soc-item">{Ico.tw} Twitter</a>}
                {soc.website && <a href={soc.website} target="_blank" rel="noreferrer" className="soc-item">{Ico.web} Website</a>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} {D.name} — All rights reserved</p>
        <p>{D.place}</p>
      </footer>
    </>
  );
}