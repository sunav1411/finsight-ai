"use client";

import {
  Sparkles,
  Wallet,
  TrendingUp,
  BrainCircuit,
  Database,
  ArrowRight,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import ImportModal from "@/components/ImportModal";

export default function FinancialWorkspace({
  expenses = [],
  monthlyBudget = 0,
  onAddExpense,
}) {

  const router =
    useRouter();

  const [
    showImportModal,
    setShowImportModal,
  ] = useState(false);

  // =========================
  // SAFE BUDGET NORMALIZATION
  // =========================

  const parsedBudget =
    Number(monthlyBudget) || 0;

  // =========================
  // TOTAL SPENT
  // =========================

  const totalSpent =
    expenses.reduce(
      (sum, expense) =>
        sum +
        Number(
          expense.amount || 0
        ),
      0
    );

  // =========================
  // CURRENT MONTH SPEND
  // =========================

  const currentMonth =
    new Date().getMonth();

  const currentYear =
    new Date().getFullYear();

  const monthlySpend =
    expenses.reduce(
      (sum, expense) => {

        if (!expense.date)
          return sum;

        const expenseDate =
          new Date(
            expense.date
          );

        const isCurrentMonth =
          expenseDate.getMonth() ===
            currentMonth &&
          expenseDate.getFullYear() ===
            currentYear;

        if (isCurrentMonth) {

          return (
            sum +
            Number(
              expense.amount || 0
            )
          );
        }

        return sum;

      },
      0
    );

  // =========================
  // CATEGORY ANALYTICS
  // =========================

  const categoryTotals =
    expenses.reduce(
      (acc, expense) => {

        const category =
          expense.category ||
          "Other";

        acc[category] =
          (acc[category] || 0) +
          Number(
            expense.amount || 0
          );

        return acc;

      },
      {}
    );

  const categoryCount =
    Object.keys(
      categoryTotals
    ).length;

  const topCategory =
    Object.entries(
      categoryTotals
    ).sort(
      (a, b) =>
        b[1] - a[1]
    )[0];

  // =========================
  // BUDGET STATUS
  // =========================

  const hasBudget =
    parsedBudget > 0;

  const remainingBudget =
    hasBudget
      ? Math.max(
          parsedBudget -
            monthlySpend,
          0
        )
      : 0;

  const budgetUsage =
    hasBudget
      ? Math.min(
          Math.round(
            (monthlySpend /
              parsedBudget) *
              100
          ),
          100
        )
      : 0;

  // =========================
  // IMPORT STATUS
  // =========================

  const hasImportedData =
    expenses.length >= 5;

  // =========================
  // DAILY BURN RATE
  // =========================

  const currentDay =
    new Date().getDate();

  const dailyBurnRate =
    monthlySpend > 0
      ? Math.round(
          monthlySpend /
            currentDay
        )
      : 0;

  // =========================
  // DASHBOARD CONTEXT
  // =========================

  let dashboardHeadline =
    "Expense Analytics Workspace";

  let dashboardDescription =
    "Track realtime spending activity, monitor budgets, and analyze transaction patterns across categories.";

  if (expenses.length >= 10) {

    dashboardHeadline =
      "Transaction Intelligence Overview";

    dashboardDescription =
      "Historical expense data is available for deeper spending analysis and forecasting.";
  }

  if (
    hasBudget &&
    budgetUsage >= 85
  ) {

    dashboardDescription =
      "Monthly budget utilization is approaching its limit based on current spending activity.";
  }

  // =========================
  // INSIGHT CARDS
  // =========================

  const insights = [

    {
      title:
        "Budget Intelligence",

      headline:
        hasBudget
          ? `₹${parsedBudget.toLocaleString()} budget active`
          : "Start planning your monthly cash flow",

      description:
        hasBudget
          ? `₹${remainingBudget.toLocaleString()} remaining for this month`
          : "Set a monthly budget to unlock smarter financial analytics.",

      icon:
        Wallet,

      color:
        hasBudget
          ? "#16A34A"
          : "#F59E0B",

      action:
        hasBudget
          ? "Manage Budget"
          : "Set Budget",

      onClick: () =>
        router.push(
          "/dashboard/budgets"
        ),
    },

    {
      title:
        "Spending Activity",

      headline:
        expenses.length > 0
          ? `₹${monthlySpend.toLocaleString()} spent this month`
          : "No spending activity detected",

      description:
        expenses.length > 0
          ? `${expenses.length} transactions across ${categoryCount} categories`
          : "Add expenses to generate realtime financial insights.",

      icon:
        TrendingUp,

      color:
        expenses.length > 0
          ? "#2563EB"
          : "#9CA3AF",

      action:
        "Add Expense",

      onClick:
        onAddExpense,
    },

    {
      title:
        "Category Analytics",

      headline:
        topCategory
          ? `${topCategory[0]} dominates spending`
          : "Awaiting transaction patterns",

      description:
        topCategory
          ? `₹${topCategory[1].toLocaleString()} spent on ${topCategory[0]}`
          : "Your spending trends will appear automatically over time.",

      icon:
        BrainCircuit,

      color:
        topCategory
          ? "#7C3AED"
          : "#9CA3AF",

      action:
        "View Analytics",

      onClick: () =>
        router.push(
          "/dashboard/analytics"
        ),
    },

    {
      title:
        "Data Intelligence",

      headline:
        hasImportedData
          ? "Historical transaction data available"
          : "Import transaction history",

      description:
        hasImportedData
          ? "Enough financial history detected for deeper analytics."
          : "Upload CSV statements to improve financial analysis accuracy.",

      icon:
        Database,

      color:
        hasImportedData
          ? "#DC2626"
          : "#9CA3AF",

      action:
        hasImportedData
          ? "Import More"
          : "Import Data",

      onClick: () =>
        setShowImportModal(
          true
        ),
    },
  ];

  return (
    <div
      style={{
        background: "#FFFFFF",
        border:
          "1px solid #E5E7EB",
        borderRadius: "30px",
        padding: "30px",
        boxShadow:
          "0 2px 10px rgba(0,0,0,0.04)",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          marginBottom: "28px",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems:
              "center",
            gap: "16px",
            marginBottom: "18px",
          }}
        >

          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius:
                "18px",
              background:
                "linear-gradient(135deg, #16A34A 0%, #22C55E 100%)",
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              boxShadow:
                "0 12px 30px rgba(34,197,94,0.25)",
            }}
          >

            <Sparkles
              size={28}
              color="#FFFFFF"
            />

          </div>

          <div>

            <p
              style={{
                margin:
                  "0 0 4px",
                fontSize: "12px",
                fontWeight: 700,
                color:
                  "#16A34A",
                textTransform:
                  "uppercase",
                letterSpacing:
                  "0.14em",
              }}
            >
              Financial Pulse
            </p>

            <h2
  style={{
    margin: 0,
    fontSize: "34px",
    fontWeight: 800,
    color:
      "#111827",
    letterSpacing:
      "-0.05em",
  }}
>
  {dashboardHeadline}
</h2>

          </div>

        </div>

        <p
          style={{
            margin: 0,
            color: "#6B7280",
            fontSize: "16px",
            lineHeight: 1.8,
            maxWidth: "760px",
          }}
        >
          {dashboardDescription}
        </p>

      </div>

      

      {/* INSIGHTS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(260px,1fr))",
          gap: "18px",
        }}
      >

        {insights.map(
          ({
            title,
            headline,
            description,
            icon: Icon,
            color,
            action,
            onClick,
          }) => (

            <div
              key={title}
              style={{
                border:
                  "1px solid #E5E7EB",
                borderRadius:
                  "24px",
                padding: "22px",
                background:
                  "#FFFFFF",
              }}
            >

              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius:
                    "18px",
                  background:
                    `${color}15`,
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  marginBottom:
                    "20px",
                }}
              >

                <Icon
                  size={26}
                  color={color}
                />

              </div>

              <p
                style={{
                  margin:
                    "0 0 10px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color:
                    "#6B7280",
                  textTransform:
                    "uppercase",
                  letterSpacing:
                    "0.12em",
                }}
              >
                {title}
              </p>

              <h3
                style={{
                  margin:
                    "0 0 14px",
                  fontSize: "28px",
                  fontWeight: 800,
                  lineHeight: 1.25,
                  color:
                    "#111827",
                  letterSpacing:
                    "-0.05em",
                }}
              >
                {headline}
              </h3>

              <p
                style={{
                  margin:
                    "0 0 24px",
                  color:
                    "#6B7280",
                  fontSize: "14px",
                  lineHeight: 1.8,
                  minHeight: "72px",
                }}
              >
                {description}
              </p>

              <button
                onClick={onClick}
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius:
                    "14px",
                  border:
                    "1px solid #E5E7EB",
                  background:
                    "#F9FAFB",
                  color:
                    "#111827",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor:
                    "pointer",
                }}
              >

                {action}

                <ArrowRight
                  size={16}
                />

              </button>

            </div>
          )
        )}

      </div>

      {/* IMPORT MODAL */}

      {showImportModal && (
        <ImportModal
          onClose={() =>
            setShowImportModal(
              false
            )
          }
        />
      )}

    </div>
  );
}