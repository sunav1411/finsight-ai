"use client";

import { useEffect, useState } from "react";
import { Bell, Wallet, LogOut, Save, User, Check, ShieldAlert, Send } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  sendPasswordResetEmail,
} from "firebase/auth"; 
import { logoutUser } from "@/lib/auth";
import { saveUserSettings, getUserSettings } from "@/lib/firestore";
import { useTheme } from "@/context/ThemeContext";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

// ─── TOGGLE ───────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 50,
        height: 28,
        borderRadius: 14,
        background: checked ? "#16A34A" : "#E5E7EB",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.22s ease",
        flexShrink: 0,
        boxShadow: checked ? "0 0 0 3px #BBF7D044" : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 4,
          left: checked ? 26 : 4,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          transition: "left 0.22s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {checked && <Check size={11} color="#16A34A" strokeWidth={3} />}
      </div>
    </div>
  );
}

// ─── SECTION ─────────────────────────────────────────────────────────────────

function Section({ icon, title, sub, children, accent = "#16A34A" }) {
  return (
    <div style={{ ...s.section, borderLeft: `3px solid ${accent}22` }}>
      <div style={s.sectionHead}>
        <div style={{ ...s.iconBox, background: `${accent}12` }}>
          {icon}
        </div>
        <div>
          <h2 style={s.sectionTitle}>{title}</h2>
          <p style={s.sectionSub}>{sub}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── TOGGLE ROW ───────────────────────────────────────────────────────────────

function ToggleRow({ label, description, checked, onChange, isLast }) {
  return (
    <>
      <div style={s.toggleRow}>
        <div style={{ flex: 1 }}>
          <div style={s.toggleLabel}>{label}</div>
          {description && <div style={s.toggleDesc}>{description}</div>}
        </div>
        <Toggle checked={checked} onChange={onChange} />
      </div>
      {!isLast && <div style={s.rowDivider} />}
    </>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [user, setUser]                     = useState(null);
  const [loading, setLoading]               = useState(true);
  const [saved, setSaved]                   = useState(false);
  const [sendingSupport, setSendingSupport] = useState(false);
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [settings, setSettings] = useState({
    notifications: true,
    budgetAlerts:  true,
  });

  const { darkMode } = useTheme();

  // ── LOAD ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return;
      setUser(currentUser);
      const data = await getUserSettings(currentUser.uid);
      setSettings(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // ── SAVE ──────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!user) return;
    await saveUserSettings(user.uid, { ...settings, darkMode });
    setSaved(true);
    toast.success("Settings saved");
    setTimeout(() => setSaved(false), 2200);
  }

  // ── LOGOUT ────────────────────────────────────────────────────────────────
  async function handleLogout() {
    await logoutUser();
    window.location.href = "/login";
  }
  // ── PASSWORD RESET ─────────────────────────────────────────────
  async function handlePasswordReset() {

    try {

      if (!user?.email) {

        toast.error(
          "No email found"
        );

        return;
      }

      await sendPasswordResetEmail(
        auth,
        user.email
      );

      toast.success(
        "Password reset email sent"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to send reset email"
      );
    }
  }
  // ── SUPPORT ───────────────────────────────────────────────────────────────
  async function handleSupportSubmit() {
    if (!supportSubject.trim() || !supportMessage.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setSendingSupport(true);
      await emailjs.send(
        "service_2b3k09u",
        "template_iu1mzwb",
        {
          from_name:  user?.displayName || "FinSight AI User",
          from_email: user?.email,
          subject:    supportSubject,
          message:    supportMessage,
        },
        "r31_mlOhYNlQof4rS"
      );
      toast.success("Complaint sent successfully");
      setSupportSubject("");
      setSupportMessage("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send complaint");
    } finally {
      setSendingSupport(false);
    }
  }

  function set(key, val) {
    setSettings((prev) => ({ ...prev, [key]: val }));
  }

  // ── LOADING STATE ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main style={s.loadingScreen}>
        <div style={s.spinner} />
        <span style={{ fontSize: 14, color: "#6B7280", fontWeight: 600 }}>
          Loading settings…
        </span>
      </main>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main style={s.page}>
      <div style={s.container}>

        {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
        <div style={s.pageHeader}>
          <div style={s.pageHeaderLeft}>
            <div style={s.pageIconWrap}>
              <User size={22} color="#16A34A" />
            </div>
            <div>
              <p style={s.pageLabel}>Account</p>
              <h1 style={s.pageTitle}>Settings</h1>
            </div>
          </div>
          <div style={s.headerBtns}>
            <button onClick={handleSave} style={s.saveBtn}>
              {saved ? <Check size={15} strokeWidth={3} /> : <Save size={15} />}
              {saved ? "Saved!" : "Save Changes"}
            </button>
            <button onClick={handleLogout} style={s.logoutBtn}>
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>

        {/* ── CARD ─────────────────────────────────────────────────────── */}
        <div style={s.card}>

          {/* PROFILE */}
          <Section
            icon={<User size={19} color="#16A34A" />}
            title="Profile"
            sub="Your account information"
          >
            <div style={s.emailBox}>
              <div style={s.avatarCircle}>
                {user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={s.emailCaption}>Signed in as</div>
                <div style={s.emailText}>{user?.email}</div>
              </div>
              <span style={s.verifiedBadge}>
                <Check size={10} strokeWidth={3} />
                Verified
              </span>
            </div>
          </Section>

          <div style={s.divider} />

          {/* NOTIFICATIONS */}
          <Section
            icon={<Bell size={19} color="#16A34A" />}
            title="Notifications"
            sub="Financial reminders & alerts"
          >
            <div style={s.toggleGroup}>
              <ToggleRow
                label="Enable notifications"
                description="Get alerts for upcoming bills and reminders"
                checked={settings.notifications}
                onChange={(v) => set("notifications", v)}
              />
              <ToggleRow
                label="Budget warnings"
                description="Warn when spending exceeds your set limits"
                checked={settings.budgetAlerts}
                onChange={(v) => set("budgetAlerts", v)}
                isLast
              />
            </div>
          </Section>

          <div style={s.divider} />

          {/* SUPPORT */}
          <Section
            icon={<ShieldAlert size={19} color="#D97706" />}
            title="Support & Complaints"
            sub="Send issues directly to FinSight AI support"
            accent="#D97706"
          >
            <div style={s.supportForm}>
              <div>
                <label style={s.fieldLabel}>Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Issue with expense sync"
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  style={s.input}
                />
              </div>
              <div>
                <label style={s.fieldLabel}>Message</label>
                <textarea
                  rows={6}
                  placeholder="Describe your issue in detail…"
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  style={{ ...s.input, resize: "none", paddingTop: 14, lineHeight: 1.65 }}
                />
              </div>
              <button
                onClick={handleSupportSubmit}
                disabled={sendingSupport}
                style={{ ...s.supportBtn, opacity: sendingSupport ? 0.7 : 1 }}
              >
                {sendingSupport ? (
                  <><div style={s.btnSpinner} />Sending…</>
                ) : (
                  <><Send size={15} />Send Complaint</>
                )}
              </button>
            </div>
          </Section>

          <div style={s.divider} />
                    <Section
            icon={
              <ShieldAlert
                size={19}
                color="#DC2626"
              />
            }
            title="Password & Security"
            sub="Manage your account password"
            accent="#DC2626"
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
                background: "#FAFAFA",
                border:
                  "1px solid #E5E7EB",
                borderRadius: 16,
                padding: "18px",
              }}
            >

              <div>

                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 4,
                  }}
                >
                  Reset Password
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    lineHeight: 1.6,
                  }}
                >
                  A secure password reset
                  link will be sent to:
                  <br />

                  <span
                    style={{
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {user?.email}
                  </span>

                </div>

              </div>

              <button
                onClick={
                  handlePasswordReset
                }
                style={{
                  height: 46,
                  padding: "0 18px",
                  borderRadius: 12,
                  border: "none",
                  background: "#DC2626",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Change Password
              </button>

            </div>

          </Section>

          <div style={s.divider} />
          {/* SECURITY */}
          <Section
            icon={<Wallet size={19} color="#2563EB" />}
            title="Account Security"
            sub="Authentication & active sessions"
            accent="#2563EB"
          >
            <div style={s.securityCard}>
              <div style={s.securityLeft}>
                <div style={s.securityIconWrap}>
                  <ShieldAlert size={17} color="#2563EB" />
                </div>
                <div>
                  <div style={s.securityTitle}>Email Authentication</div>
                  <div style={s.securityDesc}>
                    Signed in securely with Firebase Authentication.
                  </div>
                </div>
              </div>
              <div style={s.activeBadge}>
                <span style={s.activePulse} />
                Active
              </div>
            </div>
          </Section>

          <div style={s.divider} />

          {/* BOTTOM ACTIONS */}
          <div style={s.actions}>
            <button onClick={handleSave} style={s.saveBtn}>
              {saved ? <Check size={15} strokeWidth={3} /> : <Save size={15} />}
              {saved ? "Saved!" : "Save Settings"}
            </button>
            <button onClick={handleLogout} style={s.logoutBtn}>
              <LogOut size={15} />
              Logout
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const s = {

  // PAGE
  page: {
    minHeight: "100vh",
    background: "#F5F7FB",
    padding: "clamp(14px, 3vw, 28px)",
    fontFamily:
      "'DM Sans', 'Inter', 'Segoe UI', sans-serif",
  },

  loadingScreen: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    background: "#F5F7FB",
    fontFamily:
      "'DM Sans', 'Inter', sans-serif",
  },

  spinner: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    border: "3px solid #E5E7EB",
    borderTopColor: "#16A34A",
    animation:
      "spin 0.75s linear infinite",
  },

  container: {
    maxWidth: 820,
    margin: "0 auto",
    width: "100%",
  },

  // HEADER
  pageHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 22,
    flexWrap: "wrap",
    gap: 14,
  },

  pageHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: 13,
    minWidth: 0,
  },

  pageIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    background: "#F0FDF4",
    border:
      "1px solid #BBF7D0",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
    flexShrink: 0,
  },

  pageLabel: {
    margin: 0,
    fontSize: 11,
    fontWeight: 700,
    color: "#16A34A",
    letterSpacing:
      "0.13em",
    textTransform:
      "uppercase",
  },

  pageTitle: {
    margin: "2px 0 0",
    fontSize:
      "clamp(24px, 5vw, 30px)",
    fontWeight: 800,
    color: "#111827",
    letterSpacing:
      "-0.03em",
  },

  headerBtns: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },

  // CARD
