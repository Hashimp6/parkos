import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../../../config";
import { useUser } from "../../context/UserContext";

const MOCK_SERVICES = [
  {
    _id: "1",
    title: "Full-Stack Web Application Development",
    category: "Web Development",
    description:
      "End-to-end web application development using React, Node.js, and MongoDB. Specializing in clean, scalable architecture.",
    skills: ["React", "Node.js", "MongoDB", "Tailwind CSS", "REST API"],
    price: "starts ₹15,000",
    isActive: true,
    isPremium: true,
    views: 1284,
    clicks: 342,
    rating: 4.8,
    place: "Thiruvananthapuram, Kerala",
    workSamples: [
      { title: "E-Commerce Platform", description: "Built a full-featured store with cart, auth, and payments.", link: "https://github.com" },
      { title: "SaaS Dashboard", description: "Analytics dashboard with real-time data and role-based access.", link: "https://github.com" },
    ],
    createdAt: "2024-11-10T00:00:00.000Z",
  },
  {
    _id: "2",
    title: "UI/UX Design & Prototyping",
    category: "Design",
    description:
      "Crafting intuitive user experiences from wireframes to high-fidelity prototypes. Figma-first workflow with developer handoff included.",
    skills: ["Figma", "Prototyping", "Design Systems", "User Research"],
    price: "hourly ₹8,000",
    isActive: false,
    isPremium: false,
    views: 876,
    clicks: 198,
    rating: 4.6,
    place: "Remote",
    workSamples: [
      { title: "Banking App Redesign", description: "Redesigned the core flows reducing drop-off by 40%.", link: "https://figma.com" },
    ],
    createdAt: "2024-12-01T00:00:00.000Z",
  },
  {
    _id: "3",
    title: "API Integration & Backend Services",
    category: "Backend",
    description:
      "Robust REST and GraphQL API development. Specializing in third-party integrations, authentication systems, and scalable microservices.",
    skills: ["Node.js", "Express", "GraphQL", "PostgreSQL", "Docker"],
    price: "₹12,000",
    isActive: true,
    isPremium: false,
    views: 543,
    clicks: 89,
    rating: 4.9,
    place: "Thiruvananthapuram, Kerala",
    workSamples: [],
    createdAt: "2025-01-15T00:00:00.000Z",
  },
];

const CATEGORIES = ["All", "Web Development", "Design", "Backend", "Mobile"];

const CATEGORY_STYLE = {
  "Web Development": { label: "WEB" },
  Design:            { label: "DSN" },
  Backend:           { label: "API" },
  Mobile:            { label: "MOB" },
  default:           { label: "SVC" },
};

function getCatStyle(cat) {
  return CATEGORY_STYLE[cat] || CATEGORY_STYLE.default;
}

// ─── Toast ───────────────────────────────────────────────────
function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{
      position: "fixed",
      bottom: 28,
      right: 28,
      zIndex: 9999,
      background: "#000",
      color: "#fff",
      fontSize: 12,
      fontFamily: "'DM Mono', monospace",
      letterSpacing: "0.04em",
      padding: "10px 20px",
      borderRadius: 8,
      boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
      border: "1px solid #333",
      animation: "fadeUp 0.25s ease",
    }}>
      {message}
    </div>
  );
}

// ─── Toggle ──────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      style={{
        position: "relative",
        width: 36,
        height: 20,
        borderRadius: 10,
        border: "none",
        background: checked ? "#000" : "#D1D5DB",
        cursor: "pointer",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute",
        top: 2,
        left: 2,
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        transition: "transform 0.2s",
        transform: checked ? "translateX(16px)" : "translateX(0)",
        display: "block",
      }} />
    </button>
  );
}

