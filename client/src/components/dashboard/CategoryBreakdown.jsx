"use client";

const categoryColors = {
  Food: "#16A34A",
  Transport: "#2563EB",
  Shopping: "#9333EA",
  Bills: "#EA580C",
  Health: "#DC2626",
  Education: "#0EA5E9",
  Entertainment: "#DB2777",
  Other: "#6B7280",
};

export default function CategoryBreakdown({
  expenses,
}) {

  // CATEGORY TOTALS
  const categoryTotals = {};

  expenses.forEach((expense) => {
    if (
      categoryTotals[
        expense.category
      ]
    ) {
      categoryTotals[
        expense.category
      ] += expense.amount;
    } else {
      categoryTotals[
        expense.category
      ] = expense.amount;
    }
  });

  // TOTAL
  const totalSpent = expenses.reduce(
    (sum, expense) =>
      sum + expense.amount,
    0
  );

  // SORTED
  const sortedCategories =
    Object.entries(
      categoryTotals
    ).sort(
      (a, b) => b[1] - a[1]
    );

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: "28px",
        padding: "28px",
        fontFamily: "'Inter', sans-serif",
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          marginBottom: "28px",
        }}
      >
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
          Spending Insights
        </p>

        <h2
          style={{
            margin: 0,
            fontSize: "34px",
            fontWeight: 700,
            color: "#111827",
            letterSpacing: "-0.05em",
          }}
        >
          Category Breakdown
        </h2>

        <p
          style={{
            marginTop: "10px",
            fontSize: "15px",
            color: "#6B7280",
            lineHeight: 1.7,
          }}
        >
          Understand which categories
          consume most of your budget.
        </p>
      </div>

      {/* EMPTY */}
      {expenses.length === 0 ? (
        <div
          style={{
            border:
              "2px dashed #E5E7EB",
            borderRadius: "22px",
            padding: "50px 24px",
            textAlign: "center",
            color: "#6B7280",
            fontSize: "15px",
          }}
        >
          Add expenses to view category
          spending insights.
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {sortedCategories.map(
            ([category, amount]) => {

              const percentage =
                (
                  (amount /
                    totalSpent) *
                  100
                ).toFixed(1);

              return (
                <div
                  key={category}
                >
                  {/* TOP */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      marginBottom:
                        "10px",
                    }}
                  >
                    {/* LEFT */}
                    <div
                      style={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "14px",
                          height:
                            "14px",
                          borderRadius:
                            "999px",
                         background:
  categoryColors[category] ||
  "#6B7280",
                        }}
                      />

                      <span
                        style={{
                          fontSize:
                            "15px",
                          fontWeight:
                            600,
                          color:
                            "#111827",
                        }}
                      >
                        {category}
                      </span>
                    </div>

                    {/* RIGHT */}
                    <div
                      style={{
                        textAlign:
                          "right",
                      }}
                    >
                      <div
                        style={{
                          fontSize:
                            "16px",
                          fontWeight:
                            700,
                          color:
                            "#111827",
                        }}
                      >
                        ₹
                        {amount.toLocaleString()}
                      </div>

                      <div
                        style={{
                          fontSize:
                            "13px",
                          color:
                            "#6B7280",
                        }}
                      >
                        {percentage}%
                      </div>
                    </div>
                  </div>

                  {/* BAR */}
                  <div
                    style={{
                      height: "10px",
                      background:
                        "#E5E7EB",
                      borderRadius:
                        "999px",
                      overflow:
                        "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${percentage}%`,
                        height:
                          "100%",
                        background:
  categoryColors[category] ||
  "#6B7280",
                        borderRadius:
                          "999px",
                      }}
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}