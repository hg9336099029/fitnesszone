"use client";

import { useState, useEffect } from "react";
import { User, Lock, CheckCircle2, AlertCircle, Save } from "lucide-react";
import { authApi } from "@/lib/api/client";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  const [profile, setProfile] = useState({ full_name: "", mobile: "", email: "" });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [password, setPassword] = useState({ old_password: "", new_password: "", confirm_password: "" });
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    authApi.getProfile().then(data => {
      setProfile({ full_name: data.full_name || "", mobile: data.mobile || "", email: data.email || "" });
    }).catch(err => {
      setProfileError("Failed to load profile.");
    });
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(""); setProfileSuccess(false); setLoadingProfile(true);
    try {
      await authApi.updateProfile(profile);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (e: any) {
      setProfileError(e.message || "Failed to update profile.");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(""); setPasswordSuccess(false);
    
    if (password.new_password !== password.confirm_password) {
      setPasswordError("New passwords do not match.");
      return;
    }
    
    setLoadingPassword(true);
    try {
      await authApi.changePassword({ old_password: password.old_password, new_password: password.new_password });
      setPasswordSuccess(true);
      setPassword({ old_password: "", new_password: "", confirm_password: "" });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (e: any) {
      setPasswordError(e.message || "Failed to change password.");
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--navy)" }}>Account Settings</h1>
        <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: 2 }}>Manage your admin profile and security credentials</p>
      </div>

      <div className="card" style={{ display: "flex", overflow: "hidden", minHeight: 400 }}>
        
        {/* Sidebar */}
        <div style={{ width: 220, background: "var(--gray-50)", borderRight: "1px solid var(--gray-200)", padding: "20px 0" }}>
          <button onClick={() => setActiveTab("profile")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", background: activeTab === "profile" ? "#fff" : "transparent", border: "none", borderRight: activeTab === "profile" ? "3px solid var(--blue)" : "3px solid transparent", cursor: "pointer", textAlign: "left", fontWeight: activeTab === "profile" ? 700 : 500, color: activeTab === "profile" ? "var(--blue)" : "var(--gray-600)" }}>
            <User size={18} /> Profile
          </button>
          <button onClick={() => setActiveTab("security")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", background: activeTab === "security" ? "#fff" : "transparent", border: "none", borderRight: activeTab === "security" ? "3px solid var(--blue)" : "3px solid transparent", cursor: "pointer", textAlign: "left", fontWeight: activeTab === "security" ? 700 : 500, color: activeTab === "security" ? "var(--blue)" : "var(--gray-600)" }}>
            <Lock size={18} /> Security
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: 32 }}>
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSubmit}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--navy)", marginBottom: 24 }}>Profile Information</h2>
              
              {profileSuccess && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F0FDF4", border: "1px solid #BBF7D0", padding: "10px 14px", borderRadius: 8, color: "#15803D", marginBottom: 20, fontSize: "0.875rem", fontWeight: 500 }}>
                  <CheckCircle2 size={16} /> Profile updated successfully!
                </div>
              )}
              {profileError && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FEF2F2", border: "1px solid #FECACA", padding: "10px 14px", borderRadius: 8, color: "#DC2626", marginBottom: 20, fontSize: "0.875rem", fontWeight: 500 }}>
                  <AlertCircle size={16} /> {profileError}
                </div>
              )}

              <div style={{ display: "grid", gap: 20 }}>
                <div>
                  <label className="form-label">Full Name</label>
                  <input className="form-input" required value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} placeholder="Admin Name" />
                </div>
                <div>
                  <label className="form-label">Mobile Number</label>
                  <input className="form-input" required value={profile.mobile} onChange={e => setProfile({...profile, mobile: e.target.value})} placeholder="9876543210" />
                </div>
                <div>
                  <label className="form-label">Email Address (Optional)</label>
                  <input className="form-input" type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} placeholder="admin@fitnesszone.in" />
                </div>
              </div>

              <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="btn btn-primary" disabled={loadingProfile}>
                  {loadingProfile ? "Saving..." : <><Save size={16} /> Save Changes</>}
                </button>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <form onSubmit={handlePasswordSubmit}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--navy)", marginBottom: 24 }}>Change Password</h2>
              
              {passwordSuccess && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F0FDF4", border: "1px solid #BBF7D0", padding: "10px 14px", borderRadius: 8, color: "#15803D", marginBottom: 20, fontSize: "0.875rem", fontWeight: 500 }}>
                  <CheckCircle2 size={16} /> Password changed successfully!
                </div>
              )}
              {passwordError && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FEF2F2", border: "1px solid #FECACA", padding: "10px 14px", borderRadius: 8, color: "#DC2626", marginBottom: 20, fontSize: "0.875rem", fontWeight: 500 }}>
                  <AlertCircle size={16} /> {passwordError}
                </div>
              )}

              <div style={{ display: "grid", gap: 20 }}>
                <div>
                  <label className="form-label">Current Password</label>
                  <input className="form-input" type="password" required value={password.old_password} onChange={e => setPassword({...password, old_password: e.target.value})} />
                </div>
                <div style={{ height: 1, background: "var(--gray-200)", margin: "4px 0" }} />
                <div>
                  <label className="form-label">New Password</label>
                  <input className="form-input" type="password" required minLength={8} value={password.new_password} onChange={e => setPassword({...password, new_password: e.target.value})} />
                  <span style={{ fontSize: "0.75rem", color: "var(--gray-400)" }}>Minimum 8 characters</span>
                </div>
                <div>
                  <label className="form-label">Confirm New Password</label>
                  <input className="form-input" type="password" required minLength={8} value={password.confirm_password} onChange={e => setPassword({...password, confirm_password: e.target.value})} />
                </div>
              </div>

              <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="btn btn-primary" disabled={loadingPassword}>
                  {loadingPassword ? "Updating..." : <><Lock size={16} /> Update Password</>}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
