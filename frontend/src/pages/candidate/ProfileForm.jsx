import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useCompany } from "../../context/CompanyContext";
import { useUser } from "../../context/UserContext";
import API_BASE from "../../../config";
import LayoutSelector from "../../components/LayoutSelector";
import { useNavigate } from "react-router-dom";



const TABS = [
  { id: "basic",      label: "Identity",   sym: "✦" },
  { id: "profile",    label: "Story",      sym: "◈" },
  { id: "skills",     label: "Skills",     sym: "◉" },
  { id: "education",  label: "Education",  sym: "◎" },
  { id: "experience", label: "Experience", sym: "◐" },
  // { id: "settings",   label: "Layout",     sym: "◧" },
];

const inputCls =
  "w-full bg-white border border-zinc-200 rounded-2xl px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100 transition-all";
const labelCls =
  "block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5";

// ── Helpers ───────────────────────────────────────────────────────────────────
function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-sm font-semibold
            backdrop-blur-sm border transition-all animate-toast
            ${t.type === "success"
              ? "bg-white border-green-200 text-green-700"
              : "bg-white border-red-200 text-red-600"}`}
        >
          <span className="text-base">{t.type === "success" ? "✓" : "✕"}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (message, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  };
  return { toasts, success: (m) => add(m, "success"), error: (m) => add(m, "error") };
}

// ── Round Avatar Upload ───────────────────────────────────────────────────────
function AvatarUpload({ value, onChange }) {
  const ref = useRef();

  const preview =
    value instanceof File
      ? URL.createObjectURL(value)
      : typeof value === "string"
      ? value
      : "";

  return (
    <div className="relative w-24 h-24 mx-auto">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-100 border-4 border-white shadow-md ring-2 ring-zinc-200">
        {preview ? (
          <img src={preview} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl select-none bg-gradient-to-br from-zinc-100 to-zinc-200">
            🧑
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-zinc-900 text-white"
      >
        +
      </button>

      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          onChange(file);
        }}
      />
    </div>
  );
}

// ── CV Button ─────────────────────────────────────────────────────────────────
function CVUpload({ value, fileName, onChange }) {
  const ref = useRef();
  const has = !!value;
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-2xl border-2 transition-all
          ${has
            ? "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-700"
            : "border-dashed border-zinc-300 text-zinc-500 hover:border-zinc-500 hover:text-zinc-700 bg-white"}`}
      >
        <span>📄</span>
        {has ? "Replace CV" : "Upload CV / Resume"}
      </button>
      {has && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 truncate max-w-[140px]">{fileName || "CV uploaded"}</span>
          <button
            type="button"
            onClick={() => onChange("", "")}
            className="text-zinc-300 hover:text-red-400 text-xs transition-colors"
          >✕</button>
        </div>
      )}
      <input
        ref={ref}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf"
        className="hidden"
        onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            onChange(file);
          }}
      />
    </div>
  );
}

