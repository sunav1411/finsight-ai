"use client";

import {
  Plus,
  Wallet,
  Download,
  FolderPlus,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    icon: Plus,
    title: "Add Expense",
    description: "Log a new transaction",
    primary: true,
  },
  {
    icon: Wallet,
    title: "Create Budget",
    description: "Set monthly spending limits",
  },
  {
    icon: FolderPlus,
    title: "Add Category",
    description: "Organize transactions",
  },
  {
    icon: Download,
    title: "Import Statement",
    description: "Upload CSV or Excel",
  },
];

export default function QuickActions({
  onAddExpense,
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: "24px",
        padding: "28px",
        fontFamily: "'Inter', sans-serif",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <p
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#16A34A",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            marginBottom: "10px",
          }}
        >
          Quick Actions
        </p>

        <h2
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: 700,
            color: "#111827",
            letterSpacing: "-0.03em",
          }}
        >
          Manage Your Finances
        </h2>

        <p
          style={{
            marginTop: "8px",
            color: "#6B7280",
            fontSize: "15px",
            lineHeight: 1.6,
          }}
        >
          Start tracking expenses, organizing categories, and
          building your financial workflow.
        </p>
      </div>

      {/* Action Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
        }}
      >
        {actions.map(
  ({
    icon: Icon,
    title,
    description,
    primary,
  }) => (
            <button
  key={title}
  onClick={() => {
    if (title === "Add Expense") {
      onAddExpense();
    }
  }}
              style={{
                background: primary
                  ? "#16A34A"
                  : "#F8FAFC",
                border: primary
                  ? "none"
                  : "1px solid #E5E7EB",
                borderRadius: "20px",
                padding: "22px",
                cursor: "pointer",
                textAlign: "left",
                transition: "0.2s ease",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  background: primary
                    ? "rgba(255,255,255,0.16)"
                    : "#FFFFFF",
                  border: primary
                    ? "none"
                    : "1px solid #E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  size={22}
                  color={
                    primary
                      ? "#FFFFFF"
                      : "#16A34A"
                  }
                />
              </div>

              {/* Content */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: 600,
                      color: primary
                        ? "#FFFFFF"
                        : "#111827",
                    }}
                  >
                    {title}
                  </h3>

                  <ArrowRight
                    size={18}
                    color={
                      primary
                        ? "#FFFFFF"
                        : "#9CA3AF"
                    }
                  />
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    lineHeight: 1.6,
                    color: primary
                      ? "rgba(255,255,255,0.82)"
                      : "#6B7280",
                  }}
                >
                  {description}
                </p>
              </div>
            </button>
          )
        )}
      </div>
    </div>
  );
}