"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Image from "next/image";

import {
  CircleDollarSign,
  TrendingUp,
  Wallet,
  Target,
  ArrowUpRight,
} from "lucide-react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

import {
  subscribeToExpenses,
  getUserBudget,
} from "@/lib/firestore";

import BudgetOverview from "@/components/dashboard/BudgetOverview";

export default function BudgetsPage() {

  // USER
  const [user, setUser] =
    useState(null);

  // EXPENSES
  const [expenses, setExpenses] =
    useState([]);

  // BUDGET
  const [
    monthlyBudget,
    setMonthlyBudget,
  ] = useState(0);

  // LOAD USER + DATA
  useEffect(() => {

    const unsubscribeAuth =
      onAuthStateChanged(
        auth,
        async (currentUser) => {

          if (!currentUser) return;

          setUser(currentUser);

          // LOAD SAVED BUDGET
          const savedBudget =
            await getUserBudget(
              currentUser.uid
            );

          setMonthlyBudget(
            Number(savedBudget)
          );

          // LOAD EXPENSES
          const unsubscribeExpenses =
            subscribeToExpenses(
              currentUser.uid,
              (expenseData) => {

                setExpenses(
                  expenseData
                );

              }
            );

          return () =>
            unsubscribeExpenses();
        }
      );

    return () =>
      unsubscribeAuth();

  }, []);

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
  // TOTAL MONTHLY SPENDING
  // =========================================

  const totalSpending =
    useMemo(() => {

      return monthlyExpenses.reduce(
        (total, expense) =>
          total +
          Number(
            expense.amount || 0
          ),
        0
      );

    }, [monthlyExpenses]);

  // REMAINING
  const remainingBudget =
    monthlyBudget -
    totalSpending;

  // USAGE %
  const usagePercentage =
    monthlyBudget > 0
      ? Math.min(
          (
            totalSpending /
            monthlyBudget
          ) * 100,
          100
        )
      : 0;

  // SAVINGS %
  const savingsPercentage =
    Math.max(
      100 - usagePercentage,
      0
    );

  // FINANCIAL STATUS
  const financialStatus =
    usagePercentage <= 50
      ? "Excellent"
      : usagePercentage <= 75
      ? "Good"
      : usagePercentage <= 90
      ? "Warning"
      : "Critical";

  // ANALYTICS CARDS
  const budgetCards = [
    {
      title: "Monthly Budget",
      amount: `₹${monthlyBudget.toLocaleString()}`,
      icon: Wallet,
      bg: "#F0FDF4",
      color: "#16A34A",
    },
    {
      title: "Current Spending",
      amount: `₹${totalSpending.toLocaleString()}`,
      icon: TrendingUp,
      bg: "#EFF6FF",
      color: "#2563EB",
    },
    {
      title: "Remaining Budget",
      amount: `₹${remainingBudget.toLocaleString()}`,
      icon: Target,
      bg: "#FEF3C7",
      color:
        remainingBudget < 0
          ? "#DC2626"
          : "#D97706",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F5F7FB",
        padding: "34px",
        fontFamily:
          "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >

        {/* HERO */}
        <div
          style={{
            marginBottom: "34px",
          }}
        >

          {/* LOGO */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "18px",
            }}
          >
            <Image
              src="/logo/finsight-logo.svg"
              alt="FinSight AI"
              width={54}
              height={54}
            />

            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#16A34A",
                  letterSpacing:
                    "0.12em",
                  textTransform:
                    "uppercase",
                }}
              >
                FinSight AI
              </p>

              <span
                style={{
                  fontSize: "13px",
                  color: "#6B7280",
                }}
              >
                Smart Budget Intelligence
              </span>
            </div>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "54px",
              fontWeight: 700,
              color: "#111827",
              letterSpacing:
                "-0.05em",
              lineHeight: 1,
            }}
          >
            Budget planning
            <br />
            and savings insights
          </h1>

          <p
            style={{
              marginTop: "18px",
              fontSize: "17px",
              color: "#6B7280",
              lineHeight: 1.7,
              maxWidth: "760px",
            }}
          >
            Analyze your realtime
            spending behavior, monitor
            savings performance, and
            build healthier financial
            habits with intelligent
            budget tracking.
          </p>
        </div>

        {/* REAL BUDGET SYSTEM */}
        <div
          style={{
            marginBottom: "28px",
          }}
        >
          <BudgetOverview
            expenses={expenses}
            budget={monthlyBudget}
            setBudget={setMonthlyBudget}
          />
        </div>

        {/* ANALYTICS CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "22px",
            marginBottom: "28px",
          }}
        >
          {budgetCards.map(
            ({
              title,
              amount,
              icon: Icon,
              bg,
              color,
            }) => (
              <div
                key={title}
                style={{
                  background:
                    "#FFFFFF",
                  border:
                    "1px solid #E5E7EB",
                  borderRadius:
                    "28px",
                  padding: "28px",
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    width: "68px",
                    height: "68px",
                    borderRadius:
                      "20px",
                    background: bg,
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    marginBottom:
                      "22px",
                  }}
                >
                  <Icon
                    size={30}
                    color={color}
                  />
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#6B7280",
                    marginBottom: "10px",
                  }}
                >
                  {title}
                </p>

                <h2
                  style={{
                    margin: 0,
                    fontSize: "36px",
                    fontWeight: 700,
                    color: "#111827",
                    letterSpacing:
                      "-0.04em",
                  }}
                >
                  {amount}
                </h2>
              </div>
            )
          )}
        </div>

        {/* FINANCIAL HEALTH */}
        <div
          style={{
            background: "#FFFFFF",
            border:
              "1px solid #E5E7EB",
            borderRadius: "32px",
            padding: "42px",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >

          {/* HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "18px",
              marginBottom: "32px",
            }}
          >
            <div>
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
                Budget Performance
              </p>

              <h2
                style={{
                  margin: 0,
                  fontSize: "38px",
                  fontWeight: 700,
                  color: "#111827",
                  letterSpacing:
                    "-0.04em",
                }}
              >
                Financial health score
              </h2>
            </div>

            <div
              style={{
                background:
                  usagePercentage > 90
                    ? "#FEE2E2"
                    : "#F0FDF4",
                border:
                  usagePercentage > 90
                    ? "1px solid #FECACA"
                    : "1px solid #DCFCE7",
                borderRadius:
                  "18px",
                padding:
                  "14px 20px",
                display: "flex",
                alignItems:
                  "center",
                gap: "10px",
              }}
            >
              <ArrowUpRight
                size={20}
                color={
                  usagePercentage > 90
                    ? "#DC2626"
                    : "#16A34A"
                }
              />

              <span
                style={{
                  color:
                    usagePercentage > 90
                      ? "#DC2626"
                      : "#166534",
                  fontWeight: 700,
                  fontSize: "16px",
                }}
              >
                {financialStatus}
              </span>
            </div>
          </div>

          {/* PROGRESS */}
          <div
            style={{
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginBottom: "14px",
              }}
            >
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                Budget Usage
              </span>

              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color:
                    usagePercentage > 90
                      ? "#DC2626"
                      : "#16A34A",
                }}
              >
                {usagePercentage.toFixed(0)}%
              </span>
            </div>

            <div
              style={{
                height: "18px",
                background: "#E5E7EB",
                borderRadius:
                  "999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${usagePercentage}%`,
                  height: "100%",
                  background:
                    usagePercentage > 90
                      ? "#DC2626"
                      : "linear-gradient(90deg, #16A34A 0%, #22C55E 100%)",
                  borderRadius:
                    "999px",
                  transition:
                    "0.3s ease",
                }}
              />
            </div>
          </div>

          {/* INSIGHTS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
              marginTop: "38px",
            }}
          >
            {[
              `Total Transactions: ${monthlyExpenses.length}`,
              `Savings Rate: ${savingsPercentage.toFixed(0)}%`,
              `Remaining Budget: ₹${remainingBudget.toLocaleString()}`,
              `Monthly Spend: ₹${totalSpending.toLocaleString()}`,
            ].map((feature) => (
              <div
                key={feature}
                style={{
                  border:
                    "1px solid #E5E7EB",
                  borderRadius:
                    "18px",
                  padding: "18px",
                  background:
                    "#FAFAFA",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: "10px",
                  }}
                >
                  <CircleDollarSign
                    size={18}
                    color="#16A34A"
                  />

                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color:
                        "#111827",
                    }}
                  >
                    {feature}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}
