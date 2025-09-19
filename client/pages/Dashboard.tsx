import AppLayout from "@/components/layout/AppLayout";
import MetricCard from "@/components/MetricCard";
import { PieChart, BarChart } from "@/components/charts/Charts";
import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useFinance } from "@/context/FinanceContext";

export default function Dashboard() {
  const { user } = useAuth();
  const { incomes, expenses, reminders } = useFinance();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (isFirebaseEnabled && user) {
        const svc = ensureFirebase();
        if (!svc) return;
        const { collection, getDocs, query, where } = await import("firebase/firestore");
        const incSnap = await getDocs(query(collection(svc.db, "incomes"), where("uid", "==", user.uid)));
        const expSnap = await getDocs(query(collection(svc.db, "expenses"), where("uid", "==", user.uid)));
        const remSnap = await getDocs(query(collection(svc.db, "reminders"), where("uid", "==", user.uid)));
        if (!cancelled) {
          setIncomes(incSnap.docs.map((d) => d.data() as any));
          setExpenses(expSnap.docs.map((d) => d.data() as any));
          setReminders(remSnap.docs.map((d) => d.data() as any));
        }
      } else {
        if (!cancelled) {
          setIncomes([
            { amount: 85000, source: "Job", date: new Date().toISOString() },
            { amount: 25000, source: "Freelancing", date: new Date().toISOString() },
            { amount: 8000, source: "Trading", date: new Date().toISOString() },
          ]);
          setExpenses([
            { amount: 12000, category: "Rent", date: new Date().toISOString() },
            { amount: 5000, category: "Food", date: new Date().toISOString() },
            { amount: 3000, category: "Transport", date: new Date().toISOString() },
            { amount: 4000, category: "Utilities", date: new Date().toISOString() },
          ]);
          setReminders([{ title: "Electricity Bill", dueDate: new Date(Date.now()+7*864e5).toISOString(), amount: 1500 }]);
        }
      }
    }
    load();
    return () => { cancelled = true };
  }, [user, isGuest]);

  const totals = useMemo(() => {
    const ti = incomes.reduce((a, b) => a + b.amount, 0);
    const te = expenses.reduce((a, b) => a + b.amount, 0);
    return { income: ti, expenses: te, savings: ti - te, reminders: reminders.length };
  }, [incomes, expenses, reminders]);

  const pieData = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of expenses) map.set(e.category, (map.get(e.category) || 0) + e.amount);
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const barData = useMemo(() => [{ name: "This Month", income: totals.income, expenses: totals.expenses }], [totals]);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome{user ? `, ${user.displayName ?? user.email}` : " to FinTrack"}</h1>
        <p className="text-muted-foreground mt-1">Your personalized finance dashboard</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Total Income" value={`₹${totals.income.toLocaleString()}`} accent="green" />
        <MetricCard title="Total Expenses" value={`₹${totals.expenses.toLocaleString()}`} accent="red" />
        <MetricCard title="Savings" value={`₹${totals.savings.toLocaleString()}`} accent={totals.savings >= 0 ? "green" : "red"} />
        <MetricCard title="Reminders" value={totals.reminders} accent="amber" />
      </div>
      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-4">
          <h2 className="font-semibold mb-2">Expenses by Category</h2>
          <PieChart data={pieData} />
        </div>
        <div className="rounded-xl border bg-card p-4">
          <h2 className="font-semibold mb-2">Income vs Expenses</h2>
          <BarChart data={barData} />
        </div>
      </div>
    </AppLayout>
  );
}
