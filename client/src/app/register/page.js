"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { registerUser } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] =
    useState({
      firstName: "",
      lastName: "",
      phone: "",
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
      firstName,
      lastName,
      phone,
      email,
      password,
    } = formData;

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !password
    ) {
      alert(
        "Please fill all fields."
      );
      return;
    }

    try {
      const userCredential =
        await registerUser(
          email,
          password
        );

      const fullName =
        `${firstName} ${lastName}`;

      await updateProfile(
        userCredential.user,
        {
          displayName:
            fullName,
        }
      );

      const userData = {
        uid:
          userCredential.user.uid,
        firstName,
        lastName,
        fullName,
        phone,
        email,
      };

      localStorage.setItem(
        "finsight-user",
        JSON.stringify(userData)
      );

      alert(
        "Account created successfully!"
      );

      router.push(
        "/dashboard"
      );

    } catch (error) {
      console.log(error);
      alert(
        error.message
      );
    }
  }

  return (
    <main className="flex min-h-screen overflow-hidden bg-[#F5F7FB]">
      <section className="relative hidden w-1/2 flex-col justify-evenly overflow-hidden bg-[#07111f] px-14 py-12 lg:flex">
        <div className="absolute -top-32 -left-32 h-[460px] w-[460px] rounded-full bg-sky-400/15 blur-3xl" />
        <div className="absolute bottom-0 left-40 h-[350px] w-[350px] rounded-full bg-blue-600/20 blur-[120px]"></div>

<div className="absolute top-1/2 left-1/3 h-[250px] w-[250px] rounded-full bg-cyan-400/10 blur-[100px]"></div>

        <div className="relative z-10 mx-auto max-w-xl">
          <div className="mb-14 flex items-center gap-5">
            <Image
              src="/logo/finsight-logo.svg"
              alt="FinSight AI Logo"
              width={64}
              height={64}
              className="rounded-2xl"
            />

            <div>
              <h1 className="text-6xl font-bold tracking-tight text-white">
                FinSight AI
              </h1>

              <p className="text-md uppercase tracking-wide text-sky-300">
                Personal Finance Intelligence
              </p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="mb-8 text-7xl font-bold leading-[1.02] tracking-tight text-white">
              Build Better <br />
              Financial Habits.
            </h2>

            <p className="max-w-lg text-2xl leading-relaxed text-zinc-300">
              Track expenses, manage budgets, and
              understand your spending patterns inside a cleaner AI-first workspace.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 backdrop-blur-xl">
        <span className="text-xl uppercase tracking-widest text-cyan-300">
        Crafted By
       </span>
       <span className="font-semibold text-white">
         Sunav Sunil Mattoo
        </span>
         </div>
         <div className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-200">
          Founder & Developer
         </div>

            <div className="mt-8 h-[2px] w-24 rounded-full bg-amber-300/60" />
          </div>

          <div className="grid grid-cols-2 gap-5">
            {[
              {
                title: "Expense Tracking",
                desc: "Track spending habits in real time.",
              },
              {
                title: "Budget Planning",
                desc: "Set monthly financial goals with more clarity.",
              },
              {
                title: "Category Insights",
                desc: "Organize expenses intelligently.",
              },
              {
                title: "Secure Workspace",
                desc: "Your financial data stays protected.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-slate-800/5 p-10 backdrop-blur-xl"
              >
                <h3 className="mb-2 font-semibold text-white">
                  {item.title}
                </h3>

                <p className="text-lg leading-relaxed text-zinc-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
  <div className="px-10 py-4 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-lg">
    ✓ Secure Authentication
  </div>

  <div className="px-10 py-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-lg">
    ✓ AI Powered Insights
  </div>

  <div className="px-10 py-4 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-lg">
    ✓ Real-Time Analytics
  </div>
</div>
        </div>
      </section>

      <section className="relative flex w-full items-center justify-center px-8 py-16 lg:w-1/2 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#020617] overflow-hidden">
      <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl"></div>

<div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"></div>
<div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]"></div>
       <div className="w-full max-w-4xl rounded-[32px] border border-white/10 bg-slate-900/70 backdrop-blur-xl p-8 shadow-2xl xl:p-10">
          <div className="mb-8">
            <h1 className="mb-3 text-7xl font-bold tracking-tight text-[#FFFFFF]">
              Create Account
            </h1>

            <p className="text-2xl text-zinc-100">
              Start managing your finances smarter.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-lg font-medium text-zinc-300">
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full rounded-2xl border border-zinc-300 bg-slate-100 px-5 py-4 text-[#111827] outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-300/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-lg font-medium text-zinc-100">
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full rounded-2xl border border-zinc-300 bg-slate-100 px-5 py-4 text-[#111827] outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-300/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-lg font-medium text-zinc-100">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91"
                className="w-full rounded-2xl border border-zinc-300 bg-slate-100 px-5 py-4 text-[#111827] outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-300/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-lg font-medium text-zinc-100">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="xyz@gmail.com"
                className="w-full rounded-2xl border border-zinc-300 bg-slate-100 px-5 py-4 text-[#111827] outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-300/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-lg font-medium text-zinc-100">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full rounded-2xl border border-zinc-300 bg-slate-100 px-5 py-4 text-[#111827] outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-300/10"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-2xl bg-amber-400 py-4 font-semibold text-slate-950 shadow-sm transition-all duration-300 hover:bg-amber-300"
            >
              Create Account
            </button>
          </form>

          <div className="mt-7 text-center">
            <p className="text-zinc-300">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-sky-600 transition hover:text-sky-700"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
