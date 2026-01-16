import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    
  };

  const baseLink =
    "group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all";

  const inactive = "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60";

  const active =
    "text-slate-100 bg-gradient-to-r from-indigo-600/20 to-violet-600/20";

  return (
    <div className="min-h-screen flex bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* ================= SIDEBAR (DESKTOP) ================= */}
      <aside
        className="hidden md:flex w-64 flex-col
                   bg-slate-900/70 backdrop-blur
                   border-r border-slate-800"
      >
        <div className="p-6 text-xl font-bold text-slate-100 tracking-tight">
          ExpenseTracker
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {[
            { to: "/dashboard", label: "Dashboard" },
            { to: "/expenses", label: "Expenses" },
            { to: "/groups", label: "Groups" },
            { to: "/analytics", label: "Analytics" },
            { to: "/chat", label: "Chat" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? active : inactive}`
              }
            >
              <span className="h-2 w-2 rounded-full bg-indigo-400 opacity-0 group-hover:opacity-100 transition" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="m-4 rounded-lg border border-rose-500/30
                     text-rose-400 px-4 py-2 text-sm
                     hover:bg-rose-500/10 transition"
        >
          Logout
        </button>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto">
        <Outlet />
      </main>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav
        className="fixed bottom-0 left-0 right-0 md:hidden
                   bg-slate-900/80 backdrop-blur
                   border-t border-slate-800
                   grid grid-cols-5"
      >
        {[
          { to: "/dashboard", label: "Home" },
          { to: "/expenses", label: "Expenses" },
          { to: "/groups", label: "Groups" },
          { to: "/analytics", label: "Analytics" },
          { to: "/chat", label: "Chat" },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `py-3 text-xs text-center font-medium transition
               ${isActive ? "text-indigo-400" : "text-slate-400"}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default DashboardLayout;
