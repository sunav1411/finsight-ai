"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
  CalendarDays, ChevronLeft, ChevronRight, BellRing,
  Wallet, Plus, Trash2, X, RefreshCw, Sparkles,
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { subscribeToExpenses } from "@/lib/firestore";
import {
  collection, addDoc, deleteDoc, doc,
  onSnapshot, query, where, serverTimestamp,
} from "firebase/firestore";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CATEGORIES = {
  Bills:         { bg: "#FEE2E2", color: "#DC2626", dark: "#991B1B" },
  Food:          { bg: "#DCFCE7", color: "#16A34A", dark: "#14532D" },
  Shopping:      { bg: "#FEF3C7", color: "#D97706", dark: "#92400E" },
  Transport:     { bg: "#DBEAFE", color: "#2563EB", dark: "#1E3A8A" },
  Entertainment: { bg: "#E0E7FF", color: "#4338CA", dark: "#312E81" },
  Income:        { bg: "#D1FAE5", color: "#059669", dark: "#064E3B" },
  Health:        { bg: "#FCE7F3", color: "#BE185D", dark: "#831843" },
  Other:         { bg: "#FFFFFF", color: "#4B5563", dark: "#1F2937" },
};

const EMPTY_FORM = {
  title: "", amount: "", category: "Bills",
  isRecurring: false, recurringDay: "", date: "",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function catStyle(cat) { return CATEGORIES[cat] ?? CATEGORIES.Other; }
function fmt(amount)   { return Number(amount).toLocaleString("en-IN"); }

function daysUntil(event) {
  const today = new Date(); today.setHours(0,0,0,0);
  if (event.isRecurring) {
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), event.recurringDay);
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, event.recurringDay);
    return Math.ceil(((thisMonth >= today ? thisMonth : nextMonth) - today) / 86400000);
  }
  const d = new Date(event.date); d.setHours(0,0,0,0);
  return Math.ceil((d - today) / 86400000);
}

