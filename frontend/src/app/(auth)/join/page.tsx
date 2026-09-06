"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, User, Mail, ArrowRight, CheckCircle2, Zap } from "lucide-react";

export default function JoinPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ full_name: "", mobile: "", email: "", plan: "builder" });
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setDone(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-700) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 520 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link href="/">
            <Image src="/logo.png" alt="FitnessZone" width={180} height={45} style={{ margin: "0 auto" }} />
          </Link>
        </div>

        <div className="card" style={{ padding: 40 }}>
          {done ? (
            // Success state
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--success-bg)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <CheckCircle2 size={36} color="var(--success)" />
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 900, color: "var(--navy)", marginBottom: 12 }}>
                Welcome to FitnessZone! 🎉
              </h2>
              <p style={{ color: "var(--gray-500)", fontSize: "0.95rem", marginBottom: 32, lineHeight: 1.6 }}>
                Your account has been created. Our team will call you on <strong>{form.mobile}</strong> within 24 hours to complete your registration and schedule your free fitness assessment.
              </p>
              <Link href="/member/home" className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }}>
                Go to My Dashboard <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 28 }}>
                <div className="section-tag" style={{ marginBottom: 8 }}>
                  <Zap size={12} /> Join Now
                </div>
                <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--navy)" }}>
                  Start Your Fitness Journey
                </h1>
                <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: 6 }}>
                  Create your account in 60 seconds. No credit card required.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="join-name">Full Name *</label>
                  <div style={{ position: "relative" }}>
                    <User size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
                    <input
                      id="join-name"
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: 42 }}
                      placeholder="Arjun Sharma"
                      value={form.full_name}
                      onChange={(e) => update("full_name", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div className="form-group">
                  <label className="form-label" htmlFor="join-mobile">Mobile Number * <span style={{ fontWeight: 400, color: "var(--gray-400)" }}>(+91)</span></label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--gray-500)", fontSize: "0.875rem", fontWeight: 600 }}>+91</span>
                    <input
                      id="join-mobile"
                      type="tel"
                      className="form-input"
                      style={{ paddingLeft: 48 }}
                      placeholder="98765 43210"
                      value={form.mobile}
                      onChange={(e) => update("mobile", e.target.value.replace(/\D/g, "").substring(0, 10))}
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                  <span className="form-hint">We&apos;ll call you to confirm your membership</span>
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label" htmlFor="join-email">Email Address <span style={{ fontWeight: 400, color: "var(--gray-400)" }}>(optional)</span></label>
                  <div style={{ position: "relative" }}>
                    <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
                    <input
                      id="join-email"
                      type="email"
                      className="form-input"
                      style={{ paddingLeft: 42 }}
                      placeholder="arjun@example.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </div>
                </div>

                {/* Plan */}
                <div className="form-group">
                  <label className="form-label" htmlFor="join-plan">Choose Plan</label>
                  <select
                    id="join-plan"
                    className="form-input"
                    value={form.plan}
                    onChange={(e) => update("plan", e.target.value)}
                  >
                    <option value="starter">Starter — ₹999/month</option>
                    <option value="builder">Builder — ₹1,999/month (Most Popular)</option>
                    <option value="pro">Pro — ₹3,499/month</option>
                    <option value="elite">Elite — ₹5,999/month</option>
                  </select>
                </div>

                {/* Trust */}
                <div style={{ padding: 14, background: "var(--gray-50)", borderRadius: 10, display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.8rem", color: "var(--gray-500)" }}>
                  <CheckCircle2 size={15} color="var(--success)" style={{ flexShrink: 0, marginTop: 1 }} />
                  Your first 7 days are free. Our team will contact you to set up your gym visit and fitness assessment.
                </div>

                <button
                  id="join-submit"
                  type="submit"
                  className="btn btn-orange btn-lg"
                  disabled={isLoading}
                  style={{ justifyContent: "center" }}
                >
                  {isLoading ? (
                    <><div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Creating Account…</>
                  ) : (
                    <>Join FitnessZone <ArrowRight size={18} /></>
                  )}
                </button>

                <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--gray-400)" }}>
                  By joining, you agree to our{" "}
                  <Link href="/terms" style={{ color: "var(--blue)" }}>Terms</Link> &{" "}
                  <Link href="/privacy" style={{ color: "var(--blue)" }}>Privacy Policy</Link>.
                </p>
              </form>

              <div style={{ marginTop: 20, textAlign: "center", fontSize: "0.875rem", color: "var(--gray-500)" }}>
                Already a member?{" "}
                <Link href="/login" style={{ color: "var(--blue)", fontWeight: 600 }}>Sign in here</Link>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
