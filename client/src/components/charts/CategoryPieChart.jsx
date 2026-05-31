"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import {
  useEffect,
  useState,
} from "react";

const categoryColors = {
  Food: "#22C55E",
  Transport: "#3B82F6",
  Shopping: "#EF4444",
  Bills: "#F97316",
  Health: "#8B5CF6",
  Entertainment: "#F59E0B",
  Education: "#06B6D4",
  Other: "#6B7280",
};

export default function CategoryPieChart({
  expenses = [],
}) {

  const [isMobile, setIsMobile] =
    useState(false);

  useEffect(() => {

    const handleResize = () => {

      setIsMobile(
        window.innerWidth < 640
      );
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );

  }, []);

  // CATEGORY DATA
  const categoryData =
    expenses.reduce(
      (acc, expense) => {

        const category =
          expense.category ||
          "Other";

        const existing =
          acc.find(
            (item) =>
              item.name ===
              category
          );

        if (existing) {

          existing.value +=
            Number(
              expense.amount || 0
            );

        } else {

          acc.push({
            name: category,
            value: Number(
              expense.amount || 0
            ),
          });
        }

        return acc;

      },
      []
    );

  // TOTAL SPENT
  const totalSpent =
    categoryData.reduce(
      (sum, item) =>
        sum + item.value,
      0
    );

  // TOP CATEGORY
  const topCategory =
    [...categoryData].sort(
      (a, b) =>
        b.value - a.value
    )[0];

  return (

    <div
      className="
        relative
        overflow-hidden
        rounded-[26px]
        border
        border-white/10
        bg-gradient-to-br
        from-[#0F172A]
        via-[#172554]
        to-[#111827]
        p-4
        sm:p-6
        shadow-[0_10px_40px_rgba(0,0,0,0.18)]
      "
    >

      {/* TOP GLOW */}
      <div
        className="
          absolute
          top-[-120px]
          right-[-120px]
          w-[240px]
          h-[240px]
          rounded-full
          bg-green-500/10
          blur-3xl
        "
      />

      {/* HEADER */}
      <div
        className="
          relative
          z-10
          mb-4
        "
      >

        <p
          className="
            text-[10px]
            sm:text-[11px]
            uppercase
            tracking-[0.3em]
            text-green-400
            font-bold
            mb-2
          "
        >
          Financial Composition
        </p>

        <h2
          className="
            text-[26px]
            sm:text-[32px]
            font-bold
            text-white
            tracking-tight
            leading-none
          "
        >
          Spending Share
        </h2>

        <p
          className="
            text-[13px]
            sm:text-sm
            text-gray-300
            mt-2
            leading-6
            max-w-[500px]
          "
        >
          Analyze how your expenses
          are distributed across
          categories and identify
          your strongest spending
          patterns.
        </p>

      </div>

      {/* CHART */}
      <div
        className="
          relative
          w-full
          h-[220px]
          sm:min-h-[320px]
        "
      >

        <ResponsiveContainer
  width="100%"
  height={isMobile ? 220 : 320}
>

          <PieChart>

            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              innerRadius={
                isMobile
                  ? 46
                  : 72
              }
              outerRadius={
                isMobile
                  ? 74
                  : 115
              }
              paddingAngle={4}
              stroke="none"
            >

              {categoryData.map(
                (
                  entry,
                  index
                ) => (

                  <Cell
                    key={index}
                    fill={
                      categoryColors[
                        entry.name
                      ] || "#6B7280"
                    }
                  />
                )
              )}

            </Pie>

            {!isMobile && (

              <Tooltip

                cursor={false}

                wrapperStyle={{
                  zIndex: 50,
                }}

                contentStyle={{
                  borderRadius:
                    "16px",

                  border:
                    "1px solid rgba(255,255,255,0.06)",

                  background:
                    "#111827",

                  color: "#fff",

                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.25)",

                  fontSize:
                    "12px",

                  padding:
                    "10px 12px",
                }}

                itemStyle={{
                  color:
                    "#fff",
                }}

                formatter={(
                  value,
                  name
                ) => [

                  `₹${Number(
                    value
                  ).toLocaleString()}`,

                  name,
                ]}
              />

            )}

          </PieChart>

        </ResponsiveContainer>

        {/* CENTER CONTENT */}
        <div
          className="
            absolute
            inset-0
            flex
            flex-col
            items-center
            justify-center
            pointer-events-none
            text-center
          "
        >

          <p
            className="
text-slate-300
text-[10px]
sm:text-xs
tracking-wide
uppercase
              mb-1
            "
          >
            Total Spent
          </p>

<h2
  className="
    text-[20px]
    sm:text-[34px]
    font-semibold
    text-white
    tracking-tight
    leading-none
  "
>
  ₹{totalSpent.toLocaleString()}
</h2>

        </div>

      </div>

      {/* FOOTER CARD */}
      {topCategory && (

        <div
          className="
            relative
            z-10
            mt-2
            rounded-2xl
            border
            border-white/10
            bg-slate-800/5
            backdrop-blur-xl
            px-4
            py-4
            sm:px-5
            sm:py-5
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              flex-wrap
            "
          >

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.15em]
                  text-slate-300
                  mb-2
                "
              >
                Top Category
              </p>

              <h3
                className="
                  text-lg
                  sm:text-2xl
                  font-semibold
                  text-white
                  break-words
                "
              >
                {topCategory.name}
              </h3>

            </div>

            <div
              className="
                text-right
              "
            >

              <p
                className="
                  text-[11px]
                  uppercase
                  tracking-[0.12em]
                  text-slate-300
                  mb-1
                "
              >
                Amount
              </p>

              <span
                className="
                  text-green-400
                  text-lg
                  sm:text-2xl
                  font-bold
                "
              >
                ₹{topCategory.value.toLocaleString()}
              </span>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}