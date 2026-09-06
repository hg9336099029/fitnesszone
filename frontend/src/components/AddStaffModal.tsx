"use client";

import { useState } from "react";
import { X, CheckCircle2, AlertCircle, Plus, UserCheck } from "lucide-react";
import { staffApi } from "@/lib/api/client";

export function AddStaffModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ full_name: "", mobile: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await staffApi.create(form);
      setSuccess(true);
      setTimeout(() => { onSuccess(); onClose(); }, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add staff.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 500, boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--gray-200)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UserCheck size={18} color="#D97706" />
            </div>
            <div>
              <h2 style={{ fontWeight: 800, color: "var(--navy)", fontSize: "1.05rem" }}>Add Staff Member</h2>
              <p style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: 1 }}>Create a general staff account</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "var(--gray-400)" }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {success && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#15803D", fontWeight: 600 }}>
              <CheckCircle2 size={16} /> Staff added successfully!
            </div>
          )}
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--error-bg)", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#DC2626", fontSize: "0.875rem" }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
            <div>
              <label className="form-label">Full Name *</label>
              <input className="form-input" required value={form.full_name} onChange={e => setForm(f => ({...f, full_name: e.target.value}))} placeholder="e.g. Ramesh Singh" />
            </div>
            <div>
              <label className="form-label">Mobile Number *</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--gray-500)", fontSize: "0.875rem", fontWeight: 600 }}>+91</span>
                <input className="form-input" style={{ paddingLeft: 44 }} required value={form.mobile} onChange={e => setForm(f => ({...f, mobile: e.target.value.replace(/\D/g,"").substring(0,10)}))} placeholder="98765 43210" type="tel" />
              </div>
            </div>
            <div>
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="staff@fitnesszone.in" />
            </div>
            <div>
              <label className="form-label">Initial Password *</label>
              <input className="form-input" type="password" required minLength={8} value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} placeholder="Min 8 characters" />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid var(--gray-200)" }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading || success}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 24px", background: loading || success ? "#D9770680" : "#D97706", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: loading || success ? "not-allowed" : "pointer" }}>
              {loading ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Adding…</> : <><Plus size={16} /> Add Staff</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
