import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Truck,
  ShieldCheck,
  Snowflake,
  ShoppingCart,
  MessageCircle,
  Camera,
  PackageCheck,
  Scissors,
} from "lucide-react";

/**
 * Kerala Fresh Meat Ltd (KFM) — Business Info Page
 * -------------------------------------------------
 * Drop this file in as e.g. src/pages/AboutPage.jsx
 *
 * Setup required:
 * 1. npm install lucide-react   (if not already installed)
 * 2. Add these to your public/index.html <head>, or import in index.css:
 *    <link rel="preconnect" href="https://fonts.googleapis.com">
 *    <link href="https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
 * 3. Replace the LOGO_URL, GALLERY placeholders, and phone/email below with real assets as you get them.
 * 4. Add a route, e.g.  <Route path="/about" element={<AboutPage />} />
 */

const LOGO_URL = null; // swap in your PNG path, e.g. "/assets/kfm-logo.png"

const CONTACT = {
  phone: "+44 7438 703938",
  emails: ["keralafreshmeat12@gmail.com", "keralafreshmeat@gmail.com"],
  locations: ["Birmingham", "Northampton"],
  hours: "Open 7 days a week",
};

const MEAT_TYPES = ["Chicken", "Beef", "Mutton", "Fish"];
const CUT_TYPES = ["Whole", "Boneless", "Curry Cut", "Customisable Size & Cutting"];

/**
 * Reference/placeholder photography.
 * All sourced from Unsplash under the Unsplash License (free for commercial
 * use, no attribution required) — https://unsplash.com/license
 * Swap these for KFM's own shop/product/team photos as soon as you have them.
 */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1736517884171-a981a34e78a4?auto=format&fit=crop&w=1600&q=70";

const GALLERY = [
  {
    label: "Product photos",
    credit: "Photo: Georg Eiermann / Unsplash",
    src: "https://images.unsplash.com/photo-1754587489058-b6b710ef78ea?auto=format&fit=crop&w=800&q=70",
  },
  {
    label: "Processing unit",
    credit: "Photo: Natalie Ng / Unsplash",
    src: "https://images.unsplash.com/photo-1470297045518-35eb4bf6c00e?auto=format&fit=crop&w=800&q=70",
  },
  {
    label: "Shop front",
    credit: "Photo: hayato togashi / Unsplash",
    src: "https://images.unsplash.com/photo-1736517884171-a981a34e78a4?auto=format&fit=crop&w=800&q=70",
  },
  {
    label: "Our team",
    credit: "Photo: Jeff Tumale / Unsplash",
    src: "https://images.unsplash.com/photo-1575804427637-3f4f51fd8b55?auto=format&fit=crop&w=800&q=70",
  },
];

/* ---------- Signature element: rotating "freshness stamp" badge ---------- */
function FreshnessStamp({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-label="KFM Halal & Freshness Guarantee stamp"
    >
      <defs>
        <path
          id="stampCircle"
          d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
        />
      </defs>
      <circle cx="100" cy="100" r="94" fill="none" stroke="#8A0000" strokeWidth="2" opacity="0.6" />
      <circle cx="100" cy="100" r="72" fill="none" stroke="#8A0000" strokeWidth="3" />
      <text fill="#8A0000" fontSize="12.5" letterSpacing="2.5" fontFamily="'JetBrains Mono', monospace">
        <textPath href="#stampCircle" startOffset="2%">
          HALAL CERTIFIED • FRESH & FROZEN • KFM •
        </textPath>
      </text>
      <text
        x="100"
        y="94"
        textAnchor="middle"
        fill="#8A0000"
        fontSize="26"
        fontWeight="700"
        fontFamily="'Zilla Slab', serif"
      >
        KFM
      </text>
      <text
        x="100"
        y="118"
        textAnchor="middle"
        fill="#8A0000"
        fontSize="10.5"
        letterSpacing="1.5"
        fontFamily="'JetBrains Mono', monospace"
      >
        GUARANTEE
      </text>
    </svg>
  );
}

