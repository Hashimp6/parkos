import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE from "../../../config";

// STEP CONSTANTS
const STEP_EMAIL = "email";
const STEP_OTP = "otp";
const STEP_NEW_PASSWORD = "new_password";
const STEP_SUCCESS = "success";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(STEP_EMAIL);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Shared input style (matches LoginPage) ──
  const inputClass = (field) =>
    [
      "w-full rounded-xl px-4 py-3 text-sm text-black placeholder-gray-300 bg-gray-50 outline-none transition-all duration-200",
      focused === field
        ? "border-[1.5px] border-black shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
        : "border-[1.5px] border-gray-200",
    ].join(" ");

  // ── STEP 1: Send OTP ──
  const handleSendOTP = async () => {
    if (!email.trim()) return setError("Please enter your email");
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/candidate/forgot-password`, { email });
      setStep(STEP_OTP);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 2: Verify OTP → go to new password ──
  const handleVerifyOTP = () => {
    if (otp.length !== 6) return setError("Please enter the 6-digit OTP");
    setError("");
    setStep(STEP_NEW_PASSWORD);
  };

  // ── STEP 3: Reset password ──
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) return setError("Both fields are required");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters");
    if (newPassword !== confirmPassword) return setError("Passwords do not match");
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/candidate/reset-password`, {
        email,
        otp,
        newPassword,
      });
      setStep(STEP_SUCCESS);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step indicator dots ──
  const steps = [STEP_EMAIL, STEP_OTP, STEP_NEW_PASSWORD];
  const currentStepIndex = steps.indexOf(step);

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
          <div className="flex-1 flex flex-col justify-center py-8">

            {/* Step progress dots */}
            {step !== STEP_SUCCESS && (
              <div className="flex items-center gap-2 mb-6">
                {steps.map((s, i) => (
                  <div
                    key={s}
                    style={{
                      width: i === currentStepIndex ? 24 : 8,
                      height: 8,
                      borderRadius: 99,
                      background: i <= currentStepIndex ? "#000" : "#e5e7eb",
                      transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  />
                ))}
              </div>
            )}

            {/* ── STEP 1: Email ── */}
            {step === STEP_EMAIL && (
              <div
                className="flex flex-col gap-4"
                style={{ animation: "slideIn 0.4s cubic-bezier(0.16,1,0.3,1) both" }}
              >
                <div>
                  <h1 className="text-3xl font-bold text-black mb-1" style={{ letterSpacing: "-0.03em" }}>
                    Forgot password?
                  </h1>
                  <p className="text-sm text-gray-400 mb-6">
                    No worries — enter your email and we'll send you an OTP.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                    placeholder="you@example.com"
                    className={inputClass("email")}
                  />
                </div>

                {error && <p className="text-xs text-red-500 -mt-1">{error}</p>}

                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 border-none"
                  style={{
                    background: "#000",
                    boxShadow: loading ? "none" : "0 4px 18px rgba(0,0,0,0.22)",
                    opacity: loading ? 0.8 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#222"; }}
                  onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#000"; }}
                >
                  {loading ? <Spinner label="Sending OTP…" /> : "Send OTP"}
                </button>
              </div>
            )}

            {/* ── STEP 2: OTP ── */}
            {step === STEP_OTP && (
              <div
                className="flex flex-col gap-4"
                style={{ animation: "slideIn 0.4s cubic-bezier(0.16,1,0.3,1) both" }}
              >
                <div>
                  <h1 className="text-3xl font-bold text-black mb-1" style={{ letterSpacing: "-0.03em" }}>
                    Check your email
                  </h1>
                  <p className="text-sm text-gray-400 mb-6">
                    We sent a 6-digit code to{" "}
                    <span className="font-semibold text-black">{email}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">OTP Code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    onFocus={() => setFocused("otp")}
                    onBlur={() => setFocused(null)}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyOTP()}
                    placeholder="123456"
                    className={inputClass("otp")}
                    style={{ letterSpacing: "0.25em", fontSize: 20, fontWeight: 700 }}
                  />
                </div>

                {error && <p className="text-xs text-red-500 -mt-1">{error}</p>}

                <button
                  onClick={handleVerifyOTP}
                  className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 border-none"
                  style={{ background: "#000", boxShadow: "0 4px 18px rgba(0,0,0,0.22)", cursor: "pointer" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#222"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#000"; }}
                >
                  Verify OTP
                </button>

                {/* Resend */}
                <p className="text-xs text-center text-gray-400">
                  Didn't receive it?{" "}
                  <button
                    onClick={handleSendOTP}
                    className="font-semibold text-black hover:underline bg-transparent border-none cursor-pointer text-xs"
                  >
                    Resend OTP
                  </button>
                </p>
              </div>
            )}

            {/* ── STEP 3: New Password ── */}
            {step === STEP_NEW_PASSWORD && (
              <div
                className="flex flex-col gap-4"
                style={{ animation: "slideIn 0.4s cubic-bezier(0.16,1,0.3,1) both" }}
              >
                <div>
                  <h1 className="text-3xl font-bold text-black mb-1" style={{ letterSpacing: "-0.03em" }}>
                    New password
                  </h1>
                  <p className="text-sm text-gray-400 mb-6">Set a strong new password for your account.</p>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onFocus={() => setFocused("newPass")}
                      onBlur={() => setFocused(null)}
                      placeholder="Min. 6 characters"
                      className={`${inputClass("newPass")} pr-11`}
                    />
                    <EyeToggle show={showPass} onToggle={() => setShowPass(!showPass)} />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocused("confirm")}
                      onBlur={() => setFocused(null)}
                      onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                      placeholder="Repeat your password"
                      className={`${inputClass("confirm")} pr-11`}
                    />
                    <EyeToggle show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
                  </div>
                  {/* Match indicator */}
                  {confirmPassword && (
                    <p
                      className="text-xs mt-1.5 font-medium"
                      style={{ color: newPassword === confirmPassword ? "#16a34a" : "#ef4444" }}
                    >
                      {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords don't match"}
                    </p>
                  )}
                </div>

                {error && <p className="text-xs text-red-500 -mt-1">{error}</p>}

                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 border-none"
                  style={{
                    background: "#000",
                    boxShadow: loading ? "none" : "0 4px 18px rgba(0,0,0,0.22)",
                    opacity: loading ? 0.8 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#222"; }}
                  onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#000"; }}
                >
                  {loading ? <Spinner label="Resetting…" /> : "Reset Password"}
                </button>
              </div>
            )}

            {/* ── SUCCESS ── */}
            {step === STEP_SUCCESS && (
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-bold text-xl text-black">Password reset!</p>
                  <p className="text-sm text-gray-400 mt-1">Redirecting you to login…</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {step !== STEP_SUCCESS && (
            <p className="text-xs text-gray-400 text-center">
              Remember your password?{" "}
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
              Secure your account<br />and get back on track<br />in just a few steps.
            </h2>
            <div className="flex items-start gap-3">
              <div className="w-0.5 h-10 bg-black rounded-full flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 leading-relaxed">
                Your data is safe. We verify your identity before allowing any password change.
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
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(18px); }
          to   { opacity: 1; transform: translateX(0); }
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

// ── Reusable: Eye toggle button ──
function EyeToggle({ show, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors"
    >
      {show ? (
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
  );
}

// ── Reusable: Loading spinner ──
function Spinner({ label }) {
  return (
    <span className="flex items-center justify-center gap-2">
      <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
        <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      </svg>
      {label}
    </span>
  );
}