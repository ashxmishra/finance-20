import {
  PieChart as RPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RPTooltip,
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = [
  "#10b981",
  "#6366f1",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#84cc16",
  "#a855f7",
  "#f97316",
];

export function PieChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RPieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <RPTooltip />
        </RPieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarChart({
  data,
}: {
  data: { name: string; income: number; expenses: number }[];
}) {
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");
  const axisColor = isDark ? "#e5e7eb" : "#334155";
  const formatINR = (n: number) => {
    if (n >= 1e7) return `₹${(n / 1e7).toFixed(1)}Cr`;
    if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`;
    if (n >= 1e3) return `₹${(n / 1e3).toFixed(0)}K`;
    return `₹${n}`;
  };
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RBarChart
          data={data}
          margin={{ top: 8, right: 16, left: 28, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fill: axisColor, fontSize: 12 }}
            tickMargin={8}
            axisLine={{ stroke: axisColor }}
          />
          <YAxis
            tick={{ fill: axisColor, fontSize: 12 }}
            tickFormatter={formatINR}
            tickMargin={8}
            axisLine={{ stroke: axisColor }}
          />
          <RPTooltip
            formatter={(v: any) => [
              typeof v === "number" ? `₹${v.toLocaleString()}` : v,
              "",
            ]}
          />
          <Legend />
          <Bar dataKey="income" name="Income" fill="#10b981" />
          <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
        </RBarChart>
      </ResponsiveContainer>
    </div>
  );
}
