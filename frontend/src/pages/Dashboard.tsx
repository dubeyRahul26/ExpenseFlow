import { usePersonalAnalytics } from "../api/useAnalytics";

/* ================= FORMATTERS ================= */

const formatMoney = (value?: number) => {
  if (value == null || isNaN(value)) return "₹0.00";
  return `₹${value.toFixed(2)}`;
};

const formatInt = (value?: number) => {
  if (value == null || isNaN(value)) return "0";
  return Math.round(value).toString();
};

/* ================= STAT CARD ================= */

interface StatCardProps {
  title: string;
  value: string;
  loading?: boolean;
  highlight?: "positive" | "negative";
}

const StatCard = ({ title, value, loading, highlight }: StatCardProps) => (
  <div
    className="relative rounded-xl overflow-hidden
                  bg-slate-900/70 backdrop-blur
                  border border-slate-800
                  p-5 shadow-lg hover:shadow-indigo-500/10 transition"
  >
    <div
      className="absolute inset-x-0 top-0 h-1
                    bg-linear-to-r from-indigo-500 to-violet-500"
    />

    <p className="text-sm text-slate-400">{title}</p>

    {loading ? (
      <div className="mt-4 h-8 w-28 rounded bg-slate-700 animate-pulse" />
    ) : (
      <p
        className={`mt-3 text-2xl font-bold ${
          highlight === "positive"
            ? "text-emerald-400"
            : highlight === "negative"
            ? "text-rose-400"
            : "text-slate-100"
        }`}
      >
        {value}
      </p>
    )}
  </div>
);

/* ================= DASHBOARD ================= */

const Dashboard = () => {
  const { data, isLoading, isError } = usePersonalAnalytics();

  if (isError) {
    return (
      <div
        className="rounded-lg border border-rose-500/30
                      bg-rose-500/10 p-4 text-rose-400"
      >
        Failed to load dashboard data
      </div>
    );
  }

  const netBalance = data?.netBalance ?? 0;

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="mt-1 text-slate-400">
          Overview of your expenses and balances
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Net Balance"
          value={formatMoney(netBalance)}
          loading={isLoading}
          highlight={
            netBalance > 0
              ? "positive"
              : netBalance < 0
              ? "negative"
              : undefined
          }
        />

        <StatCard
          title="Total Spent (This Month)"
          value={formatMoney(data?.totalSpent)}
          loading={isLoading}
        />

        <StatCard
          title="Expenses Logged"
          value={formatInt(data?.count)}
          loading={isLoading}
        />

        <StatCard
          title="Active Groups"
          value={formatInt(data?.groupsCount)}
          loading={isLoading}
        />
      </div>

      {/* Recent Expenses */}
      <div
        className="rounded-xl bg-slate-900/70 backdrop-blur
                      border border-slate-800 shadow-lg"
      >
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-slate-100">
            Recent Expenses
          </h2>
        </div>

        <div className="max-h-90 overflow-y-auto divide-y divide-slate-800">
          {isLoading && (
            <div className="p-5 space-y-3">
              <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-slate-700 rounded w-1/2 animate-pulse" />
              <div className="h-4 bg-slate-700 rounded w-2/3 animate-pulse" />
            </div>
          )}

          {!isLoading && data?.recent?.length === 0 && (
            <p className="p-5 text-sm text-slate-400">
              No recent expenses.
            </p>
          )}

          {data?.recent?.map((expense) => (
            <div
              key={expense._id}
              className="p-5 flex justify-between items-center text-sm
                         hover:bg-slate-800/60 transition"
            >
              <div>
                <p className="font-medium text-slate-100">
                  {expense.title || expense.category}
                </p>
                <p className="text-slate-400">
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>

              <p className="font-semibold text-slate-100">
                ₹{expense.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