/* ---------- Ticket card: scalloped tear-edge card used throughout ---------- */
function TicketCard({ children, className = "" }) {
  return (
    <div className={`kfm-ticket relative bg-[#FFFFFF] shadow-sm ${className}`}>
      <div className="kfm-ticket-edge" aria-hidden="true" />
      <div className="relative px-5 sm:px-6 pt-7 sm:pt-8 pb-5 sm:pb-6">{children}</div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="kfm-page bg-[#FFFFFF] text-[#0D0D0D] min-h-screen">
      <style>{`
        .kfm-page { font-family: 'Inter', system-ui, sans-serif; }
        .kfm-display { font-family: 'Zilla Slab', serif; }
        .kfm-mono { font-family: 'JetBrains Mono', monospace; }
        .kfm-ticket {
          border: 1px solid rgba(13,13,13,0.12);
          border-bottom: 3px solid #8A0000;
        }
        .kfm-ticket-edge {
          position: absolute;
          top: -1px;
          left: 0;
          right: 0;
          height: 16px;
          background-image: radial-gradient(circle at 8px 0px, transparent 8px, #FFFFFF 8.5px);
          background-size: 16px 16px;
          background-repeat: repeat-x;
          background-position: top;
        }
        @media (min-width: 768px) {
          .kfm-ticket-edge { background-image: radial-gradient(circle at 8px 0px, transparent 8px, #FFFFFF 8.5px); }
        }
      `}</style>

      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden bg-[#0D0D0D] text-[#FFFFFF]">
        <img
          src={HERO_IMAGE}
          alt=""
          aria-hidden="true"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D] via-[#0D0D0D]/85 to-[#0D0D0D]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16 md:py-24 flex flex-col md:flex-row items-center gap-8 md:gap-10">
          <div className="flex-1 text-center md:text-left">
            <p className="kfm-mono text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] text-[#E14545] mb-4">
              WHOLESALE &amp; RETAIL · PREORDER ONLY
            </p>
            {LOGO_URL ? (
              <img
                src={LOGO_URL}
                alt="Kerala Fresh Meat Ltd logo"
                className="h-14 sm:h-16 mb-6 mx-auto md:mx-0"
              />
            ) : (
              <div className="kfm-display text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 tracking-tight">
                Kerala Fresh Meat
                <span className="text-[#E14545]"> Ltd</span>
              </div>
            )}
            <h1 className="kfm-display text-3xl sm:text-4xl md:text-6xl font-semibold leading-[1.1] md:leading-[1.05] mb-6">
              Halal meat, cut fresh
              <br className="hidden sm:block" /> to your order.
            </h1>
            <p className="text-[#FFFFFF]/70 text-base sm:text-lg max-w-md mx-auto md:mx-0 mb-8">
              Fresh and frozen chicken, beef, mutton and fish — whole, boneless
              or curry cut, packed exactly the way you need it.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center md:justify-start gap-3">
              <a
                href={`https://wa.me/${CONTACT.phone.replace(/[^\d]/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-[#8A0000] hover:bg-[#A50000] transition-colors px-5 py-3 kfm-mono text-sm tracking-wide"
              >
                <MessageCircle size={16} /> Order on WhatsApp
              </a>
              <a
                href="#order"
                className="inline-flex items-center justify-center gap-2 border border-[#FFFFFF]/30 hover:border-[#E14545] transition-colors px-5 py-3 kfm-mono text-sm tracking-wide"
              >
                <ShoppingCart size={16} /> Preorder online
              </a>
            </div>
          </div>
          <div className="flex-shrink-0">
            <FreshnessStamp className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56" />
          </div>
        </div>
      </section>

      {/* ---------- QUICK INFO BAR ---------- */}
      <section className="bg-[#8A0000] text-[#FFFFFF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap gap-x-6 gap-y-2 sm:gap-x-8 justify-center kfm-mono text-[11px] sm:text-xs tracking-wide text-center">
          <span className="inline-flex items-center gap-2">
            <Clock size={14} /> {CONTACT.hours}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin size={14} /> {CONTACT.locations.join(" · ")}
          </span>
          <span className="inline-flex items-center gap-2">
            <Phone size={14} /> {CONTACT.phone}
          </span>
        </div>
      </section>

      {/* ---------- PRODUCT INFORMATION ---------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="mb-10 sm:mb-12 max-w-xl">
          <p className="kfm-mono text-xs tracking-[0.3em] text-[#8A0000] mb-3">
            WHAT WE STOCK
          </p>
          <h2 className="kfm-display text-2xl sm:text-3xl md:text-4xl font-semibold">
            Product information
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 mb-6">
          <TicketCard>
            <div className="flex items-center gap-2 mb-4 text-[#8A0000]">
              <Scissors size={18} />
              <span className="kfm-mono text-xs tracking-widest">MEAT TYPES</span>
            </div>
            <ul className="grid grid-cols-2 gap-3">
              {MEAT_TYPES.map((item) => (
                <li
                  key={item}
                  className="kfm-display text-base sm:text-lg border-b border-dashed border-[#0D0D0D]/15 pb-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          </TicketCard>

          <TicketCard>
            <div className="flex items-center gap-2 mb-4 text-[#8A0000]">
              <PackageCheck size={18} />
              <span className="kfm-mono text-xs tracking-widest">CUT TYPES</span>
            </div>
            <ul className="space-y-2">
              {CUT_TYPES.map((item) => (
                <li key={item} className="flex items-center gap-2 kfm-display text-base sm:text-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A0000] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </TicketCard>
        </div>

        <TicketCard>
          <div className="flex items-center gap-2 mb-3 text-[#8A0000]">
            <Snowflake size={18} />
            <span className="kfm-mono text-xs tracking-widest">FRESH &amp; FROZEN</span>
          </div>
          <p className="text-[#0D0D0D]/75 max-w-2xl">
            Every product is available fresh or frozen depending on what you
            need — same quality, same cut, your choice on the day.
          </p>
        </TicketCard>
      </section>

      {/* ---------- ORDERING & DELIVERY ---------- */}
      <section id="order" className="bg-[#FFFFFF] border-y-2 border-[#0D0D0D]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="mb-10 sm:mb-12 max-w-xl">
            <p className="kfm-mono text-xs tracking-[0.3em] text-[#8A0000] mb-3">
              HOW IT WORKS
            </p>
            <h2 className="kfm-display text-2xl sm:text-3xl md:text-4xl font-semibold">
              Ordering &amp; delivery
            </h2>
            <p className="text-[#0D0D0D]/70 mt-4">
              Wholesale and retail, preorder only — no walk-in stock, so every
              order is cut fresh for you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            <TicketCard>
              <MessageCircle size={20} className="text-[#8A0000] mb-4" />
              <h3 className="kfm-display text-xl font-semibold mb-2">WhatsApp</h3>
              <p className="text-sm text-[#0D0D0D]/70 mb-4">
                Message your order directly and confirm your cut and size.
              </p>
              <a
                href={`https://wa.me/${CONTACT.phone.replace(/[^\d]/g, "")}`}
                className="kfm-mono text-xs tracking-wide text-[#8A0000] underline"
              >
                {CONTACT.phone}
              </a>
            </TicketCard>

            <TicketCard>
              <Phone size={20} className="text-[#8A0000] mb-4" />
              <h3 className="kfm-display text-xl font-semibold mb-2">Call</h3>
              <p className="text-sm text-[#0D0D0D]/70 mb-4">
                Speak to us directly for wholesale quantities or custom
                requests.
              </p>
              <a
                href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                className="kfm-mono text-xs tracking-wide text-[#8A0000] underline"
              >
                {CONTACT.phone}
              </a>
            </TicketCard>

            <TicketCard>
              <ShoppingCart size={20} className="text-[#8A0000] mb-4" />
              <h3 className="kfm-display text-xl font-semibold mb-2">
                Website cart
              </h3>
              <p className="text-sm text-[#0D0D0D]/70 mb-4">
                Browse products and preorder online for pickup or delivery.
              </p>
              <a href="/shop" className="kfm-mono text-xs tracking-wide text-[#8A0000] underline">
                Go to shop →
              </a>
            </TicketCard>
          </div>
        </div>
      </section>

      {/* ---------- QUALITY & TRUST ---------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="md:w-1/3 text-center md:text-left">
            <p className="kfm-mono text-xs tracking-[0.3em] text-[#8A0000] mb-3">
              WHY TRUST KFM
            </p>
            <h2 className="kfm-display text-2xl sm:text-3xl md:text-4xl font-semibold mb-6">
              Quality &amp; trust
            </h2>
            <FreshnessStamp className="w-40 h-40 hidden md:block" />
          </div>

          <div className="md:w-2/3 grid sm:grid-cols-2 gap-5 sm:gap-6">
            <TicketCard>
              <ShieldCheck size={18} className="text-[#8A0000] mb-3" />
              <h3 className="kfm-display text-lg font-semibold mb-1">
                Halal certified
              </h3>
              <p className="text-sm text-[#0D0D0D]/70">
                All meat and chicken is halal, sourced and processed to halal
                standards.
              </p>
            </TicketCard>

            <TicketCard>
              <PackageCheck size={18} className="text-[#8A0000] mb-3" />
              <h3 className="kfm-display text-lg font-semibold mb-1">
                Customisable packing
              </h3>
              <p className="text-sm text-[#0D0D0D]/70">
                Choose your cut, your size, and your packing — including
                vacuum-packed fish and meat.
              </p>
            </TicketCard>

            <TicketCard>
              <Snowflake size={18} className="text-[#8A0000] mb-3" />
              <h3 className="kfm-display text-lg font-semibold mb-1">
                Hygiene practices
              </h3>
              <p className="text-sm text-[#0D0D0D]/70">
                Handled and processed under strict hygiene standards from
                intake to packing.
              </p>
            </TicketCard>

            <TicketCard>
              <ShieldCheck size={18} className="text-[#8A0000] mb-3" />
              <h3 className="kfm-display text-lg font-semibold mb-1">
                Freshness guarantee
              </h3>
              <p className="text-sm text-[#0D0D0D]/70">
                Not happy with the freshness of your order? We'll make it
                right — ask us about our return policy.
              </p>
            </TicketCard>
          </div>
        </div>
      </section>

      {/* ---------- MEDIA / GALLERY ---------- */}
      <section className="bg-[#0D0D0D] text-[#FFFFFF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="mb-10 sm:mb-12 max-w-xl">
            <p className="kfm-mono text-xs tracking-[0.3em] text-[#E14545] mb-3">
              SEE FOR YOURSELF
            </p>
            <h2 className="kfm-display text-2xl sm:text-3xl md:text-4xl font-semibold mb-3">
              Our shop &amp; products
            </h2>
            <p className="text-[#FFFFFF]/50 text-sm kfm-mono flex items-center gap-2">
              <Camera size={14} /> Reference photos shown — swap in your own
              anytime.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {GALLERY.map((item) => (
              <figure key={item.label} className="relative aspect-square overflow-hidden group">
                <img
                  src={item.src}
                  alt={item.label}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/90 via-transparent to-transparent" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                  <span className="kfm-mono text-[10px] sm:text-xs tracking-wide text-[#FFFFFF]">
                    {item.label}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CONTACT ---------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          <TicketCard>
            <Phone size={18} className="text-[#8A0000] mb-3" />
            <h3 className="kfm-display text-lg font-semibold mb-1">Call or WhatsApp</h3>
            <p className="kfm-mono text-sm">{CONTACT.phone}</p>
          </TicketCard>
          <TicketCard>
            <Mail size={18} className="text-[#8A0000] mb-3" />
            <h3 className="kfm-display text-lg font-semibold mb-1">Email</h3>
            {CONTACT.emails.map((e) => (
              <p key={e} className="kfm-mono text-sm break-all">
                {e}
              </p>
            ))}
          </TicketCard>
          <TicketCard className="sm:col-span-2 md:col-span-1">
            <MapPin size={18} className="text-[#8A0000] mb-3" />
            <h3 className="kfm-display text-lg font-semibold mb-1">Locations</h3>
            <p className="kfm-mono text-sm">{CONTACT.locations.join(" · ")}</p>
            <p className="kfm-mono text-xs text-[#0D0D0D]/60 mt-2 flex items-center gap-1">
              <Truck size={12} /> {CONTACT.hours}
            </p>
          </TicketCard>
        </div>

        <p className="kfm-mono text-[10px] text-[#0D0D0D]/40 mt-8 text-center">
          Gallery reference photos via Unsplash (free-to-use license) —
          {GALLERY.map((g, i) => (
            <span key={g.label}>
              {" "}
              {g.credit}
              {i < GALLERY.length - 1 ? "," : "."}
            </span>
          ))}
        </p>
      </section>
    </div>
  );
}