card: {
  background: "#fff",
  borderRadius: 28,
  padding:
    "clamp(16px, 3.5vw, 30px)",
    border:
      "1px solid #E5E7EB",
    boxShadow:
      "0 1px 4px rgba(0,0,0,0.05)",
  },

  // SECTION
  section: {
    padding: "4px 0 4px 14px",
    borderRadius: 2,
  },

  sectionHead: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
    flexWrap: "wrap",
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
    flexShrink: 0,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 800,
    color: "#111827",
    letterSpacing:
      "-0.01em",
  },

  sectionSub: {
    margin: "3px 0 0",
    fontSize: 12,
    color: "#9CA3AF",
    lineHeight: 1.5,
  },

  // DIVIDERS
  divider: {
    height: 1,
    background: "#FFFFFF",
    margin: "24px 0",
  },

  rowDivider: {
    height: 1,
    background: "#FFFFFF",
  },

  // PROFILE
  emailBox: {
    display: "flex",
    alignItems: "center",
    gap: 13,
    background: "#F9FAFB",
    border:
      "1px solid #E5E7EB",
    borderRadius: 18,
    padding: "14px 15px",
    flexWrap: "wrap",
  },

  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 13,
    background: "#DCFCE7",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
    fontSize: 17,
    fontWeight: 800,
    color: "#16A34A",
    flexShrink: 0,
  },

  emailCaption: {
    fontSize: 11,
    fontWeight: 600,
    color: "#9CA3AF",
    textTransform:
      "uppercase",
    letterSpacing:
      "0.07em",
  },

  emailText: {
    fontSize: 14,
    fontWeight: 700,
    color: "#111827",
    marginTop: 2,
    overflow: "hidden",
    textOverflow:
      "ellipsis",
    whiteSpace: "nowrap",
  },

  verifiedBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    fontWeight: 700,
    color: "#16A34A",
    background: "#F0FDF4",
    border:
      "1px solid #BBF7D0",
    borderRadius: 8,
    padding: "5px 10px",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },

  // TOGGLES
  toggleGroup: {
    background: "#FAFAFA",
    border:
      "1px solid #FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
  },

  toggleRow: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    padding: "16px 18px",
    gap: 20,
    flexWrap: "wrap",
  },

  toggleLabel: {
    fontSize: 14,
    fontWeight: 700,
    color: "#111827",
  },

  toggleDesc: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
    lineHeight: 1.6,
  },

  // SUPPORT
  supportForm: {
    display: "grid",
    gap: 15,
  },

  fieldLabel: {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: "#6B7280",
    textTransform:
      "uppercase",
    letterSpacing:
      "0.08em",
    marginBottom: 7,
  },

  input: {
    width: "100%",
    border:
      "1.5px solid #E5E7EB",
    borderRadius: 14,
    padding: "14px 15px",
    fontSize: 14,
    outline: "none",
    background: "#FAFAFA",
    color: "#111827",
    fontFamily: "inherit",
    boxSizing: "border-box",
    transition:
      "border-color 0.15s",
  },

  supportBtn: {
    minHeight: 48,
    border: "none",
    background: "#16A34A",
    color: "#fff",
    borderRadius: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
    gap: 8,
    fontFamily: "inherit",
    transition:
      "background 0.15s",
    padding: "0 18px",
    flexWrap: "wrap",
  },

  btnSpinner: {
    width: 15,
    height: 15,
    borderRadius: "50%",
    border:
      "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    animation:
      "spin 0.7s linear infinite",
  },

  // SECURITY
  securityCard: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    border:
      "1px solid #E5E7EB",
    padding: "16px 18px",
    borderRadius: 18,
    background: "#FAFAFA",
    gap: 16,
    flexWrap: "wrap",
  },

  securityLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
  },

  securityIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "#EFF6FF",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
    flexShrink: 0,
  },

  securityTitle: {
    fontWeight: 700,
    fontSize: 14,
    color: "#111827",
    marginBottom: 3,
  },

  securityDesc: {
    fontSize: 12,
    color: "#9CA3AF",
    lineHeight: 1.5,
  },

  activeBadge: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "#F0FDF4",
    border:
      "1px solid #BBF7D0",
    color: "#16A34A",
    padding: "8px 13px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 12,
    flexShrink: 0,
  },

  activePulse: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#16A34A",
    display: "inline-block",
  },

  // ACTIONS
  actions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },

  saveBtn: {
    minHeight: 48,
    padding: "0 22px",
    borderRadius: 14,
    border: "none",
    background: "#16A34A",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "inherit",
    transition:
      "background 0.15s",
    flexWrap: "wrap",
    justifyContent:
      "center",
  },

  logoutBtn: {
    minHeight: 48,
    padding: "0 20px",
    borderRadius: 14,
    border:
      "1.5px solid #E5E7EB",
    background: "#fff",
    color: "#374151",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "inherit",
    transition:
      "border-color 0.15s",
    flexWrap: "wrap",
    justifyContent:
      "center",
  },
};