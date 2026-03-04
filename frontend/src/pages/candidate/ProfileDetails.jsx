import { useState, useRef, useEffect, useCallback } from "react";

/* ─── Theme ────────────────────────────────────────────────────────── */
const th = {
  bg:           "#f2f2ef",
  sidebar:      "#ffffff",
  sidebarBorder:"#e8e8e5",
  card:         "#ffffff",
  cardBorder:   "#e8e8e5",
  input:        "#f7f7f5",
  inputBorder:  "#e0e0dd",
  inputFocus:   "#111111",
  text:         "#111111",
  sub:          "#666666",
  muted:        "#aaaaaa",
  tag:          "#f5f5f2",
  tagBorder:    "#e5e5e2",
  divider:      "#efefec",
  danger:       "#fff0f0",
  dangerText:   "#dc2626",
  dangerBorder: "#fca5a5",
  accent:       "#111111",
  accentLight:  "#f0f0ee",
};

/* ─── Sections ─────────────────────────────────────────────────────── */
const SECTIONS = [
  { key: "basic",      label: "Basic Info",     icon: "👤", required: true },
  { key: "photo",      label: "Photo & CV",      icon: "🖼️" },
  { key: "about",      label: "About",           icon: "✏️" },
  { key: "tagline",    label: "Tagline",         icon: "💬" },
  { key: "skills",     label: "Skills",          icon: "⚡" },
  { key: "experience", label: "Experience",      icon: "💼" },
  { key: "education",  label: "Education",       icon: "🎓" },
  { key: "services",   label: "Services",        icon: "🛠️" },
  { key: "looking",    label: "Open to Roles",   icon: "🔍" },
];

/* ─── Layout Options ───────────────────────────────────────────────── */
const LAYOUTS = [
  {
    key: "dark",
    label: "Dark Brutalist",
    desc: "Bold dark theme",
    color: "#111",
    preview: (
      <svg viewBox="0 0 56 40" width="56" height="40" fill="none">
        <rect width="56" height="40" rx="4" fill="#111"/>
        <rect x="4" y="4" width="20" height="14" rx="2" fill="#1c1c1c"/>
        <rect x="28" y="4" width="24" height="3" rx="1" fill="#f5a623"/>
        <rect x="28" y="10" width="16" height="2" rx="1" fill="#444"/>
        <rect x="4" y="22" width="48" height="1" fill="#222"/>
        <rect x="4" y="26" width="22" height="2" rx="1" fill="#333"/>
        <rect x="4" y="31" width="16" height="2" rx="1" fill="#333"/>
        <rect x="30" y="26" width="22" height="2" rx="1" fill="#333"/>
        <rect x="30" y="31" width="14" height="2" rx="1" fill="#333"/>
      </svg>
    ),
  },
  {
    key: "swiss",
    label: "Swiss Editorial",
    desc: "Clean light magazine",
    color: "#D72B2B",
    preview: (
      <svg viewBox="0 0 56 40" width="56" height="40" fill="none">
        <rect width="56" height="40" rx="4" fill="#FDFAF4"/>
        <rect x="0" y="0" width="56" height="40" rx="4" fill="#F4F1EB"/>
        <rect x="4" y="4" width="24" height="32" rx="2" fill="#fff" stroke="#DDD8CF" strokeWidth="0.5"/>
        <rect x="32" y="4" width="20" height="14" rx="0" fill="#D72B2B"/>
        <rect x="32" y="20" width="20" height="2" rx="1" fill="#1A1714"/>
        <rect x="32" y="25" width="14" height="1.5" rx="0.75" fill="#C8C0B4"/>
        <rect x="32" y="29" width="18" height="1.5" rx="0.75" fill="#C8C0B4"/>
        <rect x="32" y="33" width="12" height="1.5" rx="0.75" fill="#C8C0B4"/>
        <rect x="6" y="8" width="10" height="10" rx="5" fill="#C8C0B4"/>
        <rect x="6" y="21" width="18" height="2" rx="1" fill="#1A1714"/>
        <rect x="6" y="26" width="14" height="1.5" rx="0.75" fill="#C8C0B4"/>
        <rect x="6" y="30" width="16" height="1.5" rx="0.75" fill="#C8C0B4"/>
      </svg>
    ),
  },
  {
    key: "aurora",
    label: "Aurora Glass",
    desc: "Modern dark glassmorphism",
    color: "#22d3ee",
    preview: (
      <svg viewBox="0 0 56 40" width="56" height="40" fill="none">
        <rect width="56" height="40" rx="4" fill="#050510"/>
        <ellipse cx="14" cy="10" rx="14" ry="10" fill="rgba(34,211,238,0.15)"/>
        <ellipse cx="44" cy="28" rx="16" ry="12" fill="rgba(168,85,247,0.12)"/>
        <circle cx="28" cy="14" r="7" fill="none" stroke="rgba(34,211,238,0.4)" strokeWidth="1"/>
        <circle cx="28" cy="14" r="5" fill="#0d0d20"/>
        <rect x="10" y="24" width="36" height="3" rx="1.5" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
        <rect x="10" y="30" width="16" height="2.5" rx="1.25" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"/>
        <rect x="30" y="30" width="16" height="2.5" rx="1.25" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"/>
        <rect x="10" y="35" width="22" height="2" rx="1" fill="rgba(34,211,238,0.2)"/>
      </svg>
    ),
  },
];

