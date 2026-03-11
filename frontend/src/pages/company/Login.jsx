import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCompany } from "../../context/CompanyContext";

export default function CompanyLoginPage() {
  const navigate = useNavigate();
  const { loginCompany } = useCompany();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
  console.log("pddd",email, password);
  
      const res = await axios.post(
        "http://192.168.1.27:5006/api/companies/login",
        { email, password }
      );
  
      const { token, data } = res.data;
  console.log("logg",data,token);
  
      // ✅ Save in context + localStorage
      loginCompany(data, token);
  
      setLoading(false);
      setSuccess(true);
  
      setTimeout(() => navigate("/company/Home"), 1400);
  
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const inputClass = (field) =>
    [
      "w-full rounded-xl px-4 py-3 text-sm text-black placeholder-gray-300 bg-gray-50 outline-none transition-all duration-200",
      focused === field
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
            <h1 className="text-3xl font-bold text-black mb-1" style={{ letterSpacing: "-0.03em" }}>
              Welcome back!
            </h1>
            <p className="text-sm text-gray-400 mb-8">Sign in to your company account</p>

            {!success ? (
              <div className="flex flex-col gap-4">

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="company@example.com"
                    className={inputClass("email")}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused(null)}
                      placeholder="Enter your password"
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
                </div>

                {/* Forgot */}
                <div className="text-right -mt-1">
                  <button
                    type="button"
                    className="text-xs text-gray-400 hover:text-black transition-colors font-medium bg-transparent border-none cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Sign in */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 border-none"
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
                      Signing in…
                    </span>
                  ) : "Sign in"}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-300">or continue with</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Social buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-all border-[1.5px] border-gray-200"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M5.26 9.77A7.49 7.49 0 0112 4.5c1.95 0 3.73.72 5.1 1.9l3.8-3.8A12 12 0 000 12c0 1.99.49 3.87 1.36 5.53l4.15-3.23A7.5 7.5 0 015.26 9.77z"/>
                      <path fill="#FBBC05" d="M12 19.5a7.5 7.5 0 01-6.64-4.03l-4.15 3.23A12 12 0 0012 24c3.24 0 6.18-1.22 8.41-3.22l-3.98-3.08A7.49 7.49 0 0112 19.5z"/>
                      <path fill="#4285F4" d="M23.9 12.27c0-.79-.07-1.56-.19-2.27H12v4.5h6.68a5.73 5.73 0 01-2.25 3.73l3.98 3.08C22.36 19.27 23.9 16 23.9 12.27z"/>
                      <path fill="#34A853" d="M5.26 14.23A7.5 7.5 0 015.1 12c0-.77.12-1.52.33-2.23L1.28 6.54A12 12 0 000 12c0 1.99.49 3.87 1.36 5.53l3.9-3.3z"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-all border-[1.5px] border-gray-200"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="black">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Apple
                  </button>
                </div>

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
                  <p className="font-bold text-xl text-black">You're in!</p>
                  <p className="text-sm text-gray-400 mt-1">Redirecting you now…</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {!success && (
            <p className="text-xs text-gray-400 text-center">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/company/register")}
                className="font-semibold text-black hover:underline bg-transparent border-none cursor-pointer text-xs"
              >
                Sign up
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
              Manage your company<br/>profile and connect with<br/>the right talent, faster.
            </h2>
            <div className="flex items-start gap-3">
              <div className="w-0.5 h-10 bg-black rounded-full flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 leading-relaxed">
                Sign in to update your presence, manage listings, and grow your team.
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