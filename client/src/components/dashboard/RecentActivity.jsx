"use client";

import {
  Receipt,
  Plus,
} from "lucide-react";

const transactions = [];

export default function RecentActivity() {
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
        }}
      >
        <div>
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
            Transactions
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.04em",
            }}
          >
            Recent Expenses
          </h2>

          <p
            style={{
              marginTop: "10px",
              color: "#6B7280",
              fontSize: "15px",
              lineHeight: 1.6,
            }}
          >
            Your latest expense activity will appear here.
          </p>
        </div>

        <button
          style={{
            background: "#16A34A",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "14px",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      {/* Empty State */}
      {transactions.length === 0 && (
        <div
          style={{
            border: "2px dashed #E5E7EB",
            borderRadius: "24px",
            padding: "80px 20px",
            textAlign: "center",
            background: "#FAFAFA",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "82px",
              height: "82px",
              borderRadius: "24px",
              background: "#F0FDF4",
              border: "1px solid #DCFCE7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <Receipt
              size={34}
              color="#16A34A"
            />
          </div>

          {/* Heading */}
          <h3
            style={{
              margin: "0 0 12px",
              fontSize: "28px",
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.03em",
            }}
          >
            No expenses yet
          </h3>

          {/* Description */}
          <p
            style={{
              maxWidth: "460px",
              margin: "0 auto",
              fontSize: "16px",
              lineHeight: 1.8,
              color: "#6B7280",
            }}
          >
            Start tracking your spending by adding your
            first transaction. Your financial activity and
            category insights will appear here.
          </p>

          {/* CTA */}
          <button
            style={{
              marginTop: "28px",
              background: "#16A34A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "16px",
              padding: "16px 22px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Plus size={18} />
            Add Your First Expense
          </button>
        </div>
      )}
    </div>
  );
}