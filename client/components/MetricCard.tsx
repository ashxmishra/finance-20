import { cn } from "@/lib/utils";

export default function MetricCard({
  title,
  value,
  accent,
}: {
  title: string;
  value: string | number;
  accent?: "green" | "red" | "blue" | "amber";
}) {
  const acc =
    accent === "green"
      ? "from-emerald-500/20 to-emerald-500/0 border-emerald-200/50"
      : accent === "red"
        ? "from-rose-500/20 to-rose-500/0 border-rose-200/50"
        : accent === "amber"
          ? "from-amber-500/20 to-amber-500/0 border-amber-200/50"
          : "from-primary/20 to-primary/0 border-primary/30";
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4 shadow-sm relative overflow-hidden",
        `before:absolute before:inset-0 before:bg-gradient-to-br ${acc} before:pointer-events-none`,
      )}
    >
      <div className="relative">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          {title}
        </div>
        <div className="text-2xl font-semibold mt-1">{value}</div>
      </div>
    </div>
  );
}