function dueDateLabel(event) {
  if (event.isRecurring) return `Monthly on day ${event.recurringDay}`;
  return new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function notifStyle(level) {
  if (level === "urgent") return { background: "#FEF2F2", borderColor: "#FECACA" };
  if (level === "warn")   return { background: "#FFFBEB", borderColor: "#FDE68A" };
  return { background: "#EFF6FF", borderColor: "#BFDBFE" };
}

function notifDotColor(level) {
  return level === "urgent" ? "#EF4444" : level === "warn" ? "#F59E0B" : "#3B82F6";
}

// ─── RESPONSIVE HOOK ──────────────────────────────────────────────────────────

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function CalendarPage() {
  const [userId, setUserId]           = useState(null);
  const [expenses, setExpenses]       = useState([]);
  const [events, setEvents]           = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [saving, setSaving]           = useState(false);
  const [showPanel, setShowPanel]     = useState("add");

  const width   = useWindowWidth();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1100;

  // ── AUTH + SUBSCRIPTIONS ──────────────────────────────────────────────────
  useEffect(() => {
    let unsubExpenses = () => {};
    let unsubEvents   = () => {};
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      setUserId(user.uid);
      unsubExpenses = subscribeToExpenses(user.uid, setExpenses);
      const q = query(collection(db, "financialEvents"), where("userId", "==", user.uid));
      unsubEvents = onSnapshot(q, (snap) => {
        setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      });
    });
    return () => { unsubAuth(); unsubExpenses(); unsubEvents(); };
  }, []);

  // ── CALENDAR MATH ─────────────────────────────────────────────────────────
  const month       = currentDate.getMonth();
  const year        = currentDate.getFullYear();
  const monthName   = currentDate.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay();
  const today       = new Date();

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [firstDay, daysInMonth]);

  // ── DAY LOOKUPS ───────────────────────────────────────────────────────────
  function getExpensesForDay(day) {
    return expenses.filter((e) => {
      let d;
      if (e.date) d = new Date(e.date);
      else if (e.createdAt?.toDate) d = e.createdAt.toDate();
      else return false;
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  }

  function getEventsForDay(day) {
    return events.filter((e) => {
      if (e.isRecurring) return e.recurringDay === day;
      const d = new Date(e.date);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  }

  function getAllForDay(day) {
    return [...getEventsForDay(day), ...getExpensesForDay(day)];
  }

  // ── UPCOMING + NOTIFICATIONS ──────────────────────────────────────────────
  const upcomingBills = useMemo(() => {
    return events
      .filter((e) => daysUntil(e) >= 0)
      .sort((a, b) => daysUntil(a) - daysUntil(b))
      .slice(0, 6);
  }, [events, currentDate]);

  const notifications = useMemo(() => {
    const notifs = [];
    upcomingBills.forEach((e) => {
      const d = daysUntil(e);
      if (d === 0)      notifs.push({ level: "urgent", msg: `${e.title} is due TODAY — ₹${fmt(e.amount)}` });
      else if (d === 1) notifs.push({ level: "urgent", msg: `${e.title} due TOMORROW — ₹${fmt(e.amount)}` });
      else if (d <= 3)  notifs.push({ level: "warn",   msg: `${e.title} due in ${d} days — ₹${fmt(e.amount)}` });
      else if (d <= 7)  notifs.push({ level: "info",   msg: `${e.title} coming up in ${d} days` });
    });
    return notifs.slice(0, 6);
  }, [upcomingBills]);

  // ── CRUD ──────────────────────────────────────────────────────────────────
  async function addEvent() {
    if (!form.title.trim()) return;
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) return;
    if (form.isRecurring && (!form.recurringDay || form.recurringDay < 1 || form.recurringDay > 31)) return;
    if (!form.isRecurring && !form.date) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "financialEvents"), {
        userId,
        title:        form.title.trim(),
        amount:       Number(form.amount),
        category:     form.category,
        isRecurring:  form.isRecurring,
        recurringDay: form.isRecurring ? Number(form.recurringDay) : null,
        date:         form.isRecurring ? null : form.date,
        createdAt:    serverTimestamp(),
      });
      setForm(EMPTY_FORM);
    } finally {
      setSaving(false);
    }
  }

  async function removeEvent(id) {
    await deleteDoc(doc(db, "financialEvents", id));
  }

  function prevMonth() { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDay(null); }
  function nextMonth() { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDay(null); }

  const todayStr      = today.toISOString().split("T")[0];
  const selectedItems = selectedDay ? getAllForDay(selectedDay) : [];

  // ── RESPONSIVE VALUES ─────────────────────────────────────────────────────
  const cellMinHeight  = isMobile ? 60  : 90;
  const cellPillMax    = isMobile ? 1   : 2;
  const pillFontSize   = isMobile ? 9   : 10;
  const dayFontSize    = isMobile ? 11  : 13;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── INJECTED RESPONSIVE STYLES ───────────────────────────────────── */}
      <style>{`
        .cal-root {
          min-height: 100vh;
          background: #F5F7FB;
          padding: 20px 16px;
          font-family: 'DM Sans', 'Inter', 'Segoe UI', sans-serif;
          box-sizing: border-box;
        }
        .cal-container { max-width: 1440px; margin: 0 auto; }

        /* ── HERO ── */
        .cal-hero { margin-bottom: 22px; }
        .cal-brand-row {
          display: flex; align-items: center;
          gap: 12px; margin-bottom: 18px;
        }
        .cal-logo {
          width: 46px; height: 46px;
          border-radius: 13px; object-fit: contain;
          border: 1px solid #E5E7EB;
        }
        .cal-brand-name {
          font-size: 10px; font-weight: 800;
          color: #16A34A; letter-spacing: 0.14em;
          text-transform: uppercase; margin: 0;
        }
        .cal-brand-sub { font-size: 12px; color: #6B7280; margin: 2px 0 0; }
        .cal-label {
          font-size: 10px; font-weight: 700; color: #16A34A;
          letter-spacing: 0.13em; text-transform: uppercase;
          display: block; margin-bottom: 8px;
        }
        .cal-title {
          font-size: clamp(26px, 5vw, 48px);
          font-weight: 800; color: #111827;
          letter-spacing: -0.04em; line-height: 1.05; margin: 0;
        }
        .cal-sub {
          margin-top: 10px; font-size: clamp(13px, 1.8vw, 15px);
          color: #6B7280; line-height: 1.7; max-width: 600px;
        }
        .cal-quick-row {
          display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px;
        }
        .cal-quick-chip {
          background: #fff; border: 1px solid #E5E7EB;
          border-radius: 12px; padding: 8px 13px;
          font-size: 12px; font-weight: 600; color: #374151;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }

        /* ── MAIN GRID ── */
        .cal-main-grid {
          display: grid;
          grid-template-columns: 1.65fr 0.95fr;
          gap: 20px;
          align-items: start;
        }

        /* ── CALENDAR CARD ── */
        .cal-card {
          background: #fff; border: 1px solid #E5E7EB;
          border-radius: 24px; padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .cal-card-header {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 20px; gap: 10px;
          flex-wrap: wrap;
        }
        .cal-icon-box {
          width: 48px; height: 48px; border-radius: 14px;
          background: #F0FDF4; display: flex;
          align-items: center; justify-content: center; flex-shrink: 0;
        }
        .cal-month-title {
          margin: 0; font-size: clamp(18px, 2.5vw, 24px);
          font-weight: 800; color: #111827; letter-spacing: -0.02em;
        }
        .cal-month-sub { margin: 3px 0 0; font-size: 12px; color: #6B7280; }
        .cal-nav-btn {
          width: 38px; height: 38px; border-radius: 11px;
          border: 1px solid #E5E7EB; background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #374151;
        }

        /* ── CALENDAR SCROLL WRAPPER ── */
        .cal-scroll-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .cal-week-row {
          display: grid; grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 6px; margin-bottom: 6px;
        }
        .cal-day-grid {
          display: grid; grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 6px;
        }
        .cal-week-label {
          text-align: center; font-size: 11px;
          font-weight: 700; color: #9CA3AF; padding-bottom: 4px;
        }

        /* ── SIDE PANEL ── */
        .cal-side-col { display: flex; flex-direction: column; gap: 14px; }
        .cal-tab-row {
          display: flex; gap: 5px; background: #FFFFFF;
          border-radius: 14px; padding: 4px;
        }
        .cal-tab-btn {
          flex: 1; min-height: 36px; border-radius: 10px;
          border: none; background: none; cursor: pointer;
          font-size: 11px; font-weight: 600; color: #6B7280;
          display: flex; align-items: center; justify-content: center;
          gap: 4px; position: relative; padding: 0 4px;
          white-space: nowrap;
        }
        .cal-tab-btn.active {
          background: #fff; color: #111827;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
        .cal-panel {
          background: #fff; border: 1px solid #E5E7EB;
          border-radius: 22px; padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        /* ── LEGEND ── */
        .cal-legend {
          display: flex; flex-wrap: wrap; gap: 12px;
          padding: 10px 14px; background: #fff;
          border: 1px solid #E5E7EB; border-radius: 14px;
          justify-content: center;
        }

        /* ── TABLET: stack panels ── */
        @media (max-width: 1099px) {
          .cal-main-grid {
            grid-template-columns: 1fr;
          }
          .cal-side-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            align-items: start;
          }
          .cal-tab-row { grid-column: 1 / -1; }
          .cal-panel   { grid-column: 1 / -1; }
          .cal-legend  { grid-column: 1 / -1; }
        }

        /* ── MOBILE ── */
        @media (max-width: 767px) {
          .cal-root { padding: 14px 12px; }
          .cal-side-col {
            display: flex !important;
            flex-direction: column !important;
          }
          .cal-card { padding: 14px 12px; border-radius: 18px; }
          .cal-panel { padding: 16px 14px; border-radius: 18px; }
          .cal-week-row { gap: 3px; }
          .cal-day-grid { gap: 3px; }
          .cal-tab-btn { font-size: 10px; gap: 3px; }
        }
      `}</style>

      <main className="cal-root">
        <div className="cal-container">

          {/* ── HERO ──────────────────────────────────────────────────── */}
          <div className="cal-hero">
            <div className="cal-brand-row">
              <img
                src="/logo/finsight-logo.svg"
                alt="FinSight AI"
                className="cal-logo"
              />
              <div>
                <p className="cal-brand-name">FinSight AI</p>
                <p className="cal-brand-sub">Smart Financial Planning System</p>
              </div>
            </div>
            <span className="cal-label">Financial Planner</span>
            <h1 className="cal-title">Financial planning<br />workspace</h1>
            <p className="cal-sub">
              Schedule bills, manage recurring payments, track income, monitor
              subscriptions, and organize your entire financial life through a
              realtime intelligent calendar.
            </p>
            <div className="cal-quick-row">
              <span className="cal-quick-chip">📅 Realtime Events</span>
              <span className="cal-quick-chip">🔔 Smart Reminders</span>
              <span className="cal-quick-chip">💸 Financial Planning</span>
            </div>
          </div>

          {/* ── MAIN GRID ─────────────────────────────────────────────── */}
          <div className="cal-main-grid">

            {/* LEFT — CALENDAR ──────────────────────────────────────── */}
            <div className="cal-card">

              {/* Header */}
              <div className="cal-card-header">
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div className="cal-icon-box">
                    <CalendarDays size={22} color="#16A34A" />
                  </div>
                  <div>
                    <h2 className="cal-month-title">{monthName} {year}</h2>
                    <p className="cal-month-sub">Financial calendar</p>
                  </div>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <button className="cal-nav-btn" onClick={prevMonth}>
                    <ChevronLeft size={16} />
                  </button>
                  <button className="cal-nav-btn" onClick={nextMonth}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Scrollable grid */}
              <div className="cal-scroll-wrap">
                <div style={{ minWidth: isMobile ? 320 : "auto" }}>
                  {/* Weekdays */}
                  <div className="cal-week-row">
                    {WEEKDAYS.map((d) => (
                      <div key={d} className="cal-week-label">{isMobile ? d[0] : d}</div>
                    ))}
                  </div>
                  {/* Days */}
                  <div className="cal-day-grid">
                    {calendarDays.map((day, i) => {
                      if (!day) return <div key={i} />;
                      const isToday    = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
                      const isSelected = selectedDay === day;
                      const dayItems   = getAllForDay(day);
                      const shown      = dayItems.slice(0, cellPillMax);
                      const overflow   = dayItems.length - shown.length;

                      return (
                        <div
                          key={i}
                          onClick={() => setSelectedDay(isSelected ? null : day)}
                          style={{
                            border:        isSelected ? "2px solid #3B82F6" : isToday ? "2px solid #16A34A" : "1px solid #E5E7EB",
                            borderRadius:  isMobile ? 10 : 14,
                            background:    isSelected ? "#EFF6FF" : isToday ? "#F0FDF4" : "#fff",
                            padding:       isMobile ? "6px 4px" : "8px 6px",
                            minHeight:     cellMinHeight,
                            display:       "flex",
                            flexDirection: "column",
                            gap:           3,
                            cursor:        "pointer",
                          }}
                        >
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <span style={{ fontSize: dayFontSize, fontWeight:700, color: isToday ? "#16A34A" : "#111827" }}>
                              {day}
                            </span>
                            {isToday && <span style={{ width:6, height:6, borderRadius:"50%", background:"#16A34A", display:"inline-block" }} />}
                          </div>
                          {shown.map((item, idx) => {
                            const cs   = catStyle(item.category ?? "Other");
                            const name = item.title ?? item.category;
                            return (
                              <div
                                key={idx}
                                style={{
                                  borderRadius:     5,
                                  padding:          isMobile ? "2px 4px" : "3px 6px",
                                  fontSize:         pillFontSize,
                                  fontWeight:       700,
                                  whiteSpace:       "nowrap",
                                  overflow:         "hidden",
                                  textOverflow:     "ellipsis",
                                  background:       cs.bg,
                                  color:            cs.color,
                                  border:           item.isRecurring ? `1px dashed ${cs.color}44` : "none",
                                }}
                                title={`${name} — ₹${fmt(item.amount)}`}
                              >
                                {isMobile ? (name.length > 5 ? name.slice(0,4)+"…" : name) : (name.length > 9 ? name.slice(0,8)+"…" : name)}
                              </div>
                            );
                          })}
                          {overflow > 0 && (
                            <div style={{ fontSize:9, fontWeight:700, color:"#9CA3AF", background:"#FFFFFF", borderRadius:4, padding:"1px 4px", alignSelf:"flex-start" }}>
                              +{overflow}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Selected day detail */}
              {selectedDay && selectedItems.length > 0 && (
                <div style={{ marginTop:16, border:"1px solid #E5E7EB", borderRadius:16, padding:"14px 16px", background:"#FAFAFA" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                    <span style={{ fontWeight:700, fontSize:14, color:"#111827" }}>
                      {monthName} {selectedDay} · {selectedItems.length} event{selectedItems.length > 1 ? "s" : ""}
                    </span>
                    <button
                      onClick={() => setSelectedDay(null)}
                      style={{ background:"none", border:"1px solid #E5E7EB", borderRadius:7, width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#6B7280" }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {selectedItems.map((item, idx) => {
                      const cs = catStyle(item.category ?? "Other");
                      return (
                        <div key={idx} style={{ borderRadius:12, padding:"10px 13px", background:cs.bg, flex:"1 1 160px" }}>
                          <div style={{ fontWeight:700, fontSize:13, color:cs.dark }}>{item.title ?? item.category}</div>
                          <div style={{ fontSize:12, color:cs.color, marginTop:2 }}>₹{fmt(item.amount)} · {item.category}</div>
                          {item.id && events.find(e => e.id === item.id) && (
                            <button onClick={() => removeEvent(item.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", padding:"2px", display:"flex", marginTop:6 }}>
                              <Trash2 size={11} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT — SIDE PANEL ────────────────────────────────── */}
            <div className="cal-side-col">

              {/* Tabs */}
              <div className="cal-tab-row">
                {[
                  { key:"add",    icon:<Plus size={13} />,     label:"Add" },
                  { key:"bills",  icon:<Wallet size={13} />,   label:"Bills" },
                  { key:"notifs", icon:<BellRing size={13} />, label:`Alerts${notifications.length > 0 ? ` (${notifications.length})` : ""}` },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    className={`cal-tab-btn${showPanel === tab.key ? " active" : ""}`}
                    onClick={() => setShowPanel(tab.key)}
                  >
                    {tab.icon}
                    {tab.label}
                    {tab.key === "notifs" && notifications.some(n => n.level === "urgent") && (
                      <span style={{ width:6, height:6, borderRadius:"50%", background:"#EF4444", position:"absolute", top:6, right:6 }} />
                    )}
                  </button>
                ))}
              </div>

              {/* ── ADD PANEL ──────────────────────────────────────── */}
              {showPanel === "add" && (
                <div className="cal-panel">
                  <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:18 }}>
                    <div style={{ width:42, height:42, borderRadius:13, background:"#F0FDF4", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Plus size={18} color="#16A34A" />
                    </div>
                    <div>
                      <h3 style={{ margin:0, fontSize:16, fontWeight:800, color:"#111827" }}>Add Event</h3>
                      <p style={{ margin:"2px 0 0", fontSize:12, color:"#6B7280" }}>Bills, income & reminders</p>
                    </div>
                  </div>

                  <label style={inlineLabel}>Event title</label>
                  <input style={inlineInput} placeholder="e.g. Room Rent, Netflix, Salary" value={form.title} onChange={(e) => setForm({...form, title:e.target.value})} />

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                    <div>
                      <label style={inlineLabel}>Amount (₹)</label>
                      <input style={{...inlineInput, marginBottom:0}} placeholder="0" type="number" value={form.amount} onChange={(e) => setForm({...form, amount:e.target.value})} />
                    </div>
                    <div>
                      <label style={inlineLabel}>Category</label>
                      <select style={{...inlineInput, marginBottom:0}} value={form.category} onChange={(e) => setForm({...form, category:e.target.value})}>
                        {Object.keys(CATEGORIES).map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <label style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, cursor:"pointer" }}>
                    <div
                      style={{ width:38, height:22, borderRadius:11, background:form.isRecurring?"#16A34A":"#CBD5E1", position:"relative", cursor:"pointer", flexShrink:0 }}
                      onClick={() => setForm({...form, isRecurring:!form.isRecurring, date:"", recurringDay:""})}
                    >
                      <div style={{ position:"absolute", top:3, left:form.isRecurring?19:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left 0.2s" }} />
                    </div>
                    <span style={{ fontSize:13, color:"#374151", fontWeight:600 }}>Recurring monthly</span>
                    <RefreshCw size={12} color={form.isRecurring?"#16A34A":"#9CA3AF"} />
                  </label>

                  {form.isRecurring ? (
                    <>
                      <label style={inlineLabel}>Day of month</label>
                      <input style={inlineInput} placeholder="e.g. 5" type="number" min="1" max="31" value={form.recurringDay} onChange={(e) => setForm({...form, recurringDay:e.target.value})} />
                    </>
                  ) : (
                    <>
                      <label style={inlineLabel}>Date</label>
                      <input style={inlineInput} type="date" value={form.date || todayStr} onChange={(e) => setForm({...form, date:e.target.value})} />
                    </>
                  )}

                  <button
                    style={{ width:"100%", minHeight:44, borderRadius:12, border:"none", background:"#16A34A", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit", opacity:saving?0.7:1 }}
                    onClick={addEvent} disabled={saving}
                  >
                    {saving ? "Saving…" : "Add Financial Event"}
                  </button>
                </div>
              )}

              {/* ── BILLS PANEL ────────────────────────────────────── */}
              {showPanel === "bills" && (
                <div className="cal-panel">
                  <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:18 }}>
                    <div style={{ width:42, height:42, borderRadius:13, background:"#F0FDF4", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Wallet size={18} color="#16A34A" />
                    </div>
                    <div>
                      <h3 style={{ margin:0, fontSize:16, fontWeight:800, color:"#111827" }}>Upcoming Bills</h3>
                      <p style={{ margin:"2px 0 0", fontSize:12, color:"#6B7280" }}>Scheduled payments</p>
                    </div>
                  </div>

                  {upcomingBills.filter(e => e.category !== "Income").length === 0 ? (
                    <div style={{ textAlign:"center", color:"#9CA3AF", fontSize:13, padding:"20px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                      <Sparkles size={24} color="#CBD5E1" />
                      <p style={{ margin:0 }}>No events yet. Add your first bill!</p>
                    </div>
                  ) : upcomingBills.filter(e => e.category !== "Income").map((e) => {
                    const d  = daysUntil(e);
                    const cs = catStyle(e.category);
                    return (
                      <div key={e.id} style={{ borderRadius:13, padding:"11px 13px", marginBottom:9, display:"flex", alignItems:"center", gap:10, border:"1px solid #E5E7EB", background:d===0?"#FEF2F2":d<=3?"#FFFBEB":"#F9FAFB", flexWrap:"wrap" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, flex:1, minWidth:0 }}>
                          <div style={{ width:7, height:7, borderRadius:"50%", background:cs.color, flexShrink:0 }} />
                          <div style={{ minWidth:0 }}>
                            <div style={{ fontWeight:700, fontSize:13, color:"#111827", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.title}</div>
                            <div style={{ fontSize:11, color:"#6B7280", marginTop:1 }}>{dueDateLabel(e)} · {d===0?"Today":d===1?"Tomorrow":`${d} days`}</div>
                          </div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:7, flexShrink:0 }}>
                          <span style={{ fontWeight:700, fontSize:13, color:"#DC2626" }}>₹{fmt(e.amount)}</span>
                          <button onClick={() => removeEvent(e.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#CBD5E1", display:"flex", padding:3, borderRadius:5 }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── NOTIFICATIONS PANEL ────────────────────────────── */}
              {showPanel === "notifs" && (
                <div className="cal-panel">
                  <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:18 }}>
                    <div style={{ width:42, height:42, borderRadius:13, background:"#F0FDF4", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <BellRing size={18} color="#16A34A" />
                    </div>
                    <div>
                      <h3 style={{ margin:0, fontSize:16, fontWeight:800, color:"#111827" }}>Notifications</h3>
                      <p style={{ margin:"2px 0 0", fontSize:12, color:"#6B7280" }}>Smart financial alerts</p>
                    </div>
                  </div>

                  {notifications.length === 0 ? (
                    <div style={{ textAlign:"center", color:"#9CA3AF", fontSize:13, padding:"20px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                      <BellRing size={24} color="#CBD5E1" />
                      <p style={{ margin:0 }}>All clear! No upcoming alerts.</p>
                    </div>
                  ) : notifications.map((n, i) => (
                    <div key={i} style={{ ...notifStyle(n.level), borderRadius:11, padding:"11px 13px", marginBottom:9, fontSize:13, fontWeight:600, color:"#111827", border:"1px solid transparent", display:"flex", alignItems:"center", gap:9 }}>
                      <span style={{ width:7, height:7, borderRadius:"50%", background:notifDotColor(n.level), flexShrink:0, display:"inline-block" }} />
                      <span>{n.msg}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Legend */}
              <div className="cal-legend">
                <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#6B7280", fontWeight:600 }}>
                  <span style={{ width:7, height:7, borderRadius:"50%", background:"#16A34A", display:"inline-block" }} /> Today
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#6B7280", fontWeight:600 }}>
                  <span style={{ width:7, height:7, borderRadius:"50%", background:"#3B82F6", display:"inline-block" }} /> Selected
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#6B7280", fontWeight:600 }}>
                  <span style={{ borderBottom:"2px dashed #9CA3AF", width:14, display:"inline-block" }} /> Recurring
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// ─── SHARED INLINE FORM STYLES ────────────────────────────────────────────────

const inlineLabel = {
  display: "block", fontSize: 10, fontWeight: 700,
  color: "#6B7280", letterSpacing: "0.07em",
  textTransform: "uppercase", marginBottom: 5,
};

const inlineInput = {
  width: "100%", height: 42, borderRadius: 11,
  border: "1.5px solid #E5E7EB", padding: "0 11px",
  marginBottom: 12, fontSize: 13, outline: "none",
  background: "#FAFAFA", color: "#111827",
  fontFamily: "inherit", boxSizing: "border-box",
};