import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CATEGORIES = ["Web Development", "Design", "Backend", "Mobile", "Marketing", "Writing", "Data Science", "Other"];

const EMPTY_FORM = {
  title: "",
  category: "",
  price: "",
  place: "",
  description: "",
  skills: [],
  isActive: true,
  isPremium: false,
  workSamples: [],
};

// ─── Toggle ──────────────────────────────────────────────────


// ─── Section Wrapper ─────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 14,
        padding: "20px 20px",
        marginBottom: 14,
      }}
    >
      <p
        style={{
          fontSize: 10,
          color: "#9CA3AF",
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.12em",
          marginBottom: 16,
          textTransform: "uppercase",
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

// ─── Field ───────────────────────────────────────────────────
function Field({ label, children, half }) {
  return (
    <div style={{ flex: half ? "1 1 45%" : "1 1 100%", minWidth: 0 }}>
      <label
        style={{
          display: "block",
          fontSize: 10,
          color: "#9CA3AF",
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  border: "1px solid #E5E7EB",
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: 13,
  color: "#000",
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  background: "#fff",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

// ─── Main Form ───────────────────────────────────────────────
export default function FreelanceForm() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const service    = location.state?.service || null;
  const isEdit     = location.state?.isEdit  || false;

  const initial = isEdit && service
    ? {
        title:       service.title       || "",
        category:    service.category    || "Web Development",
        price:       service.price       || "",
        place:       service.place       || "",
        description: service.description || "",
        skills:      service.skills      || [],
        isActive:    service.isActive    ?? true,
        isPremium:   service.isPremium   ?? false,
        workSamples: service.workSamples || [],
      }
    : { ...EMPTY_FORM, skills: [], workSamples: [] };

  const [form,        setForm]        = useState(initial);
  const [skillInput,  setSkillInput]  = useState("");
  const [newSample,   setNewSample]   = useState({ title: "", description: "", link: "" });
  const [sampleErr,   setSampleErr]   = useState("");
  const [errors,      setErrors]      = useState({});
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  // ── Skills ──
  const addSkill = () => {
    const val = skillInput.trim();
    if (!val || form.skills.includes(val)) return;
    set("skills", [...form.skills, val]);
    setSkillInput("");
  };
  const removeSkill = (skill) =>
    set("skills", form.skills.filter((s) => s !== skill));

  // ── Work Samples ──
  const addSample = () => {
    if (!newSample.title.trim()) { setSampleErr("Title is required"); return; }
    if (!newSample.link.trim())  { setSampleErr("Link is required");  return; }
    set("workSamples", [...form.workSamples, { ...newSample }]);
    setNewSample({ title: "", description: "", link: "" });
    setSampleErr("");
  };
  const removeSample = (i) =>
    set("workSamples", form.workSamples.filter((_, idx) => idx !== i));

  // ── Validate & Save ──
  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = "Title is required";
    if (!form.price.trim())       e.price       = "Price is required";
    if (!form.description.trim()) e.description = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const result = {
      ...(isEdit && service ? service : {}),
      ...form,
      _id: isEdit && service ? service._id : Date.now().toString(),
      views:     isEdit && service ? service.views     : 0,
      clicks:    isEdit && service ? service.clicks    : 0,
      rating:    isEdit && service ? service.rating    : 0,
      createdAt: isEdit && service ? service.createdAt : new Date().toISOString(),
    };
    // TODO: replace with your API call / state update
    console.log("Saved:", result);
    navigate(-1);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus, textarea:focus, select:focus { border-color: #000 !important; }
      `}</style>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "36px 20px 60px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 28 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 11, color: "#9CA3AF",
              fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em",
              marginBottom: 14, padding: 0, display: "flex", alignItems: "center", gap: 5,
            }}
          >
            ← BACK
          </button>
          <p style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'DM Mono', monospace", letterSpacing: "0.14em", marginBottom: 4 }}>
            {isEdit ? "EDITING SERVICE" : "NEW SERVICE"}
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#000", fontFamily: "'Sora', sans-serif" }}>
            {isEdit ? "Edit service" : "Add a service"}
          </h1>
        </div>

        {/* ── Basic Info ── */}
        <Section title="Basic info">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Title *">
              <input
                style={{ ...inputStyle, borderColor: errors.title ? "#EF4444" : "#E5E7EB" }}
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Full-Stack Web App Development"
              />
              {errors.title && <p style={{ fontSize: 11, color: "#EF4444", marginTop: 4, fontFamily: "'DM Mono', monospace" }}>{errors.title}</p>}
            </Field>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Field label="Price *" half>
                <input
                  style={{ ...inputStyle, borderColor: errors.price ? "#EF4444" : "#E5E7EB" }}
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="starts ₹15,000"
                />
                {errors.price && <p style={{ fontSize: 11, color: "#EF4444", marginTop: 4, fontFamily: "'DM Mono', monospace" }}>{errors.price}</p>}
              </Field>
              <Field label="Category" half>
  <div style={{ position: "relative" }}>
    
    {/* Selected */}
    <div
      onClick={() => setShowCategoryDropdown((prev) => !prev)}
      style={{
        ...inputStyle,
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ color: form.category ? "#000" : "#9CA3AF" }}>
        {form.category || "Select category"}
      </span>
      <span style={{ fontSize: 12 }}>▾</span>
    </div>

    {/* Dropdown */}
    {showCategoryDropdown && (
      <div
        style={{
          position: "absolute",
          top: "110%",
          left: 0,
          right: 0,
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 10,
          zIndex: 1000,
          maxHeight: 260,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 🔍 Search */}
        <input
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
          placeholder="Search category..."
          style={{
            padding: "10px",
            border: "none",
            borderBottom: "1px solid #F3F4F6",
            outline: "none",
            fontSize: 12,
            fontFamily: "'DM Sans', sans-serif",
          }}
        />

        {/* List */}
        <div style={{ overflowY: "auto" }}>
          {CATEGORIES
            .filter((cat) =>
              cat.toLowerCase().includes(categorySearch.toLowerCase())
            )
            .map((cat, i) => (
              <div
                key={i}
                onClick={() => {
                  set("category", cat);
                  setShowCategoryDropdown(false);
                  setCategorySearch("");
                }}
                style={{
                  padding: "10px 12px",
                  cursor: "pointer",
                  fontSize: 13,
                  borderBottom: "1px solid #F9FAFB",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#F9FAFB")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#fff")
                }
              >
                {cat}
              </div>
            ))}

          {/* Empty state */}
          {CATEGORIES.filter((cat) =>
            cat.toLowerCase().includes(categorySearch.toLowerCase())
          ).length === 0 && (
            <div
              style={{
                padding: 12,
                fontSize: 12,
                color: "#9CA3AF",
                textAlign: "center",
              }}
            >
              No categories found
            </div>
          )}
        </div>
      </div>
    )}
  </div>
</Field>
            </div>

            <Field label="Location">
              <input
                style={inputStyle}
                value={form.place}
                onChange={(e) => set("place", e.target.value)}
                placeholder="Thiruvananthapuram, Kerala"
              />
            </Field>

            <Field label="Description *">
              <textarea
                style={{ ...inputStyle, resize: "vertical", minHeight: 90, lineHeight: 1.6, borderColor: errors.description ? "#EF4444" : "#E5E7EB" }}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe what you offer..."
              />
              {errors.description && <p style={{ fontSize: 11, color: "#EF4444", marginTop: 4, fontFamily: "'DM Mono', monospace" }}>{errors.description}</p>}
            </Field>
          </div>
        </Section>

        {/* ── Skills ── */}
        <Section title="Skills">
          {form.skills.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {form.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    background: "#F3F4F6", color: "#374151",
                    fontSize: 11.5, fontFamily: "'DM Mono', monospace",
                    padding: "4px 10px", borderRadius: 7,
                    border: "1px solid #E5E7EB",
                  }}
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 15, lineHeight: 1, padding: 0 }}
                  >×</button>
                </span>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
              placeholder="Add a skill and press Enter..."
            />
            <button
              onClick={addSkill}
              style={{
                padding: "10px 16px", background: "#F3F4F6",
                border: "1px solid #E5E7EB", borderRadius: 10,
                fontSize: 12, color: "#374151",
                fontFamily: "'DM Mono', monospace", cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >+ Add</button>
          </div>
        </Section>

        {/* ── Work Samples ── */}
        <Section title="Work samples">
          {form.workSamples.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              {form.workSamples.map((ws, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 14px", borderRadius: 10,
                    background: "#F9FAFB", border: "1px solid #E5E7EB", gap: 8,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#000", fontFamily: "'Sora', sans-serif", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ws.title}
                    </p>
                    <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0, fontFamily: "'DM Mono', monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ws.link}
                    </p>
                  </div>
                  <button
                    onClick={() => removeSample(i)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#D1D5DB", fontSize: 18, lineHeight: 1, flexShrink: 0 }}
                  >×</button>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              background: "#FAFAFA", border: "1px dashed #D1D5DB",
              borderRadius: 12, padding: 14,
              display: "flex", flexDirection: "column", gap: 8,
            }}
          >
            <input
              value={newSample.title}
              onChange={(e) => setNewSample((s) => ({ ...s, title: e.target.value }))}
              placeholder="Project title"
              style={{ ...inputStyle, fontSize: 12 }}
            />
            <input
              value={newSample.description}
              onChange={(e) => setNewSample((s) => ({ ...s, description: e.target.value }))}
              placeholder="Short description (optional)"
              style={{ ...inputStyle, fontSize: 12 }}
            />
            <input
              value={newSample.link}
              onChange={(e) => setNewSample((s) => ({ ...s, link: e.target.value }))}
              placeholder="https://link-to-project.com"
              style={{ ...inputStyle, fontSize: 12 }}
            />
            {sampleErr && (
              <p style={{ fontSize: 11, color: "#EF4444", margin: 0, fontFamily: "'DM Mono', monospace" }}>{sampleErr}</p>
            )}
            <button
              onClick={addSample}
              style={{
                alignSelf: "flex-start", padding: "7px 14px",
                border: "1px solid #D1D5DB", background: "#F3F4F6",
                color: "#374151", borderRadius: 8,
                fontSize: 11.5, fontFamily: "'DM Mono', monospace",
                cursor: "pointer", letterSpacing: "0.04em",
              }}
            >+ Add sample</button>
          </div>
        </Section>

  

      

        {/* ── Actions ── */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "11px 20px", background: "#fff",
              border: "1px solid #E5E7EB", color: "#6B7280",
              borderRadius: 10, fontSize: 13,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            }}
          >Cancel</button>
          <button
            onClick={handleSave}
            style={{
              padding: "11px 24px", background: "#000",
              border: "none", color: "#fff",
              borderRadius: 10, fontSize: 13,
              fontFamily: "'Sora', sans-serif", fontWeight: 700, cursor: "pointer",
            }}
          >
            {isEdit ? "Save changes" : "Add service"}
          </button>
        </div>

      </div>
    </div>
  );
}