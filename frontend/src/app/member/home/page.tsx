"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Flame,
  Target,
  Trophy,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  Star,
  Plus,
  Calendar,
  Scale,
  Activity,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { memberPortalApi } from "@/lib/api/client";
import type { MemberDashboard } from "@/types";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  bg,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}) {
  return (
    <div
      className="card"
      style={{
        padding: "24px",
        display: "flex",
        alignItems: "center",
        gap: 18,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={24} color={color} />
      </div>
      <div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.7rem",
            fontWeight: 900,
            color: "var(--navy)",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--gray-500)", marginTop: 4, fontWeight: 500 }}>
          {label}
        </div>
        {sub && (
          <div style={{ fontSize: "0.72rem", color, fontWeight: 600, marginTop: 2 }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

const MOCK_WEIGHT_CHART = [
  { month: "Apr", weight: 89 },
  { month: "May", weight: 87.5 },
  { month: "Jun", weight: 86.2 },
  { month: "Jul", weight: 85.0 },
  { month: "Aug", weight: 84.5 },
  { month: "Sep", weight: 84.0 },
];

export default function MemberHomePage() {
  const [data, setData] = useState<MemberDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    memberPortalApi
      .getDashboard()
      .then((d) => {
        setData(d);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 110, borderRadius: 14 }} />
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
          <div className="skeleton" style={{ height: 320, borderRadius: 14 }} />
          <div className="skeleton" style={{ height: 320, borderRadius: 14 }} />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card" style={{ padding: "60px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>Profile Not Found</h2>
        <p style={{ color: "var(--gray-500)", fontSize: "0.9rem" }}>
          Your member profile could not be loaded. Please contact the administrator.
        </p>
      </div>
    );
  }

  const { member, membership, goals, achievements, progress_summary, attendance_streak } = data;

  const firstName = member?.full_name?.split(" ")[0] ?? "Member";
  const daysLeft = membership?.end_date
    ? Math.max(0, Math.round((new Date(membership.end_date).getTime() - Date.now()) / 86400000))
    : null;
  const activeGoals = goals.filter((g) => !g.is_achieved);
  const completedGoals = goals.filter((g) => g.is_achieved);
  const primaryGoal = activeGoals[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── Greeting banner ──────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--navy) 0%, #1a3a6e 100%)",
          borderRadius: 16,
          padding: "28px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(249,115,22,0.12)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -30, right: 120, width: 120, height: 120, borderRadius: "50%", background: "rgba(59,130,246,0.1)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.7rem",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.01em",
              marginBottom: 8,
            }}
          >
            Welcome back, {firstName}! 💪
          </h1>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
            {activeGoals.length > 0
              ? `You have ${activeGoals.length} active goal${activeGoals.length > 1 ? "s" : ""}. Keep pushing!`
              : "Set your first goal and start your journey today."}
          </p>
        </div>
        {membership && (
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 14,
              padding: "16px 24px",
              textAlign: "center",
              flexShrink: 0,
              position: "relative",
              zIndex: 2,
            }}
          >
            <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 4 }}>
              {membership.plan?.name ?? "Membership"}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2.2rem",
                fontWeight: 900,
                color: daysLeft !== null && daysLeft <= 7 ? "var(--orange)" : "#fff",
                lineHeight: 1,
              }}
            >
              {daysLeft ?? "—"}
            </div>
            <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>days remaining</div>
          </div>
        )}
      </div>

      {/* ── Stat cards row ───────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
        <StatCard
          label="Day Streak"
          value={`${attendance_streak}d`}
          sub={attendance_streak > 0 ? "🔥 Keep it up!" : "Start today!"}
          icon={Flame}
          color="#F97316"
          bg="#FFF7ED"
        />
        <StatCard
          label="Active Goals"
          value={activeGoals.length}
          sub={completedGoals.length > 0 ? `${completedGoals.length} completed` : "Set a new goal"}
          icon={Target}
          color="var(--blue)"
          bg="#EFF6FF"
        />
        <StatCard
          label="Achievements"
          value={achievements.length}
          sub={achievements.length > 0 ? "Great progress!" : "Earn your first badge"}
          icon={Trophy}
          color="#7C3AED"
          bg="#F5F3FF"
        />
        <StatCard
          label="Current Weight"
          value={progress_summary?.weight_kg ? `${progress_summary.weight_kg} kg` : "—"}
          sub={progress_summary ? "Last recorded" : "Log your weight"}
          icon={Scale}
          color="#10B981"
          bg="#F0FDF4"
        />
      </div>

      {/* ── Main content grid ────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24 }}>

        {/* Weight trend chart */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1rem" }}>Weight Trend</h2>
              <p style={{ fontSize: "0.8rem", color: "var(--gray-500)", marginTop: 2 }}>Last 6 months</p>
            </div>
            {progress_summary && (
              <span style={{ background: "#F0FDF4", color: "#10B981", fontWeight: 700, fontSize: "0.78rem", padding: "4px 10px", borderRadius: 20 }}>
                📉 -7.5 kg total
              </span>
            )}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MOCK_WEIGHT_CHART} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--gray-400)" }} axisLine={false} tickLine={false} />
              <YAxis domain={[82, 91]} tick={{ fontSize: 11, fill: "var(--gray-400)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}kg`} />
              <Tooltip
                formatter={(v) => [`${v} kg`, "Weight"]}
                contentStyle={{ borderRadius: 10, border: "1px solid var(--gray-200)", fontSize: "0.85rem" }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="var(--blue)"
                strokeWidth={2.5}
                dot={{ fill: "var(--blue)", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Primary Goal progress */}
        <div className="card" style={{ padding: 28, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1rem" }}>Primary Goal</h2>
            <Link href="/member/goals" style={{ fontSize: "0.78rem", color: "var(--blue)", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              All Goals <ChevronRight size={13} />
            </Link>
          </div>
          {primaryGoal ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 16 }}>
              {/* Radial progress */}
              <div style={{ position: "relative", width: 140, height: 140 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="100%"
                    startAngle={90}
                    endAngle={-270}
                    data={[
                      { value: Math.round(primaryGoal.progress_percentage), fill: "var(--orange)" },
                      { value: 100 - Math.round(primaryGoal.progress_percentage), fill: "#F1F5F9" },
                    ]}
                    barSize={12}
                  >
                    <RadialBar dataKey="value" cornerRadius={8} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 900, color: "var(--navy)" }}>
                    {Math.round(primaryGoal.progress_percentage)}%
                  </span>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1rem", marginBottom: 4 }}>{primaryGoal.title}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--gray-500)" }}>
                  {primaryGoal.current_value} / {primaryGoal.target_value} {primaryGoal.unit}
                </div>
              </div>
              <button className="btn btn-primary btn-sm">
                <TrendingUp size={14} /> Update Progress
              </button>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <Target size={40} color="var(--gray-300)" />
              <p style={{ color: "var(--gray-500)", fontSize: "0.875rem", textAlign: "center" }}>No active goals yet.<br />Set a goal to track your progress.</p>
              <Link href="/member/goals" className="btn btn-primary btn-sm">
                <Plus size={14} /> Add Goal
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom row ───────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* Trainer card / body measurements */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1rem" }}>Body Metrics</h2>
            <Link href="/member/progress" style={{ fontSize: "0.78rem", color: "var(--blue)", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              Full Progress <ChevronRight size={13} />
            </Link>
          </div>
          {progress_summary ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "Weight", value: `${progress_summary.weight_kg} kg`, color: "#F97316" },
                { label: "Body Fat", value: `${progress_summary.body_fat_percentage ?? "—"}%`, color: "#10B981" },
                { label: "Chest", value: `${progress_summary.chest_cm ?? "—"} cm`, color: "var(--blue)" },
                { label: "Waist", value: `${progress_summary.waist_cm ?? "—"} cm`, color: "#7C3AED" },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  style={{
                    padding: "14px 16px",
                    background: "var(--gray-50)",
                    borderRadius: 12,
                    border: "1px solid var(--gray-200)",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 900, color: "var(--navy)" }}>{value}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--gray-500)", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "24px 0" }}>
              <Activity size={36} color="var(--gray-300)" />
              <p style={{ color: "var(--gray-500)", fontSize: "0.875rem", textAlign: "center" }}>No measurements recorded yet.</p>
              <Link href="/member/progress" className="btn btn-outline btn-sm">Log First Entry</Link>
            </div>
          )}
        </div>

        {/* Quick Actions + Trainer */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Trainer */}
          {member?.assigned_trainer ? (
            <div className="card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: "1rem", flexShrink: 0 }}>
                {member.assigned_trainer.user.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.7rem", color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 2 }}>Your Trainer</div>
                <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.95rem" }}>{member.assigned_trainer.user.full_name}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--gray-500)" }}>{member.assigned_trainer.specialization?.[0] ?? "Personal Trainer"}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--gray-700)" }}>{member.assigned_trainer.rating}</span>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--gray-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Dumbbell size={24} color="var(--gray-400)" />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.9rem" }}>No trainer assigned</div>
                <div style={{ fontSize: "0.78rem", color: "var(--gray-500)" }}>Contact the gym to get a trainer</div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1rem", marginBottom: 16 }}>Quick Actions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Log a Workout", icon: Dumbbell, href: "/member/progress" },
                { label: "View Schedule", icon: Calendar, href: "/member/schedule" },
                { label: "Update Goals", icon: Target, href: "/member/goals" },
              ].map(({ label, icon: Icon, href }) => (
                <Link
                  key={label}
                  href={href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "var(--gray-50)",
                    border: "1px solid var(--gray-200)",
                    borderRadius: 10,
                    textDecoration: "none",
                    color: "var(--gray-700)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--blue)";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = "var(--blue)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--gray-50)";
                    e.currentTarget.style.color = "var(--gray-700)";
                    e.currentTarget.style.borderColor = "var(--gray-200)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon size={16} />
                    {label}
                  </div>
                  <ChevronRight size={14} />
                </Link>
              ))}
            </div>
          </div>

          {/* Renewal alert */}
          {daysLeft !== null && daysLeft <= 14 && (
            <div
              style={{
                background: daysLeft <= 7
                  ? "linear-gradient(135deg, var(--orange) 0%, #ea6700 100%)"
                  : "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                borderRadius: 14,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.9rem" }}>
                  ⚡ {daysLeft <= 7 ? "Renew Now!" : "Renewing Soon"}
                </div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
                  {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
                </div>
              </div>
              <Link href="/member/profile" className="btn" style={{ background: "#fff", color: "var(--orange)", fontWeight: 700, fontSize: "0.8rem", whiteSpace: "nowrap", padding: "8px 16px" }}>
                Renew
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Achievements row ─────────────────────────────────── */}
      {achievements.length > 0 && (
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1rem" }}>Achievements 🏆</h2>
            <span style={{ fontSize: "0.78rem", color: "var(--gray-500)" }}>{achievements.length} earned</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {achievements.map((ach) => (
              <div
                key={ach.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "16px 20px",
                  background: "#FFFBEB",
                  borderRadius: 12,
                  border: "1px solid #FDE68A",
                  minWidth: 100,
                  textAlign: "center",
                  transition: "transform 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <span style={{ fontSize: "2rem" }}>{ach.icon}</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--navy)" }}>{ach.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
