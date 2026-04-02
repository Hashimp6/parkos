import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import API_BASE from "../../../config";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  .fl3-root {
    background: #f7f7f5;
    min-height: 100vh;
    font-family: 'Instrument Sans', sans-serif;
    color: #111;
  }

  /* ── Hero ── */
  .fl3-hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 36px 32px 30px;
    gap: 24px;
  }
  .fl3-hero-left { flex: 1; }
  .fl3-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #999;
    margin-bottom: 10px;
  }
  .fl3-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: #111; }
  .fl3-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(24px, 3.5vw, 40px);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.025em;
    margin: 0 0 10px;
  }
  .fl3-hero-title em { font-style: italic; color: #555; }
  .fl3-hero-desc { font-size: 13px; color: #888; font-weight: 300; line-height: 1.6; max-width: 320px; }

  /* ── Divider ── */
  .fl3-divider { height: 1px; background: #e8e8e8; margin: 0 32px; }

  /* ── Grid area ── */
  .fl3-body { padding: 24px 32px 56px; }
  .fl3-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .fl3-bar-label { font-size: 10.5px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #bbb; }
  .fl3-cat-chip { font-size: 10.5px; font-weight: 600; padding: 4px 12px; border-radius: 100px; background: #111; color: #fff; }

  /* Grid — 4 col → 2 col → 1 col */
  .fl3-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  @media (max-width: 1100px) { .fl3-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 540px)  { .fl3-grid { grid-template-columns: 1fr; gap: 10px; } }

  /* ── Skeleton shimmer ── */
  @keyframes fl3-shimmer {
    from { background-position: -500px 0; }
    to   { background-position: 500px 0; }
  }
  .fl3-skel {
    background: linear-gradient(90deg, #f0f0f0 25%, #e6e6e6 50%, #f0f0f0 75%);
    background-size: 500px 100%;
    animation: fl3-shimmer 1.3s infinite;
    border-radius: 6px;
  }
  .fl3-skel-card {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 14px;
    padding: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  /* ── Empty ── */
  .fl3-empty { text-align: center; padding: 60px 0; color: #bbb; font-size: 13px; }
  .fl3-empty-icon { font-size: 32px; margin-bottom: 10px; }

  /* ── MOBILE OVERRIDES ── */
  @media (max-width: 540px) {
    .fl3-hero { padding: 24px 16px 20px; }
    .fl3-divider { margin: 0 16px; }
    .fl3-body { padding: 16px 16px 48px; }
  }
`;

/* ─────────────────────────────────────────
   FreelancerCard — fully fluid, no fixed px
───────────────────────────────────────── */
const cardStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --white: #ffffff;
    --off-white: #f8f8fa;
    --border: #e8e8ed;
    --border-light: #f0f0f5;
    --ink: #0a0a0a;
    --ink-mid: #3a3a3a;
    --ink-soft: #8a8a96;
    --shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04);
    --shadow-xl: 0 20px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08);
  }

  /* Wrapper is fully fluid — no fixed width */
  .fl-wrap {
    font-family: 'Outfit', sans-serif;
    position: relative;
    width: 100%;
  }

  /* ── CARD ── */
  .fl-card {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    width: 100%;
    min-height: 140px;        /* was fixed 160px — now min so it can grow */
    border-radius: 20px;
    background: var(--white);
    border: 1px solid var(--border);
    overflow: hidden;
    position: relative;
    box-shadow: var(--shadow-md);
    transition: transform 0.3s cubic-bezier(.34,1.4,.64,1), box-shadow 0.3s ease;
    cursor: pointer;
    animation: cardIn 0.5s cubic-bezier(.22,.68,0,1.2) both;
  }

  @keyframes cardIn {
    from { opacity:0; transform: translateY(16px) scale(0.97); }
    to   { opacity:1; transform: translateY(0) scale(1); }
  }

  .fl-card:hover {
    transform: translateY(-4px) scale(1.006);
    box-shadow: var(--shadow-xl);
  }

  /* Corner fold accent */
  .fl-card::after {
    content: '';
    position: absolute;
    bottom: 0; right: 0;
    width: 40px; height: 40px;
    background: linear-gradient(225deg, var(--border-light) 45%, transparent 46%);
    pointer-events: none;
  }

  /* ── LEFT IMAGE PANEL ── */
  .fl-left {
    position: relative;
    width: 32%;             /* fluid % instead of fixed 150px */
    min-width: 100px;       /* never collapse too small */
    max-width: 160px;       /* cap on large screens */
    overflow: hidden;
    flex-shrink: 0;
  }

  .fl-bg-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(18%) contrast(1.05);
    transform: scale(1.04);
    transition: transform 0.5s ease;
  }

  .fl-card:hover .fl-bg-img { transform: scale(1.09); }

  .fl-left-overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to right, transparent 50%, rgba(255,255,255,0.96) 100%),
      linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, transparent 40%, rgba(0,0,0,0.2) 100%);
    pointer-events: none;
    z-index: 1;
  }

  .fl-left-edge {
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--border) 30%, var(--border) 70%, transparent);
    z-index: 2;
  }

  /* Rating badge */
  .fl-rating {
    position: absolute;
    bottom: 10px; left: 10px;
    z-index: 3;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.9);
    border-radius: 9px;
    padding: 3px 7px 3px 5px;
    display: flex;
    align-items: center;
    gap: 3px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }

  .fl-star { font-size: 10px; color: #f59e0b; line-height: 1; }
  .fl-rating-val {
    font-size: 11px;
    font-weight: 600;
    color: var(--ink);
    line-height: 1;
    letter-spacing: -0.2px;
  }

  /* Online indicator */
  .fl-status {
    position: absolute;
    top: 10px; left: 10px;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(255,255,255,0.88);
    backdrop-filter: blur(6px);
    border-radius: 99px;
    padding: 3px 7px 3px 5px;
    border: 1px solid rgba(255,255,255,0.9);
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  }

  .fl-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 5px rgba(34,197,94,0.6);
    animation: pulse 2.4s ease infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.55; }
  }

  .fl-status-txt {
    font-size: 9px;
    font-weight: 600;
    color: #16a34a;
    letter-spacing: 0.03em;
    line-height: 1;
  }

  /* ── RIGHT CONTENT ── */
  .fl-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 14px 16px 14px 14px;
    min-width: 0;
    background: var(--white);
    position: relative;
  }

  .fl-meta {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 4px;
    flex-wrap: wrap;
  }

  .fl-badge {
    font-size: 8.5px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-soft);
    background: var(--off-white);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 2px 6px;
    line-height: 1.4;
    white-space: nowrap;
  }

  .fl-badge-pro {
    background: var(--ink);
    color: var(--white);
    border-color: var(--ink);
  }

  .fl-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(16px, 3.5vw, 22px);   /* fluid, was fixed 22px */
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -0.3px;
    line-height: 1.1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 2px;
  }

  .fl-title {
    font-size: clamp(10px, 2vw, 11.5px);
    font-weight: 400;
    color: var(--ink-soft);
    letter-spacing: 0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0;
  }

  /* Decorative rule */
  .fl-rule {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 9px 0 8px;
  }
  .fl-rule-line { flex: 1; height: 1px; background: var(--border-light); }
  .fl-rule-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--border); }

  /* Skills */
  .fl-skills { display: flex; flex-wrap: wrap; gap: 4px; }

  .fl-skill {
    font-size: 9.5px;
    font-weight: 500;
    padding: 3px 9px;
    border-radius: 99px;
    letter-spacing: 0.02em;
    line-height: 1;
    white-space: nowrap;
    transition: all 0.18s ease;
    border: 1px solid var(--border);
    background: var(--off-white);
    color: var(--ink-mid);
  }

  .fl-skill:first-child {
    background: var(--ink);
    color: var(--white);
    border-color: var(--ink);
  }

  .fl-card:hover .fl-skill:first-child {
    background: #222;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  .fl-card:hover .fl-skill { border-color: #d0d0d8; }

  /* ── SMALL PHONE adjustments ── */
  @media (max-width: 380px) {
    .fl-card { min-height: 120px; border-radius: 16px; }
    .fl-left { width: 30%; min-width: 90px; }
    .fl-right { padding: 12px 12px 12px 12px; }
    .fl-status-txt { display: none; }   /* just show dot on tiny screens */
    .fl-rule { margin: 7px 0 6px; }
  }
`;

const dummyFreelancers = [
  { _id:"1", name:"Arjun Nair",   tagline:"Video Editor",        place:"Kochi",     profilePhoto:"https://randomuser.me/api/portraits/men/32.jpg",   skills:["Premiere Pro","YouTube"], rating:4.9 },
  { _id:"2", name:"Sarah Thomas", tagline:"UI/UX Designer",      place:"Bangalore", profilePhoto:"https://randomuser.me/api/portraits/women/44.jpg", skills:["Figma","Wireframe"],      rating:4.8 },
  { _id:"3", name:"Rahul Kumar",  tagline:"Full Stack Dev",       place:"Delhi",     profilePhoto:"https://randomuser.me/api/portraits/men/12.jpg",   skills:["React","Node.js"],        rating:4.7 },
  { _id:"4", name:"Priya Menon",  tagline:"Brand Strategist",    place:"Mumbai",    profilePhoto:"https://randomuser.me/api/portraits/women/22.jpg", skills:["Branding","Adobe"],       rating:4.6 },
  { _id:"5", name:"Dev Sharma",   tagline:"Motion Designer",     place:"Pune",      profilePhoto:"https://randomuser.me/api/portraits/men/55.jpg",   skills:["After Effects","C4D"],    rating:4.8 },
  { _id:"6", name:"Nisha Roy",    tagline:"Content Writer",      place:"Chennai",   profilePhoto:"https://randomuser.me/api/portraits/women/65.jpg", skills:["SEO","Copywriting"],      rating:4.5 },
  { _id:"7", name:"Amir Khan",    tagline:"3D Artist",           place:"Hyderabad", profilePhoto:"https://randomuser.me/api/portraits/men/78.jpg",   skills:["Blender","ZBrush"],       rating:4.7 },
  { _id:"8", name:"Meera Das",    tagline:"Illustrator",         place:"Kolkata",   profilePhoto:"https://randomuser.me/api/portraits/women/33.jpg", skills:["Procreate","Illustration"],rating:4.9},
];

function SkeletonCard() {
  return (
    <div className="fl3-skel-card">
      <div className="fl3-skel" style={{ width:52, height:52, borderRadius:10, flexShrink:0 }} />
      <div style={{ flex:1 }}>
        <div className="fl3-skel" style={{ height:13, width:"55%", marginBottom:6 }} />
        <div className="fl3-skel" style={{ height:10, width:"75%", marginBottom:7 }} />
        <div style={{ display:"flex", gap:4 }}>
          <div className="fl3-skel" style={{ height:18, width:52, borderRadius:100 }} />
          <div className="fl3-skel" style={{ height:18, width:44, borderRadius:100 }} />
        </div>
      </div>
    </div>
  );
}

function FreelancerCard({ freelancer = {}, index = 0 }) {
  const [imgErr, setImgErr] = useState(false);
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(freelancer.name || "F")}&background=e8e8ed&color=0a0a0a&size=256&bold=true`;
  const skills = (freelancer.skills || []).slice(0, 4);
  const isPro = (freelancer.rating || 0) >= 4.8;
  const navigate = useNavigate();

  return (
    <>
      <style>{cardStyle}</style>
      <div
        className="fl-wrap"
        style={{ animationDelay: `${index * 90}ms`, cursor: "pointer" }}
        onClick={() => navigate(`/freelancer/${freelancer._id}`)}
      >
        <div className="fl-card">
          {/* LEFT: photo panel */}
          <div className="fl-left">
            <img
              className="fl-bg-img"
              src={imgErr ? fallback : (freelancer.profilePhoto || fallback)}
              alt={freelancer.name}
              onError={() => setImgErr(true)}
            />
            <div className="fl-left-overlay" />
            <div className="fl-left-edge" />

            <div className="fl-status">
              <div className="fl-dot" />
              <span className="fl-status-txt">Available</span>
            </div>

            {freelancer.rating != null && (
              <div className="fl-rating">
                <span className="fl-star">★</span>
                <span className="fl-rating-val">{freelancer.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* RIGHT: content */}
          <div className="fl-right">
            <div className="fl-meta">
              {isPro && <span className="fl-badge fl-badge-pro">Pro</span>}
              <span className="fl-badge">Freelancer</span>
            </div>
            <p className="fl-name">{freelancer.name || "Freelancer"}</p>
            <p className="fl-title">{freelancer.tagline || "Independent Consultant"}</p>

            <div className="fl-rule">
              <div className="fl-rule-line" />
              <div className="fl-rule-dot" />
              <div className="fl-rule-line" />
            </div>

            <div className="fl-skills">
              {skills.map(s => (
                <span key={s} className="fl-skill">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function FreelancerList() {
  const location = useLocation();
  const selectedCategory = location.state?.category || "All";
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [page, setPage]               = useState(1);      // ✅ add
  const [hasMore, setHasMore]         = useState(true);   // ✅ add
  const [loadingMore, setLoadingMore] = useState(false);  // ✅ add

  useEffect(() => {
    const id = "fl3-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id; el.textContent = STYLES;
      document.head.appendChild(el);
    }
  }, []);

  // ✅ Reset page when category changes
  useEffect(() => { setPage(1); setFreelancers([]); }, [selectedCategory]);

  useEffect(() => {
    (async () => {
      try {
        page === 1 ? setLoading(true) : setLoadingMore(true);

        const res = await axios.get(`${API_BASE}/freelance`, {
          params: {
            category: selectedCategory !== "All" ? selectedCategory : undefined,
            page,
            limit: 12,
          },
        });

        const mapped = res.data.services.map(s => ({
          _id: s._id,
          name: s.candidate?.name,
          tagline: s.title,
          place: s.candidate?.place,
          profilePhoto: s.candidate?.profilePhoto,
          skills: s.skills || [],
          rating: s.rating || 4.5,
        }));

        // ✅ append on page > 1, replace on page 1
        setFreelancers(prev => page === 1 ? mapped : [...prev, ...mapped]);
        setHasMore(page < res.data.totalPages);

      } catch {
        if (page === 1) setFreelancers(dummyFreelancers);
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    })();
  }, [selectedCategory, page]); // ✅ depend on page

  const filtered = freelancers.filter(f =>
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.tagline?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fl3-root">
     <div className="fl3-hero">
        <div className="fl3-hero-left">
          <div className="fl3-eyebrow">
            <span className="fl3-eyebrow-dot" />
            {selectedCategory === "All" ? "All Categories" : selectedCategory}
          </div>
          <h1 className="fl3-hero-title">Find the right<br /><em>freelancer</em> for you</h1>
          <p className="fl3-hero-desc">Browse verified professionals across design, development, video & more.</p>
        </div>
      </div>

      <div className="fl3-divider" />
      <div className="fl3-body">
        <div className="fl3-bar">
          <span className="fl3-bar-label">
            {loading ? "Loading…" : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
          </span>
          <span className="fl3-cat-chip">{selectedCategory}</span>
        </div>

        {loading ? (
          <div className="fl3-grid">
            {[0,1,2,3,4,5,6,7].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="fl3-empty">
            <div className="fl3-empty-icon">🔍</div>
            <p>No freelancers found.</p>
          </div>
        ) : (
          <>
            <div className="fl3-grid">
              {filtered.map((f, i) => (
                <FreelancerCard key={f._id} freelancer={f} index={i} />
              ))}
            </div>

            {/* ✅ Load More button */}
            {!loadingMore && hasMore && (
              <div style={{ textAlign: "center", padding: "32px 0 0" }}>
                <button
                  onClick={() => setPage(p => p + 1)}
                  style={{
                    padding: "12px 36px", borderRadius: 100,
                    background: "#111", color: "#fff", border: "none",
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontWeight: 600, fontSize: 13, cursor: "pointer",
                    letterSpacing: "0.04em",
                  }}>
                  Load More
                </button>
              </div>
            )}

            {/* ✅ Loading spinner for page 2+ */}
            {loadingMore && (
              <div style={{ textAlign: "center", padding: "32px 0 0", color: "#bbb", fontSize: 13 }}>
                Loading more…
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}