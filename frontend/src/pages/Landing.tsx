import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Landing = () => {
  const { token } = useAuth();

  // If already logged in → go straight to app
  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-100 tracking-tight">
          ExpenseFlow
        </h1>

        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium
                       text-slate-300 hover:text-white
                       transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-lg text-sm font-medium
                       bg-linear-to-r from-indigo-500 to-violet-500
                       text-white hover:from-indigo-600 hover:to-violet-600
                       transition"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-28 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-slate-100 leading-tight">
          Track expenses.
          <br />
          Split fairly.
          <br />
          Stay in sync.
        </h2>

        <p className="mt-6 max-w-2xl mx-auto text-slate-400 text-lg">
          A modern expense tracker for individuals and groups.
          Track spending, settle balances, analyze trends, and chat
          in real-time — all in one place.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/register"
            className="px-6 py-3 rounded-xl font-medium
                       bg-linear-to-r from-indigo-500 to-violet-500
                       text-white hover:from-indigo-600 hover:to-violet-600
                       transition shadow-lg shadow-indigo-500/20"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 rounded-xl font-medium
                       border border-slate-700 text-slate-300
                       hover:bg-slate-800/60 hover:text-white
                       transition"
          >
            Login
          </Link>
        </div>
      </main>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Personal Expenses",
            desc: "Track daily spending with clarity and control.",
          },
          {
            title: "Group Splits",
            desc: "Split bills with friends and keep balances fair.",
          },
          {
            title: "Smart Analytics",
            desc: "Understand where your money goes every month.",
          },
          {
            title: "Group Chat",
            desc: "Discuss expenses and settlements in real time.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-xl bg-slate-900/70 backdrop-blur
                       border border-slate-800 p-5
                       hover:border-indigo-500/40
                       transition"
          >
            <h3 className="text-slate-100 font-semibold">
              {f.title}
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              {f.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} ExpenseTracker. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