/* ─── Atomic Input Components (defined OUTSIDE parent to prevent remount) ── */

const inputBaseStyle = (focused) => ({
  width: "100%",
  padding: "10px 13px",
  borderRadius: 9,
  fontSize: 13,
  color: th.text,
  background: th.input,
  outline: "none",
  fontFamily: "inherit",
  border: `1.5px solid ${focused ? th.inputFocus : th.inputBorder}`,
  boxShadow: focused ? "0 0 0 3px rgba(0,0,0,0.06)" : "none",
  transition: "border-color 0.18s, box-shadow 0.18s",
  boxSizing: "border-box",
});

const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: th.muted,
  textTransform: "uppercase",
  letterSpacing: "0.09em",
  marginBottom: 5,
};

function TextInput({ label, value, onChange, placeholder, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && <label style={labelStyle}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={inputBaseStyle(focused)}
      />
    </div>
  );
}

function TextareaInput({ label, value, onChange, placeholder, rows = 4, maxLength = 500 }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && <label style={labelStyle}>{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputBaseStyle(focused),
          lineHeight: 1.75,
          resize: "vertical",
        }}
      />
      {maxLength && (
        <p style={{ fontSize: 11, color: th.muted, textAlign: "right", margin: "3px 0 0" }}>
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
}

function AddBtn({ onClick, label }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "8px 14px", borderRadius: 8,
        fontSize: 12, fontWeight: 600, cursor: "pointer",
        color: hov ? th.text : th.sub,
        background: "transparent",
        border: `1.5px dashed ${hov ? th.text : th.inputBorder}`,
        transition: "all 0.15s", fontFamily: "inherit",
      }}
    >
      <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> {label}
    </button>
  );
}

function RemoveBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 11px", borderRadius: 7, fontSize: 12, fontWeight: 700,
        color: th.dangerText, background: th.danger,
        border: `1px solid ${th.dangerBorder}`,
        cursor: "pointer", flexShrink: 0, lineHeight: 1, fontFamily: "inherit",
      }}
    >
      ✕
    </button>
  );
}

function FieldGroup({ children, index, label, onRemove, showRemove }) {
  return (
    <div style={{
      padding: 16, background: th.tag,
      borderRadius: 12, border: `1px solid ${th.tagBorder}`,
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: th.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {label} {index + 1}
        </span>
        {showRemove && <RemoveBtn onClick={onRemove} />}
      </div>
      {children}
    </div>
  );
}

/* ─── Animated Collapse ─────────────────────────────────────────────── */
function Collapse({ open, children }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(open ? "auto" : 0);
  const [show, setShow] = useState(open);

  useEffect(() => {
    if (open) {
      setShow(true);
      requestAnimationFrame(() => {
        if (ref.current) {
          setHeight(ref.current.scrollHeight);
          const t = setTimeout(() => setHeight("auto"), 340);
          return () => clearTimeout(t);
        }
      });
    } else {
      if (ref.current) setHeight(ref.current.scrollHeight);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setHeight(0);
          const t = setTimeout(() => setShow(false), 340);
          return () => clearTimeout(t);
        })
      );
    }
  }, [open]);

  return (
    <div style={{
      overflow: "hidden",
      height: typeof height === "number" ? `${height}px` : height,
      opacity: open ? 1 : 0,
      transition: "height 0.32s cubic-bezier(0.16,1,0.3,1), opacity 0.28s ease",
    }}>
      <div ref={ref}>{show && children}</div>
    </div>
  );
}

