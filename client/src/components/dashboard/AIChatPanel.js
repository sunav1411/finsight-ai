"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  Bot,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import {
  AI_BASE_URL,
} from "@/lib/config";

export default function AIChatPanel({
  expenses = [],
  budget = 0,
}) {
  const [open, setOpen] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([
      {
        role: "assistant",
        text:
          "Hey, I'm FIA. Ask me about your spending, forecasts, savings, or financial activity.",
      },
    ]);

  useEffect(() => {
    function handleOpenFIA() {
      setOpen(true);
    }

    window.addEventListener(
      "open-fia",
      handleOpenFIA
    );

    return () => {
      window.removeEventListener(
        "open-fia",
        handleOpenFIA
      );
    };
  }, []);

  async function sendMessage() {
    if (!message.trim()) {
      return;
    }

    const userMessage = {
      role: "user",
      text: message,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    const currentMessage =
      message;

    setMessage("");

    try {
      const response = await fetch(
        `${AI_BASE_URL}/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message:
              currentMessage,
            expenses,
            budget,
          }),
        }
      );

      const data =
        await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            data.response ||
            "No response generated.",
        },
      ]);

    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "Unable to connect to AI engine.",
        },
      ]);
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() =>
            setOpen(true)
          }
          className="
            fixed
            bottom-4
            right-4
            z-[9999]
            flex
            h-[66px]
            w-[66px]
            items-center
            justify-center
            overflow-hidden
            rounded-[24px]
            border
            border-white/20
            shadow-2xl
            sm:bottom-6
            sm:right-6
            sm:h-[74px]
            sm:w-[74px]
            sm:rounded-[28px]
          "
          style={{
            background:
              "linear-gradient(135deg,#F6C96A,#57C7FF)",
            boxShadow:
              "0 18px 50px rgba(87,199,255,0.28)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg,rgba(255,255,255,0.22),transparent)",
            }}
          />

          <div
            className="
              relative
              flex
              flex-col
              items-center
              justify-center
            "
          >
            <Sparkles
              size={18}
              color="#08111F"
            />

            <span
              className="
                text-[10px]
                font-black
                tracking-wide
                text-slate-900
                sm:text-[11px]
              "
            >
              FIA
            </span>
          </div>
        </button>
      )}

      {open && (
        <div
          onClick={() =>
            setOpen(false)
          }
          className="
            fixed
            inset-0
            z-[9997]
            backdrop-blur-md
          "
          style={{
            background:
              "rgba(5,10,18,0.45)",
          }}
        />
      )}

      {open && (
        <div
          className="
            fixed
            inset-x-2
            bottom-2
            top-2
            z-[9998]
            flex
            h-auto
            w-auto
            flex-col
            overflow-hidden
            rounded-[28px]
            border
            border-white/20
            sm:left-auto
            sm:right-8
            sm:top-[50%]
            sm:h-[82vh]
            sm:w-[430px]
            sm:rounded-[34px]
          "
          style={{
            transform:
              window.innerWidth >= 640
                ? "translateY(-50%)"
                : "none",
            background:
              "linear-gradient(180deg,rgba(255,248,230,0.96),rgba(223,241,252,0.95))",
            backdropFilter:
              "blur(28px)",
            boxShadow:
              "0 40px 120px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              position:
                "absolute",
              width: 240,
              height: 240,
              borderRadius:
                "999px",
              background:
                "#F6C96A",
              filter:
                "blur(90px)",
              opacity: 0.18,
              top: -60,
              left: -80,
            }}
          />

          <div
            style={{
              position:
                "absolute",
              width: 220,
              height: 220,
              borderRadius:
                "999px",
              background:
                "#57C7FF",
              filter:
                "blur(90px)",
              opacity: 0.2,
              bottom: -80,
              right: -60,
            }}
          />

          <div
            className="
              relative
              z-10
              border-b
              px-4
              pb-4
              pt-5
              sm:px-7
              sm:pb-5
              sm:pt-7
            "
            style={{
              borderColor:
                "rgba(15,23,42,0.08)",
            }}
          >
            <div
              className="
                flex
                items-start
                justify-between
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                  sm:gap-4
                "
              >
                <div
                  className="
                    flex
                    h-[52px]
                    w-[52px]
                    items-center
                    justify-center
                    rounded-[18px]
                    sm:h-[58px]
                    sm:w-[58px]
                    sm:rounded-[22px]
                  "
                  style={{
                    background:
                      "linear-gradient(135deg,#FFF1C5,#D9F2FF)",
                    boxShadow:
                      "0 10px 30px rgba(87,199,255,0.18)",
                  }}
                >
                  <Bot
                    size={24}
                    color="#1E293B"
                  />
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing:
                        "0.22em",
                      textTransform:
                        "uppercase",
                      color:
                        "#4B5563",
                      marginBottom: 4,
                    }}
                  >
                    FinSight AI Copilot
                  </div>

                  <h2
                    style={{
                      fontSize:
                        window.innerWidth < 640
                          ? 38
                          : 48,
                      lineHeight: 1,
                      fontWeight: 900,
                      color:
                        "#07111F",
                      letterSpacing:
                        "-0.06em",
                    }}
                  >
                    FIA
                  </h2>
                </div>
              </div>

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="
                  flex
                  h-10
                  w-10
                  flex-shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  sm:h-11
                  sm:w-11
                  sm:rounded-2xl
                "
                style={{
                  background:
                    "rgba(255,255,255,0.42)",
                }}
              >
                <X
                  size={20}
                  color="#07111F"
                />
              </button>
            </div>
          </div>

          <div
            className="
              relative
              z-10
              flex-1
              overflow-y-auto
              px-4
              py-4
              sm:px-6
              sm:py-5
            "
          >
            <div
              className="
                flex
                flex-col
                gap-4
                sm:gap-5
              "
            >
              {messages.map(
                (msg, index) => (
                  <div
                    key={index}
                    className={
                      msg.role ===
                      "user"
                        ? "flex justify-end"
                        : "flex justify-start"
                    }
                  >
                    <div
                      className="
                        max-w-[88%]
                        break-words
                        rounded-[24px]
                        px-4
                        py-3
                        sm:max-w-[85%]
                        sm:rounded-[28px]
                        sm:px-5
                        sm:py-4
                      "
                      style={{
                        background:
                          msg.role ===
                          "user"
                            ? "linear-gradient(135deg,#FFE9B0,#CBEAFF)"
                            : "rgba(255,255,255,0.45)",
                        color:
                          "#0F172A",
                        lineHeight:
                          1.8,
                        fontSize:
                          window.innerWidth < 640
                            ? 15
                            : 16,
                        boxShadow:
                          "0 10px 24px rgba(15,23,42,0.06)",
                        border:
                          "1px solid rgba(255,255,255,0.38)",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div
            className="
              relative
              z-10
              border-t
              p-3
              sm:p-5
            "
            style={{
              borderColor:
                "rgba(15,23,42,0.08)",
            }}
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <input
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key ===
                    "Enter"
                  ) {
                    sendMessage();
                  }
                }}
                placeholder="Ask FIA about your spending..."
                className="
                  min-w-0
                  flex-1
                  rounded-[20px]
                  px-5
                  text-[15px]
                  outline-none
                  sm:h-[64px]
                  sm:rounded-[24px]
                  sm:px-6
                  sm:text-[16px]
                "
                style={{
                  height: 56,
                  background:
                    "rgba(255,255,255,0.48)",
                  color:
                    "#07111F",
                  border:
                    "1px solid rgba(255,255,255,0.4)",
                }}
              />

              <button
                onClick={
                  sendMessage
                }
                className="
                  flex
                  h-[56px]
                  w-[56px]
                  flex-shrink-0
                  items-center
                  justify-center
                  rounded-[20px]
                  sm:h-[64px]
                  sm:w-[64px]
                  sm:rounded-[24px]
                "
                style={{
                  background:
                    "linear-gradient(135deg,#F6C96A,#57C7FF)",
                  boxShadow:
                    "0 15px 35px rgba(87,199,255,0.24)",
                }}
              >
                <Send
                  size={18}
                  color="#07111F"
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
