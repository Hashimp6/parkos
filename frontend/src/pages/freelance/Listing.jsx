import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import API_BASE from "../../../config";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  .fl3-root {
    background: #f7f7f5;
    min-height: 100vh;
    font-family: 'Instrument Sans', sans-serif;
    color: #111;
  }

  /* ── Header ── */
  .fl3-header {
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 58px;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .fl3-logo {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .fl3-search-wrap {
    position: relative;
    flex: 1;
    max-width: 300px;
    margin: 0 28px;
  }
  .fl3-search-wrap svg {
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
    pointer-events: none;
  }
  .fl3-search {
    width: 100%;
    background: #f2f2f2;
    border: 1px solid #e4e4e4;
    color: #111;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px;
    padding: 8px 12px 8px 34px;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .fl3-search::placeholder { color: #bbb; }
  .fl3-search:focus { background: #fff; border-color: #111; }
  .fl3-hcount { font-size: 11.5px; color: #999; }

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
    font-size: clamp(26px, 3.5vw, 40px);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.025em;
    margin: 0 0 10px;
  }
  .fl3-hero-title em { font-style: italic; color: #555; }
  .fl3-hero-desc { font-size: 13px; color: #888; font-weight: 300; line-height: 1.6; max-width: 320px; }

  /* ── Projected card (hero right) ── */
  .fl3-hero-right {
    flex-shrink: 0;
    width: 240px;
    display: none;
    animation: fl3-up 0.55s 0.15s ease both;
  }
  @media (min-width: 800px) { .fl3-hero-right { display: block; } }

  .fl3-proj {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 14px;
    padding: 5px;
    box-shadow: 0 6px 24px rgba(0,0,0,0.07);
    transition: box-shadow 0.25s, transform 0.25s;
  }
  .fl3-proj:hover { box-shadow: 0 12px 36px rgba(0,0,0,0.11); transform: translateY(-2px); }
  .fl3-proj-inner { display: flex; align-items: center; gap: 10px; padding: 9px; }
  .fl3-proj-img {
    width: 52px; height: 52px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
    background: #eee;
  }
  .fl3-proj-info { flex: 1; min-width: 0; }
  .fl3-proj-lbl { font-size: 9px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #bbb; margin-bottom: 3px; }
  .fl3-proj-name { font-family: 'Playfair Display', serif; font-size: 13px; font-weight: 700; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fl3-proj-role { font-size: 10.5px; color: #888; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fl3-proj-skills { display: flex; flex-wrap: wrap; gap: 3px; }
  .fl3-proj-skill { font-size: 9px; font-weight: 500; padding: 2px 7px; border-radius: 100px; background: #f4f4f4; border: 1px solid #e8e8e8; color: #666; }
  .fl3-proj-foot {
    border-top: 1px solid #f0f0f0;
    padding: 8px 9px 3px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .fl3-proj-rating { font-size: 11px; font-weight: 600; color: #111; display: flex; align-items: center; gap: 3px; }
  .fl3-proj-star { color: #f5a623; }
  .fl3-proj-badge { font-size: 9px; font-weight: 700; letter-spacing: 0.05em; padding: 3px 9px; border-radius: 100px; background: #111; color: #fff; }

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

  /* 4-column grid */
  .fl3-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  @media (max-width: 900px) { .fl3-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 540px)  { .fl3-grid { grid-template-columns: 1fr; } }

  /* ── Compact card ── */
  @keyframes fl3-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fl3-shimmer {
    from { background-position: -500px 0; }
    to   { background-position: 500px 0; }
  }

  .fl3-card {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 14px;
    padding: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    opacity: 0;
    animation: fl3-up 0.4s ease both;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s cubic-bezier(.22,.68,0,1.2);
    position: relative;
    overflow: hidden;
  }
  .fl3-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: #111;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s ease;
  }
  .fl3-card:hover {
    border-color: #ccc;
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
    transform: translateY(-3px);
  }
  .fl3-card:hover::after { transform: scaleX(1); }

  /* Square image */
  .fl3-img-wrap {
    width: 52px; height: 52px;
    flex-shrink: 0;
    border-radius: 10px;
    overflow: hidden;
    background: #f0f0f0;
    border: 1px solid #ececec;
  }
  .fl3-img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s;
  }
  .fl3-card:hover .fl3-img { transform: scale(1.08); }

  /* Info */
  .fl3-info { flex: 1; min-width: 0; }
  .fl3-name {
    font-family: 'Playfair Display', serif;
    font-size: 13.5px;
    font-weight: 700;
    margin: 0 0 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fl3-role {
    font-size: 11px;
    color: #777;
    font-weight: 400;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fl3-skills { display: flex; flex-wrap: wrap; gap: 4px; }
  .fl3-skill {
    font-size: 9.5px;
    font-weight: 500;
    padding: 2px 7px;
    border-radius: 100px;
    background: #f5f5f5;
    border: 1px solid #e8e8e8;
    color: #666;
    transition: background 0.15s;
  }
  .fl3-card:hover .fl3-skill { background: #eee; }

  /* Rating pill top-right */
  .fl3-rating {
    position: absolute;
    top: 9px; right: 10px;
    font-size: 9.5px;
    font-weight: 600;
    color: #555;
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .fl3-rstar { color: #f5a623; }

  /* ── Skeleton ── */
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

function FreelancerCard({ freelancer, index }) {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(freelancer.name||"F")}&background=eeeeee&color=111111&size=128`;
  return (
    <div className="fl3-card" style={{ animationDelay:`${index * 60}ms` }}>
      <div className="fl3-rating">
        <span className="fl3-rstar">★</span>
        {freelancer.rating?.toFixed(1)}
      </div>
      <div className="fl3-img-wrap">
        <img
          className="fl3-img"
          src={freelancer.profilePhoto || fallback}
          alt={freelancer.name}
          onError={e => { e.target.src = fallback; }}
        />
      </div>
      <div className="fl3-info">
        <p className="fl3-name">{freelancer.name}</p>
        <p className="fl3-role">{freelancer.tagline}</p>
        <div className="fl3-skills">
          {(freelancer.skills || []).slice(0, 2).map(s => (
            <span key={s} className="fl3-skill">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectedCard({ freelancer }) {
  if (!freelancer) return null;
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(freelancer.name||"F")}&background=eeeeee&color=111111&size=128`;
  return (
    <div className="fl3-hero-right">
      <div className="fl3-proj">
        <div className="fl3-proj-inner">
          <img className="fl3-proj-img" src={freelancer.profilePhoto || fallback} alt={freelancer.name} onError={e=>{e.target.src=fallback;}} />
          <div className="fl3-proj-info">
            <p className="fl3-proj-lbl">Featured</p>
            <p className="fl3-proj-name">{freelancer.name}</p>
            <p className="fl3-proj-role">{freelancer.tagline}</p>
            <div className="fl3-proj-skills">
              {(freelancer.skills||[]).slice(0,3).map(s=>(
                <span key={s} className="fl3-proj-skill">{s}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="fl3-proj-foot">
          <div className="fl3-proj-rating"><span className="fl3-proj-star">★</span>{freelancer.rating?.toFixed(1)}</div>
          <span className="fl3-proj-badge">Top Rated</span>
        </div>
      </div>
    </div>
  );
}

export default function FreelancerList() {
  const location = useLocation();
  const selectedCategory = location.state?.category || "All";
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");

  useEffect(() => {
    const id = "fl3-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id; el.textContent = STYLES;
      document.head.appendChild(el);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/freelance`, {
          params: { category: selectedCategory !== "All" ? selectedCategory : undefined },
        });
        setFreelancers(res.data.services.map(s => ({
          _id: s._id,
          name: s.candidate?.name,
          tagline: s.title,
          place: s.candidate?.place,
          profilePhoto: s.candidate?.profilePhoto,
          skills: s.skills || [],
          rating: s.rating || 4.5,
        })));
      } catch { setFreelancers(dummyFreelancers); }
      setLoading(false);
    })();
  }, [selectedCategory]);

  const filtered = freelancers.filter(f =>
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.tagline?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fl3-root">

      <header className="fl3-header">
        <span className="fl3-logo">Freelancers</span>
        <div className="fl3-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            className="fl3-search"
            type="text"
            placeholder="Search name or service…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span className="fl3-hcount">
          {loading ? "—" : `${filtered.length} found`}
        </span>
      </header>

      <div className="fl3-hero">
        <div className="fl3-hero-left">
          <div className="fl3-eyebrow">
            <span className="fl3-eyebrow-dot" />
            {selectedCategory === "All" ? "All Categories" : selectedCategory}
          </div>
          <h1 className="fl3-hero-title">Find the right<br /><em>freelancer</em> for you</h1>
          <p className="fl3-hero-desc">Browse verified professionals across design, development, video & more.</p>
        </div>
        {!loading && <ProjectedCard freelancer={freelancers[0] || null} />}
      </div>

      <div className="fl3-divider" />

      <div className="fl3-body">
        <div className="fl3-bar">
          <span className="fl3-bar-label">{loading ? "Loading…" : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}</span>
          <span className="fl3-cat-chip">{selectedCategory}</span>
        </div>

        {loading ? (
          <div className="fl3-grid">{[0,1,2,3,4,5,6,7].map(i=><SkeletonCard key={i}/>)}</div>
        ) : filtered.length === 0 ? (
          <div className="fl3-empty"><div className="fl3-empty-icon">🔍</div><p>No freelancers found.</p></div>
        ) : (
          <div className="fl3-grid">
            {filtered.map((f,i) => <FreelancerCard key={f._id} freelancer={f} index={i} />)}
          </div>
        )}
      </div>

    </div>
  );
}