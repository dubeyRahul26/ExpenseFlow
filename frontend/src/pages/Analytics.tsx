import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import type { ValueType } from "recharts/types/component/DefaultTooltipContent";

import {
  useMonthlyAnalytics,
  useCategoryAnalytics,
} from "../api/useAnalytics";

/* ================= HELPERS ================= */

const formatCurrency = (value?: ValueType) => {
  if (value == null) return "₹0";

  if (Array.isArray(value)) {
    const v = Number(value[0]);
    return isNaN(v) ? "₹0" : `₹${v.toFixed(2)}`;
  }

  const num = Number(value);
  return isNaN(num) ? "₹0" : `₹${num.toFixed(2)}`;
};

/* Dark-friendly palette */
const COLORS = [
  "#6366F1", // indigo
  "#22C55E", // emerald
  "#F43F5E", // rose
  "#A855F7", // violet
  "#F59E0B", // amber
];

/* ================= CUSTOM TOOLTIP ================= */

const PieTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const { name, value } = payload[0];

  return (
    <div
      style={{
        background: "#020617",
        border: "1px solid #1E293B",
        borderRadius: 10,
        padding: "8px 12px",
        color: "#E5E7EB",
        fontSize: 12,
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
      }}
    >
      <div className="font-medium">{name}</div>
      <div>₹{Number(value).toFixed(2)}</div>
    </div>
  );
};

/* ================= COMPONENT ================= */

const Analytics = () => {
  const { data: monthly = [], isLoading: loadingMonthly } =
    useMonthlyAnalytics();

  const { data: categories = [], isLoading: loadingCategories } =
    useCategoryAnalytics();

  const monthlyData = monthly.map((item: any) => ({
    name: `${item.month}/${item.year}`,
    amount: Number(item.total.toFixed(2)),
  }));

  const categoryData = categories.map((c: any) => ({
    name: c.category,
    total: Number(c.total.toFixed(2)),
  }));

  const isMobile = window.matchMedia("(max-width: 640px)").matches;

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Analytics</h1>
        <p className="text-slate-400 mt-1">
          Visual insights into your spending
        </p>
      </div>

      {/* ================= MONTHLY SPENDING ================= */}
      <div className="rounded-xl bg-slate-900/70 backdrop-blur border border-slate-800 p-4 shadow-lg">
        <h2 className="font-semibold text-slate-100 mb-4">
          Monthly Spending
        </h2>

        {loadingMonthly ? (
          <p className="text-slate-400">Loading chart…</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <XAxis
                dataKey="name"
                stroke="#64748B"
                tick={{ fill: "#94A3B8", fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v: number) => formatCurrency(v)}
                stroke="#64748B"
                tick={{ fill: "#94A3B8", fontSize: 12 }}
                tickLine={false}
              />
              <Tooltip
                formatter={(v) => formatCurrency(v)}
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid #1E293B",
                  borderRadius: "10px",
                  color: "#E5E7EB",
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#818CF8"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ================= CATEGORY BREAKDOWN ================= */}
      <div className="rounded-xl bg-slate-900/70 backdrop-blur border border-slate-800 p-4 shadow-lg">
        <h2 className="font-semibold text-slate-100 mb-4">
          Category Breakdown
        </h2>

        {loadingCategories ? (
          <p className="text-slate-400">Loading chart…</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  innerRadius={45}
                  paddingAngle={2}
                  labelLine={false}
                  label={
                    isMobile
                      ? false
                      : ({
                          cx,
                          cy,
                          midAngle,
                          outerRadius,
                          percent,
                          name,
                        }) => {
                          if (
                            cx == null ||
                            cy == null ||
                            midAngle == null ||
                            outerRadius == null ||
                            percent == null
                          ) {
                            return null;
                          }

                          const RADIAN = Math.PI / 180;
                          const radius = outerRadius + 16;
                          const x =
                            cx +
                            radius *
                              Math.cos(-midAngle * RADIAN);
                          const y =
                            cy +
                            radius *
                              Math.sin(-midAngle * RADIAN);

                          return (
                            <text
                              x={x}
                              y={y}
                              fill="#E5E7EB"
                              fontSize={12}
                              textAnchor={
                                x > cx ? "start" : "end"
                              }
                              dominantBaseline="central"
                            >
                              {name} {(percent * 100).toFixed(0)}%
                            </text>
                          );
                        }
                  }
                >
                  {categoryData.map(
                    (_: unknown, index: number) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[index % COLORS.length]
                        }
                      />
                    )
                  )}
                </Pie>

                {/* NO BLACK BOX ANYMORE */}
                <Tooltip
                  content={<PieTooltip />}
                  wrapperStyle={{ outline: "none" }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* MOBILE LEGEND */}
            {isMobile && (
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {categoryData.map(
                  (item: any, index: number) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="h-3 w-3 rounded-sm"
                        style={{
                          background:
                            COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-slate-300">
                        {item.name}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;

