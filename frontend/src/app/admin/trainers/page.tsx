"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus, Search, Star, Users, TrendingUp, AlertCircle,
  X, Eye, Edit2, Trash2, ChevronRight, Dumbbell, CheckCircle2,
} from "lucide-react";
import { trainersApi } from "@/lib/api/client";
import type { Trainer, TrainerMonthlyPerformance } from "@/types";

const MONTH_NAMES = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ── Add Trainer Modal ──────────────────────────────────────────
function AddTrainerModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    full_name: "", mobile: "", email: "", password: "",
    specialization: "", experience_years: 0,
    certifications: "", availability: "Mon–Sat, 6AM–8PM", bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await trainersApi.create({
        ...form,
        specialization: form.specialization.split(",").map(s => s.trim()).filter(Boolean),
        certifications: form.certifications.split(",").map(s => s.trim()).filter(Boolean),
        experience_years: Number(form.experience_years),
      });
      setSuccess(true);
      setTimeout(() => { onSuccess(); onClose(); }, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add trainer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--gray-200)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#15803D10", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Dumbbell size={18} color="#15803D" />
            </div>
            <div>
              <h2 style={{ fontWeight: 800, color: "var(--navy)", fontSize: "1.05rem" }}>Add New Trainer</h2>
              <p style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: 1 }}>Create trainer account and profile</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "var(--gray-400)" }}><X size={20} /></button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {success && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#15803D", fontWeight: 600 }}>
              <CheckCircle2 size={16} /> Trainer added successfully!
            </div>
          )}
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--error-bg)", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#DC2626", fontSize: "0.875rem" }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {/* Full Name */}
            <div style={{ gridColumn: "1/-1" }}>
              <label className="form-label">Full Name *</label>
              <input className="form-input" required value={form.full_name} onChange={e => setForm(f => ({...f, full_name: e.target.value}))} placeholder="e.g. Rajesh Kapoor" />
            </div>
            {/* Mobile */}
            <div>
              <label className="form-label">Mobile Number *</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--gray-500)", fontSize: "0.875rem", fontWeight: 600 }}>+91</span>
                <input className="form-input" style={{ paddingLeft: 44 }} required value={form.mobile} onChange={e => setForm(f => ({...f, mobile: e.target.value.replace(/\D/g,"").substring(0,10)}))} placeholder="98765 43210" type="tel" />
              </div>
            </div>
            {/* Email */}
            <div>
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="trainer@fitnesszone.in" />
            </div>
            {/* Password */}
            <div>
              <label className="form-label">Initial Password *</label>
              <input className="form-input" type="password" required minLength={8} value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} placeholder="Min 8 characters" />
            </div>
            {/* Experience */}
            <div>
              <label className="form-label">Experience (Years)</label>
              <input className="form-input" type="number" min={0} max={50} value={form.experience_years} onChange={e => setForm(f => ({...f, experience_years: Number(e.target.value)}))} />
            </div>
            {/* Specialization */}
            <div style={{ gridColumn: "1/-1" }}>
              <label className="form-label">Specializations</label>
              <input className="form-input" value={form.specialization} onChange={e => setForm(f => ({...f, specialization: e.target.value}))} placeholder="e.g. Strength Training, Yoga, Cardio  (comma separated)" />
            </div>
            {/* Certifications */}
            <div style={{ gridColumn: "1/-1" }}>
              <label className="form-label">Certifications</label>
              <input className="form-input" value={form.certifications} onChange={e => setForm(f => ({...f, certifications: e.target.value}))} placeholder="e.g. ACE Certified, CrossFit Level 2  (comma separated)" />
            </div>
            {/* Availability */}
            <div style={{ gridColumn: "1/-1" }}>
              <label className="form-label">Availability</label>
              <input className="form-input" value={form.availability} onChange={e => setForm(f => ({...f, availability: e.target.value}))} placeholder="e.g. Mon–Sat, 6AM–8PM" />
            </div>
            {/* Bio */}
            <div style={{ gridColumn: "1/-1" }}>
              <label className="form-label">Bio</label>
              <textarea className="form-input" style={{ height: 80, resize: "vertical" }} value={form.bio} onChange={e => setForm(f => ({...f, bio: e.target.value}))} placeholder="Short trainer bio..." />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid var(--gray-200)" }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading || success}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 24px", background: loading || success ? "#15803D80" : "#15803D", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: loading || success ? "not-allowed" : "pointer" }}>
              {loading ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Adding…</> : <><Plus size={16} /> Add Trainer</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Performance Modal ──────────────────────────────────────────
function PerformanceModal({ trainer, onClose }: { trainer: Trainer; onClose: () => void }) {
  const [perf, setPerf] = useState<TrainerMonthlyPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [overrideMode, setOverrideMode] = useState(false);
  const [newTarget, setNewTarget] = useState("");
  const [reason, setReason] = useState("");
  const [overriding, setOverriding] = useState(false);
  const [overrideMsg, setOverrideMsg] = useState("");

  useEffect(() => {
    trainersApi.performance(trainer.id)
      .then(setPerf)
      .catch(() => setPerf([]))
      .finally(() => setLoading(false));
  }, [trainer.id]);

  const handleOverride = async () => {
    if (!newTarget || !reason) return;
    setOverriding(true);
    try {
      await trainersApi.overrideTarget(trainer.id, Number(newTarget), reason);
      setOverrideMsg("Target overridden successfully!");
      setOverrideMode(false);
      const updated = await trainersApi.performance(trainer.id);
      setPerf(updated);
    } catch (e: unknown) {
      setOverrideMsg(e instanceof Error ? e.message : "Failed to override.");
    } finally {
      setOverriding(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 700, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--gray-200)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontWeight: 800, color: "var(--navy)", fontSize: "1.05rem" }}>Performance — {trainer.user.full_name}</h2>
            <p style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: 2 }}>Monthly target vs achieved history</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setOverrideMode(!overrideMode)}
              className="btn btn-outline btn-sm" style={{ borderColor: "#F59E0B", color: "#92400E", fontSize: "0.78rem" }}>
              ✏️ Override Target
            </button>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "var(--gray-400)" }}><X size={20} /></button>
          </div>
        </div>

        {overrideMode && (
          <div style={{ padding: "16px 24px", background: "#FFFBEB", borderBottom: "1px solid #FDE68A" }}>
            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#92400E", marginBottom: 12 }}>Override Current Month Target</p>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
              <div>
                <label className="form-label" style={{ fontSize: "0.72rem" }}>New Target</label>
                <input className="form-input" type="number" value={newTarget} onChange={e => setNewTarget(e.target.value)} placeholder="e.g. 250" style={{ width: 120 }} />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label className="form-label" style={{ fontSize: "0.72rem" }}>Reason *</label>
                <input className="form-input" value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason for override..." />
              </div>
              <button onClick={handleOverride} disabled={overriding || !newTarget || !reason}
                style={{ padding: "9px 20px", background: "#F59E0B", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                {overriding ? "Saving…" : "Save Override"}
              </button>
            </div>
            {overrideMsg && <p style={{ fontSize: "0.8rem", marginTop: 8, color: "#15803D", fontWeight: 600 }}>{overrideMsg}</p>}
          </div>
        )}

        <div style={{ padding: 24 }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 48, borderRadius: 8 }} />)}
            </div>
          ) : perf.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--gray-400)" }}>
              <TrendingUp size={36} style={{ margin: "0 auto 12px" }} />
              <p>No performance records yet for this trainer.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Month</th><th>Target</th><th>Achieved</th><th>%</th><th>+/−</th><th>Carry-fwd</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {perf.map(p => {
                    const pct = Math.round(p.achievement_percentage);
                    return (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 600 }}>{MONTH_NAMES[p.month]} {p.year}{p.is_overridden && <span style={{ marginLeft: 6, fontSize: "0.68rem", color: "#F59E0B", fontWeight: 700 }}>OVERRIDDEN</span>}</td>
                        <td>{p.target}</td>
                        <td style={{ fontWeight: 700 }}>{p.achieved}</td>
                        <td>
                          <span style={{ fontWeight: 700, color: pct >= 100 ? "#15803D" : pct >= 80 ? "#92400E" : "#DC2626" }}>{pct}%</span>
                        </td>
                        <td><span style={{ fontWeight: 700, color: p.difference >= 0 ? "#15803D" : "#DC2626" }}>{p.difference >= 0 ? "+" : ""}{p.difference}</span></td>
                        <td>{p.overachievement > 0 ? <span style={{ color: "#15803D", fontWeight: 700 }}>+{p.overachievement}</span> : "—"}</td>
                        <td><span className={`badge ${pct >= 100 ? "badge-green" : pct >= 80 ? "badge-orange" : "badge-red"}`}>{pct >= 100 ? "✅ Met" : pct >= 80 ? "⚠ Near" : "❌ Missed"}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function AdminTrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [apiError, setApiError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  const loadTrainers = useCallback(async () => {
    setIsLoading(true); setApiError("");
    try {
      const data = await trainersApi.list(search);
      setTrainers(data.results);
      setTotal(data.count);
    } catch (e: unknown) {
      setApiError(e instanceof Error ? e.message : "Failed to load trainers.");
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => { loadTrainers(); }, [loadTrainers]);

  const handleDelete = async (trainer: Trainer) => {
    if (!window.confirm(`Delete trainer ${trainer.user.full_name}? This cannot be undone.`)) return;
    try {
      await trainersApi.delete(trainer.id);
      loadTrainers();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete.");
    }
  };

  const initials = (name: string) => name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--navy)" }}>Trainers</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: 2 }}>
            {total} trainer{total !== 1 ? "s" : ""} registered
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add Trainer
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 400 }}>
        <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
        <input
          className="form-input"
          style={{ paddingLeft: 42 }}
          placeholder="Search by name, mobile, specialization…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* API Error */}
      {apiError && (
        <div style={{ background: "var(--error-bg)", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <AlertCircle size={16} color="#DC2626" />
          <span style={{ fontSize: "0.875rem", color: "#DC2626" }}>{apiError}</span>
          <button onClick={loadTrainers} style={{ marginLeft: "auto", fontSize: "0.8rem", color: "#DC2626", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        {isLoading ? (
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 10 }} />)}
          </div>
        ) : trainers.length === 0 && !apiError ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <Dumbbell size={44} color="var(--gray-300)" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontWeight: 700, color: "var(--gray-500)", marginBottom: 8 }}>No trainers found</h3>
            <p style={{ color: "var(--gray-400)", fontSize: "0.875rem", marginBottom: 20 }}>
              {search ? `No results for "${search}"` : "Add your first trainer to get started."}
            </p>
            {!search && <button className="btn btn-primary" onClick={() => setShowAddModal(true)}><Plus size={15} /> Add Trainer</button>}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Trainer</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Members</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trainers.map(t => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#22C55E20", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#15803D", fontSize: "0.85rem", flexShrink: 0 }}>
                          {initials(t.user.full_name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.9rem" }}>{t.user.full_name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--gray-400)" }}>{t.user.mobile}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {(t.specialization ?? []).slice(0, 2).map(s => (
                          <span key={s} style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: 999, background: "#22C55E15", color: "#15803D", fontWeight: 600 }}>{s}</span>
                        ))}
                        {(t.specialization ?? []).length > 2 && <span style={{ fontSize: "0.7rem", color: "var(--gray-400)" }}>+{t.specialization.length - 2}</span>}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{t.experience_years}y</td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Users size={13} color="var(--gray-400)" /> {t.total_members}
                      </span>
                    </td>
                    <td>
                      {t.rating ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 700, color: "#92400E" }}>
                          <Star size={13} color="#F59E0B" fill="#F59E0B" /> {t.rating}
                        </span>
                      ) : "—"}
                    </td>
                    <td>
                      <span className={`badge ${t.is_active ? "badge-green" : "badge-red"}`}>
                        {t.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button title="View Performance" onClick={() => setSelectedTrainer(t)}
                          style={{ padding: "5px 10px", borderRadius: 7, background: "#EFF6FF", border: "none", color: "var(--blue)", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: "0.78rem", fontWeight: 600 }}>
                          <TrendingUp size={13} /> Performance
                        </button>
                        <button title="Delete" onClick={() => handleDelete(t)}
                          style={{ padding: "6px 8px", borderRadius: 7, background: "var(--error-bg)", border: "none", color: "#DC2626", cursor: "pointer" }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && <AddTrainerModal onClose={() => setShowAddModal(false)} onSuccess={loadTrainers} />}
      {selectedTrainer && <PerformanceModal trainer={selectedTrainer} onClose={() => setSelectedTrainer(null)} />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
