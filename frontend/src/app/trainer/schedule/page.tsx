"use client";

import { useEffect, useState } from "react";
import { Clock, Users, MapPin, CheckCircle2, Calendar, AlertCircle } from "lucide-react";
import { trainerApi } from "@/lib/api/client";

const DAYS_OF_WEEK = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function TrainerSchedulePage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    trainerApi.getDashboard()
      .then(d => { setData(d); setIsLoading(false); })
      .catch(err => { setError(err.message || "Failed to load."); setIsLoading(false); });
  }, []);

  if (isLoading) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
        {[...Array(7)].map((_, i) => <div key={i} className="skeleton" style={{ width: 60, height: 72, borderRadius: 12 }} />)}
      </div>
      {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 110, borderRadius: 12 }} />)}
    </div>
  );

  if (error) return (
    <div style={{ padding: 60, textAlign: "center" }}>
      <AlertCircle size={48} color="#EF4444" style={{ margin: "0 auto 16px" }} />
      <p style={{ color: "#DC2626", fontWeight: 700 }}>{error}</p>
      <button onClick={() => window.location.reload()}
        style={{ marginTop: 16, padding: "10px 24px", background: "#F97316", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
        Retry
      </button>
    </div>
  );

  const assignedMembers = data?.assigned_members ?? [];
  const recentCheckIns = data?.recent_check_ins ?? [];
  const todayClasses = data?.today_classes ?? [];
  const todayStr = new Date().toISOString().split("T")[0];

  // Build a 7-day week starting from today
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Header ────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1a1a2e" }}>Schedule</h1>
          <p style={{ fontSize: "0.875rem", color: "#888", marginTop: 3 }}>Your weekly training sessions and member schedule</p>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#F97316" }}>{assignedMembers.length}</div>
            <div style={{ fontSize: "0.7rem", color: "#888", fontWeight: 600 }}>Members</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#22C55E" }}>{recentCheckIns.length}</div>
            <div style={{ fontSize: "0.7rem", color: "#888", fontWeight: 600 }}>Today&apos;s Check-ins</div>
          </div>
        </div>
      </div>

      {/* ── Week Strip ─────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {weekDays.map((d) => {
          const dateStr = d.toISOString().split("T")[0];
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDay;
          return (
            <button key={dateStr}
              onClick={() => setSelectedDay(dateStr)}
              style={{
                flexShrink: 0, width: 60, padding: "12px 0",
                borderRadius: 12, border: "none", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                background: isSelected ? "#1a1f2e" : isToday ? "#F9731615" : "#fff",
                boxShadow: isSelected ? "0 4px 12px rgba(26,31,46,0.25)" : "0 1px 4px rgba(0,0,0,0.06)",
                transition: "all 0.15s",
              }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: isSelected ? "#F97316" : "#aaa", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {DAYS_OF_WEEK[d.getDay()]}
              </span>
              <span style={{ fontSize: "1.2rem", fontWeight: 900, color: isSelected ? "#fff" : "#1a1a2e", lineHeight: 1 }}>
                {d.getDate()}
              </span>
              <span style={{ fontSize: "0.62rem", color: isSelected ? "rgba(255,255,255,0.5)" : "#bbb" }}>
                {MONTH_NAMES[d.getMonth()]}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>

        {/* ── Schedule for selected day ──────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar size={16} color="#F97316" />
            <span style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "0.9rem" }}>
              {new Date(selectedDay + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </span>
            {selectedDay === todayStr && (
              <span style={{ fontSize: "0.68rem", padding: "2px 10px", borderRadius: 999, background: "#F97316", color: "#fff", fontWeight: 700 }}>Today</span>
            )}
          </div>

          {/* Classes for selected day */}
          {todayClasses.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 12, padding: 40, textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee" }}>
              <Calendar size={40} style={{ margin: "0 auto 12px", color: "#e0e0e0" }} />
              <p style={{ color: "#bbb", fontWeight: 600 }}>No classes scheduled</p>
              <p style={{ color: "#ccc", fontSize: "0.8rem", marginTop: 4 }}>Classes will appear here once added</p>
            </div>
          ) : (
            todayClasses.map((cls: any, i: number) => {
              const fillPct = cls.capacity > 0 ? Math.round((cls.enrolled / cls.capacity) * 100) : 0;
              const isOngoing = cls.status === "ongoing";
              const isDone = cls.status === "completed";
              return (
                <div key={cls.id ?? i} style={{
                  background: "#fff", borderRadius: 12, padding: 20,
                  borderLeft: `4px solid ${isDone ? "#22C55E" : isOngoing ? "#F97316" : "#e0e0e0"}`,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee",
                  opacity: isDone ? 0.75 : 1,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        {isDone && <CheckCircle2 size={15} color="#22C55E" />}
                        <h3 style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "1rem" }}>{cls.name}</h3>
                      </div>
                      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                        {cls.start_datetime && (
                          <span style={{ fontSize: "0.8rem", color: "#888", display: "flex", alignItems: "center", gap: 5 }}>
                            <Clock size={12} />
                            {new Date(cls.start_datetime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} –{" "}
                            {new Date(cls.end_datetime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                        {cls.location && (
                          <span style={{ fontSize: "0.8rem", color: "#888", display: "flex", alignItems: "center", gap: 5 }}>
                            <MapPin size={12} /> {cls.location}
                          </span>
                        )}
                        <span style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 5, color: fillPct >= 90 ? "#DC2626" : "#888", fontWeight: fillPct >= 90 ? 700 : 400 }}>
                          <Users size={12} /> {cls.enrolled}/{cls.capacity} ({fillPct}% full)
                        </span>
                      </div>
                      <div style={{ height: 5, background: "#f0f0f0", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${fillPct}%`, background: fillPct >= 90 ? "#EF4444" : fillPct >= 70 ? "#F59E0B" : "#22C55E", borderRadius: 99 }} />
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, marginLeft: 16 }}>
                      <span style={{
                        fontSize: "0.72rem", fontWeight: 700, padding: "4px 12px", borderRadius: 999,
                        background: isDone ? "#DCFCE7" : isOngoing ? "#FFF7ED" : "#F5F5F5",
                        color: isDone ? "#15803D" : isOngoing ? "#C2410C" : "#888",
                      }}>
                        {isDone ? "✓ Done" : isOngoing ? "🔴 Live" : "⏰ Upcoming"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Right Panel: Assigned Members Today ─────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Check-ins today */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee" }}>
            <h3 style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "0.95rem", marginBottom: 14 }}>
              Today&apos;s Check-ins
            </h3>
            {recentCheckIns.length === 0 ? (
              <div style={{ textAlign: "center", padding: "16px 0", color: "#ccc" }}>
                <Users size={28} style={{ margin: "0 auto 8px" }} />
                <p style={{ fontSize: "0.8rem" }}>No check-ins yet</p>
              </div>
            ) : recentCheckIns.map((rec: any) => (
              <div key={rec.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #f5f5f5" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }} />
                  <span style={{ fontWeight: 500, color: "#1a1a2e", fontSize: "0.875rem" }}>{rec.member_name}</span>
                </div>
                <span style={{ fontSize: "0.75rem", color: "#aaa" }}>
                  {new Date(rec.check_in).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>

          {/* All assigned members */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee" }}>
            <h3 style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "0.95rem", marginBottom: 14 }}>
              Assigned Members <span style={{ fontSize: "0.75rem", color: "#aaa", fontWeight: 500 }}>({assignedMembers.length})</span>
            </h3>
            {assignedMembers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "16px 0", color: "#ccc", fontSize: "0.875rem" }}>No members assigned</div>
            ) : assignedMembers.map((m: any) => {
              const checkedIn = recentCheckIns.some((r: any) => r.member_id === m.id);
              const initials = m.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
              return (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: checkedIn ? "#DCFCE7" : "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: checkedIn ? "#15803D" : "#888", fontSize: "0.72rem", flexShrink: 0 }}>{initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: "#1a1a2e", fontSize: "0.84rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.full_name}</div>
                    <div style={{ fontSize: "0.7rem", color: "#aaa", textTransform: "capitalize" }}>{m.membership_level || "No plan"}</div>
                  </div>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: checkedIn ? "#DCFCE7" : "#FEF2F2", color: checkedIn ? "#15803D" : "#DC2626" }}>
                    {checkedIn ? "In Gym" : "Absent"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
