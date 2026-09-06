"use client";

import Link from "next/link";
import { CheckCircle2, Zap, ArrowRight, Star } from "lucide-react";


const PLANS = [
  {
    name: "Starter",
    price: 999,
    level: "starter",
    color: "#22C55E",
    features: [
      "Full gym access (Mon–Sun)",
      "Locker room & changing area",
      "1 free fitness assessment",
      "Cardio zone (50+ machines)",
      "Basic workout guidance",
    ],
    notIncluded: ["Group fitness classes", "Personal training", "Nutrition consultation"],
    popular: false,
  },
  {
    name: "Builder",
    price: 1999,
    level: "builder",
    color: "#1E4FD8",
    features: [
      "All Starter features",
      "Group fitness classes (5/month)",
      "Nutrition consultation (1/month)",
      "Progress tracking & reports",
      "1 guest pass/month",
    ],
    notIncluded: ["Personal training sessions", "Unlimited classes", "Priority booking"],
    popular: true,
  },
  {
    name: "Pro",
    price: 3499,
    level: "pro",
    color: "#F97316",
    features: [
      "All Builder features",
      "Unlimited group fitness classes",
      "4 personal training sessions/month",
      "Dietary & meal planning",
      "Body composition analysis",
      "2 guest passes/month",
    ],
    notIncluded: ["Unlimited personal training", "Spa & recovery access"],
    popular: false,
  },
  {
    name: "Elite",
    price: 5999,
    level: "elite",
    color: "#7C3AED",
    features: [
      "All Pro features",
      "Unlimited personal training",
      "Priority class booking",
      "Dedicated personal locker",
      "4 guest passes/month",
      "Spa & recovery access",
      "Monthly body analysis report",
    ],
    notIncluded: [],
    popular: false,
  },
];

const FAQS = [
  { q: "Can I change my plan?", a: "Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect immediately; downgrades apply at the next renewal." },
  { q: "Is there a joining fee?", a: "No joining fee. The first month is all you pay — no hidden charges." },
  { q: "Can I cancel anytime?", a: "Absolutely. You can cancel your membership from your member portal before the next billing cycle." },
  { q: "Do you accept UPI / online payments?", a: "Yes. We accept UPI, credit/debit cards, net banking, and cash at the gym." },
  { q: "Is there a free trial?", a: "Yes! Contact us or visit the gym to get your first 7 days free." },
];

export default function MembershipsPage() {
  return (
    <div>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-700) 100%)",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div className="section-tag" style={{ justifyContent: "center", marginBottom: 20 }}>
            <Zap size={12} /> Membership Plans
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            CHOOSE YOUR PLAN
          </h1>
          <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.7)", marginBottom: 32 }}>
            Transparent pricing in INR. No joining fee. Cancel anytime. All plans include full gym access.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            {[
              { emoji: "✅", text: "No joining fee" },
              { emoji: "🎯", text: "7-day free trial" },
              { emoji: "🔓", text: "Cancel anytime" },
            ].map(({ emoji, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem", color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
                {emoji} {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {PLANS.map(({ name, price, level, color, features, notIncluded, popular }) => (
              <div
                key={name}
                style={{
                  border: popular ? `2px solid ${color}` : "2px solid var(--gray-200)",
                  borderRadius: 20,
                  padding: "36px 28px",
                  position: "relative",
                  background: popular ? `${color}06` : "#fff",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {popular && (
                  <div style={{ position: "absolute", top: -15, left: "50%", transform: "translateX(-50%)", background: color, color: "#fff", fontSize: "0.72rem", fontWeight: 700, padding: "4px 18px", borderRadius: 999, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
                    <Star size={10} fill="#fff" /> MOST POPULAR
                  </div>
                )}

                <div style={{ marginBottom: 8 }}>
                  <span className={`badge badge-${level}`}>{name}</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "3rem", fontWeight: 900, color: "var(--navy)" }}>
                    ₹{price.toLocaleString("en-IN")}
                  </span>
                  <span style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}>/month</span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--gray-400)", marginBottom: 24 }}>Billed monthly · No contract</p>

                <hr style={{ border: "none", borderTop: "1px solid var(--gray-200)", marginBottom: 20 }} />

                <ul style={{ listStyle: "none", flex: 1, marginBottom: 28, display: "flex", flexDirection: "column", gap: 12 }}>
                  {features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.875rem", color: "var(--gray-700)" }}>
                      <CheckCircle2 size={16} color={color} style={{ flexShrink: 0, marginTop: 2 }} />
                      {f}
                    </li>
                  ))}
                  {notIncluded.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.875rem", color: "var(--gray-300)", textDecoration: "line-through" }}>
                      <CheckCircle2 size={16} color="var(--gray-300)" style={{ flexShrink: 0, marginTop: 2 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/join"
                  className="btn"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    background: popular ? color : "transparent",
                    color: popular ? "#fff" : color,
                    border: `2px solid ${color}`,
                  }}
                >
                  Get {name} <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 24px", background: "var(--gray-50)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", marginBottom: 48 }} className="section-title">
            Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {FAQS.map(({ q, a }) => (
              <div key={q} className="card" style={{ padding: 24 }}>
                <h3 style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.95rem", marginBottom: 8 }}>{q}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", lineHeight: 1.7 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
