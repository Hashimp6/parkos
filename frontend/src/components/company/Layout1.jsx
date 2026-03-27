import { useState, useEffect } from "react";

const FONT_LINK = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap";

const DUMMY = {
  companyName: "Nexora Technologies",
  tagline: "We engineer intelligent systems that scale with your ambition.",
  industry: "Software & AI",
  companySize: "51–200",
  foundedYear: 2017,
  about: "Nexora is a product-first technology company headquartered in Technopark, Kerala. We build enterprise-grade software, AI integrations, and cloud-native platforms that help organisations move faster without compromising reliability. Our teams combine deep engineering expertise with sharp product thinking to ship solutions that last.",
  logo: "", banner: "",
  businessPark: "Technopark",
  address: { building: "Tower B, Floor 7", street: "Rajiv Gandhi IT Park", city: "Thiruvananthapuram", state: "Kerala", pincode: "695581", country: "India" },
  website: "https://nexora.io",
  tags: ["AI", "SaaS", "Enterprise", "Cloud", "DevOps"],
  contacts: { email: "hello@nexora.io", phone: "+91 98765 43210", linkedin: "https://linkedin.com", twitter: "https://twitter.com", instagram: "https://instagram.com", facebook: "", youtube: "", whatsapp: "+91 98765 43210" },
  members: [
    { name: "Arjun Menon", position: "CEO & Co-founder", image: "", url: "" },
    { name: "Priya Nair", position: "Chief Technology Officer", image: "", url: "" },
    { name: "Rohit Das", position: "Head of Design", image: "", url: "" },
    { name: "Sneha Pillai", position: "Lead Engineer", image: "", url: "" },
    { name: "Kiran Raj", position: "VP Sales", image: "", url: "" },
    { name: "Divya Mohan", position: "Product Manager", image: "", url: "" },
  ],
  services: [
    { title: "AI & Machine Learning", description: "Embed intelligent automation and predictive analytics into your product with our production-ready AI APIs and fine-tuned models." },
    { title: "Cloud Architecture", description: "Design and deploy resilient, cost-efficient cloud infrastructure on AWS, Azure, and GCP — built to handle millions of users." },
    { title: "Product Engineering", description: "End-to-end product development from ideation through launch, with embedded QA, DevOps, and iterative delivery." },
    { title: "Data & Analytics", description: "Real-time dashboards, data pipelines, and BI solutions that turn raw data into decisions your leadership can act on." },
    { title: "Enterprise Integration", description: "Seamless ERP, CRM, and third-party system integrations that eliminate data silos and unlock operational efficiency." },
    { title: "UX & Design Systems", description: "Component libraries and design systems built for consistency — from wireframe to pixel-perfect production UI." },
  ],
  projects: [
    { name: "OrbitCMS", description: "A headless CMS powering 200+ enterprise websites globally with real-time collaborative editing and multi-tenant architecture.", link: "" },
    { name: "FluxOps", description: "DevOps automation platform that reduced average deployment cycles by 60% for mid-market engineering teams.", link: "" },
    { name: "AuraAI", description: "Conversational AI layer purpose-built for fintech customer support, processing 50,000+ interactions per day.", link: "" },
    { name: "FieldSync", description: "Mobile-first field operations management tool deployed across 400+ retail locations in South Asia.", link: "" },
  ],
  clients: [
    { name: "Infosys", logo: "", website: "" },
    { name: "UST Global", logo: "", website: "" },
    { name: "Tata Elxsi", logo: "", website: "" },
    { name: "IBS Group", logo: "", website: "" },
    { name: "Ernst & Young", logo: "", website: "" },
    { name: "KPMG", logo: "", website: "" },
    { name: "Muthoot Finance", logo: "", website: "" },
    { name: "Federal Bank", logo: "", website: "" },
  ],
  gallery: [
    { imageUrl: "", caption: "Team offsite 2024" },
    { imageUrl: "", caption: "Product launch event" },
    { imageUrl: "", caption: "Hackathon winners" },
    { imageUrl: "", caption: "Annual celebration" },
    { imageUrl: "", caption: "Engineering workshop" },
    { imageUrl: "", caption: "Leadership summit" },
  ],
};

const has = (v) => {
  if (v === null || v === undefined) return false;
  if (typeof v === "string") return v.trim() !== "";
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") return Object.values(v).some(has);
  return true;
};

const merge = (real, fallback) => {
  if (!real) return fallback;
  const out = { ...fallback };
  Object.keys(real).forEach((k) => { if (has(real[k])) out[k] = real[k]; });
  return out;
};

