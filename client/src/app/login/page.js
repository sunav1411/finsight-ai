"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const {
      email,
      password,
    } = formData;

    if (
      !email ||
      !password
    ) {
      alert(
        "Please fill all fields."
      );
      return;
    }

    try {
      await loginUser(
        email,
        password
      );

      alert(
        "Login successful!"
      );

      router.push(
        "/dashboard"
      );

    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  return (
    <main className="flex min-h-screen overflow-hidden bg-[#07111f] text-white">
      <section className="relative hidden w-1/2 flex-col justify-evenly overflow-hidden bg-gradient-to-br from-[#11213a] via-[#07111f] to-[#1c1632] px-14 py-12 lg:flex">
        <div className="absolute -top-32 -left-32 h-[460px] w-[460px] rounded-full bg-sky-400/15 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-xl">
          <div className="mb-14 flex items-center gap-4">
            <Image
              src="/logo/finsight-logo.svg"
              alt="FinSight AI Logo"
              width={60}
              height={60}
              className="rounded-2xl"
            />

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                FinSight AI
              </h1>

              <p className="text-sm text-sky-300">
                Personal Finance Intelligence
              </p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="mb-8 text-4xl font-bold leading-[1.02] tracking-tight xl:text-5xl">
              Understand <br />
              Your Money <br />
              Better.
            </h2>

            <p className="max-w-lg text-lg leading-relaxed text-zinc-400">
              Analyze expenses, detect patterns,
              and build smarter financial habits with AI-driven insights.
            </p>

            <div className="mt-8 h-[2px] w-24 rounded-full bg-amber-300/60" />
            <div className="mt-6 inline-flex items-center rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2">
  <span className="text-sky-300 font-medium">
    🚀 Created by Sunav Sunil Mattoo
  </span>
</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {[
              {
                title: "Smart Tracking",
                desc: "Monitor daily expenses and understand spending habits clearly.",
              },
              {
                title: "AI Insights",
                desc: "Get focused suggestions to improve financial decisions.",
              },
              {
                title: "Budget Planning",
                desc: "Create smarter monthly budgets and reduce wasteful spending.",
              },
              {
                title: "Secure Analytics",
                desc: "Your financial data stays private with secure authentication.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-xl transition-all duration-300 hover:border-sky-300/30"
              >
                <h3 className="mb-2 text-lg font-semibold">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-zinc-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex w-full items-center justify-center bg-gradient-to-br from-[#07111f] via-[#0d1728] to-[#111827] px-8 py-16 lg:w-1/2">
        <div className="w-full max-w-md rounded-[32px] border border-zinc-800 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-2xl xl:p-10">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-5xl font-bold tracking-tight">
              Welcome Back
            </h1>

            <p className="text-zinc-400">
              Login to continue your financial journey.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full rounded-2xl border border-zinc-700 bg-black/70 px-5 py-4 text-white outline-none transition-all focus:border-sky-300 focus:ring-2 focus:ring-sky-300/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-zinc-700 bg-black/70 px-5 py-4 text-white outline-none transition-all focus:border-sky-300 focus:ring-2 focus:ring-sky-300/20"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-sky-300 transition hover:text-sky-200"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-amber-400 py-4 font-bold text-slate-950 shadow-xl transition-all duration-300 hover:scale-[1.01] hover:bg-amber-300"
            >
              Login
            </button>
          </form>

          <div className="mt-7 text-center">
            <p className="text-zinc-400">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-sky-300 transition hover:text-sky-200"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </section>
      <div className="fixed bottom-8 w-full text-center z-50">
  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-slate-900/70 px-6 py-3 backdrop-blur-md shadow-[0_0_30px_rgba(34,211,238,0.15)]">
    <span className="text-slate-400 text-sm tracking-widest uppercase">
      Crafted By
    </span>

    <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-2xl font-black text-transparent">
      Sunav Sunil Mattoo
    </span>
  </div>
</div>
    </main>
  );
}
