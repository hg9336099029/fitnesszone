"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Dumbbell, User, Zap, Activity, Calendar, BarChart3, Users, ChevronRight, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--gray-50)", display: "flex", flexDirection: "column", fontFamily: "var(--font-body)" }}>
      
      {/* ── Navbar ── */}
      <header style={{ 
        height: 80, 
        background: "rgba(10, 22, 40, 0.95)", 
        backdropFilter: "blur(12px)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        padding: "0 40px", 
        position: "sticky", 
        top: 0, 
        zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Image src="/logo.png" alt="FitnessZone" width={140} height={36} style={{ height: 36, width: "auto" }} />
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div className="hide-mobile" style={{ display: "flex", gap: 24, marginRight: 24, color: "var(--gray-300)", fontSize: "0.95rem", fontWeight: 500 }}>
            <a href="#features" style={{ transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "var(--gray-300)"}>Features</a>
            <a href="#portals" style={{ transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "var(--gray-300)"}>Portals</a>
          </div>
          <Link href="#portals">
            <button className="btn btn-orange" style={{ padding: "10px 24px" }}>
              Login <ChevronRight size={16} />
            </button>
          </Link>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* ── Hero Section ── */}
        <section style={{ 
          position: "relative",
          padding: "120px 24px",
          background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-800) 100%)",
          color: "#fff",
          textAlign: "center",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          {/* Background decorative elements */}
          <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "50%", height: "80%", background: "radial-gradient(circle, rgba(30,79,216,0.15) 0%, rgba(10,22,40,0) 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "50%", height: "80%", background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(10,22,40,0) 70%)", pointerEvents: "none" }} />
          
          <div className="animate-fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", padding: "6px 16px", borderRadius: 999, fontSize: "0.85rem", fontWeight: 600, color: "var(--orange-light)", marginBottom: 32, backdropFilter: "blur(4px)" }}>
            <Activity size={16} /> Next-Gen Gym Management
          </div>
          
          <h1 style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: "clamp(3rem, 8vw, 5.5rem)", 
            fontWeight: 900, 
            lineHeight: 1.05, 
            marginBottom: 24, 
            letterSpacing: "-0.03em",
            maxWidth: 900,
            color: "#fff"
          }}>
            Elevate Your Gym With <br/>
            <span style={{ 
              background: "linear-gradient(90deg, var(--orange), var(--orange-light))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block"
            }}>FitnessZone</span>
          </h1>
          
          <p style={{ 
            fontSize: "clamp(1.1rem, 2vw, 1.25rem)", 
            color: "var(--gray-300)", 
            lineHeight: 1.6, 
            maxWidth: 650, 
            marginBottom: 48 
          }}>
            India's most powerful, all-in-one platform for gym owners, trainers, and members. Seamlessly manage operations, track progress, and drive growth.
          </p>
          
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="#portals">
              <button className="btn btn-orange btn-xl">
                Get Started <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="#features">
              <button className="btn btn-outline-white btn-xl">
                Explore Features
              </button>
            </Link>
          </div>
        </section>

        {/* ── Features Section ── */}
        <section id="features" style={{ padding: "100px 24px", background: "#fff" }}>
          <div className="container-app" style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="section-tag">Powerful Features</div>
            <h2 className="section-title">Everything you need to succeed</h2>
            <p className="section-subtitle" style={{ margin: "16px auto 0" }}>Built specifically for the modern fitness industry, our tools empower every role in your facility.</p>
          </div>

          <div className="container-app" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
            {[
              { icon: <BarChart3 size={32} color="var(--blue)" />, title: "Business Analytics", desc: "Real-time insights into revenue, member retention, and class attendance." },
              { icon: <Users size={32} color="var(--success)" />, title: "Member Management", desc: "Easily onboard members, handle subscriptions, and track their fitness journey." },
              { icon: <Calendar size={32} color="var(--orange)" />, title: "Smart Scheduling", desc: "Effortless class booking and trainer scheduling to maximize facility usage." },
            ].map((feat, i) => (
              <div key={i} className="card card-hover" style={{ padding: 32, border: "none", background: "var(--gray-50)", boxShadow: "none" }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, boxShadow: "var(--shadow-sm)" }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 12 }}>{feat.title}</h3>
                <p style={{ color: "var(--gray-500)", fontSize: "0.95rem", lineHeight: 1.6 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Portals Section ── */}
        <section id="portals" style={{ padding: "100px 24px", background: "var(--gray-100)" }}>
          <div className="container-app" style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="section-tag">Access Portals</div>
            <h2 className="section-title">Select your workspace</h2>
            <p className="section-subtitle" style={{ margin: "16px auto 0" }}>Dedicated interfaces optimized for exactly what you need to do.</p>
          </div>

          <div className="container-app" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
            
            {/* Admin Portal */}
            <Link href="/admin/login" style={{ textDecoration: "none" }}>
              <div className="card card-hover" style={{ padding: 48, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", background: "#fff", border: "1px solid var(--gray-200)", borderRadius: 24, height: "100%" }}>
                <div style={{ width: 88, height: 88, borderRadius: "50%", background: "rgba(30, 79, 216, 0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
                  <ShieldCheck size={40} color="var(--blue)" />
                </div>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--navy)", marginBottom: 16 }}>Admin</h3>
                <p style={{ fontSize: "1rem", color: "var(--gray-500)", marginBottom: 32, lineHeight: 1.6, flex: 1 }}>
                  Manage gym operations, staff, revenue, and view comprehensive business analytics.
                </p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "1rem", fontWeight: 700, color: "var(--blue)", background: "rgba(30, 79, 216, 0.05)", padding: "12px 24px", borderRadius: 999 }}>
                  Enter Portal <ArrowRight size={18} />
                </div>
              </div>
            </Link>

            {/* Trainer Portal */}
            <Link href="/trainer/login" style={{ textDecoration: "none" }}>
              <div className="card card-hover" style={{ padding: 48, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", background: "#fff", border: "1px solid var(--gray-200)", borderRadius: 24, height: "100%" }}>
                <div style={{ width: 88, height: 88, borderRadius: "50%", background: "rgba(249, 115, 22, 0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
                  <Dumbbell size={40} color="var(--orange)" />
                </div>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--navy)", marginBottom: 16 }}>Trainer</h3>
                <p style={{ fontSize: "1rem", color: "var(--gray-500)", marginBottom: 32, lineHeight: 1.6, flex: 1 }}>
                  View your daily schedule, manage assigned members, and track client performance.
                </p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "1rem", fontWeight: 700, color: "var(--orange)", background: "rgba(249, 115, 22, 0.05)", padding: "12px 24px", borderRadius: 999 }}>
                  Enter Portal <ArrowRight size={18} />
                </div>
              </div>
            </Link>

            {/* Member Portal */}
            <Link href="/member/login" style={{ textDecoration: "none" }}>
              <div className="card card-hover" style={{ padding: 48, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", background: "#fff", border: "1px solid var(--gray-200)", borderRadius: 24, height: "100%" }}>
                <div style={{ width: 88, height: 88, borderRadius: "50%", background: "rgba(34, 197, 94, 0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
                  <User size={40} color="#22C55E" />
                </div>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--navy)", marginBottom: 16 }}>Member</h3>
                <p style={{ fontSize: "1rem", color: "var(--gray-500)", marginBottom: 32, lineHeight: 1.6, flex: 1 }}>
                  Track your fitness goals, book classes, and manage your gym membership effortlessly.
                </p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "1rem", fontWeight: 700, color: "#22C55E", background: "rgba(34, 197, 94, 0.05)", padding: "12px 24px", borderRadius: 999 }}>
                  Enter Portal <ArrowRight size={18} />
                </div>
              </div>
            </Link>

          </div>
        </section>

        {/* ── Social Proof / CTA ── */}
        <section style={{ padding: "80px 24px", background: "var(--blue)", color: "#fff", textAlign: "center" }}>
          <div className="container-app">
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: 32, color: "#fff" }}>
              Ready to transform your facility?
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24, marginBottom: 40 }}>
              {["Secure & Reliable", "24/7 Support", "Easy Onboarding"].map((text, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
                  <CheckCircle2 size={20} color="var(--orange)" /> {text}
                </div>
              ))}
            </div>
            <Link href="#portals">
              <button className="btn btn-orange btn-xl" style={{ padding: "18px 48px", fontSize: "1.2rem", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
                Start Managing Today
              </button>
            </Link>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer style={{ padding: "64px 24px 32px", background: "var(--navy-800)", color: "var(--gray-400)" }}>
        <div className="container-app" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 48, marginBottom: 32 }}>
          
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <Image src="/logo.png" alt="FitnessZone" width={140} height={36} style={{ height: 36, width: "auto" }} />
            </div>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.6, maxWidth: 300 }}>
              The ultimate platform to build, manage, and scale your fitness business efficiently.
            </p>
          </div>

          <div>
            <h4 style={{ color: "#fff", fontWeight: 600, marginBottom: 20 }}>Product</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="#" style={{ transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "var(--gray-400)"}>Features</a>
              <a href="#" style={{ transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "var(--gray-400)"}>Pricing</a>
              <a href="#" style={{ transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "var(--gray-400)"}>Case Studies</a>
            </div>
          </div>

          <div>
            <h4 style={{ color: "#fff", fontWeight: 600, marginBottom: 20 }}>Support</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="#" style={{ transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "var(--gray-400)"}>Help Center</a>
              <a href="#" style={{ transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "var(--gray-400)"}>API Documentation</a>
              <a href="#" style={{ transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "var(--gray-400)"}>Contact Us</a>
            </div>
          </div>

          <div>
            <h4 style={{ color: "#fff", fontWeight: 600, marginBottom: 20 }}>Legal</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="#" style={{ transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "var(--gray-400)"}>Privacy Policy</a>
              <a href="#" style={{ transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "var(--gray-400)"}>Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="container-app" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <p style={{ fontSize: "0.85rem" }}>
            &copy; {new Date().getFullYear()} FitnessZone. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            {/* Social mock icons can go here */}
          </div>
        </div>
      </footer>

    </div>
  );
}
