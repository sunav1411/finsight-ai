"use client";

import {
  Wallet,
  Receipt,
  TrendingUp,
  Layers3,
} from "lucide-react";

export default function ExpenseOverview({
  expenses,
}) {

  // TOTAL SPEND
  const totalSpent =
    expenses.reduce(
      (sum, expense) =>
        sum +
        Number(
          expense.amount || 0
        ),
      0
    );

  // TOTAL TRANSACTIONS
  const totalTransactions =
    expenses.length;

  // CATEGORY COUNT
  const categoryCount =
    new Set(
      expenses.map(
        (expense) =>
          expense.category
      )
    ).size;

  // THIS MONTH SPEND
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

  const cards = [
    {
      title: "Total Expenses",
      value: `₹${totalSpent.toLocaleString()}`,
      icon: Wallet,
    },
    {
      title: "Monthly Spend",
      value: `₹${monthlySpend.toLocaleString()}`,
      icon: TrendingUp,
    },
    {
      title: "Transactions",
      value:
        totalTransactions,
      icon: Receipt,
    },
    {
      title: "Categories",
      value:
        categoryCount,
      icon: Layers3,
    },
  ];

  return (
    <div
      className="
        grid
       grid-cols-2
       xl:grid-cols-4
        gap-4
      "
    >

      {cards.map(
        ({
          title,
          value,
          icon: Icon,
        }) => (

          <div
            key={title}
            className="
            bg-slate-800
              border
              border-gray-200
               rounded-[22px]
                p-4
               sm:p-6
              shadow-sm
               min-w-0
              "
          >

       {/* TOP */}
<div
  className="
    w-[44px]
    h-[44px]
    sm:w-[52px]
    sm:h-[52px]
    rounded-[14px]
    sm:rounded-2xl
    bg-green-50
    flex
    items-center
    justify-center
    mb-4
    sm:mb-5
  "
>

              <Icon
                size={24}
                color="#16A34A"
              />

            </div>

            {/* VALUE */}
            <h3
              className="
                text-[24px]
                sm:text-[38px]
                leading-tight
                font-bold
                tracking-[-0.05em]
                text-slate-100
                break-words
              "
            >
              {value}
            </h3>

            {/* LABEL */}
            <p
              className="
                mt-2
                text-[14px]
                text-slate-200
              "
            >
              {title}
            </p>

          </div>

        )
      )}

    </div>
  );
}