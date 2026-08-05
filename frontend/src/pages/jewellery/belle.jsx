import React, { useState, useEffect } from "react";
import { Search, User, ShoppingBag, Instagram, ArrowRight } from "lucide-react";

const COLORS = {
  bg: "#0D262B",
  bgAlt: "#123138",
  bgDeep: "#081A1E",
  gold: "#C9A876",
  goldBright: "#EAD3A0",
  goldDim: "#8C744F",
  rose: "#C98A82",
  cream: "#F3ECE1",
  creamDim: "rgba(243,236,225,0.62)",
  line: "rgba(201,168,118,0.28)",
};

const IMAGES = {
  hero: "https://img.magnific.com/free-photo/elegant-indian-bride-adorning-herself-with-jewelry_23-2151996280.jpg?semt=ais_test_b&w=740&q=80",
  earrings: "https://images.unsplash.com/photo-1680968921717-4abbbe793bb3?w=700&q=80&auto=format&fit=crop",
  necklace: "https://images.unsplash.com/photo-1585711715631-1e6bf224f092?w=700&q=80&auto=format&fit=crop",
  rings: "https://images.unsplash.com/photo-1654521883301-070279dd0ae1?w=700&q=80&auto=format&fit=crop",
  bracelet: "https://images.unsplash.com/photo-1567567557645-8450247d194a?w=700&q=80&auto=format&fit=crop",
  story: "https://images.unsplash.com/photo-1567567557645-8450247d194a?w=900&q=80&auto=format&fit=crop",
  promo: "https://images.unsplash.com/photo-1585711715631-1e6bf224f092?w=900&q=80&auto=format&fit=crop",
};

const facetTR = { clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)" };
const facetBoth = {
  clipPath:
    "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))",
};
const facetBtn = {
  clipPath:
    "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
};

const collections = [
  { name: "Statement Hoops", cat: "Earrings", price: "₹1,290", old: "₹1,890", img: IMAGES.earrings },
  { name: "Layered Chain Set", cat: "Necklace", price: "₹2,150", old: "₹2,990", img: IMAGES.necklace },
  { name: "Stackable Bands", cat: "Rings", price: "₹890", old: "₹1,290", img: IMAGES.rings },
  { name: "Charm Cuff", cat: "Bracelet", price: "₹1,590", old: "₹2,190", img: IMAGES.bracelet },
];

const whyItems = [
  { title: "Skin-Safe Plating", body: "Nickel-free, hypoallergenic finishes made for daily wear, even on sensitive skin." },
  { title: "Curated Micro-Edits", body: "Small monthly drops instead of endless catalogues — every piece earns its place." },
  { title: "Tarnish-Resistant", body: "Layered gold-tone plating built to hold its shine through heat and humidity." },
  { title: "7-Day Easy Exchange", body: "Didn't catch the light the way you hoped? Swap it, no questions asked." },
];

function FacetIcon({ size = 22, color = COLORS.gold }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <polygon points="12,2 22,9 12,22 2,9" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}

