import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompany } from "../../context/CompanyContext";

const DISCOVER = [
  {
    key: "company", label: "Find a Company", sub: "Explore businesses near you", num: "01",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    key: "service", label: "Find a Service", sub: "Browse what companies offer", num: "02",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
  },
  {
    key: "freelancer", label: "Find a Freelancer", sub: "Hire independent talent", num: "03",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><path d="M17 11l1.5 1.5L21 10"/></svg>,
  },
  {
    key: "people", label: "Find a Person", sub: "Connect with professionals", num: "04",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  {
    key: "jobs/form", label: "Post a Job", sub: "Hire from our talent pool", num: "05",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
  },
  {
    key: "event", label: "Events", sub: "Attend & grow your network", num: "06",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
];

export default function CompanyHome({ onNavigate }) {
  const navigate = useNavigate();
  const { company, updateCompany ,logoutCompany} = useCompany();
  const [showMenu, setShowMenu] = useState(false);

  const goto = (path) => { if (onNavigate) onNavigate(path); else navigate(path); };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Morning";
    if (h < 17) return "Afternoon";
    return "Evening";
  };
  useEffect(() => {
    console.log("Company from context:", company);
  }, [company]);
  const handleLogout = () => {
    logoutCompany();
    navigate("/company/login");
  };

  const firstLetter = company?.companyName ? company.companyName.charAt(0).toUpperCase() : "C";

  const pctComplete = (() => {
    if (!company) return 0;
    const fields = [
      company.companyName, company.email, company.phone, company.logo,
      company.banner, company.tagline, company.about, company.industry,
      company.website, company.contacts?.linkedin || company.contacts?.email,
      company.services?.length > 0, company.members?.length > 0,
    ];
    return Math.round(fields.filter(Boolean).length / fields.length * 100);
  })();

  if (!company) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#fafafa" }}>
      <div style={{ width:32, height:32, border:"2px solid #e5e5e5", borderTop:"2px solid #111", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
    </div>
  );

  const addressLine = [company.address?.building, company.address?.city, company.businessPark].filter(Boolean).join(" · ");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        .cx { font-family:'Outfit',system-ui,sans-serif; background:#f4f4f5; min-height:100vh; -webkit-font-smoothing:antialiased; }

        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes riseIn  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes modalIn { from{opacity:0;transform:translateY(50px) scale(.92)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes floatY  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes dotPulse{ 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:.6} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes badgePop{ from{opacity:0;transform:scale(.7)} to{opacity:1;transform:scale(1)} }

        .cx-r1{animation:riseIn .55s cubic-bezier(.16,1,.3,1) .05s both}
        .cx-r2{animation:riseIn .55s cubic-bezier(.16,1,.3,1) .12s both}
        .cx-r3{animation:riseIn .55s cubic-bezier(.16,1,.3,1) .19s both}
        .cx-r4{animation:riseIn .55s cubic-bezier(.16,1,.3,1) .26s both}

        /* ── LAYOUT ── */
        .cx-root {
          display:grid; grid-template-columns:1fr; min-height:100vh;
        }
        @media(min-width:900px){
          .cx-root { grid-template-columns:380px 1fr; align-items:start; }
        }

        /* ── SIDEBAR ── */
        .cx-sidebar {
          padding:28px 20px 40px;
          display:flex; flex-direction:column; gap:16px;
          background:white;
        }
        @media(min-width:900px){
          .cx-sidebar {
            position:sticky; top:0; height:100vh; overflow-y:auto;
            padding:36px 24px 40px; gap:20px;
            border-right:1px solid #eaeaea;
          }
        }

        /* ── MAIN ── */
        .cx-main { padding:24px 20px 60px; display:flex; flex-direction:column; gap:28px; background:#f4f4f5; }
        @media(min-width:900px){ .cx-main{padding:36px 40px 60px} }

        /* ── TOPBAR ── */
        .cx-topbar { display:flex; align-items:center; justify-content:space-between; }
        .cx-greet-sub { font-size:10px; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:#bbb; margin-bottom:4px; }
        .cx-greet-title { font-family:'DM Serif Display',serif; font-size:24px; color:#0a0a0a; line-height:1.1; }
        .cx-greet-title em { font-style:italic; color:#aaa; }
        .cx-topbar-right { display:flex; align-items:center; gap:8px; position:relative; }

        /* Share / menu button */
        .cx-share {
          display:inline-flex; align-items:center; gap:8px;
          padding:9px 16px; border-radius:22px;
          background:#0a0a0a; color:#fff;
          font-family:'Outfit',sans-serif; font-size:11px; font-weight:600;
          letter-spacing:.07em; text-transform:uppercase;
          border:none; cursor:pointer;
          box-shadow:0 4px 18px rgba(0,0,0,.18);
          transition:all .25s cubic-bezier(.16,1,.3,1);
          position:relative; overflow:hidden;
        }
        .cx-share:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(0,0,0,.26); }
        .cx-share:active { transform:scale(.96); }
        .cx-share-dot { width:6px; height:6px; border-radius:50%; background:#4ade80; animation:dotPulse 2s ease-in-out infinite; }

        /* Logout */
        .cx-logout {
          width:38px; height:38px; border-radius:50%;
          background:#fff; border:1.5px solid #e5e5e5;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:#aaa; box-shadow:0 1px 4px rgba(0,0,0,.05);
          transition:all .2s;
        }
        .cx-logout:hover { border-color:#ffcdd2; background:#fff5f5; color:#e03333; transform:rotate(8deg); }

        /* ── PROFILE CARD ── */
        .cx-profile-card {
          background:white; border-radius:24px; overflow:hidden;
          border:1px solid #eaeaea; box-shadow:0 2px 20px rgba(0,0,0,.06);
        }

        /* Banner — uses company.banner if available */
        .cx-banner {
          height:100px; background:#0a0a0a;
          position:relative; overflow:hidden;
        }
        .cx-banner-img { width:100%; height:100%; object-fit:cover; opacity:.55; }
        .cx-banner-grid {
          position:absolute; inset:0;
          background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);
          background-size:28px 28px;
        }
        .cx-banner-arc  { position:absolute; bottom:-50px; right:-50px; width:180px; height:180px; border-radius:50%; border:1px solid rgba(255,255,255,.06); }
        .cx-banner-arc2 { position:absolute; bottom:-25px; right:-25px; width:110px; height:110px; border-radius:50%; border:1px solid rgba(255,255,255,.04); }

        /* Verified badge */
        .cx-verified {
          position:absolute; top:12px; right:12px;
          display:flex; align-items:center; gap:5px;
          background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12);
          backdrop-filter:blur(8px); border-radius:20px;
          padding:4px 10px;
          font-size:9px; font-weight:600; letter-spacing:.1em; text-transform:uppercase;
          color:rgba(255,255,255,.7);
          animation:badgePop .4s .3s cubic-bezier(.16,1,.3,1) both;
        }
        .cx-verified-dot { width:6px; height:6px; border-radius:50%; background:#4ade80; }

        .cx-card-body { padding:0 18px 20px; }

        /* Logo row */
        .cx-logo-row {
          display:flex; align-items:flex-end; justify-content:space-between;
          margin-top:-36px; margin-bottom:14px;
        }
        .cx-logo-wrap { position:relative; }
        .cx-logo {
          width:72px; height:72px; border-radius:18px;
          border:4px solid white; background:#f5f5f5;
          display:flex; align-items:center; justify-content:center;
          overflow:hidden; box-shadow:0 4px 14px rgba(0,0,0,.1);
          font-family:'DM Serif Display',serif; font-size:26px; color:#444;
        }
        .cx-logo img { width:100%; height:100%; object-fit:cover; }

        /* Pct pill */
        .cx-pct {
          display:flex; flex-direction:column; align-items:center;
          background:#f7f7f7; border:1.5px solid #efefef; border-radius:12px;
          padding:7px 13px;
        }
        .cx-pct-n { font-family:'DM Serif Display',serif; font-size:20px; color:#0a0a0a; line-height:1; }
        .cx-pct-l { font-size:8px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:#bbb; margin-top:2px; }

        /* Name + tagline */
        .cx-cname { font-family:'DM Serif Display',serif; font-size:21px; color:#0a0a0a; margin-bottom:3px; line-height:1.15; }
        .cx-ctag { font-size:11px; color:#999; font-style:italic; margin-bottom:12px; line-height:1.4; }

        /* Industry + park badge */
        .cx-badges { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; }
        .cx-badge {
          display:inline-flex; align-items:center; gap:4px;
          padding:4px 10px; border-radius:20px;
          background:#f5f5f5; border:1px solid #eee;
          font-size:9.5px; color:#777; font-weight:500;
        }
        .cx-badge-dark { background:#0a0a0a; color:white; border-color:#0a0a0a; }

        /* Services pills */
        .cx-services { display:flex; gap:4px; flex-wrap:wrap; margin-bottom:14px; }
        .cx-srv {
          padding:3px 9px; border-radius:6px;
          font-size:9px; font-weight:700; letter-spacing:.07em; text-transform:uppercase;
          background:#f0f0f0; color:#666; border:1px solid #e8e8e8;
          transition:all .15s;
        }
        .cx-srv:hover { background:#0a0a0a; color:white; border-color:#0a0a0a; }
        .cx-srv-more { background:#0a0a0a; color:white; border-color:#0a0a0a; }

        /* Progress */
        .cx-prog { margin-bottom:14px; }
        .cx-prog-top { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:7px; }
        .cx-prog-lbl { font-size:9px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#bbb; }
        .cx-prog-val { font-family:'DM Serif Display',serif; font-size:16px; color:#0a0a0a; }
        .cx-prog-track { height:3px; background:#f0f0f0; border-radius:3px; overflow:hidden; }
        .cx-prog-bar { height:100%; background:linear-gradient(90deg,#555,#0a0a0a); border-radius:3px; transition:width 1.2s cubic-bezier(.16,1,.3,1); }
        .cx-prog-hint { font-size:9.5px; color:#ccc; margin-top:5px; font-style:italic; }

        .cx-div { height:1px; background:linear-gradient(90deg,transparent,#ebebeb 20%,#ebebeb 80%,transparent); margin:14px 0; }

        /* Action buttons */
        .cx-btns { display:flex; gap:7px; flex-wrap:wrap; }
        .cx-btn {
          display:inline-flex; align-items:center; gap:5px;
          padding:8px 15px; border-radius:10px;
          font-family:'Outfit',sans-serif; font-size:11px; font-weight:600;
          cursor:pointer; border:none; white-space:nowrap;
          transition:all .18s cubic-bezier(.16,1,.3,1);
        }
        .cx-btn:hover { transform:translateY(-1px); }
        .cx-btn:active { transform:scale(.97); }
        .cx-btn-dark { background:#0a0a0a; color:white; box-shadow:0 2px 10px rgba(0,0,0,.18); }
        .cx-btn-dark:hover { box-shadow:0 6px 20px rgba(0,0,0,.24); }
        .cx-btn-ghost { background:white; color:#555; border:1.5px solid #e5e5e5 !important; }
        .cx-btn-ghost:hover { background:#f8f8f8; color:#111; border-color:#ccc !important; }

        /* ── STATS ── */
        .cx-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
        .cx-stat {
          background:white; border-radius:18px; padding:16px 12px;
          border:1px solid #eaeaea; box-shadow:0 2px 10px rgba(0,0,0,.04);
          text-align:center; position:relative; overflow:hidden;
          transition:all .25s cubic-bezier(.16,1,.3,1);
        }
        .cx-stat:hover { transform:translateY(-3px); box-shadow:0 10px 28px rgba(0,0,0,.09); }
        .cx-stat-n { font-family:'DM Serif Display',serif; font-size:24px; color:#0a0a0a; line-height:1; margin-bottom:4px; }
        .cx-stat-l { font-size:9px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:#bbb; }
        .cx-stat-bar { position:absolute; bottom:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,#0a0a0a,transparent); opacity:0; transition:opacity .25s; }
        .cx-stat:hover .cx-stat-bar { opacity:1; }

        /* ── MAIN HEADER ── */
        .cx-main-hdr {
          display:flex; align-items:center; justify-content:space-between;
          padding-bottom:20px; border-bottom:2px solid #eaeaea;
        }
        .cx-main-title { font-family:'DM Serif Display',serif; font-size:32px; color:#0a0a0a; line-height:1.1; }
        .cx-main-sub { font-size:12px; color:#bbb; font-weight:500; margin-top:4px; }

        /* ── DISCOVER GRID ── */
        .cx-grid {
          display:grid; grid-template-columns:1fr; gap:12px;
        }
        @media(min-width:600px){ .cx-grid{grid-template-columns:repeat(2,1fr)} }
        @media(min-width:1100px){ .cx-grid{grid-template-columns:repeat(3,1fr); gap:16px} }

        .cx-tile {
          background:white; border-radius:22px;
          border:1px solid #eaeaea; box-shadow:0 2px 14px rgba(0,0,0,.04);
          padding:24px 22px 22px; cursor:pointer;
          position:relative; overflow:hidden;
          display:flex; flex-direction:column; gap:16px;
          transition:all .28s cubic-bezier(.16,1,.3,1); text-align:left;
        }
        .cx-tile::after {
          content:''; position:absolute; inset:0;
          background:#0a0a0a; opacity:0; transition:opacity .28s; border-radius:22px;
        }
        .cx-tile:hover { transform:translateY(-4px); box-shadow:0 20px 50px rgba(0,0,0,.12); border-color:#ccc; }
        .cx-tile:hover::after { opacity:1; }
        .cx-tile:active { transform:scale(.98); }
        .cx-tile > * { position:relative; z-index:1; }

        .cx-tile-top { display:flex; justify-content:space-between; align-items:flex-start; }
        .cx-tile-icon {
          width:50px; height:50px; border-radius:14px;
          background:#f5f5f5; border:1px solid #eee;
          display:flex; align-items:center; justify-content:center;
          color:#555; transition:all .28s;
        }
        .cx-tile:hover .cx-tile-icon { background:rgba(255,255,255,.1); border-color:rgba(255,255,255,.15); color:white; }
        .cx-tile-num { font-family:'DM Serif Display',serif; font-style:italic; font-size:13px; color:#ddd; transition:color .28s; }
        .cx-tile:hover .cx-tile-num { color:rgba(255,255,255,.3); }

        .cx-tile-label { font-family:'DM Serif Display',serif; font-size:19px; color:#0a0a0a; line-height:1.2; transition:color .28s; }
        .cx-tile-sub { font-size:11px; color:#bbb; margin-top:4px; transition:color .28s; }
        .cx-tile:hover .cx-tile-label { color:white; }
        .cx-tile:hover .cx-tile-sub { color:rgba(255,255,255,.45); }

        .cx-tile-foot { display:flex; align-items:center; justify-content:space-between; }
        .cx-tile-explore { font-size:9px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:#ccc; transition:color .28s; }
        .cx-tile:hover .cx-tile-explore { color:rgba(255,255,255,.4); }
        .cx-tile-arr {
          width:34px; height:34px; border-radius:50%;
          background:#f5f5f5; border:1px solid #ebebeb;
          display:flex; align-items:center; justify-content:center;
          color:#ccc; transition:all .28s;
        }
        .cx-tile:hover .cx-tile-arr { background:rgba(255,255,255,.15); border-color:rgba(255,255,255,.2); color:white; transform:translateX(3px); }

        /* ── QUICK ACTIONS (desktop banner) ── */
        .cx-quick {
          background:#0a0a0a; border-radius:22px; padding:24px 28px;
          display:flex; align-items:center; justify-content:space-between; gap:16px;
          position:relative; overflow:hidden;
          box-shadow:0 4px 24px rgba(0,0,0,.12);
        }
        .cx-quick::before {
          content:''; position:absolute; inset:0;
          background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);
          background-size:24px 24px;
        }
        .cx-quick-text { position:relative; z-index:1; }
        .cx-quick-title { font-family:'DM Serif Display',serif; font-size:20px; color:white; margin-bottom:4px; }
        .cx-quick-sub { font-size:11px; color:rgba(255,255,255,.4); }
        .cx-quick-btn {
          position:relative; z-index:1; flex-shrink:0;
          display:inline-flex; align-items:center; gap:7px;
          padding:10px 20px; border-radius:12px;
          background:white; color:#0a0a0a;
          font-family:'Outfit',sans-serif; font-size:11px; font-weight:700;
          letter-spacing:.05em; text-transform:uppercase;
          border:none; cursor:pointer;
          box-shadow:0 2px 12px rgba(0,0,0,.2);
          transition:all .2s;
        }
        .cx-quick-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.3); }
      `}</style>

      <div className="cx">
        <div className="cx-root">

          {/* ════ SIDEBAR ════ */}
          <aside className="cx-sidebar">

            {/* Topbar */}
            <div className="cx-topbar cx-r1">
              <div>
                <p className="cx-greet-sub">Good {greeting()}</p>
                <h1 className="cx-greet-title">
                  {company.companyName
                    ? <>{company.companyName.split(" ")[0]}<em> ✦</em></>
                    : "Welcome"}
                </h1>
              </div>
              <div className="cx-topbar-right">
                <button className="cx-share" onClick={() => goto(`/company/${company._id}`)}>
                  <span className="cx-share-dot" />
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  View Page
                </button>
                <button className="cx-logout" onClick={handleLogout} title="Logout">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </div>
            </div>

            {/* Profile card */}
            <div className="cx-profile-card cx-r2">
              <div className="cx-banner">
                {company.banner
                  ? <img className="cx-banner-img" src={company.banner} alt="" />
                  : <><div className="cx-banner-grid"/><div className="cx-banner-arc"/><div className="cx-banner-arc2"/></>
                }
                {company.isVerified && (
                  <div className="cx-verified">
                    <span className="cx-verified-dot"/>Verified
                  </div>
                )}
              </div>

              <div className="cx-card-body">
                <div className="cx-logo-row">
                  <div className="cx-logo-wrap">
                    <div className="cx-logo">
                      {company.logo ? <img src={company.logo} alt="" /> : firstLetter}
                    </div>
                  </div>
                 
                </div>

                <h2 className="cx-cname">{company.companyName || "Company Name"}</h2>
                {company.tagline && <p className="cx-ctag">"{company.tagline}"</p>}

                <div className="cx-badges">
                  {company.industry && <span className="cx-badge"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>{company.industry}</span>}
                  {company.businessPark && company.businessPark !== "Other" && <span className="cx-badge cx-badge-dark">{company.businessPark}</span>}
                  {company.companySize && <span className="cx-badge"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>{company.companySize}</span>}
                  {company.foundedYear && <span className="cx-badge">Est. {company.foundedYear}</span>}
                </div>

                {addressLine && (
                  <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:12}}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span style={{fontSize:10,color:"#aaa",fontWeight:500}}>{addressLine}</span>
                  </div>
                )}

                {company.services?.length > 0 && (
                  <div className="cx-services">
                    {company.services.slice(0,4).map((s,i)=>(
                      <span key={i} className="cx-srv">{s.title}</span>
                    ))}
                    {company.services.length > 4 && <span className="cx-srv cx-srv-more">+{company.services.length-4}</span>}
                  </div>
                )}

                {pctComplete < 100 && (
                  <div className="cx-prog">
                    <div className="cx-prog-top">
                      <span className="cx-prog-lbl">Profile strength</span>
                      <span className="cx-prog-val">{pctComplete}%</span>
                    </div>
                    <div className="cx-prog-track">
                      <div className="cx-prog-bar" style={{width:`${pctComplete}%`}}/>
                    </div>
                    {pctComplete < 70 && <p className="cx-prog-hint">Complete your profile to attract more talent</p>}
                  </div>
                )}

                <div className="cx-div"/>

                <div className="cx-btns">
                  <button className="cx-btn cx-btn-dark" onClick={()=>goto("/company/form")}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button className="cx-btn cx-btn-ghost" onClick={()=>goto("/companyjobs")}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
                    Jobs
                  </button>
                 
                </div>
              </div>
            </div>

    

          </aside>

          {/* ════ MAIN ════ */}
          <main className="cx-main">

            {/* Header */}
            <div className="cx-main-hdr cx-r1">
              <div>
                <h2 className="cx-main-title">Discover</h2>
                <p className="cx-main-sub">Connect, hire, and grow your business</p>
              </div>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>

            {/* Quick action banner */}
            <div className="cx-quick cx-r2">
              <div className="cx-quick-text">
                <p className="cx-quick-title">Post a Job Opening</p>
                <p className="cx-quick-sub">Reach thousands of qualified candidates today</p>
              </div>
              <button className="cx-quick-btn" onClick={()=>goto("/jobs/form")}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Post Now
              </button>
            </div>

            {/* Discover grid */}
            <div className="cx-grid">
              {DISCOVER.map((card,i)=>(
                <button
                  key={card.key}
                  className="cx-tile"
                  onClick={()=>goto(`/${card.key}`)}
                  style={{animation:`riseIn .5s cubic-bezier(.16,1,.3,1) ${.15+i*.07}s both`}}
                >
                  <div className="cx-tile-top">
                    <div className="cx-tile-icon">{card.icon}</div>
                    <span className="cx-tile-num">{card.num}</span>
                  </div>
                  <div>
                    <p className="cx-tile-label">{card.label}</p>
                    <p className="cx-tile-sub">{card.sub}</p>
                  </div>
                  <div className="cx-tile-foot">
                    <span className="cx-tile-explore">Explore →</span>
                    <div className="cx-tile-arr">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>

          </main>

        </div>
      </div>
    </>
  );
}