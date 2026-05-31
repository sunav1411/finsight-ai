"use client";
import {
  addNotification,
} from "@/lib/firestore";

import {
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  getPrediction,
} from "@/lib/ai";

import { auth } from "@/lib/firebase";

import {
  addExpense,
  subscribeToExpenses,
  deleteExpense,
  updateExpense,
  getUserBudget,
} from "@/lib/firestore";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import QuickActions from "@/components/dashboard/QuickActions";
import FinancialWorkspace from "@/components/dashboard/FinancialWorkspace";
import AddExpenseModal from "@/components/dashboard/AddExpenseModal";
import RecentExpenses from "@/components/dashboard/RecentExpenses";
import ExpenseOverview from "@/components/dashboard/ExpenseOverview";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import ExpenseFilters from "@/components/dashboard/ExpenseFilters";
import ExpenseSearch from "@/components/dashboard/ExpenseSearch";
import BudgetOverview from "@/components/dashboard/BudgetOverview";
import SavingsInsights from "@/components/dashboard/SavingsInsights";
import SpendingInsights from "@/components/dashboard/SpendingInsights";
import MonthlySpendingChart from "@/components/charts/MonthlySpendingChart";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import ImportModal from "@/components/ImportModal";
import AIInsightsPanel from "@/components/dashboard/AIInsightsPanel";
import AIChatPanel from "@/components/dashboard/AIChatPanel";

