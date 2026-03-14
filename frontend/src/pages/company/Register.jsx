import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCompany } from "../../context/CompanyContext";
import API_BASE from "../../../config";

export default function CompanyRegisterPage() {
  const navigate = useNavigate();
  const { loginCompany } = useCompany();
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.companyName.trim()) errs.companyName = "Company name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6) errs.password = "At least 6 characters.";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match.";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
  
    setErrors({});
  
    try {
      setLoading(true);
  
      const res = await axios.post(
        `${API_BASE}/companies/register`,
        {
          companyName: form.companyName,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }
      );
  console.log("comp det",res.data, res.data.token);
  
      // 🔥 Save to context + localStorage
      loginCompany(res.data.data, res.data.token);
  
      setLoading(false);
      setSuccess(true);
  
      setTimeout(() => navigate("/company/Home"), 1400);
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  const inputClass = (field) =>
    [
      "w-full rounded-xl px-4 py-3 text-sm text-black placeholder-gray-300 bg-gray-50 outline-none transition-all duration-200",
      errors[field]
        ? "border-[1.5px] border-red-400"
        : focused === field
        ? "border-[1.5px] border-black shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
        : "border-[1.5px] border-gray-200",
    ].join(" ");

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 p-4"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      <div
        className="w-full flex overflow-hidden"
        style={{
          maxWidth: 900,
          borderRadius: 28,
          boxShadow: "0 24px 80px rgba(0,0,0,0.13)",
          minHeight: 560,
          animation: "cardIn 0.7s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* ── RIGHT PANEL (image) — hidden on mobile ── */}
        <div
          className="right-panel relative overflow-hidden flex flex-col justify-between p-8"
          style={{
            flex: "1 1 340px",
            backgroundImage:
              "url('https://i.pinimg.com/736x/96/7f/62/967f62288140a4a2075aa097dcb1606b.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0" style={{ background: "rgba(255,255,255,0.18)" }} />
          <div className="relative" />
          <div className="relative">
            <h2
              className="text-2xl font-bold text-black leading-snug mb-4"
              style={{ letterSpacing: "-0.02em" }}
            >
              Get started today<br />and take control of<br />your business presence.
            </h2>
            <div className="flex items-start gap-3">
              <div className="w-0.5 h-10 bg-black rounded-full flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 leading-relaxed">
                Register your company and connect with talent across all business parks.
              </p>
            </div>
          </div>
        </div>

        {/* ── LEFT PANEL (form) ── */}
        <div
          className="bg-white flex flex-col justify-between p-8 sm:p-10"
          style={{ flex: "1 1 340px", minWidth: 0 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                stroke="black"
                strokeWidth="2"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span className="font-bold text-black text-lg tracking-tight">Park O S</span>
          </div>

          {/* Form area */}
          <div className="flex-1 flex flex-col justify-center py-6">
            <h1
              className="text-3xl font-bold text-black mb-1"
              style={{ letterSpacing: "-0.03em" }}
            >
              Create account
            </h1>
            <p className="text-sm text-gray-400 mb-6">
              Register your company to get started
            </p>

            {!success ? (
              <div className="flex flex-col gap-3">
                {/* Company Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Company Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={update("companyName")}
                    onFocus={() => setFocused("companyName")}
                    onBlur={() => setFocused(null)}
                    placeholder="Acme Inc."
                    className={inputClass("companyName")}
                  />
                  {errors.companyName && (
                    <p className="text-xs text-red-400 mt-1">{errors.companyName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="you@company.com"
                    className={inputClass("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Phone{" "}
                    <span className="text-gray-300 font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    onFocus={() => setFocused("phone")}
                    onBlur={() => setFocused(null)}
                    placeholder="+91 98765 43210"
                    className={inputClass("phone")}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={form.password}
                      onChange={update("password")}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused(null)}
                      placeholder="Min. 6 characters"
                      className={`${inputClass("password")} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors"
                    >
                      {showPass ? (
                        <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-400 mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={update("confirmPassword")}
                      onFocus={() => setFocused("confirmPassword")}
                      onBlur={() => setFocused(null)}
                      placeholder="Re-enter your password"
                      className={`${inputClass("confirmPassword")} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors"
                    >
                      {showConfirm ? (
                        <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 border-none mt-1"
                  style={{
                    background: "#000",
                    boxShadow: loading ? "none" : "0 4px 18px rgba(0,0,0,0.22)",
                    transform: loading ? "scale(0.98)" : "scale(1)",
                    opacity: loading ? 0.8 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.background = "#222";
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.currentTarget.style.background = "#000";
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                        <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      Creating account…
                    </span>
                  ) : (
                    "Create account"
                  )}
                </button>
              </div>
            ) : (
              <div
                className="flex flex-col items-center py-8 gap-4"
                style={{ animation: "cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
              >
                <div
                  className="w-16 h-16 rounded-full bg-black flex items-center justify-center"
                  style={{
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    animation: "successPop 0.5s cubic-bezier(0.16,1,0.3,1) both",
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-bold text-xl text-black">Account created!</p>
                  <p className="text-sm text-gray-400 mt-1">Redirecting to login…</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {!success && (
            <p className="text-xs text-gray-400 text-center">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-semibold text-black hover:underline bg-transparent border-none cursor-pointer text-xs"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes successPop {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 600px) {
          .right-panel { display: none !important; }
        }
        @media (max-width: 900px) {
          .right-panel { flex: 0 1 280px !important; }
        }
      `}</style>
    </div>
  );
}