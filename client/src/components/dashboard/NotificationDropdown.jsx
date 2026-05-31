"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Bell,
} from "lucide-react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

import {
  subscribeToNotifications,
} from "@/lib/firestore";

export default function NotificationDropdown() {

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  useEffect(() => {

    let unsubscribeFirestore;

    const unsubscribeAuth =
      onAuthStateChanged(
        auth,
        (user) => {

          if (!user) return;

          unsubscribeFirestore =
            subscribeToNotifications(
              user.uid,
              (
                notificationsData
              ) => {

                setNotifications(
                  notificationsData
                );
              }
            );
        }
      );

    return () => {

      unsubscribeAuth();

      if (
        unsubscribeFirestore
      ) {

        unsubscribeFirestore();
      }
    };

  }, []);

  return (

    <div
      className="
        w-full
        bg-slate-800
        border
        border-gray-200
        rounded-2xl
        shadow-2xl
        overflow-hidden
      "
    >

      {/* HEADER */}
      <div
        className="
          px-5
          py-4
          border-b
          border-gray-100
        "
      >

        <h3
          className="
            text-[18px]
            font-bold
            text-slate-100
          "
        >
          Notifications
        </h3>

        <p
          className="
            mt-1
            text-[13px]
            text-slate-200
          "
        >
          Recent financial activity
        </p>

      </div>

      {/* LIST */}
      <div
        className="
          max-h-[420px]
          overflow-y-auto
        "
      >

        {notifications.length ===
        0 ? (

          <div
            className="
              px-5
              py-10
              flex
              flex-col
              items-center
              justify-center
              text-center
            "
          >

            <Bell
              size={36}
              color="#CBD5E1"
            />

            <p
              className="
                mt-4
                text-[14px]
                text-slate-200
              "
            >
              No notifications yet
            </p>

          </div>

        ) : (

          notifications.map(
            (
              notification
            ) => (

              <div
                key={
                  notification.id
                }
                className="
                  px-5
                  py-4
                  border-b
                  border-gray-50
                "
              >

                <p
                  className="
                    text-[14px]
                    font-bold
                    text-slate-100
                  "
                >
                  {
                    notification.title
                  }
                </p>

                <p
                  className="
                    mt-1
                    text-[13px]
                    text-slate-200
                    leading-6
                  "
                >
                  {
                    notification.message
                  }
                </p>

              </div>

            )
          )

        )}

      </div>

    </div>

  );
}