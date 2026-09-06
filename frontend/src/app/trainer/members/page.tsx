"use client";

import { useEffect, useState } from "react";
import { Users, Phone, MapPin, Search, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { trainerApi } from "@/lib/api/client";

const LEVEL_COLORS: Record<string, string> = {
  starter: "#22C55E", builder: "#1E4FD8", pro: "#F97316", elite: "#7C3AED",
};
const LEVEL_BG: Record<string, string> = {
  starter: "#DCFCE7", builder: "#DBEAFE", pro: "#FFF7ED", elite: "#EDE9FE",
};

export default function TrainerMembersPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    trainerApi.getDashboard()
      .then(d => { setData(d); setIsLoading(false); })
      .catch(err => { setError(err.message || "Failed to load."); setIsLoading(false); });
  }, []);

  if (isLoading) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="skeleton" style={{ height: 48, borderRadius: 10, width: 320 }} />
      {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 12 }} />)}
    </div>
  );

  if (error) return (
    <div style={{ padding: 60, textAlign: "center" }}>
      <AlertCircle size={48} color="#EF4444" style={{ margin: "0 auto 16px" }} />
      <p style={{ color: "#DC2626", fontWeight: 700 }}>Failed to load members</p>
      <p style={{ color: "#888", fontSize: "0.875rem", marginTop: 4 }}>{error}</p>
      <button onClick={() => window.location.reload()}
        style={{ marginTop: 16, padding: "10px 24px", background: "#1a1f2e", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
        Retry
      </button>
    </div>
  );

  const members: any[] = data?.assigned_members ?? [];
  const checkIns: any[] = data?.recent_check_ins ?? [];
  const notCheckedIn: any[] = data?.not_checked_in ?? [];

  const checkedInIds = new Set(checkIns.map((r: any) => r.member_id));
  const initials = (name: string) => name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  const filtered = members.filter(m =>
    m.full_name.toLowerCase().includes(search.toLowerCase()) ||
    m.mobile?.includes(search) ||
    m.member_id?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = members.filter(m => m.membership_status === "active").length;
  const presentCount = checkIns.length;
  const absentCount = notCheckedIn.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Header ────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1a1a2e" }}>My Members</h1>
          <p style={{ fontSize: "0.875rem", color: "#888", marginTop: 3 }}>{members.length} members assigned to you</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ textAlign: "center", padding: "8px 18px", background: "#fff", borderRadius: 10, border: "1px solid #eee", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#1a1a2e" }}>{members.length}</div>
            <div style={{ fontSize: "0.68rem", color: "#aaa", fontWeight: 600 }}>Total</div>
          </div>
          <div style={{ textAlign: "center", padding: "8px 18px", background: "#fff", borderRadius: 10, border: "1px solid #eee", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#22C55E" }}>{presentCount}</div>
            <div style={{ fontSize: "0.68rem", color: "#aaa", fontWeight: 600 }}>Present</div>
          </div>
          <div style={{ textAlign: "center", padding: "8px 18px", background: "#fff", borderRadius: 10, border: "1px solid #eee", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#EF4444" }}>{absentCount}</div>
            <div style={{ fontSize: "0.68rem", color: "#aaa", fontWeight: 600 }}>Absent</div>
          </div>
        </div>
      </div>

      {/* ── Search ────────────────────────────────────────── */}
      <div style={{ position: "relative", maxWidth: 360 }}>
        <Search size={16} color="#aaa" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, phone, or ID…"
          style={{
            width: "100%", padding: "10px 12px 10px 36px", borderRadius: 10,
            border: "1px solid #eee", background: "#fff", fontSize: "0.875rem",
            outline: "none", boxSizing: "border-box", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        />
      </div>

      {/* ── Members List ──────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", background: "#fff", borderRadius: 12, border: "1px solid #eee" }}>
          <Users size={48} style={{ margin: "0 auto 16px", color: "#e0e0e0" }} />
          <p style={{ color: "#bbb", fontWeight: 600 }}>
            {search ? "No members match your search" : "No members assigned yet"}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((m: any) => {
            const isPresent = checkedInIds.has(m.id);
            const checkIn = checkIns.find(r => r.member_id === m.id);
            const levelColor = LEVEL_COLORS[m.membership_level] ?? "#888";
            const levelBg = LEVEL_BG[m.membership_level] ?? "#f5f5f5";

            return (
              <div key={m.id} style={{
                background: "#fff", borderRadius: 12, padding: "18px 20px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eee",
                borderLeft: `4px solid ${isPresent ? "#22C55E" : m.membership_status === "expired" ? "#EF4444" : "#e0e0e0"}`,
                display: "flex", alignItems: "flex-start", gap: 16,
              }}>
                {/* Avatar */}
                <div style={{
                  width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                  background: levelBg, border: `2px solid ${levelColor}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, color: levelColor, fontSize: "0.95rem",
                }}>
                  {initials(m.full_name)}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 5 }}>
                    <span style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "0.95rem" }}>{m.full_name}</span>
                    <span style={{ fontFamily: "monospace", fontSize: "0.72rem", background: "#f5f5f5", padding: "1px 8px", borderRadius: 4, color: "#888" }}>{m.member_id}</span>
                    {m.membership_level && (
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: levelBg, color: levelColor, textTransform: "capitalize" }}>
                        {m.membership_level}
                      </span>
                    )}
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: m.membership_status === "active" ? "#DCFCE7" : "#FEF2F2", color: m.membership_status === "active" ? "#15803D" : "#DC2626", textTransform: "capitalize" }}>
                      {m.membership_status}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    {m.mobile && (
                      <span style={{ fontSize: "0.8rem", color: "#888", display: "flex", alignItems: "center", gap: 5 }}>
                        <Phone size={11} /> {m.mobile}
                      </span>
                    )}
                    <span style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 5, color: isPresent ? "#15803D" : "#aaa", fontWeight: isPresent ? 600 : 400 }}>
                      {isPresent
                        ? <><CheckCircle2 size={11} color="#22C55E" /> Checked in {checkIn ? new Date(checkIn.check_in).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""}</>
                        : <><Calendar size={11} /> Not checked in today</>}
                    </span>
                  </div>
                </div>

                {/* Status badge */}
                <div style={{ flexShrink: 0, alignSelf: "center" }}>
                  <span style={{
                    fontSize: "0.72rem", fontWeight: 700, padding: "5px 12px", borderRadius: 999,
                    background: isPresent ? "#DCFCE7" : "#FEF2F2",
                    color: isPresent ? "#15803D" : "#DC2626",
                  }}>
                    {isPresent ? "In Gym" : "Absent"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