export default function BelleLusture() {
  const [scrolled, setScrolled] = useState(false);
  const [activeCat, setActiveCat] = useState("Rings");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const marqueeItems = [
    "Hypoallergenic & Nickel-Free",
    "18K Gold-Plated Brass",
    "Free Shipping Across India",
    "7-Day Easy Exchange",
  ];

  return (
    <div style={{ background: COLORS.bg, color: COLORS.cream, fontFamily: "'Jost', sans-serif", fontWeight: 300 }} className="min-h-screen w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Jost:wght@300;400;500;600&display=swap');
        .bl-serif { font-family: 'Fraunces', serif; }
        .bl-shine { animation: bl-shine 5s ease-in-out infinite; }
        @keyframes bl-shine { 0%,100% { opacity: 0.25; } 50% { opacity: 0.8; } }
        .bl-marquee-track { animation: bl-scroll 24s linear infinite; }
        @keyframes bl-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .bl-card:hover .bl-shimmer { left: 130%; }
        .bl-shimmer { position:absolute; top:-50%; left:-30%; width:50%; height:220%; background:linear-gradient(120deg, transparent, rgba(255,255,255,0.22), transparent); transform:rotate(20deg); transition:left 0.9s ease; }
      `}</style>

      {/* NAV */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(13,38,43,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          borderBottom: scrolled ? `1px solid ${COLORS.line}` : "1px solid transparent",
          padding: scrolled ? "14px 0" : "24px 0",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="bl-serif flex items-center gap-2 text-lg tracking-wide" style={{ color: COLORS.cream }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2 L20 9 L12 22 L4 9 Z" stroke={COLORS.gold} strokeWidth="1.3" />
            </svg>
            Belle Lusture
          </a>
          <nav className="hidden md:flex gap-10 text-xs uppercase tracking-widest" style={{ color: COLORS.creamDim }}>
            <a href="#collections" className="hover:text-white transition-colors">Collections</a>
            <a href="#categories" className="hover:text-white transition-colors">Categories</a>
            <a href="#story" className="hover:text-white transition-colors">Our Story</a>
            <a href="#why" className="hover:text-white transition-colors">Why Us</a>
          </nav>
          <div className="flex items-center gap-5">
            <Search size={18} style={{ color: COLORS.creamDim }} />
            <User size={18} style={{ color: COLORS.creamDim }} />
            <ShoppingBag size={18} style={{ color: COLORS.creamDim }} />
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 45% at 85% 15%, rgba(201,168,118,0.14), transparent 60%), radial-gradient(ellipse 50% 40% at 10% 90%, rgba(201,138,130,0.10), transparent 60%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative">
          <div>
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: COLORS.gold, letterSpacing: "0.3em" }}>
              Fashion Jewellery · New Edit
            </span>
            <h1 className="bl-serif mt-5 text-4xl md:text-6xl leading-tight" style={{ maxWidth: "11ch" }}>
              Every facet <em style={{ fontStyle: "italic", fontWeight: 400 }}>catches the light</em>
            </h1>
            <p className="mt-6 text-base leading-relaxed" style={{ color: COLORS.creamDim, maxWidth: "42ch" }}>
              Belle Lusture designs gold-toned, everyday-fine jewellery — hypoallergenic, tarnish-resistant, and cut to feel like an heirloom without the price of one.
            </p>
            <div className="flex gap-4 mt-9 flex-wrap">
              <a
                href="#collections"
                className="px-8 py-4 text-xs uppercase tracking-widest font-semibold transition-transform hover:-translate-y-0.5"
                style={{ ...facetBtn, background: `linear-gradient(120deg, ${COLORS.gold}, ${COLORS.goldBright}, ${COLORS.gold})`, color: COLORS.bgDeep }}
              >
                Shop the Edit
              </a>
              <a
                href="#story"
                className="px-7 py-4 text-xs uppercase tracking-widest border transition-colors"
                style={{ ...facetBtn, borderColor: COLORS.line, color: COLORS.creamDim }}
              >
                Our Story
              </a>
            </div>
          </div>
          <div className="relative h-80 md:h-[440px] order-first md:order-last">
            <img
              src={IMAGES.hero}
              alt="Model wearing a gold-tone necklace"
              className="w-full h-full object-cover"
              style={facetBoth}
            />
            <div
              className="absolute -bottom-4 -left-4 px-4 py-2 text-xs uppercase tracking-widest font-semibold"
              style={{ background: COLORS.goldBright, color: COLORS.bgDeep, ...facetBtn }}
            >
              New In
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ borderTop: `1px solid ${COLORS.line}`, borderBottom: `1px solid ${COLORS.line}` }} className="py-4 overflow-hidden whitespace-nowrap">
        <div className="bl-marquee-track inline-flex">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="text-xs uppercase tracking-widest px-8 inline-flex items-center gap-8" style={{ color: COLORS.creamDim }}>
              {item} <span style={{ color: COLORS.gold, fontSize: "0.6rem" }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* COLLECTIONS */}
      <section className="py-24" id="collections">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: COLORS.gold, letterSpacing: "0.3em" }}>
              Jewellery Collections
            </span>
            <h2 className="bl-serif mt-4 text-3xl md:text-4xl">
              Pieces built around <em style={{ fontStyle: "italic", fontWeight: 400 }}>how you actually get dressed</em>
            </h2>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: COLORS.creamDim }}>
              Four everyday edits — mix, layer, and stack them the way you would the real thing.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {collections.map((item) => (
              <div
                key={item.name}
                className="bl-card overflow-hidden transition-transform duration-300 hover:-translate-y-2"
                style={{ background: COLORS.bgAlt, border: `1px solid ${COLORS.line}`, ...facetTR }}
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  <div className="bl-shimmer" />
                </div>
                <div className="p-5">
                  <span className="text-xs uppercase tracking-widest" style={{ color: COLORS.goldDim }}>{item.cat}</span>
                  <h3 className="bl-serif mt-2 text-lg">{item.name}</h3>
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="font-medium" style={{ color: COLORS.goldBright }}>{item.price}</span>
                    <span className="text-sm line-through" style={{ color: COLORS.creamDim }}>{item.old}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24" id="categories">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: COLORS.gold, letterSpacing: "0.3em" }}>
              Shop by Category
            </span>
            <h2 className="bl-serif mt-4 text-3xl md:text-4xl">
              Find your <em style={{ fontStyle: "italic", fontWeight: 400 }}>everyday piece</em>
            </h2>
          </div>
          <div className="grid md:grid-cols-[0.6fr_1.4fr] gap-8 items-stretch">
            <div className="flex flex-col gap-3 justify-center">
              {["Rings", "Bracelets", "Earrings", "Necklaces"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className="text-left px-6 py-5 flex justify-between items-center transition-all"
                  style={{
                    border: `1px solid ${activeCat === cat ? COLORS.gold : COLORS.line}`,
                    background: activeCat === cat ? COLORS.bgAlt : "transparent",
                    color: activeCat === cat ? COLORS.cream : COLORS.creamDim,
                    ...facetBtn,
                  }}
                >
                  {cat} <span style={{ color: COLORS.gold }}>→</span>
                </button>
              ))}
            </div>
            <div
              className="relative min-h-[380px] flex items-end p-10 overflow-hidden"
              style={{
                border: `1px solid ${COLORS.line}`,
                background: `linear-gradient(160deg, #1c3d3f 0%, ${COLORS.bg} 60%, ${COLORS.bgDeep} 100%)`,
                ...facetBoth,
              }}
            >
              <img src={IMAGES.story} alt={activeCat} className="absolute inset-0 w-full h-full object-cover opacity-70" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(8,26,30,0.9), rgba(8,26,30,0.1))" }} />
              <span
                className="absolute top-8 right-8 text-xs uppercase tracking-widest font-semibold px-4 py-2"
                style={{ background: COLORS.goldBright, color: COLORS.bgDeep, ...facetBtn }}
              >
                New In
              </span>
              <div className="relative">
                <h3 className="bl-serif text-2xl" style={{ maxWidth: "9ch" }}>Be Bold, Be Bright</h3>
                <p className="mt-3 text-sm" style={{ color: COLORS.creamDim, maxWidth: "32ch" }}>
                  Chunky bangles and stacked cuffs, plated to hold their shine through everyday wear.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROMO */}
      <section
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(115deg, #16302f 0%, ${COLORS.bg} 55%, #0a1c20 100%)`, borderTop: `1px solid ${COLORS.line}`, borderBottom: `1px solid ${COLORS.line}` }}
        id="story"
      >
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center py-20">
          <div>
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: COLORS.gold, letterSpacing: "0.3em" }}>
              Festive Edit
            </span>
            <h2 className="bl-serif mt-4 text-3xl md:text-5xl leading-tight">
              Gold-tone necklaces at up to{" "}
              <em style={{ fontStyle: "italic", fontWeight: 400, color: COLORS.goldBright }}>40% off</em>
            </h2>
            <p className="mt-5 text-sm leading-relaxed" style={{ color: COLORS.creamDim, maxWidth: "36ch" }}>
              Our best-selling chain sets, restocked for the season — hypoallergenic plating built for daily wear, not just special occasions.
            </p>
            <a
              href="#collections"
              className="inline-block mt-8 px-8 py-4 text-xs uppercase tracking-widest font-semibold"
              style={{ ...facetBtn, background: `linear-gradient(120deg, ${COLORS.gold}, ${COLORS.goldBright}, ${COLORS.gold})`, color: COLORS.bgDeep }}
            >
              Shop Necklaces
            </a>
          </div>
          <div className="flex justify-center">
            <img src={IMAGES.promo} alt="Gold necklace" className="w-full max-w-sm h-72 object-cover" style={facetBoth} />
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24" id="why">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: COLORS.gold, letterSpacing: "0.3em" }}>
              Why Belle Lusture
            </span>
            <h2 className="bl-serif mt-4 text-3xl md:text-4xl">
              Fine jewellery <em style={{ fontStyle: "italic", fontWeight: 400 }}>codes</em>, fashion prices
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4" style={{ background: COLORS.line, gap: "1px", border: `1px solid ${COLORS.line}` }}>
            {whyItems.map((item) => (
              <div key={item.title} className="p-9 text-left" style={{ background: COLORS.bg }}>
                <FacetIcon />
                <h4 className="bl-serif mt-5 text-base">{item.title}</h4>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: COLORS.creamDim }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: COLORS.bgDeep, borderTop: `1px solid ${COLORS.line}` }} className="pt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 pb-16" style={{ borderBottom: `1px solid ${COLORS.line}` }}>
            <div>
              <a href="#" className="bl-serif flex items-center gap-2 text-lg mb-4" style={{ color: COLORS.cream }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2 L20 9 L12 22 L4 9 Z" stroke={COLORS.gold} strokeWidth="1.3" />
                </svg>
                Belle Lusture
              </a>
              <p className="text-sm leading-relaxed" style={{ color: COLORS.creamDim, maxWidth: "32ch" }}>
                Gold-toned fashion jewellery, designed for everyday shine — made in India, worn everywhere.
              </p>
            </div>
            <div>
              <h5 className="text-xs uppercase tracking-widest mb-5" style={{ color: COLORS.goldDim, letterSpacing: "0.2em" }}>Shop</h5>
              <ul className="flex flex-col gap-3 text-sm" style={{ color: COLORS.creamDim }}>
                <li>Earrings</li><li>Necklaces</li><li>Rings</li><li>Bracelets</li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs uppercase tracking-widest mb-5" style={{ color: COLORS.goldDim, letterSpacing: "0.2em" }}>Company</h5>
              <ul className="flex flex-col gap-3 text-sm" style={{ color: COLORS.creamDim }}>
                <li>Our Story</li><li>Care Guide</li><li>Contact</li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs uppercase tracking-widest mb-3" style={{ color: COLORS.goldDim, letterSpacing: "0.2em" }}>Stay in the light</h5>
              <p className="text-sm mb-3" style={{ color: COLORS.creamDim }}>New edits &amp; early access, once a month.</p>
              <div className="flex" style={{ border: `1px solid ${COLORS.line}`, ...facetBtn }}>
                <input placeholder="Your email" className="flex-1 bg-transparent px-4 py-3 text-sm outline-none" style={{ color: COLORS.cream }} />
                <button
                  onClick={() => setJoined(true)}
                  className="px-5 py-3 text-xs uppercase tracking-widest font-semibold"
                  style={{ background: COLORS.gold, color: COLORS.bgDeep }}
                >
                  {joined ? "Joined!" : "Join"}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center py-6 text-sm flex-wrap gap-3" style={{ color: COLORS.creamDim }}>
            <span>© 2026 Belle Lusture. All rights reserved.</span>
            <Instagram size={16} />
          </div>
        </div>
      </footer>
    </div>
  );
}