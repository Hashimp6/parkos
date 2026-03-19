import { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { icon: "🌐", name: "Website Design", desc: "Landing pages, full sites, UI layouts and redesigns", tag: "Design", freelancers: 214 },
  { icon: "✍️", name: "Logo Design", desc: "Brand marks & visual identity", tag: "Design", freelancers: 189 },
  { icon: "🎨", name: "Poster Design", desc: "Event posters, social media visuals and print-ready artwork", tag: "Design", freelancers: 143 },
  { icon: "📱", name: "App Design", desc: "Mobile UI/UX, prototypes & wireframes", tag: "Design", freelancers: 132 },
  { icon: "✏️", name: "Illustration", desc: "Digital art, characters & custom scenes", tag: "Design", freelancers: 156 },
  { icon: "🗂️", name: "Presentations", desc: "Pitch decks, investor slides & branded PowerPoints", tag: "Design", freelancers: 118 },
  { icon: "📦", name: "Packaging", desc: "Product boxes & labels", tag: "Design", freelancers: 96 },
  { icon: "🖼️", name: "Banner Design", desc: "Web banners & ad creatives", tag: "Design", freelancers: 134 },
  { icon: "💻", name: "Web Development", desc: "React, Vue, WordPress, Node.js & full-stack builds", tag: "Tech", freelancers: 312 },
  { icon: "🛒", name: "E-Commerce", desc: "Shopify & WooCommerce stores", tag: "Tech", freelancers: 145 },
  { icon: "📊", name: "Data & Analytics", desc: "Dashboards, BI reports & data pipelines", tag: "Tech", freelancers: 109 },
  { icon: "🏗️", name: "CAD & Architecture", desc: "Technical drawings, 3D renders & floor plans", tag: "Tech", freelancers: 62 },
  { icon: "🔌", name: "API & Integrations", desc: "REST, GraphQL & third-party integrations", tag: "Tech", freelancers: 87 },
  { icon: "🎬", name: "Editing", desc: "YouTube videos, reels, ads, short films & corporate content", tag: "Video", freelancers: 178 },
  { icon: "🎪", name: "Animation", desc: "2D/3D motion graphics & explainer videos", tag: "Video", freelancers: 77 },
  { icon: "🎞️", name: "Color Grading", desc: "Cinematic color grading & correction", tag: "Video", freelancers: 54 },
  { icon: "📸", name: "Photography", desc: "Portrait, product & event photography", tag: "Media", freelancers: 203 },
  { icon: "🎵", name: "Music & Audio", desc: "Jingles, beats, mixing & sound design", tag: "Audio", freelancers: 91 },
  { icon: "🎭", name: "Voice Over", desc: "Narration, dubbing & commercials", tag: "Audio", freelancers: 84 },
  { icon: "🖋️", name: "Content Writing", desc: "SEO blogs, articles & copywriting that convert", tag: "Writing", freelancers: 267 },
  { icon: "🌍", name: "Translation", desc: "50+ languages, fast turnaround", tag: "Writing", freelancers: 143 },
  { icon: "🔧", name: "Technical Writing", desc: "Docs, manuals & API guides", tag: "Writing", freelancers: 88 },
  { icon: "📣", name: "Digital Marketing", desc: "Google Ads, Meta campaigns, SEO & email automation", tag: "Marketing", freelancers: 221 },
  { icon: "📲", name: "Social Media", desc: "Content strategy, scheduling & growth", tag: "Marketing", freelancers: 188 },
  { icon: "🎙️", name: "Anchoring & MC", desc: "Corporate events, weddings & live shows", tag: "Talent", freelancers: 67 },
  { icon: "🎓", name: "Online Tutoring", desc: "Academics, tech skills & creative coaching", tag: "Talent", freelancers: 175 },
];

const tagColors = {
  Design:    { bg: "bg-blue-50",   text: "text-blue-600",   icon: "bg-blue-100" },
  Tech:      { bg: "bg-violet-50", text: "text-violet-600", icon: "bg-violet-100" },
  Video:     { bg: "bg-orange-50", text: "text-orange-600", icon: "bg-orange-100" },
  Media:     { bg: "bg-emerald-50",text: "text-emerald-600",icon: "bg-emerald-100" },
  Audio:     { bg: "bg-amber-50",  text: "text-amber-600",  icon: "bg-amber-100" },
  Writing:   { bg: "bg-green-50",  text: "text-green-600",  icon: "bg-green-100" },
  Marketing: { bg: "bg-pink-50",   text: "text-pink-600",   icon: "bg-pink-100" },
  Talent:    { bg: "bg-purple-50", text: "text-purple-600", icon: "bg-purple-100" },
};

const allTags = ["All", ...Object.keys(tagColors)];

function CategoryCard({ cat, navigate }) {
  const color = tagColors[cat.tag] || {
    bg: "bg-gray-50",
    text: "text-gray-600",
    icon: "bg-gray-100",
  };

  const handleClick = () => {
    navigate("/freelance-list", {
      state: { category: cat.name }, // 🔥 passing category
    });
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-gray-100 rounded-xl p-4 cursor-pointer hover:border-gray-300 hover:shadow-md transition-all duration-200 break-inside-avoid mb-3"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 ${color.icon}`}
        >
          {cat.icon}
        </div>
        <h3 className="text-sm font-semibold text-gray-900 leading-tight">
          {cat.name}
        </h3>
      </div>
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
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Hero + Search */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
              Find a Freelancer
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Skilled professionals for every creative & technical need
            </p>
            <div className="flex gap-2 max-w-md mx-auto mt-5">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search categories..."
                className="flex-1 border border-gray-200 bg-white text-gray-800 text-sm px-4 py-2 rounded-lg outline-none focus:border-gray-400 placeholder-gray-300 transition"
              />
              <button className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                Search
              </button>
            </div>
          </div>
  
          <p className="text-center text-xs text-gray-300 mb-5">
            <span className="text-gray-800 font-semibold">{filtered.length}</span> categories available
          </p>
  
          {filtered.length > 0 ? (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
             {filtered.map((cat) => (
  <CategoryCard key={cat.name} cat={cat} navigate={navigate} />
))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-300 text-sm">
              No categories found for &quot;{query}&quot;
            </div>
          )}
        </div>
      </div>
    );
  }