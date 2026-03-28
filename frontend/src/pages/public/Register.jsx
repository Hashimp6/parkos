import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import API_BASE from "../../../config";
import axios from "axios";

// ─────────────────────────────────────────────────────────────
// EYE ICON
// ─────────────────────────────────────────────────────────────
function EyeIcon({ show }) {
  return show ? (
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
  );
}

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
  
      const { data } = await axios.post(`${API_BASE}/candidate/verify-otp`, {
        email,
        otp: code,
      });
  
      setVerified(true);
      setTimeout(() => onVerified(data), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
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
  
      await axios.post(`${API_BASE}/candidate/resend-otp`, { email });
  
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
            <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
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
              className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 mb-4 border-none"
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
              style={{
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                animation: "successPop 0.5s cubic-bezier(0.16,1,0.3,1) both",
              }}
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
export default function RegisterPage() {
  const { loginUser } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // OTP modal state
  const [showOtp, setShowOtp] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    return e;
  };

  // Step 1 — register, then open OTP modal
  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
  
    setErrors({});
    setLoading(true);
  
    try {
      console.log("for",form);
      
      const { data } = await axios.post(`${API_BASE}/candidate/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });
  console.log("d",data);
  
      setPendingData(data);
      setLoading(false);
      setShowOtp(true);
    } catch (err) {
      console.error(err);
      setErrors({
        email: err.response?.data?.message || "Registration failed",
      });
      setLoading(false);
    }
  };

  // Step 2 — OTP verified, finalise login
  const handleOtpVerified = (verifyData) => {
    setShowOtp(false);

    // Use token/user from verify response if available, else fall back to registration response
    const token = verifyData?.token ?? pendingData?.token;
    const user  = verifyData?.data  ?? pendingData?.user;
console.log("dddd",verifyData.data,"dd",pendingData);

    loginUser(user);
    localStorage.setItem("token", token);

    setSuccess(true);
    setTimeout(() => navigate("/home"), 800);
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

  const simpleFields = [
    { id: "name",  label: "Full Name", type: "text",  placeholder: "John Doe" },
    { id: "email", label: "Email",     type: "email", placeholder: "you@example.com" },
  ];

  return (
    <>
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
            minHeight: 580,
            animation: "cardIn 0.7s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {/* ── LEFT PANEL ── */}
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
            <div className="flex-1 flex flex-col justify-center py-7">
              <h1 className="text-3xl font-bold text-black mb-1" style={{ letterSpacing: "-0.03em" }}>
                Create account
              </h1>
              <p className="text-sm text-gray-400 mb-7">Sign up to get started for free</p>

              {!success ? (
                <div className="flex flex-col gap-3">

                  {/* Name & Email */}
                  {simpleFields.map(({ id, label, type, placeholder }) => (
                    <div key={id}>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
                      <input
                        type={type}
                        value={form[id]}
                        onChange={update(id)}
                        onFocus={() => setFocused(id)}
                        onBlur={() => setFocused(null)}
                        placeholder={placeholder}
                        className={inputClass(id)}
                      />
                      {errors[id] && <p className="text-xs text-red-400 mt-1">{errors[id]}</p>}
                    </div>
                  ))}

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Password</label>
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
                        <EyeIcon show={showPass} />
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={form.confirm}
                        onChange={update("confirm")}
                        onFocus={() => setFocused("confirm")}
                        onBlur={() => setFocused(null)}
                        placeholder="Re-enter your password"
                        className={`${inputClass("confirm")} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors"
                      >
                        <EyeIcon show={showConfirm} />
                      </button>
                    </div>
                    {errors.confirm && <p className="text-xs text-red-400 mt-1">{errors.confirm}</p>}
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 mt-1 border-none"
                    style={{
                      background: "#000",
                      boxShadow: loading ? "none" : "0 4px 18px rgba(0,0,0,0.22)",
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
                    ) : "Create account"}
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
                    <p className="text-black font-bold text-xl">Account created!</p>
                    <p className="text-sm text-gray-400 mt-1">Welcome aboard, {form.name.split(" ")[0]}!</p>
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

          {/* ── RIGHT PANEL ── hidden on mobile */}
          <div
            className="right-panel relative overflow-hidden flex flex-col justify-between p-8"
            style={{
              flex: "1 1 340px",
              backgroundImage: "url('https://i.pinimg.com/736x/96/7f/62/967f62288140a4a2075aa097dcb1606b.jpg')",
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
                Start your journey<br />today with ParkOS<br />
              </h2>
              <div className="flex items-start gap-3">
                <div className="w-0.5 h-10 bg-black rounded-full flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600 leading-relaxed">
                  Join thousands of users who've simplified their workflow with Park O S.
                </p>
              </div>
            </div>
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
          @media (max-width: 600px) { .right-panel { display: none !important; } }
          @media (max-width: 900px) { .right-panel { flex: 0 1 280px !important; } }
        `}</style>
      </div>
    </>
  );
}