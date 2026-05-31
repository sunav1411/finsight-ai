"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Download, TrendingUp, Receipt, PieChart } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { subscribeToExpenses } from "@/lib/firestore";
import MonthlySpendingChart from "@/components/charts/MonthlySpendingChart";
import CategoryPieChart from "@/components/charts/CategoryPieChart";

// ─── CATEGORY COLORS ─────────────────────────────────────────────────────────

const CAT_COLORS = {
  Food:          { bg: "#DCFCE7", color: "#16A34A" },
  Bills:         { bg: "#FEE2E2", color: "#DC2626" },
  Shopping:      { bg: "#FEF3C7", color: "#D97706" },
  Transport:     { bg: "#DBEAFE", color: "#2563EB" },
  Entertainment: { bg: "#E0E7FF", color: "#4338CA" },
  Health:        { bg: "#FCE7F3", color: "#BE185D" },
  Income:        { bg: "#D1FAE5", color: "#059669" },
  Other:         { bg: "#FFFFFF", color: "#4B5563" },
};

function catChip(cat) {
  const c = CAT_COLORS[cat] ?? CAT_COLORS.Other;
  return { background: c.bg, color: c.color };
}

export default function ReportsPage() {
  const [expenses, setExpenses] = useState([]);

  // ── LOAD REALTIME EXPENSES ────────────────────────────────────────────────
  useEffect(() => {
    let unsubExpenses = () => {};
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      unsubExpenses = subscribeToExpenses(user.uid, setExpenses);
    });
    return () => { unsubAuth(); unsubExpenses(); };
  }, []);

  // ── COMPUTED ──────────────────────────────────────────────────────────────
  const totalSpent        = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalTransactions = expenses.length;
  const averageExpense    = totalTransactions > 0 ? totalSpent / totalTransactions : 0;

  const categoryAnalytics = useMemo(() => {
    const analytics = {};
    expenses.forEach((expense) => {
      if (!analytics[expense.category]) {
        analytics[expense.category] = { transactions: 0, total: 0 };
      }
      analytics[expense.category].transactions += 1;
      analytics[expense.category].total += Number(expense.amount);
    });
    return Object.entries(analytics).map(([category, data]) => ({ category, ...data }));
  }, [expenses]);

  const topCategory = [...categoryAnalytics].sort((a, b) => b.total - a.total)[0];

  // ── EXPORT CSV ────────────────────────────────────────────────────────────
  function exportCSV() {
    if (expenses.length === 0) return;
    const headers = ["Title", "Amount", "Category", "Date"];
    const rows    = expenses.map((e) => [e.title, e.amount, e.category, e.date]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "finsight-ai-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const kpis = [
    { title: "Total Spending",   value: `₹${totalSpent.toLocaleString("en-IN")}`, icon: TrendingUp, bg: "#F0FDF4", color: "#16A34A" },
    { title: "Transactions",     value: totalTransactions,                          icon: Receipt,    bg: "#EFF6FF", color: "#2563EB" },
    { title: "Average Expense",  value: `₹${Math.round(averageExpense).toLocaleString("en-IN")}`, icon: PieChart, bg: "#FEF3C7", color: "#D97706" },
    { title: "Top Category",     value: topCategory?.category || "N/A",             icon: FileText,   bg: "#F3E8FF", color: "#9333EA" },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .rp-root {
          min-height: 100vh;
          background: #F5F7FB;
          padding: 24px 20px;
          font-family: 'DM Sans', 'Inter', 'Segoe UI', sans-serif;
          box-sizing: border-box;
        }
        .rp-container { max-width: 1350px; margin: 0 auto; }

        /* HERO */
        .rp-hero { margin-bottom: 24px; }
        .rp-brand-row { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
        .rp-logo { width: 46px; height: 46px; border-radius: 13px; object-fit: contain; border: 1px solid #E5E7EB; }
        .rp-brand-name { margin: 0; font-size: 10px; font-weight: 800; color: #16A34A; letter-spacing: 0.14em; text-transform: uppercase; }
        .rp-brand-sub  { font-size: 12px; color: #6B7280; display: block; margin-top: 2px; }
        .rp-label { font-size: 10px; font-weight: 700; color: #16A34A; text-transform: uppercase; letter-spacing: 0.13em; display: block; margin-bottom: 8px; }
        .rp-title { margin: 0; font-size: clamp(26px, 5vw, 46px); font-weight: 800; color: #111827; letter-spacing: -0.04em; line-height: 1.05; }
        .rp-sub   { margin-top: 12px; font-size: clamp(13px, 1.8vw, 15px); color: #6B7280; line-height: 1.75; max-width: 640px; }

        /* KPI GRID */
        .rp-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 22px;
        }
        .rp-kpi-card {
          background: #fff; border: 1px solid #E5E7EB;
          border-radius: 22px; padding: 22px 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .rp-kpi-icon {
          width: 46px; height: 46px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .rp-kpi-label { margin: 0 0 6px; font-size: 12px; color: #9CA3AF; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
        .rp-kpi-value { margin: 0; font-size: clamp(22px, 3vw, 30px); font-weight: 800; color: #111827; letter-spacing: -0.04em; line-height: 1; word-break: break-word; }

        /* EXPORT BAR */
        .rp-export-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .rp-section-title { margin: 0; font-size: 18px; font-weight: 800; color: #111827; letter-spacing: -0.02em; }
        .rp-export-btn {
          border: none; background: #16A34A; color: #fff;
          height: 44px; padding: 0 20px; border-radius: 13px;
          display: flex; align-items: center; gap: 8px;
          font-size: 14px; font-weight: 700; cursor: pointer;
          font-family: inherit; transition: background 0.15s;
        }
        .rp-export-btn:hover { background: #15803D; }

        /* CHARTS */
        .rp-charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
          margin-bottom: 22px;
        }
        .rp-chart-card {
          background: #fff; border: 1px solid #E5E7EB;
          border-radius: 22px; overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          padding: 12px;
        }

        /* CATEGORY TABLE */
        .rp-table-card {
          background: #fff; border: 1px solid #E5E7EB;
          border-radius: 24px; padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          overflow-x: auto;
        }
        .rp-table { width: 100%; border-collapse: collapse; min-width: 360px; }
        .rp-th {
          text-align: left; padding: 12px 16px;
          font-size: 11px; font-weight: 700; color: #9CA3AF;
          text-transform: uppercase; letter-spacing: 0.07em;
          border-bottom: 1px solid #FFFFFF;
        }
        .rp-td { padding: 14px 16px; font-size: 14px; color: #111827; font-weight: 600; border-bottom: 1px solid #F9FAFB; }
        .rp-td:last-child { border-bottom: none; }
        .rp-cat-badge { display: inline-block; border-radius: 8px; padding: 4px 10px; font-size: 12px; font-weight: 700; }
        .rp-empty { color: #9CA3AF; font-size: 14px; padding: 24px 0; text-align: center; }

        /* TABLET */
        @media (max-width: 1024px) {
          .rp-kpi-grid { grid-template-columns: repeat(2, 1fr); }
          .rp-charts-grid { grid-template-columns: 1fr; }
        }

        /* MOBILE */
        @media (max-width: 640px) {
          .rp-root { padding: 14px 12px; }
          .rp-kpi-grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; }
          .rp-kpi-card { padding: 16px 14px; border-radius: 18px; }
          .rp-kpi-icon { width: 38px; height: 38px; border-radius: 11px; margin-bottom: 12px; }
          .rp-table-card { padding: 16px 14px; border-radius: 18px; }
          .rp-export-bar { flex-direction: column; align-items: flex-start; }
          .rp-export-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <main className="rp-root">
        <div className="rp-container">

          {/* ── HERO ──────────────────────────────────────────────────── */}
          <div className="rp-hero">
            <div className="rp-brand-row">
              <img src="/logo/finsight-logo.svg" alt="FinSight AI" className="rp-logo" />
              <div>
                <p className="rp-brand-name">FinSight AI</p>
                <span className="rp-brand-sub">Smart Financial Reporting</span>
              </div>
            </div>
            <span className="rp-label">Financial Reports</span>
            <h1 className="rp-title">Realtime financial reporting center</h1>
            <p className="rp-sub">
              Analyze spending behavior, export reports, monitor categories, and
              generate realtime financial insights from your actual expense activity.
            </p>
          </div>

          {/* ── KPI CARDS ─────────────────────────────────────────────── */}
          <div className="rp-kpi-grid">
            {kpis.map(({ title, value, icon: Icon, bg, color }) => (
              <div key={title} className="rp-kpi-card">
                <div className="rp-kpi-icon" style={{ background: bg }}>
                  <Icon size={22} color={color} />
                </div>
                <p className="rp-kpi-label">{title}</p>
                <h2 className="rp-kpi-value" style={{ color }}>{value}</h2>
              </div>
            ))}
          </div>

          {/* ── EXPORT BAR ────────────────────────────────────────────── */}
          <div className="rp-export-bar">
            <div>
              <h2 className="rp-section-title">Spending Reports</h2>
              <p style={{ margin:"4px 0 0", fontSize:13, color:"#9CA3AF" }}>
                {totalTransactions} transaction{totalTransactions !== 1 ? "s" : ""} recorded
              </p>
            </div>
            <button className="rp-export-btn" onClick={exportCSV}>
              <Download size={16} />
              Export CSV
            </button>
          </div>

          {/* ── CHARTS ────────────────────────────────────────────────── */}
          <div className="rp-charts-grid">
            <div className="rp-chart-card">
              <MonthlySpendingChart expenses={expenses} />
            </div>
            <div className="rp-chart-card">
              <CategoryPieChart expenses={expenses} />
            </div>
          </div>

          {/* ── CATEGORY TABLE ────────────────────────────────────────── */}
          <div className="rp-table-card">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:"#111827", letterSpacing:"-0.02em" }}>
                  Category Analytics
                </h2>
                <p style={{ margin:"4px 0 0", fontSize:13, color:"#9CA3AF" }}>
                  Spending breakdown by category
                </p>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6, background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:10, padding:"6px 12px" }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:"#16A34A", display:"inline-block" }} />
                <span style={{ fontSize:12, fontWeight:700, color:"#16A34A" }}>Live data</span>
              </div>
            </div>

            {categoryAnalytics.length === 0 ? (
              <div className="rp-empty">
                <FileText size={28} color="#E5E7EB" style={{ marginBottom:8 }} />
                <p style={{ margin:0 }}>No expense data available yet.</p>
              </div>
            ) : (
              <table className="rp-table">
                <thead>
                  <tr>
                    <th className="rp-th">Category</th>
                    <th className="rp-th">Transactions</th>
                    <th className="rp-th">Total Amount</th>
                    <th className="rp-th">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {[...categoryAnalytics]
                    .sort((a, b) => b.total - a.total)
                    .map((item) => {
                      const chip    = catChip(item.category);
                      const share   = totalSpent > 0 ? ((item.total / totalSpent) * 100).toFixed(1) : "0.0";
                      const barW    = totalSpent > 0 ? (item.total / totalSpent) * 100 : 0;
                      return (
                        <tr key={item.category}>
                          <td className="rp-td">
                            <span className="rp-cat-badge" style={chip}>
                              {item.category}
                            </span>
                          </td>
                          <td className="rp-td" style={{ color:"#6B7280" }}>
                            {item.transactions}
                          </td>
                          <td className="rp-td">
                            ₹{item.total.toLocaleString("en-IN")}
                          </td>
                          <td className="rp-td" style={{ minWidth:120 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <div style={{ flex:1, height:6, borderRadius:3, background:"#FFFFFF", overflow:"hidden" }}>
                                <div style={{ width:`${barW}%`, height:"100%", borderRadius:3, background: chip.color }} />
                              </div>
                              <span style={{ fontSize:12, fontWeight:700, color:"#6B7280", minWidth:36 }}>{share}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </main>
    </>
  );
}