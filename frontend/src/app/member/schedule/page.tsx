"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Dumbbell,
  ChevronRight,
  Filter,
} from "lucide-react";
import { mockGetClasses } from "@/lib/mock";
import type { GymClass } from "@/types";

const LEVEL_COLORS = {
  beginner: { bg: "#F0FDF4", color: "#15803D" },
  intermediate: { bg: "#EFF6FF", color: "#1D4ED8" },
  advanced: { bg: "#FFF7ED", color: "#C2410C" },
};

export default function MemberSchedulePage() {
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    mockGetClasses().then((c) => {
      setClasses(c);
      setIsLoading(false);
    });
  }, []);

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  if (isLoading) {
    return (
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 130, borderRadius: 14 }} />)}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--navy)" }}>Schedule</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: 2 }}>{today}</p>
        </div>
        <button className="btn btn-outline btn-sm">
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* Day tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
        {["Today", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
          <button
            key={day}
            className={i === 0 ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm"}
            style={{ whiteSpace: "nowrap", minWidth: 56, borderRadius: 10 }}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Classes */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {classes.map((cls) => {
          const level = cls.level ?? "beginner";
          const levelStyle = LEVEL_COLORS[level as keyof typeof LEVEL_COLORS] || LEVEL_COLORS.beginner;
          const isFull = cls.available_seats === 0;
          const startTime = new Date(cls.start_datetime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
          const endTime = new Date(cls.end_datetime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

          return (
            <div
              key={cls.id}
              className="card"
              style={{ padding: 20, borderLeft: "4px solid var(--blue)", opacity: isFull ? 0.75 : 1 }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                {/* Time column */}
                <div style={{ textAlign: "center", minWidth: 56 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, color: "var(--navy)" }}>{startTime}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--gray-400)" }}>to</div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--gray-500)" }}>{endTime}</div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1rem" }}>{cls.name}</h3>
                    <span className="badge" style={{ background: levelStyle.bg, color: levelStyle.color, fontSize: "0.68rem" }}>
                      {level}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.82rem", color: "var(--gray-500)", marginBottom: 10, lineHeight: 1.5 }}>
                    {cls.description}
                  </p>

                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.78rem", color: "var(--gray-500)" }}>
                      <Dumbbell size={12} /> {cls.trainer.user.full_name}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.78rem", color: "var(--gray-500)" }}>
                      <MapPin size={12} /> {cls.location}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.78rem", color: isFull ? "var(--error)" : "var(--success)" }}>
                      <Users size={12} /> {isFull ? "Full" : `${cls.available_seats} seats left`}
                    </span>
                  </div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  <button
                    className={isFull ? "btn btn-ghost btn-sm" : "btn btn-primary btn-sm"}
                    disabled={isFull}
                  >
                    {isFull ? "Full" : "Book"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
