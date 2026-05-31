"use client";

import Link from "next/link";
import {
  useRouter,
  usePathname,
} from "next/navigation";
import {
  useEffect,
  useState,
} from "react";
import {
  LayoutDashboard,
  Wallet,
  BarChart3,
  CalendarDays,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  CircleDollarSign,
} from "lucide-react";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: Wallet,
    label: "Expenses",
    href: "/dashboard/expenses",
  },
  {
    icon: CircleDollarSign,
    label: "Budgets",
    href: "/dashboard/budgets",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    href: "/dashboard/analytics",
  },
  {
    icon: CalendarDays,
    label: "Calendar",
    href: "/dashboard/calendar",
  },
  {
    icon: FileText,
    label: "Reports",
    href: "/dashboard/reports",
  },
];

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const router =
    useRouter();

  const pathname =
    usePathname();

  const [user, setUser] =
    useState(null);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(
            currentUser
          );
        }
      );

    return () =>
      unsubscribe();
  }, []);

  const displayName =
    user?.displayName ||
    "Guest User";

  const firstName =
    displayName.split(" ")[0];

  const avatarLetter =
    firstName
      .charAt(0)
      .toUpperCase();

  async function handleLogout() {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.log(error);
      alert(
        "Logout failed."
      );
    }
  }

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            xl:hidden
          "
        />
      )}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          w-[270px]
          bg-[#07111f]
          transition-transform
          duration-300
          xl:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full xl:translate-x-0"
          }
        `}
        style={{
          background: "#07111f",
          borderRight:
            "1px solid #16233A",
          display: "flex",
          flexDirection:
            "column",
          justifyContent:
            "space-between",
          padding:
            "22px 16px",
          fontFamily:
            "'Inter', sans-serif",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: 16,
              marginBottom: 38,
              padding: "0 6px",
            }}
          >
            <img
              src="/logo/finsight-logo.svg"
              alt="FinSight AI"
              style={{
                width: 52,
                height: 52,
                flexShrink: 0,
                objectFit:
                  "contain",
              }}
            />

            <div>
              <h2
                style={{
                  fontSize: 24,
                  color:
                    "#FFFFFF",
                  margin: 0,
                  fontWeight: 700,
                  letterSpacing:
                    "-0.03em",
                }}
              >
                FinSight AI
              </h2>

              <p
                style={{
                  margin:
                    "2px 0 0",
                  fontSize: 12,
                  color:
                    "#7DD3FC",
                  letterSpacing:
                    "0.08em",
                  textTransform:
                    "uppercase",
                }}
              >
                Finance Intelligence
              </p>
            </div>
          </div>

          <p
            style={{
              fontSize: 11,
              color: "#4B6475",
              textTransform:
                "uppercase",
              letterSpacing:
                "0.12em",
              marginBottom: 14,
              paddingLeft: 8,
              fontWeight: 600,
            }}
          >
            Main Menu
          </p>

          <nav
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: 6,
            }}
          >
            {navItems.map(
              ({
                icon: Icon,
                label,
                href,
              }) => {
                const active =
                  pathname ===
                  href;

                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={() =>
                      setSidebarOpen(
                        false
                      )
                    }
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: 14,
                      padding:
                        "14px 14px",
                      borderRadius: 14,
                      textDecoration:
                        "none",
                      background:
                        active
                          ? "linear-gradient(135deg, #F6C96A 0%, #57C7FF 100%)"
                          : "transparent",
                      color: active
                        ? "#08111F"
                        : "#A8BAC7",
                      transition:
                        "0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background:
                          active
                            ? "rgba(255,255,255,0.18)"
                            : "#0D1728",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        border: active
                          ? "none"
                          : "1px solid #1D2A44",
                      }}
                    >
                      <Icon
                        size={17}
                        color={
                          active
                            ? "#08111F"
                            : "#6B8797"
                        }
                      />
                    </div>

                    <span
                      style={{
                        fontSize: 15,
                        fontWeight:
                          active
                            ? 700
                            : 500,
                        flex: 1,
                      }}
                    >
                      {label}
                    </span>

                    {active && (
                      <ChevronRight
                        size={16}
                        color="rgba(8,17,31,0.7)"
                      />
                    )}
                  </Link>
                );
              }
            )}
          </nav>
        </div>

        <div>
          <Link
            href="/dashboard/settings"
            onClick={() =>
              setSidebarOpen(
                false
              )
            }
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: 12,
              padding: "14px",
              borderRadius: 14,
              textDecoration:
                "none",
              color: "#A8BAC7",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background:
                  "#0D1728",
                border:
                  "1px solid #1D2A44",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
              }}
            >
              <Settings
                size={17}
                color="#6B8797"
              />
            </div>

            <span
              style={{
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              Settings
            </span>
          </Link>

          <div
            style={{
              background:
                "#0D1728",
              border:
                "1px solid #1D2A44",
              borderRadius: 18,
              padding: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background:
                    "#F6C96A",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  color: "#08111F",
                  fontWeight: 700,
                  fontSize: 15,
                  flexShrink: 0,
                }}
              >
                {avatarLetter}
              </div>

              <div
                style={{
                  flex: 1,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color:
                      "#FFFFFF",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {displayName}
                </p>

                <p
                  style={{
                    margin:
                      "3px 0 0",
                    color:
                      "#6B8797",
                    fontSize: 12,
                  }}
                >
                  Free Plan
                </p>
              </div>

              <button
                onClick={
                  handleLogout
                }
                style={{
                  background:
                    "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                }}
              >
                <LogOut
                  size={18}
                  color="#6B8797"
                />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
