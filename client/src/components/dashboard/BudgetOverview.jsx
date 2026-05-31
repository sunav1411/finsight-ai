"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { auth } from "@/lib/firebase";
import { saveUserBudget } from "@/lib/firestore";

export default function BudgetOverview({
  expenses = [],
  budget = 0,
  setBudget = () => {},
}) {
  const safeBudget =
    Number(budget || 0);

  const currentMonth =
    new Date().getMonth();

  const currentYear =
    new Date().getFullYear();

  const monthlyExpenses =
    Array.isArray(expenses)
      ? expenses.filter(
          (expense) => {
            if (!expense.date) {
              return false;
            }

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
          }
        )
      : [];

  const totalSpent =
    monthlyExpenses.reduce(
      (sum, expense) =>
        sum +
        Number(
          expense.amount || 0
        ),
      0
    );

  const remaining =
    safeBudget - totalSpent;

  const percentage =
    safeBudget > 0
      ? Math.min(
          (
            totalSpent /
            safeBudget
          ) * 100,
          100
        )
      : 0;

  const isOverspending =
    totalSpent >
      safeBudget &&
    safeBudget > 0;

  return (
    <BudgetOverviewContent
      key={safeBudget}
      safeBudget={safeBudget}
      setBudget={setBudget}
      totalSpent={totalSpent}
      remaining={remaining}
      percentage={percentage}
      isOverspending={isOverspending}
    />
  );
}

function BudgetOverviewContent({
  safeBudget,
  setBudget,
  totalSpent,
  remaining,
  percentage,
  isOverspending,
}) {
  const [
    budgetInput,
    setBudgetInput,
  ] = useState(
    safeBudget.toString()
  );

  async function handleSaveBudget() {
    const parsedBudget =
      Number(budgetInput);

    if (
      !parsedBudget ||
      parsedBudget <= 0
    ) {
      toast.error(
        "Enter valid budget"
      );
      return;
    }

    const user =
      auth.currentUser;

    if (!user) return;

    try {
      await saveUserBudget(
        user.uid,
        parsedBudget
      );

      setBudget(parsedBudget);

      toast.success(
        safeBudget > 0
          ? "Budget updated"
          : "Budget saved"
      );
    } catch (error) {
      toast.error(
        "Failed to save budget"
      );
    }
  }

  return (
    <div
      className="p-5 md:p-7"
      style={{
        background: "#1E293B",
        border: "1px solid #334155",
        borderRadius: "28px",
        fontFamily:
          "'Inter', sans-serif",
        boxShadow:
          "0 10px 25px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          marginBottom: "28px",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#16A34A",
            textTransform:
              "uppercase",
            letterSpacing:
              "0.12em",
            marginBottom: "10px",
          }}
        >
          Budget Tracking
        </p>

        <h2
          className="
            text-[28px]
            md:text-[38px]
            font-bold
            leading-tight
            tracking-tight
            text-slate-100
          "
          style={{
            margin: 0,
          }}
        >
          Monthly Budget
        </h2>

        <p
          style={{
            marginTop: "10px",
            fontSize: "16px",
            color: "#6B7280",
          }}
        >
          Track your monthly spending,
          monitor expenses, and
          maintain better financial
          discipline using realtime
          budget analytics.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
          marginBottom: "28px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="number"
          placeholder={
            safeBudget > 0
              ? `Current Budget: Rs. ${safeBudget.toLocaleString()}`
              : "Set monthly budget"
          }
          value={budgetInput}
          onChange={(e) =>
            setBudgetInput(
              e.target.value
            )
          }
          style={{
            width: "320px",
            height: "54px",
            borderRadius: "16px",
            border:
              "1px solid #E5E7EB",
            padding: "0 18px",
            fontSize: "16px",
            outline: "none",
            color: "#111827",
            background:
              "#ffffff",
          }}
        />

        <button
          onClick={handleSaveBudget}
          style={{
            height: "54px",
            minWidth: "220px",
            padding: "0 28px",
            borderRadius: "16px",
            border: "none",
            background: "#16A34A",
            color: "#243B53",
            fontWeight: 600,
            fontSize: "15px",
            cursor: "pointer",
            whiteSpace:
              "nowrap",
          }}
        >
          {safeBudget > 0
            ? "Update Budget"
            : "Save Budget"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div style={cardStyle}>
          <p style={labelStyle}>
            Budget
          </p>

          <h3 style={valueStyle}>
            Rs.{" "}
            {safeBudget.toLocaleString()}
          </h3>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>
            Spent
          </p>

          <h3 style={valueStyle}>
            Rs.{" "}
            {totalSpent.toLocaleString()}
          </h3>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>
            Remaining
          </p>

          <h3
            style={{
              ...valueStyle,
              color:
                remaining < 0
                  ? "#DC2626"
                  : "#16A34A",
            }}
          >
            Rs.{" "}
            {remaining.toLocaleString()}
          </h3>
        </div>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#c5ee11",
            }}
          >
            Budget Usage
          </span>

          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color:
                isOverspending
                  ? "#DC2626"
                  : "#16A34A",
            }}
          >
            {percentage.toFixed(0)}%
          </span>
        </div>

        <div
          style={{
            width: "100%",
            height: "14px",
            background:
              "#334155",
            borderRadius:
              "999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: "100%",
              background:
                isOverspending
                  ? "#DC2626"
                  : "#16A34A",
              borderRadius:
                "999px",
              transition:
                "0.3s ease",
            }}
          />
        </div>

        {isOverspending && (
          <p
            style={{
              marginTop: "14px",
              color: "#DC2626",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            You have exceeded your
            monthly budget.
          </p>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#111827",
  border: "1px solid #334155",
  borderRadius: "18px",
  padding: "18px",
  boxShadow:
    "0 8px 20px rgba(0,0,0,0.25)",
};

const labelStyle = {
  margin: 0,
  fontSize: "25px",
  color: "#ffffff",
  marginBottom: "8px",
};

const valueStyle = {
  margin: 0,
  fontSize: "26px",
  fontWeight: 700,
  color: "#7f9e46",
};
