import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCompany } from "../../context/CompanyContext";
import API_BASE from "../../../config";

// ─────────────────────────────────────────────────────────────
// OTP MODAL
// ─────────────────────────────────────────────────────────────
function OtpModal({ email, onVerified, onClose }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef([]);

  // countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // auto-focus first box on open
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setError("");
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      // POST /companies/verify-otp  — adjust endpoint to match your backend
      const res = await axios.post(`${API_BASE}/companies/verify-otp`, {
        email,
        otp: code,
      });
      setVerified(true);
      setTimeout(() => onVerified(res.data), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setError("");
      // POST /companies/resend-otp — adjust endpoint to match your backend
      await axios.post(`${API_BASE}/companies/resend-otp`, { email });
      setCountdown(30);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    // backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", animation: "fadeIn 0.2s ease both" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white w-full rounded-2xl p-8 flex flex-col items-center"
        style={{
          maxWidth: 420,
          boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
          animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {!verified ? (
          <>
            {/* icon */}
            <div
              className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5"
            >
              <svg width="24" height="24" fill="none" stroke="black" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="2" y="4" width="20" height="16" rx="3" />
                <path d="M2 7l10 7 10-7" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-black mb-1" style={{ letterSpacing: "-0.02em" }}>
              Verify your email
            </h2>
            <p className="text-sm text-gray-400 text-center mb-7 leading-relaxed">
              We sent a 6-digit code to{" "}
              <span className="text-black font-medium">{email}</span>.<br />
              Enter it below to continue.
            </p>

            {/* OTP boxes */}
            <div className="flex gap-2.5 mb-5" onPaste={handlePaste}>
              {otp.map((val, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-11 h-12 text-center text-lg font-semibold text-black rounded-xl outline-none transition-all duration-150"
                  style={{
                    border: error
                      ? "1.5px solid #f87171"
                      : val
                      ? "1.5px solid #000"
                      : "1.5px solid #e5e7eb",
                    background: val ? "#f9f9f9" : "#fff",
                    caretColor: "transparent",
                  }}
                />
              ))}
            </div>

            {/* error */}
            {error && (
              <p className="text-xs text-red-400 mb-4 text-center">{error}</p>
            )}

            {/* verify button */}
            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 mb-4"
              style={{
                background: "#000",
                opacity: loading ? 0.75 : 1,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 18px rgba(0,0,0,0.2)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Verifying…
                </span>
              ) : (
                "Verify & continue"
              )}
            </button>

            {/* resend */}
            <div className="text-xs text-gray-400 text-center">
              Didn&apos;t receive the code?{" "}
              {countdown > 0 ? (
                <span className="text-gray-400">Resend in {countdown}s</span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-black font-semibold hover:underline bg-transparent border-none cursor-pointer text-xs"
                >
                  {resending ? "Sending…" : "Resend OTP"}
                </button>
              )}
            </div>

            {/* close */}
            <button
              onClick={onClose}
              className="mt-5 text-xs text-gray-300 hover:text-gray-500 transition-colors bg-transparent border-none cursor-pointer"
            >
              ← Go back
            </button>
          </>
        ) : (
          /* success state inside modal */
          <div
            className="flex flex-col items-center py-4 gap-4"
            style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            <div
              className="w-16 h-16 rounded-full bg-black flex items-center justify-center"
              style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.2)", animation: "successPop 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-bold text-xl text-black">Email verified!</p>
              <p className="text-sm text-gray-400 mt-1">Setting up your account…</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(24px) scale(0.97) }
          to   { opacity:1; transform:translateY(0) scale(1) }
        }
        @keyframes successPop {
          from { transform:scale(0.5); opacity:0 }
          to   { transform:scale(1);   opacity:1 }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN REGISTER PAGE
// ─────────────────────────────────────────────────────────────
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
  const [nameStatus, setNameStatus] = useState("idle"); // "idle" | "checking" | "available" | "taken" | "error"
  const nameDebounceRef = useRef(null);
  
  // OTP modal state
  const [showOtp, setShowOtp] = useState(false);
  // store the pending registration response so we can call loginCompany after OTP
  const [pendingData, setPendingData] = useState(null);

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


// Add this function inside the component:
const checkCompanyName = async (name) => {
  if (name.trim().length < 3) {
    setNameStatus("idle");
    return;
  }
  setNameStatus("checking");
  try {
    const res = await axios.get(`${API_BASE}/companies/check-name`, {
      params: { name: name.trim() },
    });
    setNameStatus(res.data.available ? "available" : "taken");
  } catch {
    setNameStatus("error");
  }
};

// Updated onChange handler for companyName input:
const handleCompanyNameChange = (e) => {
  const val = e.target.value;
  setForm((prev) => ({ ...prev, companyName: val }));
  setErrors((prev) => ({ ...prev, companyName: "" }));

  if (nameDebounceRef.current) clearTimeout(nameDebounceRef.current);

  if (val.trim().length < 3) {
    setNameStatus("idle");
    return;
  }

  nameDebounceRef.current = setTimeout(() => {
    checkCompanyName(val);
  }, 500); // 500ms debounce — fires after typing stops
};

  // Step 1 — submit the registration form, then open OTP modal
  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/companies/register`, {
        companyName: form.companyName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      // Store the response so we can use it after OTP is confirmed
      setPendingData(res.data);
      setLoading(false);

      // Open OTP modal — do NOT call loginCompany yet
      setShowOtp(true);
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  // Step 2 — OTP verified, now finalise login
  // `verifyRes` is whatever your /verify-otp endpoint returns.
  // Adjust to use res.data or pendingData depending on your backend.
  const handleOtpVerified = (verifyRes) => {
    setShowOtp(false);

    // Use the token from the verify response if your backend sends a fresh one,
    // otherwise fall back to the one from the registration response.
    const token = verifyRes?.token ?? pendingData?.token;
    const data  = verifyRes?.data  ?? pendingData?.data;

    loginCompany(data, token);
    setSuccess(true);
    setTimeout(() => navigate("/company/Home"), 1400);
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
    <>
      {/* OTP modal — rendered outside the card so it overlays everything */}
      {showOtp && (
        <OtpModal
          email={form.email}
          onVerified={handleOtpVerified}
          onClose={() => { setShowOtp(false); setLoading(false); }}
        />
      )}

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
                Showcase your business, connect with top talent, and scale faster with ParkOS.
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
                  stroke="black" strokeWidth="2" strokeLinejoin="round" fill="none"
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
              {/* Company Name */}
<div>
  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
    Company Name <span className="text-red-400">*</span>
  </label>
  <div className="relative">
    <input
      type="text"
      value={form.companyName}
      onChange={handleCompanyNameChange}
      onFocus={() => setFocused("companyName")}
      onBlur={() => setFocused(null)}
      placeholder="Acme Inc."
      className="w-full rounded-xl px-4 py-3 text-sm text-black placeholder-gray-300 bg-gray-50 outline-none transition-all duration-200 pr-10"
      style={{
        border:
          nameStatus === "taken" || errors.companyName
            ? "1.5px solid #f87171"
            : nameStatus === "available"
            ? "1.5px solid #1D9E75"
            : focused === "companyName"
            ? "1.5px solid #000"
            : "1.5px solid #e5e7eb",
      }}
    />

    {/* Status icon inside input */}
    <div className="absolute right-3 top-1/2 -translate-y-1/2">
      {nameStatus === "checking" && (
        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#e5e7eb" strokeWidth="3" />
          <path d="M12 3a9 9 0 0 1 9 9" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {nameStatus === "available" && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#1D9E75" />
          <polyline points="7 12 10.5 15.5 17 9" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {nameStatus === "taken" && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#E24B4A" />
          <line x1="8" y1="8" x2="16" y2="16" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="16" y1="8" x2="8" y2="16" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      )}
    </div>
  </div>

  {/* Status messages below input */}
  {nameStatus === "available" && (
    <p className="text-xs mt-1" style={{ color: "#0F6E56" }}>
      ✓ "{form.companyName.trim()}" is available
    </p>
  )}
  {nameStatus === "taken" && (
    <p className="text-xs mt-1 text-red-400">
      ⚠ Company name already taken — try another
    </p>
  )}
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
                      type="email" value={form.email} onChange={update("email")}
                      onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                      placeholder="you@company.com" className={inputClass("email")}
                    />
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Phone <span className="text-gray-300 font-normal">(optional)</span>
                    </label>
                    <input
                      type="tel" value={form.phone} onChange={update("phone")}
                      onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)}
                      placeholder="+91 98765 43210" className={inputClass("phone")}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"} value={form.password}
                        onChange={update("password")} onFocus={() => setFocused("password")}
                        onBlur={() => setFocused(null)} placeholder="Min. 6 characters"
                        className={`${inputClass("password")} pr-11`}
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors">
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
                    {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Confirm Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"} value={form.confirmPassword}
                        onChange={update("confirmPassword")} onFocus={() => setFocused("confirmPassword")}
                        onBlur={() => setFocused(null)} placeholder="Re-enter your password"
                        className={`${inputClass("confirmPassword")} pr-11`}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors">
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
                    {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit} disabled={loading}
                    className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 border-none mt-1"
                    style={{
                      background: "#000",
                      boxShadow: loading ? "none" : "0 4px 18px rgba(0,0,0,0.22)",
                      transform: loading ? "scale(0.98)" : "scale(1)",
                      opacity: loading ? 0.8 : 1,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#222"; }}
                    onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#000"; }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                          <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                        Sending OTP…
                      </span>
                    ) : (
                      "Create account →"
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
                    style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.2)", animation: "successPop 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-xl text-black">Account created!</p>
                    <p className="text-sm text-gray-400 mt-1">Redirecting to your dashboard…</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {!success && (
              <p className="text-xs text-gray-400 text-center">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/company/login")}
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
          @media (max-width: 600px)  { .right-panel { display: none !important; } }
          @media (max-width: 900px)  { .right-panel { flex: 0 1 280px !important; } }
        `}</style>
      </div>
    </>
  );
}