export default function DashboardPage() {

  // USER
  const [user, setUser] =
    useState(null);

  // EXPENSE STATE
  const [expenses, setExpenses] =
    useState([]);
  const [budget, setBudget] =
  useState(0);

  // FILTER STATE
  const [
    activeFilter,
    setActiveFilter,
  ] = useState("All");

  // SEARCH STATE
  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  // MODAL STATE
  const [
    expenseModalOpen,
    setExpenseModalOpen,
  ] = useState(false);

  // EDITING STATE
  const [
    editingExpense,
    setEditingExpense,
  ] = useState(null);
  
  const [
  aiData,
  setAiData
] = useState(null); 
const [
  aiLoading,
  setAiLoading
] = useState(false);

  const [sidebarOpen, setSidebarOpen] =
  useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
 // =========================
// LOAD USER + REALTIME
// =========================
useEffect(() => {

  const unsubscribeAuth =
    onAuthStateChanged(
      auth,
      (currentUser) => {

        if (!currentUser) {

  window.location.href =
    "/login";

  return;
}

        setUser(currentUser);
        getUserBudget(
  currentUser.uid
).then((savedBudget) => {

  setBudget(
    Number(savedBudget || 0)
  );

});

        const unsubscribeExpenses =
          subscribeToExpenses(
            currentUser.uid,
            (liveExpenses) => {

              setExpenses(
                liveExpenses
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

  
// =========================
// AI PREDICTION
// =========================
useEffect(() => {

async function fetchAI() {

  if (
    expenses.length === 0
  ) return;

  try {

    setAiLoading(true);

const aiExpenses =
  expenses.map(
    (expense) => ({

      amount: Number(
        expense.amount
      ),

      category:
        expense.category ||
        "Other",

      date:
        expense.date,
    })
  );

const result =
  await getPrediction(

    aiExpenses,

    budget
  );

    setAiData(result);

  } catch (error) {

    console.error(
      "AI Fetch Error:",
      error
    );

  } finally {

    setAiLoading(false);
  }
}

  fetchAI();

}, [expenses]);

  // =========================
  // ADD EXPENSE
  // =========================
  async function handleAddExpense(
    expense
  ) {

    if (!user) return;

    const expenseData = {
      ...expense,

      userId: user.uid,

      createdAt:
        Date.now(),
    };

    // SAVE TO FIRESTORE
    await addExpense(
      expenseData
    );

    await addNotification({

  userId: user.uid,

  title: "Expense Added",

  message:
    `${expenseData.title} expense of ₹${expenseData.amount} added.`,

  type: "success",

  createdAt: Date.now(),
});

    // REFRESH
    
  }

  // =========================
  // DELETE EXPENSE
  // =========================
  async function handleDeleteExpense(
    expenseId
  ) {

    // DELETE FROM FIRESTORE
    await deleteExpense(
      expenseId
    );

    // REFRESH
    
  }

  // =========================
  // OPEN EDIT MODAL
  // =========================
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

// =========================
// UPDATE EXPENSE
// =========================
async function handleUpdateExpense(
  updatedExpense
) {

  // UPDATE FIRESTORE
  await updateExpense(
    editingExpense.id,
    updatedExpense
  );

  setEditingExpense(
    null
  );

  setExpenseModalOpen(
    false
  );
}

  // =========================
  // CLOSE MODAL
  // =========================
  function handleCloseModal() {

    setExpenseModalOpen(
      false
    );

    setEditingExpense(
      null
    );
  }

  // =========================
  // FILTERED + SEARCHED
  // =========================
  const filteredExpenses =
    expenses.filter(
      (expense) => {

        // CATEGORY MATCH
        const matchesCategory =
          activeFilter === "All"
            ? true
            : expense.category ===
              activeFilter;

        // SEARCH MATCH
        const matchesSearch =
          expense.title
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            );

        return (
          matchesCategory &&
          matchesSearch
        );
      }
    );

  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          backgroundColor:
            "#0F172A",
        }}
      >
        {/* SIDEBAR */}
        <Sidebar
  sidebarOpen={sidebarOpen}
  setSidebarOpen={setSidebarOpen}
/>

        {/* MAIN */}
<section
  className="
    flex-1
    xl:ml-[270px]
    overflow-y-auto
    p-4
    sm:p-6
    lg:p-7
    min-w-0
  "
>
          {/* TOPBAR */}
          <Topbar
  setSidebarOpen={setSidebarOpen}
/>

          {/* CONTENT */}
<div className="grid grid-cols-1 2xl:grid-cols-[1fr_340px] gap-5 items-start">
           
            {/* LEFT */}
            <div className="flex flex-col gap-5 min-w-0">
              {/* EXPENSE OVERVIEW */}
              <ExpenseOverview
                expenses={
                  filteredExpenses
                }
              />

              {/* BUDGET OVERVIEW */}
             <BudgetOverview
  expenses={filteredExpenses}
  budget={budget}
  setBudget={setBudget}
/>

              {/* SAVINGS INSIGHTS */}
              <SavingsInsights
  expenses={filteredExpenses}
  budget={budget}
/>

              {/* SPENDING INSIGHTS */}
<SpendingInsights
  expenses={filteredExpenses}
  budget={budget}
/>

{/* AI SNAPSHOT */}
<div
  style={{
    marginTop: "24px",
  }}
>

  <AIInsightsPanel
    aiData={aiData}
    aiLoading={aiLoading}
    onOpenFIA={() => {

      window.dispatchEvent(
        new Event("open-fia")
      );

    }}
  />

</div>

{/* AI WORKSPACE */}
<AIChatPanel

  expenses={expenses}

  budget={budget}

/>
              {/* ANALYTICS CHARTS */}
<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
  <MonthlySpendingChart
    expenses={filteredExpenses}
  />

  <CategoryPieChart
    expenses={filteredExpenses}
  />
</div>

              {/* QUICK ACTIONS */}
              <QuickActions
                onAddExpense={() => {

                  setEditingExpense(
                    null
                  );

                  setExpenseModalOpen(
                    true
                  );
                }}
              />

              {/* SEARCH */}
              <ExpenseSearch
                searchQuery={
                  searchQuery
                }

                setSearchQuery={
                  setSearchQuery
                }
              />

              {/* FILTERS */}
              <ExpenseFilters
                activeFilter={
                  activeFilter
                }

                setActiveFilter={
                  setActiveFilter
                }
              />

              {/* RECENT EXPENSES */}
              <RecentExpenses
                expenses={
                  filteredExpenses
                }

                allExpenses={
                  expenses
                }

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

              {/* CATEGORY BREAKDOWN */}
              <CategoryBreakdown
                expenses={
                  filteredExpenses
                }
              />
            </div>

            {/* RIGHT */}
            <FinancialWorkspace
              expenses={
                filteredExpenses
              }

              onAddExpense={() => {

                setEditingExpense(
                  null
                );

                setExpenseModalOpen(
                  true
                );
              }}
            />
          </div>
        </section>
      </main>

      {/* ADD / EDIT MODAL */}
      <AddExpenseModal
        open={
          expenseModalOpen
        }

        onClose={
          handleCloseModal
        }

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
    </>
  );
}