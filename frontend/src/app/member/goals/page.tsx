"use client";

import { useEffect, useState } from "react";
import {
  Target,
  Plus,
  TrendingUp,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";
import { memberPortalApi } from "@/lib/api/client";
import type { Goal } from "@/types";

const GOAL_TYPE_LABELS: Record<string, string> = {
  weight_loss: "Weight Loss",
  muscle_gain: "Muscle Gain",
  endurance: "Endurance",
  flexibility: "Flexibility",
  general_fitness: "General Fitness",
  custom: "Custom",
};

const GOAL_COLORS: Record<string, string> = {
  weight_loss: "#F97316",
  muscle_gain: "#1E4FD8",
  endurance: "#22C55E",
  flexibility: "#7C3AED",
  general_fitness: "#F59E0B",
  custom: "#64748B",
};

function AddGoalModal({ onClose, onAdded }: { onClose: () => void; onAdded: (g: Goal) => void }) {
  const [form, setForm] = useState({
    type: "general_fitness",
    title: "",
    current_value: "",
    target_value: "",
    unit: "",
    deadline: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const goal = await memberPortalApi.createGoal({
        ...form,
        current_value: parseFloat(form.current_value),
        target_value: parseFloat(form.target_value),
        deadline: form.deadline || null,
      });
      onAdded(goal);
      onClose();
    } catch (err: any) {
      setError(err.message ?? "Failed to save goal");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="card" style={{ width: "100%", maxWidth: 520, padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontWeight: 800, color: "var(--navy)", fontSize: "1.2rem" }}>Add New Goal</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--gray-400)", borderRadius: 6 }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label className="form-label">Goal Type</label>
            <select className="form-input" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
              {Object.entries(GOAL_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Goal Title</label>
            <input className="form-input" placeholder="e.g. Lose 10 kg by December" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label className="form-label">Current</label>
              <input className="form-input" type="number" step="0.1" placeholder="0" required value={form.current_value} onChange={(e) => setForm((f) => ({ ...f, current_value: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Target</label>
              <input className="form-input" type="number" step="0.1" placeholder="10" required value={form.target_value} onChange={(e) => setForm((f) => ({ ...f, target_value: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Unit</label>
              <input className="form-input" placeholder="kg / km / %" required value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="form-label">Deadline (optional)</label>
            <input className="form-input" type="date" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} />
          </div>
          {error && <p style={{ color: "var(--error)", fontSize: "0.85rem" }}>{error}</p>}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Add Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MemberGoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    memberPortalApi
      .getGoals()
      .then((d) => {
        setGoals(d);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 14 }} />)}
        </div>
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 150, borderRadius: 14 }} />)}
      </div>
    );
  }

  const active = goals.filter((g) => !g.is_achieved);
  const done = goals.filter((g) => g.is_achieved);

  return (
    <>
      {showAdd && <AddGoalModal onClose={() => setShowAdd(false)} onAdded={(g) => setGoals((prev) => [g, ...prev])} />}

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "0.85rem", color: "var(--gray-500)", marginTop: 2 }}>
              {active.length} active • {done.length} completed
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> Add Goal
          </button>
        </div>

        {/* Summary stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { label: "Total Goals", value: goals.length, color: "var(--blue)", bg: "#EFF6FF", icon: Target },
            { label: "In Progress", value: active.length, color: "#F97316", bg: "#FFF7ED", icon: TrendingUp },
            { label: "Completed", value: done.length, color: "#10B981", bg: "#F0FDF4", icon: CheckCircle2 },
          ].map(({ label, value, color, bg, icon: Icon }) => (
            <div key={label} className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={22} color={color} />
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 900, color: "var(--navy)", lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--gray-500)", marginTop: 3 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Goals */}
        {active.length > 0 && (
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1rem", marginBottom: 20 }}>Active Goals</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {active.map((goal) => {
                const color = GOAL_COLORS[goal.type] || "#64748B";
                const pct = Math.min(100, goal.progress_percentage);
                return (
                  <div
                    key={goal.id}
                    style={{
                      padding: "20px 24px",
                      background: "var(--gray-50)",
                      borderRadius: 12,
                      border: "1px solid var(--gray-200)",
                      borderLeft: `4px solid ${color}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span className="badge" style={{ background: `${color}18`, color, borderRadius: 6 }}>
                            {GOAL_TYPE_LABELS[goal.type]}
                          </span>
                          {goal.deadline && (
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.72rem", color: "var(--gray-400)" }}>
                              <Clock size={11} />
                              {new Date(goal.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          )}
                        </div>
                        <h3 style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1rem" }}>{goal.title}</h3>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900, color, lineHeight: 1 }}>
                          {Math.round(pct)}%
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--gray-400)" }}>complete</div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ height: 8, background: "var(--gray-200)", borderRadius: 99, marginBottom: 12, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 0.5s ease" }} />
                    </div>

                    {/* Stats row */}
                    <div style={{ display: "flex", gap: 28 }}>
                      <div>
                        <div style={{ fontSize: "0.68rem", color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Current</div>
                        <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.9rem" }}>{goal.current_value} {goal.unit}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.68rem", color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Target</div>
                        <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.9rem" }}>{goal.target_value} {goal.unit}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.68rem", color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Remaining</div>
                        <div style={{ fontWeight: 700, color, fontSize: "0.9rem" }}>{Math.max(0, goal.target_value - goal.current_value).toFixed(1)} {goal.unit}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Goals */}
        {done.length > 0 && (
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1rem", marginBottom: 20 }}>Completed Goals 🎉</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {done.map((goal) => {
                const color = GOAL_COLORS[goal.type] || "#64748B";
                return (
                  <div
                    key={goal.id}
                    style={{
                      padding: "16px 20px",
                      background: "#F0FDF4",
                      borderRadius: 10,
                      border: "1px solid #BBF7D0",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <CheckCircle2 size={22} color="#10B981" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.9rem" }}>{goal.title}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--gray-500)", marginTop: 2 }}>
                        {goal.target_value} {goal.unit} achieved
                      </div>
                    </div>
                    <span className="badge" style={{ background: `${color}18`, color, fontSize: "0.72rem" }}>
                      {GOAL_TYPE_LABELS[goal.type]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {goals.length === 0 && (
          <div className="card" style={{ padding: "60px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Target size={36} color="var(--blue)" />
            </div>
            <div>
              <h3 style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1.1rem", marginBottom: 8 }}>No goals yet</h3>
              <p style={{ color: "var(--gray-500)", fontSize: "0.875rem" }}>Set your first fitness goal to start tracking your progress and stay motivated.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
              <Plus size={16} /> Set Your First Goal
            </button>
          </div>
        )}
      </div>
    </>
  );
}
