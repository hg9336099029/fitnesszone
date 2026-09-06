"use client";

import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

export function ComingSoon({ title, description }: { title: string, description?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center", justifyContent: "center", minHeight: "70vh", textAlign: "center" }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: "var(--blue-50)", border: "1px solid var(--blue-100)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16
      }}>
        <Clock size={40} color="var(--blue)" />
      </div>
      
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--navy)", marginBottom: 8 }}>{title}</h1>
        <p style={{ fontSize: "1rem", color: "var(--gray-500)", maxWidth: 400, margin: "0 auto", lineHeight: 1.5 }}>
          {description || "We are currently building this feature. Check back later to see it in action!"}
        </p>
      </div>

      <div style={{ marginTop: 24 }}>
        <Link href="/admin/dashboard" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 24px" }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