/* ─── Layout Picker ─────────────────────────────────────────────────── */
function LayoutPicker({ layout, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {LAYOUTS.map((l) => {
        const active = layout === l.key;
        return (
          <button
            key={l.key}
            onClick={() => onChange(l.key)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 10,
              cursor: "pointer", textAlign: "left", width: "100%",
              border: `1.5px solid ${active ? th.accent : th.inputBorder}`,
              background: active ? th.accent : th.card,
              transition: "all 0.2s", fontFamily: "inherit",
            }}
          >
            <div style={{ flexShrink: 0, opacity: active ? 1 : 0.55 }}>{l.preview}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: active ? "#fff" : th.text, marginBottom: 2 }}>
                {l.label}
              </div>
              <div style={{ fontSize: 11, color: active ? "rgba(255,255,255,0.55)" : th.muted }}>
                {l.desc}
              </div>
            </div>
            {active && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Section Panels ────────────────────────────────────────────────── */

function BasicSection({ form, setBasic, isMobile }) {
  const col = isMobile ? "1fr" : "1fr 1fr";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: col, gap: 12 }}>
        <TextInput label="Full Name"     value={form.name}          onChange={(v) => setBasic("name", v)}          placeholder="John Doe" />
        <TextInput label="Email"         value={form.email}         onChange={(v) => setBasic("email", v)}         placeholder="you@example.com" type="email" />
        <TextInput label="Phone"         value={form.phone}         onChange={(v) => setBasic("phone", v)}         placeholder="+91 98765 43210" />
        <TextInput label="Location"      value={form.place}         onChange={(v) => setBasic("place", v)}         placeholder="City, Country" />
        <TextInput label="Qualification" value={form.qualification} onChange={(v) => setBasic("qualification", v)} placeholder="e.g. B.Tech Computer Science" />
      </div>
    </div>
  );
}

function PhotoSection({ photo, cv, setPhoto, setCv }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <TextInput label="Profile Photo URL" value={photo} onChange={setPhoto} placeholder="https://example.com/photo.jpg" />
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: 14, background: th.tag, borderRadius: 12, border: `1px solid ${th.tagBorder}`,
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: "50%", overflow: "hidden",
          background: th.inputBorder, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {photo
            ? <img src={photo} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.target.style.display = "none")} />
            : <span style={{ fontSize: 22 }}>👤</span>
          }
        </div>
        <p style={{ fontSize: 12, color: photo ? th.sub : th.muted, margin: 0 }}>
          {photo ? "✓ Photo preview looks good!" : "Paste a URL above to see a preview"}
        </p>
      </div>
      <TextInput label="CV / Resume URL" value={cv} onChange={setCv} placeholder="https://drive.google.com/your-cv" />
      <p style={{ fontSize: 11, color: th.muted, margin: "-8px 0 0" }}>
        Link to your CV on Google Drive, Dropbox, or any public URL.
      </p>
    </div>
  );
}

function AboutSection({ about, setAbout }) {
  return (
    <TextareaInput
      label="Bio"
      value={about}
      onChange={setAbout}
      placeholder="Write a short bio about yourself, your background, and what you bring to the table…"
      rows={5}
      maxLength={600}
    />
  );
}

function TaglineSection({ tagline, setTagline }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <TextInput
        label="Tagline"
        value={tagline}
        onChange={setTagline}
        placeholder="e.g. Frontend Developer · Crafting delightful UIs"
      />
      <p style={{ fontSize: 11, color: th.muted, margin: 0 }}>
        A short one-liner shown below your name on your profile.
      </p>
    </div>
  );
}

function SkillsSection({ skills, setSkill, addSkill, removeSkill, isMobile }) {
  const col = isMobile ? "1fr" : "1fr 1fr";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: col, gap: 8 }}>
        {skills.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <TextInput value={s} onChange={(v) => setSkill(i, v)} placeholder={`Skill ${i + 1}, e.g. React`} />
            </div>
            {skills.length > 1 && <RemoveBtn onClick={() => removeSkill(i)} />}
          </div>
        ))}
      </div>
      <AddBtn onClick={addSkill} label="Add skill" />
    </div>
  );
}

