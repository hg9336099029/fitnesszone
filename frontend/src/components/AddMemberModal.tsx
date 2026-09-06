"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { membersApi } from "@/lib/api/client";

interface AddMemberModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddMemberModal({ onClose, onSuccess }: AddMemberModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    mobile: "",
    gender: "",
    date_of_birth: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Clean up empty strings to undefined/null for optional date fields if necessary
      const payload = { ...formData };
      if (!payload.date_of_birth) delete (payload as any).date_of_birth;
      
      await membersApi.create(payload);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to add member.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
      padding: 20
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 12,
        width: "100%",
        maxWidth: 500,
        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
        overflow: "hidden"
      }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--gray-200)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--navy)" }}>Add New Member</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-500)" }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {error && (
            <div style={{ padding: "12px 16px", background: "var(--error-bg)", color: "#DC2626", borderRadius: 8, fontSize: "0.875rem", border: "1px solid #FECACA" }}>
              {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: 600 }}>Full Name *</label>
              <input name="full_name" required value={formData.full_name} onChange={handleChange} className="form-input" placeholder="e.g. Rahul Sharma" />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: 600 }}>Mobile Number *</label>
              <input name="mobile" required value={formData.mobile} onChange={handleChange} className="form-input" placeholder="e.g. 9876543210" />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: 600 }}>Email Address</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="e.g. rahul@example.com" />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: 600 }}>Date of Birth</label>
              <input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: 600 }}>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="form-input">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: 600 }}>City *</label>
              <input name="city" required value={formData.city} onChange={handleChange} className="form-input" placeholder="e.g. Mumbai" />
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: 600 }}>State *</label>
              <input name="state" required value={formData.state} onChange={handleChange} className="form-input" placeholder="e.g. Maharashtra" />
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: 600 }}>Pincode</label>
              <input name="pincode" value={formData.pincode} onChange={handleChange} className="form-input" placeholder="e.g. 400001" />
            </div>
          </div>

          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Adding..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
