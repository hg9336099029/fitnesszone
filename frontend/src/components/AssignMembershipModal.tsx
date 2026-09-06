"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Plus, Calendar } from "lucide-react";
import { membersApi, membershipsApi } from "@/lib/api/client";
import type { MemberSummary } from "@/types";

type MembershipPlan = { id: number; name: string; price_inr: number; duration_days: number };

export function AssignMembershipModal({ member, onClose, onSuccess }: { member: MemberSummary; onClose: () => void; onSuccess: () => void }) {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [form, setForm] = useState({
    plan_id: "",
    start_date: new Date().toISOString().split('T')[0]
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Load plans when modal opens
    membershipsApi.listPlans().then(data => {
      // @ts-ignore
      setPlans('results' in data ? data.results : data);
    }).catch(err => {
      setError("Failed to load membership plans.");
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.plan_id) {
      setError("Please select a plan");
      return;
    }
    
    setError(""); setLoading(true);
    try {
      await membersApi.assignPlan(member.id, {
        plan_id: Number(form.plan_id),
        start_date: form.start_date
      });
      setSuccess(true);
      setTimeout(() => { onSuccess(); onClose(); }, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to assign plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 480, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--gray-200)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#E0E7FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={18} color="var(--indigo)" />
            </div>
            <div>
              <h2 style={{ fontWeight: 800, color: "var(--navy)", fontSize: "1.05rem" }}>Assign Membership</h2>
              <p style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: 1 }}>{member.full_name}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "var(--gray-400)" }}><X size={20} /></button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {success && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#15803D", fontWeight: 600 }}>
              <CheckCircle2 size={16} /> Plan assigned successfully!
            </div>
          )}
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--error-bg)", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#DC2626", fontSize: "0.875rem" }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
            <div>
              <label className="form-label">Membership Plan *</label>
              <select className="form-input" required value={form.plan_id} onChange={e => setForm(f => ({...f, plan_id: e.target.value}))}>
                <option value="" disabled>Select a plan...</option>
                {plans.map(p => (
                  <option key={p.id} value={p.id}>{p.name} — ₹{p.price_inr} ({p.duration_days} days)</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="form-label">Start Date *</label>
              <div style={{ position: "relative" }}>
                <Calendar size={18} color="var(--gray-400)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input className="form-input" type="date" required value={form.start_date} onChange={e => setForm(f => ({...f, start_date: e.target.value}))} style={{ paddingLeft: 40 }} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 16, borderTop: "1px solid var(--gray-200)" }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading || success || plans.length === 0}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 24px", background: loading || success ? "var(--indigo)" : "var(--indigo)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: loading || success ? "not-allowed" : "pointer", opacity: loading || success ? 0.7 : 1 }}>
              {loading ? "Assigning..." : "Assign Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
