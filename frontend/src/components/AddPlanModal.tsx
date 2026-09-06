"use client";

import { useState } from "react";
import { X, CheckCircle2, AlertCircle, Plus, ClipboardList } from "lucide-react";
import { membershipsApi } from "@/lib/api/client";

export function AddPlanModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    name: "", level: "starter", price_inr: 0, duration_days: 30, features: "",
    personal_training: false, class_access: false, guest_passes: 0, is_popular: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await membershipsApi.createPlan({
        ...form,
        price_inr: Number(form.price_inr),
        duration_days: Number(form.duration_days),
        guest_passes: Number(form.guest_passes),
        features: form.features.split(",").map(f => f.trim()).filter(Boolean),
      });
      setSuccess(true);
      setTimeout(() => { onSuccess(); onClose(); }, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add plan.");
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
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#E0E7FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ClipboardList size={18} color="var(--indigo)" />
            </div>
            <div>
              <h2 style={{ fontWeight: 800, color: "var(--navy)", fontSize: "1.05rem" }}>Add Membership Plan</h2>
              <p style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: 1 }}>Create a new pricing tier</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "var(--gray-400)" }}><X size={20} /></button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {success && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#15803D", fontWeight: 600 }}>
              <CheckCircle2 size={16} /> Plan added successfully!
            </div>
          )}
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--error-bg)", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#DC2626", fontSize: "0.875rem" }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {/* Name */}
            <div style={{ gridColumn: "1/-1" }}>
              <label className="form-label">Plan Name *</label>
              <input className="form-input" required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. Standard Monthly" />
            </div>
            {/* Level */}
            <div>
              <label className="form-label">Tier Level *</label>
              <select className="form-input" value={form.level} onChange={e => setForm(f => ({...f, level: e.target.value}))}>
                <option value="starter">Starter</option>
                <option value="builder">Builder</option>
                <option value="pro">Pro</option>
                <option value="elite">Elite</option>
              </select>
            </div>
            {/* Price */}
            <div>
              <label className="form-label">Price (₹) *</label>
              <input className="form-input" type="number" required min={0} value={form.price_inr} onChange={e => setForm(f => ({...f, price_inr: Number(e.target.value)}))} />
            </div>
            {/* Duration */}
            <div>
              <label className="form-label">Duration (Days) *</label>
              <input className="form-input" type="number" required min={1} value={form.duration_days} onChange={e => setForm(f => ({...f, duration_days: Number(e.target.value)}))} />
            </div>
            {/* Guest Passes */}
            <div>
              <label className="form-label">Guest Passes</label>
              <input className="form-input" type="number" min={0} value={form.guest_passes} onChange={e => setForm(f => ({...f, guest_passes: Number(e.target.value)}))} />
            </div>
            {/* Features */}
            <div style={{ gridColumn: "1/-1" }}>
              <label className="form-label">Features</label>
              <textarea className="form-input" style={{ height: 60, resize: "vertical" }} value={form.features} onChange={e => setForm(f => ({...f, features: e.target.value}))} placeholder="e.g. 24/7 Access, Free Towels (comma separated)" />
            </div>
            
            {/* Checkboxes */}
            <div style={{ gridColumn: "1/-1", display: "flex", gap: 20, marginTop: 8 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.875rem", color: "var(--navy)", fontWeight: 600, cursor: "pointer" }}>
                <input type="checkbox" checked={form.personal_training} onChange={e => setForm(f => ({...f, personal_training: e.target.checked}))} style={{ width: 18, height: 18, cursor: "pointer" }} />
                Personal Training
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.875rem", color: "var(--navy)", fontWeight: 600, cursor: "pointer" }}>
                <input type="checkbox" checked={form.class_access} onChange={e => setForm(f => ({...f, class_access: e.target.checked}))} style={{ width: 18, height: 18, cursor: "pointer" }} />
                Class Access
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.875rem", color: "var(--navy)", fontWeight: 600, cursor: "pointer" }}>
                <input type="checkbox" checked={form.is_popular} onChange={e => setForm(f => ({...f, is_popular: e.target.checked}))} style={{ width: 18, height: 18, cursor: "pointer" }} />
                Mark as Popular
              </label>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid var(--gray-200)" }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading || success}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 24px", background: loading || success ? "var(--indigo)" : "var(--indigo)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: loading || success ? "not-allowed" : "pointer", opacity: loading || success ? 0.7 : 1 }}>
              {loading ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Adding…</> : <><Plus size={16} /> Add Plan</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
