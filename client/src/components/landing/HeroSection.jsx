import Link from "next/link";
import FinancialThought from "./FinancialThought";

export default function HeroSection() {
  return (
    <section
      className="
        relative
        min-h-[90vh]
        flex
        items-center
        justify-center
        overflow-hidden
        px-6
        sm:px-8
        pb-16
      "
    >
      <div
        className="
          absolute
          inset-0
          pointer-events-none
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            top-[-180px]
            right-[-180px]
            h-[500px]
            w-[500px]
            rounded-full
            bg-sky-400/15
            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-[-220px]
            left-[-140px]
            h-[420px]
            w-[420px]
            rounded-full
            bg-amber-300/10
            blur-3xl
          "
        />
      </div>

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          w-full
          max-w-6xl
          flex-col
          items-center
          text-center
        "
      >
        <h1
          className="
            text-white
            font-extrabold
            tracking-tight
            leading-[0.92]
            text-[58px]
            sm:text-[84px]
            md:text-[110px]
            lg:text-[125px]
            xl:text-[135px]
          "
        >
          FinSight AI
        </h1>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
          AI-Powered Personal Finance Platform
        </div>

        <p
          className="
            mt-6
            max-w-3xl
            text-[18px]
            leading-relaxed
            text-zinc-300
            sm:text-[22px]
            md:text-[28px]
          "
        >
          Analyze spending behavior, surface budgeting opportunities,
          and turn raw transactions into clear financial decisions.
        </p>

        <div
          className="
            mt-7
            w-full
            max-w-[95%]
            sm:mt-8
            sm:max-w-2xl
          "
        >
          <FinancialThought />
        </div>

        <Link
          href="/login"
          className="
            mt-12
            rounded-2xl
            bg-amber-400
            px-8
            py-4
            text-[18px]
            font-bold
            text-slate-950
            shadow-lg
            transition-all
            duration-300
            hover:scale-105
            hover:bg-amber-300
            sm:mt-14
            sm:px-10
            sm:text-[22px]
          "
        >
          Explore Dashboard
        </Link>
      </div>
    </section>
  );
}
