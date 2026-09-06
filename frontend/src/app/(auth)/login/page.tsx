"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Activity, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/client";

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please enter your mobile number or email and password.");
      return;
    }
    
    setIsLoading(true);
    try {
      // The API endpoint uses 'username' but the backend USERNAME_FIELD is mobile.
      // So username is passed which is typically a mobile number but could be email depending on auth backend config.
      const data = await authApi.login(username, password);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      
      // Determine dashboard based on role returned from the API
      if (data.role === "admin" || data.role === "staff") {
        router.push("/admin/dashboard");
      } else if (data.role === "trainer") {
        router.push("/trainer/dashboard");
      } else {
        router.push("/member/home");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", background: "#fff" }}>
      
      {/* ── Left Side — Form ─────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", padding: "40px 60px", position: "relative" }}>
        
        {/* Logo at Top */}
        <div style={{ marginBottom: "auto" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Image src="/logo.png" alt="FitnessZone" width={180} height={45} style={{ height: 45, width: "auto" }} />
          </Link>
        </div>

        {/* Login Form Container */}
        <div style={{ width: "100%", maxWidth: 440, margin: "0 auto", marginTop: "auto", marginBottom: "auto" }}>
          
          <div style={{ padding: "48px 40px", borderRadius: 16, border: "1px solid var(--gray-200)", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--navy)", marginBottom: 32, letterSpacing: "-0.02em" }}>
              Sign In to Your Account
            </h1>

            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{ background: "var(--error-bg)", border: "1px solid #FECACA", borderRadius: 8, padding: "12px 16px", marginBottom: 24, fontSize: "0.875rem", color: "#DC2626", fontWeight: 500 }}>
                  {error}
                </div>
              )}

              {/* Username (Mobile/Email) */}
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label" htmlFor="login-username" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gray-500)", fontWeight: 700, marginBottom: 8, display: "block" }}>
                  Mobile Number or Email
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
                  <input
                    id="login-username"
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: 42, height: 48, borderRadius: 8, border: "1px solid var(--gray-200)", width: "100%", fontSize: "0.95rem" }}
                    placeholder="Mobile number or email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group" style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label className="form-label" htmlFor="login-password" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gray-500)", fontWeight: 700, margin: 0 }}>
                    Password
                  </label>
                  <Link href="#" style={{ fontSize: "0.8rem", color: "var(--blue)", fontWeight: 500, textDecoration: "underline" }}>
                    Forgot password?
                  </Link>
                </div>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--blue)" }} />
                  <input
                    id="login-password"
                    type={showPass ? "text" : "password"}
                    className="form-input"
                    style={{ paddingLeft: 42, paddingRight: 44, height: 48, borderRadius: 8, border: "1px solid var(--blue)", width: "100%", fontSize: "0.95rem", boxShadow: "0 0 0 3px rgba(37,99,235,0.1)" }}
                    placeholder="supersecretpassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--gray-400)", padding: 0, cursor: "pointer" }}
                    aria-label="Toggle password visibility"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Keep me signed in */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  style={{
                    width: 20, height: 20, borderRadius: 4, 
                    background: rememberMe ? "var(--blue)" : "#fff",
                    border: rememberMe ? "1px solid var(--blue)" : "1px solid var(--gray-300)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", padding: 0
                  }}
                >
                  {rememberMe && <Check size={14} color="#fff" />}
                </button>
                <span style={{ fontSize: "0.875rem", color: "var(--gray-500)", fontWeight: 500 }}>
                  Keep me signed in on this device
                </span>
              </div>

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={isLoading}
                style={{ 
                  width: "100%", 
                  height: 48, 
                  background: "var(--blue)", 
                  color: "#fff", 
                  borderRadius: 8, 
                  border: "none", 
                  fontSize: "1rem", 
                  fontWeight: 600, 
                  cursor: isLoading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "background 0.2s"
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                    Signing in…
                  </>
                ) : (
                  "Secure Sign In"
                )}
              </button>
            </form>

            <div style={{ marginTop: 28, textAlign: "center", fontSize: "0.875rem", color: "var(--gray-400)" }}>
              Don't have a membership account yet?<br/>
              <Link href="/join" style={{ color: "var(--orange)", fontWeight: 600, textDecoration: "underline" }}>
                Register at FitnessZone or contact your coach
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ── Right Side — Hero Image/Text ─────────────────────────────── */}
      <div
        className="hide-mobile"
        style={{
          background: "linear-gradient(135deg, #0A1128 0%, #0F172A 100%)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden"
        }}
      >
        {/* Abstract shapes from screenshot */}
        <div style={{ position: "absolute", top: "-10%", right: "-10%", width: "60%", height: "60%", borderRadius: "50%", border: "2px solid rgba(59,130,246,0.2)", opacity: 0.5 }} />
        <div style={{ position: "absolute", bottom: "10%", left: "-10%", width: "70%", height: "70%", borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "20%", left: "15%", width: 16, height: 16, borderRadius: "50%", background: "#3B82F6", opacity: 0.8 }} />
        <div style={{ position: "absolute", top: "45%", right: "15%", width: 24, height: 24, borderRadius: "50%", background: "#F97316", opacity: 0.8 }} />
        <div style={{ position: "absolute", bottom: "35%", right: "30%", width: "40%", height: "40%", borderRadius: "50%", border: "1px solid rgba(249,115,22,0.3)" }} />
        <svg style={{ position: "absolute", top: "5%", left: "0", width: "100%", height: "20%", opacity: 0.2 }} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,50 Q25,0 50,50 T100,50" fill="none" stroke="#F97316" strokeWidth="0.5"/>
        </svg>

        {/* Text */}
        <div style={{ zIndex: 2, textAlign: "center", width: "100%", marginTop: "10%" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "5rem", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em" }}>
            <span style={{ color: "#3B82F6", display: "block", textTransform: "uppercase" }}>Push</span>
            <span style={{ color: "#F97316", display: "block", textTransform: "uppercase" }}>Your</span>
            <span style={{ color: "#fff", display: "block", textTransform: "uppercase" }}>Limits</span>
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 20 }}>
            <div style={{ height: 1, width: 40, background: "#F97316" }} />
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#F97316" }} />
            <div style={{ height: 1, width: 40, background: "#F97316" }} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.1em", marginTop: 16 }}>
            TRAIN HARD. TRACK PROGRESS. TRANSFORM.
          </p>
        </div>

        {/* Stats */}
        <div style={{ zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "10%", width: "80%", marginTop: "15%", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 40 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#3B82F6", lineHeight: 1 }}>5K+</div>
            <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: "0.05em", marginTop: 8 }}>MEMBERS</div>
          </div>
          <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#F97316", lineHeight: 1 }}>200+</div>
            <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: "0.05em", marginTop: 8 }}>COACHES</div>
          </div>
          <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>98%</div>
            <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: "0.05em", marginTop: 8 }}>SATISFACTION</div>
          </div>
        </div>

        {/* Bottom Orange Banner */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#F97316", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <Image src="/logo.png" alt="Icon" width={24} height={24} style={{ filter: "brightness(0) invert(1)" }} />
          <span style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 800, letterSpacing: "0.05em" }}>
            FITNESSZONE - WHERE CHAMPIONS BEGIN
          </span>
        </div>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
