"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Image from "next/image";

import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

import {
  subscribeToExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
} from "@/lib/firestore";

import ExpenseOverview from "@/components/dashboard/ExpenseOverview";

import RecentExpenses from "@/components/dashboard/RecentExpenses";

import AddExpenseModal from "@/components/dashboard/AddExpenseModal";

import toast from "react-hot-toast";

const filters = [
  "All",
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Other",
];

export default function ExpensesPage() {

  // USER
  const [user, setUser] =
    useState(null);

  // EXPENSES
  const [expenses, setExpenses] =
    useState([]);

  // FILTER
  const [
    activeFilter,
    setActiveFilter,
  ] = useState("All");

  // SEARCH
  const [searchQuery, setSearchQuery] =
    useState("");

  // MODAL
  const [
    expenseModalOpen,
    setExpenseModalOpen,
  ] = useState(false);

  // EDITING
  const [
    editingExpense,
    setEditingExpense,
  ] = useState(null);

  // LOAD USER + REALTIME
  useEffect(() => {

    const unsubscribeAuth =
      onAuthStateChanged(
        auth,
        (currentUser) => {

          if (!currentUser) return;

          setUser(currentUser);

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

  // FILTERED EXPENSES
  const filteredExpenses =
    useMemo(() => {

      return expenses.filter(
        (expense) => {

          const query =
            searchQuery.toLowerCase();

          const matchesFilter =
            activeFilter === "All" ||

            expense.category
              ?.toLowerCase() ===
            activeFilter.toLowerCase();

          const matchesSearch =

            expense.title
              ?.toLowerCase()
              .includes(query) ||

            expense.category
              ?.toLowerCase()
              .includes(query);

          return (
            matchesFilter &&
            matchesSearch
          );
        }
      );

    }, [
      expenses,
      activeFilter,
      searchQuery,
    ]);

  // ADD
  async function handleAddExpense(
    expenseData
  ) {

    try {

      await addExpense({
        ...expenseData,
        userId: user.uid,
        createdAt: Date.now(),
      });

      toast.success(
        "Expense added successfully"
      );

    } catch (error) {

      toast.error(
        "Failed to add expense"
      );
    }
  }

  // DELETE
  async function handleDeleteExpense(
    expenseId
  ) {

    try {

      await deleteExpense(
        expenseId
      );

      toast.success(
        "Expense deleted"
      );

    } catch (error) {

      toast.error(
        "Delete failed"
      );
    }
  }

  // EDIT CLICK
  function handleEditExpense(
    expense
  ) {

    setEditingExpense(
      expense
    );

    setExpenseModalOpen(
      true
    );
  }

  // UPDATE
  async function handleUpdateExpense(
    updatedData
  ) {

    try {

      await updateExpense(
        editingExpense.id,
        updatedData
      );

      toast.success(
        "Expense updated"
      );

      setEditingExpense(
        null
      );

      setExpenseModalOpen(
        false
      );

    } catch (error) {

      toast.error(
        "Update failed"
      );
    }
  }

  return (
    <main
      className="
        min-h-screen
        bg-[#F5F7FB]
        p-4
        sm:p-6
        lg:p-8
      "
      style={{
        fontFamily:
          "'Inter', sans-serif",
      }}
    >

      <div
        className="
          max-w-[1400px]
          mx-auto
        "
      >

        {/* HERO */}
        <div
          className="
            flex
            flex-col
            xl:flex-row
            xl:items-end
            xl:justify-between
            gap-6
            mb-8
          "
        >

          {/* LEFT */}
          <div className="min-w-0">

            {/* LOGO */}
            <div
              className="
                flex
                items-center
                gap-4
                mb-5
              "
            >

              <Image
                src="/logo/finsight-logo.svg"
                alt="FinSight AI"
                width={54}
                height={54}
                className="
                  rounded-xl
                "
              />

              <div>

                <p
                  className="
                    text-[11px]
                    sm:text-[12px]
                    font-bold
                    text-green-600
                    tracking-[0.14em]
                    uppercase
                    mb-1
                  "
                >
                  FinSight AI
                </p>

                <span
                  className="
                    text-[13px]
                    text-slate-200
                  "
                >
                  Smart Expense Tracking
                </span>

              </div>

            </div>

            {/* TITLE */}
            <h1
              className="
                text-[40px]
                sm:text-[54px]
                leading-[0.95]
                font-bold
                tracking-[-0.06em]
                text-slate-900
                break-words
              "
            >
              Expense
              <br />
              Management
            </h1>

            {/* DESCRIPTION */}
            <p
              className="
                mt-5
                text-[15px]
                sm:text-[17px]
                leading-7
                text-slate-200
                max-w-[720px]
              "
            >
              Track, filter,
              organize, and analyze
              your financial
              transactions in
              realtime.
            </p>

          </div>

          {/* SEARCH */}
          <div
            className="
              w-full
              xl:w-[380px]
              relative
              shrink-0
            "
          >

            <Search
              size={18}
              color="#6B7280"
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
              "
            />

            <input
              type="text"
              placeholder="Search title or category..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              className="
                w-full
                h-[54px]
                rounded-2xl
                border
                border-gray-200
                bg-slate-900
                pl-12
                pr-4
                text-[15px]
                outline-none
                text-slate-100
                shadow-sm
              "
            />

          </div>

        </div>

        {/* OVERVIEW */}
        <div className="mb-6">

          <ExpenseOverview
            expenses={expenses}
          />

        </div>

        {/* FILTERS */}
        <div
          className="
            flex
            items-center
            gap-3
            flex-wrap
            mb-7
          "
        >

          {/* FILTER ICON */}
          <div
            className="
              w-[46px]
              h-[46px]
              rounded-2xl
              bg-slate-900
              border
              border-gray-200
              flex
              items-center
              justify-center
              shadow-sm
            "
          >

            <SlidersHorizontal
              size={18}
              color="#111827"
            />

          </div>

          {/* FILTER BUTTONS */}
          {filters.map((filter) => {

            const active =
              activeFilter ===
              filter;

            return (
              <button
                key={filter}
                onClick={() => {

                  setActiveFilter(
                    filter
                  );

                  if (
                    filter === "All"
                  ) {

                    setSearchQuery(
                      ""
                    );
                  }

                }}
                className={`
                  h-[46px]
                  px-5
                  rounded-2xl
                  text-[14px]
                  font-semibold
                  transition
                  shadow-sm
                  ${
                    active
                      ? "bg-green-600 text-white"
                      : "bg-slate-800 text-gray-700 border border-gray-200"
                  }
                `}
              >
                {filter}
              </button>
            );
          })}

        </div>

        {/* RECENT EXPENSES */}
        <RecentExpenses
          expenses={
            filteredExpenses
          }
          allExpenses={expenses}
          onAddExpense={() => {

            setEditingExpense(
              null
            );

            setExpenseModalOpen(
              true
            );

          }}
          onDeleteExpense={
            handleDeleteExpense
          }
          onEditExpense={
            handleEditExpense
          }
        />

        {/* MODAL */}
        <AddExpenseModal
          open={expenseModalOpen}
          onClose={() => {

            setExpenseModalOpen(
              false
            );

            setEditingExpense(
              null
            );

          }}
          onAddExpense={
            handleAddExpense
          }
          editingExpense={
            editingExpense
          }
          onUpdateExpense={
            handleUpdateExpense
          }
        />

      </div>

    </main>
  );
}