"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  LayoutDashboard, Users, TrendingUp, Calendar,
  User, Bell, LogOut, Menu, X, Dumbbell, AlertCircle, Info,
} from "lucide-react";
import { trainerApi } from "@/lib/api/client";

const NAV_ITEMS = [
  { href: "/trainer/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
  { href: "/trainer/members",     label: "My Members",  icon: Users },
  { href: "/trainer/performance", label: "Performance", icon: TrendingUp },
  { href: "/trainer/schedule",    label: "Schedule",    icon: Calendar },
  { href: "/trainer/profile",     label: "Profile",     icon: User },
];

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [mobileOpen,         setMobileOpen]         = useState(false);
  const [loggingOut,         setLoggingOut]         = useState(false);
  const [notificationsOpen,  setNotificationsOpen]  = useState(false);
  const [profileOpen,        setProfileOpen]        = useState(false);
  const [alerts,             setAlerts]             = useState<{ id: number; type: string; message: string }[]>([]);
  const [trainerData,        setTrainerData]        = useState<any>(null);
  const notifRef   = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trainerApi.getDashboard().then((data: any) => {
      if (data?.alerts)  setAlerts(data.alerts);
      if (data?.trainer) setTrainerData(data.trainer);
    }).catch(() => {});
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (notifRef.current   && !notifRef.current.contains(e.target as Node))   setNotificationsOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const handleLogout = useCallback(async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    setLoggingOut(true);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    await new Promise(r => setTimeout(r, 500));
    router.push("/");
  }, [router]);

  const trainerName    = trainerData?.full_name || "Trainer";
  const initials       = trainerName.split(" ").map((p: string) => p[0]).join("").substring(0, 2).toUpperCase();
  const specialization = Array.isArray(trainerData?.specialization) && trainerData.specialization.length > 0
    ? trainerData.specialization[0] : "Trainer";
  const currentLabel   = NAV_ITEMS.find(n => pathname === n.href || pathname.startsWith(n.href + "/"))?.label ?? "Trainer Portal";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--gray-50)" }}>

      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside
        className="hide-mobile"
        style={{
          width: 240,
          background: "var(--navy)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0, left: 0, bottom: 0,
          zIndex: 50,
          transition: "transform 0.3s ease",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Link href="/trainer/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Image src="/logo.png" alt="FitnessZone" width={140} height={36} style={{ height: 36, width: "auto" }} />
          </Link>
          <div style={{ marginTop: 8, fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Trainer Portal
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
          <div style={{ marginBottom: 8, padding: "0 4px 8px", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Main Menu
          </div>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                style={{ marginBottom: 2 }}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Trainer info + logout */}
        <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.06)" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: "0.8rem", flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{trainerName}</div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", textTransform: "capitalize" }}>{specialization}</div>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Logout"
              style={{ background: "none", border: "none", color: loggingOut ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.55)", padding: 6, cursor: loggingOut ? "not-allowed" : "pointer", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {loggingOut
                ? <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "rgba(255,255,255,0.6)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                : <LogOut size={16} />}
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────── */}
      <div className="hide-mobile" style={{ flex: 1, marginLeft: 240, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header style={{ height: 64, background: "#fff", borderBottom: "1px solid var(--gray-200)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", position: "sticky", top: 0, zIndex: 30 }}>
          <div>
            <h1 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--navy)" }}>{currentLabel}</h1>
            <p style={{ fontSize: "0.72rem", color: "var(--gray-400)", marginTop: 1 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Notifications */}
            <div ref={notifRef} style={{ position: "relative" }}>
              <button
                onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}
                style={{ position: "relative", background: "none", border: "none", padding: 8, borderRadius: 8, color: notificationsOpen ? "var(--indigo)" : "var(--gray-500)", cursor: "pointer", transition: "color 0.15s" }}
              >
                <Bell size={20} />
                {alerts.length > 0 && (
                  <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "var(--orange)", border: "2px solid #fff" }} />
                )}
              </button>
              {notificationsOpen && (
                <div style={{ position: "absolute", right: 0, top: "100%", marginTop: 8, width: 320, background: "#fff", borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.15)", border: "1px solid var(--gray-200)", overflow: "hidden", zIndex: 50 }}>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--gray-100)", fontWeight: 700, color: "var(--navy)", fontSize: "0.9rem" }}>Notifications</div>
                  <div style={{ maxHeight: 300, overflowY: "auto" }}>
                    {alerts.length === 0 ? (
                      <div style={{ padding: 24, textAlign: "center", color: "var(--gray-400)", fontSize: "0.875rem" }}>🎉 All caught up!</div>
                    ) : alerts.map(a => (
                      <div key={a.id} style={{ padding: "12px 16px", borderBottom: "1px solid var(--gray-100)", display: "flex", gap: 12, cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--gray-50)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0, background: a.type === "warning" ? "#F59E0B" : "#3B82F6" }} />
                        <div>
                          <div style={{ fontSize: "0.85rem", color: "var(--navy)", fontWeight: 500 }}>{a.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {alerts.length > 0 && (
                    <div style={{ padding: 12, background: "var(--gray-50)", textAlign: "center", fontSize: "0.8rem", color: "var(--blue)", fontWeight: 600, cursor: "pointer" }}
                      onClick={() => { setAlerts([]); setNotificationsOpen(false); }}>
                      Mark all as read
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div ref={profileRef} style={{ position: "relative" }}>
              <div
                onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "4px 8px", borderRadius: 8, background: profileOpen ? "var(--gray-100)" : "transparent" }}
              >
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: "0.8rem" }}>
                  {initials}
                </div>
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--gray-700)" }}>{trainerName.split(" ")[0]}</span>
              </div>
              {profileOpen && (
                <div style={{ position: "absolute", right: 0, top: "100%", marginTop: 8, width: 200, background: "#fff", borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.15)", border: "1px solid var(--gray-200)", overflow: "hidden", zIndex: 50, padding: 8 }}>
                  <Link href="/trainer/profile" onClick={() => setProfileOpen(false)}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 6, color: "var(--gray-700)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--gray-50)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <User size={16} /> My Profile
                  </Link>
                  <div style={{ height: 1, background: "var(--gray-100)", margin: "4px 0" }} />
                  <button onClick={() => { setProfileOpen(false); handleLogout(); }} disabled={loggingOut}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 6, color: "#DC2626", fontSize: "0.875rem", fontWeight: 500, background: "none", border: "none", cursor: loggingOut ? "not-allowed" : "pointer", textAlign: "left" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    {loggingOut
                      ? <div style={{ width: 14, height: 14, border: "2px solid #FCA5A5", borderTopColor: "#DC2626", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                      : <LogOut size={16} />}
                    {loggingOut ? "Logging out…" : "Logout"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: "28px" }}>{children}</main>
      </div>

      {/* ── Mobile Layout ─────────────────────────────────── */}
      <div className="hide-desktop" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{ height: 60, background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/logo.png" alt="FitnessZone" width={120} height={30} style={{ height: 30, width: "auto" }} />
          </div>
          <button style={{ background: "none", border: "none", color: "#fff", padding: 8 }} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {mobileOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.5)" }} onClick={() => setMobileOpen(false)}>
            <div style={{ width: 260, height: "100%", background: "var(--navy)", padding: "20px 12px", overflowY: "auto", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}
                  className={`sidebar-nav-item ${pathname === href ? "active" : ""}`}
                  style={{ marginBottom: 2 }}
                  onClick={() => setMobileOpen(false)}>
                  <Icon size={18} /> {label}
                </Link>
              ))}
              <button onClick={() => { setMobileOpen(false); handleLogout(); }}
                style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "rgba(239,68,68,0.12)", border: "none", borderRadius: 8, color: "#FCA5A5", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", width: "100%" }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        )}

        <main style={{ flex: 1, padding: "16px", paddingBottom: 72 }}>{children}</main>

        {/* Mobile bottom nav */}
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid var(--gray-200)", display: "flex", zIndex: 50 }}>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link key={href} href={href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 0 12px", gap: 4, color: isActive ? "var(--indigo)" : "var(--gray-400)", textDecoration: "none", fontSize: "0.6rem", fontWeight: isActive ? 700 : 500 }}>
                <Icon size={20} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
