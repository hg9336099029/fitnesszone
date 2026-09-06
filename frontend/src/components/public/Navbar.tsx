"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Memberships", href: "/memberships" },
  { label: "Trainers", href: "/trainers" },
  { label: "Programs", href: "/programs" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.3s ease",
        background: scrolled
          ? "rgba(10, 22, 40, 0.97)"
          : "rgba(10, 22, 40, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.3)" : "none",
      }}
    >
      <div className="container-app" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Image
            src="/logo.png"
            alt="FitnessZone"
            width={160}
            height={40}
            style={{ height: 40, width: "auto", objectFit: "contain" }}
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "rgba(255,255,255,0.8)",
                transition: "color 0.15s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/login" className="btn btn-outline-white btn-sm">
            Login
          </Link>
          <Link href="/join" className="btn btn-orange btn-sm">
            Join Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="hide-desktop"
          onClick={() => setIsOpen(!isOpen)}
          style={{ background: "none", border: "none", color: "#fff", padding: 8 }}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          style={{
            background: "var(--navy)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "16px 24px 24px",
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              style={{
                display: "block",
                padding: "12px 0",
                color: "rgba(255,255,255,0.8)",
                fontSize: "1rem",
                fontWeight: 500,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <Link href="/login" className="btn btn-outline-white" style={{ justifyContent: "center" }}>
              Login
            </Link>
            <Link href="/join" className="btn btn-orange" style={{ justifyContent: "center" }}>
              Join Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
