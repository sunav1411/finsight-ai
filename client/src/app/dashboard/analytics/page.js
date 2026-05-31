"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import {
  Wallet,
  TrendingUp,
  PieChart,
  Activity,
  ArrowUpRight,
} from "lucide-react";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/lib/firebase";

import {
  subscribeToExpenses,
} from "@/lib/firestore";

import CategoryPieChart from "@/components/charts/CategoryPieChart";
import MonthlySpendingChart from "@/components/charts/MonthlySpendingChart";

export default function AnalyticsPage() {

  const [expenses, setExpenses] =
    useState([]);

  useEffect(() => {

    const unsubscribeAuth =
      onAuthStateChanged(
        auth,
        (user) => {

          if (!user) return;

          const unsubscribeExpenses =
            subscribeToExpenses(
              user.uid,
              (data) => {

                setExpenses(data);
              }
            );

          return () =>
            unsubscribeExpenses();
        }
      );

    return () =>
      unsubscribeAuth();

  }, []);

  const totalSpent =
    useMemo(
      () =>
        expenses.reduce(
          (sum, e) =>
            sum +
            Number(
              e.amount || 0
            ),
          0
        ),
      [expenses]
    );

  const categoryData =
    useMemo(() => {

      const cats = {};

      expenses.forEach((e) => {

        const c =
          e.category ||
          "Other";

        cats[c] =
          (cats[c] || 0) +
          Number(
            e.amount || 0
          );
      });

      return Object.entries(cats)
        .map(
          ([name, value]) => ({
            name,
            value,
          })
        )
        .sort(
          (a, b) =>
            b.value - a.value
        );

    }, [expenses]);

  const topCategory =
    categoryData[0]?.name ||
    "No Data";

  const averageExpense =
    expenses.length > 0
      ? Math.round(
          totalSpent /
            expenses.length
        )
      : 0;

  const currentMonth =
    new Date().toLocaleString(
      "default",
      {
        month: "long",
      }
    );

  const stats = [
    {
      label:
        "Total Spending",
      value:
        `₹${totalSpent.toLocaleString("en-IN")}`,
      icon: Wallet,
      color: "#16A34A",
      bg: "#F0FDF4",
    },

    {
      label:
        "Transactions",
      value:
        expenses.length,
      icon: Activity,
      color: "#2563EB",
      bg: "#EFF6FF",
    },

    {
      label:
        "Top Category",
      value:
        topCategory,
      icon: PieChart,
      color: "#D97706",
      bg: "#FFFBEB",
    },

    {
      label:
        "Avg Transaction",
      value:
        `₹${averageExpense.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      color: "#7C3AED",
      bg: "#F5F3FF",
    },
  ];

  return (

    <main style={s.page}>

      <div style={s.container}>

        {/* HEADER */}
        <div style={s.header}>

          <div style={s.headerLeft}>

            <div style={s.headerIcon}>

              <Image
                src="/logo/finsight-logo.svg"
                alt="FinSight AI"
                width={36}
                height={36}
                style={{
                  borderRadius: 10,
                }}
              />

            </div>

            <div>

              <p style={s.headerLabel}>
                FinSight AI Analytics
              </p>

              <h1 style={s.headerTitle}>
                Spending Overview
              </h1>

            </div>

          </div>

          <div style={s.liveBadge}>

            <span style={s.liveDot} />

            Live · {currentMonth}

          </div>

        </div>

        {/* STATS */}
        <div style={s.statsGrid}>

          {stats.map(
            ({
              label,
              value,
              icon: Icon,
              color,
              bg,
            }) => (

              <div
                key={label}
                style={s.statCard}
              >

                <div
                  style={{
                    ...s.statIcon,
                    background: bg,
                  }}
                >

                  <Icon
                    size={18}
                    color={color}
                  />

                </div>

                <p style={s.statLabel}>
                  {label}
                </p>

                <h2
                  style={{
                    ...s.statValue,
                    color,
                  }}
                >
                  {value}
                </h2>

              </div>
            )
          )}

        </div>

        {/* INSIGHTS */}
        <div style={s.insightsRow}>

          <div
            style={{
              ...s.insightCard,
              borderTop:
                "3px solid #16A34A",
            }}
          >

            <span
              style={{
                ...s.insightTag,
                color: "#16A34A",
                background:
                  "#F0FDF4",
              }}
            >
              Spending Insight
            </span>

            <h3 style={s.insightTitle}>
              {topCategory} is your
              highest spending
              category this month.
            </h3>

            <p style={s.insightDesc}>
              Most of your expenses
              are concentrated around{" "}
              {topCategory}.
            </p>

            <div style={s.insightFooter}>

              <ArrowUpRight
                size={14}
                color="#16A34A"
              />

              <span
                style={{
                  color:
                    "#16A34A",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                View breakdown
              </span>

            </div>

          </div>

          <div
            style={{
              ...s.insightCard,
              borderTop:
                "3px solid #2563EB",
            }}
          >

            <span
              style={{
                ...s.insightTag,
                color: "#2563EB",
                background:
                  "#EFF6FF",
              }}
            >
              Financial Pulse
            </span>

            <h3 style={s.insightTitle}>
              {expenses.length} records
              analyzed for{" "}
              {currentMonth}.
            </h3>

            <p style={s.insightDesc}>
              Realtime financial
              tracking is active.
            </p>

            <div style={s.insightFooter}>

              <Activity
                size={14}
                color="#2563EB"
              />

              <span
                style={{
                  color:
                    "#2563EB",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Tracking active
              </span>

            </div>

          </div>

        </div>

        {/* CHARTS */}
        <div style={s.chartsGrid}>

          <div style={s.chartCard}>
            <CategoryPieChart
              expenses={expenses}
            />
          </div>

          <div style={s.chartCard}>
            <MonthlySpendingChart
              expenses={expenses}
            />
          </div>

        </div>

      </div>

    </main>
  );
}

const s = {

  page: {
    minHeight: "100vh",
    background: "#F5F7FB",
    padding: "20px 16px",
    fontFamily:
      "'DM Sans', 'Inter', sans-serif",
    overflowX: "hidden",
  },

  container: {
    maxWidth: 1300,
    margin: "0 auto",
    width: "100%",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    background: "#111827",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
  },

  headerLabel: {
    margin: 0,
    fontSize: 11,
    fontWeight: 700,
    color: "#16A34A",
    letterSpacing:
      "0.12em",
    textTransform:
      "uppercase",
  },

  headerTitle: {
    margin: "3px 0 0",
    fontSize:
      "clamp(22px, 5vw, 32px)",
    fontWeight: 800,
    color: "#111827",
    letterSpacing:
      "-0.03em",
  },

  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "#fff",
    border:
      "1px solid #E5E7EB",
    borderRadius: 20,
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 700,
    color: "#374151",
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#16A34A",
    display: "inline-block",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
    gap: 14,
    marginBottom: 20,
  },

  statCard: {
    background: "#fff",
    border:
      "1px solid #E5E7EB",
    borderRadius: 20,
    padding:
      "20px 20px 18px",
  },

  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
    marginBottom: 14,
  },

  statLabel: {
    margin: "0 0 6px",
    fontSize: 12,
    fontWeight: 600,
    color: "#9CA3AF",
    textTransform:
      "uppercase",
  },

  statValue: {
    margin: 0,
    fontSize: 26,
    fontWeight: 800,
  },

  insightsRow: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
    gap: 16,
    marginBottom: 20,
  },

  insightCard: {
    background: "#fff",
    border:
      "1px solid #E5E7EB",
    borderRadius: 20,
    padding:
      "22px 22px 18px",
  },

  insightTag: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing:
      "0.08em",
    textTransform:
      "uppercase",
    borderRadius: 8,
    padding: "4px 10px",
    marginBottom: 14,
  },

  insightTitle: {
    margin: "0 0 10px",
    fontSize: 17,
    fontWeight: 800,
    color: "#111827",
    lineHeight: 1.35,
  },

  insightDesc: {
    margin: "0 0 16px",
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 1.7,
  },

  insightFooter: {
    display: "flex",
    alignItems: "center",
    gap: 5,
  },

  chartsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
    gap: 18,
    width: "100%",
  },

  chartCard: {
    background: "#fff",
    border:
      "1px solid #E5E7EB",
    borderRadius: 22,
    overflow: "hidden",
    width: "100%",
    minWidth: 0,
  },
};