"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  IndianRupee,
  UserCheck,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle2,
  Info,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { reportsApi } from "@/lib/api/client";
import type { AdminDashboardStats } from "@/types";

// ── Color map ─────────────────────────────────────────────────

const PLAN_COLORS: Record<string, string> = {
  starter: "#22C55E",
  builder: "#1E4FD8",
  pro: "#F97316",
  elite: "#7C3AED",
};

const ALERT_ICONS = {
  warning: AlertCircle,
  info: Info,
  error: AlertCircle,
  success: CheckCircle2,
};
const ALERT_COLORS = {
  warning: { bg: "#fff", color: "#92400E", border: "var(--gray-200)" },
  info:    { bg: "#fff", color: "#1D4ED8", border: "var(--gray-200)" },
  error:   { bg: "#fff", color: "#DC2626", border: "var(--gray-200)" },
  success: { bg: "#fff", color: "#15803D", border: "var(--gray-200)" },
};

// ── Stat Card ─────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  trend?: { value: number; positive: boolean };
  color: string;
}) {
  return (
    <div
      className="card"
      style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={22} color={color} />
        </div>
        {trend && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.78rem", fontWeight: 600, color: trend.positive ? "#15803D" : "#DC2626" }}>
            {trend.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "var(--navy)", lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--gray-500)", fontWeight: 500, marginTop: 4 }}>{label}</div>
        {sub && <div style={{ fontSize: "0.78rem", color: "var(--gray-400)", marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ── Custom Tooltip ────────────────────────────────────────────

function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid var(--gray-200)", borderRadius: 10, padding: "10px 16px", boxShadow: "var(--shadow-md)" }}>
      <div style={{ fontWeight: 700, color: "var(--navy)", marginBottom: 6, fontSize: "0.875rem" }}>{label}</div>
      <div style={{ fontSize: "0.85rem", color: "var(--blue)" }}>₹{payload[0].value.toLocaleString("en-IN")}</div>
      {payload[1] && <div style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>{payload[1].value} new members</div>}
    </div>
  );
}

// ── Dashboard Page ────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const result = await reportsApi.dashboard();
      setData(result);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  const refresh = async () => {
    setRefreshing(true);
    await load();
  };

  if (isLoading) {
    return (
      <div style={{ display: "grid", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 130, borderRadius: 14 }} />)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="skeleton" style={{ height: 300, borderRadius: 14 }} />
          <div className="skeleton" style={{ height: 300, borderRadius: 14 }} />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--navy)", marginBottom: 4 }}>Good evening, Admin 👋</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}>Here&apos;s what&apos;s happening at FitnessZone today</p>
        </div>
        <button
          onClick={refresh}
          className="btn btn-outline btn-sm"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <RefreshCw size={14} style={{ animation: refreshing ? "spin 0.7s linear infinite" : "none" }} />
          Refresh
        </button>
      </div>

      {/* ── KPI Cards ──────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18 }}>
        <StatCard
          icon={Users}
          label="Total Members"
          value={data.total_members.toLocaleString("en-IN")}
          sub={`${data.active_members} active`}
          trend={{ value: 8.2, positive: true }}
          color="var(--blue)"
        />
        <StatCard
          icon={IndianRupee}
          label="Monthly Revenue"
          value={`₹${(data.monthly_revenue_inr / 1000).toFixed(0)}K`}
          sub={`₹${data.monthly_revenue_inr.toLocaleString("en-IN")}`}
          trend={{ value: data.revenue_growth_pct, positive: true }}
          color="var(--orange)"
        />
        <StatCard
          icon={UserCheck}
          label="Staff Count"
          value={String(data.staff_count)}
          sub="Trainers & staff"
          color="#7C3AED"
        />
        <StatCard
          icon={Calendar}
          label="Today's Attendance"
          value={String(data.today_attendance)}
          sub="Check-ins today"
          trend={{ value: 5.1, positive: true }}
          color="#22C55E"
        />
        <StatCard
          icon={TrendingUp}
          label="New This Month"
          value={String(data.new_members_this_month)}
          sub={`${data.renewals_this_month} renewals`}
          color="var(--navy)"
        />
      </div>



      {/* ── Charts Row ─────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>

        {/* Revenue Trend */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h3 style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1rem" }}>Revenue Trend</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--gray-500)", marginTop: 2 }}>Last 6 months</p>
            </div>
            <span className="badge badge-green">+{data.revenue_growth_pct}% this month</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.monthly_revenue_trend} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--blue)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--blue)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--gray-400)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--gray-400)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<RevenueTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="var(--blue)" strokeWidth={2.5} fill="url(#revGrad)" dot={{ fill: "var(--blue)", strokeWidth: 0, r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Membership Distribution */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1rem", marginBottom: 4 }}>Membership Mix</h3>
          <p style={{ fontSize: "0.8rem", color: "var(--gray-500)", marginBottom: 20 }}>{data.total_members} total members</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={data.membership_distribution}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="count"
              >
                {data.membership_distribution.map((entry) => (
                  <Cell key={entry.level} fill={PLAN_COLORS[entry.level]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [v, "Members"]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
            {data.membership_distribution.map((d) => (
              <div key={d.level} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: PLAN_COLORS[d.level] }} />
                  <span style={{ fontSize: "0.8rem", color: "var(--gray-600)", textTransform: "capitalize", fontWeight: 500 }}>{d.level}</span>
                </div>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--gray-700)" }}>{d.count} <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>({d.percentage}%)</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Activity + Quick Links ──────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Recent Activity */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1rem" }}>Recent Activity</h3>
            <Link href="/admin/members" style={{ fontSize: "0.8rem", color: "var(--blue)", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {data.recent_activity.map((item, i) => (
              <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 0", borderBottom: i < data.recent_activity.length - 1 ? "1px solid var(--gray-100)" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--gray-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1rem" }}>
                  {item.type === "join" ? "🎉" : item.type === "payment" ? "💳" : item.type === "goal_achieved" ? "🏆" : "🔔"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--gray-700)", lineHeight: 1.4 }}>{item.message}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: 4 }}>
                    {new Date(item.timestamp).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1rem", marginBottom: 20 }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Add New Member", href: "/admin/members", color: "var(--blue)" },
              { label: "Add Trainer", href: "/admin/trainers", color: "#15803D" },
              { label: "Record Payment", href: "/admin/payments", color: "var(--orange)" },
              { label: "Mark Attendance", href: "/admin/attendance", color: "#22C55E" },
              { label: "View Reports", href: "/admin/reports", color: "#7C3AED" },
              { label: "Manage Classes", href: "/admin/classes", color: "var(--navy)" },
            ].map(({ label, href, color }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  borderRadius: 10,
                  background: "var(--gray-50)",
                  border: "1px solid var(--gray-200)",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  color: "var(--gray-700)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = color + "10"; (e.currentTarget as HTMLAnchorElement).style.borderColor = color + "30"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--gray-50)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--gray-200)"; }}
              >
                {label}
                <ChevronRight size={16} color={color} />
              </Link>
            ))}
          </div>
        </div>
      </div>



      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
// Force recompile 2
