
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

/* ─── parkOS Logo Mark ───────────────────────────────────────────────── */
function ParkOSLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <rect width="32" height="32" rx="7" fill="#111"/>
      <rect x="6" y="6" width="8" height="8" rx="1.5" fill="#3a3a3a"/>
      <rect x="16" y="6" width="10" height="8" rx="1.5" fill="#555"/>
      <rect x="6" y="16" width="12" height="4" rx="1" fill="#444"/>
      <rect x="6" y="22" width="20" height="4" rx="1" fill="#666"/>
      <rect x="20" y="16" width="6" height="4" rx="1" fill="#888"/>
    </svg>
  );
}
function ParkOSLogoDark({ size = 32, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, ...style }}
    >
      {/* Background */}
      <defs>
        <linearGradient id="bgD" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#141414" />
        </linearGradient>
        <linearGradient id="bW" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d4d4d2" />
        </linearGradient>
        <linearGradient id="bM" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8c8c6" />
          <stop offset="100%" stopColor="#929290" />
        </linearGradient>
        <linearGradient id="bDk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4a48" />
          <stop offset="100%" stopColor="#2a2a28" />
        </linearGradient>
      </defs>

      <rect width="32" height="32" rx="7" fill="url(#bgD)" />

      {/* Row 1: 3 equal blocks */}
      <rect x="3" y="3.5" width="7" height="7" rx="1.6" fill="url(#bW)" />
      <rect x="12.5" y="3.5" width="7" height="7" rx="1.6" fill="url(#bW)" />
      <rect x="22" y="3.5" width="7" height="7" rx="1.6" fill="url(#bW)" />

      {/* Row 2: wide + small */}
      <rect x="3" y="12.5" width="16" height="7" rx="1.6" fill="url(#bM)" />
      <rect x="22" y="12.5" width="7" height="7" rx="1.6" fill="url(#bM)" />

      {/* Row 3: full wide bar */}
      <rect x="3" y="21.5" width="26" height="7" rx="1.6" fill="url(#bDk)" />
    </svg>
  );
}

function ParkOSLogoWhite({ size = 32, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, ...style }}
    >
      <defs>
        <linearGradient id="bgL" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ececea" />
        </linearGradient>
        <linearGradient id="lD" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#333330" />
          <stop offset="100%" stopColor="#1a1a18" />
        </linearGradient>
        <linearGradient id="lM" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#888886" />
          <stop offset="100%" stopColor="#606060" />
        </linearGradient>
        <linearGradient id="lL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ccccca" />
          <stop offset="100%" stopColor="#b0b0ae" />
        </linearGradient>
      </defs>

      <rect width="32" height="32" rx="7" fill="url(#bgL)" stroke="#e0e0de" strokeWidth="0.5" />

      {/* Row 1: 3 equal blocks — darkest */}
      <rect x="3" y="3.5" width="7" height="7" rx="1.6" fill="url(#lD)" />
      <rect x="12.5" y="3.5" width="7" height="7" rx="1.6" fill="url(#lD)" />
      <rect x="22" y="3.5" width="7" height="7" rx="1.6" fill="url(#lD)" />

      {/* Row 2: wide + small — mid grey */}
      <rect x="3" y="12.5" width="16" height="7" rx="1.6" fill="url(#lM)" />
      <rect x="22" y="12.5" width="7" height="7" rx="1.6" fill="url(#lM)" />

      {/* Row 3: full wide bar — light grey */}
      <rect x="3" y="21.5" width="26" height="7" rx="1.6" fill="url(#lL)" />
    </svg>
  );
}



/* ─── Avatar initials ────────────────────────────────────────────────── */
function Avatar({ name }) {
  const initials = name
    ?.split(" ")
    .filter(Boolean)
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%",
      background: "#1e1e1e", border: "0.5px solid #2a2a2a",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, fontWeight: 600, color: "#fff",
      fontFamily: "'DM Mono', monospace",
    }}>
      {initials}
    </div>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────────────── */
export default function Navbar() {
  const { user, logoutUser } = useUser();
  const navigate  = useNavigate();
  const location  = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    fontSize: 13, fontWeight: 500,
    color: isActive(path) ? "#e0e0e0" : "#666",
    textDecoration: "none",
    padding: "6px 12px", borderRadius: 6,
    background: isActive(path) ? "#161616" : "transparent",
    cursor: "pointer", letterSpacing: "0.01em",
    transition: "color 0.15s, background 0.15s",
    fontFamily: "'Space Grotesk', sans-serif",
    border: "none",
    display: "inline-flex", alignItems: "center",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .park-nav-link:hover { color: #e0e0e0!important; background: #161616!important; }
        .park-nav-btn:hover  { background: #fff!important; }
      `}</style>

      <nav style={{
        background: "#0a0a0a",
        borderBottom: "0.5px solid #1f1f1f",
        padding: "0 2rem",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        fontFamily: "'Space Grotesk', sans-serif",
      }}>

        {/* ── Logo ── */}
        <button
          onClick={() => navigate("/")}
          style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <ParkOSLogoDark/>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1, gap: 2 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, fontWeight: 500, color: "#f0f0f0", letterSpacing: "0.04em" }}>
              ParkOS
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 400, color: "#4a4a4a", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Your Destiny
            </span>
          </div>
        </button>

        {/* ── Nav links ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button className="park-nav-link" onClick={() => navigate("/")}    style={linkStyle("/")}>Home</button>
          <button className="park-nav-link" onClick={() => navigate("/jobs")} style={linkStyle("/jobs")}>Jobs</button>
          <button className="park-nav-link" onClick={() => navigate("/freelance")} style={linkStyle("/freelance")}>Freelance</button>
          {/* Divider */}
          <div style={{ width: "0.5px", height: 16, background: "#1f1f1f", margin: "0 4px" }} />

          {user ? (
            /* ── Logged in ── */
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                className="park-nav-link"
                onClick={() => navigate("/profile")} 
                style={{ ...linkStyle(""), fontSize: 14, color: "#fff", padding: "5px 10px" }}
              >
              <Avatar name={user.name || user.email} />
              
              </button>
           
            </div>
          ) : (
            /* ── Logged out ── */
            <button
              className="park-nav-btn"
              onClick={() => navigate("/login")}
              style={{
                fontSize: 12, fontWeight: 600,
                color: "#0a0a0a", background: "#e8e8e8",
                padding: "6px 14px", borderRadius: 6,
                border: "none", cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: "0.02em",
                transition: "background 0.15s",
              }}
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </>
  );
}