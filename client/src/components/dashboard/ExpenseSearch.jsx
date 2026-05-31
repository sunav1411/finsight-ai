"use client";

import { Search } from "lucide-react";

export default function ExpenseSearch({
  searchQuery,
  setSearchQuery,
}) {
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      {/* ICON */}
      <Search
        size={18}
        color="#9CA3AF"
        style={{
          position: "absolute",
          top: "50%",
          left: "18px",
          transform:
            "translateY(-50%)",
        }}
      />

      {/* INPUT */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) =>
          setSearchQuery(
            e.target.value
          )
        }
        placeholder="Search expenses..."
        style={{
          width: "100%",
          height: "56px",
          borderRadius: "18px",
          border: "1px solid #E5E7EB",
          background: "#FFFFFF",
          padding: "0 18px 0 50px",
          fontSize: "15px",
          color: "#111827",
          outline: "none",
          fontFamily:
            "'Inter', sans-serif",
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.04)",
        }}
      />
    </div>
  );
}