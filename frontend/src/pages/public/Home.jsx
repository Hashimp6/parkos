import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobsFreelanceHero from "../../components/Hero";

// ── helpers ──────────────────────────────────────────────────────────────────
const ls = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
const lsj = (key) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } };

// Replace these with your real router navigation calls
const goTo = (type, action) => {
  // e.g. navigate(`/${type}/${action}`)
  alert(`[Navigate] /${type}/${action}`);
};

// ── sub-components ────────────────────────────────────────────────────────────

function Navbar({ hasCandidate, hasCompany, candidateData, companyData }) {
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 h-16 bg-white border-b border-zinc-200">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#d4ff4a] border-2 border-zinc-900 inline-block" />
        <span className="font-black text-lg tracking-tight text-zinc-900" style={{ fontFamily: "'Syne', sans-serif" }}>
          ParkOS
        </span>
      </div>

      {/* Nav right */}
      <div className="flex items-center gap-2">
        {hasCandidate && (
          <button
          onClick={() => navigate("/home")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 text-white text-xs font-bold tracking-wide uppercase hover:bg-zinc-700 transition-colors"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {candidateData?.name ? candidateData.name.split(" ")[0] : "Candidate"} ↗
          </button>
        )}
        {hasCandidate && hasCompany && (
          <div className="w-px h-4 bg-zinc-200" />
        )}
        {hasCompany && (
          <button
          onClick={() => navigate("/company/Home")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#d4ff4a] text-zinc-900 text-xs font-bold tracking-wide uppercase hover:bg-[#c0ef30] transition-colors"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {companyData?.name ?? "Company"} ↗
          </button>
        )}
      </div>
    </nav>
  );
}

function GotoBar({ hasCandidate, hasCompany, candidateData, companyData }) {
  if (!hasCandidate && !hasCompany) return null;
  const navigate = useNavigate();
  return (
    <div className="bg-zinc-50 border-b border-zinc-200 px-6 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <p className="text-sm text-zinc-600">
        {hasCandidate && hasCompany ? (
          <>Welcome back! You have accounts for{" "}
            <strong className="text-zinc-900">{candidateData?.name ?? "Candidate"}</strong> and{" "}
            <strong className="text-zinc-900">{companyData?.name ?? "your company"}</strong>. Where do you want to go?
          </>
        ) : hasCandidate ? (
          <>Welcome back, <strong className="text-zinc-900">{candidateData?.name ?? "there"}</strong>! Ready to continue your job search?</>
        ) : (
          <>Welcome back! <strong className="text-zinc-900">{companyData?.name ?? "Your company"}</strong> has an active account.</>
        )}
      </p>
      <div className="flex gap-2 flex-wrap">
        {hasCandidate && (
          <button
          onClick={() => navigate("/home")}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-bold tracking-wide hover:bg-zinc-700 transition-colors"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Candidate dashboard
          </button>
        )}
        {hasCompany && (
          <button
          onClick={() => navigate("/company/Home")}
            className="px-4 py-2 rounded-lg bg-[#d4ff4a] text-zinc-900 text-xs font-bold tracking-wide hover:bg-[#c0ef30] transition-colors"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Company dashboard
          </button>
        )}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="bg-white border-b border-zinc-200 px-6 md:px-8 py-20 md:py-28 text-center">
      {/* Eyebrow */}
      <div className="inline-flex items-center gap-2 border border-zinc-200 rounded-full px-4 py-1.5 mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff4a] border border-zinc-900 inline-block" />
        <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase" style={{ fontFamily: "'Syne', sans-serif" }}>
          The business park platform
        </span>
      </div>

      {/* Headline */}
      <h1
        className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[1.05] text-zinc-900 max-w-3xl mx-auto mb-6"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Where companies and{" "}
        <em className="not-italic bg-zinc-900 text-[#d4ff4a] px-2 py-0.5 rounded-md">talent</em>{" "}
        meet
      </h1>

      {/* Sub */}
      <p className="text-base text-zinc-400 max-w-md mx-auto mb-12 leading-relaxed">
        ParkOS connects job seekers with the right companies — and helps businesses find the people they need to grow. One platform, two worlds, zero friction.
      </p>

      {/* Stats */}
      <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
        {[
          { n: "12k+", l: "Jobs posted" },
          { n: "4.8k", l: "Companies" },
          { n: "31k", l: "Candidates" },
          { n: "87%", l: "Placement rate" },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-6 sm:gap-10">
            {i > 0 && <div className="hidden sm:block w-px h-9 bg-zinc-200" />}
            <div className="text-center">
              <div className="text-2xl font-black text-zinc-900" style={{ fontFamily: "'Syne', sans-serif" }}>{s.n}</div>
              <div className="text-xs text-zinc-400 uppercase tracking-widest mt-0.5">{s.l}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Create your account", desc: "Sign up as a candidate or a company in under 2 minutes. No lengthy forms." },
    { n: "02", title: "Build your profile", desc: "Candidates showcase skills. Companies list their culture, roles, and team." },
    { n: "03", title: "Connect & apply", desc: "Browse matched jobs or discover vetted candidates. Apply or reach out directly." },
    { n: "04", title: "Get hired or hire", desc: "Track progress, schedule interviews, and close the loop — all in one place." },
  ];

  return (
    <section className="bg-zinc-50 px-6 md:px-8 py-16 md:py-20 border-b border-zinc-200">
      <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase text-center mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
        How it works
      </p>
      <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-zinc-900 text-center mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
        Simple. Fast. Effective.
      </h2>
      <p className="text-sm text-zinc-400 text-center max-w-md mx-auto mb-10 leading-relaxed">
        Whether you're hiring or job hunting, BizPark is built to get you results — not just activity.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-200 border border-zinc-200 rounded-2xl overflow-hidden max-w-4xl mx-auto">
        {steps.map((s) => (
          <div key={s.n} className="bg-white p-6 md:p-8">
            <div className="text-3xl font-black text-zinc-100 mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>{s.n}</div>
            <div className="text-sm font-bold text-zinc-900 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>{s.title}</div>
            <p className="text-xs text-zinc-400 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CandidateSide() {
  const navigate = useNavigate();
  const features = [
    { icon: "✦", text: "Smart job matching by skills & location", sub: "Updated daily from verified companies" },
    { icon: "→", text: "One-click profile apply", sub: "No more filling the same form twice" },
    { icon: "◎", text: "Application tracker dashboard", sub: "See status, feedback, and next steps" },
    { icon: "▲", text: "Salary insights & market benchmarks", sub: "Know your worth before you negotiate" },
  ];

  return (
    <div className="bg-white px-8 md:px-12 py-14 md:py-20">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 border border-zinc-200 rounded-full px-4 py-1.5 mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 inline-block" />
        <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase" style={{ fontFamily: "'Syne', sans-serif" }}>
          For candidates
        </span>
      </div>

      <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-900 leading-tight mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
        Your next role<br />is here.
      </h2>
      <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mb-8">
        Discover jobs that match your skills, experience, and ambitions. Apply with your BizPark profile — no need to send the same CV a hundred times.
      </p>

      {/* Features */}
      <div className="flex flex-col gap-4 mb-8">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-md bg-zinc-100 text-zinc-900 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {f.icon}
            </div>
            <div>
              <div className="text-sm text-zinc-700">{f.text}</div>
              <div className="text-xs text-zinc-400 mt-0.5">{f.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2.5 max-w-xs">
        <button
         onClick={() => navigate("/register")}
          className="w-full py-3 px-5 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors text-center"
        >
          Create candidate account →
        </button>
        <button
          onClick={() => navigate("/login")}
          className="w-full py-3 px-5 rounded-lg border border-zinc-200 text-zinc-900 text-sm font-medium hover:border-zinc-400 transition-colors text-center bg-transparent"
        >
          Sign in to your profile
        </button>
      </div>
    </div>
  );
}

function CompanySide() {
  const navigate = useNavigate();
  const features = [
    { icon: "✦", text: "Post unlimited job listings", sub: "Reach thousands of active candidates" },
    { icon: "→", text: "AI-ranked applicant shortlists", sub: "Save hours on screening" },
    { icon: "◎", text: "Full ATS-style pipeline", sub: "Kanban, notes, and stage tracking" },
    { icon: "▲", text: "Team collaboration tools", sub: "Multiple hiring managers, one view" },
  ];

  return (
    <div className="bg-zinc-900 px-8 md:px-12 py-14 md:py-20">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 border border-zinc-700 bg-zinc-800 rounded-full px-4 py-1.5 mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff4a] inline-block" />
        <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase" style={{ fontFamily: "'Syne', sans-serif" }}>
          For companies
        </span>
      </div>

      <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white leading-tight mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
        Build your<br />
        <span className="text-[#d4ff4a]">dream team</span>.
      </h2>
      <p className="text-sm text-zinc-500 leading-relaxed max-w-sm mb-8">
        Post jobs, manage your hiring pipeline, and connect with pre-screened candidates who are actively looking. Built for fast-moving teams.
      </p>

      {/* Features */}
      <div className="flex flex-col gap-4 mb-8">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-md bg-zinc-800 text-[#d4ff4a] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {f.icon}
            </div>
            <div>
              <div className="text-sm text-zinc-400">{f.text}</div>
              <div className="text-xs text-zinc-600 mt-0.5">{f.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2.5 max-w-xs">
        <button
         onClick={() => navigate("/company/register")}
          className="w-full py-3 px-5 rounded-lg bg-[#d4ff4a] text-zinc-900 text-sm font-bold hover:bg-[#c0ef30] transition-colors text-center"
        >
          Register your company →
        </button>
        <button
                  onClick={() => navigate("/company/login")}
          className="w-full py-3 px-5 rounded-lg border border-zinc-700 text-white text-sm font-medium hover:border-zinc-500 transition-colors text-center bg-transparent"
        >
          Company sign in
        </button>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-zinc-900 px-6 md:px-8 py-8 border-t border-zinc-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#d4ff4a] border-2 border-white inline-block" />
          <span className="font-black text-white text-base" style={{ fontFamily: "'Syne', sans-serif" }}>BizPark</span>
        </div>
        <div className="flex gap-5 flex-wrap">
          {["About", "Blog", "Pricing", "Privacy", "Terms"].map((l) => (
            <a key={l} href="#" className="text-zinc-600 text-xs hover:text-[#d4ff4a] transition-colors">{l}</a>
          ))}
        </div>
      </div>
      <p className="text-zinc-700 text-xs">© 2025 BizPark. The business park platform. All rights reserved.</p>
    </footer>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [auth, setAuth] = useState({ hasCandidate: false, hasCompany: false, candidateData: null, companyData: null });

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Check localStorage
    const hasCandidate = !!(ls("token") && ls("candidate"));
    const hasCompany = !!(ls("companyToken") && ls("company"));
    setAuth({
      hasCandidate,
      hasCompany,
      candidateData: lsj("candidate"),
      companyData: lsj("company"),
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      <Navbar {...auth} />
      <GotoBar {...auth} />
     <JobsFreelanceHero/>
      <HowItWorks />

      {/* Split section */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <CandidateSide />
        <CompanySide />
      </div>

      <Footer />
    </div>
  );
}