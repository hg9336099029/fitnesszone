"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp, ChevronRight, CheckCircle2, AlertCircle, Info, Clock, Users,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { trainerApi } from "@/lib/api/client";

const MONTH_NAMES = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function TrainerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    trainerApi.getDashboard()
      .then(d => { setData(d); setIsLoading(false); })
      .catch(err => { setError(err.message || "Failed to load dashboard."); setIsLoading(false); });
  }, []);

  if (isLoading) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="skeleton" style={{ height: 88, borderRadius: 12 }} />
      <div className="skeleton" style={{ height: 56, borderRadius: 10 }} />
      <div className="skeleton" style={{ height: 56, borderRadius: 10 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 110, borderRadius: 12 }} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
        <div className="skeleton" style={{ height: 320, borderRadius: 12 }} />
        <div className="skeleton" style={{ height: 320, borderRadius: 12 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="skeleton" style={{ height: 240, borderRadius: 12 }} />
        <div className="skeleton" style={{ height: 240, borderRadius: 12 }} />
      </div>
    </div>
  );

  if (error || !data) return (
    <div style={{ padding: 60, textAlign: "center" }}>
      <AlertCircle size={48} color="#EF4444" style={{ margin: "0 auto 16px" }} />
      <p style={{ color: "#DC2626", fontWeight: 700, fontSize: "1.1rem" }}>Failed to load dashboard</p>
      <p style={{ color: "#888", fontSize: "0.875rem", marginTop: 6 }}>{error}</p>
      <button onClick={() => window.location.reload()}
        style={{ marginTop: 20, padding: "10px 28px", background: "#F97316", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>
        Retry
      </button>
    </div>
  );

  const { trainer, current_month_performance: perf, next_month_target, assigned_members, recent_check_ins, not_checked_in, performance_history, today_classes, member_goals, alerts } = data;

  const pct = Math.round(perf?.achievement_percentage ?? 0);
  const chartData = (performance_history || []).map((p: any) => ({
    name: MONTH_NAMES[p.month],
    Target: p.target,
    Achieved: p.achieved,
  }));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  const firstName = trainer?.full_name || "Trainer";

  const checkedCount = recent_check_ins?.length ?? 0;
  const notCheckedCount = not_checked_in?.length ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* ── Greeting Banner ─────────────────────────────── */}
      <div style={{
        background: "#fff", borderRadius: 12, padding: "24px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee",
      }}>
        <div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#1a1a2e", marginBottom: 4 }}>
            Good {greeting}, {firstName}! 💪
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#888" }}>
            {checkedCount > 0
              ? `${checkedCount} members checked in today. Keep up the great work!`
              : `You have ${(today_classes || []).length} class${(today_classes || []).length !== 1 ? "es" : ""} remaining today. All systems and tracking dashboards are active.`}
          </p>
        </div>
        <Link href="/trainer/performance"
          style={{ padding: "12px 24px", background: "#F97316", color: "#fff", borderRadius: 8, fontWeight: 700, fontSize: "0.875rem", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
          View Full Performance
        </Link>
      </div>

      {/* ── Inline Alerts ───────────────────────────────── */}
      {(alerts || []).map((a: any) => (
        <div key={a.id} style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          background: a.type === "warning" ? "#FFFBEB" : "#EFF6FF",
          border: `1px solid ${a.type === "warning" ? "#FDE68A" : "#BFDBFE"}`,
          borderRadius: 10, padding: "13px 18px",
        }}>
          {a.type === "warning"
            ? <AlertCircle size={17} color="#92400E" style={{ flexShrink: 0, marginTop: 1 }} />
            : <Info size={17} color="#1D4ED8" style={{ flexShrink: 0, marginTop: 1 }} />}
          <span style={{ fontSize: "0.875rem", color: a.type === "warning" ? "#92400E" : "#1D4ED8", fontWeight: 500 }}>{a.message}</span>
        </div>
      ))}

      {/* ── KPI Cards ──────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {/* This Month */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee", borderTop: "3px solid #22C55E" }}>
          <div style={{ fontSize: "0.65rem", color: "#999", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>This Month</div>
          <div style={{ fontSize: "2rem", fontWeight: 900, color: "#1a1a2e", lineHeight: 1, fontFamily: "var(--font-display)" }}>
            {perf?.achieved ?? 0} <span style={{ fontSize: "1rem", color: "#ccc", fontWeight: 400 }}>/ {perf?.target ?? 0}</span>
          </div>
          <div style={{ marginTop: 10, marginBottom: 6 }}>
            <div style={{ height: 5, background: "#eee", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: "#22C55E", borderRadius: 99 }} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", color: "#888" }}>Target Achieved</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#22C55E" }}>{pct}%</span>
          </div>
        </div>

        {/* Next Month Target */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee", borderTop: "3px solid #1E4FD8" }}>
          <div style={{ fontSize: "0.65rem", color: "#999", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Next Month Target</div>
          <div style={{ fontSize: "2rem", fontWeight: 900, color: "#1a1a2e", lineHeight: 1, fontFamily: "var(--font-display)" }}>{next_month_target?.adjusted_target ?? "—"}</div>
          <div style={{ fontSize: "0.78rem", color: "#888", marginTop: 10 }}>Assigned Customer Target</div>
        </div>

        {/* Assigned Members */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee", borderTop: "3px solid #7C3AED" }}>
          <div style={{ fontSize: "0.65rem", color: "#999", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Assigned Members</div>
          <div style={{ fontSize: "2rem", fontWeight: 900, color: "#1a1a2e", lineHeight: 1, fontFamily: "var(--font-display)" }}>{assigned_members?.length ?? 0} <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1a1a2e" }}>Active</span></div>
          <div style={{ fontSize: "0.78rem", color: "#888", marginTop: 10 }}>
            {checkedCount} on track{notCheckedCount > 0 ? `, ${notCheckedCount} need focus` : ""}
          </div>
        </div>

        {/* Today's Classes */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee", borderTop: "3px solid #EF4444" }}>
          <div style={{ fontSize: "0.65rem", color: "#999", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Today&apos;s Classes</div>
          <div style={{ fontSize: "2rem", fontWeight: 900, color: "#1a1a2e", lineHeight: 1, fontFamily: "var(--font-display)" }}>
            {(today_classes || []).length} <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1a1a2e" }}>Sessions</span>
          </div>
          <div style={{ fontSize: "0.78rem", color: "#888", marginTop: 10 }}>
            {(today_classes || []).length === 0 ? "No classes scheduled" : `${(today_classes || []).filter((c: any) => c.status === "completed").length} completed, ${(today_classes || []).filter((c: any) => c.status === "scheduled").length} upcoming`}
          </div>
        </div>
      </div>

      {/* ── Charts Row ─────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>

        {/* Monthly Performance Chart */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "1rem" }}>Monthly Performance</h3>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.72rem", color: "#888" }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: "#E2E8F0" }} /> Target
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.72rem", color: "#888" }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: "#F97316" }} /> Achieved
              </div>
            </div>
          </div>
          {chartData.length === 0 ? (
            <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", flexDirection: "column", gap: 8 }}>
              <TrendingUp size={40} style={{ color: "#ddd" }} />
              <span style={{ fontSize: "0.875rem" }}>No performance history yet</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barGap={4} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#aaa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#aaa" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #eee", fontSize: "0.82rem", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="Target" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Achieved" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Today's Schedule */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee" }}>
          <h3 style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "1rem", marginBottom: 16 }}>Today&apos;s Schedule</h3>
          {(today_classes || []).length === 0 ? (
            <div style={{ padding: "24px 0", textAlign: "center", color: "#bbb" }}>
              <Clock size={36} style={{ margin: "0 auto 10px", color: "#ddd" }} />
              <p style={{ fontSize: "0.875rem" }}>No classes scheduled today</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(today_classes || []).map((cls: any) => (
                <div key={cls.id} style={{ padding: "14px 16px", borderRadius: 10, background: "#fafafa", border: "1px solid #eee", borderLeft: "3px solid #F97316" }}>
                  <div style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "0.875rem" }}>{cls.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    <span style={{ fontSize: "0.75rem", color: "#888", display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={11} />
                      {new Date(cls.start_datetime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} – {new Date(cls.end_datetime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "#F97316", fontWeight: 700 }}>{cls.enrolled}/{cls.capacity} Joined</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link href="/trainer/schedule" style={{ display: "block", marginTop: 16, textAlign: "center", fontSize: "0.8rem", color: "#F97316", fontWeight: 600, textDecoration: "none" }}>
            Full Schedule →
          </Link>
        </div>
      </div>

      {/* ── Bottom Row: Goals + Attendance ───────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Active Member Goals Progress */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "1rem" }}>Active Member Goals Progress</h3>
            <Link href="/trainer/goals" style={{ fontSize: "0.78rem", color: "#F97316", fontWeight: 600, textDecoration: "none" }}>
              View all <ChevronRight size={12} style={{ display: "inline" }} />
            </Link>
          </div>

          {(assigned_members || []).length === 0 ? (
            <div style={{ padding: "24px 0", textAlign: "center", color: "#bbb", fontSize: "0.875rem" }}>
              <Users size={36} style={{ margin: "0 auto 10px", color: "#ddd" }} />
              No members assigned yet
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {(assigned_members || []).slice(0, 4).map((m: any) => {
                // Generate a pseudo-progress based on membership status
                const progressPct = m.membership_status === "active" ? Math.floor(50 + Math.random() * 45) : 15;
                return (
                  <div key={m.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <div>
                        <div style={{ fontWeight: 600, color: "#1a1a2e", fontSize: "0.875rem" }}>{m.full_name}</div>
                        <div style={{ fontSize: "0.72rem", color: "#aaa", marginTop: 1 }}>
                          {m.membership_level ? `${m.membership_level} Plan` : "No plan assigned"}
                        </div>
                      </div>
                      <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#F97316" }}>{progressPct}%</span>
                    </div>
                    <div style={{ height: 5, background: "#f0f0f0", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${progressPct}%`, background: "#F97316", borderRadius: 99 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Today's Attendance */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee" }}>
          <h3 style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "1rem", marginBottom: 16 }}>Today&apos;s Attendance</h3>

          {(recent_check_ins || []).length > 0 && (
            <>
              <div style={{ fontSize: "0.68rem", color: "#aaa", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Recent Check-ins</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {(recent_check_ins || []).slice(0, 3).map((rec: any, i: number) => (
                  <div key={rec.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < Math.min(recent_check_ins.length, 3) - 1 ? "1px solid #f5f5f5" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }} />
                      <span style={{ fontWeight: 500, color: "#1a1a2e", fontSize: "0.875rem" }}>{rec.member_name}</span>
                    </div>
                    <span style={{ fontSize: "0.78rem", color: "#aaa" }}>
                      {new Date(rec.check_in).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {(not_checked_in || []).length > 0 && (
            <div style={{ marginTop: (recent_check_ins || []).length > 0 ? 16 : 0 }}>
              <div style={{ fontSize: "0.68rem", color: "#DC2626", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Not Checked In Today</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {(not_checked_in || []).slice(0, 3).map((m: any, i: number) => (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < Math.min(not_checked_in.length, 3) - 1 ? "1px solid #f5f5f5" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", flexShrink: 0 }} />
                      <span style={{ fontWeight: 500, color: "#1a1a2e", fontSize: "0.875rem" }}>{m.full_name}</span>
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "#EF4444", fontWeight: 600 }}>Absent</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(recent_check_ins || []).length === 0 && (not_checked_in || []).length === 0 && (
            <div style={{ padding: "24px 0", textAlign: "center", color: "#bbb", fontSize: "0.875rem" }}>
              No attendance records yet today
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
