import { useState, useEffect, useRef } from "react";

// ── Mock company data (mirrors your Mongoose schema) ─────────────────────────
const DUMMY= {
  companyName: "NexaCore Technologies",
  tagline: "Engineering Tomorrow, Today.",
  about:
    "We are a product-focused technology company building scalable digital infrastructure for the next generation of enterprises. From deep-tech consulting to full-stack product delivery, NexaCore blends engineering rigour with design intelligence.",
  industry: "Information Technology",
  companySize: "51-200",
  foundedYear: 2017,
  businessPark: "Technopark",
  website: "https://nexacore.io",
  logo: "",
  banner: "",
  tags: ["SaaS", "AI/ML", "Cloud", "DevOps", "FinTech"],
  address: {
    building: "Tower C, Floor 9",
    street: "Technopark Phase II",
    city: "Thiruvananthapuram",
    state: "Kerala",
    pincode: "695581",
    country: "India",
  },
  contacts: {
    email: "hello@nexacore.io",
    phone: "+91 98765 43210",
    linkedin: "https://linkedin.com/company/nexacore",
    twitter: "https://twitter.com/nexacore",
    instagram: "https://instagram.com/nexacore",
    github: "https://github.com/nexacore",
  },
  services: [
    { title: "Product Engineering", description: "End-to-end development of web and mobile products with a focus on performance, scalability, and user experience." },
    { title: "AI & Data Intelligence", description: "Machine learning pipelines, predictive analytics, and AI integrations tailored to your business context." },
    { title: "Cloud Infrastructure", description: "AWS, GCP, and Azure architecture design, migration, cost-optimisation, and 24/7 monitoring." },
    { title: "UX Strategy & Design", description: "Research-driven design systems, interaction design, and brand experiences that convert and retain." },
    { title: "DevOps & Automation", description: "CI/CD pipelines, infrastructure-as-code, and release automation that accelerates your velocity." },
    { title: "Tech Consulting", description: "CTO-as-a-service, architecture audits, and technology roadmap planning for scaling startups." },
  ],
  projects: [
    { name: "FinFlow", description: "A real-time B2B payments platform processing ₹200Cr+ monthly for 300+ SMEs across South India.", link: "#" },
    { name: "MediSync", description: "AI-powered patient data platform adopted by 40 hospitals, reducing diagnostic turnaround by 60%.", link: "#" },
    { name: "LogiTrack", description: "End-to-end logistics visibility SaaS with IoT integrations, serving 12 logistics companies.", link: "#" },
  ],
  members: [
    { name: "Arjun Menon", position: "Founder & CEO", image: "", url: "#" },
    { name: "Priya Krishnan", position: "CTO", image: "", url: "#" },
    { name: "Rahul Nair", position: "Head of Design", image: "", url: "#" },
    { name: "Sneha Pillai", position: "VP Engineering", image: "", url: "#" },
  ],
  clients: [
    { name: "Axis Bank", logo: "", website: "#" },
    { name: "KIMS Health", logo: "", website: "#" },
    { name: "Federal Bank", logo: "", website: "#" },
    { name: "UST Global", logo: "", website: "#" },
    { name: "IBS Software", logo: "", website: "#" },
    { name: "Carnival Group", logo: "", website: "#" },
  ],
  gallery: [
    { imageUrl: "", caption: "Annual Tech Summit 2024" },
    { imageUrl: "", caption: "Product Launch – FinFlow 3.0" },
    { imageUrl: "", caption: "Team Offsite, Munnar" },
    { imageUrl: "", caption: "Hackathon Winners" },
  ],
};