// ── Reusable Card ─────────────────────────────────────────────────────────────
function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-3xl border border-zinc-100 p-5 shadow-sm ${className}`}>{children}</div>;
}
function CardTitle({ children }) {
  return <p className="text-sm font-bold text-zinc-800 mb-4">{children}</p>;
}

// ── Dynamic Array Fields ──────────────────────────────────────────────────────
function DynArray({ items, onAdd, onRemove, onUpdate, placeholder, template, fields }) {
  if (!fields) {
    return (
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input className={inputCls} placeholder={placeholder} value={item}
              onChange={(e) => onUpdate(i, null, e.target.value)} />
            {items.length > 1 && (
              <button type="button" onClick={() => onRemove(i)}
                className="w-10 h-10 flex-shrink-0 rounded-2xl bg-zinc-100 hover:bg-red-50 text-zinc-400 hover:text-red-400 text-sm transition-colors">✕</button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => onAdd("")}
          className="w-full py-3 text-sm font-semibold text-zinc-400 hover:text-zinc-600 border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-2xl transition-all">
          + Add
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
                <label className={labelCls}>{f.label}</label>
                {f.textarea ? (
                  <textarea className={`${inputCls} resize-none min-h-20`} placeholder={f.placeholder}
                    value={item[f.key] || ""} onChange={(e) => onUpdate(i, f.key, e.target.value)} />
                ) : (
                  <input className={inputCls} type={f.type || "text"} placeholder={f.placeholder}
                    value={item[f.key] || ""} onChange={(e) => onUpdate(i, f.key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
          {items.length > 1 && (
            <button type="button" onClick={() => onRemove(i)}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-zinc-200 hover:bg-red-100 text-zinc-400 hover:text-red-400 text-xs flex items-center justify-center transition-colors">
              ✕
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={() => onAdd(template)}
        className="w-full py-3 text-sm font-semibold text-zinc-400 hover:text-zinc-600 border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-2xl transition-all">
        + Add Entry
      </button>
    </div>
  );
}

// ── Initial form state ────────────────────────────────────────────────────────
const blank = {
  name: "", email: "", phone: "", place: "",
  tagline: "",  company: "",    qualification: "", about: "",
  profilePhoto: "", cv: "", cvFileName: "", layoutType: 1,
  skills: [""], lookingVacancy: [""],
  services: [{ heading: "", description: "" }],
  education: [{ education: "", institution: "", year: "", percentage: "" }],
  experience: [{ jobTitle: "", company: "", startDate: "", endDate: "" }],
  socials: [{
    instagram: "",
    facebook: "",
    linkedin: "",
    twitter: "",
    github: "",
    website: ""
  }],

  projects: [{
    title: "",
    description: "",
    link: ""
  }]
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function CandidateProfileForm() {
  const { user,updateUser,token } = useUser();
  const [form, setForm] = useState(blank);
  const [tab, setTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  // Sync form from context / localStorage on mount
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        ...user,
        skills: user.skills || [],
        lookingVacancy: user.lookingVacancy || [],
        education: user.education || [],
        experience: user.experience || [],
        services: user.services || [],
        socials: user.socials || [],
        projects: user.projects || []
      }));
    }
  }, [user]);

  const progress = Math.round(
    [form.name, form.email, form.phone, form.profilePhoto,
      form.tagline, form.about,
      form.skills.some(Boolean),
      form.experience.some((e) => e.jobTitle),
    ].filter(Boolean).length / 8 * 100
  );
  const pColor = progress < 40 ? "#f97316" : progress < 75 ? "#eab308" : "#22c55e";
  const fetchPlaces = async (query) => {
    if (!query) {
      setPlaceSuggestions([]);
      return;
    }
  
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: `${query}, Kerala`,   // ← append Kerala to every query
            format: "json",
            addressdetails: 1,
            limit: 5,
            countrycodes: "in",      // ← India only
            viewbox: "74.85,8.08,77.60,12.78",  // Kerala bounding box (west,south,east,north)
            bounded: 1,              // ← hard restrict to viewbox
          },
        }
      );
      setPlaceSuggestions(res.data);
      setShowSuggestions(true);
    } catch (err) {
      console.log(err);
    }
  };
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const addArr  = (k, t) => set(k, [...form[k], t]);
  const remArr  = (k, i) => set(k, form[k].filter((_, x) => x !== i));
  const updArr  = (k, i, key, val) =>
    set(k, form[k].map((item, x) => x === i ? (key === null ? val : { ...item, [key]: val }) : item));
  const timeoutRef = useRef();

  const handlePlaceChange = (val) => {
    set("place", val);
  
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fetchPlaces(val);
    }, 400);
  };

  const normalizePhone = (phone) => {
    if (!phone) return "";
  
    // remove everything except numbers
    let cleaned = phone.replace(/\D/g, "");
  
    // remove leading 91 if already present
    if (cleaned.startsWith("91")) {
      cleaned = cleaned.slice(2);
    }
  
    return `+91${cleaned}`;
  };
  // ── Save handler ─────────────────────────────────────────────────────────
  const handleSave = async () => {
    console.log("usssd",user,form);
    
    const candidateId = form._id || user?._id ||user?.id;

    if (!candidateId) {
      toast.error("No user ID found. Please log in.");
      return;
    }
  
    setLoading(true);
  
    try {
      const formData = new FormData();
  
      // Append files if they are File objects
      if (form.profilePhoto instanceof File) {
        formData.append("profilePhoto", form.profilePhoto);
      } else if (typeof form.profilePhoto === "string") {
        formData.append("profilePhoto", form.profilePhoto);
      }
  
      if (form.cv instanceof File) {
        formData.append("cv", form.cv);
      } else if (typeof form.cv === "string") {
        formData.append("cv", form.cv);
      }
  
      // Append all other fields
      const payload = {
        name: form.name,
        phone: normalizePhone(form.phone),
        place: form.place,
        about: form.about,
        tagline: form.tagline,
        company: form.company,
        qualification: form.qualification,
        layoutType: form.layoutType,
        socials: form.socials.filter(s => s.instagram || s.facebook || s.linkedin || s.twitter || s.github || s.website),
        projects: form.projects.filter(p => p.title || p.description || p.link),
        skills: form.skills.filter(s => s?.trim()),
        lookingVacancy: form.lookingVacancy.filter(v => v?.trim()),
        education: form.education.filter(e => e.education || e.institution || e.year || e.percentage),
        experience: form.experience.filter(e => e.jobTitle || e.company).map(e => ({ ...e, endDate: e.endDate || null })),
        services: form.services.filter(s => s.heading || s.description),
      };
  
      Object.keys(payload).forEach((key) => {
        const value = payload[key];
        if (Array.isArray(value) || typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value ?? "");
        }
      });
  
      const { data } = await axios.put(
       `${API_BASE}/candidate/update/${candidateId}`,  // ← correct endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  console.log("kss",data);
  
      const updated = data.candidate || data.data;
      updateUser(updated);
      setForm(updated);
      toast.success("Profile updated successfully!");
      setTimeout(() => {
        navigate("/home");
      }, 1000);
     } catch (err) {
      const msg = err?.response?.data?.message || "Update failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,900&family=Lora:wght@600;700&display=swap');
        .pf * { box-sizing: border-box; font-family: 'DM Sans', system-ui, sans-serif; }
        .pf-serif { font-family: 'Lora', Georgia, serif; }
        .tabs::-webkit-scrollbar { display: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
        .fade-up { animation: fadeUp 0.28s ease both; }
        @keyframes toastIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:none; } }
        .animate-toast { animation: toastIn 0.25s ease both; }
      `}</style>

      <Toast toasts={toast.toasts} />

      <div className="pf min-h-screen bg-[#f4f3f1]">

        {/* ── STICKY HEADER ── */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-zinc-100">
          <div className="max-w-xl mx-auto px-4 pt-4 pb-0">

            <div className="flex items-center gap-3 mb-3">
              {/* Live avatar preview */}
              <div className="w-11 h-11 rounded-full overflow-hidden bg-zinc-100 border-2 border-white shadow flex-shrink-0 ring-2 ring-zinc-200">
                {form.profilePhoto ? (
                  <img src={form.profilePhoto} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl select-none">🧑</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="pf-serif font-bold text-zinc-900 text-base leading-tight truncate">
                  {form.name || "Your Name"}
                </p>
                <p className="text-xs text-zinc-400 truncate">{form.tagline || "Add a tagline"}</p>
              </div>

              {/* Progress pill */}
              <div className="flex items-center gap-2 mr-1">
                <div className="w-20 h-1.5 bg-zinc-100 rounded-full overflow-hidden hidden sm:block">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: pColor }} />
                </div>
                <span className="text-[11px] font-bold" style={{ color: pColor }}>{progress}%</span>
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className={`flex-shrink-0 flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-2xl transition-all
                  ${loading ? "bg-zinc-300 text-zinc-500 cursor-not-allowed"
                    : "bg-zinc-900 hover:bg-zinc-700 text-white active:scale-95"}`}
              >
                {loading ? (
                  <><span className="inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving</>
                ) : "Save"}
              </button>
            </div>

            {/* Tabs */}
            <div className="tabs flex overflow-x-auto gap-0.5">
              {TABS.map((t) => (
                <button key={t.id} type="button" onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-3 text-[11px] font-bold whitespace-nowrap border-b-2 transition-all
                    ${tab === t.id ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-400 hover:text-zinc-600"}`}>
                  <span>{t.sym}</span>{t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="max-w-xl mx-auto px-4 py-5 space-y-4 fade-up" key={tab}>

          {/* IDENTITY */}
          {tab === "basic" && (
            <>
              {/* Avatar + CV row */}
              <Card>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  {/* Round avatar */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <AvatarUpload value={form.profilePhoto} onChange={(file) => set("profilePhoto", file)} />
                    <p className="text-[10px] text-zinc-400 font-semibold">Profile Photo</p>
                  </div>

                  {/* CV + name preview */}
                  <div className="flex-1 min-w-0 space-y-3 w-full">
                    <div>
                      <p className={labelCls}>CV / Resume</p>
                      <CVUpload
                        value={form.cv}
                        fileName={form.cvFileName}
                        onChange={(file, name) => { 
                            set("cv", file); 
                            set("cvFileName", name || ""); 
                          }} />
                    </div>
                    <div>
                      <p className={labelCls}>Full Name</p>
                      <input className={inputCls} placeholder="Jane Doe"
                        value={form.name} onChange={e => set("name", e.target.value)} />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Rest of personal details */}
              
              <Card>
                <CardTitle>Contact & Location</CardTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
  { k: "email", l: "Email", p: "jane@email.com", t: "email" },
  { k: "phone", l: "Phone", p: "+91 98765 43210" },
  { k: "place", l: "Location", p: "Bangalore, India" },
].map((f) => (
  <div key={f.k} className="relative">
    
    <label className={labelCls}>{f.l}</label>
   
    {/* 🔥 SPECIAL CASE: PLACE */}
    {f.k === "place" ? (
  // ✅ PLACE (existing logic)
  <>
    <input
      className={inputCls}
      placeholder={f.p}
      value={form.place}
      onChange={(e) => handlePlaceChange(e.target.value)}
      onFocus={() => setShowSuggestions(true)}
      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
    />

    {showSuggestions && placeSuggestions.length > 0 && (
      <div className="absolute z-50 w-full bg-white border border-zinc-200 rounded-xl mt-1 shadow-lg max-h-60 overflow-y-auto">
        {placeSuggestions.map((item, i) => (
          <div
            key={i}
            className="px-4 py-2 text-sm hover:bg-zinc-100 cursor-pointer"
            onClick={() => {
              set("place", item.display_name);
              setShowSuggestions(false);
            }}
          >
            {item.display_name}
          </div>
        ))}
      </div>
    )}
  </>
) : f.k === "email" ? (
  // 🔒 EMAIL (LOCKED)
  <>
    <input
      className={`${inputCls} bg-zinc-100 cursor-not-allowed`}
      type="email"
      value={form.email}
      disabled
    />
    <div className="mt-1 text-[11px] text-zinc-400">
      Email cannot be changed
    </div>
  </>
) : (
  // ✅ NORMAL INPUT
  <input
    className={inputCls}
    type={f.t || "text"}
    placeholder={f.p}
    value={form[f.k]}
    onChange={(e) => set(f.k, e.target.value)}
  />
)}
     {f.k === "phone" && (
   <div className="mt-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-700">
   Use a secondary phone number to protect your personal contact
 </div>
  )}
  </div>
))}
                 
                </div>
          
              </Card>
              <Card>
  <CardTitle>Social Links</CardTitle>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

    <div>
      <label className={labelCls}>Instagram</label>
      <input
        className={inputCls}
        placeholder="https://instagram.com/username"
        value={form.socials?.[0]?.instagram || ""}
        onChange={(e) =>
          set("socials", [{ ...form.socials?.[0], instagram: e.target.value }])
        }
      />
    </div>

    {/* <div>
      <label className={labelCls}>Facebook</label>
      <input
        className={inputCls}
        placeholder="https://facebook.com/username"
        value={form.socials?.[0]?.facebook || ""}
        onChange={(e) =>
          set("socials", [{ ...form.socials?.[0], facebook: e.target.value }])
        }
      />
    </div> */}

    <div>
      <label className={labelCls}>LinkedIn</label>
      <input
        className={inputCls}
        placeholder="https://linkedin.com/in/username"
        value={form.socials?.[0]?.linkedin || ""}
        onChange={(e) =>
          set("socials", [{ ...form.socials?.[0], linkedin: e.target.value }])
        }
      />
    </div>

    {/* <div>
      <label className={labelCls}>Twitter</label>
      <input
        className={inputCls}
        placeholder="https://twitter.com/username"
        value={form.socials?.[0]?.twitter || ""}
        onChange={(e) =>
          set("socials", [{ ...form.socials?.[0], twitter: e.target.value }])
        }
      />
    </div> */}

    {/* <div>
      <label className={labelCls}>GitHub</label>
      <input
        className={inputCls}
        placeholder="https://github.com/username"
        value={form.socials?.[0]?.github || ""}
        onChange={(e) =>
          set("socials", [{ ...form.socials?.[0], github: e.target.value }])
        }
      />
    </div> */}

    {/* <div className="sm:col-span-2">
      <label className={labelCls}>Website</label>
      <input
        className={inputCls}
        placeholder="https://yourwebsite.com"
        value={form.socials?.[0]?.website || ""}
        onChange={(e) =>
          set("socials", [{ ...form.socials?.[0], website: e.target.value }])
        }
      />
    </div> */}

  </div>
</Card>
            </>
          )}

          {/* STORY */}
          {tab === "profile" && (
            <>
              <Card>
                <CardTitle>Professional Identity</CardTitle>
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Tagline</label>
                    <input className={inputCls} placeholder="Full-Stack Dev & Design Thinker"
                      value={form.tagline} onChange={e => set("tagline", e.target.value)} />
                  </div>
                  <div>
  <label className={labelCls}>Company</label>
  <input
    className={inputCls}
    placeholder="e.g. Google, Amazon"
    value={form.company || ""}
    onChange={(e) => set("company", e.target.value)}
  />
</div>
                  <div>
                    <label className={labelCls}>Highest Qualification</label>
                    <input className={inputCls} placeholder="B.Tech Computer Science"
                      value={form.qualification} onChange={e => set("qualification", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>About Me</label>
                    <textarea className={`${inputCls} resize-none min-h-32`}
                      placeholder="Tell your story — who you are, what drives you…"
                      value={form.about} onChange={e => set("about", e.target.value)} />
                    <p className="text-[11px] text-zinc-400 mt-1 text-right">{form.about.length} chars</p>
                  </div>
                </div>
              </Card>

              <Card>
                <CardTitle>Open to Roles</CardTitle>
                <DynArray
                  items={form.lookingVacancy}
                  placeholder="e.g. Frontend Developer"
                  onAdd={(t) => addArr("lookingVacancy", t)}
                  onRemove={(i) => remArr("lookingVacancy", i)}
                  onUpdate={(i, _, v) => updArr("lookingVacancy", i, null, v)}
                />
              </Card>
            </>
          )}

          {/* SKILLS */}
          {tab === "skills" && (
            <>
              <Card>
                <CardTitle>Skills</CardTitle>
                {form.skills.some(s => s.trim()) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {form.skills.filter(s => s.trim()).map((s, i) => (
                      <span key={i} className="bg-zinc-100 text-zinc-700 text-xs font-semibold px-3 py-1.5 rounded-full">{s}</span>
                    ))}
                  </div>
                )}
                <DynArray
                  items={form.skills}
                  placeholder="e.g. React.js, Figma"
                  onAdd={(t) => addArr("skills", t)}
                  onRemove={(i) => remArr("skills", i)}
                  onUpdate={(i, _, v) => updArr("skills", i, null, v)}
                />
              </Card>

              <Card>
                <CardTitle>Services Offered</CardTitle>
                <DynArray
                  items={form.services}
                  template={{ heading: "", description: "" }}
                  fields={[
                    { key: "heading", label: "Service Title", placeholder: "e.g. UI/UX Design" },
                    { key: "description", label: "Description", placeholder: "What you deliver…", textarea: true, full: true },
                  ]}
                  onAdd={(t) => addArr("services", t)}
                  onRemove={(i) => remArr("services", i)}
                  onUpdate={(i, k, v) => updArr("services", i, k, v)}
                />
              </Card>
            </>
          )}

          {/* EDUCATION */}
          {tab === "education" && (
            <Card>
              <CardTitle>Education History</CardTitle>
              <DynArray
                items={form.education}
                template={{ education: "", institution: "", year: "", percentage: "" }}
                fields={[
                  { key: "education",   label: "Degree",       placeholder: "e.g. B.Tech, MBA" },
                  { key: "institution", label: "Institution",   placeholder: "University name" },
                  { key: "year",        label: "Year",          placeholder: "2022", type: "number" },
                  { key: "percentage",  label: "Score / CGPA",  placeholder: "85% or 8.5 CGPA" },
                ]}
                onAdd={(t) => addArr("education", t)}
                onRemove={(i) => remArr("education", i)}
                onUpdate={(i, k, v) => updArr("education", i, k, v)}
              />
            </Card>
          )}

          {/* EXPERIENCE */}
          {tab === "experience" && (
            <>
            <Card>
              <CardTitle>Work Experience</CardTitle>
              <DynArray
                items={form.experience}
                template={{ jobTitle: "", company: "", startDate: "", endDate: "" }}
                fields={[
                  { key: "jobTitle",   label: "Job Title",  placeholder: "e.g. Frontend Developer" },
                  { key: "company",    label: "Company",    placeholder: "Acme Corp" },
                ]}
                onAdd={(t) => addArr("experience", t)}
                onRemove={(i) => remArr("experience", i)}
                onUpdate={(i, k, v) => updArr("experience", i, k, v)}
              />
            </Card>
            <Card>
            <CardTitle>Projects</CardTitle>
          
            <DynArray
              items={form.projects}
              template={{ title: "", description: "", link: "" }}
              fields={[
                { key: "title", label: "Project Title", placeholder: "Job Portal Platform" },
                { key: "link", label: "Project Link", placeholder: "https://github.com/project" },
                { key: "description", label: "Description", placeholder: "Explain what this project does...", textarea: true, full: true }
              ]}
              onAdd={(t) => addArr("projects", t)}
              onRemove={(i) => remArr("projects", i)}
              onUpdate={(i, k, v) => updArr("projects", i, k, v)}
            />
          </Card>
          </>
          )}

          {/* SETTINGS */}
        {/* {tab === "settings" && (
  <Card>
   
    <LayoutSelector
      value={form.layoutType}
      onChange={(id) => set("layoutType", id)}
      data={form}
    />
  </Card>
)} */}

          {/* Bottom CTA */}
          <div className="flex items-center justify-between pt-2 pb-8">
            <p className="text-xs text-zinc-400">
              Profile <span className="font-bold" style={{ color: pColor }}>{progress}% complete</span>
            </p>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className={`flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-2xl transition-all
                ${loading
                  ? "bg-zinc-300 text-zinc-500 cursor-not-allowed"
                  : "bg-zinc-900 hover:bg-zinc-700 text-white active:scale-95"}`}
            >
              {loading
                ? <><span className="inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</>
                : "Save Profile →"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}