const initials = (n = "") =>
    String(n)
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join("");
const AVATARBG = ["#1B4332","#1B3A4B","#3D0C11","#2C2C54","#4A1942","#1A3C5E","#3B1F00","#0B3D2E"];
const avBg = (name = "") => AVATARBG[name.charCodeAt(0) % AVATARBG.length];

const Ico = {
  email: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  phone: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6.07 6.07l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  pin: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  globe: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  arrow: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  extlink: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  menu: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  linkedin: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  twitter: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  instagram: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>,
  facebook: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  youtube: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  whatsapp: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>,
};

const css = `
@import url('${FONT_LINK}');
*{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'Outfit',sans-serif;background:#FAFAF8;color:#1A1A1A;}
.cp-wrap{font-family:'Outfit',sans-serif;background:#FAFAF8;}

/* NAV */
.cp-nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(250,250,248,0.96);backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,0.06);transition:box-shadow .3s;}
.cp-nav.sh{box-shadow:0 2px 32px rgba(0,0,0,0.07);}
.cp-nav-in{max-width:1160px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;height:68px;}
.cp-logo{display:flex;align-items:center;gap:11px;text-decoration:none;cursor:pointer;}
.cp-logo-mark{width:38px;height:38px;border-radius:9px;background:#1A1A1A;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-weight:700;font-size:15px;color:#fff;flex-shrink:0;overflow:hidden;}
.cp-logo-name{font-family:'Playfair Display',serif;font-size:17px;font-weight:600;color:#1A1A1A;}
.cp-nav-links{display:flex;align-items:center;gap:4px;}
.cp-nav-a{padding:7px 14px;font-size:14px;font-weight:400;color:#666;border-radius:7px;transition:background .15s,color .15s;cursor:pointer;border:none;background:none;font-family:'Outfit',sans-serif;letter-spacing:.01em;}
.cp-nav-a:hover{background:#F0EDE6;color:#1A1A1A;}
.cp-nav-cta{padding:9px 18px;background:#1A1A1A;color:#fff;border-radius:8px;font-size:13px;font-weight:500;text-decoration:none;transition:opacity .15s;border:none;cursor:pointer;font-family:'Outfit',sans-serif;margin-left:8px;}
.cp-nav-cta:hover{opacity:.85;}
.cp-ham{display:none;background:none;border:none;cursor:pointer;color:#1A1A1A;padding:4px;}
.cp-mob-menu{background:#fff;border-top:1px solid #EEE;padding:8px 24px 20px;}
.cp-mob-a{display:block;padding:13px 0;font-size:15px;font-weight:400;color:#1A1A1A;border-bottom:1px solid #F4F1EB;cursor:pointer;background:none;border-left:none;border-right:none;border-top:none;text-align:left;width:100%;font-family:'Outfit',sans-serif;}

/* HERO */
.cp-hero{min-height:100vh;display:flex;align-items:center;padding-top:68px;background:#FAFAF8;position:relative;overflow:hidden;}
.cp-hero-in{max-width:1160px;margin:0 auto;padding:80px 32px;width:100%;display:grid;grid-template-columns:1.1fr 0.9fr;gap:72px;align-items:center;}
.cp-hero-pill{display:inline-flex;align-items:center;gap:7px;padding:5px 13px 5px 8px;background:#F0EDE6;border-radius:100px;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#7A6A50;margin-bottom:22px;}
.cp-hero-pill-dot{width:6px;height:6px;border-radius:50%;background:#B8A890;}
.cp-hero-h1{font-family:'Playfair Display',serif;font-size:clamp(34px,4vw,56px);font-weight:700;line-height:1.13;letter-spacing:-.025em;color:#0F0F0F;margin-bottom:22px;}
.cp-hero-h1 em{font-style:italic;color:#7A6A50;}
.cp-hero-sub{font-size:17px;font-weight:300;line-height:1.8;color:#666;margin-bottom:36px;max-width:460px;}
.cp-hero-btns{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:52px;}
.cp-btn-dark{padding:13px 26px;background:#1A1A1A;color:#fff;border-radius:9px;font-size:14px;font-weight:500;display:inline-flex;align-items:center;gap:8px;border:none;cursor:pointer;font-family:'Outfit',sans-serif;transition:background .18s,transform .1s;text-decoration:none;}
.cp-btn-dark:hover{background:#2D2D2D;transform:translateY(-1px);}
.cp-btn-ghost{padding:13px 26px;background:transparent;color:#1A1A1A;border:1.5px solid #D8D4CC;border-radius:9px;font-size:14px;font-weight:500;display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-family:'Outfit',sans-serif;transition:border-color .18s,background .18s;text-decoration:none;}
.cp-btn-ghost:hover{border-color:#1A1A1A;background:#F8F6F2;}
.cp-hero-stats{display:flex;gap:28px;padding-top:28px;border-top:1px solid #E8E4DC;}
.cp-stat-n{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#1A1A1A;line-height:1;}
.cp-stat-l{font-size:11px;font-weight:500;color:#AAA;text-transform:uppercase;letter-spacing:.08em;margin-top:3px;}

/* HERO VISUAL */
.cp-hero-vis{position:relative;}
.cp-hcard{background:#fff;border:1px solid #E8E4DC;border-radius:18px;padding:28px;box-shadow:0 6px 48px rgba(0,0,0,0.07);position:relative;z-index:2;}
.cp-hcard-fl{background:#1A1A1A;color:#fff;border-radius:12px;padding:14px 18px;position:absolute;bottom:-18px;left:-20px;z-index:3;box-shadow:0 10px 28px rgba(0,0,0,0.18);min-width:160px;}
.cp-hcard-fr{background:#fff;border:1px solid #E8E4DC;border-radius:12px;padding:14px 18px;position:absolute;top:-14px;right:-16px;z-index:3;box-shadow:0 6px 20px rgba(0,0,0,0.07);min-width:140px;}

/* SECTIONS */
.cp-sec{padding:96px 32px;}
.cp-sec-in{max-width:1160px;margin:0 auto;}
.cp-sec-hd{text-align:center;margin-bottom:60px;}
.cp-tag{display:inline-block;padding:4px 12px;background:#F0EDE6;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#7A6A50;margin-bottom:14px;}
.cp-sec-title{font-family:'Playfair Display',serif;font-size:clamp(26px,3vw,40px);font-weight:700;color:#0F0F0F;letter-spacing:-.02em;line-height:1.2;}
.cp-sec-title em{font-style:italic;color:#7A6A50;}
.cp-sec-desc{font-size:15px;color:#888;margin-top:14px;font-weight:300;max-width:520px;margin-left:auto;margin-right:auto;line-height:1.75;}
.cp-divider{height:1px;background:linear-gradient(90deg,transparent,#E0DBD3,transparent);max-width:1160px;margin:0 auto;}

/* ABOUT */
.cp-about-grid{display:grid;grid-template-columns:1fr 1.05fr;gap:72px;align-items:center;}
.cp-about-img-col{border-radius:18px;background:linear-gradient(145deg,#1A1A1A 0%,#3A3530 100%);aspect-ratio:4/5;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.cp-about-badge{position:absolute;bottom:20px;left:20px;right:20px;background:rgba(255,255,255,0.95);backdrop-filter:blur(8px);border-radius:11px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;}
.cp-about-h2{font-family:'Playfair Display',serif;font-size:clamp(28px,2.8vw,40px);font-weight:700;color:#0F0F0F;letter-spacing:-.02em;line-height:1.2;margin-bottom:20px;}
.cp-about-h2 em{font-style:italic;color:#7A6A50;}
.cp-about-p{font-size:15px;line-height:1.85;color:#666;font-weight:300;margin-bottom:16px;}
.cp-about-addr{display:flex;align-items:flex-start;gap:8px;font-size:14px;color:#999;margin-top:8px;}
.cp-facts{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:28px;}
.cp-fact{padding:18px;background:#fff;border:1px solid #E8E4DC;border-radius:11px;}
.cp-fact-n{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#1A1A1A;}
.cp-fact-l{font-size:11px;color:#AAA;font-weight:500;text-transform:uppercase;letter-spacing:.06em;margin-top:3px;}

/* SERVICES */
.cp-svc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#E0DBD3;border:1px solid #E0DBD3;border-radius:14px;overflow:hidden;}
.cp-svc-card{background:#FAFAF8;padding:32px 28px;transition:background .18s;}
.cp-svc-card:hover{background:#fff;}
.cp-svc-n{font-family:'Playfair Display',serif;font-size:12px;font-weight:600;color:#C4B8A4;margin-bottom:18px;}
.cp-svc-t{font-family:'Playfair Display',serif;font-size:18px;font-weight:600;color:#1A1A1A;margin-bottom:10px;line-height:1.3;}
.cp-svc-d{font-size:13px;line-height:1.78;color:#777;font-weight:300;}

/* PROJECTS */
.cp-proj-list{display:flex;flex-direction:column;gap:3px;}
.cp-proj-row{display:grid;grid-template-columns:56px 1fr auto;gap:20px;align-items:center;padding:28px 32px;background:#fff;border:1px solid #E8E4DC;border-radius:11px;transition:box-shadow .2s,transform .2s;}
.cp-proj-row:hover{box-shadow:0 4px 24px rgba(0,0,0,0.07);transform:translateX(3px);}
.cp-proj-idx{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#D8D4CC;}
.cp-proj-name{font-family:'Playfair Display',serif;font-size:18px;font-weight:600;color:#1A1A1A;margin-bottom:5px;}
.cp-proj-desc{font-size:13px;color:#888;font-weight:300;line-height:1.6;}
.cp-proj-link{width:38px;height:38px;border-radius:50%;border:1.5px solid #E0DBD3;display:flex;align-items:center;justify-content:center;color:#CCC;flex-shrink:0;text-decoration:none;transition:background .15s,color .15s,border-color .15s;}
.cp-proj-link:hover{background:#1A1A1A;color:#fff;border-color:#1A1A1A;}

/* TEAM */
.cp-team-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.cp-team-card{background:#fff;border:1px solid #E8E4DC;border-radius:14px;padding:28px 20px;text-align:center;transition:box-shadow .2s,transform .2s;}
.cp-team-card:hover{box-shadow:0 8px 32px rgba(0,0,0,0.08);transform:translateY(-3px);}
.cp-team-av{width:72px;height:72px;border-radius:50%;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#fff;flex-shrink:0;border:3px solid #F4F1EB;background-size:cover;background-position:center;}
.cp-team-name{font-family:'Playfair Display',serif;font-size:16px;font-weight:600;color:#1A1A1A;margin-bottom:4px;}
.cp-team-pos{font-size:12px;color:#AAA;font-weight:400;}

/* CLIENTS */
.cp-cli-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#E0DBD3;border:1px solid #E0DBD3;border-radius:14px;overflow:hidden;}
.cp-cli-cell{background:#FAFAF8;padding:28px 24px;display:flex;align-items:center;justify-content:center;transition:background .15s;}
.cp-cli-cell:hover{background:#fff;}
.cp-cli-mark{width:42px;height:42px;border-radius:9px;background:#EEE;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:13px;font-weight:700;color:#7A6A50;margin-right:10px;flex-shrink:0;}
.cp-cli-name{font-size:14px;font-weight:500;color:#1A1A1A;}

/* GALLERY */
.cp-gal-grid{display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:200px;gap:10px;}
.cp-gal-item{border-radius:11px;overflow:hidden;}
.cp-gal-img{width:100%;height:100%;object-fit:cover;display:block;}
.cp-gal-ph{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;}

/* CONTACT */
.cp-contact{background:#111;}
.cp-contact-in{max-width:1160px;margin:0 auto;padding:96px 32px;display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:start;}
.cp-contact-h2{font-family:'Playfair Display',serif;font-size:clamp(28px,3vw,42px);font-weight:700;color:#fff;letter-spacing:-.02em;line-height:1.15;margin-bottom:16px;}
.cp-contact-h2 em{font-style:italic;color:#BBA98C;}
.cp-contact-sub{font-size:15px;color:rgba(255,255,255,0.45);font-weight:300;line-height:1.75;margin-bottom:36px;}
.cp-contact-row{display:flex;align-items:center;gap:14px;padding:15px 0;border-bottom:1px solid rgba(255,255,255,0.07);}
.cp-contact-row-icon{color:rgba(255,255,255,0.35);flex-shrink:0;}
.cp-contact-row-text{font-size:14px;color:rgba(255,255,255,0.6);text-decoration:none;transition:color .15s;}
.cp-contact-row-text:hover{color:#fff;}
.cp-soc-row{display:flex;gap:8px;margin-top:24px;}
.cp-soc-a{width:40px;height:40px;border-radius:9px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.45);text-decoration:none;transition:background .15s,color .15s;}
.cp-soc-a:hover{background:rgba(255,255,255,0.1);color:#fff;}
.cp-contact-panel{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;}
.cp-contact-addr-top{padding:18px 22px;border-bottom:1px solid rgba(255,255,255,0.07);}
.cp-contact-addr-label{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:6px;}
.cp-contact-addr-text{font-size:13px;color:rgba(255,255,255,0.55);line-height:1.6;}
.cp-contact-map-ph{height:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;}
.cp-wa-btn{display:flex;align-items:center;gap:10px;margin-top:14px;padding:15px 18px;background:#22C55E;border-radius:11px;text-decoration:none;transition:opacity .15s;}
.cp-wa-btn:hover{opacity:.88;}
.cp-wa-text{color:#fff;font-weight:500;font-size:14px;}

/* FOOTER */
.cp-foot{background:#0C0C0C;padding:22px 32px;border-top:1px solid rgba(255,255,255,0.05);}
.cp-foot-in{max-width:1160px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;}
.cp-foot-copy{font-size:12px;color:rgba(255,255,255,0.2);}
.cp-foot-links{display:flex;gap:18px;}
.cp-foot-link{font-size:12px;color:rgba(255,255,255,0.25);text-decoration:none;}
.cp-foot-link:hover{color:rgba(255,255,255,0.5);}

@media(max-width:920px){
  .cp-hero-in{grid-template-columns:1fr;gap:40px;}
  .cp-hero-vis{display:none;}
  .cp-svc-grid{grid-template-columns:1fr 1fr;}
  .cp-about-grid{grid-template-columns:1fr;}
  .cp-about-img-col{display:none;}
  .cp-team-grid{grid-template-columns:repeat(2,1fr);}
  .cp-cli-grid{grid-template-columns:repeat(2,1fr);}
  .cp-gal-grid{grid-template-columns:repeat(2,1fr);}
  .cp-contact-in{grid-template-columns:1fr;}
  .cp-nav-links{display:none;}
  .cp-ham{display:block;}
}
@media(max-width:540px){
  .cp-svc-grid{grid-template-columns:1fr;}
  .cp-team-grid{grid-template-columns:1fr;}
  .cp-gal-grid{grid-template-columns:1fr;}
  .cp-proj-row{grid-template-columns:36px 1fr auto;padding:18px 16px;gap:12px;}
  .cp-sec{padding:72px 20px;}
  .cp-contact-in{padding:72px 20px;}
  .cp-hero-in{padding:60px 20px;}
}
`;