// ── Utility ───────────────────────────────────────────────────────────────────
const initials = (name) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const avatarGradients = [
  "from-amber-400 to-orange-600",
  "from-sky-400 to-indigo-600",
  "from-emerald-400 to-teal-600",
  "from-rose-400 to-pink-600",
];

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ company }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  const links = ["About", "Services", "Projects", "Team", "Clients", "Contact"];
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-zinc-950/95 backdrop-blur border-b border-zinc-800 py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-amber-400 rounded-sm flex items-center justify-center">
            <span className="text-zinc-950 font-black text-sm tracking-tighter">NC</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">{company.companyName}</span>
        </a>
        <ul className="hidden md:flex gap-8">
          {links.map((l) => (
            <li key={l}>
              <a
                href={`#${l.toLowerCase()}`}
                className="text-zinc-400 hover:text-amber-400 transition-colors text-sm font-medium tracking-wide uppercase"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-2 bg-amber-400 text-zinc-950 text-sm font-bold px-5 py-2.5 rounded-sm hover:bg-amber-300 transition-colors"
        >
          Get in Touch
        </a>
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-white transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-all ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-zinc-950 border-t border-zinc-800 px-6 py-4 space-y-3">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="block text-zinc-300 hover:text-amber-400 text-sm font-medium py-1"
              onClick={() => setOpen(false)}
            >
              {l}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ company }) {
  return (
    <section className="relative min-h-screen flex items-center bg-zinc-950 overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-sky-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 border border-amber-400/30 bg-amber-400/5 text-amber-400 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              {company.businessPark} · Est. {company.foundedYear}
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tighter mb-6">
              {company.companyName
                .split(" ")
                .map((w, i) => (
                  <span key={i} className={i === 1 ? "text-amber-400" : ""}>
                    {w}{" "}
                  </span>
                ))}
            </h1>
            <p className="text-zinc-400 text-xl leading-relaxed mb-10 max-w-lg font-light">
              {company.about}
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="#services"
                className="bg-amber-400 text-zinc-950 font-bold px-8 py-4 rounded-sm hover:bg-amber-300 transition-all hover:scale-105"
              >
                Explore Services
              </a>
              <a
                href="#projects"
                className="border border-zinc-700 text-zinc-300 font-semibold px-8 py-4 rounded-sm hover:border-amber-400 hover:text-amber-400 transition-all"
              >
                View Work
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              {company.tags.map((t) => (
                <span key={t} className="text-xs text-zinc-500 border border-zinc-800 px-3 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Stats card */}
          <div className="relative">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Founded", value: company.foundedYear },
                  { label: "Team Size", value: company.companySize },
                  { label: "Industry", value: company.industry },
                  { label: "Location", value: company.address.city },
                ].map((s) => (
                  <div key={s.label} className="border border-zinc-800 rounded-xl p-5">
                    <div className="text-zinc-500 text-xs uppercase tracking-widest mb-1">{s.label}</div>
                    <div className="text-white font-bold text-lg">{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-zinc-800 pt-6">
                <div className="text-zinc-500 text-xs uppercase tracking-widest mb-3">Tagline</div>
                <p className="text-amber-400 font-semibold text-lg italic">"{company.tagline}"</p>
              </div>
              <div className="flex gap-3">
                {[
                  { icon: "in", href: company.contacts.linkedin },
                  { icon: "tw", href: company.contacts.twitter },
                  { icon: "ig", href: company.contacts.instagram },
                ].map((s) => (
                  <a
                    key={s.icon}
                    href={s.href}
                    className="w-10 h-10 border border-zinc-700 rounded-lg flex items-center justify-center text-zinc-400 hover:border-amber-400 hover:text-amber-400 transition-all text-xs font-bold uppercase"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
            {/* Decorative */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border border-amber-400/20 rounded-2xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 border border-zinc-700 rounded-xl -z-10" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-zinc-600 to-transparent" />
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About({ company }) {
  return (
    <section id="about" className="bg-zinc-900 py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-16 items-start">
          <div className="lg:col-span-2">
            <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-4">Who We Are</p>
            <h2 className="text-5xl font-black text-white leading-tight tracking-tighter mb-6">
              Built Different.<br />
              <span className="text-zinc-500">Built to Last.</span>
            </h2>
            <div className="w-16 h-1 bg-amber-400 mb-8" />
            <div className="space-y-3">
              {[
                ["Location", `${company.address.building}, ${company.address.city}, ${company.address.state}`],
                ["Business Park", company.businessPark],
                ["Industry", company.industry],
                ["Company Size", company.companySize],
                ["Website", company.website],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-4 text-sm">
                  <span className="text-zinc-500 w-32 shrink-0">{k}</span>
                  <span className="text-zinc-300">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-6">
            <p className="text-zinc-300 text-lg leading-relaxed">{company.about}</p>
            <p className="text-zinc-500 leading-relaxed">
              Headquartered at {company.businessPark} in Kerala's Silicon Valley, we work with startups,
              growth-stage companies, and enterprises across fintech, healthtech, and logistics — bringing
              senior-level engineering talent to every engagement.
            </p>
           
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Services ──────────────────────────────────────────────────────────────────
function Services({ company }) {
  const icons = ["⬡", "◈", "⬢", "◇", "⬟", "◉"];
  return (
    <section id="services" className="bg-zinc-950 py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-4">What We Do</p>
            <h2 className="text-5xl font-black text-white tracking-tighter">
              Our Services
            </h2>
          </div>
          <p className="text-zinc-500 max-w-sm text-sm leading-relaxed">
            From first-principles architecture to scalable delivery — our practice areas cover the full product lifecycle.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800">
          {company.services.map((s, i) => (
            <div
              key={s.title}
              className="bg-zinc-950 p-8 group hover:bg-zinc-900 transition-all duration-300 cursor-pointer"
            >
              <div className="text-3xl text-zinc-700 group-hover:text-amber-400 transition-colors mb-6 font-mono">
                {icons[i]}
              </div>
              <h3 className="text-white font-bold text-xl mb-3 group-hover:text-amber-400 transition-colors">
                {s.title}
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-400 transition-colors">
                {s.description}
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs text-zinc-600 group-hover:text-amber-400 transition-colors font-semibold uppercase tracking-wider">
                Learn More <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────
function Projects({ company }) {
  const colors = ["border-amber-400/40", "border-sky-400/40", "border-emerald-400/40"];
  const accents = ["text-amber-400", "text-sky-400", "text-emerald-400"];
  const bgs = ["bg-amber-400/5", "bg-sky-400/5", "bg-emerald-400/5"];
  return (
    <section id="projects" className="bg-zinc-900 py-28">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-4">Our Work</p>
        <h2 className="text-5xl font-black text-white tracking-tighter mb-16">Featured Projects</h2>

        <div className="space-y-6">
          {company.projects.map((p, i) => (
            <a
              key={p.name}
              href={p.link}
              className={`block border ${colors[i]} ${bgs[i]} rounded-2xl p-8 md:p-10 hover:scale-[1.01] transition-all duration-300 group`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className={`text-xs font-bold tracking-widest uppercase mb-2 ${accents[i]}`}>
                    Project {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-white text-3xl font-black tracking-tight mb-3">{p.name}</h3>
                  <p className="text-zinc-400 max-w-2xl leading-relaxed">{p.description}</p>
                </div>
                <div className={`shrink-0 w-12 h-12 border ${colors[i]} rounded-xl flex items-center justify-center ${accents[i]} text-2xl group-hover:rotate-45 transition-transform duration-300`}>
                  ↗
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Team ──────────────────────────────────────────────────────────────────────
function Team({ company }) {
  return (
    <section id="team" className="bg-zinc-950 py-28">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-4">The People</p>
        <h2 className="text-5xl font-black text-white tracking-tighter mb-16">Leadership Team</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {company.members.map((m, i) => (
            <a
              key={m.name}
              href={m.url}
              className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-amber-400/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatarGradients[i % 4]} flex items-center justify-center text-white font-black text-xl mb-5 group-hover:scale-110 transition-transform`}>
                {initials(m.name)}
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{m.name}</h3>
              <p className="text-zinc-500 text-sm">{m.position}</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-zinc-600 group-hover:text-amber-400 transition-colors font-medium">
                View Profile →
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Clients ───────────────────────────────────────────────────────────────────
function Clients({ company }) {
  return (
    <section id="clients" className="bg-zinc-900 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-4">Trusted By</p>
        <h2 className="text-5xl font-black text-white tracking-tighter">Our Clients</h2>
      </div>
      <div className="flex gap-12 items-center justify-center flex-wrap px-6">
        {company.clients.map((c, i) => (
          <a
            key={c.name}
            href={c.website}
            className="group flex flex-col items-center gap-3"
          >
            <div className="w-20 h-20 bg-zinc-800 border border-zinc-700 rounded-2xl flex items-center justify-center group-hover:border-amber-400/50 group-hover:bg-zinc-750 transition-all">
              <span className="text-zinc-400 group-hover:text-amber-400 font-black text-xs text-center tracking-tight transition-colors px-2">
                {c.name}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ── Gallery ───────────────────────────────────────────────────────────────────
function Gallery({ company }) {
  const placeholderColors = ["bg-zinc-800", "bg-zinc-800", "bg-zinc-800", "bg-zinc-800"];
  return (
    <section id="gallery" className="bg-zinc-950 py-28">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-4">Life at NexaCore</p>
        <h2 className="text-5xl font-black text-white tracking-tighter mb-16">Gallery</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {company.gallery.map((g, i) => (
            <div key={i} className="group relative rounded-2xl overflow-hidden aspect-square">
              {g.imageUrl ? (
                <img src={g.imageUrl} alt={g.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className={`w-full h-full ${placeholderColors[i]} flex items-center justify-center`}>
                  <span className="text-zinc-600 text-xs text-center px-4">{g.caption}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white text-sm font-medium">{g.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact({ company }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="bg-zinc-900 py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-4">Say Hello</p>
            <h2 className="text-5xl font-black text-white tracking-tighter mb-6">
              Let's Build<br />
              <span className="text-zinc-500">Something Great.</span>
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-10">
              Whether you're looking to launch a product, scale engineering, or get a technology audit —
              we'd love to hear from you.
            </p>

            <div className="space-y-5">
              {[
                { icon: "✉", label: "Email", value: company.contacts.email },
                { icon: "✆", label: "Phone", value: company.contacts.phone },
                { icon: "⊕", label: "Location", value: `${company.address.building}, ${company.address.city}, ${company.address.state} ${company.address.pincode}` },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-amber-400 shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <div className="text-zinc-500 text-xs uppercase tracking-wider mb-0.5">{c.label}</div>
                    <div className="text-zinc-300 text-sm">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-10">
              {[
                { label: "LinkedIn", href: company.contacts.linkedin },
                { label: "Twitter", href: company.contacts.twitter },
                { label: "Instagram", href: company.contacts.instagram },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="text-xs text-zinc-500 border border-zinc-700 px-4 py-2 rounded-full hover:border-amber-400 hover:text-amber-400 transition-all"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
            {sent ? (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <div className="text-5xl mb-4">✓</div>
                  <h3 className="text-white text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-zinc-400 text-sm">We'll get back to you within 24 hours.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-zinc-500 text-xs uppercase tracking-wider mb-2">Your Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors placeholder:text-zinc-600"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 text-xs uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors placeholder:text-zinc-600"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 text-xs uppercase tracking-wider mb-2">Message</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors placeholder:text-zinc-600 resize-none"
                    placeholder="Tell us about your project…"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-400 text-zinc-950 font-bold py-4 rounded-xl hover:bg-amber-300 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({ company }) {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-400 rounded-sm flex items-center justify-center">
              <span className="text-zinc-950 font-black text-sm">NC</span>
            </div>
            <span className="text-white font-bold">{company.companyName}</span>
          </div>
          <p className="text-zinc-600 text-sm">
            © {new Date().getFullYear()} {company.companyName}. All rights reserved. · {company.address.city}, India.
          </p>
          <div className="flex gap-6">
            {["Services", "Projects", "Team", "Contact"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-zinc-600 hover:text-amber-400 text-sm transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function Company2({ data}) {
  const companyData = data ||DUMMY;
  return (
    <div className="font-sans antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        h1, h2, h3, h4, nav .font-black { font-family: 'Syne', sans-serif; }
        html { scroll-behavior: smooth; }
      `}</style>
     <Nav company={companyData} />
      <Hero company={companyData} />
      <About company={companyData} />
      <Services company={companyData} />
      <Projects company={companyData} />
      <Team company={companyData} />
      <Clients company={companyData} />
      <Gallery company={companyData} />
      <Contact company={companyData} />
      <Footer company={companyData} />

    </div>
  );
}