function ExperienceSection({ experience, setExp, addExp, removeExp, isMobile }) {
  const col = isMobile ? "1fr" : "1fr 1fr";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {experience.map((exp, i) => (
        <FieldGroup key={i} index={i} label="Role" onRemove={() => removeExp(i)} showRemove={experience.length > 1}>
          <div style={{ display: "grid", gridTemplateColumns: col, gap: 10 }}>
            <TextInput label="Job Title" value={exp.jobTitle}  onChange={(v) => setExp(i, "jobTitle", v)}  placeholder="e.g. Frontend Developer" />
            <TextInput label="Company"   value={exp.company}   onChange={(v) => setExp(i, "company", v)}   placeholder="Company name" />
            <TextInput label="Start Date" value={exp.startDate} onChange={(v) => setExp(i, "startDate", v)} type="date" />
            {!exp.current && (
              <TextInput label="End Date" value={exp.endDate} onChange={(v) => setExp(i, "endDate", v)} type="date" />
            )}
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: th.sub, cursor: "pointer", userSelect: "none" }}>
            <input
              type="checkbox"
              checked={!!exp.current}
              onChange={(e) => setExp(i, "current", e.target.checked)}
              style={{ accentColor: "#111", width: 15, height: 15 }}
            />
            Currently working here
          </label>
        </FieldGroup>
      ))}
      <AddBtn onClick={addExp} label="Add another role" />
    </div>
  );
}

function EducationSection({ education, setEdu, addEdu, removeEdu, isMobile }) {
  const col = isMobile ? "1fr" : "1fr 1fr";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {education.map((edu, i) => (
        <FieldGroup key={i} index={i} label="Entry" onRemove={() => removeEdu(i)} showRemove={education.length > 1}>
          <div style={{ display: "grid", gridTemplateColumns: col, gap: 10 }}>
            <TextInput label="Degree / Level"  value={edu.education}   onChange={(v) => setEdu(i, "education", v)}   placeholder="e.g. B.Tech, High School" />
            <TextInput label="Institution"     value={edu.institution} onChange={(v) => setEdu(i, "institution", v)} placeholder="University or School name" />
            <TextInput label="Year"            value={edu.year}        onChange={(v) => setEdu(i, "year", v)}        placeholder="e.g. 2022" type="number" />
            <TextInput label="Score / Grade"   value={edu.percentage}  onChange={(v) => setEdu(i, "percentage", v)}  placeholder="e.g. 8.4 CGPA or 86%" />
          </div>
        </FieldGroup>
      ))}
      <AddBtn onClick={addEdu} label="Add another entry" />
    </div>
  );
}

function ServicesSection({ services, setService, addService, removeService, isMobile }) {
  const col = isMobile ? "1fr" : "1fr 1fr";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ fontSize: 12, color: th.sub, margin: 0 }}>
        Services or offerings you provide to clients or employers.
      </p>
      {services.map((svc, i) => (
        <FieldGroup key={i} index={i} label="Service" onRemove={() => removeService(i)} showRemove={services.length > 1}>
          <TextInput label="Service Heading" value={svc.heading}     onChange={(v) => setService(i, "heading", v)}     placeholder="e.g. UI/UX Design" />
          <TextareaInput label="Description" value={svc.description} onChange={(v) => setService(i, "description", v)} placeholder="What does this service include?" rows={2} maxLength={250} />
        </FieldGroup>
      ))}
      <AddBtn onClick={addService} label="Add service" />
    </div>
  );
}

function LookingSection({ looking, setRole, addRole, removeRole, isMobile }) {
  const col = isMobile ? "1fr" : "1fr 1fr";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <p style={{ fontSize: 12, color: th.sub, margin: 0 }}>
        Roles or opportunities you're currently open to.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: col, gap: 8 }}>
        {looking.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <TextInput value={r} onChange={(v) => setRole(i, v)} placeholder="e.g. Senior Frontend Developer" />
            </div>
            {looking.length > 1 && <RemoveBtn onClick={() => removeRole(i)} />}
          </div>
        ))}
      </div>
      <AddBtn onClick={addRole} label="Add role" />
    </div>
  );
}