function GalPh({ caption }) {
  const hues = [40, 200, 260, 140, 60, 300];
  const h = hues[caption.charCodeAt(0) % hues.length];
  return (
    <div className="cp-gal-ph" style={{ background: `hsl(${h},20%,92%)` }}>
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={`hsl(${h},25%,55%)`} strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
      </svg>
      <span style={{ fontSize: 11, color: `hsl(${h},22%,52%)`, fontWeight: 500, textAlign: "center", padding: "0 12px" }}>{caption}</span>
    </div>
  );
}

export default function Company1({ data}) {
  const d = data || DUMMY;
  const [scrolled, setScrolled] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);

  const addr = d.address || {};
  const addrStr = [addr.building, addr.street, addr.city, addr.state, addr.pincode, addr.country].filter(Boolean).join(", ");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (id) => {
    setMobOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    { id: "about", label: "About" },
    has(d.services) && { id: "services", label: "Services" },
    has(d.projects) && { id: "work", label: "Work" },
    has(d.members) && { id: "team", label: "Team" },
    has(d.clients) && { id: "clients", label: "Clients" },
    has(d.gallery) && { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact" },
  ].filter(Boolean);

  const socials = [
    { k: "linkedin", ico: Ico.linkedin }, { k: "twitter", ico: Ico.twitter },
    { k: "instagram", ico: Ico.instagram }, { k: "facebook", ico: Ico.facebook },
    { k: "youtube", ico: Ico.youtube },
  ].filter(({ k }) => has(d.contacts?.[k]));

  const yr = new Date().getFullYear();
  const age = has(d.foundedYear) ? yr - d.foundedYear : null;

  return (
    <div className="cp-wrap">
      <style>{css}</style>

      {/* NAV */}
      <nav className={`cp-nav${scrolled ? " sh" : ""}`}>
        <div className="cp-nav-in">
          <div className="cp-logo" onClick={() => go("hero")}>
            <div className="cp-logo-mark">
              {has(d.logo) ? <img src={d.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials(d.companyName)}
            </div>
            <span className="cp-logo-name">{d.companyName}</span>
          </div>
          <div className="cp-nav-links">
            {navItems.map(({ id, label }) => (
              <button key={id} className="cp-nav-a" onClick={() => go(id)}>{label}</button>
            ))}
            {has(d.contacts?.email) && (
              <a href={`mailto:${d.contacts.email}`} className="cp-nav-cta">Get in Touch</a>
            )}
          </div>
          <button className="cp-ham" onClick={() => setMobOpen(o => !o)}>
            {mobOpen ? Ico.close : Ico.menu}
          </button>
        </div>
        {mobOpen && (
          <div className="cp-mob-menu">
            {navItems.map(({ id, label }) => (
              <button key={id} className="cp-mob-a" onClick={() => go(id)}>{label}</button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" className="cp-hero">
        {/* subtle vertical grid lines */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          {[...Array(7)].map((_, i) => (
            <div key={i} style={{ position: "absolute", width: 1, top: 0, bottom: 0, left: `${10 + i * 13}%`, background: "#E8E4DC", opacity: 0.55 }} />
          ))}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 40%, rgba(196,184,164,0.12) 0%, transparent 65%)" }} />
        </div>

        <div className="cp-hero-in">
          <div style={{ position: "relative", zIndex: 1 }}>
            {(has(d.businessPark) || has(addr.city)) && (
              <div className="cp-hero-pill">
                <span className="cp-hero-pill-dot" />
                {[d.businessPark, addr.city].filter(has).join(" · ")}
              </div>
            )}
            <h1 className="cp-hero-h1">
              {(() => {
                const words = typeof d?.companyName === "string"
                ? d.companyName.split(" ")
                : [];
                return words.map((w, i) => i === 1 ? <em key={i}>{w} </em> : w + " ");
              })()}
            </h1>
            {has(d.tagline) && <p className="cp-hero-sub">{d.tagline}</p>}
            <div className="cp-hero-btns">
              <button className="cp-btn-dark" onClick={() => go("contact")}>
                Get in Touch {Ico.arrow}
              </button>
              {has(d.services) && (
                <button className="cp-btn-ghost" onClick={() => go("services")}>Our Services</button>
              )}
            </div>
            <div className="cp-hero-stats">
              {age && <div><div className="cp-stat-n">{age}+</div><div className="cp-stat-l">Years</div></div>}
              {has(d.projects) && <div><div className="cp-stat-n">{d.projects.length * 10}+</div><div className="cp-stat-l">Projects</div></div>}
              {has(d.clients) && <div><div className="cp-stat-n">{d.clients.length * 5}+</div><div className="cp-stat-l">Clients</div></div>}
              {has(d.companySize) && <div><div className="cp-stat-n">{d.companySize}</div><div className="cp-stat-l">Team</div></div>}
            </div>
          </div>

          {/* Hero card */}
          <div className="cp-hero-vis" style={{ paddingBottom: 24, paddingRight: 20 }}>
            <div className="cp-hcard">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, paddingBottom: 18, borderBottom: "1px solid #F0EDE6" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: has(d.logo) ? `url(${d.logo}) center/cover` : "#1A1A1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 16, color: "#fff", flexShrink: 0 }}>
                  {!has(d.logo) && initials(d.companyName)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{d.companyName}</div>
                  <div style={{ fontSize: 12, color: "#AAA", marginTop: 1 }}>{d.industry}</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
                  <span style={{ fontSize: 12, color: "#888" }}>Active</span>
                </div>
              </div>
              {has(d.tags) && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 20 }}>
                  {d.tags.map(t => (
                    <span key={t} style={{ padding: "3px 9px", background: "#F0EDE6", borderRadius: 100, fontSize: 11, fontWeight: 600, color: "#7A6A50", letterSpacing: ".04em" }}>{t}</span>
                  ))}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {(d.services || []).slice(0, 4).map((s, i) => (
                  <div key={i} style={{ padding: "11px 13px", background: "#F8F6F2", borderRadius: 9 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#C4B8A4", marginBottom: 3 }}>0{i + 1}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#1A1A1A", lineHeight: 1.3 }}>{s.title}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="cp-hcard-fl">
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 3 }}>Founded</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>{d.foundedYear}</div>
            </div>
            <div className="cp-hcard-fr">
              <div style={{ fontSize: 10, color: "#AAA", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 3 }}>Based in</div>
              {has(addr.city) &&<div style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}> {addr.city}</div>}
              {has(addr.country) && <div style={{ fontSize: 11, color: "#BBB", marginTop: 1 }}>{addr.country}</div>}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      {has(d.about) && (
        <>
          <div className="cp-divider" />
          <section id="about" className="cp-sec">
            <div className="cp-sec-in">
              <div className="cp-about-grid">
                <div className="cp-about-img-col">
                  {has(d.banner)
                    ? <img src={d.banner} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 80, fontWeight: 700, color: "rgba(255,255,255,0.06)" }}>{d.foundedYear}</div>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.2)", textAlign: "center", padding: "0 24px" }}>{d.companyName}</div>
                      </>}
                  <div className="cp-about-badge">
                    <div>
                      <div style={{ fontSize: 10, color: "#AAA", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>Est.</div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700 }}>{d.foundedYear}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "#AAA", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>Industry</div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{d.industry}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="cp-tag">About Us</div>
                  <h2 className="cp-about-h2">Building technology that <em>endures.</em></h2>
                  <p className="cp-about-p">{d.about}</p>
                  {has(addrStr) && (
                    <div className="cp-about-addr">
                      <span style={{ color: "#C4B8A4", marginTop: 1, flexShrink: 0 }}>{Ico.pin}</span>
                      <span>{addrStr}</span>
                    </div>
                  )}
                  <div className="cp-facts">
                    {age && <div className="cp-fact"><div className="cp-fact-n">{age}+</div><div className="cp-fact-l">Years of Excellence</div></div>}
                    {has(d.companySize) && <div className="cp-fact"><div className="cp-fact-n">{d.companySize}</div><div className="cp-fact-l">Team Size</div></div>}
                    {has(d.clients) && <div className="cp-fact"><div className="cp-fact-n">{d.clients.length * 5}+</div><div className="cp-fact-l">Happy Clients</div></div>}
                    {has(d.projects) && <div className="cp-fact"><div className="cp-fact-n">{d.projects.length * 10}+</div><div className="cp-fact-l">Projects Shipped</div></div>}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* SERVICES */}
      {has(d.services) && (
        <>
          <div className="cp-divider" />
          <section id="services" className="cp-sec" style={{ background: "#F4F1EB" }}>
            <div className="cp-sec-in">
              <div className="cp-sec-hd">
                <div className="cp-tag">What We Do</div>
                <h2 className="cp-sec-title">Services built for <em>scale</em></h2>
                <p className="cp-sec-desc">From rapid prototyping to enterprise rollouts — we deliver end-to-end engineering excellence.</p>
              </div>
              <div className="cp-svc-grid">
                {d.services.map((s, i) => (
                  <div className="cp-svc-card" key={i}>
                    <div className="cp-svc-n">0{i + 1}</div>
                    <div className="cp-svc-t">{s.title}</div>
                    <p className="cp-svc-d">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* PROJECTS */}
      {has(d.projects) && (
        <>
          <div className="cp-divider" />
          <section id="work" className="cp-sec">
            <div className="cp-sec-in">
              <div className="cp-sec-hd">
                <div className="cp-tag">Our Work</div>
                <h2 className="cp-sec-title">Selected <em>projects</em></h2>
              </div>
              <div className="cp-proj-list">
                {d.projects.map((p, i) => (
                  <div className="cp-proj-row" key={i}>
                    <div className="cp-proj-idx">0{i + 1}</div>
                    <div>
                      <div className="cp-proj-name">{p.name}</div>
                      <div className="cp-proj-desc">{p.description}</div>
                    </div>
                    <a href={has(p.link) ? p.link : "#"} target={has(p.link) ? "_blank" : undefined} rel="noreferrer" className="cp-proj-link" onClick={!has(p.link) ? e => e.preventDefault() : undefined}>
                      {Ico.extlink}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* TEAM */}
      {has(d.members) && (
        <>
          <div className="cp-divider" />
          <section id="team" className="cp-sec" style={{ background: "#F4F1EB" }}>
            <div className="cp-sec-in">
              <div className="cp-sec-hd">
                <div className="cp-tag">The Team</div>
                <h2 className="cp-sec-title">People behind the <em>work</em></h2>
              </div>
              <div className="cp-team-grid">
                {d.members.map((m, i) => (
                  <div className="cp-team-card" key={i} style={{ cursor: has(m.url) ? "pointer" : "default" }} onClick={() => has(m.url) && window.open(m.url, "_blank")}>
                    <div className="cp-team-av" style={{ background: has(m.image) ? `url(${m.image}) center/cover` : avBg(m.name) }}>
                      {!has(m.image) && initials(m.name)}
                    </div>
                    <div className="cp-team-name">{m.name}</div>
                    <div className="cp-team-pos">{m.position}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* CLIENTS */}
      {has(d.clients) && (
        <>
          <div className="cp-divider" />
          <section id="clients" className="cp-sec">
            <div className="cp-sec-in">
              <div className="cp-sec-hd">
                <div className="cp-tag">Trusted By</div>
                <h2 className="cp-sec-title">Companies that <em>trust us</em></h2>
              </div>
              <div className="cp-cli-grid">
                {d.clients.map((c, i) => (
                  <div className="cp-cli-cell" key={i} style={{ cursor: has(c.website) ? "pointer" : "default" }} onClick={() => has(c.website) && window.open(c.website, "_blank")}>
                    {has(c.logo)
                      ? <img src={c.logo} alt={c.name} style={{ maxWidth: 110, maxHeight: 36, objectFit: "contain" }} />
                      : <><div className="cp-cli-mark">{initials(c.name)}</div><span className="cp-cli-name">{c.name}</span></>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* GALLERY */}
      {has(d.gallery) && (
        <>
          <div className="cp-divider" />
          <section id="gallery" className="cp-sec" style={{ background: "#F4F1EB" }}>
            <div className="cp-sec-in">
              <div className="cp-sec-hd">
                <div className="cp-tag">Gallery</div>
                <h2 className="cp-sec-title">Life at <em>{d.companyName}</em></h2>
              </div>
              <div className="cp-gal-grid">
                {d.gallery.map((g, i) => (
                  <div className="cp-gal-item" key={i} style={{ gridRow: i === 0 ? "span 2" : undefined }}>
                    {has(g.imageUrl)
                      ? <img className="cp-gal-img" src={g.imageUrl} alt={g.caption} />
                      : <GalPh caption={g.caption || `Photo ${i + 1}`} />}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* CONTACT */}
      <section id="contact" className="cp-contact">
        <div className="cp-contact-in">
          <div>
            <div className="cp-tag" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }}>Contact</div>
            <h2 className="cp-contact-h2">Let's build something <em>great</em> together.</h2>
            <p className="cp-contact-sub">Ready to start a project or just want to say hello? We'd love to hear from you.</p>
            {has(d.contacts?.email) && (
              <div className="cp-contact-row">
                <span className="cp-contact-row-icon">{Ico.email}</span>
                <a href={`mailto:${d.contacts.email}`} className="cp-contact-row-text">{d.contacts.email}</a>
              </div>
            )}
            {has(d.contacts?.phone) && (
              <div className="cp-contact-row">
                <span className="cp-contact-row-icon">{Ico.phone}</span>
                <a href={`tel:${d.contacts.phone}`} className="cp-contact-row-text">{d.contacts.phone}</a>
              </div>
            )}
            {has(d.website) && (
              <div className="cp-contact-row">
                <span className="cp-contact-row-icon">{Ico.globe}</span>
                <a href={d.website} target="_blank" rel="noreferrer" className="cp-contact-row-text">{d.website}</a>
              </div>
            )}
            {socials.length > 0 && (
              <div className="cp-soc-row">
                {socials.map(({ k, ico }) => (
                  <a key={k} href={d.contacts[k]} target="_blank" rel="noreferrer" className="cp-soc-a">{ico}</a>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="cp-contact-panel">
              <div className="cp-contact-addr-top">
                <div className="cp-contact-addr-label">Headquarters</div>
                {has(addrStr) && ( <div className="cp-contact-addr-text">{addrStr}</div>
)}
              </div>
              {has(d.mapEmbedLink)
                ? <iframe src={d.mapEmbedLink} style={{ width: "100%", height: 220, border: 0, display: "block" }} title="map" />
                : (
                  <div className="cp-contact-map-ph">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>{addr.city}, {addr.country}</span>
                  </div>
                )}
            </div>
            {has(d.contacts?.whatsapp) && (
              <a href={`https://wa.me/${d.contacts.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="cp-wa-btn">
                {Ico.whatsapp}
                <span className="cp-wa-text">Chat on WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="cp-foot">
        <div className="cp-foot-in">
          <span className="cp-foot-copy">© {yr} {d.companyName}. All rights reserved.</span>
          <div className="cp-foot-links">
            {has(d.website) && <a href={d.website} target="_blank" rel="noreferrer" className="cp-foot-link">{d.website.replace(/^https?:\/\//,"")}</a>}
            {has(d.contacts?.email) && <a href={`mailto:${d.contacts.email}`} className="cp-foot-link">{d.contacts.email}</a>}
          </div>
        </div>
      </footer>
    </div>
  );
}