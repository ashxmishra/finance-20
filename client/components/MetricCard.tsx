import { cn } from "@/lib/utils";

export default function MetricCard({ title, value, accent }: { title: string; value: string | number; accent?: "green" | "red" | "blue" | "amber" }) {
  const acc = accent === "green" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : accent === "red" ? "bg-rose-500/10 text-rose-700 dark:text-rose-300" : accent === "amber" ? "bg-amber-500/10 text-amber-700 dark:text-amber-300" : "bg-primary/10 text-primary";
  return (
    <div className={cn("rounded-xl border p-4 bg-card", acc)}>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
