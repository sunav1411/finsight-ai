"use client";

import { useEffect, useState } from "react";

const thoughts = [
  "Better data creates calmer money decisions.",
  "Every expense tells a story about your priorities.",
  "Forecasting turns financial stress into planning.",
  "Budgets work best when they feel personal.",
  "Awareness is the first compound return.",
];

export default function FinancialThought() {
  const [currentThought, setCurrentThought] =
    useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentThought(
        (prev) =>
          (prev + 1) %
          thoughts.length
      );
    }, 4000);

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <div
      className="
        w-full
        max-w-[92%]
        rounded-3xl
        border
        border-zinc-800
        bg-zinc-900/90
        px-5
        py-5
        shadow-2xl
        backdrop-blur-xl
        sm:max-w-2xl
        sm:px-8
      "
    >
      <p
        className="
          text-center
          text-[18px]
          italic
          leading-relaxed
          text-amber-200
          transition-all
          duration-500
          sm:text-[22px]
          md:text-[28px]
        "
      >
        &ldquo;{thoughts[currentThought]}&rdquo;
      </p>
    </div>
  );
}
