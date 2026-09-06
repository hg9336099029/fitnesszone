"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Filter,
  Download,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
} from "lucide-react";
import { membersApi } from "@/lib/api/client";
import { AddMemberModal } from "@/components/AddMemberModal";
import { AssignMembershipModal } from "@/components/AssignMembershipModal";
import type { MemberSummary, MembershipLevel, MembershipStatus } from "@/types";

const STATUS_BADGES: Record<MembershipStatus, { label: string; cls: string }> = {
  active:    { label: "Active",    cls: "badge-green" },
  expired:   { label: "Expired",   cls: "badge-red" },
  pending:   { label: "Pending",   cls: "badge-orange" },
  cancelled: { label: "Cancelled", cls: "badge-gray" },
};

const LEVEL_BADGES: Record<MembershipLevel, string> = {
  starter: "badge-starter",
  builder: "badge-builder",
  pro:     "badge-pro",
  elite:   "badge-elite",
};

export default function AdminMembersPage() {
  const [members, setMembers] = useState<MemberSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNext, setHasNext] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [memberToAssign, setMemberToAssign] = useState<MemberSummary | null>(null);

  const load = async (q: string, l: string, s: string, p: number) => {
    setIsLoading(true);
    try {
      const res = await membersApi.list(q, l, s, p);
      setMembers(res.results);
      setTotal(res.count);
      setHasNext(!!res.next);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const t = setTimeout(() => load(search, level, status, 1), 350);
    setPage(1);
    return () => clearTimeout(t);
  }, [search, level, status]);

  const handleMemberAdded = () => {
    setIsAddModalOpen(false);
    load(search, level, status, 1);
  };

  const initials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--navy)" }}>Members</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: 2 }}>
            {total} member{total !== 1 ? "s" : ""} found
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-outline btn-sm">
            <Download size={15} /> Export
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={15} /> Add Member
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 280px" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
            <input
              id="member-search"
              type="text"
              className="form-input"
              style={{ paddingLeft: 40 }}
              placeholder="Search name, mobile, ID, email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Level filter */}
          <select
            id="member-level-filter"
            className="form-input"
            style={{ width: "auto", minWidth: 150 }}
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">All Plans</option>
            <option value="starter">Starter</option>
            <option value="builder">Builder</option>
            <option value="pro">Pro</option>
            <option value="elite">Elite</option>
          </select>

          {/* Status filter */}
          <select
            id="member-status-filter"
            className="form-input"
            style={{ width: "auto", minWidth: 160 }}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {(search || level || status) && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setSearch(""); setLevel(""); setStatus(""); }}
            >
              <XCircle size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          {isLoading ? (
            <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 16 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 56, borderRadius: 8 }} />
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="empty-state">
              <Search size={48} style={{ color: "var(--gray-300)" }} />
              <p style={{ fontWeight: 600, color: "var(--gray-500)" }}>No members found</p>
              <p style={{ fontSize: "0.85rem" }}>Try adjusting your search or filters</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>ID</th>
                  <th>Mobile</th>
                  <th>City</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Streak</th>
                  <th>Renewal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id}>
                    {/* Name + avatar */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: "0.78rem", flexShrink: 0 }}>
                          {initials(m.full_name || "?")}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--gray-900)", fontSize: "0.875rem" }}>{m.full_name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--gray-400)" }}>{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontFamily: "monospace", fontSize: "0.8rem", background: "var(--gray-100)", padding: "2px 8px", borderRadius: 4 }}>{m.member_id}</span></td>
                    <td style={{ fontSize: "0.85rem" }}>{m.mobile}</td>
                    <td style={{ fontSize: "0.85rem" }}>{m.city}</td>
                    <td>
                      {m.membership_level ? (
                        <span className={`badge ${LEVEL_BADGES[m.membership_level as MembershipLevel] || 'badge-gray'}`} style={{ textTransform: "capitalize" }}>
                          {m.membership_level}
                        </span>
                      ) : <span style={{ color: "var(--gray-400)", fontSize: "0.8rem" }}>—</span>}
                    </td>
                    <td>
                      {m.membership_status ? (
                        <span className={`badge ${STATUS_BADGES[m.membership_status as MembershipStatus]?.cls || 'badge-gray'}`}>
                          {STATUS_BADGES[m.membership_status as MembershipStatus]?.label || m.membership_status}
                        </span>
                      ) : <span style={{ color: "var(--gray-400)", fontSize: "0.8rem" }}>—</span>}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: "1rem" }}>{m.attendance_streak >= 7 ? "🔥" : "📅"}</span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: m.attendance_streak >= 7 ? "var(--orange)" : "var(--gray-600)" }}>
                          {m.attendance_streak || 0} days
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: "0.82rem", color: "var(--gray-500)" }}>
                      {m.renewal_date
                        ? new Date(m.renewal_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </td>
                    <td style={{ display: "flex", gap: 8 }}>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ padding: "6px 12px", fontSize: "0.8rem", color: "var(--indigo)", borderColor: "var(--indigo)" }}
                        onClick={() => setMemberToAssign(m)}
                      >
                        <Plus size={13} style={{ marginRight: 4 }} /> Plan
                      </button>
                      <Link
                        href={`/admin/members/${m.id}`}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                      >
                        View <ChevronRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && members.length > 0 && (
          <div style={{ padding: "16px 20px", borderTop: "1px solid var(--gray-200)", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.85rem" }}>
            <span style={{ color: "var(--gray-500)" }}>
              Showing {members.length} of {total}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn btn-outline btn-sm"
                disabled={page <= 1}
                onClick={() => { const p = page - 1; setPage(p); load(search, level, status, p); }}
              >
                Previous
              </button>
              <button
                className="btn btn-outline btn-sm"
                disabled={!hasNext}
                onClick={() => { const p = page + 1; setPage(p); load(search, level, status, p); }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <AddMemberModal 
          onClose={() => setIsAddModalOpen(false)} 
          onSuccess={handleMemberAdded} 
        />
      )}

      {memberToAssign && (
        <AssignMembershipModal
          member={memberToAssign}
          onClose={() => setMemberToAssign(null)}
          onSuccess={() => {
            setMemberToAssign(null);
            load(search, level, status, page);
          }}
        />
      )}
    </div>
  );
}
