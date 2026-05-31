"use client";

const filters = [
  "All",
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
];

export default function ExpenseFilters({
  activeFilter,
  setActiveFilter,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
      {filters.map((filter) => {

        const active =
          activeFilter === filter;

        return (
          <button
            key={filter}
            onClick={() =>
              setActiveFilter(filter)
            }
            style={{
              height: "42px",
              padding: "0 18px",
              borderRadius: "999px",
              border: active
                ? "none"
                : "1px solid #E5E7EB",
              background: active
                ? "#16A34A"
                : "#FFFFFF",
              color: active
                ? "#FFFFFF"
                : "#374151",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}