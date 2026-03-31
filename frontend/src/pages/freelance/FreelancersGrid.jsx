import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../../../config";
import axios from "axios";

/* ── Sample data ── */
const categories = [
  { name: "Web Development", icon: "💻", tag: "tech" },
  { name: "App Development", icon: "📱", tag: "tech" },
  { name: "Software Development", icon: "🖥️", tag: "tech" },
  { name: "UI/UX Design", icon: "🎨", tag: "design" },
  { name: "Graphic Design", icon: "✏️", tag: "design" },
  { name: "Logo Design", icon: "🏷️", tag: "design" },
  { name: "Poster & Banner Design", icon: "🪧", tag: "design" },
  { name: "Video Editing", icon: "🎬", tag: "media" },
  { name: "Videography", icon: "📹", tag: "media" },
  { name: "Photography", icon: "📷", tag: "media" },
  { name: "Content Writing", icon: "📝", tag: "writing" },
  { name: "Digital Marketing", icon: "📈", tag: "marketing" },
  { name: "Social Media Marketing", icon: "📣", tag: "marketing" },
  { name: "Accounting & Finance", icon: "💰", tag: "finance" },
  { name: "Education & Training", icon: "🎓", tag: "education" },
  { name: "Makeup & Beauty", icon: "💄", tag: "beauty" },
  { name: "Henna / Mehndi Art", icon: "🌿", tag: "beauty" },
  { name: "Drawing & Illustration", icon: "🖌️", tag: "art" },
  { name: "Gifting Services", icon: "🎁", tag: "art" },
  { name: "Event Management", icon: "🎉", tag: "event" },
  { name: "Hosting / Presenters", icon: "🎤", tag: "event" },
  { name: "Food & Catering", icon: "🍽️", tag: "food" },
  { name: "Fashion Design", icon: "👗", tag: "fashion" },
  { name: "Tailoring", icon: "🧵", tag: "fashion" },
  { name: "Cleaning Services", icon: "🧹", tag: "home" },
  { name: "Others", icon: "💼", tag: "marketing" },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:           #0a0a0a;
    --ink-mid:       #404040;
    --ink-muted:     #888;
    --ink-faint:     #bbb;
    --surface:       #ffffff;
    --surface-2:     #f7f7f8;
    --surface-3:     #f0f0f2;
    --border:        #e4e4e8;
    --border-hover:  #c0c0c8;
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
    padding: 52px 20px 44px;
    overflow: hidden;
  }

  .fc-hero::before {
    content: 'HIRE';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'DM Serif Display', serif;
    font-size: clamp(80px, 22vw, 260px);
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
    font-size: clamp(28px, 6vw, 58px);
    font-weight: 400;
    color: var(--ink);
    line-height: 1.1;
    letter-spacing: -1px;
    position: relative;
    margin-bottom: 12px;
  }

  .fc-title em {
    font-style: italic;
    color: var(--ink-mid);
  }

  .fc-subtitle {
    font-size: clamp(12px, 2.5vw, 14px);
    font-weight: 400;
    color: var(--ink-muted);
    letter-spacing: 0.01em;
    margin-bottom: 32px;
    position: relative;
    padding: 0 8px;
  }

  /* ── SEARCH BAR ── */
  .fc-search-wrap {
    position: relative;
    display: flex;
    width: 100%;
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
    left: 14px; top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    pointer-events: none;
    opacity: 0.4;
  }

  .fc-search {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    font-family: 'Manrope', sans-serif;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--ink);
    padding: 13px 10px 13px 40px;
    letter-spacing: 0.01em;
  }

  .fc-search::placeholder { color: var(--ink-faint); font-weight: 400; }

  .fc-search-btn {
    flex-shrink: 0;
    border: none;
    background: var(--ink);
    color: #fff;
    font-family: 'Manrope', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0 16px;
    cursor: pointer;
    transition: background 0.15s;
    white-space: nowrap;
    margin: 5px;
    border-radius: 10px;
  }

  .fc-search-btn:hover { background: #222; }

  /* ── COUNT TAG ── */
  .fc-count {
    text-align: center;
    font-size: 11px;
    color: var(--ink-faint);
    margin: 18px 0 28px;
    letter-spacing: 0.04em;
  }

  .fc-count strong {
    color: var(--ink);
    font-weight: 700;
  }

  /* ── GRID ── */
  .fc-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* ── CARD ── */
  .fc-card {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 18px 16px 16px;
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.25s cubic-bezier(.34,1.4,.64,1),
                box-shadow 0.25s ease,
                border-color 0.2s ease;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    animation: fadeUp 0.4s cubic-bezier(.22,.68,0,1.18) both;
    /* ensure tap targets are big enough */
    min-height: 96px;
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
    width: 34px; height: 34px;
    background: linear-gradient(225deg, var(--surface-3) 45%, transparent 46%);
    border-radius: 0 16px 0 0;
    pointer-events: none;
    transition: background 0.2s;
  }

  .fc-card:hover::after {
    background: linear-gradient(225deg, var(--surface-2) 45%, transparent 46%);
  }

  /* icon wrapper */
  .fc-icon-wrap {
    width: 40px; height: 40px;
    border-radius: 11px;
    background: var(--surface-3);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin-bottom: 12px;
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
    font-size: 12px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.3;
    letter-spacing: -0.1px;
    margin-bottom: 4px;
    position: relative;
    z-index: 1;
  }

  /* subtle arrow at bottom right on hover */
  .fc-arrow {
    position: absolute;
    bottom: 12px; right: 14px;
    font-size: 13px;
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

  /* ── SUGGEST SECTION ── */
  .fc-suggest-wrapper {
    grid-column: 1 / -1;
    margin-top: 48px;
  }

  .fc-suggest {
    max-width: 560px;
    margin: 0 auto;
    text-align: center;
    padding: 0 4px;
  }

  .fc-suggest-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(22px, 4vw, 28px);
    color: var(--ink);
    margin-bottom: 6px;
  }

  .fc-suggest-sub {
    font-size: 13px;
    color: var(--ink-muted);
    margin-bottom: 16px;
  }

  .fc-suggest-box {
    display: flex;
    gap: 8px;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 6px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    width: 100%;
  }

  .fc-suggest-box input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    font-family: 'Manrope', sans-serif;
    font-size: 13px;
    padding: 10px 10px 10px 12px;
    background: transparent;
    color: var(--ink);
  }

  .fc-suggest-box input::placeholder { color: var(--ink-faint); }

  .fc-suggest-box button {
    flex-shrink: 0;
    border: none;
    background: var(--ink);
    color: #fff;
    font-family: 'Manrope', sans-serif;
    font-size: 12px;
    font-weight: 700;
    padding: 0 16px;
    border-radius: 8px;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s;
    min-height: 40px;
  }

  .fc-suggest-box button:hover { background: #222; }

  /* ── TOAST ── */
  .fc-toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--ink);
    color: #fff;
    padding: 10px 18px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
    animation: fadeUp 0.3s ease;
    z-index: 999;
    white-space: nowrap;
  }

  /* ── RESPONSIVE BREAKPOINTS ── */
  @media (max-width: 900px) {
    .fc-grid { grid-template-columns: repeat(3, 1fr); }
  }

  @media (max-width: 600px) {
    .fc-hero { padding: 40px 16px 36px; }
    .fc-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      padding: 0 16px;
    }
    .fc-card { padding: 14px 13px 14px; min-height: 88px; }
    .fc-card-name { font-size: 11.5px; }
    .fc-icon-wrap { width: 36px; height: 36px; font-size: 16px; margin-bottom: 10px; }
    .fc-suggest-box { flex-direction: column; gap: 6px; }
    .fc-suggest-box button { min-height: 44px; border-radius: 8px; }
  }

  @media (max-width: 380px) {
    .fc-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; padding: 0 12px; }
    .fc-title { letter-spacing: -0.5px; }
  }
