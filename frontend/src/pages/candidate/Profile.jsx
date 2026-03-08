import { useNavigate } from "react-router-dom";

const getCompany = () => {
  try { return JSON.parse(localStorage.getItem("company") || "{}"); } catch { return {}; }
};

const DISCOVER = [
  {
    key: "company",
    label: "Looking for a Company",
    sub: "Browse verified companies across all business parks",
    icon: "🏢",
    accent: "#111",
    bg: "#f0f0f0",
    textAccent: "#111",
  },
  {
    key: "service",
    label: "Looking for a Service",
    sub: "Find agencies & vendors offering professional services",
    icon: "⚡",
    accent: "#1a1a2e",
    bg: "#e8e8f4",
    textAccent: "#1a1a2e",
  },
  {
    key: "freelancer",
    label: "Looking for a Freelancer",
    sub: "Hire skilled independent professionals on demand",
    icon: "💼",
    accent: "#0f2027",
    bg: "#e5f0f0",
    textAccent: "#0f2027",
  },
  {
    key: "people",
    label: "Looking for People",
    sub: "Discover talented candidates ready to join your team",
    icon: "🤝",
    accent: "#1b1b1b",
    bg: "#f5f0e8",
    textAccent: "#1b1b1b",
  },
];

export default function HomeSection({ onNavigate }) {
  const navigate = useNavigate();
  const company = getCompany();

  const goto = (path) => {
    if (onNavigate) onNavigate(path);
    else navigate(path);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,900&family=Lora:wght@600;700&display=swap');
        .hs-root * { box-sizing: border-box; font-family: 'DM Sans', system-ui, sans-serif; }
        .hs-serif { font-family: 'Lora', Georgia, serif !important; }

        @keyframes hsSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hs-a1 { animation: hsSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .hs-a2 { animation: hsSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
        .hs-a3 { animation: hsSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.20s both; }
        .hs-a4 { animation: hsSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.28s both; }

        .hs-profile-card {
          background: #fff;
          border-radius: 24px;
          border: 1.5px solid #f0f0f0;
          padding: 20px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
        }

        .hs-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 16px; border-radius: 14px;
          font-size: 13px; font-weight: 700;
          border: none; cursor: pointer;
          transition: all 0.18s cubic-bezier(0.16,1,0.3,1);
          font-family: inherit;
          white-space: nowrap;
        }
        .hs-btn:hover { transform: translateY(-1px); }
        .hs-btn:active { transform: scale(0.97); }

        .hs-btn-dark {
          background: #111; color: #fff;
          box-shadow: 0 3px 12px rgba(0,0,0,0.18);
        }
        .hs-btn-dark:hover { background: #222; }

        .hs-btn-outline {
          background: #fff; color: #444;
          border: 1.5px solid #e8e8e8 !important;
        }
        .hs-btn-outline:hover { border-color: #bbb !important; color: #111; background: #fafafa; }

        .hs-discover-card {
          border-radius: 22px;
          padding: 22px 20px;
          border: 1.5px solid transparent;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.16,1,0.3,1);
          display: flex; flex-direction: column; gap: 10px;
          position: relative; overflow: hidden;
          text-align: left;
          width: 100%;
        }
        .hs-discover-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.1);
          border-color: rgba(0,0,0,0.08);
        }
        .hs-discover-card:active { transform: scale(0.98); }

        .hs-discover-card::after {
          content: "→";
          position: absolute; right: 18px; top: 50%; transform: translateY(-50%);
          font-size: 18px; opacity: 0.3;
          transition: opacity 0.2s, transform 0.2s;
        }
        .hs-discover-card:hover::after { opacity: 0.7; transform: translateY(-50%) translateX(3px); }

        .hs-divider {
          height: 1px; background: #f0f0f0; margin: 4px 0;
        }

        .hs-verified-badge {
          display: inline-flex; align-items: center; gap: 4px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          padding: 2px 8px; border-radius: 20px;
        }
      `}</style>

      <div className="hs-root" style={{ flex: 1, overflowY: "auto", padding: "20px 20px 32px" }}>

        {/* ── Greeting ── */}
        <div className="hs-a1" style={{ marginBottom: 18 }}>
          <p style={{ fontSize: 12, color: "#aaa", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 3 }}>
            Good day 👋
          </p>
          <h2 className="hs-serif" style={{ fontSize: 26, fontWeight: 700, color: "#111", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
            {company.companyName || "Your Company"}
          </h2>
        </div>

        {/* ── Profile Card ── */}
        <div className="hs-profile-card hs-a2" style={{ marginBottom: 14 }}>

          {/* Banner strip */}
          {company.banner && (
            <div style={{ margin: "-20px -20px 16px", height: 72, borderRadius: "22px 22px 0 0", overflow: "hidden" }}>
              <img src={company.banner} alt="banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
            {/* Logo */}
            <div style={{
              width: 56, height: 56, borderRadius: 16, flexShrink: 0,
              background: "#f5f5f5", border: "2px solid #e8e8e8",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              {company.logo
                ? <img src={company.logo} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : "🏢"}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                <p className="hs-serif" style={{ fontSize: 17, fontWeight: 700, color: "#111", letterSpacing: "-0.02em" }}>
                  {company.companyName || "Your Company"}
                </p>
                {company.isVerified && (
                  <span className="hs-verified-badge">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span style={{ fontSize: 10, color: "#16a34a", fontWeight: 700 }}>Verified</span>
                  </span>
                )}
              </div>
              <p style={{ fontSize: 12, color: "#888", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {company.tagline || "Add a tagline to your profile"}
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {company.businessPark && company.businessPark !== "Other" && (
                  <span style={{ fontSize: 11, color: "#aaa", display: "flex", alignItems: "center", gap: 4 }}>
                    <span>📍</span> {company.businessPark}
                  </span>
                )}
                {company.industry && (
                  <span style={{ fontSize: 11, color: "#aaa", display: "flex", alignItems: "center", gap: 4 }}>
                    <span>🏭</span> {company.industry}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="hs-divider" />

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 14 }}>
            <button className="hs-btn hs-btn-dark" onClick={() => goto("/company/profile/edit")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Profile
            </button>

            <button className="hs-btn hs-btn-outline" onClick={() => goto(`/company/${company._id || "preview"}`)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              View Page
            </button>

            <button className="hs-btn hs-btn-outline" onClick={() => goto("/company/jobs")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
              </svg>
              Manage Jobs
            </button>
          </div>
        </div>

        {/* ── Quick stats strip ── */}
        {(company.employeeCount || company.foundedYear || company.companySize) && (
          <div className="hs-a2" style={{
            display: "flex", gap: 10, marginBottom: 14, overflowX: "auto",
            paddingBottom: 2
          }}>
            {[
              company.employeeCount && { label: "Employees", value: company.employeeCount },
              company.foundedYear   && { label: "Founded",   value: company.foundedYear },
              company.companySize   && { label: "Size",      value: company.companySize },
            ].filter(Boolean).map((s, i) => (
              <div key={i} style={{
                background: "#fff", border: "1.5px solid #f0f0f0",
                borderRadius: 14, padding: "10px 16px", textAlign: "center",
                flexShrink: 0, minWidth: 80
              }}>
                <p className="hs-serif" style={{ fontSize: 18, fontWeight: 700, color: "#111", letterSpacing: "-0.02em" }}>{s.value}</p>
                <p style={{ fontSize: 10, color: "#bbb", marginTop: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Discover section ── */}
        <div className="hs-a3">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#111", letterSpacing: "-0.02em" }}>Discover</p>
              <p style={{ fontSize: 12, color: "#aaa", marginTop: 1 }}>What are you looking for today?</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {DISCOVER.map((card, i) => (
              <button
                key={card.key}
                className="hs-discover-card"
                onClick={() => goto(`/discover/${card.key}`)}
                style={{
                  background: card.bg,
                  animationDelay: `${0.24 + i * 0.07}s`,
                  animation: "hsSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
                }}
              >
                <span style={{ fontSize: 28, lineHeight: 1 }}>{card.icon}</span>
                <div style={{ paddingRight: 24 }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: card.textAccent, letterSpacing: "-0.01em", lineHeight: 1.3, marginBottom: 4 }}>
                    {card.label}
                  </p>
                  <p style={{ fontSize: 11, color: card.textAccent, opacity: 0.55, lineHeight: 1.5 }}>
                    {card.sub}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Recent activity placeholder ── */}
        <div className="hs-a4" style={{ marginTop: 20 }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: "#111", letterSpacing: "-0.02em", marginBottom: 12 }}>Recent Activity</p>
          <div style={{
            background: "#fff", borderRadius: 20,
            border: "1.5px solid #f0f0f0",
            padding: "32px 20px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
            }}>📭</div>
            <p style={{ fontSize: 13, color: "#bbb", textAlign: "center" }}>No recent activity yet</p>
            <button className="hs-btn hs-btn-outline" style={{ fontSize: 12, padding: "7px 14px" }}
              onClick={() => goto("/company/jobs")}>
              Post your first job →
            </button>
          </div>
        </div>

      </div>
    </>
  );
}