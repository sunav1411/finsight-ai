"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext =
  createContext();

export function ThemeProvider({
  children,
}) {

  const [darkMode,
    setDarkMode] =
    useState(false);

  useEffect(() => {

    const saved =
      localStorage.getItem(
        "darkMode"
      );

    if (saved === "true") {

      setDarkMode(true);
    }

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "darkMode",
      darkMode
    );

    document.body.style.background =
      darkMode
        ? "#0F172A"
        : "#F5F7FB";

    document.body.style.color =
      darkMode
        ? "#FFFFFF"
        : "#111827";

  }, [darkMode]);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {

  return useContext(
    ThemeContext
  );
}