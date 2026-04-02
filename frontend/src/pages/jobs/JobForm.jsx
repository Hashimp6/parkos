import { useState } from "react";
import { useCompany } from "../../context/CompanyContext";
import axios from "axios";
import API_BASE from "../../../config";
import { useLocation, useNavigate } from "react-router-dom";
const BUSINESS_PARKS = [
  "Cyberpark",
  "Technopark",
  "Infopark",
  "Smart City",
  "KINFRA Tech Park",
  "Business Park",
  "SEZ",
  "Other"
];
const INITIAL_FORM = {
  role: "", department: "", jobCode: "", description: "",
  skills: [], skillInput: "",
  salary: "",  currency: "INR",
  jobType: "Full-time", workMode: "On-site",
  experienceRequired: "", location: "",
  businessPark: "Other",
  openings: 1, lastDateToApply: "", isActive: true,
};

const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract"];
const WORK_MODES = ["Remote", "On-site", "Hybrid"];
const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED"];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Figtree:wght@300;400;500;600&display=swap');

  :root {
    --black: #0a0a0a;
    --white: #ffffff;
    --grey-1: #f7f7f7;
    --grey-2: #efefef;
    --grey-3: #d4d4d4;
    --grey-4: #a3a3a3;
    --grey-5: #525252;
    --radius: 16px;
  }

  .jf-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .jf-root { font-family: 'Figtree', sans-serif; }

  .jf-page {
    min-height: 100vh;
    background-color: #f4f4f5;
    background-image:
      linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px);
    background-size: 40px 40px;
    padding: 48px 16px 80px;
  }

  .jf-header {
    background: var(--black);
    border-radius: var(--radius) var(--radius) 0 0;
    padding: 40px 44px 36px;
    position: relative;
    overflow: hidden;
  }
  .jf-header::before {
    content: '';
    position: absolute;
    right: -60px; top: -60px;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
    pointer-events: none;
  }
  .jf-header::after {
    content: '';
    position: absolute;
    right: 40px; bottom: -80px;
    width: 160px; height: 160px;
    border-radius: 50%;
    background: rgba(255,255,255,0.03);
    pointer-events: none;
  }
  .jf-header-eyebrow {
    font-family: 'Figtree', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    margin-bottom: 12px;
  }
  .jf-header-title {
    font-family: 'Syne', sans-serif;
    font-size: 42px;
    font-weight: 800;
    color: white;
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .jf-header-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.45);
    margin-top: 10px;
    font-weight: 400;
  }
  .jf-company-badge {
    position: absolute;
    top: 40px; right: 44px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 100px;
    padding: 6px 16px;
    font-size: 11px;
    font-weight: 600;
    color: rgba(255,255,255,0.7);
    letter-spacing: 0.05em;
  }

  .jf-body {
    background: white;
    border-radius: 0 0 var(--radius) var(--radius);
    padding: 0 44px 44px;
    border: 1px solid var(--grey-2);
    border-top: none;
  }

  .jf-section { padding: 36px 0 0; }

  .jf-section-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 28px;
    padding-bottom: 18px;
    border-bottom: 1.5px solid var(--grey-2);
  }
  .jf-section-num {
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 700;
    color: white;
    background: var(--black);
    width: 26px; height: 26px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .jf-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: var(--black);
    letter-spacing: 0.01em;
  }

  .jf-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--grey-4);
    margin-bottom: 8px;
  }
  .jf-label span { color: var(--black); margin-left: 2px; }

  .jf-input {
    width: 100%;
    background: var(--grey-1);
    border: 1.5px solid transparent;
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 14px;
    font-family: 'Figtree', sans-serif;
    color: var(--black);
    font-weight: 500;
    transition: all 0.2s;
    outline: none;
  }
  .jf-input::placeholder { color: var(--grey-3); font-weight: 400; }
  .jf-input:focus {
    background: white;
    border-color: var(--black);
    box-shadow: 0 0 0 4px rgba(10,10,10,0.06);
  }
  .jf-input:hover:not(:focus) { border-color: var(--grey-3); }
  textarea.jf-input { resize: none; line-height: 1.6; }
  select.jf-input { appearance: none; cursor: pointer; }

  .jf-pills { display: flex; flex-wrap: wrap; gap: 8px; }
  .jf-pill {
    padding: 9px 20px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Figtree', sans-serif;
    cursor: pointer;
    border: 1.5px solid var(--grey-2);
    background: var(--grey-1);
    color: var(--grey-5);
    transition: all 0.18s;
  }
  .jf-pill:hover { border-color: var(--grey-3); color: var(--black); }
  .jf-pill.active {
    background: var(--black);
    border-color: var(--black);
    color: white;
    box-shadow: 0 4px 12px rgba(10,10,10,0.18);
  }

  .jf-tag {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 14px;
    background: var(--grey-1);
    border: 1.5px solid var(--grey-2);
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    color: var(--black);
    transition: all 0.15s;
  }
  .jf-tag-x {
    background: none; border: none; cursor: pointer;
    color: var(--grey-4); font-size: 16px; line-height: 1;
    padding: 0; transition: color 0.15s; display: flex;
  }
  .jf-tag-x:hover { color: #ef4444; }

  .jf-toggle-track {
    width: 50px; height: 28px; border-radius: 100px;
    position: relative; transition: background 0.25s; flex-shrink: 0; cursor: pointer;
  }
  .jf-toggle-thumb {
    position: absolute; top: 3px; width: 22px; height: 22px;
    background: white; border-radius: 50%;
    box-shadow: 0 1px 6px rgba(0,0,0,0.2);
    transition: left 0.25s;
  }

  .jf-btn-primary {
    padding: 14px 32px;
    background: var(--black);
    color: white;
    border: none;
    border-radius: 12px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 4px 16px rgba(10,10,10,0.2);
  }
  .jf-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(10,10,10,0.25); }
  .jf-btn-primary:active { transform: translateY(0); }
  .jf-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  .jf-btn-ghost {
    padding: 14px 24px;
    background: transparent;
    color: var(--grey-5);
    border: 1.5px solid var(--grey-2);
    border-radius: 12px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .jf-btn-ghost:hover { border-color: var(--grey-3); color: var(--black); background: var(--grey-1); }

  .jf-btn-outline-sm {
    padding: 10px 18px;
    background: white;
    border: 1.5px solid var(--grey-2);
    border-radius: 10px;
    font-family: 'Figtree', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--black);
    cursor: pointer;
    transition: all 0.18s;
    flex-shrink: 0;
  }
  .jf-btn-outline-sm:hover { background: var(--black); color: white; border-color: var(--black); }

  .jf-error { font-size: 11px; color: #ef4444; margin-top: 6px; font-weight: 500; }
  .jf-hint { font-size: 11px; color: var(--grey-4); margin-top: 8px; }

  .jf-actions-bar {
    margin-top: 40px;
    padding-top: 32px;
    border-top: 1.5px solid var(--grey-2);
    display: flex; justify-content: flex-end; gap: 12px; align-items: center;
  }

  .jf-toast {
    position: fixed; top: 24px; right: 24px; z-index: 9999;
    background: white;
    border-radius: 14px;
    padding: 16px 20px;
    display: flex; align-items: center; gap: 12px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06);
    font-family: 'Figtree', sans-serif;
    font-size: 13px; font-weight: 600; color: var(--black);
    animation: toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes toastIn {
    from { transform: translateX(40px) scale(0.9); opacity: 0; }
    to { transform: translateX(0) scale(1); opacity: 1; }
  }
  .jf-toast-icon {
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; color: white; flex-shrink: 0;
  }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .field { margin-bottom: 20px; }
  .field:last-child { margin-bottom: 0; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin 0.8s linear infinite; }
`;

function Label({ children, required }) {
  return <label className="jf-label">{children}{required && <span>*</span>}</label>;
}
function FieldError({ msg }) {
  return msg ? <p className="jf-error">↑ {msg}</p> : null;
}
function PillToggle({ options, value, onChange }) {
  return (
    <div className="jf-pills">
      {options.map(opt => (
        <button key={opt} type="button"
          className={`jf-pill${value === opt ? " active" : ""}`}
          onClick={() => onChange(opt)}>{opt}</button>
      ))}
    </div>
  );
}
function SectionHeader({ num, title }) {
  return (
    <div className="jf-section-header">
      <span className="jf-section-num">{num}</span>
      <span className="jf-section-title">{title}</span>
    </div>
  );
}

export default function JobForm({ onSuccess, onCancel }) {
  const { company } = useCompany();
  const location = useLocation();
  const initialData = location.state?.job || null;
  const navigate = useNavigate();
  const [form, setForm] = useState(
    initialData ? {
      ...INITIAL_FORM, ...initialData,
      skills: initialData.skills || [],
      skillInput: "",
      lastDateToApply: initialData.lastDateToApply
        ? new Date(initialData.lastDateToApply).toISOString().split("T")[0] : "",
    } : INITIAL_FORM
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  console.log("cmmmee",company);
  const set = (field, value) => {
    if (field === "applyDays") {
      const today = new Date();
      const lastDate = new Date(today);
      lastDate.setDate(today.getDate() + Number(value));
  
      setForm((prev) => ({
        ...prev,
        applyDays: value,
        lastDateToApply: lastDate.toISOString().split("T")[0],
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };
  const addSkill = () => {
    const s = form.skillInput.trim();
    if (!s) return;
    if (form.skills.includes(s)) { setErrors(p => ({ ...p, skillInput: "Already added." })); return; }
    set("skills", [...form.skills, s]);
    set("skillInput", "");
  };
  const removeSkill = s => set("skills", form.skills.filter(x => x !== s));
  const onSkillKey = e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); } };
  const validate = () => {
    const e = {};
    if (!form.role.trim()) e.role = "Job role is required.";
    if (Number(form.openings) < 1) e.openings = "At least 1 opening required.";
    setErrors(e);
    return !Object.keys(e).length;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validate()) return;
  
    if (!company?._id) {
      showToast("Company not loaded yet", "error");
      return;
    }
  
    setLoading(true);
  
    try {
      console.log("cmmmee",company);
      
      const payload = {
        company: company._id,
        role: form.role.trim(),
        department: form.department.trim(),
        jobCode: form.jobCode.trim() || undefined,
        description: form.description.trim(),
        skills: form.skills,
        salary: Number(form.salary) || 0,
        currency: form.currency,
        jobType: form.jobType,
        workMode: form.workMode,
        experienceRequired: form.experienceRequired.trim(),
        location: form.location.trim(),
        openings: Number(form.openings),
        lastDateToApply: form.lastDateToApply || null,
        isActive: form.isActive,
        businessPark: form.businessPark,
      };
  
      const isEdit = !!initialData?._id;
  
      const res = isEdit
        ? await axios.put(`${API_BASE}/jobs/${initialData._id}`, payload)
        : await axios.post(`${API_BASE}/jobs`, payload);
  
      showToast(isEdit ? "Job updated!" : "Job posted successfully!");
  
      if (onSuccess) onSuccess(res.data.data);
      setTimeout(() => navigate("/company/Home"), 1400);
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jf-root">
      <style>{STYLES}</style>

      {toast && (
        <div className="jf-toast">
          <div className="jf-toast-icon" style={{ background: toast.type === "error" ? "#ef4444" : "#16a34a" }}>
            {toast.type === "error" ? "✕" : "✓"}
          </div>
          {toast.msg}
        </div>
      )}

      <div className="jf-page">
        <div style={{ maxWidth: 660, margin: "0 auto" }}>

        <div className="jf-header">


<p className="jf-header-eyebrow">
Hi-{company?.companyName}
</p>
<p className="jf-header-eyebrow">
  {initialData ? "Edit Listing" : "Create New Listing"}
</p>

<h1 className="jf-header-title">
  {initialData ? "Edit Job" : "Post a Job"}
</h1>

<p className="jf-header-sub">
  Fill in the details to publish your listing
</p>

</div>

          <div className="jf-body">
            <form onSubmit={handleSubmit}>

              <div className="jf-section">
                <SectionHeader num="1" title="Basic Information" />
                <div className="field">
                  <Label required>Job Title / Role</Label>
                  <input className="jf-input" placeholder="e.g. Senior Frontend Developer"
                    value={form.role} onChange={e => set("role", e.target.value)} />
                  <FieldError msg={errors.role} />
                </div>
                <div className="grid-2 field">
                  <div>
                    <Label>Department</Label>
                    <input className="jf-input" placeholder="e.g. Engineering"
                      value={form.department} onChange={e => set("department", e.target.value)} />
                  </div>
                 
                </div>
                <div className="field">
                  <Label>Description</Label>
                  <textarea className="jf-input" rows={5}
                    placeholder="Responsibilities, requirements, perks..."
                    value={form.description} onChange={e => set("description", e.target.value)} />
                </div>
              </div>

              <div className="jf-section">
                <SectionHeader num="2" title="Job Type & Work Mode" />
                <div className="field">
                  <Label>Job Type</Label>
                  <PillToggle options={JOB_TYPES} value={form.jobType} onChange={v => set("jobType", v)} />
                </div>
                <div className="field">
                  <Label>Work Mode</Label>
                  <PillToggle options={WORK_MODES} value={form.workMode} onChange={v => set("workMode", v)} />
                </div>
              </div>

              <div className="jf-section">
                <SectionHeader num="3" title="Required Skills" />
                <div className="field">
                  <Label>Add Skills</Label>
                  <div style={{ display: "flex", gap: 10 }}>
                    <input className="jf-input" placeholder="Type a skill, press Enter..."
                      value={form.skillInput}
                      onChange={e => set("skillInput", e.target.value)}
                      onKeyDown={onSkillKey}
                      style={{ flex: 1 }} />
                    <button type="button" className="jf-btn-outline-sm" onClick={addSkill}>Add</button>
                  </div>
                  <FieldError msg={errors.skillInput} />
                  {form.skills.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                      {form.skills.map(skill => (
                        <span key={skill} className="jf-tag">
                          {skill}
                          <button type="button" className="jf-tag-x" onClick={() => removeSkill(skill)}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="jf-section">
                <SectionHeader num="4" title="Salary Range" />
                <div className="grid-3 field">
                  <div>
                    <Label>Currency</Label>
                    <select className="jf-input" value={form.currency} onChange={e => set("currency", e.target.value)}>
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Minimum</Label>
                    <input className="jf-input"  placeholder="0" 
                      value={form.salary} onChange={e => set("salary", e.target.value)} />
                  </div>
                
                </div>
                <p className="jf-hint">Leave as 0 to keep salary undisclosed.</p>
              </div>

              <div className="jf-section">
                <SectionHeader num="5" title="Position Details" />
                <div className="grid-3 field">
                <div>
  <Label>Location</Label>
  <input
    className="jf-input"
    placeholder="e.g. Kochi, Kerala"
    value={form.location}
    onChange={e => set("location", e.target.value)}
  />
</div>

<div>
  <Label>Business Park</Label>
  <select
    className="jf-input"
    value={form.businessPark}
    onChange={e => set("businessPark", e.target.value)}
  >
    {BUSINESS_PARKS.map(p => (
      <option key={p} value={p}>{p}</option>
    ))}
  </select>
</div>


                  <div>
                    <Label>Experience</Label>
                    <input className="jf-input" placeholder="e.g. 3–5 years"
                      value={form.experienceRequired} onChange={e => set("experienceRequired", e.target.value)} />
                  </div>
                </div>
                <div className="grid-2 field">
                  <div>
                    <Label required>Openings</Label>
                    <input className="jf-input" type="number" min={1}
                      value={form.openings} onChange={e => set("openings", e.target.value)} />
                    <FieldError msg={errors.openings} />
                  </div>
                  <div>
  <Label>Application Duration</Label>
  <select
    className="jf-input"
    value={form.applyDays}
    onChange={(e) => set("applyDays", e.target.value)}
  >
    <option value="">Select days</option>
    <option value="1">1 Day</option>
    <option value="2">2 Days</option>
    <option value="3">3 Days</option>
    <option value="4">4 Days</option>
    <option value="5">5 Days</option>
    <option value="6">6 Days</option>
    <option value="7">7 Days</option>
  </select>
</div>
                </div>
              </div>

              <div className="jf-section">
                <SectionHeader num="6" title="Listing Status" />
                <div className="field">
                  <button type="button" onClick={() => set("isActive", !form.isActive)}
                    style={{
                      display: "flex", alignItems: "center", gap: 18,
                      background: form.isActive ? "#f0fdf4" : "#fafafa",
                      border: `1.5px solid ${form.isActive ? "#bbf7d0" : "#e5e7eb"}`,
                      borderRadius: 14, padding: "18px 22px", cursor: "pointer",
                      width: "100%", textAlign: "left", transition: "all 0.25s",
                    }}>
                    <div className="jf-toggle-track" style={{ background: form.isActive ? "#16a34a" : "#d4d4d4" }}>
                      <div className="jf-toggle-thumb" style={{ left: form.isActive ? 25 : 3 }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: form.isActive ? "#15803d" : "#525252", transition: "color 0.2s", marginBottom: 3 }}>
                        {form.isActive ? "Active — Accepting Applications" : "Inactive — Hidden from Candidates"}
                      </p>
                      <p style={{ fontSize: 12, color: "#a3a3a3" }}>Toggle anytime after posting.</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="jf-actions-bar">
                {onCancel && (
                  <button type="button" className="jf-btn-ghost" onClick={onCancel}>Cancel</button>
                )}
                <button type="submit" className="jf-btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      {initialData ? "Updating..." : "Posting..."}
                    </>
                  ) : (
                    <>
                      {initialData ? "Update Job" : "Post Job"}
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}