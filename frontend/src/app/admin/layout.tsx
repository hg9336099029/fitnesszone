"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  UserCheck,
  ClipboardList,
  BarChart3,
  Dumbbell,
  Calendar,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/staff", label: "Staff", icon: UserCheck },
  { href: "/admin/memberships", label: "Memberships", icon: ClipboardList },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/attendance", label: "Attendance", icon: Calendar },
  { href: "/admin/trainers", label: "Trainers", icon: Dumbbell },
  { href: "/admin/classes", label: "Classes", icon: Calendar },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    setLoggingOut(true);
    // Clear auth tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // Small delay for visual feedback
    await new Promise((r) => setTimeout(r, 500));
    router.push("/");
  }, [router]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--gray-50)" }}>

      {/* ── Sidebar ──────────────────────────────────── */}
      <aside
        style={{
          width: 240,
          background: "var(--navy)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          transition: "transform 0.3s ease",
        }}
        className="hide-mobile"
      >
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Link href="/admin/dashboard">
            <Image src="/logo.png" alt="FitnessZone" width={140} height={36} style={{ height: 36, width: "auto" }} />
          </Link>
          <div style={{ marginTop: 8, fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Admin Portal
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

          <div style={{ marginTop: 24, marginBottom: 8, padding: "0 4px 8px", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            System
          </div>
          <Link href="/admin/settings" className="sidebar-nav-item" style={{ marginBottom: 2 }}>
            <Settings size={18} /> Settings
          </Link>
        </nav>

        {/* User info */}
        <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.06)" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: "0.8rem", flexShrink: 0 }}>
              AD
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Admin User</div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)" }}>Super Admin</div>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Logout"
              style={{
                background: "none",
                border: "none",
                color: loggingOut ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.55)",
                padding: 6,
                cursor: loggingOut ? "not-allowed" : "pointer",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.15s ease",
              }}
            >
              {loggingOut
                ? <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "rgba(255,255,255,0.6)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                : <LogOut size={16} />}
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────── */}
      <div style={{ flex: 1, marginLeft: 240, display: "flex", flexDirection: "column", minWidth: 0 }} className="hide-mobile">
        {/* Top bar */}
        <header
          style={{
            height: 64,
            background: "#fff",
            borderBottom: "1px solid var(--gray-200)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <div>
            <h1 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--navy)" }}>
              {NAV_ITEMS.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"))?.label ?? "Admin"}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Notifications Dropdown */}
            <div style={{ position: "relative" }}>
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                style={{ position: "relative", background: "none", border: "none", padding: 8, borderRadius: 8, color: notificationsOpen ? "var(--indigo)" : "var(--gray-500)", cursor: "pointer", transition: "color 0.15s" }}
              >
                <Bell size={20} />
                <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "var(--orange)", border: "2px solid #fff" }} />
              </button>
              {notificationsOpen && (
                <div style={{ position: "absolute", right: 0, top: "100%", marginTop: 8, width: 320, background: "#fff", borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.15)", border: "1px solid var(--gray-200)", overflow: "hidden", zIndex: 50 }}>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--gray-100)", fontWeight: 700, color: "var(--navy)", fontSize: "0.9rem" }}>Notifications</div>
                  <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                    {[
                      { id: 1, type: "warning", message: "4 memberships expiring this week", time: "2h ago" },
                      { id: 2, type: "info", message: "2 pending payment verifications", time: "5h ago" },
                      { id: 3, type: "success", message: "August revenue target 97% achieved", time: "1d ago" }
                    ].map(alert => (
                      <div key={alert.id} style={{ padding: "12px 16px", borderBottom: "1px solid var(--gray-100)", display: "flex", gap: 12, cursor: "pointer" }}
                           onMouseEnter={e => e.currentTarget.style.background = "var(--gray-50)"}
                           onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0, background: alert.type === "warning" ? "#F59E0B" : alert.type === "success" ? "#10B981" : "#3B82F6" }} />
                        <div>
                          <div style={{ fontSize: "0.85rem", color: "var(--navy)", fontWeight: 500 }}>{alert.message}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: 4 }}>{alert.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: 12, background: "var(--gray-50)", textAlign: "center", fontSize: "0.8rem", color: "var(--blue)", fontWeight: 600, cursor: "pointer" }}>Mark all as read</div>
                </div>
              )}
            </div>
            
            {/* Admin avatar Dropdown */}
            <div style={{ position: "relative" }}>
              <div onClick={() => setSettingsOpen(!settingsOpen)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "4px 8px", borderRadius: 8, background: settingsOpen ? "var(--gray-100)" : "transparent" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: "0.8rem" }}>
                  AD
                </div>
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--gray-700)" }}>Admin</span>
                <ChevronDown size={14} color="var(--gray-400)" />
              </div>
              {settingsOpen && (
                <div style={{ position: "absolute", right: 0, top: "100%", marginTop: 8, width: 200, background: "#fff", borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.15)", border: "1px solid var(--gray-200)", overflow: "hidden", zIndex: 50, padding: 8 }}>
                  <Link href="/admin/settings" onClick={() => setSettingsOpen(false)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 6, color: "var(--gray-700)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--gray-50)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <Settings size={16} /> Account Settings
                  </Link>
                  <div style={{ height: 1, background: "var(--gray-100)", margin: "4px 0" }} />
                  <button onClick={() => { setSettingsOpen(false); handleLogout(); }} disabled={loggingOut}
                          style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 6, color: "#DC2626", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500, background: "none", border: "none", cursor: loggingOut ? "not-allowed" : "pointer", textAlign: "left" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    {loggingOut ? <div style={{ width: 14, height: 14, border: "2px solid #FCA5A5", borderTopColor: "#DC2626", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> : <LogOut size={16} />}
                    {loggingOut ? "Logging out…" : "Logout"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "28px" }}>
          {children}
        </main>
      </div>

      {/* ── Mobile layout ────────────────────────────── */}
      <div className="hide-desktop" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Mobile header */}
        <header style={{ height: 60, background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", position: "sticky", top: 0, zIndex: 50 }}>
          <Image src="/logo.png" alt="FitnessZone" width={120} height={30} style={{ height: 30, width: "auto" }} />
          <button style={{ background: "none", border: "none", color: "#fff", padding: 8 }} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.5)" }} onClick={() => setMobileOpen(false)}>
            <div style={{ width: 260, height: "100%", background: "var(--navy)", padding: "20px 12px", overflowY: "auto", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className={`sidebar-nav-item ${pathname === href ? "active" : ""}`} style={{ marginBottom: 2 }} onClick={() => setMobileOpen(false)}>
                  <Icon size={18} /> {label}
                </Link>
              ))}
              {/* Mobile logout */}
              <button
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "rgba(239,68,68,0.12)", border: "none", borderRadius: 8, color: "#FCA5A5", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", width: "100%" }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        )}

        <main style={{ flex: 1, padding: "16px" }}>
          {children}
        </main>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
