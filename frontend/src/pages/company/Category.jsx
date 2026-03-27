import { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  // 💻 TECHNOLOGY
  { name: "IT & Software", icon: "🖥️", tag: "tech" },
  { name: "Web & App Development", icon: "🌐", tag: "web" },

  // 🎨 CREATIVE
  { name: "Design & Creative", icon: "🎨", tag: "design" },
  { name: "Media & Video Production", icon: "🎬", tag: "media" },

  // 📈 MARKETING
  { name: "Digital Marketing & Advertising", icon: "📈", tag: "marketing" },

  // 🏢 BUSINESS SERVICES
  { name: "Business & Consulting", icon: "📊", tag: "business" },
  { name: "Finance & Legal Services", icon: "⚖️", tag: "finance" },

  // 🛒 COMMERCIAL
  { name: "E-commerce & Retail", icon: "🛍️", tag: "commerce" },
  { name: "Sales & Distribution", icon: "📦", tag: "sales" },

  // 🏗️ INFRASTRUCTURE
  { name: "Construction & Real Estate", icon: "🏗️", tag: "construction" },
  { name: "Interior & Architecture", icon: "🛋️", tag: "interior" },

  // 🏠 LOCAL SERVICES
  { name: "Home & Maintenance Services", icon: "🧹", tag: "home" },

  // 🎉 EVENTS
  { name: "Event Management & Entertainment", icon: "🎉", tag: "event" },

  // 🍽️ FOOD
  { name: "Food & Catering Services", icon: "🍽️", tag: "food" },

  // 🎓 EDUCATION
  { name: "Education & Training", icon: "🎓", tag: "education" },

  // 🚚 LOGISTICS
  { name: "Logistics & Transportation", icon: "🚚", tag: "logistics" },

  // 🏥 HEALTH
  { name: "Healthcare & Wellness", icon: "🏥", tag: "health" },

  // 👗 LIFESTYLE
  { name: "Fashion, Beauty & Lifestyle", icon: "👗", tag: "lifestyle" },

  // 🌾 TRADITIONAL / LOCAL
  { name: "Agriculture & Local Products", icon: "🌾", tag: "agriculture" },
  { name: "Tourism & Hospitality", icon: "🏝️", tag: "tourism" },

  // 🔧 GENERAL
  { name: "Other Services", icon: "💼", tag: "other" },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:          #0a0a0a;
    --ink-mid:      #404040;
    --ink-muted:    #888;
    --ink-faint:    #bbb;
    --surface:      #ffffff;
    --surface-2:    #f7f7f8;
    --surface-3:    #f0f0f2;
    --border:       #e4e4e8;
    --border-hover: #c0c0c8;
  }

  .fc-page {
    font-family: 'Manrope', sans-serif;
    min-height: 100vh;
    background: var(--surface-2);
    padding: 0 0 80px;
  }

  /* ── HERO ── */
  .fc-hero {
    position: relative;
    text-align: center;
    padding: 64px 24px 52px;
    overflow: hidden;
  }

  .fc-hero::before {
    content: 'HIRE';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'DM Serif Display', serif;
    font-size: clamp(120px, 22vw, 260px);
    font-weight: 400;
    color: rgba(0,0,0,0.032);
    white-space: nowrap;
    pointer-events: none;
    user-select: none;
    letter-spacing: -4px;
  }

  .fc-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-muted);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 99px;
    padding: 5px 14px;
    margin-bottom: 20px;
    position: relative;
  }

  .fc-eyebrow-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--ink);
    animation: blink 2s ease infinite;
  }

  @keyframes blink {
    0%,100% { opacity:1; }
    50%      { opacity:0.3; }
  }

  .fc-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(36px, 6vw, 58px);
    font-weight: 400;
    color: var(--ink);
    line-height: 1.05;
    letter-spacing: -1.5px;
    position: relative;
    margin-bottom: 12px;
  }

  .fc-title em {
    font-style: italic;
    color: var(--ink-mid);
  }

  .fc-subtitle {
    font-size: 14px;
    font-weight: 400;
    color: var(--ink-muted);
    letter-spacing: 0.01em;
    margin-bottom: 36px;
    position: relative;
  }

  /* ── SEARCH ── */
  .fc-search-wrap {
    position: relative;
    display: flex;
    max-width: 480px;
    margin: 0 auto;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .fc-search-wrap:focus-within {
    border-color: var(--ink);
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  }

  .fc-search-icon {
    position: absolute;
    left: 16px; top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    pointer-events: none;
    opacity: 0.4;
  }

  .fc-search {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-family: 'Manrope', sans-serif;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--ink);
    padding: 14px 14px 14px 42px;
    letter-spacing: 0.01em;
  }

  .fc-search::placeholder { color: var(--ink-faint); font-weight: 400; }

  .fc-search-btn {
    border: none;
    background: var(--ink);
    color: #fff;
    font-family: 'Manrope', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0 20px;
    cursor: pointer;
    transition: background 0.15s;
    white-space: nowrap;
    margin: 5px;
    border-radius: 10px;
  }

  .fc-search-btn:hover { background: #222; }

  /* ── COUNT ── */
  .fc-count {
    text-align: center;
    font-size: 11px;
    color: var(--ink-faint);
    margin: 20px 0 32px;
    letter-spacing: 0.04em;
  }

  .fc-count strong { color: var(--ink); font-weight: 700; }

  /* ── GRID ── */
  .fc-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 24px;
  }

  /* ── CARD ── */
  .fc-card {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 20px 18px 18px;
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.25s cubic-bezier(.34,1.4,.64,1),
                box-shadow 0.25s ease,
                border-color 0.2s ease;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    animation: fadeUp 0.4s cubic-bezier(.22,.68,0,1.18) both;
  }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(14px) scale(0.97); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }

  .fc-card:hover {
    transform: translateY(-5px) scale(1.012);
    box-shadow: 0 12px 40px rgba(0,0,0,0.11), 0 2px 8px rgba(0,0,0,0.06);
    border-color: var(--border-hover);
  }

  /* top-right corner accent slash */
  .fc-card::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 38px; height: 38px;
    background: linear-gradient(225deg, var(--surface-3) 45%, transparent 46%);
    border-radius: 0 18px 0 0;
    pointer-events: none;
    transition: background 0.2s;
  }

  .fc-card:hover::after {
    background: linear-gradient(225deg, var(--surface-2) 45%, transparent 46%);
  }

  /* icon wrapper */
  .fc-icon-wrap {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: var(--surface-3);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    margin-bottom: 14px;
    transition: background 0.2s, transform 0.25s cubic-bezier(.34,1.4,.64,1);
    position: relative;
    z-index: 1;
  }

  .fc-card:hover .fc-icon-wrap {
    background: var(--ink);
    border-color: var(--ink);
    transform: scale(1.08) rotate(-4deg);
    filter: grayscale(1) invert(1);
  }

  .fc-card-name {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.25;
    letter-spacing: -0.1px;
    margin-bottom: 6px;
    position: relative;
    z-index: 1;
  }

  .fc-arrow {
    position: absolute;
    bottom: 14px; right: 16px;
    font-size: 14px;
    color: var(--ink-faint);
    opacity: 0;
    transform: translateX(-4px);
    transition: opacity 0.2s, transform 0.2s;
  }

  .fc-card:hover .fc-arrow {
    opacity: 1;
    transform: translateX(0);
  }

  /* ── EMPTY ── */
  .fc-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 64px 0;
    color: var(--ink-faint);
    font-size: 13px;
  }

  .fc-empty-icon {
    font-size: 36px;
    display: block;
    margin-bottom: 12px;
    opacity: 0.4;
  }

  @media (max-width: 900px) {
    .fc-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 620px) {
    .fc-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

function CategoryCard({ cat, navigate, index }) {
  return (
    <div
      className="fc-card"
      onClick={() => navigate && navigate("/freelance-list", { state: { category: cat.name } })}
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div className="fc-icon-wrap">{cat.icon}</div>
      <p className="fc-card-name">{cat.name}</p>
      <span className="fc-arrow">→</span>
    </div>
  );
}

export default function FreelancerCategories() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="fc-page">
        <div className="fc-hero">
          <div className="fc-eyebrow">
            <span className="fc-eyebrow-dot" />
            Browse Services
          </div>
          <h1 className="fc-title">
            Find your perfect<br /><em>creative match</em>
          </h1>
          <p className="fc-subtitle">
            Skilled professionals for every creative &amp; technical need
          </p>

          <div className="fc-search-wrap">
            <span className="fc-search-icon">⌕</span>
            <input
              className="fc-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories…"
            />
            <button className="fc-search-btn">Search</button>
          </div>
        </div>

        <p className="fc-count">
          <strong>{filtered.length}</strong> categories available
        </p>

        <div className="fc-grid">
          {filtered.length > 0 ? (
            filtered.map((cat, i) => (
              <CategoryCard key={cat.name} cat={cat} navigate={navigate} index={i} />
            ))
          ) : (
            <div className="fc-empty">
              <span className="fc-empty-icon">🔍</span>
              No categories found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </div>
    </>
  );
}