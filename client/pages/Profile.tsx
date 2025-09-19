import AppLayout from "@/components/layout/AppLayout";
import MetricCard from "@/components/MetricCard";
import { useAuth } from "@/context/AuthContext";
import { useFinance } from "@/context/FinanceContext";

export default function Profile() {
  const { user, isGuest, signOut } = useAuth();
  const { incomes, expenses, savings, reminders } = useFinance();
  const totalIncome = incomes.reduce((a,b)=>a+(Number(b.amount)||0),0);
  const totalExpenses = expenses.reduce((a,b)=>a+(Number(b.amount)||0),0);
  const savingsAmt = totalIncome - totalExpenses;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground grid place-items-center text-2xl overflow-hidden">
            {user?.photoURL ? <img src={user.photoURL} alt="avatar" className="h-full w-full object-cover"/> : (user?.displayName?.[0] ?? "F")}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user?.displayName || user?.email || (isGuest ? "Guest" : "User")}</h1>
            <p className="text-sm text-muted-foreground">{user?.email || (isGuest ? "Browsing as guest" : "")}</p>
          </div>
          <div>
            <button onClick={signOut} className="px-4 py-2 rounded-md border hover:bg-muted">Sign out</button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mt-6">
          <MetricCard title="Total Income" value={`₹${totalIncome.toLocaleString()}`} accent="green" />
          <MetricCard title="Total Expenses" value={`₹${totalExpenses.toLocaleString()}`} accent="red" />
          <MetricCard title="Savings" value={`₹${savingsAmt.toLocaleString()}`} accent={savingsAmt>=0?"green":"red"} />
          <MetricCard title="Items" value={`${incomes.length+expenses.length+savings.length+reminders.length}`} accent="amber" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <div className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold mb-2">Recent Incomes</h2>
            <div className="space-y-2">
              {incomes.slice(0,5).map((i,idx)=> (
                <div key={(i.id||idx)+"inc"} className="flex justify-between text-sm">
                  <div className="font-medium">{i.source}</div>
                  <div className="text-muted-foreground">{i.date} • ₹{Number(i.amount||0).toLocaleString()}</div>
                </div>
              ))}
              {incomes.length===0 && <div className="text-sm text-muted-foreground">No income yet.</div>}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold mb-2">Recent Expenses</h2>
            <div className="space-y-2">
              {expenses.slice(0,5).map((e,idx)=> (
                <div key={(e.id||idx)+"exp"} className="flex justify-between text-sm">
                  <div className="font-medium">{e.category}</div>
                  <div className="text-muted-foreground">{e.date} • ₹{Number(e.amount||0).toLocaleString()}</div>
                </div>
              ))}
              {expenses.length===0 && <div className="text-sm text-muted-foreground">No expenses yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