/* ─── Section Card Wrapper ──────────────────────────────────────────── */
function SectionCard({ sectionKey, label, icon, cardRef, isMobile, children }) {
  return (
    <div
      ref={cardRef}
      style={{
        background: th.card,
        border: `1px solid ${th.cardBorder}`,
        borderRadius: 16,
        animation: "fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both",
        overflow: "hidden",
      }}
    >
      <div style={{
        padding: "14px 20px 12px",
        borderBottom: `1px solid ${th.divider}`,
        display: "flex", alignItems: "center", gap: 10,
        background: th.tag,
      }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h2 style={{ fontSize: 14, fontWeight: 800, color: th.text, margin: 0 }}>{label}</h2>
      </div>
      <div style={{ padding: isMobile ? 16 : 22 }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Mobile Toggle Row ─────────────────────────────────────────────── */
function MobileToggleRow({ sectionKey, label, icon, isOpen, onToggle, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button
        onClick={() => onToggle(sectionKey)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", padding: "13px 16px",
          borderRadius: isOpen ? "12px 12px 0 0" : 12,
          fontSize: 14, fontWeight: 600, cursor: "pointer",
          border: `1.5px solid ${isOpen ? th.accent : th.inputBorder}`,
          background: isOpen ? th.accent : th.card,
          color: isOpen ? "#fff" : th.sub,
          transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: isOpen ? "0 2px 12px rgba(0,0,0,0.12)" : "none",
          textAlign: "left", fontFamily: "inherit",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontSize: 16 }}>{icon}</span>
          <span>{label}</span>
        </div>
        <div style={{
          width: 22, height: 22, borderRadius: "50%",
          background: isOpen ? "rgba(255,255,255,0.15)" : th.tag,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.22s",
          transform: isOpen ? "rotate(45deg)" : "none",
          flexShrink: 0,
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={isOpen ? "#fff" : th.sub} strokeWidth="3" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
      </button>
      <Collapse open={isOpen}>
        <div style={{
          background: th.card,
          border: `1.5px solid ${th.accent}`,
          borderTop: "none",
          borderRadius: "0 0 12px 12px",
          padding: 16,
        }}>
          {children}
        </div>
      </Collapse>
    </div>
  );
}

/* ─── Save Button ───────────────────────────────────────────────────── */
function SaveButton({ onSave, loading, saved, mode, fullWidth }) {
  return (
    <button
      onClick={onSave}
      disabled={loading}
      style={{
        width: fullWidth ? "100%" : undefined,
        padding: fullWidth ? "11px 0" : "9px 24px",
        borderRadius: 9, fontSize: 13, fontWeight: 700,
        color: "#fff",
        background: saved ? "#22c55e" : loading ? "#555" : th.accent,
        border: "none", cursor: loading ? "not-allowed" : "pointer",
        transition: "background 0.3s",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        boxShadow: "0 2px 10px rgba(0,0,0,0.12)", fontFamily: "inherit",
      }}
    >
      {loading ? (
        <>
          <svg style={{ animation: "spin 0.8s linear infinite" }} width="13" height="13" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
            <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </svg>
          Saving…
        </>
      ) : saved ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Saved!
        </>
      ) : mode === "create" ? "Create Profile" : "Save Changes"}
    </button>
  );
}

/* ─── Main Form ─────────────────────────────────────────────────────── */
export default function ProfileFormPage({ mode = "create", initialData = null, onSubmit }) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [layout, setLayout] = useState(() => initialData?.layoutType || "dark");
  const [enabled, setEnabled] = useState(() =>
    new Set(mode === "edit" ? SECTIONS.map((s) => s.key) : ["basic"])
  );
  const [activeSection, setActiveSection] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mobileTab, setMobileTab] = useState("sections");

  const scrollRef = useRef(null);
  const sectionRefs = useRef({});
  const isScrollingTo = useRef(false);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  /* ── Form State ── */
  const [basic, setBasicState] = useState(() => ({
    name:          initialData?.name          || "",
    email:         initialData?.email         || "",
    phone:         initialData?.phone         || "",
    place:         initialData?.place         || "",
    qualification: initialData?.qualification || "",
  }));
  const [photo,    setPhoto]    = useState(() => initialData?.profilePhoto || "");
  const [cv,       setCv]       = useState(() => initialData?.cv           || "");
  const [about,    setAbout]    = useState(() => initialData?.about        || "");
  const [tagline,  setTagline]  = useState(() => initialData?.tagline      || "");
  const [skills,   setSkillsState]   = useState(() => initialData?.skills?.length    ? initialData.skills    : [""]);
  const [looking,  setLookingState]  = useState(() => initialData?.lookingVacancy?.length ? initialData.lookingVacancy : [""]);
  const [experience, setExperienceState] = useState(() =>
    initialData?.experience?.length
      ? initialData.experience.map((e) => ({ ...e, current: !e.endDate }))
      : [{ jobTitle: "", company: "", startDate: "", endDate: "", current: false }]
  );
  const [education, setEducationState] = useState(() =>
    initialData?.education?.length
      ? initialData.education
      : [{ education: "", institution: "", year: "", percentage: "" }]
  );
  const [services, setServicesState] = useState(() =>
    initialData?.services?.length
      ? initialData.services
      : [{ heading: "", description: "" }]
  );

  /* ── Setters ── */
  const setBasic = useCallback((k, v) => setBasicState((p) => ({ ...p, [k]: v })), []);

  const setSkill    = useCallback((i, v) => setSkillsState((p)    => { const a = [...p]; a[i] = v; return a; }), []);
  const addSkill    = useCallback(()      => setSkillsState((p)    => [...p, ""]), []);
  const removeSkill = useCallback((i)     => setSkillsState((p)    => p.length > 1 ? p.filter((_, x) => x !== i) : [""]), []);

  const setRole     = useCallback((i, v) => setLookingState((p)   => { const a = [...p]; a[i] = v; return a; }), []);
  const addRole     = useCallback(()      => setLookingState((p)   => [...p, ""]), []);
  const removeRole  = useCallback((i)     => setLookingState((p)   => p.length > 1 ? p.filter((_, x) => x !== i) : [""]), []);

  const setExp      = useCallback((i, k, v) => setExperienceState((p) => { const a = [...p]; a[i] = { ...a[i], [k]: v }; return a; }), []);
  const addExp      = useCallback(()         => setExperienceState((p) => [...p, { jobTitle: "", company: "", startDate: "", endDate: "", current: false }]), []);
  const removeExp   = useCallback((i)        => setExperienceState((p) => p.filter((_, x) => x !== i)), []);

  const setEdu      = useCallback((i, k, v) => setEducationState((p) => { const a = [...p]; a[i] = { ...a[i], [k]: v }; return a; }), []);
  const addEdu      = useCallback(()         => setEducationState((p) => [...p, { education: "", institution: "", year: "", percentage: "" }]), []);
  const removeEdu   = useCallback((i)        => setEducationState((p) => p.filter((_, x) => x !== i)), []);

  const setService    = useCallback((i, k, v) => setServicesState((p) => { const a = [...p]; a[i] = { ...a[i], [k]: v }; return a; }), []);
  const addService    = useCallback(()         => setServicesState((p) => [...p, { heading: "", description: "" }]), []);
  const removeService = useCallback((i)        => setServicesState((p) => p.filter((_, x) => x !== i)), []);

  /* ── Sidebar nav ── */
  const scrollTo = useCallback((key) => {
    isScrollingTo.current = true;
    setActiveSection(key);
    setTimeout(() => {
      const el = sectionRefs.current[key];
      const container = scrollRef.current;
      if (el && container) container.scrollTo({ top: el.offsetTop - 20, behavior: "smooth" });
      setTimeout(() => { isScrollingTo.current = false; }, 700);
    }, 50);
  }, []);

  const toggleEnabled = useCallback((key) => {
    if (key === "basic") return;
    setEnabled((prev) => {
      const n = new Set(prev);
      if (n.has(key)) {
        n.delete(key);
        if (activeSection === key) setActiveSection("basic");
      } else {
        n.add(key);
        setTimeout(() => scrollTo(key), 120);
      }
      return n;
    });
  }, [activeSection, scrollTo]);

  const handleScroll = useCallback(() => {
    if (isScrollingTo.current) return;
    const container = scrollRef.current;
    if (!container) return;
    const scrollTop = container.scrollTop;
    const active = SECTIONS.filter((s) => enabled.has(s.key));
    let current = active[0]?.key;
    for (const s of active) {
      const el = sectionRefs.current[s.key];
      if (el && el.offsetTop - 60 <= scrollTop) current = s.key;
    }
    if (current) setActiveSection(current);
  }, [enabled]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* ── Save ── */
  const handleSave = useCallback(() => {
    setLoading(true);
    const payload = {
      ...basic,
      profilePhoto: photo,
      cv,
      about,
      tagline,
      layoutType: layout,
      skills:          skills.filter(Boolean),
      lookingVacancy:  looking.filter(Boolean),
      experience:      experience.map(({ current, ...e }) => ({ ...e, endDate: current ? null : e.endDate })),
      education,
      services,
    };
    if (onSubmit) {
      Promise.resolve(onSubmit(payload))
        .finally(() => { setLoading(false); setSaved(true); setTimeout(() => setSaved(false), 3000); });
    } else {
      setTimeout(() => {
        console.log("Profile payload:", payload);
        setLoading(false); setSaved(true); setTimeout(() => setSaved(false), 3000);
      }, 1200);
    }
  }, [basic, photo, cv, about, tagline, layout, skills, looking, experience, education, services, onSubmit]);

  /* ── Render section content ── */
  const renderSection = (key) => {
    switch (key) {
      case "basic":      return <BasicSection      form={basic}      setBasic={setBasic}        isMobile={isMobile} />;
      case "photo":      return <PhotoSection      photo={photo}     cv={cv}     setPhoto={setPhoto} setCv={setCv} />;
      case "about":      return <AboutSection      about={about}     setAbout={setAbout} />;
      case "tagline":    return <TaglineSection    tagline={tagline} setTagline={setTagline} />;
      case "skills":     return <SkillsSection     skills={skills}   setSkill={setSkill}   addSkill={addSkill}   removeSkill={removeSkill}   isMobile={isMobile} />;
      case "experience": return <ExperienceSection experience={experience} setExp={setExp} addExp={addExp} removeExp={removeExp} isMobile={isMobile} />;
      case "education":  return <EducationSection  education={education}  setEdu={setEdu} addEdu={addEdu} removeEdu={removeEdu} isMobile={isMobile} />;
      case "services":   return <ServicesSection   services={services}    setService={setService} addService={addService} removeService={removeService} isMobile={isMobile} />;
      case "looking":    return <LookingSection    looking={looking}  setRole={setRole} addRole={addRole} removeRole={removeRole} isMobile={isMobile} />;
      default:           return null;
    }
  };

  const activeSections = SECTIONS.filter((s) => enabled.has(s.key));
  const progress = Math.round((enabled.size / SECTIONS.length) * 100);

  const topBarHeight   = 58;
  const bottomBarHeight = isMobile ? 64 : 0;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: th.bg, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
        @keyframes spin   { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
        * { box-sizing: border-box; }
        textarea { font-family: inherit; }
        input[type=date]::-webkit-calendar-picker-indicator { opacity: 0.45; cursor: pointer; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 99px; }
        button { font-family: inherit; }
      `}</style>

      {/* ── TOP BAR (sticky) ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: th.sidebar,
        borderBottom: `1px solid ${th.sidebarBorder}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        height: topBarHeight,
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isMobile ? 17 : 20,
            fontWeight: 900, color: th.text, margin: 0, letterSpacing: "-0.02em",
          }}>
            {mode === "create" ? "Create Profile" : "Edit Profile"}
          </h1>
          {!isMobile && (
            <p style={{ fontSize: 11, color: th.muted, margin: "1px 0 0" }}>
              Toggle sections on the left · fill in your details · choose a layout
            </p>
          )}
        </div>
        {!isMobile && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{
              padding: "5px 12px", borderRadius: 8,
              background: th.tag, border: `1px solid ${th.tagBorder}`,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ fontSize: 11, color: th.muted, fontWeight: 600 }}>Layout:</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: th.text }}>
                {LAYOUTS.find((l) => l.key === layout)?.label}
              </span>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: LAYOUTS.find((l) => l.key === layout)?.color,
              }} />
            </div>
            <SaveButton onSave={handleSave} loading={loading} saved={saved} mode={mode} />
          </div>
        )}
      </div>

      {/* ── BODY: sidebar + content side by side ── */}
      {!isMobile ? (
        <div style={{ display: "flex", alignItems: "flex-start" }}>

          {/* SIDEBAR — sticky, scrolls independently */}
          <div style={{
            width: 236, flexShrink: 0,
            position: "sticky", top: topBarHeight,
            height: `calc(100vh - ${topBarHeight}px)`,
            overflowY: "auto",
            background: th.sidebar,
            borderRight: `1px solid ${th.sidebarBorder}`,
            display: "flex", flexDirection: "column",
          }}>
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 10px 8px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: th.muted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 6px 10px" }}>
                Sections
              </p>

              {SECTIONS.map(({ key, label, icon, required }) => {
                const isEnabled = enabled.has(key);
                const isActive  = activeSection === key && isEnabled;
                return (
                  <div
                    key={key}
                    onClick={() => isEnabled && scrollTo(key)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "9px 10px", borderRadius: 9, marginBottom: 2,
                      cursor: isEnabled ? "pointer" : "default",
                      background: isActive ? th.accentLight : "transparent",
                      transition: "background 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <div style={{ width: 3, height: 18, borderRadius: 99, background: isActive ? th.accent : "transparent", flexShrink: 0 }} />
                      <span style={{ fontSize: 14 }}>{icon}</span>
                      <span style={{
                        fontSize: 13, fontWeight: isActive ? 700 : 500,
                        color: isEnabled ? (isActive ? th.text : th.sub) : th.muted,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {label}
                      </span>
                    </div>
                    {!required && (
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleEnabled(key); }}
                        style={{
                          width: 22, height: 22, borderRadius: "50%",
                          border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: isEnabled ? th.accent : th.tag,
                          color: isEnabled ? "#fff" : th.sub,
                          fontSize: 16, lineHeight: 1, flexShrink: 0,
                          transition: "all 0.18s", padding: 0,
                        }}
                      >
                        {isEnabled ? "−" : "+"}
                      </button>
                    )}
                  </div>
                );
              })}

              <div style={{ height: 1, background: th.divider, margin: "12px 8px" }} />

              <p style={{ fontSize: 10, fontWeight: 700, color: th.muted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 6px 10px" }}>
                Profile Layout
              </p>
              <LayoutPicker layout={layout} onChange={setLayout} />
            </div>

            {/* Progress pinned to bottom of sidebar */}
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${th.divider}`, flexShrink: 0, background: th.sidebar }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: th.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Profile complete
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: th.text }}>{progress}%</span>
              </div>
              <div style={{ height: 4, background: th.inputBorder, borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 99, background: th.accent,
                  width: `${progress}%`, transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)",
                }} />
              </div>
            </div>
          </div>

          {/* MAIN CONTENT — natural block flow, page itself scrolls */}
          <div
            ref={scrollRef}
            style={{ flex: 1, padding: "24px 28px 60px", minWidth: 0 }}
          >
            {activeSections.map(({ key, label, icon }) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <SectionCard
                  sectionKey={key}
                  label={label}
                  icon={icon}
                  cardRef={(el) => { sectionRefs.current[key] = el; }}
                  isMobile={false}
                >
                  {renderSection(key)}
                </SectionCard>
              </div>
            ))}

            {enabled.size === 1 && (
              <div style={{ textAlign: "center", padding: "60px 24px", color: th.muted }}>
                <p style={{ fontSize: 36, margin: "0 0 12px" }}>👈</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: th.sub, margin: "0 0 6px" }}>Add more sections</p>
                <p style={{ fontSize: 13 }}>Use the + buttons in the sidebar to build out your profile.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── MOBILE ── */
        <div style={{ padding: "14px 14px", paddingBottom: bottomBarHeight + 16 }}>
          {/* Tab bar */}
          <div style={{
            display: "flex", background: th.card, borderRadius: 12,
            padding: 4, border: `1px solid ${th.cardBorder}`, gap: 4,
            marginBottom: 14,
          }}>
            {[
              { key: "sections", label: "📋  Sections" },
              { key: "layout",   label: "🎨  Layout"   },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setMobileTab(key)}
                style={{
                  flex: 1, padding: "9px", borderRadius: 9,
                  fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
                  background: mobileTab === key ? th.accent : "transparent",
                  color: mobileTab === key ? "#fff" : th.sub,
                  transition: "all 0.18s",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {mobileTab === "layout" && (
            <div style={{ background: th.card, borderRadius: 16, border: `1px solid ${th.cardBorder}`, padding: 16 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: th.muted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px" }}>
                Choose Profile Layout
              </p>
              <LayoutPicker layout={layout} onChange={setLayout} />
            </div>
          )}

          {mobileTab === "sections" && (
            <>
              <div style={{ marginBottom: 12 }}>
                <SectionCard sectionKey="basic" label="Basic Info" icon="👤" isMobile cardRef={(el) => { sectionRefs.current["basic"] = el; }}>
                  <BasicSection form={basic} setBasic={setBasic} isMobile />
                </SectionCard>
              </div>

              <p style={{ fontSize: 11, fontWeight: 700, color: th.muted, textTransform: "uppercase", letterSpacing: "0.09em", margin: "0 2px 10px" }}>
                Optional Sections
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {SECTIONS.filter((s) => !s.required).map(({ key, label, icon }) => (
                  <MobileToggleRow
                    key={key}
                    sectionKey={key}
                    label={label}
                    icon={icon}
                    isOpen={enabled.has(key)}
                    onToggle={toggleEnabled}
                  >
                    {renderSection(key)}
                  </MobileToggleRow>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── MOBILE BOTTOM BAR (fixed) ── */}
      {isMobile && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: th.sidebar,
          borderTop: `1px solid ${th.sidebarBorder}`,
          padding: "10px 16px",
          display: "flex", gap: 10, zIndex: 100,
          boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
        }}>
          <button style={{
            flex: 1, padding: "11px", borderRadius: 9, fontSize: 13, fontWeight: 600,
            color: th.sub, background: "transparent",
            border: `1.5px solid ${th.cardBorder}`, cursor: "pointer",
          }}>
            Cancel
          </button>
          <div style={{ flex: 2 }}>
            <SaveButton onSave={handleSave} loading={loading} saved={saved} mode={mode} fullWidth />
          </div>
        </div>
      )}
    </div>
  );
}