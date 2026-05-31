"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function MonthlySpendingChart({
  expenses = [],
}) {

  // MONTHLY DATA
  const monthlyData =
    expenses.reduce(
      (acc, expense) => {

        let date;

        if (expense.date) {

          date = new Date(
            expense.date
          );

        } else if (
          expense.createdAt?.toDate
        ) {

          date =
            expense.createdAt.toDate();

        } else {

          return acc;
        }

        // MONTH + YEAR
        const month =
          date.toLocaleString(
            "default",
            {
              month: "short",
              year: "numeric",
            }
          );

        const existing =
          acc.find(
            (item) =>
              item.month ===
              month
          );

        if (existing) {

          existing.total +=
            Number(
              expense.amount || 0
            );

        } else {

          acc.push({
            month,
            total: Number(
              expense.amount || 0
            ),
          });
        }

        return acc;

      },
      []
    );

  // CURRENT VS PREVIOUS
  const current =
    monthlyData[
      monthlyData.length - 1
    ]?.total || 0;

  const previous =
    monthlyData[
      monthlyData.length - 2
    ]?.total || 0;

  const hasPreviousMonth =
    previous > 0;

  const growth =
    hasPreviousMonth
      ? (
          ((current -
            previous) /
            previous) *
          100
        ).toFixed(1)
      : null;

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-gray-200
        bg-slate-800
        p-6
        shadow-sm
      "
    >

      {/* HEADER */}
      <div className="mb-6">

        <p
          className="
            text-xs
            uppercase
            tracking-[0.22em]
            text-green-600
            font-semibold
            mb-3
          "
        >
          Spending Momentum
        </p>

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >

          <div>

            <h2
              className="
                text-[34px]
                leading-tight
                font-bold
                text-slate-100
                tracking-tight
              "
            >
              Spending Trend
            </h2>

            <p
              className="
                text-sm
                text-slate-200
                mt-2
                leading-7
                max-w-[420px]
              "
            >
              Understand how your
              spending evolves over
              time through realtime
              transaction analytics.
            </p>

          </div>

          <div
            className="
              rounded-2xl
              bg-green-50
              px-5
              py-4
              border
              border-green-100
              min-w-[140px]
            "
          >

            <p
              className="
                text-xs
                text-green-700
                mb-1
              "
            >
              Monthly Change
            </p>

            <h3
              className="
                text-2xl
                font-bold
                text-green-700
              "
            >
              {growth !== null
                ? growth > 0
                  ? `↑ ${growth}%`
                  : `${growth}%`
                : "New Data"}
            </h3>

          </div>

        </div>

      </div>

      {/* CHART */}
      <div className="w-full min-h-[320px] min-w-0">

<ResponsiveContainer
  width="100%"
  height={320}
>

          <AreaChart
            data={monthlyData}
          >

            <defs>

              <linearGradient
                id="greenGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor="#16A34A"
                  stopOpacity={0.35}
                />

                <stop
                  offset="95%"
                  stopColor="#16A34A"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#E5E7EB"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6B7280",
                fontSize: 13,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6B7280",
                fontSize: 13,
              }}
            />

            <Tooltip
              contentStyle={{
                borderRadius:
                  "18px",

                border:
                  "1px solid #E5E7EB",

                boxShadow:
                  "0 10px 40px rgba(0,0,0,0.08)",

                background:
                  "#FFFFFF",
              }}

              formatter={(value) => [

                `₹${Number(
                  value
                ).toLocaleString()}`,

                "Spent",
              ]}
            />

            <Area
              type="monotone"

              dataKey="total"

              stroke="#16A34A"

              strokeWidth={4}

              fill="url(#greenGradient)"

              dot={{
                r: 5,
                strokeWidth: 2,
              }}

              activeDot={{
                r: 7,
              }}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}