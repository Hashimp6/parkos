import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useCompany } from "../../context/CompanyContext";
import API_BASE from "../../../config";


const BUSINESS_PARKS = [
  "Cyberpark", "Technopark", "Infopark", "Smart City",
  "KINFRA Tech Park", "Business Park", "SEZ", "Other",
];

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];

const TABS = [
  { id: "branding",  label: "Branding",   sym: "✦" },
  { id: "about",     label: "About",      sym: "◈" },
  { id: "location",  label: "Location",   sym: "◉" },
  { id: "team",      label: "Team",       sym: "◎" },
  { id: "projects",  label: "Projects",   sym: "◆" },
  { id: "services",  label: "Services",   sym: "◐" },
  { id: "gallery",   label: "Gallery",    sym: "◧" },
  { id: "clients",   label: "Clients",    sym: "◫" },
  { id: "contact",   label: "Contact",    sym: "◬" },
  { id: "settings",  label: "Layout",     sym: "◭" },
];

const inputCls =
  "w-full bg-white border border-zinc-200 rounded-2xl px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100 transition-all";
const labelCls =
  "block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5";

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 50, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
      {toasts.map((t) => (
        <div key={t.id} className={`animate-toast flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-sm font-semibold border
          ${t.type === "success" ? "bg-white border-green-200 text-green-700" : "bg-white border-red-200 text-red-600"}`}>
          <span>{t.type === "success" ? "✓" : "✕"}</span>
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

// ── Image Upload Button ───────────────────────────────────────────────────────
function ImageUpload({ value, onChange, label, shape = "square", placeholder = "📷", onFileChange }) {
  const ref = useRef();
  const isRound = shape === "round";
  return (
    <div className="flex flex-col items-center gap-2">
      <button type="button" onClick={() => ref.current?.click()}
        className="relative overflow-hidden bg-zinc-100 border-2 border-dashed border-zinc-300 hover:border-zinc-500 transition-all group"
        style={{ width: isRound ? 80 : 120, height: isRound ? 80 : 80, borderRadius: isRound ? "50%" : 16 }}>
        {value ? (
          <img src={value} alt="upload" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl text-zinc-400 group-hover:text-zinc-600 transition-colors">
            {placeholder}
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-lg">Change</span>
        </div>
      </button>
      {label && <p className="text-[10px] text-zinc-400 font-semibold text-center">{label}</p>}
      <input ref={ref} type="file" accept="image/*" className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            onChange(URL.createObjectURL(f));
            if (onFileChange) onFileChange(f);
          }
        }} />
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-3xl border border-zinc-100 p-5 shadow-sm ${className}`}>{children}</div>;
}
function CardTitle({ children }) {
  return <p className="text-sm font-bold text-zinc-800 mb-4">{children}</p>;
}

// ── Dynamic Array Fields ──────────────────────────────────────────────────────
function DynArray({ items, onAdd, onRemove, onUpdate, placeholder, template, fields, onFileChange }) {
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
                {f.type === "image" ? (
                  <ImageUpload
                    value={item[f.key] || ""}
                    onChange={(url) => onUpdate(i, f.key, url)}
                    placeholder="🖼"
                    shape="square"
                    // pass file up with index so parent can track it
                    onFileChange={(file) => onFileChange && onFileChange(i, f.key, file)}
                  />
                ) : f.textarea ? (
                  <textarea className={`${inputCls} resize-none min-h-20`} placeholder={f.placeholder}
                    value={item[f.key] || ""} onChange={(e) => onUpdate(i, f.key, e.target.value)} />
                ) : (
                  <input className={inputCls} type={f.type || "text"} placeholder={f.placeholder}
                    value={item[f.key] || ""} onChange={(e) => onUpdate(i, f.key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
          {items.length > 0 && (
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

// ── Blank state ───────────────────────────────────────────────────────────────
const blank = {
  companyName: "", tagline: "", about: "", logo: "", banner: "",
  industry: "", companySize: "", employeeCount: "", foundedYear: "", website: "",
  tags: [""],
  businessPark: "Other",
  layout: 1,
  address: { building: "", street: "", city: "", state: "", pincode: "", country: "India" },
  mapEmbedLink: "",
  projects: [{ name: "", description: "", link: "" }],
  contacts: { linkedin: "", instagram: "", facebook: "", twitter: "", youtube: "", whatsapp: "", email: "", phone: "" },
  members:  [{ name: "", position: "", image: "", url: "" }],
  services: [{ title: "", description: "" }],
  gallery:  [{ imageUrl: "", caption: "" }],
  clients:  [{ name: "", logo: "", website: "" }],
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function CompanyProfileForm() {
  const [form, setForm] = useState(blank);
  const [tab, setTab]   = useState("branding");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { company, updateCompany, token } = useCompany();

  // Track all uploadable files:
  // logo, banner          → single files
  // members[i].image      → array of files indexed by position
  // gallery[i].imageUrl   → array of files indexed by position
  // clients[i].logo       → array of files indexed by position
  const [files, setFiles] = useState({
    logo: null,
    banner: null,
    members: {},   // { [index]: File }
    gallery: {},   // { [index]: File }
    clients: {},   // { [index]: File }
  });

  // Load company data on mount
  useEffect(() => {
    if (company && company._id) {
      setForm((prev) => ({
        ...prev,
        ...company,
        tags: company.tags?.length ? company.tags : [""],
        members: company.members?.length ? company.members : prev.members,
        services: company.services?.length ? company.services : prev.services,
        gallery: company.gallery?.length ? company.gallery : prev.gallery,
        projects: company.projects?.length ? company.projects : prev.projects,
        clients: company.clients?.length ? company.clients : prev.clients,
        address: { ...prev.address, ...(company.address || {}) },
        contacts: { ...prev.contacts, ...(company.contacts || {}) },
      }));
    }
  }, [company]);

  // Progress
  const progress = Math.round(
    [form.companyName, form.tagline, form.about, form.logo,
      form.industry, form.businessPark !== "Other",
      form.contacts?.email || form.contacts?.phone,
      form.services?.some(s => s.title),
    ].filter(Boolean).length / 8 * 100
  );
  const pColor = progress < 40 ? "#f97316" : progress < 75 ? "#eab308" : "#22c55e";

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const setNested = (parent, k, v) => setForm((p) => ({ ...p, [parent]: { ...p[parent], [k]: v } }));
  const addArr  = (k, t) => set(k, [...form[k], t]);
  const remArr  = (k, i) => {
    set(k, form[k].filter((_, x) => x !== i));
    // Also clean up tracked file for removed index
    if (["members", "gallery", "clients"].includes(k)) {
      setFiles((p) => {
        const updated = { ...p[k] };
        delete updated[i];
        // Re-index keys above removed index
        const reindexed = {};
        Object.entries(updated).forEach(([idx, file]) => {
          const n = parseInt(idx);
          reindexed[n > i ? n - 1 : n] = file;
        });
        return { ...p, [k]: reindexed };
      });
    }
  };
  const updArr = (k, i, key, val) =>
    set(k, form[k].map((item, x) => x === i ? (key === null ? val : { ...item, [key]: val }) : item));

  // Store a nested image file (members, gallery, clients)
  const setNestedFile = (arrayKey, index, file) => {
    setFiles((p) => ({ ...p, [arrayKey]: { ...p[arrayKey], [index]: file } }));
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    const companyId = form._id || company?._id;
    if (!companyId) {
      toast.error("No company ID found. Please log in.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // ── Top-level image files ──
      if (files.logo)   formData.append("logo", files.logo);
      if (files.banner) formData.append("banner", files.banner);

      // ── Nested image files ──
      // members[i].image  → field name: "member_image_0", "member_image_1", …
      Object.entries(files.members).forEach(([idx, file]) => {
        formData.append(`member_image_${idx}`, file);
      });

      // gallery[i].imageUrl → field name: "gallery_image_0", …
      Object.entries(files.gallery).forEach(([idx, file]) => {
        formData.append(`gallery_image_${idx}`, file);
      });

      // clients[i].logo → field name: "client_logo_0", …
      Object.entries(files.clients).forEach(([idx, file]) => {
        formData.append(`client_logo_${idx}`, file);
      });

      // ── JSON/text payload ──
      const payload = {
        companyName:   form.companyName,
        tagline:       form.tagline,
        about:         form.about,
        industry:      form.industry,
        companySize:   form.companySize,
        employeeCount: form.employeeCount,
        foundedYear:   form.foundedYear,
        website:       form.website,
        tags:          form.tags,
        businessPark:  form.businessPark,
        layout:        form.layout,
        address:       form.address,
        contacts:      form.contacts,
        members:       form.members,
        services:      form.services,
        projects:      form.projects,
        gallery:       form.gallery,
        clients:       form.clients,
        mapEmbedLink:  form.mapEmbedLink,
      };

      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value ?? "");
        }
      });

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      console.log("Files state:", files);
      console.log("-----------------------------");
      const { data } = await axios.patch(
        `${API_BASE}/companies/update/${companyId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // ← ADD THIS
          },
        }
      );

      updateCompany(data.company);
      setForm((prev) => ({ ...prev, ...data.company }));

      // Clear tracked files after successful save
      setFiles({ logo: null, banner: null, members: {}, gallery: {}, clients: {} });

      toast.success("Profile updated successfully!");
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
        .cpf * { box-sizing: border-box; font-family: 'DM Sans', system-ui, sans-serif; }
        .cpf-serif { font-family: 'Lora', Georgia, serif; }
        .tabs-scroll::-webkit-scrollbar { display: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
        .fade-up { animation: fadeUp 0.28s ease both; }
        @keyframes toastIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:none; } }
        .animate-toast { animation: toastIn 0.25s ease both; }
      `}</style>

      <Toast toasts={toast.toasts} />

      <div className="cpf min-h-screen bg-[#f4f3f1]">

        {/* ── STICKY HEADER ── */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-zinc-100">
          <div className="max-w-2xl mx-auto px-4 pt-4 pb-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl overflow-hidden bg-zinc-100 border-2 border-white shadow flex-shrink-0 ring-2 ring-zinc-200 flex items-center justify-center">
                {form.logo
                  ? <img src={form.logo} alt="logo" className="w-full h-full object-cover" />
                  : <span className="text-xl">🏢</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="cpf-serif font-bold text-zinc-900 text-base leading-tight truncate">
                  {form.companyName || "Your Company"}
                </p>
                <p className="text-xs text-zinc-400 truncate">{form.tagline || "Add a tagline"}</p>
              </div>
              <div className="flex items-center gap-2 mr-1">
                <div className="w-20 h-1.5 bg-zinc-100 rounded-full overflow-hidden hidden sm:block">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: pColor }} />
                </div>
                <span className="text-[11px] font-bold" style={{ color: pColor }}>{progress}%</span>
              </div>
              <button type="button" onClick={handleSave} disabled={loading}
                className={`flex-shrink-0 flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-2xl transition-all
                  ${loading ? "bg-zinc-300 text-zinc-500 cursor-not-allowed" : "bg-zinc-900 hover:bg-zinc-700 text-white active:scale-95"}`}>
                {loading
                  ? <><span className="inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving</>
                  : "Save"}
              </button>
            </div>

            {/* Tabs */}
            <div className="tabs-scroll flex overflow-x-auto gap-0.5">
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
        <div className="max-w-2xl mx-auto px-4 py-5 space-y-4 fade-up" key={tab}>

          {/* ── BRANDING ── */}
          {tab === "branding" && (
            <>
              <Card>
                <CardTitle>Logo & Banner</CardTitle>
                <div className="mb-4">
                  <label className={labelCls}>Cover Banner</label>
                  <button type="button" onClick={() => document.getElementById("banner-input").click()}
                    className="relative w-full h-32 rounded-2xl overflow-hidden bg-zinc-100 border-2 border-dashed border-zinc-300 hover:border-zinc-500 transition-all group">
                    {form.banner
                      ? <img src={form.banner} alt="banner" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-400 group-hover:text-zinc-600 transition-colors">
                          <span className="text-3xl">🖼</span>
                          <span className="text-xs font-semibold">Upload Cover Banner</span>
                        </div>}
                    {form.banner && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="text-white text-xs font-bold bg-black/50 px-3 py-1.5 rounded-lg">Change Banner</span>
                      </div>
                    )}
                  </button>
                  <input id="banner-input" type="file" accept="image/*" className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setFiles((p) => ({ ...p, banner: f }));
                        set("banner", URL.createObjectURL(f));
                      }
                    }} />
                </div>

                <div className="flex items-start gap-5">
                  <ImageUpload
                    value={form.logo}
                    onChange={(url) => set("logo", url)}
                    onFileChange={(f) => setFiles((p) => ({ ...p, logo: f }))}
                    label="Company Logo"
                    shape="round"
                    placeholder="🏢"
                  />
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className={labelCls}>Company Name</label>
                      <input className={inputCls} placeholder="Acme Technologies" value={form.companyName}
                        onChange={e => set("companyName", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Tagline</label>
                      <input className={inputCls} placeholder="Building the future, one line at a time" value={form.tagline}
                        onChange={e => set("tagline", e.target.value)} />
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <CardTitle>Tags</CardTitle>
                <p className="text-xs text-zinc-400 mb-3">Keywords that describe your company (helps with search)</p>
                {form.tags.some(t => t.trim()) && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.tags.filter(t => t.trim()).map((t, i) => (
                      <span key={i} className="bg-zinc-100 text-zinc-700 text-xs font-semibold px-3 py-1.5 rounded-full">{t}</span>
                    ))}
                  </div>
                )}
                <DynArray items={form.tags} placeholder="e.g. Software, IT, SaaS"
                  onAdd={(t) => addArr("tags", t)}
                  onRemove={(i) => remArr("tags", i)}
                  onUpdate={(i, _, v) => updArr("tags", i, null, v)} />
              </Card>
            </>
          )}

          {/* ── ABOUT ── */}
          {tab === "about" && (
            <>
              <Card>
                <CardTitle>Company Details</CardTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Industry</label>
                    <input className={inputCls} placeholder="e.g. Information Technology" value={form.industry}
                      onChange={e => set("industry", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Company Size</label>
                    <select className={inputCls} value={form.companySize} onChange={e => set("companySize", e.target.value)}>
                      <option value="">Select size</option>
                      {COMPANY_SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Website</label>
                    <input className={inputCls} type="url" placeholder="https://yourcompany.com" value={form.website}
                      onChange={e => set("website", e.target.value)} />
                  </div>
                </div>
              </Card>

              <Card>
                <CardTitle>About the Company</CardTitle>
                <textarea className={`${inputCls} resize-none min-h-36`}
                  placeholder="Tell your company's story — what you do, your mission, your culture…"
                  value={form.about} onChange={e => set("about", e.target.value)} />
                <p className="text-[11px] text-zinc-400 mt-1 text-right">{form.about.length} chars</p>
              </Card>
            </>
          )}

          {/* ── LOCATION ── */}
          {tab === "location" && (
            <>
              <Card>
                <CardTitle>Park</CardTitle>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BUSINESS_PARKS.map((bp) => (
                    <button key={bp} type="button" onClick={() => set("businessPark", bp)}
                      className={`p-3 rounded-2xl border-2 text-sm font-semibold text-left transition-all
                        ${form.businessPark === bp
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 hover:border-zinc-400 bg-white text-zinc-700"}`}>
                      {bp}
                    </button>
                  ))}
                </div>
              </Card>

              <Card>
                <CardTitle>Address</CardTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { k: "building", l: "Building / Floor",  p: "Tower A, 3rd Floor",   full: true },
                    { k: "street",   l: "Street",            p: "MG Road",              full: true },
                    { k: "city",     l: "City",              p: "Kochi" },
                    { k: "state",    l: "State",             p: "Kerala" },
                    { k: "pincode",  l: "Pincode",           p: "682030" },
                    { k: "country",  l: "Country",           p: "India" },
                  ].map(f => (
                    <div key={f.k} className={f.full ? "sm:col-span-2" : ""}>
                      <label className={labelCls}>{f.l}</label>
                      <input className={inputCls} placeholder={f.p}
                        value={form.address[f.k] || ""}
                        onChange={e => setNested("address", f.k, e.target.value)} />
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardTitle>Map Embed</CardTitle>
                <label className={labelCls}>Google Maps Embed URL</label>
                <input className={inputCls} placeholder="https://maps.google.com/maps?..." value={form.mapEmbedLink}
                  onChange={e => set("mapEmbedLink", e.target.value)} />
                {form.mapEmbedLink && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-zinc-100" style={{ height: 180 }}>
                    <iframe src={form.mapEmbedLink} width="100%" height="180" style={{ border: 0 }} allowFullScreen loading="lazy" title="map" />
                  </div>
                )}
              </Card>
            </>
          )}

          {/* ── TEAM ── */}
          {tab === "team" && (
            <Card>
              <CardTitle>Team Members</CardTitle>
              <DynArray
                items={form.members}
                template={{ name: "", position: "", image: "", url: "" }}
                fields={[
                  { key: "image",    label: "Photo",       type: "image" },
                  { key: "name",     label: "Name",        placeholder: "Jane Doe" },
                  { key: "position", label: "Position",    placeholder: "Chief Executive Officer" },
                  { key: "url",      label: "Profile URL", placeholder: "https://linkedin.com/in/…", full: true },
                ]}
                onAdd={(t) => addArr("members", t)}
                onRemove={(i) => remArr("members", i)}
                onUpdate={(i, k, v) => updArr("members", i, k, v)}
                // ← wire nested file tracking
                onFileChange={(i, _key, file) => setNestedFile("members", i, file)}
              />
            </Card>
          )}

          {/* ── SERVICES ── */}
          {tab === "services" && (
            <Card>
              <CardTitle>Services Offered</CardTitle>
              <DynArray
                items={form.services}
                template={{ title: "", description: "" }}
                fields={[
                  { key: "title",       label: "Service Title",  placeholder: "e.g. Cloud Consulting" },
                  { key: "description", label: "Description",    placeholder: "What you deliver…", textarea: true, full: true },
                ]}
                onAdd={(t) => addArr("services", t)}
                onRemove={(i) => remArr("services", i)}
                onUpdate={(i, k, v) => updArr("services", i, k, v)}
              />
            </Card>
          )}

          {/* ── PROJECTS ── */}
          {tab === "projects" && (
            <Card>
              <CardTitle>Projects</CardTitle>
              <DynArray
                items={form.projects}
                template={{ name: "", description: "", link: "" }}
                fields={[
                  { key: "name",        label: "Project Name",  placeholder: "Project Alpha" },
                  { key: "description", label: "Description",   placeholder: "Short description...", textarea: true, full: true },
                  { key: "link",        label: "Project Link",  placeholder: "https://project.com", type: "url", full: true },
                ]}
                onAdd={(t) => addArr("projects", t)}
                onRemove={(i) => remArr("projects", i)}
                onUpdate={(i, k, v) => updArr("projects", i, k, v)}
              />
            </Card>
          )}

          {/* ── GALLERY ── */}
          {tab === "gallery" && (
            <Card>
              <CardTitle>Photo Gallery</CardTitle>
              <p className="text-xs text-zinc-400 mb-4">Showcase your office, events, culture photos</p>
              <div className="space-y-3">
                {form.gallery.map((item, i) => (
                  <div key={i} className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 relative">
                    <div className="flex gap-4 items-start">
                      <button type="button" onClick={() => document.getElementById(`gallery-img-${i}`).click()}
                        className="relative flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden bg-zinc-200 border-2 border-dashed border-zinc-300 hover:border-zinc-500 transition-all group">
                        {item.imageUrl
                          ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-zinc-400 group-hover:text-zinc-600 text-2xl">🖼</div>}
                      </button>
                      {/* Gallery file input — stores file + preview URL */}
                      <input id={`gallery-img-${i}`} type="file" accept="image/*" className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            updArr("gallery", i, "imageUrl", URL.createObjectURL(f));
                            setNestedFile("gallery", i, f);
                          }
                        }} />
                      <div className="flex-1">
                        <label className={labelCls}>Caption</label>
                        <input className={inputCls} placeholder="e.g. Team outing 2024"
                          value={item.caption || ""} onChange={e => updArr("gallery", i, "caption", e.target.value)} />
                      </div>
                    </div>
                    {form.gallery.length > 1 && (
                      <button type="button" onClick={() => remArr("gallery", i)}
                        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-zinc-200 hover:bg-red-100 text-zinc-400 hover:text-red-400 text-xs flex items-center justify-center transition-colors">✕</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addArr("gallery", { imageUrl: "", caption: "" })}
                  className="w-full py-3 text-sm font-semibold text-zinc-400 hover:text-zinc-600 border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-2xl transition-all">
                  + Add Photo
                </button>
              </div>
            </Card>
          )}

          {/* ── CLIENTS ── */}
          {tab === "clients" && (
            <Card>
              <CardTitle>Clients & Partners</CardTitle>
              <DynArray
                items={form.clients}
                template={{ name: "", logo: "", website: "" }}
                fields={[
                  { key: "logo",    label: "Logo",    type: "image" },
                  { key: "name",    label: "Name",    placeholder: "Google Inc." },
                  { key: "website", label: "Website", placeholder: "https://google.com" },
                ]}
                onAdd={(t) => addArr("clients", t)}
                onRemove={(i) => remArr("clients", i)}
                onUpdate={(i, k, v) => updArr("clients", i, k, v)}
                // ← wire nested file tracking
                onFileChange={(i, _key, file) => setNestedFile("clients", i, file)}
              />
            </Card>
          )}

          {/* ── CONTACT ── */}
          {tab === "contact" && (
            <Card>
              <CardTitle>Contact & Social Links</CardTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { k: "email",     l: "Email",       p: "hello@company.com",     icon: "✉" },
                  { k: "phone",     l: "Phone",       p: "+91 98765 43210",        icon: "☎" },
                  { k: "whatsapp",  l: "WhatsApp",    p: "+91 98765 43210",        icon: "💬" },
                  { k: "website",   l: "Website",     p: "https://company.com",    icon: "🌐" },
                  { k: "linkedin",  l: "LinkedIn",    p: "linkedin.com/company/…", icon: "in" },
                  { k: "instagram", l: "Instagram",   p: "@yourcompany",           icon: "📷" },
                  { k: "facebook",  l: "Facebook",    p: "facebook.com/…",         icon: "f" },
                  { k: "twitter",   l: "Twitter / X", p: "@yourcompany",           icon: "𝕏" },
                  { k: "youtube",   l: "YouTube",     p: "youtube.com/@…",         icon: "▶" },
                ].map(f => (
                  <div key={f.k}>
                    <label className={labelCls}>
                      <span className="mr-1 text-zinc-600">{f.icon}</span> {f.l}
                    </label>
                    <input className={inputCls} placeholder={f.p}
                      value={f.k === "website" ? form.website : (form.contacts?.[f.k] || "")}
                      onChange={e => f.k === "website" ? set("website", e.target.value) : setNested("contacts", f.k, e.target.value)} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ── SETTINGS / LAYOUT ── */}
          {tab === "settings" && (
            <Card>
              <CardTitle>Company Page Layout</CardTitle>
              <p className="text-xs text-zinc-400 mb-4">Choose how your public company profile looks</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 1, icon: "📄", name: "Classic",  desc: "Professional" },
                  { id: 2, icon: "🎨", name: "Modern",   desc: "Bold & fresh" },
                  { id: 3, icon: "◻",  name: "Minimal",  desc: "Less is more" },
                ].map((l) => (
                  <button key={l.id} type="button" onClick={() => set("layout", l.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all
                      ${form.layout === l.id
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 hover:border-zinc-400 bg-white"}`}>
                    <div className="text-2xl mb-2">{l.icon}</div>
                    <div className="font-bold text-sm">{l.name}</div>
                    <div className="text-xs mt-0.5 text-zinc-400">{l.desc}</div>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* ── Bottom CTA ── */}
          <div className="flex items-center justify-between pt-2 pb-8">
            <p className="text-xs text-zinc-400">
              Profile <span className="font-bold" style={{ color: pColor }}>{progress}% complete</span>
            </p>
            <button type="button" onClick={handleSave} disabled={loading}
              className={`flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-2xl transition-all
                ${loading ? "bg-zinc-300 text-zinc-500 cursor-not-allowed" : "bg-zinc-900 hover:bg-zinc-700 text-white active:scale-95"}`}>
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