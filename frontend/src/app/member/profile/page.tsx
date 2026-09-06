"use client";

import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Edit2,
  Camera,
  Shield,
  CreditCard,
  Bell,
  ChevronRight,
  LogOut,
  Calendar,
  Award,
} from "lucide-react";
import { memberPortalApi, authApi } from "@/lib/api/client";
import { useRouter } from "next/navigation";

export default function MemberProfilePage() {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [form, setForm] = useState({ full_name: "", email: "", city: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    memberPortalApi
      .getDashboard()
      .then((d) => {
        setData(d);
        setForm({
          full_name: d.member.full_name,
          email: d.member.email,
          city: d.member.city,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await authApi.updateProfile({ full_name: form.full_name, email: form.email });
      setEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
          <div className="skeleton" style={{ height: 280, borderRadius: 14 }} />
          <div className="skeleton" style={{ height: 280, borderRadius: 14 }} />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const memberInfo = data.member;
  const initials = memberInfo.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
  const joinedDate = new Date(memberInfo.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Top grid: profile card + form */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>

        {/* Left: Profile card */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 32, textAlign: "center" }}>
            <div style={{ position: "relative", width: 96, height: 96, margin: "0 auto 16px" }}>
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--orange) 0%, #ea6700 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: "2.2rem",
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                {initials}
              </div>
              {editing && (
                <button
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "var(--blue)",
                    border: "2px solid #fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Camera size={14} color="#fff" />
                </button>
              )}
            </div>

            <h2 style={{ fontWeight: 800, color: "var(--navy)", fontSize: "1.2rem", marginBottom: 6 }}>{memberInfo.full_name}</h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
              {data.membership?.plan?.level && (
                <span
                  className="badge"
                  style={{
                    background: "linear-gradient(135deg, var(--orange), #ea6700)",
                    color: "#fff",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: 99,
                  }}
                >
                  {data.membership.plan.level.charAt(0).toUpperCase() + data.membership.plan.level.slice(1)} Member
                </span>
              )}
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--gray-400)", fontFamily: "monospace", letterSpacing: "0.04em" }}>
              {memberInfo.member_id}
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--gray-100)" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 900, color: "var(--navy)" }}>
                  {data.goals?.length ?? 0}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--gray-500)" }}>Goals</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 900, color: "var(--navy)" }}>
                  {data.achievements?.length ?? 0}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--gray-500)" }}>Badges</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 900, color: "var(--navy)" }}>
                  {data.attendance_streak ?? 0}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--gray-500)" }}>Streak</div>
              </div>
            </div>
          </div>

          {/* Membership card */}
          {data.membership && (
            <div
              style={{
                background: "linear-gradient(135deg, var(--navy) 0%, #1a3a6e 100%)",
                borderRadius: 16,
                padding: "20px 24px",
              }}
            >
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 10 }}>
                Active Membership
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 900, color: "#fff", marginBottom: 4 }}>
                {data.membership.plan?.name ?? "—"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>
                <Calendar size={13} />
                Joined {joinedDate}
              </div>
              {data.membership.end_date && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", fontWeight: 700, marginBottom: 4 }}>Renewal Date</div>
                  <div style={{ fontSize: "0.875rem", color: "#fff", fontWeight: 600 }}>
                    {new Date(data.membership.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Personal info + settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Personal information */}
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1rem" }}>Personal Information</h2>
              <button
                className={editing ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"}
                onClick={editing ? handleSave : () => setEditing(true)}
                disabled={saving}
              >
                <Edit2 size={14} /> {saving ? "Saving…" : editing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { icon: User, label: "Full Name", key: "full_name", value: form.full_name, type: "text" },
                { icon: Phone, label: "Mobile Number", key: "mobile", value: memberInfo.mobile, type: "tel", disabled: true },
                { icon: Mail, label: "Email Address", key: "email", value: form.email, type: "email" },
                { icon: MapPin, label: "City", key: "city", value: form.city, type: "text" },
              ].map(({ icon: Icon, label, key, value, type, disabled }) => (
                <div key={key}>
                  <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <Icon size={13} color="var(--gray-400)" /> {label}
                  </label>
                  <input
                    type={type}
                    className="form-input"
                    value={value}
                    disabled={!editing || !!disabled}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    style={{
                      background: (!editing || disabled) ? "var(--gray-50)" : "#fff",
                      cursor: (!editing || disabled) ? "not-allowed" : "text",
                    }}
                  />
                  {disabled && (
                    <p className="form-hint">Cannot be changed. Contact support.</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Account settings */}
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--gray-100)", fontWeight: 700, color: "var(--navy)", fontSize: "1rem" }}>
              Account Settings
            </div>
            {[
              { icon: CreditCard, label: "Membership & Billing", sub: data.membership ? `${data.membership.plan?.name} Plan` : "No active plan" },
              { icon: Shield, label: "Change Password", sub: "Keep your account secure" },
              { icon: Bell, label: "Notification Preferences", sub: "Email & SMS alerts" },
              { icon: Award, label: "Achievements", sub: `${data.achievements?.length ?? 0} badges earned` },
            ].map(({ icon: Icon, label, sub }) => (
              <button
                key={label}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 24px",
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid var(--gray-100)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--gray-50)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--gray-100)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} color="var(--gray-500)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--gray-800)", fontSize: "0.875rem" }}>{label}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: 2 }}>{sub}</div>
                  </div>
                </div>
                <ChevronRight size={16} color="var(--gray-300)" />
              </button>
            ))}

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 24px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--error)",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FEF2F2")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LogOut size={18} color="var(--error)" />
              </div>
              <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
