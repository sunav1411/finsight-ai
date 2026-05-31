"use client";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import { auth } from "@/lib/firebase";

export default function DashboardLayout({
  children,
}) {

  const router =
    useRouter();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {

          // NOT LOGGED IN
          if (!user) {

  router.push(
    "/login"
  );

} else {

  setLoading(false);
}
        }
      );

    return () =>
      unsubscribe();

  }, [router]);

  // LOADING SCREEN
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          background:
            "#F5F7FB",
          fontFamily:
            "Inter, sans-serif",
        }}
      >
        <h1
          style={{
            color:
              "#16A34A",
            fontSize:
              "24px",
          }}
        >
          Loading...
        </h1>
      </div>
    );
  }

  return children;
}