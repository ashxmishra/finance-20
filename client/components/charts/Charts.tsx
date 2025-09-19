import { PieChart as RPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RPTooltip, BarChart as RBarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const COLORS = ["#10b981", "#6366f1", "#f59e0b", "#ef4444", "#06b6d4", "#84cc16", "#a855f7", "#f97316"];

export function PieChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RPieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
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

export function BarChart({ data }: { data: { name: string; income: number; expenses: number }[] }) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <RPTooltip />
          <Legend />
          <Bar dataKey="income" fill="#10b981" />
          <Bar dataKey="expenses" fill="#ef4444" />
        </RBarChart>
      </ResponsiveContainer>
    </div>
  );
}
