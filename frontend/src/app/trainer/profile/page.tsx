"use client";

import { useEffect, useState } from "react";
import { User, Phone, Mail, Star, Award, Dumbbell, Clock, Calendar, Users, LogOut, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { trainerApi } from "@/lib/api/client";

export default function TrainerProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    trainerApi.getDashboard()
      .then(d => { setData(d); setIsLoading(false); })
      .catch(err => { setError(err.message || "Failed to load."); setIsLoading(false); });
  }, []);

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    setLoggingOut(true);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    await new Promise(r => setTimeout(r, 400));
    router.push("/");
  };

  if (isLoading) return (
    <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="skeleton" style={{ height: 140, borderRadius: 12 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 90, borderRadius: 12 }} />)}
      </div>
      {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 110, borderRadius: 12 }} />)}
    </div>
  );

  if (error || !data) return (
    <div style={{ padding: 60, textAlign: "center" }}>
      <AlertCircle size={48} color="#EF4444" style={{ margin: "0 auto 16px" }} />
      <p style={{ color: "#DC2626", fontWeight: 700 }}>Failed to load profile</p>
      <button onClick={() => window.location.reload()}
        style={{ marginTop: 16, padding: "10px 24px", background: "#1a1f2e", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
        Retry
      </button>
    </div>
  );

  const trainer = data.trainer ?? {};
  const perf = data.current_month_performance ?? {};
  const assignedCount = data.assigned_members?.length ?? 0;

  const fullName = trainer.full_name || "Trainer";
  const initials = fullName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
  const specializations: string[] = Array.isArray(trainer.specialization) ? trainer.specialization : [];
  const certifications: string[] = Array.isArray(trainer.certifications) ? trainer.certifications : [];
  const rating = trainer.rating ?? "—";
  const experience = trainer.experience_years ?? "—";
  const availability = trainer.availability ?? "Mon–Sat";
  const joinedDate = trainer.joining_date
    ? new Date(trainer.joining_date).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "—";

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1a1a2e" }}>My Profile</h1>
          <p style={{ fontSize: "0.875rem", color: "#888", marginTop: 3 }}>Your trainer account information</p>
        </div>
      </div>

      {/* ── Profile Hero Card ──────────────────────────────── */}
      <div style={{ background: "#1a1f2e", borderRadius: 16, padding: 28, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        {/* Avatar */}
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: "1.8rem", flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontWeight: 800, color: "#fff", fontSize: "1.4rem", marginBottom: 6 }}>{fullName}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
            {rating !== "—" && (
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff" }}>{rating}</span>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>rating</span>
              </div>
            )}
            {experience !== "—" && (
              <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>· {experience} yrs experience</span>
            )}
            {joinedDate !== "—" && (
              <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>· Since {joinedDate}</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {specializations.length > 0
              ? specializations.map((s: string) => (
                  <span key={s} style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: 999, background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{s}</span>
                ))
              : <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>No specializations set</span>}
          </div>
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {[
          { label: "Members",    value: assignedCount, icon: Users,    color: "#1E4FD8" },
          { label: "Experience", value: experience !== "—" ? `${experience}y` : "—", icon: Clock, color: "#7C3AED" },
          { label: "This Month", value: `${perf.achieved ?? 0}/${perf.target ?? 0}`, icon: Dumbbell, color: "#22C55E" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ background: "#fff", borderRadius: 12, padding: "18px 16px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
              <Icon size={18} color={color} />
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#1a1a2e" }}>{value}</div>
            <div style={{ fontSize: "0.7rem", color: "#aaa", fontWeight: 600, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Contact Info ──────────────────────────────────── */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee" }}>
        <h3 style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "0.95rem", marginBottom: 16 }}>Contact Information</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { icon: Phone,    label: "Mobile",       value: trainer.mobile    || "Not set" },
            { icon: Mail,     label: "Email",        value: trainer.email     || "Not set" },
            { icon: Calendar, label: "Availability", value: availability },
          ].map(({ icon: Icon, label, value }, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderBottom: i < 2 ? "1px solid #f5f5f5" : "none" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={15} color="#888" />
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#aaa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1a1a2e", marginTop: 1 }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Certifications ────────────────────────────────── */}
      {certifications.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee" }}>
          <h3 style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "0.95rem", marginBottom: 14 }}>Certifications</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {certifications.map((cert: string) => (
              <div key={cert} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#fafafa", borderRadius: 8, border: "1px solid #eee" }}>
                <Award size={16} color="#888" />
                <span style={{ fontWeight: 600, color: "#1a1a2e", fontSize: "0.875rem" }}>{cert}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Account Info ─────────────────────────────────── */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee" }}>
        <h3 style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "0.95rem", marginBottom: 14 }}>Account</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { label: "Trainer ID",    value: trainer.trainer_id  || "—" },
            { label: "Username",      value: trainer.username    || "—" },
            { label: "Member Since",  value: joinedDate },
            { label: "Status",        value: trainer.is_active !== false ? "Active" : "Inactive" },
          ].map(({ label, value }, i, arr) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: i < arr.length - 1 ? "1px solid #f5f5f5" : "none" }}>
              <span style={{ fontSize: "0.8rem", color: "#aaa", fontWeight: 500 }}>{label}</span>
              <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1a1a2e" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sign Out ──────────────────────────────────────── */}
      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee" }}>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", background: "none", border: "none", cursor: loggingOut ? "not-allowed" : "pointer", color: "#DC2626" }}
          onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LogOut size={17} color="#DC2626" />
          </div>
          <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{loggingOut ? "Signing out…" : "Sign Out"}</span>
        </button>
      </div>

    </div>
  );
}
