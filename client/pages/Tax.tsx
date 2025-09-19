import AppLayout from "@/components/layout/AppLayout";
import MetricCard from "@/components/MetricCard";
import { useFinance } from "@/context/FinanceContext";
import { exportFinanceToExcel } from "@/utils/exportToExcel";
import { useMemo, useState } from "react";

export default function Tax() {
  const { incomes, expenses, reminders, savings } = useFinance();
  const [variant, setVariant] = useState<"ITR" | "GST">("ITR");
  const [mode, setMode] = useState<"all" | "month" | "range">("all");
  const [month, setMonth] = useState<string>(
    new Date().toISOString().slice(0, 7),
  );
  const [from, setFrom] = useState<string>(
    new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10),
  );
  const [to, setTo] = useState<string>(new Date().toISOString().slice(0, 10));
  const [includeRem, setIncludeRem] = useState(true);
  const [includeSav, setIncludeSav] = useState(true);
  const [includeLinks, setIncludeLinks] = useState(true);

  const inRange = (iso: string) => {
    const d = iso.slice(0, 10);
    if (mode === "all") return true;
    if (mode === "month") return d.startsWith(month);
    return d >= from && d <= to;
  };

  const filtered = useMemo(() => {
    const fi = incomes.filter((i) => inRange(i.date));
    const fe = expenses.filter((e) => inRange(e.date));
    const fr = reminders.filter((r) => inRange(r.dueDate));
    const fs = savings.filter((s) => !s.date || inRange(s.date));
    const ti = fi.reduce((a, b) => a + (Number(b.amount) || 0), 0);
    const te = fe.reduce((a, b) => a + (Number(b.amount) || 0), 0);
    return { fi, fe, fr, fs, ti, te, sv: ti - te };
  }, [incomes, expenses, reminders, savings, mode, month, from, to]);

  const filename = useMemo(() => {
    const base = `fintrack-${variant.toLowerCase()}`;
    if (mode === "all") return `${base}-all`;
    if (mode === "month") return `${base}-${month}`;
    return `${base}-${from}_to_${to}`;
  }, [variant, mode, month, from, to]);

  function handleDownload() {
    const inc = filtered.fi.map((i) => ({
      date: i.date,
      source: i.source,
      amount: i.amount,
      ...(includeLinks ? { invoiceUrl: i.invoiceUrl } : {}),
    }));
    const exp = filtered.fe.map((e) => ({
      date: e.date,
      category: e.category,
      amount: e.amount,
      ...(includeLinks ? { receiptUrl: e.receiptUrl } : {}),
    }));
    const rem = includeRem
      ? filtered.fr.map((r) => ({
          title: r.title,
          dueDate: r.dueDate,
          amount: r.amount,
        }))
      : [];
    const sav = includeSav
      ? filtered.fs.map((s) => ({
          name: s.name,
          amount: s.amount,
          date: s.date,
        }))
      : [];
    exportFinanceToExcel({
      incomes: inc as any,
      expenses: exp as any,
      reminders: rem as any,
      savings: sav as any,
      variant,
    });
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold">ITR / GST Export</h1>
          <p className="text-muted-foreground mt-1">
            Filter your data, preview totals, and export a tailored Excel file.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="Total Income"
            value={`₹${filtered.ti.toLocaleString()}`}
            accent="green"
          />
          <MetricCard
            title="Total Expenses"
            value={`₹${filtered.te.toLocaleString()}`}
            accent="red"
          />
          <MetricCard
            title="Savings"
            value={`₹${filtered.sv.toLocaleString()}`}
            accent={filtered.sv >= 0 ? "green" : "red"}
          />
          <MetricCard
            title="Rows"
            value={`${filtered.fi.length + filtered.fe.length + (includeRem ? filtered.fr.length : 0) + (includeSav ? filtered.fs.length : 0)}`}
            accent="amber"
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <div className="font-semibold">Filing</div>
            <div className="mt-3 flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="v"
                  checked={variant === "ITR"}
                  onChange={() => setVariant("ITR")}
                />{" "}
                ITR
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="v"
                  checked={variant === "GST"}
                  onChange={() => setVariant("GST")}
                />{" "}
                GST
              </label>
            </div>
            <div className="mt-4 font-semibold">Date Range</div>
            <div className="mt-2 space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="m"
                  checked={mode === "all"}
                  onChange={() => setMode("all")}
                />{" "}
                All time
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="m"
                  checked={mode === "month"}
                  onChange={() => setMode("month")}
                />{" "}
                Month
              </label>
              {mode === "month" && (
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full border rounded-md px-2 py-2 bg-background"
                />
              )}
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="m"
                  checked={mode === "range"}
                  onChange={() => setMode("range")}
                />{" "}
                Custom range
              </label>
              {mode === "range" && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="border rounded-md px-2 py-2 bg-background"
                  />
                  <input
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="border rounded-md px-2 py-2 bg-background"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <div className="font-semibold">Include Sheets</div>
            <div className="mt-3 space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeRem}
                  onChange={(e) => setIncludeRem(e.target.checked)}
                />{" "}
                Reminders
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeSav}
                  onChange={(e) => setIncludeSav(e.target.checked)}
                />{" "}
                Savings
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeLinks}
                  onChange={(e) => setIncludeLinks(e.target.checked)}
                />{" "}
                Include invoice/receipt URLs
              </label>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              File name will include your selection:{" "}
              <span className="font-medium text-foreground">
                {filename}.xlsx
              </span>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <div className="font-semibold">Export</div>
            <p className="text-sm text-muted-foreground mt-1">
              Click to generate and download the Excel file.
            </p>
            <button
              onClick={handleDownload}
              className="mt-4 w-full px-4 py-2 rounded-md bg-gradient-to-r from-primary to-accent text-primary-foreground shadow"
            >
              Download {variant} Excel
            </button>
            <div className="mt-4 text-xs text-muted-foreground">
              Tip: Use month filter to export monthly GST returns easily.
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-5">
            <div className="font-semibold mb-2">
              Income preview ({filtered.fi.length})
            </div>
            <div className="max-h-60 overflow-auto text-sm divide-y">
              {filtered.fi.slice(0, 20).map((i, idx) => (
                <div
                  key={(i.id || idx) + "fi"}
                  className="py-2 flex justify-between"
                >
                  <div className="font-medium">{i.source}</div>
                  <div className="text-muted-foreground">
                    {i.date} • ₹{Number(i.amount || 0).toLocaleString()}
                  </div>
                </div>
              ))}
              {filtered.fi.length === 0 && (
                <div className="text-sm text-muted-foreground">No rows</div>
              )}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <div className="font-semibold mb-2">
              Expenses preview ({filtered.fe.length})
            </div>
            <div className="max-h-60 overflow-auto text-sm divide-y">
              {filtered.fe.slice(0, 20).map((e, idx) => (
                <div
                  key={(e.id || idx) + "fe"}
                  className="py-2 flex justify-between"
                >
                  <div className="font-medium">{e.category}</div>
                  <div className="text-muted-foreground">
                    {e.date} • ₹{Number(e.amount || 0).toLocaleString()}
                  </div>
                </div>
              ))}
              {filtered.fe.length === 0 && (
                <div className="text-sm text-muted-foreground">No rows</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
