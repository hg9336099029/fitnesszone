"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Play,
  Share2,
  AtSign,
} from "lucide-react";

const QUICK_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Membership Plans", href: "/memberships" },
  { label: "Our Trainers", href: "/trainers" },
  { label: "Programs & Classes", href: "/programs" },
  { label: "Contact", href: "/contact" },
];

const PROGRAMS = [
  "Strength Training",
  "HIIT Cardio",
  "Yoga & Pilates",
  "Boxing",
  "Zumba Dance",
  "Weight Loss",
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--navy)",
        color: "rgba(255,255,255,0.75)",
        paddingTop: 64,
        paddingBottom: 0,
      }}
    >
      <div className="container-app">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 48,
            paddingBottom: 48,
          }}
        >
          {/* Brand Column */}
          <div>
            <Image
              src="/logo.png"
              alt="FitnessZone"
              width={160}
              height={40}
              style={{ height: 40, width: "auto", marginBottom: 16 }}
            />
            <p style={{ fontSize: "0.875rem", lineHeight: 1.7, maxWidth: 260 }}>
              India&apos;s premier gym management platform. Building stronger bodies
              and healthier communities since 2020.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {[AtSign, Share2, Play, Globe].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.7)",
                    transition: "all 0.2s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--orange)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                color: "#fff",
                fontSize: "0.875rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 20,
              }}
            >
              Quick Links
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(255,255,255,0.65)",
                      textDecoration: "none",
                      transition: "color 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--orange)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4
              style={{
                color: "#fff",
                fontSize: "0.875rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 20,
              }}
            >
              Programs
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {PROGRAMS.map((p) => (
                <li key={p} style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.65)" }}>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                color: "#fff",
                fontSize: "0.875rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 20,
              }}
            >
              Contact Us
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { Icon: MapPin, text: "FitnessZone Complex, Andheri West,\nMumbai – 400058, Maharashtra" },
                { Icon: Phone, text: "+91 99999 00001" },
                { Icon: Mail, text: "hello@fitnesszone.in" },
              ].map(({ Icon, text }, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Icon size={16} style={{ color: "var(--orange)", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.65)", whiteSpace: "pre-line" }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Timings */}
            <div
              style={{
                marginTop: 20,
                padding: 16,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 10,
                fontSize: "0.8rem",
              }}
            >
              <div style={{ color: "#fff", fontWeight: 600, marginBottom: 8 }}>Gym Timings</div>
              <div>Mon – Sat: 5:00 AM – 11:00 PM</div>
              <div>Sunday: 6:00 AM – 9:00 PM</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "20px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          <span>© {new Date().getFullYear()} FitnessZone. All rights reserved.</span>
          <div style={{ display: "flex", gap: 24 }}>
            <Link href="/privacy" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: "inherit", textDecoration: "none" }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
