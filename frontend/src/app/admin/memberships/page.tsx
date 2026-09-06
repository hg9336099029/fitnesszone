"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Check, Star, Trash2, Edit2, AlertCircle } from "lucide-react";
import { membershipsApi } from "@/lib/api/client";
import { AddPlanModal } from "@/components/AddPlanModal";

type MembershipPlan = {
  id: number;
  name: string;
  level: string;
  price_inr: number;
  duration_days: number;
  features: string[];
  personal_training: boolean;
  class_access: boolean;
  guest_passes: number;
  is_active: boolean;
  is_popular: boolean;
};

export default function MembershipsPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const loadPlans = useCallback(async () => {
    setIsLoading(true); setError("");
    try {
      const data = await membershipsApi.listPlans();
      // Handle Django DRF pagination response gracefully
      setPlans('results' in data ? data.results : data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load plans.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadPlans(); }, [loadPlans]);

  const handleDelete = async (plan: MembershipPlan) => {
    if (!window.confirm(`Delete plan ${plan.name}?`)) return;
    try {
      await membershipsApi.deletePlan(plan.id);
      loadPlans();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--navy)" }}>Membership Plans</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: 2 }}>
            Manage pricing tiers and packages
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add Plan
        </button>
      </div>

      {error && (
        <div style={{ background: "var(--error-bg)", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <AlertCircle size={16} color="#DC2626" />
          <span style={{ fontSize: "0.875rem", color: "#DC2626" }}>{error}</span>
          <button onClick={loadPlans} style={{ marginLeft: "auto", fontSize: "0.8rem", color: "#DC2626", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Retry</button>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 400, borderRadius: 16 }} />)}
        </div>
      ) : plans.length === 0 && !error ? (
        <div style={{ padding: 60, textAlign: "center", background: "#fff", borderRadius: 16, border: "1px dashed var(--gray-300)" }}>
          <h3 style={{ fontWeight: 700, color: "var(--gray-500)", marginBottom: 8 }}>No plans found</h3>
          <p style={{ color: "var(--gray-400)", fontSize: "0.875rem", marginBottom: 20 }}>
            Create your first membership plan to get started.
          </p>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}><Plus size={15} /> Add Plan</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {plans.map(plan => (
            <div key={plan.id} style={{
              background: "#fff", borderRadius: 16, border: plan.is_popular ? "2px solid var(--indigo)" : "1px solid var(--gray-200)",
              padding: 24, position: "relative", display: "flex", flexDirection: "column",
              boxShadow: plan.is_popular ? "0 12px 32px rgba(79, 70, 229, 0.15)" : "var(--shadow-sm)"
            }}>
              {plan.is_popular && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--indigo)", color: "#fff", padding: "4px 12px", borderRadius: 999, fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                  <Star size={12} fill="#fff" /> POPULAR
                </div>
              )}
              
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--navy)", marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
                  <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--indigo)" }}>₹{plan.price_inr}</span>
                  <span style={{ fontSize: "0.875rem", color: "var(--gray-500)", fontWeight: 600 }}>/ {plan.duration_days} days</span>
                </div>
                <div style={{ marginTop: 8 }}>
                  <span className={`badge ${plan.is_active ? "badge-green" : "badge-red"}`}>{plan.is_active ? "Active" : "Inactive"}</span>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                  {plan.personal_training && (
                    <li style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.9rem", color: "var(--gray-700)" }}>
                      <Check size={16} color="#15803D" style={{ marginTop: 2 }} /> <strong>Personal Training Included</strong>
                    </li>
                  )}
                  {plan.class_access && (
                    <li style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.9rem", color: "var(--gray-700)" }}>
                      <Check size={16} color="#15803D" style={{ marginTop: 2 }} /> <strong>All Classes Access</strong>
                    </li>
                  )}
                  {plan.guest_passes > 0 && (
                    <li style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.9rem", color: "var(--gray-700)" }}>
                      <Check size={16} color="#15803D" style={{ marginTop: 2 }} /> <strong>{plan.guest_passes} Guest Passes</strong>
                    </li>
                  )}
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.9rem", color: "var(--gray-700)" }}>
                      <Check size={16} color="var(--indigo)" style={{ marginTop: 2 }} /> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--gray-100)", display: "flex", gap: 8 }}>
                <button className="btn btn-outline" style={{ flex: 1, display: "flex", justifyContent: "center", gap: 6, fontSize: "0.85rem", padding: "8px" }}>
                  <Edit2 size={14} /> Edit
                </button>
                <button className="btn btn-outline" onClick={() => handleDelete(plan)} style={{ borderColor: "#FECACA", color: "#DC2626", padding: "8px 12px" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && <AddPlanModal onClose={() => setShowAddModal(false)} onSuccess={loadPlans} />}
    </div>
  );
}
// Force recompile
