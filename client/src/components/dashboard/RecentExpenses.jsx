"use client";

import {
  Receipt,
  Plus,
  Trash2,
  SearchX,
  Pencil,
} from "lucide-react";

import { formatExpenseDate } from "@/lib/date";

const categoryColors = {
  Food: "#16A34A",
  Transport: "#2563EB",
  Shopping: "#9333EA",
  Bills: "#EA580C",
  Health: "#DC2626",
  Entertainment: "#DB2777",
  Education: "#0EA5E9",
  Other: "#6B7280",
};

export default function RecentExpenses({
  expenses,
  allExpenses,
  onAddExpense,
  onDeleteExpense,
  onEditExpense,
}) {

  const noExpensesExist =
    allExpenses.length === 0;

  return (
    <div
      className="
        bg-slate-800
        border
        border-gray-200
        rounded-[28px]
        p-4
        sm:p-7
        shadow-sm
      "
    >

      {/* HEADER */}
      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-5
          mb-7
        "
      >

        <div>

          <p
            className="
              text-[12px]
              font-semibold
              text-green-600
              uppercase
              tracking-[0.12em]
              mb-2
            "
          >
            Transactions
          </p>

          <h2
            className="
              text-[42px]
              leading-[0.95]
              font-bold
              tracking-[-0.05em]
              text-slate-100
            "
          >
            Recent
            <br />
            Expenses
          </h2>

          <p
            className="
              mt-3
              text-[15px]
              text-slate-200
            "
          >
            Your latest expense
            activity appears here.
          </p>

        </div>

        <button
          onClick={onAddExpense}
          className="
            h-[52px]
            px-6
            rounded-2xl
            bg-green-600
            hover:bg-green-700
            transition
            text-white
            flex
            items-center
            justify-center
            gap-2
            text-[15px]
            font-semibold
            w-full
            sm:w-auto
          "
        >

          <Plus size={18} />

          Add Expense

        </button>

      </div>

      {/* EMPTY STATES */}
      {expenses.length === 0 ? (

        noExpensesExist ? (

          <div
            className="
              border-2
              border-dashed
              border-gray-200
              rounded-[24px]
              min-h-[420px]
              flex
              flex-col
              items-center
              justify-center
              text-center
              p-8
            "
          >

            <div
              className="
                w-[88px]
                h-[88px]
                rounded-[24px]
                bg-green-50
                flex
                items-center
                justify-center
                mb-6
              "
            >

              <Receipt
                size={38}
                color="#16A34A"
              />

            </div>

            <h3
              className="
                text-[28px]
                font-bold
                tracking-tight
                text-slate-100
              "
            >
              No expenses yet
            </h3>

            <p
              className="
                mt-4
                text-[16px]
                text-slate-200
                leading-7
                max-w-[520px]
              "
            >
              Start tracking your
              spending by adding your
              first transaction.
            </p>

            <button
              onClick={
                onAddExpense
              }
              className="
                mt-7
                h-[54px]
                px-7
                rounded-2xl
                bg-green-600
                hover:bg-green-700
                transition
                text-white
                flex
                items-center
                justify-center
                gap-2
                text-[15px]
                font-semibold
              "
            >

              <Plus size={18} />

              Add Expense

            </button>

          </div>

        ) : (

          <div
            className="
              border-2
              border-dashed
              border-gray-200
              rounded-[24px]
              min-h-[420px]
              flex
              flex-col
              items-center
              justify-center
              text-center
              p-8
            "
          >

            <div
              className="
                w-[88px]
                h-[88px]
                rounded-[24px]
                bg-emerald-500
                flex
                items-center
                justify-center
                mb-6
              "
            >

              <SearchX
                size={38}
                color="#CA8A04"
              />

            </div>

            <h3
              className="
                text-[28px]
                font-bold
                tracking-tight
                text-slate-100
              "
            >
              No matching expenses
            </h3>

            <p
              className="
                mt-4
                text-[16px]
                text-slate-200
                leading-7
                max-w-[520px]
              "
            >
              Try changing your
              search or category
              filters.
            </p>

          </div>

        )

      ) : (

        <div
          className="
            flex
            flex-col
            gap-4
          "
        >

          {expenses.map(
            (expense) => (

              <div
                key={expense.id}
                className="
                  border
                  border-gray-200
                  rounded-[22px]
                  p-4
                  sm:p-5
                  bg-slate-800
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  gap-4
                  transition
                  hover:shadow-md
                "
              >

                {/* LEFT */}
                <div
                  className="
                    flex
                    items-start
                    gap-4
                    min-w-0
                  "
                >

                  {/* ICON */}
                  <div
                    className="
                      w-[52px]
                      h-[52px]
                      rounded-2xl
                      bg-slate-50
                      border
                      border-gray-200
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >

                    <Receipt
                      size={22}
                      color="#16A34A"
                    />

                  </div>

                  {/* CONTENT */}
                  <div className="min-w-0">

                    <h4
                      className="
                        text-[18px]
                        font-semibold
                        text-slate-100
                        break-words
                      "
                    >
                      {expense.title}
                    </h4>

                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                        mt-2
                      "
                    >

                      {/* CATEGORY */}
                      <span
                        style={{
                          background:
                            `${categoryColors[expense.category]}15`,
                          color:
                            categoryColors[
                              expense.category
                            ],
                        }}
                        className="
                          px-3
                          py-1
                          rounded-full
                          text-[12px]
                          font-semibold
                        "
                      >
                        {
                          expense.category
                        }
                      </span>

                      {/* DATE */}
                      <span
                        className="
                          text-[13px]
                          text-slate-200
                        "
                      >
                        {formatExpenseDate(
                          expense.date
                        )}
                      </span>

                    </div>

                  </div>

                </div>

                {/* RIGHT */}
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    sm:justify-end
                    gap-3
                    w-full
                    sm:w-auto
                  "
                >

                  {/* AMOUNT */}
                  <div
                    className="
                      text-[24px]
                      font-bold
                      text-slate-100
                      tracking-tight
                    "
                  >
                    ₹
                    {Number(
                      expense.amount
                    ).toLocaleString()}
                  </div>

                  {/* ACTIONS */}
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >

                    {/* EDIT */}
                    <button
                      onClick={() =>
                        onEditExpense(
                          expense
                        )
                      }
                      className="
                        w-[42px]
                        h-[42px]
                        rounded-xl
                        border
                        border-blue-200
                        bg-blue-50
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <Pencil
                        size={17}
                        color="#2563EB"
                      />

                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        onDeleteExpense(
                          expense.id
                        )
                      }
                      className="
                        w-[42px]
                        h-[42px]
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <Trash2
                        size={18}
                        color="#DC2626"
                      />

                    </button>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}