// ─── Work Samples Modal ──────────────────────────────────────
function WorkSamplesModal({ service, onClose }) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
        backdropFilter: "blur(4px)",
      }}
    >
      <div style={{
        width: "100%", maxWidth: 520,
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #E5E7EB",
        overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
      }}>
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid #F3F4F6",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", marginBottom: 2 }}>
              WORK SAMPLES
            </p>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#000", fontFamily: "'Sora', sans-serif", margin: 0 }}>
              {service.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "#F3F4F6", border: "none", cursor: "pointer",
              fontSize: 14, color: "#6B7280", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>

        <div style={{ padding: "16px 24px 24px", maxHeight: "60vh", overflowY: "auto" }}>
          {service.workSamples.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#D1D5DB" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>◫</div>
              <p style={{ fontSize: 12, fontFamily: "'DM Mono', monospace" }}>No work samples added yet</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {service.workSamples.map((ws, i) => (
                <a
                  key={i}
                  href={ws.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "block",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: "1px solid #E5E7EB",
                    background: "#FAFAFA",
                    textDecoration: "none",
                    transition: "border-color 0.15s, background 0.15s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#000"; e.currentTarget.style.background = "#F9FAFB"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "#FAFAFA"; }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#000", fontFamily: "'Sora', sans-serif", margin: "0 0 4px" }}>
                        {ws.title}
                      </p>
                      <p style={{ fontSize: 11.5, color: "#6B7280", margin: 0, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                        {ws.description}
                      </p>
                    </div>
                    <span style={{ fontSize: 11, color: "#000", fontFamily: "'DM Mono', monospace", flexShrink: 0, marginTop: 2 }}>↗</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Delete Modal ────────────────────────────────────────────
function DeleteModal({ service, onClose, onConfirm }) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
        backdropFilter: "blur(4px)",
      }}
    >
      <div style={{
        width: "100%", maxWidth: 380,
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #E5E7EB",
        overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
        textAlign: "center",
      }}>
        <div style={{ padding: "32px 28px 20px" }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "#FEF2F2", border: "1px solid #FECACA",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: 18,
          }}>⚠</div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#000", fontFamily: "'Sora', sans-serif", marginBottom: 8 }}>
            Delete service?
          </h3>
          <p style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.6, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
            "{service.title}" will be permanently removed and cannot be recovered.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, padding: "0 24px 24px" }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: "11px 0", border: "1px solid #E5E7EB", background: "#fff", color: "#6B7280", borderRadius: 10, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
          >Cancel</button>
          <button
            onClick={onConfirm}
            style={{ flex: 1, padding: "11px 0", border: "none", background: "#EF4444", color: "#fff", borderRadius: 10, fontSize: 13, cursor: "pointer", fontFamily: "'Sora', sans-serif", fontWeight: 700 }}
          >Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Service Card ────────────────────────────────────────────
function ServiceCard({ service, onToggle, onEdit, onDelete, onViewSamples }) {
  const catStyle = getCatStyle(service.category);
  const sampleCount = service.workSamples?.length || 0;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: service.isActive ? "1px solid #E5E7EB" : "1px solid #F3F4F6",
        overflow: "hidden",
        opacity: service.isActive ? 1 : 0.6,
        transition: "all 0.2s",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = "#9CA3AF"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = service.isActive ? "#E5E7EB" : "#F3F4F6"; }}
    >
      <div style={{ height: 3, background: "#000", opacity: service.isActive ? 1 : 0.3 }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 0" }}>
        <span style={{
          fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: "0.12em",
          color: "#000", background: "#F3F4F6", padding: "3px 8px", borderRadius: 5, fontWeight: 600,
        }}>
          {catStyle.label}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {service.isPremium && (
            <span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", background: "#000", color: "#fff", padding: "2px 7px", borderRadius: 5, letterSpacing: "0.08em" }}>PRO</span>
          )}
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: service.isActive ? "#000" : "#D1D5DB" }} />
        </div>
      </div>

      <div style={{ padding: "12px 16px 0", flex: 1 }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: "#000", fontFamily: "'Sora', sans-serif", margin: "0 0 4px" }}>
          {service.price}
        </p>
        <h3 style={{
          fontSize: 13.5, fontWeight: 600, color: "#111", fontFamily: "'Sora', sans-serif",
          lineHeight: 1.4, margin: "0 0 8px",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {service.title}
        </h3>
        <p style={{
          fontSize: 12, color: "#9CA3AF", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", margin: "0 0 12px",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {service.description}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
          {service.skills.slice(0, 3).map((sk) => (
            <span key={sk} style={{
              fontSize: 10.5, fontFamily: "'DM Mono', monospace", color: "#374151",
              background: "#F9FAFB", border: "1px solid #E5E7EB", padding: "2px 8px", borderRadius: 5,
            }}>{sk}</span>
          ))}
          {service.skills.length > 3 && (
            <span style={{ fontSize: 10.5, color: "#D1D5DB", fontFamily: "'DM Mono', monospace", alignSelf: "center" }}>
              +{service.skills.length - 3} more
            </span>
          )}
        </div>

        <button
          onClick={() => onViewSamples(service)}
          style={{
            width: "100%", padding: "9px 0", borderRadius: 10, border: "1px solid #E5E7EB",
            background: sampleCount > 0 ? "#F9FAFB" : "#FAFAFA",
            color: sampleCount > 0 ? "#000" : "#D1D5DB",
            fontSize: 11.5, fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em",
            cursor: "pointer", marginBottom: 14, transition: "all 0.15s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
          onMouseEnter={(e) => { if (sampleCount > 0) { e.currentTarget.style.background = "#F3F4F6"; e.currentTarget.style.borderColor = "#9CA3AF"; } }}
          onMouseLeave={(e) => { e.currentTarget.style.background = sampleCount > 0 ? "#F9FAFB" : "#FAFAFA"; e.currentTarget.style.borderColor = "#E5E7EB"; }}
        >
          <span style={{ fontSize: 14 }}>◫</span>
          {sampleCount > 0 ? `${sampleCount} work sample${sampleCount > 1 ? "s" : ""}` : "No work samples"}
        </button>
      </div>

      <div style={{ padding: "0 16px 16px" }}>
        <div style={{ display: "flex", gap: 0, borderTop: "1px solid #F3F4F6", paddingTop: 12, marginBottom: 12 }}>
          {[
            { label: "Views",  val: service.views.toLocaleString() },
            { label: "Clicks", val: service.clicks },
            { label: "Rating", val: service.rating },
          ].map(({ label, val }, i) => (
            <div key={label} style={{ flex: 1, textAlign: "center", borderRight: i < 2 ? "1px solid #F3F4F6" : "none" }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#000", fontFamily: "'Sora', sans-serif", margin: "0 0 2px" }}>{val}</p>
              <p style={{ fontSize: 10, color: "#D1D5DB", fontFamily: "'DM Mono', monospace", margin: 0, letterSpacing: "0.08em" }}>{label.toUpperCase()}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Toggle checked={service.isActive} onChange={() => onToggle(service._id)} />
            <span style={{ fontSize: 11, color: service.isActive ? "#000" : "#D1D5DB", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}>
              {service.isActive ? "LIVE" : "PAUSED"}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => onEdit(service)}
              style={{
                padding: "6px 13px", border: "1px solid #E5E7EB", background: "#fff",
                color: "#374151", borderRadius: 8, fontSize: 11.5,
                fontFamily: "'DM Mono', monospace", cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#000"; e.currentTarget.style.background = "#000"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#374151"; }}
            >Edit</button>
            <button
              onClick={() => onDelete(service)}
              style={{
                padding: "6px 13px", border: "1px solid #FEE2E2", background: "#FFF5F5",
                color: "#FCA5A5", borderRadius: 8, fontSize: 11.5,
                fontFamily: "'DM Mono', monospace", cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#FECACA"; e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.background = "#FEF2F2"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#FEE2E2"; e.currentTarget.style.color = "#FCA5A5"; e.currentTarget.style.background = "#FFF5F5"; }}
            >Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Add Slot Card ───────────────────────────────────────────
function AddCard({ remaining, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "1.5px dashed #E5E7EB", borderRadius: 16, background: "#FAFAFA",
        minHeight: 320, width: "100%",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "all 0.2s", gap: 8,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#000"; e.currentTarget.style.background = "#F9FAFB"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "#FAFAFA"; }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: "50%", border: "1.5px dashed #D1D5DB",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, color: "#D1D5DB", transition: "all 0.2s",
      }}>+</div>
      <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'Sora', sans-serif", fontWeight: 600, margin: 0 }}>Add new service</p>
      <p style={{ fontSize: 10.5, color: "#D1D5DB", fontFamily: "'DM Mono', monospace", margin: 0, letterSpacing: "0.06em" }}>
        {remaining} SLOT{remaining !== 1 ? "S" : ""} REMAINING
      </p>
    </button>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────
export default function FreelanceDashboard() {
  const [activeCategory, setCategory] = useState("All");
  const [search, setSearch]           = useState("");
  const [deleteTarget, setDelete]     = useState(null);
  const [samplesTarget, setSamples]   = useState(null);
  const [toast, setToast]             = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token} = useUser();
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_BASE}/freelance/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log("res", res.data.services);
        setServices(res.data.services);
  
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchServices();
  }, [token]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const liveCount = services.filter((s) => s.isActive).length;
 
  const handleToggle = async (id) => {
    // 1. Optimistic update
    const prevServices = [...services];
  
    setServices((prev) =>
      prev.map((s) =>
        s._id === id ? { ...s, isActive: !s.isActive } : s
      )
    );
  
    try {
        console.log("tok",token);
        
        await axios.patch(
            `${API_BASE}/freelance/toggle/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
      showToast("Service status updated");
  
    } catch (err) {
      console.error(err);
  
      // 2. Rollback if API fails
      setServices(prevServices);
  
      showToast("Failed to update service");
    }
  };

  // ── Navigate to form with service data pre-filled ──
  const openEdit = (svc) => {
    navigate("/freelance-form", { state: { service: svc, isEdit: true } });
  };

  // ── Navigate to form with no data (blank form) ──
  const openAdd = () => {
    navigate("/freelance-form");
  };

  const handleDelete = async () => {
    const id = deleteTarget._id;
  
    try {
      await axios.delete(
        `${API_BASE}/freelance/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // remove from UI after success
      setServices((prev) => prev.filter((s) => s._id !== id));
  
      setDelete(null);
      showToast("Service deleted successfully");
  
    } catch (err) {
      console.error(err);
      showToast("Failed to delete service");
    }
  };

  const filtered = services.filter((s) => {
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    const q = search.toLowerCase();
    const matchQ = !q || s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <p>Loading services...</p>
      </div>
    );
  }
  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <Toast message={toast} />
      {deleteTarget && <DeleteModal service={deleteTarget} onClose={() => setDelete(null)} onConfirm={handleDelete} />}
      {samplesTarget && <WorkSamplesModal service={samplesTarget} onClose={() => setSamples(null)} />}

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'DM Mono', monospace", letterSpacing: "0.14em", marginBottom: 4 }}>
              FREELANCE STUDIO
            </p>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#000", fontFamily: "'Sora', sans-serif", margin: 0 }}>
              My Services
            </h1>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "4px 0 0", fontFamily: "'DM Mono', monospace" }}>
              {services.length}/3 services · {liveCount} live
            </p>
          </div>

          {services.length < 3 && (
            <button
              onClick={openAdd}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#000", color: "#fff", border: "none", borderRadius: 12,
                padding: "11px 20px", fontSize: 13, fontFamily: "'Sora', sans-serif", fontWeight: 700,
                cursor: "pointer", transition: "background 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#1a1a1a"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#000"}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add service
            </button>
          )}
        </div>

     

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 0",
            border: "1.5px dashed #E5E7EB", borderRadius: 16, background: "#fff",
          }}>
            <p style={{ fontSize: 32, color: "#F3F4F6", marginBottom: 8 }}>◈</p>
            <p style={{ fontSize: 13, color: "#D1D5DB", fontFamily: "'DM Mono', monospace" }}>No services found.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {filtered.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onToggle={handleToggle}
                onEdit={openEdit}
                onDelete={setDelete}
                onViewSamples={setSamples}
              />
            ))}
            {services.length < 3 && activeCategory === "All" && !search && (
              <AddCard remaining={3 - services.length} onClick={openAdd} />
            )}
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 10, color: "#E5E7EB", marginTop: 40, fontFamily: "'DM Mono', monospace", letterSpacing: "0.12em" }}>
          MAXIMUM 3 SERVICES PER ACCOUNT
        </p>
      </div>
    </div>
  );
}