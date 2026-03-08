import { useNavigate } from "react-router-dom";

const getUser = () => {
  try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
};

const DISCOVER = [
  {
    key: "job",
    label: "Find a Job",
    sub: "Browse open roles",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      </svg>
    ),
  },
  {
    key: "company",
    label: "Companies",
    sub: "Explore workplaces",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    key: "people",
    label: "Find People",
    sub: "Grow your network",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    key: "event",
    label: "Events",
    sub: "Attend & connect",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
];

export default function CandidateHomeSection({ onNavigate }) {
  const navigate = useNavigate();
  const user = getUser();

  const goto = (path) => {
    if (onNavigate) onNavigate(path);
    else navigate(path);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const pctComplete = (() => {
    const fields = [
      user.name, user.email, user.phone, user.profilePhoto,
      user.tagline, user.about,
      user.skills?.some(Boolean),
      user.experience?.some(e => e.jobTitle),
    ];
    return Math.round(fields.filter(Boolean).length / fields.length * 100);
  })();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .ch * { box-sizing: border-box; }
        .ch {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .ch-serif { font-family: 'Playfair Display', Georgia, serif !important; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ch-a1 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.04s both; }
        .ch-a2 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.13s both; }
        .ch-a3 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.22s both; }

        /* ── Profile Card ── */
        .ch-profile-card {
          background: #fff;
          border-radius: 22px;
          border: 1.5px solid #e8e8e8;
          overflow: hidden;
          margin-bottom: 14px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
        }

        .ch-banner {
          height: 76px;
          background: #111;
          position: relative;
          overflow: hidden;
        }
        .ch-banner::before {
          content: '';
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            -45deg, transparent, transparent 10px,
            rgba(255,255,255,0.025) 10px, rgba(255,255,255,0.025) 11px
          );
        }
        .ch-banner::after {
          content: '';
          position: absolute; bottom: -1px; left: 0; right: 0;
          height: 26px; background: #fff;
          border-radius: 22px 22px 0 0;
        }

        .ch-profile-body { padding: 0 18px 18px; }

        .ch-avatar-wrap {
          position: relative; width: 66px; height: 66px;
          margin-top: -33px; margin-bottom: 12px;
        }
        .ch-avatar {
          width: 66px; height: 66px; border-radius: 50%;
          border: 3px solid #fff;
          background: #efefef;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.13);
        }
        .ch-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .ch-online-dot {
          position: absolute; bottom: 2px; right: 2px;
          width: 14px; height: 14px; border-radius: 50%;
          background: #111; border: 2.5px solid #fff;
        }

        /* Name uses Playfair — editorial & warm */
        .ch-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 20px; font-weight: 700;
          color: #0f0f0f; letter-spacing: -0.01em;
          line-height: 1.2; margin-bottom: 3px;
        }
        /* Tagline — Jakarta Sans light italic */
        .ch-tagline-text {
          font-size: 12px; color: #888;
          font-weight: 500; font-style: italic;
          margin-bottom: 10px; letter-spacing: 0.01em;
        }

        .ch-meta { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
        .ch-meta-item {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; color: #aaa; font-weight: 500;
          letter-spacing: 0.01em;
        }

        /* Skills — tight uppercase caps */
        .ch-skill {
          display: inline-block; padding: 3px 9px;
          border-radius: 5px; background: #f5f5f5;
          color: #555; font-size: 10px; font-weight: 700;
          border: 1px solid #ebebeb;
          letter-spacing: 0.05em; text-transform: uppercase;
        }
        .ch-skill-dark { background: #111; color: #fff; border-color: #111; }

        /* Progress */
        .ch-prog-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 7px; }
        .ch-prog-label {
          font-size: 10px; font-weight: 700;
          color: #bbb; letter-spacing: 0.07em; text-transform: uppercase;
        }
        .ch-prog-pct {
          font-family: 'Playfair Display', serif;
          font-size: 14px; font-weight: 700; color: #111;
        }
        .ch-prog-track { height: 3px; background: #f0f0f0; border-radius: 10px; overflow: hidden; }
        .ch-prog-fill {
          height: 100%; border-radius: 10px; background: #111;
          transition: width 0.9s cubic-bezier(0.16,1,0.3,1);
        }

        .ch-divider { height: 1px; background: #f2f2f2; margin: 14px 0; }

        /* Buttons */
        .ch-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 15px; border-radius: 10px;
          font-size: 11px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          letter-spacing: 0.02em;
          cursor: pointer; border: none; white-space: nowrap;
          transition: all 0.18s cubic-bezier(0.16,1,0.3,1);
        }
        .ch-btn:hover { transform: translateY(-1px); }
        .ch-btn:active { transform: scale(0.97); }
        .ch-btn-dark {
          background: #111; color: #fff;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .ch-btn-dark:hover { background: #000; box-shadow: 0 5px 16px rgba(0,0,0,0.28); }
        .ch-btn-outline {
          background: #fff; color: #444;
          border: 1.5px solid #e2e2e2 !important;
        }
        .ch-btn-outline:hover { background: #f7f7f7; color: #111; border-color: #ccc !important; }

        /* ── Discover ── */
        .ch-section-label {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700;
          color: #111; letter-spacing: -0.01em;
          margin-bottom: 3px;
        }
        .ch-section-sub {
          font-size: 11px; color: #bbb; font-weight: 500;
          letter-spacing: 0.01em; margin-bottom: 14px;
        }

        .ch-discover-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .ch-tile {
          background: #fff;
          border: 1.5px solid #e8e8e8;
          border-radius: 18px;
          padding: 16px 14px 36px;
          cursor: pointer;
          display: flex; flex-direction: column;
          align-items: flex-start; gap: 10px;
          transition: all 0.22s cubic-bezier(0.16,1,0.3,1);
          text-align: left; position: relative;
          overflow: hidden;
        }
        .ch-tile:hover {
          background: #111; border-color: #111;
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.15);
        }
        .ch-tile:active { transform: scale(0.97); }

        .ch-tile-icon {
          width: 42px; height: 42px; border-radius: 12px;
          background: #f5f5f5; border: 1px solid #ebebeb;
          display: flex; align-items: center; justify-content: center;
          color: #333; transition: all 0.22s;
        }
        .ch-tile:hover .ch-tile-icon {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.15); color: #fff;
        }

        /* Tile label — Playfair for editorial feel */
        .ch-tile-label {
          font-family: 'Playfair Display', serif;
          font-size: 14px; font-weight: 700;
          color: #111; letter-spacing: -0.01em;
          line-height: 1.25; transition: color 0.22s;
        }
        .ch-tile-sub {
          font-size: 10px; color: #bbb;
          font-weight: 500; letter-spacing: 0.02em;
          margin-top: 2px; transition: color 0.22s;
        }
        .ch-tile:hover .ch-tile-label { color: #fff; }
        .ch-tile:hover .ch-tile-sub   { color: rgba(255,255,255,0.45); }

        .ch-tile-arrow {
          position: absolute; bottom: 13px; right: 13px;
          width: 24px; height: 24px; border-radius: 50%;
          background: #f0f0f0;
          display: flex; align-items: center; justify-content: center;
          color: #ccc; transition: all 0.22s;
        }
        .ch-tile:hover .ch-tile-arrow {
          background: rgba(255,255,255,0.15); color: #fff;
        }
      `}</style>

      <div className="ch" style={{ flex: 1, overflowY: "auto", padding: "20px 16px 40px", background: "#f6f6f6" }}>

        {/* ── Greeting ── */}
        <div className="ch-a1" style={{ marginBottom: 18 }}>
          <p style={{
            fontSize: 10, color: "#c0c0c0", fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5,
          }}>
            {greeting()}
          </p>
          <h2 className="ch-serif" style={{
            fontSize: 28, fontWeight: 700, color: "#0f0f0f",
            letterSpacing: "-0.02em", lineHeight: 1.15,
          }}>
            {user.name ? `Hey, ${user.name.split(" ")[0]} 👋` : "Welcome back 👋"}
          </h2>
        </div>

        {/* ── Profile Card ── */}
        <div className="ch-profile-card ch-a2">
          <div className="ch-banner" />
          <div className="ch-profile-body">

            <div className="ch-avatar-wrap">
              <div className="ch-avatar">
                {user.profilePhoto
                  ? <img src={user.profilePhoto} alt="avatar" />
                  : <span>🧑</span>}
              </div>
              <div className="ch-online-dot" />
            </div>

            <p className="ch-name">{user.name || "Your Name"}</p>
            {user.tagline && <p className="ch-tagline-text">{user.tagline}</p>}

            <div className="ch-meta">
              {user.email && (
                <span className="ch-meta-item">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c0c0c0" strokeWidth="2.2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  {user.email}
                </span>
              )}
              {user.place && (
                <span className="ch-meta-item">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c0c0c0" strokeWidth="2.2">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {user.place}
                </span>
              )}
              {user.qualification && (
                <span className="ch-meta-item">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c0c0c0" strokeWidth="2.2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                  {user.qualification}
                </span>
              )}
            </div>

            {user.skills?.filter(Boolean).length > 0 && (
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
                {user.skills.filter(Boolean).slice(0, 5).map((s, i) => (
                  <span key={i} className="ch-skill">{s}</span>
                ))}
                {user.skills.filter(Boolean).length > 5 && (
                  <span className="ch-skill ch-skill-dark">+{user.skills.filter(Boolean).length - 5}</span>
                )}
              </div>
            )}

            {pctComplete < 100 && (
              <div style={{ marginBottom: 14 }}>
                <div className="ch-prog-row">
                  <span className="ch-prog-label">Profile complete</span>
                  <span className="ch-prog-pct">{pctComplete}%</span>
                </div>
                <div className="ch-prog-track">
                  <div className="ch-prog-fill" style={{ width: `${pctComplete}%` }} />
                </div>
                {pctComplete < 80 && (
                  <p style={{ fontSize: 10, color: "#c0c0c0", marginTop: 6, fontWeight: 500, letterSpacing: "0.01em" }}>
                    Complete your profile to get better job matches
                  </p>
                )}
              </div>
            )}

            <div className="ch-divider" />

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="ch-btn ch-btn-dark" onClick={() => goto("/profile/form")}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit Profile
              </button>
              <button className="ch-btn ch-btn-outline" onClick={() => goto(`/candidate/${user._id || "preview"}`)}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                View Page
              </button>
              <button className="ch-btn ch-btn-outline" onClick={() => goto("/candidate/applications")}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                Applications
              </button>
            </div>
          </div>
        </div>

        {/* ── Discover ── */}
        <div className="ch-a3">
          <p className="ch-section-label">Discover</p>
          <p className="ch-section-sub">What are you looking for today?</p>

          <div className="ch-discover-grid">
            {DISCOVER.map((card, i) => (
              <button
                key={card.key}
                className="ch-tile"
                onClick={() => goto(`/discover/${card.key}`)}
                style={{ animation: `fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) ${0.26 + i * 0.07}s both` }}
              >
                <div className="ch-tile-icon">{card.icon}</div>
                <div>
                  <p className="ch-tile-label">{card.label}</p>
                  <p className="ch-tile-sub">{card.sub}</p>
                </div>
                <div className="ch-tile-arrow">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}