import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import BusinessCard from "../../components/ProfileVisitng";

const DISCOVER = [
  {
    key: "job", label: "Find a Job", sub: "Browse open roles", num: "01",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
  },
  {
    key: "company", label: "Companies", sub: "Explore workplaces", num: "02",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    key: "people", label: "Find People", sub: "Grow your network", num: "03",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  {
    key: "Manage Freelance", label: "Manage freelance", sub: "Add freelance services", num: "04",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        
        <rect x="3" y="4" width="18" height="14" rx="2"/>
        <line x1="12" y1="8" x2="12" y2="14"/>
        <line x1="9" y1="11" x2="15" y2="11"/>
        
      </svg>
    )},
];


export default function CandidateHomeSection({ onNavigate }) {
  const navigate = useNavigate();
  const { user, logoutUser } = useUser();
  const [showCard, setShowCard] = useState(false);
  console.log("User from context:", user);
  const goto = (path) => { if (onNavigate) onNavigate(path); else navigate(path); };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Morning";
    if (h < 17) return "Afternoon";
    return "Evening";
  };

  const handleLogout = () => { logoutUser(); navigate("/login"); };
  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  const pctComplete = (() => {
    if (!user) return 0;
    const fields = [user.name, user.email, user.phone, user.profilePhoto, user.tagline, user.about, user.skills?.some(Boolean), user.experience?.some(e => e.jobTitle)];
    return Math.round(fields.filter(Boolean).length / fields.length * 100);
  })();

  if (!user) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#fafafa" }}>
      <div style={{ width:32, height:32, border:"2px solid #e5e5e5", borderTop:"2px solid #111", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .hx { font-family: 'Outfit', system-ui, sans-serif; background: #f4f4f5; min-height: 100vh; -webkit-font-smoothing: antialiased; }

        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes riseIn  { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes modalIn { from { opacity:0; transform:translateY(50px) scale(0.92); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes floatY  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes dotPulse{ 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0.6} }
        @keyframes barGrow { from{width:0} to{width:var(--w)} }

        .hx-r1 { animation: riseIn .55s cubic-bezier(.16,1,.3,1) .05s both; }
        .hx-r2 { animation: riseIn .55s cubic-bezier(.16,1,.3,1) .12s both; }
        .hx-r3 { animation: riseIn .55s cubic-bezier(.16,1,.3,1) .19s both; }
        .hx-r4 { animation: riseIn .55s cubic-bezier(.16,1,.3,1) .26s both; }

        /* ── LAYOUT ── */
        .hx-root {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: auto;
          gap: 0;
          min-height: 100vh;
        }

        /* Desktop: sidebar + main */
        @media (min-width: 900px) {
          .hx-root {
            grid-template-columns: 360px 1fr;
            grid-template-rows: 1fr;
            align-items: start;
          }
        }

        /* ── SIDEBAR (profile + stats) ── */
        .hx-sidebar {
          padding: 28px 20px 40px;
          display: flex; flex-direction: column; gap: 16px;
        }
        @media (min-width: 900px) {
          .hx-sidebar {
            position: sticky; top: 0; height: 100vh;
            overflow-y: auto; padding: 36px 24px 40px;
            border-right: 1px solid #e8e8e8;
            background: white;
            gap: 20px;
          }
        }

        /* ── MAIN CONTENT ── */
        .hx-main {
          padding: 24px 20px 60px;
          display: flex; flex-direction: column; gap: 28px;
        }
        @media (min-width: 900px) {
          .hx-main { padding: 36px 40px 60px; }
        }

        /* ── TOP NAV BAR ── */
        .hx-topbar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 4px;
        }

        .hx-greeting-sub {
          font-size: 10px; font-weight: 600; letter-spacing: 0.18em;
          text-transform: uppercase; color: #bbb; margin-bottom: 4px;
        }
        .hx-greeting-title {
          font-family: 'DM Serif Display', serif;
          font-size: 28px; color: #0a0a0a; line-height: 1.1;
        }
        @media (min-width: 900px) {
          .hx-greeting-title { font-size: 22px; }
        }
        .hx-greeting-title em { font-style: italic; color: #999; }

        .hx-topbar-actions { display: flex; align-items: center; gap: 8px; }

        /* Share button */
        .hx-share {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 18px; border-radius: 22px;
          background: #0a0a0a; color: #fff;
          font-family: 'Outfit', sans-serif; font-size: 11px;
          font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase;
          border: none; cursor: pointer;
          box-shadow: 0 4px 18px rgba(0,0,0,0.18);
          position: relative; overflow: hidden;
          transition: all .25s cubic-bezier(.16,1,.3,1);
        }
        .hx-share:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,0,0,0.26); background: #1a1a1a; }
        .hx-share:active { transform: scale(.96); }
        .hx-share-live { width:6px; height:6px; border-radius:50%; background:#4ade80; animation: dotPulse 2s ease-in-out infinite; }

        /* Logout circle */
        .hx-logout {
          width:38px; height:38px; border-radius:50%;
          background:#fff; border:1.5px solid #e5e5e5;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:#aaa;
          box-shadow: 0 1px 4px rgba(0,0,0,.05);
          transition: all .2s;
        }
        .hx-logout:hover { border-color:#ffcdd2; background:#fff5f5; color:#e03333; transform:rotate(8deg); }

        /* ── PROFILE CARD ── */
        .hx-profile-card {
          background: white; border-radius: 24px; overflow: hidden;
          border: 1px solid #eaeaea;
          box-shadow: 0 2px 20px rgba(0,0,0,.06);
        }
        .hx-banner {
          height: 90px; background: #0a0a0a;
          position: relative; overflow: hidden;
        }
        .hx-banner-grid {
          position:absolute; inset:0;
          background-image: linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .hx-banner-arc {
          position:absolute; bottom:-50px; right:-50px;
          width:180px; height:180px; border-radius:50%;
          border: 1px solid rgba(255,255,255,.05);
        }
        .hx-banner-arc2 {
          position:absolute; bottom:-25px; right:-25px;
          width:110px; height:110px; border-radius:50%;
          border: 1px solid rgba(255,255,255,.04);
        }
        .hx-banner-tag {
          position:absolute; bottom:12px; left:18px;
          font-size:8px; font-weight:600; letter-spacing:.2em;
          text-transform:uppercase; color:rgba(255,255,255,.2);
        }

        .hx-card-body { padding: 0 18px 20px; }

        .hx-avatar-row {
          display:flex; align-items:flex-end; justify-content:space-between;
          margin-top:-36px; margin-bottom:14px;
        }
        .hx-av-wrap { position:relative; }
        .hx-av {
          width:72px; height:72px; border-radius:50%;
          border:4px solid white; background:#f0f0f0;
          display:flex; align-items:center; justify-content:center;
          overflow:hidden; box-shadow:0 4px 14px rgba(0,0,0,.1);
          font-family:'DM Serif Display',serif; font-size:26px; color:#444;
        }
        .hx-av img { width:100%; height:100%; object-fit:cover; }
        .hx-av-dot {
          position:absolute; bottom:3px; right:3px;
          width:14px; height:14px; border-radius:50%;
          background:#22c55e; border:3px solid white;
        }

        .hx-pct-pill {
          display:flex; flex-direction:column; align-items:center;
          background:#f7f7f7; border:1.5px solid #efefef; border-radius:12px;
          padding:7px 13px;
        }
        .hx-pct-n { font-family:'DM Serif Display',serif; font-size:20px; color:#0a0a0a; line-height:1; }
        .hx-pct-l { font-size:8px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:#bbb; margin-top:2px; }

        .hx-uname {
          font-family:'DM Serif Display',serif;
          font-size:22px; color:#0a0a0a; margin-bottom:3px;
        }
        .hx-utag {
          font-size:11px; color:#999; font-style:italic;
          margin-bottom:12px; line-height:1.4;
        }

        .hx-chips { display:flex; gap:5px; flex-wrap:wrap; margin-bottom:12px; }
        .hx-chip {
          display:inline-flex; align-items:center; gap:4px;
          padding:3px 9px; border-radius:20px;
          background:#f5f5f5; border:1px solid #eee;
          font-size:9.5px; color:#777; font-weight:500;
        }

        .hx-skills { display:flex; gap:4px; flex-wrap:wrap; margin-bottom:14px; }
        .hx-sk {
          padding:3px 9px; border-radius:6px;
          font-size:9px; font-weight:700; letter-spacing:.07em; text-transform:uppercase;
          background:#f0f0f0; color:#666; border:1px solid #e8e8e8;
          transition:all .15s;
        }
        .hx-sk:hover { background:#0a0a0a; color:white; border-color:#0a0a0a; }
        .hx-sk-more { background:#0a0a0a; color:white; border-color:#0a0a0a; }

        .hx-prog { margin-bottom:14px; }
        .hx-prog-top { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:7px; }
        .hx-prog-lbl { font-size:9px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#bbb; }
        .hx-prog-val { font-family:'DM Serif Display',serif; font-size:16px; color:#0a0a0a; }
        .hx-prog-track { height:3px; background:#f0f0f0; border-radius:3px; overflow:hidden; }
        .hx-prog-bar { height:100%; background:linear-gradient(90deg,#555,#0a0a0a); border-radius:3px; transition:width 1.2s cubic-bezier(.16,1,.3,1); }
        .hx-prog-hint { font-size:9.5px; color:#ccc; margin-top:5px; font-style:italic; }

        .hx-divider { height:1px; background:linear-gradient(90deg,transparent,#ebebeb 20%,#ebebeb 80%,transparent); margin:14px 0; }

        .hx-btns { display:flex; gap:7px; flex-wrap:wrap; }
        .hx-btn {
          display:inline-flex; align-items:center; gap:5px;
          padding:8px 15px; border-radius:10px;
          font-family:'Outfit',sans-serif; font-size:11px; font-weight:600;
          cursor:pointer; border:none; white-space:nowrap;
          transition:all .18s cubic-bezier(.16,1,.3,1);
        }
        .hx-btn:hover { transform:translateY(-1px); }
        .hx-btn:active { transform:scale(.97); }
        .hx-btn-dark { background:#0a0a0a; color:white; box-shadow:0 2px 10px rgba(0,0,0,.18); }
        .hx-btn-dark:hover { box-shadow:0 6px 20px rgba(0,0,0,.24); }
        .hx-btn-ghost { background:white; color:#555; border:1.5px solid #e5e5e5 !important; }
        .hx-btn-ghost:hover { background:#f8f8f8; color:#111; border-color:#ccc !important; }

        /* ── STATS ── */
        .hx-stats {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 10px;
        }
        .hx-stat {
          background:white; border-radius:18px; padding:16px 12px;
          border:1px solid #eaeaea;
          box-shadow:0 2px 10px rgba(0,0,0,.04);
          text-align:center; position:relative; overflow:hidden;
          transition:all .25s cubic-bezier(.16,1,.3,1); cursor:default;
        }
        .hx-stat:hover { transform:translateY(-3px); box-shadow:0 10px 28px rgba(0,0,0,.09); }
        .hx-stat-n { font-family:'DM Serif Display',serif; font-size:24px; color:#0a0a0a; line-height:1; margin-bottom:4px; }
        .hx-stat-l { font-size:9px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:#bbb; }
        .hx-stat-bar { position:absolute; bottom:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,#0a0a0a,transparent); opacity:0; transition:opacity .25s; }
        .hx-stat:hover .hx-stat-bar { opacity:1; }

        /* ── MAIN: HEADER ── */
        .hx-main-header {
          display:flex; align-items:center; justify-content:space-between;
          padding-bottom:20px;
          border-bottom: 2px solid #eaeaea;
        }
        .hx-main-title {
          font-family:'DM Serif Display',serif;
          font-size:32px; color:#0a0a0a; line-height:1.1;
        }
        .hx-main-sub { font-size:12px; color:#bbb; font-weight:500; margin-top:4px; }

        /* ── DISCOVER GRID ── */
        .hx-disc-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 600px) {
          .hx-disc-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1100px) {
          .hx-disc-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }

        .hx-disc-card {
          background:white; border-radius:22px;
          border:1px solid #eaeaea;
          box-shadow:0 2px 14px rgba(0,0,0,.04);
          padding:24px 22px 22px;
          cursor:pointer; position:relative; overflow:hidden;
          display:flex; flex-direction:column; gap:16px;
          transition:all .28s cubic-bezier(.16,1,.3,1);
          text-align:left;
        }
        .hx-disc-card::after {
          content:''; position:absolute; inset:0;
          background:#0a0a0a; opacity:0;
          transition:opacity .28s;
          border-radius:22px;
        }
        .hx-disc-card:hover { transform:translateY(-4px); box-shadow:0 20px 50px rgba(0,0,0,.12); border-color:#ccc; }
        .hx-disc-card:hover::after { opacity:1; }
        .hx-disc-card:active { transform:scale(.98); }

        /* All children sit above the overlay */
        .hx-disc-card > * { position:relative; z-index:1; }

        .hx-disc-top { display:flex; justify-content:space-between; align-items:flex-start; }
        .hx-disc-icon {
          width:50px; height:50px; border-radius:14px;
          background:#f5f5f5; border:1px solid #eee;
          display:flex; align-items:center; justify-content:center;
          color:#555; transition:all .28s;
        }
        .hx-disc-card:hover .hx-disc-icon { background:rgba(255,255,255,.1); border-color:rgba(255,255,255,.15); color:white; }

        .hx-disc-num {
          font-family:'DM Serif Display',serif; font-style:italic;
          font-size:13px; color:#ddd; transition:color .28s;
        }
        .hx-disc-card:hover .hx-disc-num { color:rgba(255,255,255,.3); }

        .hx-disc-label {
          font-family:'DM Serif Display',serif;
          font-size:20px; color:#0a0a0a; line-height:1.2;
          transition:color .28s;
        }
        .hx-disc-sub { font-size:11px; color:#bbb; margin-top:4px; transition:color .28s; }
        .hx-disc-card:hover .hx-disc-label { color:white; }
        .hx-disc-card:hover .hx-disc-sub { color:rgba(255,255,255,.45); }

        .hx-disc-arrow {
          display:flex; align-items:center; justify-content:space-between;
        }
        .hx-disc-arrow-btn {
          width:34px; height:34px; border-radius:50%;
          background:#f5f5f5; border:1px solid #ebebeb;
          display:flex; align-items:center; justify-content:center;
          color:#ccc; transition:all .28s;
        }
        .hx-disc-card:hover .hx-disc-arrow-btn { background:rgba(255,255,255,.15); border-color:rgba(255,255,255,.2); color:white; transform:translateX(4px); }

        /* ── MODAL ── */
        .hx-modal-bg {
          position:fixed; inset:0; z-index:1000;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          padding:24px; animation:fadeIn .3s ease both;
        }
        .hx-modal-bg::before {
          content:''; position:absolute; inset:0;
          background: radial-gradient(ellipse at 25% 15%, rgba(0,0,0,.03), transparent 60%),
                      radial-gradient(ellipse at 75% 85%, rgba(0,0,0,.04), transparent 55%),
                      rgba(244,244,245,.93);
          backdrop-filter:blur(28px) saturate(1.5);
          -webkit-backdrop-filter:blur(28px) saturate(1.5);
        }
        .hx-modal-bg::after {
          content:''; position:absolute; inset:0;
          background-image:radial-gradient(rgba(0,0,0,.06) 1px, transparent 1px);
          background-size:20px 20px; pointer-events:none;
        }
        .hx-modal-inner {
          position:relative; z-index:1;
          display:flex; flex-direction:column; align-items:center; gap:18px;
          animation:modalIn .55s cubic-bezier(.16,1,.3,1) both;
        }
        .hx-modal-eyebrow {
          display:flex; align-items:center; gap:10px;
          font-size:9px; font-weight:700; letter-spacing:.25em;
          text-transform:uppercase; color:#aaa;
          font-family:'Outfit',sans-serif;
        }
        .hx-modal-line { width:36px; height:1px; background:#ddd; }
        .hx-card-float {
          border-radius:24px;
          box-shadow: 0 2px 0 rgba(0,0,0,.04), 0 8px 0 -2px rgba(0,0,0,.03), 0 24px 64px rgba(0,0,0,.16), 0 4px 20px rgba(0,0,0,.07);
          animation:floatY 5s ease-in-out infinite;
        }
        .hx-modal-hint {
          display:flex; align-items:center; gap:8px;
          font-size:9px; font-weight:500; letter-spacing:.12em;
          text-transform:uppercase; color:#bbb;
          font-family:'Outfit',sans-serif;
        }
        .hx-modal-dot { width:3px; height:3px; border-radius:50%; background:#ccc; }
        .hx-modal-close {
          width:44px; height:44px; border-radius:50%;
          background:white; border:1.5px solid #e5e5e5;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:#999;
          box-shadow:0 4px 16px rgba(0,0,0,.08);
          transition:all .22s cubic-bezier(.16,1,.3,1);
        }
        .hx-modal-close:hover { background:#0a0a0a; color:white; border-color:#0a0a0a; transform:rotate(90deg) scale(1.1); box-shadow:0 8px 24px rgba(0,0,0,.2); }
      `}</style>

      <div className="hx">
        <div className="hx-root">

          {/* ════ SIDEBAR ════ */}
          <aside className="hx-sidebar">

            {/* Top: greeting + actions */}
            <div className="hx-topbar hx-r1">
              <div>
                <p className="hx-greeting-sub">Good {greeting()}</p>
                <h1 className="hx-greeting-title">
                  {user.name ? <>{user.name.split(" ")[0]}<em> ✦</em></> : "Welcome"}
                </h1>
              </div>
              <div className="hx-topbar-actions">
                <button className="hx-share" onClick={() => setShowCard(true)}>
                  <span className="hx-share-live" />
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  Share
                </button>
                <button className="hx-logout" onClick={handleLogout} title="Logout">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </div>
            </div>

            {/* Profile card */}
            <div className="hx-profile-card hx-r2">
              <div className="hx-banner">
                <div className="hx-banner-grid" />
                <div className="hx-banner-arc" /><div className="hx-banner-arc2" />
                <span className="hx-banner-tag">Profile</span>
              </div>
              <div className="hx-card-body">
                <div className="hx-avatar-row">
                  <div className="hx-av-wrap">
                    <div className="hx-av">
                      {user.profilePhoto ? <img src={user.profilePhoto} alt="" /> : firstLetter}
                    </div>
                    <div className="hx-av-dot" />
                  </div>
                 
                </div>

                <h2 className="hx-uname">{user.name || "Your Name"}</h2>
                {user.tagline && <p className="hx-utag">"{user.tagline}"</p>}

                <div className="hx-chips">
                  {user.email && <span className="hx-chip"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>{user.email}</span>}
                  {user.place && <span className="hx-chip"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>{user.place}</span>}
                  {user.qualification && <span className="hx-chip"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/></svg>{user.qualification}</span>}
                </div>

                {user.skills?.filter(Boolean).length > 0 && (
                  <div className="hx-skills">
                    {user.skills.filter(Boolean).slice(0,5).map((s,i)=><span key={i} className="hx-sk">{s}</span>)}
                    {user.skills.filter(Boolean).length > 5 && <span className="hx-sk hx-sk-more">+{user.skills.filter(Boolean).length-5}</span>}
                  </div>
                )}

                {pctComplete < 100 && (
                  <div className="hx-prog">
                    <div className="hx-prog-top">
                      <span className="hx-prog-lbl">Strength</span>
                      <span className="hx-prog-val">{pctComplete}%</span>
                    </div>
                    <div className="hx-prog-track">
                      <div className="hx-prog-bar" style={{width:`${pctComplete}%`}} />
                    </div>
                    {pctComplete < 80 && <p className="hx-prog-hint">Add more details for better matches</p>}
                  </div>
                )}

                <div className="hx-divider" />

                <div className="hx-btns">
                  <button className="hx-btn hx-btn-dark" onClick={()=>goto("/profile/form")}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button
  className="hx-btn hx-btn-ghost"
  onClick={() => goto(`/profile/${user.profileId}`)}
>
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
  View
</button>
                
                </div>
              </div>
            </div>

          

          </aside>

          {/* ════ MAIN ════ */}
          <main className="hx-main">

            {/* Header */}
            <div className="hx-main-header hx-r1">
              <div>
                <h2 className="hx-main-title">Discover</h2>
                <p className="hx-main-sub">What are you looking for today?</p>
              </div>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>

            {/* Discover grid */}
            <div className="hx-disc-grid">
              {DISCOVER.map((card,i)=>(
                <button
                  key={card.key}
                  className="hx-disc-card"
                  onClick={() => {
                    if (card.key === "job") {
                      goto("/jobs");
                    } else if (card.key === "Manage Freelance") {
                      goto("/freelance-dashbord");
                    }
                  }}
                  style={{animation:`riseIn .5s cubic-bezier(.16,1,.3,1) ${.15+i*.08}s both`}}
                >
                  <div className="hx-disc-top">
                    <div className="hx-disc-icon">{card.icon}</div>
                    <span className="hx-disc-num">{card.num}</span>
                  </div>
                  <div>
                    <p className="hx-disc-label">{card.label}</p>
                    <p className="hx-disc-sub">{card.sub}</p>
                  </div>
                  <div className="hx-disc-arrow">
                    <span style={{fontSize:9,fontWeight:600,letterSpacing:".12em",textTransform:"uppercase",color:"#ccc",transition:"color .28s"}} className="hx-disc-explore">Explore →</span>
                    <div className="hx-disc-arrow-btn">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>

          </main>

        </div>
      </div>

      {/* ════ MODAL ════ */}
      {showCard && (
        <div className="hx-modal-bg" onClick={()=>setShowCard(false)}>
          <div className="hx-modal-inner" onClick={e=>e.stopPropagation()}>
            <div className="hx-modal-eyebrow">
              <span className="hx-modal-line"/>Digital Business Card<span className="hx-modal-line"/>
            </div>
            <div className="hx-card-float">
              <BusinessCard
                name={user.name}
                designation={user.tagline||"Professional"}
                company={user.company||"ParkOS"}
                phone={user.phone}
                email={user.email}
                website={`${window.location.origin}/candidate/${user._id}`}
              />
            </div>
            <div className="hx-modal-hint">
              <span>Tap to flip</span><span className="hx-modal-dot"/><span>Scan QR to save</span><span className="hx-modal-dot"/><span>Download or share</span>
            </div>
            <button className="hx-modal-close" onClick={()=>setShowCard(false)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}