`;

function CategoryCard({ cat, navigate, index }) {
  const handleClick = () => {
    if (navigate) navigate("/freelance-list", { state: { category: cat.name } });
  };

  return (
    <div
      className="fc-card"
      onClick={handleClick}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="fc-icon-wrap">{cat.icon}</div>
      <p className="fc-card-name">{cat.name}</p>
      <span className="fc-arrow">→</span>
    </div>
  );
}

export default function FreelancerCategories() {
  const [query, setQuery] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSuggest = async () => {
    if (!suggestion.trim()) return;
    try {
      await axios.post(`${API_BASE}/freelance/suggestcategory`, {
        candidateCategory: suggestion,
      });
      setToast("Suggestion sent 🚀");
      setSuggestion("");
    } catch (err) {
      setToast("Failed to send");
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="fc-page">

        {/* Hero */}
        <div className="fc-hero">
          <h1 className="fc-title">
            Find your perfect<br /><em>creative match</em>
          </h1>
          <p className="fc-subtitle">
            Skilled professionals for every creative &amp; technical need
          </p>

          {/* Search */}
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

        {/* Toast */}
        {toast && <div className="fc-toast">{toast}</div>}

        {/* Count */}
        <p className="fc-count">
          <strong>{filtered.length}</strong> categories available
        </p>

        {/* Grid */}
        <div className="fc-grid">
          {filtered.length > 0 ? (
            filtered.map((cat, i) => (
              <CategoryCard
                key={cat.name}
                cat={cat}
                navigate={navigate}
                index={i}
              />
            ))
          ) : (
            <div className="fc-empty">
              <span className="fc-empty-icon">🔍</span>
              No categories found for &ldquo;{query}&rdquo;
            </div>
          )}

          {/* Suggest — always at bottom of grid, spans full width */}
          <div className="fc-suggest-wrapper">
            <div className="fc-suggest">
              <h2 className="fc-suggest-title">Suggest a new category</h2>
              <p className="fc-suggest-sub">
                Can't find what you're looking for? Help us improve.
              </p>
              <div className="fc-suggest-box">
                <input
                  type="text"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="e.g. Drone Photography"
                  onKeyDown={(e) => e.key === "Enter" && handleSuggest()}
                />
                <button onClick={handleSuggest}>Submit</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}