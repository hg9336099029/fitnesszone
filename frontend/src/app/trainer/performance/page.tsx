"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Target, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { trainerApi } from "@/lib/api/client";

const MONTH_NAMES = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function TrainerPerformancePage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    trainerApi.getDashboard()
      .then(d => { setData(d); setIsLoading(false); })
      .catch(err => { setError(err.message || "Failed to load."); setIsLoading(false); });
  }, []);

  if (isLoading) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 12 }} />)}
      </div>
      <div className="skeleton" style={{ height: 80, borderRadius: 12 }} />
      <div className="skeleton" style={{ height: 280, borderRadius: 12 }} />
      <div className="skeleton" style={{ height: 320, borderRadius: 12 }} />
    </div>
  );

  if (error || !data) return (
    <div style={{ padding: 60, textAlign: "center" }}>
      <AlertCircle size={48} color="#EF4444" style={{ margin: "0 auto 16px" }} />
      <p style={{ color: "#DC2626", fontWeight: 700 }}>Failed to load performance data</p>
      <p style={{ color: "#888", fontSize: "0.875rem", marginTop: 4 }}>{error}</p>
      <button onClick={() => window.location.reload()}
        style={{ marginTop: 16, padding: "10px 24px", background: "#F97316", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
        Retry
      </button>
    </div>
  );

  const { current_month_performance: perf, next_month_target, performance_history } = data;
  const pct = Math.round(perf?.achievement_percentage ?? 0);
  const remaining = Math.max((perf?.target ?? 0) - (perf?.achieved ?? 0), 0);

  const chartData = (performance_history || []).map((p: any) => ({
    name: `${MONTH_NAMES[p.month]} ${String(p.year).slice(-2)}`,
    Target: p.target,
    Achieved: p.achieved,
    pct: Math.round(p.achievement_percentage),
  }));

  const pctColor = pct >= 100 ? "#22C55E" : pct >= 80 ? "#F59E0B" : "#EF4444";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

      {/* ── Header ────────────────────────────────────────── */}
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1a1a2e" }}>Performance Tracker</h1>
        <p style={{ fontSize: "0.875rem", color: "#888", marginTop: 3 }}>Monthly customer acquisition targets and achievements</p>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee", borderTop: "3px solid #1E4FD8" }}>
          <div style={{ fontSize: "0.65rem", color: "#aaa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Target</div>
          <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#1E4FD8", lineHeight: 1, fontFamily: "var(--font-display)" }}>{(perf?.target ?? 0).toLocaleString("en-IN")}</div>
          <div style={{ fontSize: "0.8rem", color: "#888", marginTop: 6 }}>{MONTH_NAMES[perf?.month ?? 0]} {perf?.year}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee", borderTop: `3px solid ${pctColor}` }}>
          <div style={{ fontSize: "0.65rem", color: "#aaa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Achieved</div>
          <div style={{ fontSize: "2.5rem", fontWeight: 900, color: pctColor, lineHeight: 1, fontFamily: "var(--font-display)" }}>{(perf?.achieved ?? 0).toLocaleString("en-IN")}</div>
          <div style={{ fontSize: "0.8rem", color: "#888", marginTop: 6 }}>{pct}% completion</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee", borderTop: `3px solid ${remaining === 0 ? "#22C55E" : "#EF4444"}` }}>
          <div style={{ fontSize: "0.65rem", color: "#aaa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Remaining</div>
          <div style={{ fontSize: "2.5rem", fontWeight: 900, color: remaining === 0 ? "#22C55E" : "#EF4444", lineHeight: 1, fontFamily: "var(--font-display)" }}>{remaining.toLocaleString("en-IN")}</div>
          <div style={{ fontSize: "0.8rem", color: "#888", marginTop: 6 }}>{remaining === 0 ? "🎉 Target met!" : "to meet target"}</div>
        </div>
      </div>

      {/* ── Progress Bar ──────────────────────────────────── */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "1rem" }}>
            {MONTH_NAMES[perf?.month ?? 0]} {perf?.year} Progress
          </h3>
          <span style={{
            fontSize: "0.72rem", fontWeight: 700, padding: "4px 12px", borderRadius: 999,
            background: pct >= 100 ? "#DCFCE7" : pct >= 80 ? "#FFF7ED" : "#FEF2F2",
            color: pct >= 100 ? "#15803D" : pct >= 80 ? "#C2410C" : "#DC2626",
          }}>
            {pct >= 100 ? "✅ On Track" : pct >= 80 ? "⚠ Near Target" : "❌ Behind"}
          </span>
        </div>
        <div style={{ height: 14, background: "#f0f0f0", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: pctColor, borderRadius: 999, transition: "width 1s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: "0.78rem", color: "#aaa" }}>
          <span>0</span>
          <span style={{ fontWeight: 700, color: pctColor }}>{perf?.achieved ?? 0} / {perf?.target ?? 0} ({pct}%)</span>
          <span>{perf?.target ?? 0}</span>
        </div>
      </div>

      {/* ── Next Month Target Box ─────────────────────────── */}
      <div style={{ background: "#1a1f2e", borderRadius: 12, padding: 28, color: "#fff", boxShadow: "0 4px 16px rgba(26,31,46,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <Target size={18} color="#F97316" />
          <h3 style={{ fontWeight: 700, color: "#fff", fontSize: "1rem" }}>Next Month Target Calculation</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { label: "This month's target",         value: perf?.target ?? 0,                                                        color: "rgba(255,255,255,0.6)" },
            { label: "× 2 (doubling rule)",          value: "× 2",                                                                    color: "#F97316",  op: true },
            { label: "Base next month target",       value: next_month_target?.base_target ?? 0,                                      color: "#fff",     highlight: true },
            { label: "− Carry-forward overachievement", value: (next_month_target?.previous_overachievement ?? 0) > 0 ? `− ${next_month_target.previous_overachievement}` : "− 0", color: "#F59E0B", op: true },
            { label: "Adjusted next month target",   value: next_month_target?.adjusted_target ?? 0,                                  color: "#F97316",  highlight: true, big: true },
          ].map(({ label, value, color, highlight, big, op }: any) => (
            <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>{label}</span>
              <span style={{ fontFamily: big ? "var(--font-display)" : undefined, fontSize: big ? "1.6rem" : "1rem", fontWeight: big ? 900 : 700, color }}>
                {typeof value === "number" ? value.toLocaleString("en-IN") : value}
              </span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(249,115,22,0.1)", borderRadius: 8, border: "1px solid rgba(249,115,22,0.2)" }}>
          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
            <strong style={{ color: "#F97316" }}>Rule:</strong> Next month target = (Current target × 2) − Overachievement carry-forward. Overachievement is rewarded by reducing the next target.
          </p>
        </div>
      </div>

      {/* ── Bar Chart ─────────────────────────────────────── */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "1rem" }}>6-Month History</h3>
            <p style={{ fontSize: "0.78rem", color: "#aaa", marginTop: 2 }}>Target vs Achieved per month</p>
          </div>
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
          <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", flexDirection: "column", gap: 8 }}>
            <TrendingUp size={40} style={{ color: "#e0e0e0" }} />
            <span style={{ fontSize: "0.875rem" }}>No performance history yet</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} barGap={4} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#aaa" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#aaa" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #eee", fontSize: "0.82rem", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              />
              <Bar dataKey="Target" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Achieved" fill="#F97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Month-by-Month Table ──────────────────────────── */}
      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #f0f0f0", fontWeight: 700, color: "#1a1a2e", fontSize: "0.95rem" }}>
          Month-by-Month Breakdown
        </div>
        {(performance_history || []).length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#bbb", fontSize: "0.875rem" }}>No history records yet</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#fafafa" }}>
                  {["Month", "Target", "Achieved", "Achievement %", "Over/Under", "Carry-forward", "Status"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #f0f0f0", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...(performance_history || [])].reverse().map((p: any) => {
                  const apct = Math.round(p.achievement_percentage);
                  const isOver = p.difference >= 0;
                  const col = apct >= 100 ? "#15803D" : apct >= 80 ? "#92400E" : "#DC2626";
                  return (
                    <tr key={p.id ?? `${p.month}-${p.year}`} style={{ borderBottom: "1px solid #f5f5f5" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "#1a1a2e", fontSize: "0.875rem" }}>{MONTH_NAMES[p.month]} {p.year}</td>
                      <td style={{ padding: "12px 16px", color: "#555", fontSize: "0.875rem" }}>{p.target.toLocaleString("en-IN")}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "#1a1a2e", fontSize: "0.875rem" }}>{p.achieved.toLocaleString("en-IN")}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, height: 5, background: "#f0f0f0", borderRadius: 99, minWidth: 64, overflow: "hidden" }}>
                            <div style={{ width: `${Math.min(apct, 100)}%`, height: "100%", background: apct >= 100 ? "#22C55E" : apct >= 80 ? "#F59E0B" : "#EF4444", borderRadius: 99 }} />
                          </div>
                          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: col, minWidth: 36 }}>{apct}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 700, color: isOver ? "#15803D" : "#DC2626", fontSize: "0.875rem" }}>
                          {isOver ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                          {isOver ? "+" : ""}{p.difference}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {p.overachievement > 0
                          ? <span style={{ fontWeight: 700, color: "#15803D", fontSize: "0.875rem" }}>+{p.overachievement}</span>
                          : <span style={{ color: "#ccc" }}>—</span>}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: apct >= 100 ? "#DCFCE7" : apct >= 80 ? "#FFF7ED" : "#FEF2F2", color: col }}>
                          {apct >= 100 ? "✅ Met" : apct >= 80 ? "⚠ Near" : "❌ Missed"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
