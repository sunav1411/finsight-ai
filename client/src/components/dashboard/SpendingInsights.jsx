"use client";

export default function SpendingInsights({
  expenses,
}) {

  // EMPTY STATE
  if (expenses.length === 0) {

    return (
      <div
        className="
          bg-slate-800
          border
          border-gray-200
          rounded-[28px]
          p-5
          sm:p-7
          shadow-sm
        "
      >

        <h2
          className="
            text-[32px]
            sm:text-[36px]
            font-bold
            tracking-tight
            text-slate-100
          "
        >
          Spending Insights
        </h2>

        <p
          className="
            mt-3
            text-[16px]
            text-slate-200
          "
        >
          Add expenses to unlock
          analytics.
        </p>

      </div>
    );
  }

  // TOTAL
  const totalSpent =
    expenses.reduce(
      (sum, expense) =>
        sum +
        Number(
          expense.amount || 0
        ),
      0
    );

  // AVERAGE
  const averageExpense =
    totalSpent /
    expenses.length;

  // BIGGEST
  const biggestExpense =
    [...expenses].sort(
      (a, b) =>
        b.amount - a.amount
    )[0];

  // CATEGORY TOTALS
  const categoryTotals = {};

  expenses.forEach((expense) => {

    if (
      !categoryTotals[
        expense.category
      ]
    ) {

      categoryTotals[
        expense.category
      ] = 0;
    }

    categoryTotals[
      expense.category
    ] += Number(
      expense.amount || 0
    );
  });

  // TOP CATEGORY
  let topCategory = "None";

  let topCategoryAmount = 0;

  Object.entries(
    categoryTotals
  ).forEach(
    ([category, amount]) => {

      if (
        amount >
        topCategoryAmount
      ) {

        topCategory =
          category;

        topCategoryAmount =
          amount;
      }
    }
  );

  // DAILY AVERAGE
  const dailyAverage =
    totalSpent / 30;

  return (
    <div
      className="
        bg-slate-800
        border
        border-gray-200
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
            text-green-600
            uppercase
            tracking-[0.12em]
            mb-2
          "
        >
          Spending Analytics
        </p>

        <h2
          className="
            text-[34px]
            sm:text-[38px]
            leading-tight
            font-bold
            tracking-tight
            text-slate-200
          "
        >
          Smart Insights
        </h2>

        <p
          className="
            mt-3
            text-[15px]
            sm:text-[16px]
            text-slate-200
            leading-7
            max-w-[620px]
          "
        >
          Understand your spending
          behavior with realtime
          financial analytics.
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

        {/* TOP CATEGORY */}
        <InsightCard
          title="Top Category"
          value={topCategory}
          sub={`₹${topCategoryAmount.toLocaleString()} spent`}
        />

        {/* BIGGEST */}
        <InsightCard
          title="Biggest Expense"
          value={`₹${biggestExpense.amount.toLocaleString()}`}
          sub={biggestExpense.title}
        />

        {/* AVERAGE */}
        <InsightCard
          title="Average Expense"
          value={`₹${averageExpense.toFixed(0)}`}
          sub="Per transaction"
        />

        {/* DAILY */}
        <InsightCard
          title="Daily Burn Rate"
          value={`₹${dailyAverage.toFixed(0)}`}
          sub="Average daily spend"
        />

      </div>

    </div>
  );
}

function InsightCard({
  title,
  value,
  sub,
}) {

  return (
    <div
      className="
        bg-gray-50
        border
        border-gray-200
        rounded-[22px]
        p-5
        sm:p-6
      "
    >

      <p
        className="
          text-[13px]
          text-slate-900
          mb-3
        "
      >
        {title}
      </p>

      <h3
        className="
          text-[30px]
          sm:text-[34px]
          leading-tight
          font-bold
          tracking-tight
          text-slate-900
          break-words
        "
      >
        {value}
      </h3>

      <p
        className="
          mt-3
          text-[14px]
          text-slate-600
          leading-6
          break-words
        "
      >
        {sub}
      </p>

    </div>
  );
}