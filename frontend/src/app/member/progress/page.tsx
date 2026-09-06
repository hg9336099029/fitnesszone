"use client";

import { useEffect, useState } from "react";
import {
  TrendingDown,
  Scale,
  Ruler,
  Plus,
  Calendar,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { memberPortalApi } from "@/lib/api/client";

const MOCK_WEIGHT_HISTORY = [
  { date: "Jan", weight: 92.0 },
  { date: "Feb", weight: 90.5 },
  { date: "Mar", weight: 89.0 },
  { date: "Apr", weight: 87.5 },
  { date: "May", weight: 86.2 },
  { date: "Jun", weight: 85.0 },
  { date: "Jul", weight: 84.8 },
  { date: "Aug", weight: 84.5 },
];

function LogMeasurementModal({ onClose, onAdded }: { onClose: () => void; onAdded: (m: any) => void }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    date: today,
    weight_kg: "",
    body_fat_percentage: "",
    chest_cm: "",
    waist_cm: "",
    arms_cm: "",
    legs_cm: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload: any = { date: form.date };
      if (form.weight_kg) payload.weight_kg = parseFloat(form.weight_kg);
      if (form.body_fat_percentage) payload.body_fat_percentage = parseFloat(form.body_fat_percentage);
      if (form.chest_cm) payload.chest_cm = parseFloat(form.chest_cm);
      if (form.waist_cm) payload.waist_cm = parseFloat(form.waist_cm);
      if (form.arms_cm) payload.arms_cm = parseFloat(form.arms_cm);
      if (form.legs_cm) payload.legs_cm = parseFloat(form.legs_cm);
      const result = await memberPortalApi.createMeasurement(payload);
      onAdded(result);
      onClose();
    } catch (err: any) {
      setError(err.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="card" style={{ width: "100%", maxWidth: 520, padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontWeight: 800, color: "var(--navy)", fontSize: "1.2rem" }}>Log Body Measurement</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--gray-400)", borderRadius: 6 }}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label className="form-label">Date</label>
            <input className="form-input" type="date" required value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label className="form-label">Weight (kg)</label>
              <input className="form-input" type="number" step="0.1" placeholder="85.0" value={form.weight_kg} onChange={(e) => setForm((f) => ({ ...f, weight_kg: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Body Fat (%)</label>
              <input className="form-input" type="number" step="0.1" placeholder="18.5" value={form.body_fat_percentage} onChange={(e) => setForm((f) => ({ ...f, body_fat_percentage: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Chest (cm)</label>
              <input className="form-input" type="number" step="0.1" placeholder="95" value={form.chest_cm} onChange={(e) => setForm((f) => ({ ...f, chest_cm: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Waist (cm)</label>
              <input className="form-input" type="number" step="0.1" placeholder="80" value={form.waist_cm} onChange={(e) => setForm((f) => ({ ...f, waist_cm: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Arms (cm)</label>
              <input className="form-input" type="number" step="0.1" placeholder="35" value={form.arms_cm} onChange={(e) => setForm((f) => ({ ...f, arms_cm: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Legs (cm)</label>
              <input className="form-input" type="number" step="0.1" placeholder="55" value={form.legs_cm} onChange={(e) => setForm((f) => ({ ...f, legs_cm: e.target.value }))} />
            </div>
          </div>
          {error && <p style={{ color: "var(--error)", fontSize: "0.85rem" }}>{error}</p>}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Log Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MemberProgressPage() {
  const [latest, setLatest] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    memberPortalApi
      .getDashboard()
      .then((d) => {
        setLatest(d.progress_summary);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
          <div className="skeleton" style={{ height: 280, borderRadius: 14 }} />
          <div className="skeleton" style={{ height: 280, borderRadius: 14 }} />
        </div>
        <div className="skeleton" style={{ height: 150, borderRadius: 14 }} />
      </div>
    );
  }

  const weightDelta = MOCK_WEIGHT_HISTORY[MOCK_WEIGHT_HISTORY.length - 1].weight - MOCK_WEIGHT_HISTORY[0].weight;
  const weightLost = Math.abs(weightDelta);

  return (
    <>
      {showLog && (
        <LogMeasurementModal
          onClose={() => setShowLog(false)}
          onAdded={(m) => setLatest(m)}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}>Track your body transformation over time</p>
          <button className="btn btn-primary" onClick={() => setShowLog(true)}>
            <Plus size={16} /> Log Entry
          </button>
        </div>

        {/* Main chart + summary banner */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          {/* Weight trend */}
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1rem" }}>Weight Over Time</h2>
                <p style={{ fontSize: "0.8rem", color: "var(--gray-500)", marginTop: 2 }}>Last 8 months</p>
              </div>
              <span style={{ background: "#F0FDF4", color: "#10B981", fontWeight: 700, fontSize: "0.78rem", padding: "4px 10px", borderRadius: 20 }}>
                📉 -{weightLost.toFixed(1)} kg
              </span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MOCK_WEIGHT_HISTORY} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--gray-400)" }} axisLine={false} tickLine={false} />
                <YAxis domain={[82, 95]} tick={{ fontSize: 11, fill: "var(--gray-400)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}kg`} />
                <Tooltip
                  formatter={(v) => [`${v} kg`, "Weight"]}
                  contentStyle={{ borderRadius: 10, border: "1px solid var(--gray-200)", fontSize: "0.85rem" }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="var(--orange)"
                  strokeWidth={2.5}
                  dot={{ fill: "var(--orange)", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Weight journey summary */}
          <div
            style={{
              background: "linear-gradient(135deg, var(--navy) 0%, #1a3a6e 100%)",
              borderRadius: 16,
              padding: "28px 24px",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 24,
            }}
          >
            <div>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 8 }}>
                Weight Journey
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "3rem", fontWeight: 900, lineHeight: 1, marginBottom: 4 }}>
                {weightLost.toFixed(1)} kg
              </div>
              <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
                {weightDelta < 0 ? "lost" : "gained"} in 8 months
              </div>
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", fontWeight: 700, marginBottom: 4 }}>Start</div>
                <div style={{ fontWeight: 700, color: "#fff" }}>{MOCK_WEIGHT_HISTORY[0].weight} kg</div>
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", fontWeight: 700, marginBottom: 4 }}>Current</div>
                <div style={{ fontWeight: 700, color: "var(--orange)" }}>{MOCK_WEIGHT_HISTORY[MOCK_WEIGHT_HISTORY.length - 1].weight} kg</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingDown size={18} color="#10B981" />
              <span style={{ fontWeight: 700, color: "#10B981", fontSize: "0.9rem" }}>On Track 🎯</span>
            </div>
          </div>
        </div>

        {/* Latest Measurements */}
        {latest ? (
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1rem" }}>Latest Measurements</h2>
                <p style={{ fontSize: "0.8rem", color: "var(--gray-500)", marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}>
                  <Calendar size={13} />
                  {new Date(latest.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setShowLog(true)}>
                Update
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
              {[
                { label: "Weight", value: `${latest.weight_kg} kg`, icon: Scale, color: "#F97316" },
                { label: "Body Fat", value: `${latest.body_fat_percentage ?? "—"}%`, icon: TrendingDown, color: "#22C55E" },
                { label: "Chest", value: `${latest.chest_cm ?? "—"} cm`, icon: Ruler, color: "var(--blue)" },
                { label: "Waist", value: `${latest.waist_cm ?? "—"} cm`, icon: Ruler, color: "#7C3AED" },
                { label: "Arms", value: `${latest.arms_cm ?? "—"} cm`, icon: Ruler, color: "#EC4899" },
                { label: "Legs", value: `${latest.legs_cm ?? "—"} cm`, icon: Ruler, color: "#F59E0B" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div
                  key={label}
                  style={{
                    textAlign: "center",
                    padding: "18px 12px",
                    background: "var(--gray-50)",
                    borderRadius: 12,
                    border: "1px solid var(--gray-200)",
                    transition: "transform 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                    <Icon size={18} color={color} />
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 800, color: "var(--navy)" }}>{value}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--gray-500)", marginTop: 3 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: "60px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Scale size={36} color="var(--blue)" />
            </div>
            <div>
              <h3 style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1.1rem", marginBottom: 8 }}>No measurements yet</h3>
              <p style={{ color: "var(--gray-500)", fontSize: "0.875rem" }}>Log your first body measurement to start tracking your transformation.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowLog(true)}>
              <Plus size={16} /> Log First Entry
            </button>
          </div>
        )}
      </div>
    </>
  );
}
