"use client";

import { useState } from "react";
import { X } from "lucide-react";

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Other",
];

export default function AddExpenseModal({
  open,
  onClose,
  onAddExpense,
  editingExpense,
  onUpdateExpense,
}) {
  if (!open) return null;

  return (
    <ExpenseModalContent
      key={editingExpense?.id || "new"}
      onClose={onClose}
      onAddExpense={onAddExpense}
      editingExpense={editingExpense}
      onUpdateExpense={onUpdateExpense}
    />
  );
}

function ExpenseModalContent({
  onClose,
  onAddExpense,
  editingExpense,
  onUpdateExpense,
}) {
  const initialState =
    getInitialExpenseState(
      editingExpense
    );

  const [title, setTitle] =
    useState(initialState.title);

  const [amount, setAmount] =
    useState(initialState.amount);

  const [category, setCategory] =
    useState(initialState.category);

  const [date, setDate] =
    useState(initialState.date);

  function resetForm() {
    const nextState =
      getInitialExpenseState();

    setTitle(nextState.title);
    setAmount(nextState.amount);
    setCategory(nextState.category);
    setDate(nextState.date);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !title ||
      !amount ||
      !date
    ) {
      return;
    }

    const expenseData = {
      title,
      amount: Number(amount),
      category,
      date,
    };

    if (
      editingExpense &&
      onUpdateExpense
    ) {
      onUpdateExpense(
        expenseData
      );
    } else {
      onAddExpense(expenseData);
    }

    resetForm();
    onClose();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(15,23,42,0.45)",
        backdropFilter:
          "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent:
          "center",
        zIndex: 999,
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#ffffff",
          borderRadius: "28px",
          border:
            "1px solid #E5E7EB",
          padding: "28px",
          fontFamily:
            "'Inter', sans-serif",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "28px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: 700,
                color: "#111827",
                letterSpacing:
                  "-0.04em",
              }}
            >
              {editingExpense
                ? "Edit Expense"
                : "Add Expense"}
            </h2>

            <p
              style={{
                marginTop: "8px",
                fontSize: "15px",
                color: "#6B7280",
              }}
            >
              {editingExpense
                ? "Update your expense information."
                : "Log a new transaction to track your spending."}
            </p>
          </div>

          <button
            onClick={handleClose}
            style={{
              width: "42px",
              height: "42px",
              borderRadius:
                "14px",
              border:
                "1px solid #E5E7EB",
              background:
                "#ffffff",
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              cursor:
                "pointer",
            }}
          >
            <X
              size={18}
              color="#6B7280"
            />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection:
              "column",
            gap: "18px",
          }}
        >
          <div>
            <label style={labelStyle}>
              Expense Title
            </label>

            <input
              type="text"
              placeholder="Dinner, Uber, Netflix..."
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              Amount
            </label>

            <input
              type="number"
              placeholder="Rs. 0.00"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              style={inputStyle}
            >
              {categories.map(
                (cat) => (
                  <option key={cat}>
                    {cat}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label style={labelStyle}>
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(
                  e.target.value
                )
              }
              style={inputStyle}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "flex-end",
              gap: "12px",
              marginTop: "10px",
            }}
          >
            <button
              type="button"
              onClick={handleClose}
              style={{
                height: "48px",
                padding:
                  "0 18px",
                borderRadius:
                  "14px",
                border:
                  "1px solid #E5E7EB",
                background:
                  "#ffffff",
                fontSize:
                  "14px",
                fontWeight:
                  600,
                color:
                  "#374151",
                cursor:
                  "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                height: "48px",
                padding:
                  "0 22px",
                borderRadius:
                  "14px",
                border:
                  "none",
                background:
                  "#16A34A",
                color:
                  "#FFFFFF",
                fontSize:
                  "14px",
                fontWeight:
                  600,
                cursor:
                  "pointer",
              }}
            >
              {editingExpense
                ? "Update Expense"
                : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  height: "52px",
  borderRadius: "14px",
  border: "1px solid #E5E7EB",
  background: "#FFFFFF",
  padding: "0 16px",
  fontSize: "15px",
  color: "#111827",
  outline: "none",
  fontFamily:
    "'Inter', sans-serif",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "14px",
  fontWeight: 600,
  color: "#111827",
};

function getInitialExpenseState(
  editingExpense
) {
  return {
    title:
      editingExpense?.title ||
      "",
    amount:
      editingExpense?.amount ||
      "",
    category:
      editingExpense?.category ||
      "Food",
    date:
      editingExpense?.date ||
      "",
  };
}
