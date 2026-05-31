"use client";

import {
  PiggyBank,
  Wallet,
  TrendingUp,
  CalendarDays,
} from "lucide-react";

export default function SavingsInsights({
  expenses = [],
  budget = 0,
}) {

  // =========================================
  // CURRENT MONTH FILTER
  // =========================================

  const currentMonth =
    new Date().getMonth();

  const currentYear =
    new Date().getFullYear();

  const monthlyExpenses =
    expenses.filter((expense) => {

      if (!expense.date)
        return false;

      const expenseDate =
        new Date(expense.date);

      return (
        expenseDate.getMonth() ===
          currentMonth &&

        expenseDate.getFullYear() ===
          currentYear
      );
    });

  // =========================================
  // TOTAL MONTHLY SPENT
  // =========================================

  const totalSpent =
    monthlyExpenses.reduce(
      (sum, expense) =>
        sum +
        Number(
          expense.amount || 0
        ),
      0
    );

  // =========================================
  // SAVINGS
  // =========================================

  const remainingBudget =
    budget - totalSpent;

  // =========================================
  // SAVINGS RATE
  // =========================================

  const savingsRate =
    budget > 0
      ? Math.round(
          (remainingBudget /
            budget) *
            100
        )
      : 0;

  // =========================================
  // DAILY AVERAGE
  // =========================================

  const currentDay =
    new Date().getDate();

  const dailyAverage =
    totalSpent > 0
      ? Math.round(
          totalSpent /
            currentDay
        )
      : 0;

  // =========================================
  // BUDGET UTILIZATION
  // =========================================

  const budgetUsage =
    budget > 0
      ? Math.min(
          Math.round(
            (totalSpent /
              budget) *
              100
          ),
          100
        )
      : 0;

  // =========================================
  // METRICS
  // =========================================

  const metrics = [

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
          : "Monthly budget not configured",

      icon:
        PiggyBank,

      accent:
        remainingBudget >= 0
          ? "#16A34A"
          : "#DC2626",

      bg:
        remainingBudget >= 0
          ? "#DCFCE7"
          : "#FEE2E2",
    },

    {
      label:
        "Savings Rate",

      value:
        `${savingsRate}%`,

      subtext:
        "Remaining budget ratio",

      icon:
        Wallet,

      accent:
        "#2563EB",

      bg:
        "#DBEAFE",
    },

    {
      label:
        "Budget Utilization",

      value:
        `${budgetUsage}%`,

      subtext:
        "Current month usage",

      icon:
        TrendingUp,

      accent:
        budgetUsage >= 90
          ? "#DC2626"
          : "#F59E0B",

      bg:
        budgetUsage >= 90
          ? "#FEE2E2"
          : "#FEF3C7",
    },

    {
      label:
        "Daily Spend Average",

      value:
        `₹${dailyAverage}`,

      subtext:
        "Average daily spending",

      icon:
        CalendarDays,

      accent:
        "#8B5CF6",

      bg:
        "#EDE9FE",
    },
  ];

  return (

    <div
      className="
        bg-slate-800
        border
        border-gray-600
        rounded-[28px]
        p-5
        sm:p-7
        shadow-sm
      "
    >

      {/* HEADER */}

      <div className="mb-7">

        <p
          className="
            text-[12px]
            font-semibold
            text-green-800
            uppercase
            tracking-[0.12em]
            mb-2
          "
        >
          Savings Analytics
        </p>

        <h2
          className="
            text-[32px]
            sm:text-[45px]
            leading-tight
            font-bold
            tracking-tight
           text-slate-100
          "
        >
          Budget Overview
        </h2>

        <p
          className="
            mt-3
            text-[15px]
            sm:text-[16px]
            text-slate-200
            leading-7
            max-w-[700px]
          "
        >
          Monitor savings efficiency,
          budget usage, and spending
          activity using realtime
          transaction data.
        </p>

      </div>

      {/* GRID */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          gap-4
        "
      >

        {metrics.map(

          ({
            label,
            value,
            subtext,
            icon: Icon,
            accent,
            bg,
          }) => (

            <div
              key={label}

              className="
                bg-gray-50
                border
                border-gray-500
                rounded-[24px]
                p-5
                sm:p-6
              "
            >

              {/* ICON */}

              <div
                style={{
                  background: bg,
                }}

                className="
                  w-[54px]
                  h-[54px]
                  rounded-[16px]
                  flex
                  items-center
                  justify-center
                  mb-5
                "
              >

                <Icon
                  size={24}
                  color={accent}
                />

              </div>

              {/* LABEL */}

              <p
                className="
                  text-[13px]
                  text-slate-900
                  mb-3
                "
              >

                {label}

              </p>

              {/* VALUE */}

              <h3
                className="
                  text-[32px]
                  sm:text-[36px]
                  leading-tight
                  font-bold
                  tracking-tight
                  text-slate-900
                  break-words
                "
              >

                {value}

              </h3>

              {/* SUBTEXT */}

              <p
                className="
                  mt-3
                  text-[14px]
                  text-slate-600
                  leading-6
                "
              >

                {subtext}

              </p>

            </div>

          )
        )}

      </div>

    </div>
  );
}
