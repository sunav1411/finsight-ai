"use client";

import {
  Wallet,
  PiggyBank,
  Receipt,
  CalendarDays,
} from "lucide-react";

export default function OverviewCards({
  expenses = [],
  budget = 0,
}) {

  // =========================================
  // TOTAL SPENT
  // =========================================

  const totalSpent = expenses.reduce(
    (sum, expense) =>
      sum +
      Number(
        expense.amount || 0
      ),
    0
  );

  // =========================================
  // TRANSACTION COUNT
  // =========================================

  const transactionCount =
    expenses.length;

  // =========================================
  // REMAINING BUDGET
  // =========================================

  const remainingBudget =
    Math.max(
      budget - totalSpent,
      0
    );

  // =========================================
  // CURRENT MONTH SPEND
  // =========================================

  const currentMonth =
    new Date().getMonth();

  const currentYear =
    new Date().getFullYear();

  const monthlySpend =
    expenses
      .filter((expense) => {

        if (!expense.date)
          return false;

        const expenseDate =
          new Date(
            expense.date
          );

        return (
          expenseDate.getMonth() ===
            currentMonth &&

          expenseDate.getFullYear() ===
            currentYear
        );
      })
      .reduce(
        (sum, expense) =>
          sum +
          Number(
            expense.amount || 0
          ),
        0
      );

  // =========================================
  // DAILY BURN RATE
  // =========================================

  const currentDay =
    new Date().getDate();

  const dailyBurnRate =
    monthlySpend > 0
      ? Math.round(
          monthlySpend /
            currentDay
        )
      : 0;

  // =========================================
  // CARDS
  // =========================================

  const cards = [

    {
      label:
        "Total Spent",

      value:
        `₹${totalSpent.toLocaleString()}`,

      subtext:
        `${transactionCount} transactions recorded`,

      icon:
        Wallet,

      accent:
        "#16A34A",

      bg:
        "#DCFCE7",

      border:
        "#BBF7D0",
    },

    {
      label:
        "Monthly Spend",

      value:
        `₹${monthlySpend.toLocaleString()}`,

      subtext:
        `₹${dailyBurnRate}/day average`,

      icon:
        CalendarDays,

      accent:
        "#2563EB",

      bg:
        "#DBEAFE",

      border:
        "#BFDBFE",
    },

    {
      label:
        "Remaining Budget",

      value:
        budget > 0
          ? `₹${remainingBudget.toLocaleString()}`
          : "No Budget",

      subtext:
        budget > 0
          ? `Out of ₹${budget.toLocaleString()}`
          : "Set a monthly budget",

      icon:
        PiggyBank,

      accent:
        "#F59E0B",

      bg:
        "#FEF3C7",

      border:
        "#FDE68A",
    },

    {
      label:
        "Transactions",

      value:
        transactionCount,

      subtext:
        "Realtime expense activity",

      icon:
        Receipt,

      accent:
        "#8B5CF6",

      bg:
        "#EDE9FE",

      border:
        "#DDD6FE",
    },
  ];

  return (

    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-5
      "
      style={{
        marginBottom: "24px",
      }}
    >

      {cards.map(

        ({
          label,
          value,
          subtext,
          icon: Icon,
          accent,
          bg,
          border,
        }) => (

          <div
            key={label}

            style={{
              background:
                "#ffffff",

              border:
                `1px solid ${border}`,

              borderRadius:
                "24px",

              padding:
                "22px",

              position:
                "relative",

              overflow:
                "hidden",

              boxShadow:
                "0 1px 2px rgba(0,0,0,0.04)",
            }}
          >

            {/* TOP */}

            <div
              style={{
                display:
                  "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "flex-start",

                marginBottom:
                  "18px",
              }}
            >

              <div
                style={{
                  width: "52px",

                  height: "52px",

                  borderRadius:
                    "16px",

                  background:
                    bg,

                  border:
                    `1px solid ${border}`,

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",
                }}
              >

                <Icon
                  size={24}
                  color={accent}
                />

              </div>

            </div>

            {/* LABEL */}

            <p
              style={{
                margin:
                  "0 0 8px",

                fontSize:
                  "13px",

                fontWeight:
                  600,

                color:
                  "#6B7280",
              }}
            >

              {label}

            </p>

            {/* VALUE */}

            <h3
              style={{
                margin:
                  "0 0 10px",

                fontSize:
                  "32px",

                lineHeight:
                  1,

                fontWeight:
                  800,

                letterSpacing:
                  "-0.04em",

                color:
                  "#111827",
              }}
            >

              {value}

            </h3>

            {/* SUBTEXT */}

            <p
              style={{
                margin: 0,

                fontSize:
                  "14px",

                color:
                  "#6B7280",

                lineHeight:
                  1.6,
              }}
            >

              {subtext}

            </p>

          </div>

        )
      )}

    </div>
  );
}