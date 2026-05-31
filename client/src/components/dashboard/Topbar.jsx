"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
} from "lucide-react";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

import NotificationDropdown from "./NotificationDropdown";

function getGreeting() {

  const h =
    new Date().getHours();

  if (h < 12)
    return "Good morning";

  if (h < 17)
    return "Good afternoon";

  return "Good evening";
}

export default function Topbar({
  setSidebarOpen,
}) {

  const router =
    useRouter();

  // REFS
  const profileDropdownRef =
    useRef(null);

  const notificationDropdownRef =
    useRef(null);

  // STATES
  const [showMenu, setShowMenu] =
    useState(false);

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  const [today] = useState(() =>
    new Date().toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    )
  );

  const [greeting] = useState(
    () => getGreeting()
  );

  const [user, setUser] =
    useState(null);

  // LOAD
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

    function handleClickOutside(
      event
    ) {

      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(
          event.target
        )
      ) {

        setShowMenu(false);
      }

      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(
          event.target
        )
      ) {

        setShowNotifications(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      unsubscribe();

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  // LOGOUT
  async function handleLogout() {

    try {

      await signOut(auth);

      router.push("/login");

    } catch (error) {

      console.log(error);

      alert("Logout failed");
    }
  }

  // USER
  const displayName =
    user?.displayName ||
    "Guest User";

  const firstName =
    displayName.split(" ")[0];

  const avatarLetter =
    firstName
      .charAt(0)
      .toUpperCase();

  return (
    <div
      className="
        flex
        flex-col
        lg:flex-row
        lg:items-start
        lg:justify-between
        gap-6
        mb-7
      "
    >

      {/* LEFT */}
      <div
        className="
          flex
          items-start
          gap-4
          min-w-0
        "
      >

        {/* MOBILE MENU */}
       <button
  onClick={() =>
    setSidebarOpen(true)
  }
  className="
    xl:hidden
    flex
    items-center
    justify-center
    w-11
    h-11
    rounded-2xl
    border
    border-gray-200
    bg-slate-800
    shadow-sm
    shrink-0
  "
>

  <div
    className="
      flex
      items-center
      gap-[3px]
    "
  >

    <div
      className="
        w-[3px]
        h-5
        rounded-full
        bg-green-500
      "
    />

    <Menu
      size={18}
      color="#111827"
    />

  </div>

</button>

        {/* TEXT */}
        <div className="min-w-0">

          <p
            className="
              text-[11px]
              sm:text-[12px]
              font-semibold
              tracking-[0.12em]
              uppercase
              text-slate-500
              mb-2
            "
          >
            {today}
          </p>

          <h1
            className="
              text-[28px]
              sm:text-[40px]
              lg:text-[46px]
              leading-[1]
              font-bold
              tracking-tight
              text-slate-100
              break-words
            "
          >
            {greeting},{" "}
            {firstName}
          </h1>

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
            Track spending,
            manage budgets,
            and stay financially
            aware.
          </p>

        </div>

      </div>

      {/* RIGHT */}
      <div
        className="
          flex
          items-center
          justify-between
          sm:justify-end
          gap-3
          w-full
          lg:w-auto
        "
      >

        {/* NOTIFICATIONS */}
        <div
          ref={
            notificationDropdownRef
          }
          className="relative"
        >

          <button
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
            className="
              relative
              w-[46px]
              h-[46px]
              sm:w-[52px]
              sm:h-[52px]
              rounded-2xl
              border
              border-gray-200
              bg-slate-800
              flex
              items-center
              justify-center
              shadow-sm
            "
          >

            <Bell
              size={18}
              color="#6B7280"
            />

            {/* GREEN DOT */}
            <span
              className="
                absolute
                top-[11px]
                right-[11px]
                sm:top-[14px]
                sm:right-[14px]
                w-2
                h-2
                rounded-full
                bg-green-500
              "
            />

          </button>

          {/* NOTIFICATION DROPDOWN */}
          {showNotifications && (

            <div
              className="
                absolute
                top-[60px]
                left-0
                sm:left-auto
                sm:right-0
                w-[300px]
                sm:w-[380px]
                max-w-[calc(100vw-32px)]
                z-[100]
              "
            >

              <NotificationDropdown />

            </div>

          )}

        </div>

        {/* PROFILE */}
        <div
          ref={profileDropdownRef}
          className="relative"
        >

          {/* PROFILE CARD */}
          <div
            onClick={() =>
              setShowMenu(
                !showMenu
              )
            }
            className="
              bg-slate-800
              border
              border-gray-200
              rounded-[18px]
              px-3
              py-2
              flex
              items-center
              gap-3
              cursor-pointer
              shadow-sm
              min-w-0
            "
          >

            {/* AVATAR */}
            <div
              className="
                w-[42px]
                h-[42px]
                rounded-[14px]
                bg-green-600
                flex
                items-center
                justify-center
                text-white
                font-bold
                text-[15px]
                shrink-0
              "
            >
              {avatarLetter}
            </div>

            {/* INFO */}
            <div className="min-w-0">

              <p
                className="
                  text-[14px]
                  font-semibold
                  text-slate-100
                  truncate
                  max-w-[120px]
                  sm:max-w-[180px]
                "
              >
                {displayName}
              </p>

              <p
                className="
                  text-[12px]
                  text-slate-200
                  mt-[2px]
                "
              >
                Free Plan
              </p>

            </div>

            <ChevronDown
              size={16}
              color="#9CA3AF"
            />

          </div>

          {/* PROFILE DROPDOWN */}
          {showMenu && (

            <div
              className="
                absolute
                top-[74px]
                right-0
                w-[180px]
                bg-slate-800
                border
                border-gray-200
                rounded-2xl
                shadow-2xl
                overflow-hidden
                z-[999]
              "
            >

              <button
                onClick={
                  handleLogout
                }
                className="
                  w-full
                  px-4
                  py-4
                  flex
                  items-center
                  gap-3
                  text-[14px]
                  font-medium
                  text-red-600
                  hover:bg-red-50
                  transition
                "
              >

                <LogOut
                  size={16}
                />

                Logout

              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}
