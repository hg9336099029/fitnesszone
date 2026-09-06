"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, Trash2, UserCheck, AlertCircle } from "lucide-react";
import { staffApi } from "@/lib/api/client";
import { AddStaffModal } from "@/components/AddStaffModal";

type Staff = {
  id: number;
  full_name: string;
  mobile: string;
  email: string;
  is_active: boolean;
  date_joined: string;
};

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const loadStaff = useCallback(async () => {
    setIsLoading(true); setError("");
    try {
      const data = await staffApi.list();
      // Handle Django DRF pagination response gracefully
      setStaffList('results' in data ? data.results : data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load staff.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadStaff(); }, [loadStaff]);

  const handleDelete = async (staff: Staff) => {
    if (!window.confirm(`Delete staff member ${staff.full_name}?`)) return;
    try {
      await staffApi.delete(staff.id);
      loadStaff();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete.");
    }
  };

  const filteredStaff = staffList.filter(s => 
    s.full_name.toLowerCase().includes(search.toLowerCase()) || 
    s.mobile.includes(search)
  );

  const initials = (name: string) => name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--navy)" }}>General Staff</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: 2 }}>
            Manage receptionists, managers, and other personnel
          </p>
        </div>
        <button className="btn btn-primary" style={{ background: "#D97706", borderColor: "#D97706" }} onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add Staff
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 400 }}>
        <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
        <input
          className="form-input"
          style={{ paddingLeft: 42 }}
          placeholder="Search by name or mobile…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* API Error */}
      {error && (
        <div style={{ background: "var(--error-bg)", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <AlertCircle size={16} color="#DC2626" />
          <span style={{ fontSize: "0.875rem", color: "#DC2626" }}>{error}</span>
          <button onClick={loadStaff} style={{ marginLeft: "auto", fontSize: "0.8rem", color: "#DC2626", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        {isLoading ? (
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 64, borderRadius: 10 }} />)}
          </div>
        ) : filteredStaff.length === 0 && !error ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <UserCheck size={44} color="var(--gray-300)" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontWeight: 700, color: "var(--gray-500)", marginBottom: 8 }}>No staff found</h3>
            <p style={{ color: "var(--gray-400)", fontSize: "0.875rem", marginBottom: 20 }}>
              {search ? `No results for "${search}"` : "Add your first staff member to get started."}
            </p>
            {!search && <button className="btn btn-primary" style={{ background: "#D97706", borderColor: "#D97706" }} onClick={() => setShowAddModal(true)}><Plus size={15} /> Add Staff</button>}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#D97706", fontSize: "0.8rem", flexShrink: 0 }}>
                          {initials(s.full_name)}
                        </div>
                        <div style={{ fontWeight: 600, color: "var(--navy)" }}>{s.full_name}</div>
                      </div>
                    </td>
                    <td style={{ color: "var(--gray-600)" }}>{s.mobile}</td>
                    <td style={{ color: "var(--gray-500)", fontSize: "0.85rem" }}>{s.email || "—"}</td>
                    <td style={{ color: "var(--gray-500)", fontSize: "0.85rem" }}>
                      {new Date(s.date_joined).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge ${s.is_active ? "badge-green" : "badge-red"}`}>
                        {s.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button title="Delete" onClick={() => handleDelete(s)}
                        style={{ padding: "6px 8px", borderRadius: 7, background: "var(--error-bg)", border: "none", color: "#DC2626", cursor: "pointer" }}>
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && <AddStaffModal onClose={() => setShowAddModal(false)} onSuccess={loadStaff} />}
    </div>
  );
}
