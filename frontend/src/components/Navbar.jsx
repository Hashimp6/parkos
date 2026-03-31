import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

/* ─── parkOS Logo Mark ───────────────────────────────────────────────── */
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
      <rect x="3" y="3.5" width="7" height="7" rx="1.6" fill="url(#bW)" />
      <rect x="12.5" y="3.5" width="7" height="7" rx="1.6" fill="url(#bW)" />
      <rect x="22" y="3.5" width="7" height="7" rx="1.6" fill="url(#bW)" />
      <rect x="3" y="12.5" width="16" height="7" rx="1.6" fill="url(#bM)" />
      <rect x="22" y="12.5" width="7" height="7" rx="1.6" fill="url(#bM)" />
      <rect x="3" y="21.5" width="26" height="7" rx="1.6" fill="url(#bDk)" />
    </svg>
  );
}

/* ─── Avatar initials ────────────────────────────────────────────────── */
function Avatar({ name }) {
  const initials =
    name
      ?.split(" ")
      .filter(Boolean)
      .map((w) => w[0])
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

/* ─── Hamburger Icon ─────────────────────────────────────────────────── */
function HamburgerIcon({ open }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <style>{`
        .hb-line { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); transform-origin: center; }
      `}</style>
      <rect
        className="hb-line"
        x="2" y="5" width="16" height="1.5" rx="1" fill="#e0e0e0"
        style={{
          transform: open ? "translateY(4.25px) rotate(45deg)" : "none",
        }}
      />
      <rect
        className="hb-line"
        x="2" y="9.25" width="16" height="1.5" rx="1" fill="#e0e0e0"
        style={{ opacity: open ? 0 : 1 }}
      />
      <rect
        className="hb-line"
        x="2" y="13.5" width="16" height="1.5" rx="1" fill="#e0e0e0"
        style={{
          transform: open ? "translateY(-4.25px) rotate(-45deg)" : "none",
        }}
      />
    </svg>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────────────── */
export default function Navbar() {
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Jobs", path: "/jobs" },
    { label: "Freelance", path: "/freelance" },
  ];

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

        .park-nav-link:hover { color: #e0e0e0 !important; background: #161616 !important; }
        .park-nav-btn:hover  { background: #fff !important; }
        .park-menu-link:hover { color: #e0e0e0 !important; background: #161616 !important; }

        /* Drawer animation */
        .park-drawer {
          position: fixed;
          top: 56px;
          left: 0; right: 0; bottom: 0;
          background: #0a0a0a;
          border-top: 0.5px solid #1f1f1f;
          z-index: 99;
          display: flex;
          flex-direction: column;
          padding: 1.25rem 1.5rem;
          gap: 4px;
          transform: translateY(-8px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .park-drawer.open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: all;
        }

        /* Overlay */
        .park-overlay {
          position: fixed;
          inset: 0;
          top: 56px;
          background: rgba(0,0,0,0.6);
          z-index: 98;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
          backdrop-filter: blur(2px);
        }
        .park-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        .park-drawer-link {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #666;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 12px 14px;
          border-radius: 8px;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: color 0.15s, background 0.15s;
          letter-spacing: 0.01em;
        }
        .park-drawer-link.active {
          color: #e0e0e0;
          background: #161616;
        }
        .park-drawer-link:not(.active):hover {
          color: #e0e0e0;
          background: #111;
        }

        .park-drawer-divider {
          height: 0.5px;
          background: #1f1f1f;
          margin: 8px 0;
        }

        .park-drawer-login {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #0a0a0a;
          background: #e8e8e8;
          border: none;
          cursor: pointer;
          padding: 11px 16px;
          border-radius: 8px;
          width: 100%;
          margin-top: 8px;
          transition: background 0.15s;
          letter-spacing: 0.02em;
        }
        .park-drawer-login:hover { background: #fff; }
      `}</style>

      {/* ── Navbar Bar ── */}
      <nav style={{
        background: "#0a0a0a",
        borderBottom: "0.5px solid #1f1f1f",
        padding: "0 1.25rem",
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
          <ParkOSLogoDark />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1, gap: 2 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, fontWeight: 500, color: "#f0f0f0", letterSpacing: "0.04em" }}>
              ParkOS
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 400, color: "#4a4a4a", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Your Destiny
            </span>
          </div>
        </button>

        {/* ── Desktop Nav links ── */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {navLinks.map(({ label, path }) => (
              <button
                key={path}
                className="park-nav-link"
                onClick={() => navigate(path)}
                style={linkStyle(path)}
              >
                {label}
              </button>
            ))}

            <div style={{ width: "0.5px", height: 16, background: "#1f1f1f", margin: "0 4px" }} />

            {user ? (
              <button
                className="park-nav-link"
                onClick={() => navigate("/profile")}
                style={{ ...linkStyle(""), fontSize: 14, color: "#fff", padding: "5px 10px" }}
              >
                <Avatar name={user.name || user.email} />
              </button>
            ) : (
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
        )}

        {/* ── Mobile Right: Avatar + Hamburger ── */}
        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {user && (
              <button
                onClick={() => navigate("/profile")}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex" }}
              >
                <Avatar name={user.name || user.email} />
              </button>
            )}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                background: menuOpen ? "#161616" : "none",
                border: "0.5px solid",
                borderColor: menuOpen ? "#2a2a2a" : "transparent",
                borderRadius: 7,
                cursor: "pointer",
                padding: "6px 7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s, border-color 0.15s",
              }}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        )}
      </nav>

      {/* ── Mobile Overlay ── */}
      {isMobile && (
        <div
          className={`park-overlay${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ── */}
      {isMobile && (
        <div className={`park-drawer${menuOpen ? " open" : ""}`}>
          {navLinks.map(({ label, path }) => (
            <button
              key={path}
              className={`park-drawer-link${isActive(path) ? " active" : ""}`}
              onClick={() => navigate(path)}
            >
              {label}
            </button>
          ))}

          <div className="park-drawer-divider" />

          {user ? (
            <button
              className="park-drawer-link"
              onClick={() => { navigate("/profile"); setMenuOpen(false); }}
              style={{ gap: 10 }}
            >
              <Avatar name={user.name || user.email} />
              <span style={{ color: "#aaa", fontSize: 13 }}>{user.name || user.email}</span>
            </button>
          ) : (
            <button
              className="park-drawer-login"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      )}
    </>
  );
}